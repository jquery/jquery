QUnit.module( "event", {
	beforeEach: function() {
		document.body.focus();
	},
	afterEach: moduleTeardown
} );

QUnit.test( "null or undefined handler", function( assert ) {
	assert.expect( 4 );

	// Supports Fixes bug #7229
	try {
		jQuery( "#firstp" ).on( "click", null );
		assert.ok( true, "Passing a null handler will not throw an exception" );
	} catch ( e ) {}

	try {
		jQuery( "#firstp" ).on( "click", undefined );
		assert.ok( true, "Passing an undefined handler will not throw an exception" );
	} catch ( e ) {}

	var expectedElem = jQuery( "#firstp" );
	var actualElem = expectedElem.on( "click", null );
	assert.equal( actualElem, expectedElem, "Passing a null handler should return the original element" );

	actualElem = expectedElem.on( "click", undefined );
	assert.equal( actualElem, expectedElem, "Passing a null handler should return the original element" );
} );

QUnit.test( "on() with non-null,defined data", function( assert ) {

	assert.expect( 2 );

	var handler = function( event, data ) {
		assert.equal( data, 0, "non-null, defined data (zero) is correctly passed" );
	};

	jQuery( "#foo" ).on( "foo.on", handler );
	jQuery( "div" ).on( "foo.delegate", "#foo", handler );

	jQuery( "#foo" ).trigger( "foo", 0 );

	jQuery( "#foo" ).off( "foo.on", handler );
	jQuery( "div" ).off( "foo.delegate", "#foo" );

} );

QUnit.test( "Handler changes and .trigger() order", function( assert ) {
	assert.expect( 1 );

	var markup = jQuery(
		"<div><div><p><span><b class=\"a\">b</b></span></p></div></div>"
	),
	path = "";

	markup
		.find( "*" ).addBack().on( "click", function() {
			path += this.nodeName.toLowerCase() + " ";
		} )
		.filter( "b" ).on( "click", function( e ) {

			// Removing span should not stop propagation to original parents
			if ( e.target === this ) {
				jQuery( this ).parent().remove();
			}
		} );

	markup.find( "b" ).trigger( "click" );

	assert.equal( path, "b p div div ", "Delivered all events" );

	markup.remove();
} );

QUnit.test( "on(), with data", function( assert ) {
	assert.expect( 4 );
	var test, handler, handler2;

	handler = function( event ) {
		assert.ok( event.data, "on() with data, check passed data exists" );
		assert.equal( event.data.foo, "bar", "on() with data, Check value of passed data" );
	};
	jQuery( "#firstp" ).on( "click", { "foo": "bar" }, handler ).trigger( "click" ).off( "click", handler );

	assert.ok( !jQuery._data( jQuery( "#firstp" )[ 0 ], "events" ), "Event handler unbound when using data." );

	test = function() {};
	handler2 = function( event ) {
		assert.equal( event.data, test, "on() with function data, Check value of passed data" );
	};
	jQuery( "#firstp" ).on( "click", test, handler2 ).trigger( "click" ).off( "click", handler2 );
} );

QUnit.test( "click(), with data", function( assert ) {
	assert.expect( 3 );
	var handler = function( event ) {
		assert.ok( event.data, "on() with data, check passed data exists" );
		assert.equal( event.data.foo, "bar", "on() with data, Check value of passed data" );
	};
	jQuery( "#firstp" ).on( "click", { "foo": "bar" }, handler ).trigger( "click" ).off( "click", handler );

	assert.ok( !jQuery._data( jQuery( "#firstp" )[ 0 ], "events" ), "Event handler unbound when using data." );
} );

QUnit.test( "on(), with data, trigger with data", function( assert ) {
	assert.expect( 4 );
	var handler = function( event, data ) {
		assert.ok( event.data, "check passed data exists" );
		assert.equal( event.data.foo, "bar", "Check value of passed data" );
		assert.ok( data, "Check trigger data" );
		assert.equal( data.bar, "foo", "Check value of trigger data" );
	};
	jQuery( "#firstp" ).on( "click", { foo: "bar" }, handler ).trigger( "click", [ { bar: "foo" } ] ).off( "click", handler );
} );

QUnit.test( "on(), multiple events at once", function( assert ) {
	assert.expect( 2 );
	var handler,
		clickCounter = 0,
		mouseoverCounter = 0;
	handler = function( event ) {
		if ( event.type === "click" ) {
			clickCounter += 1;
		} else if ( event.type === "mouseover" ) {
			mouseoverCounter += 1;
		}
	};

	jQuery( "#firstp" ).on( "click mouseover", handler ).trigger( "click" ).trigger( "mouseover" );
	assert.equal( clickCounter, 1, "on() with multiple events at once" );
	assert.equal( mouseoverCounter, 1, "on() with multiple events at once" );
} );

QUnit.test( "on(), five events at once", function( assert ) {
	assert.expect( 1 );

	var count = 0,
		handler = function() {
			count++;
		};

	jQuery( "#firstp" ).on( "click mouseover foo bar baz", handler )
	.trigger( "click" ).trigger( "mouseover" )
		.trigger( "foo" ).trigger( "bar" )
		.trigger( "baz" );

	assert.equal( count, 5, "on() five events at once" );
} );

QUnit.test( "on(), multiple events at once and namespaces", function( assert ) {
	assert.expect( 7 );

	var cur, div,
		obj = {};

	div = jQuery( "<div></div>" ).on( "focusin.a", function( e ) {
		assert.equal( e.type, cur, "Verify right single event was fired." );
	} );

	cur = "focusin";
	div.trigger( "focusin.a" );

	// manually clean up detached elements
	div.remove();

	div = jQuery( "<div></div>" ).on( "click mouseover", obj, function( e ) {
		assert.equal( e.type, cur, "Verify right multi event was fired." );
		assert.equal( e.data, obj, "Make sure the data came in correctly." );
	} );

	cur = "click";
	div.trigger( "click" );

	cur = "mouseover";
	div.trigger( "mouseover" );

	// manually clean up detached elements
	div.remove();

	div = jQuery( "<div></div>" ).on( "focusin.a focusout.b", function( e ) {
		assert.equal( e.type, cur, "Verify right multi event was fired." );
	} );

	cur = "focusin";
	div.trigger( "focusin.a" );

	cur = "focusout";
	div.trigger( "focusout.b" );

	// manually clean up detached elements
	div.remove();
} );

QUnit.test( "on(), namespace with special add", function( assert ) {
	assert.expect( 27 );

	var i = 0,
		div = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" ).on( "test", function() {
			assert.ok( true, "Test event fired." );
		} );

	jQuery.event.special.test = {
		_default: function( e, data ) {
			assert.equal( e.type, "test", "Make sure we're dealing with a test event." );
			assert.ok( data, "And that trigger data was passed." );
			assert.strictEqual( e.target, div[ 0 ], "And that the target is correct." );
			assert.equal( this, window, "And that the context is correct." );
		},
		setup: function() {},
		teardown: function() {
			assert.ok( true, "Teardown called." );
		},
		add: function( handleObj ) {
			var handler = handleObj.handler;
			handleObj.handler = function( e ) {
				e.xyz = ++i;
				handler.apply( this, arguments );
			};
		},
		remove: function() {
			assert.ok( true, "Remove called." );
		}
	};

	div.on( "test.a", { x: 1 }, function( e ) {
		assert.ok( !!e.xyz, "Make sure that the data is getting passed through." );
		assert.equal( e.data[ "x" ], 1, "Make sure data is attached properly." );
	} );

	div.on( "test.b", { x: 2 }, function( e ) {
		assert.ok( !!e.xyz, "Make sure that the data is getting passed through." );
		assert.equal( e.data[ "x" ], 2, "Make sure data is attached properly." );
	} );

	// Should trigger 5
	div.trigger( "test", 33.33 );

	// Should trigger 2
	div.trigger( "test.a", "George Harrison" );

	// Should trigger 2
	div.trigger( "test.b", { year: 1982 } );

	// Should trigger 4
	div.off( "test" );

	div = jQuery( "<div></div>" ).on( "test", function() {
		assert.ok( true, "Test event fired." );
	} );

	// Should trigger 2
	div.appendTo( "#qunit-fixture" ).remove();

	delete jQuery.event.special.test;
} );

QUnit.test( "on(), no data", function( assert ) {
	assert.expect( 1 );
	var handler = function( event ) {
		assert.ok( !event.data, "Check that no data is added to the event object" );
	};
	jQuery( "#firstp" ).on( "click", handler ).trigger( "click" );
} );

QUnit.test( "on/one/off(Object)", function( assert ) {
	assert.expect( 6 );

	var $elem,
		clickCounter = 0,
		mouseoverCounter = 0;

	function handler( event ) {
		if ( event.type === "click" ) {
			clickCounter++;
		} else if ( event.type === "mouseover" ) {
			mouseoverCounter++;
		}
	}

	function handlerWithData( event ) {
		if ( event.type === "click" ) {
			clickCounter += event.data;
		} else if ( event.type === "mouseover" ) {
			mouseoverCounter += event.data;
		}
	}

	function trigger() {
		$elem.trigger( "click" ).trigger( "mouseover" );
	}

	$elem = jQuery( "#firstp" )

		// Regular bind
		.on( {
			"click":handler,
			"mouseover":handler
		} )

		// Bind with data
		.one( {
			"click":handlerWithData,
			"mouseover":handlerWithData
		}, 2 );

	trigger();

	assert.equal( clickCounter, 3, "on(Object)" );
	assert.equal( mouseoverCounter, 3, "on(Object)" );

	trigger();
	assert.equal( clickCounter, 4, "on(Object)" );
	assert.equal( mouseoverCounter, 4, "on(Object)" );

	jQuery( "#firstp" ).off( {
		"click":handler,
		"mouseover":handler
	} );

	trigger();
	assert.equal( clickCounter, 4, "on(Object)" );
	assert.equal( mouseoverCounter, 4, "on(Object)" );
} );

QUnit.test( "on/off(Object), on/off(Object, String)", function( assert ) {
	assert.expect( 6 );

	var events,
		clickCounter = 0,
		mouseoverCounter = 0,
		$p = jQuery( "#firstp" ),
		$a = $p.find( "a" ).eq( 0 );

	events = {
		"click": function( event ) {
			clickCounter += ( event.data || 1 );
		},
		"mouseover": function( event ) {
			mouseoverCounter += ( event.data || 1 );
		}
	};

	function trigger() {
		$a.trigger( "click" ).trigger( "mouseover" );
	}

	jQuery( document ).on( events, "#firstp a" );
	$p.on( events, "a", 2 );

	trigger();
	assert.equal( clickCounter, 3, "on" );
	assert.equal( mouseoverCounter, 3, "on" );

	$p.off( events, "a" );

	trigger();
	assert.equal( clickCounter, 4, "off" );
	assert.equal( mouseoverCounter, 4, "off" );

	jQuery( document ).off( events, "#firstp a" );

	trigger();
	assert.equal( clickCounter, 4, "off" );
	assert.equal( mouseoverCounter, 4, "off" );
} );

QUnit.test( "on immediate propagation", function( assert ) {
	assert.expect( 2 );

	var lastClick,
		$p = jQuery( "#firstp" ),
		$a = $p.find( "a" ).eq( 0 );

	lastClick = "";
	jQuery( document ).on( "click", "#firstp a", function( e ) {
		lastClick = "click1";
		e.stopImmediatePropagation();
	} );
	jQuery( document ).on( "click", "#firstp a", function() {
		lastClick = "click2";
	} );
	$a.trigger( "click" );
	assert.equal( lastClick, "click1", "on stopImmediatePropagation" );
	jQuery( document ).off( "click", "#firstp a" );

	lastClick = "";
	$p.on( "click", "a", function( e ) {
		lastClick = "click1";
		e.stopImmediatePropagation();
	} );
	$p.on( "click", "a", function() {
		lastClick = "click2";
	} );
	$a.trigger( "click" );
	assert.equal( lastClick, "click1", "on stopImmediatePropagation" );
	$p.off( "click", "**" );
} );

QUnit.test( "on bubbling, isDefaultPrevented, stopImmediatePropagation", function( assert ) {
	assert.expect( 3 );

	var $anchor2 = jQuery( "#anchor2" ),
		$main = jQuery( "#qunit-fixture" ),
		neverCallMe = function() {
			assert.ok( false, "immediate propagation should have been stopped" );
		},
		fakeClick = function( $jq ) {

			// Use a native click so we don't get jQuery simulated bubbling
			var e = document.createEvent( "MouseEvents" );
			e.initEvent( "click", true, true );
			$jq[ 0 ].dispatchEvent( e );
		};
	$anchor2.on( "click", function( e ) {
		e.preventDefault();
	} );
	$main.on( "click", "#foo", function( e ) {
		assert.equal( e.isDefaultPrevented(), true, "isDefaultPrevented true passed to bubbled event" );
	} );
	fakeClick( $anchor2 );
	$anchor2.off( "click" );
	$main.off( "click", "**" );
	$anchor2.on( "click", function() {

		// Let the default action occur
	} );
	$main.on( "click", "#foo", function( e ) {
		assert.equal( e.isDefaultPrevented(), false, "isDefaultPrevented false passed to bubbled event" );
	} );
	fakeClick( $anchor2 );
	$anchor2.off( "click" );
	$main.off( "click", "**" );

	$anchor2.on( "click", function( e ) {
		e.stopImmediatePropagation();
		assert.ok( true, "anchor was clicked and prop stopped" );
	} );
	$anchor2[ 0 ].addEventListener( "click", neverCallMe, false );
	fakeClick( $anchor2 );
	$anchor2[ 0 ].removeEventListener( "click", neverCallMe );
} );

QUnit.test( "triggered events stopPropagation() for natively-bound events", function( assert ) {
	assert.expect( 1 );

	var $button = jQuery( "#button" ),
		$parent = $button.parent(),
		neverCallMe = function() {
			assert.ok( false, "propagation should have been stopped" );
		},
		stopPropagationCallback = function( e ) {
			assert.ok( true, "propagation is stopped" );
			e.stopPropagation();
		};

	$parent[ 0 ].addEventListener( "click", neverCallMe );
	$button.on( "click", stopPropagationCallback );
	$button.trigger( "click" );
	$parent[ 0 ].removeEventListener( "click", neverCallMe );
	$button.off( "click", stopPropagationCallback );
} );

QUnit.test( "trigger() works with events that were previously stopped", function( assert ) {
	assert.expect( 0 );

	var $button = jQuery( "#button" ),
		$parent = $button.parent(),
		neverCallMe = function() {
			assert.ok( false, "propagation should have been stopped" );
		};

	$parent[ 0 ].addEventListener( "click", neverCallMe );
	$button.on( "click", neverCallMe );

	var clickEvent =  jQuery.Event( "click" );
	clickEvent.stopPropagation();
	$button.trigger( clickEvent );

	$parent[ 0 ].removeEventListener( "click", neverCallMe );
	$button.off( "click", neverCallMe );
} );


QUnit.test( "on(), iframes", function( assert ) {
	assert.expect( 1 );

	// events don't work with iframes, see #939 - this test fails in IE because of contentDocument
	var doc = jQuery( "#loadediframe" ).contents();

	jQuery( "div", doc ).on( "click", function() {
		assert.ok( true, "Binding to element inside iframe" );
	} ).trigger( "click" ).off( "click" );
} );

QUnit.test( "on(), trigger change on select", function( assert ) {
	assert.expect( 5 );
	var counter = 0;
	function selectOnChange( event ) {
		assert.equal( event.data, counter++, "Event.data is not a global event object" );
	}
	jQuery( "#form select" ).each( function( i ) {
		jQuery( this ).on( "change", i, selectOnChange );
	} ).trigger( "change" );
} );

QUnit.test( "on(), namespaced events, cloned events", function( assert ) {
	assert.expect( 18 );

	var firstp = jQuery( "#firstp" );

	firstp.on( "custom.test", function() {
		assert.ok( false, "Custom event triggered" );
	} );

	firstp.on( "click", function( e ) {
		assert.ok( true, "Normal click triggered" );
		assert.equal( e.type + e.namespace, "click", "Check that only click events trigger this fn" );
	} );

	firstp.on( "click.test", function( e ) {
		var check = "click";
		assert.ok( true, "Namespaced click triggered" );
		if ( e.namespace ) {
			check += "test";
		}
		assert.equal( e.type + e.namespace, check, "Check that only click/click.test events trigger this fn" );
	} );

	//clone(true) element to verify events are cloned correctly
	firstp = firstp.add( firstp.clone( true ).attr( "id", "firstp2" ).insertBefore( firstp ) );

	// Trigger both bound fn (8)
	firstp.trigger( "click" );

	// Trigger one bound fn (4)
	firstp.trigger( "click.test" );

	// Remove only the one fn
	firstp.off( "click.test" );

	// Trigger the remaining fn (4)
	firstp.trigger( "click" );

	// Remove the remaining namespaced fn
	firstp.off( ".test" );

	// Try triggering the custom event (0)
	firstp.trigger( "custom" );

	// using contents will get comments regular, text, and comment nodes
	jQuery( "#nonnodes" ).contents().on( "tester", function() {
		assert.equal( this.nodeType, 1, "Check node,textnode,comment on just does real nodes" );
	} ).trigger( "tester" );

	// Make sure events stick with appendTo'd elements (which are cloned) #2027
	jQuery( "<a href='#fail' class='test'>test</a>" ).on( "click", function() { return false; } ).appendTo( "#qunit-fixture" );
	assert.ok( jQuery( "a.test" ).eq( 0 ).triggerHandler( "click" ) === false, "Handler is bound to appendTo'd elements" );
} );

QUnit.test( "on(), multi-namespaced events", function( assert ) {
	assert.expect( 6 );

	var order = [
		"click.test.abc",
		"click.test.abc",
		"click.test",
		"click.test.abc",
		"click.test",
		"custom.test2"
	];

	function check( name, msg ) {
		assert.deepEqual( name, order.shift(), msg );
	}

	jQuery( "#firstp" ).on( "custom.test", function() {
		check( "custom.test", "Custom event triggered" );
	} );

	jQuery( "#firstp" ).on( "custom.test2", function() {
		check( "custom.test2", "Custom event triggered" );
	} );

	jQuery( "#firstp" ).on( "click.test", function() {
		check( "click.test", "Normal click triggered" );
	} );

	jQuery( "#firstp" ).on( "click.test.abc", function() {
		check( "click.test.abc", "Namespaced click triggered" );
	} );

	// Those would not trigger/off (#5303)
	jQuery( "#firstp" ).trigger( "click.a.test" );
	jQuery( "#firstp" ).off( "click.a.test" );

	// Trigger both bound fn (1)
	jQuery( "#firstp" ).trigger( "click.test.abc" );

	// Trigger one bound fn (1)
	jQuery( "#firstp" ).trigger( "click.abc" );

	// Trigger two bound fn (2)
	jQuery( "#firstp" ).trigger( "click.test" );

	// Remove only the one fn
	jQuery( "#firstp" ).off( "click.abc" );

	// Trigger the remaining fn (1)
	jQuery( "#firstp" ).trigger( "click" );

	// Remove the remaining fn
	jQuery( "#firstp" ).off( ".test" );

	// Trigger the remaining fn (1)
	jQuery( "#firstp" ).trigger( "custom" );
} );

QUnit.test( "namespace-only event binding is a no-op", function( assert ) {
	assert.expect( 2 );

	jQuery( "#firstp" )
		.on( ".whoops", function() {
			assert.ok( false, "called a namespace-only event" );
		} )
		.on( "whoops", function() {
			assert.ok( true, "called whoops" );
		} )
		.trigger( "whoops" )	// 1
		.off( ".whoops" )
		.trigger( "whoops" )	// 2
		.off( "whoops" );
} );

QUnit.test( "Empty namespace is ignored", function( assert ) {
	assert.expect( 1 );

	jQuery( "#firstp" )
		.on( "meow.", function( e ) {
			assert.equal( e.namespace, "", "triggered a namespace-less meow event" );
		} )
		.trigger( "meow." )
		.off( "meow." );
} );

QUnit.test( "on(), with same function", function( assert ) {
	assert.expect( 2 );

	var count = 0, func = function() {
		count++;
	};

	jQuery( "#liveHandlerOrder" ).on( "foo.bar", func ).on( "foo.zar", func );
	jQuery( "#liveHandlerOrder" ).trigger( "foo.bar" );

	assert.equal( count, 1, "Verify binding function with multiple namespaces." );

	jQuery( "#liveHandlerOrder" ).off( "foo.bar", func ).off( "foo.zar", func );
	jQuery( "#liveHandlerOrder" ).trigger( "foo.bar" );

	assert.equal( count, 1, "Verify that removing events still work." );
} );

QUnit.test( "on(), make sure order is maintained", function( assert ) {
	assert.expect( 1 );

	var elem = jQuery( "#firstp" ), log = [], check = [];

	jQuery.each( new Array( 100 ), function( i ) {
		elem.on( "click", function() {
			log.push( i );
		} );

		check.push( i );

	} );

	elem.trigger( "click" );

	assert.equal( log.join( "," ), check.join( "," ), "Make sure order was maintained." );

	elem.off( "click" );
} );

QUnit.test( "on(), with different this object", function( assert ) {
	assert.expect( 4 );
	var thisObject = { myThis: true },
		data = { myData: true },
		handler1 = function() {
			assert.equal( this, thisObject, "on() with different this object" );
		}.bind( thisObject ),
		handler2 = function( event ) {
			assert.equal( this, thisObject, "on() with different this object and data" );
			assert.equal( event.data, data, "on() with different this object and data" );
		}.bind( thisObject );

	jQuery( "#firstp" )
		.on( "click", handler1 ).trigger( "click" ).off( "click", handler1 )
		.on( "click", data, handler2 ).trigger( "click" ).off( "click", handler2 );

	assert.ok( !jQuery._data( jQuery( "#firstp" )[ 0 ], "events" ), "Event handler unbound when using different this object and data." );
} );

QUnit.test( "on(name, false), off(name, false)", function( assert ) {
	assert.expect( 3 );

	var main = 0;
	jQuery( "#qunit-fixture" ).on( "click", function() { main++; } );
	jQuery( "#ap" ).trigger( "click" );
	assert.equal( main, 1, "Verify that the trigger happened correctly." );

	main = 0;
	jQuery( "#ap" ).on( "click", false );
	jQuery( "#ap" ).trigger( "click" );
	assert.equal( main, 0, "Verify that no bubble happened." );

	main = 0;
	jQuery( "#ap" ).off( "click", false );
	jQuery( "#ap" ).trigger( "click" );
	assert.equal( main, 1, "Verify that the trigger happened correctly." );

	// manually clean up events from elements outside the fixture
	jQuery( "#qunit-fixture" ).off( "click" );
} );

QUnit.test( "on(name, selector, false), off(name, selector, false)", function( assert ) {
	assert.expect( 3 );

	var main = 0;

	jQuery( "#qunit-fixture" ).on( "click", "#ap", function() { main++; } );
	jQuery( "#ap" ).trigger( "click" );
	assert.equal( main, 1, "Verify that the trigger happened correctly." );

	main = 0;
	jQuery( "#ap" ).on( "click", "#groups", false );
	jQuery( "#groups" ).trigger( "click" );
	assert.equal( main, 0, "Verify that no bubble happened." );

	main = 0;
	jQuery( "#ap" ).off( "click", "#groups", false );
	jQuery( "#groups" ).trigger( "click" );
	assert.equal( main, 1, "Verify that the trigger happened correctly." );
	jQuery( "#qunit-fixture" ).off( "click", "#ap" );
} );

QUnit.test( "on()/trigger()/off() on plain object", function( assert ) {
	assert.expect( 7 );

	var events,
		obj = {};

	// Make sure it doesn't complain when no events are found
	jQuery( obj ).trigger( "test" );

	// Make sure it doesn't complain when no events are found
	jQuery( obj ).off( "test" );

	jQuery( obj ).on( {
		"test": function() {
			assert.ok( true, "Custom event run." );
		},
		"submit": function() {
			assert.ok( true, "Custom submit event run." );
		}
	} );

	events = jQuery._data( obj, "events" );
	assert.ok( events, "Object has events bound." );
	assert.equal( obj[ "events" ], undefined, "Events object on plain objects is not events" );
	assert.equal( obj.test, undefined, "Make sure that test event is not on the plain object." );
	assert.equal( obj.handle, undefined, "Make sure that the event handler is not on the plain object." );

	// Should trigger 1
	jQuery( obj ).trigger( "test" );
	jQuery( obj ).trigger( "submit" );

	jQuery( obj ).off( "test" );
	jQuery( obj ).off( "submit" );

	// Should trigger 0
	jQuery( obj ).trigger( "test" );

	// Make sure it doesn't complain when no events are found
	jQuery( obj ).off( "test" );

	assert.equal( obj && obj[ jQuery.expando ] &&
			obj[ jQuery.expando ][ jQuery.expando ] &&
			obj[ jQuery.expando ][ jQuery.expando ][ "events" ], undefined, "Make sure events object is removed" );
} );

QUnit.test( "off(type)", function( assert ) {
	assert.expect( 1 );

	var message, func,
		$elem = jQuery( "#firstp" );

	function error() {
		assert.ok( false, message );
	}

	message = "unbind passing function";
	$elem.on( "error1", error ).off( "error1", error ).triggerHandler( "error1" );

	message = "unbind all from event";
	$elem.on( "error1", error ).off( "error1" ).triggerHandler( "error1" );

	message = "unbind all";
	$elem.on( "error1", error ).off().triggerHandler( "error1" );

	message = "unbind many with function";
	$elem.on( "error1 error2", error )
		.off( "error1 error2", error )
		.trigger( "error1" ).triggerHandler( "error2" );

	message = "unbind many"; // #3538
	$elem.on( "error1 error2", error )
		.off( "error1 error2" )
		.trigger( "error1" ).triggerHandler( "error2" );

	message = "unbind without a type or handler";
	$elem.on( "error1 error2.test", error )
		.off()
		.trigger( "error1" ).triggerHandler( "error2" );

	// Should only unbind the specified function
	jQuery( document ).on( "click", function() {
		assert.ok( true, "called handler after selective removal" );
	} );
	func = function() {};
	jQuery( document )
		.on( "click", func )
		.off( "click", func )
		.trigger( "click" )
		.off( "click" );
} );

QUnit.test( "off(eventObject)", function( assert ) {
	assert.expect( 4 );

	var $elem = jQuery( "#firstp" ),
		num;

	function check( expected ) {
		num = 0;
		$elem.trigger( "foo" ).triggerHandler( "bar" );
		assert.equal( num, expected, "Check the right handlers are triggered" );
	}

	$elem

		// This handler shouldn't be unbound
		.on( "foo", function() {
			num += 1;
		} )
		.on( "foo", function( e ) {
			$elem.off( e );
			num += 2;
		} )

		// Neither this one
		.on( "bar", function() {
			num += 4;
		} );

	check( 7 );
	check( 5 );

	$elem.off( "bar" );
	check( 1 );

	$elem.off();
	check( 0 );
} );

QUnit.test( "mouseover triggers mouseenter", function( assert ) {
	assert.expect( 1 );

	var count = 0,
		elem = jQuery( "<a></a>" );
	elem.on( "mouseenter", function() {
		count++;
	} );
	elem.trigger( "mouseover" );
	assert.equal( count, 1, "make sure mouseover triggers a mouseenter" );

	elem.remove();
} );

QUnit.test( "pointerover triggers pointerenter", function( assert ) {
	assert.expect( 1 );

	var count = 0,
		elem = jQuery( "<a></a>" );
	elem.on( "pointerenter", function() {
		count++;
	} );
	elem.trigger( "pointerover" );
	assert.equal( count, 1, "make sure pointerover triggers a pointerenter" );

	elem.remove();
} );

QUnit.test( "withinElement implemented with jQuery.contains()", function( assert ) {

	assert.expect( 1 );

	jQuery( "#qunit-fixture" ).append( "<div id='jc-outer'><div id='jc-inner'></div></div>" );

	jQuery( "#jc-outer" ).on( "mouseenter mouseleave", function( event ) {
		assert.equal( this.id, "jc-outer", this.id + " " + event.type );
	} );

	jQuery( "#jc-inner" ).trigger( "mouseenter" );
} );

QUnit.test( "mouseenter, mouseleave don't catch exceptions", function( assert ) {
	assert.expect( 2 );

	var elem = jQuery( "#firstp" ).on( "mouseenter mouseleave", function() {
			throw "an Exception";
		} );

	try {
		elem.trigger( "mouseenter" );
	} catch ( e ) {
		assert.equal( e, "an Exception", "mouseenter doesn't catch exceptions" );
	}

	try {
		elem.trigger( "mouseleave" );
	} catch ( e ) {
		assert.equal( e, "an Exception", "mouseleave doesn't catch exceptions" );
	}
} );

QUnit.test( "trigger() bubbling", function( assert ) {
	assert.expect( 18 );

	var win = 0, doc = 0, html = 0, body = 0, main = 0, ap = 0;

	jQuery( window ).on( "click", function() { win++; } );
	jQuery( document ).on( "click", function( e ) { if ( e.target !== document ) { doc++; } } );
	jQuery( "html" ).on( "click", function() { html++; } );
	jQuery( "body" ).on( "click", function() { body++; } );
	jQuery( "#qunit-fixture" ).on( "click", function() { main++; } );
	jQuery( "#ap" ).on( "click", function() { ap++; return false; } );

	jQuery( "html" ).trigger( "click" );
	assert.equal( win, 1, "HTML bubble" );
	assert.equal( doc, 1, "HTML bubble" );
	assert.equal( html, 1, "HTML bubble" );

	jQuery( "body" ).trigger( "click" );
	assert.equal( win, 2, "Body bubble" );
	assert.equal( doc, 2, "Body bubble" );
	assert.equal( html, 2, "Body bubble" );
	assert.equal( body, 1, "Body bubble" );

	jQuery( "#qunit-fixture" ).trigger( "click" );
	assert.equal( win, 3, "Main bubble" );
	assert.equal( doc, 3, "Main bubble" );
	assert.equal( html, 3, "Main bubble" );
	assert.equal( body, 2, "Main bubble" );
	assert.equal( main, 1, "Main bubble" );

	jQuery( "#ap" ).trigger( "click" );
	assert.equal( doc, 3, "ap bubble" );
	assert.equal( html, 3, "ap bubble" );
	assert.equal( body, 2, "ap bubble" );
	assert.equal( main, 1, "ap bubble" );
	assert.equal( ap, 1, "ap bubble" );

	jQuery( document ).trigger( "click" );
	assert.equal( win, 4, "doc bubble" );

	// manually clean up events from elements outside the fixture
	jQuery( window ).off( "click" );
	jQuery( document ).off( "click" );
	jQuery( "html, body, #qunit-fixture" ).off( "click" );
} );

QUnit.test( "trigger(type, [data], [fn])", function( assert ) {
	assert.expect( 16 );

	var $elem, pass, form, elem2,
		handler = function( event, a, b, c ) {
		assert.equal( event.type, "click", "check passed data" );
		assert.equal( a, 1, "check passed data" );
		assert.equal( b, "2", "check passed data" );
		assert.equal( c, "abc", "check passed data" );
		return "test";
	};

	$elem = jQuery( "#firstp" );

	// Simulate a "native" click
	$elem[ 0 ].click = function() {
		assert.ok( true, "Native call was triggered" );
	};

	jQuery( document ).on( "mouseenter", "#firstp", function() {
		assert.ok( true, "Trigger mouseenter bound by on" );
	} );

	jQuery( document ).on( "mouseleave", "#firstp", function() {
		assert.ok( true, "Trigger mouseleave bound by on" );
	} );

	$elem.trigger( "mouseenter" );

	$elem.trigger( "mouseleave" );

	jQuery( document ).off( "mouseenter mouseleave", "#firstp" );

	// Triggers handlers and native
	// Trigger 5
	$elem.on( "click", handler ).trigger( "click", [ 1, "2", "abc" ] );

	// Simulate a "native" click
	$elem[ 0 ].click = function() {
		assert.ok( false, "Native call was triggered" );
	};

	// Trigger only the handlers (no native)
	// Triggers 5
	assert.equal( $elem.triggerHandler( "click", [ 1, "2", "abc" ] ), "test", "Verify handler response" );

	pass = true;
	try {
		elem2 = jQuery( "#form input" ).eq( 0 );
		elem2.get( 0 ).style.display = "none";
		elem2.trigger( "focus" );
	} catch ( e ) {
		pass = false;
	}
	assert.ok( pass, "Trigger focus on hidden element" );

	pass = true;
	try {
		jQuery( "#qunit-fixture table" ).eq( 0 ).on( "test:test", function() {} ).trigger( "test:test" );
	} catch ( e ) {
		pass = false;
	}
	assert.ok( pass, "Trigger on a table with a colon in the even type, see #3533" );

	form = jQuery( "<form action=''></form>" ).appendTo( "body" );

	// Make sure it can be prevented locally
	form.on( "submit", function() {
		assert.ok( true, "Local `on` still works." );
		return false;
	} );

	// Trigger 1
	form.trigger( "submit" );

	form.off( "submit" );

	jQuery( document ).on( "submit", function() {
		assert.ok( true, "Make sure bubble works up to document." );
		return false;
	} );

	// Trigger 1
	form.trigger( "submit" );

	jQuery( document ).off( "submit" );

	form.remove();
} );

QUnit.test( "submit event bubbles on copied forms (#11649)", function( assert ) {
	assert.expect( 3 );

	var $formByClone, $formByHTML,
		$testForm = jQuery( "#testForm" ),
		$fixture = jQuery( "#qunit-fixture" ),
		$wrapperDiv = jQuery( "<div></div>" ).appendTo( $fixture );

	function noSubmit( e ) {
		e.preventDefault();
	}
	function delegatedSubmit() {
		assert.ok( true, "Make sure submit event bubbles up." );
		return false;
	}

	// Attach a delegated submit handler to the parent element
	$fixture.on( "submit", "form", delegatedSubmit );

	// Trigger form submission to introduce the _submit_attached property
	$testForm.on( "submit", noSubmit ).find( "input[name=sub1]" ).trigger( "click" );

	// Copy the form via .clone() and .html()
	$formByClone = $testForm.clone( true, true ).removeAttr( "id" );
	$formByHTML = jQuery( jQuery.parseHTML( $fixture.html() ) ).filter( "#testForm" ).removeAttr( "id" );
	$wrapperDiv.append( $formByClone, $formByHTML );

	// Check submit bubbling on the copied forms
	$wrapperDiv.find( "form" ).on( "submit", noSubmit ).find( "input[name=sub1]" ).trigger( "click" );

	// Clean up
	$wrapperDiv.remove();
	$fixture.off( "submit", "form", delegatedSubmit );
	$testForm.off( "submit", noSubmit );
} );

QUnit.test( "change event bubbles on copied forms (#11796)", function( assert ) {
	assert.expect( 3 );

	var $formByClone, $formByHTML,
		$form = jQuery( "#form" ),
		$fixture = jQuery( "#qunit-fixture" ),
		$wrapperDiv = jQuery( "<div></div>" ).appendTo( $fixture );

	function delegatedChange() {
		assert.ok( true, "Make sure change event bubbles up." );
		return false;
	}

	// Attach a delegated change handler to the form
	$fixture.on( "change", "form", delegatedChange );

	// Trigger change event to introduce the _change_attached property
	$form.find( "select[name=select1]" ).val( "1" ).trigger( "change" );

	// Copy the form via .clone() and .html()
	$formByClone = $form.clone( true, true ).removeAttr( "id" );
	$formByHTML = jQuery( jQuery.parseHTML( $fixture.html() ) ).filter( "#form" ).removeAttr( "id" );
	$wrapperDiv.append( $formByClone, $formByHTML );

	// Check change bubbling on the copied forms
	$wrapperDiv.find( "form select[name=select1]" ).val( "2" ).trigger( "change" );

	// Clean up
	$wrapperDiv.remove();
	$fixture.off( "change", "form", delegatedChange );
} );

QUnit.test( "trigger(eventObject, [data], [fn])", function( assert ) {
	assert.expect( 28 );

	var event,
		$parent = jQuery( "<div id='par'></div>" ).appendTo( "body" ),
		$child = jQuery( "<p id='child'>foo</p>" ).appendTo( $parent );

	$parent.get( 0 ).style.display = "none";

	event = jQuery.Event( "noNew" );
	assert.ok( event !== window, "Instantiate jQuery.Event without the 'new' keyword" );
	assert.equal( event.type, "noNew", "Verify its type" );

	assert.equal( event.isDefaultPrevented(), false, "Verify isDefaultPrevented" );
	assert.equal( event.isPropagationStopped(), false, "Verify isPropagationStopped" );
	assert.equal( event.isImmediatePropagationStopped(), false, "Verify isImmediatePropagationStopped" );

	event.preventDefault();
	assert.equal( event.isDefaultPrevented(), true, "Verify isDefaultPrevented" );
	event.stopPropagation();
	assert.equal( event.isPropagationStopped(), true, "Verify isPropagationStopped" );

	event.isPropagationStopped = function() { return false; };
	event.stopImmediatePropagation();
	assert.equal( event.isPropagationStopped(), true, "Verify isPropagationStopped" );
	assert.equal( event.isImmediatePropagationStopped(), true, "Verify isPropagationStopped" );

	$parent.on( "foo", function( e ) {

		// Tries bubbling
		assert.equal( e.type, "foo", "Verify event type when passed passing an event object" );
		assert.equal( e.target.id, "child", "Verify event.target when passed passing an event object" );
		assert.equal( e.currentTarget.id, "par", "Verify event.currentTarget when passed passing an event object" );
		assert.equal( e.secret, "boo!", "Verify event object's custom attribute when passed passing an event object" );
	} );

	// test with an event object
	event = new jQuery.Event( "foo" );
	event.secret = "boo!";
	$child.trigger( event );

	// test with a literal object
	$child.trigger( { "type": "foo", "secret": "boo!" } );

	$parent.off();

	function error() {
		assert.ok( false, "This assertion shouldn't be reached" );
	}

	$parent.on( "foo", error );

	$child.on( "foo", function( e, a, b, c ) {
		assert.equal( arguments.length, 4, "Check arguments length" );
		assert.equal( a, 1, "Check first custom argument" );
		assert.equal( b, 2, "Check second custom argument" );
		assert.equal( c, 3, "Check third custom argument" );

		assert.equal( e.isDefaultPrevented(), false, "Verify isDefaultPrevented" );
		assert.equal( e.isPropagationStopped(), false, "Verify isPropagationStopped" );
		assert.equal( e.isImmediatePropagationStopped(), false, "Verify isImmediatePropagationStopped" );

		// Skips both errors
		e.stopImmediatePropagation();

		return "result";
	} );

	// We should add this back in when we want to test the order
	// in which event handlers are iterated.
	//$child.on("foo", error );

	event = new jQuery.Event( "foo" );
	$child.trigger( event, [ 1, 2, 3 ] ).off();
	assert.equal( event.result, "result", "Check event.result attribute" );

	// Will error if it bubbles
	$child.triggerHandler( "foo" );

	$child.off();
	$parent.off().remove();

	// Ensure triggerHandler doesn't molest its event object (#xxx)
	event = jQuery.Event( "zowie" );
	jQuery( document ).triggerHandler( event );
	assert.equal( event.type, "zowie", "Verify its type" );
	assert.equal( event.isPropagationStopped(), false, "propagation not stopped" );
	assert.equal( event.isDefaultPrevented(), false, "default not prevented" );
} );

QUnit.test( ".trigger() bubbling on disconnected elements (#10489)", function( assert ) {
	assert.expect( 2 );

	jQuery( window ).on( "click", function() {
		assert.ok( false, "click fired on window" );
	} );

	jQuery( "<div><p>hi</p></div>" )
		.on( "click", function() {
			assert.ok( true, "click fired on div" );
		} )
		.find( "p" )
			.on( "click", function() {
				assert.ok( true, "click fired on p" );
			} )
			.trigger( "click" )
			.off( "click" )
		.end()
		.off( "click" )
		.remove();

	jQuery( window ).off( "click" );
} );

QUnit.test( ".trigger() doesn't bubble load event (#10717)", function( assert ) {
	assert.expect( 1 );

	jQuery( window ).on( "load", function() {
		assert.ok( false, "load fired on window" );
	} );

	jQuery( "<img src='" + baseURL + "1x1.jpg' />" )
		.appendTo( "body" )
		.on( "load", function() {
			assert.ok( true, "load fired on img" );
		} )
		.trigger( "load" )
		.remove();

	jQuery( window ).off( "load" );
} );

QUnit.test( "Delegated events in SVG (#10791; #13180)", function( assert ) {
	assert.expect( 2 );

	var useElem, e,
		svg = jQuery(
			"<svg height='1' version='1.1' width='1' xmlns='http://www.w3.org/2000/svg'>" +
			"<defs><rect id='ref' x='10' y='20' width='100' height='60' r='10' rx='10' ry='10'></rect></defs>" +
			"<rect class='svg-by-class' x='10' y='20' width='100' height='60' r='10' rx='10' ry='10'></rect>" +
			"<rect id='svg-by-id' x='10' y='20' width='100' height='60' r='10' rx='10' ry='10'></rect>" +
			"<use id='use' xlink:href='#ref'></use>" +
			"</svg>"
		);

	jQuery( "#qunit-fixture" )
		.append( svg )
		.on( "click", "#svg-by-id", function() {
			assert.ok( true, "delegated id selector" );
		} )
		.on( "click", "[class~='svg-by-class']", function() {
			assert.ok( true, "delegated class selector" );
		} )
		.find( "#svg-by-id, [class~='svg-by-class']" )
			.trigger( "click" )
		.end();

	// Fire a native click on an SVGElementInstance (the instance tree of an SVG <use>)
	// to confirm that it doesn't break our event delegation handling (#13180)
	useElem = svg.find( "#use" )[ 0 ];
	if ( document.createEvent && useElem && useElem.instanceRoot ) {
		e = document.createEvent( "MouseEvents" );
		e.initEvent( "click", true, true );
		useElem.instanceRoot.dispatchEvent( e );
	}

	jQuery( "#qunit-fixture" ).off( "click" );
} );

QUnit.test( "Delegated events with malformed selectors (gh-3071)", function( assert ) {
	assert.expect( 3 );

	assert.throws( function() {
		jQuery( "#foo" ).on( "click", ":not", function() {} );
	}, "malformed selector throws on attach" );

	assert.throws( function() {
		jQuery( "#foo" ).on( "click", "nonexistent:not", function() {} );
	}, "short-circuitable malformed selector throws on attach" );

	jQuery( "#foo > :first-child" ).trigger( "click" );
	assert.ok( true, "malformed selector does not throw on event" );
} );

QUnit.test( "Delegated events in forms (#10844; #11145; #8165; #11382, #11764)", function( assert ) {
	assert.expect( 5 );

	// Alias names like "id" cause havoc
	var form = jQuery(
			"<form id='myform'>" +
				"<input type='text' name='id' value='secret agent man' />" +
			"</form>"
		)
		.on( "submit", function( event ) {
			event.preventDefault();
		} )
		.appendTo( "body" );

	jQuery( "body" )
		.on( "submit", "#myform", function() {
			assert.ok( true, "delegated id selector with aliased id" );
		} )
		.find( "#myform" )
			.trigger( "submit" )
		.end()
		.off( "submit" );

	form.append( "<input type='text' name='disabled' value='differently abled' />" );
	jQuery( "body" )
		.on( "submit", "#myform", function() {
			assert.ok( true, "delegated id selector with aliased disabled" );
		} )
		.find( "#myform" )
			.trigger( "submit" )
		.end()
		.off( "submit" );

	form
		.append( "<button id='nestyDisabledBtn'><span>Zing</span></button>" )
		.on( "click", "#nestyDisabledBtn", function() {
			assert.ok( true, "click on enabled/disabled button with nesty elements" );
		} )
		.on( "mouseover", "#nestyDisabledBtn", function() {
			assert.ok( true, "mouse on enabled/disabled button with nesty elements" );
		} )
		.find( "span" )
			.trigger( "click" )		// yep
			.trigger( "mouseover" )	// yep
		.end()
		.find( "#nestyDisabledBtn" ).prop( "disabled", true ).end()
		.find( "span" )
			.trigger( "click" )		// nope
			.trigger( "mouseover" )	// yep
		.end()
		.off( "click" );

	form.remove();
} );

QUnit.test( "Submit event can be stopped (#11049)", function( assert ) {
	assert.expect( 1 );

	// Since we manually bubble in IE, make sure inner handlers get a chance to cancel
	var form = jQuery(
			"<form id='myform'>" +
				"<input type='text' name='sue' value='bawls' />" +
				"<input type='submit' />" +
			"</form>"
		)
		.appendTo( "body" );

	jQuery( "body" )
		.on( "submit", function() {
			assert.ok( true, "submit bubbled on first handler" );
			return false;
		} )
		.find( "#myform input[type=submit]" )
			.each( function() { this.click(); } )
		.end()
		.on( "submit", function() {
			assert.ok( false, "submit bubbled on second handler" );
			return false;
		} )
		.find( "#myform input[type=submit]" )
			.each( function() {
				jQuery( this.form ).on( "submit", function( e ) {
					e.preventDefault();
					e.stopPropagation();
				} );
				this.click();
			} )
		.end()
		.off( "submit" );

	form.remove();
} );

// Support: iOS 7 - 9
// iOS has the window.onbeforeunload field but doesn't support the beforeunload
// handler making it impossible to feature-detect the support.
QUnit[ /(ipad|iphone|ipod)/i.test( navigator.userAgent ) ? "skip" : "test" ](
	"on(beforeunload)", function( assert ) {
	assert.expect( 1 );
	var iframe = jQuery( jQuery.parseHTML( "<iframe src='" + baseURL + "event/onbeforeunload.html'><iframe>" ) );
	var done = assert.async();

	window.onmessage = function( event ) {
		var payload = JSON.parse( event.data );

		assert.ok( payload.event, "beforeunload", "beforeunload event" );

		iframe.remove();
		window.onmessage = null;
		done();
	};

	iframe.appendTo( "#qunit-fixture" );
} );

QUnit.test( "jQuery.Event( type, props )", function( assert ) {

	assert.expect( 6 );

	var event = jQuery.Event( "keydown", { keyCode: 64 } ),
			handler = function( event ) {
				assert.ok( "keyCode" in event, "Special property 'keyCode' exists" );
				assert.equal( event.keyCode, 64, "event.keyCode has explicit value '64'" );
			};

	// Supports jQuery.Event implementation
	assert.equal( event.type, "keydown", "Verify type" );

	// ensure "type" in props won't clobber the one set by constructor
	assert.equal( jQuery.inArray( "type", jQuery.event.props ), -1, "'type' property not in props (#10375)" );

	assert.ok( "keyCode" in event, "Special 'keyCode' property exists" );

	assert.strictEqual( jQuery.isPlainObject( event ), false, "Instances of $.Event should not be identified as a plain object." );

	jQuery( "body" ).on( "keydown", handler ).trigger( event );

	jQuery( "body" ).off( "keydown" );

} );

QUnit.test( "jQuery.Event properties", function( assert ) {
	assert.expect( 12 );

	var handler,
		$structure = jQuery( "<div id='ancestor'><p id='delegate'><span id='target'>shiny</span></p></div>" ),
		$target = $structure.find( "#target" );

	handler = function( e ) {
		assert.strictEqual( e.currentTarget, this, "currentTarget at " + this.id );
		assert.equal( e.isTrigger, 3, "trigger at " + this.id );
	};
	$structure.one( "click", handler );
	$structure.one( "click", "p", handler );
	$target.one( "click", handler );
	$target[ 0 ].onclick = function( e ) {
		assert.strictEqual( e.currentTarget, this, "currentTarget at target (native handler)" );
		assert.equal( e.isTrigger, 3, "trigger at target (native handler)" );
	};
	$target.trigger( "click" );

	$target.one( "click", function( e ) {
		assert.equal( e.isTrigger, 2, "triggerHandler at target" );
	} );
	$target[ 0 ].onclick = function( e ) {
		assert.equal( e.isTrigger, 2, "triggerHandler at target (native handler)" );
	};
	$target.triggerHandler( "click" );

	handler = function( e ) {
		assert.strictEqual( e.isTrigger, undefined, "native event at " + this.id );
	};
	$target.one( "click", handler );
	$target[ 0 ].onclick = function( e ) {
		assert.strictEqual( e.isTrigger, undefined, "native event at target (native handler)" );
	};
	fireNative( $target[ 0 ], "click" );
} );

QUnit.test( ".on()/.off()", function( assert ) {
	assert.expect( 65 );

	var event, clicked, hash, called, livec, lived, livee,
		submit = 0, div = 0, livea = 0, liveb = 0;

	jQuery( "#body" ).on( "submit", "#qunit-fixture div", function() { submit++; return false; } );
	jQuery( "#body" ).on( "click", "#qunit-fixture div", function() { div++; } );
	jQuery( "#body" ).on( "click", "div#nothiddendiv", function() { livea++; } );
	jQuery( "#body" ).on( "click", "div#nothiddendivchild", function() { liveb++; } );

	// Nothing should trigger on the body
	jQuery( "body" ).trigger( "click" );
	assert.equal( submit, 0, "Click on body" );
	assert.equal( div, 0, "Click on body" );
	assert.equal( livea, 0, "Click on body" );
	assert.equal( liveb, 0, "Click on body" );

	// This should trigger two events
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery( "div#nothiddendiv" ).trigger( "click" );
	assert.equal( submit, 0, "Click on div" );
	assert.equal( div, 1, "Click on div" );
	assert.equal( livea, 1, "Click on div" );
	assert.equal( liveb, 0, "Click on div" );

	// This should trigger three events (w/ bubbling)
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery( "div#nothiddendivchild" ).trigger( "click" );
	assert.equal( submit, 0, "Click on inner div" );
	assert.equal( div, 2, "Click on inner div" );
	assert.equal( livea, 1, "Click on inner div" );
	assert.equal( liveb, 1, "Click on inner div" );

	// This should trigger one submit
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery( "div#nothiddendivchild" ).trigger( "submit" );
	assert.equal( submit, 1, "Submit on div" );
	assert.equal( div, 0, "Submit on div" );
	assert.equal( livea, 0, "Submit on div" );
	assert.equal( liveb, 0, "Submit on div" );

	// Make sure no other events were removed in the process
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery( "div#nothiddendivchild" ).trigger( "click" );
	assert.equal( submit, 0, "off Click on inner div" );
	assert.equal( div, 2, "off Click on inner div" );
	assert.equal( livea, 1, "off Click on inner div" );
	assert.equal( liveb, 1, "off Click on inner div" );

	// Now make sure that the removal works
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery( "#body" ).off( "click", "div#nothiddendivchild" );
	jQuery( "div#nothiddendivchild" ).trigger( "click" );
	assert.equal( submit, 0, "off Click on inner div" );
	assert.equal( div, 2, "off Click on inner div" );
	assert.equal( livea, 1, "off Click on inner div" );
	assert.equal( liveb, 0, "off Click on inner div" );

	// Make sure that the click wasn't removed too early
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery( "div#nothiddendiv" ).trigger( "click" );
	assert.equal( submit, 0, "off Click on inner div" );
	assert.equal( div, 1, "off Click on inner div" );
	assert.equal( livea, 1, "off Click on inner div" );
	assert.equal( liveb, 0, "off Click on inner div" );

	// Make sure that stopPropagation doesn't stop live events
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery( "#body" ).on( "click", "div#nothiddendivchild", function( e ) { liveb++; e.stopPropagation(); } );
	jQuery( "div#nothiddendivchild" ).trigger( "click" );
	assert.equal( submit, 0, "stopPropagation Click on inner div" );
	assert.equal( div, 1, "stopPropagation Click on inner div" );
	assert.equal( livea, 0, "stopPropagation Click on inner div" );
	assert.equal( liveb, 1, "stopPropagation Click on inner div" );

	// Make sure click events only fire with primary click
	submit = 0; div = 0; livea = 0; liveb = 0;
	event = jQuery.Event( "click" );
	event.button = 1;
	jQuery( "div#nothiddendiv" ).trigger( event );

	assert.equal( livea, 0, "on secondary click" );

	jQuery( "#body" ).off( "click", "div#nothiddendivchild" );
	jQuery( "#body" ).off( "click", "div#nothiddendiv" );
	jQuery( "#body" ).off( "click", "#qunit-fixture div" );
	jQuery( "#body" ).off( "submit", "#qunit-fixture div" );

	// Test binding with a different context
	clicked = 0;
	jQuery( "#qunit-fixture" ).on( "click", "#foo", function() { clicked++; } );
	jQuery( "#qunit-fixture div" ).trigger( "click" );
	jQuery( "#foo" ).trigger( "click" );
	jQuery( "#qunit-fixture" ).trigger( "click" );
	jQuery( "body" ).trigger( "click" );
	assert.equal( clicked, 2, "on with a context" );

	// Test unbinding with a different context
	jQuery( "#qunit-fixture" ).off( "click", "#foo" );
	jQuery( "#foo" ).trigger( "click" );
	assert.equal( clicked, 2, "off with a context" );

	// Test binding with event data
	jQuery( "#body" ).on( "click", "#foo", true, function( e ) {
		assert.equal( e.data, true, "on with event data" );
	} );
	jQuery( "#foo" ).trigger( "click" );
	jQuery( "#body" ).off( "click", "#foo" );

	// Test binding with trigger data
	jQuery( "#body" ).on( "click", "#foo", function( e, data ) {
		assert.equal( data, true, "on with trigger data" );
	} );
	jQuery( "#foo" ).trigger( "click", true );
	jQuery( "#body" ).off( "click", "#foo" );

	// Test binding with different this object
	jQuery( "#body" ).on( "click", "#foo", function() {
			assert.equal( this.foo, "bar", "on with event scope" );
	}.bind( { "foo": "bar" } ) );

	jQuery( "#foo" ).trigger( "click" );
	jQuery( "#body" ).off( "click", "#foo" );

	// Test binding with different this object, event data, and trigger data
	jQuery( "#body" ).on( "click", "#foo", true, function( e, data ) {
		assert.equal( e.data, true, "on with with different this object, event data, and trigger data" );
		assert.equal( this.foo, "bar", "on with with different this object, event data, and trigger data" );
		assert.equal( data, true, "on with with different this object, event data, and trigger data" );
	}.bind( { "foo": "bar" } ) );
	jQuery( "#foo" ).trigger( "click", true );
	jQuery( "#body" ).off( "click", "#foo" );

	// Verify that return false prevents default action
	jQuery( "#body" ).on( "click", "#anchor2", function() { return false; } );
	hash = window.location.hash;
	jQuery( "#anchor2" ).trigger( "click" );
	assert.equal( window.location.hash, hash, "return false worked" );
	jQuery( "#body" ).off( "click", "#anchor2" );

	// Verify that .preventDefault() prevents default action
	jQuery( "#body" ).on( "click", "#anchor2", function( e ) { e.preventDefault(); } );
	hash = window.location.hash;
	jQuery( "#anchor2" ).trigger( "click" );
	assert.equal( window.location.hash, hash, "e.preventDefault() worked" );
	jQuery( "#body" ).off( "click", "#anchor2" );

	// Test binding the same handler to multiple points
	called = 0;
	function callback() { called++; return false; }

	jQuery( "#body" ).on( "click", "#nothiddendiv", callback );
	jQuery( "#body" ).on( "click", "#anchor2", callback );

	jQuery( "#nothiddendiv" ).trigger( "click" );
	assert.equal( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery( "#anchor2" ).trigger( "click" );
	assert.equal( called, 1, "Verify that only one click occurred." );

	// Make sure that only one callback is removed
	jQuery( "#body" ).off( "click", "#anchor2", callback );

	called = 0;
	jQuery( "#nothiddendiv" ).trigger( "click" );
	assert.equal( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery( "#anchor2" ).trigger( "click" );
	assert.equal( called, 0, "Verify that no click occurred." );

	// Make sure that it still works if the selector is the same,
	// but the event type is different
	jQuery( "#body" ).on( "foo", "#nothiddendiv", callback );

	// Cleanup
	jQuery( "#body" ).off( "click", "#nothiddendiv", callback );

	called = 0;
	jQuery( "#nothiddendiv" ).trigger( "click" );
	assert.equal( called, 0, "Verify that no click occurred." );

	called = 0;
	jQuery( "#nothiddendiv" ).trigger( "foo" );
	assert.equal( called, 1, "Verify that one foo occurred." );

	// Cleanup
	jQuery( "#body" ).off( "foo", "#nothiddendiv", callback );

	// Make sure we don't loose the target by DOM modifications
	// after the bubble already reached the liveHandler
	livec = 0;
	jQuery( "#nothiddendivchild" ).html( "<span></span>" );

	jQuery( "#body" ).on( "click", "#nothiddendivchild", function() { jQuery( "#nothiddendivchild" ).html( "" ); } );
	jQuery( "#body" ).on( "click", "#nothiddendivchild", function( e ) { if ( e.target ) {livec++;} } );

	jQuery( "#nothiddendiv span" ).trigger( "click" );
	assert.equal( jQuery( "#nothiddendiv span" ).length, 0, "Verify that first handler occurred and modified the DOM." );
	assert.equal( livec, 1, "Verify that second handler occurred even with nuked target." );

	// Cleanup
	jQuery( "#body" ).off( "click", "#nothiddendivchild" );

	// Verify that .live() occurs and cancel bubble in the same order as
	// we would expect .on() and .click() without delegation
	lived = 0;
	livee = 0;

	// bind one pair in one order
	jQuery( "#body" ).on( "click", "span#liveSpan1 a", function() { lived++; return false; } );
	jQuery( "#body" ).on( "click", "span#liveSpan1", function() { livee++; } );

	jQuery( "span#liveSpan1 a" ).trigger( "click" );
	assert.equal( lived, 1, "Verify that only one first handler occurred." );
	assert.equal( livee, 0, "Verify that second handler doesn't." );

	// and one pair in inverse
	jQuery( "#body" ).on( "click", "span#liveSpan2", function() { livee++; } );
	jQuery( "#body" ).on( "click", "span#liveSpan2 a", function() { lived++; return false; } );

	lived = 0;
	livee = 0;
	jQuery( "span#liveSpan2 a" ).trigger( "click" );
	assert.equal( lived, 1, "Verify that only one first handler occurred." );
	assert.equal( livee, 0, "Verify that second handler doesn't." );

	// Cleanup
	jQuery( "#body" ).off( "click", "**" );

	// Test this, target and currentTarget are correct
	jQuery( "#body" ).on( "click", "span#liveSpan1", function( e ) {
		assert.equal( this.id, "liveSpan1", "Check the this within a on handler" );
		assert.equal( e.currentTarget.id, "liveSpan1", "Check the event.currentTarget within a on handler" );
		assert.equal( e.delegateTarget, document.body, "Check the event.delegateTarget within a on handler" );
		assert.equal( e.target.nodeName.toUpperCase(), "A", "Check the event.target within a on handler" );
	} );

	jQuery( "span#liveSpan1 a" ).trigger( "click" );

	jQuery( "#body" ).off( "click", "span#liveSpan1" );

	// Work with deep selectors
	livee = 0;

	function clickB() { livee++; }

	jQuery( "#body" ).on( "click", "#nothiddendiv div", function() { livee++; } );
	jQuery( "#body" ).on( "click", "#nothiddendiv div", clickB );
	jQuery( "#body" ).on( "mouseover", "#nothiddendiv div", function() { livee++; } );

	assert.equal( livee, 0, "No clicks, deep selector." );

	livee = 0;
	jQuery( "#nothiddendivchild" ).trigger( "click" );
	assert.equal( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery( "#nothiddendivchild" ).trigger( "mouseover" );
	assert.equal( livee, 1, "Mouseover, deep selector." );

	jQuery( "#body" ).off( "mouseover", "#nothiddendiv div" );

	livee = 0;
	jQuery( "#nothiddendivchild" ).trigger( "click" );
	assert.equal( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery( "#nothiddendivchild" ).trigger( "mouseover" );
	assert.equal( livee, 0, "Mouseover, deep selector." );

	jQuery( "#body" ).off( "click", "#nothiddendiv div", clickB );

	livee = 0;
	jQuery( "#nothiddendivchild" ).trigger( "click" );
	assert.equal( livee, 1, "Click, deep selector." );

	jQuery( "#body" ).off( "click", "#nothiddendiv div" );
} );

QUnit.test( "jQuery.off using dispatched jQuery.Event", function( assert ) {
	assert.expect( 1 );

	var markup = jQuery( "<p><a href='#'>target</a></p>" ),
		count = 0;
	markup
		.on( "click.name", "a", function( event ) {
			assert.equal( ++count, 1, "event called once before removal" );
			jQuery().off( event );
		} )
		.find( "a" ).trigger( "click" ).trigger( "click" ).end()
		.remove();
} );

QUnit.test( "events with type matching an Object.prototype property (gh-3256)", function( assert ) {
	assert.expect( 1 );

	var elem = jQuery( "<div></div>" ),
		eventFired = false;

	elem.appendTo( "#qunit-fixture" );

	try {
		elem
			.one( "hasOwnProperty", function() {
				eventFired = true;
			} )
			.trigger( "hasOwnProperty" );
	} finally {
		assert.strictEqual( eventFired, true, "trigger fired without crashing" );
	}
} );

QUnit.test( "events with type matching an Object.prototype property, cloned element (gh-3256)",
	function( assert ) {
	assert.expect( 1 );

	var elem = jQuery( "<div></div>" ),
		eventFired = false;

	elem.appendTo( "#qunit-fixture" );

	try {
		// Make sure the original element has some event data.
		elem.on( "click", function() {} );

		elem
			.clone( true )
			.one( "hasOwnProperty", function() {
				eventFired = true;
			} )
			.trigger( "hasOwnProperty" );
	} finally {
		assert.strictEqual( eventFired, true, "trigger fired without crashing" );
	}
} );

// selector-native does not support scope-fixing in delegation
QUnit[ jQuery.find.compile ? "test" : "skip" ]( "delegated event with delegateTarget-relative selector", function( assert ) {
	assert.expect( 3 );
	var markup = jQuery( "<div><ul><li><a id=\"a0\"></a><ul id=\"ul0\"><li class=test><a id=\"a0_0\"></a></li><li><a id=\"a0_1\"></a></li></ul></li></ul></div>" ).appendTo( "#qunit-fixture" );

	// Non-positional selector (#12383)
	markup.find( "#ul0" )
		.on( "click", "div li a", function() {
			assert.ok( false, "div is ABOVE the delegation point!" );
		} )
		.on( "click", "ul a", function() {
			assert.ok( false, "ul IS the delegation point!" );
		} )
		.on( "click", "li.test a", function() {
			assert.ok( true, "li.test is below the delegation point." );
		} )
		.find( "#a0_0" ).trigger( "click" ).end()
		.off( "click" );

	// Positional selector (#11315)
	markup.find( "ul" ).eq( 0 )
		.on( "click", ">li>a", function() {
			assert.ok( this.id === "a0", "child li was clicked" );
		} )
		.find( "#ul0" )
			.on( "click", "li:first>a", function() {
				assert.ok( this.id === "a0_0", "first li under #u10 was clicked" );
			} )
		.end()
		.find( "a" ).trigger( "click" ).end()
		.find( "#ul0" ).off();

	markup.remove();
} );

QUnit.test( "delegated event with selector matching Object.prototype property (#13203)", function( assert ) {
	assert.expect( 1 );

	var matched = 0;

	jQuery( "#foo" ).on( "click", "toString", function() {
		matched++;
	} );

	jQuery( "#anchor2" ).trigger( "click" );

	assert.equal( matched, 0, "Nothing matched 'toString'" );
} );

QUnit.test( "delegated event with intermediate DOM manipulation (#13208)", function( assert ) {
	assert.expect( 1 );

	jQuery( "#foo" ).on( "click", "[id=sap]", function() {} );
	jQuery( "#sap" ).on( "click", "[id=anchor2]", function() {
		document.createDocumentFragment().appendChild( this.parentNode );
		assert.ok( true, "Element removed" );
	} );
	jQuery( "#anchor2" ).trigger( "click" );
} );

QUnit.test( "ignore comment nodes in event delegation (gh-2055)", function( assert ) {
	assert.expect( 1 );

	// Test if DOMNodeInserted is supported
	// This is a back-up for when DOMNodeInserted support
	// is eventually removed from browsers
	function test() {
		var ret = false;
		var $fixture = jQuery( "#qunit-fixture" );
		$fixture.on( "DOMNodeInserted", function() {
			ret = true;
			$fixture.off( "DOMNodeInserted" );
		} ).append( "<div></div>" );
		return ret;
	}

	var $foo = jQuery( "#foo" ).on( "DOMNodeInserted", "[id]", function() {
		assert.ok( true, "No error thrown on comment node" );
	} ),
		$comment = jQuery( document.createComment( "comment" ) )
			.appendTo( $foo.find( "#sap" ) );

	if ( !test() ) {
		fireNative( $comment[ 0 ], "DOMNodeInserted" );
	}
} );

QUnit.test( "stopPropagation() stops directly-bound events on delegated target", function( assert ) {
	assert.expect( 1 );

	var markup = jQuery( "<div><p><a href=\"#\">target</a></p></div>" );
	markup
		.on( "click", function() {
			assert.ok( false, "directly-bound event on delegate target was called" );
		} )
		.on( "click", "a", function( e ) {
			e.stopPropagation();
			assert.ok( true, "delegated handler was called" );
		} )
		.find( "a" ).trigger( "click" ).end()
		.remove();
} );

QUnit.test( "off all bound delegated events", function( assert ) {
	assert.expect( 2 );

	var count = 0,
		clicks = 0,
		div = jQuery( "#body" );

	div.on( "click submit", "div#nothiddendivchild", function() { count++; } );
	div.on( "click", function() { clicks++; } );
	div.off( undefined, "**" );

	jQuery( "div#nothiddendivchild" ).trigger( "click" );
	jQuery( "div#nothiddendivchild" ).trigger( "submit" );

	assert.equal( count, 0, "Make sure no events were triggered." );

	div.trigger( "click" );
	assert.equal( clicks, 2, "Make sure delegated and directly bound event occurred." );
	div.off( "click" );
} );

QUnit.test( "on with multiple delegated events", function( assert ) {
	assert.expect( 1 );

	var count = 0,
		div = jQuery( "#body" );

	div.on( "click submit", "div#nothiddendivchild", function() { count++; } );

	jQuery( "div#nothiddendivchild" ).trigger( "click" );
	jQuery( "div#nothiddendivchild" ).trigger( "submit" );

	assert.equal( count, 2, "Make sure both the click and submit were triggered." );

	jQuery( "#body" ).off( undefined, "**" );
} );

QUnit.test( "delegated on with change", function( assert ) {
	assert.expect( 8 );

	var select, checkbox, checkboxFunction,
		text, textChange, oldTextVal,
		password, passwordChange, oldPasswordVal,
		selectChange = 0,
		checkboxChange = 0;

	select = jQuery( "select[name='S1']" );
	jQuery( "#body" ).on( "change", "select[name='S1']", function() {
		selectChange++;
	} );

	checkbox = jQuery( "#check2" );
	checkboxFunction = function() {
		checkboxChange++;
	};
	jQuery( "#body" ).on( "change", "#check2", checkboxFunction );

	// test click on select

	// second click that changed it
	selectChange = 0;
	select[ 0 ].selectedIndex = select[ 0 ].selectedIndex ? 0 : 1;
	select.trigger( "change" );
	assert.equal( selectChange, 1, "Change on click." );

	// test keys on select
	selectChange = 0;
	select[ 0 ].selectedIndex = select[ 0 ].selectedIndex ? 0 : 1;
	select.trigger( "change" );
	assert.equal( selectChange, 1, "Change on keyup." );

	// test click on checkbox
	checkbox.trigger( "change" );
	assert.equal( checkboxChange, 1, "Change on checkbox." );

	// test blur/focus on text
	text = jQuery( "#name" );
	textChange = 0;
	oldTextVal = text.val();

	jQuery( "#body" ).on( "change", "#name", function() {
		textChange++;
	} );

	text.val( oldTextVal + "foo" );
	text.trigger( "change" );
	assert.equal( textChange, 1, "Change on text input." );

	text.val( oldTextVal );
	jQuery( "#body" ).off( "change", "#name" );

	// test blur/focus on password
	password = jQuery( "#name" );
	passwordChange = 0;
	oldPasswordVal = password.val();
	jQuery( "#body" ).on( "change", "#name", function() {
		passwordChange++;
	} );

	password.val( oldPasswordVal + "foo" );
	password.trigger( "change" );
	assert.equal( passwordChange, 1, "Change on password input." );

	password.val( oldPasswordVal );
	jQuery( "#body" ).off( "change", "#name" );

	// make sure die works

	// die all changes
	selectChange = 0;
	jQuery( "#body" ).off( "change", "select[name='S1']" );
	select[ 0 ].selectedIndex = select[ 0 ].selectedIndex ? 0 : 1;
	select.trigger( "change" );
	assert.equal( selectChange, 0, "Die on click works." );

	selectChange = 0;
	select[ 0 ].selectedIndex = select[ 0 ].selectedIndex ? 0 : 1;
	select.trigger( "change" );
	assert.equal( selectChange, 0, "Die on keyup works." );

	// die specific checkbox
	jQuery( "#body" ).off( "change", "#check2", checkboxFunction );
	checkbox.trigger( "change" );
	assert.equal( checkboxChange, 1, "Die on checkbox." );
} );

QUnit.test( "delegated on with submit", function( assert ) {
	assert.expect( 2 );

	var count1 = 0, count2 = 0;

	jQuery( "#body" ).on( "submit", "#testForm", function( ev ) {
		count1++;
		ev.preventDefault();
	} );

	jQuery( document ).on( "submit", "body", function( ev ) {
		count2++;
		ev.preventDefault();
	} );

	jQuery( "#testForm input[name=sub1]" ).trigger( "submit" );
	assert.equal( count1, 1, "Verify form submit." );
	assert.equal( count2, 1, "Verify body submit." );

	jQuery( "#body" ).off( undefined, "**" );
	jQuery( document ).off( undefined, "**" );
} );

QUnit.test( "delegated off() with only namespaces", function( assert ) {
	assert.expect( 2 );

	var $delegate = jQuery( "#liveHandlerOrder" ),
		count = 0;

	$delegate.on( "click.ns", "a", function() {
		count++;
	} );

	jQuery( "a", $delegate ).eq( 0 ).trigger( "click.ns" );

	assert.equal( count, 1, "delegated click.ns" );

	$delegate.off( ".ns", "**" );

	jQuery( "a", $delegate ).eq( 1 ).trigger( "click.ns" );

	assert.equal( count, 1, "no more .ns after off" );
} );

QUnit.test( "Non DOM element events", function( assert ) {
	assert.expect( 1 );

	var o = {};

	jQuery( o ).on( "nonelementobj", function() {
		assert.ok( true, "Event on non-DOM object triggered" );
	} );

	jQuery( o ).trigger( "nonelementobj" ).off( "nonelementobj" );
} );

QUnit.test( "inline handler returning false stops default", function( assert ) {
	assert.expect( 1 );

	var markup = jQuery( "<div><a href=\"#\" onclick=\"return false\">x</a></div>" );
	markup.on( "click", function( e ) {
		assert.ok( e.isDefaultPrevented(), "inline handler prevented default" );
		return false;
	} );
	markup.find( "a" ).trigger( "click" );
	markup.off( "click" );
} );

QUnit.test( "window resize", function( assert ) {
	assert.expect( 2 );

	jQuery( window ).off();

	jQuery( window ).on( "resize", function() {
		assert.ok( true, "Resize event fired." );
	} ).trigger( "resize" ).off( "resize" );

	assert.ok( !jQuery._data( window, "events" ), "Make sure all the events are gone." );
} );

QUnit.test( "focusin bubbles", function( assert ) {
	assert.expect( 2 );

	var input = jQuery( "<input type='text' />" ).prependTo( "body" ),
		order = 0;

	// focus the element so DOM focus won't fire
	input[ 0 ].focus();

	jQuery( "body" ).on( "focusin.focusinBubblesTest", function() {
		assert.equal( 1, order++, "focusin on the body second" );
	} );

	input.on( "focusin.focusinBubblesTest", function() {
		assert.equal( 0, order++, "focusin on the element first" );
	} );

// Removed since DOM focus is unreliable on test swarm
	// DOM focus method
//	input[0].focus();

	// To make the next focus test work, we need to take focus off the input.
	// This will fire another focusin event, so set order to reflect that.
//	order = 1;
//	jQuery("#text1")[0].focus();

	// jQuery trigger, which calls DOM focus
	order = 0;
	input.trigger( "focus" );

	input.remove();
	jQuery( "body" ).off( "focusin.focusinBubblesTest" );
} );

QUnit.test( "custom events with colons (#3533, #8272)", function( assert ) {
	assert.expect( 1 );

	var tab = jQuery( "<table><tr><td>trigger</td></tr></table>" ).appendTo( "body" );
	try {
		tab.trigger( "back:forth" );
		assert.ok( true, "colon events don't throw" );
	} catch ( e ) {
		assert.ok( false, "colon events die" );
	}
	tab.remove();

} );

QUnit.test( ".on and .off", function( assert ) {
	assert.expect( 9 );
	var counter, mixfn, data,
		$onandoff = jQuery( "<div id=\"onandoff\"><p>on<b>and</b>off</p><div>worked<em>or</em>borked?</div></div>" ).appendTo( "body" );

	// Simple case
	jQuery( "#onandoff" )
		.on( "whip", function() {
			assert.ok( true, "whipped it good" );
		} )
		.trigger( "whip" )
		.off();

	// Direct events only
	counter = 0;
	jQuery( "#onandoff b" )
		.on( "click", 5, function( e, trig ) {
			counter += e.data + ( trig || 9 );	// twice, 5+9+5+17=36
		} )
		.one( "click", 7, function( e, trig ) {
			counter += e.data + ( trig || 11 );	// once, 7+11=18
		} )
		.trigger( "click" )
		.trigger( "click", 17 )
		.off( "click" );
	assert.equal( counter, 54, "direct event bindings with data" );

	// Delegated events only
	counter = 0;
	jQuery( "#onandoff" )
		.on( "click", "em", 5, function( e, trig ) {
			counter += e.data + ( trig || 9 );	// twice, 5+9+5+17=36
		} )
		.one( "click", "em", 7, function( e, trig ) {
			counter += e.data + ( trig || 11 );	// once, 7+11=18
		} )
		.find( "em" )
			.trigger( "click" )
			.trigger( "click", 17 )
		.end()
		.off( "click", "em" );
	assert.equal( counter, 54, "delegated event bindings with data" );

	// Mixed event bindings and types
	counter = 0;
	mixfn = function( e, trig ) {
		counter += ( e.data || 0 ) + ( trig || 1 );
	};
	jQuery( "#onandoff" )
		.on( " click  clack cluck ", "em", 2, mixfn )
		.on( "cluck", "b", 7, mixfn )
		.on( "cluck", mixfn )
		.trigger( "what!" )
		.each( function() {
			assert.equal( counter, 0, "nothing triggered yet" );
		} )
		.find( "em" )
			.one( "cluck", 3, mixfn )
			.trigger( "cluck", 8 )			// 3+8 2+8 + 0+8 = 29
			.off()
			.trigger( "cluck", 9 )			// 2+9 + 0+9 = 20
		.end()
		.each( function() {
			assert.equal( counter, 49, "after triggering em element" );
		} )
		.off( "cluck", function() {} )		// shouldn't remove anything
		.trigger( "cluck", 2 )				// 0+2 = 2
		.each( function() {
			assert.equal( counter, 51, "after triggering #onandoff cluck" );
		} )
		.find( "b" )
			.on( "click", 95, mixfn )
			.on( "clack", "p", 97, mixfn )
			.one( "cluck", 3, mixfn )
			.trigger( "quack", 19 )			// 0
			.off( "click clack cluck" )
		.end()
		.each( function() {
			assert.equal( counter, 51, "after triggering b" );
		} )
		.trigger( "cluck", 3 )				// 0+3 = 3
		.off( "clack", "em", mixfn )
		.find( "em" )
			.trigger( "clack" )				// 0
		.end()
		.each( function() {
			assert.equal( counter, 54, "final triggers" );
		} )
		.off( "click cluck" );

	// We should have removed all the event handlers ... kinda hacky way to check this
	data = jQuery.data[ jQuery( "#onandoff" )[ 0 ].expando ] || {};
	assert.equal( data[ "events" ], undefined, "no events left" );

	$onandoff.remove();
} );

QUnit.test( "special on name mapping", function( assert ) {
	assert.expect( 7 );

	jQuery.event.special.slap = {
		bindType: "click",
		delegateType: "swing",
		handle: function( event ) {
			assert.equal( event.handleObj.origType, "slap", "slapped your mammy, " + event.type );
		}
	};

	var comeback = function( event ) {
		assert.ok( true, "event " + event.type + " triggered" );
	};

	jQuery( "<div><button id=\"mammy\">Are We Not Men?</button></div>" )
		.on( "slap", "button", jQuery.noop )
		.on( "swing", "button", comeback )
		.find( "button" )
			.on( "slap", jQuery.noop )
			.on( "click", comeback )
			.trigger( "click" )		// bindType-slap and click
			.off( "slap" )
			.trigger( "click" )		// click
			.off( "click" )
			.trigger( "swing" )		// delegateType-slap and swing
		.end()
		.off( "slap swing", "button" )
		.find( "button" )			// everything should be gone
			.trigger( "slap" )
			.trigger( "click" )
			.trigger( "swing" )
		.end()
		.remove();
	delete jQuery.event.special.slap;

	jQuery.event.special.gutfeeling = {
		bindType: "click",
		delegateType: "click",
		handle: function( event ) {
			assert.equal( event.handleObj.origType, "gutfeeling", "got a gutfeeling" );

			// Need to call the handler since .one() uses it to unbind
			return event.handleObj.handler.call( this, event );
		}
	};

	// Ensure a special event isn't removed by its mapped type
	jQuery( "<p>Gut Feeling</p>" )
		.on( "click", jQuery.noop )
		.on( "gutfeeling", jQuery.noop )
		.off( "click" )
		.trigger( "gutfeeling" )
		.remove();

	// Ensure special events are removed when only a namespace is provided
	jQuery( "<p>Gut Feeling</p>" )
		.on( "gutfeeling.Devo", jQuery.noop )
		.off( ".Devo" )
		.trigger( "gutfeeling" )
		.remove();

	// Ensure .one() events are removed after their maiden voyage
	jQuery( "<p>Gut Feeling</p>" )
		.one( "gutfeeling", jQuery.noop )
		.trigger( "gutfeeling" )	// This one should
		.trigger( "gutfeeling" )	// This one should not
		.remove();

	delete jQuery.event.special[ "gutfeeling" ];
} );

QUnit.test( ".on and .off, selective mixed removal (#10705)", function( assert ) {
	assert.expect( 7 );

	var timingx = function( e ) {
		assert.ok( true, "triggered " + e.type );
	};

	jQuery( "<p>Strange Pursuit</p>" )
		.on( "click", timingx )
		.on( "click.duty", timingx )
		.on( "click.now", timingx )
		.on( "devo", timingx )
		.on( "future", timingx )
		.trigger( "click" )		// 3
		.trigger( "devo" )		// 1
		.off( ".duty devo " )	// trailing space
		.trigger( "future" )	// 1
		.trigger( "click" )		// 2
		.off( "future click" )
		.trigger( "click" );	// 0
} );

QUnit.test( ".on( event-map, null-selector, data ) #11130", function( assert ) {

	assert.expect( 1 );

	var $p = jQuery( "<p>Strange Pursuit</p>" ),
		data = "bar",
		map = {
			"foo": function( event ) {
				assert.equal( event.data, "bar", "event.data correctly relayed with null selector" );
				$p.remove();
			}
		};

	$p.on( map, null, data ).trigger( "foo" );
} );

QUnit.test( "clone() delegated events (#11076)", function( assert ) {
	assert.expect( 3 );

	var counter = { "center": 0, "fold": 0, "centerfold": 0 },
		clicked = function() {
			counter[ jQuery( this ).text().replace( /\s+/, "" ) ]++;
		},
		table =
			jQuery( "<table><tr><td>center</td><td>fold</td></tr></table>" )
			.on( "click", "tr", clicked )
			.on( "click", "td:first-child", clicked )
			.on( "click", "td:last-child", clicked ),
		clone = table.clone( true );

	clone.find( "td" ).trigger( "click" );
	assert.equal( counter.center, 1, "first child" );
	assert.equal( counter.fold, 1, "last child" );
	assert.equal( counter.centerfold, 2, "all children" );

	table.remove();
	clone.remove();
} );

QUnit.test( "checkbox state (trac-3827)", function( assert ) {
	assert.expect( 16 );

	var markup = jQuery( "<div class='parent'><input type=checkbox><div>" ),
		cb = markup.find( "input" )[ 0 ];

	markup.appendTo( "#qunit-fixture" );

	jQuery( cb ).on( "click", function() {
		assert.equal( this.checked, false, "just-clicked checkbox is not checked" );
	} );
	markup.on( "click", function() {
		assert.equal( cb.checked, false, "checkbox is not checked in bubbled event" );
	} );

	// Native click
	cb.checked = true;
	assert.equal( cb.checked, true, "native event - checkbox is initially checked" );
	cb.click();
	assert.equal( cb.checked, false, "native event - checkbox is no longer checked" );

	// jQuery click
	cb.checked = true;
	assert.equal( cb.checked, true, "jQuery event - checkbox is initially checked" );
	jQuery( cb ).trigger( "click" );
	assert.equal( cb.checked, false, "jQuery event - checkbox is no longer checked" );

	// Handlers only; checkbox state remains false
	jQuery( cb ).triggerHandler( "click" );
	assert.equal( cb.checked, false, "handlers only - checkbox is still unchecked" );

	// Trigger parameters are preserved (trac-13353, gh-4139)
	cb.checked = true;
	assert.equal( cb.checked, true, "jQuery event with data - checkbox is initially checked" );
	jQuery( cb ).on( "click", function( e, data ) {
		assert.equal( data, "clicked", "trigger data passed to handler" );
	} );
	markup.on( "click", function( e, data ) {
		assert.equal( data, "clicked", "trigger data passed to bubbled handler" );
	} );
	jQuery( cb ).trigger( "click", [ "clicked" ] );
	assert.equal( cb.checked, false, "jQuery event with data - checkbox is no longer checked" );
} );

QUnit.test( "event object properties on natively-triggered event", function( assert ) {
	assert.expect( 3 );

	var link = document.createElement( "a" ),
		$link = jQuery( link ),
		evt = document.createEvent( "MouseEvents" );

	// Support: IE <=9 - 11 only
	// IE requires element to be in the body before it will dispatch
	$link.appendTo( "body" ).on( "click", function( e ) {

		// Not trying to assert specific values here, just ensure the property exists
		assert.equal( "detail" in e, true, "has .detail" );
		assert.equal( "cancelable" in e, true, "has .cancelable" );
		assert.equal( "bubbles" in e, true, "has .bubbles" );
	} );
	evt.initEvent( "click", true, true );
	link.dispatchEvent( evt );
	$link.off( "click" ).remove();
} );

QUnit.test( "addProp extensions", function( assert ) {
	assert.expect( 2 );

	var $fixture = jQuery( "<div>" ).appendTo( "#qunit-fixture" );

	// Ensure the property doesn't exist
	$fixture.on( "click", function( event ) {
		assert.ok( !( "testProperty" in event ), "event.testProperty does not exist" );
	} );
	fireNative( $fixture[ 0 ], "click" );
	$fixture.off( "click" );

	jQuery.event.addProp( "testProperty", function() { return 42; } );

	// Trigger a native click and ensure the property is set
	$fixture.on( "click", function( event ) {
		assert.equal( event.testProperty, 42, "event.testProperty getter was invoked" );
	} );
	fireNative( $fixture[ 0 ], "click" );
	$fixture.off( "click" );

	$fixture.remove();
} );

QUnit.test( "drag/drop events copy mouse-related event properties (gh-1925, gh-2009)", function( assert ) {
	assert.expect( 4 );

	var $fixture = jQuery( "<div id='drag-fixture'></div>" ).appendTo( "body" );

	$fixture.on( "dragmove", function( evt ) {
		assert.ok( "pageX" in evt, "checking for pageX property on dragmove" );
		assert.ok( "pageY" in evt, "checking for pageY property on dragmove" );
	} );
	fireNative( $fixture[ 0 ], "dragmove" );

	$fixture.on( "drop", function( evt ) {
		assert.ok( "pageX" in evt, "checking for pageX property on drop" );
		assert.ok( "pageY" in evt, "checking for pageY property on drop" );
	} );

	fireNative( $fixture[ 0 ], "drop" );

	$fixture.off( "dragmove drop" ).remove();
} );

QUnit.test( "focusin using non-element targets", function( assert ) {
	assert.expect( 2 );

	jQuery( document ).on( "focusin", function( e ) {
		assert.ok( e.type === "focusin", "got a focusin event on a document" );
	} ).trigger( "focusin" ).off( "focusin" );

	jQuery( window ).on( "focusin", function( e ) {
		assert.ok( e.type === "focusin", "got a focusin event on a window" );
	} ).trigger( "focusin" ).off( "focusin" );

} );

testIframe(
	"focusin from an iframe",
	"event/focusinCrossFrame.html",
	function( assert, framejQuery, frameWin, frameDoc ) {
		assert.expect( 1 );

		var done = assert.async(),
			focus = false,
			input = jQuery( frameDoc ).find( "#frame-input" );

		// Create a focusin handler on the parent; shouldn't affect the iframe's fate
		jQuery( "body" ).on( "focusin.iframeTest", function() {

			// Support: IE 9 - 11+
			// IE does propagate the event to the parent document. In this test
			// we mainly care about the inner element so we'll just skip this one
			// assertion in IE.
			if ( !document.documentMode ) {
				assert.ok( false, "fired a focusin event in the parent document" );
			}
		} );

		input.on( "focusin", function() {
			focus = true;
			assert.ok( true, "fired a focusin event in the iframe" );
		} );

		// Avoid a native event; Chrome can't force focus to another frame
		input[ 0 ].focus();

		// Remove body handler manually since it's outside the fixture
		jQuery( "body" ).off( "focusin.iframeTest" );

		setTimeout( function() {

			// DOM focus is unreliable in TestSwarm
			if ( QUnit.isSwarm && !focus ) {
				assert.ok( true, "GAP: Could not observe focus change" );
			}

			done();
		}, 50 );
	}
);

QUnit.test( "focusin on document & window", function( assert ) {
	assert.expect( 1 );

	var counter = 0,
		input = jQuery( "<input />" );

	function increment() {
		counter++;
	}

	input.appendTo( "#qunit-fixture" );

	input[ 0 ].focus();

	jQuery( window ).on( "focusout", increment );
	jQuery( document ).on( "focusout", increment );

	input[ 0 ].blur();

	// DOM focus is unreliable in TestSwarm
	if ( QUnit.isSwarm && counter === 0 ) {
		assert.ok( true, "GAP: Could not observe focus change" );
	}

	assert.strictEqual( counter, 2,
		"focusout handlers on document/window fired once only" );

	jQuery( window ).off( "focusout", increment );
	jQuery( document ).off( "focusout", increment );
} );

QUnit.test( "element removed during focusout (gh-4417)", function( assert ) {
	assert.expect( 1 );

	var button = jQuery( "<button>Click me</button>" );

	button.appendTo( "#qunit-fixture" );

	button.on( "click", function() {
		button.trigger( "blur" );
		assert.ok( true, "Removing the element didn't crash" );
	} );

	// Support: Chrome 86+
	// In Chrome, if an element having a focusout handler is blurred by
	// clicking outside of it, it invokes the handler synchronously. However,
	// if the click happens programmatically, the invocation is asynchronous.
	// As we have no way to simulate real user input in unit tests, simulate
	// this behavior by calling `jQuery.cleanData` & removing the element using
	// native APIs.
	button[ 0 ].blur = function() {
		jQuery.cleanData( [ this ] );
		this.parentNode.removeChild( this );
	};

	button[ 0 ].click();
} );

testIframe(
	"jQuery.ready promise",
	"event/promiseReady.html",
	function( assert, jQuery, window, document, isOk ) {
		assert.expect( 1 );
		assert.ok( isOk, "$.when( $.ready ) works" );
	},
	jQuery.when ? QUnit.test : QUnit.skip
);

// need PHP here to make the incepted IFRAME hang
if ( hasPHP ) {
	testIframe(
		"jQuery.ready uses interactive",
		"event/interactiveReady.html",
	function( assert, jQuery, window, document, isOk ) {
			assert.expect( 1 );
			assert.ok( isOk, "jQuery fires ready when the DOM can truly be interacted with" );
		}
	);
}

testIframe(
	"Focusing iframe element",
	"event/focusElem.html",
	function( assert, jQuery, window, document, isOk ) {
		assert.expect( 1 );
		assert.ok( isOk, "Focused an element in an iframe" );
	}
);

testIframe(
	"triggerHandler(onbeforeunload)",
	"event/triggerunload.html",
	function( assert, jQuery, window, document, isOk ) {
		assert.expect( 1 );
		assert.ok( isOk, "Triggered onbeforeunload without an error" );
	}
);

// need PHP here to make the incepted IFRAME hang
if ( hasPHP ) {
	testIframe(
		"jQuery.ready synchronous load with long loading subresources",
		"event/syncReady.html",
		function( assert, jQuery, window, document, isOk ) {
			assert.expect( 1 );
			assert.ok( isOk, "jQuery loaded synchronously fires ready when the DOM can truly be interacted with" );
		}
	);
}

QUnit.test( "change handler should be detached from element", function( assert ) {
	assert.expect( 2 );

	var $fixture = jQuery( "<input type='text' id='change-ie-leak' />" ).appendTo( "body" ),
		originRemoveEvent = jQuery.removeEvent,
		wrapperRemoveEvent =  function( elem, type, handle ) {
			assert.equal( "change", type, "Event handler for 'change' event should be removed" );
			assert.equal( "change-ie-leak", jQuery( elem ).attr( "id" ), "Event handler for 'change' event should be removed from appropriate element" );
			originRemoveEvent( elem, type, handle );
		};

	jQuery.removeEvent = wrapperRemoveEvent;

	$fixture.on( "change", function() {} );
	$fixture.off( "change" );

	$fixture.remove();

	jQuery.removeEvent = originRemoveEvent;
} );

QUnit.test( "trigger click on checkbox, fires change event", function( assert ) {
	assert.expect( 1 );

	var check = jQuery( "#check2" );
	var done = assert.async();

	check.on( "change", function() {

		// get it?
		check.off( "change" );
		assert.ok( true, "Change event fired as a result of triggered click" );
		done();
	} ).trigger( "click" );
} );

QUnit.test( "Namespace preserved when passed an Event (#12739)", function( assert ) {
	assert.expect( 4 );

	var markup = jQuery(
			"<div id='parent'><div id='child'></div></div>"
		),
		triggered = 0,
		fooEvent;

	markup.find( "div" )
		.addBack()
		.on( "foo.bar", function( e ) {
			if ( !e.handled ) {
				triggered++;
				e.handled = true;
				assert.equal( e.namespace, "bar", "namespace is bar" );
				jQuery( e.target ).find( "div" ).each( function() {
					jQuery( this ).triggerHandler( e );
				} );
			}
		} )
		.on( "foo.bar2", function() {
			assert.ok( false, "foo.bar2 called on trigger " + triggered + " id " + this.id );
		} );

	markup.trigger( "foo.bar" );
	markup.trigger( jQuery.Event( "foo.bar" ) );
	fooEvent = jQuery.Event( "foo" );
	fooEvent.namespace = "bar";
	markup.trigger( fooEvent );
	markup.remove();

	assert.equal( triggered, 3, "foo.bar triggered" );
} );

QUnit.test( "make sure events cloned correctly", function( assert ) {
	assert.expect( 18 );

	var clone,
		fixture = jQuery( "#qunit-fixture" ),
		checkbox = jQuery( "#check1" ),
		p = jQuery( "#firstp" );

	fixture.on( "click change", function( event, result ) {
		assert.ok( result,  event.type + " on original element is fired" );

	} ).on( "click", "#firstp", function( event, result ) {
		assert.ok( result, "Click on original child element though delegation is fired" );

	} ).on( "change", "#check1", function( event, result ) {
		assert.ok( result, "Change on original child element though delegation is fired" );
	} );

	p.on( "click", function() {
		assert.ok( true, "Click on original child element is fired" );
	} );

	checkbox.on( "change", function() {
		assert.ok( true, "Change on original child element is fired" );
	} );

	fixture.clone().trigger( "click" ).trigger( "change" ); // 0 events should be fired

	clone = fixture.clone( true );

	clone.find( "p" ).eq( 0 ).trigger( "click", true ); // 3 events should fire
	clone.find( "#check1" ).trigger( "change", true ); // 3 events should fire
	clone.remove();

	clone = fixture.clone( true, true );
	clone.find( "p" ).eq( 0 ).trigger( "click", true ); // 3 events should fire
	clone.find( "#check1" ).trigger( "change", true ); // 3 events should fire

	fixture.off();
	p.off();
	checkbox.off();

	p.trigger( "click" ); // 0 should be fired
	checkbox.trigger( "change" ); // 0 should be fired

	clone.find( "p" ).eq( 0 ).trigger( "click", true );  // 3 events should fire
	clone.find( "#check1" ).trigger( "change", true ); // 3 events should fire
	clone.remove();

	clone.find( "p" ).eq( 0 ).trigger( "click" );  // 0 should be fired
	clone.find( "#check1" ).trigger( "change" ); // 0 events should fire
} );

QUnit.test( "String.prototype.namespace does not cause trigger() to throw (#13360)", function( assert ) {
	assert.expect( 1 );
	var errored = false;

	String.prototype.namespace = function() {};

	try {
		jQuery( "<p>" ).trigger( "foo.bar" );
	} catch ( e ) {
		errored = true;
	}
	assert.equal( errored, false, "trigger() did not throw exception" );
	delete String.prototype.namespace;
} );

QUnit.test( "Inline event result is returned (#13993)", function( assert ) {
	assert.expect( 1 );

	var result = jQuery( "<p onclick='return 42'>hello</p>" ).triggerHandler( "click" );

	assert.equal( result, 42, "inline handler returned value" );
} );

QUnit.test( ".off() removes the expando when there's no more data", function( assert ) {
	assert.expect( 2 );

	var key,
		div = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" );

	div.on( "click", false );
	div.on( "custom", function() {
		assert.ok( true, "Custom event triggered" );
	} );
	div.trigger( "custom" );
	div.off( "click custom" );

	// Make sure the expando is gone
	for ( key in div[ 0 ] ) {
		if ( /^jQuery/.test( key ) ) {
			assert.strictEqual(
				div[ 0 ][ key ], undefined,
				"Expando was not removed when there was no more data"
			);
		}
	}
} );

QUnit.test( "jQuery.Event( src ) does not require a target property", function( assert ) {
	assert.expect( 2 );

	var event = jQuery.Event( { type: "offtarget" } );

	assert.equal( event.type, "offtarget", "correct type" );
	assert.equal( event.target, undefined, "no target" );
} );

QUnit.test( "preventDefault() on focusin does not throw exception", function( assert ) {
	assert.expect( 1 );

	var done = assert.async(),
		input = jQuery( "<input/>" ).appendTo( "#form" );

	input.on( "focusin", function( event ) {
		if ( !done ) {
			return;
		}

		var exceptionCaught;
		try {
			event.preventDefault();
		} catch ( theException ) {
			exceptionCaught = theException;
		}

		assert.strictEqual( exceptionCaught, undefined,
			"Preventing default on focusin throws no exception" );

		done();
		done = null;
	} );
	input.trigger( "focus" );

	// DOM focus is unreliable in TestSwarm; set a simulated event workaround timeout
	setTimeout( function() {
		if ( !done ) {
			return;
		}
		input[ 0 ].addEventListener( "click", function( nativeEvent ) {
			jQuery.event.simulate( "focusin", this, jQuery.event.fix( nativeEvent ) );
		} );
		input[ 0 ].click();
	}, QUnit.config.testTimeout / 4 || 1000 );
} );

QUnit.test( ".on('focus', fn) on a text node doesn't throw", function( assert ) {
	assert.expect( 1 );

	jQuery( document.createTextNode( "text" ) )
		.on( "focus", function() {} );

	assert.ok( true, "No crash" );
} );

QUnit.test( "Donor event interference", function( assert ) {
	assert.expect( 8 );

	var outer = jQuery(
			"<div id='donor-outer'>" +
				"<form id='donor-form'>" +
					"<input id='donor-input' type='checkbox' />" +
				"</form>" +
			"</div>"
		).appendTo( "#qunit-fixture" ),
		input = jQuery( "#donor-input" );

	input.on( "click", function( event ) {
		assert.equal( event.type, "click", "click event at input" );
		assert.ok( !event.isPropagationStopped(), "click event at input is still propagating" );
		assert.equal( typeof event.originalEvent, "object",
			"click event at input has originalEvent property" );
	} );
	outer.on( "click", function( event ) {
		assert.equal( event.type, "click", "click event at ancestor" );
		assert.ok( !event.isPropagationStopped(), "click event at ancestor is still propagating" );
		assert.equal( typeof event.originalEvent, "object",
			"click event at ancestor has originalEvent property" );
	} );
	input.on( "change", function( event ) {
		assert.equal( event.type, "change", "change event at input" );
		assert.equal( typeof event.originalEvent, "object",
			"change event at input has originalEvent property" );
		event.stopPropagation();
	} );
	input[ 0 ].click();
} );

QUnit.test(
	"simulated events shouldn't forward stopPropagation/preventDefault methods",
	function( assert ) {
		assert.expect( 3 );

		var outer = jQuery(
				"<div id='donor-outer'>" +
					"<form id='donor-form'>" +
						"<input id='donor-input' type='checkbox' />" +
					"</form>" +
				"</div>"
			).appendTo( "#qunit-fixture" ),
			input = jQuery( "#donor-input" ),
			spy = {};

		jQuery( "#donor-form" )
			.on( "simulated", function( event ) {
				spy.prevent = sinon.stub( event.originalEvent, "preventDefault" );
				event.preventDefault();
			} )
			.on( "simulated", function( event ) {
				spy.stop = sinon.stub( event.originalEvent, "stopPropagation" );
				event.stopPropagation();
			} )
			.on( "simulated", function( event ) {
				spy.immediate = sinon.stub( event.originalEvent, "stopImmediatePropagation" );
				event.stopImmediatePropagation();
			} )
			.on( "simulated", function( event ) {
				assert.ok( false, "simulated event immediate propagation stopped" );
			} );
		outer
			.on( "simulated", function( event ) {
				assert.ok( false, "simulated event propagation stopped" );
			} );

		// Force a simulated event
		input[ 0 ].addEventListener( "click", function( nativeEvent ) {
			jQuery.event.simulate( "simulated", this, jQuery.event.fix( nativeEvent ) );
		} );
		input[ 0 ].click();

		assert.strictEqual( spy.prevent.called, false, "Native preventDefault not called" );
		assert.strictEqual( spy.stop.called, false, "Native stopPropagation not called" );
		assert.strictEqual( spy.immediate.called, false,
			"Native stopImmediatePropagation not called" );
	}
);

QUnit.test( "originalEvent type of simulated event", function( assert ) {
	assert.expect( 2 );

	var outer = jQuery(
			"<div id='donor-outer'>" +
				"<form id='donor-form'>" +
					"<input id='donor-input' type='text' />" +
				"</form>" +
			"</div>"
		).appendTo( "#qunit-fixture" ),
		input = jQuery( "#donor-input" ),
		done = assert.async(),
		finish = function() {

			// Remove jQuery handlers to ensure removal of capturing handlers on the document
			outer.off( "focusin" );

			done();
		};

	outer.on( "focusin", function( event ) {
		assert.equal( event.type, "focusin", "focusin event at ancestor" );
		assert.equal( event.originalEvent.type, "click",
			"focus event at ancestor has correct originalEvent type" );
		setTimeout( finish );
	} );

	input[ 0 ].addEventListener( "click", function( nativeEvent ) {
		jQuery.event.simulate( "focusin", this, jQuery.event.fix( nativeEvent ) );
	} );
	input[ 0 ].click();
} );

QUnit.test( "trigger('click') on radio passes extra params", function( assert ) {
	assert.expect( 1 );
	var $radio = jQuery( "<input type='radio' />" ).appendTo( "#qunit-fixture" )
		.on( "click", function( e, data ) {
			assert.ok( data, "Trigger data is passed to radio click handler" );
		} );

	$radio.trigger( "click", [ true ] );
} );

// Support: IE <=9 only
// https://msdn.microsoft.com/en-us/library/hh801223(v=vs.85).aspx
QUnit.test( "VML with special event handlers (trac-7071)", function( assert ) {
	assert.expect( 1 );

	var ns = jQuery( "<xml:namespace ns='urn:schemas-microsoft-com:vml' prefix='v' />" ).appendTo( "head" );

	jQuery( "<v:oval id='oval' style='width:100pt;height:75pt;' fillcolor='red'> </v:oval>" ).appendTo( "#form" );
	jQuery( "#form" ).on( "keydown", function() {
		assert.ok( true, "no error was thrown" );
	} );
	jQuery( "#oval" ).trigger( "click" ).trigger( "keydown" );
	ns.remove();
} );

QUnit.test( "Check order of focusin/focusout events", function( assert ) {
	assert.expect( 2 );

	var focus, blur,
		input = jQuery( "#name" );

	input
		.on( "focus", function() {
			focus = true;
		} )
		.on( "focusin", function() {
			assert.ok( !focus, "Focusin event should fire before focus does" );
			focus = true;
		} )
		.on( "blur", function() {
			blur = true;
		} )
		.on( "focusout", function() {
			assert.ok( !blur, "Focusout event should fire before blur does" );
			blur = true;
		} );

	// gain focus
	input.trigger( "focus" );

	// then lose it
	jQuery( "#search" ).trigger( "focus" );

	// cleanup
	input.off();

	// DOM focus is unreliable in TestSwarm
	if ( !focus ) {
		assert.ok( true, "GAP: Could not observe focus change" );
		assert.ok( true, "GAP: Could not observe focus change" );
	}
} );

QUnit.test( "focus-blur order (#12868)", function( assert ) {
	assert.expect( 5 );

	var order,
		$text = jQuery( "#text1" ),
		$radio = jQuery( "#radio1" ),

		// Support: IE <=9 - 11+
		// focus and blur events are asynchronous; this is the resulting mess.
		// The browser window must be topmost for this to work properly!!
		done = assert.async();

	$radio[ 0 ].focus();

	setTimeout( function() {

		$text
			.on( "focus", function() {
				assert.equal( order++, 1, "text focus" );
			} )
			.on( "blur", function() {
				assert.equal( order++, 0, "text blur" );
			} );
		$radio
			.on( "focus", function() {
				assert.equal( order++, 1, "radio focus" );
			} )
			.on( "blur", function() {
				assert.equal( order++, 0, "radio blur" );
			} );

		// Enabled input getting focus
		order = 0;
		assert.equal( document.activeElement, $radio[ 0 ], "radio has focus" );
		$text.trigger( "focus" );
		setTimeout( function() {

			// DOM focus is unreliable in TestSwarm
			if ( order === 0 ) {
				assert.ok( true, "GAP: Could not observe focus change" );
				assert.ok( true, "GAP: Could not observe focus change" );
			}

			assert.equal( document.activeElement, $text[ 0 ], "text has focus" );

			// Run handlers without native method on an input
			order = 1;
			$radio.triggerHandler( "focus" );

			// Clean up
			$text.off();
			$radio.off();
			done();
		}, 50 );
	}, 50 );
} );

QUnit.test( "Event handling works with multiple async focus events (gh-4350)", function( assert ) {
	assert.expect( 3 );

	var remaining = 3,
		input = jQuery( "#name" ),

		// Support: IE <=9 - 11+
		// focus and blur events are asynchronous; this is the resulting mess.
		// The browser window must be topmost for this to work properly!!
		done = assert.async();

	input
		.on( "focus", function() {
			remaining--;
			assert.ok( true, "received focus event, expecting " + remaining + " more" );
			if ( remaining > 0 ) {
				input.trigger( "blur" );
			} else {
				done();
			}
		} )
		.on( "blur", function() {
			setTimeout( function() {
				input.trigger( "focus" );
			} );
		} );

	// gain focus
	input.trigger( "focus" );

	// DOM focus is unreliable in TestSwarm
	setTimeout( function() {
		if ( QUnit.isSwarm && remaining === 3 ) {
			assert.ok( true, "GAP: Could not observe focus change" );
			assert.ok( true, "GAP: Could not observe focus change" );
			assert.ok( true, "GAP: Could not observe focus change" );
			setTimeout( function() {
				done();
			} );
		}
	} );
} );

QUnit.test( "native-backed events preserve trigger data (gh-1741, gh-4139)", function( assert ) {
	assert.expect( 17 );

	var parent = supportjQuery(
			"<div class='parent'><input type='checkbox'><input type='radio'></div>"
		).appendTo( "#qunit-fixture" ),
		targets = jQuery( parent[ 0 ].childNodes ),
		checkbox = jQuery( targets[ 0 ] ),
		data = [ "arg1", "arg2" ],
		slice = data.slice,

		// Support: IE <=9 - 11+
		// focus and blur events are asynchronous; this is the resulting mess.
		// The browser window must be topmost for this to work properly!!
		done = assert.async();

	// click (gh-4139)
	assert.strictEqual( targets[ 0 ].checked, false, "checkbox unchecked before click" );
	assert.strictEqual( targets[ 1 ].checked, false, "radio unchecked before click" );
	targets.add( parent ).on( "click", function( event ) {
		var type = event.target.type,
			level = event.currentTarget === parent[ 0 ] ? "parent" : "";
		assert.strictEqual( event.target.checked, true,
			type + " toggled before invoking " + level + " handler" );
		assert.deepEqual( slice.call( arguments, 1 ), data,
			type + " " + level + " handler received correct data" );
	} );
	targets.trigger( "click", data );
	assert.strictEqual( targets[ 0 ].checked, true,
		"checkbox toggled after click (default action)" );
	assert.strictEqual( targets[ 1 ].checked, true,
		"radio toggled after event (default action)" );

	// focus (gh-1741)
	assert.notEqual( document.activeElement, checkbox[ 0 ],
		"element not focused before focus event" );
	checkbox.on( "focus blur", function( event ) {
		var type = event.type;
		assert.deepEqual( slice.call( arguments, 1 ), data,
			type + " handler received correct data" );
	} );
	checkbox.trigger( "focus", data );
	setTimeout( function() {
		assert.strictEqual( document.activeElement, checkbox[ 0 ],
			"element focused after focus event (default action)" );
		checkbox.trigger( "blur", data );
		setTimeout( function() {
			assert.notEqual( document.activeElement, checkbox[ 0 ],
				"element not focused after blur event (default action)" );
			done();
		}, 50 );
	}, 50 );
} );

QUnit.test( "focus change during a focus handler (gh-4382)", function( assert ) {
	assert.expect( 2 );

	var done = assert.async(),
		select = jQuery( "<select><option selected='selected'>A</option></select>" ),
		button = jQuery( "<button>Focus target</button>" );

	jQuery( "#qunit-fixture" )
		.append( select )
		.append( button );

	select.on( "focus", function() {
		button.trigger( "focus" );
	} );

	jQuery( document ).on( "focusin.focusTests", function( ev ) {
		// Support: IE 11+
		// In IE focus is async so focusin on document is fired multiple times,
		// for each of the elements. In other browsers it's fired just once, for
		// the last one.
		if ( ev.target === button[ 0 ] ) {
			assert.ok( true, "focusin propagated to document from the button" );
		}
	} );

	select.trigger( "focus" );

	setTimeout( function() {
		assert.strictEqual( document.activeElement, button[ 0 ], "Focus redirect worked" );
		jQuery( document ).off( ".focusTests" );
		done();
	} );
} );

// TODO replace with an adaptation of
// https://github.com/jquery/jquery/pull/1367/files#diff-a215316abbaabdf71857809e8673ea28R2464
( function() {
	supportjQuery.each(
		{
			checkbox: "<input type='checkbox'>",
			radio: "<input type='radio'>"
		},
		makeTestFor3751
	);

	function makeTestFor3751( type, html ) {
		var testName = "native-backed namespaced clicks are handled correctly (gh-3751) - " + type;
		QUnit.test( testName, function( assert ) {
			assert.expect( 2 );

			var parent = supportjQuery( "<div class='parent'>" + html + "</div>" ),
				target = jQuery( parent[ 0 ].firstChild );

			parent.appendTo( "#qunit-fixture" );

			target.add( parent )
				.on( "click.notFired", function( event ) {
					assert.ok( false, "namespaced event should not be received" +
						" by wrong-namespace listener at " + event.currentTarget.nodeName );
				} )
				.on( "click.fired", function( event ) {
					assert.equal( event.target.checked, true,
						"toggled before invoking handler at " + event.currentTarget.nodeName );
				} )
				.on( "click", function( event ) {
					assert.ok( false, "namespaced event should not be received" +
						" by non-namespaced listener at " + event.currentTarget.nodeName );
				} );

			target.trigger( "click.fired" );
		} );
	}
} )();
