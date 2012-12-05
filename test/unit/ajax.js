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

	ajaxTest( "jQuery.ajax() - GET", 1, {
		type: "GET",
		url: service("echo"),
		data: {
			content: "bar"
		},
		success: function( msg ) {
			strictEqual( msg, "bar", "Check for GET" );
		}
	});

	ajaxTest( "jQuery.ajax() - POST", 1, {
		type: "POST",
		url: service("echo/"),
		data: {
			content: "pan"
		},
		success: function( msg ) {
			strictEqual( msg, "pan", "Check for POST" );
		}
	});

	ajaxTest( "jQuery.ajax() - data option - empty bodies for non-GET requests", 1, {
		type: "POST",
		url: service("echo/"),
		data: undefined,
		success: function( result ) {
			strictEqual( result, "", "no data given" );
		}
	});

	ajaxTest( "jQuery.ajax() - success", 8, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess"),
		url: service("echo"),
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

	ajaxTest( "jQuery.ajax() - success - (url, options)", 8, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess"),
		create: function( options ) {
			return jQuery.ajax( service("echo"), options );
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

	ajaxTest( "jQuery.ajax() - success - late binding", 8, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess"),
		url: service("echo"),
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

	ajaxTest( "jQuery.ajax() - success - oncomplete binding", 8, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess"),
		url: service("echo"),
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

	ajaxTest( "jQuery.ajax() - error", 8, {
		setup: addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError"),
		url: service("error"),
		beforeSend: function() {
			ok( true, "beforeSend" );
		},
		error: function() {
			ok( true, "error" );
		},
		complete: function() {
			ok( true, "complete" );
		}
	});

	ajaxTest( "jQuery.ajax() - abort - textStatus and errorThrown values", 4, [
		{
			url: service("echo"),
			data: {
				delay: 1
			},
			error: function( _, textStatus, errorThrown ) {
				strictEqual( textStatus, "abort", "textStatus is 'abort' for abort" );
				strictEqual( errorThrown, "abort", "errorThrown is 'abort' for abort" );
			},
			afterSend: function( request ) {
				request.abort();
			}
		},
		{
			url: service("echo"),
			data: {
				delay: 1
			},
			error: function( _, textStatus, errorThrown ) {
				strictEqual( textStatus, "mystatus", "textStatus is 'mystatus' for abort('mystatus')" );
				strictEqual( errorThrown, "mystatus", "errorThrown is 'mystatus' for abort('mystatus')" );
			},
			afterSend: function( request ) {
				request.abort("mystatus");
			}
		}
	]);

	ajaxTest( "jQuery.ajax() - error - responseText", 1, {
		url: service("echo"),
		data: {
			status: 400,
			content: "plain text message"
		},
		error: function( xhr ) {
			strictEqual( xhr.responseText, "plain text message", "Test jqXHR.responseText is filled for HTTP errors" );
		}
	});

	asyncTest( "jQuery.ajax() - retry with jQuery.ajax( this )", 2, function() {
		var previousUrl,
			firstTime = true;
		jQuery.ajax({
			url: service("error"),
			error: function() {
				if ( firstTime ) {
					firstTime = false;
					jQuery.ajax( this );
				} else {
					ok ( true, "Test retrying with jQuery.ajax(this) works" );
					jQuery.ajax({
						url: service("error"),
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

	ajaxTest( "jQuery.ajax() - headers - request", 1, {
		setup: function() {
			jQuery( document ).ajaxSend(function( evt, xhr ) {
				xhr.setRequestHeader( "ajax-send", "test" );
			});
		},
		url: service("headers/request"),
		data: {
			headers: "siMPle,SometHing-elsE,OthEr,ajax-send"
		},
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
		}
	});
	
	ajaxTest( "jQuery.ajax() - headers - response", 3, {
		setup: function() {
			jQuery( document ).ajaxSend(function( evt, xhr ) {
				xhr.setRequestHeader( "ajax-send", "test" );
			});
		},
		url: service("headers/response"),
		data: {
			"Sample-Header": "sample value",
			"Sample-Header2": "sample value 2",
			"Empty-Header": ""
		},
		success: function( data, _, xhr ) {
			var emptyHeader = xhr.getResponseHeader("Empty-Header");
			if ( emptyHeader === null ) {
				ok( true, "Firefox doesn't support empty headers" );
			} else {
				strictEqual( emptyHeader, "", "Empty header received" );
			}
			strictEqual( xhr.getResponseHeader("Sample-Header"), "sample value", "Sample header received" );
			strictEqual( xhr.getResponseHeader("Sample-Header2"), "sample value 2", "Second sample header received" );

		}
	});

	ajaxTest( "jQuery.ajax() - headers - Accept", 1, {
		url: service("headers/request"),
		data: {
			headers: "accept"
		},
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

	ajaxTest( "jQuery.ajax() - headers - contentType option", 2, [
		{
			url: service("headers/request"),
			data: {
				headers: "content-type"
			},
			contentType: "test",
			success: function( data ) {
				ok( data, "content-type: test\n", "Test content-type is sent when options.contentType is set" );
			}
		},
		{
			url: service("headers/request"),
			data: {
				headers: "content-type"
			},
			contentType: false,
			success: function( data ) {
				strictEqual( data, "content-type: \n", "Test content-type is not sent when options.contentType===false" );
			}
		}
	]);

	ajaxTest( "jQuery.ajax() - url - protocol-less", 1, {
		url: "//somedomain.com",
		beforeSend: function( xhr, settings ) {
			equal( settings.url, location.protocol + "//somedomain.com", "Make sure that the protocol is added." );
			return false;
		},
		error: true
	});

	ajaxTest( "jQuery.ajax() - url - hash", 3, [
		{
			url: "path/to/service#foo",
			beforeSend: function( xhr, settings ) {
				strictEqual( settings.url, "path/to/service", "Make sure that the URL is trimmed." );
				return false;
			},
			error: true
		},
		{
			url: "path/to/service?abc#foo",
			beforeSend: function( xhr, settings ) {
				strictEqual( settings.url, "path/to/service?abc", "Make sure that the URL is trimmed." );
				return false;
			},
			error: true
		},
		{
			url: "path/to/service?abc#foo",
			data: {
				"test": 123
			},
			beforeSend: function( xhr, settings ) {
				equal( settings.url, "path/to/service?abc&test=123", "Make sure that the URL is trimmed." );
				return false;
			},
			error: true
		}
	]);

	ajaxTest( "jQuery.ajax() - url - cross-domain detection", 7, function() {
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
		url: service("echo"),
		data: {
			delay: 1
		},
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

	ajaxTest( "jQuery.ajax() - context", 12, function() {

		var context;

		function event( e ) {
			strictEqual( this, context, e.type );
		}

		function callback( msg ) {
			return function() {
				strictEqual( this, context, "context is preserved on callback " + msg );
			};
		}

		return {
			setup: function() {
				var target = jQuery("#foo").on( "ajaxSend ajaxComplete ajaxError ajaxSuccess", event );
				context = target[ 0 ];
				jQuery.each( this.requests, function( _, options ) {
					options.context = context;
				});
			},
			teardown: function() {
				// Let everything fire properly
				setTimeout(function() {
					jQuery("#foo").off("ajaxSend ajaxComplete ajaxError ajaxSuccess");
					start();
				}, 0 );
			},
			requests: [{
				url: service("echo"),
				beforeSend: callback("beforeSend"),
				success: callback("success"),
				complete: callback("complete")
			}, {
				url: service("error"),
				beforeSend: callback("beforeSend"),
				error: callback("error"),
				complete: callback("complete")
			}]
		};
	});
		
	ajaxTest( "jQuery.ajax() - context - none", 3, function() {
		function nocallback( msg ) {
			return function() {
				strictEqual( typeof this.url, "string", "context is settings on callback " + msg );
			};
		}
		return {
			url: service("error"),
			beforeSend: nocallback("beforeSend"),
			error: nocallback("error"),
			complete:  nocallback("complete")
		};
	});

	ajaxTest( "jQuery.ajax() - context - modification", 1, {
		url: service("error"),
		context: {},
		beforeSend: function() {
			this.test = "foo";
		},
		afterSend: function() {
			strictEqual( this.context.test, "foo", "Make sure the original object is maintained." );
		},
		error: true
	});

	ajaxTest( "jQuery.ajax() - context - ajaxSetup", 3, function() {
		var obj = {};
		return {
			setup: function() {
				jQuery.ajaxSetup({
					context: obj
				});
				strictEqual( jQuery.ajaxSettings.context, obj, "Make sure the context is properly set in ajaxSettings." );
			},
			requests: [{
				url: service("error"),
				error: function() {
					strictEqual( this, obj, "Make sure the original object is maintained." );
				}
			}, {
				url: service("error"),
				context: {},
				error: function() {
					ok( this !== obj, "Make sure overidding context is possible." );
				}
			}]
		};
	});

	ajaxTest( "jQuery.ajax() - events - disable", 3, {
		setup: addGlobalEvents(""),
		global: false,
		url: service("echo"),
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

	ajaxTest( "jQuery.ajax() - xml - non-namespace elements inside namespaced elements", 3, {
		url: service("echo"),
		data: {
			contentType: "text/xml",
			content: createWithFriesXML( true )
		},
		success: function( resp ) {
			strictEqual( jQuery( "properties", resp ).length, 1, "properties in responseXML" );
			strictEqual( jQuery( "jsconf", resp ).length, 1, "jsconf in responseXML" );
			strictEqual( jQuery( "thing", resp ).length, 2, "things in responseXML" );
		}
	});

	ajaxTest( "jQuery.ajax() - xml - non-namespace elements inside namespaced elements (over JSONP)", 3, {
		url: service("echo"),
		data: {
			content: createWithFriesXML( true )
		},
		dataType: "jsonp xml",
		success: function( resp ) {
			strictEqual( jQuery( "properties", resp ).length, 1, "properties in responseXML" );
			strictEqual( jQuery( "jsconf", resp ).length, 1, "jsconf in responseXML" );
			strictEqual( jQuery( "thing", resp ).length, 2, "things in responseXML" );
		}
	});

	ajaxTest( "jQuery.ajax() - atom+xml", 2, {
		url: service("echo"),
		data: {
			content: "<root><element /></root>",
			contentType: "atom+xml"
		},
		success: function( xml ) {
			strictEqual( jQuery( "root", xml ).length, 1, "root in responseXML" );
			strictEqual( jQuery( "element", xml ).length, 1, "element in responseXML" );
		}
	});

	ajaxTest( "jQuery.ajax() - HEAD requests", 2, function() {
		function request( method ) {
			return {
				url: service("echo/"),
				data: {
					content: "head request"
				},
				type: method,
				success: function( data, status, xhr ) {
					strictEqual( data, method === "HEAD" ? "" : "head request", "Content (" + method + ")" );
				}
			};
		}
		return [
			request("HEAD"),
			request("GET")
		];
	});

	ajaxTest( "jQuery.ajax() - beforeSend", 1, {
		url: service("error"),
		beforeSend: function( xml ) {
			this.check = true;
		},
		error: function( data ) {
			ok( this.check, "check beforeSend was executed" );
		}
	});

	ajaxTest( "jQuery.ajax() - beforeSend, cancel request manually", 2, {
		create: function() {
			return jQuery.ajax({
				url: service("error"),
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

	ajaxTest( "jQuery.ajax() - html", 5, {
		setup: function() {
			Globals.register("testFoo");
			Globals.register("testBar");
		},
		dataType: "html",
		url: service("echo"),
		data: {
			content: createComplexHTML()
		},
		success: function( data ) {
			ok( data.match( /^html text/ ), "Check content for datatype html" );
			jQuery("#ap").html( data );
			strictEqual( window["testFoo"], "foo", "Check if script was evaluated for datatype html" );
			strictEqual( window["testBar"], "bar", "Check if script src was evaluated for datatype html" );
		}
	});

	ajaxTest( "jQuery.ajax() - synchronous request", 1, {
		url: service("echo"),
		data: {
			content: "hello world"
		},
		dataType: "text",
		async: false,
		success: true,
		afterSend: function( xhr ) {
			strictEqual( xhr.responseText, "hello world", "check returned text" );
		}
	});

	ajaxTest( "jQuery.ajax() - synchronous request - callbacks", 2, {
		url: service("echo"),
		data: {
			content: "hello world"
		},
		async: false,
		dataType: "text",
		success: true,
		afterSend: function( xhr ) {
			var result;
			xhr.done(function( data ) {
				ok( true, "success callback executed" );
				result = data;
			});
			strictEqual( result, "hello world", "check returned text" );
		}
	});

	asyncTest( "jQuery.ajax(), jQuery.get[Script|JSON](), jQuery.post(), pass-through request object", 7, function() {
		var successCount = 0,
			errorCount = 0,
			errorEx = [];
		function success() {
			successCount++;
		}
		jQuery( document ).ajaxError(function( e, xhr, s, ex ) {
			errorCount++;
			errorEx.push( s.dataType + " / " + xhr.status + " / " + ex + " " );
		});
		jQuery( document ).ajaxStop(function() {
			strictEqual( successCount, 5, "Check all ajax calls successful" );
			strictEqual( errorCount, 0, "Check no ajax errors ( " + errorEx.join() + ")" );
			start();
		});

		ok( jQuery.get( service("echo"), success ), "get" );
		ok( jQuery.post( service("echo"), success ), "post" );
		ok( jQuery.getScript( service("echo"), success ), "script" );
		ok( jQuery.getJSON( service("echo?content=0"), success ), "json" );
		ok( jQuery.ajax({
			url: service("echo"),
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
				"path/to/service",
				"no parameter"
			),
			request(
				"path/to/service?pizza=true",
				"1 parameter"
			),
			request(
				"path/to/service?_=tobereplaced555",
				"_= parameter"
			),
			request(
				"path/to/service?pizza=true&_=tobereplaced555",
				"1 parameter and _="
			),
			request(
				"path/to/service?_=tobereplaced555&tv=false",
				"_= and 1 parameter"
			),
			request(
				"path/to/service?name=David&_=tobereplaced555&washere=true",
				"2 parameters surrounding _="
			)
		];
	});

	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {
		
		function request( options ) {
			var tmp = jQuery.extend( true, {
					data: {
						content: "041275"
					},
					dataType: "jsonp",
					crossDomain: crossDomain,
					success: !options.fail && !options.error && function( data ) {
						strictEqual( data, "041275", "JSON results returned - " + this.type + " - " + options.title );
					}
				}, options );
			tmp.url = service( "echo" + ( options.url || "" ) );
			return tmp;
		}

		ajaxTest( "jQuery.ajax() - JSONP - Query String (?n)" + label, 4, [
			request({
				title: "URL Callback",
				url: "?callback=?"
			}),
			request({
				title: "URL Context-Free Callback",
				url: "?callback=??"
			}),
			request({
				title: "REST-like",
				url: "/index.php/??"
			}),
			request({
				title: "REST-like (with param)",
				url: "/index.php/???content=\"041275\"",
				beforeSend: function() {
					delete this.data;
				}
			})
		]);

		ajaxTest( "jQuery.ajax() - JSONP - Explicit callback param" + label, 8, {
			setup: function() {
				Globals.register("functionToCleanUp");
				Globals.register("functionToCleanUpAfterEarlyAbort");
				Globals.register("XXX");
				Globals.register("jsonpResults");
				window["jsonpResults"] = function( data ) {
					strictEqual( data, "041275", "JSON results returned - GET - custom callback function" );
				};
			},
			requests: [
				request({
					title: "jsonp option",
					jsonp: "callback"
				}),
				request({
					title: "jsonpCallback option",
					jsonpCallback: "jsonpResults"
				}),
				request({
					title: "no URL manipulation",
					url: "/index.php/XXX",
					jsonp: false,
					jsonpCallback: "XXX",
					beforeSend: function() {
						ok( /\/XXX\?\d+&content=041275&_=\d+$/.test( this.url ), "The URL wasn't messed with" );
					}
				}),
				request({
					title: "jsonpCallback option - cleanup",
					jsonpCallback: "functionToCleanUp",
					done: function( data ) {
						strictEqual( window["functionToCleanUp"], undefined, "Callback was removed" );
					}
				}),
				request({
					title: "jsonpCallback option - cleanup after early abort",
					jsonpCallback: "functionToCleanUpAfterEarlyAbort",
					beforeSend: function() {
						return false;
					},
					fail: function() {
						strictEqual( window["functionToCleanUpAfterEarlyAbort"], undefined, "Callback was removed after early abort" );
					}
				})
			]
		});

		ajaxTest( "jQuery.ajax() - JSONP - Callback in data" + label, 2, [
			request({
				title: "data callback",
				data: "content=041275&callback=?"
			}),
			request({
				title: "data context-free callback",
				data: "content=041275&callback=??"
			})
		]);


		ajaxTest( "jQuery.ajax() - JSONP - POST" + label, 3, [
			request({
				title: "no callback",
				type: "POST",
				url: "/"
			}),
			request({
				title: "data callback",
				type: "POST",
				url: "/",
				data: "content=041275&callback=?"
			}),
			request({
				title: "data obj callback",
				type: "POST",
				url: "/",
				jsonp: "callback"
			})
		]);

		ajaxTest( "jQuery.ajax() - JSONP" + label, 3, [
			request({
				title: "no callback"
			}),
			request({
				title: "no callback and re-use",
				create: function( options ) {
					var request = jQuery.ajax( options ),
						promise = request.then(function( data ) {
							request = jQuery.ajax( this );
							promise.abort = request.abort;
							return request;
						});
					promise.abort = request.abort;
					return promise;
				}
			})
		]);

	});
	
	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {
		
		jQuery.each( [ "GET", "POST" ], function( _, type ) {
			
			ajaxTest( "jQuery.ajax() - script - " + type + label, 3, {
				setup: function() {
					Globals.register("testBar");
				},
				type: type,
				crossDomain: crossDomain,
				url: service("echo/"),
				data: {
					content: "var testBar = true; ok( true, 'script executed' );"
				},
				dataType: "script",
				success: function( data, status ) {
					strictEqual( window.testBar, true, "Variable declared and set" );
					strictEqual( status, "success", "Script results returned" );
				}
			});
			
			jQuery.each( "text/javascript application/javascript application/ecmascript application/x-ecmascript".split(" "), function( _, contentType ) {
				ajaxTest( "jQuery.ajax() - script - " + type + label + " - auto-detected content-type - " + contentType, 2, {
					converters: {
						"text script": function( text ) {
							strictEqual( text, "", "content-type detected" );
						}
					},
					url: service("headers/response/"),
					data: {
						"Content-Type": contentType
					},
					success: function() {
						ok( true, "success" );
					}
				});
			});

		});
		
	});

	ajaxTest( "jQuery.ajax() - malformed JSON", 2, {
		url: service("echo"),
		data: {
			content: "{bad: toTheBone}"
		},
		dataType: "json",
		error: function( xhr, msg, detailedMsg ) {
			strictEqual( msg, "parsererror", "A parse error occurred." );
			ok( /(invalid|error|exception)/i.test( detailedMsg ), "Detailed parsererror message provided" );
		}
	});

	ajaxTest( "jQuery.ajax() - JSON - content-type", 2, {
		converters: {
			"text json": function( text ) {
				strictEqual( text, "", "content-type detected" );
				return 42;
			}
		},
		url: service("headers/response/index.php"),
		data: {
			"Content-Type": "application/json"
		},
		success: function( json ) {
			strictEqual( json, 42, "success" );
		}
	});

	ajaxTest( "jQuery.ajax() - JSON - content-type disabled", 1, {
		converters: {
			"text json": function() {
				ok( false, "content-type detected" );
			}
		},
		url: service("headers/response/index.php"),
		data: {
			"Content-Type": "application/json"
		},
		contents: {
			json: false
		},
		success: function() {
			ok( true, "success" );
		}
	});

	ajaxTest( "jQuery.ajax() - JSON - empty", 1, {
		url: service("echo"),
		dataType: "json",
		error: function( _, __, error ) {
			strictEqual( typeof error, "object", "error object for empty json response" );
		}
	});

	var ifModifiedNow = new Date();

	jQuery.each( [ " - no cache", " - cache" ], function( cache, label ) {
		jQuery.each( [ "If-Modified-Since", "If-None-Match" ], function( _, header ) {
			var isOpera = !!window.opera,
				url = service("headers/cache/"),
				value = ifModifiedNow++;
			function request() {
				return jQuery.ajax({
					url: url,
					data: {
						header: header,
						value: value
					},
					ifModified: true,
					cache: !!cache
				});
			}
			asyncTest( "jQuery.ajax() - " + header + label, 3, function() {
				request().then(function( data, status ) {
					strictEqual( status, "success" );
					return request();
				}).done(function( data, status ) {
					if ( data === "FAIL" ) {
						ok( isOpera, "Opera is incapable of doing .setRequestHeader('" + header + "')." );
						ok( isOpera, "Opera is incapable of doing .setRequestHeader('" + header + "')." );
					} else {
						strictEqual( status, "notmodified" );
						ok( data == null, "response body should be empty" );
					}
				}).fail(function() {
					ok( isOpera, "Opera cannot handle 304" );
					ok( isOpera, "Opera cannot handle 304" );
				}).always( start );
			});
		});
	});

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

	ajaxTest( "jQuery.ajax() - statusText", 4, [
		{
			url: service("echo"),
			data: {
				status: 200,
				statusText: "Hello"
			},
			success: function( _, statusText, jqXHR ) {
				strictEqual( statusText, "success", "callback status text ok for success" );
				strictEqual( jqXHR.statusText, jqXHR.statusText === "Hello" ? "Hello" : "OK", "jqXHR status text ok for success" );
			}
		},
		{
			url: service("echo"),
			data: {
				status: 404,
				statusText: "Hello"
			},
			error: function( jqXHR, statusText ) {
				strictEqual( statusText, "error", "callback status text ok for error" );
				strictEqual( jqXHR.statusText, jqXHR.statusText === "Hello" ? "Hello" : "Not Found", "jqXHR status text ok for error" );
			}
		}
	]);

	jQuery.each( [ "error", service("echo") ], function( isSuccess, url ) {
		function statusCodes( title ) {
			return {
				200: function() {
					ok( isSuccess, title + " - success" );
				},
				404: function() {
					ok( !isSuccess, title + " - error" );
				}
			};
		}
		function request( options ) {
			return jQuery.extend( true, {
				url: url,
				success: isSuccess,
				error: !isSuccess
			}, options );
		}
		ajaxTest( "jQuery.ajax() - statusCode - " + ( isSuccess ? "success" : "error" ), 3, [
			request({
				statusCode: statusCodes("option")
			}),
			request({
				afterSend: function( jqXHR ) {
					jqXHR.statusCode( statusCodes("method - immediate") );
				}
			}),
			request({
				complete: function( jqXHR ) {
					jqXHR.statusCode( statusCodes("on complete") );
				}
			})
		]);
	});
	
	ajaxTest( "jQuery.ajax() - transitive conversions", 8, function() {
		return jQuery.map( [ "", "*" ], function( srcType ) {
			var dataType = "myJson";
			if ( srcType ) {
				dataType = srcType + " " + dataType;
			}
			return {
				url: service("echo"),
				data: {
					content: "\"041275\""
				},
				converters: {
					"json myJson": function( data ) {
						strictEqual( data, "041275", "converter called - " + dataType );
						return 42;
					}
				},
				dataType: dataType,
				success: function( data ) {
					strictEqual( data, 42, "Transitive conversion worked - " + dataType );
					strictEqual( this.dataTypes[ 0 ], "text", "response was retrieved as text - " + dataType );
					strictEqual( this.dataTypes[ 1 ], "myjson", "request expected myjson dataType - " + dataType );
				}
			};
		});
	});

	ajaxTest( "jQuery.ajax() - overrideMimeType", 2, [
		{
			url: service("echo"),
			data: {
				content: "42"
			},
			beforeSend: function( xhr ) {
				xhr.overrideMimeType( "application/json" );
			},
			success: function( json ) {
				strictEqual( json, 42, "Mimetype overriden using beforeSend" );
			}
		},
		{
			url: service("echo"),
			data: {
				content: "42"
			},
			mimeType: "application/json",
			success: function( json ) {
				strictEqual( json, 42, "Mimetype overriden using mimeType option" );
			}
		}
	]);

	ajaxTest( "#2688 - jQuery.ajax() - beforeSend, cancel request", 2, {
		create: function() {
			return jQuery.ajax({
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
		url: service("echo"),
		data: {
			content: function() {
				return "value";
			}
		},
		success: function( result ) {
			strictEqual( result, "value", "function called" );
		}
	});

	test( "#7531 - jQuery.ajax() - Location object as url", 1, function () {
		var success = false;
		try {
			var xhr = jQuery.ajax({
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
			dataType: "jsonp",
			crossDomain: crossDomain,
			beforeSend: function( jqXHR, s ) {
				strictEqual( this.cache, false, "cache must be false on JSONP request" );
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
				return jQuery.ajax( service("echo") );
			},
			done: function() {
				ok( true, "With only string URL argument" );
			}
		},
		{
			create: function() {
				return jQuery.ajax( service("echo"), {});
			},
			done: function() {
				ok( true, "With string URL param and map" );
			}
		},
		{
			create: function( options ) {
				return jQuery.ajax( options );
			},
			url: service("echo"),
			success: function() {
				ok( true, "With only map" );
			}
		}
	]);
	
	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {
		ajaxTest( "#8205 - jQuery.ajax() - JSONP - re-use callbacks name" + label, 2, {
			url: service("echo"),
			data: {
				content: "42"
			},
			dataType: "jsonp",
			crossDomain: crossDomain,
			beforeSend: function( jqXHR, s ) {
				s.callback = s.jsonpCallback;
			},
			success: function() {
				var previous = this;
				strictEqual( previous.jsonpCallback, undefined, "jsonpCallback option is set back to default in callbacks" );
				jQuery.ajax({
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
			jQuery.ajax({
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

	jQuery.each( [ "argument", "settings object" ], function( inSetting, title ) {
		
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
		
		ajaxTest( "#10093 - jQuery.ajax() - falsy url - " + title, 4, [
			request( "", "empty string" ),
			request( false ),
			request( null ),
			request( undefined )
		]);
		
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
				url: service("echo"),
				data: {
					content: "SYNTAX ERROR"
				},
				dataType: "script",
				throws: true,
				// TODO find a way to test this asynchronously, too
				async: false,
				// Global events get confused by the exception
				global: false,
				success: function() {
					ok( false, "success" );
				},
				error: function() {
					ok( false, "error" );
				}
			});
		}, "exception bubbled" );
	});

	jQuery.each( [ "method", "type" ], function( _, globalOption ) {

		function request( option ) {
			var options = {
					url: service("echo/index.php"),
					data: {
						requestArray: "POST",
						content: "hello"
					},
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
			url: service("echo"),
			data: {
				content: "bar"
			},
			success: function( msg ) {
				strictEqual( msg, "bar", "Check for GET" );
				start();
			}
		});
		jQuery.ajax();
	});

	ajaxTest( "jQuery.ajaxSetup({ timeout: Number }) - with global timeout", 6, {
		setup: function() {
			addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError")();
			jQuery.ajaxSetup({
				timeout: 50
			});
		},
		url: service("echo?delay=1"),
		error: function( _, status ) {
			strictEqual( status, "timeout", "timed out" );
		}
	});

	ajaxTest( "jQuery.ajaxSetup({ timeout: Number }) with localtimeout", 1, {
		setup: function() {
			jQuery.ajaxSetup({
				timeout: 50
			});
		},
		type: "GET",
		timeout: 15000,
		url: service("echo?delay=1"),
		success: function() {
			ok( true, "Check for local timeout" );
		}
	});

//----------- jQuery.domManip()

	test( "#11264 - jQuery.domManip() - no side effect because of ajaxSetup or global events", 1, function() {
		jQuery.ajaxSetup({
			type: "POST"
		});

		jQuery( document ).bind( "ajaxStart ajaxStop", function() {
			ok( false, "Global event triggered" );
		});

		jQuery("#qunit-fixture").append("<script src='" + service( "echo", {
			requestArray: "GET",
			content: "ok( true, \"script executed\" );"
		}) + "'></script>");
	});

	asyncTest( "#11402 - jQuery.domManip() - script in comments are properly evaluated", 2, function() {
		jQuery("#qunit-fixture").load( service( "echo", {
			content:
				"<script>\n<!--\nok( true, \"script within html comments executed\" );\n-->\n</script>\n" +
				"<script>\n<![CDATA[\nok( true, \"script within CDATA executed\" );\n]]>\n</script>"
		}), start );
	});

//----------- jQuery.get()

	asyncTest( "jQuery.get( String, Hash, Function ) - parse xml and use text() on nodes", 2, function() {
		var tabs = [ "blabla", "blublu" ];
		jQuery.get( service( "echo", {
			contentType: "text/xml",
			content: createDashboardXML( true )
		}), function( xml ) {
			jQuery( "tab", xml ).each(function( index ) {
				strictEqual( jQuery( this ).text(), tabs[ index ], "Check tab #" + ( index + 1 ) );
			});
			start();
		});
	});

	asyncTest( "#8277 - jQuery.get( String, Function ) - data in ajaxSettings", 1, function() {
		jQuery.ajaxSetup({
			data: {
				content: "helloworld"
			}
		});
		jQuery.get( service("echo"), function( data ) {
			strictEqual( data, "helloworld", "Data from ajaxSettings was used" );
			start();
		});
	});

//----------- jQuery.getJSON()

	asyncTest( "jQuery.getJSON( String, Hash, Function ) - JSON array", 1, function() {
		jQuery.getJSON(
			service("echo"),
			{
				"content": "[{ \"name\": \"John\", \"age\": 21 }, { \"name\": \"Peter\", \"age\": 25 }]"
			},
			function( json ) {
				deepEqual( json, [{
					name: "John",
					age: 21
				}, {
					name: "Peter",
					age: 25
				}], "json is as expected" );
				start();
			}
		);
	});

	asyncTest( "jQuery.getJSON( String, Function ) - JSON object", 1, function() {
		jQuery.getJSON( service( "echo", {
			content: "{ \"data\": { \"lang\": \"en\", \"length\": 25 } }"
		}), function( json ) {
			deepEqual( json, {
				data: {
					lang: "en",
					length: 25
				}
			}, "json is as expected" );
			start();
		});
	});

	asyncTest( "jQuery.getJSON() - Using Native JSON", 2, function() {
		var restore = "JSON" in window,
			old = window.JSON;
		if ( !restore ) {
			Globals.register("JSON");
		}
		window.JSON = {
			parse: function( str ) {
				ok( true, "Verifying that parse method was run" );
				window.JSON = old;
				return true;
			}
		};
		jQuery.getJSON( service("echo"), function( json ) {
			strictEqual( json, true, "Verifying return value" );
			start();
		});
	});

	asyncTest( "jQuery.getJSON( String, Function ) - JSON object with absolute url to local content", 1, function() {
		jQuery.getJSON( window.location.href.replace( /[^\/]*$/, "" ) + service( "echo", {
			content: "{ \"data\": { \"lang\": \"en\", \"length\": 25 } }"
		}), function( json ) {
			deepEqual( json, {
				data: {
					lang: "en",
					length: 25
				}
			}, "json is as expected" );
			start();
		});
	});

//----------- jQuery.getScript()

	asyncTest( "jQuery.getScript( String, Function ) - with callback", 2, function() {
		Globals.register("testBar");
		jQuery.getScript( service("echo", {
			content: "var testBar = \"bar\"; ok( true, \"script executed\");"
		}), function( data, _, jqXHR ) {
			strictEqual( testBar, "bar", "Check if script was evaluated" );
			start();
		});
	});

	asyncTest( "jQuery.getScript( String, Function ) - no callback", 1, function() {
		Globals.register("testBar");
		jQuery.getScript( service("echo", {
			content: "var testBar = \"bar\"; ok( true, \"script executed\");"
		}) ).done( start );
	});

	asyncTest( "#8082 - jQuery.getScript( String, Function ) - source as responseText", 2, function() {
		Globals.register("testBar");
		jQuery.getScript( service("echo", {
			content: "var testBar = \"bar\"; ok( true, \"script executed\");"
		}), function( data, _, jqXHR ) {
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
		jQuery("#first").load( service( "echo", {
			content: "<script>ok( true, \"html injected\" )</script>"
		}), start );
	});

	asyncTest( "jQuery.fn.load() - 404 error callbacks", 6, function() {
		addGlobalEvents("ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError")();
		jQuery("<div/>").load( "error", function() {
			ok( true, "complete" );
			start();
		});
	});

	// check if load can be called with url and null data
	asyncTest( "jQuery.fn.load( String, null )", 2, function() {
		jQuery.ajaxSetup({
			beforeSend: function() {
				strictEqual( this.type, "GET", "null data means GET request" );
			}
		});
		jQuery("#first").load(  service( "echo", {
			content: "<script>ok( true, \"html injected\" )</script>"
		}), null, start );
	});

	// check if load can be called with url and undefined data
	asyncTest( "jQuery.fn.load( String, undefined )", 2, function() {
		jQuery.ajaxSetup({
			beforeSend: function() {
				strictEqual( this.type, "GET", "undefined data means GET request" );
			}
		});
		jQuery("#first").load(  service( "echo", {
			content: "<script>ok( true, \"html injected\" )</script>"
		}), undefined, start );
	});

	// check if load can be called with only url
	asyncTest( "jQuery.fn.load( URL_SELECTOR )", 1, function() {
		jQuery("#first").load( service("echo", {
			content: "<div class=\"user\"></div><div class=\"user\"></div><div></div>"
		}) + " div.user", function() {
			strictEqual( jQuery( this ).children("div").length, 2, "Verify that specific elements were injected" );
			start();
		});
	});

	asyncTest( "jQuery.fn.load( String, Function ) - simple: inject text into DOM", 2, function() {
		jQuery("#first").load( service( "echo", {
			content: "INJECTED<script>ok( true, \"html injected\" )</script>"
		}), function() {
			ok( /^INJECTED/.test(jQuery("#first").text()), "Check if content was injected into the DOM" );
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

		jQuery("#first").load( service( "echo", {
			content: createComplexHTML()
		}), function() {
			ok( jQuery("#first").html().match( /^html text/ ), "Check content after loading html" );
			strictEqual( jQuery("#foo").html(), "foo", "Check if script evaluation has modified DOM" );
			strictEqual( window["testFoo"], "foo", "Check if script was evaluated after load" );
			setTimeout( verifyEvaluation, 600 );
		});
	});

	asyncTest( "jQuery.fn.load( String, Function ) - check file with only a script tag", 3, function() {
		jQuery("#first").load( service("echo", {
			content: "<script>var testFoo = \"foo\"; jQuery(\"#foo\").html(\"foo\"); ok( true, \"script executed\" );</script>"
		}), function() {
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
		jQuery("<div/>").load( service("echo"), function( responseText ) {
			strictEqual( jQuery( this ).html(), "Hello World", "Test div was filled with filtered data" );
			strictEqual( responseText, "Hello World", "Test callback receives filtered data" );
			start();
		});
	});

	asyncTest( "jQuery.fn.load( String, Object, Function )", 1, function() {
		jQuery("<div />").load( service("echo/", {
			requestArray: "POST"
		}), {
			content: "INJECTED"
		}, function() {
			strictEqual( jQuery( this ).text(), "INJECTED", "data passed" );
			start();
		});
	});

	asyncTest( "jQuery.fn.load( String, String, Function )", 1, function() {
		jQuery("<div />").load( service("echo/", {
			requestArray: "GET"
		}), "content=INJECTED", function() {
			strictEqual( jQuery( this ).text(), "INJECTED", "data passed" );
			start();
		});
	});

	asyncTest( "jQuery.fn.load() - callbacks get the correct parameters", 8, function() {
		var slice = [].slice,
			completeArgs = {};

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
					url: service("echo")
				},
				{
					type: "error",
					url: "error"
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
			start();
		});
		jQuery("#first").load( service("echo") );
	});

	test( "#10524 - jQuery.fn.load() - data specified in ajaxSettings is merged in", 1, function() {
		jQuery.ajaxSetup({
			data: {
				"foo": "bar"
			},
			beforeSend: function() {
				strictEqual( this.data, "foo=bar&baz=1", "data used both request and ajaxSetup values" );
				return false;
			}
		});
		jQuery("#foo").load( "path/to/service", {
			"baz": 1
		});
	});

//----------- jQuery.post()

	asyncTest( "jQuery.post() - data", 3, function() {
		jQuery.when(
			jQuery.post(
				service("echo/"),
				{
					requestArray: "POST",
					contentType: "text/xml",
					content: "<math><calculation>5-2</calculation><result>3</result></math>"
				},
				function( xml ) {
					jQuery( "math", xml ).each(function() {
						strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
						strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
					});
				}
			),
			jQuery.ajax({
				url: service("echo/"),
				type: "POST",
				data: {
					requestArray: "POST",
					content: {
						test: {
							"length": 7,
							"foo": "bar"
						}
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
				service("echo/"),
				{
					requestArray: "POST",
					contentType: "text/xml",
					content: "<math><calculation>5-2</calculation><result>3</result></math>"
				},
				function( xml ) {
					jQuery( "math", xml ).each(function() {
						strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
						strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
					});
				}
			),
			jQuery.post( service("echo/", {
				requestArray: "GET",
				contentType: "text/xml",
				content: "<math><calculation>5-2</calculation><result>3</result></math>"
			}), {}, function( xml ) {
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
