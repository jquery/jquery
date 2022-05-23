QUnit.module( "ready" );

( function() {
	var notYetReady, noEarlyExecution,
		whenified = jQuery.when && jQuery.when( jQuery.ready ),
		promisified = Promise.resolve( jQuery.ready ),
		start = new Date(),
		order = [],
		args = {};

	notYetReady = !jQuery.isReady;

	QUnit.test( "jQuery.isReady", function( assert ) {
		assert.expect( 2 );

		assert.equal( notYetReady, true, "jQuery.isReady should not be true before DOM ready" );
		assert.equal( jQuery.isReady, true, "jQuery.isReady should be true once DOM is ready" );
	} );

	// Create an event handler.
	function makeHandler( testId ) {

		// When returned function is executed, push testId onto `order` array
		// to ensure execution order. Also, store event handler arg to ensure
		// the correct arg is being passed into the event handler.
		return function( arg ) {
			order.push( testId );
			args[ testId ] = arg;
		};
	}

	function throwError( num ) {

		// Not a global QUnit failure
		var onerror = window.onerror;
		window.onerror = function() {
			window.onerror = onerror;
		};

		throw new Error( "Ready error " + num );
	}

	// Bind to the ready event in every possible way.
	jQuery( makeHandler( "a" ) );
	jQuery( document ).ready( makeHandler( "b" ) );
	jQuery.ready.then( makeHandler( "c" ) );

	// Throw in some errors
	jQuery( function() {
		throwError( 1 );
	} );
	jQuery( function() {
		throwError( 2 );
	} );

	// Bind again to ensure that the errors didn't lock everything up
	jQuery( makeHandler( "d" ) );
	jQuery( document ).ready( makeHandler( "e" ) );
	jQuery.ready.then( makeHandler( "f" ) );

	noEarlyExecution = order.length === 0;

	// This assumes that QUnit tests are run on DOM ready!
	QUnit.test( "jQuery ready", function( assert ) {
		assert.expect( 10 );

		assert.ok( noEarlyExecution,
			"Handlers bound to DOM ready should not execute before DOM ready" );

		// Ensure execution order.
		assert.deepEqual( order, [ "a", "b", "c", "d", "e", "f" ],
			"Bound DOM ready handlers should execute in bind order" );

		// Ensure handler argument is correct.
		assert.equal( args.a, jQuery,
			"Argument passed to fn in jQuery( fn ) should be jQuery" );
		assert.equal( args.b, jQuery,
			"Argument passed to fn in jQuery(document).ready( fn ) should be jQuery" );

		order = [];

		// Now that the ready event has fired, again bind to the ready event.
		// These ready handlers should execute asynchronously.
		var done = assert.async();
		jQuery( makeHandler( "g" ) );
		jQuery( document ).ready( makeHandler( "h" ) );
		jQuery.ready.then( makeHandler( "i" ) );
		window.setTimeout( function() {
			assert.equal( order.shift(), "g",
				"Event handler should execute immediately, but async" );
			assert.equal( args.g, jQuery,
				"Argument passed to fn in jQuery( fn ) should be jQuery" );

			assert.equal( order.shift(), "h",
				"Event handler should execute immediately, but async" );
			assert.equal( args.h, jQuery,
				"Argument passed to fn in jQuery(document).ready( fn ) should be jQuery" );

			assert.equal( order.shift(), "i",
				"Event handler should execute immediately, but async" );
			assert.equal( args.h, jQuery,
				"Argument passed to fn in jQuery.ready.then( fn ) should be jQuery" );

			done();
		} );
	} );

	QUnit[ includesModule( "deferred" ) ? "test" : "skip" ]( "jQuery.when(jQuery.ready)", function( assert ) {
		assert.expect( 2 );
		var done = assert.async( 2 );

		whenified.then( function() {
			assert.ok( jQuery.isReady, "jQuery.when Deferred resolved" );
			done();
		} );

		jQuery.when( jQuery.ready ).then( function() {
			assert.ok( jQuery.isReady, "jQuery.when Deferred resolved" );
			done();
		} );
	} );

	QUnit.test( "Promise.resolve(jQuery.ready)", function( assert ) {
		assert.expect( 2 );
		var done = assert.async( 2 );

		promisified.then( function() {
			assert.ok( jQuery.isReady, "Native promised resolved" );
			done();
		} );

		Promise.resolve( jQuery.ready ).then( function() {
			assert.ok( jQuery.isReady, "Native promised resolved" );
			done();
		} );
	} );

	QUnit.test( "Error in ready callback does not halt all future executions (gh-1823)", function( assert ) {
		assert.expect( 1 );
		var done = assert.async();

		jQuery( function() {
			throwError( 3 );
		} );

		jQuery( function() {
			assert.ok( true, "Subsequent handler called" );
			done();
		} );
	} );

	// jQuery.holdReady is deprecated, skip the test if it was excluded.
	if ( includesModule( "deprecated" ) ) {
		testIframe(
			"holdReady test needs to be a standalone test since it deals with DOM ready",
			"readywait.html",
			function( assert, jQuery, window, document, releaseCalled ) {
				assert.expect( 2 );
				var now = new Date();
				assert.ok( now - start >= 300, "Needs to have waited at least half a second" );
				assert.ok( releaseCalled, "The release function was called, which resulted in ready" );
			}
		);
	}

} )();
