module("css", { teardown: moduleTeardown });

test("css(String|Hash)", function() {
	expect( 46 );

	equal( jQuery("#qunit-fixture").css("display"), "block", "Check for css property \"display\"" );

	ok( jQuery("#nothiddendiv").is(":visible"), "Modifying CSS display: Assert element is visible" );
	jQuery("#nothiddendiv").css({ display: "none" });
	ok( !jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is hidden" );
	var $child = jQuery("#nothiddendivchild").css({ width: "20%", height: "20%" });
	notEqual( $child.css("width"), "20px", "Retrieving a width percentage on the child of a hidden div returns percentage" );
	notEqual( $child.css("height"), "20px", "Retrieving a height percentage on the child of a hidden div returns percentage" );

	jQuery("#nothiddendiv").css({display: "block"});
	ok( jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is visible");
	ok( jQuery(window).is(":visible"), "Calling is(':visible') on window does not throw an error in IE.");
	ok( jQuery(document).is(":visible"), "Calling is(':visible') on document does not throw an error in IE.");

	var div = jQuery( "<div>" );

	// These should be "auto" (or some better value)
	// temporarily provide "0px" for backwards compat
	equal( div.css("width"), "0px", "Width on disconnected node." );
	equal( div.css("height"), "0px", "Height on disconnected node." );

	div.css({ width: 4, height: 4 });

	equal( div.css("width"), "4px", "Width on disconnected node." );
	equal( div.css("height"), "4px", "Height on disconnected node." );

	var div2 = jQuery( "<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'/><div style='height:20px;'></div></div>").appendTo("body");

	equal( div2.find("input").css("height"), "20px", "Height on hidden input." );
	equal( div2.find("textarea").css("height"), "20px", "Height on hidden textarea." );
	equal( div2.find("div").css("height"), "20px", "Height on hidden textarea." );

	div2.remove();

	// handle negative numbers by ignoring #1599, #4216
	jQuery("#nothiddendiv").css( {width: 1, height: 1} );

	var width = parseFloat(jQuery("#nothiddendiv").css("width")), height = parseFloat(jQuery("#nothiddendiv").css("height"));
	jQuery("#nothiddendiv").css({ width: -1, height: -1 });
	equal( parseFloat(jQuery("#nothiddendiv").css("width")), width, "Test negative width ignored");
	equal( parseFloat(jQuery("#nothiddendiv").css("height")), height, "Test negative height ignored");

	equal( jQuery("<div style='display: none;'>").css("display"), "none", "Styles on disconnected nodes");

	jQuery("#floatTest").css({"float": "right"});
	equal( jQuery("#floatTest").css("float"), "right", "Modified CSS float using \"float\": Assert float is right");
	jQuery("#floatTest").css({"font-size": "30px"});
	equal( jQuery("#floatTest").css("font-size"), "30px", "Modified CSS font-size: Assert font-size is 30px");
	jQuery.each("0,0.25,0.5,0.75,1".split(","), function(i, n) {
		jQuery("#foo").css({opacity: n});

		equal( jQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		jQuery("#foo").css({opacity: parseFloat(n)});
		equal( jQuery("#foo").css("opacity"), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	jQuery("#foo").css({opacity: ""});
	equal( jQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when set to an empty String" );

	equal( jQuery("#empty").css("opacity"), "0", "Assert opacity is accessible via filter property set in stylesheet in IE" );
	jQuery("#empty").css({ opacity: "1" });
	equal( jQuery("#empty").css("opacity"), "1", "Assert opacity is taken from style attribute when set vs stylesheet in IE with filters" );
	jQuery.support.opacity ?
		ok(true, "Requires the same number of tests"):
		ok( ~jQuery("#empty")[0].currentStyle.filter.indexOf("gradient"), "Assert setting opacity doesn't overwrite other filters of the stylesheet in IE" );

	div = jQuery("#nothiddendiv");
	var child = jQuery("#nothiddendivchild");

	equal( parseInt(div.css("fontSize")), 16, "Verify fontSize px set." );
	equal( parseInt(div.css("font-size")), 16, "Verify fontSize px set." );
	equal( parseInt(child.css("fontSize")), 16, "Verify fontSize px set." );
	equal( parseInt(child.css("font-size")), 16, "Verify fontSize px set." );

	child.css("height", "100%");
	equal( child[0].style.height, "100%", "Make sure the height is being set correctly." );

	child.attr("class", "em");
	equal( parseInt(child.css("fontSize")), 32, "Verify fontSize em set." );

	// Have to verify this as the result depends upon the browser's CSS
	// support for font-size percentages
	child.attr("class", "prct");
	var prctval = parseInt(child.css("fontSize")), checkval = 0;
	if ( prctval === 16 || prctval === 24 ) {
		checkval = prctval;
	}

	equal( prctval, checkval, "Verify fontSize % set." );

	equal( typeof child.css("width"), "string", "Make sure that a string width is returned from css('width')." );

	var old = child[0].style.height;

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
});

test("css() explicit and relative values", function() {
	expect(29);
	var $elem = jQuery("#nothiddendiv");

	$elem.css({ width: 1, height: 1, paddingLeft: "1px", opacity: 1 });
	equal( $elem.width(), 1, "Initial css set or width/height works (hash)" );
	equal( $elem.css("paddingLeft"), "1px", "Initial css set of paddingLeft works (hash)" );
	equal( $elem.css("opacity"), "1", "Initial css set of opacity works (hash)" );

	$elem.css({ width: "+=9" });
	equal( $elem.width(), 10, "'+=9' on width (hash)" );

	$elem.css({ width: "-=9" });
	equal( $elem.width(), 1, "'-=9' on width (hash)" );

	$elem.css({ width: "+=9px" });
	equal( $elem.width(), 10, "'+=9px' on width (hash)" );

	$elem.css({ width: "-=9px" });
	equal( $elem.width(), 1, "'-=9px' on width (hash)" );

	$elem.css( "width", "+=9" );
	equal( $elem.width(), 10, "'+=9' on width (params)" );

	$elem.css( "width", "-=9" ) ;
	equal( $elem.width(), 1, "'-=9' on width (params)" );

	$elem.css( "width", "+=9px" );
	equal( $elem.width(), 10, "'+=9px' on width (params)" );

	$elem.css( "width", "-=9px" );
	equal( $elem.width(), 1, "'-=9px' on width (params)" );

	$elem.css( "width", "-=-9px" );
	equal( $elem.width(), 10, "'-=-9px' on width (params)" );

	$elem.css( "width", "+=-9px" );
	equal( $elem.width(), 1, "'+=-9px' on width (params)" );

	$elem.css({ paddingLeft: "+=4" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4' on paddingLeft (hash)" );

	$elem.css({ paddingLeft: "-=4" });
	equal( $elem.css("paddingLeft"), "1px", "'-=4' on paddingLeft (hash)" );

	$elem.css({ paddingLeft: "+=4px" });
	equal( $elem.css("paddingLeft"), "5px", "'+=4px' on paddingLeft (hash)" );

	$elem.css({ paddingLeft: "-=4px" });
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

	$elem.css({ opacity: "-=0.5" });
	equal( $elem.css("opacity"), "0.5", "'-=0.5' on opacity (hash)" );

	$elem.css({ opacity: "+=0.5" });
	equal( $elem.css("opacity"), "1", "'+=0.5' on opacity (hash)" );

	$elem.css( "opacity", "-=0.5" );
	equal( $elem.css("opacity"), "0.5", "'-=0.5' on opacity (params)" );

	$elem.css( "opacity", "+=0.5" );
	equal( $elem.css("opacity"), "1", "'+=0.5' on opacity (params)" );
});

test("css(String, Object)", function() {
	expect(22);

	ok( jQuery("#nothiddendiv").is(":visible"), "Modifying CSS display: Assert element is visible");
	jQuery("#nothiddendiv").css("display", "none");
	ok( !jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is hidden");
	jQuery("#nothiddendiv").css("display", "block");
	ok( jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is visible");

	jQuery("#nothiddendiv").css("top", "-1em");
	ok( jQuery("#nothiddendiv").css("top"), -16, "Check negative number in EMs." );

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
	var j = jQuery("#nonnodes").contents();
	j.css("overflow", "visible");
	equal( j.css("overflow"), "visible", "Check node,textnode,comment css works" );
	// opera sometimes doesn't update 'display' correctly, see #2037
	jQuery("#t2037")[0].innerHTML = jQuery("#t2037")[0].innerHTML;
	equal( jQuery("#t2037 .hidden").css("display"), "none", "Make sure browser thinks it is hidden" );

	var div = jQuery("#nothiddendiv"),
		display = div.css("display"),
		ret = div.css("display", undefined);

	equal( ret, div, "Make sure setting undefined returns the original set." );
	equal( div.css("display"), display, "Make sure that the display wasn't changed." );

	// Test for Bug #5509
	var success = true;
	try {
		jQuery("#foo").css("backgroundColor", "rgba(0, 0, 0, 0.1)");
	}
	catch (e) {
		success = false;
	}
	ok( success, "Setting RGBA values does not throw Error" );
});

if ( !jQuery.support.opacity ) {
	test("css(String, Object) for MSIE", function() {
		// for #1438, IE throws JS error when filter exists but doesn't have opacity in it
		jQuery("#foo").css("filter", "progid:DXImageTransform.Microsoft.Chroma(color='red');");
		equal( jQuery("#foo").css("opacity"), "1", "Assert opacity is 1 when a different filter is set in IE, #1438" );

		var filterVal = "progid:DXImageTransform.Microsoft.Alpha(opacity=30) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		var filterVal2 = "progid:DXImageTransform.Microsoft.alpha(opacity=100) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		var filterVal3 = "progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		jQuery("#foo").css("filter", filterVal);
		equal( jQuery("#foo").css("filter"), filterVal, "css('filter', val) works" );
		jQuery("#foo").css("opacity", 1);
		equal( jQuery("#foo").css("filter"), filterVal2, "Setting opacity in IE doesn't duplicate opacity filter" );
		equal( jQuery("#foo").css("opacity"), 1, "Setting opacity in IE with other filters works" );
		jQuery("#foo").css("filter", filterVal3).css("opacity", 1);
		ok( jQuery("#foo").css("filter").indexOf(filterVal3) !== -1, "Setting opacity in IE doesn't clobber other filters" );
	});

	test( "Setting opacity to 1 properly removes filter: style (#6652)", function() {
		var rfilter = /filter:[^;]*/i,
			test = jQuery( "#t6652" ).css( "opacity", 1 ),
			test2 = test.find( "div" ).css( "opacity", 1 );

		function hasFilter( elem ) {
			var match = rfilter.exec( elem[0].style.cssText );
			if ( match ) {
				return true;
			}
			return false;
		}
		expect( 2 );
		ok( !hasFilter( test ), "Removed filter attribute on element without filter in stylesheet" );
		ok( hasFilter( test2 ), "Filter attribute remains on element that had filter in stylesheet" );
	});
}

test("css(String, Function)", function() {
	expect(3);

	var sizes = ["10px", "20px", "30px"];

	jQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	var index = 0;

	jQuery("#cssFunctionTest div").css("font-size", function() {
		var size = sizes[index];
		index++;
		return size;
	});

	index = 0;

	jQuery("#cssFunctionTest div").each(function() {
		var computedSize = jQuery(this).css("font-size")
		var expectedSize = sizes[index]
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
	});

	jQuery("#cssFunctionTest").remove();
});

test("css(String, Function) with incoming value", function() {
	expect(3);

	var sizes = ["10px", "20px", "30px"];

	jQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	var index = 0;

	jQuery("#cssFunctionTest div").css("font-size", function() {
		var size = sizes[index];
		index++;
		return size;
	});

	index = 0;

	jQuery("#cssFunctionTest div").css("font-size", function(i, computedSize) {
		var expectedSize = sizes[index]
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
		return computedSize;
	});

	jQuery("#cssFunctionTest").remove();
});

test("css(Object) where values are Functions", function() {
	expect(3);

	var sizes = ["10px", "20px", "30px"];

	jQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	var index = 0;

	jQuery("#cssFunctionTest div").css({fontSize: function() {
		var size = sizes[index];
		index++;
		return size;
	}});

	index = 0;

	jQuery("#cssFunctionTest div").each(function() {
		var computedSize = jQuery(this).css("font-size")
		var expectedSize = sizes[index]
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
	});

	jQuery("#cssFunctionTest").remove();
});

test("css(Object) where values are Functions with incoming values", function() {
	expect(3);

	var sizes = ["10px", "20px", "30px"];

	jQuery("<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div>" +
				 "<div class='cssFunction'></div></div>")
		.appendTo("body");

	var index = 0;

	jQuery("#cssFunctionTest div").css({fontSize: function() {
		var size = sizes[index];
		index++;
		return size;
	}});

	index = 0;

	jQuery("#cssFunctionTest div").css({"font-size": function(i, computedSize) {
		var expectedSize = sizes[index]
		equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
		return computedSize;
	}});

	jQuery("#cssFunctionTest").remove();
});

test("jQuery.css(elem, 'height') doesn't clear radio buttons (bug #1095)", function () {
	expect(4);

	var $checkedtest = jQuery("#checkedtest");
	// IE6 was clearing "checked" in jQuery.css(elem, "height");
	jQuery.css($checkedtest[0], "height");
	ok( !! jQuery(":radio:first", $checkedtest).attr("checked"), "Check first radio still checked." );
	ok( ! jQuery(":radio:last", $checkedtest).attr("checked"), "Check last radio still NOT checked." );
	ok( !! jQuery(":checkbox:first", $checkedtest).attr("checked"), "Check first checkbox still checked." );
	ok( ! jQuery(":checkbox:last", $checkedtest).attr("checked"), "Check last checkbox still NOT checked." );
});

test(":visible selector works properly on table elements (bug #4512)", function () {
	expect(1);

	jQuery("#table").html("<tr><td style='display:none'>cell</td><td>cell</td></tr>");
	equal(jQuery("#table td:visible").length, 1, "hidden cell is not perceived as visible");
});

test(":visible selector works properly on children with a hidden parent (bug #4512)", function () {
	expect(1);
	jQuery("#table").css("display", "none").html("<tr><td>cell</td><td>cell</td></tr>");
	equal(jQuery("#table td:visible").length, 0, "hidden cell children not perceived as visible");
});

test("internal ref to elem.runtimeStyle (bug #7608)", function () {
	expect(1);
	var result = true;

	try {
		jQuery("#foo").css( { width: "0%" } ).css("width");
	} catch (e) {
		result = false;
	}

	ok( result, "elem.runtimeStyle does not throw exception" );
});

test("marginRight computed style (bug #3333)", function() {
	expect(1);

	var $div = jQuery("#foo");
	$div.css({
		width: "1px",
		marginRight: 0
	});

	equal($div.css("marginRight"), "0px", "marginRight correctly calculated with a width and display block");
});

test("jQuery.cssProps behavior, (bug #8402)", function() {
	var div = jQuery( "<div>" ).appendTo(document.body).css({
		position: "absolute",
		top: 0,
		left: 10
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

	if ( "widows" in $p[0].style ) {
		expect(4);
		$p.css({
			widows: 0,
			orphans: 0
		});

		equal( $p.css("widows") || jQuery.style( $p[0], "widows" ), 0, "widows correctly start with value 0");
		equal( $p.css("orphans") || jQuery.style( $p[0], "orphans" ), 0, "orphans correctly start with value 0");

		$p.css({
			widows: 3,
			orphans: 3
		});

		equal( $p.css("widows") || jQuery.style( $p[0], "widows" ), 3, "widows correctly set to 3");
		equal( $p.css("orphans") || jQuery.style( $p[0], "orphans" ), 3, "orphans correctly set to 3");
	} else {

		expect(1);
		ok( true, "jQuery does not attempt to test for style props that definitely don't exist in older versions of IE");
	}


	$p.remove();
});

test("can't get css for disconnected in IE<9, see #10254 and #8388", function() {
	expect( 2 );
	var span = jQuery( "<span/>" ).css( "background-image", "url(http://static.jquery.com/files/rocker/images/logo_jquery_215x53.gif)" );
	notEqual( span.css( "background-image" ), null, "can't get background-image in IE<9, see #10254" );

	var div = jQuery( "<div/>" ).css( "top", 10 );
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
			"center center",
		],
		l = units.length,
		i = 0;

	expect( l );

	for( ; i < l; i++ ) {
		div.css( "background-position", units [ i ] );
		ok( div.css( "background-position" ), "can't get background-position in IE<9, see #10796" );
	}
});

test("Do not append px to 'fill-opacity' #9548", 1, function() {

	var $div = jQuery("<div>").appendTo("#qunit-fixture");

	$div.css("fill-opacity", 0).animate({ "fill-opacity": 1.0 }, 0, function () {
		equal( jQuery(this).css("fill-opacity"), 1, "Do not append px to 'fill-opacity'");
	});

});

test("outerWidth(true) and css('margin') returning % instead of px in Webkit, see #10639", function() {
	var container = jQuery( "<div/>" ).width(400).appendTo( "#qunit-fixture" ),
		el = jQuery( "<div/>" ).css({ width: "50%", marginRight: "50%" }).appendTo( container );

	equal( el.outerWidth(true), 400, "outerWidth(true) and css('margin') returning % instead of px in Webkit, see #10639" );
});

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