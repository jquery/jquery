module("event", { teardown: moduleTeardown });

test("null or undefined handler", function() {
	expect(2);
	// Supports Fixes bug #7229
	try {
		jQuery("#firstp").click(null);
		ok(true, "Passing a null handler will not throw an exception");
	} catch (e) {}

	try {
		jQuery("#firstp").click(undefined);
		ok(true, "Passing an undefined handler will not throw an exception");
	} catch (e) {}
});

test("bind(),live(),delegate() with non-null,defined data", function() {

	expect(3);

	var handler = function( event, data ) {
		equal( data, 0, "non-null, defined data (zero) is correctly passed" );
	};

	jQuery("#foo").bind("foo", handler);
	jQuery("#foo").live("foo", handler);
	jQuery("div").delegate("#foo", "foo", handler);

	jQuery("#foo").trigger("foo", 0);

	jQuery("#foo").unbind("foo", handler);
	jQuery("#foo").die("foo", handler);
	jQuery("div").undelegate("#foo", "foo");

});

test("Handler changes and .trigger() order", function() {
	expect(1);

	var markup = jQuery(
		"<div><div><p><span><b class=\"a\">b</b></span></p></div></div>"
	),
	path = "";

	markup
		.find( "*" ).andSelf().on( "click", function( e ) {
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

test("bind(), with data", function() {
	expect(4);
	var handler = function(event) {
		ok( event.data, "bind() with data, check passed data exists" );
		equal( event.data["foo"], "bar", "bind() with data, Check value of passed data" );
	};
	jQuery("#firstp").bind("click", {"foo": "bar"}, handler).click().unbind("click", handler);

	ok( !jQuery._data(jQuery("#firstp")[0], "events"), "Event handler unbound when using data." );

	var test = function(){};
	var handler2 = function(event) {
		equal( event.data, test, "bind() with function data, Check value of passed data" );
	};
	jQuery("#firstp").bind("click", test, handler2).click().unbind("click", handler2);
});

test("click(), with data", function() {
	expect(3);
	var handler = function(event) {
		ok( event.data, "bind() with data, check passed data exists" );
		equal( event.data["foo"], "bar", "bind() with data, Check value of passed data" );
	};
	jQuery("#firstp").click({"foo": "bar"}, handler).click().unbind("click", handler);

	ok( !jQuery._data(jQuery("#firstp")[0], "events"), "Event handler unbound when using data." );
});

test("bind(), with data, trigger with data", function() {
	expect(4);
	var handler = function(event, data) {
		ok( event.data, "check passed data exists" );
		equal( event.data.foo, "bar", "Check value of passed data" );
		ok( data, "Check trigger data" );
		equal( data.bar, "foo", "Check value of trigger data" );
	};
	jQuery("#firstp").bind("click", {foo: "bar"}, handler).trigger("click", [{bar: "foo"}]).unbind("click", handler);
});

test("bind(), multiple events at once", function() {
	expect(2);
	var clickCounter = 0,
		mouseoverCounter = 0;
	var handler = function(event) {
		if (event.type == "click") {
			clickCounter += 1;
		}
		else if (event.type == "mouseover") {
			mouseoverCounter += 1;
		}

	};
	jQuery("#firstp").bind("click mouseover", handler).trigger("click").trigger("mouseover");
	equal( clickCounter, 1, "bind() with multiple events at once" );
	equal( mouseoverCounter, 1, "bind() with multiple events at once" );
});

test("bind(), five events at once", function() {
	expect(1);

	var count = 0,
		handler = function(event) {
			count++;
		};

	jQuery("#firstp").bind("click mouseover foo bar baz", handler)
	.trigger("click").trigger("mouseover")
		.trigger("foo").trigger("bar")
		.trigger("baz");

	equal( count, 5, "bind() five events at once" );
});

test("bind(), multiple events at once and namespaces", function() {
	expect(7);

	var cur, obj = {};

	var div = jQuery("<div/>").bind("focusin.a", function(e) {
		equal( e.type, cur, "Verify right single event was fired." );
	});

	cur = "focusin";
	div.trigger("focusin.a");

	// manually clean up detached elements
	div.remove();

	div = jQuery("<div/>").bind("click mouseover", obj, function(e) {
		equal( e.type, cur, "Verify right multi event was fired." );
		equal( e.data, obj, "Make sure the data came in correctly." );
	});

	cur = "click";
	div.trigger("click");

	cur = "mouseover";
	div.trigger("mouseover");

	// manually clean up detached elements
	div.remove();

	div = jQuery("<div/>").bind("focusin.a focusout.b", function(e) {
		equal( e.type, cur, "Verify right multi event was fired." );
	});

	cur = "focusin";
	div.trigger("focusin.a");

	cur = "focusout";
	div.trigger("focusout.b");

	// manually clean up detached elements
	div.remove();
});

test("bind(), namespace with special add", function() {
	expect(27);

	var div = jQuery("<div/>").bind("test", function(e) {
		ok( true, "Test event fired." );
	});

	var i = 0;

	jQuery.event.special["test"] = {
		_default: function(e, data) {
			equal( this, document, "Make sure we're at the top of the chain." );
			equal( e.type, "test", "And that we're still dealing with a test event." );
			equal( e.target, div[0], "And that the target is correct." );
			ok( data !== undefined , "And that trigger data was passed." );
		},
		setup: function(){},
		teardown: function(){
			ok(true, "Teardown called.");
		},
		add: function( handleObj ) {
			var handler = handleObj.handler;
			handleObj.handler = function(e) {
				e.xyz = ++i;
				handler.apply( this, arguments );
			};
		},
		remove: function() {
			ok(true, "Remove called.");
		}
	};

	div.bind("test.a", {"x": 1}, function(e) {
		ok( !!e.xyz, "Make sure that the data is getting passed through." );
		equal( e.data["x"], 1, "Make sure data is attached properly." );
	});

	div.bind("test.b", {"x": 2}, function(e) {
		ok( !!e.xyz, "Make sure that the data is getting passed through." );
		equal( e.data["x"], 2, "Make sure data is attached properly." );
	});

	// Should trigger 5
	div.trigger("test", 33.33);

	// Should trigger 2
	div.trigger("test.a", "George Harrison");

	// Should trigger 2
	div.trigger("test.b", { year: 1982 });

	// Should trigger 4
	div.unbind("test");

	div = jQuery("<div/>").bind("test", function(e) {
		ok( true, "Test event fired." );
	});

	// Should trigger 2
	div.appendTo("#qunit-fixture").remove();

	delete jQuery.event.special["test"];
});

test("bind(), no data", function() {
	expect(1);
	var handler = function(event) {
		ok ( !event.data, "Check that no data is added to the event object" );
	};
	jQuery("#firstp").bind("click", handler).trigger("click");
});

test("bind/one/unbind(Object)", function(){
	expect(6);

	var clickCounter = 0, mouseoverCounter = 0;
	function handler(event) {
		if (event.type == "click") {

			clickCounter++;
		}
		else if (event.type == "mouseover") {
			mouseoverCounter++;
		}

	}

	function handlerWithData(event) {
		if (event.type == "click") {
			clickCounter += event.data;
		}
		else if (event.type == "mouseover") {
			mouseoverCounter += event.data;
		}
	}

	function trigger(){
		$elem.trigger("click").trigger("mouseover");
	}

	var $elem = jQuery("#firstp")
		// Regular bind
		.bind({
			"click":handler,
			"mouseover":handler
		})
		// Bind with data
		.one({
			"click":handlerWithData,
			"mouseover":handlerWithData
		}, 2 );

	trigger();

	equal( clickCounter, 3, "bind(Object)" );
	equal( mouseoverCounter, 3, "bind(Object)" );

	trigger();
	equal( clickCounter, 4, "bind(Object)" );
	equal( mouseoverCounter, 4, "bind(Object)" );

	jQuery("#firstp").unbind({
		"click":handler,
		"mouseover":handler
	});

	trigger();
	equal( clickCounter, 4, "bind(Object)" );
	equal( mouseoverCounter, 4, "bind(Object)" );
});

test("live/die(Object), delegate/undelegate(String, Object)", function() {
	expect(6);

	var clickCounter = 0, mouseoverCounter = 0,
		$p = jQuery("#firstp"), $a = $p.find("a:first");

	var events = {
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

	$a.live( events );
	$p.delegate( "a", events, 2 );

	trigger();
	equal( clickCounter, 3, "live/delegate" );
	equal( mouseoverCounter, 3, "live/delegate" );

	$p.undelegate( "a", events );

	trigger();
	equal( clickCounter, 4, "undelegate" );
	equal( mouseoverCounter, 4, "undelegate" );

	$a.die( events );

	trigger();
	equal( clickCounter, 4, "die" );
	equal( mouseoverCounter, 4, "die" );
});

test("live/delegate immediate propagation", function() {
	expect(2);

	var $p = jQuery("#firstp"), $a = $p.find("a:first"), lastClick;

	lastClick = "";
	$a.live( "click", function(e) {
		lastClick = "click1";
		e.stopImmediatePropagation();
	});
	$a.live( "click", function(e) {
		lastClick = "click2";
	});
	$a.trigger( "click" );
	equal( lastClick, "click1", "live stopImmediatePropagation" );
	$a.die( "click" );

	lastClick = "";
	$p.delegate( "a", "click", function(e) {
		lastClick = "click1";
		e.stopImmediatePropagation();
	});
	$p.delegate( "a", "click", function(e) {
		lastClick = "click2";
	});
	$a.trigger( "click" );
	equal( lastClick, "click1", "delegate stopImmediatePropagation" );
	$p.undelegate( "click" );
});

test("bind/delegate bubbling, isDefaultPrevented", function() {
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
	$anchor2.click(function(e) {
		e.preventDefault();
	});
	$main.delegate("#foo", "click", function(e) {
		var orig = e.originalEvent;

		if ( typeof(orig.defaultPrevented) === "boolean" || typeof(orig.returnValue) === "boolean" || orig["getPreventDefault"] ) {
			equal( e.isDefaultPrevented(), true, "isDefaultPrevented true passed to bubbled event" );

		} else {
			// Opera < 11 doesn't implement any interface we can use, so give it a pass
			ok( true, "isDefaultPrevented not supported by this browser, test skipped" );
		}
	});
	fakeClick( $anchor2 );
	$anchor2.unbind( "click" );
	$main.undelegate( "click" );
	$anchor2.click(function(e) {
		// Let the default action occur
	});
	$main.delegate("#foo", "click", function(e) {
		equal( e.isDefaultPrevented(), false, "isDefaultPrevented false passed to bubbled event" );
	});
	fakeClick( $anchor2 );
	$anchor2.unbind( "click" );
	$main.undelegate( "click" );
});

test("bind(), iframes", function() {
	// events don't work with iframes, see #939 - this test fails in IE because of contentDocument
	var doc = jQuery("#loadediframe").contents();

	jQuery("div", doc).bind("click", function() {
		ok( true, "Binding to element inside iframe" );
	}).click().unbind("click");
});

test("bind(), trigger change on select", function() {
	expect(5);
	var counter = 0;
	function selectOnChange(event) {
		equal( event.data, counter++, "Event.data is not a global event object" );
	}
	jQuery("#form select").each(function(i){
		jQuery(this).bind("change", i, selectOnChange);
	}).trigger("change");
});

test("bind(), namespaced events, cloned events", 18, function() {
	var firstp = jQuery( "#firstp" );

	firstp.bind("custom.test",function(e){
		ok(false, "Custom event triggered");
	});

	firstp.bind("click",function(e){
		ok(true, "Normal click triggered");
		equal( e.type + e.namespace, "click", "Check that only click events trigger this fn" );
	});

	firstp.bind("click.test",function(e){
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
	firstp.unbind("click.test");

	// Trigger the remaining fn (4)
	firstp.trigger("click");

	// Remove the remaining namespaced fn
	firstp.unbind(".test");

	// Try triggering the custom event (0)
	firstp.trigger("custom");

	// using contents will get comments regular, text, and comment nodes
	jQuery("#nonnodes").contents().bind("tester", function () {
		equal(this.nodeType, 1, "Check node,textnode,comment bind just does real nodes" );
	}).trigger("tester");

	// Make sure events stick with appendTo'd elements (which are cloned) #2027
	jQuery("<a href='#fail' class='test'>test</a>").click(function(){ return false; }).appendTo("#qunit-fixture");
	ok( jQuery("a.test:first").triggerHandler("click") === false, "Handler is bound to appendTo'd elements" );
});

test("bind(), multi-namespaced events", function() {
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
		deepEqual(name, order.shift(), msg);
	}

	jQuery("#firstp").bind("custom.test",function(e){
		check("custom.test", "Custom event triggered");
	});

	jQuery("#firstp").bind("custom.test2",function(e){
		check("custom.test2", "Custom event triggered");
	});

	jQuery("#firstp").bind("click.test",function(e){
		check("click.test", "Normal click triggered");
	});

	jQuery("#firstp").bind("click.test.abc",function(e){
		check("click.test.abc", "Namespaced click triggered");
	});

	// Those would not trigger/unbind (#5303)
	jQuery("#firstp").trigger("click.a.test");
	jQuery("#firstp").unbind("click.a.test");

	// Trigger both bound fn (1)
	jQuery("#firstp").trigger("click.test.abc");

	// Trigger one bound fn (1)
	jQuery("#firstp").trigger("click.abc");

	// Trigger two bound fn (2)
	jQuery("#firstp").trigger("click.test");

	// Remove only the one fn
	jQuery("#firstp").unbind("click.abc");

	// Trigger the remaining fn (1)
	jQuery("#firstp").trigger("click");

	// Remove the remaining fn
	jQuery("#firstp").unbind(".test");

	// Trigger the remaining fn (1)
	jQuery("#firstp").trigger("custom");
});

test("bind(), with same function", function() {
	expect(2);

	var count = 0, func = function(){
		count++;
	};

	jQuery("#liveHandlerOrder").bind("foo.bar", func).bind("foo.zar", func);
	jQuery("#liveHandlerOrder").trigger("foo.bar");

	equal(count, 1, "Verify binding function with multiple namespaces." );

	jQuery("#liveHandlerOrder").unbind("foo.bar", func).unbind("foo.zar", func);
	jQuery("#liveHandlerOrder").trigger("foo.bar");

	equal(count, 1, "Verify that removing events still work." );
});

test("bind(), make sure order is maintained", function() {
	expect(1);

	var elem = jQuery("#firstp"), log = [], check = [];

	jQuery.each( new Array(100), function( i ) {
		elem.bind( "click", function(){
			log.push( i );
		});

		check.push( i );

	});

	elem.trigger("click");

	equal( log.join(","), check.join(","), "Make sure order was maintained." );

	elem.unbind("click");
});

test("bind(), with different this object", function() {
	expect(4);
	var thisObject = { myThis: true },
		data = { myData: true },
		handler1 = function( event ) {
			equal( this, thisObject, "bind() with different this object" );
		},
		handler2 = function( event ) {
			equal( this, thisObject, "bind() with different this object and data" );
			equal( event.data, data, "bind() with different this object and data" );
		};

	jQuery("#firstp")
		.bind("click", jQuery.proxy(handler1, thisObject)).click().unbind("click", handler1)
		.bind("click", data, jQuery.proxy(handler2, thisObject)).click().unbind("click", handler2);

	ok( !jQuery._data(jQuery("#firstp")[0], "events"), "Event handler unbound when using different this object and data." );
});

test("bind(name, false), unbind(name, false)", function() {
	expect(3);

	var main = 0;
	jQuery("#qunit-fixture").bind("click", function(e){ main++; });
	jQuery("#ap").trigger("click");
	equal( main, 1, "Verify that the trigger happened correctly." );

	main = 0;
	jQuery("#ap").bind("click", false);
	jQuery("#ap").trigger("click");
	equal( main, 0, "Verify that no bubble happened." );

	main = 0;
	jQuery("#ap").unbind("click", false);
	jQuery("#ap").trigger("click");
	equal( main, 1, "Verify that the trigger happened correctly." );

	// manually clean up events from elements outside the fixture
	jQuery("#qunit-fixture").unbind("click");
});

test("live(name, false), die(name, false)", function() {
	expect(3);

	var main = 0;
	jQuery("#qunit-fixture").live("click", function(e){ main++; });
	jQuery("#ap").trigger("click");
	equal( main, 1, "Verify that the trigger happened correctly." );

	main = 0;
	jQuery("#ap").live("click", false);
	jQuery("#ap").trigger("click");
	equal( main, 0, "Verify that no bubble happened." );

	main = 0;
	jQuery("#ap").die("click", false);
	jQuery("#ap").trigger("click");
	equal( main, 1, "Verify that the trigger happened correctly." );
	jQuery("#qunit-fixture").die("click");
});

test("delegate(selector, name, false), undelegate(selector, name, false)", function() {
	expect(3);

	var main = 0;

	jQuery("#qunit-fixture").delegate("#ap", "click", function(e){ main++; });
	jQuery("#ap").trigger("click");
	equal( main, 1, "Verify that the trigger happened correctly." );

	main = 0;
	jQuery("#ap").delegate("#groups", "click", false);
	jQuery("#groups").trigger("click");
	equal( main, 0, "Verify that no bubble happened." );

	main = 0;
	jQuery("#ap").undelegate("#groups", "click", false);
	jQuery("#groups").trigger("click");
	equal( main, 1, "Verify that the trigger happened correctly." );
	jQuery("#qunit-fixture").undelegate("#ap", "click");
});

test("bind()/trigger()/unbind() on plain object", function() {
	expect( 7 );

	var obj = {};

	// Make sure it doesn't complain when no events are found
	jQuery(obj).trigger("test");

	// Make sure it doesn't complain when no events are found
	jQuery(obj).unbind("test");

	jQuery(obj).bind({
		"test": function() {
			ok( true, "Custom event run." );
		},
		"submit": function() {
			ok( true, "Custom submit event run." );
		}
	});

	var events = jQuery._data(obj, "events");
	ok( events, "Object has events bound." );
	equal( obj["events"], undefined, "Events object on plain objects is not events" );
	equal( obj["test"], undefined, "Make sure that test event is not on the plain object." );
	equal( obj["handle"], undefined, "Make sure that the event handler is not on the plain object." );

	// Should trigger 1
	jQuery(obj).trigger("test");
	jQuery(obj).trigger("submit");

	jQuery(obj).unbind("test");
	jQuery(obj).unbind("submit");

	// Should trigger 0
	jQuery(obj).trigger("test");

	// Make sure it doesn't complain when no events are found
	jQuery(obj).unbind("test");

	equal( obj && obj[ jQuery.expando ] &&
			obj[ jQuery.expando ][ jQuery.expando ] &&
			obj[ jQuery.expando ][ jQuery.expando ]["events"], undefined, "Make sure events object is removed" );
});

test("unbind(type)", function() {
	expect( 1 );

	var $elem = jQuery("#firstp"),
		message;

	function error(){
		ok( false, message );
	}

	message = "unbind passing function";
	$elem.bind("error1", error).unbind("error1", error).triggerHandler("error1");

	message = "unbind all from event";
	$elem.bind("error1", error).unbind("error1").triggerHandler("error1");

	message = "unbind all";
	$elem.bind("error1", error).unbind().triggerHandler("error1");

	message = "unbind many with function";
	$elem.bind("error1 error2",error)
		.unbind("error1 error2", error )
		.trigger("error1").triggerHandler("error2");

	message = "unbind many"; // #3538
	$elem.bind("error1 error2", error)
		.unbind("error1 error2")
		.trigger("error1").triggerHandler("error2");

	message = "unbind without a type or handler";
	$elem.bind("error1 error2.test",error)
		.unbind()
		.trigger("error1").triggerHandler("error2");

	// Should only unbind the specified function
	jQuery( document ).bind( "click", function(){
		ok( true, "called handler after selective removal");
	});
	var func = function(){ };
	jQuery( document )
		.bind( "click", func )
		.unbind( "click", func )
		.click()
		.unbind( "click" );
});

test("unbind(eventObject)", function() {
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
		.bind("foo", function(){
			num += 1;
		})
		.bind("foo", function(e){
			$elem.unbind( e );
			num += 2;
		})
		// Neither this one
		.bind("bar", function(){
			num += 4;
		});

	assert( 7 );
	assert( 5 );

	$elem.unbind("bar");
	assert( 1 );

	$elem.unbind();
	assert( 0 );
});

test("hover() and hover pseudo-event", function() {
	expect(3);

	var times = 0,
		handler1 = function( event ) { ++times; },
		handler2 = function( event ) { ++times; };

	jQuery("#firstp")
		.hover(handler1, handler2)
		.mouseenter().mouseleave()
		.unbind("mouseenter", handler1)
		.unbind("mouseleave", handler2)
		.hover(handler1)
		.mouseenter().mouseleave()
		.unbind("mouseenter mouseleave", handler1)
		.mouseenter().mouseleave();

	equal( times, 4, "hover handlers fired" );

	var balance = 0;
	jQuery( "#firstp" )
		.on( "hovercraft", function() {
			ok( false, "hovercraft is full of ills" );
		})
		.on( "click.hover.me.not", function( e ) {
			equal( e.handleObj.namespace, "hover.me.not", "hover hack doesn't mangle namespaces" );
		})
		.bind("hover", function( e ) {
			if ( e.type === "mouseenter" ) {
				balance++;
			} else if ( e.type === "mouseleave" ) {
				balance--;
			} else {
				ok( false, "hover pseudo: unknown event type "+e.type );
			}
		})
		.trigger("click")
		.trigger("mouseenter")
		.trigger("mouseleave")
		.unbind("hover")
		.trigger("mouseenter");

	equal( balance, 0, "hover pseudo-event" );
});

test("mouseover triggers mouseenter", function() {
	expect(1);

	var count = 0,
		elem = jQuery("<a />");
	elem.mouseenter(function () {
		count++;
	});
	elem.trigger("mouseover");
	equal(count, 1, "make sure mouseover triggers a mouseenter" );

	elem.remove();
});

test("withinElement implemented with jQuery.contains()", function() {

	expect(1);

	jQuery("#qunit-fixture").append('<div id="jc-outer"><div id="jc-inner"></div></div>');

	jQuery("#jc-outer").bind("mouseenter mouseleave", function( event ) {

		equal( this.id, "jc-outer", this.id + " " + event.type );

	}).trigger("mouseenter");

	jQuery("#jc-inner").trigger("mousenter");

	jQuery("#jc-outer").unbind("mouseenter mouseleave").remove();
	jQuery("#jc-inner").remove();

});

test("mouseenter, mouseleave don't catch exceptions", function() {
	expect(2);

	var elem = jQuery("#firstp").hover(function() { throw "an Exception"; });

	try {
		elem.mouseenter();
	} catch (e) {
		equal( e, "an Exception", "mouseenter doesn't catch exceptions" );
	}

	try {
		elem.mouseleave();
	} catch (e) {
		equal( e, "an Exception", "mouseleave doesn't catch exceptions" );
	}
});

test("trigger() shortcuts", function() {
	expect(6);

	var elem = jQuery("<li><a href='#'>Change location</a></li>").prependTo("#firstUL");
	elem.find("a").bind("click", function() {
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

	var counter = 0;
	jQuery("#firstp")[0].onclick = function(event) {
		counter++;
	};
	jQuery("#firstp").click();
	equal( counter, 1, "Check that click, triggers onclick event handler also" );

	var clickCounter = 0;
	jQuery("#simon1")[0].onclick = function(event) {
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
	jQuery('<xml:namespace ns="urn:schemas-microsoft-com:vml" prefix="v" />').appendTo('head');
	jQuery('<v:oval id="oval" style="width:100pt;height:75pt;" fillcolor="red"> </v:oval>').appendTo('#form');
	jQuery("#oval").click().keydown();
});

test("trigger() bubbling", function() {
	expect(18);

	var win = 0, doc = 0, html = 0, body = 0, main = 0, ap = 0;

	jQuery(window).bind("click", function(e){ win++; });
	jQuery(document).bind("click", function(e){ if ( e.target !== document) { doc++; } });
	jQuery("html").bind("click", function(e){ html++; });
	jQuery("body").bind("click", function(e){ body++; });
	jQuery("#qunit-fixture").bind("click", function(e){ main++; });
	jQuery("#ap").bind("click", function(){ ap++; return false; });

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
	jQuery(document).unbind("click");
	jQuery("html, body, #qunit-fixture").unbind("click");
});

test("trigger(type, [data], [fn])", function() {
	expect(16);

	var handler = function(event, a, b, c) {
		equal( event.type, "click", "check passed data" );
		equal( a, 1, "check passed data" );
		equal( b, "2", "check passed data" );
		equal( c, "abc", "check passed data" );
		return "test";
	};

	var $elem = jQuery("#firstp");

	// Simulate a "native" click
	$elem[0].click = function(){
		ok( true, "Native call was triggered" );
	};


	$elem.live('mouseenter', function(){
		ok( true, 'Trigger mouseenter bound by live' );
	});

	$elem.live('mouseleave', function(){
		ok( true, 'Trigger mouseleave bound by live' );
	});

	$elem.trigger('mouseenter');

	$elem.trigger('mouseleave');

	$elem.die('mouseenter');

	$elem.die('mouseleave');

	// Triggers handlrs and native
	// Trigger 5
	$elem.bind("click", handler).trigger("click", [1, "2", "abc"]);

	// Simulate a "native" click
	$elem[0].click = function(){
		ok( false, "Native call was triggered" );
	};

	// Trigger only the handlers (no native)
	// Triggers 5
	equal( $elem.triggerHandler("click", [1, "2", "abc"]), "test", "Verify handler response" );

	var pass = true, elem2;
	try {
		elem2 = jQuery("#form input:first");
		elem2.get(0).style.display = "none";
		elem2.trigger("focus");
	} catch(e) {
		pass = false;
	}
	ok( pass, "Trigger focus on hidden element" );

	pass = true;
	try {
		jQuery("#qunit-fixture table:first").bind("test:test", function(){}).trigger("test:test");
	} catch (e) {
		pass = false;
	}
	ok( pass, "Trigger on a table with a colon in the even type, see #3533" );

	var form = jQuery("<form action=''></form>").appendTo("body");

	// Make sure it can be prevented locally
	form.submit(function(){
		ok( true, "Local bind still works." );
		return false;
	});

	// Trigger 1
	form.trigger("submit");

	form.unbind("submit");

	jQuery(document).submit(function(){
		ok( true, "Make sure bubble works up to document." );
		return false;
	});

	// Trigger 1
	form.trigger("submit");

	jQuery(document).unbind("submit");

	form.remove();
});

test( "submit event bubbles on copied forms (#11649)", function(){
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
	$testForm.on( "submit", noSubmit ).find("input[name=sub1]").click();

	// Copy the form via .clone() and .html()
	$formByClone = $testForm.clone( true, true ).removeAttr("id");
	$formByHTML = jQuery( $fixture.html() ).filter("#testForm").removeAttr("id");
	$wrapperDiv.append( $formByClone, $formByHTML );

	// Check submit bubbling on the copied forms
	$wrapperDiv.find("form").on( "submit", noSubmit ).find("input[name=sub1]").click();

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
	$form.find("select[name=select1]").val("1").change();

	// Copy the form via .clone() and .html()
	$formByClone = $form.clone( true, true ).removeAttr("id");
	$formByHTML = jQuery( $fixture.html() ).filter("#form").removeAttr("id");
	$wrapperDiv.append( $formByClone, $formByHTML );

	// Check change bubbling on the copied forms
	$wrapperDiv.find("form select[name=select1]").val("2").change();

	// Clean up
	$wrapperDiv.remove();
	$fixture.off( "change", "form", delegatedChange );
});

test("trigger(eventObject, [data], [fn])", function() {
	expect(28);

	var $parent = jQuery("<div id='par' />").appendTo("body"),
		$child = jQuery("<p id='child'>foo</p>").appendTo( $parent );

	$parent.get( 0 ).style.display = "none";

	var event = jQuery.Event("noNew");
	ok( event != window, "Instantiate jQuery.Event without the 'new' keyword" );
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

	$parent.bind("foo",function(e){
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

	$parent.unbind();

	function error(){
		ok( false, "This assertion shouldn't be reached");
	}

	$parent.bind("foo", error );

	$child.bind("foo",function(e, a, b, c ){
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
	//$child.bind("foo", error );

	event = new jQuery.Event("foo");
	$child.trigger( event, [1,2,3] ).unbind();
	equal( event.result, "result", "Check event.result attribute");

	// Will error if it bubbles
	$child.triggerHandler("foo");

	$child.unbind();
	$parent.unbind().remove();

	// Ensure triggerHandler doesn't molest its event object (#xxx)
	event = jQuery.Event( "zowie" );
	jQuery( document ).triggerHandler( event );
	equal( event.type, "zowie", "Verify its type" );
	equal( event.isPropagationStopped(), false, "propagation not stopped" );
	equal( event.isDefaultPrevented(), false, "default not prevented" );
});

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
			.click()
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
	jQuery( '<img src="index.html" />' )
		.appendTo( "body" )
		.on( "load", function() {
			ok( true, "load fired on img" );
		})
		.trigger( "load" )
		.remove();

	jQuery( window ).off( "load" );
});

test("Delegated events in SVG (#10791)", function() {
	expect(2);

	var svg = jQuery(
			'<svg height="1" version="1.1" width="1" xmlns="http://www.w3.org/2000/svg">'+
			'<rect class="svg-by-class" x="10" y="20" width="100" height="60" r="10" rx="10" ry="10"></rect>'+
			'<rect id="svg-by-id" x="10" y="20" width="100" height="60" r="10" rx="10" ry="10"></rect>'+
			'</svg>'
		).appendTo( "body" );

	jQuery( "body" )
		.on( "click", "#svg-by-id", function() {
			ok( true, "delegated id selector" );
		})
		.on( "click", "[class~='svg-by-class']", function() {
			ok( true, "delegated class selector" );
		})
		.find( "#svg-by-id, [class~='svg-by-class']" )
			.trigger( "click" )
		.end()
		.off( "click" );

	svg.remove();
});

test("Delegated events in forms (#10844; #11145; #8165; #11382, #11764)", function() {
	expect(5);

	// Alias names like "id" cause havoc
	var form = jQuery(
			'<form id="myform">'+
				'<input type="text" name="id" value="secret agent man" />'+
			'</form>'
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

	form.append('<input type="text" name="disabled" value="differently abled" />');
	jQuery("body")
		.on( "submit", "#myform", function() {
			ok( true, "delegated id selector with aliased disabled" );
		})
		.find("#myform")
			.trigger("submit")
		.end()
		.off("submit");

	form
		.append( '<button id="nestyDisabledBtn"><span>Zing</span></button>' )
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
			'<form id="myform">'+
				'<input type="text" name="sue" value="bawls" />'+
				'<input type="submit" />'+
			'</form>'
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

test("on(beforeunload) creates/deletes window property instead of adding/removing event listener", function() {
	expect(3);

	equal( window.onbeforeunload, null, "window property is null/undefined up until now" );

	var handle = function () {};
	jQuery(window).on( "beforeunload", handle );

	equal( typeof window.onbeforeunload, "function", "window property is set to a function");

	jQuery(window).off( "beforeunload", handle );

	equal( window.onbeforeunload, null, "window property has been unset to null/undefined" );
});

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

	jQuery("body").bind( "keydown", handler ).trigger( event );

	jQuery("body").unbind( "keydown" );

});

test("jQuery.Event.currentTarget", function(){
	expect(2);

	jQuery("<div><p><button>shiny</button></p></div>")
		.on( "click", "p", function( e ){
				equal( e.currentTarget, this, "Check delegated currentTarget on event" );
		})
		.find( "button" )
			.on( "click", function( e ){
				equal( e.currentTarget, this, "Check currentTarget on event" );
			})
			.click()
			.off( "click" )
		.end()
		.off( "click" );
});

test("toggle(Function, Function, ...)", function() {
	expect(16);

	var count = 0,
		fn1 = function(e) { count++; },
		fn2 = function(e) { count--; },
		preventDefault = function(e) { e.preventDefault(); },
		link = jQuery("#mark");
	link.click(preventDefault).click().toggle(fn1, fn2).click().click().click().click().click();
	equal( count, 1, "Check for toggle(fn, fn)" );

	jQuery("#firstp").toggle(function () {
		equal(arguments.length, 4, "toggle correctly passes through additional triggered arguments, see #1701" );
	}, function() {}).trigger("click", [ 1, 2, 3 ]);

	var first = 0;
	jQuery("#simon1").one("click", function() {
		ok( true, "Execute event only once" );
		jQuery(this).toggle(function() {
			equal( first++, 0, "toggle(Function,Function) assigned from within one('xxx'), see #1054" );
		}, function() {
			equal( first, 1, "toggle(Function,Function) assigned from within one('xxx'), see #1054" );
		});
		return false;
	}).click().click().click();

	var turn = 0;
	var fns = [
		function(){
			turn = 1;
		},
		function(){
			turn = 2;
		},
		function(){
			turn = 3;
		}
	];

	var $div = jQuery("<div>&nbsp;</div>").toggle( fns[0], fns[1], fns[2] );
	$div.click();
	equal( turn, 1, "Trying toggle with 3 functions, attempt 1 yields 1");
	$div.click();
	equal( turn, 2, "Trying toggle with 3 functions, attempt 2 yields 2");
	$div.click();
	equal( turn, 3, "Trying toggle with 3 functions, attempt 3 yields 3");
	$div.click();
	equal( turn, 1, "Trying toggle with 3 functions, attempt 4 yields 1");
	$div.click();
	equal( turn, 2, "Trying toggle with 3 functions, attempt 5 yields 2");

	$div.unbind("click",fns[0]);
	var data = jQuery._data( $div[0], "events" );
	ok( !data, "Unbinding one function from toggle unbinds them all");

	// manually clean up detached elements
	$div.remove();

	// Test Multi-Toggles
	var a = [], b = [];
	$div = jQuery("<div/>");
	$div.toggle(function(){ a.push(1); }, function(){ a.push(2); });
	$div.click();
	deepEqual( a, [1], "Check that a click worked." );

	$div.toggle(function(){ b.push(1); }, function(){ b.push(2); });
	$div.click();
	deepEqual( a, [1,2], "Check that a click worked with a second toggle." );
	deepEqual( b, [1], "Check that a click worked with a second toggle." );

	$div.click();
	deepEqual( a, [1,2,1], "Check that a click worked with a second toggle, second click." );
	deepEqual( b, [1,2], "Check that a click worked with a second toggle, second click." );

	// manually clean up detached elements
	$div.remove();
});

test(".live()/.die()", function() {
	expect(66);

	var submit = 0, div = 0, livea = 0, liveb = 0;

	jQuery("div").live("submit", function(){ submit++; return false; });
	jQuery("div").live("click", function(){ div++; });
	jQuery("div#nothiddendiv").live("click", function(){ livea++; });
	jQuery("div#nothiddendivchild").live("click", function(){ liveb++; });

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
	equal( submit, 0, "die Click on inner div" );
	equal( div, 2, "die Click on inner div" );
	equal( livea, 1, "die Click on inner div" );
	equal( liveb, 1, "die Click on inner div" );

	// Now make sure that the removal works
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("div#nothiddendivchild").die("click");
	jQuery("div#nothiddendivchild").trigger("click");
	equal( submit, 0, "die Click on inner div" );
	equal( div, 2, "die Click on inner div" );
	equal( livea, 1, "die Click on inner div" );
	equal( liveb, 0, "die Click on inner div" );

	// Make sure that the click wasn't removed too early
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("div#nothiddendiv").trigger("click");
	equal( submit, 0, "die Click on inner div" );
	equal( div, 1, "die Click on inner div" );
	equal( livea, 1, "die Click on inner div" );
	equal( liveb, 0, "die Click on inner div" );

	// Make sure that stopPropgation doesn't stop live events
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("div#nothiddendivchild").live("click", function(e){ liveb++; e.stopPropagation(); });
	jQuery("div#nothiddendivchild").trigger("click");
	equal( submit, 0, "stopPropagation Click on inner div" );
	equal( div, 1, "stopPropagation Click on inner div" );
	equal( livea, 0, "stopPropagation Click on inner div" );
	equal( liveb, 1, "stopPropagation Click on inner div" );

	// Make sure click events only fire with primary click
	submit = 0; div = 0; livea = 0; liveb = 0;
	var event = jQuery.Event("click");
	event.button = 1;
	jQuery("div#nothiddendiv").trigger(event);

	equal( livea, 0, "live secondary click" );

	jQuery("div#nothiddendivchild").die("click");
	jQuery("div#nothiddendiv").die("click");
	jQuery("div").die("click");
	jQuery("div").die("submit");

	// Test binding with a different context
	var clicked = 0, container = jQuery("#qunit-fixture")[0];
	jQuery("#foo", container).live("click", function(e){ clicked++; });
	jQuery("div").trigger("click");
	jQuery("#foo").trigger("click");
	jQuery("#qunit-fixture").trigger("click");
	jQuery("body").trigger("click");
	equal( clicked, 2, "live with a context" );

	// Test unbinding with a different context
	jQuery("#foo", container).die("click");
	jQuery("#foo").trigger("click");
	equal( clicked, 2, "die with a context");

	// Test binding with event data
	jQuery("#foo").live("click", true, function(e){ equal( e.data, true, "live with event data" ); });
	jQuery("#foo").trigger("click").die("click");

	// Test binding with trigger data
	jQuery("#foo").live("click", function(e, data){ equal( data, true, "live with trigger data" ); });
	jQuery("#foo").trigger("click", true).die("click");

	// Test binding with different this object
	jQuery("#foo").live("click", jQuery.proxy(function(e){ equal( this.foo, "bar", "live with event scope" ); }, { foo: "bar" }));
	jQuery("#foo").trigger("click").die("click");

	// Test binding with different this object, event data, and trigger data
	jQuery("#foo").live("click", true, jQuery.proxy(function(e, data){
		equal( e.data, true, "live with with different this object, event data, and trigger data" );
		equal( this["foo"], "bar", "live with with different this object, event data, and trigger data" );
		equal( data, true, "live with with different this object, event data, and trigger data");
	}, { "foo": "bar" }));
	jQuery("#foo").trigger("click", true).die("click");

	// Verify that return false prevents default action
	jQuery("#anchor2").live("click", function(){ return false; });
	var hash = window.location.hash;
	jQuery("#anchor2").trigger("click");
	equal( window.location.hash, hash, "return false worked" );
	jQuery("#anchor2").die("click");

	// Verify that .preventDefault() prevents default action
	jQuery("#anchor2").live("click", function(e){ e.preventDefault(); });
	hash = window.location.hash;
	jQuery("#anchor2").trigger("click");
	equal( window.location.hash, hash, "e.preventDefault() worked" );
	jQuery("#anchor2").die("click");

	// Test binding the same handler to multiple points
	var called = 0;
	function callback(){ called++; return false; }

	jQuery("#nothiddendiv").live("click", callback);
	jQuery("#anchor2").live("click", callback);

	jQuery("#nothiddendiv").trigger("click");
	equal( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery("#anchor2").trigger("click");
	equal( called, 1, "Verify that only one click occurred." );

	// Make sure that only one callback is removed
	jQuery("#anchor2").die("click", callback);

	called = 0;
	jQuery("#nothiddendiv").trigger("click");
	equal( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery("#anchor2").trigger("click");
	equal( called, 0, "Verify that no click occurred." );

	// Make sure that it still works if the selector is the same,
	// but the event type is different
	jQuery("#nothiddendiv").live("foo", callback);

	// Cleanup
	jQuery("#nothiddendiv").die("click", callback);

	called = 0;
	jQuery("#nothiddendiv").trigger("click");
	equal( called, 0, "Verify that no click occurred." );

	called = 0;
	jQuery("#nothiddendiv").trigger("foo");
	equal( called, 1, "Verify that one foo occurred." );

	// Cleanup
	jQuery("#nothiddendiv").die("foo", callback);

	// Make sure we don't loose the target by DOM modifications
	// after the bubble already reached the liveHandler
	var livec = 0, elemDiv = jQuery("#nothiddendivchild").html("<span></span>").get(0);

	jQuery("#nothiddendivchild").live("click", function(e){ jQuery("#nothiddendivchild").html(""); });
	jQuery("#nothiddendivchild").live("click", function(e){ if(e.target) {livec++;} });

	jQuery("#nothiddendiv span").click();
	equal( jQuery("#nothiddendiv span").length, 0, "Verify that first handler occurred and modified the DOM." );
	equal( livec, 1, "Verify that second handler occurred even with nuked target." );

	// Cleanup
	jQuery("#nothiddendivchild").die("click");

	// Verify that .live() ocurs and cancel buble in the same order as
	// we would expect .bind() and .click() without delegation
	var lived = 0, livee = 0;

	// bind one pair in one order
	jQuery("span#liveSpan1 a").live("click", function(){ lived++; return false; });
	jQuery("span#liveSpan1").live("click", function(){ livee++; });

	jQuery("span#liveSpan1 a").click();
	equal( lived, 1, "Verify that only one first handler occurred." );
	equal( livee, 0, "Verify that second handler doesn't." );

	// and one pair in inverse
	jQuery("span#liveSpan2").live("click", function(){ livee++; });
	jQuery("span#liveSpan2 a").live("click", function(){ lived++; return false; });

	lived = 0;
	livee = 0;
	jQuery("span#liveSpan2 a").click();
	equal( lived, 1, "Verify that only one first handler occurred." );
	equal( livee, 0, "Verify that second handler doesn't." );

	// Cleanup
	jQuery("span#liveSpan1 a").die("click");
	jQuery("span#liveSpan1").die("click");
	jQuery("span#liveSpan2 a").die("click");
	jQuery("span#liveSpan2").die("click");

	// Test this, target and currentTarget are correct
	jQuery("span#liveSpan1").live("click", function(e){
		equal( this.id, "liveSpan1", "Check the this within a live handler" );
		equal( e.currentTarget.id, "liveSpan1", "Check the event.currentTarget within a live handler" );
		equal( e.delegateTarget, document, "Check the event.delegateTarget within a live handler" );
		equal( e.target.nodeName.toUpperCase(), "A", "Check the event.target within a live handler" );
	});

	jQuery("span#liveSpan1 a").click();

	jQuery("span#liveSpan1").die("click");

	// Work with deep selectors
	livee = 0;

	function clickB(){ livee++; }

	jQuery("#nothiddendiv div").live("click", function(){ livee++; });
	jQuery("#nothiddendiv div").live("click", clickB);
	jQuery("#nothiddendiv div").live("mouseover", function(){ livee++; });

	equal( livee, 0, "No clicks, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equal( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("mouseover");
	equal( livee, 1, "Mouseover, deep selector." );

	jQuery("#nothiddendiv div").die("mouseover");

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equal( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("mouseover");
	equal( livee, 0, "Mouseover, deep selector." );

	jQuery("#nothiddendiv div").die("click", clickB);

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equal( livee, 1, "Click, deep selector." );

	jQuery("#nothiddendiv div").die("click");

	// blur a non-input element, we should force-fire its handlers
	// regardless of whether it's burring or not (unlike browsers)
	jQuery("#nothiddendiv div")
		.live("blur", function(){
			ok( true, "Live div trigger blur." );
		})
		.trigger("blur")
		.die("blur");
});

test("die all bound events", function(){
	expect(1);

	var count = 0;
	var div = jQuery("div#nothiddendivchild");

	div.live("click submit", function(){ count++; });
	div.die();

	div.trigger("click");
	div.trigger("submit");

	equal( count, 0, "Make sure no events were triggered." );
});

test("live with multiple events", function(){
	expect(1);

	var count = 0;
	var div = jQuery("div#nothiddendivchild");

	div.live("click submit", function(){ count++; });

	div.trigger("click");
	div.trigger("submit");

	equal( count, 2, "Make sure both the click and submit were triggered." );

	// manually clean up events from elements outside the fixture
	div.die();
});

test("live with namespaces", function(){
	expect(15);

	var count1 = 0, count2 = 0;

	jQuery("#liveSpan1").live("foo.bar", function(e){
		equal( e.namespace, "bar", "namespace is bar" );
		count1++;
	});

	jQuery("#liveSpan1").live("foo.zed", function(e){
		equal( e.namespace, "zed", "namespace is zed" );
		count2++;
	});

	jQuery("#liveSpan1").trigger("foo.bar");
	equal( count1, 1, "Got live foo.bar" );
	equal( count2, 0, "Got live foo.bar" );

	count1 = 0; count2 = 0;

	jQuery("#liveSpan1").trigger("foo.zed");
	equal( count1, 0, "Got live foo.zed" );
	equal( count2, 1, "Got live foo.zed" );

	//remove one
	count1 = 0; count2 = 0;

	jQuery("#liveSpan1").die("foo.zed");
	jQuery("#liveSpan1").trigger("foo.bar");

	equal( count1, 1, "Got live foo.bar after dieing foo.zed" );
	equal( count2, 0, "Got live foo.bar after dieing foo.zed" );

	count1 = 0; count2 = 0;

	jQuery("#liveSpan1").trigger("foo.zed");
	equal( count1, 0, "Got live foo.zed" );
	equal( count2, 0, "Got live foo.zed" );

	//remove the other
	jQuery("#liveSpan1").die("foo.bar");

	count1 = 0; count2 = 0;

	jQuery("#liveSpan1").trigger("foo.bar");
	equal( count1, 0, "Did not respond to foo.bar after dieing it" );
	equal( count2, 0, "Did not respond to foo.bar after dieing it" );

	jQuery("#liveSpan1").trigger("foo.zed");
	equal( count1, 0, "Did not trigger foo.zed again" );
	equal( count2, 0, "Did not trigger foo.zed again" );
});

test("live with change", function(){
	expect(8);

	var selectChange = 0, checkboxChange = 0;

	var select = jQuery("select[name='S1']");
	select.live("change", function() {
		selectChange++;
	});

	var checkbox = jQuery("#check2"),
		checkboxFunction = function(){
			checkboxChange++;
		};
	checkbox.live("change", checkboxFunction);

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
	var text = jQuery("#name"), textChange = 0, oldTextVal = text.val();
	text.live("change", function() {
		textChange++;
	});

	text.val(oldTextVal+"foo");
	text.trigger("change");
	equal( textChange, 1, "Change on text input." );

	text.val(oldTextVal);
	text.die("change");

	// test blur/focus on password
	var password = jQuery("#name"), passwordChange = 0, oldPasswordVal = password.val();
	password.live("change", function() {
		passwordChange++;
	});

	password.val(oldPasswordVal + "foo");
	password.trigger("change");
	equal( passwordChange, 1, "Change on password input." );

	password.val(oldPasswordVal);
	password.die("change");

	// make sure die works

	// die all changes
	selectChange = 0;
	select.die("change");
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equal( selectChange, 0, "Die on click works." );

	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equal( selectChange, 0, "Die on keyup works." );

	// die specific checkbox
	checkbox.die("change", checkboxFunction);
	checkbox.trigger("change");
	equal( checkboxChange, 1, "Die on checkbox." );
});

test("live with submit", function() {
	expect(7);

	var count1 = 0, count2 = 0;

	jQuery("#testForm").live("submit", function(ev) {
		count1++;
		ev.preventDefault();
	});

	jQuery("body").live("submit", function(ev) {
		count2++;
		ev.preventDefault();
	});

	jQuery("#testForm input[name=sub1]").submit();
	equal( count1, 1, "Verify form submit." );
	equal( count2, 1, "Verify body submit." );

	jQuery("#testForm input[name=sub1]").live("click", function(ev) {
		ok( true, "cancelling submit still calls click handler" );
	});

	jQuery("#testForm input[name=sub1]")[0].click();
	equal( count1, 2, "Verify form submit." );
	equal( count2, 2, "Verify body submit." );

	jQuery("#testForm button[name=sub4]")[0].click();
	equal( count1, 3, "Verify form submit." );
	equal( count2, 3, "Verify body submit." );

	jQuery("#testForm").die("submit");
	jQuery("#testForm input[name=sub1]").die("click");
	jQuery("body").die("submit");
});

test("live with special events", function() {
	expect(13);

	jQuery.event.special["foo"] = {
		setup: function( data, namespaces, handler ) {
			ok( true, "Setup run." );
		},
		teardown: function( namespaces ) {
			ok( true, "Teardown run." );
		},
		add: function( handleObj ) {
			ok( true, "Add run." );
		},
		remove: function( handleObj ) {
			ok( true, "Remove run." );
		},
		_default: function( event, arg ) {
			ok( event.type === "foo" && arg == 42, "Default run with correct args." );
		}
	};

	// Run: setup, add
	jQuery("#liveSpan1").live("foo.a", function(e){
		ok( true, "Handler 1 run." );
	});

	// Run: add
	jQuery("#liveSpan1").live("foo.b", function(e){
		ok( true, "Handler 2 run." );
	});

	// Run: Handler 1, Handler 2, Default
	jQuery("#liveSpan1").trigger("foo", 42);

	// Run: Handler 1, Default
	jQuery("#liveSpan1").trigger("foo.a", 42);

	// Run: remove
	jQuery("#liveSpan1").die("foo.a");

	// Run: Handler 2, Default
	jQuery("#liveSpan1").trigger("foo", 42);

	// Run: remove, teardown
	jQuery("#liveSpan1").die("foo");

	delete jQuery.event.special["foo"];
});

test(".delegate()/.undelegate()", function() {
	expect(65);

	var submit = 0, div = 0, livea = 0, liveb = 0;

	jQuery("#body").delegate("div", "submit", function(){ submit++; return false; });
	jQuery("#body").delegate("div", "click", function(){ div++; });
	jQuery("#body").delegate("div#nothiddendiv", "click", function(){ livea++; });
	jQuery("#body").delegate("div#nothiddendivchild", "click", function(){ liveb++; });

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
	equal( submit, 0, "undelegate Click on inner div" );
	equal( div, 2, "undelegate Click on inner div" );
	equal( livea, 1, "undelegate Click on inner div" );
	equal( liveb, 1, "undelegate Click on inner div" );

	// Now make sure that the removal works
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("#body").undelegate("div#nothiddendivchild", "click");
	jQuery("div#nothiddendivchild").trigger("click");
	equal( submit, 0, "undelegate Click on inner div" );
	equal( div, 2, "undelegate Click on inner div" );
	equal( livea, 1, "undelegate Click on inner div" );
	equal( liveb, 0, "undelegate Click on inner div" );

	// Make sure that the click wasn't removed too early
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("div#nothiddendiv").trigger("click");
	equal( submit, 0, "undelegate Click on inner div" );
	equal( div, 1, "undelegate Click on inner div" );
	equal( livea, 1, "undelegate Click on inner div" );
	equal( liveb, 0, "undelegate Click on inner div" );

	// Make sure that stopPropgation doesn't stop live events
	submit = 0; div = 0; livea = 0; liveb = 0;
	jQuery("#body").delegate("div#nothiddendivchild", "click", function(e){ liveb++; e.stopPropagation(); });
	jQuery("div#nothiddendivchild").trigger("click");
	equal( submit, 0, "stopPropagation Click on inner div" );
	equal( div, 1, "stopPropagation Click on inner div" );
	equal( livea, 0, "stopPropagation Click on inner div" );
	equal( liveb, 1, "stopPropagation Click on inner div" );

	// Make sure click events only fire with primary click
	submit = 0; div = 0; livea = 0; liveb = 0;
	var event = jQuery.Event("click");
	event.button = 1;
	jQuery("div#nothiddendiv").trigger(event);

	equal( livea, 0, "delegate secondary click" );

	jQuery("#body").undelegate("div#nothiddendivchild", "click");
	jQuery("#body").undelegate("div#nothiddendiv", "click");
	jQuery("#body").undelegate("div", "click");
	jQuery("#body").undelegate("div", "submit");

	// Test binding with a different context
	var clicked = 0, container = jQuery("#qunit-fixture")[0];
	jQuery("#qunit-fixture").delegate("#foo", "click", function(e){ clicked++; });
	jQuery("div").trigger("click");
	jQuery("#foo").trigger("click");
	jQuery("#qunit-fixture").trigger("click");
	jQuery("body").trigger("click");
	equal( clicked, 2, "delegate with a context" );

	// Test unbinding with a different context
	jQuery("#qunit-fixture").undelegate("#foo", "click");
	jQuery("#foo").trigger("click");
	equal( clicked, 2, "undelegate with a context");

	// Test binding with event data
	jQuery("#body").delegate("#foo", "click", true, function(e){ equal( e.data, true, "delegate with event data" ); });
	jQuery("#foo").trigger("click");
	jQuery("#body").undelegate("#foo", "click");

	// Test binding with trigger data
	jQuery("#body").delegate("#foo", "click", function(e, data){ equal( data, true, "delegate with trigger data" ); });
	jQuery("#foo").trigger("click", true);
	jQuery("#body").undelegate("#foo", "click");

	// Test binding with different this object
	jQuery("#body").delegate("#foo", "click", jQuery.proxy(function(e){ equal( this["foo"], "bar", "delegate with event scope" ); }, { "foo": "bar" }));
	jQuery("#foo").trigger("click");
	jQuery("#body").undelegate("#foo", "click");

	// Test binding with different this object, event data, and trigger data
	jQuery("#body").delegate("#foo", "click", true, jQuery.proxy(function(e, data){
		equal( e.data, true, "delegate with with different this object, event data, and trigger data" );
		equal( this.foo, "bar", "delegate with with different this object, event data, and trigger data" );
		equal( data, true, "delegate with with different this object, event data, and trigger data");
	}, { "foo": "bar" }));
	jQuery("#foo").trigger("click", true);
	jQuery("#body").undelegate("#foo", "click");

	// Verify that return false prevents default action
	jQuery("#body").delegate("#anchor2", "click", function(){ return false; });
	var hash = window.location.hash;
	jQuery("#anchor2").trigger("click");
	equal( window.location.hash, hash, "return false worked" );
	jQuery("#body").undelegate("#anchor2", "click");

	// Verify that .preventDefault() prevents default action
	jQuery("#body").delegate("#anchor2", "click", function(e){ e.preventDefault(); });
	hash = window.location.hash;
	jQuery("#anchor2").trigger("click");
	equal( window.location.hash, hash, "e.preventDefault() worked" );
	jQuery("#body").undelegate("#anchor2", "click");

	// Test binding the same handler to multiple points
	var called = 0;
	function callback(){ called++; return false; }

	jQuery("#body").delegate("#nothiddendiv", "click", callback);
	jQuery("#body").delegate("#anchor2", "click", callback);

	jQuery("#nothiddendiv").trigger("click");
	equal( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery("#anchor2").trigger("click");
	equal( called, 1, "Verify that only one click occurred." );

	// Make sure that only one callback is removed
	jQuery("#body").undelegate("#anchor2", "click", callback);

	called = 0;
	jQuery("#nothiddendiv").trigger("click");
	equal( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery("#anchor2").trigger("click");
	equal( called, 0, "Verify that no click occurred." );

	// Make sure that it still works if the selector is the same,
	// but the event type is different
	jQuery("#body").delegate("#nothiddendiv", "foo", callback);

	// Cleanup
	jQuery("#body").undelegate("#nothiddendiv", "click", callback);

	called = 0;
	jQuery("#nothiddendiv").trigger("click");
	equal( called, 0, "Verify that no click occurred." );

	called = 0;
	jQuery("#nothiddendiv").trigger("foo");
	equal( called, 1, "Verify that one foo occurred." );

	// Cleanup
	jQuery("#body").undelegate("#nothiddendiv", "foo", callback);

	// Make sure we don't loose the target by DOM modifications
	// after the bubble already reached the liveHandler
	var livec = 0, elemDiv = jQuery("#nothiddendivchild").html("<span></span>").get(0);

	jQuery("#body").delegate("#nothiddendivchild", "click", function(e){ jQuery("#nothiddendivchild").html(""); });
	jQuery("#body").delegate("#nothiddendivchild", "click", function(e){ if(e.target) {livec++;} });

	jQuery("#nothiddendiv span").click();
	equal( jQuery("#nothiddendiv span").length, 0, "Verify that first handler occurred and modified the DOM." );
	equal( livec, 1, "Verify that second handler occurred even with nuked target." );

	// Cleanup
	jQuery("#body").undelegate("#nothiddendivchild", "click");

	// Verify that .live() ocurs and cancel buble in the same order as
	// we would expect .bind() and .click() without delegation
	var lived = 0, livee = 0;

	// bind one pair in one order
	jQuery("#body").delegate("span#liveSpan1 a", "click", function(){ lived++; return false; });
	jQuery("#body").delegate("span#liveSpan1", "click", function(){ livee++; });

	jQuery("span#liveSpan1 a").click();
	equal( lived, 1, "Verify that only one first handler occurred." );
	equal( livee, 0, "Verify that second handler doesn't." );

	// and one pair in inverse
	jQuery("#body").delegate("span#liveSpan2", "click", function(){ livee++; });
	jQuery("#body").delegate("span#liveSpan2 a", "click", function(){ lived++; return false; });

	lived = 0;
	livee = 0;
	jQuery("span#liveSpan2 a").click();
	equal( lived, 1, "Verify that only one first handler occurred." );
	equal( livee, 0, "Verify that second handler doesn't." );

	// Cleanup
	jQuery("#body").undelegate("click");

	// Test this, target and currentTarget are correct
	jQuery("#body").delegate("span#liveSpan1", "click", function(e){
		equal( this.id, "liveSpan1", "Check the this within a delegate handler" );
		equal( e.currentTarget.id, "liveSpan1", "Check the event.currentTarget within a delegate handler" );
		equal( e.delegateTarget, document.body, "Check the event.delegateTarget within a delegate handler" );
		equal( e.target.nodeName.toUpperCase(), "A", "Check the event.target within a delegate handler" );
	});

	jQuery("span#liveSpan1 a").click();

	jQuery("#body").undelegate("span#liveSpan1", "click");

	// Work with deep selectors
	livee = 0;

	function clickB(){ livee++; }

	jQuery("#body").delegate("#nothiddendiv div", "click", function(){ livee++; });
	jQuery("#body").delegate("#nothiddendiv div", "click", clickB);
	jQuery("#body").delegate("#nothiddendiv div", "mouseover", function(){ livee++; });

	equal( livee, 0, "No clicks, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equal( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("mouseover");
	equal( livee, 1, "Mouseover, deep selector." );

	jQuery("#body").undelegate("#nothiddendiv div", "mouseover");

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equal( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("mouseover");
	equal( livee, 0, "Mouseover, deep selector." );

	jQuery("#body").undelegate("#nothiddendiv div", "click", clickB);

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equal( livee, 1, "Click, deep selector." );

	jQuery("#body").undelegate("#nothiddendiv div", "click");
});

test("jQuery.off using dispatched jQuery.Event", function() {
	expect(1);

	var markup = jQuery( '<p><a href="#">target</a></p>' ),
		count = 0;
	markup
		.on( "click.name", "a", function( event ) {
			equal( ++count, 1, "event called once before removal" );
			jQuery().off( event );
		})
		.find( "a" ).click().click().end()
		.remove();
});

test( "delegated event with delegateTarget-relative selector", function() {
	expect(3);
	var markup = jQuery("<ul><li><a id=\"a0\"></a><ul id=\"ul0\"><li class=test><a id=\"a0_0\"></a></li><li><a id=\"a0_1\"></a></li></ul></li></ul>").appendTo("#qunit-fixture");

	// Positional selector (#11315)
	markup
		.on( "click", ">li>a", function() {
			ok( this.id === "a0", "child li was clicked" );
		})
		.find("#ul0")
			.on( "click", "li:first>a", function() {
				ok( this.id === "a0_0" , "first li under #u10 was clicked" );
			})
		.end()
		.find("a").click().end()
		.find("#ul0").off();
	
	// Non-positional selector (#12383)
	markup = markup.wrap("<div />").parent();
	markup
		.find("#ul0")
		.on( "click", "div li a", function() {
			ok( false, "div is ABOVE the delegation point!" );
		})
		.on( "click", "ul a", function() {
			ok( false, "ul is the delegation point!" );
		})
		.on( "click", "li.test a", function() {
			ok( true, "li.test is below the delegation point." );
		})
		.find("#a0_0").click();
	
	markup.remove();
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
		.find("a").click().end()
		.remove();
});

test("undelegate all bound events", function(){
	expect(2);

	var count = 0,
		clicks = 0,
		div = jQuery("#body");

	div.delegate( "div#nothiddendivchild", "click submit", function(){ count++; } );
	div.bind( "click", function(){ clicks++; } );
	div.undelegate();

	jQuery("div#nothiddendivchild").trigger("click");
	jQuery("div#nothiddendivchild").trigger("submit");

	equal( count, 0, "Make sure no events were triggered." );

	div.trigger("click");
	equal( clicks, 2, "Make sure delegated and directly bound event occurred." );
	div.unbind("click");
});

test("delegate with multiple events", function(){
	expect(1);

	var count = 0;
	var div = jQuery("#body");

	div.delegate("div#nothiddendivchild", "click submit", function(){ count++; });

	jQuery("div#nothiddendivchild").trigger("click");
	jQuery("div#nothiddendivchild").trigger("submit");

	equal( count, 2, "Make sure both the click and submit were triggered." );

	jQuery("#body").undelegate();
});

test("delegate with change", function(){
	expect(8);

	var selectChange = 0, checkboxChange = 0;

	var select = jQuery("select[name='S1']");
	jQuery("#body").delegate("select[name='S1']", "change", function() {
		selectChange++;
	});

	var checkbox = jQuery("#check2"),
		checkboxFunction = function(){
			checkboxChange++;
		};
	jQuery("#body").delegate("#check2", "change", checkboxFunction);

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
	var text = jQuery("#name"), textChange = 0, oldTextVal = text.val();
	jQuery("#body").delegate("#name", "change", function() {
		textChange++;
	});

	text.val(oldTextVal+"foo");
	text.trigger("change");
	equal( textChange, 1, "Change on text input." );

	text.val(oldTextVal);
	jQuery("#body").die("change");

	// test blur/focus on password
	var password = jQuery("#name"), passwordChange = 0, oldPasswordVal = password.val();
	jQuery("#body").delegate("#name", "change", function() {
		passwordChange++;
	});

	password.val(oldPasswordVal + "foo");
	password.trigger("change");
	equal( passwordChange, 1, "Change on password input." );

	password.val(oldPasswordVal);
	jQuery("#body").undelegate("#name", "change");

	// make sure die works

	// die all changes
	selectChange = 0;
	jQuery("#body").undelegate("select[name='S1']", "change");
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equal( selectChange, 0, "Die on click works." );

	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equal( selectChange, 0, "Die on keyup works." );

	// die specific checkbox
	jQuery("#body").undelegate("#check2", "change", checkboxFunction);
	checkbox.trigger("change");
	equal( checkboxChange, 1, "Die on checkbox." );
});

test("delegate with submit", function() {
	var count1 = 0, count2 = 0;

	jQuery("#body").delegate("#testForm", "submit", function(ev) {
		count1++;
		ev.preventDefault();
	});

	jQuery(document).delegate("body", "submit", function(ev) {
		count2++;
		ev.preventDefault();
	});

	jQuery("#testForm input[name=sub1]").submit();
	equal( count1, 1, "Verify form submit." );
	equal( count2, 1, "Verify body submit." );

	jQuery("#body").undelegate();
	jQuery(document).undelegate();
});

test("undelegate() with only namespaces", function() {
	expect(2);

	var $delegate = jQuery("#liveHandlerOrder"),
		count = 0;

	$delegate.delegate("a", "click.ns", function(e) {
		count++;
	});

	jQuery("a", $delegate).eq(0).trigger("click.ns");

	equal( count, 1, "delegated click.ns");

	$delegate.undelegate(".ns");

	jQuery("a", $delegate).eq(1).trigger("click.ns");

	equal( count, 1, "no more .ns after undelegate");
});

test("Non DOM element events", function() {
	expect(1);

	var o = {};

	jQuery(o).bind("nonelementobj", function(e) {
		ok( true, "Event on non-DOM object triggered" );
	});

	jQuery(o).trigger("nonelementobj");
});

test("inline handler returning false stops default", function() {
	expect(1);

	var markup = jQuery("<div><a href=\"#\" onclick=\"return false\">x</a></div>");
	markup.click(function(e) {
		ok( e.isDefaultPrevented(), "inline handler prevented default");
		return false;
	});
	markup.find("a").click();
	markup.off("click");
});

test("window resize", function() {
	expect(2);

	jQuery(window).unbind();

	jQuery(window).bind("resize", function(){
		ok( true, "Resize event fired." );
	}).resize().unbind("resize");

	ok( !jQuery._data(window, "__events__"), "Make sure all the events are gone." );
});

test("focusin bubbles", function() {
	expect(2);

	var input = jQuery( "<input type='text' />" ).prependTo( "body" ),
		order = 0;

	// focus the element so DOM focus won't fire
	input[0].focus();

	jQuery( "body" ).bind( "focusin.focusinBubblesTest", function(){
		equal( 1, order++, "focusin on the body second" );
	});

	input.bind( "focusin.focusinBubblesTest", function(){
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
	jQuery( "body" ).unbind( "focusin.focusinBubblesTest" );
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
	var counter, mixfn;

	var $onandoff = jQuery("<div id=\"onandoff\"><p>on<b>and</b>off</p><div>worked<em>or</em>borked?</div></div>").appendTo("body");

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
		.click()
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
			.click()
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
		.on( "click clack cluck", "em", 2, mixfn )
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
	var data = jQuery.data[ jQuery( "#onandoff" )[0].expando ] || {};
	equal( data["events"], undefined, "no events left" );

	$onandoff.remove();
});

test("special bind/delegate name mapping", function() {
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
	jQuery( '<p>Gut Feeling</p>' )
		.on( "click", jQuery.noop )
		.on( "gutfeeling", jQuery.noop )
		.off( "click" )
		.trigger( "gutfeeling" )
		.remove();

	// Ensure special events are removed when only a namespace is provided
	jQuery( '<p>Gut Feeling</p>' )
		.on( "gutfeeling.Devo", jQuery.noop )
		.off( ".Devo" )
		.trigger( "gutfeeling" )
		.remove();

	// Ensure .one() events are removed after their maiden voyage
	jQuery( '<p>Gut Feeling</p>' )
		.one( "gutfeeling", jQuery.noop )
		.trigger( "gutfeeling" )	// This one should
		.trigger( "gutfeeling" )	// This one should not
		.remove();

	delete jQuery.event.special["gutfeeling"];
});

test(".on and .off, selective mixed removal (#10705)", function() {
	expect(7);

	var clockout = 0,
		timingx = function( e ) {
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
		clicked = function( event ) {
			counter[ jQuery(this).text().replace(/\s+/, "") ]++;
		},
		table =
			jQuery( "<table><tr><td>center</td><td>fold</td></tr></table>" )
			.on( "click", "tr", clicked )
			.on( "click", "td:first-child", clicked )
			.on( "click", "td:last-child", clicked ),
		clone = table.clone( true );

	clone.find("td").click();
	equal( counter["center"], 1, "first child" );
	equal( counter["fold"], 1, "last child" );
	equal( counter["centerfold"], 2, "all children" );

	table.remove();
	clone.remove();
});

test("fixHooks extensions", function() {
	expect( 2 );

	// IE requires focusable elements to be visible, so append to body
	var $fixture = jQuery( "<input type='text' id='hook-fixture' />" ).appendTo( "body" ),
		saved = jQuery.event.fixHooks.click;

	// Ensure the property doesn't exist
	$fixture.bind( "click", function( event ) {
		ok( !("blurrinessLevel" in event), "event.blurrinessLevel does not exist" );
	});
	fireNative( $fixture[0], 'click' );
	$fixture.unbind( "click" );

	jQuery.event.fixHooks.click = {
		filter: function( event, originalEvent ) {
			event.blurrinessLevel = 42;
			return event;
		}
	};

	// Trigger a native click and ensure the property is set
	$fixture.bind( "click", function( event ) {
		equal( event.blurrinessLevel, 42, "event.blurrinessLevel was set" );
	});
	fireNative( $fixture[0], 'click' );

	delete jQuery.event.fixHooks.click;
	$fixture.unbind( "click" ).remove();
	jQuery.event.fixHooks.click = saved;
});

testIframeWithCallback( "jQuery.ready promise", "event/promiseReady.html", function( isOk ) {
	expect(1);
	ok( isOk, "$.when( $.ready ) works" );
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
	jQuery(document).bind("ready.readytest", makeHandler("c"));

	// Do it twice, just to be sure.
	jQuery(makeHandler("d"));
	jQuery(document).ready(makeHandler("e"));
	jQuery(document).bind("ready.readytest", makeHandler("f"));

	noEarlyExecution = order.length === 0;

	// This assumes that QUnit tests are run on DOM ready!
	test("jQuery ready", function() {
		expect(10);

		ok(noEarlyExecution, "Handlers bound to DOM ready should not execute before DOM ready");

		// Ensure execution order.
		deepEqual(order, ["a", "b", "d", "e", "c", "f"], "Bound DOM ready handlers should execute in bind-order, but those bound with jQuery(document).bind( 'ready', fn ) will always execute last");

		// Ensure handler argument is correct.
		equal(args["a"], jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery");
		equal(args["b"], jQuery, "Argument passed to fn in jQuery(document).ready( fn ) should be jQuery");
		ok(args["c"] instanceof jQuery.Event, "Argument passed to fn in jQuery(document).bind( 'ready', fn ) should be an event object");

		order = [];

		// Now that the ready event has fired, again bind to the ready event
		// in every possible way. These event handlers should execute immediately.
		jQuery(makeHandler("g"));
		equal(order.pop(), "g", "Event handler should execute immediately");
		equal(args["g"], jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery");

		jQuery(document).ready(makeHandler("h"));
		equal(order.pop(), "h", "Event handler should execute immediately");
		equal(args["h"], jQuery, "Argument passed to fn in jQuery(document).ready( fn ) should be jQuery");

		jQuery(document).bind("ready.readytest", makeHandler("never"));
		equal(order.length, 0, "Event handler should never execute since DOM ready has already passed");

		// Cleanup.
		jQuery(document).unbind("ready.readytest");
	});

})();

test("change handler should be detached from element", function() {
	expect( 2 );

	var $fixture = jQuery( "<input type='text' id='change-ie-leak' />" ).appendTo( "body" );

	var originRemoveEvent =  jQuery.removeEvent;

	var wrapperRemoveEvent =  function(elem, type, handle){
		equal("change", type, "Event handler for 'change' event should be removed");
		equal("change-ie-leak", jQuery(elem).attr("id"), "Event handler for 'change' event should be removed from appropriate element");
		originRemoveEvent(elem, type, handle);
	};

	jQuery.removeEvent = wrapperRemoveEvent ;

	$fixture.bind( "change", function( event ) {});
	$fixture.unbind( "change" );

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
