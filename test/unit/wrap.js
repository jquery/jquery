(function() {

if ( !jQuery.fn.wrap ) { // no wrap module
	return;
}

module( "wrap", {
	teardown: moduleTeardown
});

// See test/unit/manipulation.js for explanation about these 2 functions
function manipulationBareObj( value ) {
	return value;
}

function manipulationFunctionReturningObj( value ) {
	return function() {
		return value;
	};
}

function testWrap( val ) {

	expect( 19 );

	var defaultText, result, j, i, cacheLength;

	defaultText = "Try them out:";
	result = jQuery("#first").wrap( val("<div class='red'><span></span></div>") ).text();

	equal( defaultText, result, "Check for wrapping of on-the-fly html" );
	ok( jQuery("#first").parent().parent().is(".red"), "Check if wrapper has class 'red'" );

	result = jQuery("#first").wrap( val(document.getElementById("empty")) ).parent();
	ok( result.is("ol"), "Check for element wrapping" );
	equal( result.text(), defaultText, "Check for element wrapping" );

	jQuery("#check1").on( "click", function() {
		var checkbox = this;

		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
		jQuery( checkbox ).wrap( val("<div id='c1' style='display:none;'></div>") );
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
	}).prop( "checked", false )[ 0 ].click();

	// using contents will get comments regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();
	j.wrap( val("<i></i>") );

	equal( jQuery("#nonnodes > i").length, jQuery("#nonnodes")[ 0 ].childNodes.length, "Check node,textnode,comment wraps ok" );
	equal( jQuery("#nonnodes > i").text(), j.text(), "Check node,textnode,comment wraps doesn't hurt text" );

	// Try wrapping a disconnected node
	cacheLength = 0;
	for ( i in jQuery.cache ) {
		cacheLength++;
	}

	j = jQuery("<label/>").wrap( val("<li/>") );
	equal( j[ 0 ] .nodeName.toUpperCase(), "LABEL", "Element is a label" );
	equal( j[ 0 ].parentNode.nodeName.toUpperCase(), "LI", "Element has been wrapped" );

	for ( i in jQuery.cache ) {
		cacheLength--;
	}
	equal( cacheLength, 0, "No memory leak in jQuery.cache (bug #7165)" );

	// Wrap an element containing a text node
	j = jQuery("<span/>").wrap("<div>test</div>");
	equal( j[ 0 ].previousSibling.nodeType, 3, "Make sure the previous node is a text element" );
	equal( j[ 0 ].parentNode.nodeName.toUpperCase(), "DIV", "And that we're in the div element." );

	// Try to wrap an element with multiple elements (should fail)
	j = jQuery("<div><span></span></div>").children().wrap("<p></p><div></div>");
	equal( j[ 0 ].parentNode.parentNode.childNodes.length, 1, "There should only be one element wrapping." );
	equal( j.length, 1, "There should only be one element (no cloning)." );
	equal( j[ 0 ].parentNode.nodeName.toUpperCase(), "P", "The span should be in the paragraph." );

	// Wrap an element with a jQuery set
	j = jQuery("<span/>").wrap( jQuery("<div></div>") );
	equal( j[ 0 ].parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	// Wrap an element with a jQuery set and event
	result = jQuery("<div></div>").on( "click", function() {
		ok( true, "Event triggered." );

		// Remove handlers on detached elements
		result.off();
		jQuery(this).off();
	});

	j = jQuery("<span/>").wrap( result );
	equal( j[ 0 ].parentNode.nodeName.toLowerCase(), "div", "Wrapping works." );

	j.parent().trigger("click");
}

test( "wrap(String|Element)", function() {
	testWrap( manipulationBareObj );
});

test( "wrap(Function)", function() {
	testWrap( manipulationFunctionReturningObj );
});

test( "wrap(Function) with index (#10177)", function() {
	var expectedIndex = 0,
		targets = jQuery("#qunit-fixture p");

	expect( targets.length );
	targets.wrap(function(i) {
		equal( i, expectedIndex, "Check if the provided index (" + i + ") is as expected (" + expectedIndex + ")" );
		expectedIndex++;

		return "<div id='wrap_index_'" + i + "'></div>";
	});
});

test( "wrap(String) consecutive elements (#10177)", function() {
	var targets = jQuery("#qunit-fixture p");

	expect( targets.length * 2 );
	targets.wrap("<div class='wrapper'></div>");

	targets.each(function() {
		var $this = jQuery(this);

		ok( $this.parent().is(".wrapper"), "Check each elements parent is correct (.wrapper)" );
		equal( $this.siblings().length, 0, "Each element should be wrapped individually" );
	});
});

test( "wrapAll(String)", function() {

	expect( 5 );

	var prev, p, result;

	prev = jQuery("#firstp")[ 0 ].previousSibling;
	p = jQuery("#firstp,#first")[ 0 ].parentNode;
	result = jQuery("#firstp,#first").wrapAll( "<div class='red'><div class='tmp'></div></div>" );

	equal( result.parent().length, 1, "Check for wrapping of on-the-fly html" );
	ok( jQuery("#first").parent().parent().is(".red"), "Check if wrapper has class 'red'" );
	ok( jQuery("#firstp").parent().parent().is(".red"), "Check if wrapper has class 'red'" );
	equal( jQuery("#first").parent().parent()[ 0 ].previousSibling, prev, "Correct Previous Sibling" );
	equal( jQuery("#first").parent().parent()[ 0 ].parentNode, p, "Correct Parent" );

});

test( "wrapAll(Element)", function() {

  expect( 3 );

  var prev, p;
	prev = jQuery("#firstp")[ 0 ].previousSibling;
	p = jQuery("#first")[ 0 ].parentNode;
	jQuery("#firstp,#first").wrapAll( document.getElementById("empty") );

	equal( jQuery("#first").parent()[ 0 ], jQuery("#firstp").parent()[ 0 ], "Same Parent" );
	equal( jQuery("#first").parent()[ 0 ].previousSibling, prev, "Correct Previous Sibling" );
	equal( jQuery("#first").parent()[ 0 ].parentNode, p, "Correct Parent" );
});

test( "wrapInner(String)", function() {

	expect( 6 );

	var num;

	num = jQuery("#first").children().length;
	jQuery("#first").wrapInner( "<div class='red'><div id='tmp'></div></div>" );

	equal( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( jQuery("#first").children().children().children().length, num, "Verify Elements Intact" );

	num = jQuery("#first").html("foo<div>test</div><div>test2</div>").children().length;
	jQuery("#first").wrapInner( "<div class='red'><div id='tmp'></div></div>" );
	equal( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( jQuery("#first").children().children().children().length, num, "Verify Elements Intact" );
});

test( "wrapInner(Element)", function() {

	expect( 5 );

	var num,
		div = jQuery("<div/>");

	num = jQuery("#first").children().length;
	jQuery("#first").wrapInner( document.getElementById("empty") );
	equal( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is("#empty"), "Verify Right Element" );
	equal( jQuery("#first").children().children().length, num, "Verify Elements Intact" );

	div.wrapInner( "<span></span>" );
	equal( div.children().length, 1, "The contents were wrapped." );
	equal( div.children()[ 0 ].nodeName.toLowerCase(), "span", "A span was inserted." );
});

test( "wrapInner(Function) returns String", function() {

	expect( 6 );

	var num,
    val = manipulationFunctionReturningObj;

	num = jQuery("#first").children().length;
	jQuery("#first").wrapInner( val("<div class='red'><div id='tmp'></div></div>") );

	equal( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( jQuery("#first").children().children().children().length, num, "Verify Elements Intact" );

	num = jQuery("#first").html("foo<div>test</div><div>test2</div>").children().length;
	jQuery("#first").wrapInner( val("<div class='red'><div id='tmp'></div></div>") );
	equal( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is(".red"), "Verify Right Element" );
	equal( jQuery("#first").children().children().children().length, num, "Verify Elements Intact" );
});

test( "wrapInner(Function) returns Element", function() {

	expect( 5 );

	var num,
    val = manipulationFunctionReturningObj,
		div = jQuery("<div/>");

	num = jQuery("#first").children().length;
	jQuery("#first").wrapInner( val(document.getElementById("empty")) );
	equal( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is("#empty"), "Verify Right Element" );
	equal( jQuery("#first").children().children().length, num, "Verify Elements Intact" );

	div.wrapInner( val("<span></span>") );
	equal( div.children().length, 1, "The contents were wrapped." );
	equal( div.children()[ 0 ].nodeName.toLowerCase(), "span", "A span was inserted." );
});

test( "unwrap()", function() {

	expect( 9 );

	jQuery("body").append("  <div id='unwrap' style='display: none;'> <div id='unwrap1'> <span class='unwrap'>a</span> <span class='unwrap'>b</span> </div> <div id='unwrap2'> <span class='unwrap'>c</span> <span class='unwrap'>d</span> </div> <div id='unwrap3'> <b><span class='unwrap unwrap3'>e</span></b> <b><span class='unwrap unwrap3'>f</span></b> </div> </div>");

	var abcd = jQuery("#unwrap1 > span, #unwrap2 > span").get(),
		abcdef = jQuery("#unwrap span").get();

	equal( jQuery("#unwrap1 span").add("#unwrap2 span:first-child").unwrap().length, 3, "make #unwrap1 and #unwrap2 go away" );
	deepEqual( jQuery("#unwrap > span").get(), abcd, "all four spans should still exist" );

	deepEqual( jQuery("#unwrap3 span").unwrap().get(), jQuery("#unwrap3 > span").get(), "make all b in #unwrap3 go away" );

	deepEqual( jQuery("#unwrap3 span").unwrap().get(), jQuery("#unwrap > span.unwrap3").get(), "make #unwrap3 go away" );

	deepEqual( jQuery("#unwrap").children().get(), abcdef, "#unwrap only contains 6 child spans" );

	deepEqual( jQuery("#unwrap > span").unwrap().get(), jQuery("body > span.unwrap").get(), "make the 6 spans become children of body" );

	deepEqual( jQuery("body > span.unwrap").unwrap().get(), jQuery("body > span.unwrap").get(), "can't unwrap children of body" );
	deepEqual( jQuery("body > span.unwrap").unwrap().get(), abcdef, "can't unwrap children of body" );

	deepEqual( jQuery("body > span.unwrap").get(), abcdef, "body contains 6 .unwrap child spans" );

	jQuery("body > span.unwrap").remove();
});

test( "jQuery(<tag>) & wrap[Inner/All]() handle unknown elems (#10667)", function() {

	expect( 2 );

	var $wraptarget = jQuery( "<div id='wrap-target'>Target</div>" ).appendTo( "#qunit-fixture" ),
		$section = jQuery( "<section>" ).appendTo( "#qunit-fixture" );

	$wraptarget.wrapAll("<aside style='background-color:green'></aside>");

	notEqual( $wraptarget.parent("aside").get( 0 ).style.backgroundColor, "transparent", "HTML5 elements created with wrapAll inherit styles" );
	notEqual( $section.get( 0 ).style.backgroundColor, "transparent", "HTML5 elements create with jQuery( string ) inherit styles" );
});

test( "wrapping scripts (#10470)", function() {

	expect( 2 );

	var script = document.createElement("script");
	script.text = script.textContent = "ok( !document.eval10470, 'script evaluated once' ); document.eval10470 = true;";

	document.eval10470 = false;
	jQuery("#qunit-fixture").empty()[0].appendChild( script );
	jQuery("#qunit-fixture script").wrap("<b></b>");
	strictEqual( script.parentNode, jQuery("#qunit-fixture > b")[ 0 ], "correctly wrapped" );
	jQuery( script ).remove();
});

})();
