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
	equals($div.width(), 30, "Test set to 30 correctly");
	$div.hide();
	equals($div.width(), 30, "Test hidden div");
	$div.show();
	$div.width( val(-1) ); // handle negative numbers by ignoring #1599
	equals($div.width(), 30, "Test negative width ignored");
	$div.css("padding", "20px");
	equals($div.width(), 30, "Test padding specified with pixels");
	$div.css("border", "2px solid #fff");
	equals($div.width(), 30, "Test border specified with pixels");

	$div.css({ display: "", border: "", padding: "" });

	jQuery("#nothiddendivchild").css({ width: 20, padding: "3px", border: "2px solid #fff" });
	equals(jQuery("#nothiddendivchild").width(), 20, "Test child width with border and padding");
	jQuery("#nothiddendiv, #nothiddendivchild").css({ border: "", padding: "", width: "" });

	var blah = jQuery("blah");
	equals( blah.width( val(10) ), blah, "Make sure that setting a width on an empty set returns the set." );
	equals( blah.width(), null, "Make sure 'null' is returned on an empty set");

	jQuery.removeData($div[0], "olddisplay", true);
}

test("width()", function() {
	testWidth( pass );
});

test("width() with function", function() {
	testWidth( fn );
});

test("width() with function args", function() {
	expect( 2 );

	var $div = jQuery("#nothiddendiv");
	$div.width( 30 ).width(function(i, width) {
		equals( width, 30, "Make sure previous value is corrrect." );
		return width + 1;
	});

	equals( $div.width(), 31, "Make sure value was modified correctly." );
});

function testHeight( val ) {
	expect(8);

	var $div = jQuery("#nothiddendiv");
	$div.height( val(30) );
	equals($div.height(), 30, "Test set to 30 correctly");
	$div.hide();
	equals($div.height(), 30, "Test hidden div");
	$div.show();
	$div.height( val(-1) ); // handle negative numbers by ignoring #1599
	equals($div.height(), 30, "Test negative height ignored");
	$div.css("padding", "20px");
	equals($div.height(), 30, "Test padding specified with pixels");
	$div.css("border", "2px solid #fff");
	equals($div.height(), 30, "Test border specified with pixels");

	$div.css({ display: "", border: "", padding: "", height: "1px" });

	jQuery("#nothiddendivchild").css({ height: 20, padding: "3px", border: "2px solid #fff" });
	equals(jQuery("#nothiddendivchild").height(), 20, "Test child height with border and padding");
	jQuery("#nothiddendiv, #nothiddendivchild").css({ border: "", padding: "", height: "" });

	var blah = jQuery("blah");
	equals( blah.height( val(10) ), blah, "Make sure that setting a height on an empty set returns the set." );
	equals( blah.height(), null, "Make sure 'null' is returned on an empty set");

	jQuery.removeData($div[0], "olddisplay", true);
}

test("height()", function() {
	testHeight( pass );
});

test("height() with function", function() {
	testHeight( fn );
});

test("height() with function args", function() {
	expect( 2 );

	var $div = jQuery("#nothiddendiv");
	$div.height( 30 ).height(function(i, height) {
		equals( height, 30, "Make sure previous value is corrrect." );
		return height + 1;
	});

	equals( $div.height(), 31, "Make sure value was modified correctly." );
});

test("innerWidth()", function() {
	expect(8);

	equals(jQuery(window).innerWidth(), null, "Test on window without margin option");
	equals(jQuery(window).innerWidth(true), null, "Test on window with margin option");

	equals(jQuery(document).innerWidth(), null, "Test on document without margin option");
	equals(jQuery(document).innerWidth(true), null, "Test on document with margin option");

	var $div = jQuery("#nothiddendiv");
	// set styles
	$div.css({
		margin: 10,
		border: "2px solid #fff",
		width: 30
	});

	equals($div.innerWidth(), 30, "Test with margin and border");
	$div.css("padding", "20px");
	equals($div.innerWidth(), 70, "Test with margin, border and padding");
	$div.hide();
	equals($div.innerWidth(), 70, "Test hidden div");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.innerWidth(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});

test("innerHeight()", function() {
	expect(8);

	equals(jQuery(window).innerHeight(), null, "Test on window without margin option");
	equals(jQuery(window).innerHeight(true), null, "Test on window with margin option");

	equals(jQuery(document).innerHeight(), null, "Test on document without margin option");
	equals(jQuery(document).innerHeight(true), null, "Test on document with margin option");

	var $div = jQuery("#nothiddendiv");
	// set styles
	$div.css({
		margin: 10,
		border: "2px solid #fff",
		height: 30
	});

	equals($div.innerHeight(), 30, "Test with margin and border");
	$div.css("padding", "20px");
	equals($div.innerHeight(), 70, "Test with margin, border and padding");
	$div.hide();
	equals($div.innerHeight(), 70, "Test hidden div");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.innerHeight(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});

test("outerWidth()", function() {
	expect(11);

	equal( jQuery( window ).outerWidth(), null, "Test on window without margin option" );
	equal( jQuery( window ).outerWidth( true ), null, "Test on window with margin option" );
	equal( jQuery( document ).outerWidth(), null, "Test on document without margin option" );
	equal( jQuery( document ).outerWidth( true ), null, "Test on document with margin option" );

	var $div = jQuery("#nothiddendiv");
	$div.css("width", 30);

	equals($div.outerWidth(), 30, "Test with only width set");
	$div.css("padding", "20px");
	equals($div.outerWidth(), 70, "Test with padding");
	$div.css("border", "2px solid #fff");
	equals($div.outerWidth(), 74, "Test with padding and border");
	$div.css("margin", "10px");
	equals($div.outerWidth(), 74, "Test with padding, border and margin without margin option");
	$div.css("position", "absolute");
	equals($div.outerWidth(true), 94, "Test with padding, border and margin with margin option");
	$div.hide();
	equals($div.outerWidth(true), 94, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.css({ position: "", display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.outerWidth(), 0, "Make sure that disconnected nodes are handled." );

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
	equals( $divChild.width(), $divNormal.width(), "child of a hidden element width() is wrong see #9441" );
	equals( $divChild.innerWidth(), $divNormal.innerWidth(), "child of a hidden element innerWidth() is wrong see #9441" );
	equals( $divChild.outerWidth(), $divNormal.outerWidth(), "child of a hidden element outerWidth() is wrong see #9441" );
	equals( $divChild.outerWidth(true), $divNormal.outerWidth( true ), "child of a hidden element outerWidth( true ) is wrong see #9300" );

	equals( $divChild.height(), $divNormal.height(), "child of a hidden element height() is wrong see #9441" );
	equals( $divChild.innerHeight(), $divNormal.innerHeight(), "child of a hidden element innerHeight() is wrong see #9441" );
	equals( $divChild.outerHeight(), $divNormal.outerHeight(), "child of a hidden element outerHeight() is wrong see #9441" );
	equals( $divChild.outerHeight(true), $divNormal.outerHeight( true ), "child of a hidden element outerHeight( true ) is wrong see #9300" );

	// teardown html
	$divHiddenParent.remove();
	$divNormal.remove();
});

test("outerHeight()", function() {
	expect(11);

	equal( jQuery( window ).outerHeight(), null, "Test on window without margin option" );
	equal( jQuery( window ).outerHeight( true ), null, "Test on window with margin option" );
	equal( jQuery( document ).outerHeight(), null, "Test on document without margin option" );
	equal( jQuery( document ).outerHeight( true ), null, "Test on document with margin option" );

	var $div = jQuery("#nothiddendiv");
	$div.css("height", 30);

	equals($div.outerHeight(), 30, "Test with only width set");
	$div.css("padding", "20px");
	equals($div.outerHeight(), 70, "Test with padding");
	$div.css("border", "2px solid #fff");
	equals($div.outerHeight(), 74, "Test with padding and border");
	$div.css("margin", "10px");
	equals($div.outerHeight(), 74, "Test with padding, border and margin without margin option");
	equals($div.outerHeight(true), 94, "Test with padding, border and margin with margin option");
	$div.hide();
	equals($div.outerHeight(true), 94, "Test hidden div with padding, border and margin with margin option");

	// reset styles
	$div.css({ display: "", border: "", padding: "", width: "", height: "" });

	var div = jQuery( "<div>" );

	// Temporarily require 0 for backwards compat - should be auto
	equals( div.outerHeight(), 0, "Make sure that disconnected nodes are handled." );

	div.remove();
	jQuery.removeData($div[0], "olddisplay", true);
});
