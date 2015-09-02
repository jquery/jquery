#!/usr/bin/env node
/*
 * jQuery Release Note Generator
 */

var http = require( "http" ),
	extract = /<a href="\/ticket\/(\d+)" title="View ticket">(.*?)<[^"]+"component">\s*(\S+)/g,
	version = process.argv[ 2 ];

if ( !/^\d+\.\d+/.test( version ) ) {
	console.error( "Invalid version number: " + version );
	process.exit( 1 );
}

http.request( {
	host: "bugs.jquery.com",
	port: 80,
	method: "GET",
	path: "/query?status=closed&resolution=fixed&max=400&" +
		"component=!web&order=component&milestone=" + version
}, function( res ) {
	var data = [];

	res.on( "data", function( chunk ) {
		data.push( chunk );
	} );

	res.on( "end", function() {
		var match, cur, cat,
			file = data.join( "" );

		while ( ( match = extract.exec( file ) ) ) {
			if ( "#" + match[ 1 ] !== match[ 2 ] ) {
				cat = match[ 3 ];

				if ( !cur || cur !== cat ) {
					if ( cur ) {
						console.log( "</ul>" );
					}
					cur = cat;
					console.log(
						"<h3>" + cat.charAt( 0 ).toUpperCase() + cat.slice( 1 ) + "</h3>"
					);
					console.log( "<ul>" );
				}

				console.log(
					"  <li><a href=\"http://bugs.jquery.com/ticket/" + match[ 1 ] + "\">#" +
					match[ 1 ] + ": " + match[ 2 ] + "</a></li>"
				);
			}
		}
		if ( cur ) {
			console.log( "</ul>" );
		}

	} );
} ).end();
