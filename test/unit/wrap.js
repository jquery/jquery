( function() {

if ( !jQuery.fn.wrap ) { // no wrap module
	return;
}

QUnit.module( "wrap", {
	afterEach: moduleTeardown
} );

// See test/unit/manipulation.js for explanation about these 2 functions
function manipulationBareObj( value ) {
	return value;
}

function manipulationFunctionReturningObj( value ) {
	return function() {
		return value;
	};
}

function testWrap( val, assert ) {

	assert.expect( 18 );

	var defaultText, result, j, i, cacheLength;

	defaultText = "Try them out:";
	result = jQuery( "#first" ).wrap( val( "<div class='red'><span></span></div>" ) ).text();

	assert.equal(
		defaultText, result, "Check for wrapping of on-the-fly html"
	);
	assert.ok(
		jQuery( "#first" ).parent().parent().is( ".red" ), "Check if wrapper has class 'red'"
	);

	result = jQuery( "#first" ).wrap( val( document.getElementById( "empty" ) ) ).parent();
	assert.ok(
		result.is( "ol" ), "Check for element wrapping"
	);
	assert.equal(
		result.text(), defaultText, "Check for element wrapping"
	);

	jQuery( "#check1" ).on( "click", function() {
		var checkbox = this;

		assert.ok(
		checkbox.checked, "Checkbox's state is erased after wrap() action, see #769"
	);
		jQuery( checkbox ).wrap( val( "<div id='c1' style='display:none;'></div>" ) );
		assert.ok(
		checkbox.checked, "Checkbox's state is erased after wrap() action, see #769"
	);
	} ).prop( "checked", false )[ 0 ].click();

	// using contents will get comments regular, text, and comment nodes
	j = jQuery( "#nonnodes" ).contents();
	j.wrap( val( "<i></i>" ) );

	assert.equal(
		jQuery( "#nonnodes > i" ).length, 3,
		"Check node,textnode,comment wraps ok"
	);
	assert.equal(
		jQuery( "#nonnodes > i" ).text(), j.text(),
		"Check node,textnode,comment wraps doesn't hurt text"
	);

	j = jQuery( "<label></label>" ).wrap( val( "<li></li>" ) );
	assert.equal(
		j[ 0 ] .nodeName.toUpperCase(), "LABEL", "Element is a label"
	);
	assert.equal(
		j[ 0 ].parentNode.nodeName.toUpperCase(), "LI", "Element has been wrapped"
	);

	// Wrap an element containing a text node
	j = jQuery( "<span></span>" ).wrap( "<div>test</div>" );
	assert.equal(
		j[ 0 ].previousSibling.nodeType, 3, "Make sure the previous node is a text element"
	);
	assert.equal(
		j[ 0 ].parentNode.nodeName.toUpperCase(), "DIV", "And that we're in the div element."
	);

	// Try to wrap an element with multiple elements (should fail)
	j = jQuery( "<div><span></span></div>" ).children().wrap( "<p></p><div></div>" );
	assert.equal(
		j[ 0 ].parentNode.parentNode.childNodes.length, 1,
		"There should only be one element wrapping."
	);
	assert.equal(
		j.length, 1, "There should only be one element (no cloning)."
	);
	assert.equal(
		j[ 0 ].parentNode.nodeName.toUpperCase(), "P", "The span should be in the paragraph."
	);

	// Wrap an element with a jQuery set
	j = jQuery( "<span></span>" ).wrap( jQuery( "<div></div>" ) );
	assert.equal(
		j[ 0 ].parentNode.nodeName.toLowerCase(), "div", "Wrapping works."
	);

	// Wrap an element with a jQuery set and event
	result = jQuery( "<div></div>" ).on( "click", function() {
		assert.ok(
		true, "Event triggered."
	);

		// Remove handlers on detached elements
		result.off();
		jQuery( this ).off();
	} );

	j = jQuery( "<span></span>" ).wrap( result );
	assert.equal(
		j[ 0 ].parentNode.nodeName.toLowerCase(), "div", "Wrapping works."
	);

	j.parent().trigger( "click" );
}

QUnit.test( "wrap(String|Element)", function( assert ) {
	testWrap( manipulationBareObj, assert );
} );

QUnit.test( "wrap(Function)", function( assert ) {
	testWrap( manipulationFunctionReturningObj, assert );
} );

QUnit.test( "wrap(Function) with index (#10177)", function( assert ) {
	var expectedIndex = 0,
		targets = jQuery( "#qunit-fixture p" );

	assert.expect( targets.length );
	targets.wrap( function( i ) {
		assert.equal(
		i, expectedIndex,
		"Check if the provided index (" + i + ") is as expected (" + expectedIndex + ")"
	);
		expectedIndex++;

		return "<div id='wrap_index_'" + i + "'></div>";
	} );
} );

QUnit.test( "wrap(String) consecutive elements (#10177)", function( assert ) {
	var targets = jQuery( "#qunit-fixture p" );

	assert.expect( targets.length * 2 );
	targets.wrap( "<div class='wrapper'></div>" );

	targets.each( function() {
		var $this = jQuery( this );

		assert.ok(
		$this.parent().is( ".wrapper" ), "Check each elements parent is correct (.wrapper)"
	);
		assert.equal(
		$this.siblings().length, 0, "Each element should be wrapped individually"
	);
	} );
} );

QUnit.test( "wrapAll(String)", function( assert ) {

	assert.expect( 5 );

	var prev, p, result;

	prev = jQuery( "#firstp" )[ 0 ].previousSibling;
	p = jQuery( "#firstp,#first" )[ 0 ].parentNode;
	result = jQuery( "#firstp,#first" ).wrapAll( "<div class='red'><div class='tmp'></div></div>" );

	assert.equal(
		result.parent().length, 1, "Check for wrapping of on-the-fly html"
	);
	assert.ok(
		jQuery( "#first" ).parent().parent().is( ".red" ), "Check if wrapper has class 'red'"
	);
	assert.ok(
		jQuery( "#firstp" ).parent().parent().is( ".red" ), "Check if wrapper has class 'red'"
	);
	assert.equal(
		jQuery( "#first" ).parent().parent()[ 0 ].previousSibling, prev, "Correct Previous Sibling"
	);
	assert.equal(
		jQuery( "#first" ).parent().parent()[ 0 ].parentNode, p, "Correct Parent"
	);

} );

QUnit.test( "wrapAll(Function)", function( assert ) {
	assert.expect( 5 );

	var prev = jQuery( "#firstp" )[ 0 ].previousSibling,
		p = jQuery( "#firstp,#first" )[ 0 ].parentNode,
		result = jQuery( "#firstp,#first" ).wrapAll( function() {
			return "<div class='red'><div class='tmp'></div></div>";
		} );

	assert.equal(
		result.parent().length, 1, "Check for wrapping of on-the-fly html"
	);
	assert.ok(
		jQuery( "#first" ).parent().parent().is( ".red" ), "Check if wrapper has class 'red'"
	);
	assert.ok(
		jQuery( "#firstp" ).parent().parent().is( ".red" ), "Check if wrapper has class 'red'"
	);
	assert.ok(
		jQuery( "#first" ).parent().parent().parent().is( p ), "Correct Parent"
	);
	assert.strictEqual(
		jQuery( "#first" ).parent().parent()[ 0 ].previousSibling, prev, "Correct Previous Sibling"
	);
} );

QUnit.test( "wrapAll(Function) check execution characteristics", function( assert ) {
	assert.expect( 3 );

	var i = 0;

	jQuery( "non-existent" ).wrapAll( function() {
		i++;
		return "";
	} );

	assert.ok(
		!i, "should not execute function argument if target element does not exist"
	);

	jQuery( "#firstp" ).wrapAll( function( index ) {
		assert.strictEqual(
		this, jQuery( "#firstp" )[ 0 ], "context must be the first found element"
	);
		assert.strictEqual(
		index, undefined, "index argument should not be included in function execution"
	);
	} );
} );

QUnit.test( "wrapAll(Element)", function( assert ) {

  assert.expect( 3 );

  var prev, p;
	prev = jQuery( "#firstp" )[ 0 ].previousSibling;
	p = jQuery( "#first" )[ 0 ].parentNode;
	jQuery( "#firstp,#first" ).wrapAll( document.getElementById( "empty" ) );

	assert.equal(
		jQuery( "#first" ).parent()[ 0 ], jQuery( "#firstp" ).parent()[ 0 ], "Same Parent"
	);
	assert.equal(
		jQuery( "#first" ).parent()[ 0 ].previousSibling, prev, "Correct Previous Sibling"
	);
	assert.equal(
		jQuery( "#first" ).parent()[ 0 ].parentNode, p, "Correct Parent"
	);
} );

QUnit.test( "wrapInner(String)", function( assert ) {

	assert.expect( 6 );

	var num;

	num = jQuery( "#first" ).children().length;
	jQuery( "#first" ).wrapInner( "<div class='red'><div id='tmp'></div></div>" );

	assert.equal(
		jQuery( "#first" ).children().length, 1, "Only one child"
	);
	assert.ok(
		jQuery( "#first" ).children().is( ".red" ), "Verify Right Element"
	);
	assert.equal(
		jQuery( "#first" ).children().children().children().length, num, "Verify Elements Intact"
	);

	num = jQuery( "#first" ).html( "foo<div>test</div><div>test2</div>" ).children().length;
	jQuery( "#first" ).wrapInner( "<div class='red'><div id='tmp'></div></div>" );
	assert.equal(
		jQuery( "#first" ).children().length, 1, "Only one child"
	);
	assert.ok(
		jQuery( "#first" ).children().is( ".red" ), "Verify Right Element"
	);
	assert.equal(
		jQuery( "#first" ).children().children().children().length, num, "Verify Elements Intact"
	);
} );

QUnit.test( "wrapInner(Element)", function( assert ) {

	assert.expect( 5 );

	var num,
		div = jQuery( "<div></div>" );

	num = jQuery( "#first" ).children().length;
	jQuery( "#first" ).wrapInner( document.getElementById( "empty" ) );
	assert.equal(
		jQuery( "#first" ).children().length, 1, "Only one child"
	);
	assert.ok(
		jQuery( "#first" ).children().is( "#empty" ), "Verify Right Element"
	);
	assert.equal(
		jQuery( "#first" ).children().children().length, num, "Verify Elements Intact"
	);

	div.wrapInner( "<span></span>" );
	assert.equal(
		div.children().length, 1, "The contents were wrapped."
	);
	assert.equal(
		div.children()[ 0 ].nodeName.toLowerCase(), "span", "A span was inserted."
	);
} );

QUnit.test( "wrapInner(Function) returns String", function( assert ) {

	assert.expect( 6 );

	var num,
    val = manipulationFunctionReturningObj;

	num = jQuery( "#first" ).children().length;
	jQuery( "#first" ).wrapInner( val( "<div class='red'><div id='tmp'></div></div>" ) );

	assert.equal(
		jQuery( "#first" ).children().length, 1, "Only one child"
	);
	assert.ok(
		jQuery( "#first" ).children().is( ".red" ), "Verify Right Element"
	);
	assert.equal(
		jQuery( "#first" ).children().children().children().length, num, "Verify Elements Intact"
	);

	num = jQuery( "#first" ).html( "foo<div>test</div><div>test2</div>" ).children().length;
	jQuery( "#first" ).wrapInner( val( "<div class='red'><div id='tmp'></div></div>" ) );
	assert.equal(
		jQuery( "#first" ).children().length, 1, "Only one child"
	);
	assert.ok(
		jQuery( "#first" ).children().is( ".red" ), "Verify Right Element"
	);
	assert.equal(
		jQuery( "#first" ).children().children().children().length, num, "Verify Elements Intact"
	);
} );

QUnit.test( "wrapInner(Function) returns Element", function( assert ) {

	assert.expect( 5 );

	var num,
    val = manipulationFunctionReturningObj,
		div = jQuery( "<div></div>" );

	num = jQuery( "#first" ).children().length;
	jQuery( "#first" ).wrapInner( val( document.getElementById( "empty" ) ) );
	assert.equal(
		jQuery( "#first" ).children().length, 1, "Only one child"
	);
	assert.ok(
		jQuery( "#first" ).children().is( "#empty" ), "Verify Right Element"
	);
	assert.equal(
		jQuery( "#first" ).children().children().length, num, "Verify Elements Intact"
	);

	div.wrapInner( val( "<span></span>" ) );
	assert.equal(
		div.children().length, 1, "The contents were wrapped."
	);
	assert.equal(
		div.children()[ 0 ].nodeName.toLowerCase(), "span", "A span was inserted."
	);
} );

QUnit.test( "unwrap()", function( assert ) {

	assert.expect( 9 );

	jQuery( "body" ).append(
		"  <div id='unwrap' style='display: none;'> <div id='unwrap1'>" +
		" <span class='unwrap'>a</span> <span class='unwrap'>b</span> </div> <div id='unwrap2'>" +
		" <span class='unwrap'>c</span> <span class='unwrap'>d</span> </div> <div id='unwrap3'>" +
		" <b><span class='unwrap unwrap3'>e</span></b>" +
		" <b><span class='unwrap unwrap3'>f</span></b> </div> </div>"
	);

	var abcd = jQuery( "#unwrap1 > span, #unwrap2 > span" ).get(),
		abcdef = jQuery( "#unwrap span" ).get();

	assert.equal(
		jQuery( "#unwrap1 span" ).add( "#unwrap2 span:first-child" ).unwrap().length, 3,
		"make #unwrap1 and #unwrap2 go away"
	);
	assert.deepEqual(
		jQuery( "#unwrap > span" ).get(), abcd, "all four spans should still exist"
	);

	assert.deepEqual(
		jQuery( "#unwrap3 span" ).unwrap().get(), jQuery( "#unwrap3 > span" ).get(),
		"make all b in #unwrap3 go away"
	);

	assert.deepEqual(
		jQuery( "#unwrap3 span" ).unwrap().get(), jQuery( "#unwrap > span.unwrap3" ).get(),
		"make #unwrap3 go away"
	);

	assert.deepEqual(
		jQuery( "#unwrap" ).children().get(), abcdef, "#unwrap only contains 6 child spans"
	);

	assert.deepEqual(
		jQuery( "#unwrap > span" ).unwrap().get(), jQuery( "body > span.unwrap" ).get(),
		"make the 6 spans become children of body"
	);

	assert.deepEqual(
		jQuery( "body > span.unwrap" ).unwrap().get(), jQuery( "body > span.unwrap" ).get(),
		"can't unwrap children of body"
	);
	assert.deepEqual(
		jQuery( "body > span.unwrap" ).unwrap().get(), abcdef, "can't unwrap children of body"
	);

	assert.deepEqual(
		jQuery( "body > span.unwrap" ).get(), abcdef, "body contains 6 .unwrap child spans"
	);

	jQuery( "body > span.unwrap" ).remove();
} );

QUnit.test( "unwrap( selector )", function( assert ) {

	assert.expect( 5 );

	jQuery( "body" ).append(
		"  <div id='unwrap' style='display: none;'> <div id='unwrap1'>" +
		"<span class='unwrap'>a</span> <span class='unwrap'>b</span> </div>" +
		" <div id='unwrap2'> <span class='unwrap'>c</span> <span class='unwrap'>d</span>" +
		" </div> </div>"
	);

	// Shouldn't unwrap, no match
	jQuery( "#unwrap1 span" ) .unwrap( "#unwrap2" );
	assert.equal(
		jQuery( "#unwrap1" ).length, 1, "still wrapped"
	);

	// Shouldn't unwrap, no match
	jQuery( "#unwrap1 span" ) .unwrap( "span" );
	assert.equal(
		jQuery( "#unwrap1" ).length, 1, "still wrapped"
	);

	// Unwraps
	jQuery( "#unwrap1 span" ) .unwrap( "#unwrap1" );
	assert.equal(
		jQuery( "#unwrap1" ).length, 0, "unwrapped match"
	);

	// Check return values
	assert.deepEqual(
		jQuery( "#unwrap2 span" ).get(), jQuery( "#unwrap2 span" ).unwrap( "quote" ).get(),
		"return on unmatched unwrap"
	);
	assert.deepEqual(
		jQuery( "#unwrap2 span" ).get(), jQuery( "#unwrap2 span" ).unwrap( "#unwrap2" ).get(),
		"return on matched unwrap"
	);

	jQuery( "body > span.unwrap" ).remove();
} );

QUnit.test( "jQuery(<tag>) & wrap[Inner/All]() handle unknown elems (#10667)", function( assert ) {

	assert.expect( 2 );

	var $wraptarget = jQuery( "<div id='wrap-target'>Target</div>" ).appendTo( "#qunit-fixture" ),
		$section = jQuery( "<section>" ).appendTo( "#qunit-fixture" );

	$wraptarget.wrapAll( "<aside style='background-color:green'></aside>" );

	assert.notEqual(
		$wraptarget.parent( "aside" ).get( 0 ).style.backgroundColor, "transparent",
		"HTML5 elements created with wrapAll inherit styles"
	);
	assert.notEqual(
		$section.get( 0 ).style.backgroundColor, "transparent",
		"HTML5 elements create with jQuery( string ) inherit styles"
	);
} );

QUnit.test( "wrapping scripts (#10470)", function( assert ) {

	assert.expect( 2 );

	var script = document.createElement( "script" );
	script.text = script.textContent =
		"QUnit.assert.ok( !document.eval10470, 'script evaluated once' ); document.eval10470 = true;";

	document.eval10470 = false;
	jQuery( "#qunit-fixture" ).empty()[ 0 ].appendChild( script );
	jQuery( "#qunit-fixture script" ).wrap( "<b></b>" );
	assert.strictEqual(
		script.parentNode, jQuery( "#qunit-fixture > b" )[ 0 ], "correctly wrapped"
	);
	jQuery( script ).remove();
} );

} )();
