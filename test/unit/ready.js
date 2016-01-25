QUnit.module( "ready" );

( function() {
	var notYetReady, noEarlyExecution,
		promisified = Promise.resolve( jQuery.ready ),
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

	// Suppress the first error
	var onerror = window.onerror;
	window.onerror = function() {
		window.onerror = onerror;
	};

	jQuery( function() {
		throw new Error( "Subsequent callbacks called after an error" );
	} );

	// Bind to the ready event in every possible way.
	jQuery( makeHandler( "a" ) );
	jQuery( document ).ready( makeHandler( "b" ) );
	jQuery.when( jQuery.ready ).done( makeHandler( "c" ) );

	// Do it twice, just to be sure.
	jQuery( makeHandler( "d" ) );
	jQuery( document ).ready( makeHandler( "e" ) );
	jQuery.when( jQuery.ready ).done( makeHandler( "f" ) );

	noEarlyExecution = order.length === 0;

	// This assumes that QUnit tests are run on DOM ready!
	QUnit.test( "jQuery ready", function( assert ) {
		assert.expect( 8 );

		assert.ok( noEarlyExecution,
			"Handlers bound to DOM ready should not execute before DOM ready" );

		// Ensure execution order.
		assert.deepEqual( order, [ "a", "b", "c", "d", "e", "f" ],
			"Bound DOM ready handlers should execute in on-order" );

		// Ensure handler argument is correct.
		assert.equal( args.a, jQuery,
			"Argument passed to fn in jQuery( fn ) should be jQuery" );
		assert.equal( args.b, jQuery,
			"Argument passed to fn in jQuery(document).ready( fn ) should be jQuery" );

		order = [];

		// Now that the ready event has fired, again bind to the ready event
		// in every possible way. These event handlers should execute immediately.
		jQuery( makeHandler( "g" ) );
		assert.equal( order.pop(), "g", "Event handler should execute immediately" );
		assert.equal( args.g, jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery" );

		jQuery( document ).ready( makeHandler( "h" ) );
		assert.equal( order.pop(), "h", "Event handler should execute immediately" );
		assert.equal( args.h, jQuery,
			"Argument passed to fn in jQuery(document).ready( fn ) should be jQuery" );
	} );

	QUnit.test( "Promise.resolve(jQuery.ready)", function( assert ) {
		assert.expect( 2 );
		var done = jQuery.map( new Array( 2 ), function() { return assert.async(); } );

		promisified.then( function() {
			assert.ok( jQuery.isReady, "Native promised resolved" );
			done.pop()();
		} );

		Promise.resolve( jQuery.ready ).then( function() {
			assert.ok( jQuery.isReady, "Native promised resolved" );
			done.pop()();
		} );
	} );

	QUnit.test( "Error in ready callback does not halt all future executions (gh-1823)", function( assert ) {
		assert.expect( 2 );

		assert.throws( function() {
			jQuery( function() {
				throw new Error( "Ready handler error" );
			} );
		}, "First ready handler throws an error" );

		jQuery( function() {
			assert.ok( true, "Subsequent handler called" );
		} );
	} );
} )();
