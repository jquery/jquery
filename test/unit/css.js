module("css");

test("css(String|Hash)", function() {
	expect(29);

	equals( jQuery('#main').css("display"), 'none', 'Check for css property "display"');

	ok( jQuery('#nothiddendiv').is(':visible'), 'Modifying CSS display: Assert element is visible');
	jQuery('#nothiddendiv').css({display: 'none'});
	ok( !jQuery('#nothiddendiv').is(':visible'), 'Modified CSS display: Assert element is hidden');
	jQuery('#nothiddendiv').css({display: 'block'});
	ok( jQuery('#nothiddendiv').is(':visible'), 'Modified CSS display: Assert element is visible');

	// handle negative numbers by ignoring #1599, #4216
	jQuery('#nothiddendiv').css({ 'width': 1, 'height': 1 });

	var width = parseFloat(jQuery('#nothiddendiv').css('width')), height = parseFloat(jQuery('#nothiddendiv').css('height'));
	jQuery('#nothiddendiv').css({ width: -1, height: -1 });
	equals( parseFloat(jQuery('#nothiddendiv').css('width')), width, 'Test negative width ignored')
	equals( parseFloat(jQuery('#nothiddendiv').css('height')), height, 'Test negative height ignored')

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
});

test("css(String, Object)", function() {
	expect(21);

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
	j.css("padding-left", "1px");
	equals( j.css("padding-left"), "1px", "Check node,textnode,comment css works" );

	// opera sometimes doesn't update 'display' correctly, see #2037
	jQuery("#t2037")[0].innerHTML = jQuery("#t2037")[0].innerHTML
	equals( jQuery("#t2037 .hidden").css("display"), "none", "Make sure browser thinks it is hidden" );

	var div = jQuery("#nothiddendiv"),
		display = div.css("display"),
		ret = div.css("display", undefined);

	equals( ret, div, "Make sure setting undefined returns the original set." );
	equals( div.css("display"), display, "Make sure that the display wasn't changed." );
});

if(jQuery.browser.msie) {
  test("css(String, Object) for MSIE", function() {
    // for #1438, IE throws JS error when filter exists but doesn't have opacity in it
		jQuery('#foo').css("filter", "progid:DXImageTransform.Microsoft.Chroma(color='red');");
  	equals( jQuery('#foo').css('opacity'), '1', "Assert opacity is 1 when a different filter is set in IE, #1438" );

    var filterVal = "progid:DXImageTransform.Microsoft.Alpha(opacity=30) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
    var filterVal2 = "progid:DXImageTransform.Microsoft.alpha(opacity=100) progid:DXImageTransform.Microsoft.Blur(pixelradius=5)";
    jQuery('#foo').css("filter", filterVal);
    equals( jQuery('#foo').css("filter"), filterVal, "css('filter', val) works" );
    jQuery('#foo').css("opacity", 1)
    equals( jQuery('#foo').css("filter"), filterVal2, "Setting opacity in IE doesn't clobber other filters" );
    equals( jQuery('#foo').css("opacity"), 1, "Setting opacity in IE with other filters works" )
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

test("verify normalized left, top return values when auto", function(){
    //opera returns, more useful but non-standard absolute values for left and top getComputedStyles when position is 
    //static and relative.  This difference is the cause of http://dev.jqueryui.com/ticket/5537
    expect(4);
    //verify that position: static returns auto for left and top
    var staticP = jQuery("<p style='position:static'>temp</p>").appendTo("body");
    var leftVal = staticP.css("left");
    var topVal = staticP.css("top");
    equals(leftVal, "auto", "Left should be auto");
    equals(topVal, "auto", "Top should be auto");
    //clean up
    staticP.remove();
    //verify that position: relative returns the relative and not the absolute value for left and top

    var relP = jQuery("<div><p style='position:relative;'>temp</p></div>")
        .appendTo("body")
        .children();
    leftVal = relP.css("left");
    topVal = relP.css("top");
    ok(leftVal === "0px" || leftVal === "auto", "Left should be auto or 0px and was " + leftVal);//per css2 9.4.3, the computed value should be 0, but it's working as auto
    ok(topVal === "0px" || topVal === "auto", "Top should be auto or 0px and was " + topVal);
    //clean up
    relP.remove();
});

test("verify normalized left, top return values when set", function(){
    expect(10);
    var pars = ['<p style="position:relative;left:20px;top:20px;">inline</p>',
            '<p class="pxSet" >set</p>',
            '<p class="emSet">set</p>'];
    
    var expected = "20px";
    var assertAndRemove = function(p){
        var par = jQuery(p).appendTo("body");
        var leftVal = par.css("left");
        var topVal = par.css("top");
        ok(leftVal === expected, "Left should be " + expected + " and was " + leftVal);//per css2 9.4.3, the computed value should be 0, but it's working as auto
        ok(topVal === expected, "Top should be " + expected + " and was " + topVal);
        par.remove();
    };
    jQuery(pars).each(function(index, value){
                assertAndRemove(value);
            });
    var emPars = ['<p style="position:relative;left:2em;top:2em;font-size:10px;">inline</p>',
                  '<p style="position:static;left:2em;top:2em;font-size:10px;">inline</p>'
                  ];
    expected = "20px";//in these two cases, webkit returns auto
    jQuery(emPars).each(function(index, value){
                assertAndRemove(value);
    });
    
});

