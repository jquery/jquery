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
	expect(11);

	// Basic constructor's behavior

	equals( jQuery().length, 1, "jQuery() === jQuery(document)" );
	equals( jQuery(undefined).length, 0, "jQuery(undefined) === jQuery([])" );
	equals( jQuery(null).length, 0, "jQuery(null) === jQuery([])" );
	equals( jQuery("").length, 0, "jQuery('') === jQuery([])" );

		// can actually yield more than one, when iframes are included, the window is an array as well
	equals( 1, jQuery(window).length, "Correct number of elements generated for jQuery(window)" );


	var main = jQuery("#main");
	isSet( jQuery("div p", main).get(), q("sndp", "en", "sap"), "Basic selector with jQuery object as context" );

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
	var img = jQuery("<img/>");
	equals( img.length, 1, "Correct number of elements generated for img" );
	var div = jQuery("<div/><hr/><code/><b/>");
	equals( div.length, 4, "Correct number of elements generated for div hr code b" );

	equals( jQuery([1,2,3]).get(1), 2, "Test passing an array to the factory" );

	equals( jQuery(document.body).get(0), jQuery('body').get(0), "Test passing an html node to the factory" );
});

test("selector state", function() {
	expect(30);

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
});

test("browser", function() {
	expect(13);
	var browsers = {
		//Internet Explorer
		"Mozilla/5.0 (Windows; U; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)": "6.0",
		"Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.1; .NET CLR 1.1.4322; InfoPath.1; .NET CLR 2.0.50727)": "7.0",
		/** Failing #1876
		 * "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 1.1.4322; .NET CLR 3.0.04506.30)": "7.0",
		 */
		//Browsers with Gecko engine
		//Mozilla
		"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.12) Gecko/20050915" : "1.7.12",
		//Firefox
		"Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en-US; rv:1.8.1.3) Gecko/20070309 Firefox/2.0.0.3": "1.8.1.3",
		//Netscape
		"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.5) Gecko/20070321 Netscape/8.1.3" : "1.7.5",
		//Flock
		"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.0.11) Gecko/20070321 Firefox/1.5.0.11 Flock/0.7.12" : "1.8.0.11",
		//Opera browser
		"Opera/9.20 (X11; Linux x86_64; U; en)": "9.20",
		"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 9.20" : "9.20",
		"Mozilla/5.0 (Windows NT 5.1; U; pl; rv:1.8.0) Gecko/20060728 Firefox/1.5.0 Opera 9.20": "9.20",
		//WebKit engine
		"Mozilla/5.0 (Macintosh; U; PPC Mac OS X; sv-se) AppleWebKit/418.9 (KHTML, like Gecko) Safari/419.3": "418.9",
		"Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/418.8 (KHTML, like Gecko) Safari/419.3" : "418.8",
		"Mozilla/5.0 (Macintosh; U; PPC Mac OS X; sv-se) AppleWebKit/312.8 (KHTML, like Gecko) Safari/312.5": "312.8",
		//Other user agent string
		"Other browser's user agent 1.0":null
	};
	for (var i in browsers) {
		var v = i.toLowerCase().match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ); // RegEx from Core jQuery.browser.version check
		var version = v ? v[1] : null;
		equals( version, browsers[i], "Checking UA string" );
	}
});

test("noConflict", function() {
	expect(6);

	var $$ = jQuery;

	equals( jQuery, jQuery.noConflict(), "noConflict returned the jQuery object" );
	equals( jQuery, $$, "Make sure jQuery wasn't touched." );
	equals( $, original$, "Make sure $ was reverted." );

	jQuery = $ = $$;

	equals( jQuery.noConflict(true), $$, "noConflict returned the jQuery object" );
	equals( jQuery, originaljQuery, "Make sure jQuery was reverted." );
	equals( $, original$, "Make sure $ was reverted." );

	jQuery = $$;
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

test("jQuery('html')", function() {
	expect(8);

	reset();
	jQuery.foo = false;
	var s = jQuery("<script>jQuery.foo='test';</script>")[0];
	ok( s, "Creating a script" );
	ok( !jQuery.foo, "Make sure the script wasn't executed prematurely" );
	jQuery("body").append("<script>jQuery.foo='test';</script>");
	ok( jQuery.foo, "Executing a scripts contents in the right context" );

	reset();
	ok( jQuery("<link rel='stylesheet'/>")[0], "Creating a link" );

	ok( !jQuery("<script/>")[0].parentNode, "Create a script" );

	ok( jQuery("<input/>").attr("type", "hidden"), "Create an input and set the type." );

	var j = jQuery("<span>hi</span> there <!-- mon ami -->");
	ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	ok( !jQuery("<option>test</option>")[0].selected, "Make sure that options are auto-selected #2050" );
});

test("jQuery('html', context)", function() {
	expect(1);

	var $div = jQuery("<div/>");
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
	isSet( jQuery("p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("toArray()", function() {
	expect(1);
	isSet ( jQuery("p").toArray(),
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

test("add(String|Element|Array|undefined)", function() {
	expect(12);
	isSet( jQuery("#sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document" );
	isSet( jQuery("#sndp").add( jQuery("#en")[0] ).add( jQuery("#sap") ).get(), q("sndp", "en", "sap"), "Check elements from document" );
	ok( jQuery([]).add(jQuery("#form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for jQuery(form.elements) since it's ambiguous in IE
	// use jQuery([]).add(form.elements) instead.
	//equals( jQuery([]).add(jQuery("#form")[0].elements).length, jQuery(jQuery("#form")[0].elements).length, "Array in constructor must equals array in add()" );

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>")).add(jQuery("<p id='x2'>xxx</p>"));
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var notDefined;
	equals( jQuery([]).add(notDefined).length, 0, "Check that undefined adds nothing" );

	// Added after #2811
	equals( jQuery([]).add([window,document,document.body,document]).length, 3, "Pass an array" );
	equals( jQuery(document).add(document).length, 1, "Check duplicated elements" );
	equals( jQuery(window).add(window).length, 1, "Check duplicated elements using the window" );
	ok( jQuery([]).add( document.getElementById('form') ).length >= 13, "Add a form (adds the elements)" );
});

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

test("index(Object|String|undefined)", function() {
	expect(16);

	var elements = jQuery([window, document]),
		inputElements = jQuery('#radio1,#radio2,#check1,#check2');

	// Passing a node
	equals( elements.index(window), 0, "Check for index of elements" );
	equals( elements.index(document), 1, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('radio1')), 0, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('radio2')), 1, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('check1')), 2, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('check2')), 3, "Check for index of elements" );
	equals( inputElements.index(window), -1, "Check for not found index" );
	equals( inputElements.index(document), -1, "Check for not found index" );

	// Passing a jQuery object
	// enabled since [5500]
	equals( elements.index( elements ), 0, "Pass in a jQuery object" );
	equals( elements.index( elements.eq(1) ), 1, "Pass in a jQuery object" );
	equals( jQuery("#form :radio").index( jQuery("#radio2") ), 1, "Pass in a jQuery object" );

	// Passing a selector or nothing
	// enabled since [6330]
	equals( jQuery('#text2').index(), 2, "Check for index amongst siblings" );
	equals( jQuery('#form').children().eq(4).index(), 4, "Check for index amongst siblings" );
	equals( jQuery('#radio2').index('#form :radio') , 1, "Check for index within a selector" );
	equals( jQuery('#form :radio').index( jQuery('#radio2') ), 1, "Check for index within a selector" );
	equals( jQuery('#radio2').index('#form :text') , -1, "Check for index not found within a selector" );
});

test("jQuery.merge()", function() {
	expect(6);

	var parse = jQuery.merge;

	same( parse([],[]), [], "Empty arrays" );

	same( parse([1],[2]), [1,2], "Basic" );
	same( parse([1,2],[3,4]), [1,2,3,4], "Basic" );

	same( parse([1,2],[]), [1,2], "Second empty" );
	same( parse([],[1,2]), [1,2], "First empty" );

	// Fixed at [5998], #3641
	same( parse([-2,-1], [0,1,2]), [-2,-1,0,1,2], "Second array including a zero (falsy)");
});

test("jQuery.extend(Object, Object)", function() {
	expect(20);

	var settings = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		optionsCopy = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		merged = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "x", xxx: "newstring" },
		deep1 = { foo: { bar: true } },
		deep1copy = { foo: { bar: true } },
		deep2 = { foo: { baz: true }, foo2: document },
		deep2copy = { foo: { baz: true }, foo2: document },
		deepmerged = { foo: { bar: true, baz: true }, foo2: document };

	jQuery.extend(settings, options);
	isObj( settings, merged, "Check if extended: settings must be extended" );
	isObj( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(settings, null, options);
	isObj( settings, merged, "Check if extended: settings must be extended" );
	isObj( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(true, deep1, deep2);
	isObj( deep1.foo, deepmerged.foo, "Check if foo: settings must be extended" );
	isObj( deep2.foo, deep2copy.foo, "Check if not deep2: options must not be modified" );
	equals( deep1.foo2, document, "Make sure that a deep clone was not attempted on the document" );

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
	isObj( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

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
	isObj( settings, merged2, "Check if extended: settings must be extended" );
	isObj( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	isObj( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	isObj( options2, options2Copy, "Check if not modified: options2 must not be modified" );
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
	expect(15);

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
});
