module("data", { teardown: moduleTeardown });

test("expando", function(){
	expect(1);

	equal(jQuery.expando !== undefined, true, "jQuery is exposing the expando");
});

function dataTests (elem) {
	var oldCacheLength, dataObj, internalDataObj, expected, actual;

	equal( jQuery.data(elem, "foo"), undefined, "No data exists initially" );
	strictEqual( jQuery.hasData(elem), false, "jQuery.hasData agrees no data exists initially" );

	dataObj = jQuery.data(elem);
	equal( typeof dataObj, "object", "Calling data with no args gives us a data object reference" );
	strictEqual( jQuery.data(elem), dataObj, "Calling jQuery.data returns the same data object when called multiple times" );

	strictEqual( jQuery.hasData(elem), false, "jQuery.hasData agrees no data exists even when an empty data obj exists" );

	dataObj["foo"] = "bar";
	equal( jQuery.data(elem, "foo"), "bar", "Data is readable by jQuery.data when set directly on a returned data object" );

	strictEqual( jQuery.hasData(elem), true, "jQuery.hasData agrees data exists when data exists" );

	jQuery.data(elem, "foo", "baz");
	equal( jQuery.data(elem, "foo"), "baz", "Data can be changed by jQuery.data" );
	equal( dataObj["foo"], "baz", "Changes made through jQuery.data propagate to referenced data object" );

	jQuery.data(elem, "foo", undefined);
	equal( jQuery.data(elem, "foo"), "baz", "Data is not unset by passing undefined to jQuery.data" );

	jQuery.data(elem, "foo", null);
	strictEqual( jQuery.data(elem, "foo"), null, "Setting null using jQuery.data works OK" );

	jQuery.data(elem, "foo", "foo1");

	jQuery.data(elem, { "bar" : "baz", "boom" : "bloz" });
	strictEqual( jQuery.data(elem, "foo"), "foo1", "Passing an object extends the data object instead of replacing it" );
	equal( jQuery.data(elem, "boom"), "bloz", "Extending the data object works" );

	jQuery._data(elem, "foo", "foo2", true);
	equal( jQuery._data(elem, "foo"), "foo2", "Setting internal data works" );
	equal( jQuery.data(elem, "foo"), "foo1", "Setting internal data does not override user data" );

	internalDataObj = jQuery._data( elem );
	ok( internalDataObj, "Internal data object exists" );
	notStrictEqual( dataObj, internalDataObj, "Internal data object is not the same as user data object" );

	strictEqual( elem.boom, undefined, "Data is never stored directly on the object" );

	jQuery.removeData(elem, "foo");
	strictEqual( jQuery.data(elem, "foo"), undefined, "jQuery.removeData removes single properties" );

	jQuery.removeData(elem);
	strictEqual( jQuery._data(elem), internalDataObj, "jQuery.removeData does not remove internal data if it exists" );

	jQuery.data(elem, "foo", "foo1");
	jQuery._data(elem, "foo", "foo2");

	equal( jQuery.data(elem, "foo"), "foo1", "(sanity check) Ensure data is set in user data object" );
	equal( jQuery._data(elem, "foo"), "foo2", "(sanity check) Ensure data is set in internal data object" );

	strictEqual( jQuery._data(elem, jQuery.expando), undefined, "Removing the last item in internal data destroys the internal data object" );

	jQuery._data(elem, "foo", "foo2");
	equal( jQuery._data(elem, "foo"), "foo2", "(sanity check) Ensure data is set in internal data object" );

	jQuery.removeData(elem, "foo");
	equal( jQuery._data(elem, "foo"), "foo2", "(sanity check) jQuery.removeData for user data does not remove internal data" );
}

test("jQuery.data(div)", 25, function() {
	var div = document.createElement("div");

	dataTests(div);

	// We stored one key in the private data
	// assert that nothing else was put in there, and that that
	// one stayed there.
	QUnit.expectJqData(div, "foo");
});

test("jQuery.data({})", 25, function() {
	dataTests({});
});

test("jQuery.data(window)", 25, function() {
	// remove bound handlers from window object to stop potential false positives caused by fix for #5280 in
	// transports/xhr.js
	jQuery(window).unbind("unload");

	dataTests(window);
});

test("jQuery.data(document)", 25, function() {
	dataTests(document);

	QUnit.expectJqData(document, "foo");
});

test("Expando cleanup", 4, function() {
	var expected, actual,
		div = document.createElement("div");

	function assertExpandoAbsent(message) {
		if (jQuery.support.deleteExpando) {
			expected = false;
			actual = jQuery.expando in div;
		} else {
			expected = null;
			actual = div[ jQuery.expando ];
		}
		equal( actual, expected, message );
	}

	assertExpandoAbsent("There is no expando on new elements");

	jQuery.data(div, "foo", 100);
	jQuery.data(div, "bar", 200);

	ok(jQuery.expando in div, "There is an expando on the element after using $.data()");

	jQuery.removeData(div, "foo");

	ok(jQuery.expando in div, "There is still an expando on the element after removing (some) of the data");

	jQuery.removeData(div, "bar");

	assertExpandoAbsent("Removing the last item in the data store deletes the expando");

	// Clean up unattached element
	jQuery(div).remove();
});

test("Data is not being set on comment and text nodes", function() {
	expect(2);

	ok( !jQuery.hasData( jQuery("<!-- comment -->").data("foo", 0) ) );
	ok( !jQuery.hasData( jQuery("<span>text</span>").contents().data("foo", 0) ) );

});

test("jQuery.acceptData", function() {
	expect(9);

	ok( jQuery.acceptData( document ), "document" );
	ok( jQuery.acceptData( document.documentElement ), "documentElement" );
	ok( jQuery.acceptData( {} ), "object" );
	ok( !jQuery.acceptData( document.createElement("embed") ), "embed" );
	ok( !jQuery.acceptData( document.createElement("applet") ), "applet" );

	var flash = document.createElement("object");
	flash.setAttribute("classid", "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000");
	ok( jQuery.acceptData( flash ), "flash" );

	var applet = document.createElement("object");
	applet.setAttribute("classid", "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93");
	ok( !jQuery.acceptData( applet ), "applet" );

	ok( !jQuery.acceptData( document.createComment("") ), "comment" );
	ok( !jQuery.acceptData( document.createTextNode("") ), "text" );
});

test(".data()", function() {
	expect(5);

	var div = jQuery("#foo");
	strictEqual( div.data("foo"), undefined, "Make sure that missing result is undefined" );
	div.data("test", "success");

	var dataObj = div.data();

	deepEqual( dataObj, {test: "success"}, "data() returns entire data object with expected properties" );
	strictEqual( div.data("foo"), undefined, "Make sure that missing result is still undefined" );

	var nodiv = jQuery("#unfound");
	equal( nodiv.data(), null, "data() on empty set returns null" );

	var obj = { foo: "bar" };
	jQuery(obj).data("foo", "baz");

	dataObj = jQuery.extend(true, {}, jQuery(obj).data());

	deepEqual( dataObj, { "foo": "baz" }, "Retrieve data object from a wrapped JS object (#7524)" );
});

var testDataTypes = function( $obj ) {
	jQuery.each({
		"null": null,
		"true": true,
		"false": false,
		"zero": 0,
		"one": 1,
		"empty string": "",
		"empty array": [],
		"array": [1],
		"empty object": {},
		"object": { foo: "bar" },
		"date": new Date(),
		"regex": /test/,
		"function": function() {}
	}, function( type, value ) {
		strictEqual( $obj.data( "test", value ).data("test"), value, "Data set to " + type );
	});
};

test("jQuery(Element).data(String, Object).data(String)", function() {
	expect( 18 );
	var parent = jQuery("<div><div></div></div>"),
		div = parent.children();

	strictEqual( div.data("test"), undefined, "No data exists initially" );
	strictEqual( div.data("test", "success").data("test"), "success", "Data added" );
	strictEqual( div.data("test", "overwritten").data("test"), "overwritten", "Data overwritten" );
	strictEqual( div.data("test", undefined).data("test"), "overwritten", ".data(key,undefined) does nothing but is chainable (#5571)");
	strictEqual( div.data("notexist"), undefined, "No data exists for unset key" );
	testDataTypes( div );

	parent.remove();
});

test("jQuery(plain Object).data(String, Object).data(String)", function() {
	expect( 16 );

	// #3748
	var $obj = jQuery({ exists: true });
	strictEqual( $obj.data("nothing"), undefined, "Non-existent data returns undefined");
	strictEqual( $obj.data("exists"), undefined, "Object properties are not returned as data" );
	testDataTypes( $obj );

	// Clean up
	$obj.removeData();
	deepEqual( $obj[0], { exists: true }, "removeData does not clear the object" );
});

test("data-* attributes", function() {
	expect(40);
	var div = jQuery("<div>"),
		child = jQuery("<div data-myobj='old data' data-ignored=\"DOM\" data-other='test'></div>"),
		dummy = jQuery("<div data-myobj='old data' data-ignored=\"DOM\" data-other='test'></div>");

	equal( div.data("attr"), undefined, "Check for non-existing data-attr attribute" );

	div.attr("data-attr", "exists");
	equal( div.data("attr"), "exists", "Check for existing data-attr attribute" );

	div.attr("data-attr", "exists2");
	equal( div.data("attr"), "exists", "Check that updates to data- don't update .data()" );

	div.data("attr", "internal").attr("data-attr", "external");
	equal( div.data("attr"), "internal", "Check for .data('attr') precedence (internal > external data-* attribute)" );

	div.remove();

	child.appendTo("#qunit-fixture");
	equal( child.data("myobj"), "old data", "Value accessed from data-* attribute");

	child.data("myobj", "replaced");
	equal( child.data("myobj"), "replaced", "Original data overwritten");

	child.data("ignored", "cache");
	equal( child.data("ignored"), "cache", "Cached data used before DOM data-* fallback");

	var prop,
			obj = child.data(),
			obj2 = dummy.data(),
			check = [ "myobj", "ignored", "other" ],
			num = 0,
			num2 = 0;

	dummy.remove();

	for ( var i = 0, l = check.length; i < l; i++ ) {
		ok( obj[ check[i] ], "Make sure data- property exists when calling data-." );
		ok( obj2[ check[i] ], "Make sure data- property exists when calling data-." );
	}

	for ( prop in obj ) {
		num++;
	}

	equal( num, check.length, "Make sure that the right number of properties came through." );

	for ( prop in obj2 ) {
		num2++;
	}

	equal( num2, check.length, "Make sure that the right number of properties came through." );

	child.attr("data-other", "newvalue");

	equal( child.data("other"), "test", "Make sure value was pulled in properly from a .data()." );

	child
		.attr("data-true", "true")
		.attr("data-false", "false")
		.attr("data-five", "5")
		.attr("data-point", "5.5")
		.attr("data-pointe", "5.5E3")
		.attr("data-grande", "5.574E9")
		.attr("data-hexadecimal", "0x42")
		.attr("data-pointbad", "5..5")
		.attr("data-pointbad2", "-.")
		.attr("data-bigassnum", "123456789123456789123456789")
		.attr("data-badjson", "{123}")
		.attr("data-badjson2", "[abc]")
		.attr("data-empty", "")
		.attr("data-space", " ")
		.attr("data-null", "null")
		.attr("data-string", "test");

	strictEqual( child.data("true"), true, "Primitive true read from attribute");
	strictEqual( child.data("false"), false, "Primitive false read from attribute");
	strictEqual( child.data("five"), 5, "Primitive number read from attribute");
	strictEqual( child.data("point"), 5.5, "Primitive number read from attribute");
	strictEqual( child.data("pointe"), "5.5E3", "Floating point exponential number read from attribute");
	strictEqual( child.data("grande"), "5.574E9", "Big exponential number read from attribute");
	strictEqual( child.data("hexadecimal"), "0x42", "Hexadecimal number read from attribute");
	strictEqual( child.data("pointbad"), "5..5", "Bad number read from attribute");
	strictEqual( child.data("pointbad2"), "-.", "Bad number read from attribute");
	strictEqual( child.data("bigassnum"), "123456789123456789123456789", "Bad bigass number read from attribute");
	strictEqual( child.data("badjson"), "{123}", "Bad number read from attribute");
	strictEqual( child.data("badjson2"), "[abc]", "Bad number read from attribute");
	strictEqual( child.data("empty"), "", "Empty string read from attribute");
	strictEqual( child.data("space"), " ", "Empty string read from attribute");
	strictEqual( child.data("null"), null, "Primitive null read from attribute");
	strictEqual( child.data("string"), "test", "Typical string read from attribute");

	child.remove();

	// tests from metadata plugin
	function testData(index, elem) {
		switch (index) {
		case 0:
			equal(jQuery(elem).data("foo"), "bar", "Check foo property");
			equal(jQuery(elem).data("bar"), "baz", "Check baz property");
			break;
		case 1:
			equal(jQuery(elem).data("test"), "bar", "Check test property");
			equal(jQuery(elem).data("bar"), "baz", "Check bar property");
			break;
		case 2:
			equal(jQuery(elem).data("zoooo"), "bar", "Check zoooo property");
			deepEqual(jQuery(elem).data("bar"), {"test":"baz"}, "Check bar property");
			break;
		case 3:
			equal(jQuery(elem).data("number"), true, "Check number property");
			deepEqual(jQuery(elem).data("stuff"), [2,8], "Check stuff property");
			break;
		default:
			ok(false, ["Assertion failed on index ", index, ", with data"].join(""));
		}
	}

	var metadata = "<ol><li class='test test2' data-foo='bar' data-bar='baz' data-arr='[1,2]'>Some stuff</li><li class='test test2' data-test='bar' data-bar='baz'>Some stuff</li><li class='test test2' data-zoooo='bar' data-bar='{\"test\":\"baz\"}'>Some stuff</li><li class='test test2' data-number=true data-stuff='[2,8]'>Some stuff</li></ol>",
		elem = jQuery(metadata).appendTo("#qunit-fixture");

	elem.find("li").each(testData);
	elem.remove();
});

test(".data(Object)", function() {
	expect(4);

	var div = jQuery("<div/>");

	div.data({ "test": "in", "test2": "in2" });
	equal( div.data("test"), "in", "Verify setting an object in data" );
	equal( div.data("test2"), "in2", "Verify setting an object in data" );

	var obj = {test:"unset"},
		jqobj = jQuery(obj);
	jqobj.data("test", "unset");
	jqobj.data({ "test": "in", "test2": "in2" });
	equal( jQuery.data(obj)["test"], "in", "Verify setting an object on an object extends the data object" );
	equal( obj["test2"], undefined, "Verify setting an object on an object does not extend the object" );

	// manually clean up detached elements
	div.remove();
});

test("jQuery.removeData", function() {
	expect(10);
	var div = jQuery("#foo")[0];
	jQuery.data(div, "test", "testing");
	jQuery.removeData(div, "test");
	equal( jQuery.data(div, "test"), undefined, "Check removal of data" );

	jQuery.data(div, "test2", "testing");
	jQuery.removeData( div );
	ok( !jQuery.data(div, "test2"), "Make sure that the data property no longer exists." );
	ok( !div[ jQuery.expando ], "Make sure the expando no longer exists, as well." );

	jQuery.data(div, {
		test3: "testing",
		test4: "testing"
	});
	jQuery.removeData( div, "test3 test4" );
	ok( !jQuery.data(div, "test3") || jQuery.data(div, "test4"), "Multiple delete with spaces." );

	jQuery.data(div, {
		test3: "testing",
		test4: "testing"
	});
	jQuery.removeData( div, [ "test3", "test4" ] );
	ok( !jQuery.data(div, "test3") || jQuery.data(div, "test4"), "Multiple delete by array." );

	jQuery.data(div, {
		"test3 test4": "testing",
		"test3": "testing"
	});
	jQuery.removeData( div, "test3 test4" );
	ok( !jQuery.data(div, "test3 test4"), "Multiple delete with spaces deleted key with exact name" );
	ok( jQuery.data(div, "test3"), "Left the partial matched key alone" );

	var obj = {};
	jQuery.data(obj, "test", "testing");
	equal( jQuery(obj).data("test"), "testing", "verify data on plain object");
	jQuery.removeData(obj, "test");
	equal( jQuery.data(obj, "test"), undefined, "Check removal of data on plain object" );

	jQuery.data( window, "BAD", true );
	jQuery.removeData( window, "BAD" );
	ok( !jQuery.data( window, "BAD" ), "Make sure that the value was not still set." );
});

test(".removeData()", function() {
	expect(6);
	var div = jQuery("#foo");
	div.data("test", "testing");
	div.removeData("test");
	equal( div.data("test"), undefined, "Check removal of data" );

	div.data("test", "testing");
	div.data("test.foo", "testing2");
	div.removeData("test.bar");
	equal( div.data("test.foo"), "testing2", "Make sure data is intact" );
	equal( div.data("test"), "testing", "Make sure data is intact" );

	div.removeData("test");
	equal( div.data("test.foo"), "testing2", "Make sure data is intact" );
	equal( div.data("test"), undefined, "Make sure data is intact" );

	div.removeData("test.foo");
	equal( div.data("test.foo"), undefined, "Make sure data is intact" );
});

if (window.JSON && window.JSON.stringify) {
	test("JSON serialization (#8108)", function () {
		expect(1);

		var obj = { "foo": "bar" };
		jQuery.data(obj, "hidden", true);

		equal( JSON.stringify(obj), "{\"foo\":\"bar\"}", "Expando is hidden from JSON.stringify" );
	});
}

test("jQuery.data should follow html5 specification regarding camel casing", function() {
	expect(10);

	var div = jQuery("<div id='myObject' data-w-t-f='ftw' data-big-a-little-a='bouncing-b' data-foo='a' data-foo-bar='b' data-foo-bar-baz='c'></div>")
		.prependTo("body");

	equal( div.data()["wTF"], "ftw", "Verify single letter data-* key" );
	equal( div.data()["bigALittleA"], "bouncing-b", "Verify single letter mixed data-* key" );

	equal( div.data()["foo"], "a", "Verify single word data-* key" );
	equal( div.data()["fooBar"], "b", "Verify multiple word data-* key" );
	equal( div.data()["fooBarBaz"], "c", "Verify multiple word data-* key" );

	equal( div.data("foo"), "a", "Verify single word data-* key" );
	equal( div.data("fooBar"), "b", "Verify multiple word data-* key" );
	equal( div.data("fooBarBaz"), "c", "Verify multiple word data-* key" );

	div.data("foo-bar", "d");

	equal( div.data("fooBar"), "d", "Verify updated data-* key" );
	equal( div.data("foo-bar"), "d", "Verify updated data-* key" );

	div.remove();
});

test("jQuery.data should not miss data with preset hyphenated property names", function() {

	expect(2);

	var div = jQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
		test = {
			"camelBar": "camelBar",
			"hyphen-foo": "hyphen-foo"
		};

	div.data( test );

	jQuery.each( test , function(i, k) {
		equal( div.data(k), k, "data with property '"+k+"' was correctly found");
	});
});

test("jQuery.data supports interoperable hyphenated/camelCase get/set of properties with arbitrary non-null|NaN|undefined values", function() {

	var div = jQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
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
	});
});

test("jQuery.data supports interoperable removal of hyphenated/camelCase properties", function() {
	var div = jQuery("<div/>", { id: "hyphened" }).appendTo("#qunit-fixture"),
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

	expect( 27 );

	jQuery.each( datas, function( key, val ) {
		div.data( key, val );

		deepEqual( div.data( key ), val, "get: " + key );
		deepEqual( div.data( jQuery.camelCase( key ) ), val, "get: " + jQuery.camelCase( key ) );

		div.removeData( key );

		equal( div.data( key ), undefined, "get: " + key );

	});
});

test( "jQuery.fn.removeData supports removal of hyphenated properties via array (#12786)", function( assert ) {
	expect( 4 );

	var div, plain, compare;

	div = jQuery("<div>").appendTo("#qunit-fixture");
	plain = jQuery({});

	// When data is batch assigned (via plain object), the properties
	// are not camel cased as they are with (property, value) calls
	compare = {
		// From batch assignment .data({ "a-a": 1 })
		"a-a": 1,
		// From property, value assignment .data( "b-b", 1 )
		"bB": 1
	};

	// Mixed assignment
	div.data({ "a-a": 1 }).data( "b-b", 1 );
	plain.data({ "a-a": 1 }).data( "b-b", 1 );

	deepEqual( div.data(), compare, "Data appears as expected. (div)" );
	deepEqual( plain.data(), compare, "Data appears as expected. (plain)" );

	div.removeData([ "a-a", "b-b" ]);
	plain.removeData([ "a-a", "b-b" ]);

	// NOTE: Timo's proposal for "propEqual" (or similar) would be nice here
	deepEqual( div.data(), {}, "Data is empty. (div)" );
	deepEqual( plain.data(), {}, "Data is empty. (plain)" );
});

// Test originally by Moschel
test("Triggering the removeData should not throw exceptions. (#10080)", function() {
	expect(1);
	stop();
	var frame = jQuery("#loadediframe");
	jQuery(frame[0].contentWindow).bind("unload", function() {
		ok(true, "called unload");
		start();
	});
	// change the url to trigger unload
	frame.attr("src", "data/iframe.html?param=true");
});

test( "Only check element attributes once when calling .data() - #8909", function() {
	expect( 2 );
	var testing = {
			"test": "testing",
			"test2": "testing"
		},
		element = jQuery( "<div data-test='testing'>" ),
		node = element[ 0 ];

	// set an attribute using attr to ensure it
	node.setAttribute( "data-test2", "testing" );
	deepEqual( element.data(), testing, "Sanity Check" );

	node.setAttribute( "data-test3", "testing" );
	deepEqual( element.data(), testing, "The data didn't change even though the data-* attrs did" );

	// clean up data cache
	element.remove();
});

test( "JSON data- attributes can have newlines", function() {
	expect(1);

	var x = jQuery("<div data-some='{\n\"foo\":\n\t\"bar\"\n}'></div>");
	equal( x.data("some").foo, "bar", "got a JSON data- attribute with spaces" );
	x.remove();
});
