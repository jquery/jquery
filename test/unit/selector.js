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

test( "selectors with comma", function() {
	expect( 4 );

	var fixture = jQuery( "<div><h2><span/></h2><div><p><span/></p><p/></div></div>" );

	equal( fixture.find( "h2, div p" ).filter( "p" ).length, 2, "has to find two <p>" );
	equal( fixture.find( "h2, div p" ).filter( "h2" ).length, 1, "has to find one <h2>" );
	equal( fixture.find( "h2 , div p" ).filter( "p" ).length, 2, "has to find two <p>" );
	equal( fixture.find( "h2 , div p" ).filter( "h2" ).length, 1, "has to find one <h2>" );
});

test( "child and adjacent", function() {
	expect( 27 );

	var nothiddendiv;

	t( "Child", "p > a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p> a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p >a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p>a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child w/ Class", "p > a.blog", ["mark","simon"] );
	t( "All Children", "code > *", ["anchor1","anchor2"] );
	t( "All Grandchildren", "p > * > *", ["anchor1","anchor2"] );
	t( "Adjacent", "p + p", ["ap","en","sap"] );
	t( "Adjacent", "p#firstp + p", ["ap"] );
	t( "Adjacent", "p[lang=en] + p", ["sap"] );
	t( "Adjacent", "a.GROUPS + code + a", ["mark"] );
	t( "Element Preceded By", "#groups ~ a", ["mark"] );
	t( "Element Preceded By", "#length ~ input", ["idTest"] );
	t( "Element Preceded By", "#siblingfirst ~ em", ["siblingnext", "siblingthird"] );
	t( "Element Preceded By (multiple)", "#siblingTest em ~ em ~ em ~ span", ["siblingspan"] );
	t( "Element Preceded By, Containing", "#liveHandlerOrder ~ div em:contains('1')", ["siblingfirst"] );

	t( "Multiple combinators selects all levels", "#siblingTest em *", ["siblingchild", "siblinggrandchild", "siblinggreatgrandchild"] );
	t( "Multiple combinators selects all levels", "#siblingTest > em *", ["siblingchild", "siblinggrandchild", "siblinggreatgrandchild"] );
	t( "Multiple sibling combinators doesn't miss general siblings", "#siblingTest > em:first-child + em ~ span", ["siblingspan"] );
	t( "Combinators are not skipped when mixing general and specific", "#siblingTest > em:contains('x') + em ~ span", [] );

	equal( jQuery("#listWithTabIndex").length, 1, "Parent div for next test is found via ID (#8310)" );
	equal( jQuery("#listWithTabIndex li:eq(2) ~ li").length, 1, "Find by general sibling combinator (#8310)" );
	equal( jQuery("#__sizzle__").length, 0, "Make sure the temporary id assigned by sizzle is cleared out (#8310)" );
	equal( jQuery("#listWithTabIndex").length, 1, "Parent div for previous test is still found via ID (#8310)" );

	t( "Verify deep class selector", "div.blah > p > a", [] );

	t( "No element deep selector", "div.foo > span > a", [] );

	nothiddendiv = document.getElementById("nothiddendiv");

	t( "Non-existant ancestors", ".fototab > .thumbnails > a", [] );
});

test("attributes", function() {
	expect( 54 );

	var attrbad, div, withScript;

	t( "Find elements with a tabindex attribute", "[tabindex]", ["listWithTabIndex", "foodWithNegativeTabIndex", "linkWithTabIndex", "linkWithNegativeTabIndex", "linkWithNoHrefWithTabIndex", "linkWithNoHrefWithNegativeTabIndex"] );

	t( "Attribute Exists", "#qunit-fixture a[title]", ["google"] );
	t( "Attribute Exists (case-insensitive)", "#qunit-fixture a[TITLE]", ["google"] );
	t( "Attribute Exists", "#qunit-fixture *[title]", ["google"] );
	t( "Attribute Exists", "#qunit-fixture [title]", ["google"] );
	t( "Attribute Exists", "#qunit-fixture a[ title ]", ["google"] );

	t( "Boolean attribute exists", "#select2 option[selected]", ["option2d"]);
	t( "Boolean attribute equals", "#select2 option[selected='selected']", ["option2d"]);

	t( "Attribute Equals", "#qunit-fixture a[rel='bookmark']", ["simon1"] );
	t( "Attribute Equals", "#qunit-fixture a[rel='bookmark']", ["simon1"] );
	t( "Attribute Equals", "#qunit-fixture a[rel=bookmark]", ["simon1"] );
	t( "Attribute Equals", "#qunit-fixture a[href='http://www.google.com/']", ["google"] );
	t( "Attribute Equals", "#qunit-fixture a[ rel = 'bookmark' ]", ["simon1"] );
	t( "Attribute Equals Number", "#qunit-fixture option[value=1]", ["option1b","option2b","option3b","option4b","option5c"] );
	t( "Attribute Equals Number", "#qunit-fixture li[tabIndex=-1]", ["foodWithNegativeTabIndex"] );

	document.getElementById("anchor2").href = "#2";
	t( "href Attribute", "p a[href^=#]", ["anchor2"] );
	t( "href Attribute", "p a[href*=#]", ["simon1", "anchor2"] );

	t( "for Attribute", "form label[for]", ["label-for"] );
	t( "for Attribute in form", "#form [for=action]", ["label-for"] );

	t( "Attribute containing []", "input[name^='foo[']", ["hidden2"] );
	t( "Attribute containing []", "input[name^='foo[bar]']", ["hidden2"] );
	t( "Attribute containing []", "input[name*='[bar]']", ["hidden2"] );
	t( "Attribute containing []", "input[name$='bar]']", ["hidden2"] );
	t( "Attribute containing []", "input[name$='[bar]']", ["hidden2"] );
	t( "Attribute containing []", "input[name$='foo[bar]']", ["hidden2"] );
	t( "Attribute containing []", "input[name*='foo[bar]']", ["hidden2"] );

	t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type='hidden']", ["radio1", "radio2", "hidden1"] );
	t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=\"hidden\"]", ["radio1", "radio2", "hidden1"] );
	t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=hidden]", ["radio1", "radio2", "hidden1"] );

	t( "Attribute selector using UTF8", "span[lang=中文]", ["台北"] );

	t( "Attribute Begins With", "a[href ^= 'http://www']", ["google","yahoo"] );
	t( "Attribute Ends With", "a[href $= 'org/']", ["mark"] );
	t( "Attribute Contains", "a[href *= 'google']", ["google","groups"] );
	t( "Attribute Is Not Equal", "#ap a[hreflang!='en']", ["google","groups","anchor1"] );

	t( "Empty values", "#select1 option[value='']", ["option1a"] );
	t( "Empty values", "#select1 option[value!='']", ["option1b","option1c","option1d"] );

	t( "Select options via :selected", "#select1 option:selected", ["option1a"] );
	t( "Select options via :selected", "#select2 option:selected", ["option2d"] );
	t( "Select options via :selected", "#select3 option:selected", ["option3b", "option3c"] );
	t( "Select options via :selected", "select[name='select2'] option:selected", ["option2d"] );

	t( "Grouped Form Elements", "input[name='foo[bar]']", ["hidden2"] );

	// Make sure attribute value quoting works correctly. See jQuery #6093; #6428; #13894
	// Use seeded results to bypass querySelectorAll optimizations
	attrbad = jQuery(
		"<input type='hidden' id='attrbad_space' name='foo bar'/>" +
		"<input type='hidden' id='attrbad_dot' value='2' name='foo.baz'/>" +
		"<input type='hidden' id='attrbad_brackets' value='2' name='foo[baz]'/>" +
		"<input type='hidden' id='attrbad_injection' data-attr='foo_baz&#39;]'/>" +
		"<input type='hidden' id='attrbad_quote' data-attr='&#39;'/>" +
		"<input type='hidden' id='attrbad_backslash' data-attr='&#92;'/>" +
		"<input type='hidden' id='attrbad_backslash_quote' data-attr='&#92;&#39;'/>" +
		"<input type='hidden' id='attrbad_backslash_backslash' data-attr='&#92;&#92;'/>" +
		"<input type='hidden' id='attrbad_unicode' data-attr='&#x4e00;'/>"
	).appendTo("#qunit-fixture").get();

	t( "Underscores don't need escaping", "input[id=types_all]", ["types_all"] );

	t( "input[type=text]", "#form input[type=text]", ["text1", "text2", "hidden2", "name"] );
	t( "input[type=search]", "#form input[type=search]", ["search"] );

	withScript = supportjQuery( "<div><span><script src=''/></span></div>" );
	ok( withScript.find( "#moretests script[src]" ).has( "script" ), "script[src] (jQuery #13777)" );

	div = document.getElementById("foo");
	t( "Object.prototype property \"constructor\" (negative)", "[constructor]", [] );
	t( "Gecko Object.prototype property \"watch\" (negative)", "[watch]", [] );
	div.setAttribute( "constructor", "foo" );
	div.setAttribute( "watch", "bar" );
	t( "Object.prototype property \"constructor\"", "[constructor='foo']", ["foo"] );
	t( "Gecko Object.prototype property \"watch\"", "[watch='bar']", ["foo"] );

	t( "Value attribute is retrieved correctly", "input[value=Test]", ["text1", "text2"] );

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

test("jQuery.unique", function() {
	expect( 14 );

	function Arrayish( arr ) {
		var i = this.length = arr.length;
		while ( i-- ) {
			this[ i ] = arr[ i ];
		}
	}
	Arrayish.prototype = {
		slice: [].slice,
		sort: [].sort,
		splice: [].splice
	};

	var i, tests,
		detached = [],
		body = document.body,
		fixture = document.getElementById("qunit-fixture"),
		detached1 = document.createElement("p"),
		detached2 = document.createElement("ul"),
		detachedChild = detached1.appendChild( document.createElement("a") ),
		detachedGrandchild = detachedChild.appendChild( document.createElement("b") );

	for ( i = 0; i < 12; i++ ) {
		detached.push( document.createElement("li") );
		detached[i].id = "detached" + i;
		detached2.appendChild( document.createElement("li") ).id = "detachedChild" + i;
	}

	tests = {
		"Empty": {
			input: [],
			expected: []
		},
		"Single-element": {
			input: [ fixture ],
			expected: [ fixture ]
		},
		"No duplicates": {
			input: [ fixture, body ],
			expected: [ body, fixture ]
		},
		"Duplicates": {
			input: [ body, fixture, fixture, body ],
			expected: [ body, fixture ]
		},
		"Detached": {
			input: detached.slice( 0 ),
			expected: detached.slice( 0 )
		},
		"Detached children": {
			input: [
				detached2.childNodes[0],
				detached2.childNodes[1],
				detached2.childNodes[2],
				detached2.childNodes[3]
			],
			expected: [
				detached2.childNodes[0],
				detached2.childNodes[1],
				detached2.childNodes[2],
				detached2.childNodes[3]
			]
		},
		"Attached/detached mixture": {
			input: [ detached1, fixture, detached2, document, detachedChild, body, detachedGrandchild ],
			expected: [ document, body, fixture ],
			length: 3
		}
	};

	jQuery.each( tests, function( label, test ) {
		var length = test.length || test.input.length;
		deepEqual( jQuery.unique( test.input ).slice( 0, length ), test.expected, label + " (array)" );
		deepEqual( jQuery.unique( new Arrayish(test.input) ).slice( 0, length ), test.expected, label + " (quasi-array)" );
	});
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
