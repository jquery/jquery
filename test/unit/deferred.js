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

		strictEqual( defer.pipe, defer.then, "pipe is an alias of then" );

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

test( "jQuery.Deferred.then - filtering (done)", function() {

	expect( 4 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then(function( a, b ) {
			return a * b;
		});

	piped.done(function( result ) {
		value3 = result;
	});

	defer.done(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.resolve( 2, 3 );

	strictEqual( value1, 2, "first resolve value ok" );
	strictEqual( value2, 3, "second resolve value ok" );
	strictEqual( value3, 6, "result of filter ok" );

	jQuery.Deferred().reject().then(function() {
		ok( false, "then should not be called on reject" );
	});

	jQuery.Deferred().resolve().then( jQuery.noop ).done(function( value ) {
		strictEqual( value, undefined, "then done callback can return undefined/null" );
	});
});

test( "jQuery.Deferred.then - filtering (fail)", function() {

	expect( 4 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, function( a, b ) {
			return a * b;
		});

	piped.fail(function( result ) {
		value3 = result;
	});

	defer.fail(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.reject( 2, 3 );

	strictEqual( value1, 2, "first reject value ok" );
	strictEqual( value2, 3, "second reject value ok" );
	strictEqual( value3, 6, "result of filter ok" );

	jQuery.Deferred().resolve().then( null, function() {
		ok( false, "then should not be called on resolve" );
	});

	jQuery.Deferred().reject().then( null, jQuery.noop ).fail(function( value ) {
		strictEqual( value, undefined, "then fail callback can return undefined/null" );
	});
});

test( "jQuery.Deferred.then - filtering (progress)", function() {

	expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, null, function( a, b ) {
			return a * b;
		});

	piped.progress(function( result ) {
		value3 = result;
	});

	defer.progress(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.notify( 2, 3 );

	strictEqual( value1, 2, "first progress value ok" );
	strictEqual( value2, 3, "second progress value ok" );
	strictEqual( value3, 6, "result of filter ok" );
});

test( "jQuery.Deferred.then - deferred (done)", function() {

	expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then(function( a, b ) {
			return jQuery.Deferred(function( defer ) {
				defer.reject( a * b );
			});
		});

	piped.fail(function( result ) {
		value3 = result;
	});

	defer.done(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.resolve( 2, 3 );

	strictEqual( value1, 2, "first resolve value ok" );
	strictEqual( value2, 3, "second resolve value ok" );
	strictEqual( value3, 6, "result of filter ok" );
});

test( "jQuery.Deferred.then - deferred (fail)", function() {

	expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, function( a, b ) {
			return jQuery.Deferred(function( defer ) {
				defer.resolve( a * b );
			});
		});

	piped.done(function( result ) {
		value3 = result;
	});

	defer.fail(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.reject( 2, 3 );

	strictEqual( value1, 2, "first reject value ok" );
	strictEqual( value2, 3, "second reject value ok" );
	strictEqual( value3, 6, "result of filter ok" );
});

test( "jQuery.Deferred.then - deferred (progress)", function() {

	expect( 3 );

	var value1, value2, value3,
		defer = jQuery.Deferred(),
		piped = defer.then( null, null, function( a, b ) {
			return jQuery.Deferred(function( defer ) {
				defer.resolve( a * b );
			});
		});

	piped.done(function( result ) {
		value3 = result;
	});

	defer.progress(function( a, b ) {
		value1 = a;
		value2 = b;
	});

	defer.notify( 2, 3 );

	strictEqual( value1, 2, "first progress value ok" );
	strictEqual( value2, 3, "second progress value ok" );
	strictEqual( value3, 6, "result of filter ok" );
});

test( "jQuery.Deferred.then - context", function() {

	expect( 7 );

	var defer, piped, defer2, piped2,
		context = {};

	jQuery.Deferred().resolveWith( context, [ 2 ] ).then(function( value ) {
		return value * 3;
	}).done(function( value ) {
		strictEqual( this, context, "custom context correctly propagated" );
		strictEqual( value, 6, "proper value received" );
	});

	jQuery.Deferred().resolve().then(function() {
		return jQuery.Deferred().resolveWith(context);
	}).done(function() {
		strictEqual( this, context, "custom context of returned deferred correctly propagated" );
	});

	defer = jQuery.Deferred();
	piped = defer.then(function( value ) {
		return value * 3;
	});

	defer.resolve( 2 );

	piped.done(function( value ) {
		strictEqual( this, piped, "default context gets updated to latest promise in the chain" );
		strictEqual( value, 6, "proper value received" );
	});

	defer2 = jQuery.Deferred();
	piped2 = defer2.then();

	defer2.resolve( 2 );

	piped2.done(function( value ) {
		strictEqual( this, piped2, "default context gets updated to latest promise in the chain (without passing function)" );
		strictEqual( value, 2, "proper value received (without passing function)" );
	});
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

	expect( 119 );

	var deferreds = {
			value: 1,
			success: jQuery.Deferred().resolve( 1 ),
			error: jQuery.Deferred().reject( 0 ),
			futureSuccess: jQuery.Deferred().notify( true ),
			futureError: jQuery.Deferred().notify( true ),
			notify: jQuery.Deferred().notify( true )
		},
		willSucceed = {
			value: true,
			success: true,
			futureSuccess: true
		},
		willError = {
			error: true,
			futureError: true
		},
		willNotify = {
			futureSuccess: true,
			futureError: true,
			notify: true
		};

	jQuery.each( deferreds, function( id1, defer1 ) {
		jQuery.each( deferreds, function( id2, defer2 ) {
			var shouldResolve = willSucceed[ id1 ] && willSucceed[ id2 ],
				shouldError = willError[ id1 ] || willError[ id2 ],
				shouldNotify = willNotify[ id1 ] || willNotify[ id2 ],
				expected = shouldResolve ? [ 1, 1 ] : [ 0, undefined ],
				expectedNotify = shouldNotify && [ willNotify[ id1 ], willNotify[ id2 ] ],
				code = id1 + "/" + id2,
				context1 = defer1 && jQuery.isFunction( defer1.promise ) ? defer1.promise() : undefined,
				context2 = defer2 && jQuery.isFunction( defer2.promise ) ? defer2.promise() : undefined;

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
			});
		});
	});
	deferreds.futureSuccess.resolve( 1 );
	deferreds.futureError.reject( 0 );
});
