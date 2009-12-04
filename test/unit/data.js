module("data");

test("expando", function(){
	expect(7);
	
	equals("expando" in jQuery, true, "jQuery is exposing the expando");
	
	var obj = {};
	jQuery.data(obj);
	equals( jQuery.expando in obj, false, "jQuery.data did not add an expando to the object" );
	
	jQuery.data(obj, true);
	equals( jQuery.expando in obj, false, "jQuery.data did not add an expando to the object" );
	
	jQuery.data(obj, 'test');
	equals( jQuery.expando in obj, false, "jQuery.data did not add an expando to the object" );
	
	jQuery.data(obj, "foo", "bar");
	equals( jQuery.expando in obj, true, "jQuery.data added an expando to the object" );
	
	var id = obj[jQuery.expando];
	equals( id in jQuery.cache, true, "jQuery.data added an entry to jQuery.cache" );
	
	equals( jQuery.cache[id].foo, "bar", "jQuery.data worked correctly" );
});

test("jQuery.data", function() {
	expect(6);
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
	expect(1);
	stop();

	var counter = 0;

	var $foo = jQuery("#foo");

	$foo.queue(function() {
		var self = this;
		setTimeout(function() {
			jQuery(self).dequeue("fx");
			start();
		}, 200);
	}).queue(function() {
		ok( "dequeuing 'fx' calls queues created with no name" )
	});

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
});

test("queue(name) passes in the next item in the queue as a parameter", function() {
	expect(2);
	
	var div = jQuery({});
	var counter = 0;
	
	div.queue("foo", function(next) {
		equals(++counter, 1, "Dequeueing");
		next();
	}).queue("foo", function(next) {
		equals(++counter, 2, "Next was called");
		next();
	}).queue("bar", function() {
		equals(++counter, 3, "Other queues are not triggered by next()")
	});
	
	div.dequeue("foo");
});

test("queue(name) passes in the next item in the queue as a parameter", function() {
	expect(2);
	
	var div = jQuery({});
	var counter = 0;
	
	div.queue("foo", function(next) {
		equals(++counter, 1, "Dequeueing");
		next();
	}).queue("foo", function(next) {
		equals(++counter, 2, "Next was called");
		next();
	}).queue("bar", function() {
		equals(++counter, 3, "Other queues are not triggered by next()")
	});
	
	div.dequeue("foo");
});

test("queue() passes in the next item in the queue as a parameter to fx queues", function() {
	expect(2);
	stop();
	
	var div = jQuery({});
	var counter = 0;
	
	div.queue(function(next) {
		equals(++counter, 1, "Dequeueing");
		var self = this;
		setTimeout(function() { next() }, 500);
	}).queue(function(next) {
		equals(++counter, 2, "Next was called");
		next();
		start();
	}).queue("bar", function() {
		equals(++counter, 3, "Other queues are not triggered by next()")
	});

});

test("delay()", function() {
	expect(2);
	stop();

	var foo = jQuery({}), run = 0;

	foo.delay(100).queue(function(){
		run = 1;
		ok( true, "The function was dequeued." );
		start();
	});

	equals( run, 0, "The delay delayed the next function from running." );
});

test("clearQueue(name) clears the queue", function() {
	expect(1);
	
	var div = jQuery({});
	var counter = 0;
	
	div.queue("foo", function(next) {
		counter++;
		jQuery(this).clearQueue("foo");
		next();
	}).queue("foo", function(next) {
		counter++;
	});
	
	div.dequeue("foo");
	
	equals(counter, 1, "the queue was cleared");
});

test("clearQueue() clears the fx queue", function() {
	expect(1);
	
	var div = jQuery({});
	var counter = 0;
	
	div.queue(function(next) {
		counter++;
		var self = this;
		setTimeout(function() { jQuery(self).clearQueue(); next(); }, 50);
	}).queue(function(next) {
		counter++;
	});
	
	equals(counter, 1, "the queue was cleared");
	
	div.removeData();
});
