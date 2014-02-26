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

test("id", function() {
	expect( 26 );

	var a;

	t( "ID Selector", "#body", ["body"] );
	t( "ID Selector w/ Element", "body#body", ["body"] );
	t( "ID Selector w/ Element", "ul#first", [] );
	t( "ID selector with existing ID descendant", "#firstp #simon1", ["simon1"] );
	t( "ID selector with non-existant descendant", "#firstp #foobar", [] );
	t( "ID selector using UTF8", "#台北Táiběi", ["台北Táiběi"] );
	t( "Multiple ID selectors using UTF8", "#台北Táiběi, #台北", ["台北Táiběi","台北"] );
	t( "Descendant ID selector using UTF8", "div #台北", ["台北"] );
	t( "Child ID selector using UTF8", "form > #台北", ["台北"] );

	t( "Escaped ID", "#foo\\:bar", ["foo:bar"] );
	t( "Escaped ID", "#test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Descendant escaped ID", "div #foo\\:bar", ["foo:bar"] );
	t( "Descendant escaped ID", "div #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Child escaped ID", "form > #foo\\:bar", ["foo:bar"] );
	t( "Child escaped ID", "form > #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );

	t( "ID Selector, child ID present", "#form > #radio1", ["radio1"] ); // bug #267
	t( "ID Selector, not an ancestor ID", "#form #first", [] );
	t( "ID Selector, not a child ID", "#form > #option1a", [] );

	t( "All Children of ID", "#foo > *", ["sndp", "en", "sap"] );
	t( "All Children of ID with no children", "#firstUL > *", [] );

	a = jQuery("<a id='backslash\\foo'></a>").appendTo("#qunit-fixture");
	t( "ID Selector contains backslash", "#backslash\\\\foo", ["backslash\\foo"] );

	t( "ID Selector on Form with an input that has a name of 'id'", "#lengthtest", ["lengthtest"] );

	t( "ID selector with non-existant ancestor", "#asdfasdf #foobar", [] ); // bug #986

	t( "Underscore ID", "#types_all", ["types_all"] );
	t( "Dash ID", "#qunit-fixture", ["qunit-fixture"] );

	t( "ID with weird characters in it", "#name\\+value", ["name+value"] );
});

test("class - jQuery only", function() {
	expect( 4 );

	deepEqual( jQuery(".blog", document.getElementsByTagName("p")).get(), q("mark", "simon"), "Finding elements with a context." );
	deepEqual( jQuery(".blog", "p").get(), q("mark", "simon"), "Finding elements with a context." );
	deepEqual( jQuery(".blog", jQuery("p")).get(), q("mark", "simon"), "Finding elements with a context." );
	deepEqual( jQuery("p").find(".blog").get(), q("mark", "simon"), "Finding elements with a context." );
});

test("name", function() {
	expect( 5 );

	var form;

	t( "Name selector", "input[name=action]", ["text1"] );
	t( "Name selector with single quotes", "input[name='action']", ["text1"] );
	t( "Name selector with double quotes", "input[name=\"action\"]", ["text1"] );

	t( "Name selector for grouped input", "input[name='types[]']", ["types_all", "types_anime", "types_movie"] );

	form = jQuery("<form><input name='id'/></form>").appendTo("body");
	equal( jQuery("input", form[0]).length, 1, "Make sure that rooted queries on forms (with possible expandos) work." );

	form.remove();
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

test( "jQuery.contains", function() {
	expect( 16 );

	var container = document.getElementById("nonnodes"),
		element = container.firstChild,
		text = element.nextSibling,
		nonContained = container.nextSibling,
		detached = document.createElement("a");
	ok( element && element.nodeType === 1, "preliminary: found element" );
	ok( text && text.nodeType === 3, "preliminary: found text" );
	ok( nonContained, "preliminary: found non-descendant" );
	ok( jQuery.contains(container, element), "child" );
	ok( jQuery.contains(container.parentNode, element), "grandchild" );
	ok( jQuery.contains(container, text), "text child" );
	ok( jQuery.contains(container.parentNode, text), "text grandchild" );
	ok( !jQuery.contains(container, container), "self" );
	ok( !jQuery.contains(element, container), "parent" );
	ok( !jQuery.contains(container, nonContained), "non-descendant" );
	ok( !jQuery.contains(container, document), "document" );
	ok( !jQuery.contains(container, document.documentElement), "documentElement (negative)" );
	ok( !jQuery.contains(container, null), "Passing null does not throw an error" );
	ok( jQuery.contains(document, document.documentElement), "documentElement (positive)" );
	ok( jQuery.contains(document, element), "document container (positive)" );
	ok( !jQuery.contains(document, detached), "document container (negative)" );
});

testIframe("selector/sizzle_cache", "Sizzle cache collides with multiple Sizzles on a page", function( jQuery, window, document ) {
	var $cached = window["$cached"];

	expect(4);
	notStrictEqual( jQuery, $cached, "Loaded two engines" );
	deepEqual( $cached(".test a").get(), [ document.getElementById("collision") ], "Select collision anchor with first sizzle" );
	equal( jQuery(".evil a").length, 0, "Select nothing with second sizzle" );
	equal( jQuery(".evil a").length, 0, "Select nothing again with second sizzle" );
});

asyncTest( "Iframe dispatch should not affect Sizzle, see #13936", 1, function() {
	var loaded = false,
		thrown = false,
		iframe = document.getElementById("iframe"),
		iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

	jQuery( iframe ).on( "load", function() {
		var form;

		try {
			iframeDoc = this.contentDocument || this.contentWindow.document;
			form = jQuery( "#navigate", iframeDoc )[ 0 ];
		} catch ( e ) {
			thrown = e;
		}

		if ( loaded ) {
			strictEqual( thrown, false, "No error thrown from post-reload jQuery call" );

			// clean up
			jQuery( iframe ).off();

			start();
		} else {
			loaded = true;
			form.submit();
		}
	});

	iframeDoc.open();
	iframeDoc.write("<body><form id='navigate'></form></body>");
	iframeDoc.close();
});
