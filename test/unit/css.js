module("css");

test("css(String|Hash)", function() {
	expect(27);

	equals( jQuery('#main').css("display"), 'none', 'Check for css property "display"');

	ok( jQuery('#nothiddendiv').is(':visible'), 'Modifying CSS display: Assert element is visible');
	jQuery('#nothiddendiv').css({display: 'none'});
	ok( !jQuery('#nothiddendiv').is(':visible'), 'Modified CSS display: Assert element is hidden');
	jQuery('#nothiddendiv').css({display: 'block'});
	ok( jQuery('#nothiddendiv').is(':visible'), 'Modified CSS display: Assert element is visible');

	// handle negative numbers by ignoring #1599, #4216
	var width = parseFloat(jQuery('#nothiddendiv').css('width')), height = parseFloat(jQuery('#nothiddendiv').css('height'));
	jQuery('#nothiddendiv').css({ width: -1, height: -1 });
	equals( parseFloat(jQuery('#nothiddendiv').css('width')), width, 'Test negative width ignored')
	equals( parseFloat(jQuery('#nothiddendiv').css('height')), height, 'Test negative height ignored')

	jQuery('#floatTest').css({styleFloat: 'right'});
	equals( jQuery('#floatTest').css('styleFloat'), 'right', 'Modified CSS float using "styleFloat": Assert float is right');
	jQuery('#floatTest').css({cssFloat: 'left'});
	equals( jQuery('#floatTest').css('cssFloat'), 'left', 'Modified CSS float using "cssFloat": Assert float is left');
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
	equals( parseInt(child.css("fontSize")), 16, "Verify fontSize px set." );

	child.attr("class", "em");
	equals( parseInt(child.css("fontSize")), 32, "Verify fontSize em set." );

	child.attr("class", "prct");
	equals( parseInt(child.css("fontSize")), 24, "Verify fontSize % set." );
});

test("css(String, Object)", function() {
	expect(21);
	ok( jQuery('#nothiddendiv').is(':visible'), 'Modifying CSS display: Assert element is visible');
	jQuery('#nothiddendiv').css("display", 'none');
	ok( !jQuery('#nothiddendiv').is(':visible'), 'Modified CSS display: Assert element is hidden');
	jQuery('#nothiddendiv').css("display", 'block');
	ok( jQuery('#nothiddendiv').is(':visible'), 'Modified CSS display: Assert element is visible');

	jQuery('#floatTest').css('styleFloat', 'left');
	equals( jQuery('#floatTest').css('styleFloat'), 'left', 'Modified CSS float using "styleFloat": Assert float is left');
	jQuery('#floatTest').css('cssFloat', 'right');
	equals( jQuery('#floatTest').css('cssFloat'), 'right', 'Modified CSS float using "cssFloat": Assert float is right');
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
	// for #1438, IE throws JS error when filter exists but doesn't have opacity in it
	if (jQuery.browser.msie) {
		jQuery('#foo').css("filter", "progid:DXImageTransform.Microsoft.Chroma(color='red');");
	}
	equals( jQuery('#foo').css('opacity'), '1', "Assert opacity is 1 when a different filter is set in IE, #1438" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.css("padding-left", "1px");
	equals( j.css("padding-left"), "1px", "Check node,textnode,comment css works" );

	// opera sometimes doesn't update 'display' correctly, see #2037
	jQuery("#t2037")[0].innerHTML = jQuery("#t2037")[0].innerHTML
	equals( jQuery("#t2037 .hidden").css("display"), "none", "Make sure browser thinks it is hidden" );
});

test("css(String, Function)", function() {
	try { 
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
		
	} finally {
		jQuery("#cssFunctionTest").remove();
	}
});

test("css(Object) where values are Functions", function() {
	try { 
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
		
	} finally {
		jQuery("#cssFunctionTest").remove();
	}
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
