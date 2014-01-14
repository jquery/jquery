define(function() {

// Allow subprojects to test against their own fixtures
var oldStart = window.start,
	qunitModule = QUnit.module,
	qunitTest = QUnit.test,
	// Store the old counts so that we only assert on tests that have actually leaked,
	// instead of asserting every time a test has leaked sometime in the past
	oldCacheLength = 0,
	oldActive = 0,

	expectedDataKeys = {},
  reset,
	splice = [].splice,
	ajaxSettings = jQuery.ajaxSettings;


/**
 * QUnit configuration
 */

// Max time for stop() and asyncTest() until it aborts test
// and start()'s the next test.
QUnit.config.testTimeout = 20 * 1000; // 20 seconds

// Enforce an "expect" argument or expect() call in all test bodies.
QUnit.config.requireExpects = true;

/**
 * QUnit hooks
 */

// Sandbox start for great justice
window.start = function() {
	oldStart();
};

function keys(o) {
	var ret, key;
	if ( Object.keys ) {
		ret = Object.keys( o );
	} else {
		ret = [];
		for ( key in o ) {
			ret.push( key );
		}
	}
	ret.sort();
	return ret;
}

/**
 * @param {jQuery|HTMLElement|Object|Array} elems Target (or array of targets) for jQuery.data.
 * @param {string} key
 */
QUnit.expectJqData = function( elems, key ) {
	var i, elem, expando;

	// As of jQuery 2.0, there will be no "cache"-data is
	// stored and managed completely below the API surface
	if ( jQuery.cache ) {
		QUnit.current_testEnvironment.checkJqData = true;

		if ( elems.jquery && elems.toArray ) {
			elems = elems.toArray();
		}
		if ( !supportjQuery.isArray( elems ) ) {
			elems = [ elems ];
		}

		for ( i = 0; i < elems.length; i++ ) {
			elem = elems[i];

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
				notStrictEqual( expando, undefined, "Target for expectJqData must have an expando, for else there can be no data to expect." );
			} else {
				if ( expectedDataKeys[expando] ) {
					expectedDataKeys[expando].push( key );
				} else {
					expectedDataKeys[expando] = [ key ];
				}
			}
		}
	}

};
QUnit.config.urlConfig.push({
	id: "jqdata",
	label: "Always check jQuery.data",
	tooltip: "Trigger QUnit.expectJqData detection for all tests instead of just the ones that call it"
});

/**
 * Ensures that tests have cleaned up properly after themselves. Should be passed as the
 * teardown function on all modules' lifecycle object.
 */
window.moduleTeardown = function() {
	var i,
		expectedKeys, actualKeys,
		cacheLength = 0;

	// Only look for jQuery data problems if this test actually
	// provided some information to compare against.
	if ( QUnit.urlParams.jqdata || this.checkJqData ) {
		for ( i in jQuery.cache ) {
			expectedKeys = expectedDataKeys[i];
			actualKeys = jQuery.cache[i] ? keys( jQuery.cache[i] ) : jQuery.cache[i];
			if ( !QUnit.equiv( expectedKeys, actualKeys ) ) {
				deepEqual( actualKeys, expectedKeys, "Expected keys exist in jQuery.cache" );
			}
			delete jQuery.cache[i];
			delete expectedDataKeys[i];
		}
		// In case it was removed from cache before (or never there in the first place)
		for ( i in expectedDataKeys ) {
			deepEqual( expectedDataKeys[i], undefined, "No unexpected keys were left in jQuery.cache (#" + i + ")" );
			delete expectedDataKeys[i];
		}
	}

	// Reset data register
	expectedDataKeys = {};

	// Check for (and clean up, if possible) incomplete animations/requests/etc.
	if ( jQuery.timers && jQuery.timers.length !== 0 ) {
		equal( jQuery.timers.length, 0, "No timers are still running" );
		splice.call( jQuery.timers, 0, jQuery.timers.length );
		jQuery.fx.stop();
	}
	if ( jQuery.active !== undefined && jQuery.active !== oldActive ) {
		equal( jQuery.active, oldActive, "No AJAX requests are still active" );
		if ( ajaxTest.abort ) {
			ajaxTest.abort("active requests");
		}
		oldActive = jQuery.active;
	}


	for ( i in jQuery.cache ) {
		++cacheLength;
	}

	// Because QUnit doesn't have a mechanism for retrieving the number of expected assertions for a test,
	// if we unconditionally assert any of these, the test will fail with too many assertions :|
	if ( cacheLength !== oldCacheLength ) {
		equal( cacheLength, oldCacheLength, "No unit tests leak memory in jQuery.cache" );
		oldCacheLength = cacheLength;
	}
};

QUnit.done(function() {
	// Remove our own fixtures outside #qunit-fixture
	supportjQuery("#qunit ~ *").remove();
});

// jQuery-specific post-test cleanup
reset = function () {

	// Ensure jQuery events and data on the fixture are properly removed
	jQuery("#qunit-fixture").empty();
	// ...even if the jQuery under test has a broken .empty()
	supportjQuery("#qunit-fixture").empty();

	// Reset internal jQuery state
	jQuery.event.global = {};
	if ( ajaxSettings ) {
		jQuery.ajaxSettings = jQuery.extend( true, {}, ajaxSettings );
	} else {
		delete jQuery.ajaxSettings;
	}

	// Cleanup globals
	Globals.cleanup();
	jQuery("#qunit-fixture")[0].innerHTML = QUnit.config.fixture;
};

QUnit.testDone(reset);

// Register globals for cleanup and the cleanup code itself
// Explanation at http://perfectionkills.com/understanding-delete/#ie_bugs
window.Globals = (function() {
	var globals = {};
	return {
		register: function( name ) {
			globals[ name ] = true;
			supportjQuery.globalEval( "var " + name + " = undefined;" );
		},
		cleanup: function() {
			var name,
				current = globals;
			globals = {};
			for ( name in current ) {
				supportjQuery.globalEval( "try { " +
					"delete " + ( supportjQuery.support.deleteExpando ? "window['" + name + "']" : name ) +
				"; } catch( x ) {}" );
			}
		}
	};
})();

/**
 * Test a subproject with its own fixture
 * @param {String} label Project name
 * @param {String} url Test folder location
 * @param {RegExp} risTests To filter script sources
 */
function testSubproject( label, subProjectURL, risTests, complete ) {
	var sub, fixture, fixtureHTML,
		fixtureReplaced = false;

	// Don't let subproject tests jump the gun
	QUnit.config.reorder = false;

	// Create module
	module( label );

	// Duckpunch QUnit
	// TODO restore parent fixture on teardown to support reordering
	module = QUnit.module = function( name ) {
		var args = arguments;

		// Remember subproject-scoped module name
		sub = name;

		// Override
		args[0] = label;
		return qunitModule.apply( this, args );
	};
	test = function( name ) {
		var args = arguments,
			i = args.length - 1;

		// Prepend subproject-scoped module name to test name
		args[0] = sub + ": " + name;

		// Find test function and wrap to require subproject fixture
		for ( ; i >= 0; i-- ) {
			if ( supportjQuery.isFunction( args[i] ) ) {
				args[i] = requireFixture( args[i] );
				break;
			}
		}

		return qunitTest.apply( this, args );
	};

	// Load tests and fixture from subproject
	// Test order matters, so we must be synchronous and throw an error on load failure
	supportjQuery.ajax( subProjectURL, {
		async: false,
		dataType: "html",
		error: function( jqXHR, status ) {
			throw new Error( "Could not load: " + subProjectURL + " (" + status + ")" );
		},
		success: function( data, status, jqXHR ) {
			var sources = [],
				page = supportjQuery.parseHTML(
				// replace html/head with dummy elements so they are represented in the DOM
				( data || "" ).replace( /<\/?((!DOCTYPE|html|head)\b.*?)>/gi, "[$1]" ),
				document,
				true
			);

			if ( !page || !page.length ) {
				this.error( jqXHR, "no data" );
			}
			page = supportjQuery( page );

			// Include subproject tests
			page.filter("script[src]").add( page.find("script[src]") ).map(function() {
				var src = supportjQuery( this ).attr("src");
				if ( risTests.test( src ) ) {
					sources.push( src );
				}
			});

			// Ensure load order
			(function loadDep() {
				var dep = sources.shift();
				if ( dep ) {
					require( [ subProjectURL + dep ], loadDep );
				} else if ( complete ) {
					complete();
				}
			})();

			// Get the fixture, including content outside of #qunit-fixture
			fixture = page.find("[id='qunit-fixture']");
			fixtureHTML = fixture.html();
			fixture.empty();
			while ( fixture.length && !fixture.prevAll("[id='qunit']").length ) {
				fixture = fixture.parent();
			}
			fixture = fixture.add( fixture.nextAll() );
		}
	});

	function requireFixture( fn ) {
		return function() {
			if ( !fixtureReplaced ) {
				// Make sure that we retrieved a fixture for the subproject
				if ( !fixture.length ) {
					ok( false, "Found subproject fixture" );
					return;
				}

				// Update helper function behavior
				baseURL = subProjectURL;

				// Replace the current fixture, including content outside of #qunit-fixture
				var oldFixture = supportjQuery("#qunit-fixture");
				while ( oldFixture.length && !oldFixture.prevAll("[id='qunit']").length ) {
					oldFixture = oldFixture.parent();
				}
				oldFixture.nextAll().remove();
				oldFixture.replaceWith( fixture );

				// WARNING: UNDOCUMENTED INTERFACE
				QUnit.config.fixture = fixtureHTML;
        reset();
				if ( supportjQuery("#qunit-fixture").html() !== fixtureHTML ) {
					ok( false, "Copied subproject fixture" );
					return;
				}
				fixtureReplaced = true;
			}

			fn.apply( this, arguments );
		};
	}
}

return testSubproject;

});
