module("ajax");

// Safari 3 randomly crashes when running these tests,
// but only in the full suite - you can run just the Ajax
// tests and they'll pass
//if ( !jQuery.browser.safari ) {

if ( !isLocal ) {

test("jQuery.ajax() - success callbacks", function() {
	expect( 8 );
	
	jQuery.ajaxSetup({ timeout: 0 });
	
	stop();
	
	setTimeout(function(){	
        jQuery('#foo').ajaxStart(function(){
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
    }, 13);
});

test("jQuery.ajax() - error callbacks", function() {
    expect( 8 );
    stop();
    
    jQuery('#foo').ajaxStart(function(){
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

test("jQuery.ajax() - disabled globals", function() {
	expect( 3 );
	stop();
	
	jQuery('#foo').ajaxStart(function(){
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
	    equals( jQuery("properties", resp).length, 1, 'properties in responseXML' );
	    equals( jQuery("jsconf", resp).length, 1, 'jsconf in responseXML' );
	    equals( jQuery("thing", resp).length, 2, 'things in responseXML' );
	    start();
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

window.foobar = null;
window.testFoo = undefined;

test("jQuery.ajax - dataType html", function() {
	expect(5);
	stop();
	
	var verifyEvaluation = function() {
		equals( testFoo, "foo", 'Check if script was evaluated for datatype html' );
		equals( foobar, "bar", 'Check if script src was evaluated for datatype html' );
	  
		start();
	};

	jQuery.ajax({
	  dataType: "html",
	  url: url("data/test.html"),
	  success: function(data) {
	  	jQuery("#ap").html(data);
	    ok( data.match(/^html text/), 'Check content for datatype html' );
	    setTimeout(verifyEvaluation, 600);
	  }
	});
});

test("serialize()", function() {
	expect(6);
	
	equals( jQuery('#form').serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&select1=&select2=3&select3=1&select3=2",
		'Check form serialization as query string');
		
	equals( jQuery('#form :input').serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&select1=&select2=3&select3=1&select3=2",
		'Check input serialization as query string');
	
	equals( jQuery('#testForm').serialize(), 
		'T3=%3F%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=', 
		'Check form serialization as query string');
		
	equals( jQuery('#testForm :input').serialize(), 
		'T3=%3F%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=', 
		'Check input serialization as query string');
		
	equals( jQuery('#form, #testForm').serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&select1=&select2=3&select3=1&select3=2&T3=%3F%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=",
		'Multiple form serialization as query string');
		
	equals( jQuery('#form, #testForm :input').serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&select1=&select2=3&select3=1&select3=2&T3=%3F%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=",
		'Mixed form/input serialization as query string');
});

test("jQuery.param()", function() {
	expect(4);
	var params = {foo:"bar", baz:42, quux:"All your base are belong to us"};
	equals( jQuery.param(params), "foo=bar&baz=42&quux=All+your+base+are+belong+to+us", "simple" );
	
	params = {someName: [1, 2, 3], regularThing: "blah" };
	equals( jQuery.param(params), "someName=1&someName=2&someName=3&regularThing=blah", "with array" );
	
	params = {"foo[]":["baz", 42, "All your base are belong to us"]};
	equals( jQuery.param(params), "foo%5B%5D=baz&foo%5B%5D=42&foo%5B%5D=All+your+base+are+belong+to+us", "more array" );
	
	params = {"foo[bar]":"baz", "foo[beep]":42, "foo[quux]":"All your base are belong to us"};
	equals( jQuery.param(params), "foo%5Bbar%5D=baz&foo%5Bbeep%5D=42&foo%5Bquux%5D=All+your+base+are+belong+to+us", "even more arrays" );
});

test("synchronous request", function() {
	expect(1);
	ok( /^{ "data"/.test( jQuery.ajax({url: url("data/json_obj.js"), async: false}).responseText ), "check returned text" );
});

test("synchronous request with callbacks", function() {
	expect(2);
	var result;
	jQuery.ajax({url: url("data/json_obj.js"), async: false, success: function(data) { ok(true, "sucess callback executed"); result = data; } });
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
	jQuery("#foo").one('ajaxStop', function () {
		equals(successCount, 5, "Check all ajax calls successful");
		equals(errorCount, 0, "Check no ajax errors (status" + errorEx + ")");
		jQuery("#foo").unbind('ajaxError');
		
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

test("global ajaxSettings", function() {
	expect(2);

	var tmp = jQuery.extend({}, jQuery.ajaxSettings);
    var orig = { url: "data/with_fries.xml" };
	var t;

	jQuery.ajaxSetup({ data: {foo: 'bar', bar: 'BAR'} });

    t = jQuery.extend({}, orig);
	t.data = {};
    jQuery.ajax(t);
	ok( t.url.indexOf('foo') > -1 && t.url.indexOf('bar') > -1, "Check extending {}" );

    t = jQuery.extend({}, orig);
	t.data = { zoo: 'a', ping: 'b' };
    jQuery.ajax(t);
	ok( t.url.indexOf('ping') > -1 && t.url.indexOf('zoo') > -1 && t.url.indexOf('foo') > -1 && t.url.indexOf('bar') > -1, "Check extending { zoo: 'a', ping: 'b' }" );
	
	jQuery.ajaxSettings = tmp;
});

test("load(String)", function() {
	expect(1);
	stop(); // check if load can be called with only url
	jQuery('#first').load("data/name.html", start);
});

test("load('url selector')", function() {
	expect(1);
	stop(); // check if load can be called with only url
	jQuery('#first').load("data/test3.html div.user", function(){
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
	jQuery('#first').load("data/test3.html");
});

test("load(String, Function) - simple: inject text into DOM", function() {
	expect(2);
	stop();
	jQuery('#first').load(url("data/name.html"), function() {
		ok( /^ERROR/.test(jQuery('#first').text()), 'Check if content was injected into the DOM' );
		start();
	});
});

test("load(String, Function) - check scripts", function() {
	expect(7);
	stop();
	
	var verifyEvaluation = function() {
		equals( foobar, "bar", 'Check if script src was evaluated after load' );
		equals( jQuery('#ap').html(), 'bar', 'Check if script evaluation has modified DOM');
		
		start();
	};
	jQuery('#first').load(url('data/test.html'), function() {
		ok( jQuery('#first').html().match(/^html text/), 'Check content after loading html' );
		equals( jQuery('#foo').html(), 'foo', 'Check if script evaluation has modified DOM');
		equals( testFoo, "foo", 'Check if script was evaluated after load' );
		setTimeout(verifyEvaluation, 600);
	});
});

test("load(String, Function) - check file with only a script tag", function() {
	expect(3);
	stop();

	jQuery('#first').load(url('data/test2.html'), function() {
		equals( jQuery('#foo').html(), 'foo', 'Check if script evaluation has modified DOM');
		equals( testFoo, "foo", 'Check if script was evaluated after load' );
		
		start();
	});
});

test("load(String, Object, Function)", function() {
	expect(2);
	stop();
	
	jQuery('<div />').load(url('data/params_html.php'), { foo:3, bar:'ok' }, function() {
		var $post = jQuery(this).find('#post');		
		equals( $post.find('#foo').text(), '3', 'Check if a hash of data is passed correctly');
		equals( $post.find('#bar').text(), 'ok', 'Check if a hash of data is passed correctly');
		start();
	});
});

test("load(String, String, Function)", function() {
	expect(2);
	stop();
	
	jQuery('<div />').load(url('data/params_html.php'), 'foo=3&bar=ok', function() {
		var $get = jQuery(this).find('#get');		
		equals( $get.find('#foo').text(), '3', 'Check if a string of data is passed correctly');
		equals( $get.find('#bar').text(), 'ok', 'Check if a  of data is passed correctly');
		start();
	});
});

test("jQuery.get(String, Hash, Function) - parse xml and use text() on nodes", function() {
	expect(2);
	stop();
	jQuery.get(url('data/dashboard.xml'), function(xml) {
		var content = [];
		jQuery('tab', xml).each(function() {
			content.push(jQuery(this).text());
		});
		equals( content[0], 'blabla', 'Check first tab');
		equals( content[1], 'blublu', 'Check second tab');
		start();
	});
});

test("jQuery.getScript(String, Function) - with callback", function() {
	expect(2);
	stop();
	jQuery.getScript(url("data/test.js"), function() {
		equals( foobar, "bar", 'Check if script was evaluated' );
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

test("jQuery.ajax() - JSONP, Local", function() {
	expect(7);

	var count = 0;
	function plus(){ if ( ++count == 7 ) start(); }

	stop();

	jQuery.ajax({
		url: "data/jsonp.php",
		dataType: "jsonp",
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
		url: "data/jsonp.php",
		dataType: "jsonp",
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

	jQuery.ajax({
		type: "POST",
		url: "data/jsonp.php",
		dataType: "jsonp",
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
		success: function(data){
			ok( data.data, "JSON results returned (POST, data obj callback)" );
			plus();
		},
		error: function(data){
			ok( false, "Ajax error JSON (POST, data obj callback)" );
			plus();
		}
	});
});

test("jQuery.ajax() - JSONP, Remote", function() {
	expect(4);

	var count = 0;
	function plus(){ if ( ++count == 4 ) start(); }

	var base = window.location.href.replace(/\?.*$/, "");

	stop();

	jQuery.ajax({
		url: base + "data/jsonp.php",
		dataType: "jsonp",
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
		url: base + "data/jsonp.php?callback=?",
		dataType: "jsonp",
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
		url: base + "data/jsonp.php",
		dataType: "jsonp",
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
		url: base + "data/jsonp.php",
		dataType: "jsonp",
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
});

test("jQuery.ajax() - script, Remote", function() {
	expect(2);

	var base = window.location.href.replace(/\?.*$/, "");

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

	var base = window.location.href.replace(/\?.*$/, "");

	stop();

	jQuery.ajax({
		url: base + "data/test.js",
		type: "POST",
		dataType: "script",
		success: function(data, status){
			ok( foobar, "Script results returned (GET, no callback)" );
			equals( status, "success", "Script results returned (GET, no callback)" );
			start();
		}
	});
});

test("jQuery.ajax() - script, Remote with scheme-less URL", function() {
	expect(2);

	var base = window.location.href.replace(/\?.*$/, "");
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

test("jQuery.getJSON(String, Hash, Function) - JSON array", function() {
	expect(4);
	stop();
	jQuery.getJSON(url("data/json.php"), {json: "array"}, function(json) {
	  equals( json[0].name, 'John', 'Check JSON: first, name' );
	  equals( json[0].age, 21, 'Check JSON: first, age' );
	  equals( json[1].name, 'Peter', 'Check JSON: second, name' );
	  equals( json[1].age, 25, 'Check JSON: second, age' );
	  start();
	});
});

test("jQuery.getJSON(String, Function) - JSON object", function() {
	expect(2);
	stop();
	jQuery.getJSON(url("data/json.php"), function(json) {
	  equals( json.data.lang, 'en', 'Check JSON: lang' );
	  equals( json.data.length, 25, 'Check JSON: length' );
	  start();
	});
});

test("jQuery.getJSON(String, Function) - JSON object with absolute url to local content", function() {
	expect(2);

	var base = window.location.href.replace(/\?.*$/, "");

	stop();
	jQuery.getJSON(url(base + "data/json.php"), function(json) {
	  equals( json.data.lang, 'en', 'Check JSON: lang' );
	  equals( json.data.length, 25, 'Check JSON: length' );
	  start();
	});
});

test("jQuery.post(String, Hash, Function) - simple with xml", function() {
	expect(4);
	stop();
	var done = 0;

	jQuery.post(url("data/name.php"), {xml: "5-2"}, function(xml){
	  jQuery('math', xml).each(function() {
		    equals( jQuery('calculation', this).text(), '5-2', 'Check for XML' );
		    equals( jQuery('result', this).text(), '3', 'Check for XML' );
		 });
	  if ( ++done === 2 ) start();
	});

	jQuery.post(url("data/name.php?xml=5-2"), {}, function(xml){
	  jQuery('math', xml).each(function() {
		    equals( jQuery('calculation', this).text(), '5-2', 'Check for XML' );
		    equals( jQuery('result', this).text(), '3', 'Check for XML' );
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
			ok( true, 'Check local and global callbacks after timeout' );
	     	jQuery('#main').unbind("ajaxError");
			start();
		}
	};
	
	var fail = function(a,b,c) {
		ok( false, 'Check for timeout failed ' + a + ' ' + b );
		start();
	};
	
	jQuery('#main').ajaxError(pass);
	
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
	  timeout: 5000,
	  url: url("data/name.php?wait=1"),
	  error: function() {
		   ok( false, 'Check for local timeout failed' );
		   start();
	  },
	  success: function() {
	    ok( true, 'Check for local timeout' );
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
	    equals( msg, 'bar', 'Check for GET' );
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
	    equals( msg, 'pan', 'Check for POST' );
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
	    	equals( msg, 'bar', 'Check for GET' );
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
	})
});

}

//}
