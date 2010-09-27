module("core");

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
	expect(23);

	// Basic constructor's behavior

	equals( jQuery().length, 0, "jQuery() === jQuery([])" );
	equals( jQuery(undefined).length, 0, "jQuery(undefined) === jQuery([])" );
	equals( jQuery(null).length, 0, "jQuery(null) === jQuery([])" );
	equals( jQuery("").length, 0, "jQuery('') === jQuery([])" );

	var obj = jQuery("div")
	equals( jQuery(obj).selector, "div", "jQuery(jQueryObj) == jQueryObj" );

		// can actually yield more than one, when iframes are included, the window is an array as well
	equals( jQuery(window).length, 1, "Correct number of elements generated for jQuery(window)" );


	var main = jQuery("#main");
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

	equals( jQuery(document.body).get(0), jQuery('body').get(0), "Test passing an html node to the factory" );

	var exec = false;

	var elem = jQuery("<div/>", {
		width: 10,
		css: { paddingLeft:1, paddingRight:1 },
		click: function(){ ok(exec, "Click executed."); },
		text: "test",
		"class": "test2",
		id: "test3"
	});

	equals( elem[0].style.width, '10px', 'jQuery() quick setter width');
	equals( elem[0].style.paddingLeft, '1px', 'jQuery quick setter css');
	equals( elem[0].style.paddingRight, '1px', 'jQuery quick setter css');
	equals( elem[0].childNodes.length, 1, 'jQuery quick setter text');
	equals( elem[0].firstChild.nodeValue, "test", 'jQuery quick setter text');
	equals( elem[0].className, "test2", 'jQuery() quick setter class');
	equals( elem[0].id, "test3", 'jQuery() quick setter id');

	exec = true;
	elem.click();
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

	test = jQuery("#main");
	equals( test.selector, "#main", "#main Selector" );
	equals( test.context, document, "#main Context" );

	test = jQuery("#notfoundnono");
	equals( test.selector, "#notfoundnono", "#notfoundnono Selector" );
	equals( test.context, document, "#notfoundnono Context" );

	test = jQuery("#main", document);
	equals( test.selector, "#main", "#main Selector" );
	equals( test.context, document, "#main Context" );

	test = jQuery("#main", document.body);
	equals( test.selector, "#main", "#main Selector" );
	equals( test.context, document.body, "#main Context" );

	// Test cloning
	test = jQuery(test);
	equals( test.selector, "#main", "#main Selector" );
	equals( test.context, document.body, "#main Context" );

	test = jQuery(document.body).find("#main");
	equals( test.selector, "#main", "#main find Selector" );
	equals( test.context, document.body, "#main find Context" );

	test = jQuery("#main").filter("div");
	equals( test.selector, "#main.filter(div)", "#main filter Selector" );
	equals( test.context, document, "#main filter Context" );

	test = jQuery("#main").not("div");
	equals( test.selector, "#main.not(div)", "#main not Selector" );
	equals( test.context, document, "#main not Context" );

	test = jQuery("#main").filter("div").not("div");
	equals( test.selector, "#main.filter(div).not(div)", "#main filter, not Selector" );
	equals( test.context, document, "#main filter, not Context" );

	test = jQuery("#main").filter("div").not("div").end();
	equals( test.selector, "#main.filter(div)", "#main filter, not, end Selector" );
	equals( test.context, document, "#main filter, not, end Context" );

	test = jQuery("#main").parent("body");
	equals( test.selector, "#main.parent(body)", "#main parent Selector" );
	equals( test.context, document, "#main parent Context" );

	test = jQuery("#main").eq(0);
	equals( test.selector, "#main.slice(0,1)", "#main eq Selector" );
	equals( test.context, document, "#main eq Context" );
	
	var d = "<div />";
	equals(
		jQuery(d).appendTo(jQuery(d)).selector,
		jQuery(d).appendTo(d).selector,
		"manipulation methods make same selector for jQuery objects"
	);
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
	ok( $$("#main").html("test"), "Make sure that jQuery still works." );

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
	expect(14);

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

if ( !isLocal ) {
test("isXMLDoc - XML", function() {
	expect(3);
	stop();
	jQuery.get('data/dashboard.xml', function(xml) {
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
	expect(15);

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
	jQuery.get('data/dashboard.xml', function(xml) {
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
	equals( 'Yahoo', jQuery('#yahoo').parent().end().text(), 'Check for end' );
	ok( jQuery('#yahoo').end(), 'Check for end with nothing to end' );

	var x = jQuery('#yahoo');
	x.parent();
	equals( 'Yahoo', jQuery('#yahoo').text(), 'Check for non-destructive behaviour' );
});

test("length", function() {
	expect(1);
	equals( jQuery("p").length, 6, "Get Number of Elements Found" );
});

test("size()", function() {
	expect(1);
	equals( jQuery("p").size(), 6, "Get Number of Elements Found" );
});

test("get()", function() {
	expect(1);
	same( jQuery("p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("toArray()", function() {
	expect(1);
	same( jQuery("p").toArray(),
		q("firstp","ap","sndp","en","sap","first"),
		"Convert jQuery object to an Array" )
})

test("get(Number)", function() {
	expect(1);
	equals( jQuery("p").get(0), document.getElementById("firstp"), "Get A Single Element" );
});

test("get(-Number)",function() {
	expect(1);
	equals( jQuery("p").get(-1),
		document.getElementById("first"),
		"Get a single element with negative index" )
})

test("each(Function)", function() {
	expect(1);
	var div = jQuery("div");
	div.each(function(){this.foo = 'zoo';});
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
	same( $links.eq('2').get(), q("anchor1"), "eq('2')" );
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
	expect(2);//expect(6);

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

	return;//these haven't been accepted yet

	//for #2616
	var keys = jQuery.map( {a:1,b:2}, function( v, k ){
		return k;
	}, [ ] );

	equals( keys.join(""), "ab", "Map the keys from a hash to an array" );

	var values = jQuery.map( {a:1,b:2}, function( v, k ){
		return v;
	}, [ ] );

	equals( values.join(""), "12", "Map the values from a hash to an array" );

	var scripts = document.getElementsByTagName("script");
	var mapped = jQuery.map( scripts, function( v, k ){
		return v;
	}, {length:0} );

	equals( mapped.length, scripts.length, "Map an array(-like) to a hash" );

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
	ok( typeof ret.foo !== 'undefined', "Make sure a null value doesn't crash with deep extend, for #1908" );

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
	expect(13);
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
	f.foo = 'bar';
	jQuery.each(f, function(i){
		f[i] = 'baz';
	});
	equals( "baz", f.foo, "Loop over a function" );
});

test("jQuery.makeArray", function(){
	expect(17);

	equals( jQuery.makeArray(jQuery('html>*'))[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a jQuery object" );

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

	ok( jQuery.makeArray(document.getElementById('form')).length >= 13, "Pass makeArray a form (treat as elements)" );

	// For #5610
	same( jQuery.makeArray({'length': '0'}), [], "Make sure object is coerced properly.");
	same( jQuery.makeArray({'length': '5'}), [], "Make sure object is coerced properly.");
});

test("jQuery.isEmptyObject", function(){
	expect(2);
	
	equals(true, jQuery.isEmptyObject({}), "isEmptyObject on empty object literal" );
	equals(false, jQuery.isEmptyObject({a:1}), "isEmptyObject on non-empty object literal" );
	
	// What about this ?
	// equals(true, jQuery.isEmptyObject(null), "isEmptyObject on null" );
});

test("jQuery.proxy", function(){
	expect(4);

	var test = function(){ equals( this, thisObject, "Make sure that scope is set properly." ); };
	var thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	jQuery.proxy( test, thisObject )();

	// Make sure it doesn't freak out
	equals( jQuery.proxy( null, thisObject ), undefined, "Make sure no function was returned." );

	// Use the string shortcut
	jQuery.proxy( thisObject, "method" )();
});

test("jQuery.parseJSON", function(){
	expect(8);
	
	equals( jQuery.parseJSON(), null, "Nothing in, null out." );
	equals( jQuery.parseJSON( null ), null, "Nothing in, null out." );
	equals( jQuery.parseJSON( "" ), null, "Nothing in, null out." );
	
	same( jQuery.parseJSON("{}"), {}, "Plain object parsing." );
	same( jQuery.parseJSON('{"test":1}'), {"test":1}, "Plain object parsing." );

	same( jQuery.parseJSON('\n{"test":1}'), {"test":1}, "Make sure leading whitespaces are handled." );
	
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
