QUnit.module( "basic", { teardown: moduleTeardown } );

if ( jQuery.ajax ) {
QUnit.test( "ajax", function( assert ) {
	assert.expect( 4 );

	var done = jQuery.map( new Array( 3 ), function() { return assert.async(); } );

	jQuery.ajax( {
		type: "GET",
		url: url( "data/name.php?name=foo" ),
		success: function( msg ) {
			assert.strictEqual( msg, "bar", "Check for GET" );
			done.pop()();
		}
	} );

	jQuery.ajax( {
		type: "POST",
		url: url( "data/name.php" ),
		data: "name=peter",
		success: function( msg ) {
			assert.strictEqual( msg, "pan", "Check for POST" );
			done.pop()();
		}
	} );

	jQuery( "#first" ).load( url( "data/name.html" ), function() {
		assert.ok( /^ERROR/.test( jQuery( "#first" ).text() ),
			"Check if content was injected into the DOM" );
		done.pop()();
	} );
} );
}

QUnit.test( "attributes", function( assert ) {
	assert.expect( 6 );

	var a = jQuery( "<a/>" ).appendTo( "#qunit-fixture" ),
		input = jQuery( "<input/>" ).appendTo( "#qunit-fixture" );

	assert.strictEqual( a.attr( "foo", "bar" ).attr( "foo" ), "bar", ".attr getter/setter" );
	assert.strictEqual( a.removeAttr( "foo" ).attr( "foo" ), undefined, ".removeAttr" );
	assert.strictEqual( a.prop( "href", "#5" ).prop( "href" ),
		location.href.replace( /\#.*$/, "" ) + "#5",
		".prop getter/setter" );

	a.addClass( "abc def ghj" ).removeClass( "def ghj" );
	assert.strictEqual( a.hasClass( "abc" ), true, ".(add|remove|has)Class, class present" );
	assert.strictEqual( a.hasClass( "def" ), false, ".(add|remove|has)Class, class missing" );

	assert.strictEqual( input.val( "xyz" ).val(), "xyz", ".val getter/setter" );
} );

if ( jQuery.css ) {
QUnit.test( "css", function( assert ) {
	assert.expect( 3 );

	var div = jQuery( "<div/>" ).appendTo( "#qunit-fixture" );

	assert.strictEqual( div.css( "width", "50px" ).css( "width" ), "50px", ".css getter/setter" );

	div.hide();
	assert.strictEqual( div.css( "display" ), "none", "div hidden" );
	div.show();
	assert.strictEqual( div.css( "display" ), "block", "div shown" );
} );
}

QUnit.test( "core", function( assert ) {
	assert.expect( 28 );

	var elem = jQuery( "<div></div><span></span>" );

	assert.strictEqual( elem.length, 2, "Correct number of elements" );
	assert.strictEqual( jQuery.trim( "  hello   " ), "hello", "jQuery.trim" );

	assert.strictEqual( jQuery.type( null ), "null", "jQuery.type(null)" );
	assert.strictEqual( jQuery.type( undefined ), "undefined", "jQuery.type(undefined)" );
	assert.strictEqual( jQuery.type( "a" ), "string", "jQuery.type(String)" );

	assert.ok( jQuery.isPlainObject( { "a": 2 } ), "jQuery.isPlainObject(object)" );
	assert.ok( !jQuery.isPlainObject( "foo" ), "jQuery.isPlainObject(String)" );

	assert.ok( jQuery.isFunction( jQuery.noop ), "jQuery.isFunction(jQuery.noop)" );
	assert.ok( !jQuery.isFunction( 2 ), "jQuery.isFunction(Number)" );

	assert.ok( jQuery.isNumeric( "-2" ), "jQuery.isNumeric(String representing a number)" );
	assert.ok( !jQuery.isNumeric( "" ), "jQuery.isNumeric(\"\")" );

	assert.ok( jQuery.isXMLDoc( jQuery.parseXML(
		"<?xml version='1.0' encoding='UTF-8'?><foo bar='baz'></foo>"
	) ), "jQuery.isXMLDoc" );

	assert.ok( jQuery.isWindow( window ), "jQuery.isWindow(window)" );
	assert.ok( !jQuery.isWindow( 2 ), "jQuery.isWindow(Number)" );

	assert.strictEqual( jQuery.inArray( 3, [ "a", 6, false, 3, {} ] ), 3, "jQuery.inArray - true" );
	assert.strictEqual(
		jQuery.inArray( 3, [ "a", 6, false, "3", {} ] ),
		-1,
		"jQuery.inArray - false"
	);

	assert.strictEqual( elem.get( 1 ), elem[ 1 ], ".get" );
	assert.strictEqual( elem.first()[ 0 ], elem[ 0 ], ".first" );
	assert.strictEqual( elem.last()[ 0 ], elem[ 1 ], ".last" );

	assert.deepEqual( jQuery.map( [ "a", "b", "c" ], function( v, k ) {
		return k + v;
	} ), [ "0a", "1b", "2c" ], "jQuery.map" );

	assert.deepEqual( jQuery.merge( [ 1, 2 ], [ "a", "b" ] ), [ 1, 2, "a", "b" ], "jQuery.merge" );

	assert.deepEqual( jQuery.grep( [ 1, 2, 3 ], function( value ) {
		return value % 2 !== 0;
	} ), [ 1, 3 ], "jQuery.grep" );

	assert.deepEqual( jQuery.extend( { a: 2 }, { b: 3 } ), { a: 2, b: 3 }, "jQuery.extend" );

	jQuery.each( [ 0, 2 ], function( k, v ) {
		assert.strictEqual( k * 2, v, "jQuery.each" );
	} );

	assert.deepEqual( jQuery.makeArray( { 0: "a", 1: "b", 2: "c", length: 3 } ),
		[ "a", "b", "c" ], "jQuery.makeArray" );

	assert.strictEqual( jQuery.parseHTML( "<div></div><span></span>" ).length,
		2, "jQuery.parseHTML" );

	assert.deepEqual( jQuery.parseJSON( "{\"a\": 2}" ), { a: 2 }, "jQuery.parseJON" );
} );

QUnit.test( "data", function( assert ) {
	assert.expect( 4 );

	var elem = jQuery( "<div data-c='d'/>" ).appendTo( "#qunit-fixture" );

	assert.ok( !jQuery.hasData( elem[ 0 ] ), "jQuery.hasData - false" );
	assert.strictEqual( elem.data( "a", "b" ).data( "a" ), "b", ".data getter/setter" );
	assert.strictEqual( elem.data( "c" ), "d", ".data from data-* attributes" );
	assert.ok( jQuery.hasData( elem[ 0 ] ), "jQuery.hasData - true" );
} );

QUnit.test( "dimensions", function( assert ) {
	assert.expect( 3 );

	var elem = jQuery(
		"<div style='margin: 10px; padding: 7px; border: 2px solid black;' /> "
	).appendTo( "#qunit-fixture" );

	assert.strictEqual( elem.width( 50 ).width(), 50, ".width getter/setter" );
	assert.strictEqual( elem.innerWidth(), 64, ".innerWidth getter" );
	assert.strictEqual( elem.outerWidth(), 68, ".outerWidth getter" );
} );

QUnit.test( "event", function( assert ) {
	assert.expect( 1 );

	var elem = jQuery( "<div/>" ).appendTo( "#qunit-fixture" );

	elem
		.on( "click", function() {
			assert.ok( false, "click should not fire" );
		} )
		.off( "click" )
		.trigger( "click" )
		.on( "click", function() {
			assert.ok( true, "click should fire" );
		} )
		.trigger( "click" );
} );

QUnit.test( "manipulation", function( assert ) {
	assert.expect( 5 );

	var child,
		elem1 = jQuery( "<div><span></span></div>" ).appendTo( "#qunit-fixture" ),
		elem2 = jQuery( "<div/>" ).appendTo( "#qunit-fixture" );

	assert.strictEqual( elem1.text( "foo" ).text(), "foo", ".html getter/setter" );

	assert.strictEqual(

		// Support: IE 8 only
		// IE 8 prints tag names in upper case.
		elem1.html( "<span/>" ).html().toLowerCase(),
		"<span></span>",
		".html getter/setter"
	);

	assert.strictEqual( elem1.append( elem2 )[ 0 ].childNodes[ 1 ], elem2[ 0 ], ".append" );
	assert.strictEqual( elem1.prepend( elem2 )[ 0 ].childNodes[ 0 ], elem2[ 0 ], ".prepend" );

	child = elem1.find( "span" );
	child.after( "<a/>" );
	child.before( "<b/>" );

	assert.strictEqual(

		// Support: IE 8 only
		// IE 8 prints tag names in upper case.
		elem1.html().toLowerCase(),
		"<div></div><b></b><span></span><a></a>",
		".after/.before"
	);
} );

QUnit.test( "offset", function( assert ) {
	assert.expect( 3 );

	var parent =
		jQuery( "<div style='position:fixed;_position:absolute;top:20px;'/>" )
			.appendTo( "body" ),
		elem = jQuery( "<div style='position:absolute;top:5px;'/>" ).appendTo( parent );

	assert.strictEqual( elem.offset().top, 25, ".offset getter" );
	assert.strictEqual( elem.position().top, 5, ".position getter" );
	assert.strictEqual( elem.offsetParent()[ 0 ], parent[ 0 ], ".offsetParent" );
} );

QUnit.test( "selector", function( assert ) {
	assert.expect( 2 );

	var elem = jQuery( "<div><span class='a'></span><span class='b'><a></a></span></div>" )
		.appendTo( "#qunit-fixture" );

	assert.strictEqual( elem.find( ".a a" ).length, 0, ".find - no result" );
	assert.strictEqual( elem.find( "span.b a" )[ 0 ].nodeName, "A", ".find - one result" );
} );

QUnit.test( "serialize", function( assert ) {
	assert.expect( 2 );

	var params = { "someName": [ 1, 2, 3 ], "regularThing": "blah" };
	assert.strictEqual( jQuery.param( params ),
		"someName%5B%5D=1&someName%5B%5D=2&someName%5B%5D=3&regularThing=blah",
		"jQuery.param" );

	assert.strictEqual( jQuery( "#form" ).serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search" +
		"&select1=&select2=3&select3=1&select3=2&select5=3",
		"form serialization as query string" );
} );

QUnit.test( "traversing", function( assert ) {
	assert.expect( 12 );

	var elem = jQuery( "<div><a><b><em></em></b></a><i></i><span></span>foo</div>" )
		.appendTo( "#qunit-fixture" );

	assert.strictEqual( elem.find( "em" ).parent()[ 0 ].nodeName, "B", ".parent" );
	assert.strictEqual( elem.find( "em" ).parents()[ 1 ].nodeName, "A", ".parents" );
	assert.strictEqual( elem.find( "em" ).parentsUntil( "div" ).length, 2, ".parentsUntil" );
	assert.strictEqual( elem.find( "i" ).next()[ 0 ].nodeName, "SPAN", ".next" );
	assert.strictEqual( elem.find( "i" ).prev()[ 0 ].nodeName, "A", ".prev" );
	assert.strictEqual( elem.find( "a" ).nextAll()[ 1 ].nodeName, "SPAN", ".nextAll" );
	assert.strictEqual( elem.find( "span" ).prevAll()[ 1 ].nodeName, "A", ".prevAll" );
	assert.strictEqual( elem.find( "a" ).nextUntil( "span" ).length, 1, ".nextUntil" );
	assert.strictEqual( elem.find( "span" ).prevUntil( "a" ).length, 1, ".prevUntil" );
	assert.strictEqual( elem.find( "i" ).siblings().length, 2, ".siblings" );
	assert.strictEqual( elem.children()[ 2 ].nodeName, "SPAN", ".children" );
	assert.strictEqual( elem.contents()[ 3 ].nodeType, 3, ".contents" );
} );

QUnit.test( "wrap", function( assert ) {
	assert.expect( 3 );

	var elem = jQuery( "<div><a><b></b></a><a></a></div>" );

	elem.find( "b" ).wrap( "<span>" );

	assert.strictEqual(

		// Support: IE 8 only
		// IE 8 prints tag names in upper case.
		elem.html().toLowerCase(),
		"<a><span><b></b></span></a><a></a>",
		".wrap"
	);

	elem.find( "span" ).wrapInner( "<em>" );

	assert.strictEqual(

		// Support: IE 8 only
		// IE 8 prints tag names in upper case.
		elem.html().toLowerCase(),
		"<a><span><em><b></b></em></span></a><a></a>",
		".wrapInner"
	);

	elem.find( "a" ).wrapAll( "<i>" );

	assert.strictEqual(

		// Support: IE 8 only
		// IE 8 prints tag names in upper case.
		elem.html().toLowerCase(),
		"<i><a><span><em><b></b></em></span></a><a></a></i>",
		".wrapAll"
	);

} );
