if ( jQuery.css ) {

module("css", { teardown: moduleTeardown });

test("css(String|Hash)", function() {
	expect( 40 );

	equal( jQuery("#qunit-fixture").css("display"), "block", "Check for css property \"display\"" );

	var $child, div, div2, width, height, child, prctval, checkval, old;

	$child = jQuery("#nothiddendivchild").css({ "width": "20%", "height": "20%" });
	notEqual( $child.css("width"), "20px", "Retrieving a width percentage on the child of a hidden div returns percentage" );
	notEqual( $child.css("height"), "20px", "Retrieving a height percentage on the child of a hidden div returns percentage" );

	div = jQuery( "<div>" );

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

	equal( jQuery("<div style='display: none;'>").css("display"), "none", "Styles on disconnected nodes");

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
});

test("css() explicit and relative values", function() {
	expect( 30 );
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

	$elem.css( "order", 2 );
	equal( $elem.css("order"), "2", "2 on order" );
});

test("css(String, Object)", function() {
	expect( 19 );
	var j, div, display, ret, success;

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
	j = jQuery("#nonnodes").contents();
	j.css("overflow", "visible");
	equal( j.css("overflow"), "visible", "Check node,textnode,comment css works" );
	// opera sometimes doesn't update 'display' correctly, see #2037
	jQuery("#t2037")[0].innerHTML = jQuery("#t2037")[0].innerHTML;
	equal( jQuery("#t2037 .hidden").css("display"), "none", "Make sure browser thinks it is hidden" );

	div = jQuery("#nothiddendiv");
	display = div.css("display");
	ret = div.css("display", undefined);

	equal( ret, div, "Make sure setting undefined returns the original set." );
	equal( div.css("display"), display, "Make sure that the display wasn't changed." );

	// Test for Bug #5509
	success = true;
	try {
		jQuery("#foo").css("backgroundColor", "rgba(0, 0, 0, 0.1)");
	}
	catch (e) {
		success = false;
	}
	ok( success, "Setting RGBA values does not throw Error" );
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
	expect(22);

	var hiddendiv, div, pass, old, test;

	hiddendiv = jQuery("div.hidden");
	hiddendiv.hide();
	equal( hiddendiv.css("display"), "none", "Non-detached div hidden" );
	hiddendiv.show();
	equal( hiddendiv.css("display"), "block", "Pre-hidden div shown" );

	div = jQuery("<div>").hide();
	equal( div.css("display"), "none", "Detached div hidden" );
	div.appendTo("#qunit-fixture").show();
	equal( div.css("display"), "block", "Pre-hidden div shown" );

	QUnit.reset();

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

	// Make sure that showing or hiding a text node doesn't cause an error
	jQuery("<div>test</div> text <span>test</span>").show().remove();
	jQuery("<div>test</div> text <span>test</span>").hide().remove();
});

test("show() resolves correct default display #8099", function() {
	expect(7);
	var tt8099 = jQuery("<tt/>").appendTo("body"),
			dfn8099 = jQuery("<dfn/>", { "html": "foo"}).appendTo("body");

	equal( tt8099.css("display"), "none", "default display override for all tt" );
	equal( tt8099.show().css("display"), "inline", "Correctly resolves display:inline" );

	equal( jQuery("#foo").hide().show().css("display"), "block", "Correctly resolves display:block after hide/show" );

	equal( tt8099.hide().css("display"), "none", "default display override for all tt" );
	equal( tt8099.show().css("display"), "inline", "Correctly resolves display:inline" );

	equal( dfn8099.css("display"), "none", "default display override for all dfn" );
	equal( dfn8099.show().css("display"), "inline", "Correctly resolves display:inline" );

	tt8099.remove();
	dfn8099.remove();
});

test( "show() resolves correct default display for detached nodes", function(){
	expect( 13 );

	var div, span, tr, trDisplay;

	div = jQuery("<div class='hidden'>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through stylesheets ) div is visible." );

	div = jQuery("<div style='display: none'>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through inline style ) div is visible." );

	span = jQuery("<span class='hidden'/>");
	span.show().appendTo("#qunit-fixture");
	equal( span.css("display"), "inline", "Make sure a detached, pre-hidden( through stylesheets ) span has default display." );

	span = jQuery("<span style='display: inline'/>");
	span.show().appendTo("#qunit-fixture");
	equal( span.css("display"), "inline", "Make sure a detached, pre-hidden( through inline style ) span has default display." );

	div = jQuery("<div><div class='hidden'></div></div>").children("div");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through stylesheets ) div inside another visible div is visible." );

	div = jQuery("<div><div style='display: none'></div></div>").children("div");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a detached, pre-hidden( through inline style ) div inside another visible div is visible." );

	div = jQuery("div.hidden");
	div.detach().show();
	equal( div.css("display"), "block", "Make sure a detached( through detach() ), pre-hidden div is visible." );
	div.remove();

	span = jQuery("<span>");
	span.appendTo("#qunit-fixture").detach().show().appendTo("#qunit-fixture" );
	equal( span.css("display"), "inline", "Make sure a detached( through detach() ), pre-hidden span has default display." );
	span.remove();

	div = jQuery("<div>");
	div.show().appendTo("#qunit-fixture");
	ok( !!div.get( 0 ).style.display, "Make sure not hidden div has a inline style." );
	div.remove();

	div = jQuery( document.createElement("div") );
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "block", "Make sure a pre-created element has default display." );
	div.remove();

	div = jQuery("<div style='display: inline'/>");
	div.show().appendTo("#qunit-fixture");
	equal( div.css("display"), "inline", "Make sure that element has same display when it was created." );
	div.remove();

	tr = jQuery("<tr/>");
	jQuery("#table").append( tr );
	trDisplay = tr.css( "display" );
	tr.detach().hide().show();

	equal( tr[ 0 ].style.display, trDisplay, "For detached tr elements, display should always be like for attached trs" );
	tr.remove();

	span = jQuery("<span/>").hide().show();
	equal( span[ 0 ].style.display, "inline", "For detached span elements, display should always be inline" );
	span.remove();
});

test("show() resolves correct default display #10227", function() {
	expect(2);

	var body = jQuery("body");
	body.append(
		"<p id='ddisplay'>a<style>body{display:none}</style></p>"
	);

	equal( body.css("display"), "none", "Initial display: none" );

	body.show();
	equal( body.css("display"), "block", "Correct display: block" );

	jQuery("#ddisplay").remove();
	QUnit.expectJqData( body[0], "olddisplay" );
});

test("show() resolves correct default display when iframe display:none #12904", function() {
	expect(2);

	var ddisplay = jQuery(
		"<p id='ddisplay'>a<style>p{display:none}iframe{display:none !important}</style></p>"
	).appendTo("body");

	equal( ddisplay.css("display"), "none", "Initial display: none" );

	ddisplay.show();
	equal( ddisplay.css("display"), "block", "Correct display: block" );

	ddisplay.remove();
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
	QUnit.reset();

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

	if ( "widows" in $p[0].style ) {
		expect(4);
		$p.css({
			"widows": 0,
			"orphans": 0
		});

		equal( $p.css("widows") || jQuery.style( $p[0], "widows" ), 0, "widows correctly start with value 0");
		equal( $p.css("orphans") || jQuery.style( $p[0], "orphans" ), 0, "orphans correctly start with value 0");

		$p.css({
			"widows": 3,
			"orphans": 3
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

test("percentage properties for bottom and right in IE<9 should not be incorrectly transformed to pixels, see #11311", function() {
	expect( 1 );
	var div = jQuery("<div style='position: absolute; width: 1px; height: 20px; bottom:50%;'></div>").appendTo( "#qunit-fixture" );
	ok( window.getComputedStyle || div.css( "bottom" ) === "50%", "position properties get incorrectly transformed in IE<8, see #11311" );
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
	equal( $div.css("fill-opacity"), 1, "Do not append px to 'fill-opacity'" );

	$div.css( "column-count", 1 );
	if ( $div.css("column-count") ) {
		equal( $div.css("column-count"), 1, "Do not append px to 'column-count'" );
	} else {
		ok( true, "No support for column-count CSS property" );
	}
});

test("css('width') and css('height') should respect box-sizing, see #11004", function() {
	expect( 4 );

	// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
	var el_dis = jQuery("<div style='width:300px;height:300px;margin:2px;padding:2px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;'>test</div>"),
		el = el_dis.clone().appendTo("#qunit-fixture");

	equal( el.css("width"), el.css("width", el.css("width")).css("width"), "css('width') is not respecting box-sizing, see #11004");
	equal( el_dis.css("width"), el_dis.css("width", el_dis.css("width")).css("width"), "css('width') is not respecting box-sizing for disconnected element, see #11004");
	equal( el.css("height"), el.css("height", el.css("height")).css("height"), "css('height') is not respecting box-sizing, see #11004");
	equal( el_dis.css("height"), el_dis.css("height", el_dis.css("height")).css("height"), "css('height') is not respecting box-sizing for disconnected element, see #11004");
});

test("certain css values of 'normal' should be convertable to a number, see #8627", function() {
	expect ( 2 );

	var el = jQuery("<div style='letter-spacing:normal;font-weight:normal;'>test</div>").appendTo("#qunit-fixture");

	ok( jQuery.isNumeric( parseFloat( el.css("letterSpacing") ) ), "css('letterSpacing') not convertable to number, see #8627" );
	ok( jQuery.isNumeric( parseFloat( el.css("fontWeight") ) ), "css('fontWeight') not convertable to number, see #8627" );
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
	expect( 13 );

	ok( jQuery("#nothiddendiv").is(":visible"), "Modifying CSS display: Assert element is visible" );
	jQuery("#nothiddendiv").css({ display: "none" });
	ok( !jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is hidden" );
	jQuery("#nothiddendiv").css({"display": "block"});
	ok( jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is visible");
	ok( jQuery(window).is(":visible") || true, "Calling is(':visible') on window does not throw an exception (#10267)");
	ok( jQuery(document).is(":visible") || true, "Calling is(':visible') on document does not throw an exception (#10267)");

	ok( jQuery("#nothiddendiv").is(":visible"), "Modifying CSS display: Assert element is visible");
	jQuery("#nothiddendiv").css("display", "none");
	ok( !jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is hidden");
	jQuery("#nothiddendiv").css("display", "block");
	ok( jQuery("#nothiddendiv").is(":visible"), "Modified CSS display: Assert element is visible");

	// ok( !jQuery("#siblingspan").is(":visible"), "Span with no content not visible (#13132)" );
	// var $newDiv = jQuery("<div><span></span></div>").appendTo("#qunit-fixture");
	// equal( $newDiv.find(":visible").length, 0, "Span with no content not visible (#13132)" );
	// var $br = jQuery("<br/>").appendTo("#qunit-fixture");
	// ok( !$br.is(":visible"), "br element not visible (#10406)");

	var $table = jQuery("#table");
	$table.html("<tr><td style='display:none'>cell</td><td>cell</td></tr>");
	equal(jQuery("#table td:visible").length, 1, "hidden cell is not perceived as visible (#4512). Works on table elements");
	$table.css("display", "none").html("<tr><td>cell</td><td>cell</td></tr>");
	equal(jQuery("#table td:visible").length, 0, "hidden cell children not perceived as visible (#4512)");

	t( "Is Visible", "#qunit-fixture div:visible:lt(2)", ["foo", "nothiddendiv"] );
	t( "Is Not Hidden", "#qunit-fixture:hidden", [] );
	t( "Is Hidden", "#form input:hidden", ["hidden1","hidden2"] );
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

asyncTest( "Make sure initialized display value for disconnected nodes is correct (#13310)", 4, function() {
	var display = jQuery("#display").css("display"),
		div = jQuery("<div/>");

	equal( div.css( "display", "inline" ).hide().show().appendTo("body").css( "display" ), "inline", "Initialized display value has returned" );
	div.remove();

	div.css( "display", "none" ).hide();
	equal( jQuery._data( div[ 0 ], "olddisplay" ), undefined, "olddisplay is undefined after hiding a detached and hidden element" );
	div.remove();

	div.css( "display", "inline-block" ).hide().appendTo("body").fadeIn(function() {
		equal( div.css( "display" ), "inline-block", "Initialized display value has returned" );
		div.remove();

		start();
	});

	equal( jQuery._data( jQuery("#display").css( "display", "inline" ).hide()[ 0 ], "olddisplay" ), display,
	"display: * !Important value should used as initialized display" );
	jQuery._removeData( jQuery("#display")[ 0 ] );
});

}
