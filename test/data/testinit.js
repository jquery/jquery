/* eslint no-multi-str: "off" */

var baseURL = "",
	supportjQuery = this.jQuery,

	// see RFC 2606
	externalHost = "example.com";

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
 * @param {String} selector - Sizzle selector
 * @param {String} expectedIds - Array of ids to construct what is expected
 * @param {(String|Node)=document} context - Selector context
 * @example match("Check for something", "p", ["foo", "bar"]);
 */
function match( message, selector, expectedIds, context ) {
	var f = jQuery( selector, context ).get(),
		s = "",
		i = 0;

	for ( ; i < f.length; i++ ) {
		s += ( s && "," ) + "\"" + f[ i ].id + "\"";
	}

	this.deepEqual( f, q.apply( q, expectedIds ), message + " (" + selector + ")" );
}

/**
 * Asserts that a select matches the given IDs.
 * The select is not bound by a context.
 * @param {String} message - Assertion name
 * @param {String} selector - Sizzle selector
 * @param {String} expectedIds - Array of ids to construct what is expected
 * @example t("Check for something", "p", ["foo", "bar"]);
 */
QUnit.assert.t = function( message, selector, expectedIds ) {
	match( message, selector, expectedIds, undefined );
};

/**
 * Asserts that a select matches the given IDs.
 * The select is performed within the `#qunit-fixture` context.
 * @param {String} message - Assertion name
 * @param {String} selector - Sizzle selector
 * @param {String} expectedIds - Array of ids to construct what is expected
 * @example selectInFixture("Check for something", "p", ["foo", "bar"]);
 */
QUnit.assert.selectInFixture = function( message, selector, expectedIds ) {
	match( message, selector, expectedIds, "#qunit-fixture" );
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
			<jsconf xmlns='http://{{ externalHost }}/ns1'> \
				<response xmlns:ab='http://{{ externalHost }}/ns2'> \
					<meta> \
						<component id='seite1' class='component'> \
							<properties xmlns:cd='http://{{ externalHost }}/ns3'> \
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

	return jQuery.parseXML( string.replace( /\{\{\s*externalHost\s*\}\}/g, externalHost ) );
};

this.createXMLFragment = function() {
	var xml, frag;
	if ( window.ActiveXObject ) {
		xml = new window.ActiveXObject( "msxml2.domdocument" );
	} else {
		xml = document.implementation.createDocument( "", "", null );
	}

	if ( xml ) {
		frag = xml.createElement( "data" );
	}

	return frag;
};

window.fireNative = document.createEvent ?
	function( node, type ) {
		var event = document.createEvent( "HTMLEvents" );

		event.initEvent( type, true, true );
		node.dispatchEvent( event );
	} :
	function( node, type ) {
		node.fireEvent( "on" + type, document.createEventObject() );
	};

/**
 * Add random number to url to stop caching
 *
 * @example url("data/test.html")
 * @result "data/test.html?10538358428943"
 *
 * @example url("data/test.php?foo=bar")
 * @result "data/test.php?foo=bar&10538358345554"
 */
function url( value ) {
	return baseURL + value + ( /\?/.test( value ) ? "&" : "?" ) +
		new Date().getTime() + "" + parseInt( Math.random() * 100000, 10 );
}

// Ajax testing helper
this.ajaxTest = function( title, expect, options ) {
	QUnit.test( title, expect, function( assert ) {
		var requestOptions;

		if ( jQuery.isFunction( options ) ) {
			options = options( assert );
		}
		options = options || [];
		requestOptions = options.requests || options.request || options;
		if ( !jQuery.isArray( requestOptions ) ) {
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
								} else if ( jQuery.isFunction( handler ) ) {
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
				jQuery.each( requests, function( i, request ) {
					request.abort();
				} );
			}
		};
	} );
};

this.testIframe = function( title, fileName, func ) {
	QUnit.test( title, function( assert ) {
		var iframe;
		var done = assert.async();

		window.iframeCallback = function() {
			var args = Array.prototype.slice.call( arguments );

			args.unshift( assert );

			setTimeout( function() {
				this.iframeCallback = undefined;

				func.apply( this, args );
				func = function() {};
				iframe.remove();
				done();
			} );
		};
		iframe = jQuery( "<div/>" ).css( { position: "absolute", width: "500px", left: "-600px" } )
			.append( jQuery( "<iframe/>" ).attr( "src", url( "./data/" + fileName ) ) )
			.appendTo( "#qunit-fixture" );
	} );
};
this.iframeCallback = undefined;

// Tests are always loaded async
QUnit.config.autostart = false;
this.loadTests = function() {

	// Leverage QUnit URL parsing to detect testSwarm environment and "basic" testing mode
	QUnit.isSwarm = ( QUnit.urlParams.swarmURL + "" ).indexOf( "http" ) === 0;
	QUnit.basicTests = ( QUnit.urlParams.module + "" ) === "basic";

	// Get testSubproject from testrunner first
	require( [ "data/testrunner.js" ], function() {
		var i = 0,
			tests = [
				// A special module with basic tests, meant for
				// not fully supported environments like Android 2.3,
				// jsdom or PhantomJS. We run it everywhere, though,
				// to make sure tests are not broken.
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
					require( [ dep ], loadDep );

				// Support: Android 2.3 only
				// When running basic tests, replace other modules with dummies to avoid overloading
				// impaired clients.
				} else {
					QUnit.module( dep.replace( /^.*\/|\.js$/g, "" ) );
					loadDep();
				}

			} else {
				QUnit.load();

				/**
				 * Run in noConflict mode
				 */
				jQuery.noConflict();

				// Load the TestSwarm listener if swarmURL is in the address.
				if ( QUnit.isSwarm ) {
					require( [ "http://swarm.jquery.org/js/inject.js?" + ( new Date() ).getTime() ],
					function() {
						QUnit.start();
					} );
				} else {
					QUnit.start();
				}
			}
		} )();
	} );
};
