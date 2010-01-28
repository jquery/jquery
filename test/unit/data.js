module("data");

test("expando", function(){
	expect(6);
	
	equals("expando" in jQuery, true, "jQuery is exposing the expando");
	
	var obj = {};
	jQuery.data(obj);
	equals( jQuery.expando in obj, true, "jQuery.data adds an expando to the object" );

	obj = {};	
	jQuery.data(obj, 'test');
	equals( jQuery.expando in obj, false, "jQuery.data did not add an expando to the object" );

	obj = {};
	jQuery.data(obj, "foo", "bar");
	equals( jQuery.expando in obj, true, "jQuery.data added an expando to the object" );
	
	var id = obj[jQuery.expando];
	equals( id in jQuery.cache, true, "jQuery.data added an entry to jQuery.cache" );
	
	equals( jQuery.cache[id].foo, "bar", "jQuery.data worked correctly" );
});

test("jQuery.data", function() {
	expect(8);
	var div = jQuery("#foo")[0];
	equals( jQuery.data(div, "test"), undefined, "Check for no data exists" );
	
	jQuery.data(div, "test", "success");
	equals( jQuery.data(div, "test"), "success", "Check for added data" );
	
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
});

test(".data()", function() {
	expect(1);

	var div = jQuery("#foo");
	div.data("test", "success");
	same( div.data(), {test: "success"}, "data() get the entire data object" )
})

test(".data(String) and .data(String, Object)", function() {
	expect(22);
	var div = jQuery("#foo");
	equals( div.data("test"), undefined, "Check for no data exists" );
	div.data("test", "success");
	equals( div.data("test"), "success", "Check for added data" );
	div.data("test", "overwritten");
	equals( div.data("test"), "overwritten", "Check for overwritten data" );
	div.data("test", undefined);
	equals( div.data("test"), "overwritten", "Check that data wasn't removed");
	div.data("test", null);
	ok( div.data("test") === null, "Check for null data");

	div.data("test", "overwritten");
	var hits = {test:0}, gets = {test:0};

	div
		.bind("setData",function(e,key,value){ hits[key] += value; })
		.bind("setData.foo",function(e,key,value){ hits[key] += value; })
		.bind("getData",function(e,key){ gets[key] += 1; })
		.bind("getData.foo",function(e,key){ gets[key] += 3; });

	div.data("test.foo", 2);
	equals( div.data("test"), "overwritten", "Check for original data" );
	equals( div.data("test.foo"), 2, "Check for namespaced data" );
	equals( div.data("test.bar"), "overwritten", "Check for unmatched namespace" );
	equals( hits.test, 2, "Check triggered setter functions" );
	equals( gets.test, 5, "Check triggered getter functions" );

	hits.test = 0;
	gets.test = 0;

	div.data("test", 1);
	equals( div.data("test"), 1, "Check for original data" );
	equals( div.data("test.foo"), 2, "Check for namespaced data" );
	equals( div.data("test.bar"), 1, "Check for unmatched namespace" );
	equals( hits.test, 1, "Check triggered setter functions" );
	equals( gets.test, 5, "Check triggered getter functions" );

	hits.test = 0;
	gets.test = 0;

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
