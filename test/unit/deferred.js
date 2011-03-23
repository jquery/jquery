module("deferred", { teardown: moduleTeardown });

test("jQuery._Deferred()", function() {

	expect( 11 );

	var deferred,
		object,
		test;

	deferred = jQuery._Deferred();

	test = false;

	deferred.done( function( value ) {
		equals( value , "value" , "Test pre-resolve callback" );
		test = true;
	} );

	deferred.resolve( "value" );

	ok( test , "Test pre-resolve callbacks called right away" );

	test = false;

	deferred.done( function( value ) {
		equals( value , "value" , "Test post-resolve callback" );
		test = true;
	} );

	ok( test , "Test post-resolve callbacks called right away" );

	deferred.cancel();

	test = true;

	deferred.done( function() {
		ok( false , "Cancel was ignored" );
		test = false;
	} );

	ok( test , "Test cancel" );

	deferred = jQuery._Deferred().resolve();

	try {
		deferred.done( function() {
			throw "Error";
		} , function() {
			ok( true , "Test deferred do not cancel on exception" );
		} );
	} catch( e ) {
		strictEqual( e , "Error" , "Test deferred propagates exceptions");
		deferred.done();
	}

	test = "";
	deferred = jQuery._Deferred().done( function() {

		test += "A";

	}, function() {

		test += "B";

	} ).resolve();

	strictEqual( test , "AB" , "Test multiple done parameters" );

	test = "";

	deferred.done( function() {

		deferred.done( function() {

			test += "C";

		} );

		test += "A";

	}, function() {

		test += "B";
	} );

	strictEqual( test , "ABC" , "Test done callbacks order" );

	deferred = jQuery._Deferred();

	deferred.resolveWith( jQuery , [ document ] ).done( function( doc ) {
		ok( this === jQuery && arguments.length === 1 && doc === document , "Test fire context & args" );
	});

	// #8421
	deferred = jQuery._Deferred();
	deferred.resolveWith().done(function() {
		ok( true, "Test resolveWith can be called with no argument" );
	});
});

test("jQuery.Deferred()", function() {

	expect( 10 );

	jQuery.Deferred( function( defer ) {
		strictEqual( this , defer , "Defer passed as this & first argument" );
		this.resolve( "done" );
	}).then( function( value ) {
		strictEqual( value , "done" , "Passed function executed" );
	});

	jQuery.Deferred().resolve().then( function() {
		ok( true , "Success on resolve" );
	}, function() {
		ok( false , "Error on resolve" );
	});

	jQuery.Deferred().reject().then( function() {
		ok( false , "Success on reject" );
	}, function() {
		ok( true , "Error on reject" );
	});

	( new jQuery.Deferred( function( defer ) {
		strictEqual( this , defer , "Defer passed as this & first argument (new)" );
		this.resolve( "done" );
	}) ).then( function( value ) {
		strictEqual( value , "done" , "Passed function executed (new)" );
	});

	( new jQuery.Deferred() ).resolve().then( function() {
		ok( true , "Success on resolve (new)" );
	}, function() {
		ok( false , "Error on resolve (new)" );
	});

	( new jQuery.Deferred() ).reject().then( function() {
		ok( false , "Success on reject (new)" );
	}, function() {
		ok( true , "Error on reject (new)" );
	});

	var tmp = jQuery.Deferred();

	strictEqual( tmp.promise() , tmp.promise() , "Test deferred always return same promise" );
	strictEqual( tmp.promise() , tmp.promise().promise() , "Test deferred's promise always return same promise as deferred" );
});

test("jQuery.when()", function() {

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

		ok( jQuery.isFunction( jQuery.when( value ).then( function( resolveValue ) {
			strictEqual( resolveValue , value , "Test the promise was resolved with " + message );
		} ).promise ) , "Test " + message + " triggers the creation of a new Promise" );

	} );

	ok( jQuery.isFunction( jQuery.when().then( function( resolveValue ) {
		strictEqual( resolveValue , undefined , "Test the promise was resolved with no parameter" );
	} ).promise ) , "Test calling when with no parameter triggers the creation of a new Promise" );

	var cache, i;

	for( i = 1 ; i < 4 ; i++ ) {
		jQuery.when( cache || jQuery.Deferred( function() {
			this.resolve( i );
		}) ).then( function( value ) {
			strictEqual( value , 1 , "Function executed" + ( i > 1 ? " only once" : "" ) );
			cache = value;
		}, function() {
			ok( false , "Fail called" );
		});
	}
});

test("jQuery.when() - joined", function() {

	expect(8);

	jQuery.when( 1, 2, 3 ).done( function( a, b, c ) {
		strictEqual( a , 1 , "Test first param is first resolved value - non-observables" );
		strictEqual( b , 2 , "Test second param is second resolved value - non-observables" );
		strictEqual( c , 3 , "Test third param is third resolved value - non-observables" );
	}).fail( function() {
		ok( false , "Test the created deferred was resolved - non-observables");
	});

	var successDeferred = jQuery.Deferred().resolve( 1 , 2 , 3 ),
		errorDeferred = jQuery.Deferred().reject( "error" , "errorParam" );

	jQuery.when( 1 , successDeferred , 3 ).done( function( a, b, c ) {
		strictEqual( a , 1 , "Test first param is first resolved value - resolved observable" );
		same( b , [ 1 , 2 , 3 ] , "Test second param is second resolved value - resolved observable" );
		strictEqual( c , 3 , "Test third param is third resolved value - resolved observable" );
	}).fail( function() {
		ok( false , "Test the created deferred was resolved - resolved observable");
	});

	jQuery.when( 1 , errorDeferred , 3 ).done( function() {
		ok( false , "Test the created deferred was rejected - rejected observable");
	}).fail( function( error , errorParam ) {
		strictEqual( error , "error" , "Test first param is first rejected value - rejected observable" );
		strictEqual( errorParam , "errorParam" , "Test second param is second rejected value - rejected observable" );
	});
});
