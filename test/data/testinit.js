/*jshint multistr:true, quotmark:false */

var fireNative, originaljQuery, original$,
	baseURL = "",
	supportjQuery = this.jQuery,

	// see RFC 2606
	externalHost = "example.com";

this.hasPHP = true;
this.isLocal = window.location.protocol === "file:";

// Setup global variables before loading jQuery for testing .noConflict()
supportjQuery.noConflict( true );
originaljQuery = this.jQuery = undefined;
original$ = this.$ = "replaced";

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
 * @param {String} a - Assertion name
 * @param {String} b - Sizzle selector
 * @param {String} c - Array of ids to construct what is expected
 * @example t("Check for something", "//[a]", ["foo", "bar"]);
 * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'bar'
 */
QUnit.assert.t = function( a, b, c ) {
	var f = jQuery( b ).get(),
		s = "",
		i = 0;

	for ( ; i < f.length; i++ ) {
		s += ( s && "," ) + '"' + f[ i ].id + '"';
	}

	this.deepEqual( f, q.apply( q, c ), a + " (" + b + ")" );
};

this.createDashboardXML = function() {
	var string = '<?xml version="1.0" encoding="UTF-8"?> \
	<dashboard> \
		<locations class="foo"> \
			<location for="bar" checked="different"> \
				<infowindowtab normal="ab" mixedCase="yes"> \
					<tab title="Location"><![CDATA[blabla]]></tab> \
					<tab title="Users"><![CDATA[blublu]]></tab> \
				</infowindowtab> \
			</location> \
		</locations> \
	</dashboard>';

	return jQuery.parseXML( string );
};

this.createWithFriesXML = function() {
	var string = '<?xml version="1.0" encoding="UTF-8"?> \
	<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" \
		xmlns:xsd="http://www.w3.org/2001/XMLSchema" \
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> \
		<soap:Body> \
			<jsconf xmlns="http://{{ externalHost }}/ns1"> \
				<response xmlns:ab="http://{{ externalHost }}/ns2"> \
					<meta> \
						<component id="seite1" class="component"> \
							<properties xmlns:cd="http://{{ externalHost }}/ns3"> \
								<property name="prop1"> \
									<thing /> \
									<value>1</value> \
								</property> \
								<property name="prop2"> \
									<thing att="something" /> \
								</property> \
								<foo_bar>foo</foo_bar> \
							</properties> \
						</component> \
					</meta> \
				</response> \
			</jsconf> \
		</soap:Body> \
	</soap:Envelope>';

	return jQuery.parseXML( string.replace( /\{\{\s*externalHost\s*\}\}/g, externalHost ) );
};

this.createXMLFragment = function() {
	var xml, frag;
	if ( window.ActiveXObject ) {
		xml = new ActiveXObject( "msxml2.domdocument" );
	} else {
		xml = document.implementation.createDocument( "", "", null );
	}

	if ( xml ) {
		frag = xml.createElement( "data" );
	}

	return frag;
};

fireNative = document.createEvent ?
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

this.testIframe = function( fileName, name, fn ) {
	QUnit.test( name, function( assert ) {
		var done = assert.async();

		// load fixture in iframe
		var iframe = loadFixture(),
			win = iframe.contentWindow,
			interval = setInterval( function() {
				if ( win && win.jQuery && win.jQuery.isReady ) {
					clearInterval( interval );

					// call actual tests passing the correct jQuery instance to use
					fn.call( this, win.jQuery, win, win.document, assert );
					done();
					document.body.removeChild( iframe );
					iframe = null;
				}
			}, 15 );
	} );

	function loadFixture() {
		var src = url( "./data/" + fileName + ".html" ),
			iframe = jQuery( "<iframe />" ).appendTo( "body" )[ 0 ];
			iframe.style.cssText = "width: 500px; height: 500px; position: absolute; " +
				"top: -600px; left: -600px; visibility: hidden;";

		iframe.contentWindow.location = src;
		return iframe;
	}
};

this.testIframeWithCallback = function( title, fileName, func ) {
	QUnit.test( title, 1, function( assert ) {
		var iframe;
		var done = assert.async();

		window.iframeCallback = function() {
			var args = Array.prototype.slice.call( arguments );

			args.push( assert );

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
	var loadSwarm = ( QUnit.urlParams[ "swarmURL" ] + "" ).indexOf( "http" ) === 0,
		basicTests = ( QUnit.urlParams[ "module" ] + "" ) === "basic";

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
				"unit/dimensions.js"
			];

		// Ensure load order (to preserve test numbers)
		( function loadDep() {
			var dep = tests[ i++ ];

			if ( dep ) {
				if ( !basicTests || i === 1 ) {
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
				if ( jQuery.noConflict ) {
					jQuery.noConflict();
				}

				// Load the TestSwarm listener if swarmURL is in the address.
				if ( loadSwarm ) {
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
