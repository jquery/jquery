module( "deferred", {
	teardown: moduleTeardown
});

jQuery.each( [ "", " - new operator" ], function( _, withNew ) {

	function createDeferred( fn ) {
		return withNew ? new jQuery.Deferred( fn ) : jQuery.Deferred( fn );
	}

	test( "jQuery.Deferred" + withNew, function() {

		expect( 23 );

		var defer = createDeferred();

		ok( jQuery.isFunction( defer.pipe ), "defer.pipe is a function" );

		createDeferred().resolve().done(function() {
			ok( true, "Success on resolve" );
			strictEqual( this.state(), "resolved", "Deferred is resolved (state)" );
		}).fail(function() {
			ok( false, "Error on resolve" );
		}).always(function() {
			ok( true, "Always callback on resolve" );
		});

		createDeferred().reject().done(function() {
			ok( false, "Success on reject" );
		}).fail(function() {
			ok( true, "Error on reject" );
			strictEqual( this.state(), "rejected", "Deferred is rejected (state)" );
		}).always(function() {
			ok( true, "Always callback on reject" );
		});

		createDeferred(function( defer ) {
			ok( this === defer, "Defer passed as this & first argument" );
			this.resolve("done");
		}).done(function( value ) {
			strictEqual( value, "done", "Passed function executed" );
		});

		createDeferred(function( defer ) {
			var promise = defer.promise(),
				func = function() {},
				funcPromise = defer.promise( func );
			strictEqual( defer.promise(), promise, "promise is always the same" );
			strictEqual( funcPromise, func, "non objects get extended" );
			jQuery.each( promise, function( key ) {
				if ( !jQuery.isFunction( promise[ key ] ) ) {
					ok( false, key + " is a function (" + jQuery.type( promise[ key ] ) + ")" );
				}
				if ( promise[ key ] !== func[ key ] ) {
					strictEqual( func[ key ], promise[ key ], key + " is the same" );
				}
			});
		});

		jQuery.expandedEach = jQuery.each;
		jQuery.expandedEach( "resolve reject".split(" "), function( _, change ) {
			createDeferred(function( defer ) {
				strictEqual( defer.state(), "pending", "pending after creation" );
				var checked = 0;
				defer.progress(function( value ) {
					strictEqual( value, checked, "Progress: right value (" + value + ") received" );
				});
				for ( checked = 0; checked < 3; checked++ ) {
					defer.notify( checked );
				}
				strictEqual( defer.state(), "pending", "pending after notification" );
				defer[ change ]();
				notStrictEqual( defer.state(), "pending", "not pending after " + change );
				defer.notify();
			});
		});
	});
});


test( "jQuery.Deferred - chainability", function() {

	var defer = jQuery.Deferred();

	expect( 10 );

	jQuery.expandedEach = jQuery.each;
	jQuery.expandedEach( "resolve reject notify resolveWith rejectWith notifyWith done fail progress always".split(" "), function( _, method ) {
		var object = {
			m: defer[ method ]
		};
		strictEqual( object.m(), object, method + " is chainable" );
	});
});

test( "jQuery.Deferred.then - filtering (done)", function( assert ) {

	assert.expect( 4 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then(function( a, b ) {
			return a * b;
		}),
		done = jQuery.map( new Array( 3 ), function() { return assert.async(); } );

	piped.done(function( result ) {
		value3 = result;
	});

	defer.done(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.resolve( 2, 3 ).then(function() {
		assert.strictEqual( value1, 2, "first resolve value ok" );
		assert.strictEqual( value2, 3, "second resolve value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done.pop().call();
	});

	jQuery.Deferred().reject().then(function() {
		assert.ok( false, "then should not be called on reject" );
	}).then( null, done.pop() );

	jQuery.Deferred().resolve().then( jQuery.noop ).done(function( value ) {
		assert.strictEqual( value, undefined, "then done callback can return undefined/null" );
		done.pop().call();
	});
});

test( "jQuery.Deferred.then - filtering (fail)", function( assert ) {

	assert.expect( 4 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, function( a, b ) {
			return a * b;
		}),
		done = jQuery.map( new Array( 3 ), function() { return assert.async(); } );

	piped.done(function( result ) {
		value3 = result;
	});

	defer.fail(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.reject( 2, 3 ).then( null, function() {
		assert.strictEqual( value1, 2, "first reject value ok" );
		assert.strictEqual( value2, 3, "second reject value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done.pop().call();
	});

	jQuery.Deferred().resolve().then( null, function() {
		assert.ok( false, "then should not be called on resolve" );
	}).then( done.pop() );

	jQuery.Deferred().reject().then( null, jQuery.noop ).done(function( value ) {
		assert.strictEqual( value, undefined, "then fail callback can return undefined/null" );
		done.pop().call();
	});
});

test( "[PIPE ONLY] jQuery.Deferred.pipe - filtering (fail)", function( assert ) {

	assert.expect( 4 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.pipe( null, function( a, b ) {
			return a * b;
		}),
		done = jQuery.map( new Array( 3 ), function() { return assert.async(); } );

	piped.fail(function( result ) {
		value3 = result;
	});

	defer.fail(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.reject( 2, 3 ).pipe( null, function() {
		assert.strictEqual( value1, 2, "first reject value ok" );
		assert.strictEqual( value2, 3, "second reject value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done.pop().call();
	});

	jQuery.Deferred().resolve().pipe( null, function() {
		assert.ok( false, "then should not be called on resolve" );
	}).then( done.pop() );

	jQuery.Deferred().reject().pipe( null, jQuery.noop ).fail(function( value ) {
		assert.strictEqual( value, undefined, "then fail callback can return undefined/null" );
		done.pop().call();
	});
});

test( "jQuery.Deferred.then - filtering (progress)", function( assert ) {

	assert.expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, null, function( a, b ) {
			return a * b;
		}),
		done = assert.async();

	piped.progress(function( result ) {
		value3 = result;
	});

	defer.progress(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.notify( 2, 3 ).then( null, null, function() {
		assert.strictEqual( value1, 2, "first progress value ok" );
		assert.strictEqual( value2, 3, "second progress value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done();
	});
});

test( "jQuery.Deferred.then - deferred (done)", function( assert ) {

	assert.expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then(function( a, b ) {
			return jQuery.Deferred(function( defer ) {
				defer.reject( a * b );
			});
		}),
		done = assert.async();

	piped.fail(function( result ) {
		value3 = result;
	});

	defer.done(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.resolve( 2, 3 );

	piped.fail(function() {
		assert.strictEqual( value1, 2, "first resolve value ok" );
		assert.strictEqual( value2, 3, "second resolve value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done();
	});
});

test( "jQuery.Deferred.then - deferred (fail)", function( assert ) {

	assert.expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, function( a, b ) {
			return jQuery.Deferred(function( defer ) {
				defer.resolve( a * b );
			});
		}),
		done = assert.async();

	piped.done(function( result ) {
		value3 = result;
	});

	defer.fail(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.reject( 2, 3 );

	piped.done(function() {
		assert.strictEqual( value1, 2, "first reject value ok" );
		assert.strictEqual( value2, 3, "second reject value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done();
	});
});

test( "jQuery.Deferred.then - deferred (progress)", function( assert ) {

	assert.expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, null, function( a, b ) {
			return jQuery.Deferred(function( defer ) {
				defer.resolve( a * b );
			});
		}),
		done = assert.async();

	piped.progress(function( result ) {
		return jQuery.Deferred().resolve().then(function() {
			return result;
		}).then(function( result ) {
			value3 = result;
		});
	});

	defer.progress(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.notify( 2, 3 );

	piped.then( null, null, function( result ) {
		return jQuery.Deferred().resolve().then(function() {
			return result;
		}).then(function() {
			assert.strictEqual( value1, 2, "first progress value ok" );
			assert.strictEqual( value2, 3, "second progress value ok" );
			assert.strictEqual( value3, 6, "result of filter ok" );
			done();
		});
	});
});

test( "[PIPE ONLY] jQuery.Deferred.pipe - deferred (progress)", function( assert ) {

	assert.expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.pipe( null, null, function( a, b ) {
			return jQuery.Deferred(function( defer ) {
				defer.resolve( a * b );
			});
		}),
		done = assert.async();

	piped.done(function( result ) {
		value3 = result;
	});

	defer.progress(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.notify( 2, 3 );

	piped.done(function() {
		assert.strictEqual( value1, 2, "first progress value ok" );
		assert.strictEqual( value2, 3, "second progress value ok" );
		assert.strictEqual( value3, 6, "result of filter ok" );
		done();
	});
});

test( "jQuery.Deferred.then - context", function( assert ) {

	assert.expect( 7 );

	var defer, piped, defer2, piped2,
		context = {},
		done = jQuery.map( new Array( 4 ), function() { return assert.async(); } );

	jQuery.Deferred().resolveWith( context, [ 2 ] ).then(function( value ) {
		return value * 3;
	}).done(function( value ) {
		assert.notStrictEqual( this, context, "custom context not propagated through .then" );
		assert.strictEqual( value, 6, "proper value received" );
		done.pop().call();
	});

	jQuery.Deferred().resolve().then(function() {
		return jQuery.Deferred().resolveWith( context );
	}).done(function() {
		assert.strictEqual( this, context,
			"custom context of returned deferred correctly propagated" );
		done.pop().call();
	});

	defer = jQuery.Deferred();
	piped = defer.then(function( value ) {
		return value * 3;
	});

	defer.resolve( 2 );

	piped.done(function( value ) {
		assert.strictEqual( this, piped,
			"default context gets updated to latest promise in the chain" );
		assert.strictEqual( value, 6, "proper value received" );
		done.pop().call();
	});

	defer2 = jQuery.Deferred();
	piped2 = defer2.then();

	defer2.resolve( 2 );

	piped2.done(function( value ) {
		assert.strictEqual( this, piped2,
			"default context updated to latest promise in the chain (without passing function)" );
		assert.strictEqual( value, 2, "proper value received (without passing function)" );
		done.pop().call();
	});
});

test( "[PIPE ONLY] jQuery.Deferred.pipe - context", function( assert ) {

	assert.expect( 7 );

	var defer, piped, defer2, piped2,
		context = {},
		done = jQuery.map( new Array( 4 ), function() { return assert.async(); } );

	jQuery.Deferred().resolveWith( context, [ 2 ] ).pipe(function( value ) {
		return value * 3;
	}).done(function( value ) {
		assert.strictEqual( this, context, "[PIPE ONLY] custom context correctly propagated" );
		assert.strictEqual( value, 6, "proper value received" );
		done.pop().call();
	});

	jQuery.Deferred().resolve().pipe(function() {
		return jQuery.Deferred().resolveWith(context);
	}).done(function() {
		assert.strictEqual( this, context,
			"custom context of returned deferred correctly propagated" );
		done.pop().call();
	});

	defer = jQuery.Deferred();
	piped = defer.pipe(function( value ) {
		return value * 3;
	});

	defer.resolve( 2 );

	piped.done(function( value ) {
		assert.strictEqual( this, piped,
			"default context gets updated to latest promise in the chain" );
		assert.strictEqual( value, 6, "proper value received" );
		done.pop().call();
	});

	defer2 = jQuery.Deferred();
	piped2 = defer2.pipe();

	defer2.resolve( 2 );

	piped2.done(function( value ) {
		assert.strictEqual( this, piped2,
			"default context updated to latest promise in the chain (without passing function)" );
		assert.strictEqual( value, 2, "proper value received (without passing function)" );
		done.pop().call();
	});
});

asyncTest( "jQuery.Deferred.then - spec compatibility", function() {

	expect( 1 );

	var defer = jQuery.Deferred().done(function() {
		setTimeout( start );
		throw new Error();
	});

	defer.then(function() {
		ok( true, "errors in .done callbacks don't stop .then handlers" );
	});

	try {
		defer.resolve();
	} catch ( _ ) {}
});

test( "jQuery.Deferred - 1.x/2.x compatibility", function( assert ) {

	expect( 8 );

	var context = { id: "callback context" },
		thenable = jQuery.Deferred().resolve( "thenable fulfillment" ).promise(),
		done = jQuery.map( new Array( 8 ), function() { return assert.async(); } );

	thenable.unwrapped = false;

	jQuery.Deferred().resolve( 1, 2 ).then(function() {
		assert.deepEqual( [].slice.call( arguments ), [ 1, 2 ],
			".then fulfillment callbacks receive all resolution values" );
		done.pop().call();
	});
	jQuery.Deferred().reject( 1, 2 ).then( null, function() {
		assert.deepEqual( [].slice.call( arguments ), [ 1, 2 ],
			".then rejection callbacks receive all rejection values" );
		done.pop().call();
	});
	jQuery.Deferred().notify( 1, 2 ).then( null, null, function() {
		assert.deepEqual( [].slice.call( arguments ), [ 1, 2 ],
			".then progress callbacks receive all progress values" );
		done.pop().call();
	});

	jQuery.Deferred().resolveWith( context ).then(function() {
		assert.deepEqual( this, context, ".then fulfillment callbacks receive context" );
		done.pop().call();
	});
	jQuery.Deferred().rejectWith( context ).then( null, function() {
		assert.deepEqual( this, context, ".then rejection callbacks receive context" );
		done.pop().call();
	});
	jQuery.Deferred().notifyWith( context ).then( null, null, function() {
		assert.deepEqual( this, context, ".then progress callbacks receive context" );
		done.pop().call();
	});

	jQuery.Deferred().resolve( thenable ).done(function( value ) {
		assert.strictEqual( value, thenable, ".done doesn't unwrap thenables" );
		done.pop().call();
	});

	jQuery.Deferred().notify( thenable ).then().then( null, null, function( value ) {
		assert.strictEqual( value, "thenable fulfillment",
			".then implicit progress callbacks unwrap thenables" );
		done.pop().call();
	});
});

test( "jQuery.Deferred.then - progress and thenables", function( assert ) {

	expect( 2 );

	var trigger = jQuery.Deferred().notify(),
		expectedProgress = [ "baz", "baz" ],
		done = jQuery.map( new Array( 2 ), function() { return assert.async(); } ),
		failer = function( evt ) {
			return function() {
				ok( false, "no unexpected " + evt );
			};
		};

	trigger.then( null, null, function() {
		var notifier = jQuery.Deferred().notify( "foo" );
		setTimeout(function() {
			notifier.notify( "bar" ).resolve( "baz" );
		});
		return notifier;
	}).then( failer( "fulfill" ), failer( "reject" ), function( v ) {
		assert.strictEqual( v, expectedProgress.shift(), "expected progress value" );
		done.pop().call();
	});
	trigger.notify();
});

test( "jQuery.Deferred - notify and resolve", function( assert ) {

	expect( 7 );

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
});

test( "jQuery.when", function() {

	expect( 37 );

	// Some other objects
	jQuery.each({
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
		ok(
			jQuery.isFunction(
				jQuery.when( value ).done(function( resolveValue ) {
					strictEqual( this, window, "Context is the global object with " + message );
					strictEqual( resolveValue, value, "Test the promise was resolved with " + message );
				}).promise
			),
			"Test " + message + " triggers the creation of a new Promise"
		);
	});

	ok(
		jQuery.isFunction(
			jQuery.when().done(function( resolveValue ) {
				strictEqual( this, window, "Test the promise was resolved with window as its context" );
				strictEqual( resolveValue, undefined, "Test the promise was resolved with no parameter" );
			}).promise
		),
		"Test calling when with no parameter triggers the creation of a new Promise"
	);

	var cache,
		context = {};

	jQuery.when( jQuery.Deferred().resolveWith( context ) ).done(function() {
		strictEqual( this, context, "when( promise ) propagates context" );
	});

	jQuery.each([ 1, 2, 3 ], function( k, i ) {

		jQuery.when( cache || jQuery.Deferred(function() {
				this.resolve( i );
			})
		).done(function( value ) {

			strictEqual( value, 1, "Function executed" + ( i > 1 ? " only once" : "" ) );
			cache = value;
		});

	});
});

test( "jQuery.when - joined", function() {

	expect( 195 );

	var deferreds = {
			rawValue: 1,
			fulfilled: jQuery.Deferred().resolve( 1 ),
			rejected: jQuery.Deferred().reject( 0 ),
			notified: jQuery.Deferred().notify( true ),
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
		willNotify = {
			notified: true,
			eventuallyFulfilled: true,
			eventuallyRejected: true
		},
		counter = 49;

	stop();

	function restart() {
		if ( !--counter ) {
			start();
		}
	}

	jQuery.each( deferreds, function( id1, defer1 ) {
		jQuery.each( deferreds, function( id2, defer2 ) {
			var shouldResolve = willSucceed[ id1 ] && willSucceed[ id2 ],
				shouldError = willError[ id1 ] || willError[ id2 ],
				shouldNotify = willNotify[ id1 ] || willNotify[ id2 ],
				expected = shouldResolve ? [ 1, 1 ] : [ 0, undefined ],
				expectedNotify = shouldNotify && [ willNotify[ id1 ], willNotify[ id2 ] ],
				code = "jQuery.when( " + id1 + ", " + id2 + " )",
				context1 = defer1 && jQuery.isFunction( defer1.promise ) ? defer1.promise() :
					( defer1.then ? window : undefined ),
				context2 = defer2 && jQuery.isFunction( defer2.promise ) ? defer2.promise() :
					( defer2.then ? window : undefined );

			jQuery.when( defer1, defer2 ).done(function( a, b ) {
				if ( shouldResolve ) {
					deepEqual( [ a, b ], expected, code + " => resolve" );
					strictEqual( this[ 0 ], context1, code + " => first context OK" );
					strictEqual( this[ 1 ], context2, code + " => second context OK" );
				} else {
					ok( false,  code + " => resolve" );
				}
			}).fail(function( a, b ) {
				if ( shouldError ) {
					deepEqual( [ a, b ], expected, code + " => reject" );
				} else {
					ok( false, code + " => reject" );
				}
			}).progress(function( a, b ) {
				deepEqual( [ a, b ], expectedNotify, code + " => progress" );
				strictEqual( this[ 0 ], expectedNotify[ 0 ] ? context1 : undefined, code + " => first context OK" );
				strictEqual( this[ 1 ], expectedNotify[ 1 ] ? context2 : undefined, code + " => second context OK" );
			}).always( restart );
		});
	});
	deferreds.eventuallyFulfilled.resolve( 1 );
	deferreds.eventuallyRejected.reject( 0 );
});

test( "jQuery.when - resolved", function() {

	expect( 6 );

	var a = jQuery.Deferred().notify( 1 ).resolve( 4 ),
		b = jQuery.Deferred().notify( 2 ).resolve( 5 ),
		c = jQuery.Deferred().notify( 3 ).resolve( 6 );

	jQuery.when( a, b, c ).progress(function( a, b, c ) {
		strictEqual( a, 1, "first notify value ok" );
		strictEqual( b, 2, "second notify value ok" );
		strictEqual( c, 3, "third notify value ok" );
	}).done(function( a, b, c ) {
		strictEqual( a, 4, "first resolve value ok" );
		strictEqual( b, 5, "second resolve value ok" );
		strictEqual( c, 6, "third resolve value ok" );
	}).fail(function() {
		ok( false, "Error on resolve" );
	});
});

test( "jQuery.when - filtering", function() {

	expect( 2 );

	function increment( x ) {
		return x + 1;
	}

	stop();

	jQuery.when(
		jQuery.Deferred().resolve( 3 ).then( increment ),
		jQuery.Deferred().reject( 5 ).then( null, increment )
	).done(function( four, six ) {
		strictEqual( four, 4, "resolved value incremented" );
		strictEqual( six, 6, "rejected value incremented" );
		start();
	});
});

test( "jQuery.when - exceptions", function() {

	expect( 2 );

	function woops() {
		throw "exception thrown";
	}

	stop();

	jQuery.Deferred().resolve().then( woops ).fail(function( doneException ) {
		strictEqual( doneException, "exception thrown", "throwing in done handler" );
		jQuery.Deferred().reject().then( null, woops ).fail(function( failException ) {
			strictEqual( failException, "exception thrown", "throwing in fail handler" );
			start();
		});
	});
});

test( "jQuery.when - chaining", function() {

	expect( 4 );

	var defer = jQuery.Deferred();

	function chain() {
		return defer;
	}

	function chainStandard() {
		return Promise.resolve( "std deferred" );
	}

	stop();

	jQuery.when(
		jQuery.Deferred().resolve( 3 ).then( chain ),
		jQuery.Deferred().reject( 5 ).then( null, chain ),
		jQuery.Deferred().resolve( 3 ).then( chainStandard ),
		jQuery.Deferred().reject( 5 ).then( null, chainStandard )
	).done(function( v1, v2, s1, s2 ) {
		strictEqual( v1, "other deferred", "chaining in done handler" );
		strictEqual( v2, "other deferred", "chaining in fail handler" );
		strictEqual( s1, "std deferred", "chaining thenable in done handler" );
		strictEqual( s2, "std deferred", "chaining thenable in fail handler" );
		start();
	});

	defer.resolve( "other deferred" );
});
