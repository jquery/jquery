( function() {

	"use strict";

	// Get the report ID from the URL.
	var match = location.search.match( /reportId=([^&]+)/ );
	if ( !match ) {
		return;
	}
	var id = match[ 1 ];

	// Adopted from https://github.com/douglascrockford/JSON-js
	// Support: IE 11+
	// Using the replacer argument of JSON.stringify in IE has issues
	// TODO: Replace this with a circular replacer + JSON.stringify + WeakSet
	function decycle( object ) {
		var objects = [];

		// The derez function recurses through the object, producing the deep copy.
		function derez( value ) {
			if (
				typeof value === "object" &&
				value !== null &&
				!( value instanceof Boolean ) &&
				!( value instanceof Date ) &&
				!( value instanceof Number ) &&
				!( value instanceof RegExp ) &&
				!( value instanceof String )
			) {

				// Return a string early for elements
				if ( value.nodeType ) {
					return value.toString();
				}

				if ( objects.indexOf( value ) > -1 ) {
					return;
				}

				objects.push( value );

				if ( Array.isArray( value ) ) {

					// If it is an array, replicate the array.
					return value.map( derez );
				} else {

					// If it is an object, replicate the object.
					var nu = Object.create( null );
					Object.keys( value ).forEach( function( name ) {
						nu[ name ] = derez( value[ name ] );
					} );
					return nu;
				}
			}

			// Serialize Symbols as string representations so they are
			// sent over the wire after being stringified.
			if ( typeof value === "symbol" ) {

				// We can *describe* unique symbols, but note that their identity
				// (e.g., `Symbol() !== Symbol()`) is lost
				var ctor = Symbol.keyFor( value ) !== undefined ? "Symbol.for" : "Symbol";
				return ctor + "(" + JSON.stringify( value.description ) + ")";
			}

			return value;
		}
		return derez( object );
	}

	function send( type, data ) {
		var json = JSON.stringify( {
			id: id,
			type: type,
			data: data ? decycle( data ) : undefined
		} );
		var request = new XMLHttpRequest();
		request.open( "POST", "/api/report", true );
		request.setRequestHeader( "Content-Type", "application/json" );
		request.send( json );
		return request;
	}

	// Send acknowledgement to the server.
	send( "ack" );

	QUnit.on( "testEnd", function( data ) {
		send( "testEnd", data );
	} );

	QUnit.on( "runEnd", function( data ) {

		// Reduce the payload size.
		// childSuites is large and unused.
		data.childSuites = undefined;

		var request = send( "runEnd", data );
		request.onload = function() {
			if ( request.status === 200 && request.responseText ) {
				try {
					var json = JSON.parse( request.responseText );
					window.location = json.url;
				} catch ( e ) {
					console.error( e );
				}
			}
		};
	} );
} )();
