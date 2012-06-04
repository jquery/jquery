/**
 * Allow the test suite to run with other libs or jQuery's.
 */
jQuery.noConflict();

// Expose Sizzle for Sizzle's selector tests
// We remove Sizzle's globalization in jQuery
var Sizzle = Sizzle || jQuery.find;

/**
 * QUnit hooks
 */
(function() {
	// jQuery-specific QUnit.reset
	var reset = QUnit.reset,
		ajaxSettings = jQuery.ajaxSettings;

	QUnit.reset = function() {
		reset.apply(this, arguments);
		jQuery.event.global = {};
		jQuery.ajaxSettings = jQuery.extend({}, ajaxSettings);
	};
})();

/**
 * QUnit configuration
 */
// Max time for stop() and asyncTest() until it aborts test
// and start()'s the next test.
QUnit.config.testTimeout = 20 * 1000; // 20 seconds

/**
 * Load the TestSwarm listener if swarmURL is in the address.
 */
(function() {
	var url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf("swarmURL=") + "swarmURL=".length ) );

	if ( !url || url.indexOf("http") !== 0 ) {
		return;
	}

	// (Temporarily) Disable Ajax tests to reduce network strain
	// isLocal = QUnit.isLocal = true;

	document.write("<scr" + "ipt src='http://swarm.jquery.org/js/inject.js?" + (new Date).getTime() + "'></scr" + "ipt>");
})();
