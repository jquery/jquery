QUnit.module( "serialize", { afterEach: moduleTeardown } );

QUnit.test( "jQuery.param()", function( assert ) {
	assert.expect( 24 );

	var params;

	params = { "foo": "bar", "baz": 42, "quux": "All your base are belong to us" };
	assert.equal( jQuery.param( params ), "foo=bar&baz=42&quux=All%20your%20base%20are%20belong%20to%20us", "simple" );

	params = { "string": "foo", "null": null, "undefined": undefined };
	assert.equal( jQuery.param( params ), "string=foo&null=&undefined=", "handle nulls and undefineds properly" );

	params = { "someName": [ 1, 2, 3 ], "regularThing": "blah" };
	assert.equal( jQuery.param( params ), "someName%5B%5D=1&someName%5B%5D=2&someName%5B%5D=3&regularThing=blah", "with array" );

	params = { "foo": [ "a", "b", "c" ] };
	assert.equal( jQuery.param( params ), "foo%5B%5D=a&foo%5B%5D=b&foo%5B%5D=c", "with array of strings" );

	params = { "foo": [ "baz", 42, "All your base are belong to us" ] };
	assert.equal( jQuery.param( params ), "foo%5B%5D=baz&foo%5B%5D=42&foo%5B%5D=All%20your%20base%20are%20belong%20to%20us", "more array" );

	params = { "foo": { "bar": "baz", "beep": 42, "quux": "All your base are belong to us" } };
	assert.equal( jQuery.param( params ), "foo%5Bbar%5D=baz&foo%5Bbeep%5D=42&foo%5Bquux%5D=All%20your%20base%20are%20belong%20to%20us", "even more arrays" );

	params = { a: [ 1, 2 ], b: { c: 3, d: [ 4, 5 ], e: { x: [ 6 ], y: 7, z: [ 8, 9 ] }, f: true, g: false, h: undefined }, i: [ 10, 11 ], j: true, k: false, l: [ undefined, 0 ], m: "cowboy hat?" };
	assert.equal( decodeURIComponent( jQuery.param( params ) ), "a[]=1&a[]=2&b[c]=3&b[d][]=4&b[d][]=5&b[e][x][]=6&b[e][y]=7&b[e][z][]=8&b[e][z][]=9&b[f]=true&b[g]=false&b[h]=&i[]=10&i[]=11&j=true&k=false&l[]=&l[]=0&m=cowboy hat?", "huge structure" );

	params = { "a": [ 0, [ 1, 2 ], [ 3, [ 4, 5 ], [ 6 ] ], { "b": [ 7, [ 8, 9 ], [ { "c": 10, "d": 11 } ], [ [ 12 ] ], [ [ [ 13 ] ] ], { "e": { "f": { "g": [ 14, [ 15 ] ] } } }, 16 ] }, 17 ] };
	assert.equal( decodeURIComponent( jQuery.param( params ) ), "a[]=0&a[1][]=1&a[1][]=2&a[2][]=3&a[2][1][]=4&a[2][1][]=5&a[2][2][]=6&a[3][b][]=7&a[3][b][1][]=8&a[3][b][1][]=9&a[3][b][2][0][c]=10&a[3][b][2][0][d]=11&a[3][b][3][0][]=12&a[3][b][4][0][0][]=13&a[3][b][5][e][f][g][]=14&a[3][b][5][e][f][g][1][]=15&a[3][b][]=16&a[]=17", "nested arrays" );

	params = { "a": [ 1, 2 ], "b": { "c": 3, "d": [ 4, 5 ], "e": { "x": [ 6 ], "y": 7, "z": [ 8, 9 ] }, "f": true, "g": false, "h": undefined }, "i": [ 10, 11 ], "j": true, "k": false, "l": [ undefined, 0 ], "m": "cowboy hat?" };
	assert.equal( jQuery.param( params, true ), "a=1&a=2&b=%5Bobject%20Object%5D&i=10&i=11&j=true&k=false&l=&l=0&m=cowboy%20hat%3F", "huge structure, forced traditional" );

	assert.equal( decodeURIComponent( jQuery.param( { "a": [ 1, 2, 3 ], "b[]": [ 4, 5, 6 ], "c[d]": [ 7, 8, 9 ], "e": { "f": [ 10 ], "g": [ 11, 12 ], "h": 13 } } ) ), "a[]=1&a[]=2&a[]=3&b[]=4&b[]=5&b[]=6&c[d][]=7&c[d][]=8&c[d][]=9&e[f][]=10&e[g][]=11&e[g][]=12&e[h]=13", "Make sure params are not double-encoded." );

	// trac-7945
	assert.equal( jQuery.param( { "jquery": "1.4.2" } ), "jquery=1.4.2", "Check that object with a jQuery property get serialized correctly" );

	params = { "foo": "bar", "baz": 42, "quux": "All your base are belong to us" };
	assert.equal( jQuery.param( params, true ), "foo=bar&baz=42&quux=All%20your%20base%20are%20belong%20to%20us", "simple" );

	params = { "someName": [ 1, 2, 3 ], "regularThing": "blah" };
	assert.equal( jQuery.param( params, true ), "someName=1&someName=2&someName=3&regularThing=blah", "with array" );

	params = { "foo": [ "a", "b", "c" ] };
	assert.equal( jQuery.param( params, true ), "foo=a&foo=b&foo=c", "with array of strings" );

	params = { "foo[]": [ "baz", 42, "All your base are belong to us" ] };
	assert.equal( jQuery.param( params, true ), "foo%5B%5D=baz&foo%5B%5D=42&foo%5B%5D=All%20your%20base%20are%20belong%20to%20us", "more array" );

	params = { "foo[bar]": "baz", "foo[beep]": 42, "foo[quux]": "All your base are belong to us" };
	assert.equal( jQuery.param( params, true ), "foo%5Bbar%5D=baz&foo%5Bbeep%5D=42&foo%5Bquux%5D=All%20your%20base%20are%20belong%20to%20us", "even more arrays" );

	params = { a: [ 1, 2 ], b: { c: 3, d: [ 4, 5 ], e: { x: [ 6 ], y: 7, z: [ 8, 9 ] }, f: true, g: false, h: undefined }, i: [ 10, 11 ], j: true, k: false, l: [ undefined, 0 ], m: "cowboy hat?" };
	assert.equal( jQuery.param( params, true ), "a=1&a=2&b=%5Bobject%20Object%5D&i=10&i=11&j=true&k=false&l=&l=0&m=cowboy%20hat%3F", "huge structure" );

	params = { "a": [ 0, [ 1, 2 ], [ 3, [ 4, 5 ], [ 6 ] ], { "b": [ 7, [ 8, 9 ], [ { "c": 10, d: 11 } ], [ [ 12 ] ], [ [ [ 13 ] ] ], { "e": { "f": { "g": [ 14, [ 15 ] ] } } }, 16 ] }, 17 ] };
	assert.equal( jQuery.param( params, true ), "a=0&a=1%2C2&a=3%2C4%2C5%2C6&a=%5Bobject%20Object%5D&a=17", "nested arrays (not possible when traditional == true)" );

	params = { a: [ 1, 2 ], b: { c: 3, d: [ 4, 5 ], e: { x: [ 6 ], y: 7, z: [ 8, 9 ] }, f: true, g: false, h: undefined }, i: [ 10, 11 ], j: true, k: false, l: [ undefined, 0 ], m: "cowboy hat?" };
	assert.equal( decodeURIComponent( jQuery.param( params ) ), "a[]=1&a[]=2&b[c]=3&b[d][]=4&b[d][]=5&b[e][x][]=6&b[e][y]=7&b[e][z][]=8&b[e][z][]=9&b[f]=true&b[g]=false&b[h]=&i[]=10&i[]=11&j=true&k=false&l[]=&l[]=0&m=cowboy hat?", "huge structure, forced not traditional" );

	params = { "param1": null };
	assert.equal( jQuery.param( params ), "param1=", "Make sure that null params aren't traversed." );

	params = { "param1": function() {}, "param2": function() {
		return null;
	} };
	assert.equal( jQuery.param( params, false ), "param1=&param2=", "object with function property that returns null value" );

	params = { "test": { "length": 3, "foo": "bar" } };
	assert.equal( jQuery.param( params ), "test%5Blength%5D=3&test%5Bfoo%5D=bar", "Sub-object with a length property" );

	params = { "test": [ 1, 2, null ] };
	assert.equal( jQuery.param( params ), "test%5B%5D=1&test%5B%5D=2&test%5B%5D=", "object with array property with null value" );

	params = undefined;
	assert.equal( jQuery.param( params ), "", "jQuery.param( undefined ) === empty string" );
} );

QUnit[ includesModule( "ajax" ) ? "test" : "skip" ]( "jQuery.param() not affected by ajaxSettings", function( assert ) {
	assert.expect( 1 );

	var oldTraditional = jQuery.ajaxSettings.traditional;
	jQuery.ajaxSettings.traditional = true;
	assert.equal(
		jQuery.param( { "foo": [ "a", "b", "c" ] } ),
		"foo%5B%5D=a&foo%5B%5D=b&foo%5B%5D=c",
		"ajaxSettings.traditional is ignored"
	);
	jQuery.ajaxSettings.traditional = oldTraditional;
} );

QUnit.test( "jQuery.param() Constructed prop values", function( assert ) {
	assert.expect( 4 );

	/** @constructor */
	function Record() {
		this.prop = "val";
	}

	var MyString = String,
			MyNumber = Number,
			params = { "test": new MyString( "foo" ) };

	assert.equal( jQuery.param( params, false ), "test=foo", "Do not mistake new String() for a plain object" );

	params = { "test": new MyNumber( 5 ) };
	assert.equal( jQuery.param( params, false ), "test=5", "Do not mistake new Number() for a plain object" );

	params = { "test": new Date() };
	assert.ok( jQuery.param( params, false ), "(Non empty string returned) Do not mistake new Date() for a plain object" );

	// should allow non-native constructed objects
	params = { "test": new Record() };
	assert.equal( jQuery.param( params, false ), jQuery.param( { "test": { "prop": "val" } } ), "Allow non-native constructed objects" );
} );

QUnit.test( "serialize/serializeArray()", function( assert ) {
	assert.expect( 12 );

	var formArrayExpected, testFormArrayExpected, bothArrayExpected;

	// Add html5 elements only for serialize because selector can't yet find them on non-html5 browsers
	jQuery( "#search" ).after(
		"<input type='email' id='html5email' name='email' value='dave@jquery.com' />" +
		"<input type='number' id='html5number' name='number' value='43' />" +
		"<input type='file' name='fileupload' />"
	);

	formArrayExpected = [
		{ name: "action", value: "Test" },
		{ name: "radio2", value: "on" },
		{ name: "check", value: "on" },
		{ name: "hidden", value: "" },
		{ name: "foo[bar]", value: "" },
		{ name: "name", value: "name" },
		{ name: "search", value: "search" },
		{ name: "email", value: "dave@jquery.com" },
		{ name: "number", value: "43" },
		{ name: "select1", value: "" },
		{ name: "select2", value: "3" },
		{ name: "select3", value: "1" },
		{ name: "select3", value: "2" },
		{ name: "select5", value: "3" }
	];

	testFormArrayExpected = [
		{ name: "T3", value: "?\r\nZ" },
		{ name: "H1", value: "x" },
		{ name: "H2", value: "" },
		{ name: "PWD", value: "" },
		{ name: "T1", value: "" },
		{ name: "T2", value: "YES" },
		{ name: "My Name", value: "me" },
		{ name: "S1", value: "abc" },
		{ name: "S3", value: "YES" },
		{ name: "S4", value: "" }
	];

	bothArrayExpected = formArrayExpected.concat( testFormArrayExpected );

	assert.deepEqual( jQuery( "#form" ).serializeArray(),
		formArrayExpected,
		"Check form serialization as array" );

	assert.equal( jQuery( "#form" ).serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3",
		"Check form serialization as query string" );

	assert.deepEqual( jQuery( "input,select,textarea,button", "#form" ).serializeArray(),
		formArrayExpected,
		"Check input serialization as array" );

	assert.equal( jQuery( "input,select,textarea,button", "#form" ).serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3",
		"Check input serialization as query string" );

	assert.deepEqual( jQuery( "#testForm" ).serializeArray(),
		testFormArrayExpected,
		"Check form serialization as array" );

	assert.equal( jQuery( "#testForm" ).serialize(),
		"T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My%20Name=me&S1=abc&S3=YES&S4=",
		"Check form serialization as query string" );

	assert.deepEqual( jQuery( "input,select,textarea,button", "#testForm" ).serializeArray(),
		testFormArrayExpected,
		"Check input serialization as array" );

	assert.equal( jQuery( "input,select,textarea,button", "#testForm" ).serialize(),
		"T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My%20Name=me&S1=abc&S3=YES&S4=",
		"Check input serialization as query string" );

	assert.deepEqual( jQuery( "#form, #testForm" ).serializeArray(),
		bothArrayExpected,
		"Multiple form serialization as array" );

	assert.equal( jQuery( "#form, #testForm" ).serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3&T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My%20Name=me&S1=abc&S3=YES&S4=",
		"Multiple form serialization as query string" );

	assert.deepEqual( jQuery( "#form, #testForm input, #testForm select, #testForm textarea, #testForm button" ).serializeArray(),
		bothArrayExpected,
		"Mixed form/input serialization as array" );

	assert.equal( jQuery( "#form, #testForm input, #testForm select, #testForm textarea, #testForm button" ).serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3&T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My%20Name=me&S1=abc&S3=YES&S4=",
		"Mixed form/input serialization as query string" );

	jQuery( "#html5email, #html5number" ).remove();
} );

QUnit.test( "serialize/serializeArray() - excludes non-submittable elements by nodeName", function( assert ) {
	assert.expect( 2 );

	var form = jQuery(
			"<form>" +
			"	<input type='text' name='regular' value='val'>" +
			"	<div></div>" +
			"	<span></span>" +
			"</form>"
		),
		div = form.find( "div" )[ 0 ],
		span = form.find( "span" )[ 0 ];

	form.appendTo( "#qunit-fixture" );

	div.name = "divEl";
	div.value = "divVal";

	span.name = "spanEl";
	span.value = "spanVal";

	// Serialize elements directly (not the form) to bypass form.elements
	assert.deepEqual( jQuery( "input, div, span", form ).serializeArray(), [
		{ name: "regular", value: "val" }
	], "serializeArray: Only submittable elements (input/select/textarea/keygen) are included" );

	assert.equal( jQuery( "input, div, span", form ).serialize(),
		"regular=val",
		"serialize: Only submittable elements (input/select/textarea/keygen) are included" );

	form.remove();
} );

QUnit.test( "serialize/serializeArray() - form-associated custom elements (gh-5245)", function( assert ) {
	assert.expect( 2 );

	var form;

	if ( !customElements.get( "test-control" ) ) {
		class TestControl extends HTMLElement {
			static formAssociated = true;
			constructor() {
				super();
				this._internals = this.attachInternals();
			}
			connectedCallback() {
				this._internals.setFormValue( this.getAttribute( "value" ) || "" );
			}
			get name() {
				return this.getAttribute( "name" );
			}
			get value() {
				return this.getAttribute( "value" ) || "";
			}
		}
		customElements.define( "test-control", TestControl );
	}

	form = jQuery(
		"<form>" +
		"	<input type='text' name='regular' value='textVal'>" +
		"	<test-control name='custom' value='customVal'></test-control>" +
		"</form>"
	);

	form.appendTo( "#qunit-fixture" );

	assert.deepEqual( form.serializeArray(), [
		{ name: "regular", value: "textVal" },
		{ name: "custom", value: "customVal" }
	], "serializeArray: Form-associated custom elements should be included" );

	assert.equal( form.serialize(),
		"regular=textVal&custom=customVal",
		"serialize: Form-associated custom elements should be included" );

	form.remove();
} );
