"use strict";

module.exports = function( Release, files, complete ) {

	const fs = require( "node:fs/promises" );
	const shell = require( "shelljs" );
	const inquirer = require( "inquirer" );
	const pkg = require( `${ Release.dir.repo }/package.json` );
	const distRemote = Release.remote

		// For local and github dists
		.replace( /jquery(\.git|$)/, "jquery-dist$1" );

	// These files are included with the distribution
	const extras = [
		"src",
		"LICENSE.txt",
		"AUTHORS.txt",
		"dist/package.json",
		"dist/jquery.bundler-require-wrapper.js",
		"dist/jquery.bundler-require-wrapper.slim.js",
		"dist-module/package.json",
		"dist-module/jquery.node-module-wrapper.js",
		"dist-module/jquery.node-module-wrapper.slim.js"
	];

	/**
	 * Clone the distribution repo
	 */
	function clone() {
		Release.chdir( Release.dir.base );
		Release.dir.dist = `${ Release.dir.base }/dist`;

		console.log( "Using distribution repo: ", distRemote );
		Release.exec( `git clone ${ distRemote } ${ Release.dir.dist }`,
			"Error cloning repo." );

		// Distribution always works on main
		Release.chdir( Release.dir.dist );
		Release.exec( "git checkout main", "Error checking out branch." );
		console.log();
	}

	/**
	 * Generate bower file for jquery-dist
	 */
	function generateBower() {
		return JSON.stringify( {
			name: pkg.name,
			main: pkg.main,
			license: "MIT",
			ignore: [
				"package.json"
			],
			keywords: pkg.keywords
		}, null, 2 );
	}

	/**
	 * Replace the version in the README
	 * @param {string} readme
	 * @param {string} blogPostLink
	 */
	function editReadme( readme, blogPostLink ) {
		return readme
			.replace( /@VERSION/g, Release.newVersion )
			.replace( /@BLOG_POST_LINK/g, blogPostLink );
	}

	/**
	 * Copy necessary files over to the dist repo
	 */
	async function copy() {
		const readme = await fs.readFile(
			`${ Release.dir.repo }/build/fixtures/README.md`, "utf8" );
		const rmIgnore = [ ...files, "node_modules" ]
			.map( file => `${ Release.dir.dist }/${ file }` );

		shell.config.globOptions = {
			ignore: rmIgnore
		};

		const { blogPostLink } = await inquirer.prompt( [ {
			type: "input",
			name: "blogPostLink",
			message: "Enter URL of the blog post announcing the jQuery release...\n"
		} ] );

		// Remove extraneous files before copy
		shell.rm( "-rf", `${ Release.dir.dist }/**/*` );

		// Copy dist files
		shell.mkdir( "-p", `${ Release.dir.dist }/dist` );
		shell.mkdir( "-p", `${ Release.dir.dist }/dist-module` );
		files.forEach( function( file ) {
			shell.cp(
				"-f",
				`${ Release.dir.repo }/${ file }`,
				`${ Release.dir.dist }/${ file }`
			);
		} );

		// Copy other files
		extras.forEach( function( file ) {
			shell.cp(
				"-rf",
				`${ Release.dir.repo }/${ file }`,
				`${ Release.dir.dist }/${ file }`
			);
		} );

		// Remove the wrapper & the ESLint config from the dist repo
		shell.rm( "-f", `${ Release.dir.dist }/src/wrapper.js` );
		shell.rm( "-f", `${ Release.dir.dist }/src/.eslintrc.json` );

		// Write package.json
		// Remove scripts and other superfluous properties,
		// especially the prepare script, which fails on the dist repo
		const packageJson = Object.assign( {}, pkg );
		delete packageJson.scripts;
		delete packageJson.devDependencies;
		delete packageJson.dependencies;
		delete packageJson.commitplease;
		packageJson.version = Release.newVersion;
		await fs.writeFile(
			`${ Release.dir.dist }/package.json`,
			JSON.stringify( packageJson, null, 2 )
		);

		// Write generated bower file
		await fs.writeFile( `${ Release.dir.dist }/bower.json`, generateBower() );

		await fs.writeFile( `${ Release.dir.dist }/README.md`,
			editReadme( readme, blogPostLink ) );

		console.log( "Files ready to add." );
	}

	/**
	 * Add, commit, and tag the dist files
	 */
	function commit() {
		console.log( "Adding files to dist..." );
		Release.exec( "git add -A", "Error adding files." );
		Release.exec(
			`git commit -m "Release ${ Release.newVersion }"`,
			"Error committing files."
		);
		console.log();

		console.log( "Tagging release on dist..." );
		Release.exec( `git tag ${ Release.newVersion }`,
			`Error tagging ${ Release.newVersion } on dist repo.` );
		Release.tagTime = Release.exec( "git log -1 --format=\"%ad\"",
			"Error getting tag timestamp." ).trim();
	}

	/**
	 * Push files to dist repo
	 */
	function push() {
		Release.chdir( Release.dir.dist );

		console.log( "Pushing release to dist repo..." );
		Release.exec(
			`git push ${
				Release.isTest ? " --dry-run" : ""
			} ${ distRemote } main --tags`,
			"Error pushing main and tags to git repo."
		);

		// Set repo for npm publish
		Release.dir.origRepo = Release.dir.repo;
		Release.dir.repo = Release.dir.dist;
	}

	Release.walk( [
		Release._section( "Copy files to distribution repo" ),
		clone,
		copy,
		Release.confirmReview,

		Release._section( "Add, commit, and tag files in distribution repo" ),
		commit,
		Release.confirmReview,

		Release._section( "Pushing files to distribution repo" ),
		push
	], complete );
};
