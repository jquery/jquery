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