module("event");

test("toggle(Function, Function) - add toggle event and fake a few clicks", function() {
	expect(1);
	var count = 0,
		fn1 = function() { count++; },
		fn2 = function() { count--; },
		link = $('#mark');
	link.click().toggle(fn1, fn2).click().click().click().click().click();
	ok( count == 1, "Check for toggle(fn, fn)" );
});

test("unbind(event)", function() {
	expect(3);
	var el = $("#firstp");
	el.click(function() {
		ok( true, "Fake normal bind" );
	});
	el.click(function(event) {
		el.unbind(event);
		ok( true, "Fake onebind" );
	});
	el.click().click();
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