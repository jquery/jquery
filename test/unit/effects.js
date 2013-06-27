(function() {

// Can't test what ain't there
if ( !jQuery.fx ) {
	return;
}

var off = jQuery.fx.off;

module("effects", {
	teardown: function() {
		jQuery.fx.off = off;
		return moduleTeardown.apply( this, arguments );
	}
});

test("sanity check", function() {
	expect(1);
	ok( jQuery("#dl:visible, #qunit-fixture:visible, #foo:visible").length === 3, "QUnit state is correct for testing effects" );
});

test("show() basic", 2, function() {
	var div,
		hiddendiv = jQuery("div.hidden");

	hiddendiv.hide().show();

	equal( hiddendiv.css("display"), "block", "Make sure a pre-hidden div is visible." );

	div = jQuery("<div>").hide().appendTo("#qunit-fixture").show();

	equal( div.css("display"), "block", "Make sure pre-hidden divs show" );

	// Clean up the detached node
	div.remove();

	QUnit.expectJqData(hiddendiv, "olddisplay");
});

test("show()", 27, function () {
	var div, speeds, old, test,
		hiddendiv = jQuery("div.hidden");

	equal(jQuery.css( hiddendiv[0], "display"), "none", "hiddendiv is display: none");

	hiddendiv.css("display", "block");
	equal(jQuery.css( hiddendiv[0], "display"), "block", "hiddendiv is display: block");

	hiddendiv.show();
	equal(jQuery.css( hiddendiv[0], "display"), "block", "hiddendiv is display: block");

	hiddendiv.css("display","");

	div = jQuery("#fx-queue div").slice(0, 4);
	div.show().each(function() {
		notEqual(this.style.display, "none", "don't change any <div> with display block");
	});

	speeds = {
		"null speed": null,
		"undefined speed": undefined,
		"false speed": false
	};

	jQuery.each(speeds, function(name, speed) {
		var pass = true;
		div.hide().show(speed).each(function() {
			if ( this.style.display === "none" ) {
				pass = false;
			}
		});
		ok( pass, "Show with " + name);
	});

	jQuery.each(speeds, function(name, speed) {
		var pass = true;
		div.hide().show(speed, function() {
			pass = false;
		});
		ok( pass, "Show with " + name + " does not call animate callback" );
	});

	// Tolerate data from show()/hide()
	QUnit.expectJqData(div, "olddisplay");

	// #show-tests * is set display: none in CSS
	jQuery("#qunit-fixture").append("<div id='show-tests'><div><p><a href='#'></a></p><code></code><pre></pre><span></span></div><table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table><ul><li></li></ul></div><table id='test-table'></table>");

	old = jQuery("#test-table").show().css("display") !== "table";
	jQuery("#test-table").remove();

	test = {
		"div"      : "block",
		"p"        : "block",
		"a"        : "inline",
		"code"     : "inline",
		"pre"      : "block",
		"span"     : "inline",
		"table"    : old ? "block" : "table",
		"thead"    : old ? "block" : "table-header-group",
		"tbody"    : old ? "block" : "table-row-group",
		"tr"       : old ? "block" : "table-row",
		"th"       : old ? "block" : "table-cell",
		"td"       : old ? "block" : "table-cell",
		"ul"       : "block",
		"li"       : old ? "block" : "list-item"
	};

	jQuery.each(test, function(selector, expected) {
		var elem = jQuery(selector, "#show-tests").show();
		equal( elem.css("display"), expected, "Show using correct display type for " + selector );
	});

	jQuery("#show-tests").remove();

	// Make sure that showing or hiding a text node doesn't cause an error
	jQuery("<div>test</div> text <span>test</span>").show().remove();
	jQuery("<div>test</div> text <span>test</span>").hide().remove();
});

test("show(Number) - other displays", function() {
	expect(15);
	QUnit.reset();
	stop();

	// #show-tests * is set display: none in CSS
	jQuery("#qunit-fixture").append("<div id='show-tests'><div><p><a href='#'></a></p><code></code><pre></pre><span></span></div><table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table><ul><li></li></ul></div><table id='test-table'></table>");

	var test,
		old = jQuery("#test-table").show().css("display") !== "table",
		num = 0;
	jQuery("#test-table").remove();

	test = {
		"div"      : "block",
		"p"        : "block",
		"a"        : "inline",
		"code"     : "inline",
		"pre"      : "block",
		"span"     : "inline",
		"table"    : old ? "block" : "table",
		"thead"    : old ? "block" : "table-header-group",
		"tbody"    : old ? "block" : "table-row-group",
		"tr"       : old ? "block" : "table-row",
		"th"       : old ? "block" : "table-cell",
		"td"       : old ? "block" : "table-cell",
		"ul"       : "block",
		"li"       : old ? "block" : "list-item"
	};

	jQuery.each(test, function(selector, expected) {
		var elem = jQuery(selector, "#show-tests").show(1, function() {
			equal( elem.css("display"), expected, "Show using correct display type for " + selector );
			if ( ++num === 15 ) {
				start();
			}
		});
	});

	jQuery("#show-tests").remove();
});

// Supports #7397
test("Persist correct display value", function() {
	expect(3);
	QUnit.reset();
	stop();

	// #show-tests * is set display: none in CSS
	jQuery("#qunit-fixture").append("<div id='show-tests'><span style='position:absolute;'>foo</span></div>");

	var $span = jQuery("#show-tests span"),
		displayNone = $span.css("display"),
		display = "";

	$span.show();

	display = $span.css("display");

	$span.hide();

	$span.fadeIn(100, function() {
		equal($span.css("display"), display, "Expecting display: " + display);
		$span.fadeOut(100, function () {
			equal($span.css("display"), displayNone, "Expecting display: " + displayNone);
			$span.fadeIn(100, function() {
				equal($span.css("display"), display, "Expecting display: " + display);
				start();
			});
		});
	});

	QUnit.expectJqData($span, "olddisplay");
});

test("animate(Hash, Object, Function)", function() {
	expect(1);
	stop();
	var hash = {opacity: "show"},
		hashCopy = jQuery.extend({}, hash);
	jQuery("#foo").animate(hash, 0, function() {
		equal( hash.opacity, hashCopy.opacity, "Check if animate changed the hash parameter" );
		start();
	});
});

test("animate relative values", function() {
	stop();

	var value = 40,
		bases = [ "%", "px", "em" ],
		adjustments = [ "px", "em" ],
		container = jQuery("<div></div>")
			.css({ position: "absolute", height: "50em", width: "50em" }),
		animations = bases.length * adjustments.length;

	expect( 2 * animations );

	jQuery.each( bases, function( _, baseUnit ) {
		jQuery.each( adjustments, function( _, adjustUnit ) {
			var base = value + baseUnit,
				adjust = { height: "+=2" + adjustUnit, width: "-=2" + adjustUnit },
				elem = jQuery("<div></div>")
					.appendTo( container.clone().appendTo("#qunit-fixture") )
					.css({
						position: "absolute",
						height: base,
						width: value + adjustUnit
					}),
				baseScale = elem[ 0 ].offsetHeight / value,
				adjustScale = elem[ 0 ].offsetWidth / value;

			elem.css( "width", base ).animate( adjust, 100, function() {
				equal( this.offsetHeight, value * baseScale + 2 * adjustScale,
					baseUnit + "+=" + adjustUnit );
				equal( this.offsetWidth, value * baseScale - 2 * adjustScale,
					baseUnit + "-=" + adjustUnit );

				if ( --animations === 0 ) {
					start();
				}
			});
		});
	});
});

test("animate negative height", function() {
	expect(1);
	stop();
	jQuery("#foo").animate({ height: -100 }, 100, function() {
		equal( this.offsetHeight, 0, "Verify height." );
		start();
	});
});

test("animate negative margin", function() {
	expect(1);
	stop();
	jQuery("#foo").animate({ "marginTop": -100 }, 100, function() {
		equal( jQuery(this).css("marginTop"), "-100px", "Verify margin." );
		start();
	});
});

test("animate negative margin with px", function() {
	expect(1);
	stop();
	jQuery("#foo").animate({ marginTop: "-100px" }, 100, function() {
		equal( jQuery(this).css("marginTop"), "-100px", "Verify margin." );
		start();
	});
});

test("animate negative padding", function() {
	expect(1);
	stop();
	jQuery("#foo").animate({ "paddingBottom": -100 }, 100, function() {
		equal( jQuery(this).css("paddingBottom"), "0px", "Verify paddingBottom." );
		start();
	});
});

test("animate block as inline width/height", function() {
	expect(3);

	stop();

	jQuery("#foo").css({ display: "inline", width: "", height: "" }).animate({ width: 42, height: 42 }, 100, function() {
		equal( jQuery(this).css("display"), "inline-block", "inline-block was set on non-floated inline element when animating width/height" );
		equal( this.offsetWidth, 42, "width was animated" );
		equal( this.offsetHeight, 42, "height was animated" );
		start();
	});
});

test("animate native inline width/height", function() {
	expect(3);

	stop();
	jQuery("#foo").css({ display: "", width: "", height: "" })
		.append("<span>text</span>")
		.children("span")
			.animate({ width: 42, height: 42 }, 100, function() {
				equal( jQuery(this).css("display"), "inline-block", "inline-block was set on non-floated inline element when animating width/height" );
				equal( this.offsetWidth, 42, "width was animated" );
				equal( this.offsetHeight, 42, "height was animated" );
				start();
			});
});

test( "animate block width/height", function() {
	expect( 3 );
	stop();

	jQuery("<div>").appendTo("#qunit-fixture").css({
		display: "block",
		width: 20,
		height: 20,
		paddingLeft: 60
	}).animate({
		width: 42,
		height: 42
	}, {
		duration: 100,
		step: function() {
			if ( jQuery( this ).width() > 42 ) {
				ok( false, "width was incorrectly augmented during animation" );
			}
		},
		complete: function() {
			equal( jQuery( this ).css("display"), "block", "inline-block was not set on block element when animating width/height" );
			equal( jQuery( this ).width(), 42, "width was animated" );
			equal( jQuery( this ).height(), 42, "height was animated" );
			start();
		}
	});
});

test("animate table width/height", function() {
	expect(1);
	stop();

	var displayMode = jQuery("#table").css("display") !== "table" ? "block" : "table";

	jQuery("#table").animate({ width: 42, height: 42 }, 100, function() {
		equal( jQuery(this).css("display"), displayMode, "display mode is correct" );
		start();
	});
});

test("animate table-row width/height", function() {
	expect(3);
	stop();
	var displayMode,
		tr = jQuery("#table")
			.attr({ "cellspacing": 0, "cellpadding": 0, "border": 0 })
			.html("<tr style='height:42px;'><td style='padding:0;'><div style='width:20px;height:20px;'></div></td></tr>")
			.find("tr");

	// IE<8 uses "block" instead of the correct display type
	displayMode = tr.css("display") !== "table-row" ? "block" : "table-row";

	tr.animate({ width: 10, height: 10 }, 100, function() {
		equal( jQuery(this).css("display"), displayMode, "display mode is correct" );
		equal( this.offsetWidth, 20, "width animated to shrink wrap point" );
		equal( this.offsetHeight, 20, "height animated to shrink wrap point" );
		start();
	});
});

test("animate table-cell width/height", function() {
	expect(3);
	stop();
	var displayMode,
		td = jQuery("#table")
			.attr({ "cellspacing": 0, "cellpadding": 0, "border": 0 })
			.html("<tr><td style='width:42px;height:42px;padding:0;'><div style='width:20px;height:20px;'></div></td></tr>")
			.find("td");

	// IE<8 uses "block" instead of the correct display type
	displayMode = td.css("display") !== "table-cell" ? "block" : "table-cell";

	td.animate({ width: 10, height: 10 }, 100, function() {
		equal( jQuery(this).css("display"), displayMode, "display mode is correct" );
		equal( this.offsetWidth, 20, "width animated to shrink wrap point" );
		equal( this.offsetHeight, 20, "height animated to shrink wrap point" );
		start();
	});
});

test("animate percentage(%) on width/height", function() {
	expect( 2 );

	var $div = jQuery("<div style='position:absolute;top:-999px;left:-999px;width:60px;height:60px;'><div style='width:50%;height:50%;'></div></div>")
		.appendTo("#qunit-fixture").children("div");

	stop();
	$div.animate({ width: "25%", height: "25%" }, 13, function() {
		var $this = jQuery(this);
		equal( $this.css("width"), "15px", "Width was animated to 15px rather than 25px");
		equal( $this.css("height"), "15px", "Height was animated to 15px rather than 25px");
		start();
	});
});

test("animate resets overflow-x and overflow-y when finished", function() {
	expect(2);
	stop();
	jQuery("#foo")
		.css({ display: "block", width: 20, height: 20, overflowX: "visible", overflowY: "auto" })
		.animate({ width: 42, height: 42 }, 100, function() {
			equal( this.style.overflowX, "visible", "overflow-x is visible" );
			equal( this.style.overflowY, "auto", "overflow-y is auto" );
			start();
		});
});

/* // This test ends up being flaky depending upon the CPU load
test("animate option (queue === false)", function () {
	expect(1);
	stop();

	var order = [];

	var $foo = jQuery("#foo");
	$foo.animate({width:"100px"}, 3000, function () {
		// should finish after unqueued animation so second
		order.push(2);
		deepEqual( order, [ 1, 2 ], "Animations finished in the correct order" );
		start();
	});
	$foo.animate({fontSize:"2em"}, {queue:false, duration:10, complete:function () {
		// short duration and out of queue so should finish first
		order.push(1);
	}});
});
*/

asyncTest( "animate option { queue: false }", function() {
	expect( 2 );
	var foo = jQuery( "#foo" );

	foo.animate({
		fontSize: "2em"
	}, {
		queue: false,
		duration: 10,
		complete: function() {
			ok( true, "Animation Completed" );
			start();
		}
	});

	equal( foo.queue().length, 0, "Queue is empty" );
});

asyncTest( "animate option { queue: true }", function() {
	expect( 2 );
	var foo = jQuery( "#foo" );

	foo.animate({
		fontSize: "2em"
	}, {
		queue: true,
		duration: 10,
		complete: function() {
			ok( true, "Animation Completed" );
			start();
		}
	});

	notEqual( foo.queue().length, 0, "Default queue is not empty" );
});

asyncTest( "animate option { queue: 'name' }", function() {
	expect( 5 );
	var foo = jQuery( "#foo" ),
		origWidth = parseFloat( foo.css("width") ),
		order = [];

	foo.animate( { width: origWidth + 100 }, {
		queue: "name",
		duration: 1,
		complete: function() {

			// second callback function
			order.push( 2 );
			equal( parseFloat( foo.css("width") ), origWidth + 100, "Animation ended" );
			equal( foo.queue("name").length, 1, "Queue length of 'name' queue" );
		}
	}).queue( "name", function() {

		// last callback function
		deepEqual( order, [ 1, 2 ], "Callbacks in expected order" );
		start();
	});

	setTimeout( function() {

		// this is the first callback function that should be called
		order.push( 1 );
		equal( parseFloat( foo.css("width") ), origWidth, "Animation does not start on its own." );
		equal( foo.queue("name").length, 2, "Queue length of 'name' queue" );
		foo.dequeue( "name" );
	}, 100 );

});

test("animate with no properties", function() {
	expect(2);

	var foo,
		divs = jQuery("div"),
		count = 0;

	divs.animate({}, function(){
		count++;
	});

	equal( divs.length, count, "Make sure that callback is called for each element in the set." );

	stop();

	foo = jQuery("#foo");

	foo.animate({});
	foo.animate({top: 10}, 100, function(){
		ok( true, "Animation was properly dequeued." );
		start();
	});
});

test("animate duration 0", function() {
	expect(11);

	stop();

	var $elem,
		$elems = jQuery([{ a:0 },{ a:0 }]),
		counter = 0;

	equal( jQuery.timers.length, 0, "Make sure no animation was running from another test" );

	$elems.eq(0).animate( {a:1}, 0, function(){
		ok( true, "Animate a simple property." );
		counter++;
	});

	// Failed until [6115]
	equal( jQuery.timers.length, 0, "Make sure synchronic animations are not left on jQuery.timers" );

	equal( counter, 1, "One synchronic animations" );

	$elems.animate( { a:2 }, 0, function(){
		ok( true, "Animate a second simple property." );
		counter++;
	});

	equal( counter, 3, "Multiple synchronic animations" );

	$elems.eq(0).animate( {a:3}, 0, function(){
		ok( true, "Animate a third simple property." );
		counter++;
	});
	$elems.eq(1).animate( {a:3}, 200, function(){
		counter++;
		// Failed until [6115]
		equal( counter, 5, "One synchronic and one asynchronic" );
		start();
	});

	$elem = jQuery("<div />");
	$elem.show(0, function(){
		ok(true, "Show callback with no duration");
	});
	$elem.hide(0, function(){
		ok(true, "Hide callback with no duration");
	});

	// manually clean up detached elements
	$elem.remove();
});

test("animate hyphenated properties", function() {
	expect(1);
	stop();

	jQuery("#foo")
		.css("font-size", 10)
		.animate({"font-size": 20}, 200, function() {
			equal( this.style.fontSize, "20px", "The font-size property was animated." );
			start();
		});
});

test("animate non-element", function() {
	expect(1);
	stop();

	var obj = { test: 0 };

	jQuery(obj).animate({test: 200}, 200, function(){
		equal( obj.test, 200, "The custom property should be modified." );
		start();
	});
});

test("stop()", function() {
	expect( 4 );
	stop();

	var $one, $two,
		$foo = jQuery("#foo"),
		tests = 2,
		w = 0;

	$foo.hide().css( "width", 200 )
		.animate( { "width": "show" }, 1500 );

	setTimeout(function() {
		var nw = $foo.css("width");
		notEqual( parseFloat( nw ), w, "An animation occurred " + nw + " " + w + "px" );
		$foo.stop();

		nw = $foo.css("width");
		notEqual( parseFloat( nw ), w, "Stop didn't reset the animation " + nw + " " + w + "px" );
		setTimeout(function() {
			$foo.removeData();
			$foo.removeData(undefined, true);
			equal( nw, $foo.css("width"), "The animation didn't continue" );
			if ( --tests === 0 ) {
				start();
			}
		}, 100);
	}, 100);

	$one = jQuery("#fadein");
	$two = jQuery("#show");
	$one.fadeTo(100, 0, function() {
		$one.stop();
	});
	setTimeout(function() {
		$two.fadeTo(100, 0, function() {
			equal( $two.css("opacity"), "0", "Stop does not interfere with animations on other elements (#6641)" );
			// Reset styles
			$one.add( $two ).css("opacity", "");
			if ( --tests === 0 ) {
				start();
			}
		});
	}, 50);
});

test("stop() - several in queue", function() {
	expect( 5 );

	var nw, time,
		$foo = jQuery( "#foo" );

	// default duration is 400ms, so 800px ensures we aren't 0 or 1 after 1ms
	$foo.hide().css( "width", 800 );

	$foo.animate({ "width": "show" }, 400, "linear");
	$foo.animate({ "width": "hide" });
	$foo.animate({ "width": "show" });

	// could be replaced by something nicer using sinon.
	time = jQuery.now();
	while( time === jQuery.now() ) {}

	jQuery.fx.tick();
	equal( $foo.queue().length, 3, "3 in the queue" );

	nw = $foo.css( "width" );
	notEqual( parseFloat( nw ), 1, "An animation occurred " + nw );
	$foo.stop();

	equal( $foo.queue().length, 2, "2 in the queue" );
	nw = $foo.css( "width" );
	notEqual( parseFloat( nw ), 1, "Stop didn't reset the animation " + nw );

	$foo.stop( true );

	equal( $foo.queue().length, 0, "0 in the queue" );
});

test("stop(clearQueue)", function() {
	expect(4);
	stop();

	var $foo = jQuery("#foo"),
		w = 0;
	$foo.hide().css( "width", 200 ).css("width");

	$foo.animate({ "width": "show" }, 1000);
	$foo.animate({ "width": "hide" }, 1000);
	$foo.animate({ "width": "show" }, 1000);
	setTimeout(function(){
		var nw = $foo.css("width");
		ok( parseFloat( nw ) !== w, "An animation occurred " + nw + " " + w + "px");
		$foo.stop(true);

		nw = $foo.css("width");
		ok( parseFloat( nw ) !== w, "Stop didn't reset the animation " + nw + " " + w + "px");

		equal( $foo.queue().length, 0, "The animation queue was cleared" );
		setTimeout(function(){
			equal( nw, $foo.css("width"), "The animation didn't continue" );
			start();
		}, 100);
	}, 100);
});

test("stop(clearQueue, gotoEnd)", function() {
	expect(1);
	stop();

	var $foo = jQuery("#foo"),
		w = 0;
	$foo.hide().css( "width", 200 ).css("width");

	$foo.animate({ width: "show" }, 1000);
	$foo.animate({ width: "hide" }, 1000);
	$foo.animate({ width: "show" }, 1000);
	$foo.animate({ width: "hide" }, 1000);
	setTimeout(function(){
		var nw = $foo.css("width");
		ok( parseFloat( nw ) !== w, "An animation occurred " + nw + " " + w + "px");
		$foo.stop(false, true);

		nw = $foo.css("width");
		// Disabled, being flaky
		//equal( nw, 1, "Stop() reset the animation" );

		setTimeout(function(){
			// Disabled, being flaky
			//equal( $foo.queue().length, 2, "The next animation continued" );
			$foo.stop(true);
			start();
		}, 100);
	}, 100);
});

asyncTest( "stop( queue, ..., ... ) - Stop single queues", function() {
	expect( 3 );
	var saved,
		foo = jQuery("#foo").css({ width: 200, height: 200 });

	foo.animate({
		width: 400
	},{
		duration: 500,
		complete: function() {
			equal( parseFloat( foo.css("width") ), 400, "Animation completed for standard queue" );
			equal( parseFloat( foo.css("height") ), saved, "Height was not changed after the second stop");
			start();
		}
	});

	foo.animate({
		height: 400
	},{
		duration: 1000,
		queue: "height"
	}).dequeue("height").stop( "height", false, true );

	equal( parseFloat( foo.css("height") ), 400, "Height was stopped with gotoEnd" );

	foo.animate({
		height: 200
	},{
		duration: 1000,
		queue: "height"
	}).dequeue( "height" ).stop( "height", false, false );
	saved = parseFloat( foo.css("height") );
});

test("toggle()", function() {
	expect(6);
	var x = jQuery("#foo");
	ok( x.is(":visible"), "is visible" );
	x.toggle();
	ok( x.is(":hidden"), "is hidden" );
	x.toggle();
	ok( x.is(":visible"), "is visible again" );

	x.toggle(true);
	ok( x.is(":visible"), "is visible" );
	x.toggle(false);
	ok( x.is(":hidden"), "is hidden" );
	x.toggle(true);
	ok( x.is(":visible"), "is visible again" );
});

test( "jQuery.fx.prototype.cur() - <1.8 Back Compat", 7, function() {
	var div = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" ).css({
			color: "#ABC",
			border: "5px solid black",
			left: "auto",
			marginBottom: "-11000px"
		})[0];

	equal(
		( new jQuery.fx( div, {}, "color" ) ).cur(),
		jQuery.css( div, "color" ),
		"Return the same value as jQuery.css for complex properties (bug #7912)"
	);

	strictEqual(
		( new jQuery.fx( div, {}, "borderLeftWidth" ) ).cur(),
		5,
		"Return simple values parsed as Float"
	);

	// backgroundPosition actually returns 0% 0% in most browser
	// this fakes a "" return
	// hook now gets called twice because Tween will grab the current
	// value as it is being newed
	jQuery.cssHooks.backgroundPosition = {
		get: function() {
			ok( true, "hook used" );
			return "";
		}
	};

	strictEqual(
		( new jQuery.fx( div, {}, "backgroundPosition" ) ).cur(),
		0,
		"Return 0 when jQuery.css returns an empty string"
	);

	delete jQuery.cssHooks.backgroundPosition;

	strictEqual(
		( new jQuery.fx( div, {}, "left" ) ).cur(),
		0,
		"Return 0 when jQuery.css returns 'auto'"
	);

	equal(
		( new jQuery.fx( div, {}, "marginBottom" ) ).cur(),
		-11000,
		"support negative values < -10000 (bug #7193)"
	);

	jQuery( div ).remove();
});

test("Overflow and Display", function() {
	expect(4);
	stop();

	var
		testClass = jQuery.makeTest("Overflow and Display")
			.addClass("overflow inline"),
		testStyle = jQuery.makeTest("Overflow and Display (inline style)")
			.css({ overflow: "visible", display: "inline" }),
		remaining = 2,
		done = function() {
			equal( jQuery.css( this, "overflow" ), "visible", "Overflow should be 'visible'" );
			equal( jQuery.css( this, "display" ), "inline", "Display should be 'inline'" );

			if ( --remaining === 0 ) {
				start();
			}
		};

	testClass.add( testStyle )
		.addClass("widewidth")
		.text("Some sample text.")
		.before("text before")
		.after("text after")
		.animate({ opacity: 0.5 }, "slow", done );
});

jQuery.each({
	"CSS Auto": function( elem, prop ) {
		jQuery( elem ).addClass( "auto" + prop )
			.text( "This is a long string of text." );
		return "";
	},
	"JS Auto": function( elem, prop ) {
		jQuery( elem ).css( prop, "" )
			.text( "This is a long string of text." );
		return "";
	},
	"CSS 100": function( elem, prop ) {
		jQuery( elem ).addClass( "large" + prop );
		return "";
	},
	"JS 100": function( elem, prop ) {
		jQuery( elem ).css( prop, prop === "opacity" ? 1 : "100px" );
		return prop === "opacity" ? 1 : 100;
	},
	"CSS 50": function( elem, prop ) {
		jQuery( elem ).addClass( "med" + prop );
		return "";
	},
	"JS 50": function( elem, prop ) {
		jQuery( elem ).css( prop, prop === "opacity" ? 0.50 : "50px" );
		return prop === "opacity" ? 0.5 : 50;
	},
	"CSS 0": function( elem, prop ) {
		jQuery( elem ).addClass( "no" + prop );
		return "";
	},
	"JS 0": function( elem, prop ) {
		jQuery( elem ).css( prop, prop === "opacity" ? 0 : "0px" );
		return 0;
	}
}, function( fn, f ) {
	jQuery.each({
		"show": function( elem, prop ) {
			jQuery( elem ).hide( ).addClass( "wide" + prop );
			return "show";
		},
		"hide": function( elem, prop ) {
			jQuery( elem ).addClass( "wide" + prop );
			return "hide";
		},
		"100": function( elem, prop ) {
			jQuery( elem ).addClass( "wide" + prop );
			return prop === "opacity" ? 1 : 100;
		},
		"50": function( elem, prop ) {
			return prop === "opacity" ? 0.50 : 50;
		},
		"0": function( elem ) {
			jQuery( elem ).addClass( "noback" );
			return 0;
		}
	}, function( tn, t ) {
		test(fn + " to " + tn, function() {
			var num, anim,
				elem = jQuery.makeTest( fn + " to " + tn ),
				t_w = t( elem, "width" ),
				f_w = f( elem, "width" ),
				t_h = t( elem, "height" ),
				f_h = f( elem, "height" ),
				t_o = t( elem, "opacity" ),
				f_o = f( elem, "opacity" );

			if ( f_o === "" ) {
				f_o = 1;
			}

			num = 0;
			// TODO: uncrowd this
			if ( t_h === "show" ) {num++;}
			if ( t_w === "show" ) {num++;}
			if ( t_w === "hide" || t_w === "show" ) {num++;}
			if ( t_h === "hide" || t_h === "show" ) {num++;}
			if ( t_o === "hide" || t_o === "show" ) {num++;}
			if ( t_w === "hide" ) {num++;}
			if ( t_o.constructor === Number ) {num += 2;}
			if ( t_w.constructor === Number ) {num += 2;}
			if ( t_h.constructor === Number ) {num +=2;}

			expect( num );
			stop();

			anim = { width: t_w, height: t_h, opacity: t_o };

			elem.animate(anim, 50);

			jQuery.when( elem ).done(function( elem ) {
				var cur_o, cur_w, cur_h, old_h;

				elem = elem[ 0 ];

				if ( t_w === "show" ) {
					equal( elem.style.display, "block", "Showing, display should block: " + elem.style.display );
				}

				if ( t_w === "hide" || t_w === "show" ) {
					ok( f_w === "" ? elem.style.width === f_w : elem.style.width.indexOf( f_w ) === 0, "Width must be reset to " + f_w + ": " + elem.style.width );
				}

				if ( t_h === "hide" || t_h === "show" ) {
					ok( f_h === "" ? elem.style.height === f_h : elem.style.height.indexOf( f_h ) === 0, "Height must be reset to " + f_h + ": " + elem.style.height );
				}

				cur_o = jQuery.style(elem, "opacity");

				if ( f_o !== jQuery.css(elem, "opacity") ) {
					f_o = f( elem, "opacity" );
				}

				// The only time an _empty_string_ will be matched is in IE
				// otherwise, the correct values will be tested as usual
				if ( f_o === "" ) {
					f_o = 1;
				}
				// See above
				if ( cur_o === "" ) {
					cur_o = 1;
				}

				if ( t_o === "hide" || t_o === "show" ) {
					equal( cur_o, f_o, "Opacity must be reset to " + f_o + ": " + cur_o );
				}

				if ( t_w === "hide" ) {
					equal( elem.style.display, "none", "Hiding, display should be none: " + elem.style.display );
				}

				if ( t_o.constructor === Number ) {
					equal( cur_o, t_o, "Final opacity should be " + t_o + ": " + cur_o );

					ok( jQuery.css(elem, "opacity") !== "" || cur_o === t_o, "Opacity should be explicitly set to " + t_o + ", is instead: " + cur_o );
				}

				if ( t_w.constructor === Number ) {
					equal( elem.style.width, t_w + "px", "Final width should be " + t_w + ": " + elem.style.width );

					cur_w = jQuery.css( elem,"width" );

					ok( elem.style.width !== "" || cur_w === t_w, "Width should be explicitly set to " + t_w + ", is instead: " + cur_w );
				}

				if ( t_h.constructor === Number ) {
					equal( elem.style.height, t_h + "px", "Final height should be " + t_h + ": " + elem.style.height );

					cur_h = jQuery.css( elem,"height" );

					ok( elem.style.height !== "" || cur_h === t_h, "Height should be explicitly set to " + t_h + ", is instead: " + cur_h );
				}

				if ( t_h === "show" ) {
					old_h = jQuery.css( elem, "height" );
					jQuery( elem ).append("<br/>Some more text<br/>and some more...");

					if ( /Auto/.test( fn ) ) {
						notEqual( jQuery.css( elem, "height" ), old_h, "Make sure height is auto." );
					} else {
						equal( jQuery.css( elem, "height" ), old_h, "Make sure height is not auto." );
					}
				}

				// manually remove generated element
				jQuery( elem ).remove();

				start();
			});
		});
	});
});

asyncTest("Effects chaining", function() {
	var remaining = 16,
		props = [ "opacity", "height", "width", "display", "overflow" ],
		setup = function( name, selector ) {
			var $el = jQuery( selector );
			return $el.data( getProps( $el[0] ) ).data( "name", name );
		},
		assert = function() {
			var data = jQuery.data( this ),
				name = data.name;
			delete data.name;

			deepEqual( getProps( this ), data, name );

			jQuery.removeData( this );
			if ( --remaining === 0 ) {
				start();
			}
		},
		getProps = function( el ) {
			var obj = {};
			jQuery.each( props, function( i, prop ) {
				obj[ prop ] = prop === "overflow" && el.style[ prop ] || jQuery.css( el, prop );
			});
			return obj;
		};

	expect( remaining );

	setup( ".fadeOut().fadeIn()", "#fadein div" ).fadeOut("fast").fadeIn( "fast", assert );
	setup( ".fadeIn().fadeOut()", "#fadeout div" ).fadeIn("fast").fadeOut( "fast", assert );
	setup( ".hide().show()", "#show div" ).hide("fast").show( "fast", assert );
	setup( ".show().hide()", "#hide div" ).show("fast").hide( "fast", assert );
	setup( ".show().hide(easing)", "#easehide div" ).show("fast").hide( "fast", "linear", assert );
	setup( ".toggle().toggle() - in", "#togglein div" ).toggle("fast").toggle( "fast", assert );
	setup( ".toggle().toggle() - out", "#toggleout div" ).toggle("fast").toggle( "fast", assert );
	setup( ".toggle().toggle(easing) - out", "#easetoggleout div" ).toggle("fast").toggle( "fast", "linear", assert );
	setup( ".slideDown().slideUp()", "#slidedown div" ).slideDown("fast").slideUp( "fast", assert );
	setup( ".slideUp().slideDown()", "#slideup div" ).slideUp("fast").slideDown( "fast", assert );
	setup( ".slideUp().slideDown(easing)", "#easeslideup div" ).slideUp("fast").slideDown( "fast", "linear", assert );
	setup( ".slideToggle().slideToggle() - in", "#slidetogglein div" ).slideToggle("fast").slideToggle( "fast", assert );
	setup( ".slideToggle().slideToggle() - out", "#slidetoggleout div" ).slideToggle("fast").slideToggle( "fast", assert );
	setup( ".fadeToggle().fadeToggle() - in", "#fadetogglein div" ).fadeToggle("fast").fadeToggle( "fast", assert );
	setup( ".fadeToggle().fadeToggle() - out", "#fadetoggleout div" ).fadeToggle("fast").fadeToggle( "fast", assert );
	setup( ".fadeTo(0.5).fadeTo(1.0, easing)", "#fadeto div" ).fadeTo( "fast", 0.5 ).fadeTo( "fast", 1.0, "linear", assert );
});

jQuery.makeTest = function( text ){
	var elem = jQuery("<div></div>")
		.attr( "id", "test" + jQuery.makeTest.id++ )
		.addClass("box");

	jQuery("<h4></h4>")
		.text( text )
		.appendTo("#fx-tests")
		.after( elem );

	return elem;
};

jQuery.makeTest.id = 1;

test("jQuery.show('fast') doesn't clear radio buttons (bug #1095)", function () {
	expect(4);
	stop();

	var $checkedtest = jQuery("#checkedtest");
	$checkedtest.hide().show("fast", function() {
		ok( jQuery("input[type='radio']", $checkedtest).first().attr("checked"), "Check first radio still checked." );
		ok( !jQuery("input[type='radio']", $checkedtest).last().attr("checked"), "Check last radio still NOT checked." );
		ok( jQuery("input[type='checkbox']", $checkedtest).first().attr("checked"), "Check first checkbox still checked." );
		ok( !jQuery("input[type='checkbox']", $checkedtest).last().attr("checked"), "Check last checkbox still NOT checked." );
		start();
	});
});

test( "interrupt toggle", function() {
	expect( 24 );
	stop();

	var longDuration = 2000,
		shortDuration = 500,
		remaining = 0,
		$elems = jQuery(".chain-test"),
		finish = function() {
			if ( !(--remaining) ) {
				start();
			}
		};

	jQuery.each( { slideToggle: "height", fadeToggle: "opacity", toggle: "width" }, function( method, prop ) {
		var $methodElems = $elems.filter( "[id^='" + method.toLowerCase() + "']" ).each(function() {
			// Don't end test until we're done with this element
			remaining++;

			// Save original property value for comparison
			jQuery.data( this, "startVal", jQuery( this ).css( prop ) );

			// Expect olddisplay data from our .hide() call below
			QUnit.expectJqData( this, "olddisplay" );
		});

		// Interrupt a hiding toggle
		$methodElems[ method ]( longDuration );
		setTimeout(function() {
			$methodElems.stop().each(function() {
				notEqual( jQuery( this ).css( prop ), jQuery.data( this, "startVal" ), ".stop() before completion of hiding ." + method + "() - #" + this.id );
			});

			// Restore
			$methodElems[ method ]( shortDuration, function() {
				var id = this.id,
					$elem = jQuery( this ),
					startVal = $elem.data("startVal");

				$elem.removeData("startVal");

				equal( $elem.css( prop ), startVal, "original value restored by ." + method + "() - #" + id );

				// Interrupt a showing toggle
				$elem.hide()[ method ]( longDuration );
				setTimeout(function() {
					$elem.stop();
					notEqual( $elem.css( prop ), startVal, ".stop() before completion of showing ." + method + "() - #" + id );

					// Restore
					$elem[ method ]( shortDuration, function() {
						equal( $elem.css( prop ), startVal, "original value restored by ." + method + "() - #" + id );
						finish();
					});
				}, shortDuration );
			});
		}, shortDuration );
	});
});

test("animate with per-property easing", function(){

	expect(5);
	stop();

	var data = { a:0, b:0, c:0 },
		_test1_called = false,
		_test2_called = false,
		_default_test_called = false,
		props = {
			a: [ 100, "_test1" ],
			b: [ 100, "_test2" ],
			c: 100
		};

	jQuery.easing["_test1"] = function(p) {
		_test1_called = true;
		return p;
	};

	jQuery.easing["_test2"] = function(p) {
		_test2_called = true;
		return p;
	};

	jQuery.easing["_default_test"] = function(p) {
		_default_test_called = true;
		return p;
	};

	jQuery(data).animate( props, 400, "_default_test", function(){
		start();

		ok( _test1_called, "Easing function (_test1) called" );
		ok( _test2_called, "Easing function (_test2) called" );
		ok( _default_test_called, "Easing function (_default) called" );
		equal( props.a[ 1 ], "_test1", "animate does not change original props (per-property easing would be lost)");
		equal( props.b[ 1 ], "_test2", "animate does not change original props (per-property easing would be lost)");
	});

});

test("animate with CSS shorthand properties", function(){
	expect(11);
	stop();

	var _default_count = 0,
		_special_count = 0,
		propsBasic = { "padding": "10 20 30" },
		propsSpecial = { "padding": [ "1 2 3", "_special" ] };

	jQuery.easing._default = function(p) {
		if ( p >= 1 ) {
			_default_count++;
		}
		return p;
	};

	jQuery.easing._special = function(p) {
		if ( p >= 1 ) {
			_special_count++;
		}
		return p;
	};

	jQuery("#foo")
		.animate( propsBasic, 200, "_default", function() {
			equal( this.style.paddingTop, "10px", "padding-top was animated" );
			equal( this.style.paddingLeft, "20px", "padding-left was animated" );
			equal( this.style.paddingRight, "20px", "padding-right was animated" );
			equal( this.style.paddingBottom, "30px", "padding-bottom was animated" );
			equal( _default_count, 4, "per-animation default easing called for each property" );
			_default_count = 0;
		})
		.animate( propsSpecial, 200, "_default", function() {
			equal( this.style.paddingTop, "1px", "padding-top was animated again" );
			equal( this.style.paddingLeft, "2px", "padding-left was animated again" );
			equal( this.style.paddingRight, "2px", "padding-right was animated again" );
			equal( this.style.paddingBottom, "3px", "padding-bottom was animated again" );
			equal( _default_count, 0, "per-animation default easing not called" );
			equal( _special_count, 4, "special easing called for each property" );

			jQuery(this).css("padding", "0");
			delete jQuery.easing._default;
			delete jQuery.easing._special;
			start();
		});
});

test("hide hidden elements, with animation (bug #7141)", function() {
	expect(3);
	QUnit.reset();
	stop();

	var div = jQuery("<div style='display:none'></div>").appendTo("#qunit-fixture");
	equal( div.css("display"), "none", "Element is hidden by default" );
	div.hide(1, function () {
		ok( !jQuery._data(div, "olddisplay"), "olddisplay is undefined after hiding an already-hidden element" );
		div.show(1, function () {
			equal( div.css("display"), "block", "Show a double-hidden element" );
			start();
		});
	});
});

test("animate unit-less properties (#4966)", 2, function() {
	stop();
	var div = jQuery( "<div style='z-index: 0; position: absolute;'></div>" ).appendTo( "#qunit-fixture" );
	equal( div.css( "z-index" ), "0", "z-index is 0" );
	div.animate({ zIndex: 2 }, function() {
		equal( div.css( "z-index" ), "2", "z-index is 2" );
		start();
	});
});

test( "animate properties missing px w/ opacity as last (#9074)", 2, function() {
	expect( 6 );
	stop();
	var div = jQuery( "<div style='position: absolute; margin-left: 0; left: 0px;'></div>" )
		.appendTo( "#qunit-fixture" );
	function cssInt( prop ) {
		return parseInt( div.css( prop ), 10 );
	}
	equal( cssInt( "marginLeft" ), 0, "Margin left is 0" );
	equal( cssInt( "left" ), 0, "Left is 0" );
	div.animate({
		left: 200,
		marginLeft: 200,
		opacity: 0
	}, 2000);
	setTimeout(function() {
		var ml = cssInt( "marginLeft" ),
			l = cssInt( "left" );
		notEqual( ml, 0, "Margin left is not 0 after partial animate" );
		notEqual( ml, 200, "Margin left is not 200 after partial animate" );
		notEqual( l, 0, "Left is not 0 after partial animate" );
		notEqual( l, 200, "Left is not 200 after partial animate" );
		div.stop().remove();
		start();
	}, 500);
});

test("callbacks should fire in correct order (#9100)", function() {
	expect( 1 );

	stop();
	var a = 1,
		cb = 0;

	jQuery("<p data-operation='*2'></p><p data-operation='^2'></p>").appendTo("#qunit-fixture")
		// The test will always pass if no properties are animated or if the duration is 0
		.animate({fontSize: 12}, 13, function() {
			a *= jQuery(this).data("operation") === "*2" ? 2 : a;
			cb++;
			if ( cb === 2 ) {
				equal( a, 4, "test value has been *2 and _then_ ^2");
				start();
			}
		});
});

asyncTest( "callbacks that throw exceptions will be removed (#5684)", function() {
	expect( 2 );

	var foo = jQuery( "#foo" );

	function TestException() {
	}

	foo.animate({ height: 1 }, 1, function() {
		throw new TestException();
	});

	// this test thoroughly abuses undocumented methods - please feel free to update
	// with any changes internally to these functions.

	// make sure that the standard timer loop will NOT run.
	jQuery.fx.stop();

	setTimeout(function() {

		// the first call to fx.tick should raise the callback exception
		raises( jQuery.fx.tick, TestException, "Exception was thrown" );

		// the second call shouldn't
		jQuery.fx.tick();

		ok( true, "Test completed without throwing a second exception" );

		start();
	}, 1);
});

test("animate will scale margin properties individually", function() {
	expect( 2 );
	stop();

	var foo = jQuery( "#foo" ).css({
		"margin": 0,
		"marginLeft": 100
	});

	ok( foo.css( "marginLeft" ) !== foo.css( "marginRight" ), "Sanity Check" );

	foo.animate({
		"margin": 200
	}).stop();

	ok( foo.css( "marginLeft") !== foo.css( "marginRight" ), "The margin properties are different");

	// clean up for next test
	foo.css({
		"marginLeft": "",
		"marginRight": "",
		"marginTop": "",
		"marginBottom": ""
	});
	start();
});

test("Do not append px to 'fill-opacity' #9548", 1, function() {
	var $div = jQuery("<div>").appendTo("#qunit-fixture");

	$div.css("fill-opacity", 0).animate({ "fill-opacity": 1.0 }, 0, function () {
		equal( jQuery(this).css("fill-opacity"), 1, "Do not append px to 'fill-opacity'");
		$div.remove();
	});
});

test("line-height animates correctly (#13855)", function() {
	expect( 12 );
	stop();

	var
		animated = jQuery(
			"<p style='line-height: 4;'>unitless</p>" +
			"<p style='line-height: 50px;'>px</p>" +
			"<p style='line-height: 420%;'>percent</p>" +
			"<p style='line-height: 2.5em;'>em</p>"
		).appendTo("#qunit-fixture"),
		initialHeight = jQuery.map( animated, function( el ) {
			return jQuery( el ).height();
		});

	animated.animate( { "line-height": "hide" }, 1500 );
	setTimeout(function() {
		animated.each(function( i ) {
			var label = jQuery.text( this ),
				initial = initialHeight[ i ],
				height = jQuery( this ).height();
			ok( height < initial, "hide " + label + ": upper bound" );
			ok( height > initial / 2, "hide " + label + ": lower bound" );
		});
		animated.stop( true, true ).hide().animate( { "line-height": "show" }, 1500 );
		setTimeout(function() {
			animated.each(function( i ) {
				var label = jQuery.text( this ),
					initial = initialHeight[ i ],
					height = jQuery( this ).height();
				ok( height < initial / 2, "show " + label + ": upper bound" );
			});
			animated.stop( true, true );
			start();
		}, 400 );
	}, 400 );
});

// Start 1.8 Animation tests
asyncTest( "jQuery.Animation( object, props, opts )", 4, function() {
	var animation,
		testObject = {
			"foo": 0,
			"bar": 1,
			"width": 100
		},
		testDest = {
			"foo": 1,
			"bar": 0,
			"width": 200
		};

	animation = jQuery.Animation( testObject, testDest, { "duration": 1 });
	animation.done(function() {
		for ( var prop in testDest ) {
			equal( testObject[ prop ], testDest[ prop ], "Animated: " + prop );
		}
		animation.done(function() {
			deepEqual( testObject, testDest, "No unexpected properties" );
			start();
		});
	});
});

asyncTest( "Animate Option: step: function( percent, tween )", 1, function() {
	var counter = {};
	jQuery( "#foo" ).animate({
		prop1: 1,
		prop2: 2,
		prop3: 3
	}, {
		duration: 1,
		step: function( value, tween ) {
			var calls = counter[ tween.prop ] = counter[ tween.prop ] || [];
			// in case this is called multiple times for either, lets store it in
			// 0 or 1 in the array
			calls[ value === 0 ? 0 : 1 ] = value;
		}
	}).queue( function( next ) {
		deepEqual( counter, {
			prop1: [0, 1],
			prop2: [0, 2],
			prop3: [0, 3]
		}, "Step function was called once at 0% and once at 100% for each property");
		next();
		start();
	});
});

asyncTest( "Animate callbacks have correct context", 2, function() {
	var foo = jQuery( "#foo" );
	foo.animate({
		height: 10
	}, 10, function() {
		equal( foo[ 0 ], this, "Complete callback after stop(true) `this` is element" );
	}).stop( true, true );
	foo.animate({
		height: 100
	}, 10, function() {
		equal( foo[ 0 ], this, "Complete callback `this` is element" );
		start();
	});
});

asyncTest( "User supplied callback called after show when fx off (#8892)", 2, function() {
	var foo = jQuery( "#foo" );
	jQuery.fx.off = true;
	foo.hide();
	foo.fadeIn( 500, function() {
		ok( jQuery( this ).is( ":visible" ), "Element is visible in callback" );
		foo.fadeOut( 500, function() {
			ok( jQuery( this ).is( ":hidden" ), "Element is hidden in callback" );
			jQuery.fx.off = false;
			start();
		});
	});
});

test( "animate should set display for disconnected nodes", function() {
	expect( 18 );

	var i = 0,
		methods = {
			toggle: [ 1 ],
			slideToggle: [],
			fadeIn: [],
			fadeTo: [ "fast", 0.5 ],
			slideDown: [ "fast" ],
			show: [ 1 ],
			animate: [{ width: "show" }]
		},
		$divTest = jQuery("<div>test</div>"),
		// parentNode = null
		$divEmpty = jQuery("<div/>"),
		$divNone = jQuery("<div style='display: none;'/>"),
		$divInline = jQuery("<div style='display: inline;'/>");

	strictEqual( $divTest.show()[ 0 ].style.display, "block", "set display with show() for element with parentNode = document fragment" );
	strictEqual( $divEmpty.show()[ 0 ].style.display, "block", "set display with show() for element with parentNode = null" );
	strictEqual( $divNone.show()[ 0 ].style.display, "block", "show() should change display if it already set to none" );
	strictEqual( $divInline.show()[ 0 ].style.display, "inline", "show() should not change display if it already set" );

	QUnit.expectJqData( $divTest[ 0 ], "olddisplay" );
	QUnit.expectJqData( $divEmpty[ 0 ], "olddisplay" );
	QUnit.expectJqData( $divNone[ 0 ], "olddisplay" );

	stop();
	jQuery.each( methods, function( name, opt ) {
		jQuery.each([

			// parentNode = document fragment
			jQuery("<div>test</div>"),

			// parentNode = null
			jQuery("<div/>")

		], function() {
			var callback = [function () {
					strictEqual( this.style.display, "block", "set display to block with " + name );

					QUnit.expectJqData( this, "olddisplay" );

					if ( ++i === 14 ) {
						start();
					}
			}];
			jQuery.fn[ name ].apply( this, opt.concat( callback ) );
		});
	});
});

asyncTest("Animation callback should not show animated element as :animated (#7157)", 1, function() {
	var foo = jQuery( "#foo" );

	foo.animate({
		opacity: 0
	}, 100, function() {
		ok( !foo.is(":animated"), "The element is not animated" );
		start();
	});
});

asyncTest( "hide called on element within hidden parent should set display to none (#10045)", 3, function() {
	var hidden = jQuery(".hidden"),
		elems = jQuery("<div>hide</div><div>hide0</div><div>hide1</div>");

	hidden.append( elems );

	jQuery.when(
		elems.eq( 0 ).hide(),
		elems.eq( 1 ).hide( 0 ),
		elems.eq( 2 ).hide( 1 )
	).done(function() {
		strictEqual( elems.get( 0 ).style.display, "none", "hide() called on element within hidden parent should set display to none" );
		strictEqual( elems.get( 1 ).style.display, "none", "hide( 0 ) called on element within hidden parent should set display to none" );
		strictEqual( elems.get( 2 ).style.display, "none", "hide( 1 ) called on element within hidden parent should set display to none" );

		elems.remove();
		start();
	});
});

asyncTest( "hide, fadeOut and slideUp called on element width height and width = 0 should set display to none", 5, function() {
	var foo = jQuery("#foo"),
		i = 0,
		elems = jQuery();

	for ( ; i < 5; i++ ) {
		elems = elems.add("<div style='width:0;height:0;'></div>");
	}

	foo.append( elems );

	jQuery.when(
		elems.eq( 0 ).hide(),
		elems.eq( 1 ).hide( jQuery.noop ),
		elems.eq( 2 ).hide( 1 ),
		elems.eq( 3 ).fadeOut(),
		elems.eq( 4 ).slideUp()
	).done(function() {
		strictEqual( elems.get( 0 ).style.display, "none", "hide() called on element width height and width = 0 should set display to none" );
		strictEqual( elems.get( 1 ).style.display, "none",
												"hide( jQuery.noop ) called on element width height and width = 0 should set display to none" );
		strictEqual( elems.get( 2 ).style.display, "none", "hide( 1 ) called on element width height and width = 0 should set display to none" );
		strictEqual( elems.get( 3 ).style.display, "none", "fadeOut() called on element width height and width = 0 should set display to none" );
		strictEqual( elems.get( 4 ).style.display, "none", "slideUp() called on element width height and width = 0 should set display to none" );

		start();
	});
});

asyncTest( "Handle queue:false promises", 10, function() {
	var foo = jQuery( "#foo" ).clone().addBack(),
		step = 1;

	foo.animate({
		top: 1
	}, {
		duration: 10,
		queue: false,
		complete: function() {
			ok( step++ <= 2, "Step one or two" );
		}
	}).animate({
		bottom: 1
	}, {
		duration: 10,
		complete: function() {
			ok( step > 2 && step < 5, "Step three or four" );
			step++;
		}
	});

	foo.promise().done( function() {
		equal( step++, 5, "steps 1-5: queue:false then queue:fx done" );
		foo.animate({
			top: 10
		}, {
			duration: 10,
			complete: function() {
				ok( step > 5 && step < 8, "Step six or seven" );
				step++;
			}
		}).animate({
			bottom: 10
		}, {
			duration: 10,
			queue: false,
			complete: function() {
				ok( step > 7 && step < 10, "Step eight or nine" );
				step++;
			}
		}).promise().done( function() {
			equal( step++, 10, "steps 6-10: queue:fx then queue:false" );
			start();
		});

	});
});

asyncTest( "multiple unqueued and promise", 4, function() {
	var foo = jQuery( "#foo" ),
		step = 1;
	foo.animate({
		marginLeft: 300
	}, {
		duration: 500,
		queue: false,
		complete: function() {
			strictEqual( step++, 2, "Step 2" );
		}
	}).animate({
		top: 100
	}, {
		duration: 1000,
		queue: false,
		complete: function() {
			strictEqual( step++, 3, "Step 3" );
		}
	}).animate({}, {
		duration: 2000,
		queue: false,
		complete: function() {
			// no properties is a non-op and finishes immediately
			strictEqual( step++, 1, "Step 1" );
		}
	}).promise().done( function() {
		strictEqual( step++, 4, "Step 4" );
		start();
	});
});

asyncTest( "animate does not change start value for non-px animation (#7109)", 1, function() {
	var parent = jQuery( "<div><div></div></div>" ).css({ width: 284, height: 1 }).appendTo( "#qunit-fixture" ),
		child = parent.children().css({ fontSize: "98.6in", width: "0.01em", height: 1 }),
		actual = parseFloat( child.css( "width" ) ),
		computed = [];

	child.animate({ width: "0%" }, {
		duration: 1,
		step: function() {
			computed.push( parseFloat( child.css( "width" ) ) );
		}
	}).queue( function( next ) {
		var ratio = computed[ 0 ] / actual;
		ok( ratio > 0.9 && ratio < 1.1 , "Starting width was close enough" );
		next();
		parent.remove();
		start();
	});
});

asyncTest( "non-px animation handles non-numeric start (#11971)", 2, function() {
	var foo = jQuery("#foo"),
		initial = foo.css("backgroundPositionX");

	if ( !initial ) {
		expect(1);
		ok( true, "Style property not understood" );
		start();
		return;
	}

	foo.animate({ backgroundPositionX: "42%" }, {
		duration: 1,
		progress: function( anim, percent ) {
			if ( percent ) {
				return;
			}

			if ( parseFloat( initial ) ) {
				equal( jQuery.style( this, "backgroundPositionX" ), initial, "Numeric start preserved" );
			} else {
				equal( jQuery.style( this, "backgroundPositionX" ), "0%", "Non-numeric start zeroed" );
			}
		},
		done: function() {
			equal( jQuery.style( this, "backgroundPositionX" ), "42%", "End reached" );
			start();
		}
	});
});

asyncTest("Animation callbacks (#11797)", 15, function() {
	var targets = jQuery("#foo").children(),
		done = false,
		expectedProgress = 0;

	targets.eq( 0 ).animate( {}, {
		duration: 1,
		start: function() {
			ok( true, "empty: start" );
		},
		progress: function( anim, percent ) {
			equal( percent, 0, "empty: progress 0" );
		},
		done: function() {
			ok( true, "empty: done" );
		},
		fail: function() {
			ok( false, "empty: fail" );
		},
		always: function() {
			ok( true, "empty: always" );
			done = true;
		}
	});

	ok( done, "empty: done immediately" );

	done = false;
	targets.eq( 1 ).animate({
		opacity: 0
	}, {
		duration: 1,
		start: function() {
			ok( true, "stopped: start" );
		},
		progress: function( anim, percent ) {
			equal( percent, 0, "stopped: progress 0" );
		},
		done: function() {
			ok( false, "stopped: done" );
		},
		fail: function() {
			ok( true, "stopped: fail" );
		},
		always: function() {
			ok( true, "stopped: always" );
			done = true;
		}
	}).stop();

	ok( done, "stopped: stopped immediately" );

	targets.eq( 2 ).animate({
		opacity: 0
	}, {
		duration: 1,
		start: function() {
			ok( true, "async: start" );
		},
		progress: function( anim, percent ) {
			// occasionally the progress handler is called twice in first frame.... *shrug*
			if ( percent === 0 && expectedProgress === 1 ) {
				return;
			}
			equal( percent, expectedProgress, "async: progress " + expectedProgress );
			// once at 0, once at 1
			expectedProgress++;
		},
		done: function() {
			ok( true, "async: done" );
		},
		fail: function() {
			ok( false, "async: fail" );
		},
		always: function() {
			ok( true, "async: always" );
			start();
		}
	});
});

test( "Animate properly sets overflow hidden when animating width/height (#12117)", 8, function() {
	jQuery.each( [ "height", "width" ], function( _, prop ) {
		jQuery.each( [ 100, 0 ], function( _, value ) {
			var div = jQuery("<div>").css( "overflow", "auto" ),
				props = {};
			props[ prop ] = value;
			div.animate( props, 1 );
			equal( div.css( "overflow" ), "hidden",
				"overflow: hidden set when animating " + prop + " to " + value );
			div.stop();
			equal( div.css( "overflow" ), "auto",
				"overflow: auto restored after animating " + prop + " to " + value );
		});
	});
});

test( "Each tick of the timer loop uses a fresh time (#12837)", function() {
	var lastVal, current,
		tmp = jQuery({
			test: 0
		});
	expect( 3 );
	tmp.animate({
		test: 100
	}, {
		step: function( p, fx ) {
			ok( fx.now !== lastVal, "Current value is not the last value: " + lastVal + " - " + fx.now );
			lastVal = fx.now;
		}
	});
	current = jQuery.now();
	// intentionally empty, we want to spin wheels until the time changes.
	while ( current === jQuery.now() ) { }

	// now that we have a new time, run another tick
	jQuery.fx.tick();

	current = jQuery.now();
	// intentionally empty, we want to spin wheels until the time changes.
	while ( current === jQuery.now() ) { }

	jQuery.fx.tick();
	tmp.stop();
});

test( "Animations with 0 duration don't ease (#12273)", 1, function() {
	jQuery.easing.test = function() {
		ok( false, "Called easing" );
	};

	jQuery( "#foo" ).animate({
		height: 100
	}, {
		duration: 0,
		easing: "test",
		complete: function() {
			equal( jQuery( this ).height(), 100, "Height is 100" );
		}
	});

	delete jQuery.easing.test;
});

jQuery.map([ "toggle", "slideToggle", "fadeToggle" ], function ( method ) {
	// this test would look a lot better if we were using something to override
	// the default timers
	var duration = 1500;
	asyncTest( "toggle state tests: " + method + " (#8685)", function() {
		function secondToggle() {
			var stopped = parseFloat( element.css( check ) );
			tested = false;
			element[ method ]({
				duration: duration,
				step: function( p, fx ) {
					if ( fx.pos > 0.1 && fx.prop === check && !tested ) {
						tested = true;
						equal( fx.start, stopped, check + " starts at " + stopped + " where it stopped" );
						equal( fx.end, original, check + " ending value is " + original );
						element.stop();
					}
				},
				always: start
			});
		}

		var tested,
			original,
			check = method === "slideToggle" ? "height" : "opacity",
			element = jQuery("#foo").height( 200 );

		expect( 4 );

		element[ method ]({
			duration: duration,
			easing: "linear",
			step: function( p, fx ) {
				if ( fx.pos > 0.1 && fx.prop === check && !tested ) {
					tested = true;
					original = fx.start;
					ok( fx.start !== 0, check + " is starting at " + original + " on first toggle (non-zero)" );
					equal( fx.end, 0, check + " is ending at 0 on first toggle" );
					element.stop();
				}
			},
			always: secondToggle
		});
	});
});

test( "jQuery.fx.start & jQuery.fx.stop hook points", function() {
	var oldStart = jQuery.fx.start,
		oldStop = jQuery.fx.stop,
		foo = jQuery({ foo: 0 });

	expect( 3 );

	jQuery.fx.start = function() {
		ok( true, "start called" );
	};
	jQuery.fx.stop = function() {
		ok( true, "stop called" );
	};

	// calls start
	foo.animate({ foo: 1 }, { queue: false });
	// calls start
	foo.animate({ foo: 2 }, { queue: false });
	foo.stop();
	// calls stop
	jQuery.fx.tick();

	// cleanup
	jQuery.fx.start = oldStart;
	jQuery.fx.stop = oldStop;
});

test( ".finish() completes all queued animations", function() {
	var animations = {
			top: 100,
			left: 100,
			height: 100,
			width: 100
		},
		div = jQuery("<div>");

	expect( 11 );

	jQuery.each( animations, function( prop, value ) {
		var anim = {};
		anim[ prop ] = value;
		// the delay shouldn't matter at all!
		div.css( prop, 1 ).animate( anim, function() {
			ok( true, "Called animation callback for " + prop );
		}).delay( 100 );
	});
	equal( div.queue().length, 8, "8 animations in the queue" );
	div.finish();
	jQuery.each( animations, function( prop, value ) {
		equal( parseFloat( div.css( prop ) ), value, prop + " finished at correct value" );
	});
	equal( div.queue().length, 0, "empty queue when done" );
	equal( div.is(":animated"), false, ":animated doesn't match" );

	// cleanup
	div.remove();
	// leaves a "shadow timer" which does nothing around, need to force a tick
	jQuery.fx.tick();
});

test( ".finish( false ) - unqueued animations", function() {
	var animations = {
			top: 100,
			left: 100,
			height: 100,
			width: 100
		},
		div = jQuery("<div>");

	expect( 10 );

	jQuery.each( animations, function( prop, value ) {
		var anim = {};
		anim[ prop ] = value;
		div.css( prop, 1 ).animate( anim, {
			queue: false,
			complete: function() {
				ok( true, "Called animation callback for " + prop );
			}
		});
	});
	equal( div.queue().length, 0, "0 animations in the queue" );
	div.finish( false );
	jQuery.each( animations, function( prop, value ) {
		equal( parseFloat( div.css( prop ) ), value, prop + " finished at correct value" );
	});
	equal( div.is(":animated"), false, ":animated doesn't match" );

	// cleanup
	div.remove();
	// leaves a "shadow timer" which does nothing around, need to force a tick
	jQuery.fx.tick();
});

test( ".finish( \"custom\" ) - custom queue animations", function() {
	var animations = {
			top: 100,
			left: 100,
			height: 100,
			width: 100
		},
		div = jQuery("<div>");

	expect( 11 );

	jQuery.each( animations, function( prop, value ) {
		var anim = {};
		anim[ prop ] = value;
		div.css( prop, 1 ).animate( anim, {
			queue: "custom",
			complete: function() {
				ok( true, "Called animation callback for " + prop );
			}
		});
	});
	equal( div.queue( "custom" ).length, 4, "4 animations in the queue" );
	// start the first animation
	div.dequeue( "custom" );
	equal( div.is(":animated"), true, ":animated matches" );
	div.finish( "custom" );
	jQuery.each( animations, function( prop, value ) {
		equal( parseFloat( div.css( prop ) ), value, prop + " finished at correct value" );
	});
	equal( div.is(":animated"), false, ":animated doesn't match" );

	// cleanup
	div.remove();
	// leaves a "shadow timer" which does nothing around, need to force a tick
	jQuery.fx.tick();
});

test( ".finish() calls finish of custom queue functions", function() {
	function queueTester( next, hooks ) {
		hooks.stop = function( gotoEnd ) {
			inside++;
			equal( this, div[0] );
			ok( gotoEnd, "hooks.stop(true) called");
		};
	}
	var div = jQuery( "<div>" ),
		inside = 0,
		outside = 0;

	expect( 6 );
	queueTester.finish = function() {
		outside++;
		ok( true, "Finish called on custom queue function" );
	};

	div.queue( queueTester ).queue( queueTester ).queue( queueTester ).finish();

	equal( inside, 1, "1 stop(true) callback" );
	equal( outside, 2, "2 finish callbacks" );

	div.remove();
});

asyncTest( ".finish() is applied correctly when multiple elements were animated (#13937)", function() {
	expect( 3 );

	var elems = jQuery("<a>0</a><a>1</a><a>2</a>");

	elems.animate( { opacity: 0 }, 1500 ).animate( { opacity: 1 }, 1500 );
	setTimeout(function() {
		elems.eq( 1 ).finish();
		ok( !elems.eq( 1 ).queue().length, "empty queue for .finish()ed element" );
		ok( elems.eq( 0 ).queue().length, "non-empty queue for preceding element" );
		ok( elems.eq( 2 ).queue().length, "non-empty queue for following element" );
		elems.stop( true );

		// setTimeout needed in order to avoid setInterval/setTimeout execution bug in FF
		window.setTimeout(function() {
			start();
		}, 1000 );
	}, 100 );
});

asyncTest( "slideDown() after stop() (#13483)", 2, function() {
	var ul = jQuery( "<ul style='height: 100px;display: block'></ul>" ),
		origHeight = ul.height();

	// First test. slideUp() -> stop() in the middle -> slideDown() until the end
	ul.slideUp( 1000 );
	setTimeout( function() {
		ul.stop( true );
		ul.slideDown( 1, function() {
			equal( ul.height(), origHeight, "slideDown() after interrupting slideUp() with stop(). Height must be in original value" );

			// Second test. slideDown() -> stop() in the middle -> slideDown() until the end
			ul.slideUp( 1, function() {
				ul.slideDown( 1000 );
				setTimeout( function() {
					ul.stop( true );
					ul.slideDown( 1, function() {
						equal( ul.height(), origHeight, "slideDown() after interrupting slideDown() with stop(). Height must be in original value" );

						// Cleanup
						ul.remove();
						start();
					});
				}, 500 );
			});

		});
	}, 500 );
});

asyncTest( "fadeIn() after stop() (related to #13483)", 2, function() {
	var ul = jQuery( "<ul style='height: 100px;display: block; opacity: 1'></ul>" ),
		origOpacity = ul.css( "opacity" );

	// First test. fadeOut() -> stop() in the middle -> fadeIn() until the end
	ul.fadeOut( 1000 );
	setTimeout( function() {
		ul.stop( true );
		ul.fadeIn( 1, function() {
			equal( ul.css( "opacity" ), origOpacity, "fadeIn() after interrupting fadeOut() with stop(). Opacity must be in original value" );

			// Second test. fadeIn() -> stop() in the middle -> fadeIn() until the end
			ul.fadeOut( 1, function() {
				ul.fadeIn( 1000 );
				setTimeout( function() {
					ul.stop( true );
					ul.fadeIn( 1, function() {
						equal( ul.css("opacity"), origOpacity, "fadeIn() after interrupting fadeIn() with stop(). Opacity must be in original value" );

						// Cleanup
						ul.remove();
						start();
					});
				}, 500 );
			});

		});
	}, 500 );
});

})();
