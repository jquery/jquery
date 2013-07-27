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

	expect( 34 );

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
		"a plain object": {}
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

test( "jQuery.when2", function() {

	expect( 61 );

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
		"a plain object": {}
	}, function( message, value ) {
		ok(
			jQuery.isFunction(
				jQuery.when2( [ value ] ).done(function( resolveValue ) {
					deepEqual( this, [ window ], "Context is [ the global object ] with " + message );
					strictEqual( resolveValue, value, "Test the promise was resolved with " + message );
				}).promise
			),
			"Test " + message + " triggers the creation of a new Promise"
		);

		// When resolving on first success, we get a non-list context and done function
		// is called with an index (always zero here) and the resolved value.
		jQuery.when2( [ value ], { resolveOnFirstSuccess: true } ).done(function( index, resolveValue ) {
			deepEqual( this, window, "Context is the global object with resolveOnFirstSuccess with " + message );
			strictEqual( index, 0, "Test the resolved deferred index is with " + message );
			strictEqual( resolveValue, value, "Test the promise was resolved immediately with " + message );
		});
	});

	ok(
		jQuery.isFunction(
			jQuery.when2().done(function( resolveValue ) {
				strictEqual( this, window, "Test the promise was resolved with window as its context" );
				strictEqual( resolveValue, undefined, "Test the promise was resolved with no parameter" );
			}).promise
		),
		"Test calling when2 with no parameter triggers the creation of a new Promise"
	);

	var cache,
		context = {};

	jQuery.when2( [ jQuery.Deferred().resolveWith( context ) ] ).done(function() {
		deepEqual( this, [ context ], "when2( [ promise ] ) propagates context" );
	});

	jQuery.each([ 1, 2, 3 ], function( k, i ) {

		jQuery.when2([ cache || jQuery.Deferred(function() {
				this.resolve( i );
			})
		]).done(function( value ) {

			strictEqual( value, 1, "Function executed" + ( i > 1 ? " only once" : "" ) );
			cache = value;
		});

	});
});

test( "jQuery.when2 - done (all)", function() {

	expect( 3 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred();

	jQuery.when2( [ defer1, defer2 ] )
	.done(function( a, b ) {
		deepEqual( [ a, b ], [ 1, 2 ], "resolve/resolve => resolve" );
		strictEqual( this[ 0 ], defer1.promise(), "resolve/resolve 1st context OK" );
		strictEqual( this[ 1 ], defer2.promise(), "resolve/resolve 2nd context OK" );
	});

	defer1.resolve( 1 );
	defer2.resolve( 2 );
});

test( "jQuery.when2 - done (resolveOnFirstSuccess)", function() {

	expect( 2 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred();

	jQuery.when2( [ defer1, defer2 ],
		      { resolveOnFirstSuccess: true } )
	.done(function( index, value ) {
		deepEqual( [ index, value ], [ 0, 1 ], "resolve/resolve => resolve" );
		strictEqual( this, defer1.promise(), "resolve/resolve context OK" );
	});

	defer1.resolve( 1 );
	defer2.resolve( 2 );
});

test( "jQuery.when2 - done (resolveOnFirstSuccess) other order", function() {

	expect( 2 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred();

	jQuery.when2( [ defer1, defer2 ],
		      { resolveOnFirstSuccess: true } )
	.done(function( index, value ) {
		deepEqual( [ index, value ], [ 1, 2 ], "resolve/resolve => resolve" );
		strictEqual( this, defer2.promise(), "resolve/resolve context OK" );
	});

	defer2.resolve( 2 );
	defer1.resolve( 1 );
});

test( "jQuery.when2 - done scalar/resolve (resolveOnFirstSuccess)", function() {

	expect( 2 );

	var defer = jQuery.Deferred().resolve( 1 );

	jQuery.when2( [ 3, defer ],
		      { resolveOnFirstSuccess: true } )
	.done(function( index, value ) {
		deepEqual( [ index, value ], [ 0, 3 ], "scalar/resolve => resolve" );
		strictEqual( this, window, "resolve/resolve context OK" );
	});
});

test( "jQuery.when2 - done scalar/resolve later (resolveOnFirstSuccess)", function() {

	expect( 2 );

	var defer = jQuery.Deferred();

	jQuery.when2( [ defer, 3 ],
		      { resolveOnFirstSuccess: true } )
	.done(function( index, value ) {
		deepEqual( [ index, value ], [ 1, 3 ], "scalar/resolve => resolve" );
		strictEqual( this, window, "resolve/resolve context OK" );
	});

	defer.resolve( 1 );
});

test( "jQuery.when2 - fail pending/reject", function() {

	expect( 2 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred();

	jQuery.when2( [ defer1, defer2 ] )
	.fail(function( index, value ) {
		deepEqual( [ index, value ], [ 0, 1 ], "pending/reject => fail" );
		strictEqual( this, defer1.promise(), "pending/reject context" );
	});

	defer1.reject( 1 );
});

test( "jQuery.when2 - fail pending/reject (failOnFirstError true)", function() {

	expect( 2 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred();

	jQuery.when2( [ defer1, defer2 ],
		      { failOnFirstError: true } )
	.fail(function( index, value ) {
		deepEqual( [ index, value ], [ 0, 1 ], "pending/reject => fail" );
		strictEqual( this, defer1.promise(), "pending/reject context" );
	});

	defer1.reject( 1 );
});

test( "jQuery.when2 - fail resolve/reject", function() {

	expect( 2 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred();

	jQuery.when2( [ defer1, defer2 ] )
	.fail(function( index, value ) {
		deepEqual( [ index, value ], [ 1, 2 ], "resolve/reject => fail" );
		strictEqual( this, defer2.promise(), "resolve/reject context" );
	});

	defer1.resolve( 1 );
	defer2.reject( 2 );
});

test( "jQuery.when2 - fail resolve/reject (failOnFirstError true)", function() {

	expect( 2 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred();

	jQuery.when2( [ defer1, defer2 ],
		      { failOnFirstError: true } )
	.fail(function( index, value ) {
		deepEqual( [ index, value ], [ 1, 2 ], "resolve/reject => fail" );
		strictEqual( this, defer2.promise(), "resolve/reject context" );
	});

	defer1.resolve( 1 );
	defer2.reject( 2 );
});

test( "jQuery.when2 - fail resolve/reject (failOnFirstError true, resolveOnFirstSuccess true)", function() {

	expect( 2 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred();

	jQuery.when2( [ defer1, defer2 ],
		      { failOnFirstError: true, resolveOnFirstSuccess: true } )
	.done(function( index, value ) {
		deepEqual( [ index, value ], [ 0, 1 ], "resolve/reject => done" );
		strictEqual( this, defer1.promise(), "resolve/reject context" );
	})
	.fail(function() {
		ok( false, "Fail called when it shouldn't have been.");
	});

	defer1.resolve( 1 );
	defer2.reject( 2 );
});

test( "jQuery.when2 - fail reject/resolve (failOnFirstError true, resolveOnFirstSuccess true)", function() {

	expect( 2 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred();

	jQuery.when2( [ defer1, defer2 ],
		      { failOnFirstError: true, resolveOnFirstSuccess: true } )
	.fail(function( index, value ) {
		deepEqual( [ index, value ], [ 0, 1 ], "reject/resolve => done" );
		strictEqual( this, defer1.promise(), "reject/resolve context" );
	})
	.done(function() {
		ok( false, "Done called when it shouldn't have been.");
	});

	defer1.reject( 1 );
	defer2.resolve( 2 );
});

test( "jQuery.when2 - fail (failOnFirstError false) reject/resolve", function() {

	expect( 3 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred();

	jQuery.when2( [ defer1, defer2 ],
		      { failOnFirstError: false } )
	.done(function( a, b ) {
		deepEqual( [ a, b ], [ 1, 2 ], "reject/resolve => done" );
		strictEqual( this[0], defer1.promise(), "reject/resolve context 1" );
		strictEqual( this[1], defer2.promise(), "reject/resolve context 2" );
	});

	defer1.reject( 1 );
	defer2.resolve( 2 );
});

test( "jQuery.when2 - progress notify/notify", function() {

	expect( 4 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred(),
		count = 0;

	jQuery.when2( [ defer1, defer2 ],
		      { failOnFirstError: false } )
	.progress(function( index, value ) {
		if ( count === 0 ) {
			deepEqual( [ index, value ], [ 0, 1 ], "notify 1 => progress" );
			strictEqual( this, defer1.promise(), "notify context 1" );
			count++;
		} else if ( count === 1 ){
			deepEqual( [ index, value ], [ 1, 2 ], "notify 2 => progress" );
			strictEqual( this, defer2.promise(), "notify context 2" );
			count++;
		} else {
			ok( false, "Progress called too many times" );
		}
	});

	defer1.notify( 1 );
	defer2.notify( 2 );
});

test( "jQuery.when2 - progress no notify after resolve", function() {

	expect( 2 );

	var defer1 = jQuery.Deferred(),
		defer2 = jQuery.Deferred(),
		count = 0;

	jQuery.when2( [ defer1, defer2 ],
		      { failOnFirstError: false } )
	.progress(function( index, value ) {
		if ( count === 0 ) {
			deepEqual( [ index, value ], [ 0, 1 ], "notify 1 => progress" );
			strictEqual( this, defer1.promise(), "notify context 1" );
			count++;
		} else {
			ok( false, "Progress called too many times." );
		}
	});

	defer1.notify( 1 );
	defer1.resolve( 1 );
	defer2.resolve( 2 );
	defer2.notify( 2 );
});
