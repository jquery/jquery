module("ajax", { teardown: moduleTeardown });

// Safari 3 randomly crashes when running these tests,
// but only in the full suite - you can run just the Ajax
// tests and they'll pass
//if ( !jQuery.browser.safari ) {

if ( !isLocal ) {

test("jQuery.ajax() - success callbacks", function() {
	expect( 8 );

	jQuery.ajaxSetup({ timeout: 0 });

	stop();

	jQuery("#foo").ajaxStart(function(){
		ok( true, "ajaxStart" );
	}).ajaxStop(function(){
		ok( true, "ajaxStop" );
		start();
	}).ajaxSend(function(){
		ok( true, "ajaxSend" );
	}).ajaxComplete(function(){
		ok( true, "ajaxComplete" );
	}).ajaxError(function(){
		ok( false, "ajaxError" );
	}).ajaxSuccess(function(){
		ok( true, "ajaxSuccess" );
	});

	jQuery.ajax({
		url: url("data/name.html"),
		beforeSend: function(){ ok(true, "beforeSend"); },
		success: function(){ ok(true, "success"); },
		error: function(){ ok(false, "error"); },
		complete: function(){ ok(true, "complete"); }
	});
});

test("jQuery.ajax() - success callbacks - (url, options) syntax", function() {
	expect( 8 );

	jQuery.ajaxSetup({ timeout: 0 });

	stop();

	setTimeout(function(){
		jQuery("#foo").ajaxStart(function(){
			ok( true, "ajaxStart" );
		}).ajaxStop(function(){
			ok( true, "ajaxStop" );
			start();
		}).ajaxSend(function(){
			ok( true, "ajaxSend" );
		}).ajaxComplete(function(){
			ok( true, "ajaxComplete" );
		}).ajaxError(function(){
			ok( false, "ajaxError" );
		}).ajaxSuccess(function(){
			ok( true, "ajaxSuccess" );
		});

		jQuery.ajax( url("data/name.html") , {
			beforeSend: function(){ ok(true, "beforeSend"); },
			success: function(){ ok(true, "success"); },
			error: function(){ ok(false, "error"); },
			complete: function(){ ok(true, "complete"); }
		});
	}, 13);
});

test("jQuery.ajax() - success callbacks (late binding)", function() {
	expect( 8 );

	jQuery.ajaxSetup({ timeout: 0 });

	stop();

	setTimeout(function(){
		jQuery("#foo").ajaxStart(function(){
			ok( true, "ajaxStart" );
		}).ajaxStop(function(){
			ok( true, "ajaxStop" );
			start();
		}).ajaxSend(function(){
			ok( true, "ajaxSend" );
		}).ajaxComplete(function(){
			ok( true, "ajaxComplete" );
		}).ajaxError(function(){
			ok( false, "ajaxError" );
		}).ajaxSuccess(function(){
			ok( true, "ajaxSuccess" );
		});

		jQuery.ajax({
			url: url("data/name.html"),
			beforeSend: function(){ ok(true, "beforeSend"); }
		})
			.complete(function(){ ok(true, "complete"); })
			.success(function(){ ok(true, "success"); })
			.error(function(){ ok(false, "error"); });
	}, 13);
});

test("jQuery.ajax() - success callbacks (oncomplete binding)", function() {
	expect( 8 );

	jQuery.ajaxSetup({ timeout: 0 });

	stop();

	setTimeout(function(){
		jQuery("#foo").ajaxStart(function(){
			ok( true, "ajaxStart" );
		}).ajaxStop(function(){
			ok( true, "ajaxStop" );
		}).ajaxSend(function(){
			ok( true, "ajaxSend" );
		}).ajaxComplete(function(){
			ok( true, "ajaxComplete" );
		}).ajaxError(function(){
			ok( false, "ajaxError" );
		}).ajaxSuccess(function(){
			ok( true, "ajaxSuccess" );
		});

		jQuery.ajax({
			url: url("data/name.html"),
			beforeSend: function(){ ok(true, "beforeSend"); },
			complete: function(xhr) {
				xhr
				.complete(function(){ ok(true, "complete"); })
				.success(function(){ ok(true, "success"); })
				.error(function(){ ok(false, "error"); })
				.complete(function(){ start(); });
			}
		});
	}, 13);
});

test("jQuery.ajax() - success callbacks (very late binding)", function() {
	expect( 8 );

	jQuery.ajaxSetup({ timeout: 0 });

	stop();

	setTimeout(function(){
		jQuery("#foo").ajaxStart(function(){
			ok( true, "ajaxStart" );
		}).ajaxStop(function(){
			ok( true, "ajaxStop" );
		}).ajaxSend(function(){
			ok( true, "ajaxSend" );
		}).ajaxComplete(function(){
			ok( true, "ajaxComplete" );
		}).ajaxError(function(){
			ok( false, "ajaxError" );
		}).ajaxSuccess(function(){
			ok( true, "ajaxSuccess" );
		});

		jQuery.ajax({
			url: url("data/name.html"),
			beforeSend: function(){ ok(true, "beforeSend"); },
			complete: function(xhr) {
				setTimeout (function() {
					xhr
					.complete(function(){ ok(true, "complete"); })
					.success(function(){ ok(true, "success"); })
					.error(function(){ ok(false, "error"); })
					.complete(function(){ start(); });
				},100);
			}
		});
	}, 13);
});

test("jQuery.ajax() - success callbacks (order)", function() {
	expect( 1 );

	jQuery.ajaxSetup({ timeout: 0 });

	stop();

	var testString = "";

	setTimeout(function(){
		jQuery.ajax({
			url: url("data/name.html"),
			success: function( _1 , _2 , xhr ) {
				xhr.success(function() {
					xhr.success(function() {
						testString += "E";
					});
					testString += "D";
				});
				testString += "A";
			},
			complete: function() {
				strictEqual(testString, "ABCDE", "Proper order");
				start();
			}
		}).success(function() {
			testString += "B";
		}).success(function() {
			testString += "C";
		});
	}, 13);
});

test("jQuery.ajax() - error callbacks", function() {
	expect( 8 );
	stop();

	jQuery("#foo").ajaxStart(function(){
		ok( true, "ajaxStart" );
	}).ajaxStop(function(){
		ok( true, "ajaxStop" );
		start();
	}).ajaxSend(function(){
		ok( true, "ajaxSend" );
	}).ajaxComplete(function(){
		ok( true, "ajaxComplete" );
	}).ajaxError(function(){
		ok( true, "ajaxError" );
	}).ajaxSuccess(function(){
		ok( false, "ajaxSuccess" );
	});

	jQuery.ajaxSetup({ timeout: 500 });

	jQuery.ajax({
		url: url("data/name.php?wait=5"),
		beforeSend: function(){ ok(true, "beforeSend"); },
		success: function(){ ok(false, "success"); },
		error: function(){ ok(true, "error"); },
		complete: function(){ ok(true, "complete"); }
	});
});

test( "jQuery.ajax - multiple method signatures introduced in 1.5 ( #8107)", function() {

	expect( 4 );

	stop();

	jQuery.when(
		jQuery.ajax().success(function() { ok( true, "With no arguments" ); }),
		jQuery.ajax("data/name.html").success(function() { ok( true, "With only string URL argument" ); }),
		jQuery.ajax("data/name.html", {} ).success(function() { ok( true, "With string URL param and map" ); }),
		jQuery.ajax({ url: "data/name.html"} ).success(function() { ok( true, "With only map" ); })
	).then( start, start );

});

test("jQuery.ajax() - textStatus and errorThrown values", function() {

	var nb = 2;

	expect( 2 * nb );
	stop();

	function startN() {
		if ( !( --nb ) ) {
			start();
		}
	}

	/*
	Safari 3.x returns "OK" instead of "Not Found"
	Safari 4.x doesn't have this issue so the test should be re-instated once
	we drop support for 3.x

	jQuery.ajax({
		url: url("data/nonExistingURL"),
		error: function( _ , textStatus , errorThrown ){
			strictEqual( textStatus, "error", "textStatus is 'error' for 404" );
			strictEqual( errorThrown, "Not Found", "errorThrown is 'Not Found' for 404");
			startN();
		}
	});
	*/

	jQuery.ajax({
		url: url("data/name.php?wait=5"),
		error: function( _ , textStatus , errorThrown ){
			strictEqual( textStatus, "abort", "textStatus is 'abort' for abort" );
			strictEqual( errorThrown, "abort", "errorThrown is 'abort' for abort");
			startN();
		}
	}).abort();

	jQuery.ajax({
		url: url("data/name.php?wait=5"),
		error: function( _ , textStatus , errorThrown ){
			strictEqual( textStatus, "mystatus", "textStatus is 'mystatus' for abort('mystatus')" );
			strictEqual( errorThrown, "mystatus", "errorThrown is 'mystatus' for abort('mystatus')");
			startN();
		}
	}).abort( "mystatus" );
});

test("jQuery.ajax() - responseText on error", function() {

	expect( 1 );

	stop();

	jQuery.ajax({
		url: url("data/errorWithText.php"),
		error: function(xhr) {
			strictEqual( xhr.responseText , "plain text message" , "Test jqXHR.responseText is filled for HTTP errors" );
		},
		complete: function() {
			start();
		}
	});
});

test(".ajax() - retry with jQuery.ajax( this )", function() {

	expect( 2 );

	stop();

	var firstTime = true,
		previousUrl;

	jQuery.ajax({
		url: url("data/errorWithText.php"),
		error: function() {
			if ( firstTime ) {
				firstTime = false;
				jQuery.ajax( this );
			} else {
				ok( true , "Test retrying with jQuery.ajax(this) works" );
				jQuery.ajax({
					url: url("data/errorWithText.php"),
					data: { x: 1 },
					beforeSend: function() {
						if ( !previousUrl ) {
							previousUrl = this.url;
						} else {
							strictEqual( this.url , previousUrl, "url parameters are not re-appended" );
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

test(".ajax() - headers" , function() {

	expect( 4 );

	stop();

	jQuery("#foo").ajaxSend(function( evt, xhr ) {
		xhr.setRequestHeader( "ajax-send", "test" );
	});

	var requestHeaders = {
			siMPle: "value",
			"SometHing-elsE": "other value",
			OthEr: "something else"
		},
		list = [],
		i;

	for( i in requestHeaders ) {
		list.push( i );
	}
	list.push( "ajax-send" );

	jQuery.ajax(url("data/headers.php?keys="+list.join( "_" ) ), {

		headers: requestHeaders,
		success: function( data , _ , xhr ) {
			var tmp = [];
			for ( i in requestHeaders ) {
				tmp.push( i , ": " , requestHeaders[ i ] , "\n" );
			}
			tmp.push(  "ajax-send: test\n" );
			tmp = tmp.join( "" );

			strictEqual( data , tmp , "Headers were sent" );
			strictEqual( xhr.getResponseHeader( "Sample-Header" ) , "Hello World" , "Sample header received" );
			if ( jQuery.browser.mozilla ) {
				ok( true, "Firefox doesn't support empty headers" );
			} else {
				strictEqual( xhr.getResponseHeader( "Empty-Header" ) , "" , "Empty header received" );
			}
			strictEqual( xhr.getResponseHeader( "Sample-Header2" ) , "Hello World 2" , "Second sample header received" );
		},
		error: function(){ ok(false, "error"); }

	}).then( start, start );

});

test(".ajax() - Accept header" , function() {

	expect( 1 );

	stop();

	jQuery.ajax(url("data/headers.php?keys=accept"), {
		headers: {
			Accept: "very wrong accept value"
		},
		beforeSend: function( xhr ) {
			xhr.setRequestHeader( "Accept", "*/*" );
		},
		success: function( data ) {
			strictEqual( data , "accept: */*\n" , "Test Accept header is set to last value provided" );
			start();
		},
		error: function(){ ok(false, "error"); }
	});

});

test(".ajax() - contentType" , function() {

	expect( 2 );

	stop();

	var count = 2;

	function restart() {
		if ( ! --count ) {
			start();
		}
	}

	jQuery.ajax(url("data/headers.php?keys=content-type" ), {
		contentType: "test",
		success: function( data ) {
			strictEqual( data , "content-type: test\n" , "Test content-type is sent when options.contentType is set" );
		},
		complete: function() {
			restart();
		}
	});

	jQuery.ajax(url("data/headers.php?keys=content-type" ), {
		contentType: false,
		success: function( data ) {
			strictEqual( data , "content-type: \n" , "Test content-type is not sent when options.contentType===false" );
		},
		complete: function() {
			restart();
		}
	});

});

test(".ajax() - protocol-less urls", function() {
	expect(1);

	jQuery.ajax({
		url: "//somedomain.com",
		beforeSend: function( xhr, settings ) {
			equals(settings.url, location.protocol + "//somedomain.com", "Make sure that the protocol is added.");
			return false;
		}
	});
});

test(".ajax() - hash", function() {
	expect(3);

	jQuery.ajax({
		url: "data/name.html#foo",
		beforeSend: function( xhr, settings ) {
			equals(settings.url, "data/name.html", "Make sure that the URL is trimmed.");
			return false;
		}
	});

	jQuery.ajax({
		url: "data/name.html?abc#foo",
		beforeSend: function( xhr, settings ) {
		equals(settings.url, "data/name.html?abc", "Make sure that the URL is trimmed.");
			return false;
		}
	});

	jQuery.ajax({
		url: "data/name.html?abc#foo",
		data: { "test": 123 },
		beforeSend: function( xhr, settings ) {
			equals(settings.url, "data/name.html?abc&test=123", "Make sure that the URL is trimmed.");
			return false;
		}
	});
});

test("jQuery ajax - cross-domain detection", function() {

	expect( 6 );

	var loc = document.location,
		otherPort = loc.port === 666 ? 667 : 666,
		otherProtocol = loc.protocol === "http:" ? "https:" : "http:";

	jQuery.ajax({
		dataType: "jsonp",
		url: otherProtocol + "//" + loc.host,
		beforeSend: function( _ , s ) {
			ok( s.crossDomain , "Test different protocols are detected as cross-domain" );
			return false;
		}
	});

	jQuery.ajax({
		dataType: "jsonp",
		url: "app:/path",
		beforeSend: function( _ , s ) {
			ok( s.crossDomain , "Adobe AIR app:/ URL detected as cross-domain" );
			return false;
		}
	});

	jQuery.ajax({
		dataType: "jsonp",
		url: loc.protocol + "//somewebsitethatdoesnotexist-656329477541.com:" + ( loc.port || 80 ),
		beforeSend: function( _ , s ) {
			ok( s.crossDomain , "Test different hostnames are detected as cross-domain" );
			return false;
		}
	});

	jQuery.ajax({
		dataType: "jsonp",
		url: loc.protocol + "//" + loc.hostname + ":" + otherPort,
		beforeSend: function( _ , s ) {
			ok( s.crossDomain , "Test different ports are detected as cross-domain" );
			return false;
		}
	});

	jQuery.ajax({
		dataType: "jsonp",
		url: "about:blank",
		beforeSend: function( _ , s ) {
			ok( s.crossDomain , "Test about:blank is detected as cross-domain" );
			return false;
		}
	});

	jQuery.ajax({
		dataType: "jsonp",
		url: loc.protocol + "//" + loc.host,
		crossDomain: true,
		beforeSend: function( _ , s ) {
			ok( s.crossDomain , "Test forced crossDomain is detected as cross-domain" );
			return false;
		}
	});

});

test(".load() - 404 error callbacks", function() {
	expect( 6 );
	stop();

	jQuery("#foo").ajaxStart(function(){
		ok( true, "ajaxStart" );
	}).ajaxStop(function(){
		ok( true, "ajaxStop" );
		start();
	}).ajaxSend(function(){
		ok( true, "ajaxSend" );
	}).ajaxComplete(function(){
		ok( true, "ajaxComplete" );
	}).ajaxError(function(){
		ok( true, "ajaxError" );
	}).ajaxSuccess(function(){
		ok( false, "ajaxSuccess" );
	});

	jQuery("<div/>").load("data/404.html", function(){
		ok(true, "complete");
	});
});

test("jQuery.ajax() - abort", function() {
	expect( 8 );
	stop();

	jQuery("#foo").ajaxStart(function(){
		ok( true, "ajaxStart" );
	}).ajaxStop(function(){
		ok( true, "ajaxStop" );
		start();
	}).ajaxSend(function(){
		ok( true, "ajaxSend" );
	}).ajaxComplete(function(){
		ok( true, "ajaxComplete" );
	});

	var xhr = jQuery.ajax({
		url: url("data/name.php?wait=5"),
		beforeSend: function(){ ok(true, "beforeSend"); },
		complete: function(){ ok(true, "complete"); }
	});

	equals( xhr.readyState, 1, "XHR readyState indicates successful dispatch" );

	xhr.abort();
	equals( xhr.readyState, 0, "XHR readyState indicates successful abortion" );
});

test("Ajax events with context", function() {
	expect(14);

	stop();
	var context = document.createElement("div");

	function event(e){
		equals( this, context, e.type );
	}

	function callback(msg){
		return function(){
			equals( this, context, "context is preserved on callback " + msg );
		};
	}

	function nocallback(msg){
		return function(){
			equals( typeof this.url, "string", "context is settings on callback " + msg );
		};
	}

	jQuery("#foo").add(context)
			.ajaxSend(event)
			.ajaxComplete(event)
			.ajaxError(event)
			.ajaxSuccess(event);

	jQuery.ajax({
		url: url("data/name.html"),
		beforeSend: callback("beforeSend"),
		success: callback("success"),
		error: callback("error"),
		complete:function(){
			callback("complete").call(this);

			jQuery.ajax({
				url: url("data/404.html"),
				context: context,
				beforeSend: callback("beforeSend"),
				error: callback("error"),
				complete: function(){
					callback("complete").call(this);

					jQuery("#foo").add(context).unbind();

					jQuery.ajax({
						url: url("data/404.html"),
						beforeSend: nocallback("beforeSend"),
						error: nocallback("error"),
						complete: function(){
							nocallback("complete").call(this);
							start();
						}
					});
				}
			});
		},
		context:context
	});
});

test("jQuery.ajax context modification", function() {
	expect(1);

	stop();

	var obj = {};

	jQuery.ajax({
		url: url("data/name.html"),
		context: obj,
		beforeSend: function(){
			this.test = "foo";
		},
		complete: function() {
			start();
		}
	});

	equals( obj.test, "foo", "Make sure the original object is maintained." );
});

test("jQuery.ajax context modification through ajaxSetup", function() {
	expect(4);

	stop();

	var obj = {};

	jQuery.ajaxSetup({
		context: obj
	});

	strictEqual( jQuery.ajaxSettings.context, obj, "Make sure the context is properly set in ajaxSettings." );

	jQuery.ajax({
		url: url("data/name.html"),
		complete: function() {
			strictEqual( this, obj, "Make sure the original object is maintained." );
			jQuery.ajax({
				url: url("data/name.html"),
				context: {},
				complete: function() {
					ok( this !== obj, "Make sure overidding context is possible." );
					jQuery.ajaxSetup({
						context: false
					});
					jQuery.ajax({
						url: url("data/name.html"),
						beforeSend: function(){
							this.test = "foo2";
						},
						complete: function() {
							ok( this !== obj, "Make sure unsetting context is possible." );
							start();
						}
					});
				}
			});
		}
	});
});

test("jQuery.ajax() - disabled globals", function() {
	expect( 3 );
	stop();

	jQuery("#foo").ajaxStart(function(){
		ok( false, "ajaxStart" );
	}).ajaxStop(function(){
		ok( false, "ajaxStop" );
	}).ajaxSend(function(){
		ok( false, "ajaxSend" );
	}).ajaxComplete(function(){
		ok( false, "ajaxComplete" );
	}).ajaxError(function(){
		ok( false, "ajaxError" );
	}).ajaxSuccess(function(){
		ok( false, "ajaxSuccess" );
	});

	jQuery.ajax({
		global: false,
		url: url("data/name.html"),
		beforeSend: function(){ ok(true, "beforeSend"); },
		success: function(){ ok(true, "success"); },
		error: function(){ ok(false, "error"); },
		complete: function(){
		  ok(true, "complete");
		  setTimeout(function(){ start(); }, 13);
		}
	});
});

test("jQuery.ajax - xml: non-namespace elements inside namespaced elements", function() {
	expect(3);
	stop();
	jQuery.ajax({
	  url: url("data/with_fries.xml"),
	  dataType: "xml",
	  success: function(resp) {
		equals( jQuery("properties", resp).length, 1, "properties in responseXML" );
		equals( jQuery("jsconf", resp).length, 1, "jsconf in responseXML" );
		equals( jQuery("thing", resp).length, 2, "things in responseXML" );
		start();
	  }
	});
});

test("jQuery.ajax - xml: non-namespace elements inside namespaced elements (over JSONP)", function() {
	expect(3);
	stop();
	jQuery.ajax({
	  url: url("data/with_fries_over_jsonp.php"),
	  dataType: "jsonp xml",
	  success: function(resp) {
		equals( jQuery("properties", resp).length, 1, "properties in responseXML" );
		equals( jQuery("jsconf", resp).length, 1, "jsconf in responseXML" );
		equals( jQuery("thing", resp).length, 2, "things in responseXML" );
		start();
	  },
	  error: function(_1,_2,error) {
		ok( false, error );
		start();
	  }
	});
});

test("jQuery.ajax - HEAD requests", function() {
	expect(2);

	stop();
	jQuery.ajax({
		url: url("data/name.html"),
		type: "HEAD",
		success: function(data, status, xhr){
			var h = xhr.getAllResponseHeaders();
			ok( /Date/i.test(h), "No Date in HEAD response" );

			jQuery.ajax({
				url: url("data/name.html"),
				data: { whip_it: "good" },
				type: "HEAD",
				success: function(data, status, xhr){
					var h = xhr.getAllResponseHeaders();
					ok( /Date/i.test(h), "No Date in HEAD response with data" );
					start();
				}
			});
		}
	});

});

test("jQuery.ajax - beforeSend", function() {
	expect(1);
	stop();

	var check = false;

	jQuery.ajaxSetup({ timeout: 0 });

	jQuery.ajax({
		url: url("data/name.html"),
		beforeSend: function(xml) {
			check = true;
		},
		success: function(data) {
			ok( check, "check beforeSend was executed" );
			start();
		}
	});
});

test("jQuery.ajax - beforeSend, cancel request (#2688)", function() {
	expect(2);
	var request = jQuery.ajax({
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
	ok( request === false, "canceled request must return false instead of XMLHttpRequest instance" );
});

test("jQuery.ajax - beforeSend, cancel request manually", function() {
	expect(2);
	var request = jQuery.ajax({
		url: url("data/name.html"),
		beforeSend: function(xhr) {
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
	ok( request === false, "canceled request must return false instead of XMLHttpRequest instance" );
});

window.foobar = null;
window.testFoo = undefined;

test("jQuery.ajax - dataType html", function() {
	expect(5);
	stop();

	var verifyEvaluation = function() {
		equals( testFoo, "foo", "Check if script was evaluated for datatype html" );
		equals( foobar, "bar", "Check if script src was evaluated for datatype html" );

		start();
	};

	jQuery.ajax({
	  dataType: "html",
	  url: url("data/test.html"),
	  success: function(data) {
		jQuery("#ap").html(data);
		ok( data.match(/^html text/), "Check content for datatype html" );
		setTimeout(verifyEvaluation, 600);
	  }
	});
});

test("serialize()", function() {
	expect(5);

	// Add html5 elements only for serialize because selector can't yet find them on non-html5 browsers
	jQuery("#search").after(
		"<input type='email' id='html5email' name='email' value='dave@jquery.com' />"+
		"<input type='number' id='html5number' name='number' value='43' />"
	);

	equals( jQuery("#form").serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3",
		"Check form serialization as query string");

	equals( jQuery("#form :input").serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3",
		"Check input serialization as query string");

	equals( jQuery("#testForm").serialize(),
		"T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=",
		"Check form serialization as query string");

	equals( jQuery("#testForm :input").serialize(),
		"T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=",
		"Check input serialization as query string");

	equals( jQuery("#form, #testForm").serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3&T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=",
		"Multiple form serialization as query string");

  /* Temporarily disabled. Opera 10 has problems with form serialization.
	equals( jQuery("#form, #testForm :input").serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=",
		"Mixed form/input serialization as query string");
	*/
	jQuery("#html5email, #html5number").remove();
});

test("jQuery.param()", function() {
	expect(21);

	equals( !jQuery.ajaxSettings.traditional, true, "traditional flag, falsy by default" );

	var params = {foo:"bar", baz:42, quux:"All your base are belong to us"};
	equals( jQuery.param(params), "foo=bar&baz=42&quux=All+your+base+are+belong+to+us", "simple" );

	params = {someName: [1, 2, 3], regularThing: "blah" };
	equals( jQuery.param(params), "someName%5B%5D=1&someName%5B%5D=2&someName%5B%5D=3&regularThing=blah", "with array" );

	params = {foo: ["a", "b", "c"]};
	equals( jQuery.param(params), "foo%5B%5D=a&foo%5B%5D=b&foo%5B%5D=c", "with array of strings" );

	params = {foo: ["baz", 42, "All your base are belong to us"] };
	equals( jQuery.param(params), "foo%5B%5D=baz&foo%5B%5D=42&foo%5B%5D=All+your+base+are+belong+to+us", "more array" );

	params = {foo: { bar: "baz", beep: 42, quux: "All your base are belong to us" } };
	equals( jQuery.param(params), "foo%5Bbar%5D=baz&foo%5Bbeep%5D=42&foo%5Bquux%5D=All+your+base+are+belong+to+us", "even more arrays" );

	params = { a:[1,2], b:{ c:3, d:[4,5], e:{ x:[6], y:7, z:[8,9] }, f:true, g:false, h:undefined }, i:[10,11], j:true, k:false, l:[undefined,0], m:"cowboy hat?" };
	equals( decodeURIComponent( jQuery.param(params) ), "a[]=1&a[]=2&b[c]=3&b[d][]=4&b[d][]=5&b[e][x][]=6&b[e][y]=7&b[e][z][]=8&b[e][z][]=9&b[f]=true&b[g]=false&b[h]=undefined&i[]=10&i[]=11&j=true&k=false&l[]=undefined&l[]=0&m=cowboy+hat?", "huge structure" );

	params = { a: [ 0, [ 1, 2 ], [ 3, [ 4, 5 ], [ 6 ] ], { b: [ 7, [ 8, 9 ], [ { c: 10, d: 11 } ], [ [ 12 ] ], [ [ [ 13 ] ] ], { e: { f: { g: [ 14, [ 15 ] ] } } }, 16 ] }, 17 ] };
	equals( decodeURIComponent( jQuery.param(params) ), "a[]=0&a[1][]=1&a[1][]=2&a[2][]=3&a[2][1][]=4&a[2][1][]=5&a[2][2][]=6&a[3][b][]=7&a[3][b][1][]=8&a[3][b][1][]=9&a[3][b][2][0][c]=10&a[3][b][2][0][d]=11&a[3][b][3][0][]=12&a[3][b][4][0][0][]=13&a[3][b][5][e][f][g][]=14&a[3][b][5][e][f][g][1][]=15&a[3][b][]=16&a[]=17", "nested arrays" );

	params = { a:[1,2], b:{ c:3, d:[4,5], e:{ x:[6], y:7, z:[8,9] }, f:true, g:false, h:undefined }, i:[10,11], j:true, k:false, l:[undefined,0], m:"cowboy hat?" };
	equals( jQuery.param(params,true), "a=1&a=2&b=%5Bobject+Object%5D&i=10&i=11&j=true&k=false&l=undefined&l=0&m=cowboy+hat%3F", "huge structure, forced traditional" );

	equals( decodeURIComponent( jQuery.param({ a: [1,2,3], "b[]": [4,5,6], "c[d]": [7,8,9], e: { f: [10], g: [11,12], h: 13 } }) ), "a[]=1&a[]=2&a[]=3&b[]=4&b[]=5&b[]=6&c[d][]=7&c[d][]=8&c[d][]=9&e[f][]=10&e[g][]=11&e[g][]=12&e[h]=13", "Make sure params are not double-encoded." );

	// #7945
	equals( jQuery.param({"jquery": "1.4.2"}), "jquery=1.4.2", "Check that object with a jQuery property get serialized correctly" );

	jQuery.ajaxSetup({ traditional: true });

	var params = {foo:"bar", baz:42, quux:"All your base are belong to us"};
	equals( jQuery.param(params), "foo=bar&baz=42&quux=All+your+base+are+belong+to+us", "simple" );

	params = {someName: [1, 2, 3], regularThing: "blah" };
	equals( jQuery.param(params), "someName=1&someName=2&someName=3&regularThing=blah", "with array" );

	params = {foo: ["a", "b", "c"]};
	equals( jQuery.param(params), "foo=a&foo=b&foo=c", "with array of strings" );

	params = {"foo[]":["baz", 42, "All your base are belong to us"]};
	equals( jQuery.param(params), "foo%5B%5D=baz&foo%5B%5D=42&foo%5B%5D=All+your+base+are+belong+to+us", "more array" );

	params = {"foo[bar]":"baz", "foo[beep]":42, "foo[quux]":"All your base are belong to us"};
	equals( jQuery.param(params), "foo%5Bbar%5D=baz&foo%5Bbeep%5D=42&foo%5Bquux%5D=All+your+base+are+belong+to+us", "even more arrays" );

	params = { a:[1,2], b:{ c:3, d:[4,5], e:{ x:[6], y:7, z:[8,9] }, f:true, g:false, h:undefined }, i:[10,11], j:true, k:false, l:[undefined,0], m:"cowboy hat?" };
	equals( jQuery.param(params), "a=1&a=2&b=%5Bobject+Object%5D&i=10&i=11&j=true&k=false&l=undefined&l=0&m=cowboy+hat%3F", "huge structure" );

	params = { a: [ 0, [ 1, 2 ], [ 3, [ 4, 5 ], [ 6 ] ], { b: [ 7, [ 8, 9 ], [ { c: 10, d: 11 } ], [ [ 12 ] ], [ [ [ 13 ] ] ], { e: { f: { g: [ 14, [ 15 ] ] } } }, 16 ] }, 17 ] };
	equals( jQuery.param(params), "a=0&a=1%2C2&a=3%2C4%2C5%2C6&a=%5Bobject+Object%5D&a=17", "nested arrays (not possible when jQuery.param.traditional == true)" );

	params = { a:[1,2], b:{ c:3, d:[4,5], e:{ x:[6], y:7, z:[8,9] }, f:true, g:false, h:undefined }, i:[10,11], j:true, k:false, l:[undefined,0], m:"cowboy hat?" };
	equals( decodeURIComponent( jQuery.param(params,false) ), "a[]=1&a[]=2&b[c]=3&b[d][]=4&b[d][]=5&b[e][x][]=6&b[e][y]=7&b[e][z][]=8&b[e][z][]=9&b[f]=true&b[g]=false&b[h]=undefined&i[]=10&i[]=11&j=true&k=false&l[]=undefined&l[]=0&m=cowboy+hat?", "huge structure, forced not traditional" );

	params = { param1: null };
	equals( jQuery.param(params,false), "param1=null", "Make sure that null params aren't traversed." );

	params = {"test": {"length": 3, "foo": "bar"} };
	equals( jQuery.param( params, false ), "test%5Blength%5D=3&test%5Bfoo%5D=bar", "Sub-object with a length property" );
});

test("synchronous request", function() {
	expect(1);
	ok( /^{ "data"/.test( jQuery.ajax({url: url("data/json_obj.js"), dataType: "text", async: false}).responseText ), "check returned text" );
});

test("synchronous request with callbacks", function() {
	expect(2);
	var result;
	jQuery.ajax({url: url("data/json_obj.js"), async: false, dataType: "text", success: function(data) { ok(true, "sucess callback executed"); result = data; } });
	ok( /^{ "data"/.test( result ), "check returned text" );
});

test("pass-through request object", function() {
	expect(8);
	stop();

	var target = "data/name.html";
	var successCount = 0;
	var errorCount = 0;
	var errorEx = "";
	var success = function() {
		successCount++;
	};
	jQuery("#foo").ajaxError(function (e, xml, s, ex) {
		errorCount++;
		errorEx += ": " + xml.status;
	});
	jQuery("#foo").one("ajaxStop", function () {
		equals(successCount, 5, "Check all ajax calls successful");
		equals(errorCount, 0, "Check no ajax errors (status" + errorEx + ")");
		jQuery("#foo").unbind("ajaxError");

		start();
	});

	ok( jQuery.get(url(target), success), "get" );
	ok( jQuery.post(url(target), success), "post" );
	ok( jQuery.getScript(url("data/test.js"), success), "script" );
	ok( jQuery.getJSON(url("data/json_obj.js"), success), "json" );
	ok( jQuery.ajax({url: url(target), success: success}), "generic" );
});

test("ajax cache", function () {
	expect(18);

	stop();

	var count = 0;

	jQuery("#firstp").bind("ajaxSuccess", function (e, xml, s) {
		var re = /_=(.*?)(&|$)/g;
		var oldOne = null;
		for (var i = 0; i < 6; i++) {
			var ret = re.exec(s.url);
			if (!ret) {
				break;
			}
			oldOne = ret[1];
		}
		equals(i, 1, "Test to make sure only one 'no-cache' parameter is there");
		ok(oldOne != "tobereplaced555", "Test to be sure parameter (if it was there) was replaced");
		if(++count == 6)
			start();
	});

	ok( jQuery.ajax({url: "data/text.php", cache:false}), "test with no parameters" );
	ok( jQuery.ajax({url: "data/text.php?pizza=true", cache:false}), "test with 1 parameter" );
	ok( jQuery.ajax({url: "data/text.php?_=tobereplaced555", cache:false}), "test with _= parameter" );
	ok( jQuery.ajax({url: "data/text.php?pizza=true&_=tobereplaced555", cache:false}), "test with 1 parameter plus _= one" );
	ok( jQuery.ajax({url: "data/text.php?_=tobereplaced555&tv=false", cache:false}), "test with 1 parameter plus _= one before it" );
	ok( jQuery.ajax({url: "data/text.php?name=David&_=tobereplaced555&washere=true", cache:false}), "test with 2 parameters surrounding _= one" );
});

/*
 * Test disabled.
 * The assertions expect that the passed-in object will be modified,
 * which shouldn't be the case. Fixes #5439.
test("global ajaxSettings", function() {
	expect(2);

	var tmp = jQuery.extend({}, jQuery.ajaxSettings);
	var orig = { url: "data/with_fries.xml" };
	var t;

	jQuery.ajaxSetup({ data: {foo: "bar", bar: "BAR"} });

	t = jQuery.extend({}, orig);
	t.data = {};
	jQuery.ajax(t);
	ok( t.url.indexOf("foo") > -1 && t.url.indexOf("bar") > -1, "Check extending {}" );

	t = jQuery.extend({}, orig);
	t.data = { zoo: "a", ping: "b" };
	jQuery.ajax(t);
	ok( t.url.indexOf("ping") > -1 && t.url.indexOf("zoo") > -1 && t.url.indexOf("foo") > -1 && t.url.indexOf("bar") > -1, "Check extending { zoo: "a", ping: "b" }" );

	jQuery.ajaxSettings = tmp;
});
*/

test("load(String)", function() {
	expect(1);
	stop(); // check if load can be called with only url
	jQuery("#first").load("data/name.html", start);
});

test("load('url selector')", function() {
	expect(1);
	stop(); // check if load can be called with only url
	jQuery("#first").load("data/test3.html div.user", function(){
		equals( jQuery(this).children("div").length, 2, "Verify that specific elements were injected" );
		start();
	});
});

test("load(String, Function) with ajaxSetup on dataType json, see #2046", function() {
	expect(1);
	stop();
	jQuery.ajaxSetup({ dataType: "json" });
	jQuery("#first").ajaxComplete(function (e, xml, s) {
		equals( s.dataType, "html", "Verify the load() dataType was html" );
		jQuery("#first").unbind("ajaxComplete");
		jQuery.ajaxSetup({ dataType: "" });
		start();
	});
	jQuery("#first").load("data/test3.html");
});

test("load(String, Function) - simple: inject text into DOM", function() {
	expect(2);
	stop();
	jQuery("#first").load(url("data/name.html"), function() {
		ok( /^ERROR/.test(jQuery("#first").text()), "Check if content was injected into the DOM" );
		start();
	});
});

test("load(String, Function) - check scripts", function() {
	expect(7);
	stop();

	var verifyEvaluation = function() {
		equals( foobar, "bar", "Check if script src was evaluated after load" );
		equals( jQuery("#ap").html(), "bar", "Check if script evaluation has modified DOM");

		start();
	};
	jQuery("#first").load(url("data/test.html"), function() {
		ok( jQuery("#first").html().match(/^html text/), "Check content after loading html" );
		equals( jQuery("#foo").html(), "foo", "Check if script evaluation has modified DOM");
		equals( testFoo, "foo", "Check if script was evaluated after load" );
		setTimeout(verifyEvaluation, 600);
	});
});

test("load(String, Function) - check file with only a script tag", function() {
	expect(3);
	stop();

	jQuery("#first").load(url("data/test2.html"), function() {
		equals( jQuery("#foo").html(), "foo", "Check if script evaluation has modified DOM");
		equals( testFoo, "foo", "Check if script was evaluated after load" );

		start();
	});
});

test("load(String, Function) - dataFilter in ajaxSettings", function() {
	expect(2);
	stop();
	jQuery.ajaxSetup({ dataFilter: function() { return "Hello World"; } });
	var div = jQuery("<div/>").load(url("data/name.html"), function(responseText) {
		strictEqual( div.html(), "Hello World" , "Test div was filled with filtered data" );
		strictEqual( responseText, "Hello World" , "Test callback receives filtered data" );
		jQuery.ajaxSetup({ dataFilter: 0 });
		start();
	});
});

test("load(String, Object, Function)", function() {
	expect(2);
	stop();

	jQuery("<div />").load(url("data/params_html.php"), { foo: 3, bar: "ok" }, function() {
		var $post = jQuery(this).find("#post");
		equals( $post.find("#foo").text(), "3", "Check if a hash of data is passed correctly");
		equals( $post.find("#bar").text(), "ok", "Check if a hash of data is passed correctly");
		start();
	});
});

test("load(String, String, Function)", function() {
	expect(2);
	stop();

	jQuery("<div />").load(url("data/params_html.php"), "foo=3&bar=ok", function() {
		var $get = jQuery(this).find("#get");
		equals( $get.find("#foo").text(), "3", "Check if a string of data is passed correctly");
		equals( $get.find("#bar").text(), "ok", "Check if a	 of data is passed correctly");
		start();
	});
});

test("jQuery.get(String, Function) - data in ajaxSettings (#8277)", function() {
	expect(1);
	stop();
	jQuery.ajaxSetup({
		data: "helloworld"
	});
	jQuery.get(url("data/echoQuery.php"), function(data) {
		ok( /helloworld$/.test( data ), "Data from ajaxSettings was used");
		jQuery.ajaxSetup({
			data: null
		});
		start();
	});
});

test("jQuery.get(String, Hash, Function) - parse xml and use text() on nodes", function() {
	expect(2);
	stop();
	jQuery.get(url("data/dashboard.xml"), function(xml) {
		var content = [];
		jQuery("tab", xml).each(function() {
			content.push(jQuery(this).text());
		});
		equals( content[0], "blabla", "Check first tab");
		equals( content[1], "blublu", "Check second tab");
		start();
	});
});

test("jQuery.getScript(String, Function) - with callback", function() {
	expect(3);
	stop();
	jQuery.getScript(url("data/test.js"), function( data, _, jqXHR ) {
		equals( foobar, "bar", "Check if script was evaluated" );
		strictEqual( data, jqXHR.responseText, "Same-domain script requests returns the source of the script (#8082)" );
		setTimeout(start, 100);
	});
});

test("jQuery.getScript(String, Function) - no callback", function() {
	expect(1);
	stop();
	jQuery.getScript(url("data/test.js"), function(){
		start();
	});
});

jQuery.each( [ "Same Domain", "Cross Domain" ] , function( crossDomain , label ) {

	test("jQuery.ajax() - JSONP, " + label, function() {
		expect(20);

		var count = 0;
		function plus(){ if ( ++count == 18 ) start(); }

		stop();

		jQuery.ajax({
			url: "data/jsonp.php",
			dataType: "jsonp",
			crossDomain: crossDomain,
			success: function(data){
				ok( data.data, "JSON results returned (GET, no callback)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, no callback)" );
				plus();
			}
		});

		jQuery.ajax({
			url: "data/jsonp.php?callback=?",
			dataType: "jsonp",
			crossDomain: crossDomain,
			success: function(data){
				ok( data.data, "JSON results returned (GET, url callback)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, url callback)" );
				plus();
			}
		});

		jQuery.ajax({
			url: "data/jsonp.php",
			dataType: "jsonp",
			crossDomain: crossDomain,
			data: "callback=?",
			success: function(data){
				ok( data.data, "JSON results returned (GET, data callback)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, data callback)" );
				plus();
			}
		});

		jQuery.ajax({
			url: "data/jsonp.php?callback=??",
			dataType: "jsonp",
			crossDomain: crossDomain,
			success: function(data){
				ok( data.data, "JSON results returned (GET, url context-free callback)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, url context-free callback)" );
				plus();
			}
		});

		jQuery.ajax({
			url: "data/jsonp.php",
			dataType: "jsonp",
			crossDomain: crossDomain,
			data: "callback=??",
			success: function(data){
				ok( data.data, "JSON results returned (GET, data context-free callback)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, data context-free callback)" );
				plus();
			}
		});

		jQuery.ajax({
			url: "data/jsonp.php/??",
			dataType: "jsonp",
			crossDomain: crossDomain,
			success: function(data){
				ok( data.data, "JSON results returned (GET, REST-like)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, REST-like)" );
				plus();
			}
		});

		jQuery.ajax({
			url: "data/jsonp.php/???json=1",
			dataType: "jsonp",
			crossDomain: crossDomain,
			success: function(data){
				strictEqual( jQuery.type(data), "array", "JSON results returned (GET, REST-like with param)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, REST-like with param)" );
				plus();
			}
		});

		jQuery.ajax({
			url: "data/jsonp.php",
			dataType: "jsonp",
			crossDomain: crossDomain,
			jsonp: "callback",
			success: function(data){
				ok( data.data, "JSON results returned (GET, data obj callback)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, data obj callback)" );
				plus();
			}
		});

		window.jsonpResults = function(data) {
			ok( data.data, "JSON results returned (GET, custom callback function)" );
			window.jsonpResults = undefined;
			plus();
		};

		jQuery.ajax({
			url: "data/jsonp.php",
			dataType: "jsonp",
			crossDomain: crossDomain,
			jsonpCallback: "jsonpResults",
			success: function(data){
				ok( data.data, "JSON results returned (GET, custom callback name)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, custom callback name)" );
				plus();
			}
		});

		jQuery.ajax({
			url: "data/jsonp.php",
			dataType: "jsonp",
			crossDomain: crossDomain,
			jsonpCallback: "functionToCleanUp",
			success: function(data){
				ok( data.data, "JSON results returned (GET, custom callback name to be cleaned up)" );
				strictEqual( window.functionToCleanUp, undefined, "Callback was removed (GET, custom callback name to be cleaned up)" );
				plus();
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
				xhr.error(function() {
					ok( true, "Ajax error JSON (GET, custom callback name to be cleaned up)" );
					strictEqual( window.functionToCleanUp, undefined, "Callback was removed after early abort (GET, custom callback name to be cleaned up)" );
					plus();
				});
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, custom callback name to be cleaned up)" );
				plus();
			}
		});

		jQuery.ajax({
			type: "POST",
			url: "data/jsonp.php",
			dataType: "jsonp",
			crossDomain: crossDomain,
			success: function(data){
				ok( data.data, "JSON results returned (POST, no callback)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, data obj callback)" );
				plus();
			}
		});

		jQuery.ajax({
			type: "POST",
			url: "data/jsonp.php",
			data: "callback=?",
			dataType: "jsonp",
			crossDomain: crossDomain,
			success: function(data){
				ok( data.data, "JSON results returned (POST, data callback)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (POST, data callback)" );
				plus();
			}
		});

		jQuery.ajax({
			type: "POST",
			url: "data/jsonp.php",
			jsonp: "callback",
			dataType: "jsonp",
			crossDomain: crossDomain,
			success: function(data){
				ok( data.data, "JSON results returned (POST, data obj callback)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (POST, data obj callback)" );
				plus();
			}
		});

		//#7578
		jQuery.ajax({
			url: "data/jsonp.php",
			dataType: "jsonp",
			crossDomain: crossDomain,
			beforeSend: function(){
				strictEqual( this.cache, false, "cache must be false on JSON request" );
				plus();
				return false;
			}
		});

		jQuery.ajax({
			url: "data/jsonp.php?callback=XXX",
			dataType: "jsonp",
			jsonp: false,
			jsonpCallback: "XXX",
			crossDomain: crossDomain,
			beforeSend: function() {
				ok( /^data\/jsonp.php\?callback=XXX&_=\d+$/.test( this.url ) ,
					"The URL wasn't messed with (GET, custom callback name with no url manipulation)" );
				plus();
			},
			success: function(data){
				ok( data.data, "JSON results returned (GET, custom callback name with no url manipulation)" );
				plus();
			},
			error: function(data){
				ok( false, "Ajax error JSON (GET, custom callback name with no url manipulation)" );
				plus();
			}
		});

	});
});

test("jQuery.ajax() - script, Remote", function() {
	expect(2);

	var base = window.location.href.replace(/[^\/]*$/, "");

	stop();

	jQuery.ajax({
		url: base + "data/test.js",
		dataType: "script",
		success: function(data){
			ok( foobar, "Script results returned (GET, no callback)" );
			start();
		}
	});
});

test("jQuery.ajax() - script, Remote with POST", function() {
	expect(3);

	var base = window.location.href.replace(/[^\/]*$/, "");

	stop();

	jQuery.ajax({
		url: base + "data/test.js",
		type: "POST",
		dataType: "script",
		success: function(data, status){
			ok( foobar, "Script results returned (POST, no callback)" );
			equals( status, "success", "Script results returned (POST, no callback)" );
			start();
		},
		error: function(xhr) {
			ok( false, "ajax error, status code: " + xhr.status );
			start();
		}
	});
});

test("jQuery.ajax() - script, Remote with scheme-less URL", function() {
	expect(2);

	var base = window.location.href.replace(/[^\/]*$/, "");
	base = base.replace(/^.*?\/\//, "//");

	stop();

	jQuery.ajax({
		url: base + "data/test.js",
		dataType: "script",
		success: function(data){
			ok( foobar, "Script results returned (GET, no callback)" );
			start();
		}
	});
});

test("jQuery.ajax() - malformed JSON", function() {
	expect(2);

	stop();

	jQuery.ajax({
		url: "data/badjson.js",
		dataType: "json",
		success: function(){
			ok( false, "Success." );
			start();
		},
		error: function(xhr, msg, detailedMsg) {
			equals( "parsererror", msg, "A parse error occurred." );
			ok( /^(Invalid|SyntaxError|exception)/i.test(detailedMsg), "Detailed parsererror message provided" );
	  		start();
		}
	});
});

test("jQuery.ajax() - script by content-type", function() {
	expect(2);

	stop();

	jQuery.when(

		jQuery.ajax({
			url: "data/script.php",
			data: { header: "script" }
		}),

		jQuery.ajax({
			url: "data/script.php",
			data: { header: "ecma" }
		})

	).then( start, start );
});

test("jQuery.ajax() - json by content-type", function() {
	expect(5);

	stop();

	jQuery.ajax({
		url: "data/json.php",
		data: { header: "json", json: "array" },
		success: function( json ) {
	  		ok( json.length >= 2, "Check length");
	  		equals( json[0].name, "John", "Check JSON: first, name" );
	  		equals( json[0].age, 21, "Check JSON: first, age" );
	  		equals( json[1].name, "Peter", "Check JSON: second, name" );
	  		equals( json[1].age, 25, "Check JSON: second, age" );
	  		start();
		}
	});
});

test("jQuery.ajax() - json by content-type disabled with options", function() {
	expect(6);

	stop();

	jQuery.ajax({
		url: url("data/json.php"),
		data: { header: "json", json: "array" },
		contents: {
			json: false
		},
		success: function( text ) {
			equals( typeof text , "string" , "json wasn't auto-determined" );
			var json = jQuery.parseJSON( text );
	  		ok( json.length >= 2, "Check length");
	  		equals( json[0].name, "John", "Check JSON: first, name" );
	  		equals( json[0].age, 21, "Check JSON: first, age" );
	  		equals( json[1].name, "Peter", "Check JSON: second, name" );
	  		equals( json[1].age, 25, "Check JSON: second, age" );
	  		start();
		}
	});
});

test("jQuery.getJSON(String, Hash, Function) - JSON array", function() {
	expect(5);
	stop();
	jQuery.getJSON(url("data/json.php"), {json: "array"}, function(json) {
	  ok( json.length >= 2, "Check length");
	  equals( json[0].name, "John", "Check JSON: first, name" );
	  equals( json[0].age, 21, "Check JSON: first, age" );
	  equals( json[1].name, "Peter", "Check JSON: second, name" );
	  equals( json[1].age, 25, "Check JSON: second, age" );
	  start();
	});
});

test("jQuery.getJSON(String, Function) - JSON object", function() {
	expect(2);
	stop();
	jQuery.getJSON(url("data/json.php"), function(json) {
	  if (json && json.data) {
		  equals( json.data.lang, "en", "Check JSON: lang" );
		  equals( json.data.length, 25, "Check JSON: length" );
	  }
	  start();
	});
});

test("jQuery.getJSON - Using Native JSON", function() {
	expect(2);

	var old = window.JSON;
	JSON = {
		parse: function(str){
			ok( true, "Verifying that parse method was run" );
			return true;
		}
	};

	stop();
	jQuery.getJSON(url("data/json.php"), function(json) {
		window.JSON = old;
		equals( json, true, "Verifying return value" );
		start();
	});
});

test("jQuery.getJSON(String, Function) - JSON object with absolute url to local content", function() {
	expect(2);

	var base = window.location.href.replace(/[^\/]*$/, "");

	stop();
	jQuery.getJSON(url(base + "data/json.php"), function(json) {
	  equals( json.data.lang, "en", "Check JSON: lang" );
	  equals( json.data.length, 25, "Check JSON: length" );
	  start();
	});
});

test("jQuery.post - data", 3, function() {
	stop();

	jQuery.when(
		jQuery.post( url( "data/name.php" ), { xml: "5-2", length: 3 }, function( xml ) {
			jQuery( "math", xml ).each( function() {
				equals( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
				equals( jQuery( "result", this ).text(), "3", "Check for XML" );
			});
		}),

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
				strictEqual( data, "test%5Blength%5D=7&test%5Bfoo%5D=bar", "Check if a sub-object with a length param is serialized correctly");
			}
		})
	).then( start, start );

});

test("jQuery.post(String, Hash, Function) - simple with xml", function() {
	expect(4);
	stop();
	var done = 0;

	jQuery.post(url("data/name.php"), {xml: "5-2"}, function(xml){
	  jQuery("math", xml).each(function() {
			equals( jQuery("calculation", this).text(), "5-2", "Check for XML" );
			equals( jQuery("result", this).text(), "3", "Check for XML" );
		 });
	  if ( ++done === 2 ) start();
	});

	jQuery.post(url("data/name.php?xml=5-2"), {}, function(xml){
	  jQuery("math", xml).each(function() {
			equals( jQuery("calculation", this).text(), "5-2", "Check for XML" );
			equals( jQuery("result", this).text(), "3", "Check for XML" );
		 });
	  if ( ++done === 2 ) start();
	});
});

test("jQuery.ajaxSetup({timeout: Number}) - with global timeout", function() {
	stop();

	var passed = 0;

	jQuery.ajaxSetup({timeout: 1000});

	var pass = function() {
		passed++;
		if ( passed == 2 ) {
			ok( true, "Check local and global callbacks after timeout" );
			jQuery("#qunit-fixture").unbind("ajaxError");
			start();
		}
	};

	var fail = function(a,b,c) {
		ok( false, "Check for timeout failed " + a + " " + b );
		start();
	};

	jQuery("#qunit-fixture").ajaxError(pass);

	jQuery.ajax({
	  type: "GET",
	  url: url("data/name.php?wait=5"),
	  error: pass,
	  success: fail
	});

	// reset timeout
	jQuery.ajaxSetup({timeout: 0});
});

test("jQuery.ajaxSetup({timeout: Number}) with localtimeout", function() {
	stop();
	jQuery.ajaxSetup({timeout: 50});

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

	// reset timeout
	jQuery.ajaxSetup({timeout: 0});
});

test("jQuery.ajax - simple get", function() {
	expect(1);
	stop();
	jQuery.ajax({
	  type: "GET",
	  url: url("data/name.php?name=foo"),
	  success: function(msg){
		equals( msg, "bar", "Check for GET" );
		start();
	  }
	});
});

test("jQuery.ajax - simple post", function() {
	expect(1);
	stop();
	jQuery.ajax({
	  type: "POST",
	  url: url("data/name.php"),
	  data: "name=peter",
	  success: function(msg){
		equals( msg, "pan", "Check for POST" );
		start();
	  }
	});
});

test("ajaxSetup()", function() {
	expect(1);
	stop();
	jQuery.ajaxSetup({
		url: url("data/name.php?name=foo"),
		success: function(msg){
			equals( msg, "bar", "Check for GET" );
			start();
		}
	});
	jQuery.ajax();
});

/*
test("custom timeout does not set error message when timeout occurs, see #970", function() {
	stop();
	jQuery.ajax({
		url: "data/name.php?wait=1",
		timeout: 500,
		error: function(request, status) {
			ok( status != null, "status shouldn't be null in error handler" );
			equals( "timeout", status );
			start();
		}
	});
});
*/

test("data option: evaluate function values (#2806)", function() {
	stop();
	jQuery.ajax({
		url: "data/echoQuery.php",
		data: {
			key: function() {
				return "value";
			}
		},
		success: function(result) {
			equals( result, "key=value" );
			start();
		}
	});
});

test("data option: empty bodies for non-GET requests", function() {
	stop();
	jQuery.ajax({
		url: "data/echoData.php",
		data: undefined,
		type: "post",
		success: function(result) {
			equals( result, "" );
			start();
		}
	});
});

var ifModifiedNow = new Date();

jQuery.each( { " (cache)": true, " (no cache)": false }, function( label, cache ) {

	test("jQuery.ajax - If-Modified-Since support" + label, function() {
		expect( 3 );

		stop();

		var url = "data/if_modified_since.php?ts=" + ifModifiedNow++;

		jQuery.ajax({
			url: url,
			ifModified: true,
			cache: cache,
			success: function(data, status) {
				equals(status, "success" );

				jQuery.ajax({
					url: url,
					ifModified: true,
					cache: cache,
					success: function(data, status) {
						if ( data === "FAIL" ) {
							ok(jQuery.browser.opera, "Opera is incapable of doing .setRequestHeader('If-Modified-Since').");
							ok(jQuery.browser.opera, "Opera is incapable of doing .setRequestHeader('If-Modified-Since').");
						} else {
							equals(status, "notmodified");
							ok(data == null, "response body should be empty");
						}
						start();
			        },
					error: function() {
						// Do this because opera simply refuses to implement 304 handling :(
						// A feature-driven way of detecting this would be appreciated
						// See: http://gist.github.com/599419
						ok(jQuery.browser.opera, "error");
						ok(jQuery.browser.opera, "error");
						start();
					}
				});
			},
			error: function() {
				equals(false, "error");
				// Do this because opera simply refuses to implement 304 handling :(
				// A feature-driven way of detecting this would be appreciated
				// See: http://gist.github.com/599419
				ok(jQuery.browser.opera, "error");
				start();
			}
		});
	});

	test("jQuery.ajax - Etag support" + label, function() {
		expect( 3 );

		stop();

		var url = "data/etag.php?ts=" + ifModifiedNow++;

		jQuery.ajax({
			url: url,
			ifModified: true,
			cache: cache,
			success: function(data, status) {
				equals(status, "success" );

				jQuery.ajax({
					url: url,
					ifModified: true,
					cache: cache,
					success: function(data, status) {
						if ( data === "FAIL" ) {
							ok(jQuery.browser.opera, "Opera is incapable of doing .setRequestHeader('If-None-Match').");
							ok(jQuery.browser.opera, "Opera is incapable of doing .setRequestHeader('If-None-Match').");
						} else {
							equals(status, "notmodified");
							ok(data == null, "response body should be empty");
						}
						start();
			        },
			        error: function() {
						// Do this because opera simply refuses to implement 304 handling :(
						// A feature-driven way of detecting this would be appreciated
						// See: http://gist.github.com/599419
						ok(jQuery.browser.opera, "error");
						ok(jQuery.browser.opera, "error");
						start();
					}
				});
			},
			error: function() {
				// Do this because opera simply refuses to implement 304 handling :(
				// A feature-driven way of detecting this would be appreciated
				// See: http://gist.github.com/599419
				ok(jQuery.browser.opera, "error");
				start();
			}
		});
	});
});

test("jQuery ajax - failing cross-domain", function() {

	expect( 2 );

	stop();

	var i = 2;

	jQuery.ajax({
		url: "http://somewebsitethatdoesnotexist-67864863574657654.com",
		success: function(){ ok( false , "success" ); },
		error: function(xhr,_,e){ ok( true , "file not found: " + xhr.status + " => " + e ); },
		complete: function() { if ( ! --i ) start(); }
	});

	jQuery.ajax({
		url: "http://www.google.com",
		success: function(){ ok( false , "success" ); },
		error: function(xhr,_,e){ ok( true , "access denied: " + xhr.status + " => " + e ); },
		complete: function() { if ( ! --i ) start(); }
	});

});

test("jQuery ajax - atom+xml", function() {

	stop();

	jQuery.ajax({
		url: url( "data/atom+xml.php" ),
		success: function(){ ok( true , "success" ); },
		error: function(){ ok( false , "error" ); },
		complete: function() { start(); }
	});

});

test( "jQuery.ajax - Location object as url (#7531)", 1, function () {
	var success = false;
	try {
		var xhr = jQuery.ajax({ url: window.location });
		success = true;
		xhr.abort();
	} catch (e) {}

	ok( success, "document.location did not generate exception" );
});

test( "jQuery.ajax - Context with circular references (#9887)", 2, function () {
	var success = false,
		context = {};
	context.field = context;
	try {
		success = !jQuery.ajax( "non-existing", {
			context: context,
			beforeSend: function() {
				ok( this === context, "context was not deep extended" );
				return false;
			}
		});
	} catch (e) { console.log( e ); }
	ok( success, "context with circular reference did not generate an exception" );
});

test( "jQuery.ajax - statusText" , 4, function() {
	stop();
	jQuery.ajax( url( "data/statusText.php?status=200&text=Hello" ) ).done(function( _, statusText, jqXHR ) {
		strictEqual( statusText, "success", "callback status text ok for success" );
		ok( jqXHR.statusText === "Hello" || jQuery.browser.safari && jqXHR.statusText === "OK", "jqXHR status text ok for success (" + jqXHR.statusText + ")" );
		jQuery.ajax( url( "data/statusText.php?status=404&text=World" ) ).fail(function( jqXHR, statusText ) {
			strictEqual( statusText, "error", "callback status text ok for error" );
			ok( jqXHR.statusText === "World" || jQuery.browser.safari && jqXHR.statusText === "Not Found", "jqXHR status text ok for error (" + jqXHR.statusText + ")" );
			start();
		});
	});
});

test( "jQuery.ajax - statusCode" , function() {

	var count = 12;

	expect( 20 );
	stop();

	function countComplete() {
		if ( ! --count ) {
			start();
		}
	}

	function createStatusCodes( name , isSuccess ) {
		name = "Test " + name + " " + ( isSuccess ? "success" : "error" );
		return {
			200: function() {
				ok( isSuccess , name );
			},
			404: function() {
				ok( ! isSuccess , name );
			}
		};
	}

	jQuery.each( {
		"data/name.html": true,
		"data/someFileThatDoesNotExist.html": false
	} , function( uri , isSuccess ) {

		jQuery.ajax( url( uri ) , {
			statusCode: createStatusCodes( "in options" , isSuccess ),
			complete: countComplete
		});

		jQuery.ajax( url( uri ) , {
			complete: countComplete
		}).statusCode( createStatusCodes( "immediately with method" , isSuccess ) );

		jQuery.ajax( url( uri ) , {
			complete: function(jqXHR) {
				jqXHR.statusCode( createStatusCodes( "on complete" , isSuccess ) );
				countComplete();
			}
		});

		jQuery.ajax( url( uri ) , {
			complete: function(jqXHR) {
				setTimeout( function() {
					jqXHR.statusCode( createStatusCodes( "very late binding" , isSuccess ) );
					countComplete();
				} , 100 );
			}
		});

		jQuery.ajax( url( uri ) , {
			statusCode: createStatusCodes( "all (options)" , isSuccess ),
			complete: function(jqXHR) {
				jqXHR.statusCode( createStatusCodes( "all (on complete)" , isSuccess ) );
				setTimeout( function() {
					jqXHR.statusCode( createStatusCodes( "all (very late binding)" , isSuccess ) );
					countComplete();
				} , 100 );
			}
		}).statusCode( createStatusCodes( "all (immediately with method)" , isSuccess ) );

		var testString = "";

		jQuery.ajax( url( uri ), {
			success: function( a , b , jqXHR ) {
				ok( isSuccess , "success" );
				var statusCode = {};
				statusCode[ jqXHR.status ] = function() {
					testString += "B";
				};
				jqXHR.statusCode( statusCode );
				testString += "A";
			},
			error: function( jqXHR ) {
				ok( ! isSuccess , "error" );
				var statusCode = {};
				statusCode[ jqXHR.status ] = function() {
					testString += "B";
				};
				jqXHR.statusCode( statusCode );
				testString += "A";
			},
			complete: function() {
				strictEqual( testString , "AB" , "Test statusCode callbacks are ordered like " +
						( isSuccess ? "success" :  "error" ) + " callbacks" );
				countComplete();
			}
		} );

	});
});

test("jQuery.ajax - transitive conversions", function() {

	expect( 8 );

	stop();

	jQuery.when(

		jQuery.ajax( url("data/json.php") , {
			converters: {
				"json myJson": function( data ) {
					ok( true , "converter called" );
					return data;
				}
			},
			dataType: "myJson",
			success: function() {
				ok( true , "Transitive conversion worked" );
				strictEqual( this.dataTypes[0] , "text" , "response was retrieved as text" );
				strictEqual( this.dataTypes[1] , "myjson" , "request expected myjson dataType" );
			}
		}),

		jQuery.ajax( url("data/json.php") , {
			converters: {
				"json myJson": function( data ) {
					ok( true , "converter called (*)" );
					return data;
				}
			},
			contents: false, /* headers are wrong so we ignore them */
			dataType: "* myJson",
			success: function() {
				ok( true , "Transitive conversion worked (*)" );
				strictEqual( this.dataTypes[0] , "text" , "response was retrieved as text (*)" );
				strictEqual( this.dataTypes[1] , "myjson" , "request expected myjson dataType (*)" );
			}
		})

	).then( start , start );

});

test("jQuery.ajax - overrideMimeType", function() {

	expect( 2 );

	stop();

	jQuery.when(

		jQuery.ajax( url("data/json.php") , {
			beforeSend: function( xhr ) {
				xhr.overrideMimeType( "application/json" );
			},
			success: function( json ) {
				ok( json.data , "Mimetype overriden using beforeSend" );
			}
		}),

		jQuery.ajax( url("data/json.php") , {
			mimeType: "application/json",
			success: function( json ) {
				ok( json.data , "Mimetype overriden using mimeType option" );
			}
		})

	).then( start , start );

});

test("jQuery.ajax - abort in prefilter", function() {

	expect( 1 );

	jQuery.ajaxPrefilter(function( options, _, jqXHR ) {
		if ( options.abortInPrefilter ) {
			jqXHR.abort();
		}
	});

	strictEqual( jQuery.ajax({
		abortInPrefilter: true,
		error: function() {
			ok( false, "error callback called" );
		}
	}), false, "Request was properly aborted early by the prefilter" );

});

test("jQuery.ajax - active counter", function() {
    ok( jQuery.active == 0, "ajax active counter should be zero: " + jQuery.active );
});

}

//}
