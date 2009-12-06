module("queue");

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
