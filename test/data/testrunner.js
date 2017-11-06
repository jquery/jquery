( function() {

// Store the old counts so that we only assert on tests that have actually leaked,
// instead of asserting every time a test has leaked sometime in the past
var oldCacheLength = 0,
	oldActive = 0,

	expectedDataKeys = {},
	splice = [].splice,
	ajaxSettings = jQuery.ajaxSettings;

/**
 * QUnit configuration
 */

// Max time for stop() and asyncTest() until it aborts test
// and start()'s the next test.
QUnit.config.testTimeout = 60e3; // 1 minute

// Enforce an "expect" argument or expect() call in all test bodies.
QUnit.config.requireExpects = true;

/**
 * @param {jQuery|HTMLElement|Object|Array} elems Target (or array of targets) for jQuery.data.
 * @param {string} key
 */
QUnit.assert.expectJqData = function( env, elems, key ) {
	var i, elem, expando;

	// As of jQuery 2.0, there will be no "cache"-data is
	// stored and managed completely below the API surface
	if ( jQuery.cache ) {
		env.checkJqData = true;

		if ( elems.jquery && elems.toArray ) {
			elems = elems.toArray();
		}
		if ( !Array.isArray( elems ) ) {
			elems = [ elems ];
		}

		for ( i = 0; i < elems.length; i++ ) {
			elem = elems[ i ];

			// jQuery.data only stores data for nodes in jQuery.cache,
			// for other data targets the data is stored in the object itself,
			// in that case we can't test that target for memory leaks.
			// But we don't have to since in that case the data will/must will
			// be available as long as the object is not garbage collected by
			// the js engine, and when it is, the data will be removed with it.
			if ( !elem.nodeType ) {

				// Fixes false positives for dataTests(window), dataTests({}).
				continue;
			}

			expando = elem[ jQuery.expando ];

			if ( expando === undefined ) {

				// In this case the element exists fine, but
				// jQuery.data (or internal data) was never (in)directly
				// called.
				// Since this method was called it means some data was
				// expected to be found, but since there is nothing, fail early
				// (instead of in teardown).
				this.notStrictEqual(
					expando,
					undefined,
					"Target for expectJqData must have an expando, " +
						"for else there can be no data to expect."
				);
			} else {
				if ( expectedDataKeys[ expando ] ) {
					expectedDataKeys[ expando ].push( key );
				} else {
					expectedDataKeys[ expando ] = [ key ];
				}
			}
		}
	}

};
QUnit.config.urlConfig.push( {
	id: "jqdata",
	label: "Always check jQuery.data",
	tooltip: "Trigger QUnit.expectJqData detection for all tests " +
		"instead of just the ones that call it"
} );

/**
 * Ensures that tests have cleaned up properly after themselves. Should be passed as the
 * teardown function on all modules' lifecycle object.
 */
window.moduleTeardown = function( assert ) {
	var i, expectedKeys, actualKeys,
		cacheLength = 0;

	// Only look for jQuery data problems if this test actually
	// provided some information to compare against.
	if ( QUnit.urlParams.jqdata || this.checkJqData ) {
		for ( i in jQuery.cache ) {
			expectedKeys = expectedDataKeys[ i ];
			actualKeys = jQuery.cache[ i ] ? Object.keys( jQuery.cache[ i ] ) : jQuery.cache[ i ];
			if ( !QUnit.equiv( expectedKeys, actualKeys ) ) {
				assert.deepEqual( actualKeys, expectedKeys, "Expected keys exist in jQuery.cache" );
			}
			delete jQuery.cache[ i ];
			delete expectedDataKeys[ i ];
		}

		// In case it was removed from cache before (or never there in the first place)
		for ( i in expectedDataKeys ) {
			assert.deepEqual(
				expectedDataKeys[ i ],
				undefined,
				"No unexpected keys were left in jQuery.cache (#" + i + ")"
			);
			delete expectedDataKeys[ i ];
		}
	}

	// Reset data register
	expectedDataKeys = {};

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

	for ( i in jQuery.cache ) {
		++cacheLength;
	}

	// Because QUnit doesn't have a mechanism for retrieving
	// the number of expected assertions for a test,
	// if we unconditionally assert any of these,
	// the test will fail with too many assertions :|
	if ( cacheLength !== oldCacheLength ) {
		assert.equal( cacheLength, oldCacheLength, "No unit tests leak memory in jQuery.cache" );
		oldCacheLength = cacheLength;
	}
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
	jQuery.event.global = {};
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
