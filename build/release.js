
module.exports = function( Release ) {

	var
		files = [ "dist/jquery.js", "dist/jquery.min.js", "dist/jquery.min.map" ],
		cdn = require( "./release/cdn" ),
		dist = require( "./release/dist" ),
		ensureSizzle = require( "./release/ensure-sizzle" ),

		npmTags = Release.npmTags;

	Release.define({
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
		 * Generates any release artifacts that should be included in the release.
		 * The callback must be invoked with an array of files that should be
		 * committed before creating the tag.
		 * @param {Function} callback
		 */
		/**
		 * Publish to distribution repo and npm
		 * @param {Function} callback
		 */
		dist: function( callback ) {
			cdn.makeArchives( Release, function() {
				dist( Release, callback );
			});
		}
	});
};

module.exports.dependencies = [
	"archiver@0.14.2",
	"shelljs@0.2.6",
	"npm@2.3.0"
];
