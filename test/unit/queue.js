QUnit.module( "queue", { afterEach: moduleTeardown } );

( function() {

if ( !jQuery.fn.queue ) {
	return;
}

QUnit.test( "queue() with other types", function( assert ) {
	var done = assert.async( 2 );
	assert.expect( 14 );


	var $div = jQuery( {} ),
		counter = 0;

	$div.promise( "foo" ).done( function() {
		assert.equal( counter, 0, "Deferred for collection with no queue is automatically resolved" );
	} );

	$div
		.queue( "foo", function() {
			assert.equal( ++counter, 1, "Dequeuing" );
			jQuery.dequeue( this, "foo" );
		} )
		.queue( "foo", function() {
			assert.equal( ++counter, 2, "Dequeuing" );
			jQuery( this ).dequeue( "foo" );
		} )
		.queue( "foo", function() {
			assert.equal( ++counter, 3, "Dequeuing" );
		} )
		.queue( "foo", function() {
			assert.equal( ++counter, 4, "Dequeuing" );
		} );

	$div.promise( "foo" ).done( function() {
		assert.equal( counter, 4, "Testing previous call to dequeue in deferred"  );
		done();
	} );

	assert.equal( $div.queue( "foo" ).length, 4, "Testing queue length" );

	assert.equal( $div.queue( "foo", undefined ).queue( "foo" ).length, 4, ".queue('name',undefined) does nothing but is chainable (#5571)" );

	$div.dequeue( "foo" );

	assert.equal( counter, 3, "Testing previous call to dequeue" );
	assert.equal( $div.queue( "foo" ).length, 1, "Testing queue length" );

	$div.dequeue( "foo" );

	assert.equal( counter, 4, "Testing previous call to dequeue" );
	assert.equal( $div.queue( "foo" ).length, 0, "Testing queue length" );

	$div.dequeue( "foo" );

	assert.equal( counter, 4, "Testing previous call to dequeue" );
	assert.equal( $div.queue( "foo" ).length, 0, "Testing queue length" );
	done();
} );

QUnit.test( "queue(name) passes in the next item in the queue as a parameter", function( assert ) {
	assert.expect( 2 );

	var div = jQuery( {} ),
		counter = 0;

	div.queue( "foo", function( next ) {
		assert.equal( ++counter, 1, "Dequeueing" );
		next();
	} ).queue( "foo", function( next ) {
		assert.equal( ++counter, 2, "Next was called" );
		next();
	} ).queue( "bar", function() {
		assert.equal( ++counter, 3, "Other queues are not triggered by next()" );
	} );

	div.dequeue( "foo" );
} );

QUnit.test( "queue() passes in the next item in the queue as a parameter to fx queues", function( assert ) {
	var done = assert.async();
	assert.expect( 3 );

	var div = jQuery( {} ),
		counter = 0;

	div.queue( function( next ) {
		assert.equal( ++counter, 1, "Dequeueing" );
		setTimeout( function() { next(); }, 500 );
	} ).queue( function( next ) {
		assert.equal( ++counter, 2, "Next was called" );
		next();
	} ).queue( "bar", function() {
		assert.equal( ++counter, 3, "Other queues are not triggered by next()" );
	} );

	jQuery.when( div.promise( "fx" ), div ).done( function() {
		assert.equal( counter, 2, "Deferreds resolved" );
		done();
	} );
} );

QUnit.test( "callbacks keep their place in the queue", function( assert ) {
	var done = assert.async();
	assert.expect( 5 );
	var div = jQuery( "<div>" ),
		counter = 0;

	div.queue( function( next ) {
		assert.equal( ++counter, 1, "Queue/callback order: first called" );
		setTimeout( next, 200 );
	} ).delay( 100 ).queue( function( next ) {
		assert.equal( ++counter, 2, "Queue/callback order: second called" );
		jQuery( this ).delay( 100 ).queue( function( next ) {
			assert.equal( ++counter, 4, "Queue/callback order: fourth called" );
			next();
		} );
		next();
	} ).queue( function( next ) {
		assert.equal( ++counter, 3, "Queue/callback order: third called" );
		next();
	} );

	div.promise( "fx" ).done( function() {
		assert.equal( counter, 4, "Deferreds resolved" );
		done();
	} );
} );

QUnit.test( "jQuery.queue should return array while manipulating the queue", function( assert ) {
	assert.expect( 1 );

	var div = document.createElement( "div" );

	assert.ok( Array.isArray( jQuery.queue( div, "fx", jQuery.noop ) ), "jQuery.queue should return an array while manipulating the queue" );
} );

QUnit.test( "delay()", function( assert ) {
	var done = assert.async();
	assert.expect( 2 );

	var foo = jQuery( {} ), run = 0;

	foo.delay( 100 ).queue( function() {
		run = 1;
		assert.ok( true, "The function was dequeued." );
		done();
	} );

	assert.equal( run, 0, "The delay delayed the next function from running." );
} );

QUnit.test( "clearQueue(name) clears the queue", function( assert ) {
	var done = assert.async( 2 );
	assert.expect( 2 );

	var div = jQuery( {} ),
		counter = 0;

	div.queue( "foo", function( next ) {
		counter++;
		jQuery( this ).clearQueue( "foo" );
		next();
	} ).queue( "foo", function() {
		counter++;
	} );

	div.promise( "foo" ).done( function() {
		assert.ok( true, "dequeue resolves the deferred" );
		done();
	} );

	div.dequeue( "foo" );

	assert.equal( counter, 1, "the queue was cleared" );
	done();
} );

QUnit.test( "clearQueue() clears the fx queue", function( assert ) {
	assert.expect( 1 );

	var div = jQuery( {} ),
		counter = 0;

	div.queue( function( next ) {
		counter++;
		var self = this;
		setTimeout( function() { jQuery( self ).clearQueue(); next(); }, 50 );
	} ).queue( function() {
		counter++;
	} );

	assert.equal( counter, 1, "the queue was cleared" );

	div.removeData();
} );

QUnit.test( "fn.promise() - called when fx queue is empty", function( assert ) {
	assert.expect( 3 );
	var foo = jQuery( "#foo" ).clone().addBack(),
		promised = false,
		done = assert.async();

	foo.queue( function( next ) {

		// called twice!
		assert.ok( !promised, "Promised hasn't been called" );
		setTimeout( next, 10 );
	} );
	foo.promise().done( function() {
		assert.ok( promised = true, "Promised" );
		done();
	} );
} );

QUnit.test( "fn.promise( \"queue\" ) - called whenever last queue function is dequeued", function( assert ) {
	assert.expect( 5 );
	var done = assert.async();
	var foo = jQuery( "#foo" ),
		test;
	foo.promise( "queue" ).done( function() {
		assert.strictEqual( test, undefined, "called immediately when queue was already empty" );
	} );
	test = 1;
	foo.queue( "queue", function( next ) {
		assert.strictEqual( test++, 1, "step one" );
		setTimeout( next, 0 );
	} ).queue( "queue", function( next ) {
		assert.strictEqual( test++, 2, "step two" );
		setTimeout( function() {
			next();
			assert.strictEqual( test++, 4, "step four" );
			done();
		}, 10 );
	} ).promise( "queue" ).done( function() {
		assert.strictEqual( test++, 3, "step three" );
	} );

	foo.dequeue( "queue" );
} );

if ( jQuery.fn.animate ) {

QUnit.test( "fn.promise( \"queue\" ) - waits for animation to complete before resolving", function( assert ) {
	assert.expect( 2 );
	var done = assert.async();
	var foo = jQuery( "#foo" ),
		test = 1;

	foo.animate( {
		top: 100
	}, {
		duration: 1,
		queue: "queue",
		complete: function() {
			assert.strictEqual( test++, 1, "step one" );
		}
	} ).dequeue( "queue" );

	foo.promise( "queue" ).done( function() {
		assert.strictEqual( test++, 2, "step two" );
		done();
	} );

} );
}

QUnit.test( ".promise(obj)", function( assert ) {
	assert.expect( 2 );

	var obj = {},
		promise = jQuery( "#foo" ).promise( "promise", obj );

	assert.ok( typeof promise.promise === "function", ".promise(type, obj) returns a promise" );
	assert.strictEqual( promise, obj, ".promise(type, obj) returns obj" );
} );

QUnit[ jQuery.fn.stop ? "test" : "skip" ]( "delay() can be stopped", function( assert ) {
	var done = assert.async();
	assert.expect( 3 );
	var storage = {};
	jQuery( {} )
		.queue( "alternate", function( next ) {
			storage.alt1 = true;
			assert.ok( true, "This first function was dequeued" );
			next();
		} )
		.delay( 1000, "alternate" )
		.queue( "alternate", function() {
			storage.alt2 = true;
			assert.ok( true, "The function was dequeued immediately, the delay was stopped" );
		} )
		.dequeue( "alternate" )

		// stop( "alternate", false ) will NOT clear the queue, so it should automatically dequeue the next
		.stop( "alternate", false, false )

		// this test
		.delay( 1 )
		.queue( function() {
			storage.default1 = true;
			assert.ok( false, "This queue should never run" );
		} )

		// stop( clearQueue ) should clear the queue
		.stop( true, false );

	assert.deepEqual( storage, { alt1: true, alt2: true }, "Queue ran the proper functions" );

	setTimeout( function() {
		done();
	}, 1500 );
} );

QUnit[ jQuery.fn.stop ? "test" : "skip" ]( "queue stop hooks", function( assert ) {
	assert.expect( 2 );
	var done = assert.async();
	var foo = jQuery( "#foo" );

	foo.queue( function( next, hooks ) {
		hooks.stop = function( gotoEnd ) {
			assert.equal( !!gotoEnd, false, "Stopped without gotoEnd" );
		};
	} );
	foo.stop();

	foo.queue( function( next, hooks ) {
		hooks.stop = function( gotoEnd ) {
			assert.equal( gotoEnd, true, "Stopped with gotoEnd" );
			done();
		};
	} );

	foo.stop( false, true );
} );

} )();
