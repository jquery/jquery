QUnit.module( "ready" );

( function() {
	var notYetReady, noEarlyExecution,
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

	// Bind to the ready event in every possible way.
	jQuery( makeHandler( "a" ) );
	jQuery( document ).ready( makeHandler( "b" ) );

	// Do it twice, just to be sure.
	jQuery( makeHandler( "c" ) );
	jQuery( document ).ready( makeHandler( "d" ) );

	noEarlyExecution = order.length === 0;

	// This assumes that QUnit tests are run on DOM ready!
	QUnit.test( "jQuery ready", function( assert ) {
		assert.expect( 8 );

		assert.ok( noEarlyExecution,
			"Handlers bound to DOM ready should not execute before DOM ready" );

		// Ensure execution order.
		assert.deepEqual( order, [ "a", "b", "c", "d" ],
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

} )();
