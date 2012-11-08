module( "queue", { teardown: moduleTeardown });

test( "queue() with other types", 14, function() {
	var counter = 0;

	stop();

	var $div = jQuery({}),
		defer;
	$div.promise( "foo" ).done(function() {
		equal( counter, 0, "Deferred for collection with no queue is automatically resolved" );
	});

	$div
		.queue("foo",function(){
			equal( ++counter, 1, "Dequeuing" );
			jQuery.dequeue(this,"foo");
		})
		.queue("foo",function(){
			equal( ++counter, 2, "Dequeuing" );
			jQuery(this).dequeue("foo");
		})
		.queue("foo",function(){
			equal( ++counter, 3, "Dequeuing" );
		})
		.queue("foo",function(){
			equal( ++counter, 4, "Dequeuing" );
		});

	defer = $div.promise("foo").done(function() {
		equal( counter, 4, "Testing previous call to dequeue in deferred"  );
		start();
	});

	equal( $div.queue("foo").length, 4, "Testing queue length" );

	equal( $div.queue("foo", undefined).queue("foo").length, 4, ".queue('name',undefined) does nothing but is chainable (#5571)");

	$div.dequeue("foo");

	equal( counter, 3, "Testing previous call to dequeue" );
	equal( $div.queue("foo").length, 1, "Testing queue length" );

	$div.dequeue("foo");

	equal( counter, 4, "Testing previous call to dequeue" );
	equal( $div.queue("foo").length, 0, "Testing queue length" );

	$div.dequeue("foo");

	equal( counter, 4, "Testing previous call to dequeue" );
	equal( $div.queue("foo").length, 0, "Testing queue length" );

});

test("queue(name) passes in the next item in the queue as a parameter", function() {
	expect(2);

	var div = jQuery({});
	var counter = 0;

	div.queue("foo", function(next) {
		equal(++counter, 1, "Dequeueing");
		next();
	}).queue("foo", function(next) {
		equal(++counter, 2, "Next was called");
		next();
	}).queue("bar", function() {
		equal(++counter, 3, "Other queues are not triggered by next()");
	});

	div.dequeue("foo");
});

test("queue() passes in the next item in the queue as a parameter to fx queues", function() {
	expect(3);
	stop();

	var div = jQuery({});
	var counter = 0;

	div.queue(function(next) {
		equal(++counter, 1, "Dequeueing");
		var self = this;
		setTimeout(function() { next(); }, 500);
	}).queue(function(next) {
		equal(++counter, 2, "Next was called");
		next();
	}).queue("bar", function() {
		equal(++counter, 3, "Other queues are not triggered by next()");
	});

	jQuery.when( div.promise("fx"), div ).done(function() {
		equal(counter, 2, "Deferreds resolved");
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
	}).delay( 100 ).queue(function( next ) {
		equal( ++counter, 2, "Queue/callback order: second called" );
		jQuery( this ).delay( 100 ).queue(function( next ) {
			equal( ++counter, 4, "Queue/callback order: fourth called" );
			next();
		});
		next();
	}).queue(function( next ) {
		equal( ++counter, 3, "Queue/callback order: third called" );
		next();
	});

	div.promise("fx").done(function() {
		equal(counter, 4, "Deferreds resolved");
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

	equal( run, 0, "The delay delayed the next function from running." );
});

test("clearQueue(name) clears the queue", function() {
	expect(2);

	stop();

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

	equal(counter, 1, "the queue was cleared");
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

	equal(counter, 1, "the queue was cleared");

	div.removeData();
});

asyncTest( "fn.promise() - called when fx queue is empty", 3, function() {
	var foo = jQuery( "#foo" ).clone().andSelf(),
		promised = false;

	foo.queue( function( next ) {
		// called twice!
		ok( !promised, "Promised hasn't been called" );
		setTimeout( next, 10 );
	});
	foo.promise().done( function() {
		ok( promised = true, "Promised" );
		start();
	});
});

asyncTest( "fn.promise( \"queue\" ) - called whenever last queue function is dequeued", 5, function() {
	var foo = jQuery( "#foo" ),
		test;
	foo.promise( "queue" ).done( function() {
		strictEqual( test, undefined, "called immediately when queue was already empty" );
	});
	test = 1;
	foo.queue( "queue", function( next ) {
		strictEqual( test++, 1, "step one" );
		setTimeout( next, 0 );
	}).queue( "queue", function( next ) {
		strictEqual( test++, 2, "step two" );
		setTimeout( function() {
			next();
			strictEqual( test++, 4, "step four" );
			start();
		}, 10 );
	}).promise( "queue" ).done( function() {
		strictEqual( test++, 3, "step three" );
	});

	foo.dequeue( "queue" );
});

asyncTest( "fn.promise( \"queue\" ) - waits for animation to complete before resolving", 2, function() {
	var foo = jQuery( "#foo" ),
		test = 1;

	foo.animate({
		top: 100
	}, {
		duration: 1,
		queue: "queue",
		complete: function() {
			strictEqual( test++, 1, "step one" );
		}
	}).dequeue( "queue" );

	foo.promise( "queue" ).done( function() {
		strictEqual( test++, 2, "step two" );
		start();
	});

});

test( ".promise(obj)", function() {
	expect(2);

	var obj = {};
	var promise = jQuery( "#foo" ).promise( "promise", obj );

	ok( jQuery.isFunction( promise.promise ), ".promise(type, obj) returns a promise" );
	strictEqual( promise, obj, ".promise(type, obj) returns obj" );
});


if ( jQuery.fn.stop ) {
	test("delay() can be stopped", function() {
		expect( 3 );
		stop();

		var done = {};
		jQuery({})
			.queue( "alternate", function( next ) {
				done.alt1 = true;
				ok( true, "This first function was dequeued" );
				next();
			})
			.delay( 1000, "alternate" )
			.queue( "alternate", function() {
				done.alt2 = true;
				ok( true, "The function was dequeued immediately, the delay was stopped" );
			})
			.dequeue( "alternate" )

			// stop( "alternate", false ) will NOT clear the queue, so it should automatically dequeue the next
			.stop( "alternate", false, false )

			// this test
			.delay( 1 )
			.queue(function() {
				done.default1 = true;
				ok( false, "This queue should never run" );
			})

			// stop( clearQueue ) should clear the queue
			.stop( true, false );

		deepEqual( done, { alt1: true, alt2: true }, "Queue ran the proper functions" );

		setTimeout(function() {
			start();
		}, 1500 );
	});

	asyncTest( "queue stop hooks", 2, function() {
		var foo = jQuery( "#foo" );

		foo.queue( function( next, hooks ) {
			hooks.stop = function( gotoEnd ) {
				equal( !!gotoEnd, false, "Stopped without gotoEnd" );
			};
		});
		foo.stop();

		foo.queue( function( next, hooks ) {
			hooks.stop = function( gotoEnd ) {
				equal( gotoEnd, true, "Stopped with gotoEnd" );
				start();
			};
		});

		foo.stop( false, true );
	});

} // if ( jQuery.fn.stop )
