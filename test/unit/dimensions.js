module("dimensions", { teardown: moduleTeardown });

function pass( val ) {
	return val;
}

function fn( val ) {
	return function(){ return val; };
}

function testWidth( val ) {
	expect(8);

	var $div = jQuery("#nothiddendiv");
	$div.width( val(30) );
	equal($div.width(), 30, "Test set to 30 correctly");
	$div.hide();
	equal($div.width(), 30, "Test hidden div");
	$div.show();
	$div.width( val(-1) ); // handle negative numbers by ignoring #1599
	equal($div.width(), 30, "Test negative width ignored");
	$div.css("padding", "20px");
	equal($div.width(), 30, "Test padding specified with pixels");
	$div.css("border", "2px solid #fff");
	equal($div.width(), 30, "Test border specified with pixels");

	$div.css({ display: "", border: "", padding: "" });

	jQuery("#nothiddendivchild").css({ width: 20, padding: "3px", border: "2px solid #fff" });
	equal(jQuery("#nothiddendivchild").width(), 20, "Test child width with border and padding");
	jQuery("#nothiddendiv, #nothiddendivchild").css({ border: "", padding: "", width: "" });

	var blah = jQuery("blah");
	equal( blah.width( val(10) ), blah, "Make sure that setting a width on an empty set returns the set." );
	equal( blah.width(), null, "Make sure 'null' is returned on an empty set");

	jQuery.removeData($div[0], "olddisplay", true);
}

test("width()", function() {
	testWidth( pass );
});

test("width(undefined)", function() {
	expect(1);
	equal(jQuery("#nothiddendiv").width(30).width(undefined).width(), 30, ".width(undefined) is chainable (#5571)");
});

test("width(Function)", function() {
	testWidth( fn );
});

test("width(Function(args))", function() {
	expect( 2 );

	var $div = jQuery("#nothiddendiv");
	$div.width( 30 ).width(function(i, width) {
		equal( width, 30, "Make sure previous value is corrrect." );
		return width + 1;
	});

	equal( $div.width(), 31, "Make sure value was modified correctly." );
});

function testHeight( val ) {
	expect(8);

	var $div = jQuery("#nothiddendiv");
	$div.height( val(30) );
	equal($div.height(), 30, "Test set to 30 correctly");
	$div.hide();
	equal($div.height(), 30, "Test hidden div");
	$div.show();
	$div.height( val(-1) ); // handle negative numbers by ignoring #1599
	equal($div.height(), 30, "Test negative height ignored");
	$div.css("padding", "20px");
	equal($div.height(), 30, "Test padding specified with pixels");
	$div.css("border", "2px solid #fff");
	equal($div.height(), 30, "Test border specified with pixels");

	$div.css({ display: "", border: "", padding: "", height: "1px" });

	jQuery("#nothiddendivchild").css({ height: 20, padding: "3px", border: "2px solid #fff" });
	equal(jQuery("#nothiddendivchild").height(), 20, "Test child height with border and padding");
	jQuery("#nothiddendiv, #nothiddendivchild").css({ border: "", padding: "", height: "" });

	var blah = jQuery("blah");
	equal( blah.height( val(10) ), blah, "Make sure that setting a height on an empty set returns the set." );
	equal( blah.height(), null, "Make sure 'null' is returned on an empty set");

	jQuery.removeData($div[0], "olddisplay", true);
}

test("height()", function() {
	testHeight( pass );
});

test("height(undefined)", function() {
	expect(1);
	equal(jQuery("#nothiddendiv").height(30).height(undefined).height(), 30, ".height(undefined) is chainable (#5571)");
});

test("height(Function)", function() {
	testHeight( fn );
});

test("height(Function(args))", function() {
	expect( 2 );

	var $div = jQuery("#nothiddendiv");
	$div.height( 30 ).height(function(i, height) {
		equal( height, 30, "Make sure previous value is corrrect." );
		return height + 1;
	});

	equal( $div.height(), 31, "Make sure value was modified correctly." );
});

test("innerWidth()", function() {
	expect(8);

	var winWidth = jQuery( window ).width(),
		docWidth = jQuery( document ).width();

	equal(jQuery(window).innerWidth(), winWidth, "Test on window without margin option");
	equal(jQuery(window).innerWidth(true), winWidth, "Test on window with margin option");

	equal(jQuery(document).innerWidth(), docWidth, "Test on document without margin option");
	equal(jQuery(document).innerWidth(true), docWidth, "Test on document with margin option");

	var $div = jQuery("#nothiddendiv");
	// set styles
	$div.css({
		margin: 10,
		border: "2px solid #fff",
		width: 30
	});

	equal($div.innerWidth(), 30, "Test with margin and border");
	$div.css("padding", "20px");
	equal($div.innerWidth(), 70, "Test with margin, border and padding");
	$div.hide();
	equal($div.innerWidth(), 70, "Test hidden div");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equal( div.innerWidth(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});

test("innerHeight()", function() {
	expect(8);

	var winHeight = jQuery( window ).height(),
		docHeight = jQuery( document ).height();

	equal(jQuery(window).innerHeight(), winHeight, "Test on window without margin option");
	equal(jQuery(window).innerHeight(true), winHeight, "Test on window with margin option");

	equal(jQuery(document).innerHeight(), docHeight, "Test on document without margin option");
	equal(jQuery(document).innerHeight(true), docHeight, "Test on document with margin option");

	var $div = jQuery("#nothiddendiv");
	// set styles
	$div.css({
		margin: 10,
		border: "2px solid #fff",
		height: 30
	});

	equal($div.innerHeight(), 30, "Test with margin and border");
	$div.css("padding", "20px");
	equal($div.innerHeight(), 70, "Test with margin, border and padding");
	$div.hide();
	equal($div.innerHeight(), 70, "Test hidden div");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equal( div.innerHeight(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});

test("outerWidth()", function() {
	expect(11);

	var winWidth = jQuery( window ).width(),
		docWidth = jQuery( document ).width();

	equal( jQuery( window ).outerWidth(), winWidth, "Test on window without margin option" );
	equal( jQuery( window ).outerWidth( true ), winWidth, "Test on window with margin option" );
	equal( jQuery( document ).outerWidth(), docWidth, "Test on document without margin option" );
	equal( jQuery( document ).outerWidth( true ), docWidth, "Test on document with margin option" );

	var $div = jQuery("#nothiddendiv");
	$div.css("width", 30);

	equal($div.outerWidth(), 30, "Test with only width set");
	$div.css("padding", "20px");
	equal($div.outerWidth(), 70, "Test with padding");
	$div.css("border", "2px solid #fff");
	equal($div.outerWidth(), 74, "Test with padding and border");
	$div.css("margin", "10px");
	equal($div.outerWidth(), 74, "Test with padding, border and margin without margin option");
	$div.css("position", "absolute");
	equal($div.outerWidth(true), 94, "Test with padding, border and margin with margin option");
	$div.hide();
	equal($div.outerWidth(true), 94, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.css({ position: "", display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equal( div.outerWidth(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});

test("child of a hidden elem has accurate inner/outer/Width()/Height()  see #9441 #9300", function() {
	expect(8);

	// setup html
	var $divNormal       = jQuery("<div>").css({ width: "100px", height: "100px", border: "10px solid white", padding: "2px", margin: "3px" }),
		$divChild        = $divNormal.clone(),
		$divHiddenParent = jQuery("<div>").css( "display", "none" ).append( $divChild ).appendTo("body");
	$divNormal.appendTo("body");

	// tests that child div of a hidden div works the same as a normal div
	equal( $divChild.width(), $divNormal.width(), "child of a hidden element width() is wrong see #9441" );
	equal( $divChild.innerWidth(), $divNormal.innerWidth(), "child of a hidden element innerWidth() is wrong see #9441" );
	equal( $divChild.outerWidth(), $divNormal.outerWidth(), "child of a hidden element outerWidth() is wrong see #9441" );
	equal( $divChild.outerWidth(true), $divNormal.outerWidth( true ), "child of a hidden element outerWidth( true ) is wrong see #9300" );

	equal( $divChild.height(), $divNormal.height(), "child of a hidden element height() is wrong see #9441" );
	equal( $divChild.innerHeight(), $divNormal.innerHeight(), "child of a hidden element innerHeight() is wrong see #9441" );
	equal( $divChild.outerHeight(), $divNormal.outerHeight(), "child of a hidden element outerHeight() is wrong see #9441" );
	equal( $divChild.outerHeight(true), $divNormal.outerHeight( true ), "child of a hidden element outerHeight( true ) is wrong see #9300" );

	// teardown html
	$divHiddenParent.remove();
	$divNormal.remove();
});

test("getting dimensions shouldnt modify runtimeStyle see #9233", function() {
	expect( 1 );

	var $div = jQuery( "<div>" ).appendTo( "#qunit-fixture" ),
		div = $div.get( 0 ),
		runtimeStyle = div.runtimeStyle;

	if ( runtimeStyle ) {
		div.runtimeStyle.marginLeft = "12em";
		div.runtimeStyle.left = "11em";
	}

	$div.outerWidth( true );

	if ( runtimeStyle ) {
		equal( div.runtimeStyle.left, "11em", "getting dimensions modifies runtimeStyle, see #9233" );
	} else {
		ok( true, "this browser doesnt support runtimeStyle, see #9233" );
	}

	$div.remove();
});

test("outerHeight()", function() {
	expect(11);

	var winHeight = jQuery( window ).height(),
		docHeight = jQuery( document ).height();


	equal( jQuery( window ).outerHeight(), winHeight, "Test on window without margin option" );
	equal( jQuery( window ).outerHeight( true ), winHeight, "Test on window with margin option" );
	equal( jQuery( document ).outerHeight(), docHeight, "Test on document without margin option" );
	equal( jQuery( document ).outerHeight( true ), docHeight, "Test on document with margin option" );

	var $div = jQuery("#nothiddendiv");
	$div.css("height", 30);

	equal($div.outerHeight(), 30, "Test with only width set");
	$div.css("padding", "20px");
	equal($div.outerHeight(), 70, "Test with padding");
	$div.css("border", "2px solid #fff");
	equal($div.outerHeight(), 74, "Test with padding and border");
	$div.css("margin", "10px");
	equal($div.outerHeight(), 74, "Test with padding, border and margin without margin option");
	equal($div.outerHeight(true), 94, "Test with padding, border and margin with margin option");
	$div.hide();
	equal($div.outerHeight(true), 94, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equal( div.outerHeight(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});

testIframe("dimensions/documentSmall", "window vs. small document", function( jQuery, window, document ) {
	expect(2);

	equal( jQuery( document ).height(), jQuery( window ).height(), "document height matches window height");
	equal( jQuery( document ).width(), jQuery( window ).width(), "document width matches window width");
});

testIframe("dimensions/documentLarge", "window vs. large document", function( jQuery, window, document ) {
	expect(2);

	ok( jQuery( document ).height() > jQuery( window ).height(), "document height is larger than window height");
	ok( jQuery( document ).width() > jQuery( window ).width(), "document width is larger than window width");
});
