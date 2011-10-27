#! /usr/bin/env node

var fs = require( "fs" );

function isEmptyObject( obj ) {
	for ( var name in obj ) {
		return false;
	}
	return true;
}
function extend( obj ) {
	var dest = obj,
	src = [].slice.call( arguments, 1 );

	Object.keys( src ).forEach(function( key ) {
		var copy = src[ key ];

		for ( var prop in copy ) {
			dest[ prop ] = copy[ prop ];
		}
	});

	return dest;
};

function charSort( obj, callback ) {

	var ordered = [],
		table = {},
		copied;

	copied = extend({}, obj );

	(function order() {

		var largest = 0,
				c;

		for ( var i in obj ) {
			if ( obj[ i ] >= largest ) {
				largest = obj[ i ];
				c = i;
			}
		}

		ordered.push( c );
		delete obj[ c ];

		if ( !isEmptyObject( obj ) ) {
			order();
		} else {
			ordered.forEach(function( val ) {
				table[ val ] = copied[ val ];
			});

			callback( table );
		}

	})();
}
function charFrequency( src, callback ) {
	var obj = {};

	src.replace(/[^\w]|\d/gi, "").split("").forEach(function( c ) {
		obj[ c ] ? ++obj[ c ] : ( obj[ c ] = 1 );
	});

	return charSort( obj, callback );
}


charFrequency( fs.readFileSync( "dist/jquery.min.js", "utf8" ), function( obj ) {
	var chr;

	for ( chr in obj ) {
		console.log( "  " + chr + "   " + obj[ chr ] );
	}
});

