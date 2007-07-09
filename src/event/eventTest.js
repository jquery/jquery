module("event");

test("bind()", function() {
	expect(12);

	var handler = function(event) {
		ok( event.data, "bind() with data, check passed data exists" );
		ok( event.data.foo == "bar", "bind() with data, Check value of passed data" );
	};
	$("#firstp").bind("click", {foo: "bar"}, handler).click().unbind("click", handler);
	
	ok( !$("#firstp").get(0).$events, "Event handler unbound when using data." );
	
	reset();
	var handler = function(event, data) {
		ok( event.data, "check passed data exists" );
		ok( event.data.foo == "bar", "Check value of passed data" );
		ok( data, "Check trigger data" );
		ok( data.bar == "foo", "Check value of trigger data" );
	};
	$("#firstp").bind("click", {foo: "bar"}, handler).trigger("click", [{bar: "foo"}]).unbind(handler);
	
	reset();
	var handler = function(event) {
		ok ( !event.data, "Check that no data is added to the event object" );
	};
	$("#firstp").bind("click", handler).trigger("click");
	
	
	// events don't work with iframes, see #939
	var doc = document.getElementById("iframe").contentDocument;
	
	doc.body.innerHTML = "<input type='text'/>";
	 
	var input = doc.getElementsByTagName("input")[0];
	 
	$(input).bind("click",function() {
		ok( true, "Binding to element inside iframe" );
	}).click();
	 
	//triggerEvent( input, "click" );
	
	var counter = 0;
	function selectOnChange(event) {
		equals( event.data, counter++, "Event.data is not a global event object" );
	};
	$("select").each(function(i){
		$(this).bind('change', i, selectOnChange);
	}).trigger('change');
});

test("click()", function() {
	expect(3);
	$('<li><a href="#">Change location</a></li>').prependTo('#firstUL').find('a').bind('click', function() {
	    var close = $('spanx', this); // same with $(this).find('span');
	    ok( close.length == 0, "Context element does not exist, length must be zero" );
	    ok( !close[0], "Context element does not exist, direct access to element must return undefined" );
	    return false;
	}).click();
	
	$("#check1").click(function() {
		ok( true, "click event handler for checkbox gets fired twice, see #815" );
	}).click();
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
	for (var ret in el[0].$events['click']) break;
	ok( ret, "Extra handlers weren't accidentally removed." );

	el.unbind('click');
	ok( !el[0].$events, "Removed the events expando after all handlers are unbound." );
});

test("trigger(event, [data]", function() {
	expect(3);
	var handler = function(event, a, b, c) {
		ok( a == 1, "check passed data" );
		ok( b == "2", "check passed data" );
		ok( c == "abc", "check passed data" );
	};
	$("#firstp").bind("click", handler).trigger("click", [1, "2", "abc"]);
});

test("toggle(Function, Function)", function() {
	expect(4);
	var count = 0,
		fn1 = function(e) { count++; },
		fn2 = function(e) { count--; },
		preventDefault = function(e) { e.preventDefault() },
		link = $('#mark');
	link.click(preventDefault).click().toggle(fn1, fn2).click().click().click().click().click();
	ok( count == 1, "Check for toggle(fn, fn)" );
	
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