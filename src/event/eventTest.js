module("event");

test("toggle(Function, Function) - add toggle event and fake a few clicks", function() {
	expect(1);
	var count = 0,
		fn1 = function(e) { count++; },
		fn2 = function(e) { count--; },
		preventDefault = function(e) { e.preventDefault() },
		link = $('#mark');
	if ( $.browser.msie || $.browser.opera || /konquerer/i.test(navigator.userAgent) )
		ok( false, "click() on link gets executed in IE/Opera/Konquerer, not intended behaviour!" );
	else
		link.click(preventDefault).click().toggle(fn1, fn2).click().click().click().click().click();
	ok( count == 1, "Check for toggle(fn, fn)" );
});

test("unbind(event)", function() {
	expect(6);
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
	ok( el[0].onclick, "Extra handlers weren't accidentally removed." );

	el.unbind('click');
	ok( !el[0].$events, "Removed the events expando after all handlers are unbound." );
});

test("trigger(event, [data]", function() {
	expect(3);
	var handler = function(event, a, b, c) {
		ok( a == 1, "check passed data" );
		ok( b == "2", "check passed data" );
		ok( c == "abc", "check passed data" );
	}
	$("#firstp").bind("click", handler).trigger("click", [1, "2", "abc"]);
});

test("bind() with data", function() {
	expect(2);
	var handler = function(event) {
		ok( event.data, "check passed data exists" );
		ok( event.data.foo == "bar", "Check value of passed data" );
	}
	$("#firstp").bind("click", {foo: "bar"}, handler).click();
});

test("bind() with data and trigger() with data", function() {
	expect(4);
	var handler = function(event, data) {
		ok( event.data, "check passed data exists" );
		ok( event.data.foo == "bar", "Check value of passed data" );
		ok( data, "Check trigger data" );
		ok( data.bar == "foo", "Check value of trigger data" );
	}
	$("#firstp").bind("click", {foo: "bar"}, handler).trigger("click", [{bar: "foo"}]);
});

test("toggle(Function,Function) assigned from within one('xxx'), see #1054", function() {
	expect(3);
	var first = 0;
	$("#simon1").one("change", function() {
		ok( true, "Execute event only once" );
		$(this).toggle(function() {
			ok( first++ == 0 );
		}, function() {
			ok( first == 1 );
		});
	}).trigger("change").trigger("change").click().click();
	ok( false, "Seems like this doesn't work (that is, it doesn't fail) when triggering the event programmatically" );
});