"use strict";

const fs = require( "node:fs" );

module.exports = function( Release ) {

	const distFiles = [
		"dist/jquery.js",
		"dist/jquery.min.js",
		"dist/jquery.min.map",
		"dist/jquery.slim.js",
		"dist/jquery.slim.min.js",
		"dist/jquery.slim.min.map",
		"dist/jquery.factory.js",
		"dist/jquery.factory.slim.js",
		"dist-module/jquery.module.js",
		"dist-module/jquery.module.min.js",
		"dist-module/jquery.module.min.map",
		"dist-module/jquery.slim.module.js",
		"dist-module/jquery.slim.module.min.js",
		"dist-module/jquery.slim.module.min.map",
		"dist-module/jquery.factory.module.js",
		"dist-module/jquery.factory.slim.module.js"
	];
	const filesToCommit = [
		...distFiles,
		"src/core.js"
	];
	const cdn = require( "./release/cdn" );
	const dist = require( "./release/dist" );
	const { buildDefaultFiles } = require( "./tasks/build" );

	const npmTags = Release.npmTags;

	function setSrcVersion( filepath ) {
		var contents = fs.readFileSync( filepath, "utf8" );
		contents = contents.replace( /@VERSION/g, Release.newVersion );
		fs.writeFileSync( filepath, contents, "utf8" );
	}

	Release.define( {
		npmPublish: true,
		issueTracker: "github",

		// Update cdn location to versioned files
		cdnPublish: "dist/cdn/versioned",

		/**
		 * Set the version in the src folder for distributing ES modules.
		 */
		_setSrcVersion: function() {
			setSrcVersion( `${ __dirname }/../src/core.js` );
		},

		/**
		 * Generates any release artifacts that should be included in the release.
		 * The callback must be invoked with an array of files that should be
		 * committed before creating the tag.
		 * @param {Function} callback
		 */
		generateArtifacts: async function( callback ) {
			await buildDefaultFiles( { version: Release.newVersion } );

			cdn.makeReleaseCopies( Release );
			Release._setSrcVersion();
			callback( filesToCommit );
		},

		/**
		 * Acts as insertion point for restoring Release.dir.repo
		 * It was changed to reuse npm publish code in jquery-release
		 * for publishing the distribution repo instead
		 */
		npmTags: function() {

			// origRepo is not defined if dist was skipped
			Release.dir.repo = Release.dir.origRepo || Release.dir.repo;
			return npmTags();
		},

		/**
		 * Publish to distribution repo and npm
		 * @param {Function} callback
		 */
		dist: async function( callback ) {
			await cdn.makeArchives( Release );
			dist( Release, distFiles, callback );
		}
	} );
};

module.exports.dependencies = [
	"archiver@5.2.0",
	"shelljs@0.8.4",
	"inquirer@8.0.0"
];
