QUnit.module( "core", {
	beforeEach: function() {
		this.sandbox = sinon.createSandbox();
	},
	afterEach: function() {
		this.sandbox.restore();
		return moduleTeardown.apply( this, arguments );
	}
} );

QUnit.test( "Basic requirements", function( assert ) {
	assert.expect( 7 );
	assert.ok( Array.prototype.push, "Array.push()" );
	assert.ok( Function.prototype.apply, "Function.apply()" );
	assert.ok( document.getElementById, "getElementById" );
	assert.ok( document.getElementsByTagName, "getElementsByTagName" );
	assert.ok( RegExp, "RegExp" );
	assert.ok( jQuery, "jQuery" );
	assert.ok( $, "$" );
} );

QUnit.test( "jQuery()", function( assert ) {

	var elem, i,
		obj = jQuery( "div" ),
		code = jQuery( "<code></code>" ),
		img = jQuery( "<img/>" ),
		div = jQuery( "<div></div><hr/><code></code><b/>" ),
		exec = false,
		expected = 23,
		attrObj = {
			"text": "test",
			"class": "test2",
			"id": "test3"
		};

	// The $(html, props) signature can stealth-call any $.fn method, check for a
	// few here but beware of modular builds where these methods may be excluded.
	if ( includesModule( "deprecated" ) ) {
		expected++;
		attrObj[ "click" ] = function() { assert.ok( exec, "Click executed." ); };
	}
	if ( includesModule( "dimensions" ) ) {
		expected++;
		attrObj[ "width" ] = 10;
	}
	if ( includesModule( "offset" ) ) {
		expected++;
		attrObj[ "offset" ] = { "top": 1, "left": 1 };
	}
	if ( includesModule( "css" ) ) {
		expected += 2;
		attrObj[ "css" ] = { "paddingLeft": 1, "paddingRight": 1 };
	}
	if ( includesModule( "attributes" ) ) {
		expected++;
		attrObj.attr = { "desired": "very" };
	}

	assert.expect( expected );

	// Basic constructor's behavior
	assert.equal( jQuery().length, 0, "jQuery() === jQuery([])" );
	assert.equal( jQuery( undefined ).length, 0, "jQuery(undefined) === jQuery([])" );
	assert.equal( jQuery( null ).length, 0, "jQuery(null) === jQuery([])" );
	assert.equal( jQuery( "" ).length, 0, "jQuery('') === jQuery([])" );
	assert.deepEqual( jQuery( obj ).get(), obj.get(), "jQuery(jQueryObj) == jQueryObj" );

	// Invalid #id will throw an error (gh-1682)
	try {
		jQuery( "#" );
	} catch ( e ) {
		assert.ok( true, "Threw an error on #id with no id" );
	}

	// can actually yield more than one, when iframes are included, the window is an array as well
	assert.equal( jQuery( window ).length, 1, "Correct number of elements generated for jQuery(window)" );

/*
	// disabled since this test was doing nothing. i tried to fix it but i'm not sure
	// what the expected behavior should even be. FF returns "\n" for the text node
	// make sure this is handled
	var crlfContainer = jQuery('<p>\r\n</p>');
	var x = crlfContainer.contents().get(0).nodeValue;
	assert.equal( x, what???, "Check for \\r and \\n in jQuery()" );
*/

	/* // Disabled until we add this functionality in
	var pass = true;
	try {
		jQuery("<div>Testing</div>").appendTo(document.getElementById("iframe").contentDocument.body);
	} catch(e){
		pass = false;
	}
	assert.ok( pass, "jQuery('&lt;tag&gt;') needs optional document parameter to ease cross-frame DOM wrangling, see trac-968" );*/

	assert.equal( code.length, 1, "Correct number of elements generated for code" );
	assert.equal( code.parent().length, 0, "Make sure that the generated HTML has no parent." );

	assert.equal( img.length, 1, "Correct number of elements generated for img" );
	assert.equal( img.parent().length, 0, "Make sure that the generated HTML has no parent." );

	assert.equal( div.length, 4, "Correct number of elements generated for div hr code b" );
	assert.equal( div.parent().length, 0, "Make sure that the generated HTML has no parent." );

	assert.equal( jQuery( [ 1, 2, 3 ] ).get( 1 ), 2, "Test passing an array to the factory" );

	assert.equal( jQuery( document.body ).get( 0 ), jQuery( "body" ).get( 0 ), "Test passing an html node to the factory" );

	elem = jQuery( "  <em>hello</em>" )[ 0 ];
	assert.equal( elem.nodeName.toLowerCase(), "em", "leading space" );

	elem = jQuery( "\n\n<em>world</em>" )[ 0 ];
	assert.equal( elem.nodeName.toLowerCase(), "em", "leading newlines" );

	elem = jQuery( "<div></div>", attrObj );

	if ( includesModule( "dimensions" ) ) {
		assert.equal( elem[ 0 ].style.width, "10px", "jQuery() quick setter width" );
	}

	if ( includesModule( "offset" ) ) {
		assert.equal( elem[ 0 ].style.top, "1px", "jQuery() quick setter offset" );
	}

	if ( includesModule( "css" ) ) {
		assert.equal( elem[ 0 ].style.paddingLeft, "1px", "jQuery quick setter css" );
		assert.equal( elem[ 0 ].style.paddingRight, "1px", "jQuery quick setter css" );
	}

	if ( includesModule( "attributes" ) ) {
		assert.equal( elem[ 0 ].getAttribute( "desired" ), "very", "jQuery quick setter attr" );
	}

	assert.equal( elem[ 0 ].childNodes.length, 1, "jQuery quick setter text" );
	assert.equal( elem[ 0 ].firstChild.nodeValue, "test", "jQuery quick setter text" );
	assert.equal( elem[ 0 ].className, "test2", "jQuery() quick setter class" );
	assert.equal( elem[ 0 ].id, "test3", "jQuery() quick setter id" );

	exec = true;
	elem.trigger( "click" );

	// manually clean up detached elements
	elem.remove();

	for ( i = 0; i < 3; ++i ) {
		elem = jQuery( "<input type='text' value='TEST' />" );
	}
	assert.equal( elem[ 0 ].defaultValue, "TEST", "Ensure cached nodes are cloned properly (Bug trac-6655)" );

	elem = jQuery( "<input type='hidden'>", {} );
	assert.strictEqual( elem[ 0 ].ownerDocument, document,
		"Empty attributes object is not interpreted as a document (trac-8950)" );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "jQuery(selector, context)", function( assert ) {
	assert.expect( 3 );
	assert.deepEqual( jQuery( "div p", "#qunit-fixture" ).get(), q( "sndp", "en", "sap" ), "Basic selector with string as context" );
	assert.deepEqual( jQuery( "div p", q( "qunit-fixture" )[ 0 ] ).get(), q( "sndp", "en", "sap" ), "Basic selector with element as context" );
	assert.deepEqual( jQuery( "div p", jQuery( "#qunit-fixture" ) ).get(), q( "sndp", "en", "sap" ), "Basic selector with jQuery object as context" );
} );

QUnit.test( "globalEval", function( assert ) {
	assert.expect( 3 );
	Globals.register( "globalEvalTest" );

	jQuery.globalEval( "globalEvalTest = 1;" );
	assert.equal( window.globalEvalTest, 1, "Test variable assignments are global" );

	jQuery.globalEval( "var globalEvalTest = 2;" );
	assert.equal( window.globalEvalTest, 2, "Test variable declarations are global" );

	jQuery.globalEval( "this.globalEvalTest = 3;" );
	assert.equal( window.globalEvalTest, 3, "Test context (this) is the window object" );
} );

QUnit.test( "globalEval with 'use strict'", function( assert ) {
	assert.expect( 1 );
	Globals.register( "strictEvalTest" );

	jQuery.globalEval( "'use strict'; var strictEvalTest = 1;" );
	assert.equal( window.strictEvalTest, 1, "Test variable declarations are global (strict mode)" );
} );

QUnit.test( "globalEval execution after script injection (trac-7862)", function( assert ) {
	assert.expect( 1 );

	var now,
		script = document.createElement( "script" );

	script.src = baseURL + "mock.php?action=wait&wait=2&script=1";

	now = Date.now();
	document.body.appendChild( script );

	jQuery.globalEval( "var strictEvalTest = " + Date.now() + ";" );
	assert.ok( window.strictEvalTest - now < 500, "Code executed synchronously" );
} );

testIframe(
	"globalEval with custom document context",
	"core/globaleval-context.html",
	function( assert, framejQuery, frameWindow, frameDocument ) {
		assert.expect( 2 );

		jQuery.globalEval( "window.scriptTest = true;", {}, frameDocument );
		assert.ok( !window.scriptTest, "script executed in iframe context" );
		assert.ok( frameWindow.scriptTest, "script executed in iframe context" );
	}
);


QUnit.test( "noConflict", function( assert ) {
	assert.expect( 7 );

	var $$ = jQuery;

	assert.strictEqual( jQuery, jQuery.noConflict(), "noConflict returned the jQuery object" );
	assert.strictEqual( window[ "jQuery" ], $$, "Make sure jQuery wasn't touched." );
	assert.strictEqual( window[ "$" ], original$, "Make sure $ was reverted." );

	jQuery = $ = $$;

	assert.strictEqual( jQuery.noConflict( true ), $$, "noConflict returned the jQuery object" );
	assert.strictEqual( window[ "jQuery" ], originaljQuery, "Make sure jQuery was reverted." );
	assert.strictEqual( window[ "$" ], original$, "Make sure $ was reverted." );
	assert.ok( $$().pushStack( [] ), "Make sure that jQuery still works." );

	window[ "jQuery" ] = jQuery = $$;
} );

QUnit.test( "isPlainObject", function( assert ) {
	var done = assert.async();

	assert.expect( 23 );

	var pass, iframe, doc, parentObj, childObj, deep,
		fn = function() {};

	// The use case that we want to match
	assert.ok( jQuery.isPlainObject( {} ), "{}" );
	assert.ok( jQuery.isPlainObject( new window.Object() ), "new Object" );
	assert.ok( jQuery.isPlainObject( { constructor: fn } ),
		"plain object with constructor property" );
	assert.ok( jQuery.isPlainObject( { constructor: "foo" } ),
		"plain object with primitive constructor property" );

	parentObj = {};
	childObj = Object.create( parentObj );
	assert.ok( !jQuery.isPlainObject( childObj ), "Object.create({})" );
	parentObj.foo = "bar";
	assert.ok( !jQuery.isPlainObject( childObj ), "Object.create({...})" );
	childObj.bar = "foo";
	assert.ok( !jQuery.isPlainObject( childObj ), "extend(Object.create({...}), ...)" );

	// Not objects shouldn't be matched
	assert.ok( !jQuery.isPlainObject( "" ), "string" );
	assert.ok( !jQuery.isPlainObject( 0 ) && !jQuery.isPlainObject( 1 ), "number" );
	assert.ok( !jQuery.isPlainObject( true ) && !jQuery.isPlainObject( false ), "boolean" );
	assert.ok( !jQuery.isPlainObject( null ), "null" );
	assert.ok( !jQuery.isPlainObject( undefined ), "undefined" );

	// Arrays shouldn't be matched
	assert.ok( !jQuery.isPlainObject( [] ), "array" );

	// Instantiated objects shouldn't be matched
	assert.ok( !jQuery.isPlainObject( new Date() ), "new Date" );

	// Functions shouldn't be matched
	assert.ok( !jQuery.isPlainObject( fn ), "fn" );

	// Again, instantiated objects shouldn't be matched
	assert.ok( !jQuery.isPlainObject( new fn() ), "new fn (no methods)" );

	// Makes the function a little more realistic
	// (and harder to detect, incidentally)
	fn.prototype[ "someMethod" ] = function() {};

	// Again, instantiated objects shouldn't be matched
	assert.ok( !jQuery.isPlainObject( new fn() ), "new fn" );

	// Instantiated objects with primitive constructors shouldn't be matched
	fn.prototype.constructor = "foo";
	assert.ok( !jQuery.isPlainObject( new fn() ), "new fn with primitive constructor" );

	// Deep object
	deep = { "foo": { "baz": true }, "foo2": document };
	assert.ok( jQuery.isPlainObject( deep ), "Object with objects is still plain" );

	// DOM Element
	assert.ok( !jQuery.isPlainObject( document.createElement( "div" ) ), "DOM Element" );

	// Window
	assert.ok( !jQuery.isPlainObject( window ), "window" );

	pass = false;
	try {
		jQuery.isPlainObject( window.location );
		pass = true;
	} catch ( e ) {}
	assert.ok( pass, "Does not throw exceptions on host objects" );

	// Objects from other windows should be matched
	Globals.register( "iframeDone" );
	window.iframeDone = function( otherObject, detail ) {
		window.iframeDone = undefined;
		iframe.parentNode.removeChild( iframe );
		assert.ok( jQuery.isPlainObject( new otherObject() ), "new otherObject" + ( detail ? " - " + detail : "" ) );
		done();
	};

	try {
		iframe = jQuery( "#qunit-fixture" )[ 0 ].appendChild( document.createElement( "iframe" ) );
		doc = iframe.contentDocument || iframe.contentWindow.document;
		doc.open();
		doc.write( "<body onload='window.parent.iframeDone(Object);'>" );
		doc.close();
	} catch ( e ) {
		window.iframeDone( Object, "iframes not supported" );
	}
} );

QUnit.testUnlessIE( "isPlainObject(Symbol)", function( assert ) {
	assert.expect( 2 );

	assert.equal( jQuery.isPlainObject( Symbol() ), false, "Symbol" );
	assert.equal( jQuery.isPlainObject( Object( Symbol() ) ), false, "Symbol inside an object" );
} );

QUnit.test( "isPlainObject(localStorage)", function( assert ) {
	assert.expect( 1 );

	assert.equal( jQuery.isPlainObject( localStorage ), false );
} );

QUnit.testUnlessIE( "isPlainObject(Object.assign(...))",
	function( assert ) {
		assert.expect( 1 );

		var parentObj = { foo: "bar" };
		var childObj = Object.assign( Object.create( parentObj ), { bar: "foo" } );

		assert.ok( !jQuery.isPlainObject( childObj ), "isPlainObject(Object.assign(...))" );
	}
);

QUnit.test( "isXMLDoc - HTML", function( assert ) {
	assert.expect( 4 );

	assert.ok( !jQuery.isXMLDoc( document ), "HTML document" );
	assert.ok( !jQuery.isXMLDoc( document.documentElement ), "HTML documentElement" );
	assert.ok( !jQuery.isXMLDoc( document.body ), "HTML Body Element" );

	var body,
		iframe = document.createElement( "iframe" );
	document.body.appendChild( iframe );

	try {
		body = jQuery( iframe ).contents()[ 0 ];

		try {
			assert.ok( !jQuery.isXMLDoc( body ), "Iframe body element" );
		} catch ( e ) {
			assert.ok( false, "Iframe body element exception" );
		}

	} catch ( e ) {
		assert.ok( true, "Iframe body element - iframe not working correctly" );
	}

	document.body.removeChild( iframe );
} );

QUnit.test( "isXMLDoc - embedded SVG", function( assert ) {
	assert.expect( 6 );

	var htmlTree = jQuery( "<div>" +
		"<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='1' width='1'>" +
		"<desc></desc>" +
		"</svg>" +
		"</div>"
	)[ 0 ];

	assert.strictEqual( jQuery.isXMLDoc( htmlTree ), false, "disconnected div element" );
	assert.strictEqual( jQuery.isXMLDoc( htmlTree.firstChild ), true,
		"disconnected HTML-embedded SVG root element" );

	assert.strictEqual( jQuery.isXMLDoc( htmlTree.firstChild.firstChild ), true,
		"disconnected HTML-embedded SVG child element" );

	document.getElementById( "qunit-fixture" ).appendChild( htmlTree );
	assert.strictEqual( jQuery.isXMLDoc( htmlTree ), false, "connected div element" );
	assert.strictEqual( jQuery.isXMLDoc( htmlTree.firstChild ), true,
		"connected HTML-embedded SVG root element" );

	assert.strictEqual( jQuery.isXMLDoc( htmlTree.firstChild.firstChild ), true,
		"disconnected HTML-embedded SVG child element" );
} );

QUnit.test( "isXMLDoc - XML", function( assert ) {
	assert.expect( 8 );

	var xml = createDashboardXML();
	var svg = jQuery.parseXML(
		"<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" " +
		"\"http://www.w3.org/Gaphics/SVG/1.1/DTD/svg11.dtd\">" +
		"<svg version='1.1' xmlns='http://www.w3.org/2000/svg'><desc/></svg>"
	);
	assert.ok( jQuery.isXMLDoc( xml ), "XML document" );
	assert.ok( jQuery.isXMLDoc( xml.documentElement ), "XML documentElement" );
	assert.ok( jQuery.isXMLDoc( xml.documentElement.firstChild ), "XML child element" );
	assert.ok( jQuery.isXMLDoc( jQuery( "tab", xml )[ 0 ] ), "XML tab Element" );

	assert.ok( jQuery.isXMLDoc( svg ), "SVG document" );
	assert.ok( jQuery.isXMLDoc( svg.documentElement ), "SVG documentElement" );
	assert.ok( jQuery.isXMLDoc( svg.documentElement.firstChild ), "SVG child element" );
	assert.ok( jQuery.isXMLDoc( jQuery( "desc", svg )[ 0 ] ), "XML desc Element" );
} );

QUnit.test( "isXMLDoc - falsy", function( assert ) {
	assert.expect( 5 );

	assert.strictEqual( jQuery.isXMLDoc( undefined ), false, "undefined" );
	assert.strictEqual( jQuery.isXMLDoc( null ), false, "null" );
	assert.strictEqual( jQuery.isXMLDoc( false ), false, "false" );
	assert.strictEqual( jQuery.isXMLDoc( 0 ), false, "0" );
	assert.strictEqual( jQuery.isXMLDoc( "" ), false, "\"\"" );
} );

QUnit.test( "XSS via location.hash", function( assert ) {
	var done = assert.async();
	assert.expect( 1 );

	jQuery[ "_check9521" ] = function( x ) {
		assert.ok( x, "script called from #id-like selector with inline handler" );
		jQuery( "#check9521" ).remove();
		delete jQuery[ "_check9521" ];
		done();
	};
	try {

		// This throws an error because it's processed like an id
		jQuery( "#<img id='check9521' src='no-such-.gif' onerror='jQuery._check9521(false)'>" ).appendTo( "#qunit-fixture" );
	} catch ( err ) {
		jQuery[ "_check9521" ]( true );
	}
} );

QUnit.test( "jQuery('html')", function( assert ) {
	assert.expect( 18 );

	var s, div, j;

	jQuery[ "foo" ] = false;
	s = jQuery( "<script>jQuery.foo='test';</script>" )[ 0 ];
	assert.ok( s, "Creating a script" );
	assert.ok( !jQuery[ "foo" ], "Make sure the script wasn't executed prematurely" );
	jQuery( "body" ).append( "<script>jQuery.foo='test';</script>" );
	assert.ok( jQuery[ "foo" ], "Executing a script's contents in the right context" );

	// Test multi-line HTML
	div = jQuery( "<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>" )[ 0 ];
	assert.equal( div.nodeName.toUpperCase(), "DIV", "Make sure we're getting a div." );
	assert.equal( div.firstChild.nodeType, 3, "Text node." );
	assert.equal( div.lastChild.nodeType, 3, "Text node." );
	assert.equal( div.childNodes[ 1 ].nodeType, 1, "Paragraph." );
	assert.equal( div.childNodes[ 1 ].firstChild.nodeType, 3, "Paragraph text." );

	assert.ok( jQuery( "<link rel='stylesheet'/>" )[ 0 ], "Creating a link" );

	assert.ok( !jQuery( "<script></script>" )[ 0 ].parentNode, "Create a script" );

	assert.ok( jQuery( "<input/>" ).attr( "type", "hidden" ), "Create an input and set the type." );

	j = jQuery( "<span>hi</span> there <!-- mon ami -->" );
	assert.ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	assert.ok( !jQuery( "<option>test</option>" )[ 0 ].selected, "Make sure that options are auto-selected trac-2050" );

	assert.ok( jQuery( "<div></div>" )[ 0 ], "Create a div with closing tag." );
	assert.ok( jQuery( "<table></table>" )[ 0 ], "Create a table with closing tag." );

	assert.equal( jQuery( "element[attribute='<div></div>']" ).length, 0,
		"When html is within brackets, do not recognize as html." );

	//equal( jQuery( "element[attribute=<div></div>]" ).length, 0,
	//	"When html is within brackets, do not recognize as html." );
	if ( QUnit.jQuerySelectors ) {
		assert.equal( jQuery( "element:not(<div></div>)" ).length, 0,
			"When html is within parens, do not recognize as html." );
	} else {
		assert.ok( "skip", "Complex :not not supported in selector-native" );
	}
	assert.equal( jQuery( "\\<div\\>" ).length, 0, "Ignore escaped html characters" );
} );

QUnit.test( "jQuery(element with non-alphanumeric name)", function( assert ) {
	assert.expect( 36 );

	jQuery.each( [ "-", ":" ], function( i, symbol ) {
		jQuery.each( [ "thead", "tbody", "tfoot", "colgroup", "caption", "tr", "th", "td" ],
			function( j, tag ) {
				var tagName = tag + symbol + "test";
				var el = jQuery( "<" + tagName + "></" + tagName + ">" );
				assert.ok( el[ 0 ], "Create a " + tagName + " element" );
				assert.ok( el[ 0 ].nodeName === tagName.toUpperCase(),
					tagName + " element has expected node name" );
			}
		);

		var tagName = [ "tr", "multiple", "symbol" ].join( symbol );
		var el = jQuery( "<" + tagName + "></" + tagName + ">" );
		assert.ok( el[ 0 ], "Create a " + tagName + " element" );
		assert.ok( el[ 0 ].nodeName === tagName.toUpperCase(),
			tagName + " element has expected node name" );
	} );
} );

QUnit.test( "jQuery('massive html trac-7990')", function( assert ) {
	assert.expect( 3 );

	var i,
		li = "<li>very very very very large html string</li>",
		html = [ "<ul>" ];

	for ( i = 0; i < 30000; i += 1 ) {
		html[ html.length ] = li;
	}
	html[ html.length ] = "</ul>";
	html = jQuery( html.join( "" ) )[ 0 ];
	assert.equal( html.nodeName.toLowerCase(), "ul" );
	assert.equal( html.firstChild.nodeName.toLowerCase(), "li" );
	assert.equal( html.childNodes.length, 30000 );
} );

QUnit.test( "jQuery('html', context)", function( assert ) {
	assert.expect( 1 );

	var $div = jQuery( "<div></div>" )[ 0 ],
		$span = jQuery( "<span></span>", $div );
	assert.equal( $span.length, 1, "verify a span created with a div context works, trac-1763" );
} );

QUnit.test( "jQuery(selector, xml).text(str) - loaded via xml document", function( assert ) {
	assert.expect( 2 );

	var xml = createDashboardXML(),

	// tests for trac-1419 where ie was a problem
		tab = jQuery( "tab", xml ).eq( 0 );
	assert.equal( tab.text(), "blabla", "verify initial text correct" );
	tab.text( "newtext" );
	assert.equal( tab.text(), "newtext", "verify new text correct" );
} );

QUnit.test( "end()", function( assert ) {
	assert.expect( 3 );
	assert.equal( "Yahoo", jQuery( "#yahoo" ).parent().end().text(), "check for end" );
	assert.ok( jQuery( "#yahoo" ).end(), "check for end with nothing to end" );

	var x = jQuery( "#yahoo" );
	x.parent();
	assert.equal( "Yahoo", jQuery( "#yahoo" ).text(), "check for non-destructive behavior" );
} );

QUnit.test( "length", function( assert ) {
	assert.expect( 1 );
	assert.equal( jQuery( "#qunit-fixture p" ).length, 6, "Get Number of Elements Found" );
} );

QUnit.test( "get()", function( assert ) {
	assert.expect( 1 );
	assert.deepEqual( jQuery( "#qunit-fixture p" ).get(), q( "firstp", "ap", "sndp", "en", "sap", "first" ), "Get All Elements" );
} );

QUnit.test( "toArray()", function( assert ) {
	assert.expect( 1 );
	assert.deepEqual( jQuery( "#qunit-fixture p" ).toArray(),
		q( "firstp", "ap", "sndp", "en", "sap", "first" ),
		"Convert jQuery object to an Array" );
} );

QUnit.test( "inArray()", function( assert ) {
	assert.expect( 19 );

	var selections = {
		p:   q( "firstp", "sap", "ap", "first" ),
		em:  q( "siblingnext", "siblingfirst" ),
		div: q( "qunit-testrunner-toolbar", "nothiddendiv", "nothiddendivchild", "foo" ),
		a:   q( "mark", "groups", "google", "simon1" ),
		empty: []
	},
	tests = {
		p:    { elem: jQuery( "#ap" )[ 0 ],           index: 2 },
		em:   { elem: jQuery( "#siblingfirst" )[ 0 ], index: 1 },
		div:  { elem: jQuery( "#nothiddendiv" )[ 0 ], index: 1 },
		a:    { elem: jQuery( "#simon1" )[ 0 ],       index: 3 }
	},
	falseTests = {
		p:  jQuery( "#liveSpan1" )[ 0 ],
		em: jQuery( "#nothiddendiv" )[ 0 ],
		empty: ""
	};

	jQuery.each( tests, function( key, obj ) {
		assert.equal( jQuery.inArray( obj.elem, selections[ key ] ), obj.index, "elem is in the array of selections of its tag" );

		// Third argument (fromIndex)
		assert.equal( !!~jQuery.inArray( obj.elem, selections[ key ], 5 ), false, "elem is NOT in the array of selections given a starting index greater than its position" );
		assert.equal( !!~jQuery.inArray( obj.elem, selections[ key ], 1 ), true, "elem is in the array of selections given a starting index less than or equal to its position" );
		assert.equal( !!~jQuery.inArray( obj.elem, selections[ key ], -3 ), true, "elem is in the array of selections given a negative index" );
	} );

	jQuery.each( falseTests, function( key, elem ) {
		assert.equal( !!~jQuery.inArray( elem, selections[ key ] ), false, "elem is NOT in the array of selections" );
	} );

} );

QUnit.test( "get(Number)", function( assert ) {
	assert.expect( 2 );
	assert.equal( jQuery( "#qunit-fixture p" ).get( 0 ), document.getElementById( "firstp" ), "Get A Single Element" );
	assert.strictEqual( jQuery( "#firstp" ).get( 1 ), undefined, "Try get with index larger elements count" );
} );

QUnit.test( "get(-Number)", function( assert ) {
	assert.expect( 2 );
	assert.equal( jQuery( "p" ).get( -1 ), document.getElementById( "first" ), "Get a single element with negative index" );
	assert.strictEqual( jQuery( "#firstp" ).get( -2 ), undefined, "Try get with index negative index larger then elements count" );
} );

QUnit.test( "each(Function)", function( assert ) {
	assert.expect( 1 );
	var div, pass, i;

	div = jQuery( "div" );
	div.each( function() {this.foo = "zoo";} );
	pass = true;
	for ( i = 0; i < div.length; i++ ) {
		if ( div.get( i ).foo !== "zoo" ) {
			pass = false;
		}
	}
	assert.ok( pass, "Execute a function, Relative" );
} );

QUnit.test( "slice()", function( assert ) {
	assert.expect( 7 );

	var $links = jQuery( "#ap a" );

	assert.deepEqual( $links.slice( 1, 2 ).get(), q( "groups" ), "slice(1,2)" );
	assert.deepEqual( $links.slice( 1 ).get(), q( "groups", "anchor1", "mark" ), "slice(1)" );
	assert.deepEqual( $links.slice( 0, 3 ).get(), q( "google", "groups", "anchor1" ), "slice(0,3)" );
	assert.deepEqual( $links.slice( -1 ).get(), q( "mark" ), "slice(-1)" );

	assert.deepEqual( $links.eq( 1 ).get(), q( "groups" ), "eq(1)" );
	assert.deepEqual( $links.eq( "2" ).get(), q( "anchor1" ), "eq('2')" );
	assert.deepEqual( $links.eq( -1 ).get(), q( "mark" ), "eq(-1)" );
} );

QUnit.test( "first()/last()", function( assert ) {
	assert.expect( 4 );

	var $links = jQuery( "#ap a" ), $none = jQuery( "asdf" );

	assert.deepEqual( $links.first().get(), q( "google" ), "first()" );
	assert.deepEqual( $links.last().get(), q( "mark" ), "last()" );

	assert.deepEqual( $none.first().get(), [], "first() none" );
	assert.deepEqual( $none.last().get(), [], "last() none" );
} );

QUnit.test( "even()/odd()", function( assert ) {
	assert.expect( 4 );

	var $links = jQuery( "#ap a" ), $none = jQuery( "asdf" );

	assert.deepEqual( $links.even().get(), q( "google", "anchor1" ), "even()" );
	assert.deepEqual( $links.odd().get(), q( "groups", "mark" ), "odd()" );

	assert.deepEqual( $none.even().get(), [], "even() none" );
	assert.deepEqual( $none.odd().get(), [], "odd() none" );
} );

QUnit.test( "map()", function( assert ) {
	assert.expect( 2 );

	assert.deepEqual(
		jQuery( "#ap" ).map( function() {
			return jQuery( this ).find( "a" ).get();
		} ).get(),
		q( "google", "groups", "anchor1", "mark" ),
		"Array Map"
	);

	assert.deepEqual(
		jQuery( "#ap > a" ).map( function() {
			return this.parentNode;
		} ).get(),
		q( "ap", "ap", "ap" ),
		"Single Map"
	);
} );

QUnit.test( "jQuery.map", function( assert ) {
	assert.expect( 28 );

	var i, label, result, callback;

	result = jQuery.map( [ 3, 4, 5 ], function( v, k ) {
		return k;
	} );
	assert.equal( result.join( "" ), "012", "Map the keys from an array" );

	result = jQuery.map( [ 3, 4, 5 ], function( v ) {
		return v;
	} );
	assert.equal( result.join( "" ), "345", "Map the values from an array" );

	result = jQuery.map( { a: 1, b: 2 }, function( v, k ) {
		return k;
	} );
	assert.equal( result.join( "" ), "ab", "Map the keys from an object" );

	result = jQuery.map( { a: 1, b: 2 }, function( v ) {
		return v;
	} );
	assert.equal( result.join( "" ), "12", "Map the values from an object" );

	result = jQuery.map( [ "a", undefined, null, "b" ], function( v ) {
		return v;
	} );
	assert.equal( result.join( "" ), "ab", "Array iteration does not include undefined/null results" );

	result = jQuery.map( { a: "a", b: undefined, c: null, d: "b" }, function( v ) {
		return v;
	} );
	assert.equal( result.join( "" ), "ab", "Object iteration does not include undefined/null results" );

	result = {
		Zero: function() {},
		One: function( a ) { a = a; },
		Two: function( a, b ) { a = a; b = b; }
	};
	callback = function( v, k ) {
		assert.equal( k, "foo", label + "-argument function treated like object" );
	};
	for ( i in result ) {
		label = i;
		result[ i ].foo = "bar";
		jQuery.map( result[ i ], callback );
	}

	result = {
		"undefined": undefined,
		"null": null,
		"false": false,
		"true": true,
		"empty string": "",
		"nonempty string": "string",
		"string \"0\"": "0",
		"negative": -1,
		"excess": 1
	};
	callback = function( v, k ) {
		assert.equal( k, "length", "Object with " + label + " length treated like object" );
	};
	for ( i in result ) {
		label = i;
		jQuery.map( { length: result[ i ] }, callback );
	}

	result = {
		"sparse Array": Array( 4 ),
		"length: 1 plain object": { length: 1, "0": true },
		"length: 2 plain object": { length: 2, "0": true, "1": true },
		NodeList: document.getElementsByTagName( "html" )
	};
	callback = function( v, k ) {
		if ( result[ label ] ) {
			delete result[ label ];
			assert.equal( k, "0", label + " treated like array" );
		}
	};
	for ( i in result ) {
		label = i;
		jQuery.map( result[ i ], callback );
	}

	result = false;
	jQuery.map( { length: 0 }, function() {
		result = true;
	} );
	assert.ok( !result, "length: 0 plain object treated like array" );

	result = false;
	jQuery.map( document.getElementsByTagName( "asdf" ), function() {
		result = true;
	} );
	assert.ok( !result, "empty NodeList treated like array" );

	result = jQuery.map( Array( 4 ), function( v, k ) {
		return k % 2 ? k : [ k, k, k ];
	} );
	assert.equal( result.join( "" ), "00012223", "Array results flattened (trac-2616)" );

	result = jQuery.map( [ [ [ 1, 2 ], 3 ], 4 ], function( v, k ) {
		return v;
	} );
	assert.equal( result.length, 3, "Array flatten only one level down" );
	assert.ok( Array.isArray( result[ 0 ] ), "Array flatten only one level down" );

	// Support: IE 11+
	// IE doesn't have Array#flat so it'd fail the test.
	if ( !QUnit.isIE ) {
		result = jQuery.map( Array( 300000 ), function( v, k ) {
			return k;
		} );
		assert.equal( result.length, 300000, "Able to map 300000 records without any problems (gh-4320)" );
	} else {
		assert.ok( "skip", "Array#flat isn't supported in IE" );
	}
} );

QUnit.test( "jQuery.merge()", function( assert ) {
	assert.expect( 10 );

	assert.deepEqual(
		jQuery.merge( [], [] ),
		[],
		"Empty arrays"
	);

	assert.deepEqual(
		jQuery.merge( [ 1 ], [ 2 ] ),
		[ 1, 2 ],
		"Basic (single-element)"
	);
	assert.deepEqual(
		jQuery.merge( [ 1, 2 ], [ 3, 4 ] ),
		[ 1, 2, 3, 4 ],
		"Basic (multiple-element)"
	);

	assert.deepEqual(
		jQuery.merge( [ 1, 2 ], [] ),
		[ 1, 2 ],
		"Second empty"
	);
	assert.deepEqual(
		jQuery.merge( [], [ 1, 2 ] ),
		[ 1, 2 ],
		"First empty"
	);

	// Fixed at [5998], trac-3641
	assert.deepEqual(
		jQuery.merge( [ -2, -1 ], [ 0, 1, 2 ] ),
		[ -2, -1, 0, 1, 2 ],
		"Second array including a zero (falsy)"
	);

	// After fixing trac-5527
	assert.deepEqual(
		jQuery.merge( [], [ null, undefined ] ),
		[ null, undefined ],
		"Second array including null and undefined values"
	);
	assert.deepEqual(
		jQuery.merge( { length: 0 }, [ 1, 2 ] ),
		{ length: 2, 0: 1, 1: 2 },
		"First array like"
	);
	assert.deepEqual(
		jQuery.merge( [ 1, 2 ], { length: 1, 0: 3 } ),
		[ 1, 2, 3 ],
		"Second array like"
	);

	assert.deepEqual(
		jQuery.merge( [], document.getElementById( "lengthtest" ).getElementsByTagName( "input" ) ),
		[ document.getElementById( "length" ), document.getElementById( "idTest" ) ],
		"Second NodeList"
	);
} );

QUnit.test( "jQuery.grep()", function( assert ) {
	assert.expect( 8 );

	var searchCriterion = function( value ) {
		return value % 2 === 0;
	};

	assert.deepEqual( jQuery.grep( [], searchCriterion ), [], "Empty array" );
	assert.deepEqual( jQuery.grep( new Array( 4 ), searchCriterion ), [], "Sparse array" );

	assert.deepEqual(
		jQuery.grep( [ 1, 2, 3, 4, 5, 6 ], searchCriterion ),
		[ 2, 4, 6 ],
		"Satisfying elements present"
	);
	assert.deepEqual(
		jQuery.grep( [ 1, 3, 5, 7 ], searchCriterion ),
		[],
		"Satisfying elements absent"
	);

	assert.deepEqual(
		jQuery.grep( [ 1, 2, 3, 4, 5, 6 ], searchCriterion, true ),
		[ 1, 3, 5 ],
		"Satisfying elements present and grep inverted"
	);
	assert.deepEqual(
		jQuery.grep( [ 1, 3, 5, 7 ], searchCriterion, true ),
		[ 1, 3, 5, 7 ],
		"Satisfying elements absent and grep inverted"
	);

	assert.deepEqual(
		jQuery.grep( [ 1, 2, 3, 4, 5, 6 ], searchCriterion, false ),
		[ 2, 4, 6 ],
		"Satisfying elements present but grep explicitly uninverted"
	);
	assert.deepEqual(
		jQuery.grep( [ 1, 3, 5, 7 ], searchCriterion, false ),
		[],
		"Satisfying elements absent and grep explicitly uninverted"
	);
} );

QUnit.test( "jQuery.grep(Array-like)", function( assert ) {
	assert.expect( 7 );

	var searchCriterion = function( value ) {
		return value % 2 === 0;
	};

	assert.deepEqual( jQuery.grep( { length: 0 }, searchCriterion ), [], "Empty array-like" );

	assert.deepEqual(
		jQuery.grep( { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, length: 6 }, searchCriterion ),
		[ 2, 4, 6 ],
		"Satisfying elements present and array-like object used"
	);
	assert.deepEqual(
		jQuery.grep( { 0: 1, 1: 3, 2: 5, 3: 7, length: 4 }, searchCriterion ),
		[],
		"Satisfying elements absent and Array-like object used"
	);

	assert.deepEqual(
		jQuery.grep( { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, length: 6 }, searchCriterion, true ),
		[ 1, 3, 5 ],
		"Satisfying elements present, array-like object used, and grep inverted"
	);
	assert.deepEqual(
		jQuery.grep( { 0: 1, 1: 3, 2: 5, 3: 7, length: 4 }, searchCriterion, true ),
		[ 1, 3, 5, 7 ],
		"Satisfying elements absent, array-like object used, and grep inverted"
	);

	assert.deepEqual(
		jQuery.grep( { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, length: 6 }, searchCriterion, false ),
		[ 2, 4, 6 ],
		"Satisfying elements present, Array-like object used, but grep explicitly uninverted"
	);
	assert.deepEqual(
		jQuery.grep( { 0: 1, 1: 3, 2: 5, 3: 7, length: 4 }, searchCriterion, false ),
		[],
		"Satisfying elements absent, Array-like object used, and grep explicitly uninverted"
	);
} );

QUnit.test( "jQuery.extend(Object, Object)", function( assert ) {
	assert.expect( 28 );

	var empty, optionsWithLength, optionsWithDate, myKlass,
		customObject, optionsWithCustomObject, MyNumber, ret,
		nullUndef, target, recursive, obj,
		defaults, defaultsCopy, options1, options1Copy, options2, options2Copy, merged2,
		settings = { "xnumber1": 5, "xnumber2": 7, "xstring1": "peter", "xstring2": "pan" },
		options = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		optionsCopy = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		merged = { "xnumber1": 5, "xnumber2": 1, "xstring1": "peter", "xstring2": "x", "xxx": "newstring" },
		deep1 = { "foo": { "bar": true } },
		deep2 = { "foo": { "baz": true }, "foo2": document },
		deep2copy = { "foo": { "baz": true }, "foo2": document },
		deepmerged = { "foo": { "bar": true, "baz": true }, "foo2": document },
		arr = [ 1, 2, 3 ],
		nestedarray = { "arr": arr };

	jQuery.extend( settings, options );
	assert.deepEqual( settings, merged, "Check if extended: settings must be extended" );
	assert.deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend( settings, null, options );
	assert.deepEqual( settings, merged, "Check if extended: settings must be extended" );
	assert.deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend( true, deep1, deep2 );
	assert.deepEqual( deep1[ "foo" ], deepmerged[ "foo" ], "Check if foo: settings must be extended" );
	assert.deepEqual( deep2[ "foo" ], deep2copy[ "foo" ], "Check if not deep2: options must not be modified" );
	assert.equal( deep1[ "foo2" ], document, "Make sure that a deep clone was not attempted on the document" );

	assert.ok( jQuery.extend( true, {}, nestedarray )[ "arr" ] !== arr, "Deep extend of object must clone child array" );

	// trac-5991
	assert.ok( Array.isArray( jQuery.extend( true, { "arr": {} }, nestedarray )[ "arr" ] ), "Cloned array have to be an Array" );
	assert.ok( jQuery.isPlainObject( jQuery.extend( true, { "arr": arr }, { "arr": {} } )[ "arr" ] ), "Cloned object have to be an plain object" );

	empty = {};
	optionsWithLength = { "foo": { "length": -1 } };
	jQuery.extend( true, empty, optionsWithLength );
	assert.deepEqual( empty[ "foo" ], optionsWithLength[ "foo" ], "The length property must copy correctly" );

	empty = {};
	optionsWithDate = { "foo": { "date": new Date() } };
	jQuery.extend( true, empty, optionsWithDate );
	assert.deepEqual( empty[ "foo" ], optionsWithDate[ "foo" ], "Dates copy correctly" );

	/** @constructor */
	myKlass = function() {};
	customObject = new myKlass();
	optionsWithCustomObject = { "foo": { "date": customObject } };
	empty = {};
	jQuery.extend( true, empty, optionsWithCustomObject );
	assert.ok( empty[ "foo" ] && empty[ "foo" ][ "date" ] === customObject, "Custom objects copy correctly (no methods)" );

	// Makes the class a little more realistic
	myKlass.prototype = { "someMethod": function() {} };
	empty = {};
	jQuery.extend( true, empty, optionsWithCustomObject );
	assert.ok( empty[ "foo" ] && empty[ "foo" ][ "date" ] === customObject, "Custom objects copy correctly" );

	MyNumber = Number;

	ret = jQuery.extend( true, { "foo": 4 }, { "foo": new MyNumber( 5 ) } );
	assert.ok( parseInt( ret.foo, 10 ) === 5, "Wrapped numbers copy correctly" );

	nullUndef = jQuery.extend( {}, options, { "xnumber2": null } );
	assert.ok( nullUndef[ "xnumber2" ] === null, "Check to make sure null values are copied" );

	nullUndef = jQuery.extend( {}, options, { "xnumber2": undefined } );
	assert.ok( nullUndef[ "xnumber2" ] === options[ "xnumber2" ], "Check to make sure undefined values are not copied" );

	nullUndef = jQuery.extend( {}, options, { "xnumber0": null } );
	assert.ok( nullUndef[ "xnumber0" ] === null, "Check to make sure null values are inserted" );

	target = {};
	recursive = { foo:target, bar:5 };
	jQuery.extend( true, target, recursive );
	assert.deepEqual( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

	ret = jQuery.extend( true, { foo: [] }, { foo: [ 0 ] } ); // 1907
	assert.equal( ret.foo.length, 1, "Check to make sure a value with coercion 'false' copies over when necessary to fix trac-1907" );

	ret = jQuery.extend( true, { foo: "1,2,3" }, { foo: [ 1, 2, 3 ] } );
	assert.ok( typeof ret.foo !== "string", "Check to make sure values equal with coercion (but not actually equal) overwrite correctly" );

	ret = jQuery.extend( true, { foo:"bar" }, { foo:null } );
	assert.ok( typeof ret.foo !== "undefined", "Make sure a null value doesn't crash with deep extend, for trac-1908" );

	obj = { foo:null };
	jQuery.extend( true, obj, { foo:"notnull" } );
	assert.equal( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	jQuery.extend( func, { key: "value" } );
	assert.equal( func.key, "value", "Verify a function can be extended" );

	defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" };
	defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" };
	options1 = { xnumber2: 1, xstring2: "x" };
	options1Copy = { xnumber2: 1, xstring2: "x" };
	options2 = { xstring2: "xx", xxx: "newstringx" };
	options2Copy = { xstring2: "xx", xxx: "newstringx" };
	merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	settings = jQuery.extend( {}, defaults, options1, options2 );
	assert.deepEqual( settings, merged2, "Check if extended: settings must be extended" );
	assert.deepEqual( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	assert.deepEqual( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	assert.deepEqual( options2, options2Copy, "Check if not modified: options2 must not be modified" );
} );

QUnit.test( "jQuery.extend(Object, Object {created with \"defineProperties\"})", function( assert ) {
	assert.expect( 2 );

	var definedObj = Object.defineProperties( {}, {
        "enumerableProp": {
          get: function() {
            return true;
          },
          enumerable: true
        },
        "nonenumerableProp": {
          get: function() {
            return true;
          }
        }
      } ),
      accessorObj = {};

	jQuery.extend( accessorObj, definedObj );
	assert.equal( accessorObj.enumerableProp, true, "Verify that getters are transferred" );
	assert.equal( accessorObj.nonenumerableProp, undefined, "Verify that non-enumerable getters are ignored" );
} );

QUnit.test( "jQuery.extend(true,{},{a:[], o:{}}); deep copy with array, followed by object", function( assert ) {
	assert.expect( 2 );

	var result, initial = {

		// This will make "copyIsArray" true
		array: [ 1, 2, 3, 4 ],

		// If "copyIsArray" doesn't get reset to false, the check
		// will evaluate true and enter the array copy block
		// instead of the object copy block. Since the ternary in the
		// "copyIsArray" block will evaluate to false
		// (check if operating on an array with ), this will be
		// replaced by an empty array.
		object: {}
	};

	result = jQuery.extend( true, {}, initial );

	assert.deepEqual( result, initial, "The [result] and [initial] have equal shape and values" );
	assert.ok( !Array.isArray( result.object ), "result.object wasn't paved with an empty array" );
} );

QUnit.test( "jQuery.extend( true, ... ) Object.prototype pollution", function( assert ) {
	assert.expect( 1 );

	jQuery.extend( true, {}, JSON.parse( "{\"__proto__\": {\"devMode\": true}}" ) );
	assert.ok( !( "devMode" in {} ), "Object.prototype not polluted" );
} );

QUnit.test( "jQuery.each(Object,Function)", function( assert ) {
	assert.expect( 23 );

	var i, label, seen, callback;

	seen = {};
	jQuery.each( [ 3, 4, 5 ], function( k, v ) {
		seen[ k ] = v;
	} );
	assert.deepEqual( seen, { "0": 3, "1": 4, "2": 5 }, "Array iteration" );

	seen = {};
	jQuery.each( { name: "name", lang: "lang" }, function( k, v ) {
		seen[ k ] = v;
	} );
	assert.deepEqual( seen, { name: "name", lang: "lang" }, "Object iteration" );

	seen = [];
	jQuery.each( [ 1, 2, 3 ], function( k, v ) {
		seen.push( v );
		if ( k === 1 ) {
			return false;
		}
	} );
	assert.deepEqual( seen, [ 1, 2 ], "Broken array iteration" );

	seen = [];
	jQuery.each( { "a": 1, "b": 2, "c": 3 }, function( k, v ) {
		seen.push( v );
		return false;
	} );
	assert.deepEqual( seen, [ 1 ], "Broken object iteration" );

	seen = {
		Zero: function() {},
		One: function( a ) { a = a; },
		Two: function( a, b ) { a = a; b = b; }
	};
	callback = function( k ) {
		assert.equal( k, "foo", label + "-argument function treated like object" );
	};
	for ( i in seen ) {
		label = i;
		seen[ i ].foo = "bar";
		jQuery.each( seen[ i ], callback );
	}

	seen = {
		"undefined": undefined,
		"null": null,
		"false": false,
		"true": true,
		"empty string": "",
		"nonempty string": "string",
		"string \"0\"": "0",
		"negative": -1,
		"excess": 1
	};
	callback = function( k ) {
		assert.equal( k, "length", "Object with " + label + " length treated like object" );
	};
	for ( i in seen ) {
		label = i;
		jQuery.each( { length: seen[ i ] }, callback );
	}

	seen = {
		"sparse Array": Array( 4 ),
		"length: 1 plain object": { length: 1, "0": true },
		"length: 2 plain object": { length: 2, "0": true, "1": true },
		NodeList: document.getElementsByTagName( "html" )
	};
	callback = function( k ) {
		if ( seen[ label ] ) {
			delete seen[ label ];
			assert.equal( k, "0", label + " treated like array" );
			return false;
		}
	};
	for ( i in seen ) {
		label = i;
		jQuery.each( seen[ i ], callback );
	}

	seen = false;
	jQuery.each( { length: 0 }, function() {
		seen = true;
	} );
	assert.ok( !seen, "length: 0 plain object treated like array" );

	seen = false;
	jQuery.each( document.getElementsByTagName( "asdf" ), function() {
		seen = true;
	} );
	assert.ok( !seen, "empty NodeList treated like array" );

	i = 0;
	jQuery.each( document.styleSheets, function() {
		i++;
	} );
	assert.equal( i, document.styleSheets.length, "Iteration over document.styleSheets" );
} );

QUnit.test( "jQuery.each/map(undefined/null,Function)", function( assert ) {
	assert.expect( 1 );

	try {
		jQuery.each( undefined, jQuery.noop );
		jQuery.each( null, jQuery.noop );
		jQuery.map( undefined, jQuery.noop );
		jQuery.map( null, jQuery.noop );
		assert.ok( true, "jQuery.each/map( undefined/null, function() {} );" );
	} catch ( e ) {
		assert.ok( false, "each/map must accept null and undefined values" );
	}
} );

QUnit.test( "JIT compilation does not interfere with length retrieval (gh-2145)", function( assert ) {
	assert.expect( 4 );

	var i;

	// Trigger JIT compilation of jQuery.each – and therefore isArraylike – in iOS.
	// Convince JSC to use one of its optimizing compilers
	// by providing code which can be LICM'd into nothing.
	for ( i = 0; i < 1000; i++ ) {
		jQuery.each( [] );
	}

	i = 0;
	jQuery.each( { 1: "1", 2: "2", 3: "3" }, function( index ) {
		assert.equal( ++i, index, "Iteration over object with solely " +
			"numeric indices (gh-2145 JIT iOS 8 bug)" );
	} );
	assert.equal( i, 3, "Iteration over object with solely " +
		"numeric indices (gh-2145 JIT iOS 8 bug)" );
} );

QUnit.test( "jQuery.makeArray", function( assert ) {
	assert.expect( 15 );

	assert.equal( jQuery.makeArray( jQuery( "html>*" ) )[ 0 ].nodeName.toUpperCase(), "HEAD", "Pass makeArray a jQuery object" );

	assert.equal( jQuery.makeArray( document.getElementsByName( "PWD" ) ).slice( 0, 1 )[ 0 ].name, "PWD", "Pass makeArray a nodelist" );

	assert.equal( ( function() { return jQuery.makeArray( arguments ); } )( 1, 2 ).join( "" ), "12", "Pass makeArray an arguments array" );

	assert.equal( jQuery.makeArray( [ 1, 2, 3 ] ).join( "" ), "123", "Pass makeArray a real array" );

	assert.equal( jQuery.makeArray().length, 0, "Pass nothing to makeArray and expect an empty array" );

	assert.equal( jQuery.makeArray( 0 )[ 0 ], 0, "Pass makeArray a number" );

	assert.equal( jQuery.makeArray( "foo" )[ 0 ], "foo", "Pass makeArray a string" );

	assert.equal( jQuery.makeArray( true )[ 0 ].constructor, Boolean, "Pass makeArray a boolean" );

	assert.equal( jQuery.makeArray( document.createElement( "div" ) )[ 0 ].nodeName.toUpperCase(), "DIV", "Pass makeArray a single node" );

	assert.equal( jQuery.makeArray( { length:2, 0:"a", 1:"b" } ).join( "" ), "ab", "Pass makeArray an array like map (with length)" );

	assert.ok( !!jQuery.makeArray( document.documentElement.childNodes ).slice( 0, 1 )[ 0 ].nodeName, "Pass makeArray a childNodes array" );

	// function, is tricky as it has length
	assert.equal( jQuery.makeArray( function() { return 1;} )[ 0 ](), 1, "Pass makeArray a function" );

	//window, also has length
	assert.equal( jQuery.makeArray( window )[ 0 ], window, "Pass makeArray the window" );

	assert.equal( jQuery.makeArray( /a/ )[ 0 ].constructor, RegExp, "Pass makeArray a regex" );

	// Some nodes inherit traits of nodelists
	assert.ok( jQuery.makeArray( document.getElementById( "form" ) ).length >= 13,
		"Pass makeArray a form (treat as elements)" );
} );

QUnit.test( "jQuery.inArray", function( assert ) {
	assert.expect( 3 );

	assert.equal( jQuery.inArray( 0, false ), -1, "Search in 'false' as array returns -1 and doesn't throw exception" );

	assert.equal( jQuery.inArray( 0, null ), -1, "Search in 'null' as array returns -1 and doesn't throw exception" );

	assert.equal( jQuery.inArray( 0, undefined ), -1, "Search in 'undefined' as array returns -1 and doesn't throw exception" );
} );

QUnit.test( "jQuery.isEmptyObject", function( assert ) {
	assert.expect( 2 );

	assert.equal( true, jQuery.isEmptyObject( {} ), "isEmptyObject on empty object literal" );
	assert.equal( false, jQuery.isEmptyObject( { a:1 } ), "isEmptyObject on non-empty object literal" );

	// What about this ?
	// equal(true, jQuery.isEmptyObject(null), "isEmptyObject on null" );
} );

QUnit.test( "jQuery.parseHTML", function( assert ) {
	assert.expect( 23 );

	var html, nodes;

	assert.deepEqual( jQuery.parseHTML(), [], "Without arguments" );
	assert.deepEqual( jQuery.parseHTML( undefined ), [], "Undefined" );
	assert.deepEqual( jQuery.parseHTML( null ), [], "Null" );
	assert.deepEqual( jQuery.parseHTML( false ), [], "Boolean false" );
	assert.deepEqual( jQuery.parseHTML( 0 ), [], "Zero" );
	assert.deepEqual( jQuery.parseHTML( true ), [], "Boolean true" );
	assert.deepEqual( jQuery.parseHTML( 42 ), [], "Positive number" );
	assert.deepEqual( jQuery.parseHTML( "" ), [], "Empty string" );
	assert.throws( function() {
		jQuery.parseHTML( "<div></div>", document.getElementById( "form" ) );
	}, "Passing an element as the context raises an exception (context should be a document)" );

	nodes = jQuery.parseHTML( jQuery( "body" )[ 0 ].innerHTML );
	assert.ok( nodes.length > 4, "Parse a large html string" );
	assert.ok( Array.isArray( nodes ), "parseHTML returns an array rather than a nodelist" );

	html = "<script>undefined()</script>";
	assert.equal( jQuery.parseHTML( html ).length, 0, "Ignore scripts by default" );
	assert.equal( jQuery.parseHTML( html, true )[ 0 ].nodeName.toLowerCase(), "script", "Preserve scripts when requested" );

	html += "<div></div>";
	assert.equal( jQuery.parseHTML( html )[ 0 ].nodeName.toLowerCase(), "div", "Preserve non-script nodes" );
	assert.equal( jQuery.parseHTML( html, true )[ 0 ].nodeName.toLowerCase(), "script", "Preserve script position" );

	assert.equal( jQuery.parseHTML( "text" )[ 0 ].nodeType, 3, "Parsing text returns a text node" );
	assert.equal( jQuery.parseHTML( "\t<div></div>" )[ 0 ].nodeValue, "\t", "Preserve leading whitespace" );

	assert.equal( jQuery.parseHTML( " <div></div> " )[ 0 ].nodeType, 3, "Leading spaces are treated as text nodes (trac-11290)" );

	html = jQuery.parseHTML( "<div>test div</div>" );

	assert.equal( html[ 0 ].parentNode.nodeType, 11, "parentNode should be documentFragment" );
	assert.equal( html[ 0 ].innerHTML, "test div", "Content should be preserved" );

	assert.equal( jQuery.parseHTML( "<span><span>" ).length, 1, "Incorrect html-strings should not break anything" );
	assert.equal( jQuery.parseHTML( "<td><td>" )[ 1 ].parentNode.nodeType, 11,
		"parentNode should be documentFragment for wrapMap (variable in manipulation module) elements too" );
	assert.ok( jQuery.parseHTML( "<#if><tr><p>This is a test.</p></tr><#/if>" ) || true, "Garbage input should not cause error" );
} );

QUnit.test( "jQuery.parseHTML(<a href>) - gh-2965", function( assert ) {
	assert.expect( 1 );

	var html = "<a href='example.html'></a>",
		href = jQuery.parseHTML( html )[ 0 ].href;

	assert.ok( /\/example\.html$/.test( href ), "href is not lost after parsing anchor" );
} );

QUnit.test( "jQuery.parseHTML", function( assert ) {
	var done = assert.async();
	assert.expect( 1 );

	Globals.register( "parseHTMLError" );

	jQuery.globalEval( "parseHTMLError = false;" );
	jQuery.parseHTML( "<img src=x onerror='parseHTMLError = true'>" );

	window.setTimeout( function() {
		assert.equal( window.parseHTMLError, false, "onerror eventhandler has not been called." );
		done();
	}, 2000 );
} );

QUnit.test( "jQuery.parseXML", function( assert ) {
	assert.expect( 8 );

	var xml, tmp;
	try {
		xml = jQuery.parseXML( "<p>A <b>well-formed</b> xml string</p>" );
		tmp = xml.getElementsByTagName( "p" )[ 0 ];
		assert.ok( !!tmp, "<p> present in document" );
		tmp = tmp.getElementsByTagName( "b" )[ 0 ];
		assert.ok( !!tmp, "<b> present in document" );
		assert.strictEqual( tmp.childNodes[ 0 ].nodeValue, "well-formed", "<b> text is as expected" );
	} catch ( e ) {
		assert.strictEqual( e, undefined, "unexpected error" );
	}
	try {
		xml = jQuery.parseXML( "<p>Not a <<b>well-formed</b> xml string</p>" );
		assert.ok( false, "invalid XML not detected" );
	} catch ( e ) {
		assert.ok( e.message.indexOf( "Invalid XML:" ) === 0, "invalid XML detected" );
	}
	try {
		xml = jQuery.parseXML( "" );
		assert.strictEqual( xml, null, "empty string => null document" );
		xml = jQuery.parseXML();
		assert.strictEqual( xml, null, "undefined string => null document" );
		xml = jQuery.parseXML( null );
		assert.strictEqual( xml, null, "null string => null document" );
		xml = jQuery.parseXML( true );
		assert.strictEqual( xml, null, "non-string => null document" );
	} catch ( e ) {
		assert.ok( false, "empty input throws exception" );
	}
} );

// Support: IE 11+
// IE throws an error when parsing invalid XML instead of reporting the error
// in a `parsererror` element, skip the test there.
QUnit.testUnlessIE( "jQuery.parseXML - error reporting", function( assert ) {
	assert.expect( 2 );

	var errorArg, lineMatch, line, columnMatch, column;

	sinon.stub( jQuery, "error" );

	jQuery.parseXML( "<p>Not a <<b>well-formed</b> xml string</p>" );
	errorArg = jQuery.error.firstCall.lastArg.toLowerCase();
	console.log( "errorArg", errorArg );

	lineMatch = errorArg.match( /line\s*(?:number)?\s*(\d+)/ );
	line = lineMatch && lineMatch[ 1 ];
	columnMatch = errorArg.match( /column\s*(\d+)/ );
	column = columnMatch && columnMatch[ 1 ];

	assert.strictEqual( line, "1", "reports error line" );

	// Support: Firefox 96-97+
	// Newer Firefox may report the column number smaller by 2 than it should.
	// Accept both values until the issue is fixed.
	// See https://bugzilla.mozilla.org/show_bug.cgi?id=1751796
	assert.ok( [ "9", "11" ].indexOf( column ) > -1, "reports error column" );
	// assert.strictEqual( column, "11", "reports error column" );
} );

testIframe(
	"document ready when jQuery loaded asynchronously (trac-13655)",
	"core/dynamic_ready.html",
	function( assert, jQuery, window, document, ready ) {
		assert.expect( 1 );
		assert.equal( true, ready, "document ready correctly fired when jQuery is loaded after DOMContentLoaded" );
	}
);

testIframe(
	"Tolerating alias-masked DOM properties (trac-14074)",
	"core/aliased.html",
	function( assert, jQuery, window, document, errors ) {
		assert.expect( 1 );
		assert.deepEqual( errors, [], "jQuery loaded" );
	}
);

testIframe(
	"Don't call window.onready (trac-14802)",
	"core/onready.html",
	function( assert, jQuery, window, document, error ) {
		assert.expect( 1 );
		assert.equal( error, false, "no call to user-defined onready" );
	}
);

QUnit.test( "Iterability of jQuery objects (gh-1693)", function( assert ) {
	assert.expect( 1 );

	var i, elem, result;

	if ( typeof Symbol === "function" ) {

		elem = jQuery( "<div></div><span></span><a></a>" );
		result = "";

		try {
			eval( "for ( i of elem ) { result += i.nodeName; }" );
		} catch ( e ) {}
		assert.equal( result, "DIVSPANA", "for-of works on jQuery objects" );
	} else {
		assert.ok( true, "The browser doesn't support Symbols" );
	}
} );

testIframe(
	"Iterability of jQuery objects with Symbol polyfill (gh-1693)",
	"core/jquery-iterability-transpiled.html",
	function( assert, jQuery, window, document, testString ) {
		assert.expect( 1 );

		assert.strictEqual( testString, "DIVSPANA",
			"for-of works on jQuery objects with Symbol polyfilled" );
	}
);

QUnit[ includesModule( "deferred" ) ? "test" : "skip" ]( "jQuery.readyException (original)", function( assert ) {
	assert.expect( 1 );

	var message;

	this.sandbox.stub( window, "setTimeout" ).callsFake( function( fn ) {
		try {
			fn();
		} catch ( error ) {
			message = error.message;
		}
	} );

	jQuery( function() {
		throw new Error( "Error in jQuery ready" );
	} );
	assert.strictEqual(
		message,
		"Error in jQuery ready",
		"The error should have been thrown in a timeout"
	);
} );

QUnit[ includesModule( "deferred" ) ? "test" : "skip" ]( "jQuery.readyException (custom)", function( assert ) {
	assert.expect( 1 );

	var done = assert.async();

	this.sandbox.stub( jQuery, "readyException" ).callsFake( function( error ) {
		assert.strictEqual(
			error.message,
			"Error in jQuery ready",
			"The custom jQuery.readyException should have been called"
		);
		done();
	} );

	jQuery( function() {
		throw new Error( "Error in jQuery ready" );
	} );
} );
