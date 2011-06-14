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

test("bind(), with data", function() {
	expect(4);
	var handler = function(event) {
		ok( event.data, "bind() with data, check passed data exists" );
		equals( event.data.foo, "bar", "bind() with data, Check value of passed data" );
	};
	jQuery("#firstp").bind("click", {foo: "bar"}, handler).click().unbind("click", handler);

	ok( !jQuery._data(jQuery("#firstp")[0], "events"), "Event handler unbound when using data." );

	var test = function(){};
	var handler2 = function(event) {
		equals( event.data, test, "bind() with function data, Check value of passed data" );
	};
	jQuery("#firstp").bind("click", test, handler2).click().unbind("click", handler2);
});

test("click(), with data", function() {
	expect(3);
	var handler = function(event) {
		ok( event.data, "bind() with data, check passed data exists" );
		equals( event.data.foo, "bar", "bind() with data, Check value of passed data" );
	};
	jQuery("#firstp").click({foo: "bar"}, handler).click().unbind("click", handler);

	ok( !jQuery._data(jQuery("#firstp")[0], "events"), "Event handler unbound when using data." );
});

test("bind(), with data, trigger with data", function() {
	expect(4);
	var handler = function(event, data) {
		ok( event.data, "check passed data exists" );
		equals( event.data.foo, "bar", "Check value of passed data" );
		ok( data, "Check trigger data" );
		equals( data.bar, "foo", "Check value of trigger data" );
	};
	jQuery("#firstp").bind("click", {foo: "bar"}, handler).trigger("click", [{bar: "foo"}]).unbind("click", handler);
});

test("bind(), multiple events at once", function() {
	expect(2);
	var clickCounter = 0,
		mouseoverCounter = 0;
	var handler = function(event) {
		if (event.type == "click")
			clickCounter += 1;
		else if (event.type == "mouseover")
			mouseoverCounter += 1;
	};
	jQuery("#firstp").bind("click mouseover", handler).trigger("click").trigger("mouseover");
	equals( clickCounter, 1, "bind() with multiple events at once" );
	equals( mouseoverCounter, 1, "bind() with multiple events at once" );
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

  equals( count, 5, "bind() five events at once" );
});

test("bind(), multiple events at once and namespaces", function() {
	expect(7);

	var cur, obj = {};

	var div = jQuery("<div/>").bind("focusin.a", function(e) {
		equals( e.type, cur, "Verify right single event was fired." );
	});

	cur = "focusin";
	div.trigger("focusin.a");

	// manually clean up detached elements
	div.remove();

	div = jQuery("<div/>").bind("click mouseover", obj, function(e) {
		equals( e.type, cur, "Verify right multi event was fired." );
		equals( e.data, obj, "Make sure the data came in correctly." );
	});

	cur = "click";
	div.trigger("click");

	cur = "mouseover";
	div.trigger("mouseover");

	// manually clean up detached elements
	div.remove();

	div = jQuery("<div/>").bind("focusin.a focusout.b", function(e) {
		equals( e.type, cur, "Verify right multi event was fired." );
	});

	cur = "focusin";
	div.trigger("focusin.a");

	cur = "focusout";
	div.trigger("focusout.b");

	// manually clean up detached elements
	div.remove();
});

test("bind(), namespace with special add", function() {
	expect(24);

	var div = jQuery("<div/>").bind("test", function(e) {
		ok( true, "Test event fired." );
	});

	var i = 0;

	jQuery.event.special.test = {
		_default: function(e) {
			equals( this, document, "Make sure we're at the top of the chain." );
			equals( e.type, "test", "And that we're still dealing with a test event." );
			equals( e.target, div[0], "And that the target is correct." );
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

	div.bind("test.a", {x: 1}, function(e) {
		ok( !!e.xyz, "Make sure that the data is getting passed through." );
		equals( e.data.x, 1, "Make sure data is attached properly." );
	});

	div.bind("test.b", {x: 2}, function(e) {
		ok( !!e.xyz, "Make sure that the data is getting passed through." );
		equals( e.data.x, 2, "Make sure data is attached properly." );
	});

	// Should trigger 5
	div.trigger("test");

	// Should trigger 2
	div.trigger("test.a");

	// Should trigger 2
	div.trigger("test.b");

	// Should trigger 4
	div.unbind("test");

	div = jQuery("<div/>").bind("test", function(e) {
		ok( true, "Test event fired." );
	});

	// Should trigger 2
	div.appendTo("#qunit-fixture").remove();

	delete jQuery.event.special.test;
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
		if (event.type == "click")
			clickCounter++;
		else if (event.type == "mouseover")
			mouseoverCounter++;
	};

	function handlerWithData(event) {
		if (event.type == "click")
			clickCounter += event.data;
		else if (event.type == "mouseover")
			mouseoverCounter += event.data;
	};

	function trigger(){
		$elem.trigger("click").trigger("mouseover");
	}

	var $elem = jQuery("#firstp")
		// Regular bind
		.bind({
			click:handler,
			mouseover:handler
		})
		// Bind with data
		.one({
			click:handlerWithData,
			mouseover:handlerWithData
		}, 2 );

	trigger();

	equals( clickCounter, 3, "bind(Object)" );
	equals( mouseoverCounter, 3, "bind(Object)" );

	trigger();
	equals( clickCounter, 4, "bind(Object)" );
	equals( mouseoverCounter, 4, "bind(Object)" );

	jQuery("#firstp").unbind({
		click:handler,
		mouseover:handler
	});

	trigger();
	equals( clickCounter, 4, "bind(Object)" );
	equals( mouseoverCounter, 4, "bind(Object)" );
});

test("live/die(Object), delegate/undelegate(String, Object)", function() {
	expect(6);

	var clickCounter = 0, mouseoverCounter = 0,
		$p = jQuery("#firstp"), $a = $p.find("a:first");

	var events = {
		click: function( event ) {
			clickCounter += ( event.data || 1 );
		},
		mouseover: function( event ) {
			mouseoverCounter += ( event.data || 1 );
		}
	};

	function trigger() {
		$a.trigger("click").trigger("mouseover");
	}

	$a.live( events );
	$p.delegate( "a", events, 2 );

	trigger();
	equals( clickCounter, 3, "live/delegate" );
	equals( mouseoverCounter, 3, "live/delegate" );

	$p.undelegate( "a", events );

	trigger();
	equals( clickCounter, 4, "undelegate" );
	equals( mouseoverCounter, 4, "undelegate" );

	$a.die( events );

	trigger();
	equals( clickCounter, 4, "die" );
	equals( mouseoverCounter, 4, "die" );
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
	equals( lastClick, "click1", "live stopImmediatePropagation" );
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
	equals( lastClick, "click1", "delegate stopImmediatePropagation" );
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

		if ( typeof(orig.defaultPrevented) === "boolean" || typeof(orig.returnValue) === "boolean" || orig.getPreventDefault ) {
			equals( e.isDefaultPrevented(), true, "isDefaultPrevented true passed to bubbled event" );

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
		equals( e.isDefaultPrevented(), false, "isDefaultPrevented false passed to bubbled event" );
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
		equals( event.data, counter++, "Event.data is not a global event object" );
	};
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
		equals(this.nodeType, 1, "Check node,textnode,comment bind just does real nodes" );
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
		same(name, order.shift(), msg);
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
	expect(2)

	var count = 0, func = function(){
		count++;
	};

	jQuery("#liveHandlerOrder").bind("foo.bar", func).bind("foo.zar", func);
	jQuery("#liveHandlerOrder").trigger("foo.bar");

	equals(count, 1, "Verify binding function with multiple namespaces." );

	jQuery("#liveHandlerOrder").unbind("foo.bar", func).unbind("foo.zar", func);
	jQuery("#liveHandlerOrder").trigger("foo.bar");

	equals(count, 1, "Verify that removing events still work." );
});

test("bind(), make sure order is maintained", function() {
	expect(1);

	var elem = jQuery("#firstp"), log = [], check = [];

	for ( var i = 0; i < 100; i++ ) (function(i){
		elem.bind( "click", function(){
			log.push( i );
		});

		check.push( i );
	})(i);

	elem.trigger("click");

	equals( log.join(","), check.join(","), "Make sure order was maintained." );

	elem.unbind("click");
});

test("bind(), with different this object", function() {
	expect(4);
	var thisObject = { myThis: true },
		data = { myData: true },
		handler1 = function( event ) {
			equals( this, thisObject, "bind() with different this object" );
		},
		handler2 = function( event ) {
			equals( this, thisObject, "bind() with different this object and data" );
			equals( event.data, data, "bind() with different this object and data" );
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
	equals( main, 1, "Verify that the trigger happened correctly." );

	main = 0;
	jQuery("#ap").bind("click", false);
	jQuery("#ap").trigger("click");
	equals( main, 0, "Verify that no bubble happened." );

	main = 0;
	jQuery("#ap").unbind("click", false);
	jQuery("#ap").trigger("click");
	equals( main, 1, "Verify that the trigger happened correctly." );

	// manually clean up events from elements outside the fixture
	jQuery("#qunit-fixture").unbind("click");
});

test("live(name, false), die(name, false)", function() {
	expect(3);

	var main = 0;
	jQuery("#qunit-fixture").live("click", function(e){ main++; });
	jQuery("#ap").trigger("click");
	equals( main, 1, "Verify that the trigger happened correctly." );

	main = 0;
	jQuery("#ap").live("click", false);
	jQuery("#ap").trigger("click");
	equals( main, 0, "Verify that no bubble happened." );

	main = 0;
	jQuery("#ap").die("click", false);
	jQuery("#ap").trigger("click");
	equals( main, 1, "Verify that the trigger happened correctly." );
	jQuery("#qunit-fixture").die("click");
});

test("delegate(selector, name, false), undelegate(selector, name, false)", function() {
	expect(3);

	var main = 0;

	jQuery("#qunit-fixture").delegate("#ap", "click", function(e){ main++; });
	jQuery("#ap").trigger("click");
	equals( main, 1, "Verify that the trigger happened correctly." );

	main = 0;
	jQuery("#ap").delegate("#groups", "click", false);
	jQuery("#groups").trigger("click");
	equals( main, 0, "Verify that no bubble happened." );

	main = 0;
	jQuery("#ap").undelegate("#groups", "click", false);
	jQuery("#groups").trigger("click");
	equals( main, 1, "Verify that the trigger happened correctly." );
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
		test: function() {
			ok( true, "Custom event run." );
		},
		submit: function() {
			ok( true, "Custom submit event run." );
		}
	});

	var events = jQuery._data(obj, "events");
	ok( events, "Object has events bound." );
	equals( obj.events, undefined, "Events object on plain objects is not events" );
	equals( obj.test, undefined, "Make sure that test event is not on the plain object." );
	equals( obj.handle, undefined, "Make sure that the event handler is not on the plain object." );

	// Should trigger 1
	jQuery(obj).trigger("test");
	jQuery(obj).trigger("submit");

	jQuery(obj).unbind("test");
	jQuery(obj).unbind("submit");

	// Should trigger 0
	jQuery(obj).trigger("test");

	// Make sure it doesn't complain when no events are found
	jQuery(obj).unbind("test");

	equals( obj && obj[ jQuery.expando ] &&
			obj[ jQuery.expando ][ jQuery.expando ] &&
			obj[ jQuery.expando ][ jQuery.expando ].events, undefined, "Make sure events object is removed" );
});

test("unbind(type)", function() {
	expect( 0 );

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
});

test("unbind(eventObject)", function() {
	expect(4);

	var $elem = jQuery("#firstp"),
		num;

	function assert( expected ){
		num = 0;
		$elem.trigger("foo").triggerHandler("bar");
		equals( num, expected, "Check the right handlers are triggered" );
	}

	$elem
		// This handler shouldn't be unbound
		.bind("foo", function(){
			num += 1;
		})
		.bind("foo", function(e){
			$elem.unbind( e )
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

test("hover()", function() {
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

	equals( times, 4, "hover handlers fired" );
});

test("mouseover triggers mouseenter", function() {
	expect(1);

	var count = 0,
		elem = jQuery("<a />");
	elem.mouseenter(function () {
	  count++;
	});
	elem.trigger("mouseover");
	equals(count, 1, "make sure mouseover triggers a mouseenter" );

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
		equals( e, "an Exception", "mouseenter doesn't catch exceptions" );
	}

	try {
		elem.mouseleave();
	} catch (e) {
		equals( e, "an Exception", "mouseleave doesn't catch exceptions" );
	}
});

test("trigger() shortcuts", function() {
	expect(6);

	var elem = jQuery("<li><a href='#'>Change location</a></li>").prependTo("#firstUL");
	elem.find("a").bind("click", function() {
		var close = jQuery("spanx", this); // same with jQuery(this).find("span");
		equals( close.length, 0, "Context element does not exist, length must be zero" );
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
	equals( counter, 1, "Check that click, triggers onclick event handler also" );

	var clickCounter = 0;
	jQuery("#simon1")[0].onclick = function(event) {
		clickCounter++;
	};
	jQuery("#simon1").click();
	equals( clickCounter, 1, "Check that click, triggers onclick event handler on an a tag also" );

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
	expect(17);

	var win = 0, doc = 0, html = 0, body = 0, main = 0, ap = 0;

	jQuery(window).bind("click", function(e){ win++; });
	jQuery(document).bind("click", function(e){ if ( e.target !== document) { doc++; } });
	jQuery("html").bind("click", function(e){ html++; });
	jQuery("body").bind("click", function(e){ body++; });
	jQuery("#qunit-fixture").bind("click", function(e){ main++; });
	jQuery("#ap").bind("click", function(){ ap++; return false; });

	jQuery("html").trigger("click");
	equals( win, 1, "HTML bubble" );
	equals( doc, 1, "HTML bubble" );
	equals( html, 1, "HTML bubble" );

	jQuery("body").trigger("click");
	equals( win, 2, "Body bubble" );
	equals( doc, 2, "Body bubble" );
	equals( html, 2, "Body bubble" );
	equals( body, 1, "Body bubble" );

	jQuery("#qunit-fixture").trigger("click");
	equals( win, 3, "Main bubble" );
	equals( doc, 3, "Main bubble" );
	equals( html, 3, "Main bubble" );
	equals( body, 2, "Main bubble" );
	equals( main, 1, "Main bubble" );

	jQuery("#ap").trigger("click");
	equals( doc, 3, "ap bubble" );
	equals( html, 3, "ap bubble" );
	equals( body, 2, "ap bubble" );
	equals( main, 1, "ap bubble" );
	equals( ap, 1, "ap bubble" );

	// manually clean up events from elements outside the fixture
	jQuery(document).unbind("click");
	jQuery("html, body, #qunit-fixture").unbind("click");
});

test("trigger(type, [data], [fn])", function() {
	expect(16);

	var handler = function(event, a, b, c) {
		equals( event.type, "click", "check passed data" );
		equals( a, 1, "check passed data" );
		equals( b, "2", "check passed data" );
		equals( c, "abc", "check passed data" );
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
	equals( $elem.triggerHandler("click", [1, "2", "abc"]), "test", "Verify handler response" );

	var pass = true;
	try {
		jQuery("#form input:first").hide().trigger("focus");
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

test("jQuery.Event.currentTarget", function(){
});

test("trigger(eventObject, [data], [fn])", function() {
	expect(25);

	var $parent = jQuery("<div id='par' />").hide().appendTo("body"),
		$child = jQuery("<p id='child'>foo</p>").appendTo( $parent );

	var event = jQuery.Event("noNew");
	ok( event != window, "Instantiate jQuery.Event without the 'new' keyword" );
	equals( event.type, "noNew", "Verify its type" );

	equals( event.isDefaultPrevented(), false, "Verify isDefaultPrevented" );
	equals( event.isPropagationStopped(), false, "Verify isPropagationStopped" );
	equals( event.isImmediatePropagationStopped(), false, "Verify isImmediatePropagationStopped" );

	event.preventDefault();
	equals( event.isDefaultPrevented(), true, "Verify isDefaultPrevented" );
	event.stopPropagation();
	equals( event.isPropagationStopped(), true, "Verify isPropagationStopped" );

	event.isPropagationStopped = function(){ return false };
	event.stopImmediatePropagation();
	equals( event.isPropagationStopped(), true, "Verify isPropagationStopped" );
	equals( event.isImmediatePropagationStopped(), true, "Verify isPropagationStopped" );

	$parent.bind("foo",function(e){
		// Tries bubbling
		equals( e.type, "foo", "Verify event type when passed passing an event object" );
		equals( e.target.id, "child", "Verify event.target when passed passing an event object" );
		equals( e.currentTarget.id, "par", "Verify event.target when passed passing an event object" );
		equals( e.secret, "boo!", "Verify event object's custom attribute when passed passing an event object" );
	});

	// test with an event object
	event = new jQuery.Event("foo");
	event.secret = "boo!";
	$child.trigger(event);

	// test with a literal object
	$child.trigger({type: "foo", secret: "boo!"});

	$parent.unbind();

	function error(){
		ok( false, "This assertion shouldn't be reached");
	}

	$parent.bind("foo", error );

	$child.bind("foo",function(e, a, b, c ){
		equals( arguments.length, 4, "Check arguments length");
		equals( a, 1, "Check first custom argument");
		equals( b, 2, "Check second custom argument");
		equals( c, 3, "Check third custom argument");

		equals( e.isDefaultPrevented(), false, "Verify isDefaultPrevented" );
		equals( e.isPropagationStopped(), false, "Verify isPropagationStopped" );
		equals( e.isImmediatePropagationStopped(), false, "Verify isImmediatePropagationStopped" );

		// Skips both errors
		e.stopImmediatePropagation();

		return "result";
	});

	// We should add this back in when we want to test the order
	// in which event handlers are iterated.
	//$child.bind("foo", error );

	event = new jQuery.Event("foo");
	$child.trigger( event, [1,2,3] ).unbind();
	equals( event.result, "result", "Check event.result attribute");

	// Will error if it bubbles
	$child.triggerHandler("foo");

	$child.unbind();
	$parent.unbind().remove();
});

test("jQuery.Event( type, props )", function() {

	expect(4);

	var event = jQuery.Event( "keydown", { keyCode: 64 }),
			handler = function( event ) {
				ok( "keyCode" in event, "Special property 'keyCode' exists" );
				equal( event.keyCode, 64, "event.keyCode has explicit value '64'" );
			};

	// Supports jQuery.Event implementation
	equal( event.type, "keydown", "Verify type" );

	ok( "keyCode" in event, "Special 'keyCode' property exists" );

	jQuery("body").bind( "keydown", handler ).trigger( event );

	jQuery("body").unbind( "keydown" );

});

test("jQuery.Event.currentTarget", function(){
	expect(1);

	var counter = 0,
		$elem = jQuery("<button>a</button>").click(function(e){
		equals( e.currentTarget, this, "Check currentTarget on "+(counter++?"native":"fake") +" event" );
	});

	// Fake event
	$elem.trigger("click");

	// Cleanup
	$elem.unbind();
});

test("toggle(Function, Function, ...)", function() {
	expect(16);

	var count = 0,
		fn1 = function(e) { count++; },
		fn2 = function(e) { count--; },
		preventDefault = function(e) { e.preventDefault() },
		link = jQuery("#mark");
	link.click(preventDefault).click().toggle(fn1, fn2).click().click().click().click().click();
	equals( count, 1, "Check for toggle(fn, fn)" );

	jQuery("#firstp").toggle(function () {
		equals(arguments.length, 4, "toggle correctly passes through additional triggered arguments, see #1701" )
	}, function() {}).trigger("click", [ 1, 2, 3 ]);

	var first = 0;
	jQuery("#simon1").one("click", function() {
		ok( true, "Execute event only once" );
		jQuery(this).toggle(function() {
			equals( first++, 0, "toggle(Function,Function) assigned from within one('xxx'), see #1054" );
		}, function() {
			equals( first, 1, "toggle(Function,Function) assigned from within one('xxx'), see #1054" );
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
	equals( turn, 1, "Trying toggle with 3 functions, attempt 1 yields 1");
	$div.click();
	equals( turn, 2, "Trying toggle with 3 functions, attempt 2 yields 2");
	$div.click();
	equals( turn, 3, "Trying toggle with 3 functions, attempt 3 yields 3");
	$div.click();
	equals( turn, 1, "Trying toggle with 3 functions, attempt 4 yields 1");
	$div.click();
	equals( turn, 2, "Trying toggle with 3 functions, attempt 5 yields 2");

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
	same( a, [1], "Check that a click worked." );

	$div.toggle(function(){ b.push(1); }, function(){ b.push(2); });
	$div.click();
	same( a, [1,2], "Check that a click worked with a second toggle." );
	same( b, [1], "Check that a click worked with a second toggle." );

	$div.click();
	same( a, [1,2,1], "Check that a click worked with a second toggle, second click." );
	same( b, [1,2], "Check that a click worked with a second toggle, second click." );

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
	equals( submit, 0, "Click on body" );
	equals( div, 0, "Click on body" );
	equals( livea, 0, "Click on body" );
	equals( liveb, 0, "Click on body" );

	// This should trigger two events
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendiv").trigger("click");
	equals( submit, 0, "Click on div" );
	equals( div, 1, "Click on div" );
	equals( livea, 1, "Click on div" );
	equals( liveb, 0, "Click on div" );

	// This should trigger three events (w/ bubbling)
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 0, "Click on inner div" );
	equals( div, 2, "Click on inner div" );
	equals( livea, 1, "Click on inner div" );
	equals( liveb, 1, "Click on inner div" );

	// This should trigger one submit
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendivchild").trigger("submit");
	equals( submit, 1, "Submit on div" );
	equals( div, 0, "Submit on div" );
	equals( livea, 0, "Submit on div" );
	equals( liveb, 0, "Submit on div" );

	// Make sure no other events were removed in the process
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 0, "die Click on inner div" );
	equals( div, 2, "die Click on inner div" );
	equals( livea, 1, "die Click on inner div" );
	equals( liveb, 1, "die Click on inner div" );

	// Now make sure that the removal works
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendivchild").die("click");
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 0, "die Click on inner div" );
	equals( div, 2, "die Click on inner div" );
	equals( livea, 1, "die Click on inner div" );
	equals( liveb, 0, "die Click on inner div" );

	// Make sure that the click wasn't removed too early
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendiv").trigger("click");
	equals( submit, 0, "die Click on inner div" );
	equals( div, 1, "die Click on inner div" );
	equals( livea, 1, "die Click on inner div" );
	equals( liveb, 0, "die Click on inner div" );

	// Make sure that stopPropgation doesn't stop live events
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendivchild").live("click", function(e){ liveb++; e.stopPropagation(); });
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 0, "stopPropagation Click on inner div" );
	equals( div, 1, "stopPropagation Click on inner div" );
	equals( livea, 0, "stopPropagation Click on inner div" );
	equals( liveb, 1, "stopPropagation Click on inner div" );

	// Make sure click events only fire with primary click
	submit = 0, div = 0, livea = 0, liveb = 0;
	var event = jQuery.Event("click");
	event.button = 1;
	jQuery("div#nothiddendiv").trigger(event);

	equals( livea, 0, "live secondary click" );

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
	equals( clicked, 2, "live with a context" );

	// Make sure the event is actually stored on the context
	ok( jQuery._data(container, "events").live, "live with a context" );

	// Test unbinding with a different context
	jQuery("#foo", container).die("click");
	jQuery("#foo").trigger("click");
	equals( clicked, 2, "die with a context");

	// Test binding with event data
	jQuery("#foo").live("click", true, function(e){ equals( e.data, true, "live with event data" ); });
	jQuery("#foo").trigger("click").die("click");

	// Test binding with trigger data
	jQuery("#foo").live("click", function(e, data){ equals( data, true, "live with trigger data" ); });
	jQuery("#foo").trigger("click", true).die("click");

	// Test binding with different this object
	jQuery("#foo").live("click", jQuery.proxy(function(e){ equals( this.foo, "bar", "live with event scope" ); }, { foo: "bar" }));
	jQuery("#foo").trigger("click").die("click");

	// Test binding with different this object, event data, and trigger data
	jQuery("#foo").live("click", true, jQuery.proxy(function(e, data){
		equals( e.data, true, "live with with different this object, event data, and trigger data" );
		equals( this.foo, "bar", "live with with different this object, event data, and trigger data" );
		equals( data, true, "live with with different this object, event data, and trigger data")
	}, { foo: "bar" }));
	jQuery("#foo").trigger("click", true).die("click");

	// Verify that return false prevents default action
	jQuery("#anchor2").live("click", function(){ return false; });
	var hash = window.location.hash;
	jQuery("#anchor2").trigger("click");
	equals( window.location.hash, hash, "return false worked" );
	jQuery("#anchor2").die("click");

	// Verify that .preventDefault() prevents default action
	jQuery("#anchor2").live("click", function(e){ e.preventDefault(); });
	var hash = window.location.hash;
	jQuery("#anchor2").trigger("click");
	equals( window.location.hash, hash, "e.preventDefault() worked" );
	jQuery("#anchor2").die("click");

	// Test binding the same handler to multiple points
	var called = 0;
	function callback(){ called++; return false; }

	jQuery("#nothiddendiv").live("click", callback);
	jQuery("#anchor2").live("click", callback);

	jQuery("#nothiddendiv").trigger("click");
	equals( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery("#anchor2").trigger("click");
	equals( called, 1, "Verify that only one click occurred." );

	// Make sure that only one callback is removed
	jQuery("#anchor2").die("click", callback);

	called = 0;
	jQuery("#nothiddendiv").trigger("click");
	equals( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery("#anchor2").trigger("click");
	equals( called, 0, "Verify that no click occurred." );

	// Make sure that it still works if the selector is the same,
	// but the event type is different
	jQuery("#nothiddendiv").live("foo", callback);

	// Cleanup
	jQuery("#nothiddendiv").die("click", callback);

	called = 0;
	jQuery("#nothiddendiv").trigger("click");
	equals( called, 0, "Verify that no click occurred." );

	called = 0;
	jQuery("#nothiddendiv").trigger("foo");
	equals( called, 1, "Verify that one foo occurred." );

	// Cleanup
	jQuery("#nothiddendiv").die("foo", callback);

	// Make sure we don't loose the target by DOM modifications
	// after the bubble already reached the liveHandler
	var livec = 0, elemDiv = jQuery("#nothiddendivchild").html("<span></span>").get(0);

	jQuery("#nothiddendivchild").live("click", function(e){ jQuery("#nothiddendivchild").html(""); });
	jQuery("#nothiddendivchild").live("click", function(e){ if(e.target) {livec++;} });

	jQuery("#nothiddendiv span").click();
	equals( jQuery("#nothiddendiv span").length, 0, "Verify that first handler occurred and modified the DOM." );
	equals( livec, 1, "Verify that second handler occurred even with nuked target." );

	// Cleanup
	jQuery("#nothiddendivchild").die("click");

	// Verify that .live() ocurs and cancel buble in the same order as
	// we would expect .bind() and .click() without delegation
	var lived = 0, livee = 0;

	// bind one pair in one order
	jQuery("span#liveSpan1 a").live("click", function(){ lived++; return false; });
	jQuery("span#liveSpan1").live("click", function(){ livee++; });

	jQuery("span#liveSpan1 a").click();
	equals( lived, 1, "Verify that only one first handler occurred." );
	equals( livee, 0, "Verify that second handler doesn't." );

	// and one pair in inverse
	jQuery("span#liveSpan2").live("click", function(){ livee++; });
	jQuery("span#liveSpan2 a").live("click", function(){ lived++; return false; });

	lived = 0;
	livee = 0;
	jQuery("span#liveSpan2 a").click();
	equals( lived, 1, "Verify that only one first handler occurred." );
	equals( livee, 0, "Verify that second handler doesn't." );

	// Cleanup
	jQuery("span#liveSpan1 a").die("click")
	jQuery("span#liveSpan1").die("click");
	jQuery("span#liveSpan2 a").die("click");
	jQuery("span#liveSpan2").die("click");

	// Test this, target and currentTarget are correct
	jQuery("span#liveSpan1").live("click", function(e){
		equals( this.id, "liveSpan1", "Check the this within a live handler" );
		equals( e.currentTarget.id, "liveSpan1", "Check the event.currentTarget within a live handler" );
		equals( e.target.nodeName.toUpperCase(), "A", "Check the event.target within a live handler" );
	});

	jQuery("span#liveSpan1 a").click();

	jQuery("span#liveSpan1").die("click");

	// Work with deep selectors
	livee = 0;

	function clickB(){ livee++; }

	jQuery("#nothiddendiv div").live("click", function(){ livee++; });
	jQuery("#nothiddendiv div").live("click", clickB);
	jQuery("#nothiddendiv div").live("mouseover", function(){ livee++; });

	equals( livee, 0, "No clicks, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equals( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("mouseover");
	equals( livee, 1, "Mouseover, deep selector." );

	jQuery("#nothiddendiv div").die("mouseover");

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equals( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("mouseover");
	equals( livee, 0, "Mouseover, deep selector." );

	jQuery("#nothiddendiv div").die("click", clickB);

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equals( livee, 1, "Click, deep selector." );

	jQuery("#nothiddendiv div").die("click");

	jQuery("#nothiddendiv div").live("blur", function(){
		ok( true, "Live div trigger blur." );
	});

	jQuery("#nothiddendiv div").trigger("blur");

	jQuery("#nothiddendiv div").die("blur");
});

test("die all bound events", function(){
	expect(1);

	var count = 0;
	var div = jQuery("div#nothiddendivchild");

	div.live("click submit", function(){ count++; });
	div.die();

	div.trigger("click");
	div.trigger("submit");

	equals( count, 0, "Make sure no events were triggered." );
});

test("live with multiple events", function(){
	expect(1);

	var count = 0;
	var div = jQuery("div#nothiddendivchild");

	div.live("click submit", function(){ count++; });

	div.trigger("click");
	div.trigger("submit");

	equals( count, 2, "Make sure both the click and submit were triggered." );

	// manually clean up events from elements outside the fixture
	div.die();
});

test("live with namespaces", function(){
	expect(12);

	var count1 = 0, count2 = 0;

	jQuery("#liveSpan1").live("foo.bar", function(e){
		count1++;
	});

	jQuery("#liveSpan1").live("foo.zed", function(e){
		count2++;
	});

	jQuery("#liveSpan1").trigger("foo.bar");
	equals( count1, 1, "Got live foo.bar" );
	equals( count2, 0, "Got live foo.bar" );

	count1 = 0, count2 = 0;

	jQuery("#liveSpan1").trigger("foo.zed");
	equals( count1, 0, "Got live foo.zed" );
	equals( count2, 1, "Got live foo.zed" );

	//remove one
	count1 = 0, count2 = 0;

	jQuery("#liveSpan1").die("foo.zed");
	jQuery("#liveSpan1").trigger("foo.bar");

	equals( count1, 1, "Got live foo.bar after dieing foo.zed" );
	equals( count2, 0, "Got live foo.bar after dieing foo.zed" );

	count1 = 0, count2 = 0;

	jQuery("#liveSpan1").trigger("foo.zed");
	equals( count1, 0, "Got live foo.zed" );
	equals( count2, 0, "Got live foo.zed" );

	//remove the other
	jQuery("#liveSpan1").die("foo.bar");

	count1 = 0, count2 = 0;

	jQuery("#liveSpan1").trigger("foo.bar");
	equals( count1, 0, "Did not respond to foo.bar after dieing it" );
	equals( count2, 0, "Did not respond to foo.bar after dieing it" );

	jQuery("#liveSpan1").trigger("foo.zed");
	equals( count1, 0, "Did not trigger foo.zed again" );
	equals( count2, 0, "Did not trigger foo.zed again" );
});

test("live with change", function(){
	expect(8);

	var selectChange = 0, checkboxChange = 0;

	var select = jQuery("select[name='S1']")
	select.live("change", function() {
		selectChange++;
	});

	var checkbox = jQuery("#check2"),
		checkboxFunction = function(){
			checkboxChange++;
		}
	checkbox.live("change", checkboxFunction);

	// test click on select

	// second click that changed it
	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equals( selectChange, 1, "Change on click." );

	// test keys on select
	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equals( selectChange, 1, "Change on keyup." );

	// test click on checkbox
	checkbox.trigger("change");
	equals( checkboxChange, 1, "Change on checkbox." );

	// test blur/focus on text
	var text = jQuery("#name"), textChange = 0, oldTextVal = text.val();
	text.live("change", function() {
		textChange++;
	});

	text.val(oldTextVal+"foo");
	text.trigger("change");
	equals( textChange, 1, "Change on text input." );

	text.val(oldTextVal);
	text.die("change");

	// test blur/focus on password
	var password = jQuery("#name"), passwordChange = 0, oldPasswordVal = password.val();
	password.live("change", function() {
		passwordChange++;
	});

	password.val(oldPasswordVal + "foo");
	password.trigger("change");
	equals( passwordChange, 1, "Change on password input." );

	password.val(oldPasswordVal);
	password.die("change");

	// make sure die works

	// die all changes
	selectChange = 0;
	select.die("change");
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equals( selectChange, 0, "Die on click works." );

	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equals( selectChange, 0, "Die on keyup works." );

	// die specific checkbox
	checkbox.die("change", checkboxFunction);
	checkbox.trigger("change");
	equals( checkboxChange, 1, "Die on checkbox." );
});

test("live with submit", function() {
	expect(5);

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
	equals( count1, 1, "Verify form submit." );
	equals( count2, 1, "Verify body submit." );

	jQuery("#testForm input[name=sub1]").live("click", function(ev) {
		ok( true, "cancelling submit still calls click handler" );
	});

	jQuery("#testForm input[name=sub1]")[0].click();
	equals( count1, 2, "Verify form submit." );
	equals( count2, 2, "Verify body submit." );

	jQuery("#testForm").die("submit");
	jQuery("#testForm input[name=sub1]").die("click");
	jQuery("body").die("submit");
});

test("live with special events", function() {
	expect(13);

	jQuery.event.special.foo = {
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
		_default: function( event ) {
			ok( true, "Default run." );
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
	jQuery("#liveSpan1").trigger("foo");

	// Run: Handler 1, Default
	// TODO: Namespace doesn't trigger default (?)
	jQuery("#liveSpan1").trigger("foo.a");

	// Run: remove
	jQuery("#liveSpan1").die("foo.a");

	// Run: Handler 2, Default
	jQuery("#liveSpan1").trigger("foo");

	// Run: remove, teardown
	jQuery("#liveSpan1").die("foo");

	delete jQuery.event.special.foo;
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
	equals( submit, 0, "Click on body" );
	equals( div, 0, "Click on body" );
	equals( livea, 0, "Click on body" );
	equals( liveb, 0, "Click on body" );

	// This should trigger two events
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendiv").trigger("click");
	equals( submit, 0, "Click on div" );
	equals( div, 1, "Click on div" );
	equals( livea, 1, "Click on div" );
	equals( liveb, 0, "Click on div" );

	// This should trigger three events (w/ bubbling)
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 0, "Click on inner div" );
	equals( div, 2, "Click on inner div" );
	equals( livea, 1, "Click on inner div" );
	equals( liveb, 1, "Click on inner div" );

	// This should trigger one submit
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendivchild").trigger("submit");
	equals( submit, 1, "Submit on div" );
	equals( div, 0, "Submit on div" );
	equals( livea, 0, "Submit on div" );
	equals( liveb, 0, "Submit on div" );

	// Make sure no other events were removed in the process
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 0, "undelegate Click on inner div" );
	equals( div, 2, "undelegate Click on inner div" );
	equals( livea, 1, "undelegate Click on inner div" );
	equals( liveb, 1, "undelegate Click on inner div" );

	// Now make sure that the removal works
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("#body").undelegate("div#nothiddendivchild", "click");
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 0, "undelegate Click on inner div" );
	equals( div, 2, "undelegate Click on inner div" );
	equals( livea, 1, "undelegate Click on inner div" );
	equals( liveb, 0, "undelegate Click on inner div" );

	// Make sure that the click wasn't removed too early
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("div#nothiddendiv").trigger("click");
	equals( submit, 0, "undelegate Click on inner div" );
	equals( div, 1, "undelegate Click on inner div" );
	equals( livea, 1, "undelegate Click on inner div" );
	equals( liveb, 0, "undelegate Click on inner div" );

	// Make sure that stopPropgation doesn't stop live events
	submit = 0, div = 0, livea = 0, liveb = 0;
	jQuery("#body").delegate("div#nothiddendivchild", "click", function(e){ liveb++; e.stopPropagation(); });
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 0, "stopPropagation Click on inner div" );
	equals( div, 1, "stopPropagation Click on inner div" );
	equals( livea, 0, "stopPropagation Click on inner div" );
	equals( liveb, 1, "stopPropagation Click on inner div" );

	// Make sure click events only fire with primary click
	submit = 0, div = 0, livea = 0, liveb = 0;
	var event = jQuery.Event("click");
	event.button = 1;
	jQuery("div#nothiddendiv").trigger(event);

	equals( livea, 0, "delegate secondary click" );

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
	equals( clicked, 2, "delegate with a context" );

	// Make sure the event is actually stored on the context
	ok( jQuery._data(container, "events").live, "delegate with a context" );

	// Test unbinding with a different context
	jQuery("#qunit-fixture").undelegate("#foo", "click");
	jQuery("#foo").trigger("click");
	equals( clicked, 2, "undelegate with a context");

	// Test binding with event data
	jQuery("#body").delegate("#foo", "click", true, function(e){ equals( e.data, true, "delegate with event data" ); });
	jQuery("#foo").trigger("click");
	jQuery("#body").undelegate("#foo", "click");

	// Test binding with trigger data
	jQuery("#body").delegate("#foo", "click", function(e, data){ equals( data, true, "delegate with trigger data" ); });
	jQuery("#foo").trigger("click", true);
	jQuery("#body").undelegate("#foo", "click");

	// Test binding with different this object
	jQuery("#body").delegate("#foo", "click", jQuery.proxy(function(e){ equals( this.foo, "bar", "delegate with event scope" ); }, { foo: "bar" }));
	jQuery("#foo").trigger("click");
	jQuery("#body").undelegate("#foo", "click");

	// Test binding with different this object, event data, and trigger data
	jQuery("#body").delegate("#foo", "click", true, jQuery.proxy(function(e, data){
		equals( e.data, true, "delegate with with different this object, event data, and trigger data" );
		equals( this.foo, "bar", "delegate with with different this object, event data, and trigger data" );
		equals( data, true, "delegate with with different this object, event data, and trigger data")
	}, { foo: "bar" }));
	jQuery("#foo").trigger("click", true);
	jQuery("#body").undelegate("#foo", "click");

	// Verify that return false prevents default action
	jQuery("#body").delegate("#anchor2", "click", function(){ return false; });
	var hash = window.location.hash;
	jQuery("#anchor2").trigger("click");
	equals( window.location.hash, hash, "return false worked" );
	jQuery("#body").undelegate("#anchor2", "click");

	// Verify that .preventDefault() prevents default action
	jQuery("#body").delegate("#anchor2", "click", function(e){ e.preventDefault(); });
	var hash = window.location.hash;
	jQuery("#anchor2").trigger("click");
	equals( window.location.hash, hash, "e.preventDefault() worked" );
	jQuery("#body").undelegate("#anchor2", "click");

	// Test binding the same handler to multiple points
	var called = 0;
	function callback(){ called++; return false; }

	jQuery("#body").delegate("#nothiddendiv", "click", callback);
	jQuery("#body").delegate("#anchor2", "click", callback);

	jQuery("#nothiddendiv").trigger("click");
	equals( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery("#anchor2").trigger("click");
	equals( called, 1, "Verify that only one click occurred." );

	// Make sure that only one callback is removed
	jQuery("#body").undelegate("#anchor2", "click", callback);

	called = 0;
	jQuery("#nothiddendiv").trigger("click");
	equals( called, 1, "Verify that only one click occurred." );

	called = 0;
	jQuery("#anchor2").trigger("click");
	equals( called, 0, "Verify that no click occurred." );

	// Make sure that it still works if the selector is the same,
	// but the event type is different
	jQuery("#body").delegate("#nothiddendiv", "foo", callback);

	// Cleanup
	jQuery("#body").undelegate("#nothiddendiv", "click", callback);

	called = 0;
	jQuery("#nothiddendiv").trigger("click");
	equals( called, 0, "Verify that no click occurred." );

	called = 0;
	jQuery("#nothiddendiv").trigger("foo");
	equals( called, 1, "Verify that one foo occurred." );

	// Cleanup
	jQuery("#body").undelegate("#nothiddendiv", "foo", callback);

	// Make sure we don't loose the target by DOM modifications
	// after the bubble already reached the liveHandler
	var livec = 0, elemDiv = jQuery("#nothiddendivchild").html("<span></span>").get(0);

	jQuery("#body").delegate("#nothiddendivchild", "click", function(e){ jQuery("#nothiddendivchild").html(""); });
	jQuery("#body").delegate("#nothiddendivchild", "click", function(e){ if(e.target) {livec++;} });

	jQuery("#nothiddendiv span").click();
	equals( jQuery("#nothiddendiv span").length, 0, "Verify that first handler occurred and modified the DOM." );
	equals( livec, 1, "Verify that second handler occurred even with nuked target." );

	// Cleanup
	jQuery("#body").undelegate("#nothiddendivchild", "click");

	// Verify that .live() ocurs and cancel buble in the same order as
	// we would expect .bind() and .click() without delegation
	var lived = 0, livee = 0;

	// bind one pair in one order
	jQuery("#body").delegate("span#liveSpan1 a", "click", function(){ lived++; return false; });
	jQuery("#body").delegate("span#liveSpan1", "click", function(){ livee++; });

	jQuery("span#liveSpan1 a").click();
	equals( lived, 1, "Verify that only one first handler occurred." );
	equals( livee, 0, "Verify that second handler doesn't." );

	// and one pair in inverse
	jQuery("#body").delegate("span#liveSpan2", "click", function(){ livee++; });
	jQuery("#body").delegate("span#liveSpan2 a", "click", function(){ lived++; return false; });

	lived = 0;
	livee = 0;
	jQuery("span#liveSpan2 a").click();
	equals( lived, 1, "Verify that only one first handler occurred." );
	equals( livee, 0, "Verify that second handler doesn't." );

	// Cleanup
	jQuery("#body").undelegate("click");

	// Test this, target and currentTarget are correct
	jQuery("#body").delegate("span#liveSpan1", "click", function(e){
		equals( this.id, "liveSpan1", "Check the this within a delegate handler" );
		equals( e.currentTarget.id, "liveSpan1", "Check the event.currentTarget within a delegate handler" );
		equals( e.target.nodeName.toUpperCase(), "A", "Check the event.target within a delegate handler" );
	});

	jQuery("span#liveSpan1 a").click();

	jQuery("#body").undelegate("span#liveSpan1", "click");

	// Work with deep selectors
	livee = 0;

	function clickB(){ livee++; }

	jQuery("#body").delegate("#nothiddendiv div", "click", function(){ livee++; });
	jQuery("#body").delegate("#nothiddendiv div", "click", clickB);
	jQuery("#body").delegate("#nothiddendiv div", "mouseover", function(){ livee++; });

	equals( livee, 0, "No clicks, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equals( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("mouseover");
	equals( livee, 1, "Mouseover, deep selector." );

	jQuery("#body").undelegate("#nothiddendiv div", "mouseover");

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equals( livee, 2, "Click, deep selector." );

	livee = 0;
	jQuery("#nothiddendivchild").trigger("mouseover");
	equals( livee, 0, "Mouseover, deep selector." );

	jQuery("#body").undelegate("#nothiddendiv div", "click", clickB);

	livee = 0;
	jQuery("#nothiddendivchild").trigger("click");
	equals( livee, 1, "Click, deep selector." );

	jQuery("#body").undelegate("#nothiddendiv div", "click");
});

test("undelegate all bound events", function(){
	expect(1);

	var count = 0;
	var div = jQuery("#body");

	div.delegate("div#nothiddendivchild", "click submit", function(){ count++; });
	div.undelegate();

	jQuery("div#nothiddendivchild").trigger("click");
	jQuery("div#nothiddendivchild").trigger("submit");

	equals( count, 0, "Make sure no events were triggered." );
});

test("delegate with multiple events", function(){
	expect(1);

	var count = 0;
	var div = jQuery("#body");

	div.delegate("div#nothiddendivchild", "click submit", function(){ count++; });

	jQuery("div#nothiddendivchild").trigger("click");
	jQuery("div#nothiddendivchild").trigger("submit");

	equals( count, 2, "Make sure both the click and submit were triggered." );

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
		}
	jQuery("#body").delegate("#check2", "change", checkboxFunction);

	// test click on select

	// second click that changed it
	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equals( selectChange, 1, "Change on click." );

	// test keys on select
	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equals( selectChange, 1, "Change on keyup." );

	// test click on checkbox
	checkbox.trigger("change");
	equals( checkboxChange, 1, "Change on checkbox." );

	// test blur/focus on text
	var text = jQuery("#name"), textChange = 0, oldTextVal = text.val();
	jQuery("#body").delegate("#name", "change", function() {
		textChange++;
	});

	text.val(oldTextVal+"foo");
	text.trigger("change");
	equals( textChange, 1, "Change on text input." );

	text.val(oldTextVal);
	jQuery("#body").die("change");

	// test blur/focus on password
	var password = jQuery("#name"), passwordChange = 0, oldPasswordVal = password.val();
	jQuery("#body").delegate("#name", "change", function() {
		passwordChange++;
	});

	password.val(oldPasswordVal + "foo");
	password.trigger("change");
	equals( passwordChange, 1, "Change on password input." );

	password.val(oldPasswordVal);
	jQuery("#body").undelegate("#name", "change");

	// make sure die works

	// die all changes
	selectChange = 0;
	jQuery("#body").undelegate("select[name='S1']", "change");
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equals( selectChange, 0, "Die on click works." );

	selectChange = 0;
	select[0].selectedIndex = select[0].selectedIndex ? 0 : 1;
	select.trigger("change");
	equals( selectChange, 0, "Die on keyup works." );

	// die specific checkbox
	jQuery("#body").undelegate("#check2", "change", checkboxFunction);
	checkbox.trigger("change");
	equals( checkboxChange, 1, "Die on checkbox." );
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
	equals( count1, 1, "Verify form submit." );
	equals( count2, 1, "Verify body submit." );

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

	equals( count, 1, "delegated click.ns");

	$delegate.undelegate(".ns");

	jQuery("a", $delegate).eq(1).trigger("click.ns");

	equals( count, 1, "no more .ns after undelegate");
});

test("Non DOM element events", function() {
	expect(1);

	var o = {};

	jQuery(o).bind("nonelementobj", function(e) {
		ok( true, "Event on non-DOM object triggered" );
	});

	jQuery(o).trigger("nonelementobj");
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
	expect(5);

	var input = jQuery( "<input type='text' />" ).prependTo( "body" ),
		order = 0;

	jQuery( "body" ).bind( "focusin.focusinBubblesTest", function(){
		equals( 1, order++, "focusin on the body second" );
	});

	input.bind( "focusin.focusinBubblesTest", function(){
		equals( 0, order++, "focusin on the element first" );
	});

	// DOM focus method
	input[0].focus();

	// To make the next focus test work, we need to take focus off the input.
	// This will fire another focusin event, so set order to reflect that.
	order = 1;
	jQuery("#text1")[0].focus();

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
	};
	tab.remove();

});

(function(){
	// This code must be run before DOM ready!
	var notYetReady, noEarlyExecution,
		order = [],
		args = {};

	notYetReady = !jQuery.isReady;

	test("jQuery.isReady", function() {
		expect(2);

		equals(notYetReady, true, "jQuery.isReady should not be true before DOM ready");
		equals(jQuery.isReady, true, "jQuery.isReady should be true once DOM is ready");
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

	noEarlyExecution = order.length == 0;

	// This assumes that QUnit tests are run on DOM ready!
	test("jQuery ready", function() {
		expect(10);

		ok(noEarlyExecution, "Handlers bound to DOM ready should not execute before DOM ready");

		// Ensure execution order.
		same(order, ["a", "b", "d", "e", "c", "f"], "Bound DOM ready handlers should execute in bind-order, but those bound with jQuery(document).bind( 'ready', fn ) will always execute last");

		// Ensure handler argument is correct.
		equals(args.a, jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery");
		equals(args.b, jQuery, "Argument passed to fn in jQuery(document).ready( fn ) should be jQuery");
		ok(args.c instanceof jQuery.Event, "Argument passed to fn in jQuery(document).bind( 'ready', fn ) should be an event object");

		order = [];

		// Now that the ready event has fired, again bind to the ready event
		// in every possible way. These event handlers should execute immediately.
		jQuery(makeHandler("g"));
		equals(order.pop(), "g", "Event handler should execute immediately");
		equals(args.g, jQuery, "Argument passed to fn in jQuery( fn ) should be jQuery");

		jQuery(document).ready(makeHandler("h"));
		equals(order.pop(), "h", "Event handler should execute immediately");
		equals(args.h, jQuery, "Argument passed to fn in jQuery(document).ready( fn ) should be jQuery");

		jQuery(document).bind("ready.readytest", makeHandler("never"));
		equals(order.length, 0, "Event handler should never execute since DOM ready has already passed");

		// Cleanup.
		jQuery(document).unbind("ready.readytest");
	});

})();

/*
test("event properties", function() {
	stop();
	jQuery("#simon1").click(function(event) {
		ok( event.timeStamp, "assert event.timeStamp is present" );
		start();
	}).click();
});
*/

