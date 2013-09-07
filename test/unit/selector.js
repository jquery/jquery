module("selector", { teardown: moduleTeardown });

/**
 * This test page is for selector tests that require jQuery in order to do the selection
 */

test("element - jQuery only", function() {
	expect( 7 );

	var fixture = document.getElementById("qunit-fixture");

	deepEqual( jQuery("p", fixture).get(), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a Node context." );
	deepEqual( jQuery("p", "#qunit-fixture").get(), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a selector context." );
	deepEqual( jQuery("p", jQuery("#qunit-fixture")).get(), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a jQuery object context." );
	deepEqual( jQuery("#qunit-fixture").find("p").get(), q("firstp","ap","sndp","en","sap","first"), "Finding elements with a context via .find()." );

	ok( jQuery("#length").length, "<input name=\"length\"> cannot be found under IE, see #945" );
	ok( jQuery("#lengthtest input").length, "<input name=\"length\"> cannot be found under IE, see #945" );

	// #7533
	equal( jQuery("<div id=\"A'B~C.D[E]\"><p>foo</p></div>").find("p").length, 1, "Find where context root is a node and has an ID with CSS3 meta characters" );
});

test("class - jQuery only", function() {
	expect( 4 );

	deepEqual( jQuery(".blog", document.getElementsByTagName("p")).get(), q("mark", "simon"), "Finding elements with a context." );
	deepEqual( jQuery(".blog", "p").get(), q("mark", "simon"), "Finding elements with a context." );
	deepEqual( jQuery(".blog", jQuery("p")).get(), q("mark", "simon"), "Finding elements with a context." );
	deepEqual( jQuery("p").find(".blog").get(), q("mark", "simon"), "Finding elements with a context." );
});

test("attributes - jQuery only", function() {
	expect( 5 );

	t( "Find elements with a tabindex attribute", "[tabindex]", ["listWithTabIndex", "foodWithNegativeTabIndex", "linkWithTabIndex", "linkWithNegativeTabIndex", "linkWithNoHrefWithTabIndex", "linkWithNoHrefWithNegativeTabIndex"] );

	// #12600
	ok(
		jQuery("<select value='12600'><option value='option' selected='selected'></option><option value=''></option></select>")
		.prop( "value", "option" )
		.is(":input[value='12600']"),

		":input[value=foo] selects select by attribute"
	);
	ok( jQuery("<input type='text' value='12600'/>").prop( "value", "option" ).is(":input[value='12600']"),
		":input[value=foo] selects text input by attribute"
	);

	// #11115
	ok( jQuery("<input type='checkbox' checked='checked'/>").prop( "checked", false ).is("[checked]"),
		"[checked] selects by attribute (positive)"
	);
	ok( !jQuery("<input type='checkbox'/>").prop( "checked", true ).is("[checked]"),
		"[checked] selects by attribute (negative)"
	);
});

test("disconnected nodes", function() {
	expect( 1 );

	var $div = jQuery("<div/>");
	equal( $div.is("div"), true, "Make sure .is('nodeName') works on disconnected nodes." );
});

test("disconnected nodes - jQuery only", function() {
	expect( 3 );

	var $opt = jQuery("<option></option>").attr("value", "whipit").appendTo("#qunit-fixture").detach();
	equal( $opt.val(), "whipit", "option value" );
	equal( $opt.is(":selected"), false, "unselected option" );
	$opt.prop("selected", true);
	equal( $opt.is(":selected"), true, "selected option" );
});

testIframe("selector/html5_selector", "attributes - jQuery.attr", function( jQuery, window, document ) {
	expect( 38 );

	/**
	 * Returns an array of elements with the given IDs
	 * q & t are added here for the iFrame's context
	 */
	function q() {
		var r = [],
			i = 0;

		for ( ; i < arguments.length; i++ ) {
			r.push( document.getElementById( arguments[i] ) );
		}
		return r;
	}

	/**
	 * Asserts that a select matches the given IDs
	 * @example t("Check for something", "//[a]", ["foo", "baar"]);
	 * @param {String} a - Assertion name
	 * @param {String} b - Sizzle selector
	 * @param {Array} c - Array of ids to construct what is expected
	 */
	function t( a, b, c ) {
		var f = jQuery(b).get(),
			s = "",
			i = 0;

		for ( ; i < f.length; i++ ) {
			s += (s && ",") + "'" + f[i].id + "'";
		}

		deepEqual(f, q.apply( q, c ), a + " (" + b + ")");
	}

	// ====== All known boolean attributes, including html5 booleans ======
	// autobuffer, autofocus, autoplay, async, checked,
	// compact, controls, declare, defer, disabled,
	// formnovalidate, hidden, indeterminate (property only),
	// ismap, itemscope, loop, multiple, muted, nohref, noresize,
	// noshade, nowrap, novalidate, open, pubdate, readonly, required,
	// reversed, scoped, seamless, selected, truespeed, visible (skipping visible attribute, which is on a barprop object)

	t( "Attribute Exists", "[autobuffer]",     ["video1"]);
	t( "Attribute Exists", "[autofocus]",      ["text1"]);
	t( "Attribute Exists", "[autoplay]",       ["video1"]);
	t( "Attribute Exists", "[async]",          ["script1"]);
	t( "Attribute Exists", "[checked]",        ["check1"]);
	t( "Attribute Exists", "[compact]",        ["dl"]);
	t( "Attribute Exists", "[controls]",       ["video1"]);
	t( "Attribute Exists", "[declare]",        ["object1"]);
	t( "Attribute Exists", "[defer]",          ["script1"]);
	t( "Attribute Exists", "[disabled]",       ["check1"]);
	t( "Attribute Exists", "[formnovalidate]", ["form1"]);
	t( "Attribute Exists", "[hidden]",         ["div1"]);
	t( "Attribute Exists", "[indeterminate]",  []);
	t( "Attribute Exists", "[ismap]",          ["img1"]);
	t( "Attribute Exists", "[itemscope]",      ["div1"]);
	t( "Attribute Exists", "[loop]",           ["video1"]);
	t( "Attribute Exists", "[multiple]",       ["select1"]);
	t( "Attribute Exists", "[muted]",          ["audio1"]);
	t( "Attribute Exists", "[nohref]",         ["area1"]);
	t( "Attribute Exists", "[noresize]",       ["textarea1"]);
	t( "Attribute Exists", "[noshade]",        ["hr1"]);
	t( "Attribute Exists", "[nowrap]",         ["td1", "div1"]);
	t( "Attribute Exists", "[novalidate]",     ["form1"]);
	t( "Attribute Exists", "[open]",           ["details1"]);
	t( "Attribute Exists", "[pubdate]",        ["article1"]);
	t( "Attribute Exists", "[readonly]",       ["text1"]);
	t( "Attribute Exists", "[required]",       ["text1"]);
	t( "Attribute Exists", "[reversed]",       ["ol1"]);
	t( "Attribute Exists", "[scoped]",         ["style1"]);
	t( "Attribute Exists", "[seamless]",       ["iframe1"]);
	t( "Attribute Exists", "[selected]",       ["option1"]);
	t( "Attribute Exists", "[truespeed]",      ["marquee1"]);

	// Enumerated attributes (these are not boolean content attributes)
	jQuery.expandedEach = jQuery.each;
	jQuery.expandedEach([ "draggable", "contenteditable", "aria-disabled" ], function( i, val ) {
		t( "Enumerated attribute", "[" + val + "]", ["div1"]);
	});
	t( "Enumerated attribute", "[spellcheck]", ["span1"]);

	t( "tabindex selector does not retrieve all elements in IE6/7 (#8473)",
		"form, [tabindex]", [ "form1", "text1" ] );
	t( "Improperly named form elements do not interfere with form selections (#9570)", "form[name='formName']", ["form1"] );
});

testIframe("selector/sizzle_cache", "Sizzle cache collides with multiple Sizzles on a page", function( jQuery, window, document ) {
	var $cached = window["$cached"];

	expect(4);
	notStrictEqual( jQuery, $cached, "Loaded two engines" );
	deepEqual( $cached(".test a").get(), [ document.getElementById("collision") ], "Select collision anchor with first sizzle" );
	equal( jQuery(".evil a").length, 0, "Select nothing with second sizzle" );
	equal( jQuery(".evil a").length, 0, "Select nothing again with second sizzle" );
});
