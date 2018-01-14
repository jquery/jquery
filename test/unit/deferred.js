QUnit.module( "deferred", {
	teardown: moduleTeardown
} );

jQuery.each( [ "", " - new operator" ], function( _, withNew ) {

	function createDeferred( fn ) {
		return withNew ? new jQuery.Deferred( fn ) : jQuery.Deferred( fn );
	}

	QUnit.test( "jQuery.Deferred" + withNew, function( assert ) {

		assert.expect( 23 );

		var defer = createDeferred();

		assert.ok( typeof defer.pipe === "function", "defer.pipe is a function" );

		defer.resolve().done( function() {
			assert.ok( true, "Success on resolve" );
			assert.strictEqual( defer.state(), "resolved", "Deferred is resolved (state)" );
		} ).fail( function() {
			assert.ok( false, "Error on resolve" );
		} ).always( function() {
			assert.ok( true, "Always callback on resolve" );
		} );

		defer = createDeferred();
		defer.reject().done( function() {
			assert.ok( false, "Success on reject" );
		} ).fail( function() {
			assert.ok( true, "Error on reject" );
			assert.strictEqual( defer.state(), "rejected", "Deferred is rejected (state)" );
		} ).always( function() {
			assert.ok( true, "Always callback on reject" );
		} );

		createDeferred( function( defer ) {
			assert.ok( this === defer, "Defer passed as this & first argument" );
			this.resolve( "done" );
		} ).done( function( value ) {
			assert.strictEqual( value, "done", "Passed function executed" );
		} );

		createDeferred( function( defer ) {
			var promise = defer.promise(),
				func = function() {},
				funcPromise = defer.promise( func );
			assert.strictEqual( defer.promise(), promise, "promise is always the same" );
			assert.strictEqual( funcPromise, func, "non objects get extended" );
			jQuery.each( promise, function( key ) {
				if ( typeof promise[ key ] !== "function" ) {
					assert.ok( false, key + " is a function (" + typeof( promise[ key ] ) + ")" );
				}
				if ( promise[ key ] !== func[ key ] ) {
					assert.strictEqual( func[ key ], promise[ key ], key + " is the same" );
				}
			} );
		} );

		jQuery.expandedEach = jQuery.each;
		jQuery.expandedEach( "resolve reject".split( " " ), function( _, change ) {
			createDeferred( function( defer ) {
				assert.strictEqual( defer.state(), "pending", "pending after creation" );
				var checked = 0;
				defer.progress( function( value ) {
					assert.strictEqual( value, checked, "Progress: right value (" + value + ") received" );
				} );
				for ( checked = 0; checked < 3; checked++ ) {
					defer.notify( checked );
				}
				assert.strictEqual( defer.state(), "pending", "pending after notification" );
				defer[ change ]();
				assert.notStrictEqual( defer.state(), "pending", "not pending after " + change );
				defer.notify();
			} );
		} );
	} );
} );

QUnit.test( "jQuery.Deferred - chainability", function( assert ) {

	var defer = jQuery.Deferred();

	assert.expect( 10 );

	jQuery.expandedEach = jQuery.each;
	jQuery.expandedEach( "resolve reject notify resolveWith rejectWith notifyWith done fail progress always".split( " " ), function( _, method ) {
		var object = {
			m: defer[ method ]
		};
		assert.strictEqual( object.m(), object, method + " is chainable" );
	} );
} );

QUnit.test( "jQuery.Deferred.then - filtering (done)", function( assert ) {

	assert.expect( 4 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( function( a, b ) {
			return a * b;
		} ),
		done = jQuery.map( new Array( 3 ), function() { return assert.async(); } );

	piped.done( function( result ) {
		value3 = result;
	} );

	defer.done( function( a, b ) {
		value1 = a;
		value2 = b;
	} );

	defer.resolve( 2, 3 ).then( function() {
		assert.strictEqual( value1, 2, "first resolve value ok" );
		assert.strictEqual( value2, 3, "second resolve value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done.pop().call();
	} );

	jQuery.Deferred().reject().then( function() {
		assert.ok( false, "then should not be called on reject" );
	} ).then( null, done.pop() );

	jQuery.Deferred().resolve().then( jQuery.noop ).done( function( value ) {
		assert.strictEqual( value, undefined, "then done callback can return undefined/null" );
		done.pop().call();
	} );
} );

QUnit.test( "jQuery.Deferred.then - filtering (fail)", function( assert ) {

	assert.expect( 4 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, function( a, b ) {
			return a * b;
		} ),
		done = jQuery.map( new Array( 3 ), function() { return assert.async(); } );

	piped.done( function( result ) {
		value3 = result;
	} );

	defer.fail( function( a, b ) {
		value1 = a;
		value2 = b;
	} );

	defer.reject( 2, 3 ).then( null, function() {
		assert.strictEqual( value1, 2, "first reject value ok" );
		assert.strictEqual( value2, 3, "second reject value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done.pop().call();
	} );

	jQuery.Deferred().resolve().then( null, function() {
		assert.ok( false, "then should not be called on resolve" );
	} ).then( done.pop() );

	jQuery.Deferred().reject().then( null, jQuery.noop ).done( function( value ) {
		assert.strictEqual( value, undefined, "then fail callback can return undefined/null" );
		done.pop().call();
	} );
} );

QUnit.test( "jQuery.Deferred.catch", function( assert ) {
	assert.expect( 4 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer[ "catch" ]( function( a, b ) {
			return a * b;
		} ),
		done = jQuery.map( new Array( 3 ), function() { return assert.async(); } );

	piped.done( function( result ) {
		value3 = result;
	} );

	defer.fail( function( a, b ) {
		value1 = a;
		value2 = b;
	} );

	defer.reject( 2, 3 )[ "catch" ]( function() {
		assert.strictEqual( value1, 2, "first reject value ok" );
		assert.strictEqual( value2, 3, "second reject value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done.pop().call();
	} );

	jQuery.Deferred().resolve()[ "catch" ]( function() {
		assert.ok( false, "then should not be called on resolve" );
	} ).then( done.pop() );

	jQuery.Deferred().reject()[ "catch" ]( jQuery.noop ).done( function( value ) {
		assert.strictEqual( value, undefined, "then fail callback can return undefined/null" );
		done.pop().call();
	} );
} );

QUnit.test( "[PIPE ONLY] jQuery.Deferred.pipe - filtering (fail)", function( assert ) {

	assert.expect( 4 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.pipe( null, function( a, b ) {
			return a * b;
		} ),
		done = jQuery.map( new Array( 3 ), function() { return assert.async(); } );

	piped.fail( function( result ) {
		value3 = result;
	} );

	defer.fail( function( a, b ) {
		value1 = a;
		value2 = b;
	} );

	defer.reject( 2, 3 ).pipe( null, function() {
		assert.strictEqual( value1, 2, "first reject value ok" );
		assert.strictEqual( value2, 3, "second reject value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done.pop().call();
	} );

	jQuery.Deferred().resolve().pipe( null, function() {
		assert.ok( false, "then should not be called on resolve" );
	} ).then( done.pop() );

	jQuery.Deferred().reject().pipe( null, jQuery.noop ).fail( function( value ) {
		assert.strictEqual( value, undefined, "then fail callback can return undefined/null" );
		done.pop().call();
	} );
} );

QUnit.test( "jQuery.Deferred.then - filtering (progress)", function( assert ) {

	assert.expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, null, function( a, b ) {
			return a * b;
		} ),
		done = assert.async();

	piped.progress( function( result ) {
		value3 = result;
	} );

	defer.progress( function( a, b ) {
		value1 = a;
		value2 = b;
	} );

	defer.notify( 2, 3 ).then( null, null, function() {
		assert.strictEqual( value1, 2, "first progress value ok" );
		assert.strictEqual( value2, 3, "second progress value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done();
	} );
} );

QUnit.test( "jQuery.Deferred.then - deferred (done)", function( assert ) {

	assert.expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( function( a, b ) {
			return jQuery.Deferred( function( defer ) {
				defer.reject( a * b );
			} );
		} ),
		done = assert.async();

	piped.fail( function( result ) {
		value3 = result;
	} );

	defer.done( function( a, b ) {
		value1 = a;
		value2 = b;
	} );

	defer.resolve( 2, 3 );

	piped.fail( function() {
		assert.strictEqual( value1, 2, "first resolve value ok" );
		assert.strictEqual( value2, 3, "second resolve value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done();
	} );
} );

QUnit.test( "jQuery.Deferred.then - deferred (fail)", function( assert ) {

	assert.expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, function( a, b ) {
			return jQuery.Deferred( function( defer ) {
				defer.resolve( a * b );
			} );
		} ),
		done = assert.async();

	piped.done( function( result ) {
		value3 = result;
	} );

	defer.fail( function( a, b ) {
		value1 = a;
		value2 = b;
	} );

	defer.reject( 2, 3 );

	piped.done( function() {
		assert.strictEqual( value1, 2, "first reject value ok" );
		assert.strictEqual( value2, 3, "second reject value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done();
	} );
} );

QUnit.test( "jQuery.Deferred.then - deferred (progress)", function( assert ) {

	assert.expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, null, function( a, b ) {
			return jQuery.Deferred( function( defer ) {
				defer.resolve( a * b );
			} );
		} ),
		done = assert.async();

	piped.progress( function( result ) {
		return jQuery.Deferred().resolve().then( function() {
			return result;
		} ).then( function( result ) {
			value3 = result;
		} );
	} );

	defer.progress( function( a, b ) {
		value1 = a;
		value2 = b;
	} );

	defer.notify( 2, 3 );

	piped.then( null, null, function( result ) {
		return jQuery.Deferred().resolve().then( function() {
			return result;
		} ).then( function() {
			assert.strictEqual( value1, 2, "first progress value ok" );
			assert.strictEqual( value2, 3, "second progress value ok" );
			assert.strictEqual( value3, 6, "result of filter ok" );
			done();
		} );
	} );
} );

QUnit.test( "[PIPE ONLY] jQuery.Deferred.pipe - deferred (progress)", function( assert ) {

	assert.expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.pipe( null, null, function( a, b ) {
			return jQuery.Deferred( function( defer ) {
				defer.resolve( a * b );
			} );
		} ),
		done = assert.async();

	piped.done( function( result ) {
		value3 = result;
	} );

	defer.progress( function( a, b ) {
		value1 = a;
		value2 = b;
	} );

	defer.notify( 2, 3 );

	piped.done( function() {
		assert.strictEqual( value1, 2, "first progress value ok" );
		assert.strictEqual( value2, 3, "second progress value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done();
	} );
} );

QUnit.test( "jQuery.Deferred.then - context", function( assert ) {

	assert.expect( 11 );

	var defer, piped, defer2, piped2,
		context = { custom: true },
		done = jQuery.map( new Array( 5 ), function() { return assert.async(); } );

	jQuery.Deferred().resolveWith( context, [ 2 ] ).then( function( value ) {
		assert.strictEqual( this, context, "custom context received by .then handler" );
		return value * 3;
	} ).done( function( value ) {
		assert.notStrictEqual( this, context,
			"custom context not propagated through .then handler" );
		assert.strictEqual( value, 6, "proper value received" );
		done.pop().call();
	} );

	jQuery.Deferred().resolveWith( context, [ 2 ] ).then().done( function( value ) {
		assert.strictEqual( this, context,
			"custom context propagated through .then without handler" );
		assert.strictEqual( value, 2, "proper value received" );
		done.pop().call();
	} );

	jQuery.Deferred().resolve().then( function() {
		assert.strictEqual( this, window, "default context in .then handler" );
		return jQuery.Deferred().resolveWith( context );
	} ).done( function() {
		assert.strictEqual( this, context,
			"custom context of returned deferred correctly propagated" );
		done.pop().call();
	} );

	defer = jQuery.Deferred();
	piped = defer.then( function( value ) {
		return value * 3;
	} );

	defer.resolve( 2 );

	piped.done( function( value ) {
		assert.strictEqual( this, window, ".then handler does not introduce context" );
		assert.strictEqual( value, 6, "proper value received" );
		done.pop().call();
	} );

	defer2 = jQuery.Deferred();
	piped2 = defer2.then();

	defer2.resolve( 2 );

	piped2.done( function( value ) {
		assert.strictEqual( this, window, ".then without handler does not introduce context" );
		assert.strictEqual( value, 2, "proper value received (without passing function)" );
		done.pop().call();
	} );
} );

QUnit.test( "[PIPE ONLY] jQuery.Deferred.pipe - context", function( assert ) {

	assert.expect( 11 );

	var defer, piped, defer2, piped2,
		context = { custom: true },
		done = jQuery.map( new Array( 5 ), function() { return assert.async(); } );

	jQuery.Deferred().resolveWith( context, [ 2 ] ).pipe( function( value ) {
		assert.strictEqual( this, context, "custom context received by .pipe handler" );
		return value * 3;
	} ).done( function( value ) {
		assert.strictEqual( this, context,
			"[PIPE ONLY] custom context propagated through .pipe handler" );
		assert.strictEqual( value, 6, "proper value received" );
		done.pop().call();
	} );

	jQuery.Deferred().resolveWith( context, [ 2 ] ).pipe().done( function( value ) {
		assert.strictEqual( this, context,
			"[PIPE ONLY] custom context propagated through .pipe without handler" );
		assert.strictEqual( value, 2, "proper value received" );
		done.pop().call();
	} );

	jQuery.Deferred().resolve().pipe( function() {
		assert.strictEqual( this, window, "default context in .pipe handler" );
		return jQuery.Deferred().resolveWith( context );
	} ).done( function() {
		assert.strictEqual( this, context,
			"custom context of returned deferred correctly propagated" );
		done.pop().call();
	} );

	defer = jQuery.Deferred();
	piped = defer.pipe( function( value ) {
		return value * 3;
	} );

	defer.resolve( 2 );

	piped.done( function( value ) {
		assert.strictEqual( this, window, ".pipe handler does not introduce context" );
		assert.strictEqual( value, 6, "proper value received" );
		done.pop().call();
	} );

	defer2 = jQuery.Deferred();
	piped2 = defer2.pipe();

	defer2.resolve( 2 );

	piped2.done( function( value ) {
		assert.strictEqual( this, window, ".pipe without handler does not introduce context" );
		assert.strictEqual( value, 2, "proper value received (without passing function)" );
		done.pop().call();
	} );
} );

QUnit.test( "jQuery.Deferred.then - spec compatibility", function( assert ) {

	assert.expect( 1 );

	var done = assert.async(),
		defer = jQuery.Deferred();

	defer.done( function() {
		setTimeout( done );
		throw new Error();
	} );

	defer.then( function() {
		assert.ok( true, "errors in .done callbacks don't stop .then handlers" );
	} );

	try {
		defer.resolve();
	} catch ( _ ) {}
} );

QUnit[ typeof Symbol === "function" && Symbol.toStringTag ? "test" : "skip" ](
	"jQuery.Deferred.then - IsCallable determination (gh-3596)",
	function( assert ) {

		assert.expect( 1 );

		var done = assert.async(),
			defer = jQuery.Deferred();

		function faker() {
			assert.ok( true, "handler with non-'Function' @@toStringTag gets invoked" );
		}
		faker[ Symbol.toStringTag ] = "String";

		defer.then( faker ).then( done );

		defer.resolve();
	}
);

// Test fails in IE9 but is skipped there because console is not active
QUnit[ window.console ? "test" : "skip" ]( "jQuery.Deferred.exceptionHook", function( assert ) {

	assert.expect( 2 );

	var done = assert.async(),
		defer = jQuery.Deferred(),
		oldWarn = window.console.warn;

	window.console.warn = function() {

		// Support: Chrome <=41 only
		// Some Chrome versions newer than 30 but older than 42 display the "undefined is
		// not a function" error, not mentioning the function name. This has been fixed
		// in Chrome 42. Relax this test there.
		// This affects our Android 5.0 & Yandex.Browser testing.
		var msg = Array.prototype.join.call( arguments, " " ),
			oldChromium = false;
		if ( /chrome/i.test( navigator.userAgent ) ) {
			oldChromium = parseInt(
					navigator.userAgent.match( /chrome\/(\d+)/i )[ 1 ], 10 ) < 42;
		}
		if ( oldChromium ) {
			assert.ok( /(?:barf|undefined)/.test( msg ), "Message (weak assertion): " + msg );
		} else {
			assert.ok( /barf/.test( msg ), "Message: " + msg );
		}
	};
	jQuery.when(
		defer.then( function() {

			// Should get an error
			jQuery.barf();
		} ).then( null, jQuery.noop ),

		defer.then( function() {

			// Should NOT get an error
			throw new Error( "Make me a sandwich" );
		} ).then( null, jQuery.noop )
	).then( function barf( ) {
		jQuery.thisDiesToo();
	} ).then( null, function( ) {
		window.console.warn = oldWarn;
		done();
	} );

	defer.resolve();
} );

// Test fails in IE9 but is skipped there because console is not active
QUnit[ window.console ? "test" : "skip" ]( "jQuery.Deferred.exceptionHook with stack hooks", function( assert ) {

	assert.expect( 2 );

	var done = assert.async(),
		defer = jQuery.Deferred(),
		oldWarn = window.console.warn;

	jQuery.Deferred.getStackHook = function() {

		// Default exceptionHook assumes the stack is in a form console.warn can log,
		// but a custom getStackHook+exceptionHook pair could save a raw form and
		// format it to a string only when an exception actually occurs.
		// For the unit test we just ensure the plumbing works.
		return "NO STACK FOR YOU";
	};

	window.console.warn = function() {

		// Support: Chrome <=41 only
		// Some Chrome versions newer than 30 but older than 42 display the "undefined is
		// not a function" error, not mentioning the function name. This has been fixed
		// in Chrome 42. Relax this test there.
		// This affects our Android 5.0 & Yandex.Browser testing.
		var msg = Array.prototype.join.call( arguments, " " ),
			oldChromium = false;
		if ( /chrome/i.test( navigator.userAgent ) ) {
			oldChromium = parseInt(
					navigator.userAgent.match( /chrome\/(\d+)/i )[ 1 ], 10 ) < 42;
		}
		if ( oldChromium ) {
			assert.ok( /(?:cough_up_hairball|undefined)/.test( msg ),
				"Function mentioned (weak assertion): " + msg );
		} else {
			assert.ok( /cough_up_hairball/.test( msg ), "Function mentioned: " + msg );
		}
		assert.ok( /NO STACK FOR YOU/.test( msg ), "Stack trace included: " + msg );
	};
	defer.then( function() {
		jQuery.cough_up_hairball();
	} ).then( null, function( ) {
		window.console.warn = oldWarn;
		delete jQuery.Deferred.getStackHook;
		done();
	} );

	defer.resolve();
} );

QUnit.test( "jQuery.Deferred - 1.x/2.x compatibility", function( assert ) {

	assert.expect( 8 );

	var context = { id: "callback context" },
		thenable = jQuery.Deferred().resolve( "thenable fulfillment" ).promise(),
		done = jQuery.map( new Array( 8 ), function() { return assert.async(); } );

	thenable.unwrapped = false;

	jQuery.Deferred().resolve( 1, 2 ).then( function() {
		assert.deepEqual( [].slice.call( arguments ), [ 1, 2 ],
			".then fulfillment callbacks receive all resolution values" );
		done.pop().call();
	} );
	jQuery.Deferred().reject( 1, 2 ).then( null, function() {
		assert.deepEqual( [].slice.call( arguments ), [ 1, 2 ],
			".then rejection callbacks receive all rejection values" );
		done.pop().call();
	} );
	jQuery.Deferred().notify( 1, 2 ).then( null, null, function() {
		assert.deepEqual( [].slice.call( arguments ), [ 1, 2 ],
			".then progress callbacks receive all progress values" );
		done.pop().call();
	} );

	jQuery.Deferred().resolveWith( context ).then( function() {
		assert.deepEqual( this, context, ".then fulfillment callbacks receive context" );
		done.pop().call();
	} );
	jQuery.Deferred().rejectWith( context ).then( null, function() {
		assert.deepEqual( this, context, ".then rejection callbacks receive context" );
		done.pop().call();
	} );
	jQuery.Deferred().notifyWith( context ).then( null, null, function() {
		assert.deepEqual( this, context, ".then progress callbacks receive context" );
		done.pop().call();
	} );

	jQuery.Deferred().resolve( thenable ).done( function( value ) {
		assert.strictEqual( value, thenable, ".done doesn't unwrap thenables" );
		done.pop().call();
	} );

	jQuery.Deferred().notify( thenable ).then().then( null, null, function( value ) {
		assert.strictEqual( value, "thenable fulfillment",
			".then implicit progress callbacks unwrap thenables" );
		done.pop().call();
	} );
} );

QUnit.test( "jQuery.Deferred.then - progress and thenables", function( assert ) {

	assert.expect( 2 );

	var trigger = jQuery.Deferred().notify(),
		expectedProgress = [ "baz", "baz" ],
		done = jQuery.map( new Array( 2 ), function() { return assert.async(); } ),
		failer = function( evt ) {
			return function() {
				assert.ok( false, "no unexpected " + evt );
			};
		};

	trigger.then( null, null, function() {
		var notifier = jQuery.Deferred().notify( "foo" );
		setTimeout( function() {
			notifier.notify( "bar" ).resolve( "baz" );
		} );
		return notifier;
	} ).then( failer( "fulfill" ), failer( "reject" ), function( v ) {
		assert.strictEqual( v, expectedProgress.shift(), "expected progress value" );
		done.pop().call();
	} );
	trigger.notify();
} );

QUnit.test( "jQuery.Deferred - notify and resolve", function( assert ) {

	assert.expect( 7 );

	var notifiedResolved = jQuery.Deferred().notify( "foo" )/*xxx .resolve( "bar" )*/,
		done = jQuery.map( new Array( 3 ), function() { return assert.async(); } );

	notifiedResolved.progress( function( v ) {
		assert.strictEqual( v, "foo", "progress value" );
	} );

	notifiedResolved.pipe().progress( function( v ) {
		assert.strictEqual( v, "foo", "piped progress value" );
	} );

	notifiedResolved.pipe( null, null, function() {
		return "baz";
	} ).progress( function( v ) {
		assert.strictEqual( v, "baz", "replaced piped progress value" );
	} );

	notifiedResolved.pipe( null, null, function() {
		return jQuery.Deferred().notify( "baz" ).resolve( "quux" );
	} ).progress( function( v ) {
		assert.strictEqual( v, "baz", "deferred replaced piped progress value" );
	} );

	notifiedResolved.then().progress( function( v ) {
		assert.strictEqual( v, "foo", "then'd progress value" );
		done.pop().call();
	} );

	notifiedResolved.then( null, null, function() {
		return "baz";
	} ).progress( function( v ) {
		assert.strictEqual( v, "baz", "replaced then'd progress value" );
		done.pop().call();
	} );

	notifiedResolved.then( null, null, function() {
		return jQuery.Deferred().notify( "baz" ).resolve( "quux" );
	} ).progress( function( v ) {

		// Progress from the surrogate deferred is ignored
		assert.strictEqual( v, "quux", "deferred replaced then'd progress value" );
		done.pop().call();
	} );
} );

QUnit.test( "jQuery.Deferred - resolved to a notifying deferred", function( assert ) {

	assert.expect( 2 );

    var deferred = jQuery.Deferred(),
		done = assert.async( 2 );

	deferred.resolve( jQuery.Deferred( function( notifyingDeferred ) {
		notifyingDeferred.notify( "foo", "bar" );
		notifyingDeferred.resolve( "baz", "quux" );
	} ) );

	// Apply an empty then to force thenable unwrapping.
	// See https://github.com/jquery/jquery/issues/3000 for more info.
	deferred.then().then( function() {
		assert.deepEqual(
			[].slice.call( arguments ),
			[ "baz", "quux" ],
			"The fulfilled handler receives proper params"
		);
		done();
	}, null, function() {
		assert.deepEqual(
			[].slice.call( arguments ),
			[ "foo", "bar" ],
			"The progress handler receives proper params"
		);
		done();
	} );
} );

QUnit.test( "jQuery.when(nonThenable) - like Promise.resolve", function( assert ) {
	"use strict";

	assert.expect( 44 );

	var

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		defaultContext = ( function getDefaultContext() { return this; } ).call(),

		done = assert.async( 20 );

	jQuery.when()
		.done( function( resolveValue ) {
			assert.strictEqual( arguments.length, 0, "Resolved .done with no arguments" );
			assert.strictEqual( this, defaultContext, "Default .done context with no arguments" );
		} )
		.then( function( resolveValue ) {
			assert.strictEqual( arguments.length, 0, "Resolved .then with no arguments" );
			assert.strictEqual( this, defaultContext, "Default .then context with no arguments" );
		} );

	jQuery.each( {
		"an empty string": "",
		"a non-empty string": "some string",
		"zero": 0,
		"a number other than zero": 1,
		"true": true,
		"false": false,
		"null": null,
		"undefined": undefined,
		"a plain object": {},
		"an array": [ 1, 2, 3 ]
	}, function( message, value ) {
		var code = "jQuery.when( " + message + " )",
			onFulfilled = function( method ) {
				var call = code + "." + method;
				return function( resolveValue ) {
					assert.strictEqual( resolveValue, value, call + " resolve" );
					assert.strictEqual( this, defaultContext, call + " context" );
					done();
				};
			},
			onRejected = function( method ) {
				var call = code + "." + method;
				return function() {
					assert.ok( false, call + " reject" );
					done();
				};
			};

		jQuery.when( value )
			.done( onFulfilled( "done" ) )
			.fail( onRejected( "done" ) )
			.then( onFulfilled( "then" ), onRejected( "then" ) );
	} );
} );

QUnit.test( "jQuery.when(thenable) - like Promise.resolve", function( assert ) {
	"use strict";

	var customToStringThen = {
		then: function( onFulfilled ) {
			onFulfilled();
		}
	};
	if ( typeof Symbol === "function" ) {
		customToStringThen.then[ Symbol.toStringTag ] = "String";
	}

	var slice = [].slice,
		sentinel = { context: "explicit" },
		eventuallyFulfilled = jQuery.Deferred().notify( true ),
		eventuallyRejected = jQuery.Deferred().notify( true ),
		secondaryFulfilled = jQuery.Deferred().resolve( eventuallyFulfilled ),
		secondaryRejected = jQuery.Deferred().resolve( eventuallyRejected ),
		inputs = {
			promise: Promise.resolve( true ),
			customToStringThen: customToStringThen,
			rejectedPromise: Promise.reject( false ),
			deferred: jQuery.Deferred().resolve( true ),
			eventuallyFulfilled: eventuallyFulfilled,
			secondaryFulfilled: secondaryFulfilled,
			eventuallySecondaryFulfilled: jQuery.Deferred().notify( true ),
			multiDeferred: jQuery.Deferred().resolve( "foo", "bar" ),
			deferredWith: jQuery.Deferred().resolveWith( sentinel, [ true ] ),
			multiDeferredWith: jQuery.Deferred().resolveWith( sentinel, [ "foo", "bar" ] ),
			rejectedDeferred: jQuery.Deferred().reject( false ),
			eventuallyRejected: eventuallyRejected,
			secondaryRejected: secondaryRejected,
			eventuallySecondaryRejected: jQuery.Deferred().notify( true ),
			multiRejectedDeferred: jQuery.Deferred().reject( "baz", "quux" ),
			rejectedDeferredWith: jQuery.Deferred().rejectWith( sentinel, [ false ] ),
			multiRejectedDeferredWith: jQuery.Deferred().rejectWith( sentinel, [ "baz", "quux" ] )
		},
		contexts = {
			deferredWith: sentinel,
			multiDeferredWith: sentinel,
			rejectedDeferredWith: sentinel,
			multiRejectedDeferredWith: sentinel
		},
		willSucceed = {
			promise: [ true ],
			customToStringThen: [],
			deferred: [ true ],
			eventuallyFulfilled: [ true ],
			secondaryFulfilled: [ true ],
			eventuallySecondaryFulfilled: [ true ],
			multiDeferred: [ "foo", "bar" ],
			deferredWith: [ true ],
			multiDeferredWith: [ "foo", "bar" ]
		},
		willError = {
			rejectedPromise: [ false ],
			rejectedDeferred: [ false ],
			eventuallyRejected: [ false ],
			secondaryRejected: [ false ],
			eventuallySecondaryRejected: [ false ],
			multiRejectedDeferred: [ "baz", "quux" ],
			rejectedDeferredWith: [ false ],
			multiRejectedDeferredWith: [ "baz", "quux" ]
		},
		numCases = Object.keys( willSucceed ).length + Object.keys( willError ).length,

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		defaultContext = ( function getDefaultContext() { return this; } ).call(),

		done = assert.async( numCases * 2 );

	assert.expect( numCases * 4 );

	jQuery.each( inputs, function( message, value ) {
		var code = "jQuery.when( " + message + " )",
			shouldResolve = willSucceed[ message ],
			shouldError = willError[ message ],
			context = contexts[ message ] || defaultContext,
			onFulfilled = function( method ) {
				var call = code + "." + method;
				return function() {
					if ( shouldResolve ) {
						assert.deepEqual( slice.call( arguments ), shouldResolve,
							call + " resolve" );
						assert.strictEqual( this, context, call + " context" );
					} else {
						assert.ok( false,  call + " resolve" );
					}
					done();
				};
			},
			onRejected = function( method ) {
				var call = code + "." + method;
				return function() {
					if ( shouldError ) {
						assert.deepEqual( slice.call( arguments ), shouldError, call + " reject" );
						assert.strictEqual( this, context, call + " context" );
					} else {
						assert.ok( false, call + " reject" );
					}
					done();
				};
			};

		jQuery.when( value )
			.done( onFulfilled( "done" ) )
			.fail( onRejected( "done" ) )
			.then( onFulfilled( "then" ), onRejected( "then" ) );
	} );

	setTimeout( function() {
		eventuallyFulfilled.resolve( true );
		eventuallyRejected.reject( false );
		inputs.eventuallySecondaryFulfilled.resolve( secondaryFulfilled );
		inputs.eventuallySecondaryRejected.resolve( secondaryRejected );
	}, 50 );
} );

QUnit.test( "jQuery.when(a, b) - like Promise.all", function( assert ) {
	"use strict";

	assert.expect( 196 );

	var slice = [].slice,
		deferreds = {
			rawValue: 1,
			fulfilled: jQuery.Deferred().resolve( 1 ),
			rejected: jQuery.Deferred().reject( 0 ),
			eventuallyFulfilled: jQuery.Deferred().notify( true ),
			eventuallyRejected: jQuery.Deferred().notify( true ),
			fulfilledStandardPromise: Promise.resolve( 1 ),
			rejectedStandardPromise: Promise.reject( 0 )
		},
		willSucceed = {
			rawValue: true,
			fulfilled: true,
			eventuallyFulfilled: true,
			fulfilledStandardPromise: true
		},
		willError = {
			rejected: true,
			eventuallyRejected: true,
			rejectedStandardPromise: true
		},

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		defaultContext = ( function getDefaultContext() { return this; } ).call(),

		done = assert.async( 98 );

	jQuery.each( deferreds, function( id1, v1 ) {
		jQuery.each( deferreds, function( id2, v2 ) {
			var code = "jQuery.when( " + id1 + ", " + id2 + " )",
				shouldResolve = willSucceed[ id1 ] && willSucceed[ id2 ],
				shouldError = willError[ id1 ] || willError[ id2 ],
				expected = shouldResolve ? [ 1, 1 ] : [ 0 ],
				context = shouldResolve ? [ defaultContext, defaultContext ] : defaultContext,
				onFulfilled = function( method ) {
					var call = code + "." + method;
					return function() {
						if ( shouldResolve ) {
							assert.deepEqual( slice.call( arguments ), expected,
								call + " resolve" );
							assert.deepEqual( this, context, code + " context" );
						} else {
							assert.ok( false,  call + " resolve" );
						}
						done();
					};
				},
				onRejected = function( method ) {
					var call = code + "." + method;
					return function() {
						if ( shouldError ) {
							assert.deepEqual( slice.call( arguments ), expected, call + " reject" );
							assert.deepEqual( this, context, code + " context" );
						} else {
							assert.ok( false, call + " reject" );
						}
						done();
					};
				};

			jQuery.when( v1, v2 )
				.done( onFulfilled( "done" ) )
				.fail( onRejected( "done" ) )
				.then( onFulfilled( "then" ), onRejected( "then" ) );
		} );
	} );

	setTimeout( function() {
		deferreds.eventuallyFulfilled.resolve( 1 );
		deferreds.eventuallyRejected.reject( 0 );
	}, 50 );
} );

QUnit.test( "jQuery.when - always returns a new promise", function( assert ) {

	assert.expect( 42 );

	jQuery.each( {
		"no arguments": [],
		"non-thenable": [ "foo" ],
		"promise": [ Promise.resolve( "bar" ) ],
		"rejected promise": [ Promise.reject( "bar" ) ],
		"deferred": [ jQuery.Deferred().resolve( "baz" ) ],
		"rejected deferred": [ jQuery.Deferred().reject( "baz" ) ],
		"multi-resolved deferred": [ jQuery.Deferred().resolve( "qux", "quux" ) ],
		"multiple non-thenables": [ "corge", "grault" ],
		"multiple deferreds": [
			jQuery.Deferred().resolve( "garply" ),
			jQuery.Deferred().resolve( "waldo" )
		]
	}, function( label, args ) {
		var result = jQuery.when.apply( jQuery, args );

		assert.ok( typeof result.then === "function", "Thenable returned from " + label );
		assert.strictEqual( result.resolve, undefined, "Non-deferred returned from " + label );
		assert.strictEqual( result.promise(), result, "Promise returned from " + label );

		jQuery.each( args, function( i, arg ) {
			assert.notStrictEqual( result, arg, "Returns distinct from arg " + i + " of " + label );
			if ( arg.promise ) {
				assert.notStrictEqual( result, arg.promise(),
					"Returns distinct from promise of arg " + i + " of " + label );
			}
		} );
	} );
} );

QUnit.test( "jQuery.when - notify does not affect resolved", function( assert ) {

	assert.expect( 3 );

	var a = jQuery.Deferred().notify( 1 ).resolve( 4 ),
		b = jQuery.Deferred().notify( 2 ).resolve( 5 ),
		c = jQuery.Deferred().notify( 3 ).resolve( 6 );

	jQuery.when( a, b, c ).done( function( a, b, c ) {
		assert.strictEqual( a, 4, "first resolve value ok" );
		assert.strictEqual( b, 5, "second resolve value ok" );
		assert.strictEqual( c, 6, "third resolve value ok" );
	} ).fail( function() {
		assert.ok( false, "Error on resolve" );
	} );
} );

QUnit.test( "jQuery.when(...) - opportunistically synchronous", function( assert ) {

	assert.expect( 5 );

	var when = "before",
		resolved = jQuery.Deferred().resolve( true ),
		rejected = jQuery.Deferred().reject( false ),
		validate = function( label ) {
			return function() {
				assert.equal( when, "before", label );
			};
		},
		done = assert.async( 5 );

	jQuery.when().done( validate( "jQuery.when()" ) ).always( done );
	jQuery.when( when ).done( validate( "jQuery.when(nonThenable)" ) ).always( done );
	jQuery.when( resolved ).done( validate( "jQuery.when(alreadyFulfilled)" ) ).always( done );
	jQuery.when( rejected ).fail( validate( "jQuery.when(alreadyRejected)" ) ).always( done );
	jQuery.when( resolved, rejected )
		.always( validate( "jQuery.when(alreadyFulfilled, alreadyRejected)" ) )
		.always( done );

	when = "after";
} );
