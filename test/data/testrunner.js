/**
 * Allow the test suite to run with other libs or jQuery's.
 */
jQuery.noConflict();

// For checking globals pollution despite auto-created globals in various environments
jQuery.each( [ jQuery.expando, "getInterface", "Packages", "java", "netscape" ], function( i, name ) {
	window[ name ] = window[ name ];
});

// Expose Sizzle for Sizzle's selector tests
// We remove Sizzle's globalization in jQuery
var Sizzle = Sizzle || jQuery.find,

// Allow subprojects to test against their own fixtures
	qunitModule = QUnit.module,
	qunitTest = QUnit.test;

this.testSubproject = function( label, url, risTests ) {
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
			if ( originaljQuery.isFunction( args[i] ) ) {
				args[i] = requireFixture( args[i] );
				break;
			}
		}

		return qunitTest.apply( this, args );
	};

	// Load tests and fixture from subproject
	// Test order matters, so we must be synchronous and throw an error on load failure
	originaljQuery.ajax( url, {
		async: false,
		dataType: "html",
		error: function( jqXHR, status ) {
			throw new Error( "Could not load: " + url + " (" + status + ")" );
		},
		success: function( data, status, jqXHR ) {
			var page = originaljQuery.parseHTML(
				// replace html/head with dummy elements so they are represented in the DOM
				( data || "" ).replace( /<\/?((!DOCTYPE|html|head)\b.*?)>/gi, "[$1]" ),
				document,
				true
			);

			if ( !page || !page.length ) {
				this.error( jqXHR, "no data" );
			}
			page = originaljQuery( page );

			// Include subproject tests
			page.filter("script[src]").add( page.find("script[src]") ).each(function() {
				var src = originaljQuery( this ).attr("src"),
					html = "<script src='" + url + src + "'></script>";
				if ( risTests.test( src ) ) {
					if ( originaljQuery.isReady ) {
						originaljQuery("head").first().append( html );
					} else {
						document.write( html );
					}
				}
			});

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

				// Replace the current fixture, including content outside of #qunit-fixture
				var oldFixture = originaljQuery("#qunit-fixture");
				while ( oldFixture.length && !oldFixture.prevAll("[id='qunit']").length ) {
					oldFixture = oldFixture.parent();
				}
				oldFixture.nextAll().remove();
				oldFixture.replaceWith( fixture );

				// WARNING: UNDOCUMENTED INTERFACE
				QUnit.config.fixture = fixtureHTML;
				QUnit.reset();
				if ( originaljQuery("#qunit-fixture").html() !== fixtureHTML ) {
					ok( false, "Copied subproject fixture" );
					return;
				}

				fixtureReplaced = true;
			}

			fn.apply( this, arguments );
		};
	}
};

// Register globals for cleanup and the cleanup code itself
// Explanation at http://perfectionkills.com/understanding-delete/#ie_bugs
this.Globals = (function() {
	var globals = {};
	return {
		register: function( name ) {
			globals[ name ] = true;
			jQuery.globalEval( "var " + name + " = undefined;" );
		},
		cleanup: function() {
			var name,
				current = globals;
			globals = {};
			for ( name in current ) {
				jQuery.globalEval( "try { " +
					"delete " + ( jQuery.support.deleteExpando ? "window['" + name + "']" : name ) +
				"; } catch( x ) {}" );
			}
		}
	};
})();

// Sandbox start for great justice
(function() {
	var oldStart = window.start;
	window.start = function() {
		oldStart();
	};
})();

/**
 * QUnit hooks
 */
(function() {
	// Store the old counts so that we only assert on tests that have actually leaked,
	// instead of asserting every time a test has leaked sometime in the past
	var oldCacheLength = 0,
		oldFragmentsLength = 0,
		oldActive = 0,

		expectedDataKeys = {},

		splice = [].splice,
		reset = QUnit.reset,
		ajaxSettings = jQuery.ajaxSettings;

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
		QUnit.current_testEnvironment.checkJqData = true;

		if ( elems.jquery && elems.toArray ) {
			elems = elems.toArray();
		}
		if ( !jQuery.isArray( elems ) ) {
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
	};
	QUnit.config.urlConfig.push( {
		id: "jqdata",
		label: "Always check jQuery.data",
		tooltip: "Trigger QUnit.expectJqData detection for all tests instead of just the ones that call it"
	} );

	/**
	 * Ensures that tests have cleaned up properly after themselves. Should be passed as the
	 * teardown function on all modules' lifecycle object.
	 */
	this.moduleTeardown = function() {
		var i,
			expectedKeys, actualKeys,
			fragmentsLength = 0,
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

		// Allow QUnit.reset to clean up any attached elements before checking for leaks
		QUnit.reset();

		for ( i in jQuery.cache ) {
			++cacheLength;
		}

		jQuery.fragments = {};

		for ( i in jQuery.fragments ) {
			++fragmentsLength;
		}

		// Because QUnit doesn't have a mechanism for retrieving the number of expected assertions for a test,
		// if we unconditionally assert any of these, the test will fail with too many assertions :|
		if ( cacheLength !== oldCacheLength ) {
			equal( cacheLength, oldCacheLength, "No unit tests leak memory in jQuery.cache" );
			oldCacheLength = cacheLength;
		}
		if ( fragmentsLength !== oldFragmentsLength ) {
			equal( fragmentsLength, oldFragmentsLength, "No unit tests leak memory in jQuery.fragments" );
			oldFragmentsLength = fragmentsLength;
		}
	};

	QUnit.done(function() {
		// Remove our own fixtures outside #qunit-fixture
		jQuery("#qunit ~ *").remove();
	});

	// jQuery-specific QUnit.reset
	QUnit.reset = function() {

		// Ensure jQuery events and data on the fixture are properly removed
		jQuery("#qunit-fixture").empty();

		// Reset internal jQuery state
		jQuery.event.global = {};
		if ( ajaxSettings ) {
			jQuery.ajaxSettings = jQuery.extend( true, {}, ajaxSettings );
		} else {
			delete jQuery.ajaxSettings;
		}

		// Cleanup globals
		Globals.cleanup();

		// Let QUnit reset the fixture
		reset.apply( this, arguments );
	};
})();

/**
 * QUnit configuration
 */
// Max time for stop() and asyncTest() until it aborts test
// and start()'s the next test.
QUnit.config.testTimeout = 20 * 1000; // 20 seconds

// Enforce an "expect" argument or expect() call in all test bodies.
QUnit.config.requireExpects = true;

/**
 * Load the TestSwarm listener if swarmURL is in the address.
 */
(function() {
	var url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf("swarmURL=") + "swarmURL=".length ) );

	if ( !url || url.indexOf("http") !== 0 ) {
		return;
	}

	document.write("<scr" + "ipt src='http://swarm.jquery.org/js/inject.js?" + (new Date()).getTime() + "'></scr" + "ipt>");
})();
