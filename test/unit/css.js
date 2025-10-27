if ( includesModule( "css" ) ) {

QUnit.module( "css", { afterEach: moduleTeardown } );

QUnit.test( "css(String|Hash)", function( assert ) {
	assert.expect( 42 );

	assert.equal( jQuery( "#qunit-fixture" ).css( "display" ), "block", "Check for css property \"display\"" );

	var $child, div, div2, child, prctval, checkval, old;

	$child = jQuery( "#nothiddendivchild" ).css( { "width": "20%", "height": "20%" } );
	assert.notEqual( $child.css( "width" ), "20px", "Retrieving a width percentage on the child of a hidden div returns percentage" );
	assert.notEqual( $child.css( "height" ), "20px", "Retrieving a height percentage on the child of a hidden div returns percentage" );

	div = jQuery( "<div></div>" );

	// These should be "auto" (or some better value)
	// temporarily provide "0px" for backwards compat
	assert.equal( div.css( "width" ), "0px", "Width on disconnected node." );
	assert.equal( div.css( "height" ), "0px", "Height on disconnected node." );

	div.css( { "width": 4, "height": 4 } );

	assert.equal( div.css( "width" ), "4px", "Width on disconnected node." );
	assert.equal( div.css( "height" ), "4px", "Height on disconnected node." );

	div2 = jQuery( "<div style='display:none;'><input type='text' style='height:20px;'/><textarea style='height:20px;'></textarea><div style='height:20px;'></div></div>" ).appendTo( "body" );

	assert.equal( div2.find( "input" ).css( "height" ), "20px", "Height on hidden input." );
	assert.equal( div2.find( "textarea" ).css( "height" ), "20px", "Height on hidden textarea." );
	assert.equal( div2.find( "div" ).css( "height" ), "20px", "Height on hidden div." );

	div2.remove();

	// handle negative numbers by setting to zero trac-11604
	jQuery( "#nothiddendiv" ).css( { "width": 1, "height": 1 } );

	jQuery( "#nothiddendiv" ).css( { "overflow": "hidden", "width": -1, "height": -1 } );
	assert.equal( parseFloat( jQuery( "#nothiddendiv" ).css( "width" ) ), 0, "Test negative width set to 0" );
	assert.equal( parseFloat( jQuery( "#nothiddendiv" ).css( "height" ) ), 0, "Test negative height set to 0" );

	assert.equal( jQuery( "<div style='display: none;'></div>" ).css( "display" ), "none", "Styles on disconnected nodes" );

	jQuery( "#floatTest" ).css( { "float": "right" } );
	assert.equal( jQuery( "#floatTest" ).css( "float" ), "right", "Modified CSS float using \"float\": Assert float is right" );
	jQuery( "#floatTest" ).css( { "font-size": "30px" } );
	assert.equal( jQuery( "#floatTest" ).css( "font-size" ), "30px", "Modified CSS font-size: Assert font-size is 30px" );
	jQuery.each( "0,0.25,0.5,0.75,1".split( "," ), function( i, n ) {
		jQuery( "#foo" ).css( { "opacity": n } );

		assert.equal( jQuery( "#foo" ).css( "opacity" ), parseFloat( n ), "Assert opacity is " + parseFloat( n ) + " as a String" );
		jQuery( "#foo" ).css( { "opacity": parseFloat( n ) } );
		assert.equal( jQuery( "#foo" ).css( "opacity" ), parseFloat( n ), "Assert opacity is " + parseFloat( n ) + " as a Number" );
	} );
	jQuery( "#foo" ).css( { "opacity": "" } );
	assert.equal( jQuery( "#foo" ).css( "opacity" ), "1", "Assert opacity is 1 when set to an empty String" );

	assert.equal( jQuery( "#empty" ).css( "opacity" ), "0", "Assert opacity is accessible" );
	jQuery( "#empty" ).css( { "opacity": "1" } );
	assert.equal( jQuery( "#empty" ).css( "opacity" ), "1", "Assert opacity is taken from style attribute when set" );

	div = jQuery( "#nothiddendiv" );
	child = jQuery( "#nothiddendivchild" );

	assert.equal( parseInt( div.css( "fontSize" ), 10 ), 16, "Verify fontSize px set." );
	assert.equal( parseInt( div.css( "font-size" ), 10 ), 16, "Verify fontSize px set." );
	assert.equal( parseInt( child.css( "fontSize" ), 10 ), 16, "Verify fontSize px set." );
	assert.equal( parseInt( child.css( "font-size" ), 10 ), 16, "Verify fontSize px set." );

	child.css( "height", "100%" );
	assert.equal( child[ 0 ].style.height, "100%", "Make sure the height is being set correctly." );

	child.attr( "class", "em" );
	assert.equal( parseInt( child.css( "fontSize" ), 10 ), 32, "Verify fontSize em set." );

	// Have to verify this as the result depends upon the browser's CSS
	// support for font-size percentages
	child.attr( "class", "prct" );
	prctval = parseInt( child.css( "fontSize" ), 10 );
	checkval = 0;
	if ( prctval === 16 || prctval === 24 ) {
		checkval = prctval;
	}

	assert.equal( prctval, checkval, "Verify fontSize % set." );

	assert.equal( typeof child.css( "width" ), "string", "Make sure that a string width is returned from css('width')." );

	old = child[ 0 ].style.height;

	// Test NaN
	child.css( "height", parseFloat( "zoo" ) );
	assert.equal( child[ 0 ].style.height, old, "Make sure height isn't changed on NaN." );

	// Test null
	child.css( "height", null );
	assert.equal( child[ 0 ].style.height, old, "Make sure height isn't changed on null." );

	old = child[ 0 ].style.fontSize;

	// Test NaN
	child.css( "font-size", parseFloat( "zoo" ) );
	assert.equal( child[ 0 ].style.fontSize, old, "Make sure font-size isn't changed on NaN." );

	// Test null
	child.css( "font-size", null );
	assert.equal( child[ 0 ].style.fontSize, old, "Make sure font-size isn't changed on null." );

	assert.strictEqual( child.css( "x-fake" ), undefined, "Make sure undefined is returned from css(nonexistent)." );

	div = jQuery( "<div></div>" ).css( { position: "absolute", "z-index": 1000 } ).appendTo( "#qunit-fixture" );
	assert.strictEqual( div.css( "z-index" ), "1000",
		"Make sure that a string z-index is returned from css('z-index') (trac-14432)." );
} );

QUnit.test( "css() explicit and relative values", function( assert ) {
	assert.expect( 29 );

	var $elem = jQuery( "#nothiddendiv" );

	$elem.css( { "width": 1, "height": 1, "paddingLeft": "1px", "opacity": 1 } );
	assert.equal( $elem.css( "width" ), "1px", "Initial css set or width/height works (hash)" );
	assert.equal( $elem.css( "paddingLeft" ), "1px", "Initial css set of paddingLeft works (hash)" );
	assert.equal( $elem.css( "opacity" ), "1", "Initial css set of opacity works (hash)" );

	$elem.css( { width: "+=9" } );
	assert.equal( $elem.css( "width" ), "10px", "'+=9' on width (hash)" );

	$elem.css( { "width": "-=9" } );
	assert.equal( $elem.css( "width" ), "1px", "'-=9' on width (hash)" );

	$elem.css( { "width": "+=9px" } );
	assert.equal( $elem.css( "width" ), "10px", "'+=9px' on width (hash)" );

	$elem.css( { "width": "-=9px" } );
	assert.equal( $elem.css( "width" ), "1px", "'-=9px' on width (hash)" );

	$elem.css( "width", "+=9" );
	assert.equal( $elem.css( "width" ), "10px", "'+=9' on width (params)" );

	$elem.css( "width", "-=9" );
	assert.equal( $elem.css( "width" ), "1px", "'-=9' on width (params)" );

	$elem.css( "width", "+=9px" );
	assert.equal( $elem.css( "width" ), "10px", "'+=9px' on width (params)" );

	$elem.css( "width", "-=9px" );
	assert.equal( $elem.css( "width" ), "1px", "'-=9px' on width (params)" );

	$elem.css( "width", "-=-9px" );
	assert.equal( $elem.css( "width" ), "10px", "'-=-9px' on width (params)" );

	$elem.css( "width", "+=-9px" );
	assert.equal( $elem.css( "width" ), "1px", "'+=-9px' on width (params)" );

	$elem.css( { "paddingLeft": "+=4" } );
	assert.equal( $elem.css( "paddingLeft" ), "5px", "'+=4' on paddingLeft (hash)" );

	$elem.css( { "paddingLeft": "-=4" } );
	assert.equal( $elem.css( "paddingLeft" ), "1px", "'-=4' on paddingLeft (hash)" );

	$elem.css( { "paddingLeft": "+=4px" } );
	assert.equal( $elem.css( "paddingLeft" ), "5px", "'+=4px' on paddingLeft (hash)" );

	$elem.css( { "paddingLeft": "-=4px" } );
	assert.equal( $elem.css( "paddingLeft" ), "1px", "'-=4px' on paddingLeft (hash)" );

	$elem.css( { "padding-left": "+=4" } );
	assert.equal( $elem.css( "paddingLeft" ), "5px", "'+=4' on padding-left (hash)" );

	$elem.css( { "padding-left": "-=4" } );
	assert.equal( $elem.css( "paddingLeft" ), "1px", "'-=4' on padding-left (hash)" );

	$elem.css( { "padding-left": "+=4px" } );
	assert.equal( $elem.css( "paddingLeft" ), "5px", "'+=4px' on padding-left (hash)" );

	$elem.css( { "padding-left": "-=4px" } );
	assert.equal( $elem.css( "paddingLeft" ), "1px", "'-=4px' on padding-left (hash)" );

	$elem.css( "paddingLeft", "+=4" );
	assert.equal( $elem.css( "paddingLeft" ), "5px", "'+=4' on paddingLeft (params)" );

	$elem.css( "paddingLeft", "-=4" );
	assert.equal( $elem.css( "paddingLeft" ), "1px", "'-=4' on paddingLeft (params)" );

	$elem.css( "padding-left", "+=4px" );
	assert.equal( $elem.css( "paddingLeft" ), "5px", "'+=4px' on padding-left (params)" );

	$elem.css( "padding-left", "-=4px" );
	assert.equal( $elem.css( "paddingLeft" ), "1px", "'-=4px' on padding-left (params)" );

	$elem.css( { "opacity": "-=0.5" } );
	assert.equal( $elem.css( "opacity" ), "0.5", "'-=0.5' on opacity (hash)" );

	$elem.css( { "opacity": "+=0.5" } );
	assert.equal( $elem.css( "opacity" ), "1", "'+=0.5' on opacity (hash)" );

	$elem.css( "opacity", "-=0.5" );
	assert.equal( $elem.css( "opacity" ), "0.5", "'-=0.5' on opacity (params)" );

	$elem.css( "opacity", "+=0.5" );
	assert.equal( $elem.css( "opacity" ), "1", "'+=0.5' on opacity (params)" );
} );

QUnit.test( "css() non-px relative values (gh-1711)", function( assert ) {
	assert.expect( 17 );

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
			message += " (actual " + round( cssCurrent, 2 ) + "px, expected " +
				round( expected, 2 ) + "px)";

			// Require a difference of no more than one pixel
			difference = Math.abs( cssCurrent - expected );
			assert.ok( difference <= 1, message );
		},
		getUnits = function( prop ) {
			units[ prop ] = {
				"px": 1,
				"em": parseFloat( $child.css( prop, "100em" ).css( prop ) ) / 100,
				"pt": parseFloat( $child.css( prop, "100pt" ).css( prop ) ) / 100,
				"pc": parseFloat( $child.css( prop, "100pc" ).css( prop ) ) / 100,
				"cm": parseFloat( $child.css( prop, "100cm" ).css( prop ) ) / 100,
				"mm": parseFloat( $child.css( prop, "100mm" ).css( prop ) ) / 100,
				"%": parseFloat( $child.css( prop, "500%"  ).css( prop ) ) / 500
			};
		},
		round = function( num, fractionDigits ) {
			var base = Math.pow( 10, fractionDigits );
			return Math.round( num * base ) / base;
		};

	jQuery( "#nothiddendiv" ).css( { height: 1, padding: 0, width: 400 } );
	$child.css( { height: 1, padding: 0 } );

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
	add( "lineHeight",  50,  "%" );
	add( "lineHeight",   2, "em" );
	add( "lineHeight", -10, "px" );
	add( "lineHeight",  20, "pt" );
	add( "lineHeight",  30, "pc" );
	add( "lineHeight",   1, "cm" );
	add( "lineHeight", -44, "mm" );
} );

QUnit.test( "css() mismatched relative values with bounded styles (gh-2144)", function( assert ) {
	assert.expect( 1 );

	var $container = jQuery( "<div></div>" )
			.css( { position: "absolute", width: "400px", fontSize: "4px" } )
			.appendTo( "#qunit-fixture" ),
		$el = jQuery( "<div></div>" )
			.css( { position: "absolute", left: "50%", right: "50%" } )
			.appendTo( $container );

	$el.css( "right", "-=25em" );
	assert.equal( Math.round( parseFloat( $el.css( "right" ) ) ), 100,
		"Constraints do not interfere with unit conversion" );
} );

QUnit.test( "css(String, Object)", function( assert ) {
	assert.expect( 19 );
	var j, div, display, ret, success;

	jQuery( "#floatTest" ).css( "float", "left" );
	assert.equal( jQuery( "#floatTest" ).css( "float" ), "left", "Modified CSS float using \"float\": Assert float is left" );
	jQuery( "#floatTest" ).css( "font-size", "20px" );
	assert.equal( jQuery( "#floatTest" ).css( "font-size" ), "20px", "Modified CSS font-size: Assert font-size is 20px" );

	jQuery.each( "0,0.25,0.5,0.75,1".split( "," ), function( i, n ) {
		jQuery( "#foo" ).css( "opacity", n );
		assert.equal( jQuery( "#foo" ).css( "opacity" ), parseFloat( n ), "Assert opacity is " + parseFloat( n ) + " as a String" );
		jQuery( "#foo" ).css( "opacity", parseFloat( n ) );
		assert.equal( jQuery( "#foo" ).css( "opacity" ), parseFloat( n ), "Assert opacity is " + parseFloat( n ) + " as a Number" );
	} );
	jQuery( "#foo" ).css( "opacity", "" );
	assert.equal( jQuery( "#foo" ).css( "opacity" ), "1", "Assert opacity is 1 when set to an empty String" );

	// using contents will get comments regular, text, and comment nodes
	j = jQuery( "#nonnodes" ).contents();
	j.css( "overflow", "visible" );
	assert.equal( j.css( "overflow" ), "visible", "Check node,textnode,comment css works" );
	assert.equal( jQuery( "#t2037 .hidden" ).css( "display" ), "none", "Make sure browser thinks it is hidden" );

	div = jQuery( "#nothiddendiv" );
	display = div.css( "display" );
	ret = div.css( "display", undefined );

	assert.equal( ret, div, "Make sure setting undefined returns the original set." );
	assert.equal( div.css( "display" ), display, "Make sure that the display wasn't changed." );

	success = true;
	try {
		jQuery( "#foo" ).css( "backgroundColor", "rgba(0, 0, 0, 0.1)" );
	} catch ( e ) {
		success = false;
	}
	assert.ok( success, "Setting RGBA values does not throw Error (trac-5509)" );

	jQuery( "#foo" ).css( "font", "7px/21px sans-serif" );
	assert.strictEqual( jQuery( "#foo" ).css( "line-height" ), "21px",
		"Set font shorthand property (trac-14759)" );
} );

QUnit.test( "css(String, Object) with negative values", function( assert ) {
	assert.expect( 4 );

	jQuery( "#nothiddendiv" ).css( "margin-top", "-10px" );
	jQuery( "#nothiddendiv" ).css( "margin-left", "-10px" );
	assert.equal( jQuery( "#nothiddendiv" ).css( "margin-top" ), "-10px", "Ensure negative top margins work." );
	assert.equal( jQuery( "#nothiddendiv" ).css( "margin-left" ), "-10px", "Ensure negative left margins work." );

	jQuery( "#nothiddendiv" ).css( "position", "absolute" );
	jQuery( "#nothiddendiv" ).css( "top", "-20px" );
	jQuery( "#nothiddendiv" ).css( "left", "-20px" );
	assert.equal( jQuery( "#nothiddendiv" ).css( "top" ), "-20px", "Ensure negative top values work." );
	assert.equal( jQuery( "#nothiddendiv" ).css( "left" ), "-20px", "Ensure negative left values work." );
} );

QUnit.test( "css(Array)", function( assert ) {
	assert.expect( 2 );

	var expectedMany = {
			"overflow": "visible",
			"width": "16px"
		},
		expectedSingle = {
			"width": "16px"
		},
		elem = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" );

	assert.deepEqual( elem.css( expectedMany ).css( [ "overflow", "width" ] ), expectedMany, "Getting multiple element array" );
	assert.deepEqual( elem.css( expectedSingle ).css( [ "width" ] ), expectedSingle, "Getting single element array" );
} );

QUnit.test( "css(String, Function)", function( assert ) {
	assert.expect( 3 );

	var index,
		sizes = [ "10px", "20px", "30px" ];

	jQuery( "<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				"<div class='cssFunction'></div>" +
				"<div class='cssFunction'></div></div>" )
		.appendTo( "body" );

	index = 0;

	jQuery( "#cssFunctionTest div" ).css( "font-size", function() {
		var size = sizes[ index ];
		index++;
		return size;
	} );

	index = 0;

	jQuery( "#cssFunctionTest div" ).each( function() {
		var computedSize = jQuery( this ).css( "font-size" ),
			expectedSize = sizes[ index ];
		assert.equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
	} );

	jQuery( "#cssFunctionTest" ).remove();
} );

QUnit.test( "css(String, Function) with incoming value", function( assert ) {
	assert.expect( 3 );

	var index,
		sizes = [ "10px", "20px", "30px" ];

	jQuery( "<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				"<div class='cssFunction'></div>" +
				"<div class='cssFunction'></div></div>" )
		.appendTo( "body" );

	index = 0;

	jQuery( "#cssFunctionTest div" ).css( "font-size", function() {
		var size = sizes[ index ];
		index++;
		return size;
	} );

	index = 0;

	jQuery( "#cssFunctionTest div" ).css( "font-size", function( i, computedSize ) {
		var expectedSize = sizes[ index ];
		assert.equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
		return computedSize;
	} );

	jQuery( "#cssFunctionTest" ).remove();
} );

QUnit.test( "css(Object) where values are Functions", function( assert ) {
	assert.expect( 3 );

	var index,
		sizes = [ "10px", "20px", "30px" ];

	jQuery( "<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				"<div class='cssFunction'></div>" +
				"<div class='cssFunction'></div></div>" )
		.appendTo( "body" );

	index = 0;

	jQuery( "#cssFunctionTest div" ).css( { "fontSize": function() {
		var size = sizes[ index ];
		index++;
		return size;
	} } );

	index = 0;

	jQuery( "#cssFunctionTest div" ).each( function() {
		var computedSize = jQuery( this ).css( "font-size" ),
			expectedSize = sizes[ index ];
		assert.equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
	} );

	jQuery( "#cssFunctionTest" ).remove();
} );

QUnit.test( "css(Object) where values are Functions with incoming values", function( assert ) {
	assert.expect( 3 );

	var index,
		sizes = [ "10px", "20px", "30px" ];

	jQuery( "<div id='cssFunctionTest'><div class='cssFunction'></div>" +
				"<div class='cssFunction'></div>" +
				"<div class='cssFunction'></div></div>" )
		.appendTo( "body" );

	index = 0;

	jQuery( "#cssFunctionTest div" ).css( { "fontSize": function() {
		var size = sizes[ index ];
		index++;
		return size;
	} } );

	index = 0;

	jQuery( "#cssFunctionTest div" ).css( { "font-size": function( i, computedSize ) {
		var expectedSize = sizes[ index ];
		assert.equal( computedSize, expectedSize, "Div #" + index + " should be " + expectedSize );
		index++;
		return computedSize;
	} } );

	jQuery( "#cssFunctionTest" ).remove();
} );

QUnit.test( "show()", function( assert ) {

	assert.expect( 18 );

	var hiddendiv, div, pass, test;
		hiddendiv = jQuery( "div.hidden" );

	assert.equal( jQuery.css( hiddendiv[ 0 ], "display" ), "none", "hiddendiv is display: none" );

	hiddendiv.css( "display", "block" );
	assert.equal( jQuery.css( hiddendiv[ 0 ], "display" ), "block", "hiddendiv is display: block" );

	hiddendiv.show();
	assert.equal( jQuery.css( hiddendiv[ 0 ], "display" ), "block", "hiddendiv is display: block" );

	hiddendiv.css( "display", "" );

	pass = true;
	div = jQuery( "#qunit-fixture div" );
	div.show().each( function() {
		if ( this.style.display === "none" ) {
			pass = false;
		}
	} );
	assert.ok( pass, "Show" );

	jQuery(
		"<div id='show-tests'>" +
		"<div><p><a href='#'></a></p><code></code><pre></pre><span></span></div>" +
		"<table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table>" +
		"<ul><li></li></ul></div>"
	).appendTo( "#qunit-fixture" ).find( "*" ).css( "display", "none" );

	test = {
		"div": "block",
		"p": "block",
		"a": "inline",
		"code": "inline",
		"pre": "block",
		"span": "inline",
		"table": "table",
		"thead": "table-header-group",
		"tbody": "table-row-group",
		"tr": "table-row",
		"th": "table-cell",
		"td": "table-cell",
		"ul": "block",
		"li": "list-item"
	};

	jQuery.each( test, function( selector, expected ) {
		var elem = jQuery( selector, "#show-tests" ).show();
		assert.equal( elem.css( "display" ), expected, "Show using correct display type for " + selector );
	} );

	// Make sure that showing or hiding a text node doesn't cause an error
	jQuery( "<div>test</div> text <span>test</span>" ).show().remove();
	jQuery( "<div>test</div> text <span>test</span>" ).hide().remove();
} );

QUnit.test( "show/hide detached nodes", function( assert ) {
	assert.expect( 19 );

	var div, span, tr;

	div = jQuery( "<div>" ).hide();
	assert.equal( div.css( "display" ), "none", "hide() updates inline style of a detached div" );
	div.appendTo( "#qunit-fixture" );
	assert.equal( div.css( "display" ), "none",
		"A hidden-while-detached div is hidden after attachment" );
	div.show();
	assert.equal( div.css( "display" ), "block",
		"A hidden-while-detached div can be shown after attachment" );

	div = jQuery( "<div class='hidden'>" );
	div.show().appendTo( "#qunit-fixture" );
	assert.equal( div.css( "display" ), "none",
		"A shown-while-detached div can be hidden by the CSS cascade" );

	div = jQuery( "<div><div class='hidden'></div></div>" ).children( "div" );
	div.show().appendTo( "#qunit-fixture" );
	assert.equal( div.css( "display" ), "none",
		"A shown-while-detached div inside a visible div can be hidden by the CSS cascade" );

	span = jQuery( "<span class='hidden'></span>" );
	span.show().appendTo( "#qunit-fixture" );
	assert.equal( span.css( "display" ), "none",
		"A shown-while-detached span can be hidden by the CSS cascade" );

	div = jQuery( "div.hidden" );
	div.detach().show();
	assert.ok( !div[ 0 ].style.display,
		"show() does not update inline style of a cascade-hidden-before-detach div" );
	div.appendTo( "#qunit-fixture" );
	assert.equal( div.css( "display" ), "none",
		"A shown-while-detached cascade-hidden div is hidden after attachment" );
	div.remove();

	span = jQuery( "<span class='hidden'></span>" );
	span.appendTo( "#qunit-fixture" ).detach().show().appendTo( "#qunit-fixture" );
	assert.equal( span.css( "display" ), "none",
		"A shown-while-detached cascade-hidden span is hidden after attachment" );
	span.remove();

	div = jQuery( document.createElement( "div" ) );
	div.show().appendTo( "#qunit-fixture" );
	assert.ok( !div[ 0 ].style.display, "A shown-while-detached div has no inline style" );
	assert.equal( div.css( "display" ), "block",
		"A shown-while-detached div has default display after attachment" );
	div.remove();

	div = jQuery( "<div style='display: none'>" );
	div.show();
	assert.equal( div[ 0 ].style.display, "",
		"show() updates inline style of a detached inline-hidden div" );
	div.appendTo( "#qunit-fixture" );
	assert.equal( div.css( "display" ), "block",
		"A shown-while-detached inline-hidden div has default display after attachment" );

	div = jQuery( "<div><div style='display: none'></div></div>" ).children( "div" );
	div.show().appendTo( "#qunit-fixture" );
	assert.equal( div.css( "display" ), "block",
		"A shown-while-detached inline-hidden div inside a visible div has default display " +
		"after attachment" );

	span = jQuery( "<span style='display: none'></span>" );
	span.show();
	assert.equal( span[ 0 ].style.display, "",
		"show() updates inline style of a detached inline-hidden span" );
	span.appendTo( "#qunit-fixture" );
	assert.equal( span.css( "display" ), "inline",
		"A shown-while-detached inline-hidden span has default display after attachment" );

	div = jQuery( "<div style='display: inline'></div>" );
	div.show().appendTo( "#qunit-fixture" );
	assert.equal( div.css( "display" ), "inline",
		"show() does not update inline style of a detached inline-visible div" );
	div.remove();

	tr = jQuery( "<tr></tr>" );
	jQuery( "#table" ).append( tr );
	tr.detach().hide().show();

	assert.ok( !tr[ 0 ].style.display, "Not-hidden detached tr elements have no inline style" );
	tr.remove();

	span = jQuery( "<span></span>" ).hide().show();
	assert.ok( !span[ 0 ].style.display, "Not-hidden detached span elements have no inline style" );
	span.remove();
} );

QUnit.test( "show/hide shadow child nodes", function( assert ) {
	assert.expect( 28 );
	jQuery( "<div id='shadowHost'></div>" ).appendTo( "#qunit-fixture" );
	var shadowHost = document.querySelector( "#shadowHost" );
	var shadowRoot = shadowHost.attachShadow( { mode: "open" } );
	shadowRoot.innerHTML = "" +
		"<style>.hidden{display: none;}</style>" +
		"<div class='hidden' id='shadowdiv'>" +
		"	<p class='hidden' id='shadowp'>" +
		"		<a href='#' class='hidden' id='shadowa'></a>" +
		"	</p>" +
		"	<code class='hidden' id='shadowcode'></code>" +
		"	<pre class='hidden' id='shadowpre'></pre>" +
		"	<span class='hidden' id='shadowspan'></span>" +
		"</div>" +
		"<table class='hidden' id='shadowtable'>" +
		"	<thead class='hidden' id='shadowthead'>" +
		"		<tr class='hidden' id='shadowtr'>" +
		"			<th class='hidden' id='shadowth'></th>" +
		"		</tr>" +
		"	</thead>" +
		"	<tbody class='hidden' id='shadowtbody'>" +
		"		<tr class='hidden'>" +
		"			<td class='hidden' id='shadowtd'></td>" +
		"		</tr>" +
		"	</tbody>" +
		"</table>" +
		"<ul class='hidden' id='shadowul'>" +
		"	<li class='hidden' id='shadowli'></li>" +
		"</ul>";

	var test = {
		"div": "block",
		"p": "block",
		"a": "inline",
		"code": "inline",
		"pre": "block",
		"span": "inline",
		"table": "table",
		"thead": "table-header-group",
		"tbody": "table-row-group",
		"tr": "table-row",
		"th": "table-cell",
		"td": "table-cell",
		"ul": "block",
		"li": "list-item"
	};

	jQuery.each( test, function( selector, expected ) {
		var shadowChild = shadowRoot.querySelector( "#shadow" + selector );
		var $shadowChild = jQuery( shadowChild );
		assert.strictEqual( $shadowChild.css( "display" ), "none", "is hidden" );
		$shadowChild.show();
		assert.strictEqual( $shadowChild.css( "display" ), expected, "Show using correct display type for " + selector );
	} );
} );

QUnit.test( "hide hidden elements (bug trac-7141)", function( assert ) {
	assert.expect( 3 );

	var div = jQuery( "<div style='display:none'></div>" ).appendTo( "#qunit-fixture" );
	assert.equal( div.css( "display" ), "none", "Element is hidden by default" );
	div.hide();
	assert.ok( !jQuery._data( div, "olddisplay" ), "olddisplay is undefined after hiding an already-hidden element" );
	div.show();
	assert.equal( div.css( "display" ), "block", "Show a double-hidden element" );

	div.remove();
} );

QUnit.test( "show() after hide() should always set display to initial value (trac-14750)", function( assert ) {
	assert.expect( 1 );

	var div = jQuery( "<div></div>" ),
		fixture = jQuery( "#qunit-fixture" );

	fixture.append( div );

	div.css( "display", "inline" ).hide().show().css( "display", "list-item" ).hide().show();
	assert.equal( div.css( "display" ), "list-item", "should get last set display value" );
} );

QUnit.test( "show/hide 3.0, default display", function( assert ) {

	assert.expect( 36 );

	var i,
		$elems = jQuery( "<div></div>" )
			.appendTo( "#qunit-fixture" )
			.html( "<div data-expected-display='block'></div>" +
				"<span data-expected-display='inline'></span>" +
				"<ul><li data-expected-display='list-item'></li></ul>" )
			.find( "[data-expected-display]" );

	$elems.each( function() {
		var $elem = jQuery( this ),
			name = this.nodeName,
			expected = this.getAttribute( "data-expected-display" ),
			sequence = [];

		if ( this.className ) {
			name += "." + this.className;
		}
		if ( this.getAttribute( "style" ) ) {
			name += "[style='" + this.getAttribute( "style" ) + "']";
		}
		name += " ";

		for ( i = 0; i < 3; i++ ) {
			sequence.push( ".show()" );
			$elem.show();
			assert.equal( $elem.css( "display" ), expected,
				name + sequence.join( "" ) + " computed" );
			assert.equal( this.style.display, "", name + sequence.join( "" ) + " inline" );

			sequence.push( ".hide()" );
			$elem.hide();
			assert.equal( $elem.css( "display" ), "none",
				name + sequence.join( "" ) + " computed" );
			assert.equal( this.style.display, "none", name + sequence.join( "" ) + " inline" );
		}
	} );
} );

QUnit.test( "show/hide 3.0, default body display", function( assert ) {

	assert.expect( 2 );

	var hideBody = supportjQuery( "<style>body{display:none}</style>" ).appendTo( document.head ),
		body = jQuery( document.body );

	assert.equal( body.css( "display" ), "none", "Correct initial display" );

	body.show();

	assert.equal( body.css( "display" ), "block", "Correct display after .show()" );

	hideBody.remove();
} );

QUnit.test( "show/hide 3.0, cascade display", function( assert ) {

	assert.expect( 36 );

	var i,
		$elems = jQuery( "<div></div>" )
			.appendTo( "#qunit-fixture" )
			.html( "<span class='block'></span><div class='inline'></div><div class='list-item'></div>" )
			.children();

	$elems.each( function() {
		var $elem = jQuery( this ),
			name = this.nodeName,
			sequence = [];

		if ( this.className ) {
			name += "." + this.className;
		}
		if ( this.getAttribute( "style" ) ) {
			name += "[style='" + this.getAttribute( "style" ) + "']";
		}
		name += " ";

		for ( i = 0; i < 3; i++ ) {
			sequence.push( ".show()" );
			$elem.show();
			assert.equal( $elem.css( "display" ), this.className,
				name + sequence.join( "" ) + " computed" );
			assert.equal( this.style.display, "", name + sequence.join( "" ) + " inline" );

			sequence.push( ".hide()" );
			$elem.hide();
			assert.equal( $elem.css( "display" ), "none",
				name + sequence.join( "" ) + " computed" );
			assert.equal( this.style.display, "none", name + sequence.join( "" ) + " inline" );
		}
	} );
} );

QUnit.test( "show/hide 3.0, inline display", function( assert ) {

	assert.expect( 96 );

	var i,
		$elems = jQuery( "<div></div>" )
			.appendTo( "#qunit-fixture" )
			.html( "<span data-expected-display='block' style='display:block'></span>" +
				"<span class='list-item' data-expected-display='block' style='display:block'></span>" +
				"<div data-expected-display='inline' style='display:inline'></div>" +
				"<div class='list-item' data-expected-display='inline' style='display:inline'></div>" +
				"<ul>" +
					"<li data-expected-display='block' style='display:block'></li>" +
					"<li class='inline' data-expected-display='block' style='display:block'></li>" +
					"<li data-expected-display='inline' style='display:inline'></li>" +
					"<li class='block' data-expected-display='inline' style='display:inline'></li>" +
				"</ul>" )
			.find( "[data-expected-display]" );

	$elems.each( function() {
		var $elem = jQuery( this ),
			name = this.nodeName,
			expected = this.getAttribute( "data-expected-display" ),
			sequence = [];

		if ( this.className ) {
			name += "." + this.className;
		}
		if ( this.getAttribute( "style" ) ) {
			name += "[style='" + this.getAttribute( "style" ) + "']";
		}
		name += " ";

		for ( i = 0; i < 3; i++ ) {
			sequence.push( ".show()" );
			$elem.show();
			assert.equal( $elem.css( "display" ), expected,
				name + sequence.join( "" ) + " computed" );
			assert.equal( this.style.display, expected, name + sequence.join( "" ) + " inline" );

			sequence.push( ".hide()" );
			$elem.hide();
			assert.equal( $elem.css( "display" ), "none",
				name + sequence.join( "" ) + " computed" );
			assert.equal( this.style.display, "none", name + sequence.join( "" ) + " inline" );
		}
	} );
} );

QUnit.test( "show/hide 3.0, cascade hidden", function( assert ) {

	assert.expect( 72 );

	var i,
		$elems = jQuery( "<div></div>" )
			.appendTo( "#qunit-fixture" )
			.html( "<div class='hidden' data-expected-display='block'></div>" +
				"<div class='hidden' data-expected-display='block' style='display:none'></div>" +
				"<span class='hidden' data-expected-display='inline'></span>" +
				"<span class='hidden' data-expected-display='inline' style='display:none'></span>" +
				"<ul>" +
					"<li class='hidden' data-expected-display='list-item'></li>" +
					"<li class='hidden' data-expected-display='list-item' style='display:none'></li>" +
				"</ul>" )
			.find( "[data-expected-display]" );

	$elems.each( function() {
		var $elem = jQuery( this ),
			name = this.nodeName,
			expected = this.getAttribute( "data-expected-display" ),
			sequence = [];

		if ( this.className ) {
			name += "." + this.className;
		}
		if ( this.getAttribute( "style" ) ) {
			name += "[style='" + this.getAttribute( "style" ) + "']";
		}
		name += " ";

		for ( i = 0; i < 3; i++ ) {
			sequence.push( ".hide()" );
			$elem.hide();
			assert.equal( $elem.css( "display" ), "none",
				name + sequence.join( "" ) + " computed" );
			assert.equal( this.style.display, "none", name + sequence.join( "" ) + " inline" );

			sequence.push( ".show()" );
			$elem.show();
			assert.equal( $elem.css( "display" ), expected,
				name + sequence.join( "" ) + " computed" );
			assert.equal( this.style.display, expected, name + sequence.join( "" ) + " inline" );
		}
	} );
} );

QUnit.test( "show/hide 3.0, inline hidden", function( assert ) {

	assert.expect( 84 );

	var i,
		$elems = jQuery( "<div></div>" )
			.appendTo( "#qunit-fixture" )
			.html( "<span data-expected-display='inline' style='display:none'></span>" +
				"<span class='list-item' data-expected-display='list-item' style='display:none'></span>" +
				"<div data-expected-display='block' style='display:none'></div>" +
				"<div class='list-item' data-expected-display='list-item' style='display:none'></div>" +
				"<ul>" +
					"<li data-expected-display='list-item' style='display:none'></li>" +
					"<li class='block' data-expected-display='block' style='display:none'></li>" +
					"<li class='inline' data-expected-display='inline' style='display:none'></li>" +
				"</ul>" )
			.find( "[data-expected-display]" );

	$elems.each( function() {
		var $elem = jQuery( this ),
			name = this.nodeName,
			expected = this.getAttribute( "data-expected-display" ),
			sequence = [];

		if ( this.className ) {
			name += "." + this.className;
		}
		if ( this.getAttribute( "style" ) ) {
			name += "[style='" + this.getAttribute( "style" ) + "']";
		}
		name += " ";

		for ( i = 0; i < 3; i++ ) {
			sequence.push( ".hide()" );
			$elem.hide();
			assert.equal( $elem.css( "display" ), "none",
				name + sequence.join( "" ) + " computed" );
			assert.equal( this.style.display, "none", name + sequence.join( "" ) + " inline" );

			sequence.push( ".show()" );
			$elem.show();
			assert.equal( $elem.css( "display" ), expected,
				name + sequence.join( "" ) + " computed" );
			assert.equal( this.style.display, "", name + sequence.join( "" ) + " inline" );
		}
	} );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "toggle()", function( assert ) {
	assert.expect( 9 );
	var div, oldHide,
		x = jQuery( "#foo" );

	assert.ok( x.is( ":visible" ), "is visible" );
	x.toggle();
	assert.ok( x.is( ":hidden" ), "is hidden" );
	x.toggle();
	assert.ok( x.is( ":visible" ), "is visible again" );

	x.toggle( true );
	assert.ok( x.is( ":visible" ), "is visible" );
	x.toggle( false );
	assert.ok( x.is( ":hidden" ), "is hidden" );
	x.toggle( true );
	assert.ok( x.is( ":visible" ), "is visible again" );

	div = jQuery( "<div style='display:none'><div></div></div>" ).appendTo( "#qunit-fixture" );
	x = div.find( "div" );
	assert.strictEqual( x.toggle().css( "display" ), "none", "is hidden" );
	assert.strictEqual( x.toggle().css( "display" ), "block", "is visible" );

	// Ensure hide() is called when toggled (trac-12148)
	oldHide = jQuery.fn.hide;
	jQuery.fn.hide = function() {
		assert.ok( true, name + " method called on toggle" );
		return oldHide.apply( this, arguments );
	};
	x.toggle( name === "show" );
	jQuery.fn.hide = oldHide;
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "detached toggle()", function( assert ) {
	assert.expect( 6 );
	var detached = jQuery( "<p><a></a><p>" ).find( "*" ).addBack(),
		hiddenDetached = jQuery( "<p><a></a></p>" ).find( "*" ).addBack().css( "display", "none" ),
		cascadeHiddenDetached = jQuery( "<p><a></a></p>" ).find( "*" ).addBack().addClass( "hidden" );

	detached.toggle();
	detached.appendTo( "#qunit-fixture" );
	assert.equal( detached[ 0 ].style.display, "none", "detached element" );
	assert.equal( detached[ 1 ].style.display, "none", "element in detached tree" );

	hiddenDetached.toggle();
	hiddenDetached.appendTo( "#qunit-fixture" );
	assert.equal( hiddenDetached[ 0 ].style.display, "", "detached, hidden element" );
	assert.equal( hiddenDetached[ 1 ].style.display, "", "hidden element in detached tree" );

	cascadeHiddenDetached.toggle();
	cascadeHiddenDetached.appendTo( "#qunit-fixture" );
	assert.equal( cascadeHiddenDetached[ 0 ].style.display, "none",
		"detached, cascade-hidden element" );
	assert.equal( cascadeHiddenDetached[ 1 ].style.display, "none",
		"cascade-hidden element in detached tree" );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ](
	"shadow toggle()", function( assert ) {

	assert.expect( 4 );

	jQuery( "<div id='shadowHost'></div>" ).appendTo( "#qunit-fixture" );
	var shadowHost = document.querySelector( "#shadowHost" );
	var shadowRoot = shadowHost.attachShadow( { mode: "open" } );
	shadowRoot.innerHTML = "" +
		"<style>.hidden{display: none;}</style>" +
		"<div id='shadowHiddenChild' class='hidden'></div>" +
		"<div id='shadowChild'></div>";
	var shadowChild = shadowRoot.querySelector( "#shadowChild" );
	var shadowHiddenChild = shadowRoot.querySelector( "#shadowHiddenChild" );

	var $shadowChild = jQuery( shadowChild );
	assert.strictEqual( $shadowChild.css( "display" ), "block", "is visible" );
	$shadowChild.toggle();
	assert.strictEqual( $shadowChild.css( "display" ), "none", "is hidden" );

	$shadowChild = jQuery( shadowHiddenChild );
	assert.strictEqual( $shadowChild.css( "display" ), "none", "is hidden" );
	$shadowChild.toggle();
	assert.strictEqual( $shadowChild.css( "display" ), "block", "is visible" );
} );

QUnit.test( "jQuery.css(elem, 'height') doesn't clear radio buttons (bug trac-1095)", function( assert ) {
	assert.expect( 4 );

	var $checkedtest = jQuery( "#checkedtest" );
	jQuery.css( $checkedtest[ 0 ], "height" );

	assert.ok( jQuery( "input[type='radio']", $checkedtest ).first().attr( "checked" ), "Check first radio still checked." );
	assert.ok( !jQuery( "input[type='radio']", $checkedtest ).last().attr( "checked" ), "Check last radio still NOT checked." );
	assert.ok( jQuery( "input[type='checkbox']", $checkedtest ).first().attr( "checked" ), "Check first checkbox still checked." );
	assert.ok( !jQuery( "input[type='checkbox']", $checkedtest ).last().attr( "checked" ), "Check last checkbox still NOT checked." );
} );

QUnit.test( "internal ref to elem.runtimeStyle (bug trac-7608)", function( assert ) {
	assert.expect( 1 );
	var result = true;

	try {
		jQuery( "#foo" ).css( { "width": "0%" } ).css( "width" );
	} catch ( e ) {
		result = false;
	}

	assert.ok( result, "elem.runtimeStyle does not throw exception" );
} );

QUnit.test( "computed margins (trac-3333; gh-2237)", function( assert ) {
	assert.expect( 2 );

	var $div = jQuery( "#foo" ),
		$child = jQuery( "#en" );

	$div.css( {
		"width": "1px",
		"marginRight": 0
	} );
	assert.equal( $div.css( "marginRight" ), "0px",
		"marginRight correctly calculated with a width and display block" );

	$div.css( {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100px"
	} );
	$child.css( {
		width: "50px",
		margin: "auto"
	} );
	assert.equal( $child.css( "marginLeft" ), "25px", "auto margins are computed to pixels" );
} );

QUnit.test( "box model properties incorrectly returning % instead of px, see trac-10639 and trac-12088", function( assert ) {
	assert.expect( 2 );

	var container = jQuery( "<div></div>" ).width( 400 ).appendTo( "#qunit-fixture" ),
		el = jQuery( "<div></div>" ).css( { "width": "50%", "marginRight": "50%" } ).appendTo( container ),
		el2 = jQuery( "<div></div>" ).css( { "width": "50%", "minWidth": "300px", "marginLeft": "25%" } ).appendTo( container );

	assert.equal( el.css( "marginRight" ), "200px", "css('marginRight') returning % instead of px, see trac-10639" );
	assert.equal( el2.css( "marginLeft" ), "100px", "css('marginLeft') returning incorrect pixel value, see trac-12088" );
} );

QUnit.test( "widows & orphans trac-8936", function( assert ) {

	var $p = jQuery( "<p>" ).appendTo( "#qunit-fixture" );

	assert.expect( 2 );

	$p.css( {
		"widows": 3,
		"orphans": 3
	} );

	assert.equal( $p.css( "widows" ) || jQuery.style( $p[ 0 ], "widows" ), 3, "widows correctly set to 3" );
	assert.equal( $p.css( "orphans" ) || jQuery.style( $p[ 0 ], "orphans" ), 3, "orphans correctly set to 3" );

	$p.remove();
} );

QUnit.test( "can't get css for disconnected in IE<9, see trac-10254 and trac-8388", function( assert ) {
	assert.expect( 2 );
	var span, div;

	span = jQuery( "<span></span>" ).css( "background-image", "url(" + baseURL + "1x1.jpg)" );
	assert.notEqual( span.css( "background-image" ), null, "can't get background-image in IE<9, see trac-10254" );

	div = jQuery( "<div></div>" ).css( "top", 10 );
	assert.equal( div.css( "top" ), "10px", "can't get top in IE<9, see trac-8388" );
} );

QUnit.test( "Ensure styles are retrieving from parsed html on document fragments", function( assert ) {
	assert.expect( 1 );

	var $span = jQuery(
		jQuery.parseHTML( "<span style=\"font-family: Cuprum,sans-serif; font-size: 14px; color: #999999;\">some text</span>" )
	);

	assert.equal( $span.css( "font-size" ), "14px", "Font-size retrievable on parsed HTML node" );
} );

QUnit.test( "can't get background-position in IE<9, see trac-10796", function( assert ) {
	var div = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" ),
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

	assert.expect( l );

	for ( ; i < l; i++ ) {
		div.css( "background-position", units [ i ] );
		assert.ok( div.css( "background-position" ), "can't get background-position in IE<9, see trac-10796" );
	}
} );

if ( includesModule( "offset" ) ) {
	QUnit.test( "percentage properties for left and top should be transformed to pixels, see trac-9505", function( assert ) {
		assert.expect( 2 );
		var parent = jQuery( "<div style='position:relative;width:200px;height:200px;margin:0;padding:0;border-width:0'></div>" ).appendTo( "#qunit-fixture" ),
			div = jQuery( "<div style='position: absolute; width: 20px; height: 20px; top:50%; left:50%'></div>" ).appendTo( parent );

		assert.equal( div.css( "top" ), "100px", "position properties not transformed to pixels, see trac-9505" );
		assert.equal( div.css( "left" ), "100px", "position properties not transformed to pixels, see trac-9505" );
	} );
}

QUnit.test( "Do not append px (trac-9548, trac-12990, gh-2792)", function( assert ) {
	assert.expect( 4 );

	var $div = jQuery( "<div>" ).appendTo( "#qunit-fixture" );

	$div.css( "fill-opacity", 1 );
	assert.equal( $div.css( "fill-opacity" ), 1, "Do not append px to 'fill-opacity'" );

	$div.css( "font-size", "27px" );
	$div.css( "line-height", 2 );
	assert.equal( $div.css( "line-height" ), "54px", "Do not append px to 'line-height'" );

	$div.css( "column-count", 1 );
	if ( $div.css( "column-count" ) !== undefined ) {
		assert.equal( $div.css( "column-count" ), 1, "Do not append px to 'column-count'" );
	} else {
		assert.ok( true, "No support for column-count CSS property" );
	}

	$div.css( "animation-iteration-count", 2 );
	if ( $div.css( "animation-iteration-count" ) !== undefined ) {

		// if $div.css( "animation-iteration-count" ) return "1",
		// it actually return the default value of animation-iteration-count
		assert.equal( $div.css( "animation-iteration-count" ), 2, "Do not append px to 'animation-iteration-count'" );
	} else {
		assert.ok( true, "No support for animation-iteration-count CSS property" );
	}
} );


QUnit.test( "Do not append px to CSS Grid-related properties (gh-4007)",
	function( assert ) {

	assert.expect( 12 );

	var prop, value, subProp, subValue, $div,
		gridProps = {
			"grid-area": {
				"grid-row-start": "2",
				"grid-row-end": "auto",
				"grid-column-start": "auto",
				"grid-column-end": "auto"
			},
			"grid-column": {
				"grid-column-start": "2",
				"grid-column-end": "auto"
			},
			"grid-column-end": true,
			"grid-column-start": true,
			"grid-row": {
				"grid-row-start": "2",
				"grid-row-end": "auto"
			},
			"grid-row-end": true,
			"grid-row-start": true
		};

	for ( prop in gridProps ) {
		$div = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" );
		$div.css( prop, 2 );

		value = gridProps[ prop ];

		if ( typeof value === "object" ) {
			for ( subProp in value ) {
				subValue = value[ subProp ];
				assert.equal( $div.css( subProp ), subValue,
					"Do not append px to '" + prop + "' (retrieved " + subProp + ")" );
			}
		} else {
			assert.equal( $div.css( prop ), "2", "Do not append px to '" + prop + "'" );
		}

		$div.remove();
	}
} );

QUnit.test( "Do not append px to most properties not accepting integer values", function( assert ) {
	assert.expect( 3 );

	var $div = jQuery( "<div>" ).appendTo( "#qunit-fixture" );

	$div.css( "font-size", "27px" );

	$div.css( "font-size", 2 );
	assert.equal( $div.css( "font-size" ), "27px", "Do not append px to 'font-size'" );

	$div.css( "fontSize", 2 );
	assert.equal( $div.css( "fontSize" ), "27px", "Do not append px to 'fontSize'" );

	$div.css( "letter-spacing", "2px" );
	$div.css( "letter-spacing", 3 );
	assert.equal( $div.css( "letter-spacing" ), "2px", "Do not append px to 'letter-spacing'" );
} );

QUnit.test( "Append px to allowlisted properties", function( assert ) {
	var prop,
		$div = jQuery( "<div>" ).appendTo( "#qunit-fixture" ),
		allowlist = {
			margin: "marginTop",
			marginTop: undefined,
			marginRight: undefined,
			marginBottom: undefined,
			marginLeft: undefined,
			padding: "paddingTop",
			paddingTop: undefined,
			paddingRight: undefined,
			paddingBottom: undefined,
			paddingLeft: undefined,
			top: undefined,
			right: undefined,
			bottom: undefined,
			left: undefined,
			width: undefined,
			height: undefined,
			minWidth: undefined,
			minHeight: undefined,
			maxWidth: undefined,
			maxHeight: undefined,
			border: "borderTopWidth",
			borderWidth: "borderTopWidth",
			borderTop: "borderTopWidth",
			borderTopWidth: undefined,
			borderRight: "borderRightWidth",
			borderRightWidth: undefined,
			borderBottom: "borderBottomWidth",
			borderBottomWidth: undefined,
			borderLeft: "borderLeftWidth",
			borderLeftWidth: undefined
		};

	assert.expect( ( Object.keys( allowlist ).length ) * 2 );

	for ( prop in allowlist ) {
		var propToCheck = allowlist[ prop ] || prop,
			kebabProp = prop.replace( /[A-Z]/g, function( match ) {
				return "-" + match.toLowerCase();
			} ),
			kebabPropToCheck = propToCheck.replace( /[A-Z]/g, function( match ) {
				return "-" + match.toLowerCase();
			} );
		$div.css( prop, 3 )
			.css( "position", "absolute" )
			.css( "border-style", "solid" );
		assert.equal( $div.css( propToCheck ), "3px", "Append px to '" + prop + "'" );
		$div.css( kebabProp, 3 )
			.css( "position", "absolute" )
			.css( "border-style", "solid" );
		assert.equal( $div.css( kebabPropToCheck ), "3px", "Append px to '" + kebabProp + "'" );
	}
} );

QUnit.test( "css('width') and css('height') should respect box-sizing, see trac-11004", function( assert ) {
	assert.expect( 4 );

	var el_dis = jQuery( "<div style='width:300px;height:300px;margin:2px;padding:2px;box-sizing:border-box;'>test</div>" ),
		el = el_dis.clone().appendTo( "#qunit-fixture" );

	assert.equal( el.css( "width" ), el.css( "width", el.css( "width" ) ).css( "width" ), "css('width') is not respecting box-sizing, see trac-11004" );
	assert.equal( el_dis.css( "width" ), el_dis.css( "width", el_dis.css( "width" ) ).css( "width" ), "css('width') is not respecting box-sizing for disconnected element, see trac-11004" );
	assert.equal( el.css( "height" ), el.css( "height", el.css( "height" ) ).css( "height" ), "css('height') is not respecting box-sizing, see trac-11004" );
	assert.equal( el_dis.css( "height" ), el_dis.css( "height", el_dis.css( "height" ) ).css( "height" ), "css('height') is not respecting box-sizing for disconnected element, see trac-11004" );
} );

QUnit.test( "table rows width/height should be unaffected by inline styles", function( assert ) {
	assert.expect( 2 );

	var table = jQuery(
		"<table>\n" +
		"  <tr id=\"row\" style=\"height: 1px; width: 1px;\">\n" +
		"    <td>\n" +
		"      <div style=\"height: 100px; width: 100px;\"></div>\n" +
		"    </div>\n" +
		"  </tr>\n" +
		"</table>"
	);
	var tr = table.find( "tr" );

	table.appendTo( "#qunit-fixture" );

	assert.ok( parseInt( tr.css( "width" ) ) > 10, "tr width unaffected by inline style" );
	assert.ok( parseInt( tr.css( "height" ) ) > 10, "tr height unaffected by inline style" );
} );

testIframe(
	"css('width') should work correctly before document ready (trac-14084)",
	"css/cssWidthBeforeDocReady.html",
	function( assert, jQuery, window, document, cssWidthBeforeDocReady ) {
		assert.expect( 1 );
		assert.strictEqual( cssWidthBeforeDocReady, "100px", "elem.css('width') works correctly before document ready" );
	}
);

testIframe(
	"css('width') should work correctly with browser zooming",
	"css/cssWidthBrowserZoom.html",
	function( assert, jQuery, window, document, widthBeforeSet, widthAfterSet ) {
		assert.expect( 2 );

		// Support: Firefox 126 - 135+
		// Newer Firefox implements CSS zoom in a way it affects
		// those values slightly.
		assert.ok( /^100(?:|\.0\d*)px$/.test( widthBeforeSet ), "elem.css('width') works correctly with browser zoom" );
		assert.ok( /^100(?:|\.0\d*)px$/.test( widthAfterSet ), "elem.css('width', val) works correctly with browser zoom" );
	}
);

( function() {
	var supportsFractionalTrWidth,
		epsilon = 0.1,
		table = jQuery( "<table><tr></tr></table>" ),
		tr = table.find( "tr" );

	table
		.appendTo( "#qunit-fixture" )
		.css( {
			width: "100.7px",
			borderSpacing: 0
		} );

	supportsFractionalTrWidth = Math.abs( tr.width() - 100.7 ) < epsilon;

	testIframe(
		"Test computeStyleTests for hidden iframe",
		"css/cssComputeStyleTests.html",
		function( assert, jQuery, window, document, initialHeight ) {
			assert.expect( 3 );

			assert.strictEqual( initialHeight === 0 ? 20 : initialHeight, 20,
				"hidden-frame content sizes should be zero or accurate" );

			window.parent.jQuery( "#qunit-fixture-iframe" ).css( { "display": "block" } );
			jQuery( "#test" ).width( 600 );
			assert.strictEqual( jQuery( "#test" ).width(), 600, "width should be 600" );

			if ( supportsFractionalTrWidth ) {
				assert.ok(
					Math.abs( jQuery( "#test-tr" ).width() - 100.7 ) < epsilon,
					"tr width should be fractional" );
			} else {
				assert.strictEqual( jQuery( "#test-tr" ).width(), 101, "tr width as expected" );
			}
		},
		undefined,
		{ "display": "none" }
	);
} )();

QUnit.test( "css('width') and css('height') should return fractional values for nodes in the document", function( assert ) {
	assert.expect( 2 );

	var el = jQuery( "<div class='test-div'></div>" ).appendTo( "#qunit-fixture" );
	jQuery( "<style>.test-div { width: 33.3px; height: 88.8px; }</style>" ).appendTo( "#qunit-fixture" );

	assert.equal( Number( el.css( "width" ).replace( /px$/, "" ) ).toFixed( 1 ), "33.3",
		"css('width') should return fractional values" );
	assert.equal( Number( el.css( "height" ).replace( /px$/, "" ) ).toFixed( 1 ), "88.8",
		"css('height') should return fractional values" );
} );

QUnit.test( "css('width') and css('height') should return fractional values for disconnected nodes", function( assert ) {
	assert.expect( 2 );

	var el = jQuery( "<div style='width: 33.3px; height: 88.8px;'></div>" );

	assert.equal( Number( el.css( "width" ).replace( /px$/, "" ) ).toFixed( 1 ), "33.3",
		"css('width') should return fractional values" );
	assert.equal( Number( el.css( "height" ).replace( /px$/, "" ) ).toFixed( 1 ), "88.8",
		"css('height') should return fractional values" );
} );

QUnit.test( "certain css values of 'normal' should be convertible to a number, see trac-8627", function( assert ) {
	assert.expect( 3 );

	var el = jQuery( "<div style='letter-spacing:normal;font-weight:normal;'>test</div>" ).appendTo( "#qunit-fixture" );

	assert.ok( !isNaN( parseFloat( el.css( "letterSpacing" ) ) ), "css('letterSpacing') not convertible to number, see trac-8627" );
	assert.ok( !isNaN( parseFloat( el.css( "fontWeight" ) ) ), "css('fontWeight') not convertible to number, see trac-8627" );
	assert.equal( typeof el.css( "fontWeight" ), "string", ".css() returns a string" );
} );

QUnit.test( "cssHooks - expand", function( assert ) {
	assert.expect( 15 );
	var result,
		properties = {
			margin: [ "marginTop", "marginRight", "marginBottom", "marginLeft" ],
			borderWidth: [ "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth" ],
			padding: [ "paddingTop", "paddingRight", "paddingBottom", "paddingLeft" ]
		};

	jQuery.each( properties, function( property, keys ) {
		var hook = jQuery.cssHooks[ property ],
			expected = {};
		jQuery.each( keys, function( _, key ) {
			expected[ key ] = 10;
		} );
		result = hook.expand( 10 );
		assert.deepEqual( result, expected, property + " expands properly with a number" );

		jQuery.each( keys, function( _, key ) {
			expected[ key ] = "10px";
		} );
		result = hook.expand( "10px" );
		assert.deepEqual( result, expected, property + " expands properly with '10px'" );

		expected[ keys[ 1 ] ] = expected[ keys[ 3 ] ] = "20px";
		result = hook.expand( "10px 20px" );
		assert.deepEqual( result, expected, property + " expands properly with '10px 20px'" );

		expected[ keys[ 2 ] ] = "30px";
		result = hook.expand( "10px 20px 30px" );
		assert.deepEqual( result, expected, property + " expands properly with '10px 20px 30px'" );

		expected[ keys[ 3 ] ] = "40px";
		result = hook.expand( "10px 20px 30px 40px" );
		assert.deepEqual( result, expected, property + " expands properly with '10px 20px 30px 40px'" );

	} );

} );

QUnit.test( "css opacity consistency across browsers (trac-12685)", function( assert ) {
	assert.expect( 3 );

	var el,
		fixture = jQuery( "#qunit-fixture" );

	// Append style element
	jQuery( "<style>.opacity_t12685 { opacity: 0.1; }</style>" ).appendTo( fixture );

	el = jQuery( "<div class='opacity_t12685'></div>" ).appendTo( fixture );

	assert.equal( Math.round( el.css( "opacity" ) * 100 ), 10, "opacity from style sheet" );
	el.css( "opacity", 0.3 );
	assert.equal( Math.round( el.css( "opacity" ) * 100 ), 30, "override opacity" );
	el.css( "opacity", "" );
	assert.equal( Math.round( el.css( "opacity" ) * 100 ), 10, "remove opacity override" );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( ":visible/:hidden selectors", function( assert ) {
	assert.expect( 18 );

	var $div, $table, $a, $br;

	assert.ok( jQuery( "#nothiddendiv" ).is( ":visible" ), "Modifying CSS display: Assert element is visible" );
	jQuery( "#nothiddendiv" ).css( { display: "none" } );
	assert.ok( !jQuery( "#nothiddendiv" ).is( ":visible" ), "Modified CSS display: Assert element is hidden" );
	jQuery( "#nothiddendiv" ).css( { "display": "block" } );
	assert.ok( jQuery( "#nothiddendiv" ).is( ":visible" ), "Modified CSS display: Assert element is visible" );
	assert.ok( !jQuery( window ).is( ":visible" ), "Calling is(':visible') on window does not throw an exception (trac-10267)." );
	assert.ok( !jQuery( document ).is( ":visible" ), "Calling is(':visible') on document does not throw an exception (trac-10267)." );

	assert.ok( jQuery( "#nothiddendiv" ).is( ":visible" ), "Modifying CSS display: Assert element is visible" );
	jQuery( "#nothiddendiv" ).css( "display", "none" );
	assert.ok( !jQuery( "#nothiddendiv" ).is( ":visible" ), "Modified CSS display: Assert element is hidden" );
	jQuery( "#nothiddendiv" ).css( "display", "block" );
	assert.ok( jQuery( "#nothiddendiv" ).is( ":visible" ), "Modified CSS display: Assert element is visible" );

	assert.ok( jQuery( "#siblingspan" ).is( ":visible" ), "Span with no content is visible" );
	$div = jQuery( "<div><span></span></div>" ).appendTo( "#qunit-fixture" );
	assert.equal( $div.find( ":visible" ).length, 1, "Span with no content is visible" );
	$div.css( { width: 0, height: 0, overflow: "hidden" } );
	assert.ok( $div.is( ":visible" ), "Div with width and height of 0 is still visible (gh-2227)" );

	$br = jQuery( "<br/>" ).appendTo( "#qunit-fixture" );
	assert.ok( $br.is( ":visible" ), "br element is visible" );

	$table = jQuery( "#table" );
	$table.html( "<tr><td style='display:none'>cell</td><td>cell</td></tr>" );
	assert.equal( jQuery( "#table td:visible" ).length, 1, "hidden cell is not perceived as visible (trac-4512). Works on table elements" );
	$table.css( "display", "none" ).html( "<tr><td>cell</td><td>cell</td></tr>" );
	assert.equal( jQuery( "#table td:visible" ).length, 0, "hidden cell children not perceived as visible (trac-4512)" );

	if ( QUnit.jQuerySelectorsPos ) {
		assert.t( "Is Visible", "#qunit-fixture div:visible:lt(2)", [ "foo", "nothiddendiv" ] );
	} else {
		assert.ok( "skip", "Positional selectors are not supported" );
	}

	assert.t( "Is Not Hidden", "#qunit-fixture:hidden", [] );
	assert.t( "Is Hidden", "#form input:hidden", [ "hidden1", "hidden2" ] );

	$a = jQuery( "<a href='#'><h1>Header</h1></a>" ).appendTo( "#qunit-fixture" );
	assert.ok( $a.is( ":visible" ), "Anchor tag with flow content is visible (gh-2227)" );
} );

QUnit.test( "Keep the last style if the new one isn't recognized by the browser (trac-14836)", function( assert ) {
	assert.expect( 1 );

	var el = jQuery( "<div></div>" ).css( "position", "absolute" ).css( "position", "fake value" );
	assert.equal( el.css( "position" ), "absolute", "The old style is kept when setting an unrecognized value" );
} );

QUnit.test(
	"Keep the last style if the new one is a non-empty whitespace (gh-3204)",
	function( assert ) {
	assert.expect( 1 );

	var el = jQuery( "<div></div>" ).css( "position", "absolute" ).css( "position", " " );
	assert.equal( el.css( "position" ), "absolute", "The old style is kept when setting to a space" );
} );

QUnit.test( "Reset the style if set to an empty string", function( assert ) {
	assert.expect( 1 );
	var el = jQuery( "<div></div>" ).css( "position", "absolute" ).css( "position", "" );

	// Some browsers return an empty string; others "static". Both those cases mean the style
	// was reset successfully so accept them both.
	assert.equal( el.css( "position" ) || "static", "static",
		"The style can be reset by setting to an empty string" );
} );

QUnit.test(
	"Clearing a Cloned Element's Style Shouldn't Clear the Original Element's Style (trac-8908)",
	function( assert ) {
		assert.expect( 24 );
		var done = assert.async();
		var styles = [ {
				name: "backgroundAttachment",
				value: [ "fixed" ]
			}, {
				name: "backgroundColor",
				value: [ "rgb(255, 0, 0)", "rgb(255,0,0)", "#ff0000" ]
			}, {

				// Firefox returns auto's value
				name: "backgroundImage",
				value: [ "url('test.png')", "url(" + baseURL + "test.png)", "url(\"" + baseURL + "test.png\")" ]
			}, {
				name: "backgroundPosition",
				value: [ "5% 5%" ]
			}, {

				// Firefox returns no-repeat
				name: "backgroundRepeat",
				value: [ "repeat-y" ]
			}, {
				name: "backgroundClip",
				value: [ "padding-box" ]
			}, {
				name: "backgroundOrigin",
				value: [ "content-box" ]
			}, {
				name: "backgroundSize",
				value: [ "80px 60px" ]
		} ];

		jQuery.each( styles, function( index, style ) {
			var $clone, $clonedChildren,
				$source = jQuery( "#firstp" ),
				source = $source[ 0 ],
				$children = $source.children();

			if ( source.style[ style.name ] === undefined ) {
				assert.ok( true, style.name +  ": style isn't supported and therefore not an issue" );
				assert.ok( true );

				return true;
			}

			$source.css( style.name, style.value[ 0 ] );
			$children.css( style.name, style.value[ 0 ] );

			$clone = $source.clone();
			$clonedChildren = $clone.children();

			$clone.css( style.name, "" );
			$clonedChildren.css( style.name, "" );

			window.setTimeout( function() {
				assert.notEqual( $clone.css( style.name ), style.value[ 0 ], "Cloned css was changed" );

				assert.ok( jQuery.inArray( $source.css( style.name ) !== -1, style.value ),
					"Clearing clone.css() doesn't affect source.css(): " + style.name +
					"; result: " + $source.css( style.name ) +
					"; expected: " + style.value.join( "," ) );

				assert.ok( jQuery.inArray( $children.css( style.name ) !== -1, style.value ),
					"Clearing clonedChildren.css() doesn't affect children.css(): " + style.name +
					"; result: " + $children.css( style.name ) +
					"; expected: " + style.value.join( "," ) );
			}, 100 );
		} );

		window.setTimeout( done, 1000 );
	}
);

QUnit.test( "Don't append px to CSS \"order\" value (trac-14049)", function( assert ) {
	assert.expect( 1 );

	var $elem = jQuery( "<div></div>" );

	$elem.css( "order", 2 );
	assert.equal( $elem.css( "order" ), "2", "2 on order" );
} );

QUnit.test( "Do not throw on frame elements from css method (trac-15098)", function( assert ) {
	assert.expect( 1 );

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
		assert.ok( true, "It didn't throw" );
	} catch ( _ ) {
		assert.ok( false, "It did throw" );
	}
} );

QUnit.test( "Don't default to a previously used wrong prefixed name (gh-2015)", function( assert ) {

	// Note: this test needs a property we know is only supported in a `-webkit`-prefixed version
	// by at least one of our main supported browsers. Past "obvious" choices like
	// `-webkit-appearance` or `-webkit-line-clamp` got their unprefixed versions so
	// instead let's use a legacy flexbox property which will never get an unprefixed version.
	// See https://compat.spec.whatwg.org/#css-property-mappings

	assert.expect( 2 );

	var elem = jQuery( "<div></div>" )

			// Only the moz prefix is used to make sure we haven't e.g. set
			// `-webkit-box-flex` ourselves in the test.
			.css( "-moz-box-flex", "1" )
			.css( "box-flex", "1" ),
		elemStyle = elem[ 0 ].style;

	assert.equal( elemStyle.WebkitBoxFlex, "1",
		"setting properly-prefixed -webkit-box-flex" );
	assert.equal( elemStyle.undefined, undefined,
		"Nothing writes to node.style.undefined" );
} );

QUnit.test( "Don't update existing unsupported prefixed properties", function( assert ) {
	assert.expect( 1 );

	var elem = jQuery( "<div></div>" ),
		style = elem[ 0 ].style;
	style.MozFakeProperty = "old value";
	elem.css( "fakeProperty", "new value" );

	assert.equal( style.MozFakeProperty, "old value", "Fake prefixed property is not set" );
} );

QUnit.test( "Don't set fake prefixed properties when a regular one is missing", function( assert ) {
	assert.expect( 5 );

	var elem = jQuery( "<div></div>" ),
		style = elem[ 0 ].style;
	elem.css( "fakeProperty", "fake value" );

	assert.strictEqual( style.fakeProperty, "fake value", "Fake unprefixed property is set" );
	assert.strictEqual( style.webkitFakeProperty, undefined, "Fake prefixed property is not set (webkit)" );
	assert.strictEqual( style.WebkitFakeProperty, undefined, "Fake prefixed property is not set (Webkit)" );
	assert.strictEqual( style.MozFakeProperty, undefined, "Fake prefixed property is not set (Moz)" );
	assert.strictEqual( style.msFakeProperty, undefined, "Fake prefixed property is not set (ms)" );
} );

QUnit.test( "css(--customProperty)", function( assert ) {

	jQuery( "#qunit-fixture" ).append(
		"<style>\n" +
		"    .test__customProperties {\n" +
		"        --prop1:val1;\n" +
		"        --prop2: val2;\n" +
		"        --prop3:   val3;\n" +
		"        --prop4:val4 ;\n" +
		"        --prop5:val5   ;\n" +
		"        --prop6: val6 ;\n" +
		"        --prop7:   val7   ;\n" +
		"        --prop8:\"val8\";\n" +
		"        --prop9:'val9';\n" +
		"        --prop10:\f\r\n\t val10 \f\r\n\t;\n" +
		"        --prop11:\u000C\u000D\u000A\u0009\u0020val11\u0020\u0009\u000A\u000D\u000C;\n" +
		"        --prop12:\u000Bval12\u000B;\n" +
		"        --space: ;\n" +
		"        --empty:;\n" +
		"    }\n" +
		"</style>"
	);

	var div = jQuery( "<div>" ).appendTo( "#qunit-fixture" ),
		$elem = jQuery( "<div>" ).addClass( "test__customProperties" )
			.appendTo( "#qunit-fixture" );

	assert.expect( 20 );

	div.css( "--color", "blue" );
	assert.equal( div.css( "--color" ), "blue", "Modified CSS custom property using string" );

	div.css( "--color", "yellow" );
	assert.equal( div.css( "--color" ), "yellow", "Overwrite CSS custom property" );

	div.css( { "--color": "red" } );
	assert.equal( div.css( "--color" ), "red", "Modified CSS custom property using object" );

	div.css( { "--mixedCase": "green" } );
	div.css( { "--mixed-case": "red" } );
	assert.equal( div.css( "--mixedCase" ), "green",
		"Modified CSS custom property with mixed case" );

	div.css( { "--theme-dark": "purple" } );
	div.css( { "--themeDark": "red" } );
	assert.equal( div.css( "--theme-dark" ), "purple",
		"Modified CSS custom property with dashed name" );

	assert.equal( $elem.css( "--prop1" ), "val1", "Basic CSS custom property" );

	assert.equal( $elem.css( "--prop2" ), "val2", "Preceding whitespace trimmed" );
	assert.equal( $elem.css( "--prop3" ), "val3", "Multiple preceding whitespace trimmed" );
	assert.equal( $elem.css( "--prop4" ), "val4", "Following whitespace trimmed" );
	assert.equal( $elem.css( "--prop5" ), "val5", "Multiple Following whitespace trimmed" );
	assert.equal( $elem.css( "--prop6" ), "val6", "Preceding and Following whitespace trimmed" );
	assert.equal( $elem.css( "--prop7" ), "val7", "Multiple preceding and following whitespace trimmed" );
	assert.equal( $elem.css( "--prop8" ), "\"val8\"", "Works with double quotes" );

	// Support: Safari <=9.1 - 18.1+
	// Safari converts single quotes to double ones.
	if ( !/\bapplewebkit\/605\.1\.15\b/i.test( navigator.userAgent ) ) {
		assert.equal( $elem.css( "--prop9" ), "'val9'", "Works with single quotes" );
	} else {
		assert.equal( $elem.css( "--prop9" ).replace( /"/g, "'" ), "'val9'",
			"Works with single quotes, but they may be changed to double ones" );
	}

	assert.equal( $elem.css( "--prop10" ), "val10", "Multiple preceding and following escaped unicode whitespace trimmed" );
	assert.equal( $elem.css( "--prop11" ), "val11", "Multiple preceding and following unicode whitespace trimmed" );
	assert.equal( $elem.css( "--prop12" ), "\u000Bval12\u000B", "Multiple preceding and following non-CSS whitespace reserved" );
	assert.equal( $elem.css( "--space" ), undefined );
	assert.equal( $elem.css( "--empty" ), undefined );
	assert.equal( $elem.css( "--nonexistent" ), undefined );
} );

QUnit.test( "Don't append px to CSS vars", function( assert ) {

	assert.expect( 3 );

	var $div = jQuery( "<div>" ).appendTo( "#qunit-fixture" );

	$div
		.css( "--a", 3 )
		.css( "--line-height", 4 )
		.css( "--lineHeight", 5 );

	assert.equal( $div.css( "--a" ), "3", "--a: 3" );
	assert.equal( $div.css( "--line-height" ), "4", "--line-height: 4" );
	assert.equal( $div.css( "--lineHeight" ), "5", "--lineHeight: 5" );
} );

}
