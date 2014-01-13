module("selector", { teardown: moduleTeardown });

// #### NOTE: ####
// jQuery should not be used in this module
// except for DOM manipulation
// If jQuery is mandatory for the selection, move the test to jquery/test/unit/selector.js
// Use t() or Sizzle()
// ###############

/*
	======== QUnit Reference ========
	http://docs.jquery.com/QUnit

	Test methods:
		expect(numAssertions)
		stop()
		start()
			note: QUnit's eventual addition of an argument to stop/start is ignored in this test suite
			so that start and stop can be passed as callbacks without worrying about
				their parameters
	Test assertions:
		ok(value, [message])
		equal(actual, expected, [message])
		notEqual(actual, expected, [message])
		deepEqual(actual, expected, [message])
		notDeepEqual(actual, expected, [message])
		strictEqual(actual, expected, [message])
		notStrictEqual(actual, expected, [message])
		raises(block, [expected], [message])

	======== testinit.js reference ========
	See data/testinit.js

	q(...);
		Returns an array of elements with the given IDs
		@example q("main", "foo", "bar") => [<div id="main">, <span id="foo">, <input id="bar">]

	t( testName, selector, [ "array", "of", "ids" ] );
		Asserts that a select matches the given IDs
		@example t("Check for something", "//[a]", ["foo", "baar"]);

	url( "some/url.php" );
		Add random number to url to stop caching
		@example url("data/test.html") => "data/test.html?10538358428943"
		@example url("data/test.php?foo=bar") => "data/test.php?foo=bar&10538358345554"
*/

test("element", function() {
	expect( 39 );

	var form, all, good, i, obj1, lengthtest,
		siblingTest, siblingNext, iframe, iframeDoc, html;

	equal( Sizzle("").length, 0, "Empty selector returns an empty array" );
	deepEqual( Sizzle("div", document.createTextNode("")), [], "Text element as context fails silently" );
	form = document.getElementById("form");
	ok( !Sizzle.matchesSelector( form, "" ), "Empty string passed to matchesSelector does not match" );
	equal( Sizzle(" ").length, 0, "Empty selector returns an empty array" );
	equal( Sizzle("\t").length, 0, "Empty selector returns an empty array" );

	ok( Sizzle("*").length >= 30, "Select all" );
	all = Sizzle("*");
	good = true;
	for ( i = 0; i < all.length; i++ ) {
		if ( all[i].nodeType === 8 ) {
			good = false;
		}
	}
	ok( good, "Select all elements, no comment nodes" );
	t( "Element Selector", "html", ["html"] );
	t( "Element Selector", "body", ["body"] );
	t( "Element Selector", "#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );

	t( "Leading space", " #qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
	t( "Leading tab", "\t#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
	t( "Leading carriage return", "\r#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
	t( "Leading line feed", "\n#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
	t( "Leading form feed", "\f#qunit-fixture p", ["firstp","ap","sndp","en","sap","first"] );
	t( "Trailing space", "#qunit-fixture p ", ["firstp","ap","sndp","en","sap","first"] );
	t( "Trailing tab", "#qunit-fixture p\t", ["firstp","ap","sndp","en","sap","first"] );
	t( "Trailing carriage return", "#qunit-fixture p\r", ["firstp","ap","sndp","en","sap","first"] );
	t( "Trailing line feed", "#qunit-fixture p\n", ["firstp","ap","sndp","en","sap","first"] );
	t( "Trailing form feed", "#qunit-fixture p\f", ["firstp","ap","sndp","en","sap","first"] );

	t( "Parent Element", "dl ol", ["empty", "listWithTabIndex"] );
	t( "Parent Element (non-space descendant combinator)", "dl\tol", ["empty", "listWithTabIndex"] );
	obj1 = document.getElementById("object1");
	equal( Sizzle("param", obj1).length, 2, "Object/param as context" );

	deepEqual( Sizzle("select", form), q("select1","select2","select3","select4","select5"), "Finding selects with a context." );

	// Check for unique-ness and sort order
	deepEqual( Sizzle("p, div p"), Sizzle("p"), "Check for duplicates: p, div p" );

	t( "Checking sort order", "h2, h1", ["qunit-header", "qunit-banner", "qunit-userAgent"] );
	t( "Checking sort order", "h2:first, h1:first", ["qunit-header", "qunit-banner"] );
	t( "Checking sort order", "#qunit-fixture p, #qunit-fixture p a", ["firstp", "simon1", "ap", "google", "groups", "anchor1", "mark", "sndp", "en", "yahoo", "sap", "anchor2", "simon", "first"] );

	// Test Conflict ID
	lengthtest = document.getElementById("lengthtest");
	deepEqual( Sizzle("#idTest", lengthtest), q("idTest"), "Finding element with id of ID." );
	deepEqual( Sizzle("[name='id']", lengthtest), q("idTest"), "Finding element with id of ID." );
	deepEqual( Sizzle("input[id='idTest']", lengthtest), q("idTest"), "Finding elements with id of ID." );

	siblingTest = document.getElementById("siblingTest");
	deepEqual( Sizzle("div em", siblingTest), [], "Element-rooted QSA does not select based on document context" );
	deepEqual( Sizzle("div em, div em, div em:not(div em)", siblingTest), [], "Element-rooted QSA does not select based on document context" );
	deepEqual( Sizzle("div em, em\\,", siblingTest), [], "Escaped commas do not get treated with an id in element-rooted QSA" );

	siblingNext = document.getElementById("siblingnext");
	document.createDocumentFragment().appendChild( siblingTest );
	deepEqual( Sizzle( "em + :not(:has(*)):not(:empty), foo", siblingTest ), [ siblingNext ],
		"Non-qSA path correctly sets detached context for sibling selectors (jQuery #14351)" );

	iframe = document.getElementById("iframe"),
		iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
	iframeDoc.open();
	iframeDoc.write("<body><p id='foo'>bar</p></body>");
	iframeDoc.close();
	deepEqual(
		Sizzle( "p:contains(bar)", iframeDoc ),
		[ iframeDoc.getElementById("foo") ],
		"Other document as context"
	);

	html = "";
	for ( i = 0; i < 100; i++ ) {
		html = "<div>" + html + "</div>";
	}
	html = jQuery( html ).appendTo( document.body );
	ok( !!Sizzle("body div div div").length, "No stack or performance problems with large amounts of descendents" );
	ok( !!Sizzle("body>div div div").length, "No stack or performance problems with large amounts of descendents" );
	html.remove();

	// Real use case would be using .watch in browsers with window.watch (see Issue #157)
	q("qunit-fixture")[0].appendChild( document.createElement("toString") ).id = "toString";
	t( "Element name matches Object.prototype property", "toString#toString", ["toString"] );
});

test("XML Document Selectors", function() {
	var xml = createWithFriesXML();
	expect( 11 );

	equal( Sizzle("foo_bar", xml).length, 1, "Element Selector with underscore" );
	equal( Sizzle(".component", xml).length, 1, "Class selector" );
	equal( Sizzle("[class*=component]", xml).length, 1, "Attribute selector for class" );
	equal( Sizzle("property[name=prop2]", xml).length, 1, "Attribute selector with name" );
	equal( Sizzle("[name=prop2]", xml).length, 1, "Attribute selector with name" );
	equal( Sizzle("#seite1", xml).length, 1, "Attribute selector with ID" );
	equal( Sizzle("component#seite1", xml).length, 1, "Attribute selector with ID" );
	equal( Sizzle.matches( "#seite1", Sizzle("component", xml) ).length, 1, "Attribute selector filter with ID" );
	equal( Sizzle("meta property thing", xml).length, 2, "Descendent selector and dir caching" );
	ok( Sizzle.matchesSelector( xml.lastChild, "soap\\:Envelope" ), "Check for namespaced element" );

	xml = jQuery.parseXML("<?xml version='1.0' encoding='UTF-8'?><root><elem id='1'/></root>");
	equal( Sizzle( "elem:not(:has(*))", xml ).length, 1,
		"Non-qSA path correctly handles numeric ids (jQuery #14142)" );
});

test("broken", function() {
	expect( 26 );

	var attrbad,
		broken = function( name, selector ) {
			raises(function() {
				// Setting context to null here somehow avoids QUnit's window.error handling
				// making the e & e.message correct
				// For whatever reason, without this,
				// Sizzle.error will be called but no error will be seen in oldIE
				Sizzle.call( null, selector );
			}, function( e ) {
				return e.message.indexOf("Syntax error") >= 0;
			}, name + ": " + selector );
		};

	broken( "Broken Selector", "[" );
	broken( "Broken Selector", "(" );
	broken( "Broken Selector", "{" );
	broken( "Broken Selector", "<" );
	broken( "Broken Selector", "()" );
	broken( "Broken Selector", "<>" );
	broken( "Broken Selector", "{}" );
	broken( "Broken Selector", "," );
	broken( "Broken Selector", ",a" );
	broken( "Broken Selector", "a," );
	// Hangs on IE 9 if regular expression is inefficient
	broken( "Broken Selector", "[id=012345678901234567890123456789");
	broken( "Doesn't exist", ":visble" );
	broken( "Nth-child", ":nth-child" );
	// Sigh again. IE 9 thinks this is also a real selector
	// not super critical that we fix this case
	//broken( "Nth-child", ":nth-child(-)" );
	// Sigh. WebKit thinks this is a real selector in qSA
	// They've already fixed this and it'll be coming into
	// current browsers soon. Currently, Safari 5.0 still has this problem
	// broken( "Nth-child", ":nth-child(asdf)", [] );
	broken( "Nth-child", ":nth-child(2n+-0)" );
	broken( "Nth-child", ":nth-child(2+0)" );
	broken( "Nth-child", ":nth-child(- 1n)" );
	broken( "Nth-child", ":nth-child(-1 n)" );
	broken( "First-child", ":first-child(n)" );
	broken( "Last-child", ":last-child(n)" );
	broken( "Only-child", ":only-child(n)" );
	broken( "Nth-last-last-child", ":nth-last-last-child(1)" );
	broken( "First-last-child", ":first-last-child" );
	broken( "Last-last-child", ":last-last-child" );
	broken( "Only-last-child", ":only-last-child" );

	// Make sure attribute value quoting works correctly. See: #6093
	attrbad = jQuery("<input type='hidden' value='2' name='foo.baz' id='attrbad1'/><input type='hidden' value='2' name='foo[baz]' id='attrbad2'/>").appendTo("#qunit-fixture");

	broken( "Attribute not escaped", "input[name=foo.baz]", [] );
	// Shouldn't be matching those inner brackets
	broken( "Attribute not escaped", "input[name=foo[baz]]", [] );
});

test("id", function() {
	expect( 34 );

	var fiddle, a;

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
	t( "Escaped ID with descendent", "#foo\\:bar span:not(:input)", ["foo_descendent"] );
	t( "Escaped ID", "#test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Descendant escaped ID", "div #foo\\:bar", ["foo:bar"] );
	t( "Descendant escaped ID", "div #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Child escaped ID", "form > #foo\\:bar", ["foo:bar"] );
	t( "Child escaped ID", "form > #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );

	fiddle = jQuery("<div id='fiddle\\Foo'><span id='fiddleSpan'></span></div>").appendTo("#qunit-fixture");
	deepEqual( Sizzle( "> span", Sizzle("#fiddle\\\\Foo")[0] ), q([ "fiddleSpan" ]), "Escaped ID as context" );
	fiddle.remove();

	t( "ID Selector, child ID present", "#form > #radio1", ["radio1"] ); // bug #267
	t( "ID Selector, not an ancestor ID", "#form #first", [] );
	t( "ID Selector, not a child ID", "#form > #option1a", [] );

	t( "All Children of ID", "#foo > *", ["sndp", "en", "sap"] );
	t( "All Children of ID with no children", "#firstUL > *", [] );

	equal( Sizzle("#tName1")[0].id, "tName1", "ID selector with same value for a name attribute" );
	t( "ID selector non-existing but name attribute on an A tag",         "#tName2",      [] );
	t( "Leading ID selector non-existing but name attribute on an A tag", "#tName2 span", [] );
	t( "Leading ID selector existing, retrieving the child",              "#tName1 span", ["tName1-span"] );
	equal( Sizzle("div > div #tName1")[0].id, Sizzle("#tName1-span")[0].parentNode.id, "Ending with ID" );

	a = jQuery("<a id='backslash\\foo'></a>").appendTo("#qunit-fixture");
	t( "ID Selector contains backslash", "#backslash\\\\foo", ["backslash\\foo"] );

	t( "ID Selector on Form with an input that has a name of 'id'", "#lengthtest", ["lengthtest"] );

	t( "ID selector with non-existant ancestor", "#asdfasdf #foobar", [] ); // bug #986

	deepEqual( Sizzle("div#form", document.body), [], "ID selector within the context of another element" );

	t( "Underscore ID", "#types_all", ["types_all"] );
	t( "Dash ID", "#qunit-fixture", ["qunit-fixture"] );

	t( "ID with weird characters in it", "#name\\+value", ["name+value"] );
});

test("class", function() {
	expect( 26 );

	t( "Class Selector", ".blog", ["mark","simon"] );
	t( "Class Selector", ".GROUPS", ["groups"] );
	t( "Class Selector", ".blog.link", ["simon"] );
	t( "Class Selector w/ Element", "a.blog", ["mark","simon"] );
	t( "Parent Class Selector", "p .blog", ["mark","simon"] );

	t( "Class selector using UTF8", ".台北Táiběi", ["utf8class1"] );
	//t( "Class selector using UTF8", ".台北", ["utf8class1","utf8class2"] );
	t( "Class selector using UTF8", ".台北Táiběi.台北", ["utf8class1"] );
	t( "Class selector using UTF8", ".台北Táiběi, .台北", ["utf8class1","utf8class2"] );
	t( "Descendant class selector using UTF8", "div .台北Táiběi", ["utf8class1"] );
	t( "Child class selector using UTF8", "form > .台北Táiběi", ["utf8class1"] );

	t( "Escaped Class", ".foo\\:bar", ["foo:bar"] );
	t( "Escaped Class", ".test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Descendant escaped Class", "div .foo\\:bar", ["foo:bar"] );
	t( "Descendant escaped Class", "div .test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Child escaped Class", "form > .foo\\:bar", ["foo:bar"] );
	t( "Child escaped Class", "form > .test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );

	var div = document.createElement("div");
	div.innerHTML = "<div class='test e'></div><div class='test'></div>";
	deepEqual( Sizzle(".e", div), [ div.firstChild ], "Finding a second class." );

	div.lastChild.className = "e";

	deepEqual( Sizzle(".e", div), [ div.firstChild, div.lastChild ], "Finding a modified class." );

	ok( !Sizzle.matchesSelector( div, ".null"), ".null does not match an element with no class" );
	ok( !Sizzle.matchesSelector( div.firstChild, ".null div"), ".null does not match an element with no class" );
	div.className = "null";
	ok( Sizzle.matchesSelector( div, ".null"), ".null matches element with class 'null'" );
	ok( Sizzle.matchesSelector( div.firstChild, ".null div"), "caching system respects DOM changes" );
	ok( !Sizzle.matchesSelector( document, ".foo" ), "testing class on document doesn't error" );
	ok( !Sizzle.matchesSelector( window, ".foo" ), "testing class on window doesn't error" );

	div.lastChild.className += " hasOwnProperty toString";
	deepEqual( Sizzle(".e.hasOwnProperty.toString", div), [ div.lastChild ], "Classes match Object.prototype properties" );

	div = jQuery("<div><svg width='200' height='250' version='1.1' xmlns='http://www.w3.org/2000/svg'><rect x='10' y='10' width='30' height='30' class='foo'></rect></svg></div>")[0];
	equal( Sizzle(".foo", div).length, 1, "Class selector against SVG" );
});

test("name", function() {
	expect( 14 );

	var form;

	t( "Name selector", "input[name=action]", ["text1"] );
	t( "Name selector with single quotes", "input[name='action']", ["text1"] );
	t( "Name selector with double quotes", "input[name=\"action\"]", ["text1"] );

	t( "Name selector non-input", "[name=example]", ["name-is-example"] );
	t( "Name selector non-input", "[name=div]", ["name-is-div"] );
	t( "Name selector non-input", "*[name=iframe]", ["iframe"] );

	t( "Name selector for grouped input", "input[name='types[]']", ["types_all", "types_anime", "types_movie"] );

	form = document.getElementById("form");
	deepEqual( Sizzle("input[name=action]", form), q("text1"), "Name selector within the context of another element" );
	deepEqual( Sizzle("input[name='foo[bar]']", form), q("hidden2"), "Name selector for grouped form element within the context of another element" );

	form = jQuery("<form><input name='id'/></form>").appendTo("body");
	equal( Sizzle("input", form[0]).length, 1, "Make sure that rooted queries on forms (with possible expandos) work." );

	form.remove();

	t( "Find elements that have similar IDs", "[name=tName1]", ["tName1ID"] );
	t( "Find elements that have similar IDs", "[name=tName2]", ["tName2ID"] );
	t( "Find elements that have similar IDs", "#tName2ID", ["tName2ID"] );

	t( "Case-sensitivity", "[name=tname1]", [] );
});

test("multiple", function() {
	expect(6);

	t( "Comma Support", "h2, #qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
	t( "Comma Support", "h2 , #qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
	t( "Comma Support", "h2 , #qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
	t( "Comma Support", "h2,#qunit-fixture p", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
	t( "Comma Support", "h2,#qunit-fixture p ", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
	t( "Comma Support", "h2\t,\r#qunit-fixture p\n", ["qunit-banner","qunit-userAgent","firstp","ap","sndp","en","sap","first"] );
});

test("child and adjacent", function() {
	expect( 42 );

	var siblingFirst, en, nothiddendiv;

	t( "Child", "p > a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p> a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p >a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p>a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child w/ Class", "p > a.blog", ["mark","simon"] );
	t( "All Children", "code > *", ["anchor1","anchor2"] );
	t( "All Grandchildren", "p > * > *", ["anchor1","anchor2"] );
	t( "Adjacent", "#qunit-fixture a + a", ["groups", "tName2ID"] );
	t( "Adjacent", "#qunit-fixture a +a", ["groups", "tName2ID"] );
	t( "Adjacent", "#qunit-fixture a+ a", ["groups", "tName2ID"] );
	t( "Adjacent", "#qunit-fixture a+a", ["groups", "tName2ID"] );
	t( "Adjacent", "p + p", ["ap","en","sap"] );
	t( "Adjacent", "p#firstp + p", ["ap"] );
	t( "Adjacent", "p[lang=en] + p", ["sap"] );
	t( "Adjacent", "a.GROUPS + code + a", ["mark"] );
	t( "Comma, Child, and Adjacent", "#qunit-fixture a + a, code > a", ["groups","anchor1","anchor2","tName2ID"] );
	t( "Element Preceded By", "#qunit-fixture p ~ div", ["foo", "nothiddendiv", "moretests","tabindex-tests", "liveHandlerOrder", "siblingTest"] );
	t( "Element Preceded By", "#first ~ div", ["moretests","tabindex-tests", "liveHandlerOrder", "siblingTest"] );
	t( "Element Preceded By", "#groups ~ a", ["mark"] );
	t( "Element Preceded By", "#length ~ input", ["idTest"] );
	t( "Element Preceded By", "#siblingfirst ~ em", ["siblingnext", "siblingthird"] );
	t( "Element Preceded By (multiple)", "#siblingTest em ~ em ~ em ~ span", ["siblingspan"] );
	t( "Element Preceded By, Containing", "#liveHandlerOrder ~ div em:contains('1')", ["siblingfirst"] );

	siblingFirst = document.getElementById("siblingfirst");

	deepEqual( Sizzle("~ em", siblingFirst), q("siblingnext", "siblingthird"), "Element Preceded By with a context." );
	deepEqual( Sizzle("+ em", siblingFirst), q("siblingnext"), "Element Directly Preceded By with a context." );
	deepEqual( Sizzle("~ em:first", siblingFirst), q("siblingnext"), "Element Preceded By positional with a context." );

	en = document.getElementById("en");
	deepEqual( Sizzle("+ p, a", en), q("yahoo", "sap"), "Compound selector with context, beginning with sibling test." );
	deepEqual( Sizzle("a, + p", en), q("yahoo", "sap"), "Compound selector with context, containing sibling test." );

	t( "Multiple combinators selects all levels", "#siblingTest em *", ["siblingchild", "siblinggrandchild", "siblinggreatgrandchild"] );
	t( "Multiple combinators selects all levels", "#siblingTest > em *", ["siblingchild", "siblinggrandchild", "siblinggreatgrandchild"] );
	t( "Multiple sibling combinators doesn't miss general siblings", "#siblingTest > em:first-child + em ~ span", ["siblingspan"] );
	t( "Combinators are not skipped when mixing general and specific", "#siblingTest > em:contains('x') + em ~ span", [] );

	equal( Sizzle("#listWithTabIndex").length, 1, "Parent div for next test is found via ID (#8310)" );
	equal( Sizzle("#listWithTabIndex li:eq(2) ~ li").length, 1, "Find by general sibling combinator (#8310)" );
	equal( Sizzle("#__sizzle__").length, 0, "Make sure the temporary id assigned by sizzle is cleared out (#8310)" );
	equal( Sizzle("#listWithTabIndex").length, 1, "Parent div for previous test is still found via ID (#8310)" );

	t( "Verify deep class selector", "div.blah > p > a", [] );

	t( "No element deep selector", "div.foo > span > a", [] );

	nothiddendiv = document.getElementById("nothiddendiv");
	deepEqual( Sizzle("> :first", nothiddendiv), q("nothiddendivchild"), "Verify child context positional selector" );
	deepEqual( Sizzle("> :eq(0)", nothiddendiv), q("nothiddendivchild"), "Verify child context positional selector" );
	deepEqual( Sizzle("> *:first", nothiddendiv), q("nothiddendivchild"), "Verify child context positional selector" );

	t( "Non-existant ancestors", ".fototab > .thumbnails > a", [] );
});

test("attributes", function() {
	expect( 76 );

	var opt, input, attrbad, div;

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

	deepEqual( Sizzle( "input[data-comma='0,1']" ), [ document.getElementById("el12087") ], "Without context, single-quoted attribute containing ','" );
	deepEqual( Sizzle( "input[data-comma=\"0,1\"]" ), [ document.getElementById("el12087") ], "Without context, double-quoted attribute containing ','" );
	deepEqual( Sizzle( "input[data-comma='0,1']", document.getElementById("t12087") ), [ document.getElementById("el12087") ], "With context, single-quoted attribute containing ','" );
	deepEqual( Sizzle( "input[data-comma=\"0,1\"]", document.getElementById("t12087") ), [ document.getElementById("el12087") ], "With context, double-quoted attribute containing ','" );

	t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type='hidden']", ["radio1", "radio2", "hidden1"] );
	t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=\"hidden\"]", ["radio1", "radio2", "hidden1"] );
	t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=hidden]", ["radio1", "radio2", "hidden1"] );

	t( "Attribute selector using UTF8", "span[lang=中文]", ["台北"] );

	t( "Attribute Begins With", "a[href ^= 'http://www']", ["google","yahoo"] );
	t( "Attribute Ends With", "a[href $= 'org/']", ["mark"] );
	t( "Attribute Contains", "a[href *= 'google']", ["google","groups"] );
	t( "Attribute Is Not Equal", "#ap a[hreflang!='en']", ["google","groups","anchor1"] );

	opt = document.getElementById("option1a");
	opt.setAttribute( "test", "" );

	ok( Sizzle.matchesSelector( opt, "[id*=option1][type!=checkbox]" ), "Attribute Is Not Equal Matches" );
	ok( Sizzle.matchesSelector( opt, "[id*=option1]" ), "Attribute With No Quotes Contains Matches" );
	ok( Sizzle.matchesSelector( opt, "[test=]" ), "Attribute With No Quotes No Content Matches" );
	ok( !Sizzle.matchesSelector( opt, "[test^='']" ), "Attribute with empty string value does not match startsWith selector (^=)" );
	ok( Sizzle.matchesSelector( opt, "[id=option1a]" ), "Attribute With No Quotes Equals Matches" );
	ok( Sizzle.matchesSelector( document.getElementById("simon1"), "a[href*=#]" ), "Attribute With No Quotes Href Contains Matches" );

	t( "Empty values", "#select1 option[value='']", ["option1a"] );
	t( "Empty values", "#select1 option[value!='']", ["option1b","option1c","option1d"] );

	t( "Select options via :selected", "#select1 option:selected", ["option1a"] );
	t( "Select options via :selected", "#select2 option:selected", ["option2d"] );
	t( "Select options via :selected", "#select3 option:selected", ["option3b", "option3c"] );
	t( "Select options via :selected", "select[name='select2'] option:selected", ["option2d"] );

	t( "Grouped Form Elements", "input[name='foo[bar]']", ["hidden2"] );

	input = document.getElementById("text1");
	input.title = "Don't click me";

	ok( Sizzle.matchesSelector( input, "input[title=\"Don't click me\"]" ), "Quote within attribute value does not mess up tokenizer" );

	// Uncomment if the boolHook is removed
	// var check2 = document.getElementById("check2");
	// check2.checked = true;
	// ok( !Sizzle.matches("[checked]", [ check2 ] ), "Dynamic boolean attributes match when they should with Sizzle.matches (#11115)" );

	// jQuery #12303
	input.setAttribute( "data-pos", ":first" );
	ok( Sizzle.matchesSelector( input, "input[data-pos=\\:first]"), "POS within attribute value is treated as an attribute value" );
	ok( Sizzle.matchesSelector( input, "input[data-pos=':first']"), "POS within attribute value is treated as an attribute value" );
	ok( Sizzle.matchesSelector( input, ":input[data-pos=':first']"), "POS within attribute value after pseudo is treated as an attribute value" );
	input.removeAttribute("data-pos");

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

	deepEqual( Sizzle( "input[name=foo\\ bar]", null, null, attrbad ), q("attrbad_space"),
		"Escaped space" );
	deepEqual( Sizzle( "input[name=foo\\.baz]", null, null, attrbad ), q("attrbad_dot"),
		"Escaped dot" );
	deepEqual( Sizzle( "input[name=foo\\[baz\\]]", null, null, attrbad ), q("attrbad_brackets"),
		"Escaped brackets" );
	deepEqual( Sizzle( "input[data-attr='foo_baz\\']']", null, null, attrbad ), q("attrbad_injection"),
		"Escaped quote + right bracket" );

	deepEqual( Sizzle( "input[data-attr='\\'']", null, null, attrbad ), q("attrbad_quote"),
		"Quoted quote" );
	deepEqual( Sizzle( "input[data-attr='\\\\']", null, null, attrbad ), q("attrbad_backslash"),
		"Quoted backslash" );
	deepEqual( Sizzle( "input[data-attr='\\\\\\'']", null, null, attrbad ), q("attrbad_backslash_quote"),
		"Quoted backslash quote" );
	deepEqual( Sizzle( "input[data-attr='\\\\\\\\']", null, null, attrbad ), q("attrbad_backslash_backslash"),
		"Quoted backslash backslash" );

	deepEqual( Sizzle( "input[data-attr='\\5C\\\\']", null, null, attrbad ), q("attrbad_backslash_backslash"),
		"Quoted backslash backslash (numeric escape)" );
	deepEqual( Sizzle( "input[data-attr='\\5C \\\\']", null, null, attrbad ), q("attrbad_backslash_backslash"),
		"Quoted backslash backslash (numeric escape with trailing space)" );
	deepEqual( Sizzle( "input[data-attr='\\5C\t\\\\']", null, null, attrbad ), q("attrbad_backslash_backslash"),
		"Quoted backslash backslash (numeric escape with trailing tab)" );
	deepEqual( Sizzle( "input[data-attr='\\04e00']", null, null, attrbad ), q("attrbad_unicode"),
		"Long numeric escape (BMP)" );
	document.getElementById("attrbad_unicode").setAttribute( "data-attr", "\uD834\uDF06A" );
	// It was too much code to fix Safari 5.x Supplemental Plane crashes (see ba5f09fa404379a87370ec905ffa47f8ac40aaa3)
	// deepEqual( Sizzle( "input[data-attr='\\01D306A']", null, null, attrbad ), q("attrbad_unicode"),
	// 	"Long numeric escape (non-BMP)" );

	t( "input[type=text]", "#form input[type=text]", ["text1", "text2", "hidden2", "name"] );
	t( "input[type=search]", "#form input[type=search]", ["search"] );
	t( "script[src] (jQuery #13777)", "#moretests script[src]", ["script-src"] );

	// #3279
	div = document.createElement("div");
	div.innerHTML = "<div id='foo' xml:test='something'></div>";

	deepEqual( Sizzle( "[xml\\:test]", div ), [ div.firstChild ], "Finding by attribute with escaped characters." );

	div = document.getElementById("foo");
	t( "Object.prototype property \"constructor\" (negative)", "[constructor]", [] );
	t( "Gecko Object.prototype property \"watch\" (negative)", "[watch]", [] );
	div.setAttribute( "constructor", "foo" );
	div.setAttribute( "watch", "bar" );
	t( "Object.prototype property \"constructor\"", "[constructor='foo']", ["foo"] );
	t( "Gecko Object.prototype property \"watch\"", "[watch='bar']", ["foo"] );

	t( "Value attribute is retrieved correctly", "input[value=Test]", ["text1", "text2"] );
});

test("pseudo - (parent|empty)", function() {
	expect( 3 );
	t( "Empty", "ul:empty", ["firstUL"] );
	t( "Empty with comment node", "ol:empty", ["empty"] );
	t( "Is A Parent", "#qunit-fixture p:parent", ["firstp","ap","sndp","en","sap","first"] );
});

test("pseudo - (first|last|only)-(child|of-type)", function() {
	expect( 12 );

	t( "First Child", "p:first-child", ["firstp","sndp"] );
	t( "First Child (leading id)", "#qunit-fixture p:first-child", ["firstp","sndp"] );
	t( "First Child (leading class)", ".nothiddendiv div:first-child", ["nothiddendivchild"] );
	t( "First Child (case-insensitive)", "#qunit-fixture p:FIRST-CHILD", ["firstp","sndp"] );

	t( "Last Child", "p:last-child", ["sap"] );
	t( "Last Child (leading id)", "#qunit-fixture a:last-child", ["simon1","anchor1","mark","yahoo","anchor2","simon","liveLink1","liveLink2"] );

	t( "Only Child", "#qunit-fixture a:only-child", ["simon1","anchor1","yahoo","anchor2","liveLink1","liveLink2"] );

	t( "First-of-type", "#qunit-fixture > p:first-of-type", ["firstp"] );
	t( "Last-of-type", "#qunit-fixture > p:last-of-type", ["first"] );
	t( "Only-of-type", "#qunit-fixture > :only-of-type", ["name+value", "firstUL", "empty", "floatTest", "iframe", "table"] );

	// Verify that the child position isn't being cached improperly
	var secondChildren = jQuery("p:nth-child(2)").before("<div></div>");

	t( "No longer second child", "p:nth-child(2)", [] );
	secondChildren.prev().remove();
	t( "Restored second child", "p:nth-child(2)", ["ap","en"] );
});

test("pseudo - nth-child", function() {
	expect( 30 );

	t( "Nth-child", "p:nth-child(1)", ["firstp","sndp"] );
	t( "Nth-child (with whitespace)", "p:nth-child( 1 )", ["firstp","sndp"] );
	t( "Nth-child (case-insensitive)", "#form select:first option:NTH-child(3)", ["option1c"] );
	t( "Not nth-child", "#qunit-fixture p:not(:nth-child(1))", ["ap","en","sap","first"] );

	t( "Nth-child(2)", "#qunit-fixture form#form > *:nth-child(2)", ["text1"] );
	t( "Nth-child(2)", "#qunit-fixture form#form > :nth-child(2)", ["text1"] );

	t( "Nth-child(-1)", "#form select:first option:nth-child(-1)", [] );
	t( "Nth-child(3)", "#form select:first option:nth-child(3)", ["option1c"] );
	t( "Nth-child(0n+3)", "#form select:first option:nth-child(0n+3)", ["option1c"] );
	t( "Nth-child(1n+0)", "#form select:first option:nth-child(1n+0)", ["option1a", "option1b", "option1c", "option1d"] );
	t( "Nth-child(1n)", "#form select:first option:nth-child(1n)", ["option1a", "option1b", "option1c", "option1d"] );
	t( "Nth-child(n)", "#form select:first option:nth-child(n)", ["option1a", "option1b", "option1c", "option1d"] );
	t( "Nth-child(even)", "#form select:first option:nth-child(even)", ["option1b", "option1d"] );
	t( "Nth-child(odd)", "#form select:first option:nth-child(odd)", ["option1a", "option1c"] );
	t( "Nth-child(2n)", "#form select:first option:nth-child(2n)", ["option1b", "option1d"] );
	t( "Nth-child(2n+1)", "#form select:first option:nth-child(2n+1)", ["option1a", "option1c"] );
	t( "Nth-child(2n + 1)", "#form select:first option:nth-child(2n + 1)", ["option1a", "option1c"] );
	t( "Nth-child(+2n + 1)", "#form select:first option:nth-child(+2n + 1)", ["option1a", "option1c"] );
	t( "Nth-child(3n)", "#form select:first option:nth-child(3n)", ["option1c"] );
	t( "Nth-child(3n+1)", "#form select:first option:nth-child(3n+1)", ["option1a", "option1d"] );
	t( "Nth-child(3n+2)", "#form select:first option:nth-child(3n+2)", ["option1b"] );
	t( "Nth-child(3n+3)", "#form select:first option:nth-child(3n+3)", ["option1c"] );
	t( "Nth-child(3n-1)", "#form select:first option:nth-child(3n-1)", ["option1b"] );
	t( "Nth-child(3n-2)", "#form select:first option:nth-child(3n-2)", ["option1a", "option1d"] );
	t( "Nth-child(3n-3)", "#form select:first option:nth-child(3n-3)", ["option1c"] );
	t( "Nth-child(3n+0)", "#form select:first option:nth-child(3n+0)", ["option1c"] );
	t( "Nth-child(-1n+3)", "#form select:first option:nth-child(-1n+3)", ["option1a", "option1b", "option1c"] );
	t( "Nth-child(-n+3)", "#form select:first option:nth-child(-n+3)", ["option1a", "option1b", "option1c"] );
	t( "Nth-child(-1n + 3)", "#form select:first option:nth-child(-1n + 3)", ["option1a", "option1b", "option1c"] );

	deepEqual( Sizzle( ":nth-child(n)", null, null, [ document.createElement("a") ].concat( q("ap") ) ), q("ap"), "Seeded nth-child" );
});

test("pseudo - nth-last-child", function() {
	expect( 30 );

	t( "Nth-last-child", "form:nth-last-child(5)", ["testForm"] );
	t( "Nth-last-child (with whitespace)", "form:nth-last-child( 5 )", ["testForm"] );
	t( "Nth-last-child (case-insensitive)", "#form select:first option:NTH-last-child(3)", ["option1b"] );
	t( "Not nth-last-child", "#qunit-fixture p:not(:nth-last-child(1))", ["firstp", "ap", "sndp", "en", "first"] );

	t( "Nth-last-child(-1)", "#form select:first option:nth-last-child(-1)", [] );
	t( "Nth-last-child(3)", "#form select:first :nth-last-child(3)", ["option1b"] );
	t( "Nth-last-child(3)", "#form select:first *:nth-last-child(3)", ["option1b"] );
	t( "Nth-last-child(3)", "#form select:first option:nth-last-child(3)", ["option1b"] );
	t( "Nth-last-child(0n+3)", "#form select:first option:nth-last-child(0n+3)", ["option1b"] );
	t( "Nth-last-child(1n+0)", "#form select:first option:nth-last-child(1n+0)", ["option1a", "option1b", "option1c", "option1d"] );
	t( "Nth-last-child(1n)", "#form select:first option:nth-last-child(1n)", ["option1a", "option1b", "option1c", "option1d"] );
	t( "Nth-last-child(n)", "#form select:first option:nth-last-child(n)", ["option1a", "option1b", "option1c", "option1d"] );
	t( "Nth-last-child(even)", "#form select:first option:nth-last-child(even)", ["option1a", "option1c"] );
	t( "Nth-last-child(odd)", "#form select:first option:nth-last-child(odd)", ["option1b", "option1d"] );
	t( "Nth-last-child(2n)", "#form select:first option:nth-last-child(2n)", ["option1a", "option1c"] );
	t( "Nth-last-child(2n+1)", "#form select:first option:nth-last-child(2n+1)", ["option1b", "option1d"] );
	t( "Nth-last-child(2n + 1)", "#form select:first option:nth-last-child(2n + 1)", ["option1b", "option1d"] );
	t( "Nth-last-child(+2n + 1)", "#form select:first option:nth-last-child(+2n + 1)", ["option1b", "option1d"] );
	t( "Nth-last-child(3n)", "#form select:first option:nth-last-child(3n)", ["option1b"] );
	t( "Nth-last-child(3n+1)", "#form select:first option:nth-last-child(3n+1)", ["option1a", "option1d"] );
	t( "Nth-last-child(3n+2)", "#form select:first option:nth-last-child(3n+2)", ["option1c"] );
	t( "Nth-last-child(3n+3)", "#form select:first option:nth-last-child(3n+3)", ["option1b"] );
	t( "Nth-last-child(3n-1)", "#form select:first option:nth-last-child(3n-1)", ["option1c"] );
	t( "Nth-last-child(3n-2)", "#form select:first option:nth-last-child(3n-2)", ["option1a", "option1d"] );
	t( "Nth-last-child(3n-3)", "#form select:first option:nth-last-child(3n-3)", ["option1b"] );
	t( "Nth-last-child(3n+0)", "#form select:first option:nth-last-child(3n+0)", ["option1b"] );
	t( "Nth-last-child(-1n+3)", "#form select:first option:nth-last-child(-1n+3)", ["option1b", "option1c", "option1d"] );
	t( "Nth-last-child(-n+3)", "#form select:first option:nth-last-child(-n+3)", ["option1b", "option1c", "option1d"] );
	t( "Nth-last-child(-1n + 3)", "#form select:first option:nth-last-child(-1n + 3)", ["option1b", "option1c", "option1d"] );

	deepEqual( Sizzle( ":nth-last-child(n)", null, null, [ document.createElement("a") ].concat( q("ap") ) ), q("ap"), "Seeded nth-last-child" );
});

test("pseudo - nth-of-type", function() {
	expect( 9 );
	t( "Nth-of-type(-1)", ":nth-of-type(-1)", [] );
	t( "Nth-of-type(3)", "#ap :nth-of-type(3)", ["mark"] );
	t( "Nth-of-type(n)", "#ap :nth-of-type(n)", ["google", "groups", "code1", "anchor1", "mark"] );
	t( "Nth-of-type(0n+3)", "#ap :nth-of-type(0n+3)", ["mark"] );
	t( "Nth-of-type(2n)", "#ap :nth-of-type(2n)", ["groups"] );
	t( "Nth-of-type(even)", "#ap :nth-of-type(even)", ["groups"] );
	t( "Nth-of-type(2n+1)", "#ap :nth-of-type(2n+1)", ["google", "code1", "anchor1", "mark"] );
	t( "Nth-of-type(odd)", "#ap :nth-of-type(odd)", ["google", "code1", "anchor1", "mark"] );
	t( "Nth-of-type(-n+2)", "#qunit-fixture > :nth-of-type(-n+2)", ["firstp", "ap", "foo", "nothiddendiv", "name+value", "firstUL", "empty", "form", "floatTest", "iframe", "lengthtest", "table"] );
});

test("pseudo - nth-last-of-type", function() {
	expect( 9 );
	t( "Nth-last-of-type(-1)", ":nth-last-of-type(-1)", [] );
	t( "Nth-last-of-type(3)", "#ap :nth-last-of-type(3)", ["google"] );
	t( "Nth-last-of-type(n)", "#ap :nth-last-of-type(n)", ["google", "groups", "code1", "anchor1", "mark"] );
	t( "Nth-last-of-type(0n+3)", "#ap :nth-last-of-type(0n+3)", ["google"] );
	t( "Nth-last-of-type(2n)", "#ap :nth-last-of-type(2n)", ["groups"] );
	t( "Nth-last-of-type(even)", "#ap :nth-last-of-type(even)", ["groups"] );
	t( "Nth-last-of-type(2n+1)", "#ap :nth-last-of-type(2n+1)", ["google", "code1", "anchor1", "mark"] );
	t( "Nth-last-of-type(odd)", "#ap :nth-last-of-type(odd)", ["google", "code1", "anchor1", "mark"] );
	t( "Nth-last-of-type(-n+2)", "#qunit-fixture > :nth-last-of-type(-n+2)", ["ap", "name+value", "first", "firstUL", "empty", "floatTest", "iframe", "table", "name-tests", "testForm", "liveHandlerOrder", "siblingTest"] );
});

test("pseudo - has", function() {
	expect( 3 );

	t( "Basic test", "p:has(a)", ["firstp","ap","en","sap"] );
	t( "Basic test (irrelevant whitespace)", "p:has( a )", ["firstp","ap","en","sap"] );
	t( "Nested with overlapping candidates", "#qunit-fixture div:has(div:has(div:not([id])))", [ "moretests", "t2037" ] );
});

test("pseudo - misc", function() {
	expect( 39 );

	var select, tmp, input;

	t( "Headers", ":header", ["qunit-header", "qunit-banner", "qunit-userAgent"] );
	t( "Headers(case-insensitive)", ":Header", ["qunit-header", "qunit-banner", "qunit-userAgent"] );
	t( "Multiple matches with the same context (cache check)", "#form select:has(option:first-child:contains('o'))", ["select1", "select2", "select3", "select4"] );

	ok( Sizzle("#qunit-fixture :not(:has(:has(*)))").length, "All not grandparents" );

	select = document.getElementById("select1");
	ok( Sizzle.matchesSelector( select, ":has(option)" ), "Has Option Matches" );

	ok( Sizzle("a:contains('')").length, "Empty string contains" );
	t( "Text Contains", "a:contains(Google)", ["google","groups"] );
	t( "Text Contains", "a:contains(Google Groups)", ["groups"] );

	t( "Text Contains", "a:contains('Google Groups (Link)')", ["groups"] );
	t( "Text Contains", "a:contains(\"(Link)\")", ["groups"] );
	t( "Text Contains", "a:contains(Google Groups (Link))", ["groups"] );
	t( "Text Contains", "a:contains((Link))", ["groups"] );


	tmp = document.createElement("div");
	tmp.id = "tmp_input";
	document.body.appendChild( tmp );

	jQuery.each( [ "button", "submit", "reset" ], function( i, type ) {
		var els = jQuery(
			"<input id='input_%' type='%'/><button id='button_%' type='%'>test</button>"
			.replace( /%/g, type )
		).appendTo( tmp );

		t( "Input Buttons :" + type, "#tmp_input :" + type, [ "input_" + type, "button_" + type ] );

		ok( Sizzle.matchesSelector( els[0], ":" + type ), "Input Matches :" + type );
		ok( Sizzle.matchesSelector( els[1], ":" + type ), "Button Matches :" + type );
	});

	document.body.removeChild( tmp );

	// Recreate tmp
	tmp = document.createElement("div");
	tmp.id = "tmp_input";
	tmp.innerHTML = "<span>Hello I am focusable.</span>";
	// Setting tabIndex should make the element focusable
	// http://dev.w3.org/html5/spec/single-page.html#focus-management
	document.body.appendChild( tmp );
	tmp.tabIndex = 0;
	tmp.focus();
	if ( document.activeElement !== tmp || (document.hasFocus && !document.hasFocus()) ||
		(document.querySelectorAll && !document.querySelectorAll("div:focus").length) ) {
		ok( true, "The div was not focused. Skip checking the :focus match." );
		ok( true, "The div was not focused. Skip checking the :focus match." );
	} else {
		t( "tabIndex element focused", ":focus", [ "tmp_input" ] );
		ok( Sizzle.matchesSelector( tmp, ":focus" ), ":focus matches tabIndex div" );
	}

	// Blur tmp
	tmp.blur();
	document.body.focus();
	ok( !Sizzle.matchesSelector( tmp, ":focus" ), ":focus doesn't match tabIndex div" );
	document.body.removeChild( tmp );

	// Input focus/active
	input = document.createElement("input");
	input.type = "text";
	input.id = "focus-input";

	document.body.appendChild( input );
	input.focus();

	// Inputs can't be focused unless the document has focus
	if ( document.activeElement !== input || (document.hasFocus && !document.hasFocus()) ||
		(document.querySelectorAll && !document.querySelectorAll("input:focus").length) ) {
		ok( true, "The input was not focused. Skip checking the :focus match." );
		ok( true, "The input was not focused. Skip checking the :focus match." );
	} else {
		t( "Element focused", "input:focus", [ "focus-input" ] );
		ok( Sizzle.matchesSelector( input, ":focus" ), ":focus matches" );
	}

	input.blur();

	// When IE is out of focus, blur does not work. Force it here.
	if ( document.activeElement === input ) {
		document.body.focus();
	}

	ok( !Sizzle.matchesSelector( input, ":focus" ), ":focus doesn't match" );
	document.body.removeChild( input );



	deepEqual(
		Sizzle( "[id='select1'] *:not(:last-child), [id='select2'] *:not(:last-child)", q("qunit-fixture")[0] ),
		q( "option1a", "option1b", "option1c", "option2a", "option2b", "option2c" ),
		"caching system tolerates recursive selection"
	);

	// Tokenization edge cases
	t( "Sequential pseudos", "#qunit-fixture p:has(:contains(mark)):has(code)", ["ap"] );
	t( "Sequential pseudos", "#qunit-fixture p:has(:contains(mark)):has(code):contains(This link)", ["ap"] );

	t( "Pseudo argument containing ')'", "p:has(>a.GROUPS[src!=')'])", ["ap"] );
	t( "Pseudo argument containing ')'", "p:has(>a.GROUPS[src!=')'])", ["ap"] );
	t( "Pseudo followed by token containing ')'", "p:contains(id=\"foo\")[id!=\\)]", ["sndp"] );
	t( "Pseudo followed by token containing ')'", "p:contains(id=\"foo\")[id!=')']", ["sndp"] );

	t( "Multi-pseudo", "#ap:has(*), #ap:has(*)", ["ap"] );
	t( "Multi-positional", "#ap:gt(0), #ap:lt(1)", ["ap"] );
	t( "Multi-pseudo with leading nonexistent id", "#nonexistent:has(*), #ap:has(*)", ["ap"] );
	t( "Multi-positional with leading nonexistent id", "#nonexistent:gt(0), #ap:lt(1)", ["ap"] );

	t( "Tokenization stressor", "a[class*=blog]:not(:has(*, :contains(!)), :contains(!)), br:contains(]), p:contains(]), :not(:empty):not(:parent)", ["ap", "mark","yahoo","simon"] );
});


test("pseudo - :not", function() {
	expect( 43 );

	t( "Not", "a.blog:not(.link)", ["mark"] );
	t( ":not() with :first", "#foo p:not(:first) .link", ["simon"] );

	t( "Not - multiple", "#form option:not(:contains(Nothing),#option1b,:selected)", ["option1c", "option1d", "option2b", "option2c", "option3d", "option3e", "option4e", "option5b", "option5c"] );
	t( "Not - recursive", "#form option:not(:not(:selected))[id^='option3']", [ "option3b", "option3c"] );

	t( ":not() failing interior", "#qunit-fixture p:not(.foo)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not() failing interior", "#qunit-fixture p:not(div.foo)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not() failing interior", "#qunit-fixture p:not(p.foo)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not() failing interior", "#qunit-fixture p:not(#blargh)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not() failing interior", "#qunit-fixture p:not(div#blargh)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not() failing interior", "#qunit-fixture p:not(p#blargh)", ["firstp","ap","sndp","en","sap","first"] );

	t( ":not Multiple", "#qunit-fixture p:not(a)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not Multiple", "#qunit-fixture p:not( a )", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not Multiple", "#qunit-fixture p:not( p )", [] );
	t( ":not Multiple", "#qunit-fixture p:not(a, b)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not Multiple", "#qunit-fixture p:not(a, b, div)", ["firstp","ap","sndp","en","sap","first"] );
	t( ":not Multiple", "p:not(p)", [] );
	t( ":not Multiple", "p:not(a,p)", [] );
	t( ":not Multiple", "p:not(p,a)", [] );
	t( ":not Multiple", "p:not(a,p,b)", [] );
	t( ":not Multiple", ":input:not(:image,:input,:submit)", [] );
	t( ":not Multiple", "#qunit-fixture p:not(:has(a), :nth-child(1))", ["first"] );

	t( "No element not selector", ".container div:not(.excluded) div", [] );

	t( ":not() Existing attribute", "#form select:not([multiple])", ["select1", "select2", "select5"]);
	t( ":not() Equals attribute", "#form select:not([name=select1])", ["select2", "select3", "select4","select5"]);
	t( ":not() Equals quoted attribute", "#form select:not([name='select1'])", ["select2", "select3", "select4", "select5"]);

	t( ":not() Multiple Class", "#foo a:not(.blog)", ["yahoo", "anchor2"] );
	t( ":not() Multiple Class", "#foo a:not(.link)", ["yahoo", "anchor2"] );
	t( ":not() Multiple Class", "#foo a:not(.blog.link)", ["yahoo", "anchor2"] );

	t( ":not chaining (compound)", "#qunit-fixture div[id]:not(:has(div, span)):not(:has(*))", ["nothiddendivchild", "divWithNoTabIndex"] );
	t( ":not chaining (with attribute)", "#qunit-fixture form[id]:not([action$='formaction']):not(:button)", ["lengthtest", "name-tests", "testForm"] );
	t( ":not chaining (colon in attribute)", "#qunit-fixture form[id]:not([action='form:action']):not(:button)", ["form", "lengthtest", "name-tests", "testForm"] );
	t( ":not chaining (colon in attribute and nested chaining)", "#qunit-fixture form[id]:not([action='form:action']:button):not(:input)", ["form", "lengthtest", "name-tests", "testForm"] );
	t( ":not chaining", "#form select:not(.select1):contains(Nothing) > option:not(option)", [] );

	t( "positional :not()", "#foo p:not(:last)", ["sndp", "en"] );
	t( "positional :not() prefix", "#foo p:not(:last) a", ["yahoo"] );
	t( "compound positional :not()", "#foo p:not(:first, :last)", ["en"] );
	t( "compound positional :not()", "#foo p:not(:first, :even)", ["en"] );
	t( "compound positional :not()", "#foo p:not(:first, :odd)", ["sap"] );
	t( "reordered compound positional :not()", "#foo p:not(:odd, :first)", ["sap"] );

	t( "positional :not() with pre-filter", "#foo p:not([id]:first)", ["en", "sap"] );
	t( "positional :not() with post-filter", "#foo p:not(:first[id])", ["en", "sap"] );
	t( "positional :not() with pre-filter", "#foo p:not([lang]:first)", ["sndp", "sap"] );
	t( "positional :not() with post-filter", "#foo p:not(:first[lang])", ["sndp", "en", "sap"] );
});

test("pseudo - position", function() {
	expect( 33 );

	t( "First element", "div:first", ["qunit"] );
	t( "First element(case-insensitive)", "div:fiRst", ["qunit"] );
	t( "nth Element", "#qunit-fixture p:nth(1)", ["ap"] );
	t( "First Element", "#qunit-fixture p:first", ["firstp"] );
	t( "Last Element", "p:last", ["first"] );
	t( "Even Elements", "#qunit-fixture p:even", ["firstp","sndp","sap"] );
	t( "Odd Elements", "#qunit-fixture p:odd", ["ap","en","first"] );
	t( "Position Equals", "#qunit-fixture p:eq(1)", ["ap"] );
	t( "Position Equals (negative)", "#qunit-fixture p:eq(-1)", ["first"] );
	t( "Position Greater Than", "#qunit-fixture p:gt(0)", ["ap","sndp","en","sap","first"] );
	t( "Position Less Than", "#qunit-fixture p:lt(3)", ["firstp","ap","sndp"] );

	t( "Check position filtering", "div#nothiddendiv:eq(0)", ["nothiddendiv"] );
	t( "Check position filtering", "div#nothiddendiv:last", ["nothiddendiv"] );
	t( "Check position filtering", "div#nothiddendiv:not(:gt(0))", ["nothiddendiv"] );
	t( "Check position filtering", "#foo > :not(:first)", ["en", "sap"] );
	t( "Check position filtering", "#qunit-fixture select > :not(:gt(2))", ["option1a", "option1b", "option1c"] );
	t( "Check position filtering", "#qunit-fixture select:lt(2) :not(:first)", ["option1b", "option1c", "option1d", "option2a", "option2b", "option2c", "option2d"] );
	t( "Check position filtering", "div.nothiddendiv:eq(0)", ["nothiddendiv"] );
	t( "Check position filtering", "div.nothiddendiv:last", ["nothiddendiv"] );
	t( "Check position filtering", "div.nothiddendiv:not(:lt(0))", ["nothiddendiv"] );

	t( "Check element position", "#qunit-fixture div div:eq(0)", ["nothiddendivchild"] );
	t( "Check element position", "#select1 option:eq(3)", ["option1d"] );
	t( "Check element position", "#qunit-fixture div div:eq(10)", ["names-group"] );
	t( "Check element position", "#qunit-fixture div div:first", ["nothiddendivchild"] );
	t( "Check element position", "#qunit-fixture div > div:first", ["nothiddendivchild"] );
	t( "Check element position", "#dl div:first div:first", ["foo"] );
	t( "Check element position", "#dl div:first > div:first", ["foo"] );
	t( "Check element position", "div#nothiddendiv:first > div:first", ["nothiddendivchild"] );
	t( "Chained pseudo after a pos pseudo", "#listWithTabIndex li:eq(0):contains(Rice)", ["foodWithNegativeTabIndex"] );

	t( "Check sort order with POS and comma", "#qunit-fixture em>em>em>em:first-child,div>em:first", ["siblingfirst", "siblinggreatgrandchild"] );

	t( "Isolated position", ":last", ["last"] );

	deepEqual( Sizzle( "*:lt(2) + *", null, [], Sizzle("#qunit-fixture > p") ), q("ap"), "Seeded pos with trailing relative" );

	// jQuery #12526
	var context = jQuery("#qunit-fixture").append("<div id='jquery12526'></div>")[0];
	deepEqual( Sizzle( ":last", context ), q("jquery12526"), "Post-manipulation positional" );
});

test("pseudo - form", function() {
	expect( 10 );

	var extraTexts = jQuery("<input id=\"impliedText\"/><input id=\"capitalText\" type=\"TEXT\">").appendTo("#form");

	t( "Form element :input", "#form :input", ["text1", "text2", "radio1", "radio2", "check1", "check2", "hidden1", "hidden2", "name", "search", "button", "area1", "select1", "select2", "select3", "select4", "select5", "impliedText", "capitalText"] );
	t( "Form element :radio", "#form :radio", ["radio1", "radio2"] );
	t( "Form element :checkbox", "#form :checkbox", ["check1", "check2"] );
	t( "Form element :text", "#form :text", ["text1", "text2", "hidden2", "name", "impliedText", "capitalText"] );
	t( "Form element :radio:checked", "#form :radio:checked", ["radio2"] );
	t( "Form element :checkbox:checked", "#form :checkbox:checked", ["check1"] );
	t( "Form element :radio:checked, :checkbox:checked", "#form :radio:checked, #form :checkbox:checked", ["radio2", "check1"] );

	t( "Selected Option Element", "#form option:selected", ["option1a","option2d","option3b","option3c","option4b","option4c","option4d","option5a"] );
	t( "Selected Option Element are also :checked", "#form option:checked", ["option1a","option2d","option3b","option3c","option4b","option4c","option4d","option5a"] );
	t( "Hidden inputs should be treated as enabled. See QSA test.", "#hidden1:enabled", ["hidden1"] );

	extraTexts.remove();
});

test("pseudo - :target and :root", function() {
	expect( 2 );

	// Target
	var oldHash,
	$link = jQuery("<a/>").attr({
		href: "#",
		id: "new-link"
	}).appendTo("#qunit-fixture");

	oldHash = window.location.hash;
	window.location.hash = "new-link";

	t( ":target", ":target", ["new-link"] );

	$link.remove();
	window.location.hash = oldHash;

	// Root
	equal( Sizzle(":root")[0], document.documentElement, ":root selector" );
});

test("pseudo - :lang", function() {
	expect( 105 );

	var docElem = document.documentElement,
		docXmlLang = docElem.getAttribute("xml:lang"),
		docLang = docElem.lang,
		foo = document.getElementById("foo"),
		anchor = document.getElementById("anchor2"),
		xml = createWithFriesXML(),
		testLang = function( text, elem, container, lang, extra ) {
			var message,
				full = lang + "-" + extra;

			message = "lang=" + lang + " " + text;
			container.setAttribute( container.ownerDocument.documentElement.nodeName === "HTML" ? "lang" : "xml:lang", lang );
			assertMatch( message, elem, ":lang(" + lang + ")" );
			assertMatch( message, elem, ":lang(" + mixCase(lang) + ")" );
			assertNoMatch( message, elem, ":lang(" + full + ")" );
			assertNoMatch( message, elem, ":lang(" + mixCase(full) + ")" );
			assertNoMatch( message, elem, ":lang(" + lang + "-)" );
			assertNoMatch( message, elem, ":lang(" + full + "-)" );
			assertNoMatch( message, elem, ":lang(" + lang + "glish)" );
			assertNoMatch( message, elem, ":lang(" + full + "glish)" );

			message = "lang=" + full + " " + text;
			container.setAttribute( container.ownerDocument.documentElement.nodeName === "HTML" ? "lang" : "xml:lang", full );
			assertMatch( message, elem, ":lang(" + lang + ")" );
			assertMatch( message, elem, ":lang(" + mixCase(lang) + ")" );
			assertMatch( message, elem, ":lang(" + full + ")" );
			assertMatch( message, elem, ":lang(" + mixCase(full) + ")" );
			assertNoMatch( message, elem, ":lang(" + lang + "-)" );
			assertNoMatch( message, elem, ":lang(" + full + "-)" );
			assertNoMatch( message, elem, ":lang(" + lang + "glish)" );
			assertNoMatch( message, elem, ":lang(" + full + "glish)" );
		},
		mixCase = function( str ) {
			var ret = str.split(""),
				i = ret.length;
			while ( i-- ) {
				if ( i & 1 ) {
					ret[i] = ret[i].toUpperCase();
				}
			}
			return ret.join("");
		},
		assertMatch = function( text, elem, selector ) {
			ok( Sizzle.matchesSelector( elem, selector ), text + " match " + selector );
		},
		assertNoMatch = function( text, elem, selector ) {
			ok( !Sizzle.matchesSelector( elem, selector ), text + " fail " + selector );
		};

	// Prefixing and inheritance
	ok( Sizzle.matchesSelector( docElem, ":lang(" + docElem.lang + ")" ), "starting :lang" );
	testLang( "document", anchor, docElem, "en", "us" );
	testLang( "grandparent", anchor, anchor.parentNode.parentNode, "yue", "hk" );
	ok( !Sizzle.matchesSelector( anchor, ":lang(en), :lang(en-us)" ),
		":lang does not look above an ancestor with specified lang" );
	testLang( "self", anchor, anchor, "es", "419" );
	ok( !Sizzle.matchesSelector( anchor, ":lang(en), :lang(en-us), :lang(yue), :lang(yue-hk)" ),
		":lang does not look above self with specified lang" );

	// Searching by language tag
	anchor.parentNode.parentNode.lang = "arab";
	anchor.parentNode.lang = anchor.parentNode.id = "ara-sa";
	anchor.lang = "ara";
	deepEqual( Sizzle( ":lang(ara)", foo ), [ anchor.parentNode, anchor ], "Find by :lang" );

	// Selector validity
	anchor.parentNode.lang = "ara";
	anchor.lang = "ara\\b";
	deepEqual( Sizzle( ":lang(ara\\b)", foo ), [], ":lang respects backslashes" );
	deepEqual( Sizzle( ":lang(ara\\\\b)", foo ), [ anchor ], ":lang respects escaped backslashes" );
	raises(function() {
		Sizzle.call( null, "dl:lang(c++)" );
	}, function( e ) {
		return e.message.indexOf("Syntax error") >= 0;
	}, ":lang value must be a valid identifier" );

	// XML
	foo = jQuery( "response", xml )[0];
	anchor = jQuery( "#seite1", xml )[0];
	testLang( "XML document", anchor, xml.documentElement, "en", "us" );
	testLang( "XML grandparent", anchor, foo, "yue", "hk" );
	ok( !Sizzle.matchesSelector( anchor, ":lang(en), :lang(en-us)" ),
		"XML :lang does not look above an ancestor with specified lang" );
	testLang( "XML self", anchor, anchor, "es", "419" );
	ok( !Sizzle.matchesSelector( anchor, ":lang(en), :lang(en-us), :lang(yue), :lang(yue-hk)" ),
		"XML :lang does not look above self with specified lang" );

	// Cleanup
	if ( docXmlLang == null ) {
		docElem.removeAttribute("xml:lang");
	} else {
		docElem.setAttribute( "xml:lang", docXmlLang );
	}
	docElem.lang = docLang;
});

test("caching", function() {
	expect( 2 );
	Sizzle( ":not(code)", document.getElementById("ap") );
	deepEqual( Sizzle( ":not(code)", document.getElementById("foo") ), q("sndp", "en", "yahoo", "sap", "anchor2", "simon"), "Reusing selector with new context" );

	t( "Deep ancestry caching in post-positional element matcher (jQuery #14657)",
		"#qunit-fixture a:lt(3):parent",
		[ "simon1", "google", "groups" ] );
});

asyncTest( "Iframe dispatch should not affect Sizzle, see jQuery #13936", 1, function() {
	var loaded = false,
		thrown = false,
		iframe = document.getElementById("iframe"),
		iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

	jQuery( iframe ).on( "load", function() {
		var form;

		try {
			iframeDoc = this.contentDocument || this.contentWindow.document;
			form = Sizzle( "#navigate", iframeDoc )[ 0 ];
		} catch ( e ) {
			thrown = e;
		}

		if ( loaded ) {
			strictEqual( thrown, false, "No error thrown from post-reload Sizzle call" );
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

test("matchesSelector", function() {
	expect( 6 );

	var el = document.getElementById("simon1"),
		disconnected = document.createElement("div");

	ok( Sizzle.matchesSelector( el, "[rel='bookmark']" ), "quoted attribute" );
	ok( Sizzle.matchesSelector( el, "[rel=bookmark]" ), "unquoted attribute" );
	ok( Sizzle.matchesSelector( el, "[\nrel = bookmark\t]" ), "unquoted attribute with non-semantic whitespace" );

	ok( Sizzle.matchesSelector( disconnected, "div" ), "disconnected element" );

	ok( Sizzle.matchesSelector( el, "* > *" ), "child combinator (matching)" );
	ok( !Sizzle.matchesSelector( disconnected, "* > *" ), "child combinator (not matching)" );
});
