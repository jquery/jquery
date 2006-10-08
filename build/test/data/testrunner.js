var asyncTimeout = 2 // seconds for async timeout

var fixture;
var Test;
var stats = {
	all: 0,
	bad: 0
};
var queue = [];
var blocking = false;
var timeout;

function synchronize(callback) {
	queue[queue.length] = callback;
	if(!blocking) {
		process();
	}
}

function process() {
	while(queue.length && !blocking) {
		var call = queue[0];
		queue = queue.slice(1);
		call();
	}
}

function stop() {
	blocking = true;
	timeout = setTimeout(start, asyncTimeout * 1000);
}
function start() {
	if(timeout)
		clearTimeout(timeout);
	blocking = false;
	process();
}

function runTest(tests) {
	var startTime = new Date();
	fixture = document.getElementById('main').innerHTML;
	tests();
	synchronize(function() {
		var runTime = new Date() - startTime;
		var result = document.createElement("div");
		result.innerHTML = 'Tests completed in ' + runTime + ' milliseconds.<br/>' +
			stats.bad + ' tests of ' + stats.all + ' failed.';
		document.getElementsByTagName("body")[0].appendChild(result);
	});
}

function test(name, callback) {
	synchronize(function() {
		Test = [];
		try {
			callback();
		} catch(e) {
			if( typeof console != "undefined" && console.error && console.warn ) {
				console.error("Test " + name + " died, exception and test follows");
				console.error(e);
				console.warn(callback.toString());
			}
			Test.push( [ false, "Died on test #" + (Test.length+1) + ": " + e ] );
		}
	});
	synchronize(function() {
		reset();
		
		var good = 0, bad = 0;
		var ol = document.createElement("ol");
	
		var li = "", state = "pass";
		for ( var i = 0; i < Test.length; i++ ) {
			var li = document.createElement("li");
			li.className = Test[i][0] ? "pass" : "fail";
			li.innerHTML = Test[i][1];
			ol.appendChild( li );
			
			stats.all++;
			if ( !Test[i][0] ) {
				state = "fail";
				bad++;
				stats.bad++;
			} else good++;
		}
	
		var li = document.createElement("li");
		li.className = state;
	
		var b = document.createElement("b");
		b.innerHTML = name + " <b style='color:black;'>(<b class='fail'>" + bad + "</b>, <b class='pass'>" + good + "</b>, " + Test.length + ")</b>";
		b.onclick = function(){
			var n = this.nextSibling;
			if ( jQuery.css( n, "display" ) == "none" )
				n.style.display = "block";
			else
				n.style.display = "none";
		};
		li.appendChild( b );
		li.appendChild( ol );
	
		document.getElementById("tests").appendChild( li );		
	});
}

/**
 * Resets the test setup. Useful for tests that modify the DOM.
 */
function reset() {
	document.getElementById('main').innerHTML = fixture;
}

/**
 * Asserts true.
 * @example ok( $("a").size() > 5, "There must be at least 5 anchors" );
 */
function ok(a, msg) {
	Test.push( [ !!a, msg ] );
}

/**
 * Asserts that two arrays are the same
 */
function isSet(a, b, msg) {
	var ret = true;
	if ( a && b && a.length == b.length ) {
		for ( var i in a )
			if ( a[i] != b[i] )
				ret = false;
	} else
		ret = false;
	if ( !ret )
		Test.push( [ ret, msg + " expected: " + b + " result: " + a ] );
	else 
		Test.push( [ ret, msg ] );
}

/**
 * Returns an array of elements with the given IDs, eg.
 * @example q("main", "foo", "bar")
 * @result [<div id="main">, <span id="foo">, <input id="bar">]
 */
function q() {
	var r = [];
	for ( var i = 0; i < arguments.length; i++ )
		r.push( document.getElementById( arguments[i] ) );
	return r;
}

/**
 * Asserts that a select matches the given IDs
 * @example t("Check for something", "//[a]", ["foo", "baar"]);
 * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'baar'
 */
function t(a,b,c) {
	var f = jQuery.find(b);
	var s = "";
	for ( var i = 0; i < f.length; i++ )
		s += (s && ",") + '"' + f[i].id + '"';
	isSet(f, q.apply(q,c), a + " (" + b + ")");
}