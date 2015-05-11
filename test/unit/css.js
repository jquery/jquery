if ( jQuery.css ) {

module("css", { teardown: moduleTeardown });

test("css(String|Hash)", function() {
	expect( 42 );

	equal( jQuery("#qunit-fixture").css("display"), "block", "Check for css property \"display\"" );

	var $child, div, div2, width, height, child, prctval, checkval, old;

	$child = jQuery("#nothiddendivchild").css({ "width": "20%", "height": "20%" });
	notEqual( $child.css("width"), "20px", "Retrieving a width percentage on the child of a hidden div returns percentage" );
	notEqual( $child.css("height"), "20px", "Retrieving a height percentage on the child of a hidden div returns percentage" );

	div = jQuery( "<div/>" );

	// These should be "auto" (or some better value)
	// temporarily provide "0px" for backwards compat
	equal( div.css("width"), "0px", "Width on disconnected node." );
	equal( div.css("height"), "0px", "Height on disconnected node." );

	div.css({ "width": 4, "height": 4 });

	equal( div.css("width"), "4px", "Width on disconnected node." );
	equal( div.css("height"), "4px", "Height on disconnected node." );

	div2 = jQuery( "<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'/><div style='height:20px;'></div></div>").appendTo("body");

	equal( div2.find("input").css("height"), "20px", "Height on hidden input." );
	equal( div2.find("textarea").css("height"), "20px", "Height on hidden textarea." );
	equal( div2.find("div").css("height"), "20px", "Height on hidden textarea." );

	div2.remove();

	// handle negative numbers by setting to zero #11604
	jQuery("#nothiddendiv").css( {"width": 1, "height": 1} );

	width = parseFloat(jQuery("#nothiddendiv").css("width"));
	height = parseFloat(jQuery("#nothiddendiv").css("height"));
	jQuery("#nothiddendiv").css({ "overflow":"hidden", "width": -1, "height": -1 });
	equal( parseFloat(jQuery("#nothiddendiv").css("width")), 0, "Test negative width set to 0");
	equal( parseFloat(jQuery("#nothiddendiv").css("height")), 0, "Test negative height set to 0");

	equal( jQuery("<div style='display: none;'/>").css("display"), "none", "Styles on disconnected nodes");

	jQuery("#floatTest").css({"float": "right"});
	equal( jQuery("#floatTest").css("float"), "right", "Modified CSS float using \"float\": Assert float is right");
	jQuery("#floatTest").css({"font-size": "30px"});
	equal( jQuery("#floatTest").css("font-size"), "30px", "Modified CSS font-size: Assert font-size is 30px");
	jQuery.each("0,0.25,0.5,0.75,1".split(","), function(i, n) {
		jQuery("#foo").css({"opacity": n});

		equal( jQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		jQuery("#foo").css({"opacity": parseFloat(n)});
		equal( jQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	jQuery("#foo").css({"opacity": ""});
	equal( jQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when set to an empty String" );

	equal( jQuery("#empty").css("opacity"), "0", "Assert opacity is accessible via filter property set in stylesheet in IE" );
	jQuery("#empty").css({ "opacity": "1" });
	equal( jQuery("#empty").css("opacity"), "1", "Assert opacity is taken from style attribute when set vs stylesheet in IE with filters" );

	div = jQuery("#nothiddendiv");
	child = jQuery("#nothiddendivchild");

	equal( parseInt(div.css("fontSize"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(div.css("font-size"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(child.css("fontSize"), 10), 16, "Verify fontSize px set." );
	equal( parseInt(child.css("font-size"), 10), 16, "Verify fontSize px set." );

	child.css("height", "100%");
	equal( child[0].style.height, "100%", "Make sure the height is being set correctly." );

	child.attr("class", "em");
	equal( parseInt(child.css("fontSize"), 10), 32, "Verify fontSize em set." );

	// Have to verify this as the result depends upon the browser's CSS
	// support for font-size percentages
	child.attr("class", "prct");
	prctval = parseInt(child.css("fontSize"), 10);
	checkval = 0;
	if ( prctval === 16 || prctval === 24 ) {
		checkval = prctval;
	}

	equal( prctval, checkval, "Verify fontSize % set." );

	equal( typeof child.css("width"), "string", "Make sure that a string width is returned from css('width')." );

	old = child[0].style.height;

	// Test NaN
	child.css("height", parseFloat("zoo"));
	equal( child[0].style.height, old, "Make sure height isn't changed on NaN." );

	// Test null
	child.css("height", null);
	equal( child[0].style.height, old, "Make sure height isn't changed on null." );

	old = child[0].style.fontSize;

	// Test NaN
	child.css("font-size", parseFloat("zoo"));
	equal( child[0].style.fontSize, old, "Make sure font-size isn't changed on NaN." );

	// Test null
	child.css("font-size", null);
	equal( child[0].style.fontSize, old, "Make sure font-size isn't changed on null." );

	strictEqual( child.css( "x-fake" ), undefined, "Make sure undefined is returned from css(nonexistent)." );

	div = jQuery( "<div/>" ).css({ position: "absolute", "z-index": 1000 }).appendTo( "#qunit-fixture" );
	strictEqual( div.css( "z-index" ), "1000",
		"Make sure that a string z-index is returned from css('z-index') (#14432)." );
});

test( "css() explicit and relative values", 29, function() {
	var $elem = jQuery("#nothiddendiv");

	$elem.css({ "width": 1, "height": 1, "paddingLeft": "1px", "opacity": 1 });
	equal( $elem.css("width"), "1px", "Initial css set or width/height works (hash)" );
	equal( $elem.css("paddingLeft"), "1px", "Initial css set of paddingLeft works (hash)" );
	equal( $elem.css("opacity"), "1", "Initial css set of opacity works (hash)" );

	$elem.css({ width: "+=9" });
	equal( $elem.css("width"), "10px", "'+=9' on width (hash)" );

	$elem.css({ "width": "-=9" });
	equal( $elem.css("width"), "1px", "'-=9' on width (hash)" );

	$elem.css({ "width": "+=9px" });
	equal( $elem.css("width"), "10px", "'+=9px' on width (hash)" );

	$elem.css({ "width": "-=9px" });
	equal( $elem.css("width"), "1px", "'-=9px' on width (hash)" );

	$elem.css( "width", "+=9" );
	equal( $elem.css("width"), "10px", "'+=9' on width (params)" );

	$elem.css( "width", "-=9" ) ;
	equal( $elem.css("width"), "1px", "'-=9' on width (params)" );

	$elem.css( "width", "+=9px" );
	equal( $elem.css("width"), "10px", "'+=9px' on width (params)" );

	$elem.css( "width", "-=9px" );
	equal( $elem.css("width"), "1px", "'-=9px' on width (params)" );

	$elem.css( "width", "-=-9px" );
	equal( $elem.css("width"), "10px", "'-=-9px' on width (params)" );

	$elem.css( "width", "+=-9px" );
	equal( $elem.css("width"), "1px", "'+=-9px' on width (params)" );

	$elem.css({ "paddingLeft": "+=4" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4' on paddingLeft (hash)" );

	$elem.css({ "paddingLeft": "-=4" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4' on paddingLeft (hash)" );

	$elem.css({ "paddingLeft": "+=4px" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4px' on paddingLeft (hash)" );

	$elem.css({ "paddingLeft": "-=4px" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4px' on paddingLeft (hash)" );

	$elem.css({ "padding-left": "+=4" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4' on padding-left (hash)" );

	$elem.css({ "padding-left": "-=4" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4' on padding-left (hash)" );

	$elem.css({ "padding-left": "+=4px" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4px' on padding-left (hash)" );

	$elem.css({ "padding-left": "-=4px" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4px' on padding-left (hash)" );

	$elem.css( "paddingLeft", "+=4" );
	equal( $elem.css("paddingLeft"), "5px", "'+=4' on paddingLeft (params)" );

	$elem.css( "paddingLeft", "-=4" );
	equal( $elem.css("paddingLeft"), "1px", "'-=4' on paddingLeft (params)" );

	$elem.css( "padding-left", "+=4px" );
	equal( $elem.css("paddingLeft"), "5px", "'+=4px' on padding-left (params)" );

	$elem.css( "padding-left", "-=4px" );
	equal( $elem.css("paddingLeft"), "1px", "'-=4px' on padding-left (params)" );

	$elem.css({ "opacity": "-=0.5" });
	equal( $elem.css("opacity"), "0.5", "'-=0.5' on opacity (hash)" );

	$elem.css({ "opacity": "+=0.5" });
	equal( $elem.css("opacity"), "1", "'+=0.5' on opacity (hash)" );

	$elem.css( "opacity", "-=0.5" );
	equal( $elem.css("opacity"), "0.5", "'-=0.5' on opacity (params)" );

	$elem.css( "opacity", "+=0.5" );
	equal( $elem.css("opacity"), "1", "'+=0.5' on opacity (params)" );
});

test( "css() non-px relative values (gh-1711)", 17, function() {
	var cssCurrent,
		units = {},
		$child = jQuery( "#nothiddendivchild" ),
		add = function( prop, val, unit ) {
			var difference,
				adjustment = ( val < 0 ? "-=" : "+=" ) + Math.abs( val ) + unit,
				message = prop + ": " + adjustment,
				cssOld = cssCurrent,
				expected = cssOld + val * units[ prop ][ unit ];

			// Apply change
			$child.css( prop, adjustment );
			cssCurrent = parseFloat( $child.css( prop ) );

			// Require a difference of no more than one pixel
			difference = Math.abs( cssCurrent - expected );
			if ( difference <= 1 ) {
				ok( true, message );

			// ...or fail with actual and expected values
			} else {
				ok( false, message + " (actual " + cssCurrent + ", expected " + expected + ")" );
			}
		},
		getUnits = function( prop ) {
			units[ prop ] = {
				"px": 1,
				"em": parseFloat( $child.css( prop, "100em" ).css( prop ) ) / 100,
				"pt": parseFloat( $child.css( prop, "100pt" ).css( prop ) ) / 100,
				"pc": parseFloat( $child.css( prop, "100pc" ).css( prop ) ) / 100,
				"cm": parseFloat( $child.css( prop, "100cm" ).css( prop ) ) / 100,
				"mm": parseFloat( $child.css( prop, "100mm" ).css( prop ) ) / 100,
				"%" : parseFloat( $child.css( prop, "100%"  ).css( prop ) ) / 100
			};
		};

	jQuery( "#nothiddendiv" ).css({ height: 1, padding: 0, width: 400 });
	$child.css({ height: 1, padding: 0 });

	getUnits( "width" );
	cssCurrent = parseFloat( $child.css( "width", "50%" ).css( "width" ) );
	add( "width",  25,    "%" );
	add( "width", -50,    "%" );
	add( "width",  10,   "em" );
	add( "width",  10,   "pt" );
	add( "width",  -2.3, "pt" );
	add( "width",   5,   "pc" );
	add( "width",  -5,   "em" );
	add( "width",  +2,   "cm" );
	add( "width", -15,   "mm" );
	add( "width",  21,   "px" );

	getUnits( "lineHeight" );
	cssCurrent = parseFloat( $child.css( "lineHeight", "1em" ).css( "lineHeight" ) );
	add( "lineHeight",   2, "em" );
	add( "lineHeight", -10, "px" );
	add( "lineHeight",  20, "pt" );
	add( "lineHeight",  30, "pc" );
	add( "lineHeight",   1, "cm" );
	add( "lineHeight", -20, "mm" );
	add( "lineHeight",  50,  "%" );
});

test("css(String, Object)", function() {
	expect( 19 );
	var j, div, display, ret, success;

	jQuery("#floatTest").css("float", "left");
	equal( jQuery("#floatTest").css("float"), "left", "Modified CSS float using \"float\": Assert float is left");
	jQuery("#floatTest").css("font-size", "20px");
	equal( jQuery("#floatTest").css("font-size"), "20px", "Modified CSS font-size: Assert font-size is 20px");

	jQuery.each("0,0.25,0.5,0.75,1".split(","), function(i, n) {
		jQuery("#foo").css("opacity", n);
		equal( jQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		jQuery("#foo").css("opacity", parseFloat(n));
		equal( jQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	jQuery("#foo").css("opacity", "");
	equal( jQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when set to an empty String" );

	// using contents will get comments regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();
	j.css("overflow", "visible");
	equal( j.css("overflow"), "visible", "Check node,textnode,comment css works" );
	equal( jQuery("#t2037 .hidden").css("display"), "none", "Make sure browser thinks it is hidden" );

	div = jQuery("#nothiddendiv");
	display = div.css("display");
	ret = div.css("display", undefined);

	equal( ret, div, "Make sure setting undefined returns the original set." );
	equal( div.css("display"), display, "Make sure that the display wasn't changed." );

	success = true;
	try {
		jQuery( "#foo" ).css( "backgroundColor", "rgba(0, 0, 0, 0.1)" );
	}
	catch (e) {
		success = false;
	}
	ok( success, "Setting RGBA values does not throw Error (#5509)" );

	jQuery( "#foo" ).css( "font", "7px/21px sans-serif" );
	strictEqual( jQuery( "#foo" ).css( "line-height" ), "21px",
		"Set font shorthand property (#14759)" );
});

test( "css(String, Object) with negative values", function() {
	expect( 4 );

	jQuery( "#nothiddendiv" ).css( "margin-top", "-10px" );
	jQuery( "#nothiddendiv" ).css( "margin-left", "-10px" );
	equal( jQuery( "#nothiddendiv" ).css( "margin-top" ), "-10px", "Ensure negative top margins work." );
	equal( jQuery( "#nothiddendiv" ).css( "margin-left" ), "-10px", "Ensure negative left margins work." );

	jQuery( "#nothiddendiv" ).css( "position", "absolute" );
	jQuery( "#nothiddendiv" ).css( "top", "-20px" );
	jQuery( "#nothiddendiv" ).css( "left", "-20px" );
	equal( jQuery( "#nothiddendiv" ).css( "top" ), "-20px", "Ensure negative top values work." );
	equal( jQuery( "#nothiddendiv" ).css( "left" ), "-20px", "Ensure negative left values work." );
});

test( "css(Array)", function() {
	expect( 2 );

	var expectedMany = {
			"overflow": "visible",
			"width": "16px"
		},
		expectedSingle = {
			"width": "16px"
		},
		elem = jQuery("<div></div>").appendTo("#qunit-fixture");

	deepEqual( elem.css( expectedMany ).css([ "overflow", "width" ]), expectedMany, "Getting multiple element array" );
	deepEqual( elem.css( expectedSingle ).css([ "width" ]), expectedSingle, "Getting single element array" );
});

test("css(String, Function)", function() {
	expect(3);

	var index,
		sizes = ["10px", "20px", "30px"];

	jQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	index = 0;

	jQuery("#cssFunctionTest div").css("font-size", function() {
		var size = sizes[index];
		index++;
		return size;
	});

	index = 0;

	jQuery("#cssFunctionTest div").each(function() {
		var computedSize = jQuery(this).css("font-size"),
			expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
	});

	jQuery("#cssFunctionTest").remove();
});

test("css(String, Function) with incoming value", function() {
	expect(3);

	var index,
		sizes = ["10px", "20px", "30px"];

	jQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	index = 0;

	jQuery("#cssFunctionTest div").css("font-size", function() {
		var size = sizes[index];
		index++;
		return size;
	});

	index = 0;

	jQuery("#cssFunctionTest div").css("font-size", function(i, computedSize) {
		var expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
		return computedSize;
	});

	jQuery("#cssFunctionTest").remove();
});

test("css(Object) where values are Functions", function() {
	expect(3);

	var index,
		sizes = ["10px", "20px", "30px"];

	jQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	index = 0;

	jQuery("#cssFunctionTest div").css({"fontSize": function() {
		var size = sizes[index];
		index++;
		return size;
	}});

	index = 0;

	jQuery("#cssFunctionTest div").each(function() {
		var computedSize = jQuery(this).css("font-size"),
			expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
	});

	jQuery("#cssFunctionTest").remove();
});

test("css(Object) where values are Functions with incoming values", function() {
	expect(3);

	var index,
		sizes = ["10px", "20px", "30px"];

	jQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	index = 0;

	jQuery("#cssFunctionTest div").css({"fontSize": function() {
		var size = sizes[index];
		index++;
		return size;
	}});

	index = 0;

	jQuery("#cssFunctionTest div").css({"font-size": function(i, computedSize) {
		var expectedSize = sizes[index];
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
		return computedSize;
	}});

	jQuery("#cssFunctionTest").remove();
});

test("show(); hide()", function() {

	expect( 4 );

	var hiddendiv, div;

	hiddendiv = jQuery("div.hidden");
	hiddendiv.hide();
	equal( hiddendiv.css("display"), "none", "Cascade-hidden div after hide()" );
	hiddendiv.show();
	equal( hiddendiv.css("display"), "none", "Show does not trump CSS cascade" );

	div = jQuery("<div>").hide();
	equal( div.css("display"), "none", "Detached div hidden" );
	div.appendTo("#qunit-fixture").show();
	equal( div.css("display"), "block", "Initially-detached div after show()" );

});

test("show();", function() {

	expect( 18 );

	var hiddendiv, div, pass, old, test;
		hiddendiv = jQuery("div.hidden");

	equal(jQuery.css( hiddendiv[0], "display"), "none", "hiddendiv is display: none");

	hiddendiv.css("display", "block");
	equal(jQuery.css( hiddendiv[0], "display"), "block", "hiddendiv is display: block");

	hiddendiv.show();
	equal(jQuery.css( hiddendiv[0], "display"), "block", "hiddendiv is display: block");

	hiddendiv.css("display","");

	pass = true;
	div = jQuery("#qunit-fixture div");
	div.show().each(function(){
		if ( this.style.display === "none" ) {
			pass = false;
		}
	});
	ok( pass, "Show" );

	jQuery(
		"<div id='show-tests'>" +
		"<div><p><a href='#'></a></p><code></code><pre></pre><span></span></div>" +
		"<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>" +
		"<ul><li></li></ul></div>" +
		"<table id='test-table'></table>"
	).appendTo( "#qunit-fixture" ).find( "*" ).css( "display", "none" );

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

	// Make sure that showing or hiding a text node doesn't cause an error
	jQuery("<div>test</div> text <span>test</span>").show().remove();
	jQuery("<div>test</div> text <span>test</span>").hide().remove();
});

test( "show() resolves correct default display for detached nodes", function(){
	expect( 16 );

	var div, span, tr;

	div = jQuery("<div class='hidden'>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "none",
		"A shown-while-detached div can be hidden by the CSS cascade" );

	div = jQuery("<div><div class='hidden'></div></div>").children("div");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "none",
		"A shown-while-detached div inside a visible div can be hidden by the CSS cascade" );

	span = jQuery("<span class='hidden'/>");
	span.show().appendTo("#qunit-fixture");
	equal( span.css("display"), "none",
		"A shown-while-detached span can be hidden by the CSS cascade" );

	div = jQuery("div.hidden");
	div.detach().show();
	ok( !div[ 0 ].style.display,
		"show() does not update inline style of a cascade-hidden-before-detach div" );
	div.appendTo("#qunit-fixture");
	equal( div.css("display"), "none",
		"A shown-while-detached cascade-hidden div is hidden after attachment" );
	div.remove();

	span = jQuery("<span class='hidden'/>");
	span.appendTo("#qunit-fixture").detach().show().appendTo("#qunit-fixture");
	equal( span.css("display"), "none",
		"A shown-while-detached cascade-hidden span is hidden after attachment" );
	span.remove();

	div = jQuery( document.createElement("div") );
	div.show().appendTo("#qunit-fixture");
	ok( !div[ 0 ].style.display, "A shown-while-detached div has no inline style" );
	equal( div.css("display"), "block",
		"A shown-while-detached div has default display after attachment" );
	div.remove();

	div = jQuery("<div style='display: none'>");
	div.show();
	equal( div[ 0 ].style.display, "",
		"show() updates inline style of a detached inline-hidden div" );
	div.appendTo("#qunit-fixture");
	equal( div.css("display"), "block",
		"A shown-while-detached inline-hidden div has default display after attachment" );

	div = jQuery("<div><div style='display: none'></div></div>").children("div");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block",
		"A shown-while-detached inline-hidden div inside a visible div has default display " +
		"after attachment" );

	span = jQuery("<span style='display: none'/>");
	span.show();
	equal( span[ 0 ].style.display, "",
		"show() updates inline style of a detached inline-hidden span" );
	span.appendTo("#qunit-fixture");
	equal( span.css("display"), "inline",
		"A shown-while-detached inline-hidden span has default display after attachment" );

	div = jQuery("<div style='display: inline'/>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "inline",
		"show() does not update inline style of a detached inline-visible div" );
	div.remove();

	tr = jQuery("<tr/>");
	jQuery("#table").append( tr );
	tr.detach().hide().show();

	ok( !tr[ 0 ].style.display, "Not-hidden detached tr elements have no inline style" );
	tr.remove();

	span = jQuery("<span/>").hide().show();
	ok( !span[ 0 ].style.display, "Not-hidden detached span elements have no inline style" );
	span.remove();
});

test("toggle()", function() {
	expect(9);
	var div, oldHide,
		x = jQuery("#foo");

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

	div = jQuery("<div style='display:none'><div></div></div>").appendTo("#qunit-fixture");
	x = div.find("div");
	strictEqual( x.toggle().css( "display" ), "none", "is hidden" );
	strictEqual( x.toggle().css( "display" ), "block", "is visible" );

	// Ensure hide() is called when toggled (#12148)
	oldHide = jQuery.fn.hide;
	jQuery.fn.hide = function() {
		ok( true, name + " method called on toggle" );
		return oldHide.apply( this, arguments );
	};
	x.toggle( name === "show" );
	jQuery.fn.hide = oldHide;
});

test("hide hidden elements (bug #7141)", function() {
	expect(3);

	var div = jQuery("<div style='display:none'></div>").appendTo("#qunit-fixture");
	equal( div.css("display"), "none", "Element is hidden by default" );
	div.hide();
	ok( !jQuery._data(div, "olddisplay"), "olddisplay is undefined after hiding an already-hidden element" );
	div.show();
	equal( div.css("display"), "block", "Show a double-hidden element" );

	div.remove();
});

test("jQuery.css(elem, 'height') doesn't clear radio buttons (bug #1095)", function () {
	expect(4);

	var $checkedtest = jQuery("#checkedtest");
	jQuery.css($checkedtest[0], "height");

	ok( jQuery("input[type='radio']", $checkedtest).first().attr("checked"), "Check first radio still checked." );
	ok( !jQuery("input[type='radio']", $checkedtest).last().attr("checked"), "Check last radio still NOT checked." );
	ok( jQuery("input[type='checkbox']", $checkedtest).first().attr("checked"), "Check first checkbox still checked." );
	ok( !jQuery("input[type='checkbox']", $checkedtest).last().attr("checked"), "Check last checkbox still NOT checked." );
});

test("internal ref to elem.runtimeStyle (bug #7608)", function () {
	expect(1);
	var result = true;

	try {
		jQuery("#foo").css( { "width": "0%" } ).css("width");
	} catch (e) {
		result = false;
	}

	ok( result, "elem.runtimeStyle does not throw exception" );
});

test("marginRight computed style (bug #3333)", function() {
	expect(1);

	var $div = jQuery("#foo");
	$div.css({
		"width": "1px",
		"marginRight": 0
	});

	equal($div.css("marginRight"), "0px", "marginRight correctly calculated with a width and display block");
});

test("box model properties incorrectly returning % instead of px, see #10639 and #12088", function() {
	expect( 2 );

	var container = jQuery("<div/>").width( 400 ).appendTo("#qunit-fixture"),
		el = jQuery("<div/>").css({ "width": "50%", "marginRight": "50%" }).appendTo( container ),
		el2 = jQuery("<div/>").css({ "width": "50%", "minWidth": "300px", "marginLeft": "25%" }).appendTo( container );

	equal( el.css("marginRight"), "200px", "css('marginRight') returning % instead of px, see #10639" );
	equal( el2.css("marginLeft"), "100px", "css('marginLeft') returning incorrect pixel value, see #12088" );
});

test("jQuery.cssProps behavior, (bug #8402)", function() {
	expect( 2 );

	var div = jQuery( "<div>" ).appendTo(document.body).css({
		"position": "absolute",
		"top": 0,
		"left": 10
	});
	jQuery.cssProps.top = "left";
	equal( div.css("top"), "10px", "the fixed property is used when accessing the computed style");
	div.css("top", "100px");
	equal( div[0].style.left, "100px", "the fixed property is used when setting the style");
	// cleanup jQuery.cssProps
	jQuery.cssProps.top = undefined;
});

test("widows & orphans #8936", function () {

	var $p = jQuery("<p>").appendTo("#qunit-fixture");

	expect( 2 );

	$p.css({
		"widows": 3,
		"orphans": 3
	});

	equal( $p.css( "widows" ) || jQuery.style( $p[0], "widows" ), 3, "widows correctly set to 3" );
	equal( $p.css( "orphans" ) || jQuery.style( $p[0], "orphans" ), 3, "orphans correctly set to 3" );

	$p.remove();
});

test("can't get css for disconnected in IE<9, see #10254 and #8388", function() {
	expect( 2 );
	var span, div;

	span = jQuery( "<span/>" ).css( "background-image", "url(data/1x1.jpg)" );
	notEqual( span.css( "background-image" ), null, "can't get background-image in IE<9, see #10254" );

	div = jQuery( "<div/>" ).css( "top", 10 );
	equal( div.css( "top" ), "10px", "can't get top in IE<9, see #8388" );
});

test("can't get background-position in IE<9, see #10796", function() {
	var div = jQuery( "<div/>" ).appendTo( "#qunit-fixture" ),
		units = [
			"0 0",
			"12px 12px",
			"13px 12em",
			"12em 13px",
			"12em center",
			"+12em center",
			"12.2em center",
			"center center"
		],
		l = units.length,
		i = 0;

	expect( l );

	for( ; i < l; i++ ) {
		div.css( "background-position", units [ i ] );
		ok( div.css( "background-position" ), "can't get background-position in IE<9, see #10796" );
	}
});

if ( jQuery.fn.offset ) {
	test("percentage properties for left and top should be transformed to pixels, see #9505", function() {
		expect( 2 );
		var parent = jQuery("<div style='position:relative;width:200px;height:200px;margin:0;padding:0;border-width:0'></div>").appendTo( "#qunit-fixture" ),
			div = jQuery("<div style='position: absolute; width: 20px; height: 20px; top:50%; left:50%'></div>").appendTo( parent );

		equal( div.css("top"), "100px", "position properties not transformed to pixels, see #9505" );
		equal( div.css("left"), "100px", "position properties not transformed to pixels, see #9505" );
	});
}

test("Do not append px (#9548, #12990)", function() {
	expect( 2 );

	var $div = jQuery("<div>").appendTo("#qunit-fixture");

	$div.css( "fill-opacity", 1 );
	// Support: Android 2.3 (no support for fill-opacity)
	if ( $div.css( "fill-opacity" ) ) {
		equal( $div.css( "fill-opacity" ), 1, "Do not append px to 'fill-opacity'" );
	} else {
		ok( true, "No support for fill-opacity CSS property" );
	}

	$div.css( "column-count", 1 );
	if ( $div.css("column-count") ) {
		equal( $div.css("column-count"), 1, "Do not append px to 'column-count'" );
	} else {
		ok( true, "No support for column-count CSS property" );
	}
});

test("css('width') and css('height') should respect box-sizing, see #11004", function() {
	expect( 4 );

	// Support: Android 2.3 (-webkit-box-sizing).
	var el_dis = jQuery("<div style='width:300px;height:300px;margin:2px;padding:2px;-webkit-box-sizing:border-box;box-sizing:border-box;'>test</div>"),
		el = el_dis.clone().appendTo("#qunit-fixture");

	equal( el.css("width"), el.css("width", el.css("width")).css("width"), "css('width') is not respecting box-sizing, see #11004");
	equal( el_dis.css("width"), el_dis.css("width", el_dis.css("width")).css("width"), "css('width') is not respecting box-sizing for disconnected element, see #11004");
	equal( el.css("height"), el.css("height", el.css("height")).css("height"), "css('height') is not respecting box-sizing, see #11004");
	equal( el_dis.css("height"), el_dis.css("height", el_dis.css("height")).css("height"), "css('height') is not respecting box-sizing for disconnected element, see #11004");
});

testIframeWithCallback( "css('width') should work correctly before document ready (#14084)",
	"css/cssWidthBeforeDocReady.html",
	function( cssWidthBeforeDocReady ) {
		expect( 1 );
		strictEqual( cssWidthBeforeDocReady, "100px", "elem.css('width') works correctly before document ready" );
	}
);

test("certain css values of 'normal' should be convertable to a number, see #8627", function() {
	expect ( 3 );

	var el = jQuery("<div style='letter-spacing:normal;font-weight:normal;'>test</div>").appendTo("#qunit-fixture");

	ok( jQuery.isNumeric( parseFloat( el.css("letterSpacing") ) ), "css('letterSpacing') not convertable to number, see #8627" );
	ok( jQuery.isNumeric( parseFloat( el.css("fontWeight") ) ), "css('fontWeight') not convertable to number, see #8627" );
	equal( typeof el.css( "fontWeight" ), "string", ".css() returns a string" );
});

// only run this test in IE9
if ( document.documentMode === 9 ) {
	test( ".css('filter') returns a string in IE9, see #12537", 1, function() {
		equal( jQuery("<div style='-ms-filter:\"progid:DXImageTransform.Microsoft.gradient(startColorstr=#FFFFFF, endColorstr=#ECECEC)\";'></div>").css("filter"), "progid:DXImageTransform.Microsoft.gradient(startColorstr=#FFFFFF, endColorstr=#ECECEC)", "IE9 returns the correct value from css('filter')." );
	});
}

test( "cssHooks - expand", function() {
	expect( 15 );
	var result,
		properties = {
			margin: [ "marginTop", "marginRight", "marginBottom", "marginLeft" ],
			borderWidth: [ "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
			padding: [ "paddingTop", "paddingRight", "paddingBottom", "paddingLeft" ]
		};

	jQuery.each( properties, function( property, keys ) {
		var hook = jQuery.cssHooks[ property ],
			expected = {};
		jQuery.each( keys, function( _, key ) {
			expected[ key ] = 10;
		});
		result = hook.expand( 10 );
		deepEqual( result, expected, property + " expands properly with a number" );

		jQuery.each( keys, function( _, key ) {
			expected[ key ] = "10px";
		});
		result = hook.expand( "10px" );
		deepEqual( result, expected, property + " expands properly with '10px'" );

		expected[ keys[1] ] = expected[ keys[3] ] = "20px";
		result = hook.expand( "10px 20px" );
		deepEqual( result, expected, property + " expands properly with '10px 20px'" );

		expected[ keys[2] ] = "30px";
		result = hook.expand( "10px 20px 30px" );
		deepEqual( result, expected, property + " expands properly with '10px 20px 30px'" );

		expected[ keys[3] ] = "40px";
		result = hook.expand( "10px 20px 30px 40px" );
		deepEqual( result, expected, property + " expands properly with '10px 20px 30px 40px'" );

	});

});

test( "css opacity consistency across browsers (#12685)", function() {
	expect( 4 );

	var el,
		fixture = jQuery("#qunit-fixture");

	// Append style element
	jQuery("<style>.opacityWithSpaces_t12685 { opacity: 0.1; filter: alpha(opacity = 10); } .opacityNoSpaces_t12685 { opacity: 0.2; filter: alpha(opacity=20); }</style>").appendTo( fixture );

	el = jQuery("<div class='opacityWithSpaces_t12685'></div>").appendTo(fixture);

	equal( Math.round( el.css("opacity") * 100 ), 10, "opacity from style sheet (filter:alpha with spaces)" );
	el.removeClass("opacityWithSpaces_t12685").addClass("opacityNoSpaces_t12685");
	equal( Math.round( el.css("opacity") * 100 ), 20, "opacity from style sheet (filter:alpha without spaces)" );
	el.css( "opacity", 0.3 );
	equal( Math.round( el.css("opacity") * 100 ), 30, "override opacity" );
	el.css( "opacity", "" );
	equal( Math.round( el.css("opacity") * 100 ), 20, "remove opacity override" );
});

test( ":visible/:hidden selectors", function() {
	expect( 17 );

	var $div, $table, $a;

	ok( jQuery("#nothiddendiv").is(":visible"), "Modifying CSS display: Assert element is visible" );
	jQuery("#nothiddendiv").css({ display: "none" });
	ok( !jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is hidden" );
	jQuery("#nothiddendiv").css({ "display": "block" });
	ok( jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is visible");
	ok( !jQuery(window).is(":visible"), "Calling is(':visible') on window does not throw an exception (#10267).");
	ok( !jQuery(document).is(":visible"), "Calling is(':visible') on document does not throw an exception (#10267).");

	ok( jQuery("#nothiddendiv").is(":visible"), "Modifying CSS display: Assert element is visible");
	jQuery("#nothiddendiv").css("display", "none");
	ok( !jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is hidden");
	jQuery("#nothiddendiv").css("display", "block");
	ok( jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is visible");

	ok( jQuery( "#siblingspan" ).is( ":visible" ), "Span with no content is visible" );
	$div = jQuery( "<div><span></span></div>" ).appendTo( "#qunit-fixture" );
	equal( $div.find( ":visible" ).length, 1, "Span with no content is visible" );
	$div.css( { width: 0, height: 0, overflow: "hidden" } );
	ok( $div.is( ":visible" ), "Div with width and height of 0 is still visible (gh-2227)" );

	// Safari 6-7 and iOS 6-7 report 0 width for br elements
	// When newer browsers propagate, re-enable this test
	// $br = jQuery( "<br/>" ).appendTo( "#qunit-fixture" );
	// ok( $br.is( ":visible" ), "br element is visible" );

	$table = jQuery("#table");
	$table.html("<tr><td style='display:none'>cell</td><td>cell</td></tr>");
	equal(jQuery("#table td:visible").length, 1, "hidden cell is not perceived as visible (#4512). Works on table elements");
	$table.css("display", "none").html("<tr><td>cell</td><td>cell</td></tr>");
	equal(jQuery("#table td:visible").length, 0, "hidden cell children not perceived as visible (#4512)");

	t( "Is Visible", "#qunit-fixture div:visible:lt(2)", ["foo", "nothiddendiv"] );
	t( "Is Not Hidden", "#qunit-fixture:hidden", [] );
	t( "Is Hidden", "#form input:hidden", ["hidden1","hidden2"] );

	$a = jQuery( "<a href='#'><h1>Header</h1></a>" ).appendTo( "#qunit-fixture" );
	ok( $a.is( ":visible" ), "Anchor tag with flow content is visible (gh-2227)" );
});

test( "Keep the last style if the new one isn't recognized by the browser (#14836)", function() {
	expect( 2 );

	var el;
	el = jQuery( "<div></div>" ).css( "position", "absolute" ).css( "position", "fake value" );
	equal( el.css( "position" ), "absolute", "The old style is kept when setting an unrecognized value" );
	el = jQuery( "<div></div>" ).css( "position", "absolute" ).css( "position", " " );
	equal( el.css( "position" ), "absolute", "The old style is kept when setting to a space" );
});

test( "Reset the style if set to an empty string", function() {
	expect( 1 );
	var el = jQuery( "<div></div>" ).css( "position", "absolute" ).css( "position", "" );
	// Some browsers return an empty string; others "static". Both those cases mean the style
	// was reset successfully so accept them both.
	equal( el.css( "position" ) || "static", "static",
		"The style can be reset by setting to an empty string" );
});

asyncTest( "Clearing a Cloned Element's Style Shouldn't Clear the Original Element's Style (#8908)", 24, function() {
	var baseUrl = document.location.href.replace( /([^\/]*)$/, "" ),
	styles = [{
			name: "backgroundAttachment",
			value: ["fixed"],
			expected: [ "scroll" ]
		},{
			name: "backgroundColor",
			value: [ "rgb(255, 0, 0)", "rgb(255,0,0)", "#ff0000" ],
			expected: ["transparent"]
		}, {
			// Firefox returns auto's value
			name: "backgroundImage",
			value: [ "url('test.png')", "url(" + baseUrl + "test.png)", "url(\"" + baseUrl + "test.png\")" ],
			expected: [ "none", "url(\"http://static.jquery.com/files/rocker/images/logo_jquery_215x53.gif\")" ]
		}, {
			name: "backgroundPosition",
			value: ["5% 5%"],
			expected: [ "0% 0%", "-1000px 0px", "-1000px 0%" ]
		}, {
			// Firefox returns no-repeat
			name: "backgroundRepeat",
			value: ["repeat-y"],
			expected: [ "repeat", "no-repeat" ]
		}, {
			name: "backgroundClip",
			value: ["padding-box"],
			expected: ["border-box"]
		}, {
			name: "backgroundOrigin",
			value: ["content-box"],
			expected: ["padding-box"]
		}, {
			name: "backgroundSize",
			value: ["80px 60px"],
			expected: [ "auto auto" ]
	}];

	jQuery.each(styles, function( index, style ) {
		var $clone, $clonedChildren,
			$source = jQuery( "#firstp" ),
			source = $source[ 0 ],
			$children = $source.children();

		style.expected = style.expected.concat( [ "", "auto" ] );

		if ( source.style[ style.name ] === undefined ) {
			ok( true, style.name +  ": style isn't supported and therefore not an issue" );
			ok( true );

			return true;
		}

		$source.css( style.name, style.value[ 0 ] );
		$children.css( style.name, style.value[ 0 ] );

		$clone = $source.clone();
		$clonedChildren = $clone.children();

		$clone.css( style.name, "" );
		$clonedChildren.css( style.name, "" );

		window.setTimeout(function() {
			notEqual( $clone.css( style.name ), style.value[ 0 ], "Cloned css was changed" );

			ok( jQuery.inArray( $source.css( style.name ) !== -1, style.value ),
				"Clearing clone.css() doesn't affect source.css(): " + style.name +
				"; result: " + $source.css( style.name ) +
				"; expected: " + style.value.join( "," ) );

			ok( jQuery.inArray( $children.css( style.name ) !== -1, style.value ),
				"Clearing clonedChildren.css() doesn't affect children.css(): " + style.name +
				"; result: " + $children.css( style.name ) +
				"; expected: " + style.value.join( "," ) );
		}, 100 );
	});

	window.setTimeout( start, 1000 );
});

test( "show() after hide() should always set display to initial value (#14750)", 1, function() {
	var div = jQuery( "<div />" ),
		fixture = jQuery( "#qunit-fixture" );

	fixture.append( div );

	div.css( "display", "inline" ).hide().show().css( "display", "list-item" ).hide().show();
	equal( div.css( "display" ), "list-item", "should get last set display value" );
});

// Support: IE < 11, Safari < 7
// We have to jump through the hoops here in order to test work with "order" CSS property,
// that some browsers do not support. This test is not, strictly speaking, correct,
// but it's the best that we can do.
(function() {
	var style = document.createElement( "div" ).style,
		exist = "order" in style || "WebkitOrder" in style;

	if ( exist ) {
		test( "Don't append px to CSS \"order\" value (#14049)", 1, function() {
			var $elem = jQuery( "<div/>" );

			$elem.css( "order", 2 );
			equal( $elem.css( "order" ), "2", "2 on order" );
		});
	}
})();

test( "Do not throw on frame elements from css method (#15098)", 1, function() {
	var frameWin, frameDoc,
		frameElement = document.createElement( "iframe" ),
		frameWrapDiv = document.createElement( "div" );

	frameWrapDiv.appendChild( frameElement );
	document.body.appendChild( frameWrapDiv );
	frameWin = frameElement.contentWindow;
	frameDoc = frameWin.document;
	frameDoc.open();
	frameDoc.write( "<!doctype html><html><body><div>Hi</div></body></html>" );
	frameDoc.close();

	frameWrapDiv.style.display = "none";

	try {
		jQuery( frameDoc.body ).css( "direction" );
		ok( true, "It didn't throw" );
	} catch ( _ ) {
		ok( false, "It did throw" );
	}
});

( function() {
	var vendorPrefixes = [ "Webkit", "Moz", "ms" ];

	function resetCssPropsFor( name ) {
		delete jQuery.cssProps[ name ];
		jQuery.each( vendorPrefixes, function( index, prefix ) {
			delete jQuery.cssProps[ prefix + name[ 0 ].toUpperCase() + name.slice( 1 ) ];
		} );
	}

	test( "Don't default to a cached previously used wrong prefixed name (gh-2015)", function() {
		// Note: this test needs a property we know is only supported in a prefixed version
		// by at least one of our main supported browsers. This may get out of date so let's
		// use -(webkit|moz)-appearance as well as those two are not on a standards track.
		var appearanceName, transformName, elem, elemStyle,
			transformVal = "translate(5px, 2px)",
			emptyStyle = document.createElement( "div" ).style;

		if ( "appearance" in emptyStyle ) {
			appearanceName = "appearance";
		} else {
			jQuery.each( vendorPrefixes, function( index, prefix ) {
				var prefixedProp = prefix + "Appearance";
				if ( prefixedProp in emptyStyle ) {
					appearanceName = prefixedProp;
				}
			} );
		}

		if ( "transform" in emptyStyle ) {
			transformName = "transform";
		} else {
			jQuery.each( vendorPrefixes, function( index, prefix ) {
				var prefixedProp = prefix + "Transform";
				if ( prefixedProp in emptyStyle ) {
					transformName = prefixedProp;
				}
			} );
		}

		expect( !!appearanceName + !!transformName + 1 );

		resetCssPropsFor( "appearance" );
		resetCssPropsFor( "transform" );

		elem = jQuery( "<div/>" )
			.css( {
				msAppearance: "none",
				appearance: "none",

				// Only the ms prefix is used to make sure we haven't e.g. set
				// webkitTransform ourselves in the test.
				msTransform: transformVal,
				transform: transformVal
			} );
		elemStyle = elem[ 0 ].style;

		if ( appearanceName ) {
			equal( elemStyle[ appearanceName ], "none", "setting properly-prefixed appearance" );
		}
		if ( transformName ) {
			equal( elemStyle[ transformName ], transformVal, "setting properly-prefixed transform" );
		}
		equal( elemStyle.undefined, undefined, "Nothing writes to node.style.undefined" );
	} );

	test( "Don't detect fake set properties on a node when caching the prefixed version", function() {
		expect( 1 );

		var elem = jQuery( "<div/>" ),
			style = elem[ 0 ].style;
		style.MozFakeProperty = "old value";
		elem.css( "fakeProperty", "new value" );

		equal( style.MozFakeProperty, "old value", "Fake prefixed property is not cached" );
	} );

} )();

}
