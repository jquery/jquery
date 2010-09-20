module("data");

test("expando", function(){
	expect(7);
	
	equals("expando" in jQuery, true, "jQuery is exposing the expando");
	
	var obj = {};
	jQuery.data(obj);
	equals( jQuery.expando in obj, true, "jQuery.data adds an expando to the object" );
	equals( typeof obj[jQuery.expando], "function", "jQuery.data adds an expando to the object as a function" );

	obj = {};	
	jQuery.data(obj, 'test');
	equals( jQuery.expando in obj, false, "jQuery.data did not add an expando to the object" );

	obj = {};
	jQuery.data(obj, "foo", "bar");
	equals( jQuery.expando in obj, true, "jQuery.data added an expando to the object" );
	
	var id = obj[jQuery.expando]();
	equals( id in jQuery.cache, false, "jQuery.data did not add an entry to jQuery.cache" );
	
	equals( id.foo, "bar", "jQuery.data worked correctly" );
});

test("jQuery.data", function() {
	expect(12);
	var div = document.createElement("div");

	ok( jQuery.data(div, "test") === undefined, "Check for no data exists" );
	
	jQuery.data(div, "test", "success");
	equals( jQuery.data(div, "test"), "success", "Check for added data" );

	ok( jQuery.data(div, "notexist") === undefined, "Check for no data exists" );
	
	var data = jQuery.data(div);
	same( data, { "test": "success" }, "Return complete data set" );
	
	jQuery.data(div, "test", "overwritten");
	equals( jQuery.data(div, "test"), "overwritten", "Check for overwritten data" );
	
	jQuery.data(div, "test", undefined);
	equals( jQuery.data(div, "test"), "overwritten", "Check that data wasn't removed");
	
	jQuery.data(div, "test", null);
	ok( jQuery.data(div, "test") === null, "Check for null data");

	jQuery.data(div, { "test": "in", "test2": "in2" });
	equals( jQuery.data(div, "test"), "in", "Verify setting an object in data." );
	equals( jQuery.data(div, "test2"), "in2", "Verify setting an object in data." );

	var obj = {};
	jQuery.data( obj, "prop", true );

	ok( obj[ jQuery.expando ], "Data is being stored on the object." );
	ok( obj[ jQuery.expando ]().prop, "Data is being stored on the object." );

	equals( jQuery.data( obj, "prop" ), true, "Make sure the right value is retrieved." );
});

test(".data()", function() {
	expect(1);

	var div = jQuery("#foo");
	div.data("test", "success");
	same( div.data(), {test: "success"}, "data() get the entire data object" )
})

test(".data(String) and .data(String, Object)", function() {
	expect(27);
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
	var $elem = jQuery({});
	equals( $elem.data('nothing'), undefined, "Non-existent data returns undefined");
	equals( $elem.data('null',null).data('null'), null, "null's are preserved");
	equals( $elem.data('emptyString','').data('emptyString'), '', "Empty strings are preserved");
	equals( $elem.data('false',false).data('false'), false, "false's are preserved");
	
	// Clean up
	$elem.removeData();
});

test("data-* attributes", function() {
	expect(19);
	var div = jQuery("<div>"),
		child = jQuery("<div data-myobj='old data' data-ignored=\"DOM\"></div>");
		
	equals( div.data("attr"), undefined, "Check for non-existing data-attr attribute" );

	div.attr("data-attr", "exists");
	equals( div.data("attr"), "exists", "Check for existing data-attr attribute" );
		
	div.data("attr", "internal").attr("data-attr", "external");
	equals( div.data("attr"), "internal", "Check for .data('attr') precedence (internal > external data-* attribute)" );
	
	child.appendTo('#main');
	equals( child.data("myobj"), "old data", "Value accessed from data-* attribute");

	child.data("myobj", "replaced");
	equals( child.data("myobj"), "replaced", "Original data overwritten");

	child.data("ignored", "cache");
	equals( child.data("ignored"), "cache", "Cached data used before DOM data-* fallback");

	child
		.attr("data-true", "true")
		.attr("data-false", "false")
		.attr("data-five", "5")
		.attr("data-null", "null")
		.attr("data-string", "test");
	
	equals( child.data('true'), true, "Primitive true read from attribute");
	equals( child.data('false'), false, "Primitive false read from attribute");
	equals( child.data('five'), 5, "Primitive number read from attribute");
	equals( child.data('null'), null, "Primitive null read from attribute");
	equals( child.data('string'), "test", "Typical string read from attribute");

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
			equals(jQuery(elem).data("bar"), '{"test":"baz"}', "Check bar property");
			break;
		case 3:
			equals(jQuery(elem).data("number"), true, "Check number property");
			equals(jQuery(elem).data("stuff"), "[2,8]", "Check stuff property");
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
	expect(2);

	var div = jQuery("<div/>");

	div.data({ "test": "in", "test2": "in2" });
	equals( div.data("test"), "in", "Verify setting an object in data." );
	equals( div.data("test2"), "in2", "Verify setting an object in data." );
});

test("jQuery.removeData", function() {
	expect(1);
	var div = jQuery("#foo")[0];
	jQuery.data(div, "test", "testing");
	jQuery.removeData(div, "test");
	equals( jQuery.data(div, "test"), undefined, "Check removal of data" );
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
