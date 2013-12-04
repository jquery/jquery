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
 * @example q("main", "foo", "bar")
 * @result [<div id="main">, <span id="foo">, <input id="bar">]
 */
this.q = function() {
	var r = [],
		i = 0;

	for ( ; i < arguments.length; i++ ) {
		r.push( document.getElementById( arguments[i] ) );
	}
	return r;
};

/**
 * Asserts that a select matches the given IDs
 * @param {String} a - Assertion name
 * @param {String} b - Sizzle selector
 * @param {String} c - Array of ids to construct what is expected
 * @example t("Check for something", "//[a]", ["foo", "baar"]);
 * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'baar'
 */
this.t = function( a, b, c ) {
	var f = jQuery(b).get(),
		s = "",
		i = 0;

	for ( ; i < f.length; i++ ) {
		s += ( s && "," ) + '"' + f[ i ].id + '"';
	}

	deepEqual(f, q.apply( q, c ), a + " (" + b + ")");
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

	return jQuery.parseXML(string);
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
		xml = new ActiveXObject("msxml2.domdocument");
	} else {
		xml = document.implementation.createDocument( "", "", null );
	}

	if ( xml ) {
		frag = xml.createElement("data");
	}

	return frag;
};

fireNative = document.createEvent ?
	function( node, type ) {
		var event = document.createEvent('HTMLEvents');
		event.initEvent( type, true, true );
		node.dispatchEvent( event );
	} :
	function( node, type ) {
		var event = document.createEventObject();
		node.fireEvent( 'on' + type, event );
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
	return baseURL + value + (/\?/.test(value) ? "&" : "?") +
		new Date().getTime() + "" + parseInt(Math.random() * 100000, 10);
}

// Ajax testing helper
this.ajaxTest = function( title, expect, options ) {
	var requestOptions;
	if ( jQuery.isFunction( options ) ) {
		options = options();
	}
	options = options || [];
	requestOptions = options.requests || options.request || options;
	if ( !jQuery.isArray( requestOptions ) ) {
		requestOptions = [ requestOptions ];
	}
	asyncTest( title, expect, function() {
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
					start();
				}
			},
			requests = jQuery.map( requestOptions, function( options ) {
				var request = ( options.create || jQuery.ajax )( options ),
					callIfDefined = function( deferType, optionType ) {
						var handler = options[ deferType ] || !!options[ optionType ];
						return function( _, status ) {
							if ( !completed ) {
								if ( !handler ) {
									ok( false, "unexpected " + status );
								} else if ( jQuery.isFunction( handler ) ) {
									handler.apply( this, arguments );
								}
							}
						};
					};

				if ( options.afterSend ) {
					options.afterSend( request );
				}

				return request
					.done( callIfDefined( "done", "success" ) )
					.fail( callIfDefined( "fail", "error" ) )
					.always( complete );
			});

		ajaxTest.abort = function( reason ) {
			if ( !completed ) {
				completed = true;
				delete ajaxTest.abort;
				ok( false, "aborted " + reason );
				jQuery.each( requests, function( i, request ) {
					request.abort();
				});
			}
		};
	});
};


this.testIframe = function( fileName, name, fn ) {

	test(name, function() {
		// pause execution for now
		stop();

		// load fixture in iframe
		var iframe = loadFixture(),
			win = iframe.contentWindow,
			interval = setInterval( function() {
				if ( win && win.jQuery && win.jQuery.isReady ) {
					clearInterval( interval );
					// continue
					start();
					// call actual tests passing the correct jQuery instance to use
					fn.call( this, win.jQuery, win, win.document );
					document.body.removeChild( iframe );
					iframe = null;
				}
			}, 15 );
	});

	function loadFixture() {
		var src = url("./data/" + fileName + ".html"),
			iframe = jQuery("<iframe />").appendTo("body")[0];
			iframe.style.cssText = "width: 500px; height: 500px; position: absolute; top: -600px; left: -600px; visibility: hidden;";
		iframe.contentWindow.location = src;
		return iframe;
	}
};

this.testIframeWithCallback = function( title, fileName, func ) {

	test( title, function() {
		var iframe;

		// Expect one assertion, but allow overrides
		expect( 1 );

		stop();
		window.iframeCallback = function() {
			var self = this,
				args = arguments;
			setTimeout(function() {
				window.iframeCallback = undefined;
				iframe.remove();
				func.apply( self, args );
				func = function() {};
				start();
			}, 0 );
		};
		iframe = jQuery( "<div/>" ).css({ position: "absolute", width: "500px", left: "-600px" })
			.append( jQuery( "<iframe/>" ).attr( "src", url( "./data/" + fileName ) ) )
			.appendTo( "#qunit-fixture" );
	});
};
window.iframeCallback = undefined;

// Tests are always loaded async
QUnit.config.autostart = false;
this.loadTests = function() {
	var loadSwarm,
		url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf("swarmURL=") + "swarmURL=".length ) );
	loadSwarm = url && url.indexOf("http") === 0;

	// Get testSubproject from testrunner first
	require([ "data/testrunner.js" ], function( testSubproject ) {
		var tests = [
			"unit/core.js",
			"unit/callbacks.js",
			"unit/deferred.js",
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
		(function loadDep() {
			var dep = tests.shift();
			if ( dep ) {
				require( [ dep ], loadDep );
			} else {


				// Subproject tests must be last because they replace our test fixture
				testSubproject( "Sizzle", "../src/sizzle/test/", /^unit\/.*\.js$/, function() {
					// Call load to build module filter select element
					QUnit.load();

					/**
					 * Run in noConflict mode
					 */
					jQuery.noConflict();

					// Expose Sizzle for Sizzle's selector tests
					// We remove Sizzle's globalization in jQuery
					window.Sizzle = window.Sizzle || jQuery.find;

					// For checking globals pollution despite auto-created globals in various environments
					supportjQuery.each( [ jQuery.expando, "getInterface", "Packages", "java", "netscape" ], function( i, name ) {
						window[ name ] = window[ name ];
					});

					// Load the TestSwarm listener if swarmURL is in the address.
					if ( loadSwarm ) {
						require( [ "http://swarm.jquery.org/js/inject.js?" + (new Date()).getTime() ], function() {
							QUnit.start();
						});
					} else {
						QUnit.start();
					}
				});
			}
		})();
	});
};
