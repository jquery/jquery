module("event");

test("bind(), with data", function() {
	expect(3);
	var handler = function(event) {
		ok( event.data, "bind() with data, check passed data exists" );
		equals( event.data.foo, "bar", "bind() with data, Check value of passed data" );
	};
	jQuery("#firstp").bind("click", {foo: "bar"}, handler).click().unbind("click", handler);

	ok( !jQuery.data(jQuery("#firstp")[0], "events"), "Event handler unbound when using data." );
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

test("bind(), no data", function() {
	expect(1);
	var handler = function(event) {
		ok ( !event.data, "Check that no data is added to the event object" );
	};
	jQuery("#firstp").bind("click", handler).trigger("click");
});

test("bind(), iframes", function() {
	// events don't work with iframes, see #939 - this test fails in IE because of contentDocument
	// var doc = document.getElementById("iframe").contentDocument;
	// 
	// doc.body.innerHTML = "<input type='text'/>";
	//
	// var input = doc.getElementsByTagName("input")[0];
	//
	// jQuery(input).bind("click",function() {
	// 	ok( true, "Binding to element inside iframe" );
	// }).click();
});

test("bind(), trigger change on select", function() {
	expect(3);
	var counter = 0;
	function selectOnChange(event) {
		equals( event.data, counter++, "Event.data is not a global event object" );
	};
	jQuery("#form select").each(function(i){
		jQuery(this).bind('change', i, selectOnChange);
	}).trigger('change');
});

test("bind(), namespaced events, cloned events", function() {
	expect(6);

	jQuery("#firstp").bind("custom.test",function(e){
		ok(true, "Custom event triggered");
	});

	jQuery("#firstp").bind("click",function(e){
		ok(true, "Normal click triggered");
	});

	jQuery("#firstp").bind("click.test",function(e){
		ok(true, "Namespaced click triggered");
	});

	// Trigger both bound fn (2)
	jQuery("#firstp").trigger("click");

	// Trigger one bound fn (1)
	jQuery("#firstp").trigger("click.test");

	// Remove only the one fn
	jQuery("#firstp").unbind("click.test");

	// Trigger the remaining fn (1)
	jQuery("#firstp").trigger("click");

	// Remove the remaining fn
	jQuery("#firstp").unbind(".test");

	// Trigger the remaining fn (0)
	jQuery("#firstp").trigger("custom");

	// using contents will get comments regular, text, and comment nodes
	jQuery("#nonnodes").contents().bind("tester", function () {
		equals(this.nodeType, 1, "Check node,textnode,comment bind just does real nodes" );
	}).trigger("tester");

	// Make sure events stick with appendTo'd elements (which are cloned) #2027
	jQuery("<a href='#fail' class='test'>test</a>").click(function(){ return false; }).appendTo("p");
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

test("unbind(type)", function() {
	expect( 0 );
	
	var $elem = jQuery("#firstp"),
		message;

	function error(){
		ok( false, message );
	}
	
	message = "unbind passing function";
	$elem.bind('error', error).unbind('error',error).triggerHandler('error');
	
	message = "unbind all from event";
	$elem.bind('error', error).unbind('error').triggerHandler('error');
	
	message = "unbind all";
	$elem.bind('error', error).unbind().triggerHandler('error');
	
	message = "unbind many with function";
	$elem.bind('error error2',error)
		 .unbind('error error2', error )
		 .trigger('error').triggerHandler('error2');

	message = "unbind many"; // #3538
	$elem.bind('error error2',error)
		 .unbind('error error2')
		 .trigger('error').triggerHandler('error2');
});

test("unbind(eventObject)", function() {
	expect(4);
	
	var $elem = jQuery("#firstp"),
		num;

	function assert( expected ){
		num = 0;
		$elem.trigger('foo').triggerHandler('bar');
		equals( num, expected, "Check the right handlers are triggered" );
	}
	
	$elem
		// This handler shouldn't be unbound
		.bind('foo', function(){
			num += 1;
		})
		.bind('foo', function(e){
			$elem.unbind( e )
			num += 2;
		})
		// Neither this one
		.bind('bar', function(){
			num += 4;
		});
		
	assert( 7 );
	assert( 5 );
	
	$elem.unbind('bar');
	assert( 1 );
	
	$elem.unbind();	
	assert( 0 );
});

test("trigger() shortcuts", function() {
	expect(6);
	jQuery('<li><a href="#">Change location</a></li>').prependTo('#firstUL').find('a').bind('click', function() {
		var close = jQuery('spanx', this); // same with jQuery(this).find('span');
		equals( close.length, 0, "Context element does not exist, length must be zero" );
		ok( !close[0], "Context element does not exist, direct access to element must return undefined" );
		return false;
	}).click();
	
	jQuery("#check1").click(function() {
		ok( true, "click event handler for checkbox gets fired twice, see #815" );
	}).click();
	
	var counter = 0;
	jQuery('#firstp')[0].onclick = function(event) {
		counter++;
	};
	jQuery('#firstp').click();
	equals( counter, 1, "Check that click, triggers onclick event handler also" );
	
	var clickCounter = 0;
	jQuery('#simon1')[0].onclick = function(event) {
		clickCounter++;
	};
	jQuery('#simon1').click();
	equals( clickCounter, 1, "Check that click, triggers onclick event handler on an a tag also" );
	
	jQuery('<img />').load(function(){
		ok( true, "Trigger the load event, using the shortcut .load() (#2819)");
	}).load();
});

test("trigger() bubbling", function() {
	expect(14);

	var doc = 0, html = 0, body = 0, main = 0, ap = 0;

	jQuery(document).bind("click", function(e){ if ( e.target !== document) { doc++; } });
	jQuery("html").bind("click", function(e){ html++; });
	jQuery("body").bind("click", function(e){ body++; });
	jQuery("#main").bind("click", function(e){ main++; });
	jQuery("#ap").bind("click", function(){ ap++; return false; });

	jQuery("html").trigger("click");
	equals( doc, 1, "HTML bubble" );
	equals( html, 1, "HTML bubble" );

	jQuery("body").trigger("click");
	equals( doc, 2, "Body bubble" );
	equals( html, 2, "Body bubble" );
	equals( body, 1, "Body bubble" );

	jQuery("#main").trigger("click");
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
});

test("trigger(type, [data], [fn])", function() {
	expect(11);

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
		jQuery('#form input:first').hide().trigger('focus');
	} catch(e) {
		pass = false;
	}
	ok( pass, "Trigger focus on hidden element" );
});

test("trigger(eventObject, [data], [fn])", function() {
	expect(25);
	
	var $parent = jQuery('<div id="par" />').hide().appendTo('body'),
		$child = jQuery('<p id="child">foo</p>').appendTo( $parent );
	
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
	
	$parent.bind('foo',function(e){
		// Tries bubbling
		equals( e.type, 'foo', 'Verify event type when passed passing an event object' );
		equals( e.target.id, 'child', 'Verify event.target when passed passing an event object' );
		equals( e.currentTarget.id, 'par', 'Verify event.target when passed passing an event object' );
		equals( e.secret, 'boo!', 'Verify event object\'s custom attribute when passed passing an event object' );
	});
	
	// test with an event object
	event = new jQuery.Event("foo");
	event.secret = 'boo!';
	$child.trigger(event);
	
	// test with a literal object
	$child.trigger({type:'foo', secret:'boo!'});
	
	$parent.unbind();

	function error(){
		ok( false, "This assertion shouldn't be reached");
	}
	
	$parent.bind('foo', error );
	
	$child.bind('foo',function(e, a, b, c ){
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
	//$child.bind('foo', error );
	
	event = new jQuery.Event("foo");
	$child.trigger( event, [1,2,3] ).unbind();
	equals( event.result, "result", "Check event.result attribute");
	
	// Will error if it bubbles
	$child.triggerHandler('foo');
	
	$child.unbind();
	$parent.unbind().remove();
});

test("toggle(Function, Function, ...)", function() {
	expect(11);
	
	var count = 0,
		fn1 = function(e) { count++; },
		fn2 = function(e) { count--; },
		preventDefault = function(e) { e.preventDefault() },
		link = jQuery('#mark');
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
	
	$div.unbind('click',fns[0]);
	var data = jQuery.data( $div[0], 'events' );
	ok( !data, "Unbinding one function from toggle unbinds them all");
});

test(".live()/.die()", function() {
	expect(38);

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
	jQuery("div#nothiddendiv").trigger("click");
	equals( submit, 0, "Click on div" );
	equals( div, 1, "Click on div" );
	equals( livea, 1, "Click on div" );
	equals( liveb, 0, "Click on div" );

	// This should trigger three events (w/ bubbling)
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 0, "Click on inner div" );
	equals( div, 2, "Click on inner div" );
	equals( livea, 2, "Click on inner div" );
	equals( liveb, 1, "Click on inner div" );

	// This should trigger one submit
	jQuery("div#nothiddendivchild").trigger("submit");
	equals( submit, 1, "Submit on div" );
	equals( div, 2, "Submit on div" );
	equals( livea, 2, "Submit on div" );
	equals( liveb, 1, "Submit on div" );

	// Make sure no other events were removed in the process
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 1, "die Click on inner div" );
	equals( div, 3, "die Click on inner div" );
	equals( livea, 3, "die Click on inner div" );
	equals( liveb, 2, "die Click on inner div" );

	// Now make sure that the removal works
	jQuery("div#nothiddendivchild").die("click");
	jQuery("div#nothiddendivchild").trigger("click");
	equals( submit, 1, "die Click on inner div" );
	equals( div, 4, "die Click on inner div" );
	equals( livea, 4, "die Click on inner div" );
	equals( liveb, 2, "die Click on inner div" );

	// Make sure that the click wasn't removed too early
	jQuery("div#nothiddendiv").trigger("click");
	equals( submit, 1, "die Click on inner div" );
	equals( div, 5, "die Click on inner div" );
	equals( livea, 5, "die Click on inner div" );
	equals( liveb, 2, "die Click on inner div" );

	jQuery("div#nothiddendiv").die("click");
	jQuery("div").die("click");
	jQuery("div").die("submit");

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

	jQuery("#anchor2").trigger("click");
	equals( called, 2, "Verify that only one click occurred." );

	// Make sure that only one callback is removed
	jQuery("#anchor2").die("click", callback);

	jQuery("#nothiddendiv").trigger("click");
	equals( called, 3, "Verify that only one click occurred." );

	jQuery("#anchor2").trigger("click");
	equals( called, 3, "Verify that no click occurred." );

	// Make sure that it still works if the selector is the same,
	// but the event type is different
	jQuery("#nothiddendiv").live("foo", callback);

	// Cleanup
	jQuery("#nothiddendiv").die("click", callback);

	jQuery("#nothiddendiv").trigger("click");
	equals( called, 3, "Verify that no click occurred." );

	jQuery("#nothiddendiv").trigger("foo");
	equals( called, 4, "Verify that one foo occurred." );

	// Cleanup
	jQuery("#nothiddendiv").die("foo", callback);
	
	// Make sure we don't loose the target by DOM modifications
	// after the bubble already reached the liveHandler
	var livec = 0, elemDiv = jQuery("#nothiddendivchild").html('<span></span>').get(0);
	
	jQuery("#nothiddendivchild").live("click", function(e){ jQuery("#nothiddendivchild").html(''); });
	jQuery("#nothiddendivchild").live("click", function(e){ if(e.target) {livec++;} });
	
	jQuery("#nothiddendiv span").click();
	equals( jQuery("#nothiddendiv span").length, 0, "Verify that first handler occurred and modified the DOM." );
	equals( livec, 1, "Verify that second handler occurred even with nuked target." );
	
	// Cleanup
	jQuery("#nothiddendivchild").die("click");
});

/*
test("jQuery(function($) {})", function() {
	stop();
	jQuery(function($) {
		equals(jQuery, $, "ready doesn't provide an event object, instead it provides a reference to the jQuery function, see http://docs.jquery.com/Events/ready#fn");
		start();
	});
});

test("event properties", function() {
	stop();
	jQuery("#simon1").click(function(event) {
		ok( event.timeStamp, "assert event.timeStamp is present" );
		start();
	}).click();
});
*/
