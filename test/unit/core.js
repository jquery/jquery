module("core", { teardown: moduleTeardown });

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
	expect(29);

	// Basic constructor's behavior

	equals( jQuery().length, 0, "jQuery() === jQuery([])" );
	equals( jQuery(undefined).length, 0, "jQuery(undefined) === jQuery([])" );
	equals( jQuery(null).length, 0, "jQuery(null) === jQuery([])" );
	equals( jQuery("").length, 0, "jQuery('') === jQuery([])" );
	equals( jQuery("#").length, 0, "jQuery('#') === jQuery([])" );

	var obj = jQuery("div");
	equals( jQuery(obj).selector, "div", "jQuery(jQueryObj) == jQueryObj" );

		// can actually yield more than one, when iframes are included, the window is an array as well
	equals( jQuery(window).length, 1, "Correct number of elements generated for jQuery(window)" );


	var main = jQuery("#qunit-fixture");
	same( jQuery("div p", main).get(), q("sndp", "en", "sap"), "Basic selector with jQuery object as context" );

/*
	// disabled since this test was doing nothing. i tried to fix it but i'm not sure
	// what the expected behavior should even be. FF returns "\n" for the text node
	// make sure this is handled
	var crlfContainer = jQuery('<p>\r\n</p>');
	var x = crlfContainer.contents().get(0).nodeValue;
	equals( x, what???, "Check for \\r and \\n in jQuery()" );
*/

	/* // Disabled until we add this functionality in
	var pass = true;
	try {
		jQuery("<div>Testing</div>").appendTo(document.getElementById("iframe").contentDocument.body);
	} catch(e){
		pass = false;
	}
	ok( pass, "jQuery('&lt;tag&gt;') needs optional document parameter to ease cross-frame DOM wrangling, see #968" );*/

	var code = jQuery("<code/>");
	equals( code.length, 1, "Correct number of elements generated for code" );
	equals( code.parent().length, 0, "Make sure that the generated HTML has no parent." );
	var img = jQuery("<img/>");
	equals( img.length, 1, "Correct number of elements generated for img" );
	equals( img.parent().length, 0, "Make sure that the generated HTML has no parent." );
	var div = jQuery("<div/><hr/><code/><b/>");
	equals( div.length, 4, "Correct number of elements generated for div hr code b" );
	equals( div.parent().length, 0, "Make sure that the generated HTML has no parent." );

	equals( jQuery([1,2,3]).get(1), 2, "Test passing an array to the factory" );

	equals( jQuery(document.body).get(0), jQuery("body").get(0), "Test passing an html node to the factory" );

	var exec = false;

	var elem = jQuery("<div/>", {
		width: 10,
		css: { paddingLeft:1, paddingRight:1 },
		click: function(){ ok(exec, "Click executed."); },
		text: "test",
		"class": "test2",
		id: "test3"
	});

	equals( elem[0].style.width, "10px", "jQuery() quick setter width");
	equals( elem[0].style.paddingLeft, "1px", "jQuery quick setter css");
	equals( elem[0].style.paddingRight, "1px", "jQuery quick setter css");
	equals( elem[0].childNodes.length, 1, "jQuery quick setter text");
	equals( elem[0].firstChild.nodeValue, "test", "jQuery quick setter text");
	equals( elem[0].className, "test2", "jQuery() quick setter class");
	equals( elem[0].id, "test3", "jQuery() quick setter id");

	exec = true;
	elem.click();

	// manually clean up detached elements
	elem.remove();

	for ( var i = 0; i < 3; ++i ) {
		elem = jQuery("<input type='text' value='TEST' />");
	}
	equals( elem[0].defaultValue, "TEST", "Ensure cached nodes are cloned properly (Bug #6655)" );

	// manually clean up detached elements
	elem.remove();

	equals( jQuery(" <div/> ").length, 1, "Make sure whitespace is trimmed." );
	equals( jQuery(" a<div/>b ").length, 1, "Make sure whitespace and other characters are trimmed." );

	var long = "";
	for ( var i = 0; i < 128; i++ ) {
		long += "12345678";
	}

	equals( jQuery(" <div>" + long + "</div> ").length, 1, "Make sure whitespace is trimmed on long strings." );
	equals( jQuery(" a<div>" + long + "</div>b ").length, 1, "Make sure whitespace and other characters are trimmed on long strings." );
});

test("selector state", function() {
	expect(31);

	var test;

	test = jQuery(undefined);
	equals( test.selector, "", "Empty jQuery Selector" );
	equals( test.context, undefined, "Empty jQuery Context" );

	test = jQuery(document);
	equals( test.selector, "", "Document Selector" );
	equals( test.context, document, "Document Context" );

	test = jQuery(document.body);
	equals( test.selector, "", "Body Selector" );
	equals( test.context, document.body, "Body Context" );

	test = jQuery("#qunit-fixture");
	equals( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equals( test.context, document, "#qunit-fixture Context" );

	test = jQuery("#notfoundnono");
	equals( test.selector, "#notfoundnono", "#notfoundnono Selector" );
	equals( test.context, document, "#notfoundnono Context" );

	test = jQuery("#qunit-fixture", document);
	equals( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equals( test.context, document, "#qunit-fixture Context" );

	test = jQuery("#qunit-fixture", document.body);
	equals( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equals( test.context, document.body, "#qunit-fixture Context" );

	// Test cloning
	test = jQuery(test);
	equals( test.selector, "#qunit-fixture", "#qunit-fixture Selector" );
	equals( test.context, document.body, "#qunit-fixture Context" );

	test = jQuery(document.body).find("#qunit-fixture");
	equals( test.selector, "#qunit-fixture", "#qunit-fixture find Selector" );
	equals( test.context, document.body, "#qunit-fixture find Context" );

	test = jQuery("#qunit-fixture").filter("div");
	equals( test.selector, "#qunit-fixture.filter(div)", "#qunit-fixture filter Selector" );
	equals( test.context, document, "#qunit-fixture filter Context" );

	test = jQuery("#qunit-fixture").not("div");
	equals( test.selector, "#qunit-fixture.not(div)", "#qunit-fixture not Selector" );
	equals( test.context, document, "#qunit-fixture not Context" );

	test = jQuery("#qunit-fixture").filter("div").not("div");
	equals( test.selector, "#qunit-fixture.filter(div).not(div)", "#qunit-fixture filter, not Selector" );
	equals( test.context, document, "#qunit-fixture filter, not Context" );

	test = jQuery("#qunit-fixture").filter("div").not("div").end();
	equals( test.selector, "#qunit-fixture.filter(div)", "#qunit-fixture filter, not, end Selector" );
	equals( test.context, document, "#qunit-fixture filter, not, end Context" );

	test = jQuery("#qunit-fixture").parent("body");
	equals( test.selector, "#qunit-fixture.parent(body)", "#qunit-fixture parent Selector" );
	equals( test.context, document, "#qunit-fixture parent Context" );

	test = jQuery("#qunit-fixture").eq(0);
	equals( test.selector, "#qunit-fixture.slice(0,1)", "#qunit-fixture eq Selector" );
	equals( test.context, document, "#qunit-fixture eq Context" );

	var d = "<div />";
	equals(
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

if ( !isLocal ) {
test("browser", function() {
	stop();

	jQuery.get("data/ua.txt", function(data){
		var uas = data.split("\n");
		expect( (uas.length - 1) * 2 );

		jQuery.each(uas, function(){
			var parts = this.split("\t");
			if ( parts[2] ) {
				var ua = jQuery.uaMatch( parts[2] );
				equals( ua.browser, parts[0], "Checking browser for " + parts[2] );
				equals( ua.version, parts[1], "Checking version string for " + parts[2] );
			}
		});

		start();
	});
});
}

test("noConflict", function() {
	expect(7);

	var $$ = jQuery;

	equals( jQuery, jQuery.noConflict(), "noConflict returned the jQuery object" );
	equals( jQuery, $$, "Make sure jQuery wasn't touched." );
	equals( $, original$, "Make sure $ was reverted." );

	jQuery = $ = $$;

	equals( jQuery.noConflict(true), $$, "noConflict returned the jQuery object" );
	equals( jQuery, originaljQuery, "Make sure jQuery was reverted." );
	equals( $, original$, "Make sure $ was reverted." );
	ok( $$("#qunit-fixture").html("test"), "Make sure that jQuery still works." );

	jQuery = $$;
});

test("trim", function() {
	expect(9);

	var nbsp = String.fromCharCode(160);

	equals( jQuery.trim("hello  "), "hello", "trailing space" );
	equals( jQuery.trim("  hello"), "hello", "leading space" );
	equals( jQuery.trim("  hello   "), "hello", "space on both sides" );
	equals( jQuery.trim("  " + nbsp + "hello  " + nbsp + " "), "hello", "&nbsp;" );

	equals( jQuery.trim(), "", "Nothing in." );
	equals( jQuery.trim( undefined ), "", "Undefined" );
	equals( jQuery.trim( null ), "", "Null" );
	equals( jQuery.trim( 5 ), "5", "Number" );
	equals( jQuery.trim( false ), "false", "Boolean" );
});

test("type", function() {
	expect(23);

	equals( jQuery.type(null), "null", "null" );
	equals( jQuery.type(undefined), "undefined", "undefined" );
	equals( jQuery.type(true), "boolean", "Boolean" );
	equals( jQuery.type(false), "boolean", "Boolean" );
	equals( jQuery.type(Boolean(true)), "boolean", "Boolean" );
	equals( jQuery.type(0), "number", "Number" );
	equals( jQuery.type(1), "number", "Number" );
	equals( jQuery.type(Number(1)), "number", "Number" );
	equals( jQuery.type(""), "string", "String" );
	equals( jQuery.type("a"), "string", "String" );
	equals( jQuery.type(String("a")), "string", "String" );
	equals( jQuery.type({}), "object", "Object" );
	equals( jQuery.type(/foo/), "regexp", "RegExp" );
	equals( jQuery.type(new RegExp("asdf")), "regexp", "RegExp" );
	equals( jQuery.type([1]), "array", "Array" );
	equals( jQuery.type(new Date()), "date", "Date" );
	equals( jQuery.type(new Function("return;")), "function", "Function" );
	equals( jQuery.type(function(){}), "function", "Function" );
	equals( jQuery.type(window), "object", "Window" );
	equals( jQuery.type(document), "object", "Document" );
	equals( jQuery.type(document.body), "object", "Element" );
	equals( jQuery.type(document.createTextNode("foo")), "object", "TextNode" );
	equals( jQuery.type(document.getElementsByTagName("*")), "object", "NodeList" );
});

test("isPlainObject", function() {
	expect(15);

	stop();

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
	ok(!jQuery.isPlainObject(new Date), "new Date");

	var fn = function(){};

	// Functions shouldn't be matched
	ok(!jQuery.isPlainObject(fn), "fn");

	// Again, instantiated objects shouldn't be matched
	ok(!jQuery.isPlainObject(new fn), "new fn (no methods)");

	// Makes the function a little more realistic
	// (and harder to detect, incidentally)
	fn.prototype = {someMethod: function(){}};

	// Again, instantiated objects shouldn't be matched
	ok(!jQuery.isPlainObject(new fn), "new fn");

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
		var iframe = document.createElement("iframe");
		document.body.appendChild(iframe);

		window.iframeDone = function(otherObject){
			// Objects from other windows should be matched
			ok(jQuery.isPlainObject(new otherObject), "new otherObject");
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
	};

	callme(function(){
		callme(function(){});
	});
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
	jQuery._check9521 = function(x){
		ok( x, "script called from #id-like selector with inline handler" );
		jQuery("#check9521").remove();
		delete jQuery._check9521;
		start();
	};
	try {
		// This throws an error because it's processed like an id
		jQuery( '#<img id="check9521" src="no-such-.gif" onerror="jQuery._check9521(false)">' ).appendTo("#qunit-fixture");
	} catch (err) {
		jQuery._check9521(true);
	};
});

if ( !isLocal ) {
test("isXMLDoc - XML", function() {
	expect(3);
	stop();
	jQuery.get("data/dashboard.xml", function(xml) {
		ok( jQuery.isXMLDoc( xml ), "XML document" );
		ok( jQuery.isXMLDoc( xml.documentElement ), "XML documentElement" );
		ok( jQuery.isXMLDoc( jQuery("tab", xml)[0] ), "XML Tab Element" );
		start();
	});
});
}

test("isWindow", function() {
	expect( 12 );

	ok( jQuery.isWindow(window), "window" );
	ok( !jQuery.isWindow(), "empty" );
	ok( !jQuery.isWindow(null), "null" );
	ok( !jQuery.isWindow(undefined), "undefined" );
	ok( !jQuery.isWindow(document), "document" );
	ok( !jQuery.isWindow(document.documentElement), "documentElement" );
	ok( !jQuery.isWindow(""), "string" );
	ok( !jQuery.isWindow(1), "number" );
	ok( !jQuery.isWindow(true), "boolean" );
	ok( !jQuery.isWindow({}), "object" );
	// HMMM
	// ok( !jQuery.isWindow({ setInterval: function(){} }), "fake window" );
	ok( !jQuery.isWindow(/window/), "regexp" );
	ok( !jQuery.isWindow(function(){}), "function" );
});

test("jQuery('html')", function() {
	expect(18);

	QUnit.reset();
	jQuery.foo = false;
	var s = jQuery("<script>jQuery.foo='test';</script>")[0];
	ok( s, "Creating a script" );
	ok( !jQuery.foo, "Make sure the script wasn't executed prematurely" );
	jQuery("body").append("<script>jQuery.foo='test';</script>");
	ok( jQuery.foo, "Executing a scripts contents in the right context" );

	// Test multi-line HTML
	var div = jQuery("<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>")[0];
	equals( div.nodeName.toUpperCase(), "DIV", "Make sure we're getting a div." );
	equals( div.firstChild.nodeType, 3, "Text node." );
	equals( div.lastChild.nodeType, 3, "Text node." );
	equals( div.childNodes[1].nodeType, 1, "Paragraph." );
	equals( div.childNodes[1].firstChild.nodeType, 3, "Paragraph text." );

	QUnit.reset();
	ok( jQuery("<link rel='stylesheet'/>")[0], "Creating a link" );

	ok( !jQuery("<script/>")[0].parentNode, "Create a script" );

	ok( jQuery("<input/>").attr("type", "hidden"), "Create an input and set the type." );

	var j = jQuery("<span>hi</span> there <!-- mon ami -->");
	ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	ok( !jQuery("<option>test</option>")[0].selected, "Make sure that options are auto-selected #2050" );

	ok( jQuery("<div></div>")[0], "Create a div with closing tag." );
	ok( jQuery("<table></table>")[0], "Create a table with closing tag." );

	// Test very large html string #7990
	var i;
	var li = "<li>very large html string</li>";
	var html = ["<ul>"];
	for ( i = 0; i < 50000; i += 1 ) {
		html.push(li);
	}
	html.push("</ul>");
	html = jQuery(html.join(""))[0];
	equals( html.nodeName.toUpperCase(), "UL");
	equals( html.firstChild.nodeName.toUpperCase(), "LI");
	equals( html.childNodes.length, 50000 );
});

test("jQuery('html', context)", function() {
	expect(1);

	var $div = jQuery("<div/>")[0];
	var $span = jQuery("<span/>", $div);
	equals($span.length, 1, "Verify a span created with a div context works, #1763");
});

if ( !isLocal ) {
test("jQuery(selector, xml).text(str) - Loaded via XML document", function() {
	expect(2);
	stop();
	jQuery.get("data/dashboard.xml", function(xml) {
		// tests for #1419 where IE was a problem
		var tab = jQuery("tab", xml).eq(0);
		equals( tab.text(), "blabla", "Verify initial text correct" );
		tab.text("newtext");
		equals( tab.text(), "newtext", "Verify new text correct" );
		start();
	});
});
}

test("end()", function() {
	expect(3);
	equals( "Yahoo", jQuery("#yahoo").parent().end().text(), "Check for end" );
	ok( jQuery("#yahoo").end(), "Check for end with nothing to end" );

	var x = jQuery("#yahoo");
	x.parent();
	equals( "Yahoo", jQuery("#yahoo").text(), "Check for non-destructive behaviour" );
});

test("length", function() {
	expect(1);
	equals( jQuery("#qunit-fixture p").length, 6, "Get Number of Elements Found" );
});

test("size()", function() {
	expect(1);
	equals( jQuery("#qunit-fixture p").size(), 6, "Get Number of Elements Found" );
});

test("get()", function() {
	expect(1);
	same( jQuery("#qunit-fixture p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("toArray()", function() {
	expect(1);
	same( jQuery("#qunit-fixture p").toArray(),
		q("firstp","ap","sndp","en","sap","first"),
		"Convert jQuery object to an Array" )
})

test("get(Number)", function() {
	expect(2);
	equals( jQuery("#qunit-fixture p").get(0), document.getElementById("firstp"), "Get A Single Element" );
	strictEqual( jQuery("#firstp").get(1), undefined, "Try get with index larger elements count" );
});

test("get(-Number)",function() {
	expect(2);
	equals( jQuery("p").get(-1), document.getElementById("first"), "Get a single element with negative index" );
	strictEqual( jQuery("#firstp").get(-2), undefined, "Try get with index negative index larger then elements count" );
})

test("each(Function)", function() {
	expect(1);
	var div = jQuery("div");
	div.each(function(){this.foo = "zoo";});
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).foo != "zoo" ) pass = false;
	}
	ok( pass, "Execute a function, Relative" );
});

test("slice()", function() {
	expect(7);

	var $links = jQuery("#ap a");

	same( $links.slice(1,2).get(), q("groups"), "slice(1,2)" );
	same( $links.slice(1).get(), q("groups", "anchor1", "mark"), "slice(1)" );
	same( $links.slice(0,3).get(), q("google", "groups", "anchor1"), "slice(0,3)" );
	same( $links.slice(-1).get(), q("mark"), "slice(-1)" );

	same( $links.eq(1).get(), q("groups"), "eq(1)" );
	same( $links.eq("2").get(), q("anchor1"), "eq('2')" );
	same( $links.eq(-1).get(), q("mark"), "eq(-1)" );
});

test("first()/last()", function() {
	expect(4);

	var $links = jQuery("#ap a"), $none = jQuery("asdf");

	same( $links.first().get(), q("google"), "first()" );
	same( $links.last().get(), q("mark"), "last()" );

	same( $none.first().get(), [], "first() none" );
	same( $none.last().get(), [], "last() none" );
});

test("map()", function() {
	expect(8);

	same(
		jQuery("#ap").map(function(){
			return jQuery(this).find("a").get();
		}).get(),
		q("google", "groups", "anchor1", "mark"),
		"Array Map"
	);

	same(
		jQuery("#ap > a").map(function(){
			return this.parentNode;
		}).get(),
		q("ap","ap","ap"),
		"Single Map"
	);

	//for #2616
	var keys = jQuery.map( {a:1,b:2}, function( v, k ){
		return k;
	});
	equals( keys.join(""), "ab", "Map the keys from a hash to an array" );

	var values = jQuery.map( {a:1,b:2}, function( v, k ){
		return v;
	});
	equals( values.join(""), "12", "Map the values from a hash to an array" );

	// object with length prop
	var values = jQuery.map( {a:1,b:2, length:3}, function( v, k ){
		return v;
	});
	equals( values.join(""), "123", "Map the values from a hash with a length property to an array" );

	var scripts = document.getElementsByTagName("script");
	var mapped = jQuery.map( scripts, function( v, k ){
		return v;
	});
	equals( mapped.length, scripts.length, "Map an array(-like) to a hash" );

	var nonsense = document.getElementsByTagName("asdf");
	var mapped = jQuery.map( nonsense, function( v, k ){
		return v;
	});
	equals( mapped.length, nonsense.length, "Map an empty array(-like) to a hash" );

	var flat = jQuery.map( Array(4), function( v, k ){
		return k % 2 ? k : [k,k,k];//try mixing array and regular returns
	});
	equals( flat.join(""), "00012223", "try the new flatten technique(#2616)" );
});

test("jQuery.merge()", function() {
	expect(8);

	var parse = jQuery.merge;

	same( parse([],[]), [], "Empty arrays" );

	same( parse([1],[2]), [1,2], "Basic" );
	same( parse([1,2],[3,4]), [1,2,3,4], "Basic" );

	same( parse([1,2],[]), [1,2], "Second empty" );
	same( parse([],[1,2]), [1,2], "First empty" );

	// Fixed at [5998], #3641
	same( parse([-2,-1], [0,1,2]), [-2,-1,0,1,2], "Second array including a zero (falsy)");

	// After fixing #5527
	same( parse([], [null, undefined]), [null, undefined], "Second array including null and undefined values");
	same( parse({length:0}, [1,2]), {length:2, 0:1, 1:2}, "First array like");
});

test("jQuery.extend(Object, Object)", function() {
	expect(28);

	var settings = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		optionsCopy = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		merged = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "x", xxx: "newstring" },
		deep1 = { foo: { bar: true } },
		deep1copy = { foo: { bar: true } },
		deep2 = { foo: { baz: true }, foo2: document },
		deep2copy = { foo: { baz: true }, foo2: document },
		deepmerged = { foo: { bar: true, baz: true }, foo2: document },
		arr = [1, 2, 3],
		nestedarray = { arr: arr };

	jQuery.extend(settings, options);
	same( settings, merged, "Check if extended: settings must be extended" );
	same( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(settings, null, options);
	same( settings, merged, "Check if extended: settings must be extended" );
	same( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(true, deep1, deep2);
	same( deep1.foo, deepmerged.foo, "Check if foo: settings must be extended" );
	same( deep2.foo, deep2copy.foo, "Check if not deep2: options must not be modified" );
	equals( deep1.foo2, document, "Make sure that a deep clone was not attempted on the document" );

	ok( jQuery.extend(true, {}, nestedarray).arr !== arr, "Deep extend of object must clone child array" );

	// #5991
	ok( jQuery.isArray( jQuery.extend(true, { arr: {} }, nestedarray).arr ), "Cloned array heve to be an Array" );
	ok( jQuery.isPlainObject( jQuery.extend(true, { arr: arr }, { arr: {} }).arr ), "Cloned object heve to be an plain object" );

	var empty = {};
	var optionsWithLength = { foo: { length: -1 } };
	jQuery.extend(true, empty, optionsWithLength);
	same( empty.foo, optionsWithLength.foo, "The length property must copy correctly" );

	empty = {};
	var optionsWithDate = { foo: { date: new Date } };
	jQuery.extend(true, empty, optionsWithDate);
	same( empty.foo, optionsWithDate.foo, "Dates copy correctly" );

	var myKlass = function() {};
	var customObject = new myKlass();
	var optionsWithCustomObject = { foo: { date: customObject } };
	empty = {};
	jQuery.extend(true, empty, optionsWithCustomObject);
	ok( empty.foo && empty.foo.date === customObject, "Custom objects copy correctly (no methods)" );

	// Makes the class a little more realistic
	myKlass.prototype = { someMethod: function(){} };
	empty = {};
	jQuery.extend(true, empty, optionsWithCustomObject);
	ok( empty.foo && empty.foo.date === customObject, "Custom objects copy correctly" );

	var ret = jQuery.extend(true, { foo: 4 }, { foo: new Number(5) } );
	ok( ret.foo == 5, "Wrapped numbers copy correctly" );

	var nullUndef;
	nullUndef = jQuery.extend({}, options, { xnumber2: null });
	ok( nullUndef.xnumber2 === null, "Check to make sure null values are copied");

	nullUndef = jQuery.extend({}, options, { xnumber2: undefined });
	ok( nullUndef.xnumber2 === options.xnumber2, "Check to make sure undefined values are not copied");

	nullUndef = jQuery.extend({}, options, { xnumber0: null });
	ok( nullUndef.xnumber0 === null, "Check to make sure null values are inserted");

	var target = {};
	var recursive = { foo:target, bar:5 };
	jQuery.extend(true, target, recursive);
	same( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

	var ret = jQuery.extend(true, { foo: [] }, { foo: [0] } ); // 1907
	equals( ret.foo.length, 1, "Check to make sure a value with coersion 'false' copies over when necessary to fix #1907" );

	var ret = jQuery.extend(true, { foo: "1,2,3" }, { foo: [1, 2, 3] } );
	ok( typeof ret.foo != "string", "Check to make sure values equal with coersion (but not actually equal) overwrite correctly" );

	var ret = jQuery.extend(true, { foo:"bar" }, { foo:null } );
	ok( typeof ret.foo !== "undefined", "Make sure a null value doesn't crash with deep extend, for #1908" );

	var obj = { foo:null };
	jQuery.extend(true, obj, { foo:"notnull" } );
	equals( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	jQuery.extend(func, { key: "value" } );
	equals( func.key, "value", "Verify a function can be extended" );

	var defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options1 = { xnumber2: 1, xstring2: "x" },
		options1Copy = { xnumber2: 1, xstring2: "x" },
		options2 = { xstring2: "xx", xxx: "newstringx" },
		options2Copy = { xstring2: "xx", xxx: "newstringx" },
		merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	var settings = jQuery.extend({}, defaults, options1, options2);
	same( settings, merged2, "Check if extended: settings must be extended" );
	same( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	same( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	same( options2, options2Copy, "Check if not modified: options2 must not be modified" );
});

test("jQuery.each(Object,Function)", function() {
	expect(14);
	jQuery.each( [0,1,2], function(i, n){
		equals( i, n, "Check array iteration" );
	});

	jQuery.each( [5,6,7], function(i, n){
		equals( i, n - 5, "Check array iteration" );
	});

	jQuery.each( { name: "name", lang: "lang" }, function(i, n){
		equals( i, n, "Check object iteration" );
	});

	var total = 0;
	jQuery.each([1,2,3], function(i,v){ total += v; });
	equals( total, 6, "Looping over an array" );
	total = 0;
	jQuery.each([1,2,3], function(i,v){ total += v; if ( i == 1 ) return false; });
	equals( total, 3, "Looping over an array, with break" );
	total = 0;
	jQuery.each({"a":1,"b":2,"c":3}, function(i,v){ total += v; });
	equals( total, 6, "Looping over an object" );
	total = 0;
	jQuery.each({"a":3,"b":3,"c":3}, function(i,v){ total += v; return false; });
	equals( total, 3, "Looping over an object, with break" );

	var f = function(){};
	f.foo = "bar";
	jQuery.each(f, function(i){
		f[i] = "baz";
	});
	equals( "baz", f.foo, "Loop over a function" );

	var stylesheet_count = 0;
	jQuery.each(document.styleSheets, function(i){
		stylesheet_count++;
	});
	equals(stylesheet_count, 2, "should not throw an error in IE while looping over document.styleSheets and return proper amount");

});

test("jQuery.makeArray", function(){
	expect(17);

	equals( jQuery.makeArray(jQuery("html>*"))[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a jQuery object" );

	equals( jQuery.makeArray(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );

	equals( (function(){ return jQuery.makeArray(arguments); })(1,2).join(""), "12", "Pass makeArray an arguments array" );

	equals( jQuery.makeArray([1,2,3]).join(""), "123", "Pass makeArray a real array" );

	equals( jQuery.makeArray().length, 0, "Pass nothing to makeArray and expect an empty array" );

	equals( jQuery.makeArray( 0 )[0], 0 , "Pass makeArray a number" );

	equals( jQuery.makeArray( "foo" )[0], "foo", "Pass makeArray a string" );

	equals( jQuery.makeArray( true )[0].constructor, Boolean, "Pass makeArray a boolean" );

	equals( jQuery.makeArray( document.createElement("div") )[0].nodeName.toUpperCase(), "DIV", "Pass makeArray a single node" );

	equals( jQuery.makeArray( {length:2, 0:"a", 1:"b"} ).join(""), "ab", "Pass makeArray an array like map (with length)" );

	ok( !!jQuery.makeArray( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );

	// function, is tricky as it has length
	equals( jQuery.makeArray( function(){ return 1;} )[0](), 1, "Pass makeArray a function" );

	//window, also has length
	equals( jQuery.makeArray(window)[0], window, "Pass makeArray the window" );

	equals( jQuery.makeArray(/a/)[0].constructor, RegExp, "Pass makeArray a regex" );

	ok( jQuery.makeArray(document.getElementById("form")).length >= 13, "Pass makeArray a form (treat as elements)" );

	// For #5610
	same( jQuery.makeArray({length: "0"}), [], "Make sure object is coerced properly.");
	same( jQuery.makeArray({length: "5"}), [], "Make sure object is coerced properly.");
});

test("jQuery.inArray", function(){
	expect(3);

	equals( jQuery.inArray( 0, false ), -1 , "Search in 'false' as array returns -1 and doesn't throw exception" );

	equals( jQuery.inArray( 0, null ), -1 , "Search in 'null' as array returns -1 and doesn't throw exception" );

	equals( jQuery.inArray( 0, undefined ), -1 , "Search in 'undefined' as array returns -1 and doesn't throw exception" );
});

test("jQuery.isEmptyObject", function(){
	expect(2);

	equals(true, jQuery.isEmptyObject({}), "isEmptyObject on empty object literal" );
	equals(false, jQuery.isEmptyObject({a:1}), "isEmptyObject on non-empty object literal" );

	// What about this ?
	// equals(true, jQuery.isEmptyObject(null), "isEmptyObject on null" );
});

test("jQuery.proxy", function(){
	expect(7);

	var test = function(){ equals( this, thisObject, "Make sure that scope is set properly." ); };
	var thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	jQuery.proxy( test, thisObject )();

	// Another take on it
	jQuery.proxy( thisObject, "method" )();

	// Make sure it doesn't freak out
	equals( jQuery.proxy( null, thisObject ), undefined, "Make sure no function was returned." );

        // Partial application
        var test2 = function( a ){ equals( a, "pre-applied", "Ensure arguments can be pre-applied." ); };
        jQuery.proxy( test2, null, "pre-applied" )();

        // Partial application w/ normal arguments
        var test3 = function( a, b ){ equals( b, "normal", "Ensure arguments can be pre-applied and passed as usual." ); };
        jQuery.proxy( test3, null, "pre-applied" )( "normal" );

	// Test old syntax
	var test4 = { meth: function( a ){ equals( a, "boom", "Ensure old syntax works." ); } };
	jQuery.proxy( test4, "meth" )( "boom" );
});

test("jQuery.parseJSON", function(){
	expect(8);

	equals( jQuery.parseJSON(), null, "Nothing in, null out." );
	equals( jQuery.parseJSON( null ), null, "Nothing in, null out." );
	equals( jQuery.parseJSON( "" ), null, "Nothing in, null out." );

	same( jQuery.parseJSON("{}"), {}, "Plain object parsing." );
	same( jQuery.parseJSON("{\"test\":1}"), {"test":1}, "Plain object parsing." );

	same( jQuery.parseJSON("\n{\"test\":1}"), {"test":1}, "Make sure leading whitespaces are handled." );

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

test("jQuery.parseXML", 4, function(){
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
		strictEqual( e, "Invalid XML: <p>Not a <<b>well-formed</b> xml string</p>", "invalid xml detected" );
	}
});

test("jQuery.sub() - Static Methods", function(){
    expect(18);
    var Subclass = jQuery.sub();
    Subclass.extend({
        topLevelMethod: function() {return this.debug;},
        debug: false,
        config: {
            locale: "en_US"
        },
        setup: function(config) {
            this.extend(true, this.config, config);
        }
    });
    Subclass.fn.extend({subClassMethod: function() { return this;}});

    //Test Simple Subclass
    ok(Subclass.topLevelMethod() === false, "Subclass.topLevelMethod thought debug was true");
    ok(Subclass.config.locale == "en_US", Subclass.config.locale + " is wrong!");
    same(Subclass.config.test, undefined, "Subclass.config.test is set incorrectly");
    equal(jQuery.ajax, Subclass.ajax, "The subclass failed to get all top level methods");

    //Create a SubSubclass
    var SubSubclass = Subclass.sub();

    //Make Sure the SubSubclass inherited properly
    ok(SubSubclass.topLevelMethod() === false, "SubSubclass.topLevelMethod thought debug was true");
    ok(SubSubclass.config.locale == "en_US", SubSubclass.config.locale + " is wrong!");
    same(SubSubclass.config.test, undefined, "SubSubclass.config.test is set incorrectly");
    equal(jQuery.ajax, SubSubclass.ajax, "The subsubclass failed to get all top level methods");

    //Modify The Subclass and test the Modifications
    SubSubclass.fn.extend({subSubClassMethod: function() { return this;}});
    SubSubclass.setup({locale: "es_MX", test: "worked"});
    SubSubclass.debug = true;
    SubSubclass.ajax = function() {return false;};
    ok(SubSubclass.topLevelMethod(), "SubSubclass.topLevelMethod thought debug was false");
    same(SubSubclass(document).subClassMethod, Subclass.fn.subClassMethod, "Methods Differ!");
    ok(SubSubclass.config.locale == "es_MX", SubSubclass.config.locale + " is wrong!");
    ok(SubSubclass.config.test == "worked", "SubSubclass.config.test is set incorrectly");
    notEqual(jQuery.ajax, SubSubclass.ajax, "The subsubclass failed to get all top level methods");

    //This shows that the modifications to the SubSubClass did not bubble back up to it's superclass
    ok(Subclass.topLevelMethod() === false, "Subclass.topLevelMethod thought debug was true");
    ok(Subclass.config.locale == "en_US", Subclass.config.locale + " is wrong!");
    same(Subclass.config.test, undefined, "Subclass.config.test is set incorrectly");
    same(Subclass(document).subSubClassMethod, undefined, "subSubClassMethod set incorrectly");
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

	methods = [ // all methods that return a new jQuery instance
		["eq", 1],
		["add", document],
		["end"],
		["has"],
		["closest", "div"],
		["filter", document],
		["find", "div"]
	];

	contexts = [undefined, document, jQueryDocument];

	jQuery.each(selectors, function(i, selector){

		jQuery.each(methods, function(){
			method = this[0];
			arg = this[1];

			jQuery.each(contexts, function(i, context){

				description = "(\""+selector+"\", "+context+")."+method+"("+(arg||"")+")";

				same(
					jQuery(selector, context)[method](arg).subclassMethod, undefined,
					"jQuery"+description+" doesn't have Subclass methods"
				);
				same(
					jQuery(selector, context)[method](arg).subclassSubclassMethod, undefined,
					"jQuery"+description+" doesn't have SubclassSubclass methods"
				);
				same(
					Subclass(selector, context)[method](arg).subclassMethod, Subclass.fn.subclassMethod,
					"Subclass"+description+" has Subclass methods"
				);
				same(
					Subclass(selector, context)[method](arg).subclassSubclassMethod, undefined,
					"Subclass"+description+" doesn't have SubclassSubclass methods"
				);
				same(
					SubclassSubclass(selector, context)[method](arg).subclassMethod, Subclass.fn.subclassMethod,
					"SubclassSubclass"+description+" has Subclass methods"
				);
				same(
					SubclassSubclass(selector, context)[method](arg).subclassSubclassMethod, SubclassSubclass.fn.subclassSubclassMethod,
					"SubclassSubclass"+description+" has SubclassSubclass methods"
				);

			});
		});
	});

});

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
