module("css", { teardown: moduleTeardown });

test("css(String|Hash)", function() {
	expect(41);

	equals( jQuery('#main').css("display"), 'block', 'Check for css property "display"');

	ok( jQuery('#nothiddendiv').is(':visible'), 'Modifying CSS display: Assert element is visible');
	jQuery('#nothiddendiv').css({display: 'none'});
	ok( !jQuery('#nothiddendiv').is(':visible'), 'Modified CSS display: Assert element is hidden');
	jQuery('#nothiddendiv').css({display: 'block'});
	ok( jQuery('#nothiddendiv').is(':visible'), 'Modified CSS display: Assert element is visible');

	var div = jQuery( "<div>" );

	// These should be "auto" (or some better value)
	// temporarily provide "0px" for backwards compat
	equals( div.css("width"), "0px", "Width on disconnected node." );
	equals( div.css("height"), "0px", "Height on disconnected node." );

	div.css({ width: 4, height: 4 });

	equals( div.css("width"), "4px", "Width on disconnected node." );
	equals( div.css("height"), "4px", "Height on disconnected node." );

	var div2 = jQuery( "<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'/><div style='height:20px;'></div></div>").appendTo("body");

	equals( div2.find("input").css("height"), "20px", "Height on hidden input." );
	equals( div2.find("textarea").css("height"), "20px", "Height on hidden textarea." );
	equals( div2.find("div").css("height"), "20px", "Height on hidden textarea." );

	div2.remove();

	// handle negative numbers by ignoring #1599, #4216
	jQuery('#nothiddendiv').css({ 'width': 1, 'height': 1 });

	var width = parseFloat(jQuery('#nothiddendiv').css('width')), height = parseFloat(jQuery('#nothiddendiv').css('height'));
	jQuery('#nothiddendiv').css({ width: -1, height: -1 });
	equals( parseFloat(jQuery('#nothiddendiv').css('width')), width, 'Test negative width ignored')
	equals( parseFloat(jQuery('#nothiddendiv').css('height')), height, 'Test negative height ignored')

	equals( jQuery('<div style="display: none;">').css('display'), 'none', 'Styles on disconnected nodes');

	jQuery('#floatTest').css({'float': 'right'});
	equals( jQuery('#floatTest').css('float'), 'right', 'Modified CSS float using "float": Assert float is right');
	jQuery('#floatTest').css({'font-size': '30px'});
	equals( jQuery('#floatTest').css('font-size'), '30px', 'Modified CSS font-size: Assert font-size is 30px');

	jQuery.each("0,0.25,0.5,0.75,1".split(','), function(i, n) {
		jQuery('#foo').css({opacity: n});
		equals( jQuery('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		jQuery('#foo').css({opacity: parseFloat(n)});
		equals( jQuery('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	jQuery('#foo').css({opacity: ''});
	equals( jQuery('#foo').css('opacity'), '1', "Assert opacity is 1 when set to an empty String" );

	equals( jQuery('#empty').css('opacity'), '0', "Assert opacity is accessible via filter property set in stylesheet in IE" );
	jQuery('#empty').css({ opacity: '1' });
	equals( jQuery('#empty').css('opacity'), '1', "Assert opacity is taken from style attribute when set vs stylesheet in IE with filters" );

	var div = jQuery('#nothiddendiv'), child = jQuery('#nothiddendivchild');

	equals( parseInt(div.css("fontSize")), 16, "Verify fontSize px set." );
	equals( parseInt(div.css("font-size")), 16, "Verify fontSize px set." );
	equals( parseInt(child.css("fontSize")), 16, "Verify fontSize px set." );
	equals( parseInt(child.css("font-size")), 16, "Verify fontSize px set." );

	child.css("height", "100%");
	equals( child[0].style.height, "100%", "Make sure the height is being set correctly." );

	child.attr("class", "em");
	equals( parseInt(child.css("fontSize")), 32, "Verify fontSize em set." );

	// Have to verify this as the result depends upon the browser's CSS
	// support for font-size percentages
	child.attr("class", "prct");
	var prctval = parseInt(child.css("fontSize")), checkval = 0;
	if ( prctval === 16 || prctval === 24 ) {
		checkval = prctval;
	}

	equals( prctval, checkval, "Verify fontSize % set." );

	equals( typeof child.css("width"), "string", "Make sure that a string width is returned from css('width')." );

	var old = child[0].style.height;

	// Test NaN
	child.css("height", parseFloat("zoo"));
	equals( child[0].style.height, old, "Make sure height isn't changed on NaN." );

	// Test null
	child.css("height", null);
	equals( child[0].style.height, old, "Make sure height isn't changed on null." );

	old = child[0].style.fontSize;

	// Test NaN
	child.css("font-size", parseFloat("zoo"));
	equals( child[0].style.fontSize, old, "Make sure font-size isn't changed on NaN." );

	// Test null
	child.css("font-size", null);
	equals( child[0].style.fontSize, old, "Make sure font-size isn't changed on null." );
});

test("css(String, Object)", function() {
	expect(22);

	ok( jQuery('#nothiddendiv').is(':visible'), 'Modifying CSS display: Assert element is visible');
	jQuery('#nothiddendiv').css("display", 'none');
	ok( !jQuery('#nothiddendiv').is(':visible'), 'Modified CSS display: Assert element is hidden');
	jQuery('#nothiddendiv').css("display", 'block');
	ok( jQuery('#nothiddendiv').is(':visible'), 'Modified CSS display: Assert element is visible');

	jQuery("#nothiddendiv").css("top", "-1em");
	ok( jQuery("#nothiddendiv").css("top"), -16, "Check negative number in EMs." );

	jQuery('#floatTest').css('float', 'left');
	equals( jQuery('#floatTest').css('float'), 'left', 'Modified CSS float using "float": Assert float is left');
	jQuery('#floatTest').css('font-size', '20px');
	equals( jQuery('#floatTest').css('font-size'), '20px', 'Modified CSS font-size: Assert font-size is 20px');

	jQuery.each("0,0.25,0.5,0.75,1".split(','), function(i, n) {
		jQuery('#foo').css('opacity', n);
		equals( jQuery('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		jQuery('#foo').css('opacity', parseFloat(n));
		equals( jQuery('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	jQuery('#foo').css('opacity', '');
	equals( jQuery('#foo').css('opacity'), '1', "Assert opacity is 1 when set to an empty String" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.css("overflow", "visible");
	equals( j.css("overflow"), "visible", "Check node,textnode,comment css works" );
	// opera sometimes doesn't update 'display' correctly, see #2037
	jQuery("#t2037")[0].innerHTML = jQuery("#t2037")[0].innerHTML
	equals( jQuery("#t2037 .hidden").css("display"), "none", "Make sure browser thinks it is hidden" );

	var div = jQuery("#nothiddendiv"),
		display = div.css("display"),
		ret = div.css("display", undefined);

	equals( ret, div, "Make sure setting undefined returns the original set." );
	equals( div.css("display"), display, "Make sure that the display wasn't changed." );

	// Test for Bug #5509
	var success = true;
	try {
		jQuery('#foo').css("backgroundColor", "rgba(0, 0, 0, 0.1)");
	}
	catch (e) {
		success = false;
	}
	ok( success, "Setting RGBA values does not throw Error" );
});

if ( !jQuery.support.opacity ) {
	test("css(String, Object) for MSIE", function() {
		// for #1438, IE throws JS error when filter exists but doesn't have opacity in it
		jQuery('#foo').css("filter", "progid:DXImageTransform.Microsoft.Chroma(color='red');");
		equals( jQuery('#foo').css('opacity'), '1', "Assert opacity is 1 when a different filter is set in IE, #1438" );

		var filterVal = "progid:DXImageTransform.Microsoft.Alpha(opacity=30) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		var filterVal2 = "progid:DXImageTransform.Microsoft.alpha(opacity=100) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		var filterVal3 = "progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
		jQuery('#foo').css("filter", filterVal);
		equals( jQuery('#foo').css("filter"), filterVal, "css('filter', val) works" );
		jQuery('#foo').css("opacity", 1);
		equals( jQuery('#foo').css("filter"), filterVal2, "Setting opacity in IE doesn't duplicate opacity filter" );
		equals( jQuery('#foo').css("opacity"), 1, "Setting opacity in IE with other filters works" );
		jQuery('#foo').css("filter", filterVal3).css("opacity", 1);
		ok( jQuery('#foo').css("filter").indexOf(filterVal3) !== -1, "Setting opacity in IE doesn't clobber other filters" );
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
		equals( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
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
		equals( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
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
		equals( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
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
		equals( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
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

	jQuery('#table').html('<tr><td style="display:none">cell</td><td>cell</td></tr>');
	equals(jQuery('#table td:visible').length, 1, "hidden cell is not perceived as visible");
});

test(":visible selector works properly on children with a hidden parent (bug #4512)", function () {
	expect(1);
	jQuery('#table').css('display', 'none').html('<tr><td>cell</td><td>cell</td></tr>');
	equals(jQuery('#table td:visible').length, 0, "hidden cell children not perceived as visible");
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
