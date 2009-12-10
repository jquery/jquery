module("dimensions");

test("width()", function() {
	expect(7);

	var $div = jQuery("#nothiddendiv");
	$div.width(30);
	equals($div.width(), 30, "Test set to 30 correctly");
	$div.hide();
	equals($div.width(), 30, "Test hidden div");
	$div.show();
	$div.width(-1); // handle negative numbers by ignoring #1599
	equals($div.width(), 30, "Test negative width ignored");
	$div.css("padding", "20px");
	equals($div.width(), 30, "Test padding specified with pixels");
	$div.css("border", "2px solid #fff");
	equals($div.width(), 30, "Test border specified with pixels");
	//$div.css("padding", "2em");
	//equals($div.width(), 30, "Test padding specified with ems");
	//$div.css("border", "1em solid #fff");
	//DISABLED - Opera 9.6 fails this test, returns 8
	//equals($div.width(), 30, "Test border specified with ems");
	//$div.css("padding", "2%");
	//equals($div.width(), 30, "Test padding specified with percent");

	$div.css({ display: "", border: "", padding: "" });

	jQuery("#nothiddendivchild").css({ padding: "3px", border: "2px solid #fff" });
	equals(jQuery("#nothiddendivchild").width(), 20, "Test child width with border and padding");
	jQuery("#nothiddendiv, #nothiddendivchild").css({ border: "", padding: "", width: "" });

	var blah = jQuery("blah");
	equals( blah.width(10), blah, "Make sure that setting a width on an empty set returns the set." );
});

test("height()", function() {
	expect(6);

	var $div = jQuery("#nothiddendiv");
	$div.height(30);
	equals($div.height(), 30, "Test set to 30 correctly");
	$div.hide();
	equals($div.height(), 30, "Test hidden div");
	$div.show();
	$div.height(-1); // handle negative numbers by ignoring #1599
	equals($div.height(), 30, "Test negative height ignored");
	$div.css("padding", "20px");
	equals($div.height(), 30, "Test padding specified with pixels");
	$div.css("border", "2px solid #fff");
	equals($div.height(), 30, "Test border specified with pixels");
	//$div.css("padding", "2em");
	//equals($div.height(), 30, "Test padding specified with ems");
	//$div.css("border", "1em solid #fff");
	//DISABLED - Opera 9.6 fails this test, returns 8
	//equals($div.height(), 30, "Test border specified with ems");
	//$div.css("padding", "2%");
	//equals($div.height(), 30, "Test padding specified with percent");

	$div.css({ display: "", border: "", padding: "", height: "1px" });

	var blah = jQuery("blah");
	equals( blah.height(10), blah, "Make sure that setting a height on an empty set returns the set." );
});

test("innerWidth()", function() {
	expect(3);

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
});

test("innerHeight()", function() {
	expect(3);
	
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
});

test("outerWidth()", function() {
	expect(6);
	
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
});

test("outerHeight()", function() {
	expect(6);
	
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
});
