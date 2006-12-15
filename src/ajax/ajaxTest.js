module("ajax");

test("serialize()", function() {
	expect(1);
	var data = $(':input').not('button').serialize();
	// ignore button, IE takes text content as value, not relevant for this test
	ok( data == 'action=Test&text2=Test&radio1=on&radio2=on&check=on&=on&hidden=&foo[bar]=&name=name&=foobar&select1=&select2=3&select3=1', 'Check form serialization as query string' );
});

test("param", function() {
	expect(4);
	var params = {foo:"bar", baz:42, quux:"All your base are belong to us"};
	ok( $.param(params) == "foo=bar&baz=42&quux=All%20your%20base%20are%20belong%20to%20us", "simple" );
	
	params = {someName: [1, 2, 3], regularThing: "blah" };
	ok( $.param(params) == "someName=1&someName=2&someName=3&regularThing=blah", "with array" );
	
	params = {"foo[]":["baz", 42, "All your base are belong to us"]};
	ok( $.param(params) == "foo[]=baz&foo[]=42&foo[]=All%20your%20base%20are%20belong%20to%20us", "more array" );
	
	params = {"foo[bar]":"baz", "foo[beep]":42, "foo[quux]":"All your base are belong to us"};
	ok( $.param(params) == "foo[bar]=baz&foo[beep]=42&foo[quux]=All%20your%20base%20are%20belong%20to%20us", "even more arrays" );
});

test("pass-through request object", function() {
	expect(7);
	stop();
	var count = 0;
	var success = function() {
		if(count++ == 6)
			start();
	}
	var url = "data/name.php";
	ok( $.get(url, success), "get" );
	ok( $.getIfModified(url, success), "getIfModified" );
	ok( $.post(url, success), "post" );
	ok( $.getScript("data/test.js", success), "script" );
	ok( $.getJSON("data/json.php", success), "json" );
	ok( $.ajax({url: url, success: success}), "generic" );
});

test("synchronous request", function() {
	ok( /^{ "data"/.test( $.ajax({url: "data/json.php", async: false}).responseText ), "check returned text" );
});

test("load(String, Object, Function) - simple: inject text into DOM", function() {
	expect(2);
	stop();
	$('#first').load("data/name.php", function() {
		ok( /^ERROR/.test($('#first').text()), 'Check if content was injected into the DOM' );
		start();
	});
});

test("load(String, Object, Function) - inject without callback", function() {
	expect(1);
	stop(); // check if load can be called with only url
	$('#first').load("data/name.php");
});

test("load(String, Object, Function) - check scripts", function() {
	expect(7);
	stop();
	testFoo = undefined;
	var verifyEvaluation = function() {
	  ok( foobar == "bar", 'Check if script src was evaluated after load' );
	  ok( $('#foo').html() == 'foo', 'Check if script evaluation has modified DOM');
	  ok( $('#ap').html() == 'bar', 'Check if script evaluation has modified DOM');
	  start();
	};
	$('#first').load('data/test.html', function() {
	  ok( $('#first').html().match(/^html text/), 'Check content after loading html' );
	  ok( testFoo == "foo", 'Check if script was evaluated after load' );
	  setTimeout(verifyEvaluation, 600);
	});
});

test("test global handlers - success", function() {
	expect(8);
	stop();
	var counter = { complete: 0, success: 0, error: 0, send: 0 },
		success = function() { counter.success++ },
		error = function() { counter.error++ },
		complete = function() { counter.complete++ },
		send = function() { counter.send++ };

	$('#foo').ajaxStart(complete).ajaxStop(complete).ajaxSend(send).ajaxComplete(complete).ajaxError(error).ajaxSuccess(success);
	// start with successful test
	$.ajax({url: "data/name.php", beforeSend: send, success: success, error: error, complete: function() {
	  ok( counter.error == 0, 'Check succesful request' );
	  ok( counter.success == 2, 'Check succesful request' );
	  ok( counter.complete == 3, 'Check succesful request' );
	  ok( counter.send == 2, 'Check succesful request' );
	  counter.error = counter.success = counter.complete = counter.send = 0;
	  $.ajaxTimeout(500);
	  $.ajax({url: "data/name.php?wait=5", beforeSend: send, success: success, error: error, complete: function() {
	    ok( counter.error == 2, 'Check failed request' );
	    ok( counter.success == 0, 'Check failed request' );
	    ok( counter.complete == 3, 'Check failed request' );
	    ok( counter.send == 2, 'Check failed request' );
	    start();
	  }});
	}});
});

test("test global handlers - failure", function() {
	expect(8);
	stop();
	var counter = { complete: 0, success: 0, error: 0, send: 0 },
		success = function() { counter.success++ },
		error = function() { counter.error++ },
		complete = function() { counter.complete++ },
		send = function() { counter.send++ };
	$.ajaxTimeout(0);
	$('#foo').ajaxStart(complete).ajaxStop(complete).ajaxSend(send).ajaxComplete(complete).ajaxError(error).ajaxSuccess(success);
	$.ajax({url: "data/name.php", global: false, beforeSend: send, success: success, error: error, complete: function() {
	  ok( counter.error == 0, 'Check sucesful request without globals' );
	  ok( counter.success == 1, 'Check sucesful request without globals' );
	  ok( counter.complete == 0, 'Check sucesful request without globals' );
	  ok( counter.send == 1, 'Check sucesful request without globals' );
	  counter.error = counter.success = counter.complete = counter.send = 0;
	  $.ajaxTimeout(500);
	  $.ajax({url: "data/name.php?wait=5", global: false, beforeSend: send, success: success, error: error, complete: function() {
	     ok( counter.error == 1, 'Check failed request without globals' );
	     ok( counter.success == 0, 'Check failed request without globals' );
	     ok( counter.complete == 0, 'Check failed request without globals' );
	     ok( counter.send == 1, 'Check failed request without globals' );
	     start();
	  }});
	}});
});

test("$.get(String, Hash, Function) - parse xml and use text() on nodes", function() {
	expect(2);
	stop();
	$.get('data/dashboard.xml', function(xml) {
		var content = [];
		$('tab', xml).each(function() {
			content.push($(this).text());
		});
		ok( content[0] == 'blabla', 'Check first tab');
		ok( content[1] == 'blublu', 'Check second tab');
		start();
	});
});

test("$.getIfModified(String, Hash, Function)", function() {
	expect(1);
	stop();
	$.getIfModified("data/name.php", function(msg) {
	    ok( /^ERROR/.test(msg), 'Check ifModified' );
	    start();
	});
});

test("$.getScript(String, Function) - with callback", function() {
	expect(2);
	stop();
	$.getScript("data/test.js", function() {
		ok( foobar == "bar", 'Check if script was evaluated' );
		setTimeout(start, 100);
	});
});

test("$.getScript(String, Function) - no callback", function() {
	expect(1);
	stop();
	$.getScript("data/test.js");
});

test("$.getJSON(String, Hash, Function) - JSON array", function() {
	expect(4);
	stop();
	$.getJSON("data/json.php", {json: "array"}, function(json) {
	  ok( json[0].name == 'John', 'Check JSON: first, name' );
	  ok( json[0].age == 21, 'Check JSON: first, age' );
	  ok( json[1].name == 'Peter', 'Check JSON: second, name' );
	  ok( json[1].age == 25, 'Check JSON: second, age' );
	  start();
	});
});

test("$.getJSON(String, Hash, Function) - JSON object", function() {
	expect(2);
	stop();
	$.getJSON("data/json.php", function(json) {
	  ok( json.data.lang == 'en', 'Check JSON: lang' );
	  ok( json.data.length == 25, 'Check JSON: length' );
	  start();
	});
});

test("$.post(String, Hash, Function) - simple with xml", function() {
	expect(2);
	stop();
	$.post("data/name.php", {xml: "5-2"}, function(xml){
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
	var timeout;
	$.ajaxTimeout(1000);
	var pass = function() {
		passed++;
		if(passed == 2) {
			ok( true, 'Check local and global callbacks after timeout' );
			clearTimeout(timeout);
	     $('#main').unbind("ajaxError");
			start();
		}
	};
	var fail = function() {
		ok( false, 'Check for timeout failed' );
		start();
	};
	timeout = setTimeout(fail, 1500);
	$('#main').ajaxError(pass);
	$.ajax({
	  type: "GET",
	  url: "data/name.php?wait=5",
	  error: pass,
	  success: fail
	});
});

test("$.ajaxTimeout(Number) with localtimeout", function() {
	stop(); $.ajaxTimeout(50);
	$.ajax({
	  type: "GET",
	  timeout: 5000,
	  url: "data/name.php?wait=1",
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
	  url: "data/name.php?name=foo",
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
	  url: "data/name.php",
	  data: "name=peter",
	  success: function(msg){
	    ok( msg == 'pan', 'Check for POST' );
	    start();
	  }
	});
});
	
test("$.ajax - dataType html", function() {
	expect(5);
	stop();
	testFoo = undefined;
	var verifyEvaluation = function() {
	  ok( foobar == "bar", 'Check if script src was evaluated for datatype html' );
	  start();
	};
	$.ajax({
	  dataType: "html",
	  url: "data/test.html",
	  success: function(data) {
	    ok( data.match(/^html text/), 'Check content for datatype html' );
	    ok( testFoo == "foo", 'Check if script was evaluated for datatype html' );
	    setTimeout(verifyEvaluation, 600);
	  }
	});
});
	
test("$.ajax - xml: non-namespace elements inside namespaced elements", function() {
	expect(3);
	stop();
	$.ajax({
	  url: "data/with_fries.xml", dataType: "xml", type: "GET", data: "", success: function(resp) {
	    ok( $("properties", resp).length == 1, 'properties in responseXML' );
	    ok( $("jsconf", resp).length == 1, 'jsconf in responseXML' );
	    ok( $("thing", resp).length == 2, 'things in responseXML' );
	    start();
	  }
	});
});

test("$.ajax - beforeSend", function() {
	expect(1);
	stop();
	var customHeader = "value";
	$.ajax({
		url: "data/name.php", 
		data: {'req': true},
		beforeSend: function(xml) {
			xml.setRequestHeader('X-Custom-Header', customHeader);
		},
		success: function(data) {
			ok( data == customHeader, "check return value, should be the custom header sent" );
			start();
		}
	});
});