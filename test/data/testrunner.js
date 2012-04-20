/**
 * Allow the test suite to run with other libs or jQuery's.
 */
jQuery.noConflict();

/**
 * QUnit hooks
 */
(function() {
	// Keep a copy of the original
	var ajaxSettings = jQuery.ajaxSettings;

	// Register hook
	QUnit.testDone(function() {
		jQuery.event.global = {};
		jQuery.ajaxSettings = jQuery.extend({}, ajaxSettings);
	});
})();

/**
 * QUnit configuration
 */
// Max time for stop() and asyncTest() untill it aborts test
// and start()'s the next test.
QUnit.config.testTimeout = 5 * 1000; // 5 seconds

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
