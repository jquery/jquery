module( "ajax", {
	setup: function() {
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
});

(function() {

	if ( !jQuery.ajax || ( isLocal && !hasPHP ) ) {
		return;
	}

	function addGlobalEvents( expected ) {
		return function() {
			expected = expected || "";
			jQuery( document ).on( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError ajaxSuccess", function( e ) {
				ok( expected.indexOf(e.type) !== -1, e.type );
			});
		};
	}

//----------- jQuery.ajax()

	ajaxTest( "jQuery.ajax() - success callbacks", 8, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess"),
		url: url("data/name.html"),
		beforeSend: function() {
			ok( true, "beforeSend" );
		},
		success: function() {
			ok( true, "success" );
		},
		complete: function() {
			ok( true, "complete");
		}
	});

	ajaxTest( "jQuery.ajax() - success callbacks - (url, options) syntax", 8, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess"),
		create: function( options ) {
			return jQuery.ajax( url("data/name.html"), options );
		},
		beforeSend: function() {
			ok( true, "beforeSend" );
		},
		success: function() {
			ok( true, "success" );
		},
		complete: function() {
			ok( true, "complete" );
		}
	});

	ajaxTest( "jQuery.ajax() - success callbacks (late binding)", 8, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess"),
		url: url("data/name.html"),
		beforeSend: function() {
			ok( true, "beforeSend" );
		},
		success: true,
		afterSend: function( request ) {
			request.complete(function() {
				ok( true, "complete" );
			}).success(function() {
				ok( true, "success" );
			}).error(function() {
				ok( false, "error" );
			});
		}
	});

	ajaxTest( "jQuery.ajax() - success callbacks (oncomplete binding)", 8, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess"),
		url: url("data/name.html"),
		beforeSend: function() {
			ok( true, "beforeSend" );
		},
		success: true,
		complete: function( xhr ) {
			xhr.complete(function() {
				ok( true, "complete" );
			}).success(function() {
				ok( true, "success" );
			}).error(function() {
				ok( false, "error" );
			});
		}
	});

	ajaxTest( "jQuery.ajax() - error callbacks", 8, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError"),
		url: url("data/name.php?wait=5"),
		beforeSend: function() {
			ok( true, "beforeSend" );
		},
		afterSend: function( request ) {
			request.abort();
		},
		error: function() {
			ok( true, "error" );
		},
		complete: function() {
			ok( true, "complete" );
		}
	});

	ajaxTest( "jQuery.ajax() - textStatus and errorThrown values", 4, [
		{
			url: url("data/name.php?wait=5"),
			error: function( _, textStatus, errorThrown ) {
				strictEqual( textStatus, "abort", "textStatus is 'abort' for abort" );
				strictEqual( errorThrown, "abort", "errorThrown is 'abort' for abort" );
			},
			afterSend: function( request ) {
				request.abort();
			}
		},
		{
			url: url("data/name.php?wait=5"),
			error: function( _, textStatus, errorThrown ) {
				strictEqual( textStatus, "mystatus", "textStatus is 'mystatus' for abort('mystatus')" );
				strictEqual( errorThrown, "mystatus", "errorThrown is 'mystatus' for abort('mystatus')" );
			},
			afterSend: function( request ) {
				request.abort("mystatus");
			}
		}
	]);

	ajaxTest( "jQuery.ajax() - responseText on error", 1, {
		url: url("data/errorWithText.php"),
		error: function( xhr ) {
			strictEqual( xhr.responseText, "plain text message", "Test jqXHR.responseText is filled for HTTP errors" );
		}
	});

	asyncTest( "jQuery.ajax() - retry with jQuery.ajax( this )", 2, function() {
		var previousUrl,
			firstTime = true;
		jQuery.ajax({
			url: url("data/errorWithText.php"),
			error: function() {
				if ( firstTime ) {
					firstTime = false;
					jQuery.ajax( this );
				} else {
					ok ( true, "Test retrying with jQuery.ajax(this) works" );
					jQuery.ajax({
						url: url("data/errorWithText.php"),
						data: {
							"x": 1
						},
						beforeSend: function() {
							if ( !previousUrl ) {
								previousUrl = this.url;
							} else {
								strictEqual( this.url, previousUrl, "url parameters are not re-appended" );
								start();
								return false;
							}
						},
						error: function() {
							jQuery.ajax( this );
						}
					});
				}
			}
		});
	});

	ajaxTest( "jQuery.ajax() - headers", 4, {
		setup: function() {
			jQuery( document ).ajaxSend(function( evt, xhr ) {
				xhr.setRequestHeader( "ajax-send", "test" );
			});
		},
		url: url("data/headers.php?keys=siMPle_SometHing-elsE_OthEr_ajax-send"),
		headers: {
			"siMPle": "value",
			"SometHing-elsE": "other value",
			"OthEr": "something else"
		},
		success: function( data, _, xhr ) {
			var i, emptyHeader,
				requestHeaders = jQuery.extend( this.headers, {
					"ajax-send": "test"
				}),
				tmp = [];
			for ( i in requestHeaders ) {
				tmp.push( i, ": ", requestHeaders[ i ], "\n" );
			}
			tmp = tmp.join("");

			strictEqual( data, tmp, "Headers were sent" );
			strictEqual( xhr.getResponseHeader("Sample-Header"), "Hello World", "Sample header received" );

			emptyHeader = xhr.getResponseHeader("Empty-Header");
			if ( emptyHeader === null ) {
				ok( true, "Firefox doesn't support empty headers" );
			} else {
				strictEqual( emptyHeader, "", "Empty header received" );
			}
			strictEqual( xhr.getResponseHeader("Sample-Header2"), "Hello World 2", "Second sample header received" );
		}
	});

	ajaxTest( "jQuery.ajax() - Accept header", 1, {
		url: url("data/headers.php?keys=accept"),
		headers: {
			Accept: "very wrong accept value"
		},
		beforeSend: function( xhr ) {
			xhr.setRequestHeader("Accept", "*/*");
		},
		success: function( data ) {
			strictEqual( data, "accept: */*\n", "Test Accept header is set to last value provided" );
		}
	});

	ajaxTest( "jQuery.ajax() - contentType", 2, [
		{
			url: url("data/headers.php?keys=content-type"),
			contentType: "test",
			success: function( data ) {
				strictEqual( data, "content-type: test\n", "Test content-type is sent when options.contentType is set" );
			}
		},
		{
			url: url("data/headers.php?keys=content-type"),
			contentType: false,
			success: function( data ) {
				strictEqual( data, "content-type: \n", "Test content-type is not sent when options.contentType===false" );
			}
		}
	]);

	ajaxTest( "jQuery.ajax() - protocol-less urls", 1, {
		url: "//somedomain.com",
		beforeSend: function( xhr, settings ) {
			equal( settings.url, location.protocol + "//somedomain.com", "Make sure that the protocol is added." );
			return false;
		},
		error: true
	});

	ajaxTest( "jQuery.ajax() - hash", 3, [
		{
			url: "data/name.html#foo",
			beforeSend: function( xhr, settings ) {
				equal( settings.url, "data/name.html", "Make sure that the URL is trimmed." );
				return false;
			},
			error: true
		},
		{
			url: "data/name.html?abc#foo",
			beforeSend: function( xhr, settings ) {
				equal( settings.url, "data/name.html?abc", "Make sure that the URL is trimmed." );
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
				equal( settings.url, "data/name.html?abc&test=123", "Make sure that the URL is trimmed." );
				return false;
			},
			error: true
		}
	]);

	ajaxTest( "jQuery.ajax() - cross-domain detection", 7, function() {
		function request( url, title, crossDomainOrOptions ) {
			return jQuery.extend( {
				dataType: "jsonp",
				url: url,
				beforeSend: function( _, s ) {
					ok( crossDomainOrOptions === false ? !s.crossDomain : s.crossDomain, title );
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
				loc.protocol + "//" + loc.host + ":" + samePort,
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
	});

	ajaxTest( "jQuery.ajax() - abort", 9, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxError ajaxComplete"),
		url: url("data/name.php?wait=5"),
		beforeSend: function() {
			ok( true, "beforeSend" );
		},
		afterSend: function( xhr ) {
			strictEqual( xhr.readyState, 1, "XHR readyState indicates successful dispatch" );
			xhr.abort();
			strictEqual( xhr.readyState, 0, "XHR readyState indicates successful abortion" );
		},
		error: true,
		complete: function() {
			ok( true, "complete" );
		}
	});

	ajaxTest( "jQuery.ajax() - events with context", 12, function() {

		var context = document.createElement("div");

		function event( e ) {
			equal( this, context, e.type );
		}

		function callback( msg ) {
			return function() {
				equal( this, context, "context is preserved on callback " + msg );
			};
		}

		return {
			setup: function() {
				jQuery( context ).appendTo("#foo")
					.ajaxSend( event )
					.ajaxComplete( event )
					.ajaxError( event )
					.ajaxSuccess( event );
			},
			requests: [{
				url: url("data/name.html"),
				context: context,
				beforeSend: callback("beforeSend"),
				success: callback("success"),
				complete: callback("complete")
			}, {
				url: url("data/404.html"),
				context: context,
				beforeSend: callback("beforeSend"),
				error: callback("error"),
				complete: callback("complete")
			}]
		};
	});

	ajaxTest( "jQuery.ajax() - events without context", 3, function() {
		function nocallback( msg ) {
			return function() {
				equal( typeof this.url, "string", "context is settings on callback " + msg );
			};
		}
		return {
			url: url("data/404.html"),
			beforeSend: nocallback("beforeSend"),
			error: nocallback("error"),
			complete:  nocallback("complete")
		};
	});

	ajaxTest( "jQuery.ajax() - context modification", 1, {
		url: url("data/name.html"),
		context: {},
		beforeSend: function() {
			this.test = "foo";
		},
		afterSend: function() {
			strictEqual( this.context.test, "foo", "Make sure the original object is maintained." );
		},
		success: true
	});

	ajaxTest( "jQuery.ajax() - context modification through ajaxSetup", 3, function() {
		var obj = {};
		return {
			setup: function() {
				jQuery.ajaxSetup({
					context: obj
				});
				strictEqual( jQuery.ajaxSettings.context, obj, "Make sure the context is properly set in ajaxSettings." );
			},
			requests: [{
				url: url("data/name.html"),
				success: function() {
					strictEqual( this, obj, "Make sure the original object is maintained." );
				}
			}, {
				url: url("data/name.html"),
				context: {},
				success: function() {
					ok( this !== obj, "Make sure overriding context is possible." );
				}
			}]
		};
	});

	ajaxTest( "jQuery.ajax() - disabled globals", 3, {
		setup: addGlobalEvents(""),
		global: false,
		url: url("data/name.html"),
		beforeSend: function() {
			ok( true, "beforeSend" );
		},
		success: function() {
			ok( true, "success" );
		},
		complete: function() {
			ok( true, "complete" );
		}
	});

	ajaxTest( "jQuery.ajax() - xml: non-namespace elements inside namespaced elements", 3, {
		url: url("data/with_fries.xml"),
		dataType: "xml",
		success: function( resp ) {
			equal( jQuery( "properties", resp ).length, 1, "properties in responseXML" );
			equal( jQuery( "jsconf", resp ).length, 1, "jsconf in responseXML" );
			equal( jQuery( "thing", resp ).length, 2, "things in responseXML" );
		}
	});

	ajaxTest( "jQuery.ajax() - xml: non-namespace elements inside namespaced elements (over JSONP)", 3, {
		url: url("data/with_fries_over_jsonp.php"),
		dataType: "jsonp xml",
		success: function( resp ) {
			equal( jQuery( "properties", resp ).length, 1, "properties in responseXML" );
			equal( jQuery( "jsconf", resp ).length, 1, "jsconf in responseXML" );
			equal( jQuery( "thing", resp ).length, 2, "things in responseXML" );
		}
	});

	ajaxTest( "jQuery.ajax() - HEAD requests", 2, [
		{
			url: url("data/name.html"),
			type: "HEAD",
			success: function( data, status, xhr ) {
				ok( /Date/i.test( xhr.getAllResponseHeaders() ), "No Date in HEAD response" );
			}
		},
		{
			url: url("data/name.html"),
			data: {
				"whip_it": "good"
			},
			type: "HEAD",
			success: function( data, status, xhr ) {
				ok( /Date/i.test( xhr.getAllResponseHeaders() ), "No Date in HEAD response with data" );
			}
		}
	]);

	ajaxTest( "jQuery.ajax() - beforeSend", 1, {
		url: url("data/name.html"),
		beforeSend: function() {
			this.check = true;
		},
		success: function() {
			ok( this.check, "check beforeSend was executed" );
		}
	});

	ajaxTest( "jQuery.ajax() - beforeSend, cancel request manually", 2, {
		create: function() {
			return jQuery.ajax({
				url: url("data/name.html"),
				beforeSend: function( xhr ) {
					ok( true, "beforeSend got called, canceling" );
					xhr.abort();
				},
				success: function() {
					ok( false, "request didn't get canceled" );
				},
				complete: function() {
					ok( false, "request didn't get canceled" );
				},
				error: function() {
					ok( false, "request didn't get canceled" );
				}
			});
		},
		fail: function( _, reason ) {
			strictEqual( reason, "canceled", "canceled request must fail with 'canceled' status text" );
		}
	});

	ajaxTest( "jQuery.ajax() - dataType html", 5, {
		setup: function() {
			Globals.register("testFoo");
			Globals.register("testBar");
		},
		dataType: "html",
		url: url("data/test.html"),
		success: function( data ) {
			ok( data.match( /^html text/ ), "Check content for datatype html" );
			jQuery("#ap").html( data );
			strictEqual( window["testFoo"], "foo", "Check if script was evaluated for datatype html" );
			strictEqual( window["testBar"], "bar", "Check if script src was evaluated for datatype html" );
		}
	});

	ajaxTest( "jQuery.ajax() - synchronous request", 1, {
		url: url("data/json_obj.js"),
		dataType: "text",
		async: false,
		success: true,
		afterSend: function( xhr ) {
			ok( /^\{ "data"/.test( xhr.responseText ), "check returned text" );
		}
	});

	ajaxTest( "jQuery.ajax() - synchronous request with callbacks", 2, {
		url: url("data/json_obj.js"),
		async: false,
		dataType: "text",
		success: true,
		afterSend: function( xhr ) {
			var result;
			xhr.done(function( data ) {
				ok( true, "success callback executed" );
				result = data;
			});
			ok( /^\{ "data"/.test( result ), "check returned text" );
		}
	});

	asyncTest( "jQuery.ajax(), jQuery.get[Script|JSON](), jQuery.post(), pass-through request object", 8, function() {
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
		});
		jQuery( document ).one( "ajaxStop", function() {
			equal( successCount, 5, "Check all ajax calls successful" );
			equal( errorCount, 0, "Check no ajax errors (status" + errorEx + ")" );
			jQuery( document ).off("ajaxError.passthru");
			start();
		});
		Globals.register("testBar");

		ok( jQuery.get( url(target), success ), "get" );
		ok( jQuery.post( url(target), success ), "post" );
		ok( jQuery.getScript( url("data/test.js"), success ), "script" );
		ok( jQuery.getJSON( url("data/json_obj.js"), success ), "json" );
		ok( jQuery.ajax({
			url: url( target ),
			success: success
		}), "generic" );
	});

	ajaxTest( "jQuery.ajax() - cache", 12, function() {

		var re = /_=(.*?)(&|$)/g;

		function request( url, title ) {
			return {
				url: url,
				cache: false,
				beforeSend: function() {
					var parameter, tmp;
					while(( tmp = re.exec( this.url ) )) {
						strictEqual( parameter, undefined, title + ": only one 'no-cache' parameter" );
						parameter = tmp[ 1 ];
						notStrictEqual( parameter, "tobereplaced555", title + ": parameter (if it was there) was replaced" );
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
	});

	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {

		ajaxTest( "jQuery.ajax() - JSONP - Query String (?n)" + label, 4, [
			{
				url: "data/jsonp.php?callback=?",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, url callback)" );
				}
			},
			{
				url: "data/jsonp.php?callback=??",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, url context-free callback)" );
				}
			},
			{
				url: "data/jsonp.php/??",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, REST-like)" );
				}
			},
			{
				url: "data/jsonp.php/???json=1",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					strictEqual( jQuery.type( data ), "array", "JSON results returned (GET, REST-like with param)" );
				}
			}
		]);

		ajaxTest( "jQuery.ajax() - JSONP - Explicit callback param" + label, 9, {
			setup: function() {
				Globals.register("functionToCleanUp");
				Globals.register("XXX");
				Globals.register("jsonpResults");
				window["jsonpResults"] = function( data ) {
					ok( data["data"], "JSON results returned (GET, custom callback function)" );
				};
			},
			requests: [{
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				jsonp: "callback",
				success: function( data ) {
					ok( data["data"], "JSON results returned (GET, data obj callback)" );
				}
			}, {
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				jsonpCallback: "jsonpResults",
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, custom callback name)" );
				}
			}, {
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				jsonpCallback: "functionToCleanUp",
				success: function( data ) {
					ok( data["data"], "JSON results returned (GET, custom callback name to be cleaned up)" );
					strictEqual( window["functionToCleanUp"], undefined, "Callback was removed (GET, custom callback name to be cleaned up)" );
					var xhr;
					jQuery.ajax({
						url: "data/jsonp.php",
						dataType: "jsonp",
						crossDomain: crossDomain,
						jsonpCallback: "functionToCleanUp",
						beforeSend: function( jqXHR ) {
							xhr = jqXHR;
							return false;
						}
					});
					xhr.fail(function() {
						ok( true, "Ajax error JSON (GET, custom callback name to be cleaned up)" );
						strictEqual( window["functionToCleanUp"], undefined, "Callback was removed after early abort (GET, custom callback name to be cleaned up)" );
					});
				}
			}, {
				url: "data/jsonp.php?callback=XXX",
				dataType: "jsonp",
				jsonp: false,
				jsonpCallback: "XXX",
				crossDomain: crossDomain,
				beforeSend: function() {
					ok( /^data\/jsonp.php\?callback=XXX&_=\d+$/.test( this.url ), "The URL wasn't messed with (GET, custom callback name with no url manipulation)" );
				},
				success: function( data ) {
					ok( data["data"], "JSON results returned (GET, custom callback name with no url manipulation)" );
				}
			}]
		});

		ajaxTest( "jQuery.ajax() - JSONP - Callback in data" + label, 2, [
			{
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				data: "callback=?",
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, data callback)" );
				}
			},
			{
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				data: "callback=??",
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, data context-free callback)" );
				}
			}
		]);


		ajaxTest( "jQuery.ajax() - JSONP - POST" + label, 3, [
			{
				type: "POST",
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data["data"], "JSON results returned (POST, no callback)" );
				}
			},
			{
				type: "POST",
				url: "data/jsonp.php",
				data: "callback=?",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data["data"], "JSON results returned (POST, data callback)" );
				}
			},
			{
				type: "POST",
				url: "data/jsonp.php",
				jsonp: "callback",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data["data"], "JSON results returned (POST, data obj callback)" );
				}
			}
		]);

		ajaxTest( "jQuery.ajax() - JSONP" + label, 3, [
			{
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: function( data ) {
					ok( data.data, "JSON results returned (GET, no callback)" );
				}
			},
			{
				create: function( options ) {
					var request = jQuery.ajax( options ),
						promise = request.then(function( data ) {
							ok( data.data, "first request: JSON results returned (GET, no callback)" );
							request = jQuery.ajax( this ).done(function( data ) {
								ok( data.data, "this re-used: JSON results returned (GET, no callback)" );
							});
							promise.abort = request.abort;
							return request;
						});
					promise.abort = request.abort;
					return promise;
				},
				url: "data/jsonp.php",
				dataType: "jsonp",
				crossDomain: crossDomain,
				success: true
			}
		]);

	});

	ajaxTest( "jQuery.ajax() - script, Remote", 2, {
		setup: function() {
			Globals.register("testBar");
		},
		url: window.location.href.replace( /[^\/]*$/, "" ) + "data/test.js",
		dataType: "script",
		success: function() {
			strictEqual( window["testBar"], "bar", "Script results returned (GET, no callback)" );
		}
	});

	ajaxTest( "jQuery.ajax() - script, Remote with POST", 3, {
		setup: function() {
			Globals.register("testBar");
		},
		url: window.location.href.replace( /[^\/]*$/, "" ) + "data/test.js",
		type: "POST",
		dataType: "script",
		success: function( data, status ) {
			strictEqual( window["testBar"], "bar", "Script results returned (POST, no callback)" );
			strictEqual( status, "success", "Script results returned (POST, no callback)" );
		}
	});

	ajaxTest( "jQuery.ajax() - script, Remote with scheme-less URL", 2, {
		setup: function() {
			Globals.register("testBar");
		},
		url: window.location.href.replace( /[^\/]*$/, "" ).replace( /^.*?\/\//, "//" ) + "data/test.js",
		dataType: "script",
		success: function() {
			strictEqual( window["testBar"], "bar", "Script results returned (GET, no callback)" );
		}
	});

	ajaxTest( "jQuery.ajax() - malformed JSON", 2, {
		url: "data/badjson.js",
		dataType: "json",
		error: function( xhr, msg, detailedMsg ) {
			strictEqual( msg, "parsererror", "A parse error occurred." );
			ok( /(invalid|error|exception)/i.test( detailedMsg ), "Detailed parsererror message provided" );
		}
	});

	ajaxTest( "jQuery.ajax() - script by content-type", 2, [
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
	]);

	ajaxTest( "jQuery.ajax() - JSON by content-type", 5, {
		url: "data/json.php",
		data: {
			"header": "json",
			"json": "array"
		},
		success: function( json ) {
			ok( json.length >= 2, "Check length" );
			strictEqual( json[ 0 ]["name"], "John", "Check JSON: first, name" );
			strictEqual( json[ 0 ]["age"], 21, "Check JSON: first, age" );
			strictEqual( json[ 1 ]["name"], "Peter", "Check JSON: second, name" );
			strictEqual( json[ 1 ]["age"], 25, "Check JSON: second, age" );
		}
	});

	ajaxTest( "jQuery.ajax() - JSON by content-type disabled with options", 6, {
		url: url("data/json.php"),
		data: {
			"header": "json",
			"json": "array"
		},
		contents: {
			"json": false
		},
		success: function( text ) {
			strictEqual( typeof text, "string", "json wasn't auto-determined" );
			var json = jQuery.parseJSON( text );
			ok( json.length >= 2, "Check length");
			strictEqual( json[ 0 ]["name"], "John", "Check JSON: first, name" );
			strictEqual( json[ 0 ]["age"], 21, "Check JSON: first, age" );
			strictEqual( json[ 1 ]["name"], "Peter", "Check JSON: second, name" );
			strictEqual( json[ 1 ]["age"], 25, "Check JSON: second, age" );
		}
	});

	ajaxTest( "jQuery.ajax() - simple get", 1, {
		type: "GET",
		url: url("data/name.php?name=foo"),
		success: function( msg ) {
			strictEqual( msg, "bar", "Check for GET" );
		}
	});

	ajaxTest( "jQuery.ajax() - simple post", 1, {
		type: "POST",
		url: url("data/name.php"),
		data: "name=peter",
		success: function( msg ) {
			strictEqual( msg, "pan", "Check for POST" );
		}
	});

	ajaxTest( "jQuery.ajax() - data option - empty bodies for non-GET requests", 1, {
		url: "data/echoData.php",
		data: undefined,
		type: "post",
		success: function( result ) {
			strictEqual( result, "" );
		}
	});

	var ifModifiedNow = new Date();

	jQuery.each(
		/* jQuery.each arguments start */
		{
			" (cache)": true,
			" (no cache)": false
		},
		function( label, cache ) {
			var isOpera = !!window.opera;

			asyncTest( "jQuery.ajax() - If-Modified-Since support" + label, 3, function() {
				var url = "data/if_modified_since.php?ts=" + ifModifiedNow++;

				jQuery.ajax({
					url: url,
					ifModified: true,
					cache: cache,
					success: function( data, status ) {
						strictEqual( status, "success" );

						jQuery.ajax({
							url: url,
							ifModified: true,
							cache: cache,
							success: function( data, status ) {
								if ( data === "FAIL" ) {
									ok( isOpera, "Opera is incapable of doing .setRequestHeader('If-Modified-Since')." );
									ok( isOpera, "Opera is incapable of doing .setRequestHeader('If-Modified-Since')." );
								} else {
									strictEqual( status, "notmodified" );
									ok( data == null, "response body should be empty" );
								}
								start();
							},
							error: function() {
								// Do this because opera simply refuses to implement 304 handling :(
								// A feature-driven way of detecting this would be appreciated
								// See: http://gist.github.com/599419
								ok( isOpera, "error" );
								ok( isOpera, "error" );
								start();
							}
						});
					},
					error: function() {
						strictEqual( false, "error" );
						// Do this because opera simply refuses to implement 304 handling :(
						// A feature-driven way of detecting this would be appreciated
						// See: http://gist.github.com/599419
						ok( isOpera, "error" );
						start();
					}
				});
			});

			asyncTest( "jQuery.ajax() - Etag support" + label, 3, function() {
				var url = "data/etag.php?ts=" + ifModifiedNow++;

				jQuery.ajax({
					url: url,
					ifModified: true,
					cache: cache,
					success: function( data, status ) {
						strictEqual( status, "success" );

						jQuery.ajax({
							url: url,
							ifModified: true,
							cache: cache,
							success: function( data, status ) {
								if ( data === "FAIL" ) {
									ok( isOpera, "Opera is incapable of doing .setRequestHeader('If-None-Match')." );
									ok( isOpera, "Opera is incapable of doing .setRequestHeader('If-None-Match')." );
								} else {
									strictEqual( status, "notmodified" );
									ok( data == null, "response body should be empty" );
								}
								start();
							},
							error: function() {
								// Do this because opera simply refuses to implement 304 handling :(
								// A feature-driven way of detecting this would be appreciated
								// See: http://gist.github.com/599419
								ok( isOpera, "error" );
								ok( isOpera, "error" );
								start();
							}
						});
					},
					error: function() {
						// Do this because opera simply refuses to implement 304 handling :(
						// A feature-driven way of detecting this would be appreciated
						// See: http://gist.github.com/599419
						ok( isOpera, "error" );
						start();
					}
				});
			});
		}
		/* jQuery.each arguments end */
	);

	ajaxTest( "jQuery.ajax() - failing cross-domain (non-existing)", 1, {
		// see RFC 2606
		url: "http://example.invalid",
		error: function( xhr, _, e ) {
			ok( true, "file not found: " + xhr.status + " => " + e );
		}
	});

	ajaxTest( "jQuery.ajax() - failing cross-domain", 1, {
		url: "http://" + externalHost,
		error: function( xhr, _, e ) {
			ok( true, "access denied: " + xhr.status + " => " + e );
		}
	});

	ajaxTest( "jQuery.ajax() - atom+xml", 1, {
		url: url("data/atom+xml.php"),
		success: function() {
			ok( true, "success" );
		}
	});

	asyncTest( "jQuery.ajax() - statusText", 3, function() {
		jQuery.ajax( url("data/statusText.php?status=200&text=Hello") ).done(function( _, statusText, jqXHR ) {
			strictEqual( statusText, "success", "callback status text ok for success" );
			ok( jqXHR.statusText === "Hello" || jqXHR.statusText === "OK", "jqXHR status text ok for success (" + jqXHR.statusText + ")" );
			jQuery.ajax( url("data/statusText.php?status=404&text=World") ).fail(function( jqXHR, statusText ) {
				strictEqual( statusText, "error", "callback status text ok for error" );
				// ok( jqXHR.statusText === "World" || jQuery.browser.safari && jqXHR.statusText === "Not Found", "jqXHR status text ok for error (" + jqXHR.statusText + ")" );
				start();
			});
		});
	});

	asyncTest( "jQuery.ajax() - statusCode", 20, function() {

		var count = 12;

		function countComplete() {
			if ( ! --count ) {
				start();
			}
		}

		function createStatusCodes( name, isSuccess ) {
			name = "Test " + name + " " + ( isSuccess ? "success" : "error" );
			return {
				200: function() {
					ok( isSuccess, name );
				},
				404: function() {
					ok( !isSuccess, name );
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

				jQuery.ajax( url(uri), {
					statusCode: createStatusCodes( "in options", isSuccess ),
					complete: countComplete
				});

				jQuery.ajax( url(uri), {
					complete: countComplete
				}).statusCode( createStatusCodes("immediately with method", isSuccess) );

				jQuery.ajax( url(uri), {
					complete: function( jqXHR ) {
						jqXHR.statusCode( createStatusCodes("on complete", isSuccess) );
						countComplete();
					}
				});

				jQuery.ajax( url(uri), {
					complete: function( jqXHR ) {
						setTimeout(function() {
							jqXHR.statusCode( createStatusCodes("very late binding", isSuccess) );
							countComplete();
						}, 100 );
					}
				});

				jQuery.ajax( url(uri), {
					statusCode: createStatusCodes( "all (options)", isSuccess ),
					complete: function( jqXHR ) {
						jqXHR.statusCode( createStatusCodes("all (on complete)", isSuccess) );
						setTimeout(function() {
							jqXHR.statusCode( createStatusCodes("all (very late binding)", isSuccess) );
							countComplete();
						}, 100 );
					}
				}).statusCode( createStatusCodes("all (immediately with method)", isSuccess) );

				var testString = "";

				jQuery.ajax( url(uri), {
					success: function( a, b, jqXHR ) {
						ok( isSuccess, "success" );
						var statusCode = {};
						statusCode[ jqXHR.status ] = function() {
							testString += "B";
						};
						jqXHR.statusCode( statusCode );
						testString += "A";
					},
					error: function( jqXHR ) {
						ok( !isSuccess, "error" );
						var statusCode = {};
						statusCode[ jqXHR.status ] = function() {
							testString += "B";
						};
						jqXHR.statusCode( statusCode );
						testString += "A";
					},
					complete: function() {
						strictEqual(
							testString,
							"AB",
							"Test statusCode callbacks are ordered like " + ( isSuccess ? "success" :  "error" ) + " callbacks"
						);
						countComplete();
					}
				});

			}
			/* jQuery.each arguments end*/
		);
	});

	ajaxTest( "jQuery.ajax() - transitive conversions", 8, [
		{
			url: url("data/json.php"),
			converters: {
				"json myJson": function( data ) {
					ok( true, "converter called" );
					return data;
				}
			},
			dataType: "myJson",
			success: function() {
				ok( true, "Transitive conversion worked" );
				strictEqual( this.dataTypes[ 0 ], "text", "response was retrieved as text" );
				strictEqual( this.dataTypes[ 1 ], "myjson", "request expected myjson dataType" );
			}
		},
		{
			url: url("data/json.php"),
			converters: {
				"json myJson": function( data ) {
					ok( true, "converter called (*)" );
					return data;
				}
			},
			contents: false, /* headers are wrong so we ignore them */
			dataType: "* myJson",
			success: function() {
				ok( true, "Transitive conversion worked (*)" );
				strictEqual( this.dataTypes[ 0 ], "text", "response was retrieved as text (*)" );
				strictEqual( this.dataTypes[ 1 ], "myjson", "request expected myjson dataType (*)" );
			}
		}
	]);

	ajaxTest( "jQuery.ajax() - overrideMimeType", 2, [
		{
			url: url("data/json.php"),
			beforeSend: function( xhr ) {
				xhr.overrideMimeType( "application/json" );
			},
			success: function( json ) {
				ok( json.data, "Mimetype overridden using beforeSend" );
			}
		},
		{
			url: url("data/json.php"),
			mimeType: "application/json",
			success: function( json ) {
				ok( json.data, "Mimetype overridden using mimeType option" );
			}
		}
	]);

	ajaxTest( "jQuery.ajax() - empty json gets to error callback instead of success callback.", 1, {
		url: url("data/echoData.php"),
		error: function( _, __, error ) {
			equal( typeof error === "object", true,  "Didn't get back error object for empty json response" );
		},
		dataType: "json"
	});

	ajaxTest( "#2688 - jQuery.ajax() - beforeSend, cancel request", 2, {
		create: function() {
			return jQuery.ajax({
				url: url("data/name.html"),
				beforeSend: function() {
					ok( true, "beforeSend got called, canceling" );
					return false;
				},
				success: function() {
					ok( false, "request didn't get canceled" );
				},
				complete: function() {
					ok( false, "request didn't get canceled" );
				},
				error: function() {
					ok( false, "request didn't get canceled" );
				}
			});
		},
		fail: function( _, reason ) {
			strictEqual( reason, "canceled", "canceled request must fail with 'canceled' status text" );
		}
	});

	ajaxTest( "#2806 - jQuery.ajax() - data option - evaluate function values", 1, {
		url: "data/echoQuery.php",
		data: {
			key: function() {
				return "value";
			}
		},
		success: function( result ) {
			strictEqual( result, "key=value" );
		}
	});

	test( "#7531 - jQuery.ajax() - Location object as url", 1, function () {
		var xhr,
			success = false;
		try {
			xhr = jQuery.ajax({
				url: window.location
			});
			success = true;
			xhr.abort();
		} catch (e) {

		}
		ok( success, "document.location did not generate exception" );
	});

	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {
		ajaxTest( "#7578 - jQuery.ajax() - JSONP - default for cache option" + label, 1, {
			url: "data/jsonp.php",
			dataType: "jsonp",
			crossDomain: crossDomain,
			beforeSend: function() {
				strictEqual( this.cache, false, "cache must be false on JSON request" );
				return false;
			},
			error: true
		});
	});

	ajaxTest( "#8107 - jQuery.ajax() - multiple method signatures introduced in 1.5", 4, [
		{
			create: function() {
				return jQuery.ajax();
			},
			done: function() {
				ok( true, "With no arguments" );
			}
		},
		{
			create: function() {
				return jQuery.ajax("data/name.html");
			},
			done: function() {
				ok( true, "With only string URL argument" );
			}
		},
		{
			create: function() {
				return jQuery.ajax( "data/name.html", {});
			},
			done: function() {
				ok( true, "With string URL param and map" );
			}
		},
		{
			create: function( options ) {
				return jQuery.ajax( options );
			},
			url: "data/name.html",
			success: function() {
				ok( true, "With only map" );
			}
		}
	]);

	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {
		ajaxTest( "#8205 - jQuery.ajax() - JSONP - re-use callbacks name" + label, 2, {
			url: "data/jsonp.php",
			dataType: "jsonp",
			crossDomain: crossDomain,
			beforeSend: function( jqXHR, s ) {
				s.callback = s.jsonpCallback;
			},
			success: function() {
				var previous = this;
				strictEqual( previous.jsonpCallback, undefined, "jsonpCallback option is set back to default in callbacks" );
				jQuery.ajax({
					url: "data/jsonp.php",
					dataType: "jsonp",
					crossDomain: crossDomain,
					beforeSend: function() {
						strictEqual( this.jsonpCallback, previous.callback, "JSONP callback name is re-used" );
						return false;
					}
				});
			}
		});
	});

	test( "#9887 - jQuery.ajax() - Context with circular references (#9887)", 2, function () {
		var success = false,
			context = {};
		context.field = context;
		try {
			jQuery.ajax( "non-existing", {
				context: context,
				beforeSend: function() {
					ok( this === context, "context was not deep extended" );
					return false;
				}
			});
			success = true;
		} catch ( e ) {
			console.log( e );
		}
		ok( success, "context with circular reference did not generate an exception" );
	});

	jQuery.each( [ "as argument", "in settings object" ], function( inSetting, title ) {

		function request( url, test ) {
			return {
				create: function() {
					return jQuery.ajax( inSetting ? { url: url } : url );
				},
				done: function() {
					ok( true, ( test || url ) + " " + title );
				}
			};
		}

		ajaxTest( "#10093 - jQuery.ajax() - falsy url " + title, 4, [
			request( "", "empty string" ),
			request( false ),
			request( null ),
			request( undefined )
		]);

	});

	ajaxTest( "#11151 - jQuery.ajax() - parse error body", 2, {
		url: url("data/errorWithJSON.php"),
		dataFilter: function( string ) {
			ok( false, "dataFilter called" );
			return string;
		},
		error: function( jqXHR ) {
			strictEqual( jqXHR.responseText, "{ \"code\": 40, \"message\": \"Bad Request\" }", "Error body properly set" );
			deepEqual( jqXHR.responseJSON, { code: 40, message: "Bad Request" }, "Error body properly parsed" );
		}
	});

	ajaxTest( "#11426 - jQuery.ajax() - loading binary data shouldn't throw an exception in IE", 1, {
		url: url("data/1x1.jpg"),
		success: function( data ) {
			ok( data === undefined || /JFIF/.test( data ), "success callback reached" );
		}
	});

	test( "#11743 - jQuery.ajax() - script, throws exception", 1, function() {
		raises(function() {
			jQuery.ajax({
				url: "data/badjson.js",
				dataType: "script",
				throws: true,
				// TODO find a way to test this asynchronously, too
				async: false,
				// Global events get confused by the exception
				global: false,
				success: function() {
					ok( false, "Success." );
				},
				error: function() {
					ok( false, "Error." );
				}
			});
		}, "exception bubbled" );
	});

	jQuery.each( [ "method", "type" ], function( _, globalOption ) {

		function request( option ) {
			var options = {
					url: url("data/echoData.php"),
					data: "hello",
					success: function( msg ) {
						strictEqual( msg, "hello", "Check for POST (no override)" );
					}
				};
			if ( option ) {
				options[ option ] = "GET";
				options.success = function( msg ) {
					strictEqual( msg, "", "Check for no POST (overriding with " + option + ")" );
				};
			}
			return options;
		}

		ajaxTest( "#12004 - jQuery.ajax() - method is an alias of type - " + globalOption + " set globally", 3, {
			setup: function() {
				var options = {};
				options[ globalOption ] = "POST";
				jQuery.ajaxSetup( options );
			},
			requests: [
				request("type"),
				request("method"),
				request()
			]
		});

	});

	ajaxTest( "#13276 - jQuery.ajax() - compatibility between XML documents from ajax requests and parsed string", 1, {
		url: "data/dashboard.xml",
		dataType: "xml",
		success: function( ajaxXML ) {
			var parsedXML = jQuery( jQuery.parseXML("<tab title=\"Added\">blibli</tab>") ).find("tab");
			ajaxXML = jQuery( ajaxXML );
			try {
				ajaxXML.find("infowindowtab").append( parsedXML );
			} catch( e ) {
				strictEqual( e, undefined, "error" );
				return;
			}
			strictEqual( ajaxXML.find("tab").length, 3, "Parsed node was added properly" );
		}
	});

	ajaxTest( "#13292 - jQuery.ajax() - converter is bypassed for 204 requests", 3, {
		url: "data/nocontent.php",
		dataType: "testing",
		converters: {
			"* testing": function() {
				throw "converter was called";
			}
		},
		success: function( data, status, jqXHR ) {
			strictEqual( jqXHR.status, 204, "status code is 204" );
			strictEqual( status, "nocontent", "status text is 'nocontent'" );
			strictEqual( data, undefined, "data is undefined" );
		},
		error: function( _, status, error ) {
			ok( false, "error" );
			strictEqual( status, "parsererror", "Parser Error" );
			strictEqual( error, "converter was called", "Converter was called" );
		}
	});

	ajaxTest( "#13388 - jQuery.ajax() - responseXML", 3, {
		url: url("data/with_fries.xml"),
		dataType: "xml",
		success: function( resp, _, jqXHR ) {
			notStrictEqual( resp, undefined, "XML document exists" );
			ok( "responseXML" in jqXHR, "jqXHR.responseXML exists" );
			strictEqual( resp, jqXHR.responseXML, "jqXHR.responseXML is set correctly" );
		}
	});

	ajaxTest( "#13922 - jQuery.ajax() - converter is bypassed for HEAD requests", 3, {
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
			ok( true, "success" );
			strictEqual( status, "nocontent", "data is undefined" );
			strictEqual( data, undefined, "data is undefined" );
		},
		error: function( _, status, error ) {
			ok( false, "error" );
			strictEqual( status, "parsererror", "Parser Error" );
			strictEqual( error, "converter was called", "Converter was called" );
		}
	} );

//----------- jQuery.ajaxPrefilter()

	ajaxTest( "jQuery.ajaxPrefilter() - abort", 1, {
		setup: function() {
			jQuery.ajaxPrefilter(function( options, _, jqXHR ) {
				if ( options.abortInPrefilter ) {
					jqXHR.abort();
				}
			});
		},
		abortInPrefilter: true,
		error: function() {
			ok( false, "error callback called" );
		},
		fail: function( _, reason ) {
			strictEqual( reason, "canceled", "Request aborted by the prefilter must fail with 'canceled' status text" );
		}
	});

//----------- jQuery.ajaxSetup()

	asyncTest( "jQuery.ajaxSetup()", 1, function() {
		jQuery.ajaxSetup({
			url: url("data/name.php?name=foo"),
			success: function( msg ) {
				strictEqual( msg, "bar", "Check for GET" );
				start();
			}
		});
		jQuery.ajax();
	});

	asyncTest( "jQuery.ajaxSetup({ timeout: Number }) - with global timeout", 2, function() {
		var passed = 0,
			pass = function() {
				ok( passed++ < 2, "Error callback executed" );
				if ( passed === 2 ) {
					jQuery( document ).off("ajaxError.setupTest");
					start();
				}
			},
			fail = function( a, b ) {
				ok( false, "Check for timeout failed " + a + " " + b );
				start();
			};

		jQuery( document ).on( "ajaxError.setupTest", pass );

		jQuery.ajaxSetup({
			timeout: 1000
		});

		jQuery.ajax({
			type: "GET",
			url: url("data/name.php?wait=5"),
			error: pass,
			success: fail
		});
	});

	asyncTest( "jQuery.ajaxSetup({ timeout: Number }) with localtimeout", 1, function() {
		jQuery.ajaxSetup({
			timeout: 50
		});
		jQuery.ajax({
			type: "GET",
			timeout: 15000,
			url: url("data/name.php?wait=1"),
			error: function() {
				ok( false, "Check for local timeout failed" );
				start();
			},
			success: function() {
				ok( true, "Check for local timeout" );
				start();
			}
		});
	});

//----------- jQuery.domManip()

	test( "#11264 - jQuery.domManip() - no side effect because of ajaxSetup or global events", 1, function() {
		jQuery.ajaxSetup({
			type: "POST"
		});

		jQuery( document ).on( "ajaxStart ajaxStop", function() {
			ok( false, "Global event triggered" );
		});

		jQuery("#qunit-fixture").append("<script src='data/evalScript.php'></script>");

		jQuery( document ).off("ajaxStart ajaxStop");
	});

	asyncTest( "#11402 - jQuery.domManip() - script in comments are properly evaluated", 2, function() {
		jQuery("#qunit-fixture").load( "data/cleanScript.html", start );
	});

//----------- jQuery.get()

	asyncTest( "jQuery.get( String, Hash, Function ) - parse xml and use text() on nodes", 2, function() {
		jQuery.get( url("data/dashboard.xml"), function( xml ) {
			var content = [];
			jQuery( "tab", xml ).each(function() {
				content.push( jQuery( this ).text() );
			});
			strictEqual( content[ 0 ], "blabla", "Check first tab" );
			strictEqual( content[ 1 ], "blublu", "Check second tab" );
			start();
		});
	});

	asyncTest( "#8277 - jQuery.get( String, Function ) - data in ajaxSettings", 1, function() {
		jQuery.ajaxSetup({
			data: "helloworld"
		});
		jQuery.get( url("data/echoQuery.php"), function( data ) {
			ok( /helloworld$/.test( data ), "Data from ajaxSettings was used" );
			start();
		});
	});

//----------- jQuery.getJSON()

	asyncTest( "jQuery.getJSON( String, Hash, Function ) - JSON array", 5, function() {
		jQuery.getJSON(
			url("data/json.php"),
			{
				"json": "array"
			},
			function( json ) {
				ok( json.length >= 2, "Check length" );
				strictEqual( json[ 0 ]["name"], "John", "Check JSON: first, name" );
				strictEqual( json[ 0 ]["age"], 21, "Check JSON: first, age" );
				strictEqual( json[ 1 ]["name"], "Peter", "Check JSON: second, name" );
				strictEqual( json[ 1 ]["age"], 25, "Check JSON: second, age" );
				start();
			}
		);
	});

	asyncTest( "jQuery.getJSON( String, Function ) - JSON object", 2, function() {
		jQuery.getJSON( url("data/json.php"), function( json ) {
			if ( json && json["data"] ) {
				strictEqual( json["data"]["lang"], "en", "Check JSON: lang" );
				strictEqual( json["data"].length, 25, "Check JSON: length" );
				start();
			}
		});
	});

	asyncTest( "jQuery.getJSON() - Using Native JSON", 2, function() {
		var restore = "JSON" in window,
			old = window.JSON;
		if ( !restore ) {
			Globals.register("JSON");
		}
		window.JSON = {
			parse: function() {
				ok( true, "Verifying that parse method was run" );
				window.JSON = old;
				return true;
			}
		};
		jQuery.getJSON( url("data/json.php"), function( json ) {
			strictEqual( json, true, "Verifying return value" );
			start();
		});
	});

	asyncTest( "jQuery.getJSON( String, Function ) - JSON object with absolute url to local content", 2, function() {
		jQuery.getJSON( url( window.location.href.replace( /[^\/]*$/, "" ) + "data/json.php" ), function( json ) {
			strictEqual( json.data.lang, "en", "Check JSON: lang" );
			strictEqual( json.data.length, 25, "Check JSON: length" );
			start();
		});
	});

//----------- jQuery.getScript()

	asyncTest( "jQuery.getScript( String, Function ) - with callback", 2, function() {
		Globals.register("testBar");
		jQuery.getScript( url("data/test.js"), function() {
			strictEqual( window["testBar"], "bar", "Check if script was evaluated" );
			start();
		});
	});

	asyncTest( "jQuery.getScript( String, Function ) - no callback", 1, function() {
		Globals.register("testBar");
		jQuery.getScript( url("data/test.js") ).done( start );
	});

	asyncTest( "#8082 - jQuery.getScript( String, Function ) - source as responseText", 2, function() {
		Globals.register("testBar");
		jQuery.getScript( url("data/test.js"), function( data, _, jqXHR ) {
			strictEqual( data, jqXHR.responseText, "Same-domain script requests returns the source of the script" );
			start();
		});
	});

//----------- jQuery.fn.load()

	// check if load can be called with only url
	asyncTest( "jQuery.fn.load( String )", 2, function() {
		jQuery.ajaxSetup({
			beforeSend: function() {
				strictEqual( this.type, "GET", "no data means GET request" );
			}
		});
		jQuery("#first").load( "data/name.html", start );
	});

	asyncTest( "jQuery.fn.load() - 404 error callbacks", 6, function() {
		addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError")();
		jQuery( document ).ajaxStop( start );
		jQuery("<div/>").load( "data/404.html", function() {
			ok( true, "complete" );
		});
	});

	// check if load can be called with url and null data
	asyncTest( "jQuery.fn.load( String, null )", 2, function() {
		jQuery.ajaxSetup({
			beforeSend: function() {
				strictEqual( this.type, "GET", "no data means GET request" );
			}
		});
		jQuery("#first").load( "data/name.html", null, start );
	});

	// check if load can be called with url and undefined data
	asyncTest( "jQuery.fn.load( String, undefined )", 2, function() {
		jQuery.ajaxSetup({
			beforeSend: function() {
				strictEqual( this.type, "GET", "no data means GET request" );
			}
		});
		jQuery("#first").load( "data/name.html", undefined, start );
	});

	// check if load can be called with only url
	asyncTest( "jQuery.fn.load( URL_SELECTOR )", 1, function() {
		jQuery("#first").load( "data/test3.html div.user", function() {
			strictEqual( jQuery( this ).children("div").length, 2, "Verify that specific elements were injected" );
			start();
		});
	});

	asyncTest( "jQuery.fn.load( String, Function ) - simple: inject text into DOM", 2, function() {
		jQuery("#first").load( url("data/name.html"), function() {
			ok( /^ERROR/.test(jQuery("#first").text()), "Check if content was injected into the DOM" );
			start();
		});
	});

	asyncTest( "jQuery.fn.load( String, Function ) - check scripts", 7, function() {
		var verifyEvaluation = function() {
			strictEqual( window["testBar"], "bar", "Check if script src was evaluated after load" );
			strictEqual( jQuery("#ap").html(), "bar", "Check if script evaluation has modified DOM");
			start();
		};

		Globals.register("testFoo");
		Globals.register("testBar");

		jQuery("#first").load( url("data/test.html"), function() {
			ok( jQuery("#first").html().match( /^html text/ ), "Check content after loading html" );
			strictEqual( jQuery("#foo").html(), "foo", "Check if script evaluation has modified DOM" );
			strictEqual( window["testFoo"], "foo", "Check if script was evaluated after load" );
			setTimeout( verifyEvaluation, 600 );
		});
	});

	asyncTest( "jQuery.fn.load( String, Function ) - check file with only a script tag", 3, function() {
		Globals.register("testFoo");

		jQuery("#first").load( url("data/test2.html"), function() {
			strictEqual( jQuery("#foo").html(), "foo", "Check if script evaluation has modified DOM");
			strictEqual( window["testFoo"], "foo", "Check if script was evaluated after load" );
			start();
		});
	});

	asyncTest( "jQuery.fn.load( String, Function ) - dataFilter in ajaxSettings", 2, function() {
		jQuery.ajaxSetup({
			dataFilter: function() {
				return "Hello World";
			}
		});
		jQuery("<div/>").load( url("data/name.html"), function( responseText ) {
			strictEqual( jQuery( this ).html(), "Hello World", "Test div was filled with filtered data" );
			strictEqual( responseText, "Hello World", "Test callback receives filtered data" );
			start();
		});
	});

	asyncTest( "jQuery.fn.load( String, Object, Function )", 2, function() {
		jQuery("<div />").load( url("data/params_html.php"), {
			"foo": 3,
			"bar": "ok"
		}, function() {
			var $post = jQuery( this ).find("#post");
			strictEqual( $post.find("#foo").text(), "3", "Check if a hash of data is passed correctly" );
			strictEqual( $post.find("#bar").text(), "ok", "Check if a hash of data is passed correctly" );
			start();
		});
	});

	asyncTest( "jQuery.fn.load( String, String, Function )", 2, function() {
		jQuery("<div />").load( url("data/params_html.php"), "foo=3&bar=ok", function() {
			var $get = jQuery( this ).find("#get");
			strictEqual( $get.find("#foo").text(), "3", "Check if a string of data is passed correctly" );
			strictEqual( $get.find("#bar").text(), "ok", "Check if a   of data is passed correctly" );
			start();
		});
	});

	asyncTest( "jQuery.fn.load() - callbacks get the correct parameters", 8, function() {
		var completeArgs = {};

		jQuery.ajaxSetup({
			success: function( _, status, jqXHR ) {
				completeArgs[ this.url ] = [ jqXHR.responseText, status, jqXHR ];
			},
			error: function( jqXHR, status ) {
				completeArgs[ this.url ] = [ jqXHR.responseText, status, jqXHR ];
			}
		});

		jQuery.when.apply(
			jQuery,
			jQuery.map([
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
				return jQuery.Deferred(function( defer ) {
					jQuery("#foo").load( options.url, function() {
						var args = arguments;
						strictEqual( completeArgs[ options.url ].length, args.length, "same number of arguments (" + options.type + ")" );
						jQuery.each( completeArgs[ options.url ], function( i, value ) {
							strictEqual( args[ i ], value, "argument #" + i + " is the same (" + options.type + ")" );
						});
						defer.resolve();
					});
				});
			})
		).always( start );
	});

	asyncTest( "#2046 - jQuery.fn.load( String, Function ) with ajaxSetup on dataType json", 1, function() {
		jQuery.ajaxSetup({
			dataType: "json"
		});
		jQuery( document ).ajaxComplete(function( e, xml, s ) {
			strictEqual( s.dataType, "html", "Verify the load() dataType was html" );
			jQuery( document ).off("ajaxComplete");
			start();
		});
		jQuery("#first").load("data/test3.html");
	});

	asyncTest( "#10524 - jQuery.fn.load() - data specified in ajaxSettings is merged in", 1, function() {
		var data = {
			"baz": 1
		};
		jQuery.ajaxSetup({
			data: {
				"foo": "bar"
			}
		});
		jQuery("#foo").load( "data/echoQuery.php", data );
		jQuery( document ).ajaxComplete(function( event, jqXHR, options ) {
			ok( ~options.data.indexOf("foo=bar"), "Data from ajaxSettings was used" );
			start();
		});
	});

//----------- jQuery.post()

	asyncTest( "jQuery.post() - data", 3, function() {
		jQuery.when(
			jQuery.post(
				url("data/name.php"),
				{
					xml: "5-2",
					length: 3
				},
				function( xml ) {
					jQuery( "math", xml ).each(function() {
						strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
						strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
					});
				}
			),
			jQuery.ajax({
				url: url("data/echoData.php"),
				type: "POST",
				data: {
					"test": {
						"length": 7,
						"foo": "bar"
					}
				},
				success: function( data ) {
					strictEqual( data, "test%5Blength%5D=7&test%5Bfoo%5D=bar", "Check if a sub-object with a length param is serialized correctly" );
				}
			})
		).always( start );
	});

	asyncTest( "jQuery.post( String, Hash, Function ) - simple with xml", 4, function() {
		jQuery.when(
			jQuery.post(
				url("data/name.php"),
				{
					"xml": "5-2"
				},
				function( xml ) {
					jQuery( "math", xml ).each(function() {
						strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
						strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
					});
				}
			),
			jQuery.post( url("data/name.php?xml=5-2"), {}, function( xml ) {
				jQuery( "math", xml ).each(function() {
					strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
					strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
				});
			})
		).always( start );
	});

//----------- jQuery.active

	test( "jQuery.active", 1, function() {
		ok( jQuery.active === 0, "ajax active counter should be zero: " + jQuery.active );
	});

})();
