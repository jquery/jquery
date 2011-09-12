module("topic", { teardown: moduleTeardown });

test( "jQuery.Topic - Anonymous Topic", function() {

	expect( 4 );

	var topic = jQuery.Topic(),
		count = 0;

	function firstCallback( value ) {
		strictEqual( count, 1, "Callback called when needed" );
		strictEqual( value, "test", "Published value received" );
	}

	count++;
	topic.subscribe( firstCallback );
	topic.publish( "test" );
	topic.unsubscribe( firstCallback );
	count++;
	topic.subscribe(function( value ) {
		strictEqual( count, 2, "Callback called when needed" );
		strictEqual( value, "test", "Published value received" );
	});
	topic.publish( "test" );

});

test( "jQuery.Topic - Named Topic", function() {

	expect( 2 );

	function callback( value ) {
		ok( true, "Callback called" );
		strictEqual( value, "test", "Proper value received" );
	}

	jQuery.Topic( "test" ).subscribe( callback );
	jQuery.Topic( "test" ).publish( "test" );
	jQuery.Topic( "test" ).unsubscribe( callback );
	jQuery.Topic( "test" ).publish( "test" );
});

test( "jQuery.Topic - Helpers", function() {

	expect( 4 );

	function callback( value ) {
		ok( true, "Callback called" );
		strictEqual( value, "test", "Proper value received" );
	}

	jQuery.subscribe( "test", callback );
	jQuery.publish( "test" , "test" );
	jQuery.unsubscribe( "test", callback );
	jQuery.publish( "test" , "test" );


	var test = true,
		subscription = jQuery.subscribe( "test", function() {
			ok( test, "first callback called" );
		}, function() {
			ok( test, "second callback called" );
		});
	jQuery.publish( "test" );
	test = false;
	jQuery.unsubscribe( subscription );
	jQuery.publish( "test" );
});
