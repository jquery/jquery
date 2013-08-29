module("event");

(function(){
	var notYetReady, noEarlyExecution,
		order = [],
		args = {};

	notYetReady = !jQuery.isReady;

	test("jQuery.isReady", function() {
		expect(2);

		equal(notYetReady, true, "jQuery.isReady should not be true before DOM ready");
		equal(jQuery.isReady, true, "jQuery.isReady should be true once DOM is ready");
	});

	// Create an event handler.
	function makeHandler( testId ) {
		// When returned function is executed, push testId onto `order` array
		// to ensure execution order. Also, store event handler arg to ensure
		// the correct arg is being passed into the event handler.
		return function( arg ) {
			order.push(testId);
			args[testId] = arg;
		};
	}

	// Bind to the ready event in every possible way.
	jQuery(makeHandler("a"));
	jQuery(document).ready(makeHandler("b"));
	jQuery(document).on("ready.readytest", makeHandler("c"));

	// Do it twice, just to be sure.
	jQuery(makeHandler("d"));
	jQuery(document).ready(makeHandler("e"));
	jQuery(document).on("ready.readytest", makeHandler("f"));

	noEarlyExecution = order.length === 0;

	// This assumes that QUnit tests are run on DOM ready!
	test("jQuery ready", function() {
		expect(10);

		ok(noEarlyExecution, "Handlers bound to DOM ready should not execute before DOM ready");

		// Ensure execution order.
		deepEqual(order, ["a", "b", "d", "e", "c", "f"], "Bound DOM ready handlers should execute in on-order, but those bound with jQuery(document).on( 'ready', fn ) will always execute last");

		// Ensure handler argument is correct.
		equal(args["a"], jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery");
		equal(args["b"], jQuery, "Argument passed to fn in jQuery(document).ready( fn ) should be jQuery");
		ok(args["c"] instanceof jQuery.Event, "Argument passed to fn in jQuery(document).on( 'ready', fn ) should be an event object");

		order = [];

		// Now that the ready event has fired, again bind to the ready event
		// in every possible way. These event handlers should execute immediately.
		jQuery(makeHandler("g"));
		equal(order.pop(), "g", "Event handler should execute immediately");
		equal(args["g"], jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery");

		jQuery(document).ready(makeHandler("h"));
		equal(order.pop(), "h", "Event handler should execute immediately");
		equal(args["h"], jQuery, "Argument passed to fn in jQuery(document).ready( fn ) should be jQuery");

		jQuery(document).on("ready.readytest", makeHandler("never"));
		equal(order.length, 0, "Event handler should never execute since DOM ready has already passed");

		// Cleanup.
		jQuery(document).off("ready.readytest");
	});

})();
