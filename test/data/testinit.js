/* eslint no-multi-str: "off" */
"use strict";

var parentUrl = window.location.protocol + "//" + window.location.host,

	// baseURL is intentionally set to "data/" instead of "".
	// This is not just for convenience (since most files are in data/)
	// but also to ensure that urls without prefix fail.
	baseURL = parentUrl + "/test/data/",
	supportjQuery = this.jQuery,

	// NOTE: keep it in sync with build/tasks/lib/slim-exclude.js
	excludedFromSlim = [
		"ajax",
		"callbacks",
		"deferred",
		"effects",
		"queue"
	];

// see RFC 2606
this.externalHost = "releases.jquery.com";
this.hasPHP = true;
this.isLocal = window.location.protocol === "file:";

// Setup global variables before loading jQuery for testing .noConflict()
supportjQuery.noConflict( true );
window.originaljQuery = this.jQuery = undefined;
window.original$ = this.$ = "replaced";

/**
 * Returns an array of elements with the given IDs
 * @example q( "main", "foo", "bar" )
 * @result [<div id="main">, <span id="foo">, <input id="bar">]
 */
this.q = function() {
	var r = [],
		i = 0;

	for ( ; i < arguments.length; i++ ) {
		r.push( document.getElementById( arguments[ i ] ) );
	}
	return r;
};

/**
 * Asserts that a select matches the given IDs
 * @param {String} message - Assertion name
 * @param {String} selector - jQuery selector
 * @param {String} expectedIds - Array of ids to construct what is expected
 * @param {(String|Node)=document} context - Selector context
 * @example match("Check for something", "p", ["foo", "bar"]);
 */
function match( message, selector, expectedIds, context, assert ) {
	var elems = jQuery( selector, context ).get();

	assert.deepEqual( elems, q.apply( q, expectedIds ), message + " (" + selector + ")" );
}

/**
 * Asserts that a select matches the given IDs.
 * The select is not bound by a context.
 * @param {String} message - Assertion name
 * @param {String} selector - jQuery selector
 * @param {String} expectedIds - Array of ids to construct what is expected
 * @example t("Check for something", "p", ["foo", "bar"]);
 */
QUnit.assert.t = function( message, selector, expectedIds ) {
	match( message, selector, expectedIds, undefined, QUnit.assert );
};

/**
 * Asserts that a select matches the given IDs.
 * The select is performed within the `#qunit-fixture` context.
 * @param {String} message - Assertion name
 * @param {String} selector - jQuery selector
 * @param {String} expectedIds - Array of ids to construct what is expected
 * @example selectInFixture("Check for something", "p", ["foo", "bar"]);
 */
QUnit.assert.selectInFixture = function( message, selector, expectedIds ) {
	match( message, selector, expectedIds, "#qunit-fixture", QUnit.assert );
};

this.createDashboardXML = function() {
	var string = "<?xml version='1.0' encoding='UTF-8'?> \
	<dashboard> \
		<locations class='foo'> \
			<location for='bar' checked='different'> \
				<infowindowtab normal='ab' mixedCase='yes'> \
					<tab title='Location'><![CDATA[blabla]]></tab> \
					<tab title='Users'><![CDATA[blublu]]></tab> \
				</infowindowtab> \
			</location> \
		</locations> \
	</dashboard>";

	return jQuery.parseXML( string );
};

this.createWithFriesXML = function() {
	var string = "<?xml version='1.0' encoding='UTF-8'?> \
	<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' \
		xmlns:xsd='http://www.w3.org/2001/XMLSchema' \
		xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'> \
		<soap:Body> \
			<jsconf xmlns='http://www.example.com/ns1'> \
				<response xmlns:ab='http://www.example.com/ns2'> \
					<meta> \
						<component id='seite1' class='component'> \
							<properties xmlns:cd='http://www.example.com/ns3'> \
								<property name='prop1'> \
									<thing /> \
									<value>1</value> \
								</property> \
								<property name='prop2'> \
									<thing att='something' /> \
								</property> \
								<foo_bar>foo</foo_bar> \
							</properties> \
						</component> \
					</meta> \
				</response> \
			</jsconf> \
		</soap:Body> \
	</soap:Envelope>";

	return jQuery.parseXML( string );
};

this.createXMLFragment = function() {
	var frag,
		xml = document.implementation.createDocument( "", "", null );

	if ( xml ) {
		frag = xml.createElement( "data" );
	}

	return frag;
};

window.fireNative = function( node, type ) {
	var event = document.createEvent( "HTMLEvents" );

	event.initEvent( type, true, true );
	node.dispatchEvent( event );
};

/**
 * Add random number to url to stop caching
 *
 * Also prefixes with baseURL automatically.
 *
 * @example url("index.html")
 * @result "data/index.html?10538358428943"
 *
 * @example url("mock.php?foo=bar")
 * @result "data/mock.php?foo=bar&10538358345554"
 */
function url( value ) {
	return baseURL + value + ( /\?/.test( value ) ? "&" : "?" ) +
		new Date().getTime() + "" + parseInt( Math.random() * 100000, 10 );
}

// Ajax testing helper
this.ajaxTest = function( title, expect, options, wrapper ) {
	if ( !wrapper ) {
		wrapper = QUnit.test;
	}
	wrapper.call( QUnit, title, function( assert ) {
		assert.expect( expect );
		var requestOptions;

		if ( typeof options === "function" ) {
			options = options( assert );
		}
		options = options || [];
		requestOptions = options.requests || options.request || options;
		if ( !Array.isArray( requestOptions ) ) {
			requestOptions = [ requestOptions ];
		}

		var done = assert.async();

		if ( options.setup ) {
			options.setup();
		}

		var completed = false,
			remaining = requestOptions.length,
			complete = function() {
				if ( !completed && --remaining === 0 ) {
					completed = true;
					delete ajaxTest.abort;
					if ( options.teardown ) {
						options.teardown();
					}

					// Make sure all events will be called before done()
					setTimeout( done );
				}
			},
			requests = jQuery.map( requestOptions, function( options ) {
				var request = ( options.create || jQuery.ajax )( options ),
					callIfDefined = function( deferType, optionType ) {
						var handler = options[ deferType ] || !!options[ optionType ];
						return function( _, status ) {
							if ( !completed ) {
								if ( !handler ) {
									assert.ok( false, "unexpected " + status );
								} else if ( typeof handler === "function" ) {
									handler.apply( this, arguments );
								}
							}
						};
					};

				if ( options.afterSend ) {
					options.afterSend( request, assert );
				}

				return request
					.done( callIfDefined( "done", "success" ) )
					.fail( callIfDefined( "fail", "error" ) )
					.always( complete );
			} );

		ajaxTest.abort = function( reason ) {
			if ( !completed ) {
				completed = true;
				delete ajaxTest.abort;
				assert.ok( false, "aborted " + reason );
				jQuery.each( requests, function( _i, request ) {
					request.abort();
				} );
			}
		};
	} );
};

this.testIframe = function( title, fileName, func, wrapper, iframeStyles ) {
	if ( !wrapper ) {
		wrapper = QUnit.test;
	}
	wrapper.call( QUnit, title, function( assert ) {
		var done = assert.async(),
			$iframe = supportjQuery( "<iframe></iframe>" )
				.css( { position: "absolute", top: "0", left: "-600px", width: "500px" } )
				.attr( { id: "qunit-fixture-iframe", src: url( fileName ) } );

		// Add other iframe styles
		if ( iframeStyles ) {
			$iframe.css( iframeStyles );
		}

		// Test iframes are expected to invoke this via startIframeTest (cf. iframeTest.js)
		window.iframeCallback = function() {
			var args = Array.prototype.slice.call( arguments );

			args.unshift( assert );

			setTimeout( function() {
				var result;

				this.iframeCallback = undefined;

				result = func.apply( this, args );

				function finish() {
					func = function() {};
					$iframe.remove();
					done();
				}

				// Wait for promises returned by `func`.
				if ( result && result.then ) {
					result.then( finish );
				} else {
					finish();
				}
			} );
		};

		// Attach iframe to the body for visibility-dependent code
		// It will be removed by either the above code, or the testDone callback in testrunner.js
		$iframe.prependTo( document.body );
	} );
};
this.iframeCallback = undefined;

QUnit.config.autostart = false;

// Leverage QUnit URL parsing to detect "basic" testing mode
QUnit.basicTests = ( QUnit.urlParams.module + "" ) === "basic";

// Support: IE 11+
// A variable to make it easier to skip specific tests in IE, mostly
// testing integrations with newer Web features not supported by it.
QUnit.isIE = !!window.document.documentMode;
QUnit.testUnlessIE = QUnit.isIE ? QUnit.skip : QUnit.test;

// Returns whether a particular module like "ajax" or "deprecated"
// is included in the current jQuery build; it handles the slim build
// as well. The util was created so that we don't treat presence of
// particular APIs to decide whether to run a test as then if we
// accidentally remove an API, the tests would still not fail.
this.includesModule = function( moduleName ) {

	var excludedModulesPart, excludedModules;

	// A short-cut for the slim build, e.g. "4.0.0-pre+slim"
	if ( jQuery.fn.jquery.indexOf( "+slim" ) > -1 ) {

		// The module is included if it does NOT exist on the list
		// of modules excluded in the slim build
		return excludedFromSlim.indexOf( moduleName ) === -1;
	}

	// example version for `npm run build -- -e deprecated`:
	// "v4.0.0-pre+14dc9347 -deprecated,-deprecated/ajax-event-alias,-deprecated/event"
	excludedModulesPart = jQuery.fn.jquery

		// Take the flags out of the version string.
		// Example: "-deprecated,-deprecated/ajax-event-alias,-deprecated/event"
		.split( " " )[ 1 ];

	if ( !excludedModulesPart ) {

		// No build part => the full build where everything is included.
		return true;
	}

	excludedModules = excludedModulesPart

		// Turn to an array.
		// Example: [ "-deprecated", "-deprecated/ajax-event-alias", "-deprecated/event" ]
		.split( "," )

		// Remove the leading "-".
		// Example: [ "deprecated", "deprecated/ajax-event-alias", "deprecated/event" ]
		.map( function( moduleName ) {
			return moduleName.slice( 1 );
		} )

		// Filter out deep names - ones that contain a slash.
		// Example: [ "deprecated" ]
		.filter( function( moduleName ) {
			return moduleName.indexOf( "/" ) === -1;
		} );

	return excludedModules.indexOf( moduleName ) === -1;
};

this.loadTests = function() {

	// QUnit.config is populated from QUnit.urlParams but only at the beginning
	// of the test run. We need to read both.
	var esmodules = QUnit.config.esmodules || QUnit.urlParams.esmodules;
	var jsdom = QUnit.config.jsdom || QUnit.urlParams.jsdom;

	if ( jsdom ) {

		// JSDOM doesn't implement scrollTo
		QUnit.config.scrolltop = false;
	}

	// Directly load tests that need evaluation before DOMContentLoaded.
	if ( !jsdom && ( !esmodules || document.readyState === "loading" ) ) {
		document.write( "<script src='" + parentUrl + "/test/unit/ready.js'><\x2Fscript>" );
	} else {
		QUnit.module( "ready", function() {
			QUnit.skip( "jQuery ready tests skipped in async mode", function() {} );
		} );
	}

	// Get testSubproject from testrunner first
	require( [ parentUrl + "/test/data/testrunner.js" ], function() {

		// Says whether jQuery positional selector extensions are supported.
		// A full selector engine is required to support them as they need to
		// be evaluated left-to-right. Remove that property when support for
		// positional selectors is dropped.
		QUnit.jQuerySelectorsPos = includesModule( "selector" );

		// Says whether jQuery selector extensions are supported. Change that
		// to `false` if your custom jQuery versions relies more on native qSA.
		// This doesn't include support for positional selectors (see above).
		QUnit.jQuerySelectors = includesModule( "selector" );

		var i = 0,
			tests = [

				// A special module with basic tests, meant for not fully
				// supported environments like jsdom. We run it everywhere,
				// though, to make sure tests are not broken.
				"unit/basic.js",

				"unit/core.js",
				"unit/callbacks.js",
				"unit/deferred.js",
				"unit/deprecated.js",
				"unit/support.js",
				"unit/data.js",
				"unit/queue.js",
				"unit/attributes.js",
				"unit/event.js",
				"unit/selector.js",
				"unit/traversing.js",
				"unit/manipulation.js",
				"unit/wrap.js",
				"unit/css.js",
				"unit/serialize.js",
				"unit/ajax.js",
				"unit/effects.js",
				"unit/offset.js",
				"unit/dimensions.js",
				"unit/animation.js",
				"unit/tween.js"
			];

		// Ensure load order (to preserve test numbers)
		( function loadDep() {
			var dep = tests[ i++ ];

			if ( dep ) {
				if ( !QUnit.basicTests || i === 1 ) {
					require( [ parentUrl + "/test/" + dep ], loadDep );

				// When running basic tests, replace other modules with dummies to avoid overloading
				// impaired clients.
				} else {
					QUnit.module( dep.replace( /^.*\/|\.js$/g, "" ) );
					loadDep();
				}

			} else {

				/**
				 * Run in noConflict mode
				 */
				jQuery.noConflict();

				QUnit.start();
			}
		} )();
	} );
};
