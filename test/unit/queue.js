module("queue", { teardown: moduleTeardown });

test("queue() with other types",function() {
	expect(11);
	var counter = 0;

	stop();

	var $div = jQuery({}),
		defer;

	$div.promise("foo").done(function() {
		equals( counter, 0, "Deferred for collection with no queue is automatically resolved" );
	});

	$div
		.queue("foo",function(){
			equals( ++counter, 1, "Dequeuing" );
			jQuery.dequeue(this,"foo");
		})
		.queue("foo",function(){
			equals( ++counter, 2, "Dequeuing" );
			jQuery(this).dequeue("foo");
		})
		.queue("foo",function(){
			equals( ++counter, 3, "Dequeuing" );
		})
		.queue("foo",function(){
			equals( ++counter, 4, "Dequeuing" );
		});

	defer = $div.promise("foo").done(function() {
		equals(  counter, 4, "Testing previous call to dequeue in deferred"  );
		start();
	});

	equals( $div.queue("foo").length, 4, "Testing queue length" );

	$div.dequeue("foo");

	equals( counter, 3, "Testing previous call to dequeue" );
	equals( $div.queue("foo").length, 1, "Testing queue length" );

	$div.dequeue("foo");

	equals( counter, 4, "Testing previous call to dequeue" );
	equals( $div.queue("foo").length, 0, "Testing queue length" );
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
	expect(3);
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
	}).queue("bar", function() {
		equals(++counter, 3, "Other queues are not triggered by next()")
	});

	jQuery.when( div.promise("fx"), div ).done(function() {
		equals(counter, 2, "Deferreds resolved");
		start();
	});
});

test("callbacks keep their place in the queue", function() {
	expect(5);
	stop();
	var div = jQuery("<div>"),
		counter = 0;

	div.queue(function( next ) {
		equal( ++counter, 1, "Queue/callback order: first called" );
		setTimeout( next, 200 );
	}).show(100, function() {
		equal( ++counter, 2, "Queue/callback order: second called" );
		jQuery(this).hide(100, function() {
			equal( ++counter, 4, "Queue/callback order: fourth called" );
		});
	}).queue(function( next ) {
		equal( ++counter, 3, "Queue/callback order: third called" );
		next();
	});

	div.promise("fx").done(function() {
		equals(counter, 4, "Deferreds resolved");
		start();
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
	expect(2);

	stop()

	var div = jQuery({});
	var counter = 0;

	div.queue("foo", function(next) {
		counter++;
		jQuery(this).clearQueue("foo");
		next();
	}).queue("foo", function(next) {
		counter++;
	});

	div.promise("foo").done(function() {
		ok( true, "dequeue resolves the deferred" );
		start();
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

test("_mark() and _unmark()", function() {
	expect(1);

	var div = {},
		$div = jQuery( div );

	stop();

	jQuery._mark( div, "foo" );
	jQuery._mark( div, "foo" );
	jQuery._unmark( div, "foo" );
	jQuery._unmark( div, "foo" );

	$div.promise( "foo" ).done(function() {
		ok( true, "No more marks" );
		start();
	});
});

test("_mark() and _unmark() default to 'fx'", function() {
	expect(1);

	var div = {},
		$div = jQuery( div );

	stop();

	jQuery._mark( div );
	jQuery._mark( div );
	jQuery._unmark( div, "fx" );
	jQuery._unmark( div );

	$div.promise().done(function() {
		ok( true, "No more marks" );
		start();
	});
});

test("promise()", function() {
	expect(1);

	stop();

	var objects = [];

	jQuery.each( [{}, {}], function( i, div ) {
		var $div = jQuery( div );
		$div.queue(function( next ) {
			setTimeout( function() {
				if ( i ) {
					next();
					setTimeout( function() {
						jQuery._unmark( div );
					}, 20 );
				} else {
					jQuery._unmark( div );
					setTimeout( function() {
						next();
					}, 20 );
				}
			}, 50 );
		}).queue(function( next ) {
			next();
		});
		jQuery._mark( div );
		objects.push( $div );
	});

	jQuery.when.apply( jQuery, objects ).done(function() {
		ok( true, "Deferred resolved" );
		start();
	});

	jQuery.each( objects, function() {
		this.dequeue();
	});
});