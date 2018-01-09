QUnit.module( "deprecated", { teardown: moduleTeardown } );


QUnit.test( "bind/unbind", function( assert ) {
	assert.expect( 4 );

	var markup = jQuery(
		"<div><p><span><b>b</b></span></p></div>"
	);

	markup
		.find( "b" )
		.bind( "click", { bindData: 19 }, function( e, trig ) {
			assert.equal( e.type, "click", "correct event type" );
			assert.equal( e.data.bindData, 19, "correct trigger data" );
			assert.equal( trig, 42, "correct bind data" );
			assert.equal( e.target.nodeName.toLowerCase(), "b", "correct element" );
		} )
		.trigger( "click", [ 42 ] )
		.unbind( "click" )
		.trigger( "click" )
		.remove();
} );

QUnit.test( "delegate/undelegate", function( assert ) {
	assert.expect( 2 );

	var markup = jQuery(
		"<div><p><span><b>b</b></span></p></div>"
	);

	markup
		.delegate( "b", "click", function( e ) {
			assert.equal( e.type, "click", "correct event type" );
			assert.equal( e.target.nodeName.toLowerCase(), "b", "correct element" );
		} )
		.find( "b" )
			.trigger( "click" )
			.end()
		.undelegate( "b", "click" )
		.remove();
} );

if ( jQuery.fn.hover ) {
	QUnit.test( "hover() mouseenter mouseleave", function( assert ) {
		assert.expect( 1 );

		var times = 0,
			handler1 = function() { ++times; },
			handler2 = function() { ++times; };

		jQuery( "#firstp" )
			.hover( handler1, handler2 )
			.mouseenter().mouseleave()
			.off( "mouseenter", handler1 )
			.off( "mouseleave", handler2 )
			.hover( handler1 )
			.mouseenter().mouseleave()
			.off( "mouseenter mouseleave", handler1 )
			.mouseenter().mouseleave();

		assert.equal( times, 4, "hover handlers fired" );

	} );
}


QUnit[ jQuery.fn.click ? "test" : "skip" ]( "trigger() shortcuts", function( assert ) {
	assert.expect( 5 );

	var counter, clickCounter,
		elem = jQuery( "<li><a href='#'>Change location</a></li>" ).prependTo( "#firstUL" );
	elem.find( "a" ).on( "click", function() {
		var close = jQuery( "spanx", this ); // same with jQuery(this).find("span");
		assert.equal( close.length, 0, "Context element does not exist, length must be zero" );
		assert.ok( !close[ 0 ], "Context element does not exist, direct access to element must return undefined" );
		return false;
	} ).click();

	// manually clean up detached elements
	elem.remove();

	jQuery( "#check1" ).click( function() {
		assert.ok( true, "click event handler for checkbox gets fired twice, see #815" );
	} ).click();

	counter = 0;
	jQuery( "#firstp" )[ 0 ].onclick = function() {
		counter++;
	};
	jQuery( "#firstp" ).click();
	assert.equal( counter, 1, "Check that click, triggers onclick event handler also" );

	clickCounter = 0;
	jQuery( "#simon1" )[ 0 ].onclick = function() {
		clickCounter++;
	};
	jQuery( "#simon1" ).click();
	assert.equal( clickCounter, 1, "Check that click, triggers onclick event handler on an a tag also" );
} );

QUnit[ jQuery.fn.click ? "test" : "skip" ]( "Event aliases", function( assert ) {

	// Explicitly skipping focus/blur events due to their flakiness
	var	$elem = jQuery( "<div />" ).appendTo( "#qunit-fixture" ),
		aliases = ( "resize scroll click dblclick mousedown mouseup " +
			"mousemove mouseover mouseout mouseenter mouseleave change " +
			"select submit keydown keypress keyup contextmenu" ).split( " " );
	assert.expect( aliases.length );

	jQuery.each( aliases, function( i, name ) {

		// e.g. $(elem).click(...).click();
		$elem[ name ]( function( event ) {
			assert.equal( event.type, name, "triggered " + name );
		} )[ name ]().off( name );
	} );
} );

QUnit.test( "jQuery.parseJSON", function( assert ) {
	assert.expect( 20 );

	assert.strictEqual( jQuery.parseJSON( null ), null, "primitive null" );
	assert.strictEqual( jQuery.parseJSON( "0.88" ), 0.88, "Number" );
	assert.strictEqual(
		jQuery.parseJSON( "\" \\\" \\\\ \\/ \\b \\f \\n \\r \\t \\u007E \\u263a \"" ),
		" \" \\ / \b \f \n \r \t ~ \u263A ",
		"String escapes"
	);
	assert.deepEqual( jQuery.parseJSON( "{}" ), {}, "Empty object" );
	assert.deepEqual( jQuery.parseJSON( "{\"test\":1}" ), { "test": 1 }, "Plain object" );
	assert.deepEqual( jQuery.parseJSON( "[0]" ), [ 0 ], "Simple array" );

	assert.deepEqual(
		jQuery.parseJSON( "[ \"string\", -4.2, 2.7180e0, 3.14E-1, {}, [], true, false, null ]" ),
		[ "string", -4.2, 2.718, 0.314, {}, [], true, false, null ],
		"Array of all data types"
	);
	assert.deepEqual(
		jQuery.parseJSON( "{ \"string\": \"\", \"number\": 4.2e+1, \"object\": {}," +
			"\"array\": [[]], \"boolean\": [ true, false ], \"null\": null }" ),
		{ string: "", number: 42, object: {}, array: [ [] ], "boolean": [ true, false ], "null": null },
		"Dictionary of all data types"
	);

	assert.deepEqual( jQuery.parseJSON( "\n{\"test\":1}\t" ), { "test": 1 },
		"Leading and trailing whitespace are ignored" );

	assert.throws( function() {
		jQuery.parseJSON();
	}, null, "Undefined raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "" );
	}, null, "Empty string raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "''" );
	}, null, "Single-quoted string raises an error" );

	assert.throws( function() {
		var result = jQuery.parseJSON( "0101" );

		// Support: IE <=9 only
		// Ensure base-10 interpretation on browsers that erroneously accept leading-zero numbers
		if ( result === 101 ) {
			throw new Error( "close enough" );
		}
	}, null, "Leading-zero number raises an error or is parsed as decimal" );
	assert.throws( function() {
		jQuery.parseJSON( "{a:1}" );
	}, null, "Unquoted property raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "{'a':1}" );
	}, null, "Single-quoted property raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "[,]" );
	}, null, "Array element elision raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "{},[]" );
	}, null, "Comma expression raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "[]\n,{}" );
	}, null, "Newline-containing comma expression raises an error" );
	assert.throws( function() {
		jQuery.parseJSON( "\"\"\n\"\"" );
	}, null, "Automatic semicolon insertion raises an error" );

	assert.strictEqual( jQuery.parseJSON( [ 0 ] ), 0, "Input cast to string" );
} );

QUnit.test( "jQuery.isArray", function( assert ) {
	assert.expect( 1 );

	assert.strictEqual( jQuery.isArray, Array.isArray, "Array.isArray equals jQuery.isArray" );
} );

QUnit.test( "jQuery.nodeName", function( assert ) {
	assert.expect( 8 );

	assert.strictEqual( typeof jQuery.nodeName, "function", "jQuery.nodeName is a function" );

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "div" ), "div" ),
		true,
		"Basic usage (true)"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "div" ), "span" ),
		false,
		"Basic usage (false)"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "div" ), "DIV" ),
		true,
		"Ignores case in the name parameter"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "section" ), "section" ),
		true,
		"Works on HTML5 tags (true)"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "section" ), "article" ),
		false,
		"Works on HTML5 tags (false)"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "custom-element" ), "custom-element" ),
		true,
		"Works on custom elements (true)"
	);

	assert.strictEqual(
		jQuery.nodeName( document.createElement( "custom-element" ), "my-element" ),
		false,
		"Works on custom elements (true)"
	);
} );

QUnit.test( "jQuery.isWindow", function( assert ) {
	assert.expect( 14 );

	assert.ok( jQuery.isWindow( window ), "window" );
	assert.ok( jQuery.isWindow( document.getElementsByTagName( "iframe" )[ 0 ].contentWindow ), "iframe.contentWindow" );
	assert.ok( !jQuery.isWindow(), "empty" );
	assert.ok( !jQuery.isWindow( null ), "null" );
	assert.ok( !jQuery.isWindow( undefined ), "undefined" );
	assert.ok( !jQuery.isWindow( document ), "document" );
	assert.ok( !jQuery.isWindow( document.documentElement ), "documentElement" );
	assert.ok( !jQuery.isWindow( "" ), "string" );
	assert.ok( !jQuery.isWindow( 1 ), "number" );
	assert.ok( !jQuery.isWindow( true ), "boolean" );
	assert.ok( !jQuery.isWindow( {} ), "object" );
	assert.ok( !jQuery.isWindow( { setInterval: function() {} } ), "fake window" );
	assert.ok( !jQuery.isWindow( /window/ ), "regexp" );
	assert.ok( !jQuery.isWindow( function() {} ), "function" );
} );

QUnit.test( "jQuery.camelCase()", function( assert ) {

	var tests = {
		"foo-bar": "fooBar",
		"foo-bar-baz": "fooBarBaz",
		"girl-u-want": "girlUWant",
		"the-4th-dimension": "the-4thDimension",
		"-o-tannenbaum": "OTannenbaum",
		"-moz-illa": "MozIlla",
		"-ms-take": "msTake"
	};

	assert.expect( 7 );

	jQuery.each( tests, function( key, val ) {
		assert.equal( jQuery.camelCase( key ), val, "Converts: " + key + " => " + val );
	} );
} );

QUnit.test( "jQuery.now", function( assert ) {
	assert.expect( 1 );

	assert.ok( typeof jQuery.now() === "number", "jQuery.now is a function" );
} );

QUnit.test( "jQuery.proxy", function( assert ) {
	assert.expect( 9 );

	var test2, test3, test4, fn, cb,
		test = function() {
			assert.equal( this, thisObject, "Make sure that scope is set properly." );
		},
		thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	jQuery.proxy( test, thisObject )();

	// Another take on it
	jQuery.proxy( thisObject, "method" )();

	// Make sure it doesn't freak out
	assert.equal( jQuery.proxy( null, thisObject ), undefined, "Make sure no function was returned." );

	// Partial application
	test2 = function( a ) {
		assert.equal( a, "pre-applied", "Ensure arguments can be pre-applied." );
	};
	jQuery.proxy( test2, null, "pre-applied" )();

	// Partial application w/ normal arguments
	test3 = function( a, b ) {
		assert.equal( b, "normal", "Ensure arguments can be pre-applied and passed as usual." );
	};
	jQuery.proxy( test3, null, "pre-applied" )( "normal" );

	// Test old syntax
	test4 = { "meth": function( a ) {
			assert.equal( a, "boom", "Ensure old syntax works." );
		} };
	jQuery.proxy( test4, "meth" )( "boom" );

	// jQuery 1.9 improved currying with `this` object
	fn = function() {
		assert.equal( Array.prototype.join.call( arguments, "," ), "arg1,arg2,arg3", "args passed" );
		assert.equal( this.foo, "bar", "this-object passed" );
	};
	cb = jQuery.proxy( fn, null, "arg1", "arg2" );
	cb.call( thisObject, "arg3" );
} );
