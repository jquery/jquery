"use strict";

var fs = require( "fs" );

module.exports = function( grunt ) {
	var config = grunt.config( "uglify.all.files" );
	grunt.registerTask( "remove_map_comment", function() {
		var minLoc = grunt.config.process( Object.keys( config )[ 0 ] );

		// Remove the source map comment; it causes way too many problems.
		// The map file is still generated for manual associations
		// https://github.com/jquery/jquery/issues/1707
		var text = fs.readFileSync( minLoc, "utf8" )
			.replace( /\/\/# sourceMappingURL=\S+/, "" );
		fs.writeFileSync( minLoc, text );
	} );
};
