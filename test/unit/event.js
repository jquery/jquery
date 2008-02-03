module("event");

test("bind(), with data", function() {
	expect(3);
	var handler = function(event) {
		ok( event.data, "bind() with data, check passed data exists" );
		ok( event.data.foo == "bar", "bind() with data, Check value of passed data" );
	};
	$("#firstp").bind("click", {foo: "bar"}, handler).click().unbind("click", handler);

	ok( !jQuery.data($("#firstp")[0], "events"), "Event handler unbound when using data." );
});

test("bind(), with data, trigger with data", function() {
	expect(4);
	var handler = function(event, data) {
		ok( event.data, "check passed data exists" );
		ok( event.data.foo == "bar", "Check value of passed data" );
		ok( data, "Check trigger data" );
		ok( data.bar == "foo", "Check value of trigger data" );
	};
	$("#firstp").bind("click", {foo: "bar"}, handler).trigger("click", [{bar: "foo"}]).unbind("click", handler);
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
	$("#firstp").bind("click mouseover", handler).trigger("click").trigger("mouseover");
	ok( clickCounter == 1, "bind() with multiple events at once" );
	ok( mouseoverCounter == 1, "bind() with multiple events at once" );
});

test("bind(), no data", function() {
	expect(1);
	var handler = function(event) {
		ok ( !event.data, "Check that no data is added to the event object" );
	};
	$("#firstp").bind("click", handler).trigger("click");
});

test("bind(), iframes", function() {
	// events don't work with iframes, see #939 - this test fails in IE because of contentDocument
	// var doc = document.getElementById("iframe").contentDocument;
	// 
	// doc.body.innerHTML = "<input type='text'/>";
	//
	// var input = doc.getElementsByTagName("input")[0];
	//
	// $(input).bind("click",function() {
	// 	ok( true, "Binding to element inside iframe" );
	// }).click();
});

test("bind(), trigger change on select", function() {
	expect(3);
	var counter = 0;
	function selectOnChange(event) {
		equals( event.data, counter++, "Event.data is not a global event object" );
	};
	$("#form select").each(function(i){
		$(this).bind('change', i, selectOnChange);
	}).trigger('change');
});

test("bind(), namespaced events, cloned events", function() {
	expect(6);

	$("#firstp").bind("custom.test",function(e){
		ok(true, "Custom event triggered");
	});

	$("#firstp").bind("click",function(e){
		ok(true, "Normal click triggered");
	});

	$("#firstp").bind("click.test",function(e){
		ok(true, "Namespaced click triggered");
	});

	// Trigger both bound fn (2)
	$("#firstp").trigger("click");

	// Trigger one bound fn (1)
	$("#firstp").trigger("click.test");

	// Remove only the one fn
	$("#firstp").unbind("click.test");

	// Trigger the remaining fn (1)
	$("#firstp").trigger("click");

	// Remove the remaining fn
	$("#firstp").unbind(".test");

	// Trigger the remaining fn (0)
	$("#firstp").trigger("custom");

	// using contents will get comments regular, text, and comment nodes
	$("#nonnodes").contents().bind("tester", function () {
		equals(this.nodeType, 1, "Check node,textnode,comment bind just does real nodes" );
	}).trigger("tester");

	// Make sure events stick with appendTo'd elements (which are cloned) #2027
	$("<a href='#fail' class='test'>test</a>").click(function(){ return false; }).appendTo("p");
	ok( $("a.test:first").triggerHandler("click") === false, "Handler is bound to appendTo'd elements" );
});

test("click()", function() {
	expect(4);
	$('<li><a href="#">Change location</a></li>').prependTo('#firstUL').find('a').bind('click', function() {
		var close = $('spanx', this); // same with $(this).find('span');
		ok( close.length == 0, "Context element does not exist, length must be zero" );
		ok( !close[0], "Context element does not exist, direct access to element must return undefined" );
		return false;
	}).click();
	
	$("#check1").click(function() {
		ok( true, "click event handler for checkbox gets fired twice, see #815" );
	}).click();
	
	var counter = 0;
	$('#firstp')[0].onclick = function(event) {
		counter++;
	};
	$('#firstp').click();
	ok( counter == 1, "Check that click, triggers onclick event handler also" );
});

test("unbind(event)", function() {
	expect(8);
	var el = $("#firstp");
	el.click(function() {
		ok( true, "Fake normal bind" );
	});
	el.click(function(event) {
		el.unbind(event);
		ok( true, "Fake onebind" );
	});
	el.click().click();
	
	el.click(function() { return; });
	el.unbind('click');
	ok( !el[0].onclick, "Handler is removed" ); // Bug #964

	el.click(function() { return; });
	el.unbind('change',function(){ return; });
	for (var ret in jQuery.data(el[0], "events")['click']) break;
	ok( ret, "Extra handlers weren't accidentally removed." );

	el.unbind('click');
	ok( !jQuery.data(el[0], "events"), "Removed the events expando after all handlers are unbound." );
	
	reset();
	var clickCounter = mouseoverCounter = 0;
	var handler = function(event) {
		if (event.type == "click")
			clickCounter += 1;
		else if (event.type == "mouseover")
			mouseoverCounter += 1;
	};
	$("#firstp").bind("click mouseover", handler).unbind("click mouseover", handler).trigger("click").trigger("mouseover");
	ok( clickCounter == 0, "unbind() with multiple events at once" );
	ok( mouseoverCounter == 0, "unbind() with multiple events at once" );
});

test("trigger(event, [data], [fn])", function() {
	expect(67);

	var handler = function(event, a, b, c) {
		equals( event.type, "click", "check passed data" );
		equals( a, 1, "check passed data" );
		equals( b, "2", "check passed data" );
		equals( c, "abc", "check passed data" );
		return "test";
	};

	var handler2 = function(a, b, c) {
		equals( a, 1, "check passed data" );
		equals( b, "2", "check passed data" );
		equals( c, "abc", "check passed data" );
		return false;
	};

	var handler3 = function(a, b, c, v) {
		equals( a, 1, "check passed data" );
		equals( b, "2", "check passed data" );
		equals( c, "abc", "check passed data" );
		equals( v, "test", "check current value" );
		return "newVal";
	};

	var handler4 = function(a, b, c, v) {
		equals( a, 1, "check passed data" );
		equals( b, "2", "check passed data" );
		equals( c, "abc", "check passed data" );
		equals( v, "test", "check current value" );
	};

	// Simulate a "native" click
	$("#firstp")[0].click = function(){
		ok( true, "Native call was triggered" );
	};

	// Triggers handlrs and native
	// Trigger 5
	$("#firstp").bind("click", handler).trigger("click", [1, "2", "abc"]);

	// Triggers handlers, native, and extra fn
	// Triggers 9
	$("#firstp").trigger("click", [1, "2", "abc"], handler4);

	// Simulate a "native" click
	$("#firstp")[0].click = function(){
		ok( false, "Native call was triggered" );
	};

	// Triggers handlers, native, and extra fn
	// Triggers 7
	$("#firstp").trigger("click", [1, "2", "abc"], handler2);

	// Trigger only the handlers (no native)
	// Triggers 5
	equals( $("#firstp").triggerHandler("click", [1, "2", "abc"]), "test", "Verify handler response" );

	// Trigger only the handlers (no native) and extra fn
	// Triggers 8
	equals( $("#firstp").triggerHandler("click", [1, "2", "abc"], handler2), false, "Verify handler response" );

	// Build fake click event to pass in
	var eventObj = jQuery.event.fix({ type: "foo", target: document.body });

	// Trigger only the handlers (no native), with external event obj
	// Triggers 5
	equals( $("#firstp").triggerHandler("click", [eventObj, 1, "2", "abc"]), "test", "Verify handler response" );

	// Trigger only the handlers (no native) and extra fn, with external event obj
	// Triggers 9
	eventObj = jQuery.event.fix({ type: "foo", target: document.body });
	equals( $("#firstp").triggerHandler("click", [eventObj, 1, "2", "abc"], handler), "test", "Verify handler response" );
	
	var pass = true;
	try {
		$('input:first')
			.hide()
			.trigger('focus');
	} catch(e) {
		pass = false;
	}
	ok( pass, "Trigger focus on hidden element" );

	// have the extra handler override the return
	// Triggers 9
	equals( $("#firstp").triggerHandler("click", [1, "2", "abc"], handler3), "newVal", "Verify triggerHandler return is overwritten by extra function" );

	// have the extra handler leave the return value alone
	// Triggers 9
	equals( $("#firstp").triggerHandler("click", [1, "2", "abc"], handler4), "test", "Verify triggerHandler return is not overwritten by extra function" );
});

test("toggle(Function, Function)", function() {
	expect(5);
	var count = 0,
		fn1 = function(e) { count++; },
		fn2 = function(e) { count--; },
		preventDefault = function(e) { e.preventDefault() },
		link = $('#mark');
	link.click(preventDefault).click().toggle(fn1, fn2).click().click().click().click().click();
	ok( count == 1, "Check for toggle(fn, fn)" );

	$("#firstp").toggle(function () {
		equals(arguments.length, 4, "toggle correctly passes through additional triggered arguments, see #1701" )
	}, function() {}).trigger("click", [ 1, 2, 3 ]);

	var first = 0;
	$("#simon1").one("click", function() {
		ok( true, "Execute event only once" );
		$(this).toggle(function() {
			ok( first++ == 0, "toggle(Function,Function) assigned from within one('xxx'), see #1054" );
		}, function() {
			ok( first == 1, "toggle(Function,Function) assigned from within one('xxx'), see #1054" );
		});
		return false;
	}).click().click().click();
});

test("jQuery(function($) {})", function() {
	stop();
	jQuery(function($) {
		equals(jQuery, $, "ready doesn't provide an event object, instead it provides a reference to the jQuery function, see http://docs.jquery.com/Events/ready#fn");
		start();
	});
});
