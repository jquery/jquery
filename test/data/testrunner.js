( function() {

"use strict";

// Store the old count so that we only assert on tests that have actually leaked,
// instead of asserting every time a test has leaked sometime in the past
var oldActive = 0,

	splice = [].splice,
	ajaxSettings = jQuery.ajaxSettings;

/**
 * QUnit configuration
 */

// Max time for done() to fire in an async test.
QUnit.config.testTimeout = 60e3; // 1 minute

// Enforce an "expect" argument or expect() call in all test bodies.
QUnit.config.requireExpects = true;

/**
 * Ensures that tests have cleaned up properly after themselves. Should be passed as the
 * teardown function on all modules' lifecycle object.
 */
window.moduleTeardown = function( assert ) {

	// Check for (and clean up, if possible) incomplete animations/requests/etc.
	if ( jQuery.timers && jQuery.timers.length !== 0 ) {
		assert.equal( jQuery.timers.length, 0, "No timers are still running" );
		splice.call( jQuery.timers, 0, jQuery.timers.length );
		jQuery.fx.stop();
	}
	if ( jQuery.active !== undefined && jQuery.active !== oldActive ) {
		assert.equal( jQuery.active, oldActive, "No AJAX requests are still active" );
		if ( ajaxTest.abort ) {
			ajaxTest.abort( "active requests" );
		}
		oldActive = jQuery.active;
	}

	Globals.cleanup();
};

QUnit.done( function() {

	// Remove our own fixtures outside #qunit-fixture
	supportjQuery( "#qunit ~ *" ).remove();
} );

QUnit.testDone( function() {

	// Ensure jQuery events and data on the fixture are properly removed
	jQuery( "#qunit-fixture" ).empty();

	// ...even if the jQuery under test has a broken .empty()
	supportjQuery( "#qunit-fixture" ).empty();

	// Remove the iframe fixture
	supportjQuery( "#qunit-fixture-iframe" ).remove();

	// Reset internal jQuery state
	if ( ajaxSettings ) {
		jQuery.ajaxSettings = jQuery.extend( true, {}, ajaxSettings );
	} else {
		delete jQuery.ajaxSettings;
	}

	// Cleanup globals
	Globals.cleanup();
} );

// Register globals for cleanup and the cleanup code itself
window.Globals = ( function() {
	var globals = {};

	return {
		register: function( name ) {
			window[ name ] = globals[ name ] = true;
		},

		cleanup: function() {
			var name;

			for ( name in globals ) {
				delete window[ name ];
			}

			globals = {};
		}
	};
} )();

} )();
