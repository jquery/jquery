module("deferred", { teardown: moduleTeardown });

jQuery.each( [ "", " - new operator" ], function( _, withNew ) {

	function createDeferred( fn ) {
		return withNew ? new jQuery.Deferred( fn ) : jQuery.Deferred( fn );
	}

	test("jQuery.Deferred" + withNew, function() {

		expect( 22 );

		createDeferred().resolve().then( function() {
			ok( true , "Success on resolve" );
			ok( this.isResolved(), "Deferred is resolved" );
			strictEqual( this.state(), "resolved", "Deferred is resolved (state)" );
		}, function() {
			ok( false , "Error on resolve" );
		}).always( function() {
			ok( true , "Always callback on resolve" );
		});

		createDeferred().reject().then( function() {
			ok( false , "Success on reject" );
		}, function() {
			ok( true , "Error on reject" );
			ok( this.isRejected(), "Deferred is rejected" );
			strictEqual( this.state(), "rejected", "Deferred is rejected (state)" );
		}).always( function() {
			ok( true , "Always callback on reject" );
		});

		createDeferred( function( defer ) {
			ok( this === defer , "Defer passed as this & first argument" );
			this.resolve( "done" );
		}).then( function( value ) {
			strictEqual( value , "done" , "Passed function executed" );
		});

		jQuery.each( "resolve reject".split( " " ), function( _, change ) {
			createDeferred( function( defer ) {
				strictEqual( defer.state(), "pending", "pending after creation" );
				var checked = 0;
				defer.progress(function( value ) {
					strictEqual( value, checked, "Progress: right value (" + value + ") received" );
				});
				for( checked = 0; checked < 3 ; checked++ ) {
					defer.notify( checked );
				}
				strictEqual( defer.state(), "pending", "pending after notification" );
				defer[ change ]();
				notStrictEqual( defer.state(), "pending", "not pending after " + change );
				defer.notify();
			});
		});
	});
} );

test( "jQuery.Deferred - chainability", function() {

	var methods = "resolve reject notify resolveWith rejectWith notifyWith done fail progress then always".split( " " ),
		defer = jQuery.Deferred();

	expect( methods.length );

	jQuery.each( methods, function( _, method ) {
		var object = { m: defer[ method ] };
		strictEqual( object.m(), object, method + " is chainable" );
	});
});

test( "jQuery.Deferred.pipe - filtering (done)", function() {

	expect(4);

	var defer = jQuery.Deferred(),
		piped = defer.pipe(function( a, b ) {
			return a * b;
		}),
		value1,
		value2,
		value3;

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

	jQuery.Deferred().reject().pipe(function() {
		ok( false, "pipe should not be called on reject" );
	});

	jQuery.Deferred().resolve().pipe( jQuery.noop ).done(function( value ) {
		strictEqual( value, undefined, "pipe done callback can return undefined/null" );
	});
});

test( "jQuery.Deferred.pipe - filtering (fail)", function() {

	expect(4);

	var defer = jQuery.Deferred(),
		piped = defer.pipe( null, function( a, b ) {
			return a * b;
		} ),
		value1,
		value2,
		value3;

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

	jQuery.Deferred().resolve().pipe( null, function() {
		ok( false, "pipe should not be called on resolve" );
	} );

	jQuery.Deferred().reject().pipe( null, jQuery.noop ).fail(function( value ) {
		strictEqual( value, undefined, "pipe fail callback can return undefined/null" );
	});
});

test( "jQuery.Deferred.pipe - filtering (progress)", function() {

	expect(3);

	var defer = jQuery.Deferred(),
		piped = defer.pipe( null, null, function( a, b ) {
			return a * b;
		} ),
		value1,
		value2,
		value3;

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

test( "jQuery.Deferred.pipe - deferred (done)", function() {

	expect(3);

	var defer = jQuery.Deferred(),
		piped = defer.pipe(function( a, b ) {
			return jQuery.Deferred(function( defer ) {
				defer.reject( a * b );
			});
		}),
		value1,
		value2,
		value3;

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

test( "jQuery.Deferred.pipe - deferred (fail)", function() {

	expect(3);

	var defer = jQuery.Deferred(),
		piped = defer.pipe( null, function( a, b ) {
			return jQuery.Deferred(function( defer ) {
				defer.resolve( a * b );
			});
		} ),
		value1,
		value2,
		value3;

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

test( "jQuery.Deferred.pipe - deferred (progress)", function() {

	expect(3);

	var defer = jQuery.Deferred(),
		piped = defer.pipe( null, null, function( a, b ) {
			return jQuery.Deferred(function( defer ) {
				defer.resolve( a * b );
			});
		} ),
		value1,
		value2,
		value3;

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

test( "jQuery.Deferred.pipe - context", function() {

	expect(4);

	var context = {};

	jQuery.Deferred().resolveWith( context, [ 2 ] ).pipe(function( value ) {
		return value * 3;
	}).done(function( value ) {
		strictEqual( this, context, "custom context correctly propagated" );
		strictEqual( value, 6, "proper value received" );
	});

	var defer = jQuery.Deferred(),
		piped = defer.pipe(function( value ) {
			return value * 3;
		});

	defer.resolve( 2 );

	piped.done(function( value ) {
		strictEqual( this.promise(), piped, "default context gets updated to latest defer in the chain" );
		strictEqual( value, 6, "proper value received" );
	});
});

test( "jQuery.when" , function() {

	expect( 23 );

	// Some other objects
	jQuery.each( {

		"an empty string": "",
		"a non-empty string": "some string",
		"zero": 0,
		"a number other than zero": 1,
		"true": true,
		"false": false,
		"null": null,
		"undefined": undefined,
		"a plain object": {}

	} , function( message , value ) {

		ok( jQuery.isFunction( jQuery.when( value ).done(function( resolveValue ) {
			strictEqual( resolveValue , value , "Test the promise was resolved with " + message );
		}).promise ) , "Test " + message + " triggers the creation of a new Promise" );

	} );

	ok( jQuery.isFunction( jQuery.when().done(function( resolveValue ) {
		strictEqual( resolveValue , undefined , "Test the promise was resolved with no parameter" );
	}).promise ) , "Test calling when with no parameter triggers the creation of a new Promise" );

	var cache, i;

	for( i = 1 ; i < 4 ; i++ ) {
		jQuery.when( cache || jQuery.Deferred( function() {
			this.resolve( i );
		}) ).done(function( value ) {
			strictEqual( value , 1 , "Function executed" + ( i > 1 ? " only once" : "" ) );
			cache = value;
		});
	}
});

test("jQuery.when - joined", function() {

	expect(53);

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
			    code = id1 + "/" + id2;

			var promise = jQuery.when( defer1, defer2 ).done(function( a, b ) {
				if ( shouldResolve ) {
					deepEqual( [ a, b ], expected, code + " => resolve" );
				} else {
					ok( false ,  code + " => resolve" );
				}
			}).fail(function( a, b ) {
				if ( shouldError ) {
					deepEqual( [ a, b ], expected, code + " => reject" );
				} else {
					ok( false ,  code + " => reject" );
				}
			}).progress(function progress( a, b ) {
				deepEqual( [ a, b ], expectedNotify, code + " => progress" );
			});
		} );
	} );
	deferreds.futureSuccess.resolve( 1 );
	deferreds.futureError.reject( 0 );
});
