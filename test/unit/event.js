module("event", { teardown: moduleTeardown });

test("null or undefined handler", function() {
	expect(2);
	// Supports Fixes bug #7229
	try {
		jQuery("#firstp").on( "click", null );
		ok(true, "Passing a null handler will not throw an exception");
	} catch ( e ) {}

	try {
		jQuery("#firstp").on( "click", undefined );
		ok(true, "Passing an undefined handler will not throw an exception");
	} catch ( e ) {}
});

test("on() with non-null,defined data", function() {

	expect(2);

	var handler = function( event, data ) {
		equal( data, 0, "non-null, defined data (zero) is correctly passed" );
	};

	jQuery("#foo").on("foo.on", handler);
	jQuery("div").on("foo.delegate", "#foo", handler);

	jQuery("#foo").trigger("foo", 0);

	jQuery("#foo").off("foo.on", handler);
	jQuery("div").off("foo.delegate", "#foo");

});

test("Handler changes and .trigger() order", function() {
	expect(1);

	var markup = jQuery(
		"<div><div><p><span><b class=\"a\">b</b></span></p></div></div>"
	),
	path = "";

	markup
		.find( "*" ).addBack().on( "click", function() {
			path += this.nodeName.toLowerCase() + " ";
		})
		.filter( "b" ).on( "click", function( e ) {
			// Removing span should not stop propagation to original parents
			if ( e.target === this ) {
				jQuery(this).parent().remove();
			}
		});

	markup.find( "b" ).trigger( "click" );

	equal( path, "b p div div ", "Delivered all events" );

	markup.remove();
});

test("on(), with data", function() {
	expect(4);
	var test, handler, handler2;

	handler = function(event) {
		ok( event.data, "on() with data, check passed data exists" );
		equal( event.data["foo"], "bar", "on() with data, Check value of passed data" );
	};
	jQuery("#firstp").on("click", {"foo": "bar"}, handler).trigger("click").off("click", handler);

	ok( !jQuery._data(jQuery("#firstp")[0], "events"), "Event handler unbound when using data." );

	test = function(){};
	handler2 = function(event) {
		equal( event.data, test, "on() with function data, Check value of passed data" );
	};
	jQuery("#firstp").on("click", test, handler2).trigger("click").off("click", handler2);
});

test("click(), with data", function() {
	expect(3);
	var handler = function(event) {
		ok( event.data, "on() with data, check passed data exists" );
		equal( event.data["foo"], "bar", "on() with data, Check value of passed data" );
	};
	jQuery("#firstp").on( "click", {"foo": "bar"}, handler).trigger("click").off("click", handler);

	ok( !jQuery._data(jQuery("#firstp")[0], "events"), "Event handler unbound when using data." );
});

test("on(), with data, trigger with data", function() {
	expect(4);
	var handler = function(event, data) {
		ok( event.data, "check passed data exists" );
		equal( event.data.foo, "bar", "Check value of passed data" );
		ok( data, "Check trigger data" );
		equal( data.bar, "foo", "Check value of trigger data" );
	};
	jQuery("#firstp").on("click", {foo: "bar"}, handler).trigger("click", [{bar: "foo"}]).off("click", handler);
});

test("on(), multiple events at once", function() {
	expect(2);
	var handler,
		clickCounter = 0,
		mouseoverCounter = 0;
	handler = function(event) {
		if (event.type === "click") {
			clickCounter += 1;
		}
		else if (event.type === "mouseover") {
			mouseoverCounter += 1;
		}
	};

	jQuery("#firstp").on("click mouseover", handler).trigger("click").trigger("mouseover");
	equal( clickCounter, 1, "on() with multiple events at once" );
	equal( mouseoverCounter, 1, "on() with multiple events at once" );
});

test("on(), five events at once", function() {
	expect(1);

	var count = 0,
		handler = function() {
			count++;
		};

	jQuery("#firstp").on("click mouseover foo bar baz", handler)
	.trigger("click").trigger("mouseover")
		.trigger("foo").trigger("bar")
		.trigger("baz");

	equal( count, 5, "on() five events at once" );
});

test("on(), multiple events at once and namespaces", function() {
	expect(7);

	var cur, div,
		obj = {};

	div = jQuery("<div/>").on("focusin.a", function(e) {
		equal( e.type, cur, "Verify right single event was fired." );
	});

	cur = "focusin";
	div.trigger("focusin.a");

	// manually clean up detached elements
	div.remove();

	div = jQuery("<div/>").on("click mouseover", obj, function(e) {
		equal( e.type, cur, "Verify right multi event was fired." );
		equal( e.data, obj, "Make sure the data came in correctly." );
	});

	cur = "click";
	div.trigger("click");

	cur = "mouseover";
	div.trigger("mouseover");

	// manually clean up detached elements
	div.remove();

	div = jQuery("<div/>").on("focusin.a focusout.b", function(e) {
		equal( e.type, cur, "Verify right multi event was fired." );
	});

	cur = "focusin";
	div.trigger("focusin.a");

	cur = "focusout";
	div.trigger("focusout.b");

	// manually clean up detached elements
	div.remove();
});

test("on(), namespace with special add", function() {
	expect(27);

	var i = 0,
		div = jQuery("<div/>").appendTo("#qunit-fixture").on( "test", function() {
			ok( true, "Test event fired." );
		});

	jQuery.event.special["test"] = {
		_default: function( e, data ) {
			equal( e.type, "test", "Make sure we're dealing with a test event." );
			ok( data, "And that trigger data was passed." );
			strictEqual( e.target, div[0], "And that the target is correct." );
			equal( this, window, "And that the context is correct." );
		},
		setup: function() {},
		teardown: function() {
			ok( true, "Teardown called." );
		},
		add: function( handleObj ) {
			var handler = handleObj.handler;
			handleObj.handler = function( e ) {
				e.xyz = ++i;
				handler.apply( this, arguments );
			};
		},
		remove: function() {
			ok( true, "Remove called." );
		}
	};

	div.on( "test.a", { x: 1 }, function( e ) {
		ok( !!e.xyz, "Make sure that the data is getting passed through." );
		equal( e.data["x"], 1, "Make sure data is attached properly." );
	});

	div.on( "test.b", { x: 2 }, function( e ) {
		ok( !!e.xyz, "Make sure that the data is getting passed through." );
		equal( e.data["x"], 2, "Make sure data is attached properly." );
	});

	// Should trigger 5
	div.trigger( "test", 33.33 );

	// Should trigger 2
	div.trigger( "test.a", "George Harrison" );

	// Should trigger 2
	div.trigger( "test.b", { year: 1982 } );

	// Should trigger 4
	div.off("test");

	div = jQuery("<div/>").on( "test", function() {
		ok( true, "Test event fired." );
	});

	// Should trigger 2
	div.appendTo("#qunit-fixture").remove();

	delete jQuery.event.special["test"];
});

test("on(), no data", function() {
	expect(1);
	var handler = function(event) {
		ok ( !event.data, "Check that no data is added to the event object" );
	};
	jQuery("#firstp").on("click", handler).trigger("click");
});

test("on/one/off(Object)", function(){
	expect(6);

	var $elem,
		clickCounter = 0,
		mouseoverCounter = 0;

	function handler(event) {
		if (event.type === "click") {
			clickCounter++;
		} else if (event.type === "mouseover") {
			mouseoverCounter++;
		}
	}

	function handlerWithData(event) {
		if (event.type === "click") {
			clickCounter += event.data;
		} else if (event.type === "mouseover") {
			mouseoverCounter += event.data;
		}
	}

	function trigger(){
		$elem.trigger("click").trigger("mouseover");
	}

	$elem = jQuery("#firstp")
		// Regular bind
		.on({
			"click":handler,
			"mouseover":handler
		})
		// Bind with data
		.one({
			"click":handlerWithData,
			"mouseover":handlerWithData
		}, 2 );

	trigger();

	equal( clickCounter, 3, "on(Object)" );
	equal( mouseoverCounter, 3, "on(Object)" );

	trigger();
	equal( clickCounter, 4, "on(Object)" );
	equal( mouseoverCounter, 4, "on(Object)" );

	jQuery("#firstp").off({
		"click":handler,
		"mouseover":handler
	});

	trigger();
	equal( clickCounter, 4, "on(Object)" );
	equal( mouseoverCounter, 4, "on(Object)" );
});

test("on/off(Object), on/off(Object, String)", function() {
	expect(6);

	var events,
		clickCounter = 0,
		mouseoverCounter = 0,
		$p = jQuery("#firstp"),
		$a = $p.find("a").eq(0);

	events = {
		"click": function( event ) {
			clickCounter += ( event.data || 1 );
		},
		"mouseover": function( event ) {
			mouseoverCounter += ( event.data || 1 );
		}
	};

	function trigger() {
		$a.trigger("click").trigger("mouseover");
	}

	jQuery( document ).on( events, "#firstp a" );
	$p.on( events, "a", 2 );

	trigger();
	equal( clickCounter, 3, "on" );
	equal( mouseoverCounter, 3, "on" );

	$p.off( events, "a" );

	trigger();
	equal( clickCounter, 4, "off" );
	equal( mouseoverCounter, 4, "off" );

	jQuery( document ).off( events, "#firstp a" );

	trigger();
	equal( clickCounter, 4, "off" );
	equal( mouseoverCounter, 4, "off" );
});

test("on immediate propagation", function() {
	expect(2);

	var lastClick,
		$p = jQuery("#firstp"),
		$a = $p.find("a").eq(0);

	lastClick = "";
	jQuery( document ).on( "click", "#firstp a", function(e) {
		lastClick = "click1";
		e.stopImmediatePropagation();
	});
	jQuery( document ).on( "click", "#firstp a", function() {
		lastClick = "click2";
	});
	$a.trigger( "click" );
	equal( lastClick, "click1", "on stopImmediatePropagation" );
	jQuery( document ).off( "click", "#firstp a" );

	lastClick = "";
	$p.on( "click", "a", function(e) {
		lastClick = "click1";
		e.stopImmediatePropagation();
	});
	$p.on( "click", "a", function() {
		lastClick = "click2";
	});
	$a.trigger( "click" );
	equal( lastClick, "click1", "on stopImmediatePropagation" );
	$p.off( "click", "**" );
});

test("on bubbling, isDefaultPrevented", function() {
	expect(2);
	var $anchor2 = jQuery( "#anchor2" ),
		$main = jQuery( "#qunit-fixture" ),
		fakeClick = function($jq) {
			// Use a native click so we don't get jQuery simulated bubbling
			if ( document.createEvent ) {
				var e = document.createEvent( "MouseEvents" );
				e.initEvent( "click", true, true );
				$jq[0].dispatchEvent(e);
			}
			else if ( $jq[0].click ) {
				$jq[0].click();	// IE
			}
		};
	$anchor2.on( "click", function(e) {
		e.preventDefault();
	});
	$main.on("click", "#foo", function(e) {
		var orig = e.originalEvent;

		if ( typeof(orig.defaultPrevented) === "boolean" || typeof(orig.returnValue) === "boolean" || orig["getPreventDefault"] ) {
			equal( e.isDefaultPrevented(), true, "isDefaultPrevented true passed to bubbled event" );

		} else {
			// Opera < 11 doesn't implement any interface we can use, so give it a pass
			ok( true, "isDefaultPrevented not supported by this browser, test skipped" );
		}
	});
	fakeClick( $anchor2 );
	$anchor2.off( "click" );
	$main.off( "click", "**" );
	$anchor2.on( "click", function() {
		// Let the default action occur
	});
	$main.on("click", "#foo", function(e) {
		equal( e.isDefaultPrevented(), false, "isDefaultPrevented false passed to bubbled event" );
	});
	fakeClick( $anchor2 );
	$anchor2.off( "click" );
	$main.off( "click", "**" );
});

test("on(), iframes", function() {
	expect( 1 );

	// events don't work with iframes, see #939 - this test fails in IE because of contentDocument
	var doc = jQuery("#loadediframe").contents();

	jQuery("div", doc).on("click", function() {
		ok( true, "Binding to element inside iframe" );
	}).trigger("click").off("click");
});

test("on(), trigger change on select", function() {
	expect(5);
	var counter = 0;
	function selectOnChange(event) {
		equal( event.data, counter++, "Event.data is not a global event object" );
	}
	jQuery("#form select").each(function(i){
		jQuery(this).on("change", i, selectOnChange);
	}).trigger("change");
});

test("on(), namespaced events, cloned events", 18, function() {
	var firstp = jQuery( "#firstp" );

	firstp.on("custom.test",function(){
		ok(false, "Custom event triggered");
	});

	firstp.on("click",function(e){
		ok(true, "Normal click triggered");
		equal( e.type + e.namespace, "click", "Check that only click events trigger this fn" );
	});

	firstp.on("click.test",function(e){
		var check = "click";
		ok( true, "Namespaced click triggered" );
		if ( e.namespace ) {
			check += "test";
		}
		equal( e.type + e.namespace, check, "Check that only click/click.test events trigger this fn" );
	});

	//clone(true) element to verify events are cloned correctly
	firstp = firstp.add( firstp.clone( true ).attr( "id", "firstp2" ).insertBefore( firstp ) );

	// Trigger both bound fn (8)
	firstp.trigger("click");

	// Trigger one bound fn (4)
	firstp.trigger("click.test");

	// Remove only the one fn
	firstp.off("click.test");

	// Trigger the remaining fn (4)
	firstp.trigger("click");

	// Remove the remaining namespaced fn
	firstp.off(".test");

	// Try triggering the custom event (0)
	firstp.trigger("custom");

	// using contents will get comments regular, text, and comment nodes
	jQuery("#nonnodes").contents().on("tester", function () {
		equal(this.nodeType, 1, "Check node,textnode,comment on just does real nodes" );
	}).trigger("tester");

	// Make sure events stick with appendTo'd elements (which are cloned) #2027
	jQuery("<a href='#fail' class='test'>test</a>").on( "click", function(){ return false; }).appendTo("#qunit-fixture");
	ok( jQuery("a.test").eq(0).triggerHandler("click") === false, "Handler is bound to appendTo'd elements" );
});

test("on(), multi-namespaced events", function() {
	expect(6);

	var order = [
		"click.test.abc",
		"click.test.abc",
		"click.test",
		"click.test.abc",
		"click.test",
		"custom.test2"
	];

	function check(name, msg){
		deepEqual( name, order.shift(), msg );
	}

	jQuery("#firstp").on("custom.test",function() {
		check("custom.test", "Custom event triggered");
	});

	jQuery("#firstp").on("custom.test2",function() {
		check("custom.test2", "Custom event triggered");
	});

	jQuery("#firstp").on("click.test",function() {
		check("click.test", "Normal click triggered");
	});

	jQuery("#firstp").on("click.test.abc",function() {
		check("click.test.abc", "Namespaced click triggered");
	});

	// Those would not trigger/off (#5303)
	jQuery("#firstp").trigger("click.a.test");
	jQuery("#firstp").off("click.a.test");

	// Trigger both bound fn (1)
	jQuery("#firstp").trigger("click.test.abc");

	// Trigger one bound fn (1)
	jQuery("#firstp").trigger("click.abc");

	// Trigger two bound fn (2)
	jQuery("#firstp").trigger("click.test");

	// Remove only the one fn
	jQuery("#firstp").off("click.abc");

	// Trigger the remaining fn (1)
	jQuery("#firstp").trigger("click");

	// Remove the remaining fn
	jQuery("#firstp").off(".test");

	// Trigger the remaining fn (1)
	jQuery("#firstp").trigger("custom");
});

test("namespace-only event binding is a no-op", function(){
	expect(2);

	jQuery("#firstp")
		.on( ".whoops", function() {
			ok( false, "called a namespace-only event" );
		})
		.on( "whoops", function() {
			ok( true, "called whoops" );
		})
		.trigger("whoops")	// 1
		.off(".whoops")
		.trigger("whoops")	// 2
		.off("whoops");
});

test("on(), with same function", function() {
	expect(2);

	var count = 0, func = function(){
		count++;
	};

	jQuery("#liveHandlerOrder").on("foo.bar", func).on("foo.zar", func);
	jQuery("#liveHandlerOrder").trigger("foo.bar");

	equal(count, 1, "Verify binding function with multiple namespaces." );

	jQuery("#liveHandlerOrder").off("foo.bar", func).off("foo.zar", func);
	jQuery("#liveHandlerOrder").trigger("foo.bar");

	equal(count, 1, "Verify that removing events still work." );
});

test("on(), make sure order is maintained", function() {
	expect(1);

	var elem = jQuery("#firstp"), log = [], check = [];

	jQuery.each( new Array(100), function( i ) {
		elem.on( "click", function(){
			log.push( i );
		});

		check.push( i );

	});

	elem.trigger("click");

	equal( log.join(","), check.join(","), "Make sure order was maintained." );

	elem.off("click");
});

test("on(), with different this object", function() {
	expect(4);
	var thisObject = { myThis: true },
		data = { myData: true },
		handler1 = function() {
			equal( this, thisObject, "on() with different this object" );
		},
		handler2 = function( event ) {
			equal( this, thisObject, "on() with different this object and data" );
			equal( event.data, data, "on() with different this object and data" );
		};

	jQuery("#firstp")
		.on("click", jQuery.proxy(handler1, thisObject)).trigger("click").off("click", handler1)
		.on("click", data, jQuery.proxy(handler2, thisObject)).trigger("click").off("click", handler2);

	ok( !jQuery._data(jQuery("#firstp")[0], "events"), "Event handler unbound when using different this object and data." );
});

test("on(name, false), off(name, false)", function() {
	expect(3);

	var main = 0;
	jQuery("#qunit-fixture").on("click", function(){ main++; });
	jQuery("#ap").trigger("click");
	equal( main, 1, "Verify that the trigger happened correctly." );

	main = 0;
	jQuery("#ap").on("click", false);
	jQuery("#ap").trigger("click");
	equal( main, 0, "Verify that no bubble happened." );

	main = 0;
	jQuery("#ap").off("click", false);
	jQuery("#ap").trigger("click");
	equal( main, 1, "Verify that the trigger happened correctly." );

	// manually clean up events from elements outside the fixture
	jQuery("#qunit-fixture").off("click");
});

test("on(name, selector, false), off(name, selector, false)", function() {
	expect(3);

	var main = 0;

	jQuery("#qunit-fixture").on("click", "#ap", function(){ main++; });
	jQuery("#ap").trigger("click");
	equal( main, 1, "Verify that the trigger happened correctly." );

	main = 0;
	jQuery("#ap").on("click", "#groups", false);
	jQuery("#groups").trigger("click");
	equal( main, 0, "Verify that no bubble happened." );

	main = 0;
	jQuery("#ap").off("click", "#groups", false);
	jQuery("#groups").trigger("click");
	equal( main, 1, "Verify that the trigger happened correctly." );
	jQuery("#qunit-fixture").off("click", "#ap");
});

test("on()/trigger()/off() on plain object", function() {
	expect( 7 );

	var events,
		obj = {};

	// Make sure it doesn't complain when no events are found
	jQuery(obj).trigger("test");

	// Make sure it doesn't complain when no events are found
	jQuery(obj).off("test");

	jQuery(obj).on({
		"test": function() {
			ok( true, "Custom event run." );
		},
		"submit": function() {
			ok( true, "Custom submit event run." );
		}
	});

	events = jQuery._data(obj, "events");
	ok( events, "Object has events bound." );
	equal( obj["events"], undefined, "Events object on plain objects is not events" );
	equal( obj["test"], undefined, "Make sure that test event is not on the plain object." );
	equal( obj["handle"], undefined, "Make sure that the event handler is not on the plain object." );

	// Should trigger 1
	jQuery(obj).trigger("test");
	jQuery(obj).trigger("submit");

	jQuery(obj).off("test");
	jQuery(obj).off("submit");

	// Should trigger 0
	jQuery(obj).trigger("test");

	// Make sure it doesn't complain when no events are found
	jQuery(obj).off("test");

	equal( obj && obj[ jQuery.expando ] &&
			obj[ jQuery.expando ][ jQuery.expando ] &&
			obj[ jQuery.expando ][ jQuery.expando ]["events"], undefined, "Make sure events object is removed" );
});

test("off(type)", function() {
	expect( 1 );

	var message, func,
		$elem = jQuery("#firstp");

	function error(){
		ok( false, message );
	}

	message = "unbind passing function";
	$elem.on("error1", error).off("error1", error).triggerHandler("error1");

	message = "unbind all from event";
	$elem.on("error1", error).off("error1").triggerHandler("error1");

	message = "unbind all";
	$elem.on("error1", error).off().triggerHandler("error1");

	message = "unbind many with function";
	$elem.on("error1 error2",error)
		.off("error1 error2", error )
		.trigger("error1").triggerHandler("error2");

	message = "unbind many"; // #3538
	$elem.on("error1 error2", error)
		.off("error1 error2")
		.trigger("error1").triggerHandler("error2");

	message = "unbind without a type or handler";
	$elem.on("error1 error2.test",error)
		.off()
		.trigger("error1").triggerHandler("error2");

	// Should only unbind the specified function
	jQuery( document ).on( "click", function(){
		ok( true, "called handler after selective removal");
	});
	func = function() {};
	jQuery( document )
		.on( "click", func )
		.off( "click", func )
		.trigger("click")
		.off( "click" );
});

test("off(eventObject)", function() {
	expect(4);

	var $elem = jQuery("#firstp"),
		num;

	function assert( expected ){
		num = 0;
		$elem.trigger("foo").triggerHandler("bar");
		equal( num, expected, "Check the right handlers are triggered" );
	}

	$elem
		// This handler shouldn't be unbound
		.on("foo", function(){
			num += 1;
		})
		.on("foo", function(e){
			$elem.off( e );
			num += 2;
		})
		// Neither this one
		.on("bar", function(){
			num += 4;
		});

	assert( 7 );
	assert( 5 );

	$elem.off("bar");
	assert( 1 );

	$elem.off();
	assert( 0 );
});

if ( jQuery.fn.hover ) {
	test("hover() mouseenter mouseleave", function() {
		expect(1);

		var times = 0,
			handler1 = function() { ++times; },
			handler2 = function() { ++times; };

		jQuery("#firstp")
			.hover(handler1, handler2)
			.mouseenter().mouseleave()
			.off("mouseenter", handler1)
			.off("mouseleave", handler2)
			.hover(handler1)
			.mouseenter().mouseleave()
			.off("mouseenter mouseleave", handler1)
			.mouseenter().mouseleave();

		equal( times, 4, "hover handlers fired" );

	});
}

test("mouseover triggers mouseenter", function() {
	expect(1);

	var count = 0,
		elem = jQuery("<a />");
	elem.on( "mouseenter", function () {
		count++;
	});
	elem.trigger("mouseover");
	equal(count, 1, "make sure mouseover triggers a mouseenter" );

	elem.remove();
});

test("withinElement implemented with jQuery.contains()", function() {

	expect(1);

	jQuery("#qunit-fixture").append("<div id='jc-outer'><div id='jc-inner'></div></div>");

	jQuery("#jc-outer").on("mouseenter mouseleave", function( event ) {

		equal( this.id, "jc-outer", this.id + " " + event.type );

	}).trigger("mouseenter");

	jQuery("#jc-inner").trigger("mousenter");

	jQuery("#jc-outer").off("mouseenter mouseleave").remove();
	jQuery("#jc-inner").remove();

});

test("mouseenter, mouseleave don't catch exceptions", function() {
	expect(2);

	var elem = jQuery("#firstp").on( "mouseenter mouseleave", function() {
			throw "an Exception";
		});

	try {
		elem.trigger("mouseenter");
	} catch (e) {
		equal( e, "an Exception", "mouseenter doesn't catch exceptions" );
	}

	try {
		elem.trigger("mouseleave");
	} catch (e) {
		equal( e, "an Exception", "mouseleave doesn't catch exceptions" );
	}
});

if ( jQuery.fn.click ) {

	test("trigger() shortcuts", function() {
		expect(6);

		var counter, clickCounter,
			elem = jQuery("<li><a href='#'>Change location</a></li>").prependTo("#firstUL");
		elem.find("a").on("click", function() {
			var close = jQuery("spanx", this); // same with jQuery(this).find("span");
			equal( close.length, 0, "Context element does not exist, length must be zero" );
			ok( !close[0], "Context element does not exist, direct access to element must return undefined" );
			return false;
		}).click();

		// manually clean up detached elements
		elem.remove();

		jQuery("#check1").click(function() {
			ok( true, "click event handler for checkbox gets fired twice, see #815" );
		}).click();

		counter = 0;
		jQuery("#firstp")[0].onclick = function() {
			counter++;
		};
		jQuery("#firstp").click();
		equal( counter, 1, "Check that click, triggers onclick event handler also" );

		clickCounter = 0;
		jQuery("#simon1")[0].onclick = function() {
			clickCounter++;
		};
		jQuery("#simon1").click();
		equal( clickCounter, 1, "Check that click, triggers onclick event handler on an a tag also" );

		elem = jQuery("<img />").load(function(){
			ok( true, "Trigger the load event, using the shortcut .load() (#2819)");
		}).load();

		// manually clean up detached elements
		elem.remove();

		// test that special handlers do not blow up with VML elements (#7071)
		jQuery("<xml:namespace ns='urn:schemas-microsoft-com:vml' prefix='v' />").appendTo("head");
		jQuery("<v:oval id='oval' style='width:100pt;height:75pt;' fillcolor='red'> </v:oval>").appendTo("#form");
		jQuery("#oval").click().keydown();
	});

}

test("trigger() bubbling", function() {
	expect(18);

	var win = 0, doc = 0, html = 0, body = 0, main = 0, ap = 0;

	jQuery(window).on("click", function(){ win++; });
	jQuery(document).on("click", function( e ){ if ( e.target !== document) { doc++; } });
	jQuery("html").on("click", function(){ html++; });
	jQuery("body").on("click", function(){ body++; });
	jQuery("#qunit-fixture").on("click", function(){ main++; });
	jQuery("#ap").on("click", function(){ ap++; return false; });

	jQuery("html").trigger("click");
	equal( win, 1, "HTML bubble" );
	equal( doc, 1, "HTML bubble" );
	equal( html, 1, "HTML bubble" );

	jQuery("body").trigger("click");
	equal( win, 2, "Body bubble" );
	equal( doc, 2, "Body bubble" );
	equal( html, 2, "Body bubble" );
	equal( body, 1, "Body bubble" );

	jQuery("#qunit-fixture").trigger("click");
	equal( win, 3, "Main bubble" );
	equal( doc, 3, "Main bubble" );
	equal( html, 3, "Main bubble" );
	equal( body, 2, "Main bubble" );
	equal( main, 1, "Main bubble" );

	jQuery("#ap").trigger("click");
	equal( doc, 3, "ap bubble" );
	equal( html, 3, "ap bubble" );
	equal( body, 2, "ap bubble" );
	equal( main, 1, "ap bubble" );
	equal( ap, 1, "ap bubble" );

	jQuery( document ).trigger("click");
	equal( win, 4, "doc bubble" );

	// manually clean up events from elements outside the fixture
	jQuery(document).off("click");
	jQuery("html, body, #qunit-fixture").off("click");
});

test("trigger(type, [data], [fn])", function() {
	expect(16);

	var $elem, pass, form, elem2,
		handler = function(event, a, b, c) {
		equal( event.type, "click", "check passed data" );
		equal( a, 1, "check passed data" );
		equal( b, "2", "check passed data" );
		equal( c, "abc", "check passed data" );
		return "test";
	};

	$elem = jQuery("#firstp");

	// Simulate a "native" click
	$elem[0].click = function(){
		ok( true, "Native call was triggered" );
	};


	jQuery( document ).on("mouseenter", "#firstp", function(){
		ok( true, "Trigger mouseenter bound by on" );
	});

	jQuery( document ).on("mouseleave", "#firstp", function(){
		ok( true, "Trigger mouseleave bound by on" );
	});

	$elem.trigger("mouseenter");

	$elem.trigger("mouseleave");

	jQuery( document ).off( "mouseenter mouseleave", "#firstp");

	// Triggers handlers and native
	// Trigger 5
	$elem.on("click", handler).trigger("click", [1, "2", "abc"]);

	// Simulate a "native" click
	$elem[0].click = function(){
		ok( false, "Native call was triggered" );
	};

	// Trigger only the handlers (no native)
	// Triggers 5
	equal( $elem.triggerHandler("click", [1, "2", "abc"]), "test", "Verify handler response" );

	pass = true;
	try {
		elem2 = jQuery("#form input").eq(0);
		elem2.get(0).style.display = "none";
		elem2.trigger("focus");
	} catch( e ) {
		pass = false;
	}
	ok( pass, "Trigger focus on hidden element" );

	pass = true;
	try {
		jQuery("#qunit-fixture table").eq(0).on("test:test", function(){}).trigger("test:test");
	} catch ( e ) {
		pass = false;
	}
	ok( pass, "Trigger on a table with a colon in the even type, see #3533" );

	form = jQuery("<form action=''></form>").appendTo("body");

	// Make sure it can be prevented locally
	form.on( "submit", function(){
		ok( true, "Local `on` still works." );
		return false;
	});

	// Trigger 1
	form.trigger("submit");

	form.off("submit");

	jQuery(document).on( "submit", function(){
		ok( true, "Make sure bubble works up to document." );
		return false;
	});

	// Trigger 1
	form.trigger("submit");

	jQuery(document).off("submit");

	form.remove();
});

test( "submit event bubbles on copied forms (#11649)", function() {
	expect( 3 );

	var $formByClone, $formByHTML,
		$testForm = jQuery("#testForm"),
		$fixture = jQuery("#qunit-fixture"),
		$wrapperDiv = jQuery("<div/>").appendTo( $fixture );

	function noSubmit( e ) {
		e.preventDefault();
	}
	function delegatedSubmit() {
		ok( true, "Make sure submit event bubbles up." );
		return false;
	}

	// Attach a delegated submit handler to the parent element
	$fixture.on( "submit", "form", delegatedSubmit );

	// Trigger form submission to introduce the _submit_attached property
	$testForm.on( "submit", noSubmit ).find("input[name=sub1]").trigger("click");

	// Copy the form via .clone() and .html()
	$formByClone = $testForm.clone( true, true ).removeAttr("id");
	$formByHTML = jQuery( jQuery.parseHTML($fixture.html()) ).filter("#testForm").removeAttr("id");
	$wrapperDiv.append( $formByClone, $formByHTML );

	// Check submit bubbling on the copied forms
	$wrapperDiv.find("form").on( "submit", noSubmit ).find("input[name=sub1]").trigger("click");

	// Clean up
	$wrapperDiv.remove();
	$fixture.off( "submit", "form", delegatedSubmit );
	$testForm.off( "submit", noSubmit );
});

test( "change event bubbles on copied forms (#11796)", function(){
	expect( 3 );

	var $formByClone, $formByHTML,
		$form = jQuery("#form"),
		$fixture = jQuery("#qunit-fixture"),
		$wrapperDiv = jQuery("<div/>").appendTo( $fixture );

	function delegatedChange() {
		ok( true, "Make sure change event bubbles up." );
		return false;
	}

	// Attach a delegated change handler to the form
	$fixture.on( "change", "form", delegatedChange );

	// Trigger change event to introduce the _change_attached property
	$form.find("select[name=select1]").val("1").trigger("change");

	// Copy the form via .clone() and .html()
	$formByClone = $form.clone( true, true ).removeAttr("id");
	$formByHTML = jQuery( jQuery.parseHTML($fixture.html()) ).filter("#form").removeAttr("id");
	$wrapperDiv.append( $formByClone, $formByHTML );

	// Check change bubbling on the copied forms
	$wrapperDiv.find("form select[name=select1]").val("2").trigger("change");

	// Clean up
	$wrapperDiv.remove();
	$fixture.off( "change", "form", delegatedChange );
});

test("trigger(eventObject, [data], [fn])", function() {
	expect(28);

	var event,
		$parent = jQuery("<div id='par' />").appendTo("body"),
		$child = jQuery("<p id='child'>foo</p>").appendTo( $parent );

	$parent.get( 0 ).style.display = "none";

	event = jQuery.Event("noNew");
	ok( event !== window, "Instantiate jQuery.Event without the 'new' keyword" );
	equal( event.type, "noNew", "Verify its type" );

	equal( event.isDefaultPrevented(), false, "Verify isDefaultPrevented" );
	equal( event.isPropagationStopped(), false, "Verify isPropagationStopped" );
	equal( event.isImmediatePropagationStopped(), false, "Verify isImmediatePropagationStopped" );

	event.preventDefault();
	equal( event.isDefaultPrevented(), true, "Verify isDefaultPrevented" );
	event.stopPropagation();
	equal( event.isPropagationStopped(), true, "Verify isPropagationStopped" );

	event.isPropagationStopped = function(){ return false; };
	event.stopImmediatePropagation();
	equal( event.isPropagationStopped(), true, "Verify isPropagationStopped" );
	equal( event.isImmediatePropagationStopped(), true, "Verify isPropagationStopped" );

	$parent.on("foo",function( e ) {
		// Tries bubbling
		equal( e.type, "foo", "Verify event type when passed passing an event object" );
		equal( e.target.id, "child", "Verify event.target when passed passing an event object" );
		equal( e.currentTarget.id, "par", "Verify event.currentTarget when passed passing an event object" );
		equal( e.secret, "boo!", "Verify event object's custom attribute when passed passing an event object" );
	});

	// test with an event object
	event = new jQuery.Event("foo");
	event.secret = "boo!";
	$child.trigger(event);

	// test with a literal object
	$child.trigger({"type": "foo", "secret": "boo!"});

	$parent.off();

	function error(){
		ok( false, "This assertion shouldn't be reached");
	}

	$parent.on("foo", error );

	$child.on("foo",function(e, a, b, c ){
		equal( arguments.length, 4, "Check arguments length");
		equal( a, 1, "Check first custom argument");
		equal( b, 2, "Check second custom argument");
		equal( c, 3, "Check third custom argument");

		equal( e.isDefaultPrevented(), false, "Verify isDefaultPrevented" );
		equal( e.isPropagationStopped(), false, "Verify isPropagationStopped" );
		equal( e.isImmediatePropagationStopped(), false, "Verify isImmediatePropagationStopped" );

		// Skips both errors
		e.stopImmediatePropagation();

		return "result";
	});

	// We should add this back in when we want to test the order
	// in which event handlers are iterated.
	//$child.on("foo", error );

	event = new jQuery.Event("foo");
	$child.trigger( event, [1,2,3] ).off();
	equal( event.result, "result", "Check event.result attribute");

	// Will error if it bubbles
	$child.triggerHandler("foo");

	$child.off();
	$parent.off().remove();

	// Ensure triggerHandler doesn't molest its event object (#xxx)
	event = jQuery.Event( "zowie" );
	jQuery( document ).triggerHandler( event );
	equal( event.type, "zowie", "Verify its type" );
	equal( event.isPropagationStopped(), false, "propagation not stopped" );
	equal( event.isDefaultPrevented(), false, "default not prevented" );
});

// Explicitly introduce global variable for oldIE so QUnit doesn't complain if checking globals
window.onclick = undefined;
test(".trigger() bubbling on disconnected elements (#10489)", function() {
	expect(2);

	jQuery( window ).on( "click", function(){
		ok( false, "click fired on window" );
	});

	jQuery( "<div><p>hi</p></div>" )
		.on( "click", function() {
			ok( true, "click fired on div" );
		})
		.find( "p" )
			.on( "click", function() {
				ok( true, "click fired on p" );
			})
			.trigger("click")
			.off( "click" )
		.end()
		.off( "click" )
		.remove();

	jQuery( window ).off( "click" );
});

test(".trigger() doesn't bubble load event (#10717)", function() {
	expect(1);

	jQuery( window ).on( "load", function(){
		ok( false, "load fired on window" );
	});

	// It's not an image, but as long as it fires load...
	jQuery("<img src='index.html' />")
		.appendTo( "body" )
		.on( "load", function() {
			ok( true, "load fired on img" );
		})
		.trigger( "load" )
		.remove();

	jQuery( window ).off( "load" );
});

test("Delegated events in SVG (#10791; #13180)", function() {
	expect(2);

	var useElem, e,
		svg = jQuery(
			"<svg height='1' version='1.1' width='1' xmlns='http://www.w3.org/2000/svg'>" +
			"<defs><rect id='ref' x='10' y='20' width='100' height='60' r='10' rx='10' ry='10'></rect></defs>" +
			"<rect class='svg-by-class' x='10' y='20' width='100' height='60' r='10' rx='10' ry='10'></rect>" +
			"<rect id='svg-by-id' x='10' y='20' width='100' height='60' r='10' rx='10' ry='10'></rect>" +
			"<use id='use' xlink:href='#ref'></use>" +
			"</svg>"
		);

	jQuery("#qunit-fixture")
		.append( svg )
		.on( "click", "#svg-by-id", function() {
			ok( true, "delegated id selector" );
		})
		.on( "click", "[class~='svg-by-class']", function() {
			ok( true, "delegated class selector" );
		})
		.find( "#svg-by-id, [class~='svg-by-class']" )
			.trigger("click")
		.end();

	// Fire a native click on an SVGElementInstance (the instance tree of an SVG <use>)
	// to confirm that it doesn't break our event delegation handling (#13180)
	useElem = svg.find("#use")[0];
	if ( document.createEvent && useElem && useElem.instanceRoot ) {
		e = document.createEvent("MouseEvents");
		e.initEvent( "click", true, true );
		useElem.instanceRoot.dispatchEvent( e );
	}

	jQuery("#qunit-fixture").off("click");
});

test("Delegated events in forms (#10844; #11145; #8165; #11382, #11764)", function() {
	expect(5);

	// Alias names like "id" cause havoc
	var form = jQuery(
			"<form id='myform'>" +
				"<input type='text' name='id' value='secret agent man' />" +
			"</form>"
		)
		.on( "submit", function( event ) {
			event.preventDefault();
		})
		.appendTo("body");

	jQuery("body")
		.on( "submit", "#myform", function() {
			ok( true, "delegated id selector with aliased id" );
		})
		.find("#myform")
			.trigger("submit")
		.end()
		.off("submit");

	form.append("<input type='text' name='disabled' value='differently abled' />");
	jQuery("body")
		.on( "submit", "#myform", function() {
			ok( true, "delegated id selector with aliased disabled" );
		})
		.find("#myform")
			.trigger("submit")
		.end()
		.off("submit");

	form
		.append( "<button id='nestyDisabledBtn'><span>Zing</span></button>" )
		.on( "click", "#nestyDisabledBtn", function() {
			ok( true, "click on enabled/disabled button with nesty elements" );
		})
		.on( "mouseover", "#nestyDisabledBtn", function() {
			ok( true, "mouse on enabled/disabled button with nesty elements" );
		})
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
});

test("Submit event can be stopped (#11049)", function() {
	expect(1);

	// Since we manually bubble in IE, make sure inner handlers get a chance to cancel
	var form = jQuery(
			"<form id='myform'>" +
				"<input type='text' name='sue' value='bawls' />" +
				"<input type='submit' />" +
			"</form>"
		)
		.appendTo("body");

	jQuery( "body" )
		.on( "submit", function() {
			ok( true, "submit bubbled on first handler" );
			return false;
		})
		.find( "#myform input[type=submit]" )
			.each( function(){ this.click(); } )
		.end()
		.on( "submit", function() {
			ok( false, "submit bubbled on second handler" );
			return false;
		})
		.find( "#myform input[type=submit]" )
			.each( function(){
				jQuery( this.form ).on( "submit", function( e ) {
					e.preventDefault();
					e.stopPropagation();
				});
				this.click();
			})
		.end()
		.off( "submit" );

	form.remove();
});

// Test beforeunload event only if it supported (i.e. not Opera)
if ( window.onbeforeunload === null ) {
	asyncTest("on(beforeunload)", 1, function() {
		var iframe = jQuery(jQuery.parseHTML("<iframe src='data/event/onbeforeunload.html'><iframe>"));

		window.onmessage = function( event ) {
			var payload = JSON.parse( event.data );

			ok( payload.event, "beforeunload", "beforeunload event" );

			iframe.remove();
			window.onmessage = null;
			start();
		};

		iframe.appendTo("#qunit-fixture");
	});
}

test("jQuery.Event( type, props )", function() {

	expect(5);

	var event = jQuery.Event( "keydown", { keyCode: 64 }),
			handler = function( event ) {
				ok( "keyCode" in event, "Special property 'keyCode' exists" );
				equal( event.keyCode, 64, "event.keyCode has explicit value '64'" );
			};

	// Supports jQuery.Event implementation
	equal( event.type, "keydown", "Verify type" );

	// ensure "type" in props won't clobber the one set by constructor
	equal( jQuery.inArray("type", jQuery.event.props), -1, "'type' property not in props (#10375)" );

	ok( "keyCode" in event, "Special 'keyCode' property exists" );

	jQuery("body").on( "keydown", handler ).trigger( event );

	jQuery("body").off( "keydown" );

});

test("jQuery.Event properties", function(){
	expect(12);

	var handler,
		$structure = jQuery("<div id='ancestor'><p id='delegate'><span id='target'>shiny</span></p></div>"),
		$target = $structure.find("#target");

	handler = function( e ) {
		strictEqual( e.currentTarget, this, "currentTarget at " + this.id );
		equal( e.isTrigger, 3, "trigger at " + this.id );
	};
	$structure.one( "click", handler );
	$structure.one( "click", "p", handler );
	$target.one( "click", handler );
	$target[0].onclick = function( e ) {
		strictEqual( e.currentTarget, this, "currentTarget at target (native handler)" );
		equal( e.isTrigger, 3, "trigger at target (native handler)" );
	};
	$target.trigger("click");

	$target.one( "click", function( e ) {
		equal( e.isTrigger, 2, "triggerHandler at target" );
	});
	$target[0].onclick = function( e ) {
		equal( e.isTrigger, 2, "triggerHandler at target (native handler)" );
	};
	$target.triggerHandler("click");

	handler = function( e ) {
		strictEqual( e.isTrigger, undefined, "native event at " + this.id );
	};
	$target.one( "click", handler );
	$target[0].onclick = function( e ) {
		strictEqual( e.isTrigger, undefined, "native event at target (native handler)" );
	};
	fireNative( $target[0], "click" );
});

test(".on()/.off()", function() {
	expect(65);

	var event, clicked, hash, called, livec, lived, livee,
		submit = 0, div = 0, livea = 0, liveb = 0;

	jQuery("#body").on("submit", "#qunit-fixture div", function(){ submit++; return false; });
	jQuery("#body").on("click", "#qunit-fixture div", function(){ div++; });
	jQuery("#body").on("click", "div#nothiddendiv", function(){ livea++; });
	jQuery("#body").on("click", "div#nothiddendivchild", function(){ liveb++; });

	// Nothing should trigger on the body
	jQuery("body").trigger("click");
	equal( submit, 0, "Click on body" );
	equal( div, 0, "Click on body" );
	equal( livea, 0, "Click on body" );
	equal( liveb, 0, "Click on body" );

	// This should trigger two events
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("div#nothiddendiv").trigger("click");
	equal( submit, 0, "Click on div" );
	equal( div, 1, "Click on div" );
	equal( livea, 1, "Click on div" );
	equal( liveb, 0, "Click on div" );

	// This should trigger three events (w/ bubbling)
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("div#nothiddendivchild").trigger("click");
	equal( submit, 0, "Click on inner div" );
	equal( div, 2, "Click on inner div" );
	equal( livea, 1, "Click on inner div" );
	equal( liveb, 1, "Click on inner div" );

	// This should trigger one submit
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("div#nothiddendivchild").trigger("submit");
	equal( submit, 1, "Submit on div" );
	equal( div, 0, "Submit on div" );
	equal( livea, 0, "Submit on div" );
	equal( liveb, 0, "Submit on div" );

	// Make sure no other events were removed in the process
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("div#nothiddendivchild").trigger("click");
	equal( submit, 0, "off Click on inner div" );
	equal( div, 2, "off Click on inner div" );
	equal( livea, 1, "off Click on inner div" );
	equal( liveb, 1, "off Click on inner div" );

	// Now make sure that the removal works
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("#body").off("click", "div#nothiddendivchild");
	jQuery("div#nothiddendivchild").trigger("click");
	equal( submit, 0, "off Click on inner div" );
	equal( div, 2, "off Click on inner div" );
	equal( livea, 1, "off Click on inner div" );
	equal( liveb, 0, "off Click on inner div" );

	// Make sure that the click wasn't removed too early
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("div#nothiddendiv").trigger("click");
	equal( submit, 0, "off Click on inner div" );
	equal( div, 1, "off Click on inner div" );
	equal( livea, 1, "off Click on inner div" );
	equal( liveb, 0, "off Click on inner div" );

	// Make sure that stopPropagation doesn't stop live events
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("#body").on("click", "div#nothiddendivchild", function( e ){ liveb++; e.stopPropagation(); });
	jQuery("div#nothiddendivchild").trigger("click");
	equal( submit, 0, "stopPropagation Click on inner div" );
	equal( div, 1, "stopPropagation Click on inner div" );
	equal( livea, 0, "stopPropagation Click on inner div" );
	equal( liveb, 1, "stopPropagation Click on inner div" );

	// Make sure click events only fire with primary click
	submit = 0; div = 0; livea = 0; liveb = 0;
	event = jQuery.Event("click");
	event.button = 1;
	jQuery("div#nothiddendiv").trigger(event);

	equal( livea, 0, "on secondary click" );

	jQuery("#body").off("click", "div#nothiddendivchild");
	jQuery("#body").off("click", "div#nothiddendiv");
	jQuery("#body").off("click", "#qunit-fixture div");
	jQuery("#body").off("submit", "#qunit-fixture div");

	// Test binding with a different context
	clicked = 0;
	jQuery("#qunit-fixture").on("click", "#foo", function(){ clicked++; });
	jQuery("#qunit-fixture div").trigger("click");
	jQuery("#foo").trigger("click");
	jQuery("#qunit-fixture").trigger("click");
	jQuery("body").trigger("click");
	equal( clicked, 2, "on with a context" );

	// Test unbinding with a different context
	jQuery("#qunit-fixture").off("click", "#foo");
	jQuery("#foo").trigger("click");
	equal( clicked, 2, "off with a context");

	// Test binding with event data
	jQuery("#body").on("click", "#foo", true, function( e ){ equal( e.data, true, "on with event data" ); });
	jQuery("#foo").trigger("click");
	jQuery("#body").off("click", "#foo");

	// Test binding with trigger data
	jQuery("#body").on("click", "#foo", function(e, data){ equal( data, true, "on with trigger data" ); });
	jQuery("#foo").trigger("click", true);
	jQuery("#body").off("click", "#foo");

	// Test binding with different this object
	jQuery("#body").on("click", "#foo", jQuery.proxy(function(){ equal( this["foo"], "bar", "on with event scope" ); }, { "foo": "bar" }));
	jQuery("#foo").trigger("click");
	jQuery("#body").off("click", "#foo");

	// Test binding with different this object, event data, and trigger data
	jQuery("#body").on("click", "#foo", true, jQuery.proxy(function(e, data){
		equal( e.data, true, "on with with different this object, event data, and trigger data" );
		equal( this.foo, "bar", "on with with different this object, event data, and trigger data" );
		equal( data, true, "on with with different this object, event data, and trigger data");
	}, { "foo": "bar" }));
	jQuery("#foo").trigger("click", true);
	jQuery("#body").off("click", "#foo");

	// Verify that return false prevents default action
	jQuery("#body").on("click", "#anchor2", function(){ return false; });
	hash = window.location.hash;
	jQuery("#anchor2").trigger("click");
	equal( window.location.hash, hash, "return false worked" );
	jQuery("#body").off("click", "#anchor2");

	// Verify that .preventDefault() prevents default action
	jQuery("#body").on("click", "#anchor2", function(e){ e.preventDefault(); });
	hash = window.location.hash;
	jQuery("#anchor2").trigger("click");
	equal( window.location.hash, hash, "e.preventDefault() worked" );
	jQuery("#body").off("click", "#anchor2");

	// Test binding the same handler to multiple points
	called = 0;
	function callback(){ called++; return false; }

	jQuery("#body").on("click", "#nothiddendiv", callback);
	jQuery("#body").on("click", "#anchor2", callback);

	jQuery("#nothiddendiv").trigger("click");
	equal( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery("#anchor2").trigger("click");
	equal( called, 1, "Verify that only one click occurred." );

	// Make sure that only one callback is removed
	jQuery("#body").off("click", "#anchor2", callback);

	called = 0;
	jQuery("#nothiddendiv").trigger("click");
	equal( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery("#anchor2").trigger("click");
	equal( called, 0, "Verify that no click occurred." );

	// Make sure that it still works if the selector is the same,
	// but the event type is different
	jQuery("#body").on("foo", "#nothiddendiv", callback);

	// Cleanup
	jQuery("#body").off("click", "#nothiddendiv", callback);

	called = 0;
	jQuery("#nothiddendiv").trigger("click");
	equal( called, 0, "Verify that no click occurred." );

	called = 0;
	jQuery("#nothiddendiv").trigger("foo");
	equal( called, 1, "Verify that one foo occurred." );

	// Cleanup
	jQuery("#body").off("foo", "#nothiddendiv", callback);

	// Make sure we don't loose the target by DOM modifications
	// after the bubble already reached the liveHandler
	livec = 0;
	jQuery("#nothiddendivchild").html("<span></span>");

	jQuery("#body").on("click", "#nothiddendivchild", function(){ jQuery("#nothiddendivchild").html(""); });
	jQuery("#body").on("click", "#nothiddendivchild", function(e){ if(e.target) {livec++;} });

	jQuery("#nothiddendiv span").trigger("click");
	equal( jQuery("#nothiddendiv span").length, 0, "Verify that first handler occurred and modified the DOM." );
	equal( livec, 1, "Verify that second handler occurred even with nuked target." );

	// Cleanup
	jQuery("#body").off("click", "#nothiddendivchild");

	// Verify that .live() occurs and cancel bubble in the same order as
	// we would expect .on() and .click() without delegation
	lived = 0;
	livee = 0;

	// bind one pair in one order
	jQuery("#body").on("click", "span#liveSpan1 a", function(){ lived++; return false; });
	jQuery("#body").on("click", "span#liveSpan1", function(){ livee++; });

	jQuery("span#liveSpan1 a").trigger("click");
	equal( lived, 1, "Verify that only one first handler occurred." );
	equal( livee, 0, "Verify that second handler doesn't." );

	// and one pair in inverse
	jQuery("#body").on("click", "span#liveSpan2", function(){ livee++; });
	jQuery("#body").on("click", "span#liveSpan2 a", function(){ lived++; return false; });

	lived = 0;
	livee = 0;
	jQuery("span#liveSpan2 a").trigger("click");
	equal( lived, 1, "Verify that only one first handler occurred." );
	equal( livee, 0, "Verify that second handler doesn't." );

	// Cleanup
	jQuery("#body").off("click", "**");

	// Test this, target and currentTarget are correct
	jQuery("#body").on("click", "span#liveSpan1", function( e ) {
		equal( this.id, "liveSpan1", "Check the this within a on handler" );
		equal( e.currentTarget.id, "liveSpan1", "Check the event.currentTarget within a on handler" );
		equal( e.delegateTarget, document.body, "Check the event.delegateTarget within a on handler" );
		equal( e.target.nodeName.toUpperCase(), "A", "Check the event.target within a on handler" );
	});

	jQuery("span#liveSpan1 a").trigger("click");

	jQuery("#body").off("click", "span#liveSpan1");

	// Work with deep selectors
	livee = 0;

	function clickB() { livee++; }

	jQuery("#body").on("click", "#nothiddendiv div", function(){ livee++; });
	jQuery("#body").on("click", "#nothiddendiv div", clickB);
	jQuery("#body").on("mouseover", "#nothiddendiv div", function(){ livee++; });

	equal( livee, 0, "No clicks, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equal( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("mouseover");
	equal( livee, 1, "Mouseover, deep selector." );

	jQuery("#body").off("mouseover", "#nothiddendiv div");

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equal( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("mouseover");
	equal( livee, 0, "Mouseover, deep selector." );

	jQuery("#body").off("click", "#nothiddendiv div", clickB);

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equal( livee, 1, "Click, deep selector." );

	jQuery("#body").off("click", "#nothiddendiv div");
});

test("jQuery.off using dispatched jQuery.Event", function() {
	expect(1);

	var markup = jQuery("<p><a href='#'>target</a></p>"),
		count = 0;
	markup
		.on( "click.name", "a", function( event ) {
			equal( ++count, 1, "event called once before removal" );
			jQuery().off( event );
		})
		.find("a").trigger("click").trigger("click").end()
		.remove();
});

test( "delegated event with delegateTarget-relative selector", function() {
	expect(3);
	var markup = jQuery("<div><ul><li><a id=\"a0\"></a><ul id=\"ul0\"><li class=test><a id=\"a0_0\"></a></li><li><a id=\"a0_1\"></a></li></ul></li></ul></div>").appendTo("#qunit-fixture");

	// Non-positional selector (#12383)
	markup.find("#ul0")
		.on( "click", "div li a", function() {
			ok( false, "div is ABOVE the delegation point!" );
		})
		.on( "click", "ul a", function() {
			ok( false, "ul IS the delegation point!" );
		})
		.on( "click", "li.test a", function() {
			ok( true, "li.test is below the delegation point." );
		})
		.find("#a0_0").trigger("click").end()
		.off("click");

	// Positional selector (#11315)
	markup.find("ul").eq(0)
		.on( "click", ">li>a", function() {
			ok( this.id === "a0", "child li was clicked" );
		})
		.find("#ul0")
			.on( "click", "li:first>a", function() {
				ok( this.id === "a0_0" , "first li under #u10 was clicked" );
			})
		.end()
		.find("a").trigger("click").end()
		.find("#ul0").off();

	markup.remove();
});

test( "delegated event with selector matching Object.prototype property (#13203)", function() {
	expect(1);

	var matched = 0;

	jQuery("#foo").on( "click", "toString", function() {
		matched++;
	});

	jQuery("#anchor2").trigger("click");

	equal( matched, 0, "Nothing matched 'toString'" );
});

test("stopPropagation() stops directly-bound events on delegated target", function() {
	expect(1);

	var markup = jQuery("<div><p><a href=\"#\">target</a></p></div>");
	markup
		.on( "click", function() {
			ok( false, "directly-bound event on delegate target was called" );
		})
		.on( "click", "a", function( e ) {
			e.stopPropagation();
			ok( true, "delegated handler was called" );
		})
		.find("a").trigger("click").end()
		.remove();
});

test("off all bound delegated events", function(){
	expect(2);

	var count = 0,
		clicks = 0,
		div = jQuery("#body");

	div.on( "click submit", "div#nothiddendivchild", function(){ count++; } );
	div.on( "click", function(){ clicks++; } );
	div.off( undefined, "**" );

	jQuery("div#nothiddendivchild").trigger("click");
	jQuery("div#nothiddendivchild").trigger("submit");

	equal( count, 0, "Make sure no events were triggered." );

	div.trigger("click");
	equal( clicks, 2, "Make sure delegated and directly bound event occurred." );
	div.off("click");
});

test("on with multiple delegated events", function(){
	expect(1);

	var count = 0,
		div = jQuery("#body");

	div.on("click submit", "div#nothiddendivchild", function(){ count++; });

	jQuery("div#nothiddendivchild").trigger("click");
	jQuery("div#nothiddendivchild").trigger("submit");

	equal( count, 2, "Make sure both the click and submit were triggered." );

	jQuery("#body").off( undefined, "**" );
});

test("delegated on with change", function(){
	expect(8);

	var select, checkbox, checkboxFunction,
		text, textChange, oldTextVal,
		password, passwordChange, oldPasswordVal,
		selectChange = 0,
		checkboxChange = 0;

	select = jQuery("select[name='S1']");
	jQuery("#body").on("change", "select[name='S1']", function() {
		selectChange++;
	});

	checkbox = jQuery("#check2");
	checkboxFunction = function(){
		checkboxChange++;
	};
	jQuery("#body").on("change", "#check2", checkboxFunction);

	// test click on select

	// second click that changed it
	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equal( selectChange, 1, "Change on click." );

	// test keys on select
	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equal( selectChange, 1, "Change on keyup." );

	// test click on checkbox
	checkbox.trigger("change");
	equal( checkboxChange, 1, "Change on checkbox." );

	// test blur/focus on text
	text = jQuery("#name");
	textChange = 0;
	oldTextVal = text.val();

	jQuery("#body").on("change", "#name", function() {
		textChange++;
	});

	text.val(oldTextVal+"foo");
	text.trigger("change");
	equal( textChange, 1, "Change on text input." );

	text.val(oldTextVal);
	jQuery("#body").off("change", "#name");

	// test blur/focus on password
	password = jQuery("#name");
	passwordChange = 0;
	oldPasswordVal = password.val();
	jQuery("#body").on("change", "#name", function() {
		passwordChange++;
	});

	password.val(oldPasswordVal + "foo");
	password.trigger("change");
	equal( passwordChange, 1, "Change on password input." );

	password.val(oldPasswordVal);
	jQuery("#body").off("change", "#name");

	// make sure die works

	// die all changes
	selectChange = 0;
	jQuery("#body").off("change", "select[name='S1']");
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equal( selectChange, 0, "Die on click works." );

	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equal( selectChange, 0, "Die on keyup works." );

	// die specific checkbox
	jQuery("#body").off("change", "#check2", checkboxFunction);
	checkbox.trigger("change");
	equal( checkboxChange, 1, "Die on checkbox." );
});

test("delegated on with submit", function() {
	expect( 2 );

	var count1 = 0, count2 = 0;

	jQuery("#body").on("submit", "#testForm", function(ev) {
		count1++;
		ev.preventDefault();
	});

	jQuery(document).on("submit", "body", function(ev) {
		count2++;
		ev.preventDefault();
	});

	jQuery("#testForm input[name=sub1]").trigger("submit");
	equal( count1, 1, "Verify form submit." );
	equal( count2, 1, "Verify body submit." );

	jQuery("#body").off( undefined, "**" );
	jQuery(document).off( undefined, "**" );
});

test("delegated off() with only namespaces", function() {
	expect(2);

	var $delegate = jQuery("#liveHandlerOrder"),
		count = 0;

	$delegate.on("click.ns", "a", function() {
		count++;
	});

	jQuery("a", $delegate).eq(0).trigger("click.ns");

	equal( count, 1, "delegated click.ns");

	$delegate.off( ".ns", "**" );

	jQuery("a", $delegate).eq(1).trigger("click.ns");

	equal( count, 1, "no more .ns after off");
});

test("Non DOM element events", function() {
	expect(1);

	var o = {};

	jQuery(o).on("nonelementobj", function() {
		ok( true, "Event on non-DOM object triggered" );
	});

	jQuery(o).trigger("nonelementobj");
});

test("inline handler returning false stops default", function() {
	expect(1);

	var markup = jQuery("<div><a href=\"#\" onclick=\"return false\">x</a></div>");
	markup.on( "click", function(e) {
		ok( e.isDefaultPrevented(), "inline handler prevented default");
		return false;
	});
	markup.find("a").trigger("click");
	markup.off("click");
});

test("window resize", function() {
	expect(2);

	jQuery(window).off();

	jQuery(window).on( "resize", function(){
		ok( true, "Resize event fired." );
	}).trigger("resize").off("resize");

	ok( !jQuery._data(window, "events"), "Make sure all the events are gone." );
});

test("focusin bubbles", function() {
	expect(2);

	var input = jQuery( "<input type='text' />" ).prependTo( "body" ),
		order = 0;

	// focus the element so DOM focus won't fire
	input[0].focus();

	jQuery( "body" ).on( "focusin.focusinBubblesTest", function(){
		equal( 1, order++, "focusin on the body second" );
	});

	input.on( "focusin.focusinBubblesTest", function(){
		equal( 0, order++, "focusin on the element first" );
	});

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
});

test("custom events with colons (#3533, #8272)", function() {
	expect(1);

	var tab = jQuery("<table><tr><td>trigger</td></tr></table>").appendTo("body");
	try {
		tab.trigger("back:forth");
		ok( true, "colon events don't throw" );
	} catch ( e ) {
		ok( false, "colon events die" );
	}
	tab.remove();

});

test(".on and .off", function() {
	expect(9);
	var counter, mixfn, data,
		$onandoff = jQuery("<div id=\"onandoff\"><p>on<b>and</b>off</p><div>worked<em>or</em>borked?</div></div>").appendTo("body");

	// Simple case
	jQuery( "#onandoff" )
		.on( "whip", function() {
			ok( true, "whipped it good" );
		})
		.trigger( "whip" )
		.off();

	// Direct events only
	counter = 0;
	jQuery( "#onandoff b" )
		.on( "click", 5, function( e, trig ) {
			counter += e.data + (trig || 9);	// twice, 5+9+5+17=36
		})
		.one( "click", 7, function( e, trig ) {
			counter += e.data + (trig || 11);	// once, 7+11=18
		})
		.trigger("click")
		.trigger( "click", 17 )
		.off( "click" );
	equal( counter, 54, "direct event bindings with data" );

	// Delegated events only
	counter = 0;
	jQuery( "#onandoff" )
		.on( "click", "em", 5, function( e, trig ) {
			counter += e.data + (trig || 9);	// twice, 5+9+5+17=36
		})
		.one( "click", "em", 7, function( e, trig ) {
			counter += e.data + (trig || 11);	// once, 7+11=18
		})
		.find("em")
			.trigger("click")
			.trigger( "click", 17 )
		.end()
		.off( "click", "em" );
	equal( counter, 54, "delegated event bindings with data" );


	// Mixed event bindings and types
	counter = 0;
	mixfn = function(e, trig) {
		counter += (e.data || 0) + (trig || 1);
	};
	jQuery( "#onandoff" )
		.on( " click  clack cluck ", "em", 2, mixfn )
		.on( "cluck", "b", 7, mixfn )
		.on( "cluck", mixfn )
		.trigger( "what!" )
		.each( function() {
			equal( counter, 0, "nothing triggered yet" );
		})
		.find( "em" )
			.one( "cluck", 3, mixfn )
			.trigger( "cluck", 8 )			// 3+8 2+8 + 0+8 = 29
			.off()
			.trigger( "cluck", 9 )			// 2+9 + 0+9 = 20
		.end()
		.each( function() {
			equal( counter, 49, "after triggering em element" );
		})
		.off( "cluck", function(){} )		// shouldn't remove anything
		.trigger( "cluck", 2 )				// 0+2 = 2
		.each( function() {
			equal( counter, 51, "after triggering #onandoff cluck" );
		})
		.find( "b" )
			.on( "click", 95, mixfn )
			.on( "clack", "p", 97, mixfn )
			.one( "cluck", 3, mixfn )
			.trigger( "quack", 19 )			// 0
			.off( "click clack cluck" )
		.end()
		.each( function() {
			equal( counter, 51, "after triggering b" );
		})
		.trigger( "cluck", 3 )				// 0+3 = 3
		.off( "clack", "em", mixfn )
		.find( "em" )
			.trigger( "clack" )				// 0
		.end()
		.each( function() {
			equal( counter, 54, "final triggers" );
		})
		.off( "click cluck" );

	// We should have removed all the event handlers ... kinda hacky way to check this
	data = jQuery.data[ jQuery( "#onandoff" )[0].expando ] || {};
	equal( data["events"], undefined, "no events left" );

	$onandoff.remove();
});

test("special on name mapping", function() {
	expect( 7 );

	jQuery.event.special["slap"] = {
		bindType: "click",
		delegateType: "swing",
		handle: function( event ) {
			equal( event.handleObj.origType, "slap", "slapped your mammy, " + event.type );
		}
	};

	var comeback = function( event ) {
		ok( true, "event " + event.type + " triggered" );
	};

	jQuery("<div><button id=\"mammy\">Are We Not Men?</button></div>")
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
	delete jQuery.event.special["slap"];

	jQuery.event.special["gutfeeling"] = {
		bindType: "click",
		delegateType: "click",
		handle: function( event ) {
			equal( event.handleObj.origType, "gutfeeling", "got a gutfeeling" );
			// Need to call the handler since .one() uses it to unbind
			return event.handleObj.handler.call( this , event );
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

	delete jQuery.event.special["gutfeeling"];
});

test(".on and .off, selective mixed removal (#10705)", function() {
	expect(7);

	var timingx = function( e ) {
		ok( true, "triggered " + e.type );
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
});

test(".on( event-map, null-selector, data ) #11130", function() {

	expect( 1 );

	var $p = jQuery("<p>Strange Pursuit</p>"),
		data = "bar",
		map = {
			"foo": function( event ) {
				equal( event.data, "bar", "event.data correctly relayed with null selector" );
				$p.remove();
			}
		};

	$p.on( map, null, data ).trigger("foo");
});

test("clone() delegated events (#11076)", function() {
	expect(3);

	var counter = { "center": 0, "fold": 0, "centerfold": 0 },
		clicked = function() {
			counter[ jQuery(this).text().replace(/\s+/, "") ]++;
		},
		table =
			jQuery( "<table><tr><td>center</td><td>fold</td></tr></table>" )
			.on( "click", "tr", clicked )
			.on( "click", "td:first-child", clicked )
			.on( "click", "td:last-child", clicked ),
		clone = table.clone( true );

	clone.find("td").trigger("click");
	equal( counter["center"], 1, "first child" );
	equal( counter["fold"], 1, "last child" );
	equal( counter["centerfold"], 2, "all children" );

	table.remove();
	clone.remove();
});

test("checkbox state (#3827)", function() {
	expect( 9 );

	var markup = jQuery("<div><input type=checkbox><div>").appendTo("#qunit-fixture"),
		cb = markup.find("input")[0];

	jQuery(cb).on( "click", function(){
		equal( this.checked, false, "just-clicked checkbox is not checked" );
	});
	markup.on( "click", function(){
		equal( cb.checked, false, "checkbox is not checked in bubbled event" );
	});

	// Native click
	cb.checked = true;
	equal( cb.checked, true, "native - checkbox is initially checked" );
	cb.click();
	equal( cb.checked, false, "native - checkbox is no longer checked" );

	// jQuery click
	cb.checked = true;
	equal( cb.checked, true, "jQuery - checkbox is initially checked" );
	jQuery( cb ).trigger("click");
	equal( cb.checked, false, "jQuery - checkbox is no longer checked" );

	// Handlers only; checkbox state remains false
	jQuery( cb ).triggerHandler( "click" );
});

test("focus-blur order (#12868)", function() {
	expect( 5 );

	var order,
		$text = jQuery("#text1"),
		$radio = jQuery("#radio1").trigger("focus");

	// IE6-10 fire focus/blur events asynchronously; this is the resulting mess.
	// IE's browser window must be topmost for this to work properly!!
	stop();
	$radio[0].focus();

	setTimeout( function() {

		$text
			.on( "focus", function(){
				equal( order++, 1, "text focus" );
			})
			.on( "blur", function(){
				equal( order++, 0, "text blur" );
			});
		$radio
			.on( "focus", function(){
				equal( order++, 1, "radio focus" );
			})
			.on( "blur", function(){
				equal( order++, 0, "radio blur" );
			});

		// Enabled input getting focus
		order = 0;
		equal( document.activeElement, $radio[0], "radio has focus" );
		$text.trigger("focus");
		setTimeout( function() {
			equal( document.activeElement, $text[0], "text has focus" );

			// Run handlers without native method on an input
			order = 1;
			$radio.triggerHandler( "focus" );
			start();
		}, 50 );
	}, 50 );
});

test("hover event no longer special since 1.9", function() {
	expect( 1 );

	jQuery("<div>craft</div>")
		.on( "hover", function( e ) {
			equal( e.type, "hover", "I am hovering!" );
		})
		.trigger("hover")
		.off("hover");
});

test("fixHooks extensions", function() {
	expect( 2 );

	// IE requires focusable elements to be visible, so append to body
	var $fixture = jQuery( "<input type='text' id='hook-fixture' />" ).appendTo( "body" ),
		saved = jQuery.event.fixHooks.click;

	// Ensure the property doesn't exist
	$fixture.on( "click", function( event ) {
		ok( !("blurrinessLevel" in event), "event.blurrinessLevel does not exist" );
	});
	fireNative( $fixture[0], "click" );
	$fixture.off( "click" );

	jQuery.event.fixHooks.click = {
		filter: function( event ) {
			event.blurrinessLevel = 42;
			return event;
		}
	};

	// Trigger a native click and ensure the property is set
	$fixture.on( "click", function( event ) {
		equal( event.blurrinessLevel, 42, "event.blurrinessLevel was set" );
	});
	fireNative( $fixture[0], "click" );

	delete jQuery.event.fixHooks.click;
	$fixture.off( "click" ).remove();
	jQuery.event.fixHooks.click = saved;
});

testIframeWithCallback( "jQuery.ready promise", "event/promiseReady.html", function( isOk ) {
	expect(1);
	ok( isOk, "$.when( $.ready ) works" );
});

testIframeWithCallback( "Focusing iframe element", "event/focusElem.html", function( isOk ) {
	expect(1);
	ok( isOk, "Focused an element in an iframe" );
});

// need PHP here to make the incepted IFRAME hang
if ( hasPHP ) {
	testIframeWithCallback( "jQuery.ready synchronous load with long loading subresources", "event/syncReady.html", function( isOk ) {
		expect(1);
		ok( isOk, "jQuery loaded synchronously fires ready when the DOM can truly be interacted with" );
	});
}

(function(){
	// This code must be run before DOM ready!
	var notYetReady, noEarlyExecution,
		order = [],
		args = {};

	notYetReady = !jQuery.isReady;

	test("jQuery.isReady", function() {
		expect(2);

		equal(notYetReady, true, "jQuery.isReady should not be true before DOM ready");
		equal(jQuery.isReady, true, "jQuery.isReady should be true once DOM is ready");
	});

	// Create an event handler.
	function makeHandler( testId ) {
		// When returned function is executed, push testId onto `order` array
		// to ensure execution order. Also, store event handler arg to ensure
		// the correct arg is being passed into the event handler.
		return function( arg ) {
			order.push(testId);
			args[testId] = arg;
		};
	}

	// Bind to the ready event in every possible way.
	jQuery(makeHandler("a"));
	jQuery(document).ready(makeHandler("b"));
	jQuery(document).on("ready.readytest", makeHandler("c"));

	// Do it twice, just to be sure.
	jQuery(makeHandler("d"));
	jQuery(document).ready(makeHandler("e"));
	jQuery(document).on("ready.readytest", makeHandler("f"));

	noEarlyExecution = order.length === 0;

	// This assumes that QUnit tests are run on DOM ready!
	test("jQuery ready", function() {
		expect(10);

		ok(noEarlyExecution, "Handlers bound to DOM ready should not execute before DOM ready");

		// Ensure execution order.
		deepEqual(order, ["a", "b", "d", "e", "c", "f"], "Bound DOM ready handlers should execute in on-order, but those bound with jQuery(document).on( 'ready', fn ) will always execute last");

		// Ensure handler argument is correct.
		equal(args["a"], jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery");
		equal(args["b"], jQuery, "Argument passed to fn in jQuery(document).ready( fn ) should be jQuery");
		ok(args["c"] instanceof jQuery.Event, "Argument passed to fn in jQuery(document).on( 'ready', fn ) should be an event object");

		order = [];

		// Now that the ready event has fired, again bind to the ready event
		// in every possible way. These event handlers should execute immediately.
		jQuery(makeHandler("g"));
		equal(order.pop(), "g", "Event handler should execute immediately");
		equal(args["g"], jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery");

		jQuery(document).ready(makeHandler("h"));
		equal(order.pop(), "h", "Event handler should execute immediately");
		equal(args["h"], jQuery, "Argument passed to fn in jQuery(document).ready( fn ) should be jQuery");

		jQuery(document).on("ready.readytest", makeHandler("never"));
		equal(order.length, 0, "Event handler should never execute since DOM ready has already passed");

		// Cleanup.
		jQuery(document).off("ready.readytest");
	});

})();

test("change handler should be detached from element", function() {
	expect( 2 );

	var $fixture = jQuery( "<input type='text' id='change-ie-leak' />" ).appendTo( "body" ),
		originRemoveEvent = jQuery.removeEvent,
		wrapperRemoveEvent =  function(elem, type, handle){
			equal("change", type, "Event handler for 'change' event should be removed");
			equal("change-ie-leak", jQuery(elem).attr("id"), "Event handler for 'change' event should be removed from appropriate element");
			originRemoveEvent(elem, type, handle);
		};

	jQuery.removeEvent = wrapperRemoveEvent ;

	$fixture.on( "change", function() {});
	$fixture.off( "change" );

	$fixture.remove();

	jQuery.removeEvent = originRemoveEvent;
});

asyncTest("trigger click on checkbox, fires change event", function() {
	expect(1);

	var check = jQuery("#check2");

	check.on( "change", function() {
		// get it?
		check.off("change");
		ok( true, "Change event fired as a result of triggered click" );
		start();
	}).trigger("click");
});

test( "Namespace preserved when passed an Event (#12739)", function() {
	expect( 4 );

	var markup = jQuery(
			"<div id='parent'><div id='child'></div></div>"
		),
		triggered = 0,
		fooEvent;

	markup.find("div")
		.addBack()
		.on( "foo.bar", function( e ) {
			if ( !e.handled ) {
				triggered++;
				e.handled = true;
				equal( e.namespace, "bar", "namespace is bar" );
				jQuery( e.target ).find("div").each(function() {
					jQuery( this ).triggerHandler( e );
				});
			}
		})
		.on( "foo.bar2", function() {
			ok( false, "foo.bar2 called on trigger " + triggered + " id " + this.id );
		});

	markup.trigger("foo.bar");
	markup.trigger( jQuery.Event("foo.bar") );
	fooEvent = jQuery.Event("foo");
	fooEvent.namespace = "bar";
	markup.trigger( fooEvent );
	markup.remove();

	equal( triggered, 3, "foo.bar triggered" );
});

test( "make sure events cloned correctly", 18, function() {
	var clone,
		fixture = jQuery("#qunit-fixture"),
		checkbox = jQuery("#check1"),
		p = jQuery("#firstp");

	fixture.on( "click change", function( event, result ) {
		ok( result,  event.type + " on original element is fired" );

	}).on( "click", "#firstp", function( event, result ) {
		ok( result, "Click on original child element though delegation is fired" );

	}).on( "change", "#check1", function( event, result ) {
		ok( result, "Change on original child element though delegation is fired" );
	});

	p.on("click", function() {
		ok( true, "Click on original child element is fired" );
	});

	checkbox.on("change", function() {
		ok( true, "Change on original child element is fired" );
	});

	fixture.clone().trigger("click").trigger("change"); // 0 events should be fired

	clone = fixture.clone( true );

	clone.find("p").eq(0).trigger( "click", true ); // 3 events should fire
	clone.find("#check1").trigger( "change", true ); // 3 events should fire
	clone.remove();

	clone = fixture.clone( true, true );
	clone.find("p").eq(0).trigger( "click", true ); // 3 events should fire
	clone.find("#check1").trigger( "change", true ); // 3 events should fire

	fixture.off();
	p.off();
	checkbox.off();

	p.trigger("click"); // 0 should be fired
	checkbox.trigger("change"); // 0 should be fired

	clone.find("p").eq(0).trigger( "click", true );  // 3 events should fire
	clone.find("#check1").trigger( "change", true ); // 3 events should fire
	clone.remove();

	clone.find("p").eq(0).trigger("click");  // 0 should be fired
	clone.find("#check1").trigger("change"); // 0 events should fire
});

test( "Check order of focusin/focusout events", 2, function() {
	var focus, blur,
		input = jQuery("#name");

	input.on("focus", function() {
		focus = true;

	}).on("focusin", function() {
		ok( !focus, "Focusin event should fire before focus does" );

	}).on("blur", function() {
		blur = true;

	}).on("focusout", function() {
		ok( !blur, "Focusout event should fire before blur does" );
	});

	// gain focus
	input.trigger("focus");

	// then lose it
	jQuery("#search").trigger("focus");

	// cleanup
	input.off();
});

test( "String.prototype.namespace does not cause trigger() to throw (#13360)", function() {
	expect( 1 );
	var errored = false;

	String.prototype.namespace = function() {};

	try {
		jQuery("<p>").trigger("foo.bar");
	} catch( e ) {
		errored = true;
	}
	equal( errored, false, "trigger() did not throw exception" );
	delete String.prototype.namespace;
});
