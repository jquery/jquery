module("core", { teardown: moduleTeardown });

test("Unit Testing Environment", function () {
	expect(2);
	ok( hasPHP, "Running Unit tests without PHP is unsupported! The AJAX tests won't run without it and don't expect all tests to pass without it!" );
	ok( !isLocal, "Unit tests shouldn't be run from file://, especially in Chrome. If you must test from file:// with Chrome, run it with the --allow-file-access-from-files flag!" );
});

test("Basic requirements", function() {
	expect(7);
	ok( Array.prototype.push, "Array.push()" );
	ok( Function.prototype.apply, "Function.apply()" );
	ok( document.getElementById, "getElementById" );
	ok( document.getElementsByTagName, "getElementsByTagName" );
	ok( RegExp, "RegExp" );
	ok( jQuery, "jQuery" );
	ok( $, "$" );
});

test("jQuery()", function() {

	var elem, i,
		obj = jQuery("div"),
		main = jQuery("#qunit-fixture"),
		code = jQuery("<code/>"),
		img = jQuery("<img/>"),
		div = jQuery("<div/><hr/><code/><b/>"),
		exec = false,
		lng = "",
		expected = 26,
		attrObj = {
			"click": function() { ok( exec, "Click executed." ); },
			"text": "test",
			"class": "test2",
			"id": "test3"
		};

	// The $(html, props) signature can stealth-call any $.fn method, check for a
	// few here but beware of modular builds where these methods may be excluded.
	if ( jQuery.fn.width ) {
		expected++;
		attrObj["width"] = 10;
	}
	if ( jQuery.fn.offset ) {
		expected++;
		attrObj["offset"] = { "top": 1, "left": 1 };
	}
	if ( jQuery.fn.css ) {
		expected += 2;
		attrObj["css"] = { "paddingLeft": 1, "paddingRight": 1 };
	}
	if ( jQuery.fn.attr ) {
		expected++;
		attrObj.attr = { "desired": "very" };
	}

	expect( expected );

	// Basic constructor's behavior
	equal( jQuery().length, 0, "jQuery() === jQuery([])" );
	equal( jQuery(undefined).length, 0, "jQuery(undefined) === jQuery([])" );
	equal( jQuery(null).length, 0, "jQuery(null) === jQuery([])" );
	equal( jQuery("").length, 0, "jQuery('') === jQuery([])" );
	equal( jQuery("#").length, 0, "jQuery('#') === jQuery([])" );

	equal( jQuery(obj).selector, "div", "jQuery(jQueryObj) == jQueryObj" );

	// can actually yield more than one, when iframes are included, the window is an array as well
	equal( jQuery(window).length, 1, "Correct number of elements generated for jQuery(window)" );

	deepEqual( jQuery("div p", main).get(), q("sndp", "en", "sap"), "Basic selector with jQuery object as context" );

/*
	// disabled since this test was doing nothing. i tried to fix it but i'm not sure
	// what the expected behavior should even be. FF returns "\n" for the text node
	// make sure this is handled
	var crlfContainer = jQuery('<p>\r\n</p>');
	var x = crlfContainer.contents().get(0).nodeValue;
	equal( x, what???, "Check for \\r and \\n in jQuery()" );
*/

	/* // Disabled until we add this functionality in
	var pass = true;
	try {
		jQuery("<div>Testing</div>").appendTo(document.getElementById("iframe").contentDocument.body);
	} catch(e){
		pass = false;
	}
	ok( pass, "jQuery('&lt;tag&gt;') needs optional document parameter to ease cross-frame DOM wrangling, see #968" );*/

	equal( code.length, 1, "Correct number of elements generated for code" );
	equal( code.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equal( img.length, 1, "Correct number of elements generated for img" );
	equal( img.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equal( div.length, 4, "Correct number of elements generated for div hr code b" );
	equal( div.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equal( jQuery([1,2,3]).get(1), 2, "Test passing an array to the factory" );

	equal( jQuery(document.body).get(0), jQuery("body").get(0), "Test passing an html node to the factory" );

	elem = jQuery("<div/>", attrObj );

	if ( jQuery.fn.width ) {
		equal( elem[0].style.width, "10px", "jQuery() quick setter width");
	}

	if ( jQuery.fn.offset ) {
		equal( elem[0].style.top, "1px", "jQuery() quick setter offset");
	}

	if ( jQuery.fn.css ) {
		equal( elem[0].style.paddingLeft, "1px", "jQuery quick setter css");
		equal( elem[0].style.paddingRight, "1px", "jQuery quick setter css");
	}

	if ( jQuery.fn.attr ) {
		equal( elem[0].getAttribute("desired"), "very", "jQuery quick setter attr");
	}

	equal( elem[0].childNodes.length, 1, "jQuery quick setter text");
	equal( elem[0].firstChild.nodeValue, "test", "jQuery quick setter text");
	equal( elem[0].className, "test2", "jQuery() quick setter class");
	equal( elem[0].id, "test3", "jQuery() quick setter id");

	exec = true;
	elem.click();

	// manually clean up detached elements
	elem.remove();

	for ( i = 0; i < 3; ++i ) {
		elem = jQuery("<input type='text' value='TEST' />");
	}
	equal( elem[0].defaultValue, "TEST", "Ensure cached nodes are cloned properly (Bug #6655)" );

	// manually clean up detached elements
	elem.remove();

	equal( jQuery(" <div/> ").length, 1, "Make sure whitespace is trimmed." );
	equal( jQuery(" a<div/>b ").length, 1, "Make sure whitespace and other characters are trimmed." );

	for ( i = 0; i < 128; i++ ) {
		lng += "12345678";
	}

	equal( jQuery(" <div>" + lng + "</div> ").length, 1, "Make sure whitespace is trimmed on long strings." );
	equal( jQuery(" a<div>" + lng + "</div>b ").length, 1, "Make sure whitespace and other characters are trimmed on long strings." );
});

test("selector state", function() {
	expect(31);

	var test;

	test = jQuery(undefined);
	equal( test.selector, "", "Empty jQuery Selector" );
	equal( test.context, undefined, "Empty jQuery Context" );

	test = jQuery(document);
	equal( test.selector, "", "Document Selector" );
	equal( test.context, document, "Document Context" );

	test = jQuery(document.body);
	equal( test.selector, "", "Body Selector" );
	equal( test.context, document.body, "Body Context" );

	test = jQuery("#qunit-fixture");
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document, "#qunit-fixture Context" );

	test = jQuery("#notfoundnono");
	equal( test.selector, "#notfoundnono", "#notfoundnono Selector" );
	equal( test.context, document, "#notfoundnono Context" );

	test = jQuery("#qunit-fixture", document);
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document, "#qunit-fixture Context" );

	test = jQuery("#qunit-fixture", document.body);
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document.body, "#qunit-fixture Context" );

	// Test cloning
	test = jQuery(test);
	equal( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equal( test.context, document.body, "#qunit-fixture Context" );

	test = jQuery(document.body).find("#qunit-fixture");
	equal( test.selector, "#qunit-fixture", "#qunit-fixture find Selector" );
	equal( test.context, document.body, "#qunit-fixture find Context" );

	test = jQuery("#qunit-fixture").filter("div");
	equal( test.selector, "#qunit-fixture.filter(div)", "#qunit-fixture filter Selector" );
	equal( test.context, document, "#qunit-fixture filter Context" );

	test = jQuery("#qunit-fixture").not("div");
	equal( test.selector, "#qunit-fixture.not(div)", "#qunit-fixture not Selector" );
	equal( test.context, document, "#qunit-fixture not Context" );

	test = jQuery("#qunit-fixture").filter("div").not("div");
	equal( test.selector, "#qunit-fixture.filter(div).not(div)", "#qunit-fixture filter, not Selector" );
	equal( test.context, document, "#qunit-fixture filter, not Context" );

	test = jQuery("#qunit-fixture").filter("div").not("div").end();
	equal( test.selector, "#qunit-fixture.filter(div)", "#qunit-fixture filter, not, end Selector" );
	equal( test.context, document, "#qunit-fixture filter, not, end Context" );

	test = jQuery("#qunit-fixture").parent("body");
	equal( test.selector, "#qunit-fixture.parent(body)", "#qunit-fixture parent Selector" );
	equal( test.context, document, "#qunit-fixture parent Context" );

	test = jQuery("#qunit-fixture").eq(0);
	equal( test.selector, "#qunit-fixture.slice(0,1)", "#qunit-fixture eq Selector" );
	equal( test.context, document, "#qunit-fixture eq Context" );

	var d = "<div />";
	equal(
		jQuery(d).appendTo(jQuery(d)).selector,
		jQuery(d).appendTo(d).selector,
		"manipulation methods make same selector for jQuery objects"
	);
});

test( "globalEval", function() {

	expect( 3 );

	jQuery.globalEval( "var globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test variable declarations are global" );

	window.globalEvalTest = false;

	jQuery.globalEval( "globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test variable assignments are global" );

	window.globalEvalTest = false;

	jQuery.globalEval( "this.globalEvalTest = true;" );
	ok( window.globalEvalTest, "Test context (this) is the window object" );

	window.globalEvalTest = undefined;
});

test("noConflict", function() {
	expect(7);

	var $$ = jQuery;

	equal( jQuery, jQuery.noConflict(), "noConflict returned the jQuery object" );
	equal( window["jQuery"], $$, "Make sure jQuery wasn't touched." );
	equal( window["$"], original$, "Make sure $ was reverted." );

	jQuery = $ = $$;

	equal( jQuery.noConflict(true), $$, "noConflict returned the jQuery object" );
	equal( window["jQuery"], originaljQuery, "Make sure jQuery was reverted." );
	equal( window["$"], original$, "Make sure $ was reverted." );
	ok( $$("#qunit-fixture").html("test"), "Make sure that jQuery still works." );

	window["jQuery"] = jQuery = $$;
});

test("trim", function() {
	expect(9);

	var nbsp = String.fromCharCode(160);

	equal( jQuery.trim("hello  "), "hello", "trailing space" );
	equal( jQuery.trim("  hello"), "hello", "leading space" );
	equal( jQuery.trim("  hello   "), "hello", "space on both sides" );
	equal( jQuery.trim("  " + nbsp + "hello  " + nbsp + " "), "hello", "&nbsp;" );

	equal( jQuery.trim(), "", "Nothing in." );
	equal( jQuery.trim( undefined ), "", "Undefined" );
	equal( jQuery.trim( null ), "", "Null" );
	equal( jQuery.trim( 5 ), "5", "Number" );
	equal( jQuery.trim( false ), "false", "Boolean" );
});

test("type", function() {
	expect(23);

	equal( jQuery.type(null), "null", "null" );
	equal( jQuery.type(undefined), "undefined", "undefined" );
	equal( jQuery.type(true), "boolean", "Boolean" );
	equal( jQuery.type(false), "boolean", "Boolean" );
	equal( jQuery.type(Boolean(true)), "boolean", "Boolean" );
	equal( jQuery.type(0), "number", "Number" );
	equal( jQuery.type(1), "number", "Number" );
	equal( jQuery.type(Number(1)), "number", "Number" );
	equal( jQuery.type(""), "string", "String" );
	equal( jQuery.type("a"), "string", "String" );
	equal( jQuery.type(String("a")), "string", "String" );
	equal( jQuery.type({}), "object", "Object" );
	equal( jQuery.type(/foo/), "regexp", "RegExp" );
	equal( jQuery.type(new RegExp("asdf")), "regexp", "RegExp" );
	equal( jQuery.type([1]), "array", "Array" );
	equal( jQuery.type(new Date()), "date", "Date" );
	equal( jQuery.type(new Function("return;")), "function", "Function" );
	equal( jQuery.type(function(){}), "function", "Function" );
	equal( jQuery.type(window), "object", "Window" );
	equal( jQuery.type(document), "object", "Document" );
	equal( jQuery.type(document.body), "object", "Element" );
	equal( jQuery.type(document.createTextNode("foo")), "object", "TextNode" );
	equal( jQuery.type(document.getElementsByTagName("*")), "object", "NodeList" );
});

asyncTest("isPlainObject", function() {
	expect(15);

	var iframe;

	// The use case that we want to match
	ok(jQuery.isPlainObject({}), "{}");

	// Not objects shouldn't be matched
	ok(!jQuery.isPlainObject(""), "string");
	ok(!jQuery.isPlainObject(0) && !jQuery.isPlainObject(1), "number");
	ok(!jQuery.isPlainObject(true) && !jQuery.isPlainObject(false), "boolean");
	ok(!jQuery.isPlainObject(null), "null");
	ok(!jQuery.isPlainObject(undefined), "undefined");

	// Arrays shouldn't be matched
	ok(!jQuery.isPlainObject([]), "array");

	// Instantiated objects shouldn't be matched
	ok(!jQuery.isPlainObject(new Date()), "new Date");

	var fnplain = function(){};

	// Functions shouldn't be matched
	ok(!jQuery.isPlainObject(fnplain), "fn");

	/** @constructor */
	var fn = function() {};

	// Again, instantiated objects shouldn't be matched
	ok(!jQuery.isPlainObject(new fn()), "new fn (no methods)");

	// Makes the function a little more realistic
	// (and harder to detect, incidentally)
	fn.prototype["someMethod"] = function(){};

	// Again, instantiated objects shouldn't be matched
	ok(!jQuery.isPlainObject(new fn()), "new fn");

	// DOM Element
	ok(!jQuery.isPlainObject(document.createElement("div")), "DOM Element");

	// Window
	ok(!jQuery.isPlainObject(window), "window");

	try {
		jQuery.isPlainObject( window.location );
		ok( true, "Does not throw exceptions on host objects");
	} catch ( e ) {
		ok( false, "Does not throw exceptions on host objects -- FAIL");
	}

	try {
		iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		window.iframeDone = function(otherObject){
			// Objects from other windows should be matched
			ok(jQuery.isPlainObject(new otherObject()), "new otherObject");
			document.body.removeChild( iframe );
			start();
		};

		var doc = iframe.contentDocument || iframe.contentWindow.document;
		doc.open();
		doc.write("<body onload='window.parent.iframeDone(Object);'>");
		doc.close();
	} catch(e) {
		document.body.removeChild( iframe );

		ok(true, "new otherObject - iframes not supported");
		start();
	}
});

test("isFunction", function() {
	expect(19);

	// Make sure that false values return false
	ok( !jQuery.isFunction(), "No Value" );
	ok( !jQuery.isFunction( null ), "null Value" );
	ok( !jQuery.isFunction( undefined ), "undefined Value" );
	ok( !jQuery.isFunction( "" ), "Empty String Value" );
	ok( !jQuery.isFunction( 0 ), "0 Value" );

	// Check built-ins
	// Safari uses "(Internal Function)"
	ok( jQuery.isFunction(String), "String Function("+String+")" );
	ok( jQuery.isFunction(Array), "Array Function("+Array+")" );
	ok( jQuery.isFunction(Object), "Object Function("+Object+")" );
	ok( jQuery.isFunction(Function), "Function Function("+Function+")" );

	// When stringified, this could be misinterpreted
	var mystr = "function";
	ok( !jQuery.isFunction(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	var myarr = [ "function" ];
	ok( !jQuery.isFunction(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	var myfunction = { "function": "test" };
	ok( !jQuery.isFunction(myfunction), "Function Object" );

	// Make sure normal functions still work
	var fn = function(){};
	ok( jQuery.isFunction(fn), "Normal Function" );

	var obj = document.createElement("object");

	// Firefox says this is a function
	ok( !jQuery.isFunction(obj), "Object Element" );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( jQuery.isFunction(obj.getAttribute), "getAttribute Function" );

	var nodes = document.body.childNodes;

	// Safari says this is a function
	ok( !jQuery.isFunction(nodes), "childNodes Property" );

	var first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	ok( !jQuery.isFunction(first), "A normal DOM Element" );

	var input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( jQuery.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	var a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !jQuery.isFunction(a), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme(callback){
		function fn(response){
			callback(response);
		}

		ok( jQuery.isFunction(fn), "Recursive Function Call" );

		fn({ some: "data" });
	}

	callme(function(){
		callme(function(){});
	});
});

test( "isNumeric", function() {
	expect( 36 );

	var t = jQuery.isNumeric,
		Traditionalists = /** @constructor */ function(n) {
			this.value = n;
			this.toString = function(){
				return String(this.value);
			};
		},
		answer = new Traditionalists( "42" ),
		rong = new Traditionalists( "Devo" );

	ok( t("-10"), "Negative integer string");
	ok( t("0"), "Zero string");
	ok( t("5"), "Positive integer string");
	ok( t(-16), "Negative integer number");
	ok( t(0), "Zero integer number");
	ok( t(32), "Positive integer number");
	ok( t("040"), "Octal integer literal string");
	// OctalIntegerLiteral has been deprecated since ES3/1999
	// It doesn't pass lint, so disabling until a solution can be found
	//ok( t(0144), "Octal integer literal");
	ok( t("0xFF"), "Hexadecimal integer literal string");
	ok( t(0xFFF), "Hexadecimal integer literal");
	ok( t("-1.6"), "Negative floating point string");
	ok( t("4.536"), "Positive floating point string");
	ok( t(-2.6), "Negative floating point number");
	ok( t(3.1415), "Positive floating point number");
	ok( t(8e5), "Exponential notation");
	ok( t("123e-2"), "Exponential notation string");
	ok( t(answer), "Custom .toString returning number");
	equal( t(""), false, "Empty string");
	equal( t("        "), false, "Whitespace characters string");
	equal( t("\t\t"), false, "Tab characters string");
	equal( t("abcdefghijklm1234567890"), false, "Alphanumeric character string");
	equal( t("xabcdefx"), false, "Non-numeric character string");
	equal( t(true), false, "Boolean true literal");
	equal( t(false), false, "Boolean false literal");
	equal( t("bcfed5.2"), false, "Number with preceding non-numeric characters");
	equal( t("7.2acdgs"), false, "Number with trailling non-numeric characters");
	equal( t(undefined), false, "Undefined value");
	equal( t(null), false, "Null value");
	equal( t(NaN), false, "NaN value");
	equal( t(Infinity), false, "Infinity primitive");
	equal( t(Number.POSITIVE_INFINITY), false, "Positive Infinity");
	equal( t(Number.NEGATIVE_INFINITY), false, "Negative Infinity");
	equal( t(rong), false, "Custom .toString returning non-number");
	equal( t({}), false, "Empty object");
	equal( t(function(){} ), false, "Instance of a function");
	equal( t( new Date() ), false, "Instance of a Date");
	equal( t(function(){} ), false, "Instance of a function");
});

test("isXMLDoc - HTML", function() {
	expect(4);

	ok( !jQuery.isXMLDoc( document ), "HTML document" );
	ok( !jQuery.isXMLDoc( document.documentElement ), "HTML documentElement" );
	ok( !jQuery.isXMLDoc( document.body ), "HTML Body Element" );

	var iframe = document.createElement("iframe");
	document.body.appendChild( iframe );

	try {
		var body = jQuery(iframe).contents()[0];

		try {
			ok( !jQuery.isXMLDoc( body ), "Iframe body element" );
		} catch(e) {
			ok( false, "Iframe body element exception" );
		}

	} catch(e) {
		ok( true, "Iframe body element - iframe not working correctly" );
	}

	document.body.removeChild( iframe );
});

test("XSS via location.hash", function() {
	expect(1);

	stop();
	jQuery["_check9521"] = function(x){
		ok( x, "script called from #id-like selector with inline handler" );
		jQuery("#check9521").remove();
		delete jQuery["_check9521"];
		start();
	};
	try {
		// This throws an error because it's processed like an id
		jQuery( '#<img id="check9521" src="no-such-.gif" onerror="jQuery._check9521(false)">' ).appendTo("#qunit-fixture");
	} catch (err) {
		jQuery["_check9521"](true);
	}
});

test("isXMLDoc - XML", function() {
	expect(3);
	var xml = createDashboardXML();
	ok( jQuery.isXMLDoc( xml ), "XML document" );
	ok( jQuery.isXMLDoc( xml.documentElement ), "XML documentElement" );
	ok( jQuery.isXMLDoc( jQuery("tab", xml)[0] ), "XML Tab Element" );
});

test("isWindow", function() {
	expect( 14 );

	ok( jQuery.isWindow(window), "window" );
	ok( jQuery.isWindow(document.getElementsByTagName("iframe")[0].contentWindow), "iframe.contentWindow" );
	ok( !jQuery.isWindow(), "empty" );
	ok( !jQuery.isWindow(null), "null" );
	ok( !jQuery.isWindow(undefined), "undefined" );
	ok( !jQuery.isWindow(document), "document" );
	ok( !jQuery.isWindow(document.documentElement), "documentElement" );
	ok( !jQuery.isWindow(""), "string" );
	ok( !jQuery.isWindow(1), "number" );
	ok( !jQuery.isWindow(true), "boolean" );
	ok( !jQuery.isWindow({}), "object" );
	ok( !jQuery.isWindow({ setInterval: function(){} }), "fake window" );
	ok( !jQuery.isWindow(/window/), "regexp" );
	ok( !jQuery.isWindow(function(){}), "function" );
});

test("jQuery('html')", function() {
	expect( 18 );

	QUnit.reset();
	jQuery["foo"] = false;
	var s = jQuery("<script>jQuery.foo='test';</script>")[0];
	ok( s, "Creating a script" );
	ok( !jQuery["foo"], "Make sure the script wasn't executed prematurely" );
	jQuery("body").append("<script>jQuery.foo='test';</script>");
	ok( jQuery["foo"], "Executing a scripts contents in the right context" );

	// Test multi-line HTML
	var div = jQuery("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>")[0];
	equal( div.nodeName.toUpperCase(), "DIV", "Make sure we're getting a div." );
	equal( div.firstChild.nodeType, 3, "Text node." );
	equal( div.lastChild.nodeType, 3, "Text node." );
	equal( div.childNodes[1].nodeType, 1, "Paragraph." );
	equal( div.childNodes[1].firstChild.nodeType, 3, "Paragraph text." );

	QUnit.reset();
	ok( jQuery("<link rel='stylesheet'/>")[0], "Creating a link" );

	ok( !jQuery("<script/>")[0].parentNode, "Create a script" );

	ok( jQuery("<input/>").attr("type", "hidden"), "Create an input and set the type." );

	var j = jQuery("<span>hi</span> there <!-- mon ami -->");
	ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	ok( !jQuery("<option>test</option>")[0].selected, "Make sure that options are auto-selected #2050" );

	ok( jQuery("<div></div>")[0], "Create a div with closing tag." );
	ok( jQuery("<table></table>")[0], "Create a table with closing tag." );

	// equal( jQuery("element[attribute='<div></div>']").length, 0, "When html is within brackets, do not recognize as html." );
	// equal( jQuery("element[attribute=<div></div>]").length, 0, "When html is within brackets, do not recognize as html." );
	// equal( jQuery("element:not(<div></div>)").length, 0, "When html is within parens, do not recognize as html." );
	// equal( jQuery("\\<div\\>").length, 0, "Ignore escaped html characters" );

	// Test very large html string #7990
	var i;
	var li = "<li>very large html string</li>";
	var html = ["<ul>"];
	for ( i = 0; i < 50000; i += 1 ) {
		html.push(li);
	}
	html.push("</ul>");
	html = jQuery(html.join(""))[0];
	equal( html.nodeName.toUpperCase(), "UL");
	equal( html.firstChild.nodeName.toUpperCase(), "LI");
	equal( html.childNodes.length, 50000 );
});

test("jQuery('html', context)", function() {
	expect(1);

	var $div = jQuery("<div/>")[0];
	var $span = jQuery("<span/>", $div);
	equal($span.length, 1, "Verify a span created with a div context works, #1763");
});

test("jQuery(selector, xml).text(str) - Loaded via XML document", function() {
	expect(2);

	var xml = createDashboardXML();
	// tests for #1419 where IE was a problem
	var tab = jQuery("tab", xml).eq(0);
	equal( tab.text(), "blabla", "Verify initial text correct" );
	tab.text("newtext");
	equal( tab.text(), "newtext", "Verify new text correct" );
});

test("end()", function() {
	expect(3);
	equal( "Yahoo", jQuery("#yahoo").parent().end().text(), "Check for end" );
	ok( jQuery("#yahoo").end(), "Check for end with nothing to end" );

	var x = jQuery("#yahoo");
	x.parent();
	equal( "Yahoo", jQuery("#yahoo").text(), "Check for non-destructive behaviour" );
});

test("length", function() {
	expect(1);
	equal( jQuery("#qunit-fixture p").length, 6, "Get Number of Elements Found" );
});

test("size()", function() {
	expect(1);
	equal( jQuery("#qunit-fixture p").size(), 6, "Get Number of Elements Found" );
});

test("get()", function() {
	expect(1);
	deepEqual( jQuery("#qunit-fixture p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("toArray()", function() {
	expect(1);
	deepEqual( jQuery("#qunit-fixture p").toArray(),
		q("firstp","ap","sndp","en","sap","first"),
		"Convert jQuery object to an Array" );
});

test("inArray()", function() {
	expect(19);

	var selections = {
		p:   q("firstp", "sap", "ap", "first"),
		em:  q("siblingnext", "siblingfirst"),
		div: q("qunit-testrunner-toolbar", "nothiddendiv", "nothiddendivchild", "foo"),
		a:   q("mark", "groups", "google", "simon1"),
		empty: []
	},
	tests = {
		p:    { elem: jQuery("#ap")[0],           index: 2 },
		em:   { elem: jQuery("#siblingfirst")[0], index: 1 },
		div:  { elem: jQuery("#nothiddendiv")[0], index: 1 },
		a:    { elem: jQuery("#simon1")[0],       index: 3 }
	},
	falseTests = {
		p:  jQuery("#liveSpan1")[0],
		em: jQuery("#nothiddendiv")[0],
		empty: ""
	};

	jQuery.each( tests, function( key, obj ) {
		equal( jQuery.inArray( obj.elem, selections[ key ] ), obj.index, "elem is in the array of selections of its tag" );
		// Third argument (fromIndex)
		equal( !!~jQuery.inArray( obj.elem, selections[ key ], 5 ), false, "elem is NOT in the array of selections given a starting index greater than its position" );
		equal( !!~jQuery.inArray( obj.elem, selections[ key ], 1 ), true, "elem is in the array of selections given a starting index less than or equal to its position" );
		equal( !!~jQuery.inArray( obj.elem, selections[ key ], -3 ), true, "elem is in the array of selections given a negative index" );
	});

	jQuery.each( falseTests, function( key, elem ) {
		equal( !!~jQuery.inArray( elem, selections[ key ] ), false, "elem is NOT in the array of selections" );
	});

});

test("get(Number)", function() {
	expect(2);
	equal( jQuery("#qunit-fixture p").get(0), document.getElementById("firstp"), "Get A Single Element" );
	strictEqual( jQuery("#firstp").get(1), undefined, "Try get with index larger elements count" );
});

test("get(-Number)",function() {
	expect(2);
	equal( jQuery("p").get(-1), document.getElementById("first"), "Get a single element with negative index" );
	strictEqual( jQuery("#firstp").get(-2), undefined, "Try get with index negative index larger then elements count" );
});

test("each(Function)", function() {
	expect(1);
	var div = jQuery("div");
	div.each(function(){this.foo = "zoo";});
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).foo != "zoo" ) {
			pass = false;
		}
	}
	ok( pass, "Execute a function, Relative" );
});

test("slice()", function() {
	expect(7);

	var $links = jQuery("#ap a");

	deepEqual( $links.slice(1,2).get(), q("groups"), "slice(1,2)" );
	deepEqual( $links.slice(1).get(), q("groups", "anchor1", "mark"), "slice(1)" );
	deepEqual( $links.slice(0,3).get(), q("google", "groups", "anchor1"), "slice(0,3)" );
	deepEqual( $links.slice(-1).get(), q("mark"), "slice(-1)" );

	deepEqual( $links.eq(1).get(), q("groups"), "eq(1)" );
	deepEqual( $links.eq("2").get(), q("anchor1"), "eq('2')" );
	deepEqual( $links.eq(-1).get(), q("mark"), "eq(-1)" );
});

test("first()/last()", function() {
	expect(4);

	var $links = jQuery("#ap a"), $none = jQuery("asdf");

	deepEqual( $links.first().get(), q("google"), "first()" );
	deepEqual( $links.last().get(), q("mark"), "last()" );

	deepEqual( $none.first().get(), [], "first() none" );
	deepEqual( $none.last().get(), [], "last() none" );
});

test("map()", function() {
	expect(8);

	deepEqual(
		jQuery("#ap").map(function(){
			return jQuery(this).find("a").get();
		}).get(),
		q("google", "groups", "anchor1", "mark"),
		"Array Map"
	);

	deepEqual(
		jQuery("#ap > a").map(function(){
			return this.parentNode;
		}).get(),
		q("ap","ap","ap"),
		"Single Map"
	);

	var keys, values, scripts, nonsense, mapped, flat;
	//for #2616
	keys = jQuery.map( {"a":1,"b":2}, function( v, k ){
		return k;
	});
	equal( keys.join(""), "ab", "Map the keys from a hash to an array" );

	values = jQuery.map( {a:1,b:2}, function( v, k ){
		return v;
	});
	equal( values.join(""), "12", "Map the values from a hash to an array" );

	// object with length prop
	values = jQuery.map( {a:1,b:2, length:3}, function( v, k ){
		return v;
	});
	equal( values.join(""), "123", "Map the values from a hash with a length property to an array" );

	scripts = document.getElementsByTagName("script");
	mapped = jQuery.map( scripts, function( v, k ){
		return v;
	});
	equal( mapped.length, scripts.length, "Map an array(-like) to a hash" );

	nonsense = document.getElementsByTagName("asdf");
	mapped = jQuery.map( nonsense, function( v, k ){
		return v;
	});
	equal( mapped.length, nonsense.length, "Map an empty array(-like) to a hash" );

	flat = jQuery.map( Array(4), function( v, k ){
		return k % 2 ? k : [k,k,k];//try mixing array and regular returns
	});
	equal( flat.join(""), "00012223", "try the new flatten technique(#2616)" );
});

test("jQuery.merge()", function() {
	expect(8);

	var parse = jQuery.merge;

	deepEqual( parse([],[]), [], "Empty arrays" );

	deepEqual( parse([1],[2]), [1,2], "Basic" );
	deepEqual( parse([1,2],[3,4]), [1,2,3,4], "Basic" );

	deepEqual( parse([1,2],[]), [1,2], "Second empty" );
	deepEqual( parse([],[1,2]), [1,2], "First empty" );

	// Fixed at [5998], #3641
	deepEqual( parse([-2,-1], [0,1,2]), [-2,-1,0,1,2], "Second array including a zero (falsy)");

	// After fixing #5527
	deepEqual( parse([], [null, undefined]), [null, undefined], "Second array including null and undefined values");
	deepEqual( parse({"length":0}, [1,2]), {length:2, 0:1, 1:2}, "First array like");
});

test("jQuery.extend(Object, Object)", function() {
	expect(28);

	var settings = { "xnumber1": 5, "xnumber2": 7, "xstring1": "peter", "xstring2": "pan" },
		options = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		optionsCopy = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		merged = { "xnumber1": 5, "xnumber2": 1, "xstring1": "peter", "xstring2": "x", "xxx": "newstring" },
		deep1 = { "foo": { "bar": true } },
		deep1copy = { "foo": { "bar": true } },
		deep2 = { "foo": { "baz": true }, "foo2": document },
		deep2copy = { "foo": { "baz": true }, "foo2": document },
		deepmerged = { "foo": { "bar": true, "baz": true }, "foo2": document },
		arr = [1, 2, 3],
		nestedarray = { "arr": arr };

	jQuery.extend(settings, options);
	deepEqual( settings, merged, "Check if extended: settings must be extended" );
	deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(settings, null, options);
	deepEqual( settings, merged, "Check if extended: settings must be extended" );
	deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(true, deep1, deep2);
	deepEqual( deep1["foo"], deepmerged["foo"], "Check if foo: settings must be extended" );
	deepEqual( deep2["foo"], deep2copy["foo"], "Check if not deep2: options must not be modified" );
	equal( deep1["foo2"], document, "Make sure that a deep clone was not attempted on the document" );

	ok( jQuery.extend(true, {}, nestedarray)["arr"] !== arr, "Deep extend of object must clone child array" );

	// #5991
	ok( jQuery.isArray( jQuery.extend(true, { "arr": {} }, nestedarray)["arr"] ), "Cloned array heve to be an Array" );
	ok( jQuery.isPlainObject( jQuery.extend(true, { "arr": arr }, { "arr": {} })["arr"] ), "Cloned object heve to be an plain object" );

	var empty = {};
	var optionsWithLength = { "foo": { "length": -1 } };
	jQuery.extend(true, empty, optionsWithLength);
	deepEqual( empty["foo"], optionsWithLength["foo"], "The length property must copy correctly" );

	empty = {};
	var optionsWithDate = { "foo": { "date": new Date() } };
	jQuery.extend(true, empty, optionsWithDate);
	deepEqual( empty["foo"], optionsWithDate["foo"], "Dates copy correctly" );

	/** @constructor */
	var myKlass = function() {};
	var customObject = new myKlass();
	var optionsWithCustomObject = { "foo": { "date": customObject } };
	empty = {};
	jQuery.extend(true, empty, optionsWithCustomObject);
	ok( empty["foo"] && empty["foo"]["date"] === customObject, "Custom objects copy correctly (no methods)" );

	// Makes the class a little more realistic
	myKlass.prototype = { "someMethod": function(){} };
	empty = {};
	jQuery.extend(true, empty, optionsWithCustomObject);
	ok( empty["foo"] && empty["foo"]["date"] === customObject, "Custom objects copy correctly" );

	var MyNumber = Number;
	var ret = jQuery.extend(true, { "foo": 4 }, { "foo": new MyNumber(5) } );
	ok( ret.foo == 5, "Wrapped numbers copy correctly" );

	var nullUndef;
	nullUndef = jQuery.extend({}, options, { "xnumber2": null });
	ok( nullUndef["xnumber2"] === null, "Check to make sure null values are copied");

	nullUndef = jQuery.extend({}, options, { "xnumber2": undefined });
	ok( nullUndef["xnumber2"] === options["xnumber2"], "Check to make sure undefined values are not copied");

	nullUndef = jQuery.extend({}, options, { "xnumber0": null });
	ok( nullUndef["xnumber0"] === null, "Check to make sure null values are inserted");

	var target = {};
	var recursive = { foo:target, bar:5 };
	jQuery.extend(true, target, recursive);
	deepEqual( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

	ret = jQuery.extend(true, { foo: [] }, { foo: [0] } ); // 1907
	equal( ret.foo.length, 1, "Check to make sure a value with coersion 'false' copies over when necessary to fix #1907" );

	ret = jQuery.extend(true, { foo: "1,2,3" }, { foo: [1, 2, 3] } );
	ok( typeof ret.foo != "string", "Check to make sure values equal with coersion (but not actually equal) overwrite correctly" );

	ret = jQuery.extend(true, { foo:"bar" }, { foo:null } );
	ok( typeof ret.foo !== "undefined", "Make sure a null value doesn't crash with deep extend, for #1908" );

	var obj = { foo:null };
	jQuery.extend(true, obj, { foo:"notnull" } );
	equal( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	jQuery.extend(func, { key: "value" } );
	equal( func.key, "value", "Verify a function can be extended" );

	var defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options1 = { xnumber2: 1, xstring2: "x" },
		options1Copy = { xnumber2: 1, xstring2: "x" },
		options2 = { xstring2: "xx", xxx: "newstringx" },
		options2Copy = { xstring2: "xx", xxx: "newstringx" },
		merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	settings = jQuery.extend({}, defaults, options1, options2);
	deepEqual( settings, merged2, "Check if extended: settings must be extended" );
	deepEqual( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	deepEqual( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	deepEqual( options2, options2Copy, "Check if not modified: options2 must not be modified" );
});

test("jQuery.each(Object,Function)", function() {
	expect(14);
	jQuery.each( [0,1,2], function(i, n){
		equal( i, n, "Check array iteration" );
	});

	jQuery.each( [5,6,7], function(i, n){
		equal( i, n - 5, "Check array iteration" );
	});

	jQuery.each( { name: "name", lang: "lang" }, function(i, n){
		equal( i, n, "Check object iteration" );
	});

	var total = 0;
	jQuery.each([1,2,3], function(i,v){ total += v; });
	equal( total, 6, "Looping over an array" );
	total = 0;
	jQuery.each([1,2,3], function(i,v){
		total += v;
		if ( i == 1 ) {
			return false;
		}
	});
	equal( total, 3, "Looping over an array, with break" );
	total = 0;
	jQuery.each({"a":1,"b":2,"c":3}, function(i,v){ total += v; });
	equal( total, 6, "Looping over an object" );
	total = 0;
	jQuery.each({"a":3,"b":3,"c":3}, function(i,v){ total += v; return false; });
	equal( total, 3, "Looping over an object, with break" );

	var f = function(){};
	f.foo = "bar";
	jQuery.each(f, function(i){
		f[i] = "baz";
	});
	equal( "baz", f.foo, "Loop over a function" );

	var stylesheet_count = 0;
	jQuery.each(document.styleSheets, function(i){
		stylesheet_count++;
	});
	equal(stylesheet_count, 2, "should not throw an error in IE while looping over document.styleSheets and return proper amount");

});

test("jQuery.makeArray", function(){
	expect(17);

	equal( jQuery.makeArray(jQuery("html>*"))[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a jQuery object" );

	equal( jQuery.makeArray(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );

	equal( (function(arg1, arg2){ return jQuery.makeArray(arguments); })(1,2).join(""), "12", "Pass makeArray an arguments array" );

	equal( jQuery.makeArray([1,2,3]).join(""), "123", "Pass makeArray a real array" );

	equal( jQuery.makeArray().length, 0, "Pass nothing to makeArray and expect an empty array" );

	equal( jQuery.makeArray( 0 )[0], 0 , "Pass makeArray a number" );

	equal( jQuery.makeArray( "foo" )[0], "foo", "Pass makeArray a string" );

	equal( jQuery.makeArray( true )[0].constructor, Boolean, "Pass makeArray a boolean" );

	equal( jQuery.makeArray( document.createElement("div") )[0].nodeName.toUpperCase(), "DIV", "Pass makeArray a single node" );

	equal( jQuery.makeArray( {length:2, 0:"a", 1:"b"} ).join(""), "ab", "Pass makeArray an array like map (with length)" );

	ok( !!jQuery.makeArray( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );

	// function, is tricky as it has length
	equal( jQuery.makeArray( function(){ return 1;} )[0](), 1, "Pass makeArray a function" );

	//window, also has length
	equal( jQuery.makeArray(window)[0], window, "Pass makeArray the window" );

	equal( jQuery.makeArray(/a/)[0].constructor, RegExp, "Pass makeArray a regex" );

	ok( jQuery.makeArray(document.getElementById("form")).length >= 13, "Pass makeArray a form (treat as elements)" );

	// For #5610
	deepEqual( jQuery.makeArray({length: "0"}), [], "Make sure object is coerced properly.");
	deepEqual( jQuery.makeArray({length: "5"}), [], "Make sure object is coerced properly.");
});

test("jQuery.inArray", function(){
	expect(3);

	equal( jQuery.inArray( 0, false ), -1 , "Search in 'false' as array returns -1 and doesn't throw exception" );

	equal( jQuery.inArray( 0, null ), -1 , "Search in 'null' as array returns -1 and doesn't throw exception" );

	equal( jQuery.inArray( 0, undefined ), -1 , "Search in 'undefined' as array returns -1 and doesn't throw exception" );
});

test("jQuery.isEmptyObject", function(){
	expect(2);

	equal(true, jQuery.isEmptyObject({}), "isEmptyObject on empty object literal" );
	equal(false, jQuery.isEmptyObject({a:1}), "isEmptyObject on non-empty object literal" );

	// What about this ?
	// equal(true, jQuery.isEmptyObject(null), "isEmptyObject on null" );
});

test("jQuery.proxy", function(){
	expect(7);

	var test = function(){ equal( this, thisObject, "Make sure that scope is set properly." ); };
	var thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	jQuery.proxy( test, thisObject )();

	// Another take on it
	jQuery.proxy( thisObject, "method" )();

	// Make sure it doesn't freak out
	equal( jQuery.proxy( null, thisObject ), undefined, "Make sure no function was returned." );

	// Partial application
	var test2 = function( a ){ equal( a, "pre-applied", "Ensure arguments can be pre-applied." ); };
	jQuery.proxy( test2, null, "pre-applied" )();

	// Partial application w/ normal arguments
	var test3 = function( a, b ){ equal( b, "normal", "Ensure arguments can be pre-applied and passed as usual." ); };
	jQuery.proxy( test3, null, "pre-applied" )( "normal" );

	// Test old syntax
	var test4 = { "meth": function( a ){ equal( a, "boom", "Ensure old syntax works." ); } };
	jQuery.proxy( test4, "meth" )( "boom" );
});

test("jQuery.parseHTML", function() {
	expect( 11 );

	equal( jQuery.parseHTML(), null, "Nothing in, null out." );
	equal( jQuery.parseHTML( null ), null, "Nothing in, null out." );
	equal( jQuery.parseHTML( "" ), null, "Nothing in, null out." );
	raises(function() {
		jQuery.parseHTML( "<div>", document.getElementById("form") );
	}, "Passing an element as the context raises an exception (context should be a document)");

	var elems = jQuery.parseHTML( jQuery("body").html() );
	ok( elems.length > 10, "Parse a large html string" );
	equal( jQuery.type( elems ), "array", "parseHTML returns an array rather than a nodelist" );

	var script = "<script>undefined()</script>";
	equal( jQuery.parseHTML( script ).length, 0, "Passing a script is not allowed by default" );
	raises(function() {
		jQuery(jQuery.parseHTML( script, true )).appendTo("#qunit-fixture");
	}, "Passing a script is allowed if allowScripts is true");

	var html = script + "<div></div>";
	equal( jQuery.parseHTML( html )[0].nodeName.toLowerCase(), "div", "Ignore scripts by default" );
	raises(function() {
		jQuery(jQuery.parseHTML( html, true )).appendTo("#qunit-fixture");
	}, "Passing a script is allowed if allowScripts is true");

	equal( jQuery.parseHTML("text")[0].nodeType, 3, "Parsing text returns a text node" );
});

test("jQuery.parseJSON", function(){
	expect(8);

	equal( jQuery.parseJSON(), null, "Nothing in, null out." );
	equal( jQuery.parseJSON( null ), null, "Nothing in, null out." );
	equal( jQuery.parseJSON( "" ), null, "Nothing in, null out." );

	deepEqual( jQuery.parseJSON("{}"), {}, "Plain object parsing." );
	deepEqual( jQuery.parseJSON("{\"test\":1}"), {"test":1}, "Plain object parsing." );

	deepEqual( jQuery.parseJSON("\n{\"test\":1}"), {"test":1}, "Make sure leading whitespaces are handled." );

	try {
		jQuery.parseJSON("{a:1}");
		ok( false, "Test malformed JSON string." );
	} catch( e ) {
		ok( true, "Test malformed JSON string." );
	}

	try {
		jQuery.parseJSON("{'a':1}");
		ok( false, "Test malformed JSON string." );
	} catch( e ) {
		ok( true, "Test malformed JSON string." );
	}
});

test("jQuery.parseXML", 8, function(){
	var xml, tmp;
	try {
		xml = jQuery.parseXML( "<p>A <b>well-formed</b> xml string</p>" );
		tmp = xml.getElementsByTagName( "p" )[ 0 ];
		ok( !!tmp, "<p> present in document" );
		tmp = tmp.getElementsByTagName( "b" )[ 0 ];
		ok( !!tmp, "<b> present in document" );
		strictEqual( tmp.childNodes[ 0 ].nodeValue, "well-formed", "<b> text is as expected" );
	} catch (e) {
		strictEqual( e, undefined, "unexpected error" );
	}
	try {
		xml = jQuery.parseXML( "<p>Not a <<b>well-formed</b> xml string</p>" );
		ok( false, "invalid xml not detected" );
	} catch( e ) {
		strictEqual( e.message, "Invalid XML: <p>Not a <<b>well-formed</b> xml string</p>", "invalid xml detected" );
	}
	try {
		xml = jQuery.parseXML( "" );
		strictEqual( xml, null, "empty string => null document" );
		xml = jQuery.parseXML();
		strictEqual( xml, null, "undefined string => null document" );
		xml = jQuery.parseXML( null );
		strictEqual( xml, null, "null string => null document" );
		xml = jQuery.parseXML( true );
		strictEqual( xml, null, "non-string => null document" );
	} catch( e ) {
		ok( false, "empty input throws exception" );
	}
});

if ( jQuery.sub ) {

test("jQuery.sub() - Static Methods", function(){
	expect(18);
	var Subclass = jQuery.sub();
	Subclass.extend({
		"topLevelMethod": function() {return this.debug;},
		"debug": false,
		"config": {
			"locale": "en_US"
		},
		"setup": function(config) {
			this.extend(true, this["config"], config);
		}
	});
	Subclass.fn.extend({"subClassMethod": function() { return this;}});

	//Test Simple Subclass
	ok(Subclass["topLevelMethod"]() === false, "Subclass.topLevelMethod thought debug was true");
	ok(Subclass["config"]["locale"] == "en_US", Subclass["config"]["locale"] + " is wrong!");
	deepEqual(Subclass["config"]["test"], undefined, "Subclass.config.test is set incorrectly");
	equal(jQuery.ajax, Subclass.ajax, "The subclass failed to get all top level methods");

	//Create a SubSubclass
	var SubSubclass = Subclass.sub();

	//Make Sure the SubSubclass inherited properly
	ok(SubSubclass["topLevelMethod"]() === false, "SubSubclass.topLevelMethod thought debug was true");
	ok(SubSubclass["config"]["locale"] == "en_US", SubSubclass["config"]["locale"] + " is wrong!");
	deepEqual(SubSubclass["config"]["test"], undefined, "SubSubclass.config.test is set incorrectly");
	equal(jQuery.ajax, SubSubclass.ajax, "The subsubclass failed to get all top level methods");

	//Modify The Subclass and test the Modifications
	SubSubclass.fn.extend({"subSubClassMethod": function() { return this;}});
	SubSubclass["setup"]({"locale": "es_MX", "test": "worked"});
	SubSubclass["debug"] = true;
	SubSubclass.ajax = function() {return false;};
	ok(SubSubclass["topLevelMethod"](), "SubSubclass.topLevelMethod thought debug was false");
	deepEqual(SubSubclass(document)["subClassMethod"], Subclass.fn["subClassMethod"], "Methods Differ!");
	ok(SubSubclass["config"]["locale"] == "es_MX", SubSubclass["config"]["locale"] + " is wrong!");
	ok(SubSubclass["config"]["test"] == "worked", "SubSubclass.config.test is set incorrectly");
	notEqual(jQuery.ajax, SubSubclass.ajax, "The subsubclass failed to get all top level methods");

	//This shows that the modifications to the SubSubClass did not bubble back up to it's superclass
	ok(Subclass["topLevelMethod"]() === false, "Subclass.topLevelMethod thought debug was true");
	ok(Subclass["config"]["locale"] == "en_US", Subclass["config"]["locale"] + " is wrong!");
	deepEqual(Subclass["config"]["test"], undefined, "Subclass.config.test is set incorrectly");
	deepEqual(Subclass(document)["subSubClassMethod"], undefined, "subSubClassMethod set incorrectly");
	equal(jQuery.ajax, Subclass.ajax, "The subclass failed to get all top level methods");
});

test("jQuery.sub() - .fn Methods", function(){
	expect(378);

	var Subclass = jQuery.sub(),
			SubclassSubclass = Subclass.sub(),
			jQueryDocument = jQuery(document),
			selectors, contexts, methods, method, arg, description;

	jQueryDocument.toString = function(){ return "jQueryDocument"; };

	Subclass.fn.subclassMethod = function(){};
	SubclassSubclass.fn.subclassSubclassMethod = function(){};

	selectors = [
		"body",
		"html, body",
		"<div></div>"
	];

	contexts = [undefined, document, jQueryDocument];

	jQuery.expandedEach = jQuery.each;
	jQuery.each(selectors, function(i, selector){

		jQuery.expandedEach({ // all methods that return a new jQuery instance
			"eq": 1 ,
			"add": document,
			"end": undefined,
			"has": undefined,
			"closest": "div",
			"filter": document,
			"find": "div"
		}, function(method, arg){
			jQuery.each(contexts, function(i, context){

				description = "(\""+selector+"\", "+context+")."+method+"("+(arg||"")+")";

				deepEqual(
					(function(var_args){ return jQuery.fn[method].apply(jQuery(selector, context), arguments).subclassMethod; })(arg),
					undefined, "jQuery"+description+" doesn't have Subclass methods"
				);
				deepEqual(
					(function(var_args){ return jQuery.fn[method].apply(jQuery(selector, context), arguments).subclassSubclassMethod; })(arg),
					undefined, "jQuery"+description+" doesn't have SubclassSubclass methods"
				);
				deepEqual(
					Subclass(selector, context)[method](arg).subclassMethod, Subclass.fn.subclassMethod,
					"Subclass"+description+" has Subclass methods"
				);
				deepEqual(
					Subclass(selector, context)[method](arg).subclassSubclassMethod, undefined,
					"Subclass"+description+" doesn't have SubclassSubclass methods"
				);
				deepEqual(
					SubclassSubclass(selector, context)[method](arg).subclassMethod, Subclass.fn.subclassMethod,
					"SubclassSubclass"+description+" has Subclass methods"
				);
				deepEqual(
					SubclassSubclass(selector, context)[method](arg).subclassSubclassMethod, SubclassSubclass.fn.subclassSubclassMethod,
					"SubclassSubclass"+description+" has SubclassSubclass methods"
				);

			});
		});
	});

});

} // jQuery.sub

test("jQuery.camelCase()", function() {

	var tests = {
		"foo-bar": "fooBar",
		"foo-bar-baz": "fooBarBaz",
		"girl-u-want": "girlUWant",
		"the-4th-dimension": "the4thDimension",
		"-o-tannenbaum": "OTannenbaum",
		"-moz-illa": "MozIlla",
		"-ms-take": "msTake"
	};

	expect(7);

	jQuery.each( tests, function( key, val ) {
		equal( jQuery.camelCase( key ), val, "Converts: " + key + " => " + val );
	});
});
