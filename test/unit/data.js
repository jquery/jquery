QUnit.module( "data", { afterEach: moduleTeardown } );

QUnit.test( "expando", function( assert ) {
	assert.expect( 1 );

	assert.equal( jQuery.expando !== undefined, true, "jQuery is exposing the expando" );
} );

QUnit.test( "jQuery.data & removeData, expected returns", function( assert ) {
	assert.expect( 4 );
	var elem = document.body;

	assert.equal(
		jQuery.data( elem, "hello", "world" ), "world",
		"jQuery.data( elem, key, value ) returns value"
	);
	assert.equal(
		jQuery.data( elem, "hello" ), "world",
		"jQuery.data( elem, key ) returns value"
	);
	assert.deepEqual(
		jQuery.data( elem, { goodnight: "moon" } ), { goodnight: "moon" },
		"jQuery.data( elem, obj ) returns obj"
	);
	assert.equal(
		jQuery.removeData( elem, "hello" ), undefined,
		"jQuery.removeData( elem, key, value ) returns undefined"
	);

} );

QUnit.test( "jQuery._data & _removeData, expected returns", function( assert ) {
	assert.expect( 4 );
	var elem = document.body;

	assert.equal(
		jQuery._data( elem, "hello", "world" ), "world",
		"jQuery._data( elem, key, value ) returns value"
	);
	assert.equal(
		jQuery._data( elem, "hello" ), "world",
		"jQuery._data( elem, key ) returns value"
	);
	assert.deepEqual(
		jQuery._data( elem, { goodnight: "moon" } ), { goodnight: "moon" },
		"jQuery._data( elem, obj ) returns obj"
	);
	assert.equal(
		jQuery._removeData( elem, "hello" ), undefined,
		"jQuery._removeData( elem, key, value ) returns undefined"
	);
} );

QUnit.test( "jQuery.hasData no side effects", function( assert ) {
	assert.expect( 1 );
	var obj = {};

	jQuery.hasData( obj );

	assert.equal( Object.getOwnPropertyNames( obj ).length, 0,
		"No data expandos where added when calling jQuery.hasData(o)"
	);
} );

function dataTests( elem, assert ) {
	var dataObj, internalDataObj;

	assert.equal( jQuery.data( elem, "foo" ), undefined, "No data exists initially" );
	assert.strictEqual( jQuery.hasData( elem ), false, "jQuery.hasData agrees no data exists initially" );

	dataObj = jQuery.data( elem );
	assert.equal( typeof dataObj, "object", "Calling data with no args gives us a data object reference" );
	assert.strictEqual( jQuery.data( elem ), dataObj, "Calling jQuery.data returns the same data object when called multiple times" );

	assert.strictEqual( jQuery.hasData( elem ), false, "jQuery.hasData agrees no data exists even when an empty data obj exists" );

	dataObj[ "foo" ] = "bar";
	assert.equal( jQuery.data( elem, "foo" ), "bar", "Data is readable by jQuery.data when set directly on a returned data object" );

	assert.strictEqual( jQuery.hasData( elem ), true, "jQuery.hasData agrees data exists when data exists" );

	jQuery.data( elem, "foo", "baz" );
	assert.equal( jQuery.data( elem, "foo" ), "baz", "Data can be changed by jQuery.data" );
	assert.equal( dataObj[ "foo" ], "baz", "Changes made through jQuery.data propagate to referenced data object" );

	jQuery.data( elem, "foo", undefined );
	assert.equal( jQuery.data( elem, "foo" ), "baz", "Data is not unset by passing undefined to jQuery.data" );

	jQuery.data( elem, "foo", null );
	assert.strictEqual( jQuery.data( elem, "foo" ), null, "Setting null using jQuery.data works OK" );

	jQuery.data( elem, "foo", "foo1" );

	jQuery.data( elem, { "bar": "baz", "boom": "bloz" } );
	assert.strictEqual( jQuery.data( elem, "foo" ), "foo1", "Passing an object extends the data object instead of replacing it" );
	assert.equal( jQuery.data( elem, "boom" ), "bloz", "Extending the data object works" );

	jQuery._data( elem, "foo", "foo2", true );
	assert.equal( jQuery._data( elem, "foo" ), "foo2", "Setting internal data works" );
	assert.equal( jQuery.data( elem, "foo" ), "foo1", "Setting internal data does not override user data" );

	internalDataObj = jQuery._data( elem );
	assert.ok( internalDataObj, "Internal data object exists" );
	assert.notStrictEqual( dataObj, internalDataObj, "Internal data object is not the same as user data object" );

	assert.strictEqual( elem.boom, undefined, "Data is never stored directly on the object" );

	jQuery.removeData( elem, "foo" );
	assert.strictEqual( jQuery.data( elem, "foo" ), undefined, "jQuery.removeData removes single properties" );

	jQuery.removeData( elem );
	assert.strictEqual( jQuery._data( elem ), internalDataObj, "jQuery.removeData does not remove internal data if it exists" );

	jQuery.data( elem, "foo", "foo1" );
	jQuery._data( elem, "foo", "foo2" );

	assert.equal( jQuery.data( elem, "foo" ), "foo1", "(sanity check) Ensure data is set in user data object" );
	assert.equal( jQuery._data( elem, "foo" ), "foo2", "(sanity check) Ensure data is set in internal data object" );

	assert.strictEqual( jQuery._data( elem, jQuery.expando ), undefined, "Removing the last item in internal data destroys the internal data object" );

	jQuery._data( elem, "foo", "foo2" );
	assert.equal( jQuery._data( elem, "foo" ), "foo2", "(sanity check) Ensure data is set in internal data object" );

	jQuery.removeData( elem, "foo" );
	assert.equal( jQuery._data( elem, "foo" ), "foo2", "(sanity check) jQuery.removeData for user data does not remove internal data" );
}

QUnit.test( "jQuery.data(div)", function( assert ) {
	assert.expect( 25 );

	var div = document.createElement( "div" );

	dataTests( div, assert );
} );

QUnit.test( "jQuery.data({})", function( assert ) {
	assert.expect( 25 );

	dataTests( {}, assert );
} );

QUnit.test( "jQuery.data(window)", function( assert ) {
	assert.expect( 25 );

	// remove bound handlers from window object to stop potential false positives caused by fix for #5280 in
	// transports/xhr.js
	jQuery( window ).off( "unload" );

	dataTests( window, assert );
} );

QUnit.test( "jQuery.data(document)", function( assert ) {
	assert.expect( 25 );

	dataTests( document, assert );
} );

QUnit.test( "jQuery.data(<embed>)", function( assert ) {
	assert.expect( 25 );

	dataTests( document.createElement( "embed" ), assert );
} );

QUnit.test( "jQuery.data(object/flash)", function( assert ) {
	assert.expect( 25 );

	var flash = document.createElement( "object" );
	flash.setAttribute( "classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" );

	dataTests( flash, assert );
} );

// attempting to access the data of an undefined jQuery element should be undefined
QUnit.test( "jQuery().data() === undefined (#14101)", function( assert ) {
	assert.expect( 2 );

	assert.strictEqual( jQuery().data(), undefined );
	assert.strictEqual( jQuery().data( "key" ), undefined );
} );

QUnit.test( ".data()", function( assert ) {
	assert.expect( 5 );

	var div, dataObj, nodiv, obj;

	div = jQuery( "#foo" );
	assert.strictEqual( div.data( "foo" ), undefined, "Make sure that missing result is undefined" );
	div.data( "test", "success" );

	dataObj = div.data();

	assert.deepEqual( dataObj, { test: "success" }, "data() returns entire data object with expected properties" );
	assert.strictEqual( div.data( "foo" ), undefined, "Make sure that missing result is still undefined" );

	nodiv = jQuery( "#unfound" );
	assert.equal( nodiv.data(), null, "data() on empty set returns null" );

	obj = { foo: "bar" };
	jQuery( obj ).data( "foo", "baz" );

	dataObj = jQuery.extend( true, {}, jQuery( obj ).data() );

	assert.deepEqual( dataObj, { "foo": "baz" }, "Retrieve data object from a wrapped JS object (#7524)" );
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
		assert.strictEqual( $obj.data( "test", value ).data( "test" ), value, "Data set to " + type );
	} );
}

QUnit.test( "jQuery(Element).data(String, Object).data(String)", function( assert ) {
	assert.expect( 18 );
	var parent = jQuery( "<div><div></div></div>" ),
		div = parent.children();

	assert.strictEqual( div.data( "test" ), undefined, "No data exists initially" );
	assert.strictEqual( div.data( "test", "success" ).data( "test" ), "success", "Data added" );
	assert.strictEqual( div.data( "test", "overwritten" ).data( "test" ), "overwritten", "Data overwritten" );
	assert.strictEqual( div.data( "test", undefined ).data( "test" ), "overwritten", ".data(key,undefined) does nothing but is chainable (#5571)" );
	assert.strictEqual( div.data( "notexist" ), undefined, "No data exists for unset key" );
	testDataTypes( div, assert );

	parent.remove();
} );

QUnit.test( "jQuery(plain Object).data(String, Object).data(String)", function( assert ) {
	assert.expect( 16 );

	// #3748
	var $obj = jQuery( { exists: true } );
	assert.strictEqual( $obj.data( "nothing" ), undefined, "Non-existent data returns undefined" );
	assert.strictEqual( $obj.data( "exists" ), undefined, "Object properties are not returned as data" );
	testDataTypes( $obj, assert );

	// Clean up
	$obj.removeData();
	assert.deepEqual( $obj[ 0 ], { exists: true }, "removeData does not clear the object" );
} );

QUnit.test( ".data(object) does not retain references. #13815", function( assert ) {
	assert.expect( 2 );

	var $divs = jQuery( "<div></div><div></div>" ).appendTo( "#qunit-fixture" );

	$divs.data( { "type": "foo" } );
	$divs.eq( 0 ).data( "type", "bar" );

	assert.equal( $divs.eq( 0 ).data( "type" ), "bar", "Correct updated value" );
	assert.equal( $divs.eq( 1 ).data( "type" ), "foo", "Original value retained" );
} );

QUnit.test( "data-* attributes", function( assert ) {
	assert.expect( 46 );

	var prop, i, l, metadata, elem,
		obj, obj2, check, num, num2,
		parseJSON = JSON.parse,
		div = jQuery( "<div>" ),
		child = jQuery( "<div data-myobj='old data' data-ignored=\"DOM\" data-other='test' data-foo-42='boosh'></div>" ),
		dummy = jQuery( "<div data-myobj='old data' data-ignored=\"DOM\" data-other='test' data-foo-42='boosh'></div>" );

	assert.equal( div.data( "attr" ), undefined, "Check for non-existing data-attr attribute" );

	div.attr( "data-attr", "exists" );
	assert.equal( div.data( "attr" ), "exists", "Check for existing data-attr attribute" );

	div.attr( "data-attr", "exists2" );
	assert.equal( div.data( "attr" ), "exists", "Check that updates to data- don't update .data()" );

	div.data( "attr", "internal" ).attr( "data-attr", "external" );
	assert.equal( div.data( "attr" ), "internal", "Check for .data('attr') precedence (internal > external data-* attribute)" );

	div.remove();

	child.appendTo( "#qunit-fixture" );
	assert.equal( child.data( "myobj" ), "old data", "Value accessed from data-* attribute" );
	assert.equal( child.data( "foo-42" ), "boosh", "camelCasing does not affect numbers (#1751)" );

	child.data( "myobj", "replaced" );
	assert.equal( child.data( "myobj" ), "replaced", "Original data overwritten" );

	child.data( "ignored", "cache" );
	assert.equal( child.data( "ignored" ), "cache", "Cached data used before DOM data-* fallback" );

	obj = child.data();
	obj2 = dummy.data();
	check = [ "myobj", "ignored", "other", "foo-42" ];
	num = 0;
	num2 = 0;

	dummy.remove();

	for ( i = 0, l = check.length; i < l; i++ ) {
		assert.ok( obj[ check[ i ] ], "Make sure data- property exists when calling data-." );
		assert.ok( obj2[ check[ i ] ], "Make sure data- property exists when calling data-." );
	}

	for ( prop in obj ) {
		num++;
	}

	assert.equal( num, check.length, "Make sure that the right number of properties came through." );

	for ( prop in obj2 ) {
		num2++;
	}

	assert.equal( num2, check.length, "Make sure that the right number of properties came through." );

	child.attr( "data-other", "newvalue" );

	assert.equal( child.data( "other" ), "test", "Make sure value was pulled in properly from a .data()." );

	// attribute parsing
	i = 0;
	JSON.parse = function() {
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

	assert.strictEqual( child.data( "true" ), true, "Primitive true read from attribute" );
	assert.strictEqual( child.data( "false" ), false, "Primitive false read from attribute" );
	assert.strictEqual( child.data( "five" ), 5, "Integer read from attribute" );
	assert.strictEqual( child.data( "point" ), 5.5, "Floating-point number read from attribute" );
	assert.strictEqual( child.data( "pointe" ), "5.5E3",
		"Exponential-notation number read from attribute as string" );
	assert.strictEqual( child.data( "grande" ), "5.574E9",
		"Big exponential-notation number read from attribute as string" );
	assert.strictEqual( child.data( "hexadecimal" ), "0x42",
		"Hexadecimal number read from attribute as string" );
	assert.strictEqual( child.data( "pointbad" ), "5..5",
		"Extra-point non-number read from attribute as string" );
	assert.strictEqual( child.data( "pointbad2" ), "-.",
		"No-digit non-number read from attribute as string" );
	assert.strictEqual( child.data( "bigassnum" ), "123456789123456789123456789",
		"Bad bigass number read from attribute as string" );
	assert.strictEqual( child.data( "badjson" ), "{123}", "Bad JSON object read from attribute as string" );
	assert.strictEqual( child.data( "badjson2" ), "[abc]", "Bad JSON array read from attribute as string" );
	assert.strictEqual( child.data( "notjson" ), " {}",
		"JSON object with leading non-JSON read from attribute as string" );
	assert.strictEqual( child.data( "notjson2" ), "[] ",
		"JSON array with trailing non-JSON read from attribute as string" );
	assert.strictEqual( child.data( "empty" ), "", "Empty string read from attribute" );
	assert.strictEqual( child.data( "space" ), " ", "Whitespace string read from attribute" );
	assert.strictEqual( child.data( "null" ), null, "Primitive null read from attribute" );
	assert.strictEqual( child.data( "string" ), "test", "Typical string read from attribute" );
	assert.equal( i, 2, "Correct number of JSON parse attempts when reading from attributes" );

	JSON.parse = parseJSON;
	child.remove();

	// tests from metadata plugin
	function testData( index, elem ) {
		switch ( index ) {
		case 0:
			assert.equal( jQuery( elem ).data( "foo" ), "bar", "Check foo property" );
			assert.equal( jQuery( elem ).data( "bar" ), "baz", "Check baz property" );
			break;
		case 1:
			assert.equal( jQuery( elem ).data( "test" ), "bar", "Check test property" );
			assert.equal( jQuery( elem ).data( "bar" ), "baz", "Check bar property" );
			break;
		case 2:
			assert.equal( jQuery( elem ).data( "zoooo" ), "bar", "Check zoooo property" );
			assert.deepEqual( jQuery( elem ).data( "bar" ), { "test":"baz" }, "Check bar property" );
			break;
		case 3:
			assert.equal( jQuery( elem ).data( "number" ), true, "Check number property" );
			assert.deepEqual( jQuery( elem ).data( "stuff" ), [ 2, 8 ], "Check stuff property" );
			break;
		default:
			assert.ok( false, [ "Assertion failed on index ", index, ", with data" ].join( "" ) );
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
		div = jQuery( "<div></div>" );

	div.data( { "test": "in", "test2": "in2" } );
	assert.equal( div.data( "test" ), "in", "Verify setting an object in data" );
	assert.equal( div.data( "test2" ), "in2", "Verify setting an object in data" );

	obj = { test:"unset" };
	jqobj = jQuery( obj );

	jqobj.data( "test", "unset" );
	jqobj.data( { "test": "in", "test2": "in2" } );
	assert.equal( jQuery.data( obj )[ "test" ], "in", "Verify setting an object on an object extends the data object" );
	assert.equal( obj[ "test2" ], undefined, "Verify setting an object on an object does not extend the object" );

	// manually clean up detached elements
	div.remove();
} );

QUnit.test( "jQuery.removeData", function( assert ) {
	assert.expect( 10 );

	var obj,
		div = jQuery( "#foo" )[ 0 ];
	jQuery.data( div, "test", "testing" );
	jQuery.removeData( div, "test" );
	assert.equal( jQuery.data( div, "test" ), undefined, "Check removal of data" );

	jQuery.data( div, "test2", "testing" );
	jQuery.removeData( div );
	assert.ok( !jQuery.data( div, "test2" ), "Make sure that the data property no longer exists." );
	assert.ok( !div[ jQuery.expando ], "Make sure the expando no longer exists, as well." );

	jQuery.data( div, {
		test3: "testing",
		test4: "testing"
	} );
	jQuery.removeData( div, "test3 test4" );
	assert.ok( !jQuery.data( div, "test3" ) || jQuery.data( div, "test4" ), "Multiple delete with spaces." );

	jQuery.data( div, {
		test3: "testing",
		test4: "testing"
	} );
	jQuery.removeData( div, [ "test3", "test4" ] );
	assert.ok( !jQuery.data( div, "test3" ) || jQuery.data( div, "test4" ), "Multiple delete by array." );

	jQuery.data( div, {
		"test3 test4": "testing",
		"test3": "testing"
	} );
	jQuery.removeData( div, "test3 test4" );
	assert.ok( !jQuery.data( div, "test3 test4" ), "Multiple delete with spaces deleted key with exact name" );
	assert.ok( jQuery.data( div, "test3" ), "Left the partial matched key alone" );

	obj = {};
	jQuery.data( obj, "test", "testing" );
	assert.equal( jQuery( obj ).data( "test" ), "testing", "verify data on plain object" );
	jQuery.removeData( obj, "test" );
	assert.equal( jQuery.data( obj, "test" ), undefined, "Check removal of data on plain object" );

	jQuery.data( window, "BAD", true );
	jQuery.removeData( window, "BAD" );
	assert.ok( !jQuery.data( window, "BAD" ), "Make sure that the value was not still set." );
} );

QUnit.test( ".removeData()", function( assert ) {
	assert.expect( 6 );
	var div = jQuery( "#foo" );
	div.data( "test", "testing" );
	div.removeData( "test" );
	assert.equal( div.data( "test" ), undefined, "Check removal of data" );

	div.data( "test", "testing" );
	div.data( "test.foo", "testing2" );
	div.removeData( "test.bar" );
	assert.equal( div.data( "test.foo" ), "testing2", "Make sure data is intact" );
	assert.equal( div.data( "test" ), "testing", "Make sure data is intact" );

	div.removeData( "test" );
	assert.equal( div.data( "test.foo" ), "testing2", "Make sure data is intact" );
	assert.equal( div.data( "test" ), undefined, "Make sure data is intact" );

	div.removeData( "test.foo" );
	assert.equal( div.data( "test.foo" ), undefined, "Make sure data is intact" );
} );

if ( window.JSON && window.JSON.stringify ) {
	QUnit.test( "JSON serialization (#8108)", function( assert ) {
		assert.expect( 1 );

		var obj = { "foo": "bar" };
		jQuery.data( obj, "hidden", true );

		assert.equal( JSON.stringify( obj ), "{\"foo\":\"bar\"}", "Expando is hidden from JSON.stringify" );
	} );
}

QUnit.test( ".data should follow html5 specification regarding camel casing", function( assert ) {
	assert.expect( 12 );

	var div = jQuery( "<div id='myObject' data-w-t-f='ftw' data-big-a-little-a='bouncing-b' data-foo='a' data-foo-bar='b' data-foo-bar-baz='c'></div>" )
		.prependTo( "body" );

	assert.equal( div.data()[ "wTF" ], "ftw", "Verify single letter data-* key" );
	assert.equal( div.data()[ "bigALittleA" ], "bouncing-b", "Verify single letter mixed data-* key" );

	assert.equal( div.data()[ "foo" ], "a", "Verify single word data-* key" );
	assert.equal( div.data()[ "fooBar" ], "b", "Verify multiple word data-* key" );
	assert.equal( div.data()[ "fooBarBaz" ], "c", "Verify multiple word data-* key" );

	assert.equal( div.data( "foo" ), "a", "Verify single word data-* key" );
	assert.equal( div.data( "fooBar" ), "b", "Verify multiple word data-* key" );
	assert.equal( div.data( "fooBarBaz" ), "c", "Verify multiple word data-* key" );

	div.data( "foo-bar", "d" );

	assert.equal( div.data( "fooBar" ), "d", "Verify updated data-* key" );
	assert.equal( div.data( "foo-bar" ), "d", "Verify updated data-* key" );

	assert.equal( div.data( "fooBar" ), "d", "Verify updated data-* key (fooBar)" );
	assert.equal( div.data( "foo-bar" ), "d", "Verify updated data-* key (foo-bar)" );

	div.remove();
} );

QUnit.test( ".data should not miss preset data-* w/ hyphenated property names", function( assert ) {

	assert.expect( 2 );

	var div = jQuery( "<div></div>", { id: "hyphened" } ).appendTo( "#qunit-fixture" ),
		test = {
			"camelBar": "camelBar",
			"hyphen-foo": "hyphen-foo"
		};

	div.data( test );

	jQuery.each( test, function( i, k ) {
		assert.equal( div.data( k ), k, "data with property '" + k + "' was correctly found" );
	} );
} );

QUnit.test( "jQuery.data should not miss data-* w/ hyphenated property names #14047", function( assert ) {

	assert.expect( 1 );

	var div = jQuery( "<div></div>" );

	div.data( "foo-bar", "baz" );

	assert.equal( jQuery.data( div[ 0 ], "foo-bar" ), "baz", "data with property 'foo-bar' was correctly found" );
} );

QUnit.test( ".data should not miss attr() set data-* with hyphenated property names", function( assert ) {
	assert.expect( 2 );

	var a, b;

	a = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" );

	a.attr( "data-long-param", "test" );
	a.data( "long-param", { a: 2 } );

	assert.deepEqual( a.data( "long-param" ), { a: 2 }, "data with property long-param was found, 1" );

	b = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" );

	b.attr( "data-long-param", "test" );
	b.data( "long-param" );
	b.data( "long-param", { a: 2 } );

	assert.deepEqual( b.data( "long-param" ), { a: 2 }, "data with property long-param was found, 2" );
} );

QUnit.test( ".data always sets data with the camelCased key (gh-2257)", function( assert ) {
	assert.expect( 18 );

	var div = jQuery( "<div>" ).appendTo( "#qunit-fixture" ),
		datas = {
			"non-empty": {
				key: "nonEmpty",
				value: "a string"
			},
			"empty-string": {
				key: "emptyString",
				value: ""
			},
			"one-value": {
				key: "oneValue",
				value: 1
			},
			"zero-value": {
				key: "zeroValue",
				value: 0
			},
			"an-array": {
				key: "anArray",
				value: []
			},
			"an-object": {
				key: "anObject",
				value: {}
			},
			"bool-true": {
				key: "boolTrue",
				value: true
			},
			"bool-false": {
				key: "boolFalse",
				value: false
			},

			// JSHint enforces double quotes,
			// but JSON strings need double quotes to parse
			// so we need escaped double quotes here
			"some-json": {
				key: "someJson",
				value: "{ \"foo\": \"bar\" }"
			}
		};

	jQuery.each( datas, function( key, val ) {
		div.data( key, val.value );
		var allData = div.data();
		assert.equal( allData[ key ], undefined, ".data does not store with hyphenated keys" );
		assert.equal( allData[ val.key ], val.value, ".data stores the camelCased key" );
	} );
} );

QUnit.test( ".data should not strip more than one hyphen when camelCasing (gh-2070)", function( assert ) {
	assert.expect( 3 );
	var div = jQuery( "<div data-nested-single='single' data-nested--double='double' data-nested---triple='triple'></div>" ).appendTo( "#qunit-fixture" ),
		allData = div.data();

	assert.equal( allData.nestedSingle, "single", "Key is correctly camelCased" );
	assert.equal( allData[ "nested-Double" ], "double", "Key with double hyphens is correctly camelCased" );
	assert.equal( allData[ "nested--Triple" ], "triple", "Key with triple hyphens is correctly camelCased" );
} );

QUnit.test( ".data supports interoperable hyphenated/camelCase get/set of properties with arbitrary non-null|NaN|undefined values", function( assert ) {

	var div = jQuery( "<div></div>", { id: "hyphened" } ).appendTo( "#qunit-fixture" ),
		datas = {
			"non-empty": {
				key: "nonEmpty",
				value: "a string"
			},
			"empty-string": {
				key: "emptyString",
				value: ""
			},
			"one-value": {
				key: "oneValue",
				value: 1
			},
			"zero-value": {
				key: "zeroValue",
				value: 0
			},
			"an-array": {
				key: "anArray",
				value: []
			},
			"an-object": {
				key: "anObject",
				value: {}
			},
			"bool-true": {
				key: "boolTrue",
				value: true
			},
			"bool-false": {
				key: "boolFalse",
				value: false
			},

			// JSHint enforces double quotes,
			// but JSON strings need double quotes to parse
			// so we need escaped double quotes here
			"some-json": {
				key: "someJson",
				value: "{ \"foo\": \"bar\" }"
			},

			"num-1-middle": {
				key: "num-1Middle",
				value: true
			},
			"num-end-2": {
				key: "numEnd-2",
				value: true
			},
			"2-num-start": {
				key: "2NumStart",
				value: true
			}
		};

	assert.expect( 24 );

	jQuery.each( datas, function( key, val ) {
		div.data( key, val.value );

		assert.deepEqual( div.data( key ), val.value, "get: " + key );
		assert.deepEqual( div.data( val.key ), val.value, "get: " + val.key );
	} );
} );

QUnit.test( ".data supports interoperable removal of hyphenated/camelCase properties", function( assert ) {
	var div = jQuery( "<div></div>", { id: "hyphened" } ).appendTo( "#qunit-fixture" ),
		rdashAlpha = /-([a-z])/g,
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
			"some-json": "{ \"foo\": \"bar\" }"
		};

	assert.expect( 27 );

	function fcamelCase( all, letter ) {
		return letter.toUpperCase();
	}

	jQuery.each( datas, function( key, val ) {
		div.data( key, val );

		assert.deepEqual( div.data( key ), val, "get: " + key );
		assert.deepEqual(
			div.data( key.replace( rdashAlpha, fcamelCase ) ),
			val,
			"get: " + key.replace( rdashAlpha, fcamelCase )
		);

		div.removeData( key );

		assert.equal( div.data( key ), undefined, "get: " + key );

	} );
} );

QUnit.test( ".data supports interoperable removal of properties SET TWICE #13850", function( assert ) {
	var div = jQuery( "<div>" ).appendTo( "#qunit-fixture" ),
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
			"some-json": "{ \"foo\": \"bar\" }"
		};

	assert.expect( 9 );

	jQuery.each( datas, function( key, val ) {
		div.data( key, val );
		div.data( key, val );

		div.removeData( key );

		assert.equal( div.data( key ), undefined, "removal: " + key );
	} );
} );

QUnit.test( ".removeData supports removal of hyphenated properties via array (#12786, gh-2257)", function( assert ) {
	assert.expect( 4 );

	var div, plain, compare;

	div = jQuery( "<div>" ).appendTo( "#qunit-fixture" );
	plain = jQuery( {} );

	// Properties should always be camelCased
	compare = {

		// From batch assignment .data({ "a-a": 1 })
		"aA": 1,

		// From property, value assignment .data( "b-b", 1 )
		"bB": 1
	};

	// Mixed assignment
	div.data( { "a-a": 1 } ).data( "b-b", 1 );
	plain.data( { "a-a": 1 } ).data( "b-b", 1 );

	assert.deepEqual( div.data(), compare, "Data appears as expected. (div)" );
	assert.deepEqual( plain.data(), compare, "Data appears as expected. (plain)" );

	div.removeData( [ "a-a", "b-b" ] );
	plain.removeData( [ "a-a", "b-b" ] );

	assert.deepEqual( div.data(), {}, "Data is empty. (div)" );
	assert.deepEqual( plain.data(), {}, "Data is empty. (plain)" );
} );

// Test originally by Moschel
QUnit.test( ".removeData should not throw exceptions. (#10080)", function( assert ) {
	var done = assert.async();
	assert.expect( 1 );
	var frame = jQuery( "#loadediframe" );
	jQuery( frame[ 0 ].contentWindow ).on( "unload", function() {
		assert.ok( true, "called unload" );
		done();
	} );

	// change the url to trigger unload
	frame.attr( "src", baseURL + "iframe.html?param=true" );
} );

QUnit.test( ".data only checks element attributes once. #8909", function( assert ) {
	assert.expect( 2 );
	var testing = {
			"test": "testing",
			"test2": "testing"
		},
		element = jQuery( "<div data-test='testing'>" ),
		node = element[ 0 ];

	// set an attribute using attr to ensure it
	node.setAttribute( "data-test2", "testing" );
	assert.deepEqual( element.data(), testing, "Sanity Check" );

	node.setAttribute( "data-test3", "testing" );
	assert.deepEqual( element.data(), testing, "The data didn't change even though the data-* attrs did" );

	// clean up data cache
	element.remove();
} );

QUnit.test( "data-* with JSON value can have newlines", function( assert ) {
	assert.expect( 1 );

	var x = jQuery( "<div data-some='{\n\"foo\":\n\t\"bar\"\n}'></div>" );
	assert.equal( x.data( "some" ).foo, "bar", "got a JSON data- attribute with spaces" );
	x.remove();
} );

QUnit.test( ".data doesn't throw when calling selection is empty. #13551", function( assert ) {
	assert.expect( 1 );

	try {
		jQuery( null ).data( "prop" );
		assert.ok( true, "jQuery(null).data('prop') does not throw" );
	} catch ( e ) {
		assert.ok( false, e.message );
	}
} );

QUnit.test( "acceptData", function( assert ) {
	assert.expect( 10 );

	var flash, pdf, form;

	assert.equal( jQuery( document ).data( "test", 42 ).data( "test" ), 42, "document" );
	assert.equal( jQuery( document.documentElement ).data( "test", 42 ).data( "test" ), 42, "documentElement" );
	assert.equal( jQuery( {} ).data( "test", 42 ).data( "test" ), 42, "object" );
	assert.equal( jQuery( document.createElement( "embed" ) ).data( "test", 42 ).data( "test" ), 42, "embed" );

	flash = document.createElement( "object" );
	flash.setAttribute( "classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" );
	assert.equal( jQuery( flash ).data( "test", 42 ).data( "test" ), 42, "flash" );

	pdf = document.createElement( "object" );
	pdf.setAttribute( "classid", "clsid:CA8A9780-280D-11CF-A24D-444553540000" );
	assert.equal( jQuery( pdf ).data( "test", 42 ).data( "test" ), 42, "pdf" );

	assert.strictEqual( jQuery( document.createComment( "" ) ).data( "test", 42 ).data( "test" ), undefined, "comment" );
	assert.strictEqual( jQuery( document.createTextNode( "" ) ).data( "test", 42 ).data( "test" ), undefined, "text" );
	assert.strictEqual( jQuery( document.createDocumentFragment() ).data( "test", 42 ).data( "test" ), undefined, "documentFragment" );

	form = jQuery( "#form" ).append( "<input id='nodeType'/><input id='nodeName'/>" )[ 0 ];
	assert.equal( jQuery( form ) .data( "test", 42 ).data( "test" ), 42, "form with aliased DOM properties" );
} );

QUnit.test( "Check proper data removal of non-element descendants nodes (#8335)", function( assert ) {
	assert.expect( 1 );

	var div = jQuery( "<div>text</div>" ),
		text = div.contents();

	text.data( "test", "test" ); // This should be a noop.
	div.remove();

	assert.ok( !text.data( "test" ), "Be sure data is not stored in non-element" );
} );

testIframe(
	"enumerate data attrs on body (#14894)",
	"data/dataAttrs.html",
	function( assert, jQuery, window, document, result ) {
		assert.expect( 1 );
		assert.equal( result, "ok", "enumeration of data- attrs on body" );
	}
);

QUnit.test( "Check that the expando is removed when there's no more data", function( assert ) {
	assert.expect( 2 );

	var key,
		div = jQuery( "<div></div>" );
	div.data( "some", "data" );
	assert.equal( div.data( "some" ), "data", "Data is added" );
	div.removeData( "some" );

	// Make sure the expando is gone
	for ( key in div[ 0 ] ) {
		if ( /^jQuery/.test( key ) ) {
			assert.strictEqual( div[ 0 ][ key ], undefined, "Expando was not removed when there was no more data" );
		}
	}
} );

QUnit.test( "Check that the expando is removed when there's no more data on non-nodes", function( assert ) {
	assert.expect( 1 );

	var key,
		obj = jQuery( { key: 42 } );
	obj.data( "some", "data" );
	assert.equal( obj.data( "some" ), "data", "Data is added" );
	obj.removeData( "some" );

	// Make sure the expando is gone
	for ( key in obj[ 0 ] ) {
		if ( /^jQuery/.test( key ) ) {
			assert.ok( false, "Expando was not removed when there was no more data" );
		}
	}
} );

QUnit.test( ".data(prop) does not create expando", function( assert ) {
	assert.expect( 1 );

	var key,
		div = jQuery( "<div></div>" );

	div.data( "foo" );
	assert.equal( jQuery.hasData( div[ 0 ] ), false, "No data exists after access" );

	// Make sure no expando has been added
	for ( key in div[ 0 ] ) {
		if ( /^jQuery/.test( key ) ) {
			assert.ok( false, "Expando was created on access" );
		}
	}
} );

QUnit.test( ".data() returns a regular object (jQuery <4 only, gh-4665)", function( assert ) {
	assert.expect( 4 );

	function verifyRegularObject( assert, object ) {
		assert.strictEqual( object.hasOwnProperty, Object.prototype.hasOwnProperty,
			"Data object has the hasOwnProperty method" );
		assert.strictEqual( object + "", "[object Object]",
			"Data object can be stringified" );
	}

	var elem = jQuery( "<div></div>" );

	verifyRegularObject( assert, elem.data() );

	elem.data( "foo", "bar" );
	verifyRegularObject( assert, elem.data() );
} );
