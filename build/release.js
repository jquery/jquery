/*
 * jQuery Core Release Management
 */
var shell = require("shelljs");
var semver = require("semver");

module.exports = function(grunt) {
	var devFile = "dist/jquery.js",
		minFile = "dist/jquery.min.js",
		mapFile = "dist/jquery.min.map",

		releaseFiles = {
			"jquery-VER.js": devFile,
			"jquery-VER.min.js": minFile,
			"jquery-VER.min.map": mapFile
// Disable these until 2.0 defeats 1.9 as the ONE TRUE JQUERY,
//		"jquery.js": devFile,
//		"jquery.min.js": minFile,
//		"jquery.min.map": mapFile,
//		"jquery-latest.js": devFile,
//		"jquery-latest.min.js": minFile,
//		"jquery-latest.min.map": mapFile
		},

		jQueryFilesCDN = [
		],

		otherCDNs = {
			googlecdn: {
				files: [
					"jquery.js",
					"jquery.min.js",
					"jquery.min.map"
				]
			},
			mscdn: {
				files: [
					"jquery-VER.js",
					"jquery-VER.min.js",
					"jquery-VER.min.map"
				]
			}
		};

	grunt.registerTask("release", "jQuery Core Release Management", function(subtask) {
		if (!subtask) {
			grunt.fail.fatal("Task requires subtask to be passed.");
		}

		var options = this.options({
				file: "package.json",
				skipGit: false,
				skipRemote: false,
				scpURL: "jqadmin@code.origin.jquery.com:/var/www/html/code.jquery.com/",
				cdnURL: "http://code.origin.jquery.com/",
				gitRepo: "git@github.com:jquery/jquery.git"
			}),
			passedSemver = grunt.option("semver") || "patch",
			skipGit = grunt.option("skip-git") || options.skipGit || false,
			skipRemote = grunt.option("skip-remote") || options.skipRemote || false,
			tagName = grunt.config.getRaw("release.options.tagName") || "<%= version %>",
			releaseMessage = grunt.config.getRaw("release.options.releaseMessage") || "Tagging the <%= version %> release.",
			nextMessage = grunt.config.getRaw("release.options.nextMessage") || "Updating the source version to <%= version %>",
			pkgObj = {},
			releaseVersion,
			nextVersion,
			isBetaRelease = false,
			templateOptions = {
				data: {}
			};

		grunt.verbose.writeflags({
			"semver": passedSemver,
			"skipGit": skipGit,
			"skipRemote": skipRemote
		});

		setup();

		if (subtask === "preflight") {
			if (skipGit === false) {
				checkGitStatus();
			}

			grunt.config.set("pkg.version", releaseVersion);
		} else if (subtask === "core") {
			bumpVersion();

			if (skipGit === false) {
				gitAdd();
				gitCommit();
				gitTag();
			}

			makeReleaseCopies();

			bumpVersionNext();

			if (skipGit === false) {
				gitCommitNext();
			}

			if (!isBetaRelease) {
				prepForCDNs();
			}

			if (skipRemote === false) {
				copyTojQueryCDN();

				if (skipGit === false) {
					gitPushGithub();
				}
			}
		}

		function run(cmd, msg) {
			var result = shell.exec(cmd, {silent:true});

			if (msg && result.code === 0) {
				if (msg.length > 0) {
					grunt.log.ok(msg);
				} else {
					grunt.log.oklns(result.output);
				}
			} else {
				grunt.fail.fatal(result.output);
			}

			return result;
		}

		function checkGitStatus() {
			var status = run("git status");

			if (/Changes to be committed/i.test(status.output)) {
				grunt.fail.fatal("Please commit changed files before attemping to push a release.");
			}

			if (/Changes not staged for commit/i.test(status.output)) {
				grunt.fail.fatal("Please commit changed files before attemping to push a release.");
			}
		}

		function setup() {
			var pkg = grunt.file.readJSON(options.file),
				semverKeywords = ["major", "minor", "patch", "build"],
				semverIncrement = (semverKeywords.indexOf(passedSemver) !== -1),
				parsedVersion;

			if (semverIncrement) {
				releaseVersion = semver.inc(pkg.version, passedSemver);
			} else if (semver.valid(passedSemver)) {
				parsedVersion = semver.parse(passedSemver);

				if (parsedVersion[5] === "-pre") {
					grunt.fail.fatal("Pre-release versions can't be published!");
				}

				if (semver.lt(passedSemver, pkg.version)) {
					grunt.fail.fatal("Release version is older than current version!");
				}

				releaseVersion = passedSemver;
				isBetaRelease = !!parsedVersion[5];
			} else {
				grunt.fail.fatal("Release version doesn't conform to semver standards!");
			}

			nextVersion = semver.inc(releaseVersion, "patch") + "-pre";
			pkgObj = pkg;
		}

		function bumpVersion() {
			pkgObj.version = releaseVersion;
			grunt.file.write(options.file, JSON.stringify(pkgObj, null, "	") + "\n");
			grunt.log.ok("Release version bumped to " + releaseVersion);
		}

		function bumpVersionNext() {
			pkgObj.version = nextVersion;
			grunt.file.write(options.file, JSON.stringify(pkgObj, null, "	") + "\n");
			grunt.log.ok("Source version bumped to " + nextVersion);
		}

		function makeReleaseCopies() {
			var builtFile,
				releaseFile;

			Object.keys(releaseFiles).forEach(function(key) {
				builtFile = releaseFiles[key],
				releaseFile = "dist/" + key.replace(/VER/g, releaseVersion);

				if (!isBetaRelease || key.indexOf("VER") >= 0) {
					if (/\.map$/.test(releaseFile)) {
						// Map files need to reference the new uncompressed name;
						// assume that all files reside in the same directory.
						// "file":"jquery.min.js","sources":["jquery.js"]
						grunt.file.copy(builtFile, releaseFile, {
							process: function(contents) {
								contents = contents.replace(/"file":"([^"]+)","sources":\["([^"]+)"\]/,
								"\"file\":\"" + releaseFile.replace(/\.min\.map/, ".min.js") +
								"\",\"sources\":[\"" + releaseFile.replace(/\.min\.map/, ".js") + "\"]");

								return contents;
							}
						});
					} else if (/\.min\.js$/.test(releaseFile)) {
						// Minified files point back to the corresponding map;
						// again assume one big happy directory.
						// "//@ sourceMappingURL=jquery.min.map"
						grunt.file.copy(builtFile, releaseFile, {
							process: function(contents) {
								contents = contents.replace(/\/\/@ sourceMappingURL=\S+/,
								"//@ sourceMappingURL=" + releaseFile.replace(/\.js$/, ".map"));

								return contents;
							}
						});
					} else if (builtFile !== releaseFile) {
						grunt.file.copy(builtFile, releaseFile);
					}

					jQueryFilesCDN.push(releaseFile);
				}
			});
		}

		function copyTojQueryCDN() {
			jQueryFilesCDN.forEach(function(name) {
				run("scp " + name + " " + options.scpURL, true);
				run("curl " + options.cdnURL +  name + "?reload", true);
			});
		}

		function prepForCDNs() {
			var taskList = [],
				cdnData,
				cdnFiles;

			Object.keys(otherCDNs).forEach(function(cdn) {
				cdnData = otherCDNs[cdn];
				cdnFiles = [];

				cdnData.files.forEach(function(file, index) {
					cdnFiles[index] = file.replace(/VER/g, releaseVersion);
				});

				grunt.config.set("compress.rls" + cdn, {
					options: {
						archive: "dist/" + cdn + "-jquery-" + releaseVersion + ".zip"
					},
					files: [
						{ expand: true, cwd: "dist", src: cdnFiles }
					]
				});

				taskList.push("compress:rls" + cdn);
			});

			grunt.task.run(taskList);
		}

		function gitAdd() {
			run("git add " + options.file);
		}

		function gitCommit() {
			templateOptions.data.version = releaseVersion;
			var message = grunt.template.process(releaseMessage, templateOptions);
			run("git commit " + options.file + " -m " + "\"" + message + "\"", options.file + " committed");
		}

		function gitCommitNext() {
			templateOptions.data.version = nextVersion;
			var message = grunt.template.process(nextMessage, templateOptions);
			run("git commit " + options.file + " -m " + "\"" + message + "\"", options.file + " committed");
		}

		function gitTag() {
			var name = grunt.template.process(tagName, templateOptions);
			run("git tag " + name, "New git tag created: " + name);
		}

		function gitPushGithub() {
			run("git push --tags " + options.gitRepo, true);
		}
	});
};