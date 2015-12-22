QUnit.module( "data", { teardown: moduleTeardown } );

QUnit.test( "expando", function( assert ) {
	assert.expect( 1 );

	assert.equal(
		jQuery.expando !== undefined, true, "jQuery is exposing the expando"
	);
} );

function dataTests( elem, assert ) {
	var dataObj, internalDataObj;

	assert.equal(
		jQuery.data( elem, "foo" ), undefined, "No data exists initially"
	);
	assert.strictEqual(
		jQuery.hasData( elem ), false, "jQuery.hasData agrees no data exists initially"
	);

	dataObj = jQuery.data( elem );
	assert.equal(
		typeof dataObj, "object", "Calling data with no args gives us a data object reference"
	);
	assert.strictEqual(
		jQuery.data( elem ), dataObj,
		"Calling jQuery.data returns the same data object when called multiple times"
	);

	assert.strictEqual(
		jQuery.hasData( elem ), false,
		"jQuery.hasData agrees no data exists even when an empty data obj exists"
	);

	dataObj[ "foo" ] = "bar";
	assert.equal(
		jQuery.data( elem, "foo" ),
		"bar",
		"Data is readable by jQuery.data when set directly on a returned data object"
	);

	assert.strictEqual(
		jQuery.hasData( elem ), true, "jQuery.hasData agrees data exists when data exists"
	);

	jQuery.data( elem, "foo", "baz" );
	assert.equal(
		jQuery.data( elem, "foo" ), "baz", "Data can be changed by jQuery.data"
	);
	assert.equal(
		dataObj[ "foo" ],
		"baz",
		"Changes made through jQuery.data propagate to referenced data object"
	);

	jQuery.data( elem, "foo", undefined );
	assert.equal(
		jQuery.data( elem, "foo" ), "baz", "Data is not unset by passing undefined to jQuery.data"
	);

	jQuery.data( elem, "foo", null );
	assert.strictEqual(
		jQuery.data( elem, "foo" ), null, "Setting null using jQuery.data works OK"
	);

	jQuery.data( elem, "foo", "foo1" );

	jQuery.data( elem, { "bar": "baz", "boom": "bloz" } );
	assert.strictEqual(
		jQuery.data( elem, "foo" ),
		"foo1",
		"Passing an object extends the data object instead of replacing it"
	);
	assert.equal(
		jQuery.data( elem, "boom" ), "bloz", "Extending the data object works"
	);

	jQuery._data( elem, "foo", "foo2", true );
	assert.equal(
		jQuery._data( elem, "foo" ), "foo2", "Setting internal data works"
	);
	assert.equal(
		jQuery.data( elem, "foo" ), "foo1", "Setting internal data does not override user data"
	);

	internalDataObj = jQuery._data( elem );
	assert.ok(
		internalDataObj, "Internal data object exists"
	);
	assert.notStrictEqual(
		dataObj, internalDataObj, "Internal data object is not the same as user data object"
	);

	assert.strictEqual(
		elem.boom, undefined, "Data is never stored directly on the object"
	);

	jQuery.removeData( elem, "foo" );
	assert.strictEqual(
		jQuery.data( elem, "foo" ), undefined, "jQuery.removeData removes single properties"
	);

	jQuery.removeData( elem );
	assert.strictEqual(
		jQuery._data( elem ),
		internalDataObj,
		"jQuery.removeData does not remove internal data if it exists"
	);

	jQuery.data( elem, "foo", "foo1" );
	jQuery._data( elem, "foo", "foo2" );

	assert.equal(
		jQuery.data( elem, "foo" ), "foo1", "(sanity check) Ensure data is set in user data object"
	);
	assert.equal(
		jQuery._data( elem, "foo" ),
		"foo2",
		"(sanity check) Ensure data is set in internal data object"
	);

	assert.strictEqual(
		jQuery._data( elem, jQuery.expando ),
		undefined,
		"Removing the last item in internal data destroys the internal data object"
	);

	jQuery._data( elem, "foo", "foo2" );
	assert.equal(
		jQuery._data( elem, "foo" ),
		"foo2",
		"(sanity check) Ensure data is set in internal data object"
	);

	jQuery.removeData( elem, "foo" );
	assert.equal(
		jQuery._data( elem, "foo" ),
		"foo2",
		"(sanity check) jQuery.removeData for user data does not remove internal data"
	);
}

QUnit.test( "jQuery.data(div)", function( assert ) {
	assert.expect( 25 );

	var div = document.createElement( "div" );

	dataTests( div, assert );

	// We stored one key in the private data
	// assert that nothing else was put in there, and that that
	// one stayed there.
	assert.expectJqData( this, div, "foo" );
} );

QUnit.test( "jQuery.data({})", function( assert ) {
	assert.expect( 25 );

	dataTests( {}, assert );
} );

QUnit.test( "jQuery.data(window)", function( assert ) {
	assert.expect( 25 );

	// Remove bound handlers from window object to stop
	// potential false positives caused by fix for #5280 in
	// transports/xhr.js
	jQuery( window ).off( "unload" );

	dataTests( window, assert );
} );

QUnit.test( "jQuery.data(document)", function( assert ) {
	assert.expect( 25 );

	dataTests( document, assert );

	assert.expectJqData( this, document, "foo" );
} );

QUnit.test( "Expando cleanup", function( assert ) {
	assert.expect( 4 );

	var div = document.createElement( "div" );

	function assertExpandoAbsent( message ) {
		assert.strictEqual(
		div[ jQuery.expando ], undefined, message
	);
	}

	assertExpandoAbsent( "There is no expando on new elements" );

	jQuery.data( div, "foo", 100 );
	jQuery.data( div, "bar", 200 );

	assert.ok(
		jQuery.expando in div, "There is an expando on the element after using $.data()"
	);

	jQuery.removeData( div, "foo" );

	assert.ok(
		jQuery.expando in div, "There is still an expando on the element after removing (some) of the data"
	);

	jQuery.removeData( div, "bar" );

	assertExpandoAbsent( "Removing the last item in the data store deletes the expando" );

	// Clean up unattached element
	jQuery( div ).remove();
} );

QUnit.test( "Data is not being set on comment and text nodes", function( assert ) {
	assert.expect( 2 );

	assert.ok(
		!jQuery.hasData( jQuery( "<!-- comment -->" ).data( "foo", 0 ) )
	);
	assert.ok(
		!jQuery.hasData( jQuery( "<span>text</span>" ).contents().data( "foo", 0 ) )
	);

} );

QUnit.test( "acceptData", function( assert ) {
	assert.expect( 10 );

	var flash, pdf, form;

	assert.equal( 42, jQuery( document ).data( "test", 42 ).data( "test" ), "document" );
	assert.equal( 42, jQuery( document.documentElement ).data( "test", 42 ).data( "test" ), "documentElement" );
	assert.equal( 42, jQuery( {} ).data( "test", 42 ).data( "test" ), "object" );
	assert.equal( undefined, jQuery( document.createElement( "embed" ) ).data( "test", 42 ).data( "test" ), "embed" );

	flash = document.createElement( "object" );
	flash.setAttribute( "classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" );
	assert.equal( 42, jQuery( flash ).data( "test", 42 ).data( "test" ), "flash" );

	pdf = document.createElement( "object" );
	pdf.setAttribute( "classid", "clsid:CA8A9780-280D-11CF-A24D-444553540000" );
	assert.equal( undefined, jQuery( pdf ).data( "test", 42 ).data( "test" ), "pdf" );

	assert.equal( undefined, jQuery( document.createComment( "" ) ).data( "test", 42 ).data( "test" ), "comment" );
	assert.equal( undefined, jQuery( document.createTextNode( "" ) ).data( "test", 42 ).data( "test" ), "text" );
	assert.equal( undefined, jQuery( document.createDocumentFragment() ).data( "test", 42 ).data( "test" ), "documentFragment" );

	form = jQuery( "#form" ).append( "<input id='nodeType'/><input id='nodeName'/>" )[ 0 ];
	assert.equal( 42, jQuery( form ) .data( "test", 42 ).data( "test" ), "form with aliased DOM properties" );

	// Clean up.
	jQuery.removeData( document );
	jQuery.removeData( document.documentElement );
	jQuery.removeData( flash );
	jQuery.removeData( form );
} );

// attempting to access the data of an undefined jQuery element should be undefined
QUnit.test( "jQuery().data() === undefined (#14101)", function( assert ) {
	assert.expect( 2 );

	assert.strictEqual(
		jQuery().data(), undefined
	);
	assert.strictEqual(
		jQuery().data( "key" ), undefined
	);
} );

QUnit.test( ".data()", function( assert ) {
	assert.expect( 5 );

	var div, dataObj, nodiv, obj;

	div = jQuery( "#foo" );
	assert.strictEqual(
		div.data( "foo" ), undefined, "Make sure that missing result is undefined"
	);
	div.data( "test", "success" );

	dataObj = div.data();

	assert.deepEqual(
		dataObj, { test: "success" }, "data() returns entire data object with expected properties"
	);
	assert.strictEqual(
		div.data( "foo" ), undefined, "Make sure that missing result is still undefined"
	);

	nodiv = jQuery( "#unfound" );
	assert.equal(
		nodiv.data(), null, "data() on empty set returns null"
	);

	obj = { foo: "bar" };
	jQuery( obj ).data( "foo", "baz" );

	dataObj = jQuery.extend( true, {}, jQuery( obj ).data() );

	assert.deepEqual(
		dataObj, { "foo": "baz" }, "Retrieve data object from a wrapped JS object (#7524)"
	);
} );

function testDataTypes( $obj, assert ) {
	jQuery.each( {
		"null": null,
		"true": true,
		"false": false,
		"zero": 0,
		"one": 1,
		"empty string": "",
		"empty array": [],
		"array": [ 1 ],
		"empty object": {},
		"object": { foo: "bar" },
		"date": new Date(),
		"regex": /test/,
		"function": function() {}
	}, function( type, value ) {
		assert.strictEqual(
		$obj.data( "test", value ).data( "test" ), value, "Data set to " + type
	);
	} );
}

QUnit.test( "jQuery(Element).data(String, Object).data(String)", function( assert ) {
	assert.expect( 18 );
	var parent = jQuery( "<div><div></div></div>" ),
		div = parent.children();

	assert.strictEqual(
		div.data( "test" ), undefined, "No data exists initially"
	);
	assert.strictEqual(
		div.data( "test", "success" ).data( "test" ), "success", "Data added"
	);
	assert.strictEqual(
		div.data( "test", "overwritten" ).data( "test" ), "overwritten", "Data overwritten"
	);
	assert.strictEqual(
		div.data( "test", undefined ).data( "test" ),
		"overwritten",
		".data(key,undefined) does nothing but is chainable (#5571)"
	);
	assert.strictEqual(
		div.data( "notexist" ), undefined, "No data exists for unset key"
	);
	testDataTypes( div, assert );

	parent.remove();
} );

QUnit.test( "jQuery(plain Object).data(String, Object).data(String)", function( assert ) {
	assert.expect( 16 );

	// #3748
	var $obj = jQuery( { exists: true } );
	assert.strictEqual(
		$obj.data( "nothing" ), undefined, "Non-existent data returns undefined"
	);
	assert.strictEqual(
		$obj.data( "exists" ), undefined, "Object properties are not returned as data"
	);
	testDataTypes( $obj, assert );

	// Clean up
	$obj.removeData();
	assert.deepEqual(
		$obj[ 0 ], { exists: true }, "removeData does not clear the object"
	);
} );

QUnit.test( "data-* attributes", function( assert ) {
	assert.expect( 43 );

	var prop, i, l, metadata, elem,
		obj, obj2, check, num, num2,
		parseJSON = jQuery.parseJSON,
		div = jQuery( "<div>" ),
		child = jQuery( "<div data-myobj='old data' data-ignored=\"DOM\" data-other='test'></div>" ),
		dummy = jQuery( "<div data-myobj='old data' data-ignored=\"DOM\" data-other='test'></div>" );

	equal( div.data( "attr" ), undefined, "Check for non-existing data-attr attribute" );

	div.attr( "data-attr", "exists" );
	equal( div.data( "attr" ), "exists", "Check for existing data-attr attribute" );

	div.attr( "data-attr", "exists2" );
	equal( div.data( "attr" ), "exists", "Check that updates to data- don't update .data()" );

	div.data( "attr", "internal" ).attr( "data-attr", "external" );
	equal( div.data( "attr" ), "internal", "Check for .data('attr') precedence (internal > external data-* attribute)" );

	div.remove();

	child.appendTo( "#qunit-fixture" );
	equal( child.data( "myobj" ), "old data", "Value accessed from data-* attribute" );

	child.data( "myobj", "replaced" );
	assert.equal(
		child.data( "myobj" ), "replaced", "Original data overwritten"
	);

	child.data( "ignored", "cache" );
	assert.equal(
		child.data( "ignored" ), "cache", "Cached data used before DOM data-* fallback"
	);

	obj = child.data();
	obj2 = dummy.data();
	check = [ "myobj", "ignored", "other" ];
	num = 0;
	num2 = 0;

	dummy.remove();

	for ( i = 0, l = check.length; i < l; i++ ) {
		assert.ok(
		obj[ check[ i ] ], "Make sure data- property exists when calling data-."
	);
		assert.ok(
		obj2[ check[ i ] ], "Make sure data- property exists when calling data-."
	);
	}

	for ( prop in obj ) {
		num++;
	}

	assert.equal(
		num, check.length, "Make sure that the right number of properties came through."
	);

	for ( prop in obj2 ) {
		num2++;
	}

	assert.equal(
		num2, check.length, "Make sure that the right number of properties came through."
	);

	child.attr( "data-other", "newvalue" );

	assert.equal(
		child.data( "other" ), "test", "Make sure value was pulled in properly from a .data()."
	);

	// attribute parsing
	i = 0;
	jQuery.parseJSON = function() {
		i++;
		return parseJSON.apply( this, arguments );
	};

	child
		.attr( "data-true", "true" )
		.attr( "data-false", "false" )
		.attr( "data-five", "5" )
		.attr( "data-point", "5.5" )
		.attr( "data-pointe", "5.5E3" )
		.attr( "data-grande", "5.574E9" )
		.attr( "data-hexadecimal", "0x42" )
		.attr( "data-pointbad", "5..5" )
		.attr( "data-pointbad2", "-." )
		.attr( "data-bigassnum", "123456789123456789123456789" )
		.attr( "data-badjson", "{123}" )
		.attr( "data-badjson2", "[abc]" )
		.attr( "data-notjson", " {}" )
		.attr( "data-notjson2", "[] " )
		.attr( "data-empty", "" )
		.attr( "data-space", " " )
		.attr( "data-null", "null" )
		.attr( "data-string", "test" );

	assert.strictEqual(
		child.data( "true" ), true, "Primitive true read from attribute"
	);
	assert.strictEqual(
		child.data( "false" ), false, "Primitive false read from attribute"
	);
	assert.strictEqual(
		child.data( "five" ), 5, "Integer read from attribute"
	);
	assert.strictEqual(
		child.data( "point" ), 5.5, "Floating-point number read from attribute"
	);
	assert.strictEqual(
		child.data( "pointe" ), "5.5E3",
		"Exponential-notation number read from attribute as string" );
	assert.strictEqual(
		child.data( "grande" ), "5.574E9",
		"Big exponential-notation number read from attribute as string" );
	assert.strictEqual(
		child.data( "hexadecimal" ), "0x42",
		"Hexadecimal number read from attribute as string" );
	assert.strictEqual(
		child.data( "pointbad" ), "5..5",
		"Extra-point non-number read from attribute as string" );
	assert.strictEqual(
		child.data( "pointbad2" ), "-.",
		"No-digit non-number read from attribute as string" );
	assert.strictEqual(
		child.data( "bigassnum" ), "123456789123456789123456789",
		"Bad bigass number read from attribute as string" );
	assert.strictEqual(
		child.data( "badjson" ), "{123}", "Bad JSON object read from attribute as string"
	);
	assert.strictEqual(
		child.data( "badjson2" ), "[abc]", "Bad JSON array read from attribute as string"
	);
	assert.strictEqual(
		child.data( "notjson" ), " {}",
		"JSON object with leading non-JSON read from attribute as string" );
	assert.strictEqual(
		child.data( "notjson2" ), "[] ",
		"JSON array with trailing non-JSON read from attribute as string" );
	assert.strictEqual(
		child.data( "empty" ), "", "Empty string read from attribute"
	);
	assert.strictEqual(
		child.data( "space" ), " ", "Whitespace string read from attribute"
	);
	assert.strictEqual(
		child.data( "null" ), null, "Primitive null read from attribute"
	);
	assert.strictEqual(
		child.data( "string" ), "test", "Typical string read from attribute"
	);
	assert.equal(
		i, 2, "Correct number of JSON parse attempts when reading from attributes"
	);

	jQuery.parseJSON = parseJSON;
	child.remove();

	// tests from metadata plugin
	function testData( index, elem ) {
		switch ( index ) {
		case 0:
			assert.equal(
		jQuery( elem ).data( "foo" ), "bar", "Check foo property"
	);
			assert.equal(
		jQuery( elem ).data( "bar" ), "baz", "Check baz property"
	);
			break;
		case 1:
			assert.equal(
		jQuery( elem ).data( "test" ), "bar", "Check test property"
	);
			assert.equal(
		jQuery( elem ).data( "bar" ), "baz", "Check bar property"
	);
			break;
		case 2:
			assert.equal(
		jQuery( elem ).data( "zoooo" ), "bar", "Check zoooo property"
	);
			assert.deepEqual(
		jQuery( elem ).data( "bar" ), { "test":"baz" }, "Check bar property"
	);
			break;
		case 3:
			assert.equal(
		jQuery( elem ).data( "number" ), true, "Check number property"
	);
			assert.deepEqual(
		jQuery( elem ).data( "stuff" ), [ 2, 8 ], "Check stuff property"
	);
			break;
		default:
			assert.ok(
		false, [ "Assertion failed on index ", index, ", with data" ].join( "" )
	);
		}
	}

	metadata = "<ol><li class='test test2' data-foo='bar' data-bar='baz' data-arr='[1,2]'>Some stuff</li><li class='test test2' data-test='bar' data-bar='baz'>Some stuff</li><li class='test test2' data-zoooo='bar' data-bar='{\"test\":\"baz\"}'>Some stuff</li><li class='test test2' data-number=true data-stuff='[2,8]'>Some stuff</li></ol>";
	elem = jQuery( metadata ).appendTo( "#qunit-fixture" );

	elem.find( "li" ).each( testData );
	elem.remove();
} );

QUnit.test( ".data(Object)", function( assert ) {
	assert.expect( 4 );

	var obj, jqobj,
		div = jQuery( "<div/>" );

	div.data( { "test": "in", "test2": "in2" } );
	assert.equal(
		div.data( "test" ), "in", "Verify setting an object in data"
	);
	assert.equal(
		div.data( "test2" ), "in2", "Verify setting an object in data"
	);

	obj = { test:"unset" };
	jqobj = jQuery( obj );

	jqobj.data( "test", "unset" );
	jqobj.data( { "test": "in", "test2": "in2" } );
	assert.equal(
		jQuery.data( obj )[ "test" ], "in", "Verify setting an object on an object extends the data object"
	);
	assert.equal(
		obj[ "test2" ], undefined, "Verify setting an object on an object does not extend the object"
	);

	// manually clean up detached elements
	div.remove();
} );

QUnit.test( "jQuery.removeData", function( assert ) {
	assert.expect( 10 );

	var obj,
		div = jQuery( "#foo" )[ 0 ];
	jQuery.data( div, "test", "testing" );
	jQuery.removeData( div, "test" );
	assert.equal(
		jQuery.data( div, "test" ), undefined, "Check removal of data"
	);

	jQuery.data( div, "test2", "testing" );
	jQuery.removeData( div );
	assert.ok(
		!jQuery.data( div, "test2" ), "Make sure that the data property no longer exists."
	);
	assert.ok(
		!div[ jQuery.expando ], "Make sure the expando no longer exists, as well."
	);

	jQuery.data( div, {
		test3: "testing",
		test4: "testing"
	} );
	jQuery.removeData( div, "test3 test4" );
	assert.ok(
		!jQuery.data( div, "test3" ) || jQuery.data( div, "test4" ), "Multiple delete with spaces."
	);

	jQuery.data( div, {
		test3: "testing",
		test4: "testing"
	} );
	jQuery.removeData( div, [ "test3", "test4" ] );
	assert.ok(
		!jQuery.data( div, "test3" ) || jQuery.data( div, "test4" ), "Multiple delete by array."
	);

	jQuery.data( div, {
		"test3 test4": "testing",
		"test3": "testing"
	} );
	jQuery.removeData( div, "test3 test4" );
	assert.ok(
		!jQuery.data( div, "test3 test4" ), "Multiple delete with spaces deleted key with exact name"
	);
	assert.ok(
		jQuery.data( div, "test3" ), "Left the partial matched key alone"
	);

	obj = {};
	jQuery.data( obj, "test", "testing" );
	assert.equal(
		jQuery( obj ).data( "test" ), "testing", "verify data on plain object"
	);
	jQuery.removeData( obj, "test" );
	assert.equal(
		jQuery.data( obj, "test" ), undefined, "Check removal of data on plain object"
	);

	jQuery.data( window, "BAD", true );
	jQuery.removeData( window, "BAD" );
	assert.ok(
		!jQuery.data( window, "BAD" ), "Make sure that the value was not still set."
	);
} );

QUnit.test( ".removeData()", function( assert ) {
	assert.expect( 6 );
	var div = jQuery( "#foo" );
	div.data( "test", "testing" );
	div.removeData( "test" );
	assert.equal(
		div.data( "test" ), undefined, "Check removal of data"
	);

	div.data( "test", "testing" );
	div.data( "test.foo", "testing2" );
	div.removeData( "test.bar" );
	assert.equal(
		div.data( "test.foo" ), "testing2", "Make sure data is intact"
	);
	assert.equal(
		div.data( "test" ), "testing", "Make sure data is intact"
	);

	div.removeData( "test" );
	assert.equal(
		div.data( "test.foo" ), "testing2", "Make sure data is intact"
	);
	assert.equal(
		div.data( "test" ), undefined, "Make sure data is intact"
	);

	div.removeData( "test.foo" );
	assert.equal(
		div.data( "test.foo" ), undefined, "Make sure data is intact"
	);
} );

if ( window.JSON && window.JSON.stringify ) {
	QUnit.test( "JSON serialization (#8108)", function( assert ) {
		assert.expect( 1 );

		var obj = { "foo": "bar" };
		jQuery.data( obj, "hidden", true );

		assert.equal(
		JSON.stringify( obj ), "{\"foo\":\"bar\"}", "Expando is hidden from JSON.stringify"
	);
	} );
}

QUnit.test( "jQuery.data should follow html5 specification regarding camel casing", function( assert ) {
	assert.expect( 10 );

	var div = jQuery( "<div id='myObject' data-w-t-f='ftw' data-big-a-little-a='bouncing-b' data-foo='a' data-foo-bar='b' data-foo-bar-baz='c'></div>" )
		.prependTo( "body" );

	assert.equal(
		div.data()[ "wTF" ], "ftw", "Verify single letter data-* key"
	);
	assert.equal(
		div.data()[ "bigALittleA" ], "bouncing-b", "Verify single letter mixed data-* key"
	);

	assert.equal(
		div.data()[ "foo" ], "a", "Verify single word data-* key"
	);
	assert.equal(
		div.data()[ "fooBar" ], "b", "Verify multiple word data-* key"
	);
	assert.equal(
		div.data()[ "fooBarBaz" ], "c", "Verify multiple word data-* key"
	);

	assert.equal(
		div.data( "foo" ), "a", "Verify single word data-* key"
	);
	assert.equal(
		div.data( "fooBar" ), "b", "Verify multiple word data-* key"
	);
	assert.equal(
		div.data( "fooBarBaz" ), "c", "Verify multiple word data-* key"
	);

	div.data( "foo-bar", "d" );

	assert.equal(
		div.data( "fooBar" ), "d", "Verify updated data-* key"
	);
	assert.equal(
		div.data( "foo-bar" ), "d", "Verify updated data-* key"
	);

	div.remove();
} );

QUnit.test( "jQuery.data should not miss data with preset hyphenated property names", function( assert ) {

	assert.expect( 2 );

	var div = jQuery( "<div/>", { id: "hyphened" } ).appendTo( "#qunit-fixture" ),
		test = {
			"camelBar": "camelBar",
			"hyphen-foo": "hyphen-foo"
		};

	div.data( test );

	jQuery.each( test, function( i, k ) {
		assert.equal(
		div.data( k ), k, "data with property '" + k + "' was correctly found"
	);
	} );
} );

QUnit.test(
	".data supports interoperable hyphenated/camelCase get/set of" +
	" properties with arbitrary non-null|NaN|undefined values",
	function( assert ) {
		var div = jQuery( "<div/>", { id: "hyphened" } ).appendTo( "#qunit-fixture" ),
			datas = {
				"non-empty": "a string",
				"empty-string": "",
				"one-value": 1,
				"zero-value": 0,
				"an-array": [],
				"an-object": {},
				"bool-true": true,
				"bool-false": false,

				// JSHint enforces double quotes,
				// but JSON strings need double quotes to parse
				// so we need escaped double quotes here
				"some-json": "{ \"foo\": \"bar\" }",
				"num-1-middle": true,
				"num-end-2": true,
				"2-num-start": true
			};

		assert.expect( 24 );

		jQuery.each( datas, function( key, val ) {
			div.data( key, val );

			assert.deepEqual(
			div.data( key ), val, "get: " + key
		);
			assert.deepEqual(
			div.data( jQuery.camelCase( key ) ), val, "get: " + jQuery.camelCase( key )
		);
		} );
	}
);

test( "jQuery.data supports interoperable hyphenated/camelCase get/set of properties with arbitrary non-null|NaN|undefined values", function() {

	var div = jQuery( "<div/>", { id: "hyphened" } ).appendTo( "#qunit-fixture" ),
		datas = {
			"non-empty": "a string",
			"empty-string": "",
			"one-value": 1,
			"zero-value": 0,
			"an-array": [],
			"an-object": {},
			"bool-true": true,
			"bool-false": false,

			// JSHint enforces double quotes,
			// but JSON strings need double quotes to parse
			// so we need escaped double quotes here
			"some-json": "{ \"foo\": \"bar\" }",
			"num-1-middle": true,
			"num-end-2": true,
			"2-num-start": true
		};

	expect( 24 );

	jQuery.each( datas, function( key, val ) {
		div.data( key, val );

		deepEqual( div.data( key ), val, "get: " + key );
		deepEqual( div.data( jQuery.camelCase( key ) ), val, "get: " + jQuery.camelCase( key ) );
	} );
} );

test( ".removeData supports removal of hyphenated properties via array (#12786)", function() {
	expect( 4 );

	var div, plain, compare;

	div = jQuery( "<div>" ).appendTo( "#qunit-fixture" );
	plain = jQuery( {} );

	// When data is batch assigned (via plain object), the properties
	// are not camel cased as they are with (property, value) calls
	compare = {

		// From batch assignment .data({ "a-a": 1 })
		"a-a": 1,

		// From property, value assignment .data( "b-b", 1 )
		"bB": 1
	};

	// Mixed assignment
	div.data( { "a-a": 1 } ).data( "b-b", 1 );
	plain.data( { "a-a": 1 } ).data( "b-b", 1 );

	deepEqual( div.data(), compare, "Data appears as expected. (div)" );
	deepEqual( plain.data(), compare, "Data appears as expected. (plain)" );

	div.removeData( [ "a-a", "b-b" ] );
	plain.removeData( [ "a-a", "b-b" ] );

	// NOTE: Timo's proposal for "propEqual" (or similar) would be nice here
	deepEqual( div.data(), {}, "Data is empty. (div)" );
	deepEqual( plain.data(), {}, "Data is empty. (plain)" );
} );

// Test originally by Moschel
QUnit.test( "Triggering the removeData should not throw exceptions. (#10080)", function( assert ) {
	assert.expect( 1 );
	QUnit.stop();
	var frame = jQuery( "#loadediframe" );
	jQuery( frame[ 0 ].contentWindow ).on( "unload", function() {
		assert.ok(
		true, "called unload"
	);
		QUnit.start();
	} );

	// change the url to trigger unload
	frame.attr( "src", "data/iframe.html?param=true" );
} );

QUnit.test( "Only check element attributes once when calling .data() - #8909", function( assert ) {
	assert.expect( 2 );
	var testing = {
			"test": "testing",
			"test2": "testing"
		},
		element = jQuery( "<div data-test='testing'>" ),
		node = element[ 0 ];

	// set an attribute using attr to ensure it
	node.setAttribute( "data-test2", "testing" );
	assert.deepEqual(
		element.data(), testing, "Sanity Check"
	);

	node.setAttribute( "data-test3", "testing" );
	assert.deepEqual(
		element.data(), testing, "The data didn't change even though the data-* attrs did"
	);

	// clean up data cache
	element.remove();
} );

QUnit.test( "JSON data- attributes can have newlines", function( assert ) {
	assert.expect( 1 );

	var x = jQuery( "<div data-some='{\n\"foo\":\n\t\"bar\"\n}'></div>" );
	assert.equal(
		x.data( "some" ).foo, "bar", "got a JSON data- attribute with spaces"
	);
	x.remove();
} );

testIframeWithCallback(
	"enumerate data attrs on body (#14894)",
	"data/dataAttrs.html",
	function( result, assert ) {
		assert.expect( 1 );

		assert.equal(
			result, "ok", "enumeration of data- attrs on body"
		);
	}
);

QUnit.test( ".data(prop) does not create expando", function( assert ) {
	assert.expect( 1 );

	var key,
		div = jQuery( "<div/>" );

	div.data( "foo" );
	assert.equal( jQuery.hasData( div[ 0 ] ), false, "No data exists after access" );

	// Make sure no expando has been added
	for ( key in div[ 0 ] ) {
		if ( /^jQuery/.test( key ) ) {
			assert.ok( false, "Expando was created on access" );
		}
	}
} );
