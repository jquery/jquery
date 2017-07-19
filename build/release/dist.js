module.exports = function( Release, files, complete ) {

	var
		fs = require( "fs" ),
		shell = require( "shelljs" ),
		pkg = require( Release.dir.repo + "/package.json" ),
		distRemote = Release.remote

			// For local and github dists
			.replace( /jquery(\.git|$)/, "jquery-dist$1" ),

		// These files are included with the distribution
		extras = [
			"src",
			"LICENSE.txt",
			"AUTHORS.txt",
			"package.json"
		];

	/**
	 * Clone the distribution repo
	 */
	function clone() {
		Release.chdir( Release.dir.base );
		Release.dir.dist = Release.dir.base + "/dist";

		console.log( "Using distribution repo: ", distRemote );
		Release.exec( "git clone " + distRemote + " " + Release.dir.dist,
			"Error cloning repo." );

		// Distribution always works on master
		Release.chdir( Release.dir.dist );
		Release.exec( "git checkout master", "Error checking out branch." );
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
	 */
	function editReadme( readme ) {
		var rprev = new RegExp( Release.prevVersion, "g" );
		return readme.replace( rprev, Release.newVersion );
	}

	/**
	 * Copy necessary files over to the dist repo
	 */
	function copy() {

		// Copy dist files
		var distFolder = Release.dir.dist + "/dist",
			externalFolder = Release.dir.dist + "/external",
			readme = fs.readFileSync( Release.dir.dist + "/README.md", "utf8" ),
			rmIgnore = files
				.concat( [
					"README.md",
					"node_modules"
				] )
				.map( function( file ) {
					return Release.dir.dist + "/" + file;
				} );

		shell.config.globOptions = {
			ignore: rmIgnore
		};

		// Remove extraneous files before copy
		shell.rm( "-rf", Release.dir.dist + "/**/*" );

		shell.mkdir( "-p", distFolder );
		files.forEach( function( file ) {
			shell.cp( "-f", Release.dir.repo + "/" + file, distFolder );
		} );

		// Copy Sizzle
		shell.mkdir( "-p", externalFolder );
		shell.cp( "-rf", Release.dir.repo + "/external/sizzle", externalFolder );

		// Copy other files
		extras.forEach( function( file ) {
			shell.cp( "-rf", Release.dir.repo + "/" + file, Release.dir.dist );
		} );

		// Remove the wrapper from the dist repo
		shell.rm( "-f", Release.dir.dist + "/src/wrapper.js" );

		// Write generated bower file
		fs.writeFileSync( Release.dir.dist + "/bower.json", generateBower() );

		fs.writeFileSync( Release.dir.dist + "/README.md", editReadme( readme ) );

		console.log( "Files ready to add." );
		console.log( "Edit the dist README.md to include the latest blog post link." );
	}

	/**
	 * Add, commit, and tag the dist files
	 */
	function commit() {
		console.log( "Adding files to dist..." );
		Release.exec( "git add -A", "Error adding files." );
		Release.exec(
			"git commit -m \"Release " + Release.newVersion + "\"",
			"Error committing files."
		);
		console.log();

		console.log( "Tagging release on dist..." );
		Release.exec( "git tag " + Release.newVersion,
			"Error tagging " + Release.newVersion + " on dist repo." );
		Release.tagTime = Release.exec( "git log -1 --format=\"%ad\"",
			"Error getting tag timestamp." ).trim();
	}

	/**
	 * Push files to dist repo
	 */
	function push() {
		Release.chdir( Release.dir.dist );

		console.log( "Pushing release to dist repo..." );
		Release.exec( "git push " + distRemote + " master --tags",
			"Error pushing master and tags to git repo." );

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
