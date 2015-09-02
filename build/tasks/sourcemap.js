var fs = require( "fs" );

module.exports = function( grunt ) {
	var minLoc = Object.keys( grunt.config( "uglify.all.files" ) )[ 0 ];
	grunt.registerTask( "remove_map_comment", function() {

		// Remove the source map comment; it causes way too many problems.
		// The map file is still generated for manual associations
		// https://github.com/jquery/jquery/issues/1707
		var text = fs.readFileSync( minLoc, "utf8" )
			.replace( /\/\/# sourceMappingURL=\S+/, "" );
		fs.writeFileSync( minLoc, text );
	} );
};
