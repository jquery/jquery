module.exports = function( grunt ) {

	"use strict";

	var fs = require( "fs" );

	// Work around grunt-contrib-uglify sourceMap issues (jQuery #13776)
	grunt.registerMultiTask( "pre-uglify", function() {
		var banner = this.options().banner;

		this.files.forEach(function( mapping ) {
			// Join src
			var input = mapping.src.map(function( file ) {
				var contents = grunt.file.read( file );

				// Strip banners
				return contents
					// Remove the main jQuery banner, it'll be replaced by the new banner anyway.
					.replace( /^\/\*![\W\w]*?\*\/\n?/g, "" )
					// Strip other banners preserving line count.
					.replace( /^\/\*!(?:.|\n)*?\*\/\n?/gm, function( match ) {
						return match.replace( /[^\n]/gm, "" );
					});
			}).join( "\n" );

			// Write temp file (with optional banner)
			grunt.file.write( mapping.dest, ( banner || "" ) + input );
		});
	});

	// Change the map file to point back to jquery.js instead of jquery.pre-min.js.
	// The problem is caused by the pre-uglify task.
	grunt.registerMultiTask( "post-uglify", function() {
		this.files.forEach(function( mapping ) {
			mapping.src.forEach( function( src ) {
				// Refer to the source jquery.js, not the temporary jquery.pre-min.js.
				grunt.file.write( src, grunt.file.read( src ).replace( /\.pre-min\./g, "." ) );
			});
		});

		// Remove temporary files.
		this.options().tempFiles.forEach(function( fileName ) {
			fs.unlink( fileName );
		});
	});
};
