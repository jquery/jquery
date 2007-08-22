module("ajax");

// Safari 3 randomly crashes when running these tests,
// but only in the full suite - you can run just the Ajax
// tests and they'll pass
if ( !jQuery.browser.safari ) {

test("serialize()", function() {
	expect(1);
	// ignore button, IE takes text content as value, not relevant for this test
	equals( $(':input').not('button').serialize(), 
		'action=Test&text2=Test&radio1=on&radio2=on&check=on&=on&hidden=&foo%5Bbar%5D=&name=name&=foobar&select1=&select2=3&select3=1&test=&id=', 
		'Check form serialization as query string');
});

test("$.param()", function() {
	expect(4);
	var params = {foo:"bar", baz:42, quux:"All your base are belong to us"};
	equals( $.param(params), "foo=bar&baz=42&quux=All%20your%20base%20are%20belong%20to%20us", "simple" );
	
	params = {someName: [1, 2, 3], regularThing: "blah" };
	equals( $.param(params), "someName=1&someName=2&someName=3&regularThing=blah", "with array" );
	
	params = {"foo[]":["baz", 42, "All your base are belong to us"]};
	equals( $.param(params), "foo%5B%5D=baz&foo%5B%5D=42&foo%5B%5D=All%20your%20base%20are%20belong%20to%20us", "more array" );
	
	params = {"foo[bar]":"baz", "foo[beep]":42, "foo[quux]":"All your base are belong to us"};
	equals( $.param(params), "foo%5Bbar%5D=baz&foo%5Bbeep%5D=42&foo%5Bquux%5D=All%20your%20base%20are%20belong%20to%20us", "even more arrays" );
});

test("synchronous request", function() {
	expect(1);
	ok( /^{ "data"/.test( $.ajax({url: url("data/json_obj.js"), async: false}).responseText ), "check returned text" );
});

test("synchronous request with callbacks", function() {
	expect(2);
	var result;
	$.ajax({url: url("data/json_obj.js"), async: false, success: function(data) { ok(true, "sucess callback executed"); result = data; } });
	ok( /^{ "data"/.test( result ), "check returned text" );
});

test("pass-through request object", function() {
	expect(1);
	stop(true);
	
	var target = "data/name.html";
	var count = 0;
	var success = function() {
		// Disabled
		//if(count++ == 5)
		start();
	};
	
	/* Test disabled, too many simultaneous requests
	ok( $.get(url(target), success), "get" );
	ok( $.getIfModified(url(target), success), "getIfModified" );
	ok( $.post(url(target), success), "post" );
	ok( $.getScript(url("data/test.js"), success), "script" );
	ok( $.getJSON(url("data/json_obj.js"), success), "json" );
	*/
	ok( $.ajax({url: url(target), success: success}), "generic" );
});

test("global ajaxSettings", function() {
	expect(3);

	var tmp = jQuery.extend({}, jQuery.ajaxSettings);
        var orig = { url: "data/with_fries.xml", data: null };
	var t;

	$.ajaxSetup({ data: {foo: 'bar', bar: 'BAR'} });

        t = jQuery.extend({}, orig);
        $.ajax(t);
	ok( t.url.indexOf('foo') > -1 && t.url.indexOf('bar') > -1, "Check extending null" );

        t = jQuery.extend({}, orig);
	t.data = {};
        $.ajax(t);
	ok( t.url.indexOf('foo') > -1 && t.url.indexOf('bar') > -1, "Check extending {}" );

        t = jQuery.extend({}, orig);
	t.data = { zoo: 'a', ping: 'b' };
        $.ajax(t);
	ok( t.url.indexOf('ping') > -1 && t.url.indexOf('zoo') > -1 && t.url.indexOf('foo') > -1 && t.url.indexOf('bar') > -1, "Check extending { zoo: 'a', ping: 'b' }" );
	
	jQuery.ajaxSettings = tmp;
});

test("load(String)", function() {
	expect(1);
	stop(true); // check if load can be called with only url
	$('#first').load("data/name.html", start);
});

test("load(String, Function) - simple: inject text into DOM", function() {
	expect(2);
	stop();
	$('#first').load(url("data/name.html"), function() {
		ok( /^ERROR/.test($('#first').text()), 'Check if content was injected into the DOM' );
		start();
	});
});

test("load(String, Function) - check scripts", function() {
	expect(7);
	stop();
	window.testFoo = undefined;
	window.foobar = null;
	var verifyEvaluation = function() {
	  equals( foobar, "bar", 'Check if script src was evaluated after load' );
	  equals( $('#ap').html(), 'bar', 'Check if script evaluation has modified DOM');
	  start();
	};
	$('#first').load(url('data/test.html'), function() {
	  ok( $('#first').html().match(/^html text/), 'Check content after loading html' );
	  equals( $('#foo').html(), 'foo', 'Check if script evaluation has modified DOM');
	  equals( testFoo, "foo", 'Check if script was evaluated after load' );
	  setTimeout(verifyEvaluation, 600);
	});
});

test("load(String, Function) - check file with only a script tag", function() {
	expect(3);
	stop();
	testFoo = undefined;
	$('#first').load(url('data/test2.html'), function() {
	  ok( $('#foo').html() == 'foo', 'Check if script evaluation has modified DOM');
	  ok( testFoo == "foo", 'Check if script was evaluated after load' );
	  start();
	});
});

test("$.get(String, Hash, Function) - parse xml and use text() on nodes", function() {
	expect(2);
	stop();
	$.get(url('data/dashboard.xml'), function(xml) {
		var content = [];
		$('tab', xml).each(function() {
			content.push($(this).text());
		});
		equals( content[0], 'blabla', 'Check first tab');
		equals( content[1], 'blublu', 'Check second tab');
		start();
	});
});

test("$.getIfModified(String, Hash, Function)", function() {
	expect(1);
	stop();
	$.getIfModified(url("data/name.html"), function(msg) {
	    ok( /^ERROR/.test(msg), 'Check ifModified' );
	    start();
	});
});

test("$.getScript(String, Function) - with callback", function() {
	expect(2);
	stop();
	$.getScript(url("data/test.js"), function() {
		equals( foobar, "bar", 'Check if script was evaluated' );
		setTimeout(start, 100);
	});
});

test("$.getScript(String, Function) - no callback", function() {
	expect(1);
	stop(true);
	$.getScript(url("data/test.js"), start);
});

test("$.ajax - xml: non-namespace elements inside namespaced elements", function() {
	expect(3);
	stop();
	$.ajax({
	  url: url("data/with_fries.xml"),
	  dataType: "xml",
	  success: function(resp) {
	    equals( $("properties", resp).length, 1, 'properties in responseXML' );
	    equals( $("jsconf", resp).length, 1, 'jsconf in responseXML' );
	    equals( $("thing", resp).length, 2, 'things in responseXML' );
	    start();
	  }
	});
});

test("test global handlers - success", function() {
	expect( isLocal ? 4 : 8 );
	stop();
	
	var counter = { complete: 0, success: 0, error: 0, send: 0 },
		success = function() { counter.success++ },
		error = function() { counter.error++ },
		complete = function() { counter.complete++ },
		send = function() { counter.send++ };

	$('#foo').ajaxStart(complete).ajaxStop(complete).ajaxSend(send).ajaxComplete(complete).ajaxError(error).ajaxSuccess(success);
	
	// start with successful test
	$.ajax({url: url("data/name.html"), beforeSend: send, success: success, error: error, complete: function() {
	  equals( counter.error, 0, 'Check succesful request, error callback' );
	  equals( counter.success, 2, 'Check succesful request, success callback' );
	  equals( counter.complete, 3, 'Check succesful request, complete callback' );
	  equals( counter.send, 2, 'Check succesful request, send callback' );
	  
	  if ( !isLocal ) {
		  counter.error = counter.success = counter.complete = counter.send = 0;
		  $.ajaxTimeout(500);
		  
		  $.ajax({url: url("data/name.php?wait=5"), beforeSend: send, success: success, error: error, complete: function() {
			equals( counter.error, 2, 'Check failed request, error callback' );
			equals( counter.success, 0, 'Check failed request, success callback' );
			equals( counter.complete, 3, 'Check failed request, failed callback' );
			equals( counter.send, 2, 'Check failed request, send callback' );
			start();
		  }});
	  } else
	  	  start();
	}});
});

test("test global handlers - failure", function() {
	expect( isLocal ? 4 : 8 );
	stop();
	
	var counter = { complete: 0, success: 0, error: 0, send: 0 },
		success = function() { counter.success++ },
		error = function() { counter.error++ },
		complete = function() { counter.complete++ },
		send = function() { counter.send++ };
		
	$.ajaxTimeout(0);
	
	$('#foo').ajaxStart(complete).ajaxStop(complete).ajaxSend(send).ajaxComplete(complete).ajaxError(error).ajaxSuccess(success);
	
	$.ajax({url: url("data/name.php"), global: false, beforeSend: send, success: success, error: error, complete: function() {
	  ok( counter.error == 0, 'Check sucesful request without globals' );
	  ok( counter.success == 1, 'Check sucesful request without globals' );
	  ok( counter.complete == 0, 'Check sucesful request without globals' );
	  ok( counter.send == 1, 'Check sucesful request without globals' );
	  
	  if ( !isLocal ) {
		  counter.error = counter.success = counter.complete = counter.send = 0;
		  $.ajaxTimeout(500);
		  
		  $.ajax({url: url("data/name.php?wait=5"), global: false, beforeSend: send, success: success, error: error, complete: function() {
			 var x = counter;
			 ok( counter.error == 1, 'Check failed request without globals' );
			 ok( counter.success == 0, 'Check failed request without globals' );
			 ok( counter.complete == 0, 'Check failed request without globals' );
			 ok( counter.send == 1, 'Check failed request without globals' );
			 start();
		  }});
	  } else
	  	  start();
	}});
});

test("$.ajax - beforeSend", function() {
	expect(1);
	stop();
	
	var check = false;
	
	$.ajaxSetup({ timeout: 0 });
	
	$.ajax({
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

test("$.ajax - dataType html", function() {
	expect(5);
	stop();
	
	foobar = null;
	testFoo = undefined;
	
	var verifyEvaluation = function() {
	  ok( testFoo == "foo", 'Check if script was evaluated for datatype html' );
	  ok( foobar == "bar", 'Check if script src was evaluated for datatype html' );
	  start();
	};
	
	$.ajax({
	  dataType: "html",
	  url: url("data/test.html"),
	  success: function(data) {
	  	$("#ap").html(data);
	    ok( data.match(/^html text/), 'Check content for datatype html' );
	    setTimeout(verifyEvaluation, 600);
	  }
	});
});

if ( !isLocal ) {

test("$.getJSON(String, Hash, Function) - JSON array", function() {
	expect(4);
	stop();
	$.getJSON(url("data/json.php"), {json: "array"}, function(json) {
	  ok( json[0].name == 'John', 'Check JSON: first, name' );
	  ok( json[0].age == 21, 'Check JSON: first, age' );
	  ok( json[1].name == 'Peter', 'Check JSON: second, name' );
	  ok( json[1].age == 25, 'Check JSON: second, age' );
	  start();
	});
});

test("$.getJSON(String, Function) - JSON object", function() {
	expect(2);
	stop();
	$.getJSON(url("data/json.php"), function(json) {
	  ok( json.data.lang == 'en', 'Check JSON: lang' );
	  ok( json.data.length == 25, 'Check JSON: length' );
	  start();
	});
});

test("$.post(String, Hash, Function) - simple with xml", function() {
	expect(2);
	stop();
	$.post(url("data/name.php"), {xml: "5-2"}, function(xml){
	  $('math', xml).each(function() {
		    ok( $('calculation', this).text() == '5-2', 'Check for XML' );
		    ok( $('result', this).text() == '3', 'Check for XML' );
		 });
	  start();
	});
});

test("$.ajaxTimeout(Number) - with global timeout", function() {
	stop();
	
	var passed = 0;

	$.ajaxTimeout(1000);
	
	var pass = function() {
		passed++;
		if ( passed == 2 ) {
			ok( true, 'Check local and global callbacks after timeout' );
	     	$('#main').unbind("ajaxError");
			start();
		}
	};
	
	var fail = function(a,b,c) {
		ok( false, 'Check for timeout failed ' + a + ' ' + b );
		start();
	};
	
	$('#main').ajaxError(pass);
	
	$.ajax({
	  type: "GET",
	  url: url("data/name.php?wait=5"),
	  error: pass,
	  success: fail
	});
	
	// reset timeout
	$.ajaxTimeout(0);
});

test("$.ajaxTimeout(Number) with localtimeout", function() {
	stop(); $.ajaxTimeout(50);
	$.ajax({
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
	$.ajaxTimeout(0);
});

test("$.ajax - simple get", function() {
	expect(1);
	stop();
	$.ajax({
	  type: "GET",
	  url: url("data/name.php?name=foo"),
	  success: function(msg){
	    ok( msg == 'bar', 'Check for GET' );
	    start();
	  }
	});
});

test("$.ajax - simple post", function() {
	expect(1);
	stop();
	$.ajax({
	  type: "POST",
	  url: url("data/name.php"),
	  data: "name=peter",
	  success: function(msg){
	    ok( msg == 'pan', 'Check for POST' );
	    start();
	  }
	});
});

test("ajaxSetup()", function() {
	expect(1);
	stop();
	$.ajaxSetup({
		url: url("data/name.php?name=foo"),
		success: function(msg){
	    	ok( msg == 'bar', 'Check for GET' );
			start();
		}
	});
	$.ajax();
});

test("custom timeout does not set error message when timeout occurs, see #970", function() {
	stop();
	$.ajax({
		url: "data/name.php?wait=10",
		timeout: 500,
		error: function(request, status) {
			ok( status != null, "status shouldn't be null in error handler" );
			equals( "timeout", status );
			start();
		}
	});
});

}

}
