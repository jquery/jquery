module("data", { teardown: moduleTeardown });

test("expando", function(){
	expect(1);

	equals("expando" in jQuery, true, "jQuery is exposing the expando");
});

function dataTests (elem) {
	// expect(32)

	function getCacheLength() {
		var cacheLength = 0;
		for (var i in jQuery.cache) {
			++cacheLength;
		}

		return cacheLength;
	}

	equals( jQuery.data(elem, "foo"), undefined, "No data exists initially" );
	strictEqual( jQuery.hasData(elem), false, "jQuery.hasData agrees no data exists initially" );

	var dataObj = jQuery.data(elem);
	equals( typeof dataObj, "object", "Calling data with no args gives us a data object reference" );
	strictEqual( jQuery.data(elem), dataObj, "Calling jQuery.data returns the same data object when called multiple times" );

	strictEqual( jQuery.hasData(elem), false, "jQuery.hasData agrees no data exists even when an empty data obj exists" );

	dataObj.foo = "bar";
	equals( jQuery.data(elem, "foo"), "bar", "Data is readable by jQuery.data when set directly on a returned data object" );

	strictEqual( jQuery.hasData(elem), true, "jQuery.hasData agrees data exists when data exists" );

	jQuery.data(elem, "foo", "baz");
	equals( jQuery.data(elem, "foo"), "baz", "Data can be changed by jQuery.data" );
	equals( dataObj.foo, "baz", "Changes made through jQuery.data propagate to referenced data object" );

	jQuery.data(elem, "foo", undefined);
	equals( jQuery.data(elem, "foo"), "baz", "Data is not unset by passing undefined to jQuery.data" );

	jQuery.data(elem, "foo", null);
	strictEqual( jQuery.data(elem, "foo"), null, "Setting null using jQuery.data works OK" );

	jQuery.data(elem, "foo", "foo1");

	jQuery.data(elem, { "bar" : "baz", "boom" : "bloz" });
	strictEqual( jQuery.data(elem, "foo"), "foo1", "Passing an object extends the data object instead of replacing it" );
	equals( jQuery.data(elem, "boom"), "bloz", "Extending the data object works" );

	jQuery._data(elem, "foo", "foo2");
	equals( jQuery._data(elem, "foo"), "foo2", "Setting internal data works" );
	equals( jQuery.data(elem, "foo"), "foo1", "Setting internal data does not override user data" );

	var internalDataObj = jQuery.data(elem, jQuery.expando);
	strictEqual( jQuery._data(elem), internalDataObj, "Internal data object is accessible via jQuery.expando property" );
	notStrictEqual( dataObj, internalDataObj, "Internal data object is not the same as user data object" );

	strictEqual( elem.boom, undefined, "Data is never stored directly on the object" );

	jQuery.removeData(elem, "foo");
	strictEqual( jQuery.data(elem, "foo"), undefined, "jQuery.removeData removes single properties" );

	jQuery.removeData(elem);
	strictEqual( jQuery.data(elem, jQuery.expando), internalDataObj, "jQuery.removeData does not remove internal data if it exists" );

	jQuery.removeData(elem, undefined, true);

	strictEqual( jQuery.data(elem, jQuery.expando), undefined, "jQuery.removeData on internal data works" );
	strictEqual( jQuery.hasData(elem), false, "jQuery.hasData agrees all data has been removed from object" );

	jQuery._data(elem, "foo", "foo2");
	strictEqual( jQuery.hasData(elem), true, "jQuery.hasData shows data exists even if it is only internal data" );

	jQuery.data(elem, "foo", "foo1");
	equals( jQuery._data(elem, "foo"), "foo2", "Setting user data does not override internal data" );

	jQuery.removeData(elem, undefined, true);
	equals( jQuery.data(elem, "foo"), "foo1", "jQuery.removeData for internal data does not remove user data" );

	if (elem.nodeType) {
		var oldCacheLength = getCacheLength();
		jQuery.removeData(elem, "foo");

		equals( getCacheLength(), oldCacheLength - 1, "Removing the last item in the data object destroys it" );
	}
	else {
		jQuery.removeData(elem, "foo");
		var expected, actual;

		if (jQuery.support.deleteExpando) {
			expected = false;
			actual = jQuery.expando in elem;
		}
		else {
			expected = null;
			actual = elem[ jQuery.expando ];
		}

		equals( actual, expected, "Removing the last item in the data object destroys it" );
	}

	jQuery.data(elem, "foo", "foo1");
	jQuery._data(elem, "foo", "foo2");

	equals( jQuery.data(elem, "foo"), "foo1", "(sanity check) Ensure data is set in user data object" );
	equals( jQuery._data(elem, "foo"), "foo2", "(sanity check) Ensure data is set in internal data object" );

	jQuery.removeData(elem, "foo", true);

	strictEqual( jQuery.data(elem, jQuery.expando), undefined, "Removing the last item in internal data destroys the internal data object" );

	jQuery._data(elem, "foo", "foo2");
	equals( jQuery._data(elem, "foo"), "foo2", "(sanity check) Ensure data is set in internal data object" );

	jQuery.removeData(elem, "foo");
	equals( jQuery._data(elem, "foo"), "foo2", "(sanity check) jQuery.removeData for user data does not remove internal data" );

	if (elem.nodeType) {
		oldCacheLength = getCacheLength();
		jQuery.removeData(elem, "foo", true);
		equals( getCacheLength(), oldCacheLength - 1, "Removing the last item in the internal data object also destroys the user data object when it is empty" );
	}
	else {
		jQuery.removeData(elem, "foo", true);

		if (jQuery.support.deleteExpando) {
			expected = false;
			actual = jQuery.expando in elem;
		}
		else {
			expected = null;
			actual = elem[ jQuery.expando ];
		}

		equals( actual, expected, "Removing the last item in the internal data object also destroys the user data object when it is empty" );
	}
}

test("jQuery.data", function() {
	expect(128);

	var div = document.createElement("div");

	dataTests(div);
	dataTests({});

	// remove bound handlers from window object to stop potential false positives caused by fix for #5280 in
	// transports/xhr.js
	jQuery(window).unbind("unload");

	dataTests(window);
	dataTests(document);

	// clean up unattached element
	jQuery(div).remove();
});

test("jQuery.acceptData", function() {
	expect(7);

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
});

test(".data()", function() {
	expect(5);

	var div = jQuery("#foo");
	strictEqual( div.data("foo"), undefined, "Make sure that missing result is undefined" );
	div.data("test", "success");

	var dataObj = div.data();

	// TODO: Remove this hack which was introduced in 1.5.1
	delete dataObj.toJSON;

	same( dataObj, {test: "success"}, "data() get the entire data object" );
	strictEqual( div.data("foo"), undefined, "Make sure that missing result is still undefined" );

	var nodiv = jQuery("#unfound");
	equals( nodiv.data(), null, "data() on empty set returns null" );

	var obj = { foo: "bar" };
	jQuery(obj).data("foo", "baz");

	dataObj = jQuery.extend(true, {}, jQuery(obj).data());

	// TODO: Remove this hack which was introduced for 1.5.1
	delete dataObj.toJSON;

	deepEqual( dataObj, { foo: "baz" }, "Retrieve data object from a wrapped JS object (#7524)" );
});

test(".data(String) and .data(String, Object)", function() {
	expect(29);
	var parent = jQuery("<div><div></div></div>"),
		div = parent.children();

	parent
		.bind("getData", function(){ ok( false, "getData bubbled." ) })
		.bind("setData", function(){ ok( false, "setData bubbled." ) })
		.bind("changeData", function(){ ok( false, "changeData bubbled." ) });

	ok( div.data("test") === undefined, "Check for no data exists" );

	div.data("test", "success");
	equals( div.data("test"), "success", "Check for added data" );

	div.data("test", "overwritten");
	equals( div.data("test"), "overwritten", "Check for overwritten data" );

	div.data("test", undefined);
	equals( div.data("test"), "overwritten", "Check that data wasn't removed");

	div.data("test", null);
	ok( div.data("test") === null, "Check for null data");

	ok( div.data("notexist") === undefined, "Check for no data exists" );

	div.data("test", "overwritten");
	var hits = {test:0}, gets = {test:0}, changes = {test:0, value:null};


	function logChangeData(e,key,value) {
		var dataKey = key;
		if ( e.namespace ) {
			dataKey = dataKey + "." + e.namespace;
		}
		changes[key] += value;
		changes.value = jQuery.data(e.target, dataKey);
	}

	div
		.bind("setData",function(e,key,value){ hits[key] += value; })
		.bind("setData.foo",function(e,key,value){ hits[key] += value; })
		.bind("changeData",logChangeData)
		.bind("changeData.foo",logChangeData)
		.bind("getData",function(e,key){ gets[key] += 1; })
		.bind("getData.foo",function(e,key){ gets[key] += 3; });

	div.data("test.foo", 2);
	equals( div.data("test"), "overwritten", "Check for original data" );
	equals( div.data("test.foo"), 2, "Check for namespaced data" );
	equals( div.data("test.bar"), "overwritten", "Check for unmatched namespace" );
	equals( hits.test, 2, "Check triggered setter functions" );
	equals( gets.test, 5, "Check triggered getter functions" );
	equals( changes.test, 2, "Check sets raise changeData");
	equals( changes.value, 2, "Check changeData after data has been set" );

	hits.test = 0;
	gets.test = 0;
	changes.test = 0;
	changes.value = null;

	div.data("test", 1);
	equals( div.data("test"), 1, "Check for original data" );
	equals( div.data("test.foo"), 2, "Check for namespaced data" );
	equals( div.data("test.bar"), 1, "Check for unmatched namespace" );
	equals( hits.test, 1, "Check triggered setter functions" );
	equals( gets.test, 5, "Check triggered getter functions" );
	equals( changes.test, 1, "Check sets raise changeData" );
	equals( changes.value, 1, "Check changeData after data has been set" );

	div
		.bind("getData",function(e,key){ return key + "root"; })
		.bind("getData.foo",function(e,key){ return key + "foo"; });

	equals( div.data("test"), "testroot", "Check for original data" );
	equals( div.data("test.foo"), "testfoo", "Check for namespaced data" );
	equals( div.data("test.bar"), "testroot", "Check for unmatched namespace" );

	// #3748
	var $elem = jQuery({exists:true});
	equals( $elem.data('nothing'), undefined, "Non-existent data returns undefined");
	equals( $elem.data('null',null).data('null'), null, "null's are preserved");
	equals( $elem.data('emptyString','').data('emptyString'), '', "Empty strings are preserved");
	equals( $elem.data('false',false).data('false'), false, "false's are preserved");
	equals( $elem.data('exists'), undefined, "Existing data is not returned" );

	// Clean up
	$elem.removeData();
	deepEqual( $elem[0], {exists:true}, "removeData does not clear the object" );

	// manually clean up detached elements
	parent.remove();
});

test("data-* attributes", function() {
	expect(37);
	var div = jQuery("<div>"),
		child = jQuery("<div data-myobj='old data' data-ignored=\"DOM\" data-other='test'></div>"),
		dummy = jQuery("<div data-myobj='old data' data-ignored=\"DOM\" data-other='test'></div>");

	equals( div.data("attr"), undefined, "Check for non-existing data-attr attribute" );

	div.attr("data-attr", "exists");
	equals( div.data("attr"), "exists", "Check for existing data-attr attribute" );

	div.attr("data-attr", "exists2");
	equals( div.data("attr"), "exists", "Check that updates to data- don't update .data()" );

	div.data("attr", "internal").attr("data-attr", "external");
	equals( div.data("attr"), "internal", "Check for .data('attr') precedence (internal > external data-* attribute)" );

	div.remove();

	child.appendTo('#main');
	equals( child.data("myobj"), "old data", "Value accessed from data-* attribute");

	child.data("myobj", "replaced");
	equals( child.data("myobj"), "replaced", "Original data overwritten");

	child.data("ignored", "cache");
	equals( child.data("ignored"), "cache", "Cached data used before DOM data-* fallback");

	var obj = child.data(), obj2 = dummy.data(), check = [ "myobj", "ignored", "other" ], num = 0, num2 = 0;

	dummy.remove();

	for ( var i = 0, l = check.length; i < l; i++ ) {
		ok( obj[ check[i] ], "Make sure data- property exists when calling data-." );
		ok( obj2[ check[i] ], "Make sure data- property exists when calling data-." );
	}

	for ( var prop in obj ) {
		num++;
	}

	equals( num, check.length, "Make sure that the right number of properties came through." );

	for ( var prop in obj2 ) {
		num2++;
	}

	equals( num2, check.length, "Make sure that the right number of properties came through." );

	child.attr("data-other", "newvalue");

	equals( child.data("other"), "test", "Make sure value was pulled in properly from a .data()." );

	child
		.attr("data-true", "true")
		.attr("data-false", "false")
		.attr("data-five", "5")
		.attr("data-point", "5.5")
		.attr("data-pointe", "5.5E3")
		.attr("data-pointbad", "5..5")
		.attr("data-pointbad2", "-.")
		.attr("data-badjson", "{123}")
		.attr("data-badjson2", "[abc]")
		.attr("data-empty", "")
		.attr("data-space", " ")
		.attr("data-null", "null")
		.attr("data-string", "test");

	strictEqual( child.data('true'), true, "Primitive true read from attribute");
	strictEqual( child.data('false'), false, "Primitive false read from attribute");
	strictEqual( child.data('five'), 5, "Primitive number read from attribute");
	strictEqual( child.data('point'), 5.5, "Primitive number read from attribute");
	strictEqual( child.data('pointe'), 5500, "Primitive number read from attribute");
	strictEqual( child.data('pointbad'), "5..5", "Bad number read from attribute");
	strictEqual( child.data('pointbad2'), "-.", "Bad number read from attribute");
	strictEqual( child.data('badjson'), "{123}", "Bad number read from attribute");
	strictEqual( child.data('badjson2'), "[abc]", "Bad number read from attribute");
	strictEqual( child.data('empty'), "", "Empty string read from attribute");
	strictEqual( child.data('space'), " ", "Empty string read from attribute");
	strictEqual( child.data('null'), null, "Primitive null read from attribute");
	strictEqual( child.data('string'), "test", "Typical string read from attribute");

	child.remove();

	// tests from metadata plugin
	function testData(index, elem) {
		switch (index) {
		case 0:
			equals(jQuery(elem).data("foo"), "bar", "Check foo property");
			equals(jQuery(elem).data("bar"), "baz", "Check baz property");
			break;
		case 1:
			equals(jQuery(elem).data("test"), "bar", "Check test property");
			equals(jQuery(elem).data("bar"), "baz", "Check bar property");
			break;
		case 2:
			equals(jQuery(elem).data("zoooo"), "bar", "Check zoooo property");
			same(jQuery(elem).data("bar"), {"test":"baz"}, "Check bar property");
			break;
		case 3:
			equals(jQuery(elem).data("number"), true, "Check number property");
			same(jQuery(elem).data("stuff"), [2,8], "Check stuff property");
			break;
		default:
			ok(false, ["Assertion failed on index ", index, ", with data ", data].join(''));
		}
	}

	var metadata = '<ol><li class="test test2" data-foo="bar" data-bar="baz" data-arr="[1,2]">Some stuff</li><li class="test test2" data-test="bar" data-bar="baz">Some stuff</li><li class="test test2" data-zoooo="bar" data-bar=\'{"test":"baz"}\'>Some stuff</li><li class="test test2" data-number=true data-stuff="[2,8]">Some stuff</li></ol>',
		elem = jQuery(metadata).appendTo('#main');

	elem.find("li").each(testData);
	elem.remove();
});

test(".data(Object)", function() {
	expect(4);

	var div = jQuery("<div/>");

	div.data({ "test": "in", "test2": "in2" });
	equals( div.data("test"), "in", "Verify setting an object in data" );
	equals( div.data("test2"), "in2", "Verify setting an object in data" );

	var obj = {test:"unset"},
		jqobj = jQuery(obj);
	jqobj.data("test", "unset");
	jqobj.data({ "test": "in", "test2": "in2" });
	equals( jQuery.data(obj).test, "in", "Verify setting an object on an object extends the data object" );
	equals( obj.test2, undefined, "Verify setting an object on an object does not extend the object" );

	// manually clean up detached elements
	div.remove();
});

test("jQuery.removeData", function() {
	expect(6);
	var div = jQuery("#foo")[0];
	jQuery.data(div, "test", "testing");
	jQuery.removeData(div, "test");
	equals( jQuery.data(div, "test"), undefined, "Check removal of data" );

	jQuery.data(div, "test2", "testing");
	jQuery.removeData( div );
	ok( !jQuery.data(div, "test2"), "Make sure that the data property no longer exists." );
	ok( !div[ jQuery.expando ], "Make sure the expando no longer exists, as well." );

	var obj = {};
	jQuery.data(obj, "test", "testing");
	equals( jQuery(obj).data("test"), "testing", "verify data on plain object");
	jQuery.removeData(obj, "test");
	equals( jQuery.data(obj, "test"), undefined, "Check removal of data on plain object" );

	jQuery.data( window, "BAD", true );
	jQuery.removeData( window, "BAD" );
	ok( !jQuery.data( window, "BAD" ), "Make sure that the value was not still set." );
});

test(".removeData()", function() {
	expect(6);
	var div = jQuery("#foo");
	div.data("test", "testing");
	div.removeData("test");
	equals( div.data("test"), undefined, "Check removal of data" );

	div.data("test", "testing");
	div.data("test.foo", "testing2");
	div.removeData("test.bar");
	equals( div.data("test.foo"), "testing2", "Make sure data is intact" );
	equals( div.data("test"), "testing", "Make sure data is intact" );

	div.removeData("test");
	equals( div.data("test.foo"), "testing2", "Make sure data is intact" );
	equals( div.data("test"), undefined, "Make sure data is intact" );

	div.removeData("test.foo");
	equals( div.data("test.foo"), undefined, "Make sure data is intact" );
});

if (window.JSON && window.JSON.stringify) {
	test("JSON serialization (#8108)", function () {
		expect(1);

		var obj = { foo: "bar" };
		jQuery.data(obj, "hidden", true);

		equals( JSON.stringify(obj), '{"foo":"bar"}', "Expando is hidden from JSON.stringify" );
	});
}