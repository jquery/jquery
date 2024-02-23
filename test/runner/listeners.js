( function() {

	// Get the report ID from the URL.
	var match = location.search.match( /reportId=([^&]+)/ );
	if ( !match ) {
		return;
	}
	var id = match[ 1 ];

	// Adopted from https://github.com/douglascrockford/JSON-js
	// Support: IE 11
	// Using the replacer argument of JSON.stringify in IE has issues
	// TODO: Replace this with a circular replacer + JSON.stringify + WeakSet
	function decycle( object ) {
		var objects = [];

		// The derez function recurses through the object, producing the deep copy.
		return ( function derez( value ) {
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
					var nu = {};
					Object.keys( value ).forEach( function( name ) {
						nu[ name ] = derez( value[ name ] );
					} );
					return nu;
				}
			}
			return value;
		} )( object );
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

		send( "runEnd", data );
	} );
} )();
