function test(name, fn){
	expected = -1;
	numTests = 0;
	reset();
	
	fn();
	
	if ( expected != -1 && expected != numTests )
		log( false, "Wrong number of tests run. " + numTests + " ran, expected " + expected );
}

var orig = document.getElementById('main').innerHTML;

/**
 * Resets the test setup. Useful for tests that modify the DOM.
 */
function reset() {
	document.getElementById('main').innerHTML = orig;
}

var currentModule = "";

// call on start of module test to prepend name to all tests
function module(moduleName) {
	currentModule = moduleName;
}

var expected = -1;

/**
 * Specify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.
 */
function expect(asserts) {
	expected = asserts;
}

/**
 * Asserts true.
 * @example ok( $("a").size() > 5, "There must be at least 5 anchors" );
 */
function ok(a, msg) {
	log( !!a, msg );
}

/**
 * Asserts that two arrays are the same
 */
function isSet(a, b, msg) {
	var ret = true;
	if ( a && b && a.length != undefined && a.length == b.length ) {
		for ( var i = 0; i < a.length; i++ ) {
			if ( a[i] != b[i] )
				ret = false;
		}
	} else
		ret = false;
	if ( !ret )
		log( ret, msg + " expected: " + serialArray(b) + " result: " + serialArray(a) );
	else 
		log( ret, msg );
}

/**
 * Asserts that two objects are equivalent
 */
function isObj(a, b, msg) {
	var ret = true;
	
	if ( a && b ) {
		for ( var i in a )
			if ( a[i] != b[i] )
				ret = false;

		for ( i in b )
			if ( a[i] != b[i] )
				ret = false;
	} else
		ret = false;

    log( ret, msg );
}

function serialArray( a ) {
	var r = [];
	
	if ( a && a.length )
        for ( var i = 0; i < a.length; i++ ) {
            var str = a[i] ? a[i].nodeName : "";
            if ( str ) {
                str = str.toLowerCase();
                if ( a[i].id )
                    str += "#" + a[i].id;
            } else
                str = a[i];
            r.push( str );
        }

	return "[ " + r.join(", ") + " ]"
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
	var f = jQuery(b);
	var s = "";
	for ( var i = 0; i < f.length; i++ )
		s += (s && ",") + '"' + f[i].id + '"';
	isSet(f, q.apply(q,c), a + " (" + b + ")");
}

/**
 * Checks that the first two arguments are equal, with an optional message.
 * Prints out both expected and actual values on failure.
 *
 * Prefered to ok( expected == actual, message )
 *
 * @example equals( "Expected 2 characters.", v.formatMessage("Expected {0} characters.", 2) );
 *
 * @param Object expected
 * @param Object actual
 * @param String message (optional)
 */
function equals(expected, actual, message) {
	var result = expected == actual;
	message = message || (result ? "okay" : "failed");
	log( result, result ? message + ": " + expected : message + " expected: " + expected + " actual: " + actual );
}

var numTests = 0, total = 0, pass = 0, fail = 0;

function log(state, msg){
	print( (state ? "PASS" : "FAIL") + " (" + (++total) + ") " +
		(currentModule ? "[" + currentModule + "] " : "") + msg );
		
	numTests++;

	if ( state )
		pass++;
	else
		fail++;
}

function results(){
	print( pass + " Passed, " + fail + " Failed" );
}

function start(){}
function stop(){}

/**
 * Trigger an event on an element.
 *
 * @example triggerEvent( document.body, "click" );
 *
 * @param DOMElement elem
 * @param String type
 */
function triggerEvent( elem, type, event ) {
/*
	if ( jQuery.browser.mozilla || jQuery.browser.opera ) {
		event = document.createEvent("MouseEvents");
		event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
			0, 0, 0, 0, 0, false, false, false, false, 0, null);
		elem.dispatchEvent( event );
	} else if ( jQuery.browser.msie ) {
		elem.fireEvent("on"+type);
	}
*/
}

/**
 * Add random number to url to stop IE from caching
 *
 * @example url("data/test.html")
 * @result "data/test.html?10538358428943"
 *
 * @example url("data/test.php?foo=bar")
 * @result "data/test.php?foo=bar&10538358345554"
 */
function url(value) {
	return value + (/\?/.test(value) ? "&" : "?") + new Date().getTime() + "" + parseInt(Math.random()*100000);
}