module("data");

test("jQuery.data", function() {
	expect(5);
	var div = jQuery("#foo")[0];
	equals( jQuery.data(div, "test"), undefined, "Check for no data exists" );
	jQuery.data(div, "test", "success");
	equals( jQuery.data(div, "test"), "success", "Check for added data" );
	jQuery.data(div, "test", "overwritten");
	equals( jQuery.data(div, "test"), "overwritten", "Check for overwritten data" );
	jQuery.data(div, "test", undefined);
	equals( jQuery.data(div, "test"), "overwritten", "Check that data wasn't removed");
	jQuery.data(div, "test", null);
	ok( jQuery.data(div, "test") === null, "Check for null data");
});

test(".data()", function() {
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

test("queue() defaults to 'fx' type", function () {
	expect(2);
	stop();

	var $foo = jQuery("#foo");
	$foo.queue("fx", [ "sample", "array" ]);
	var arr = $foo.queue();
	isSet(arr, [ "sample", "array" ], "queue() got an array set with type 'fx'");
	$foo.queue([ "another", "one" ]);
	var arr = $foo.queue("fx");
	isSet(arr, [ "another", "one" ], "queue('fx') got an array set with no type");
	// clean up after test
	$foo.queue([]);

	start();
});

test("queue() with other types",function() {
	expect(9);
	var counter = 0;
	
	var $div = jQuery({});
	
	$div
		.queue('foo',function(){
			equals( ++counter, 1, "Dequeuing" );
			jQuery.dequeue(this,'foo');
		})
		.queue('foo',function(){
			equals( ++counter, 2, "Dequeuing" );
			jQuery(this).dequeue('foo');
		})
		.queue('foo',function(){
			equals( ++counter, 3, "Dequeuing" );
		})
		.queue('foo',function(){
			equals( ++counter, 4, "Dequeuing" );
		});
		
	equals( $div.queue('foo').length, 4, "Testing queue length" );
	
	$div.dequeue('foo');
	
	equals( counter, 3, "Testing previous call to dequeue" );
	equals( $div.queue('foo').length, 1, "Testing queue length" );
	
	$div.dequeue('foo');
	
	equals( counter, 4, "Testing previous call to dequeue" );
	equals( $div.queue('foo').length, 0, "Testing queue length" );
	
	// Clean up
	$div.removeData();
})
