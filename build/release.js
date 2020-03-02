"use strict";

var fs = require( "fs" );

module.exports = function( Release ) {

	const distFiles = [
		"dist/jquery.js",
		"dist/jquery.min.js",
		"dist/jquery.min.map",
		"dist/jquery.slim.js",
		"dist/jquery.slim.min.js",
		"dist/jquery.slim.min.map"
	];
	const filesToCommit = [
		...distFiles,
		"src/core.js"
	];
	const cdn = require( "./release/cdn" );
	const dist = require( "./release/dist" );
	const ensureSizzle = require( "./release/ensure-sizzle" );

	const npmTags = Release.npmTags;

	Release.define( {
		npmPublish: true,
		issueTracker: "github",

		/**
		 * Ensure the repo is in a proper state before release
		 * @param {Function} callback
		 */
		checkRepoState: function( callback ) {
			ensureSizzle( Release, callback );
		},

		/**
		 * Set the version in the src folder for distributing AMD
		 */
		_setSrcVersion: function() {
			var corePath = __dirname + "/../src/core.js",
				contents = fs.readFileSync( corePath, "utf8" );
			contents = contents.replace( /@VERSION/g, Release.newVersion );
			fs.writeFileSync( corePath, contents, "utf8" );
		},

		/**
		 * Generates any release artifacts that should be included in the release.
		 * The callback must be invoked with an array of files that should be
		 * committed before creating the tag.
		 * @param {Function} callback
		 */
		generateArtifacts: function( callback ) {
			Release.exec( "grunt", "Grunt command failed" );
			Release.exec(
				"grunt custom:slim --filename=jquery.slim.js && " +
					"grunt remove_map_comment --filename=jquery.slim.js",
				"Grunt custom failed"
			);
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
		dist: function( callback ) {
			cdn.makeArchives( Release, function() {
				dist( Release, distFiles, callback );
			} );
		}
	} );
};

module.exports.dependencies = [
	"archiver@1.3.0",
	"shelljs@0.7.7",
	"inquirer@7.0.4",
	"npm@4.4.1",
	"chalk@1.1.3"
];
