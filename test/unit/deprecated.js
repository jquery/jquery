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
