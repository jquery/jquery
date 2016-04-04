var isoldIE = /msie [876]\.0/i.test( window.navigator.userAgent );

QUnit.module( "ajax", {
	setup: function() {
		if ( !isoldIE ) {
			return;
		}

		var jsonpCallback = this.jsonpCallback = jQuery.ajaxSettings.jsonpCallback;
		jQuery.ajaxSettings.jsonpCallback = function() {
			var callback = jsonpCallback.apply( this, arguments );
			Globals.register( callback );
			return callback;
		};
	},
	teardown: function() {
		jQuery( document ).off( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError ajaxSuccess" );
		moduleTeardown.apply( this, arguments );
	}
} );

( function() {
	QUnit.test( "Unit Testing Environment", function( assert ) {
		assert.expect( 2 );

		assert.ok( hasPHP, "Running in an environment with PHP support. The AJAX tests only run if the environment supports PHP!" );
		assert.ok( !isLocal, "Unit tests are not ran from file:// (especially in Chrome. If you must test from file:// with Chrome, run it with the --allow-file-access-from-files flag!)" );
	} );

	if ( !jQuery.ajax || ( isLocal && !hasPHP ) ) {
		return;
	}

	function addGlobalEvents( expected, assert ) {
		return function() {
			expected = expected || "";
			jQuery( document ).on( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError ajaxSuccess", function( e ) {
				assert.ok( expected.indexOf( e.type ) !== -1, e.type );
			} );
		};
	}

//----------- jQuery.ajax()

	testIframeWithCallback(
		"XMLHttpRequest - Attempt to block tests because of dangling XHR requests (IE)",
		"ajax/unreleasedXHR.html",
		function( assert ) {
			assert.expect( 1 );
			assert.ok( true, "done" );
		}
	);

	ajaxTest( "jQuery.ajax() - success callbacks", 8, function( assert ) {
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess", assert ),
			url: url( "data/name.html" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			success: function() {
				assert.ok( true, "success" );
			},
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - success callbacks - (url, options) syntax", 8, function( assert ) {
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess", assert ),
			create: function( options ) {
				return jQuery.ajax( url( "data/name.html" ), options );
			},
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			success: function() {
				assert.ok( true, "success" );
			},
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - success callbacks (late binding)", 8, function( assert ) {
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess", assert ),
			url: url( "data/name.html" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			success: true,
			afterSend: function( request ) {
				request.always( function() {
					assert.ok( true, "complete" );
				} ).done( function() {
					assert.ok( true, "success" );
				} ).fail( function() {
					assert.ok( false, "error" );
				} );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - success callbacks (oncomplete binding)", 8, function( assert ) {
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess", assert ),
			url: url( "data/name.html" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			success: true,
			complete: function( xhr ) {
				xhr.always( function() {
					assert.ok( true, "complete" );
				} ).done( function() {
					assert.ok( true, "success" );
				} ).fail( function() {
					assert.ok( false, "error" );
				} );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - error callbacks", 8, function( assert ) {
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError", assert ),
			url: url( "data/name.php?wait=5" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			afterSend: function( request ) {
				request.abort();
			},
			error: function() {
				assert.ok( true, "error" );
			},
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - textStatus and errorThrown values", 4, function( assert ) {
		return [ {
			url: url( "data/name.php?wait=5" ),
			error: function( _, textStatus, errorThrown ) {
				assert.strictEqual( textStatus, "abort", "textStatus is 'abort' for abort" );
				assert.strictEqual( errorThrown, "abort", "errorThrown is 'abort' for abort" );
			},
			afterSend: function( request ) {
				request.abort();
			}
		},
		{
			url: url( "data/name.php?wait=5" ),
			error: function( _, textStatus, errorThrown ) {
				assert.strictEqual( textStatus, "mystatus", "textStatus is 'mystatus' for abort('mystatus')" );
				assert.strictEqual( errorThrown, "mystatus", "errorThrown is 'mystatus' for abort('mystatus')" );
			},
			afterSend: function( request ) {
				request.abort( "mystatus" );
			}
		} ];
	} );

	ajaxTest( "jQuery.ajax() - responseText on error", 1, function( assert ) {
		return {
			url: url( "data/errorWithText.php" ),
			error: function( xhr ) {
				assert.strictEqual( xhr.responseText, "plain text message", "Test jqXHR.responseText is filled for HTTP errors" );
			}
		};
	} );

	QUnit.asyncTest( "jQuery.ajax() - retry with jQuery.ajax( this )", 2, function( assert ) {
		var previousUrl,
			firstTime = true;
		jQuery.ajax( {
			url: url( "data/errorWithText.php" ),
			error: function() {
				if ( firstTime ) {
					firstTime = false;
					jQuery.ajax( this );
				} else {
					assert.ok( true, "Test retrying with jQuery.ajax(this) works" );
					jQuery.ajax( {
						url: url( "data/errorWithText.php" ),
						data: {
							"x": 1
						},
						beforeSend: function() {
							if ( !previousUrl ) {
								previousUrl = this.url;
							} else {
								assert.strictEqual( this.url, previousUrl, "url parameters are not re-appended" );
								QUnit.start();
								return false;
							}
						},
						error: function() {
							jQuery.ajax( this );
						}
					} );
				}
			}
		} );
	} );

	ajaxTest( "jQuery.ajax() - headers", 5, function( assert ) {
		return {
			setup: function() {
				jQuery( document ).ajaxSend( function( evt, xhr ) {
					xhr.setRequestHeader( "ajax-send", "test" );
				} );
			},
			url: url( "data/headers.php?keys=siMPle_SometHing-elsE_OthEr_Nullable_undefined_Empty_ajax-send" ),
			headers: {
				"siMPle": "value",
				"SometHing-elsE": "other value",
				"OthEr": "something else",
				"Nullable": null,
				"undefined": undefined

				// Support: Firefox
				// Not all browsers allow empty-string headers
				// https://bugzilla.mozilla.org/show_bug.cgi?id=815299
				//"Empty": ""
			},
			success: function( data, _, xhr ) {
				var i, emptyHeader,
					requestHeaders = jQuery.extend( this.headers, {
						"ajax-send": "test"
					} ),
					tmp = [];
				for ( i in requestHeaders ) {
					tmp.push( i, ": ", requestHeaders[ i ] + "", "\n" );
				}
				tmp = tmp.join( "" );

				assert.strictEqual( data, tmp, "Headers were sent" );
				assert.strictEqual( xhr.getResponseHeader( "Sample-Header" ), "Hello World", "Sample header received" );
				assert.ok( data.indexOf( "undefined" ) < 0, "Undefined header value was not sent" );

				emptyHeader = xhr.getResponseHeader( "Empty-Header" );
				if ( emptyHeader === null ) {
					assert.ok( true, "Firefox doesn't support empty headers" );
				} else {
					assert.strictEqual( emptyHeader, "", "Empty header received" );
				}
				assert.strictEqual( xhr.getResponseHeader( "Sample-Header2" ), "Hello World 2", "Second sample header received" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - Accept header", 1, function( assert ) {
		return {
			url: url( "data/headers.php?keys=accept" ),
			headers: {
				Accept: "very wrong accept value"
			},
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( "Accept", "*/*" );
			},
			success: function( data ) {
				assert.strictEqual( data, "accept: */*\n", "Test Accept header is set to last value provided" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - contentType", 2, function( assert ) {
		return [
			{
				url: url( "data/headers.php?keys=content-type" ),
				contentType: "test",
				success: function( data ) {
					assert.strictEqual( data, "content-type: test\n", "Test content-type is sent when options.contentType is set" );
				}
			},
			{
				url: url( "data/headers.php?keys=content-type" ),
				contentType: false,
				success: function( data ) {

					// Some server/interpreter combinations always supply a Content-Type to scripts
					data = data || "content-type: \n";
					assert.strictEqual( data, "content-type: \n", "Test content-type is not set when options.contentType===false" );
				}
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - protocol-less urls", 1, function( assert ) {
		return {
			url: "//somedomain.com",
			beforeSend: function( xhr, settings ) {
				assert.equal( settings.url, location.protocol + "//somedomain.com", "Make sure that the protocol is added." );
				return false;
			},
			error: true
		};
	} );

	ajaxTest( "jQuery.ajax() - hash", 3, function( assert ) {
		return [
			{
				url: "data/name.html#foo",
				beforeSend: function( xhr, settings ) {
					assert.equal( settings.url, "data/name.html", "Make sure that the URL is trimmed." );
					return false;
				},
				error: true
			},
			{
				url: "data/name.html?abc#foo",
				beforeSend: function( xhr, settings ) {
					assert.equal( settings.url, "data/name.html?abc", "Make sure that the URL is trimmed." );
					return false;
				},
				error: true
			},
			{
				url: "data/name.html?abc#foo",
				data: {
					"test": 123
				},
				beforeSend: function( xhr, settings ) {
					assert.equal( settings.url, "data/name.html?abc&test=123", "Make sure that the URL is trimmed." );
					return false;
				},
				error: true
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - cross-domain detection", 7, function( assert ) {
		function request( url, title, crossDomainOrOptions ) {
			return jQuery.extend( {
				dataType: "jsonp",
				url: url,
				beforeSend: function( _, s ) {
					assert.ok( crossDomainOrOptions === false ? !s.crossDomain : s.crossDomain, title );
					return false;
				},
				error: true
			}, crossDomainOrOptions );
		}

		var loc = document.location,
			samePort = loc.port || ( loc.protocol === "http:" ? 80 : 443 ),
			otherPort = loc.port === 666 ? 667 : 666,
			otherProtocol = loc.protocol === "http:" ? "https:" : "http:";

		return [
			request(
				loc.protocol + "//" + loc.hostname + ":" + samePort,
				"Test matching ports are not detected as cross-domain",
				false
			),
			request(
				otherProtocol + "//" + loc.host,
				"Test different protocols are detected as cross-domain"
			),
			request(
				"app:/path",
				"Adobe AIR app:/ URL detected as cross-domain"
			),
			request(
				loc.protocol + "//example.invalid:" + ( loc.port || 80 ),
				"Test different hostnames are detected as cross-domain"
			),
			request(
				loc.protocol + "//" + loc.hostname + ":" + otherPort,
				"Test different ports are detected as cross-domain"
			),
			request(
				"about:blank",
				"Test about:blank is detected as cross-domain"
			),
			request(
				loc.protocol + "//" + loc.host,
				"Test forced crossDomain is detected as cross-domain",
				{
					crossDomain: true
				}
			)
		];
	} );

	ajaxTest( "jQuery.ajax() - abort", 9, function( assert ) {
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxError ajaxComplete", assert ),
			url: url( "data/name.php?wait=5" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			afterSend: function( xhr ) {
				assert.strictEqual( xhr.readyState, 1, "XHR readyState indicates successful dispatch" );
				xhr.abort();
				assert.strictEqual( xhr.readyState, 0, "XHR readyState indicates successful abortion" );
			},
			error: true,
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - events with context", 12, function( assert ) {
		var context = document.createElement( "div" );

		function event( e ) {
			assert.equal( this, context, e.type );
		}

		function callback( msg ) {
			return function() {
				assert.equal( this, context, "context is preserved on callback " + msg );
			};
		}

		return {
			setup: function() {
				jQuery( context ).appendTo( "#foo" )
					.ajaxSend( event )
					.ajaxComplete( event )
					.ajaxError( event )
					.ajaxSuccess( event );
			},
			requests: [ {
				url: url( "data/name.html" ),
				context: context,
				beforeSend: callback( "beforeSend" ),
				success: callback( "success" ),
				complete: callback( "complete" )
			}, {
				url: url( "data/404.html" ),
				context: context,
				beforeSend: callback( "beforeSend" ),
				error: callback( "error" ),
				complete: callback( "complete" )
			} ]
		};
	} );

	ajaxTest( "jQuery.ajax() - events without context", 3, function( assert ) {
		function nocallback( msg ) {
			return function() {
				assert.equal( typeof this.url, "string", "context is settings on callback " + msg );
			};
		}
		return {
			url: url( "data/404.html" ),
			beforeSend: nocallback( "beforeSend" ),
			error: nocallback( "error" ),
			complete:  nocallback( "complete" )
		};
	} );

	ajaxTest( "#15118 - jQuery.ajax() - function without jQuery.event", 1, function( assert ) {
		var holder;
		return {
			url: url( "data/json.php" ),
			setup: function() {
				holder = jQuery.event;
				delete jQuery.event;
			},
			complete: function() {
				assert.ok( true, "Call can be made without jQuery.event" );
				jQuery.event = holder;
			},
			success: true
		};
	} );

	ajaxTest( "#15160 - jQuery.ajax() - request manually aborted in ajaxSend", 3, function( assert ) {
		return {
			setup: function() {
				jQuery( document ).on( "ajaxSend", function( e, jqXHR ) {
					jqXHR.abort();
				} );

				jQuery( document ).on( "ajaxError ajaxComplete", function( e, jqXHR ) {
					assert.equal( jqXHR.statusText, "abort", "jqXHR.statusText equals abort on global ajaxComplete and ajaxError events" );
				} );
			},
			url: url( "data/name.html" ),
			error: true,
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - context modification", 1, function( assert ) {
		return {
			url: url( "data/name.html" ),
			context: {},
			beforeSend: function() {
				this.test = "foo";
			},
			afterSend: function() {
				assert.strictEqual( this.context.test, "foo", "Make sure the original object is maintained." );
			},
			success: true
		};
	} );

	ajaxTest( "jQuery.ajax() - context modification through ajaxSetup", 3, function( assert ) {
		var obj = {};
		return {
			setup: function() {
				jQuery.ajaxSetup( {
					context: obj
				} );
				assert.strictEqual( jQuery.ajaxSettings.context, obj, "Make sure the context is properly set in ajaxSettings." );
			},
			requests: [ {
				url: url( "data/name.html" ),
				success: function() {
					assert.strictEqual( this, obj, "Make sure the original object is maintained." );
				}
			}, {
				url: url( "data/name.html" ),
				context: {},
				success: function() {
					assert.ok( this !== obj, "Make sure overriding context is possible." );
				}
			} ]
		};
	} );

	ajaxTest( "jQuery.ajax() - disabled globals", 3, function( assert ) {
		return {
			setup: addGlobalEvents( "", assert ),
			global: false,
			url: url( "data/name.html" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			success: function() {
				assert.ok( true, "success" );
			},
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - xml: non-namespace elements inside namespaced elements", 3, function( assert ) {
		return {
			url: url( "data/with_fries.xml" ),
			dataType: "xml",
			success: function( resp ) {
				assert.equal( jQuery( "properties", resp ).length, 1, "properties in responseXML" );
				assert.equal( jQuery( "jsconf", resp ).length, 1, "jsconf in responseXML" );
				assert.equal( jQuery( "thing", resp ).length, 2, "things in responseXML" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - xml: non-namespace elements inside namespaced elements (over JSONP)", 3, function( assert ) {
		return {
			url: url( "data/with_fries_over_jsonp.php" ),
			dataType: "jsonp xml",
			success: function( resp ) {
				assert.equal( jQuery( "properties", resp ).length, 1, "properties in responseXML" );
				assert.equal( jQuery( "jsconf", resp ).length, 1, "jsconf in responseXML" );
				assert.equal( jQuery( "thing", resp ).length, 2, "things in responseXML" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - HEAD requests", 2, function( assert ) {
		return [
			{
				url: url( "data/name.html" ),
				type: "HEAD",
				success: function( data, status, xhr ) {
					assert.ok( /Date/i.test( xhr.getAllResponseHeaders() ), "No Date in HEAD response" );
				}
			},
			{
				url: url( "data/name.html" ),
				data: {
					"whip_it": "good"
				},
				type: "HEAD",
				success: function( data, status, xhr ) {
					assert.ok( /Date/i.test( xhr.getAllResponseHeaders() ), "No Date in HEAD response with data" );
				}
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - beforeSend", 1, function( assert ) {
		return {
			url: url( "data/name.html" ),
			beforeSend: function() {
				this.check = true;
			},
			success: function() {
				assert.ok( this.check, "check beforeSend was executed" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - beforeSend, cancel request manually", 2, function( assert ) {
		return {
			create: function() {
				return jQuery.ajax( {
					url: url( "data/name.html" ),
					beforeSend: function( xhr ) {
						assert.ok( true, "beforeSend got called, canceling" );
						xhr.abort();
					},
					success: function() {
						assert.ok( false, "request didn't get canceled" );
					},
					complete: function() {
						assert.ok( false, "request didn't get canceled" );
					},
					error: function() {
						assert.ok( false, "request didn't get canceled" );
					}
				} );
			},
			fail: function( _, reason ) {
				assert.strictEqual( reason, "canceled", "canceled request must fail with 'canceled' status text" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - dataType html", 5, function( assert ) {
		return {
			setup: function() {
				Globals.register( "testFoo" );
				Globals.register( "testBar" );
			},
			dataType: "html",
			url: url( "data/test.html" ),
			success: function( data ) {
				assert.ok( data.match( /^html text/ ), "Check content for datatype html" );
				jQuery( "#ap" ).html( data );
				assert.strictEqual( window[ "testFoo" ], "foo", "Check if script was evaluated for datatype html" );
				assert.strictEqual( window[ "testBar" ], "bar", "Check if script src was evaluated for datatype html" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - synchronous request", 1, function( assert ) {
		return {
			url: url( "data/json_obj.js" ),
			dataType: "text",
			async: false,
			success: true,
			afterSend: function( xhr ) {
				assert.ok( /^\{ "data"/.test( xhr.responseText ), "check returned text" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - synchronous request with callbacks", 2, function( assert ) {
		return {
			url: url( "data/json_obj.js" ),
			async: false,
			dataType: "text",
			success: true,
			afterSend: function( xhr ) {
				var result;
				xhr.done( function( data ) {
					assert.ok( true, "success callback executed" );
					result = data;
				} );
				assert.ok( /^\{ "data"/.test( result ), "check returned text" );
			}
		};
	} );

	QUnit.asyncTest( "jQuery.ajax(), jQuery.get[Script|JSON](), jQuery.post(), pass-through request object", 8, function( assert ) {
		var target = "data/name.html",
			successCount = 0,
			errorCount = 0,
			errorEx = "",
			success = function() {
				successCount++;
			};
		jQuery( document ).on( "ajaxError.passthru", function( e, xml ) {
			errorCount++;
			errorEx += ": " + xml.status;
		} );
		jQuery( document ).one( "ajaxStop", function() {
			assert.equal( successCount, 5, "Check all ajax calls successful" );
			assert.equal( errorCount, 0, "Check no ajax errors (status" + errorEx + ")" );
			jQuery( document ).off( "ajaxError.passthru" );
			QUnit.start();
		} );
		Globals.register( "testBar" );

		assert.ok( jQuery.get( url( target ), success ), "get" );
		assert.ok( jQuery.post( url( target ), success ), "post" );
		assert.ok( jQuery.getScript( url( "data/testbar.php" ), success ), "script" );
		assert.ok( jQuery.getJSON( url( "data/json_obj.js" ), success ), "json" );
		assert.ok( jQuery.ajax( {
			url: url( target ),
			success: success
		} ), "generic" );
	} );

	ajaxTest( "jQuery.ajax() - cache", 12, function( assert ) {
		var re = /_=(.*?)(&|$)/g;

		function request( url, title ) {
			return {
				url: url,
				cache: false,
				beforeSend: function() {
					var parameter, tmp;
					while ( ( tmp = re.exec( this.url ) ) ) {
						assert.strictEqual( parameter, undefined, title + ": only one 'no-cache' parameter" );
						parameter = tmp[ 1 ];
						assert.notStrictEqual( parameter, "tobereplaced555", title + ": parameter (if it was there) was replaced" );
					}
					return false;
				},
				error: true
			};
		}

		return [
			request(
				"data/text.php",
				"no parameter"
			),
			request(
				"data/text.php?pizza=true",
				"1 parameter"
			),
			request(
				"data/text.php?_=tobereplaced555",
				"_= parameter"
			),
			request(
				"data/text.php?pizza=true&_=tobereplaced555",
				"1 parameter and _="
			),
			request(
				"data/text.php?_=tobereplaced555&tv=false",
				"_= and 1 parameter"
			),
			request(
				"data/text.php?name=David&_=tobereplaced555&washere=true",
				"2 parameters surrounding _="
			)
		];
	} );

	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {
		ajaxTest( "#8205 - jQuery.ajax() - JSONP - re-use callbacks name" + label, 4, function( assert ) {
			return {
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				beforeSend: function( jqXHR, s ) {
					s.callback = s.jsonpCallback;

					assert.ok( this.callback in window, "JSONP callback name is in the window" );
				},
				success: function() {
					var previous = this;

					assert.strictEqual(
						previous.jsonpCallback,
						undefined,
						"jsonpCallback option is set back to default in callbacks"
					);

					if ( isoldIE ) {
						assert.ok( true, "IE8 can't remove property from the window" );

					} else {
						assert.ok(
							!( this.callback in window ),
							"JSONP callback name was removed from the window"
						);
					}

					jQuery.ajax( {
						url: "data/jsonp.php",
						dataType: "jsonp",
						crossDomain: crossDomain,
						beforeSend: function() {
							assert.strictEqual( this.jsonpCallback, previous.callback, "JSONP callback name is re-used" );
							return false;
						}
					} );
				}
			};
		} );
	} );

	ajaxTest( "jQuery.ajax() - script, Remote", 2, function( assert ) {
		return {
			setup: function() {
				Globals.register( "testBar" );
			},
			url: window.location.href.replace( /[^\/]*$/, "" ) + "data/testbar.php",
			dataType: "script",
			success: function() {
				assert.strictEqual( window[ "testBar" ], "bar", "Script results returned (GET, no callback)" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - script, Remote with POST", 3, function( assert ) {
		return {
			setup: function() {
				Globals.register( "testBar" );
			},
			url: window.location.href.replace( /[^\/]*$/, "" ) + "data/testbar.php",
			type: "POST",
			dataType: "script",
			success: function( data, status ) {
				assert.strictEqual( window[ "testBar" ], "bar", "Script results returned (POST, no callback)" );
				assert.strictEqual( status, "success", "Script results returned (POST, no callback)" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - script, Remote with scheme-less URL", 2, function( assert ) {
		return {
			setup: function() {
				Globals.register( "testBar" );
			},
			url: window.location.href.replace( /[^\/]*$/, "" ).replace( /^.*?\/\//, "//" ) + "data/testbar.php",
			dataType: "script",
			success: function() {
				assert.strictEqual( window[ "testBar" ], "bar", "Script results returned (GET, no callback)" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - malformed JSON", 2, function( assert ) {
		return {
			url: "data/badjson.js",
			dataType: "json",
			error: function( xhr, msg, detailedMsg ) {
				assert.strictEqual( msg, "parsererror", "A parse error occurred." );
				assert.ok( /(invalid|error|exception)/i.test( detailedMsg ), "Detailed parsererror message provided" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - script by content-type", 2, function() {
		return [
			{
				url: "data/script.php",
				data: {
					"header": "script"
				},
				success: true
			},
			{
				url: "data/script.php",
				data: {
					"header": "ecma"
				},
				success: true
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - JSON by content-type", 5, function( assert ) {
		return {
			url: "data/json.php",
			data: {
				"header": "json",
				"json": "array"
			},
			success: function( json ) {
				assert.ok( json.length >= 2, "Check length" );
				assert.strictEqual( json[ 0 ][ "name" ], "John", "Check JSON: first, name" );
				assert.strictEqual( json[ 0 ][ "age" ], 21, "Check JSON: first, age" );
				assert.strictEqual( json[ 1 ][ "name" ], "Peter", "Check JSON: second, name" );
				assert.strictEqual( json[ 1 ][ "age" ], 25, "Check JSON: second, age" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - JSON by content-type disabled with options", 6, function( assert ) {
		return {
			url: url( "data/json.php" ),
			data: {
				"header": "json",
				"json": "array"
			},
			contents: {
				"json": false
			},
			success: function( text ) {
				assert.strictEqual( typeof text, "string", "json wasn't auto-determined" );
				var json = jQuery.parseJSON( text );
				assert.ok( json.length >= 2, "Check length" );
				assert.strictEqual( json[ 0 ][ "name" ], "John", "Check JSON: first, name" );
				assert.strictEqual( json[ 0 ][ "age" ], 21, "Check JSON: first, age" );
				assert.strictEqual( json[ 1 ][ "name" ], "Peter", "Check JSON: second, name" );
				assert.strictEqual( json[ 1 ][ "age" ], 25, "Check JSON: second, age" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - simple get", 1, function( assert ) {
		return {
			type: "GET",
			url: url( "data/name.php?name=foo" ),
			success: function( msg ) {
				assert.strictEqual( msg, "bar", "Check for GET" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - simple post", 1, function( assert ) {
		return {
			type: "POST",
			url: url( "data/name.php" ),
			data: "name=peter",
			success: function( msg ) {
				assert.strictEqual( msg, "pan", "Check for POST" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - data option - empty bodies for non-GET requests", 1, function( assert ) {
		return {
			url: "data/echoData.php",
			data: undefined,
			type: "post",
			success: function( result ) {
				assert.strictEqual( result, "" );
			}
		};
	} );

	var ifModifiedNow = new Date();

	jQuery.each(
		/* jQuery.each arguments start */
		{
			" (cache)": true,
			" (no cache)": false
		},
		function( label, cache ) {
			jQuery.each(
				{
					"If-Modified-Since": "if_modified_since.php",
					"Etag": "etag.php"
				},
				function( type, url ) {
					url = "data/" + url + "?ts=" + ifModifiedNow++;
					QUnit.asyncTest( "jQuery.ajax() - " + type + " support" + label, 4, function( assert ) {
						jQuery.ajax( {
							url: url,
							ifModified: true,
							cache: cache,
							success: function( _, status ) {
								assert.strictEqual( status, "success", "Initial status is 'success'" );
								jQuery.ajax( {
									url: url,
									ifModified: true,
									cache: cache,
									success: function( data, status, jqXHR ) {
										assert.strictEqual( status, "notmodified", "Following status is 'notmodified'" );
										assert.strictEqual( jqXHR.status, 304, "XHR status is 304" );
										assert.equal( data, null, "no response body is given" );
									},
									complete: function() {
										QUnit.start();
									}
								} );
							}
						} );
					} );
				}
			);
		}
		/* jQuery.each arguments end */
	);

	ajaxTest( "jQuery.ajax() - failing cross-domain (non-existing)", 1, function( assert ) {
		return {

			// see RFC 2606
			url: "http://example.invalid",
			error: function( xhr, _, e ) {
				assert.ok( true, "file not found: " + xhr.status + " => " + e );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - failing cross-domain", 1, function( assert ) {
		return {
			url: "http://" + externalHost,
			error: function( xhr, _, e ) {
				assert.ok( true, "access denied: " + xhr.status + " => " + e );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - atom+xml", 1, function( assert ) {
		return {
			url: url( "data/atom+xml.php" ),
			success: function() {
				assert.ok( true, "success" );
			}
		};
	} );

	QUnit.asyncTest( "jQuery.ajax() - statusText", 3, function( assert ) {
		jQuery.ajax( url( "data/statusText.php?status=200&text=Hello" ) ).done( function( _, statusText, jqXHR ) {
			assert.strictEqual( statusText, "success", "callback status text ok for success" );
			assert.ok( jqXHR.statusText === "Hello" || jqXHR.statusText === "OK", "jqXHR status text ok for success (" + jqXHR.statusText + ")" );
			jQuery.ajax( url( "data/statusText.php?status=404&text=World" ) ).fail( function( jqXHR, statusText ) {
				assert.strictEqual( statusText, "error", "callback status text ok for error" );
				QUnit.start();
			} );
		} );
	} );

	QUnit.asyncTest( "jQuery.ajax() - statusCode", 20, function( assert ) {

		var count = 12;

		function countComplete() {
			if ( !--count ) {
				QUnit.start();
			}
		}

		function createStatusCodes( name, isSuccess ) {
			name = "Test " + name + " " + ( isSuccess ? "success" : "error" );
			return {
				200: function() {
					assert.ok( isSuccess, name );
				},
				404: function() {
					assert.ok( !isSuccess, name );
				}
			};
		}

		jQuery.each(
			/* jQuery.each arguments start */
			{
				"data/name.html": true,
				"data/someFileThatDoesNotExist.html": false
			},
			function( uri, isSuccess ) {

				jQuery.ajax( url( uri ), {
					statusCode: createStatusCodes( "in options", isSuccess ),
					complete: countComplete
				} );

				jQuery.ajax( url( uri ), {
					complete: countComplete
				} ).statusCode( createStatusCodes( "immediately with method", isSuccess ) );

				jQuery.ajax( url( uri ), {
					complete: function( jqXHR ) {
						jqXHR.statusCode( createStatusCodes( "on complete", isSuccess ) );
						countComplete();
					}
				} );

				jQuery.ajax( url( uri ), {
					complete: function( jqXHR ) {
						setTimeout( function() {
							jqXHR.statusCode( createStatusCodes( "very late binding", isSuccess ) );
							countComplete();
						}, 100 );
					}
				} );

				jQuery.ajax( url( uri ), {
					statusCode: createStatusCodes( "all (options)", isSuccess ),
					complete: function( jqXHR ) {
						jqXHR.statusCode( createStatusCodes( "all (on complete)", isSuccess ) );
						setTimeout( function() {
							jqXHR.statusCode( createStatusCodes( "all (very late binding)", isSuccess ) );
							countComplete();
						}, 100 );
					}
				} ).statusCode( createStatusCodes( "all (immediately with method)", isSuccess ) );

				var testString = "";

				jQuery.ajax( url( uri ), {
					success: function( a, b, jqXHR ) {
						assert.ok( isSuccess, "success" );
						var statusCode = {};
						statusCode[ jqXHR.status ] = function() {
							testString += "B";
						};
						jqXHR.statusCode( statusCode );
						testString += "A";
					},
					error: function( jqXHR ) {
						assert.ok( !isSuccess, "error" );
						var statusCode = {};
						statusCode[ jqXHR.status ] = function() {
							testString += "B";
						};
						jqXHR.statusCode( statusCode );
						testString += "A";
					},
					complete: function() {
						assert.strictEqual(
							testString,
							"AB",
							"Test statusCode callbacks are ordered like " + ( isSuccess ? "success" :  "error" ) + " callbacks"
						);
						countComplete();
					}
				} );

			}
			/* jQuery.each arguments end*/
		);
	} );

	ajaxTest( "jQuery.ajax() - transitive conversions", 8, function( assert ) {
		return [
			{
				url: url( "data/json.php" ),
				converters: {
					"json myJson": function( data ) {
						assert.ok( true, "converter called" );
						return data;
					}
				},
				dataType: "myJson",
				success: function() {
					assert.ok( true, "Transitive conversion worked" );
					assert.strictEqual( this.dataTypes[ 0 ], "text", "response was retrieved as text" );
					assert.strictEqual( this.dataTypes[ 1 ], "myjson", "request expected myjson dataType" );
				}
			},
			{
				url: url( "data/json.php" ),
				converters: {
					"json myJson": function( data ) {
						assert.ok( true, "converter called (*)" );
						return data;
					}
				},
				contents: false, /* headers are wrong so we ignore them */
				dataType: "* myJson",
				success: function() {
					assert.ok( true, "Transitive conversion worked (*)" );
					assert.strictEqual( this.dataTypes[ 0 ], "text", "response was retrieved as text (*)" );
					assert.strictEqual( this.dataTypes[ 1 ], "myjson", "request expected myjson dataType (*)" );
				}
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - overrideMimeType", 2, function( assert ) {
		return [
			{
				url: url( "data/json.php" ),
				beforeSend: function( xhr ) {
					xhr.overrideMimeType( "application/json" );
				},
				success: function( json ) {
					assert.ok( json.data, "Mimetype overridden using beforeSend" );
				}
			},
			{
				url: url( "data/json.php" ),
				mimeType: "application/json",
				success: function( json ) {
					assert.ok( json.data, "Mimetype overridden using mimeType option" );
				}
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - empty json gets to error callback instead of success callback.", 1, function( assert ) {
		return {
			url: url( "data/echoData.php" ),
			error: function( _, __, error ) {
				assert.equal( typeof error === "object", true,  "Didn't get back error object for empty json response" );
			},
			dataType: "json"
		};
	} );

	ajaxTest( "#2688 - jQuery.ajax() - beforeSend, cancel request", 2, function( assert ) {
		return {
			create: function() {
				return jQuery.ajax( {
					url: url( "data/name.html" ),
					beforeSend: function() {
						assert.ok( true, "beforeSend got called, canceling" );
						return false;
					},
					success: function() {
						assert.ok( false, "request didn't get canceled" );
					},
					complete: function() {
						assert.ok( false, "request didn't get canceled" );
					},
					error: function() {
						assert.ok( false, "request didn't get canceled" );
					}
				} );
			},
			fail: function( _, reason ) {
				assert.strictEqual( reason, "canceled", "canceled request must fail with 'canceled' status text" );
			}
		};
	} );

	ajaxTest( "#2806 - jQuery.ajax() - data option - evaluate function values", 1, function( assert ) {
		return {
			url: "data/echoQuery.php",
			data: {
				key: function() {
					return "value";
				}
			},
			success: function( result ) {
				assert.strictEqual( result, "key=value" );
			}
		};
	} );

	QUnit.test( "#7531 - jQuery.ajax() - Location object as url", function( assert ) {
		assert.expect( 1 );

		var xhr,
			success = false;
		try {
			xhr = jQuery.ajax( {
				url: window.location
			} );
			success = true;
			xhr.abort();
		} catch ( e ) {

		}
		assert.ok( success, "document.location did not generate exception" );
	} );

	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {
		ajaxTest( "#7578 - jQuery.ajax() - JSONP - default for cache option" + label, 1, function( assert ) {
			return {
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				beforeSend: function() {
					assert.strictEqual( this.cache, false, "cache must be false on JSON request" );
					return false;
				},
				error: true
			};
		} );
	} );

	ajaxTest( "#8107 - jQuery.ajax() - multiple method signatures introduced in 1.5", 4, function( assert ) {
		return [
			{
				create: function() {
					return jQuery.ajax();
				},
				done: function() {
					assert.ok( true, "With no arguments" );
				}
			},
			{
				create: function() {
					return jQuery.ajax( "data/name.html" );
				},
				done: function() {
					assert.ok( true, "With only string URL argument" );
				}
			},
			{
				create: function() {
					return jQuery.ajax( "data/name.html", {} );
				},
				done: function() {
					assert.ok( true, "With string URL param and map" );
				}
			},
			{
				create: function( options ) {
					return jQuery.ajax( options );
				},
				url: "data/name.html",
				success: function() {
					assert.ok( true, "With only map" );
				}
			}
		];
	} );

	QUnit.test( "#9887 - jQuery.ajax() - Context with circular references (#9887)", function( assert ) {
		assert.expect( 2 );

		var success = false,
			context = {};
		context.field = context;
		try {
			jQuery.ajax( "non-existing", {
				context: context,
				beforeSend: function() {
					assert.ok( this === context, "context was not deep extended" );
					return false;
				}
			} );
			success = true;
		} catch ( e ) {
			console.log( e );
		}
		assert.ok( success, "context with circular reference did not generate an exception" );
	} );

	jQuery.each( [ "as argument", "in settings object" ], function( inSetting, title ) {

		function request( assert, url, test ) {
			return {
				create: function() {
					return jQuery.ajax( inSetting ? { url: url } : url );
				},
				done: function() {
					assert.ok( true, ( test || url ) + " " + title );
				}
			};
		}

		ajaxTest( "#10093 - jQuery.ajax() - falsy url " + title, 4, function( assert ) {
			return [
				request( assert, "", "empty string" ),
				request( assert, false ),
				request( assert, null ),
				request( assert, undefined )
			];
		} );
	} );

	ajaxTest( "#11151 - jQuery.ajax() - parse error body", 2, function( assert ) {
		return {
			url: url( "data/errorWithJSON.php" ),
			dataFilter: function( string ) {
				assert.ok( false, "dataFilter called" );
				return string;
			},
			error: function( jqXHR ) {
				assert.strictEqual( jqXHR.responseText, "{ \"code\": 40, \"message\": \"Bad Request\" }", "Error body properly set" );
				assert.deepEqual( jqXHR.responseJSON, { code: 40, message: "Bad Request" }, "Error body properly parsed" );
			}
		};
	} );

	ajaxTest( "#11426 - jQuery.ajax() - loading binary data shouldn't throw an exception in IE", 1, function( assert ) {
		return {
			url: url( "data/1x1.jpg" ),
			success: function( data ) {
				assert.ok( data === undefined || /JFIF/.test( data ), "success callback reached" );
			}
		};
	} );

	QUnit.test( "#11743 - jQuery.ajax() - script, throws exception", 1, function(assert) {
		assert.throws( function() {
			jQuery.ajax( {
				url: "data/badjson.js",
				dataType: "script",
				"throws": true,

				// TODO find a way to test this asynchronously, too
				async: false,

				// Global events get confused by the exception
				global: false,
				success: function() {
					assert.ok( false, "Success." );
				},
				error: function() {
					assert.ok( false, "Error." );
				}
			} );
		}, "exception bubbled" );
	} );

	jQuery.each( [ "method", "type" ], function( _, globalOption ) {
		function request( assert, option ) {
			var options = {
					url: url( "data/echoData.php" ),
					data: "hello",
					success: function( msg ) {
						assert.strictEqual( msg, "hello", "Check for POST (no override)" );
					}
				};
			if ( option ) {
				options[ option ] = "GET";
				options.success = function( msg ) {
					assert.strictEqual( msg, "", "Check for no POST (overriding with " + option + ")" );
				};
			}
			return options;
		}

		ajaxTest(
			"#12004 - jQuery.ajax() - method is an alias of type - " +
			globalOption + " set globally", 3,
			function( assert ) {
				return {
					setup: function() {
						var options = {};
						options[ globalOption ] = "POST";
						jQuery.ajaxSetup( options );
					},
					requests: [
						request( assert, "type" ),
						request( assert, "method" ),
						request( assert )
					]
				};
			}
		);
	} );

	ajaxTest( "#13276 - jQuery.ajax() - compatibility between XML documents from ajax requests and parsed string", 1, function( assert ) {
		return {
			url: "data/dashboard.xml",
			dataType: "xml",
			success: function( ajaxXML ) {
				var parsedXML = jQuery( jQuery.parseXML( "<tab title=\"Added\">blibli</tab>" ) ).find( "tab" );
				ajaxXML = jQuery( ajaxXML );
				try {

					// Android 2.3 doesn't automatically adopt nodes from foreign documents.
					// (see the comment in test/manipulation.js)
					// Support: Android 2.3
					if ( /android 2\.3/i.test( navigator.userAgent ) ) {
						parsedXML = jQuery( ajaxXML[ 0 ].adoptNode( parsedXML[ 0 ] ) );
					}
					ajaxXML.find( "infowindowtab" ).append( parsedXML );
				} catch ( e ) {
					assert.strictEqual( e, undefined, "error" );
					return;
				}
				assert.strictEqual( ajaxXML.find( "tab" ).length, 3, "Parsed node was added properly" );
			}
		};
	} );

	ajaxTest( "#13292 - jQuery.ajax() - converter is bypassed for 204 requests", 3, function( assert ) {
		return {
			url: "data/nocontent.php",
			dataType: "testing",
			converters: {
				"* testing": function() {
					throw "converter was called";
				}
			},
			success: function( data, status, jqXHR ) {
				assert.strictEqual( jqXHR.status, 204, "status code is 204" );
				assert.strictEqual( status, "nocontent", "status text is 'nocontent'" );
				assert.strictEqual( data, undefined, "data is undefined" );
			},
			error: function( _, status, error ) {
				assert.ok( false, "error" );
				assert.strictEqual( status, "parsererror", "Parser Error" );
				assert.strictEqual( error, "converter was called", "Converter was called" );
			}
		};
	} );

	ajaxTest( "#13388 - jQuery.ajax() - responseXML", 3, function( assert ) {
		return {
			url: url( "data/with_fries.xml" ),
			dataType: "xml",
			success: function( resp, _, jqXHR ) {
				assert.notStrictEqual( resp, undefined, "XML document exists" );
				assert.ok( "responseXML" in jqXHR, "jqXHR.responseXML exists" );
				assert.strictEqual( resp, jqXHR.responseXML, "jqXHR.responseXML is set correctly" );
			}
		};
	} );

	ajaxTest( "#13922 - jQuery.ajax() - converter is bypassed for HEAD requests", 3, function( assert ) {
		return {
			url: "data/json.php",
			method: "HEAD",
			data: {
				header: "yes"
			},
			converters: {
				"text json": function() {
					throw "converter was called";
				}
			},
			success: function( data, status ) {
				assert.ok( true, "success" );
				assert.strictEqual( status, "nocontent", "data is undefined" );
				assert.strictEqual( data, undefined, "data is undefined" );
			},
			error: function( _, status, error ) {
				assert.ok( false, "error" );
				assert.strictEqual( status, "parsererror", "Parser Error" );
				assert.strictEqual( error, "converter was called", "Converter was called" );
			}
		};
	} );

	testIframeWithCallback(
		"#14379 - jQuery.ajax() on unload",
		"ajax/onunload.html",
		function( status, assert ) {
			assert.expect( 1 );
			assert.strictEqual( status, "success", "Request completed" );
		}
	);

	// BrowserStack PATCH support sometimes breaks so on TestSwarm run the test in IE only.
	// Unfortunately, all IE versions gets special treatment in request object creation
	// so we need to test in all supported IE versions to be sure.
	if ( location.search.indexOf( "swarmURL=" ) === -1 || document.documentMode ) {
		ajaxTest( "#13240 - jQuery.ajax() - support non-RFC2616 methods", 1, function( assert ) {
			return {
				url: "data/echoQuery.php",
				method: "PATCH",
				success: function() {
					assert.ok( true, "success" );
				},
				error: function() {
					assert.ok( false, "error" );
				}
			};
		} );
	}

	ajaxTest( "#14683 - jQuery.ajax() - Exceptions thrown synchronously by xhr.send should be caught", 4, function( assert ) {
		return [ {
			url: "data/params_html.php",
			method: "POST",
			data: {
				toString: function() {
					throw "Can't parse";
				}
			},
			processData: false,
			done: function( data ) {
				assert.ok( false, "done: " + data );
			},
			fail: function( jqXHR, status, error ) {
				assert.ok( true, "exception caught: " + error );
				assert.strictEqual( jqXHR.status, 0, "proper status code" );
				assert.strictEqual( status, "error", "proper status" );
			}
		}, {
			url: "http://" + externalHost + ":80q",
			done: function( data ) {
				assert.ok( false, "done: " + data );
			},
			fail: function( _, status, error ) {
				assert.ok( true, "fail: " + status + " - " + error );
			}
		} ];
	} );

	ajaxTest( "gh-2587 - when content-type not xml, but looks like one", 1, function( assert ) {
		return {
			url: url( "data/ajax/content-type.php" ),
			data: {
				"content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"response": "<test/>"
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					"string",
					"Should handle it as a string, not xml"
				);
			}
		};
	} );

	ajaxTest( "gh-2587 - when content-type not xml, but looks like one", 1, function( assert ) {
		return {
			url: url( "data/ajax/content-type.php" ),
			data: {
				"content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"response": "<test/>"
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					"string",
					"Should handle it as a string, not xml"
				);
			}
		};
	} );

	ajaxTest( "gh-2587 - when content-type not json, but looks like one", 1, function( assert ) {
		return {
			url: url( "data/ajax/content-type.php" ),
			data: {
				"content-type": "test/jsontest",
				"response": "{ \"test\": \"test\" }"
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					"string",
					"Should handle it as a string, not json"
				);
			}
		};
	} );

	ajaxTest( "gh-2587 - when content-type not html, but looks like one", 1, function( assert ) {
		return {
			url: url( "data/ajax/content-type.php" ),
			data: {
				"content-type": "test/htmltest",
				"response": "<p>test</p>"
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					"string",
					"Should handle it as a string, not html"
				);
			}
		};
	} );

	ajaxTest( "gh-2587 - when content-type not javascript, but looks like one", 1, function( assert ) {
		return {
			url: url( "data/ajax/content-type.php" ),
			data: {
				"content-type": "test/testjavascript",
				"response": "alert(1)"
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					"string",
					"Should handle it as a string, not javascript"
				);
			}
		};
	} );

	ajaxTest( "gh-2587 - when content-type not ecmascript, but looks like one", 1, function( assert ) {
		return {
			url: url( "data/ajax/content-type.php" ),
			data: {
				"content-type": "test/testjavascript",
				"response": "alert(1)"
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					"string",
					"Should handle it as a string, not ecmascript"
				);
			}
		};
	} );

//----------- jQuery.ajaxPrefilter()

	ajaxTest( "jQuery.ajaxPrefilter() - abort", 1, function( assert ) {
		return {
			dataType: "prefix",
			setup: function() {

				// Ensure prefix does not throw an error
				jQuery.ajaxPrefilter( "+prefix", function( options, _, jqXHR ) {
					if ( options.abortInPrefilter ) {
						jqXHR.abort();
					}
				} );
			},
			abortInPrefilter: true,
			error: function() {
				assert.ok( false, "error callback called" );
			},
			fail: function( _, reason ) {
				assert.strictEqual( reason, "canceled", "Request aborted by the prefilter must fail with 'canceled' status text" );
			}
		};
	} );

//----------- jQuery.ajaxSetup()

	QUnit.asyncTest( "jQuery.ajaxSetup()", 1, function( assert ) {
		jQuery.ajaxSetup( {
			url: url( "data/name.php?name=foo" ),
			success: function( msg ) {
				assert.strictEqual( msg, "bar", "Check for GET" );
				QUnit.start();
			}
		} );
		jQuery.ajax();
	} );

	QUnit.asyncTest( "jQuery.ajaxSetup({ timeout: Number }) - with global timeout", 2, function( assert ) {
		var passed = 0,
			pass = function() {
				assert.ok( passed++ < 2, "Error callback executed" );
				if ( passed === 2 ) {
					jQuery( document ).off( "ajaxError.setupTest" );
					QUnit.start();
				}
			},
			fail = function( a, b ) {
				assert.ok( false, "Check for timeout failed " + a + " " + b );
				QUnit.start();
			};

		jQuery( document ).on( "ajaxError.setupTest", pass );

		jQuery.ajaxSetup( {
			timeout: 1000
		} );

		jQuery.ajax( {
			type: "GET",
			url: url( "data/name.php?wait=5" ),
			error: pass,
			success: fail
		} );
	} );

	QUnit.asyncTest( "jQuery.ajaxSetup({ timeout: Number }) with localtimeout", 1, function( assert ) {
		jQuery.ajaxSetup( {
			timeout: 50
		} );
		jQuery.ajax( {
			type: "GET",
			timeout: 15000,
			url: url( "data/name.php?wait=1" ),
			error: function() {
				assert.ok( false, "Check for local timeout failed" );
				QUnit.start();
			},
			success: function() {
				assert.ok( true, "Check for local timeout" );
				QUnit.start();
			}
		} );
	} );

//----------- jQuery.domManip()

	QUnit.test( "#11264 - jQuery.domManip() - no side effect because of ajaxSetup or global events", function( assert ) {
		assert.expect( 1 );

		jQuery.ajaxSetup( {
			type: "POST"
		} );

		jQuery( document ).on( "ajaxStart ajaxStop", function() {
			assert.ok( false, "Global event triggered" );
		} );

		jQuery( "#qunit-fixture" ).append( "<script src='data/ajax/evalScript.php'></script>" );

		jQuery( document ).off( "ajaxStart ajaxStop" );
	} );

	QUnit.test(
		"jQuery#load() - always use GET method even if it overrided through ajaxSetup (#11264)", 1,
		function( assert ) {
			var done = assert.async();

			jQuery.ajaxSetup( {
				type: "POST"
			} );

			jQuery( "#qunit-fixture" ).load( "data/ajax/method.php", function( method ) {
				assert.equal( method, "GET" );
				done();
			} );
		}
	);

	QUnit.test(
		"jQuery#load() - should resolve with correct context", 2,
		function( assert ) {
			var done = assert.async();
			var ps = jQuery( "<p></p><p></p>" );
			var i = 0;

			ps.appendTo( "#qunit-fixture" );

			ps.load( "data/ajax/method.php", function() {
				assert.strictEqual( this, ps[ i++ ] );

				if ( i === 2 ) {
					done();
				}
			} );
		}
	);

	QUnit.test(
		"#11402 - jQuery.domManip() - script in comments are properly evaluated", 2,
		function( assert ) {
			jQuery( "#qunit-fixture" ).load( "data/cleanScript.html", assert.async() );
		}
	);

//----------- jQuery.get()

	QUnit.asyncTest( "jQuery.get( String, Hash, Function ) - parse xml and use text() on nodes", 2, function( assert ) {
		jQuery.get( url( "data/dashboard.xml" ), function( xml ) {
			var content = [];
			jQuery( "tab", xml ).each( function() {
				content.push( jQuery( this ).text() );
			} );
			assert.strictEqual( content[ 0 ], "blabla", "Check first tab" );
			assert.strictEqual( content[ 1 ], "blublu", "Check second tab" );
			QUnit.start();
		} );
	} );

	QUnit.asyncTest( "#8277 - jQuery.get( String, Function ) - data in ajaxSettings", 1, function( assert ) {
		jQuery.ajaxSetup( {
			data: "helloworld"
		} );
		jQuery.get( url( "data/echoQuery.php" ), function( data ) {
			assert.ok( /helloworld$/.test( data ), "Data from ajaxSettings was used" );
			QUnit.start();
		} );
	} );

//----------- jQuery.getJSON()

	QUnit.asyncTest( "jQuery.getJSON( String, Hash, Function ) - JSON array", 5, function( assert ) {
		jQuery.getJSON(
			url( "data/json.php" ),
			{
				"json": "array"
			},
			function( json ) {
				assert.ok( json.length >= 2, "Check length" );
				assert.strictEqual( json[ 0 ][ "name" ], "John", "Check JSON: first, name" );
				assert.strictEqual( json[ 0 ][ "age" ], 21, "Check JSON: first, age" );
				assert.strictEqual( json[ 1 ][ "name" ], "Peter", "Check JSON: second, name" );
				assert.strictEqual( json[ 1 ][ "age" ], 25, "Check JSON: second, age" );
				QUnit.start();
			}
		);
	} );

	QUnit.asyncTest( "jQuery.getJSON( String, Function ) - JSON object", 2, function( assert ) {
		jQuery.getJSON( url( "data/json.php" ), function( json ) {
			if ( json && json[ "data" ] ) {
				assert.strictEqual( json[ "data" ][ "lang" ], "en", "Check JSON: lang" );
				assert.strictEqual( json[ "data" ].length, 25, "Check JSON: length" );
				QUnit.start();
			}
		} );
	} );

	QUnit.asyncTest( "jQuery.getJSON( String, Function ) - JSON object with absolute url to local content", 2, function( assert ) {
		jQuery.getJSON( url( window.location.href.replace( /[^\/]*$/, "" ) + "data/json.php" ), function( json ) {
			assert.strictEqual( json.data.lang, "en", "Check JSON: lang" );
			assert.strictEqual( json.data.length, 25, "Check JSON: length" );
			QUnit.start();
		} );
	} );

//----------- jQuery.getScript()

	QUnit.test( "jQuery.getScript( String, Function ) - with callback", 2,
		function( assert ) {
			var done = assert.async();

			Globals.register( "testBar" );
			jQuery.getScript( url( "data/testbar.php" ), function() {
				assert.strictEqual( window[ "testBar" ], "bar", "Check if script was evaluated" );
				done();
			} );
		}
	);

	QUnit.test( "jQuery.getScript( String, Function ) - no callback", 1, function( assert ) {
		Globals.register( "testBar" );
		jQuery.getScript( url( "data/testbar.php" ) ).done( assert.async() );
	} );

	QUnit.test( "#8082 - jQuery.getScript( String, Function ) - source as responseText", 2, function( assert ) {
		var done = assert.async();

		Globals.register( "testBar" );
		jQuery.getScript( url( "data/testbar.php" ), function( data, _, jqXHR ) {
			assert.strictEqual( data, jqXHR.responseText, "Same-domain script requests returns the source of the script" );
			done();
		} );
	} );

// //----------- jQuery.fn.load()

	// check if load can be called with only url
	QUnit.test( "jQuery.fn.load( String )", 2, function( assert ) {
		jQuery.ajaxSetup( {
			beforeSend: function() {
				assert.strictEqual( this.type, "GET", "no data means GET request" );
			}
		} );
		jQuery( "#first" ).load( "data/name.html", assert.async() );
	} );

	QUnit.test( "jQuery.fn.load() - 404 error callbacks", function( assert ) {
		assert.expect( 6 );
		var done = assert.async();

		addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError", assert )();
		jQuery( document ).ajaxStop( done );
		jQuery( "<div/>" ).load( "data/404.html", function() {
			assert.ok( true, "complete" );
		} );
	} );

	// check if load can be called with url and null data
	QUnit.test( "jQuery.fn.load( String, null )", 2, function( assert ) {
		jQuery.ajaxSetup( {
			beforeSend: function() {
				assert.strictEqual( this.type, "GET", "no data means GET request" );
			}
		} );
		jQuery( "#first" ).load( "data/name.html", null, assert.async() );
	} );

	// check if load can be called with url and undefined data
	QUnit.test( "jQuery.fn.load( String, undefined )", 2, function( assert ) {
		jQuery.ajaxSetup( {
			beforeSend: function() {
				assert.strictEqual( this.type, "GET", "no data means GET request" );
			}
		} );
		jQuery( "#first" ).load( "data/name.html", undefined, assert.async() );
	} );

	// check if load can be called with only url
	QUnit.asyncTest( "jQuery.fn.load( URL_SELECTOR )", 1, function( assert ) {
		jQuery( "#first" ).load( "data/test3.html div.user", function() {
			assert.strictEqual( jQuery( this ).children( "div" ).length, 2, "Verify that specific elements were injected" );
			QUnit.start();
		} );
	} );

	// Selector should be trimmed to avoid leading spaces (#14773)
	QUnit.asyncTest( "jQuery.fn.load( URL_SELECTOR with spaces )", 1, function( assert ) {
		jQuery( "#first" ).load( "data/test3.html   #superuser ", function() {
			assert.strictEqual( jQuery( this ).children( "div" ).length, 1, "Verify that specific elements were injected" );
			QUnit.start();
		} );
	} );

	QUnit.asyncTest( "jQuery.fn.load( String, Function ) - simple: inject text into DOM", 2, function( assert ) {
		jQuery( "#first" ).load( url( "data/name.html" ), function() {
			assert.ok( /^ERROR/.test( jQuery( "#first" ).text() ), "Check if content was injected into the DOM" );
			QUnit.start();
		} );
	} );

	QUnit.asyncTest( "jQuery.fn.load( String, Function ) - check scripts", 7, function( assert ) {
		var verifyEvaluation = function() {
			assert.strictEqual( window[ "testBar" ], "bar", "Check if script src was evaluated after load" );
			assert.strictEqual( jQuery( "#ap" ).html(), "bar", "Check if script evaluation has modified DOM" );
			QUnit.start();
		};

		Globals.register( "testFoo" );
		Globals.register( "testBar" );

		jQuery( "#first" ).load( url( "data/test.html" ), function() {
			assert.ok( jQuery( "#first" ).html().match( /^html text/ ), "Check content after loading html" );
			assert.strictEqual( jQuery( "#foo" ).html(), "foo", "Check if script evaluation has modified DOM" );
			assert.strictEqual( window[ "testFoo" ], "foo", "Check if script was evaluated after load" );
			setTimeout( verifyEvaluation, 600 );
		} );
	} );

	QUnit.asyncTest( "jQuery.fn.load( String, Function ) - check file with only a script tag", 3, function( assert ) {
		Globals.register( "testFoo" );

		jQuery( "#first" ).load( url( "data/test2.html" ), function() {
			assert.strictEqual( jQuery( "#foo" ).html(), "foo", "Check if script evaluation has modified DOM" );
			assert.strictEqual( window[ "testFoo" ], "foo", "Check if script was evaluated after load" );
			QUnit.start();
		} );
	} );

	QUnit.asyncTest( "jQuery.fn.load( String, Function ) - dataFilter in ajaxSettings", 2, function( assert ) {
		jQuery.ajaxSetup( {
			dataFilter: function() {
				return "Hello World";
			}
		} );
		jQuery( "<div/>" ).load( url( "data/name.html" ), function( responseText ) {
			assert.strictEqual( jQuery( this ).html(), "Hello World", "Test div was filled with filtered data" );
			assert.strictEqual( responseText, "Hello World", "Test callback receives filtered data" );
			QUnit.start();
		} );
	} );

	QUnit.asyncTest( "jQuery.fn.load( String, Object, Function )", 2, function( assert ) {
		jQuery( "<div />" ).load( url( "data/params_html.php" ), {
			"foo": 3,
			"bar": "ok"
		}, function() {
			var $post = jQuery( this ).find( "#post" );
			assert.strictEqual( $post.find( "#foo" ).text(), "3", "Check if a hash of data is passed correctly" );
			assert.strictEqual( $post.find( "#bar" ).text(), "ok", "Check if a hash of data is passed correctly" );
			QUnit.start();
		} );
	} );

	QUnit.test( "jQuery.fn.load( String, String, Function )", 2, function( assert ) {
		var done = assert.async();

		jQuery( "<div />" ).load( url( "data/params_html.php" ), "foo=3&bar=ok", function() {
			var $get = jQuery( this ).find( "#get" );
			assert.strictEqual( $get.find( "#foo" ).text(), "3", "Check if a string of data is passed correctly" );
			assert.strictEqual( $get.find( "#bar" ).text(), "ok", "Check if a   of data is passed correctly" );
			done();
		} );
	} );

	QUnit.test( "jQuery.fn.load() - callbacks get the correct parameters", 8, function( assert ) {
		var completeArgs = {};
		var done = assert.async();

		jQuery.ajaxSetup( {
			success: function( _, status, jqXHR ) {
				completeArgs[ this.url ] = [ jqXHR.responseText, status, jqXHR ];
			},
			error: function( jqXHR, status ) {
				completeArgs[ this.url ] = [ jqXHR.responseText, status, jqXHR ];
			}
		} );

		jQuery.when.apply(
			jQuery,
			jQuery.map( [
				{
					type: "success",
					url: "data/echoQuery.php?arg=pop"
				},
				{
					type: "error",
					url: "data/404.php"
				}
			],
			function( options ) {
				return jQuery.Deferred( function( defer ) {
					jQuery( "#foo" ).load( options.url, function() {
						var args = arguments;
						assert.strictEqual( completeArgs[ options.url ].length, args.length, "same number of arguments (" + options.type + ")" );
						jQuery.each( completeArgs[ options.url ], function( i, value ) {
							assert.strictEqual( args[ i ], value, "argument #" + i + " is the same (" + options.type + ")" );
						} );
						defer.resolve();
					} );
				} );
			} )
		).always( done );
	} );

	QUnit.test( "#2046 - jQuery.fn.load( String, Function ) with ajaxSetup on dataType json", 1, function( assert ) {
		var done = assert.async();

		jQuery.ajaxSetup( {
			dataType: "json"
		} );
		jQuery( document ).ajaxComplete( function( e, xml, s ) {
			assert.strictEqual( s.dataType, "html", "Verify the load() dataType was html" );
			jQuery( document ).off( "ajaxComplete" );
			done();
		} );
		jQuery( "#first" ).load( "data/test3.html" );
	} );

	QUnit.test( "#10524 - jQuery.fn.load() - data specified in ajaxSettings is merged in", 1, function( assert ) {
		var done = assert.async();

		var data = {
			"baz": 1
		};
		jQuery.ajaxSetup( {
			data: {
				"foo": "bar"
			}
		} );
		jQuery( "#foo" ).load( "data/echoQuery.php", data );
		jQuery( document ).ajaxComplete( function( event, jqXHR, options ) {
			assert.ok( ~options.data.indexOf( "foo=bar" ), "Data from ajaxSettings was used" );
			done();
		} );
	} );

// //----------- jQuery.post()

	QUnit.test( "jQuery.post() - data", 3, function( assert ) {
		var done = assert.async();

		jQuery.when(
			jQuery.post(
				url( "data/name.php" ),
				{
					xml: "5-2",
					length: 3
				},
				function( xml ) {
					jQuery( "math", xml ).each( function() {
						assert.strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
						assert.strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
					} );
				}
			),
			jQuery.ajax( {
				url: url( "data/echoData.php" ),
				type: "POST",
				data: {
					"test": {
						"length": 7,
						"foo": "bar"
					}
				},
				success: function( data ) {
					assert.strictEqual( data, "test%5Blength%5D=7&test%5Bfoo%5D=bar", "Check if a sub-object with a length param is serialized correctly" );
				}
			} )
		).always( function() {
			done();
		} );
	} );

	QUnit.test( "jQuery.post( String, Hash, Function ) - simple with xml", 4, function( assert ) {
		var done = assert.async();

		jQuery.when(
			jQuery.post(
				url( "data/name.php" ),
				{
					"xml": "5-2"
				},
				function( xml ) {
					jQuery( "math", xml ).each( function() {
						assert.strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
						assert.strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
					} );
				}
			),
			jQuery.post( url( "data/name.php?xml=5-2" ), {}, function( xml ) {
				jQuery( "math", xml ).each( function() {
					assert.strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
					assert.strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
				} );
			} )
		).always( function() {
			done();
		} );
	} );

	QUnit.test( "jQuery[get|post]( options ) - simple with xml", 2, function( assert ) {
		var done = assert.async();

		jQuery.when.apply( jQuery,
			jQuery.map( [ "get", "post" ], function( method ) {
				return jQuery[ method ]( {
					url: url( "data/name.php" ),
					data: {
						"xml": "5-2"
					},
					success: function( xml ) {
						jQuery( "math", xml ).each( function() {
							assert.strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
						} );
					}
				} );
			} )
		).always( function() {
			done();
		} );
	} );

//----------- jQuery.active

	QUnit.test( "jQuery.active", function( assert ) {
		assert.expect( 1 );
		assert.ok( jQuery.active === 0, "ajax active counter should be zero: " + jQuery.active );
	} );

} )();
