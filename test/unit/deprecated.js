QUnit.module( "deprecated", { afterEach: moduleTeardown } );

if ( includesModule( "deprecated" ) ) {

QUnit.test( "bind/unbind", function( assert ) {
	assert.expect( 4 );

	var markup = jQuery(
		"<div><p><span><b>b</b></span></p></div>"
	);

	markup
		.find( "b" )
		.bind( "click", { bindData: 19 }, function( e, trig ) {
			assert.equal( e.type, "click", "correct event type" );
			assert.equal( e.data.bindData, 19, "correct trigger data" );
			assert.equal( trig, 42, "correct bind data" );
			assert.equal( e.target.nodeName.toLowerCase(), "b", "correct element" );
		} )
		.trigger( "click", [ 42 ] )
		.unbind( "click" )
		.trigger( "click" )
		.remove();
} );

QUnit.test( "delegate/undelegate", function( assert ) {
	assert.expect( 2 );

	var markup = jQuery(
		"<div><p><span><b>b</b></span></p></div>"
	);

	markup
		.delegate( "b", "click", function( e ) {
			assert.equal( e.type, "click", "correct event type" );
			assert.equal( e.target.nodeName.toLowerCase(), "b", "correct element" );
		} )
		.find( "b" )
			.trigger( "click" )
			.end()
		.undelegate( "b", "click" )
		.remove();
} );

QUnit.test( "hover() mouseenter mouseleave", function( assert ) {
	assert.expect( 1 );

	var times = 0,
		handler1 = function() { ++times; },
		handler2 = function() { ++times; };

	jQuery( "#firstp" )
		.hover( handler1, handler2 )
		.mouseenter().mouseleave()
		.off( "mouseenter", handler1 )
		.off( "mouseleave", handler2 )
		.hover( handler1 )
		.mouseenter().mouseleave()
		.off( "mouseenter mouseleave", handler1 )
		.mouseenter().mouseleave();

	assert.equal( times, 4, "hover handlers fired" );
} );

QUnit.test( "trigger() shortcuts", function( assert ) {
	assert.expect( 5 );

	var counter, clickCounter,
		elem = jQuery( "<li><a href='#'>Change location</a></li>" ).prependTo( "#firstUL" );
	elem.find( "a" ).on( "click", function() {
		var close = jQuery( "spanx", this ); // same with jQuery(this).find("span");
		assert.equal( close.length, 0, "Context element does not exist, length must be zero" );
		assert.ok( !close[ 0 ], "Context element does not exist, direct access to element must return undefined" );
		return false;
	} ).click();

	// manually clean up detached elements
	elem.remove();

	jQuery( "#check1" ).click( function() {
		assert.ok( true, "click event handler for checkbox gets fired twice, see trac-815" );
	} ).click();

	counter = 0;
	jQuery( "#firstp" )[ 0 ].onclick = function() {
		counter++;
	};
	jQuery( "#firstp" ).click();
	assert.equal( counter, 1, "Check that click, triggers onclick event handler also" );

	clickCounter = 0;
	jQuery( "#simon1" )[ 0 ].onclick = function() {
		clickCounter++;
	};
	jQuery( "#simon1" ).click();
	assert.equal( clickCounter, 1, "Check that click, triggers onclick event handler on an a tag also" );
} );

if ( includesModule( "ajax" ) ) {
	ajaxTest( "jQuery.ajax() - events with context", 12, function( assert ) {
		var context = document.createElement( "div" );

		function event( e ) {
			assert.equal( this, context, e.type );
		}

		function callback( msg ) {
			return function() {
				assert.equal( this, context, "context is preserved on callback " + msg );
			};
		}

		return {
			setup: function() {
				jQuery( context ).appendTo( "#foo" )
					.on( "ajaxSend", event )
					.on( "ajaxComplete", event )
					.on( "ajaxError", event )
					.on( "ajaxSuccess", event );
			},
			requests: [ {
				url: url( "name.html" ),
				context: context,
				beforeSend: callback( "beforeSend" ),
				success: callback( "success" ),
				complete: callback( "complete" )
			}, {
				url: url( "404.txt" ),
				context: context,
				beforeSend: callback( "beforeSend" ),
				error: callback( "error" ),
				complete: callback( "complete" )
			} ]
		};
	} );
}

QUnit.test( "Event aliases", function( assert ) {

	// Explicitly skipping focus/blur events due to their flakiness
	var	$elem = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" ),
		aliases = ( "resize scroll click dblclick mousedown mouseup " +
			"mousemove mouseover mouseout mouseenter mouseleave change " +
			"select submit keydown keypress keyup contextmenu" ).split( " " );
	assert.expect( aliases.length );

	jQuery.each( aliases, function( i, name ) {

		// e.g. $(elem).click(...).click();
		$elem[ name ]( function( event ) {
			assert.equal( event.type, name, "triggered " + name );
		} )[ name ]().off( name );
	} );
} );

QUnit.test( "jQuery.proxy", function( assert ) {
	assert.expect( 9 );

	var test2, test3, test4, fn, cb,
		test = function() {
			assert.equal( this, thisObject, "Make sure that scope is set properly." );
		},
		thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	jQuery.proxy( test, thisObject )();

	// Another take on it
	jQuery.proxy( thisObject, "method" )();

	// Make sure it doesn't freak out
	assert.equal( jQuery.proxy( null, thisObject ), undefined, "Make sure no function was returned." );

	// Partial application
	test2 = function( a ) {
		assert.equal( a, "pre-applied", "Ensure arguments can be pre-applied." );
	};
	jQuery.proxy( test2, null, "pre-applied" )();

	// Partial application w/ normal arguments
	test3 = function( a, b ) {
		assert.equal( b, "normal", "Ensure arguments can be pre-applied and passed as usual." );
	};
	jQuery.proxy( test3, null, "pre-applied" )( "normal" );

	// Test old syntax
	test4 = { "meth": function( a ) {
			assert.equal( a, "boom", "Ensure old syntax works." );
		} };
	jQuery.proxy( test4, "meth" )( "boom" );

	// jQuery 1.9 improved currying with `this` object
	fn = function() {
		assert.equal( Array.prototype.join.call( arguments, "," ), "arg1,arg2,arg3", "args passed" );
		assert.equal( this.foo, "bar", "this-object passed" );
	};
	cb = jQuery.proxy( fn, null, "arg1", "arg2" );
	cb.call( thisObject, "arg3" );
} );

}
