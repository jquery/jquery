QUnit.module( "selector", {
	beforeEach: function() {

		// Playwright WebKit on macOS doesn't expose `Safari` in its user agent
		// string; use the "AppleWebKit" token. This token is also present
		// in the Chromium UA, but it is locked to an older version there.
		// Modern WebKit (Safari 13+) locks it to `605.1.15`.
		this.safari = /\bapplewebkit\/605\.1\.15\b/i.test( navigator.userAgent );
	},
	afterEach: moduleTeardown
} );

QUnit.test( "empty", function( assert ) {
	assert.expect( 5 );

	var form;

	assert.strictEqual( jQuery( "" ).length, 0,
		"Empty selector returns an empty array" );

	assert.deepEqual( jQuery( "div", document.createTextNode( "" ) ).get(), [],
		"Text element as context fails silently" );
	form = document.getElementById( "form" );
	assert.ok( !jQuery( form ).is( "" ), "Empty string passed to .is() does not match" );

	if ( QUnit.jQuerySelectors ) {
		assert.equal( jQuery( " " ).length, 0, "Empty selector returns an empty array" );
		assert.equal( jQuery( "\t" ).length, 0, "Empty selector returns an empty array" );
	} else {
		assert.ok( "skip", "whitespace-only selector not supported in selector-native" );
		assert.ok( "skip", "whitespace-only selector not supported in selector-native" );
	}
} );

QUnit.test( "star", function( assert ) {
	assert.expect( 2 );

	var good, i;
	var all = jQuery( "*" );

	assert.ok( all.length >= 30, "Select all" );
	good = true;
	for ( i = 0; i < all.length; i++ ) {
		if ( all[ i ].nodeType === 8 ) {
			good = false;
		}
	}
	assert.ok( good, "Select all elements, no comment nodes" );
} );

QUnit.test( "element", function( assert ) {
	assert.expect( 37 );

	var i, lengthtest, siblingTest, html;
	var fixture = document.getElementById( "qunit-fixture" );

	assert.deepEqual( jQuery( "p", fixture ).get(), q( "firstp", "ap", "sndp", "en", "sap", "first" ), "Finding elements with a Node context." );
	assert.deepEqual( jQuery( "p", "#qunit-fixture" ).get(), q( "firstp", "ap", "sndp", "en", "sap", "first" ), "Finding elements with a selector context." );
	assert.deepEqual( jQuery( "p", jQuery( "#qunit-fixture" ) ).get(), q( "firstp", "ap", "sndp", "en", "sap", "first" ), "Finding elements with a jQuery object context." );
	assert.deepEqual( jQuery( "#qunit-fixture" ).find( "p" ).get(), q( "firstp", "ap", "sndp", "en", "sap", "first" ), "Finding elements with a context via .find()." );

	assert.ok( jQuery( "#length" ).length, "<input name=\"length\"> cannot be found under IE, see trac-945" );
	assert.ok( jQuery( "#lengthtest input" ).length, "<input name=\"length\"> cannot be found under IE, see trac-945" );

	// trac-7533
	assert.equal( jQuery( "<div id=\"A'B~C.D[E]\"><p>foo</p></div>" ).find( "p" ).length, 1, "Find where context root is a node and has an ID with CSS3 meta characters" );

	assert.equal( jQuery( "" ).length, 0, "Empty selector returns an empty array" );
	assert.deepEqual( jQuery( "div", document.createTextNode( "" ) ).get(), [],
		"Text element as context fails silently" );

	assert.t( "Element Selector", "html", [ "html" ] );
	assert.t( "Element Selector", "body", [ "body" ] );
	assert.t( "Element Selector", "#qunit-fixture p", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );

	assert.t( "Leading space", " #qunit-fixture p", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( "Leading tab", "\t#qunit-fixture p", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( "Leading carriage return", "\r#qunit-fixture p", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( "Leading line feed", "\n#qunit-fixture p", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( "Leading form feed", "\f#qunit-fixture p", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( "Trailing space", "#qunit-fixture p ", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( "Trailing tab", "#qunit-fixture p\t", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( "Trailing carriage return", "#qunit-fixture p\r",
		[ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( "Trailing line feed", "#qunit-fixture p\n", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( "Trailing form feed", "#qunit-fixture p\f", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );

	assert.deepEqual(
		jQuery( jQuery( "div ol" ) ).filter( "#qunit-fixture *" ).get(),
		q( "empty", "listWithTabIndex" ),
		"Parent Element"
	);
	assert.deepEqual(
		jQuery( jQuery( "div\tol" ) ).filter( "#qunit-fixture *" ).get(),
		q( "empty", "listWithTabIndex" ),
		"Parent Element (non-space descendant combinator)"
	);

	// Check for unique-ness and sort order
	assert.deepEqual( jQuery( "p, div p" ), jQuery( "p" ), "Check for duplicates: p, div p" );

	jQuery( "<h1 id='h1'></h1><h2 id='h2'></h2><h2 id='h2-2'></h2>" ).prependTo( "#qunit-fixture" );
	assert.t( "Checking sort order", "#qunit-fixture h2, #qunit-fixture h1", [ "h1", "h2", "h2-2" ] );

	if ( QUnit.jQuerySelectorsPos ) {
		assert.t( "Checking sort order", "#qunit-fixture h2:first, #qunit-fixture h1:first", [ "h1", "h2" ] );
	} else {
		assert.ok( "skip", "Positional selectors are not supported" );
	}

	assert.t( "Checking sort order", "#qunit-fixture p, #qunit-fixture p a",
		[ "firstp", "simon1", "ap", "google", "groups", "anchor1", "mark", "sndp", "en", "yahoo",
			"sap", "anchor2", "simon", "first" ] );

	// Test Conflict ID
	lengthtest = document.getElementById( "lengthtest" );
	assert.deepEqual( jQuery( "#idTest", lengthtest ).get(), q( "idTest" ),
		"Finding element with id of ID." );
	assert.deepEqual( jQuery( "[name='id']", lengthtest ).get(), q( "idTest" ),
		"Finding element with id of ID." );
	assert.deepEqual( jQuery( "input[id='idTest']", lengthtest ).get(), q( "idTest" ),
		"Finding elements with id of ID." );

	siblingTest = document.getElementById( "siblingTest" );
	assert.deepEqual( jQuery( "div em", siblingTest ).get(), [],
		"Element-rooted QSA does not select based on document context" );
	assert.deepEqual( jQuery( "div em, div em, div em:not(div em)", siblingTest ).get(), [],
		"Element-rooted QSA does not select based on document context" );
	assert.deepEqual( jQuery( "div em, em\\,", siblingTest ).get(), [],
		"Escaped commas do not get treated with an id in element-rooted QSA" );

	html = "";
	for ( i = 0; i < 100; i++ ) {
		html = "<div>" + html + "</div>";
	}
	html = jQuery( html ).appendTo( document.body );
	assert.ok( !!jQuery( "body div div div" ).length,
		"No stack or performance problems with large amounts of descendants" );
	assert.ok( !!jQuery( "body>div div div" ).length,
		"No stack or performance problems with large amounts of descendants" );
	html.remove();

	// Real use case would be using .watch in browsers with window.watch
	// (see https://github.com/jquery/sizzle/pull/157)
	q( "qunit-fixture" )[ 0 ].appendChild( document.createElement( "toString" ) ).id = "toString";
	assert.t( "Element name matches Object.prototype property", "toString#toString", [ "toString" ] );
} );

QUnit.test( "XML Document Selectors", function( assert ) {
	assert.expect( 11 );

	var xml = createWithFriesXML();

	assert.equal( jQuery( "foo_bar", xml ).length, 1, "Element Selector with underscore" );
	assert.equal( jQuery( ".component", xml ).length, 1, "Class selector" );
	assert.equal( jQuery( "[class*=component]", xml ).length, 1, "Attribute selector for class" );
	assert.equal( jQuery( "property[name=prop2]", xml ).length, 1, "Attribute selector with name" );
	assert.equal( jQuery( "[name=prop2]", xml ).length, 1, "Attribute selector with name" );
	assert.equal( jQuery( "#seite1", xml ).length, 1, "Attribute selector with ID" );
	assert.equal( jQuery( "component#seite1", xml ).length, 1, "Attribute selector with ID" );
	assert.equal( jQuery( "component", xml ).filter( "#seite1" ).length, 1,
		"Attribute selector filter with ID" );
	assert.equal( jQuery( "meta property thing", xml ).length, 2,
		"Descendent selector and dir caching" );
	if ( QUnit.jQuerySelectors ) {
		assert.ok( jQuery( xml.lastChild ).is( "soap\\:Envelope" ), "Check for namespaced element" );

		xml = jQuery.parseXML( "<?xml version='1.0' encoding='UTF-8'?><root><elem id='1'/></root>" );

		assert.equal( jQuery( "elem:not(:has(*))", xml ).length, 1,
			"Non-qSA path correctly handles numeric ids (jQuery trac-14142)" );
	} else {
		assert.ok( "skip", "namespaced elements not matching correctly in selector-native" );
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
	}
} );

QUnit.test( "broken selectors throw", function( assert ) {
	assert.expect( 33 );

	function broken( name, selector ) {
		assert.throws( function() {
			jQuery( selector );
		}, name + ": " + selector );
	}

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
	broken( "Post-comma invalid selector", "*,:x" );
	broken( "Identifier with bad escape", "foo\\\fbaz" );
	broken( "Broken Selector", "[id=012345678901234567890123456789" );
	broken( "Doesn't exist", ":visble" );
	broken( "Nth-child", ":nth-child" );
	broken( "Nth-child", ":nth-child(-)" );
	broken( "Nth-child", ":nth-child(asdf)", [] );
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

	// Make sure attribute value quoting works correctly. See: trac-6093
	jQuery( "<input type='hidden' value='2' name='foo.baz' id='attrbad1'/>" +
		"<input type='hidden' value='2' name='foo[baz]' id='attrbad2'/>" )
		.appendTo( "#qunit-fixture" );

	broken( "Attribute equals non-value", "input[name=]" );
	broken( "Attribute equals unquoted non-identifier", "input[name=foo.baz]" );
	broken( "Attribute equals unquoted non-identifier", "input[name=foo[baz]]" );
	broken( "Attribute equals bad string", "input[name=''double-quoted'']" );
	broken( "Attribute equals bad string", "input[name='apostrophe'd']" );
} );

QUnit.test( "id", function( assert ) {
	assert.expect( 34 );

	var fiddle, a;

	assert.t( "ID Selector", "#body", [ "body" ] );
	assert.t( "ID Selector w/ Element", "body#body", [ "body" ] );
	assert.t( "ID Selector w/ Element", "ul#first", [] );
	assert.t( "ID selector with existing ID descendant", "#firstp #simon1", [ "simon1" ] );
	assert.t( "ID selector with non-existent descendant", "#firstp #foobar", [] );
	assert.t( "ID selector using UTF8", "#台北Táiběi", [ "台北Táiběi" ] );
	assert.t( "Multiple ID selectors using UTF8", "#台北Táiběi, #台北", [ "台北Táiběi", "台北" ] );
	assert.t( "Descendant ID selector using UTF8", "div #台北", [ "台北" ] );
	assert.t( "Child ID selector using UTF8", "form > #台北", [ "台北" ] );

	assert.t( "Escaped ID", "#foo\\:bar", [ "foo:bar" ] );

	if ( QUnit.jQuerySelectors ) {
		assert.t( "Escaped ID with descendant", "#foo\\:bar span:not(:input)", [ "foo_descendant" ] );
	} else {
		assert.ok( "skip", ":input not supported in selector-native" );
	}

	assert.t( "Escaped ID", "#test\\.foo\\[5\\]bar", [ "test.foo[5]bar" ] );
	assert.t( "Descendant escaped ID", "div #foo\\:bar", [ "foo:bar" ] );
	assert.t( "Descendant escaped ID", "div #test\\.foo\\[5\\]bar", [ "test.foo[5]bar" ] );
	assert.t( "Child escaped ID", "form > #foo\\:bar", [ "foo:bar" ] );
	assert.t( "Child escaped ID", "form > #test\\.foo\\[5\\]bar", [ "test.foo[5]bar" ] );

	fiddle = jQuery( "<div id='fiddle\\Foo'><span id='fiddleSpan'></span></div>" )
		.appendTo( "#qunit-fixture" );

	assert.deepEqual( jQuery( "> span", jQuery( "#fiddle\\\\Foo" )[ 0 ] ).get(),
		q( [ "fiddleSpan" ] ), "Escaped ID as context" );

	fiddle.remove();

	assert.t( "ID Selector, child ID present", "#form > #radio1", [ "radio1" ] ); // bug trac-267
	assert.t( "ID Selector, not an ancestor ID", "#form #first", [] );
	assert.t( "ID Selector, not a child ID", "#form > #option1a", [] );

	assert.t( "All Children of ID", "#foo > *", [ "sndp", "en", "sap" ] );
	assert.t( "All Children of ID with no children", "#firstUL > *", [] );

	assert.equal( jQuery( "#tName1" )[ 0 ].id, "tName1",
		"ID selector with same value for a name attribute" );
	assert.t( "ID selector non-existing but name attribute on an A tag", "#tName2", [] );
	assert.t( "Leading ID selector non-existing but name attribute on an A tag", "#tName2 span", [] );
	assert.t( "Leading ID selector existing, retrieving the child", "#tName1 span", [ "tName1-span" ] );
	assert.equal( jQuery( "div > div #tName1" )[ 0 ].id, jQuery( "#tName1-span" )[ 0 ].parentNode.id,
		"Ending with ID" );

	a = jQuery( "<a id='backslash\\foo'></a>" ).appendTo( "#qunit-fixture" );
	assert.t( "ID Selector contains backslash", "#backslash\\\\foo", [ "backslash\\foo" ] );
	a.remove();

	assert.t( "ID Selector on Form with an input that has a name of 'id'", "#lengthtest", [ "lengthtest" ] );

	assert.t( "ID selector with non-existent ancestor", "#asdfasdf #foobar", [] ); // bug trac-986

	assert.deepEqual( jQuery( "div#form", document.body ).get(), [],
		"ID selector within the context of another element" );

	assert.t( "Underscore ID", "#types_all", [ "types_all" ] );
	assert.t( "Dash ID", "#qunit-fixture", [ "qunit-fixture" ] );

	assert.t( "ID with weird characters in it", "#name\\+value", [ "name+value" ] );
} );

QUnit.test( "class", function( assert ) {
	assert.expect( 32 );

	assert.deepEqual( jQuery( ".blog", document.getElementsByTagName( "p" ) ).get(),
		q( "mark", "simon" ), "Finding elements with a context." );
	assert.deepEqual( jQuery( ".blog", "p" ).get(),
		q( "mark", "simon" ), "Finding elements with a context." );
	assert.deepEqual( jQuery( ".blog", jQuery( "p" ) ).get(),
		q( "mark", "simon" ), "Finding elements with a context." );
	assert.deepEqual( jQuery( "p" ).find( ".blog" ).get(),
		q( "mark", "simon" ), "Finding elements with a context." );

	assert.t( "Class Selector", ".blog", [ "mark", "simon" ] );
	assert.t( "Class Selector", ".GROUPS", [ "groups" ] );
	assert.t( "Class Selector", ".blog.link", [ "simon" ] );
	assert.t( "Class Selector w/ Element", "a.blog", [ "mark", "simon" ] );
	assert.t( "Parent Class Selector", "p .blog", [ "mark", "simon" ] );

	assert.t( "Class selector using UTF8", ".台北Táiběi", [ "utf8class1" ] );
	assert.t( "Class selector using UTF8", ".台北", [ "utf8class1", "utf8class2" ] );
	assert.t( "Class selector using UTF8", ".台北Táiběi.台北", [ "utf8class1" ] );
	assert.t( "Class selector using UTF8", ".台北Táiběi, .台北", [ "utf8class1", "utf8class2" ] );
	assert.t( "Descendant class selector using UTF8", "div .台北Táiběi", [ "utf8class1" ] );
	assert.t( "Child class selector using UTF8", "form > .台北Táiběi", [ "utf8class1" ] );

	assert.t( "Escaped Class", ".foo\\:bar", [ "foo:bar" ] );
	assert.t( "Escaped Class", ".test\\.foo\\[5\\]bar", [ "test.foo[5]bar" ] );
	assert.t( "Descendant escaped Class", "div .foo\\:bar", [ "foo:bar" ] );
	assert.t( "Descendant escaped Class", "div .test\\.foo\\[5\\]bar", [ "test.foo[5]bar" ] );
	assert.t( "Child escaped Class", "form > .foo\\:bar", [ "foo:bar" ] );
	assert.t( "Child escaped Class", "form > .test\\.foo\\[5\\]bar", [ "test.foo[5]bar" ] );

	var div = document.createElement( "div" );
	div.innerHTML = "<div class='test e'></div><div class='test'></div>";
	assert.deepEqual( jQuery( ".e", div ).get(), [ div.firstChild ], "Finding a second class." );

	div.lastChild.className = "e";

	assert.ok( !jQuery( div ).is( ".null" ),
		".null does not match an element with no class" );
	assert.ok( !jQuery( div.firstChild ).is( ".null div" ),
		".null does not match an element with no class" );
	div.className = "null";
	assert.ok( jQuery( div ).is( ".null" ), ".null matches element with class 'null'" );
	assert.ok( jQuery( div.firstChild ).is( ".null div" ),
		"caching system respects DOM changes" );
	assert.ok( !jQuery( document ).is( ".foo" ),
		"testing class on document doesn't error" );
	assert.ok( !jQuery( window ).is( ".foo" ), "testing class on window doesn't error" );

	assert.deepEqual( jQuery( ".e", div ).get(), [ div.firstChild, div.lastChild ],
		"Finding a modified class." );

	div.lastChild.className += " hasOwnProperty toString";
	assert.deepEqual( jQuery( ".e.hasOwnProperty.toString", div ).get(), [ div.lastChild ],
		"Classes match Object.prototype properties" );

	div = jQuery( "<div><svg width='200' height='250' version='1.1'" +
		" xmlns='http://www.w3.org/2000/svg'><rect x='10' y='10' width='30' height='30'" +
		"class='foo'></rect></svg></div>" )[ 0 ];
	assert.equal( jQuery( ".foo", div ).length, 1, "Class selector against SVG container" );
	assert.equal( jQuery( ".foo", div.firstChild ).length, 1,
		"Class selector directly against SVG" );
} );

QUnit.test( "name", function( assert ) {
	assert.expect( 14 );

	var form;

	assert.t( "Name selector", "input[name=action]", [ "text1" ] );
	assert.t( "Name selector with single quotes", "input[name='action']", [ "text1" ] );
	assert.t( "Name selector with double quotes", "input[name=\"action\"]", [ "text1" ] );

	assert.t( "Name selector non-input", "[name=example]", [ "name-is-example" ] );
	assert.t( "Name selector non-input", "[name=div]", [ "name-is-div" ] );
	assert.t( "Name selector non-input", "*[name=iframe]", [ "iframe" ] );

	assert.t( "Name selector for grouped input", "input[name='types[]']", [ "types_all", "types_anime", "types_movie" ] );

	form = document.getElementById( "form" );
	assert.deepEqual( jQuery( "input[name=action]", form ).get(), q( "text1" ),
		"Name selector within the context of another element" );
	assert.deepEqual( jQuery( "input[name='foo[bar]']", form ).get(), q( "hidden2" ),
		"Name selector for grouped form element within the context of another element" );

	form = jQuery( "<form><input name='id'/></form>" ).appendTo( "body" );
	assert.equal( jQuery( "input", form[ 0 ] ).length, 1,
		"Make sure that rooted queries on forms (with possible expandos) work." );

	form.remove();

	assert.t( "Find elements that have similar IDs", "[name=tName1]", [ "tName1ID" ] );
	assert.t( "Find elements that have similar IDs", "[name=tName2]", [ "tName2ID" ] );
	assert.t( "Find elements that have similar IDs", "#tName2ID", [ "tName2ID" ] );

	assert.t( "Case-sensitivity", "[name=tname1]", [] );
} );

QUnit.test( "comma-separated", function( assert ) {
	assert.expect( 10 );

	var fixture = jQuery( "<div><h2><span></span></h2><div><p><span></span></p><p></p></div></div>" );

	assert.equal( fixture.find( "h2, div p" ).filter( "p" ).length, 2, "has to find two <p>" );
	assert.equal( fixture.find( "h2, div p" ).filter( "h2" ).length, 1, "has to find one <h2>" );
	assert.equal( fixture.find( "h2 , div p" ).filter( "p" ).length, 2, "has to find two <p>" );
	assert.equal( fixture.find( "h2 , div p" ).filter( "h2" ).length, 1, "has to find one <h2>" );
	assert.equal( fixture.find( "h2 ,div p" ).filter( "p" ).length, 2, "has to find two <p>" );
	assert.equal( fixture.find( "h2 ,div p" ).filter( "h2" ).length, 1, "has to find one <h2>" );
	assert.equal( fixture.find( "h2,div p" ).filter( "p" ).length, 2, "has to find two <p>" );
	assert.equal( fixture.find( "h2,div p" ).filter( "h2" ).length, 1, "has to find one <h2>" );
	assert.equal( fixture.find( "h2\t,\rdiv p" ).filter( "p" ).length, 2, "has to find two <p>" );
	assert.equal( fixture.find( "h2\t,\rdiv p" ).filter( "h2" ).length, 1, "has to find one <h2>" );
} );

QUnit.test( "comma-separated, only supported natively (gh-5177)", function( assert ) {
	assert.expect( 5 );

	var fixture = jQuery( "<div><input/><span></span></div>" );

	fixture.appendTo( "#qunit-fixture" );

	assert.equal( fixture.find( "input:valid, span" ).length, 2, "has to find two elements" );
	assert.equal( fixture.find( "input:valid , span" ).length, 2, "has to find two elements" );
	assert.equal( fixture.find( "input:valid ,span" ).length, 2, "has to find two elements" );
	assert.equal( fixture.find( "input:valid,span" ).length, 2, "has to find two elements" );
	assert.equal( fixture.find( "input:valid\t,\rspan" ).length, 2, "has to find two elements" );
} );

QUnit.test( "child and adjacent", function( assert ) {
	assert.expect( 43 );

	var siblingFirst, en, nothiddendiv;

	assert.t( "Child", "p > a", [ "simon1", "google", "groups", "mark", "yahoo", "simon" ] );
	assert.t( "Child minus leading whitespace", "p> a", [ "simon1", "google", "groups", "mark", "yahoo", "simon" ] );
	assert.t( "Child minus trailing whitespace", "p >a", [ "simon1", "google", "groups", "mark", "yahoo", "simon" ] );
	assert.t( "Child minus whitespace", "p>a", [ "simon1", "google", "groups", "mark", "yahoo", "simon" ] );
	assert.t( "Child w/ Class", "p > a.blog", [ "mark", "simon" ] );
	assert.t( "All Children", "code > *", [ "anchor1", "anchor2" ] );
	assert.selectInFixture( "All Grandchildren", "p > * > *", [ "anchor1", "anchor2" ] );

	assert.t( "Rooted tag adjacent", "#qunit-fixture a + a", [ "groups", "tName2ID" ] );
	assert.t( "Rooted tag adjacent minus whitespace", "#qunit-fixture a+a", [ "groups", "tName2ID" ] );
	assert.t( "Rooted tag adjacent minus leading whitespace", "#qunit-fixture a +a",
		[ "groups", "tName2ID" ] );
	assert.t( "Rooted tag adjacent minus trailing whitespace", "#qunit-fixture a+ a",
		[ "groups", "tName2ID" ] );

	assert.t( "Tag adjacent", "p + p", [ "ap", "en", "sap" ] );
	assert.t( "#id adjacent", "#firstp + p", [ "ap" ] );
	assert.t( "Tag#id adjacent", "p#firstp + p", [ "ap" ] );
	assert.t( "Tag[attr] adjacent", "p[lang=en] + p", [ "sap" ] );
	assert.t( "Tag.class adjacent", "a.GROUPS + code + a", [ "mark" ] );
	assert.t( "Comma, Child, and Adjacent", "#qunit-fixture a + a, code > a",
		[ "groups", "anchor1", "anchor2", "tName2ID" ] );

	assert.t( "Element Preceded By", "#qunit-fixture p ~ div",
		[ "foo", "nothiddendiv", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest", "fx-test-group" ] );
	assert.t( "Element Preceded By", "#first ~ div",
		[ "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest", "fx-test-group" ] );
	assert.t( "Element Preceded By", "#groups ~ a", [ "mark" ] );
	assert.t( "Element Preceded By", "#length ~ input", [ "idTest" ] );
	assert.t( "Element Preceded By", "#siblingfirst ~ em", [ "siblingnext", "siblingthird" ] );
	assert.t( "Element Preceded By (multiple)", "#siblingTest em ~ em ~ em ~ span", [ "siblingspan" ] );

	siblingFirst = document.getElementById( "siblingfirst" );

	assert.deepEqual( jQuery( "+ em", siblingFirst ).get(), q( "siblingnext" ),
		"Element Directly Preceded By with a context." );
	assert.deepEqual( jQuery( "~ em", siblingFirst ).get(), q( "siblingnext", "siblingthird" ),
		"Element Preceded By with a context." );

	if ( QUnit.jQuerySelectorsPos ) {
		assert.deepEqual( jQuery( "~ em:first", siblingFirst ).get(), q( "siblingnext" ),
			"Element Preceded By positional with a context." );
	} else {
		assert.ok( "skip", "Positional selectors are not supported" );
	}

	en = document.getElementById( "en" );
	assert.deepEqual( jQuery( "+ p, a", en ).get(), q( "yahoo", "sap" ),
		"Compound selector with context, beginning with sibling test." );
	assert.deepEqual( jQuery( "a, + p", en ).get(), q( "yahoo", "sap" ),
		"Compound selector with context, containing sibling test." );

	if ( QUnit.jQuerySelectors ) {
		assert.t( "Element Preceded By, Containing", "#liveHandlerOrder ~ div em:contains('1')", [ "siblingfirst" ] );
		assert.t( "Combinators are not skipped when mixing general and specific", "#siblingTest > em:contains('x') + em ~ span", [] );
	} else {
		assert.ok( "skip", ":contains not supported in selector-native" );
		assert.ok( "skip", ":contains not supported in selector-native" );
	}

	if ( QUnit.jQuerySelectorsPos ) {
		assert.equal( jQuery( "#listWithTabIndex li:eq(2) ~ li" ).length, 1, "Find by general sibling combinator (trac-8310)" );

		nothiddendiv = document.getElementById( "nothiddendiv" );
		assert.deepEqual( jQuery( "> :first", nothiddendiv ).get(), q( "nothiddendivchild" ),
			"Verify child context positional selector" );
		assert.deepEqual( jQuery( "> :eq(0)", nothiddendiv ).get(), q( "nothiddendivchild" ),
			"Verify child context positional selector" );
		assert.deepEqual( jQuery( "> *:first", nothiddendiv ).get(), q( "nothiddendivchild" ),
			"Verify child context positional selector" );
	} else {
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
	}

	assert.t( "Multiple combinators selects all levels", "#siblingTest em *", [ "siblingchild", "siblinggrandchild", "siblinggreatgrandchild" ] );
	assert.t( "Multiple combinators selects all levels", "#siblingTest > em *", [ "siblingchild", "siblinggrandchild", "siblinggreatgrandchild" ] );
	assert.t( "Multiple sibling combinators doesn't miss general siblings", "#siblingTest > em:first-child + em ~ span", [ "siblingspan" ] );

	assert.equal( jQuery( "#listWithTabIndex" ).length, 1, "Parent div for next test is found via ID (trac-8310)" );
	assert.equal( jQuery( "#__sizzle__" ).length, 0, "Make sure the temporary id assigned by sizzle is cleared out (trac-8310)" );
	assert.equal( jQuery( "#listWithTabIndex" ).length, 1, "Parent div for previous test is still found via ID (trac-8310)" );

	assert.t( "Verify deep class selector", "div.blah > p > a", [] );
	assert.t( "No element deep selector", "div.foo > span > a", [] );
	assert.t( "Non-existent ancestors", ".fototab > .thumbnails > a", [] );
} );

QUnit.test( "attributes - existence", function( assert ) {
	assert.expect( 7 );

	assert.t( "On element", "#qunit-fixture a[title]", [ "google" ] );
	assert.t( "On element (whitespace ignored)", "#qunit-fixture a[ title ]", [ "google" ] );
	assert.t( "On element (case-insensitive)", "#qunit-fixture a[TITLE]", [ "google" ] );
	assert.t( "On any element", "#qunit-fixture *[title]", [ "google" ] );
	assert.t( "On implicit element", "#qunit-fixture [title]", [ "google" ] );
	assert.t( "Boolean", "#select2 option[selected]", [ "option2d" ] );
	assert.t( "For attribute on label", "form label[for]", [ "label-for" ] );
} );

QUnit.test( "attributes - equals", function( assert ) {
	assert.expect( 20 );

	var withScript;

	assert.t( "Identifier", "#qunit-fixture a[rel=bookmark]", [ "simon1" ] );
	assert.t( "Identifier with underscore", "input[id=types_all]", [ "types_all" ] );
	assert.t( "String", "#qunit-fixture a[rel='bookmark']", [ "simon1" ] );
	assert.t( "String (whitespace ignored)", "#qunit-fixture a[ rel = 'bookmark' ]", [ "simon1" ] );
	assert.t( "Non-identifier string", "#qunit-fixture a[href='https://www.google.com/']", [ "google" ] );
	assert.t( "Empty string", "#select1 option[value='']", [ "option1a" ] );

	if ( QUnit.jQuerySelectors ) {
		assert.t( "Number",
			"#qunit-fixture option[value=1]",
			[ "option1b", "option2b", "option3b", "option4b", "option5c" ] );
		assert.t( "negative number",
			"#qunit-fixture li[tabIndex=-1]", [ "foodWithNegativeTabIndex" ] );
	} else {
		assert.ok( "skip", "Number value not supported in selector-native" );
		assert.ok( "skip", "Negative number value not supported in selector-native" );
	}

	assert.t( "Non-ASCII identifier", "span[lang=中文]", [ "台北" ] );

	assert.t( "input[type=text]", "#form input[type=text]", [ "text1", "text2", "hidden2", "name" ] );
	assert.t( "input[type=search]", "#form input[type=search]", [ "search" ] );

	withScript = supportjQuery( "<div><span><script src=''></script></span></div>" );
	assert.ok( withScript.find( "#moretests script[src]" ).has( "script" ), "script[src] (jQuery trac-13777)" );

	assert.t( "Boolean attribute equals name", "#select2 option[selected='selected']", [ "option2d" ] );
	assert.t( "for Attribute in form", "#form [for=action]", [ "label-for" ] );
	assert.t( "Grouped Form Elements - name", "input[name='foo[bar]']", [ "hidden2" ] );
	assert.t( "Value", "input[value=Test]", [ "text1", "text2" ] );

	assert.deepEqual(
		jQuery( "input[data-comma='0,1']" ).get(),
		q( "el12087" ),
		"Without context, single-quoted attribute containing ','" );
	assert.deepEqual(
		jQuery( "input[data-comma=\"0,1\"]" ).get(),
		q( "el12087" ),
		"Without context, double-quoted attribute containing ','" );
	assert.deepEqual(
		jQuery( "input[data-comma='0,1']", document.getElementById( "t12087" ) ).get(),
		q( "el12087" ),
		"With context, single-quoted attribute containing ','" );
	assert.deepEqual(
		jQuery( "input[data-comma=\"0,1\"]", document.getElementById( "t12087" ) ).get(),
		q( "el12087" ),
		"With context, double-quoted attribute containing ','" );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "attributes - does not equal", function( assert ) {
	assert.expect( 2 );

	assert.t( "string", "#ap a[hreflang!='en']", [ "google", "groups", "anchor1" ] );
	assert.t( "Empty values", "#select1 option[value!='']", [ "option1b", "option1c", "option1d" ] );
} );

QUnit.test( "attributes - starts with", function( assert ) {
	assert.expect( 4 );

	assert.t( "string (whitespace ignored)", "a[href ^= 'https://www']", [ "google", "yahoo" ] );
	assert.t( "href starts with hash", "p a[href^='#']", [ "anchor2" ] );
	assert.t( "string containing '['", "input[name^='foo[']", [ "hidden2" ] );
	assert.t( "string containing '[' ... ']'", "input[name^='foo[bar]']", [ "hidden2" ] );
} );

QUnit.test( "attributes - contains", function( assert ) {
	assert.expect( 4 );

	assert.t( "string (whitespace ignored)", "a[href *= 'google']", [ "google", "groups" ] );
	assert.t( "string like '[' ... ']']", "input[name*='[bar]']", [ "hidden2" ] );
	assert.t( "string containing '['...']", "input[name*='foo[bar]']", [ "hidden2" ] );
	assert.t( "href contains hash", "p a[href*='#']", [ "simon1", "anchor2" ] );
} );

QUnit.test( "attributes - ends with", function( assert ) {
	assert.expect( 4 );

	assert.t( "string (whitespace ignored)", "a[href $= 'org/']", [ "mark" ] );
	assert.t( "string ending with ']'", "input[name$='bar]']", [ "hidden2" ] );
	assert.t( "string like '[' ... ']'", "input[name$='[bar]']", [ "hidden2" ] );
	assert.t( "Attribute containing []", "input[name$='foo[bar]']", [ "hidden2" ] );
} );

QUnit.test( "attributes - whitespace list includes", function( assert ) {
	assert.expect( 3 );

	assert.t( "string found at the beginning",
		"input[data-15233~='foo']",
		[ "t15233-single", "t15233-double", "t15233-double-tab", "t15233-double-nl", "t15233-triple" ] );
	assert.t( "string found in the middle",
		"input[data-15233~='bar']",
		[ "t15233-double", "t15233-double-tab", "t15233-double-nl", "t15233-triple" ] );
	assert.t( "string found at the end", "input[data-15233~='baz']", [ "t15233-triple" ] );
} );

QUnit.test( "attributes - hyphen-prefix matches", function( assert ) {
	assert.expect( 3 );

	assert.t( "string", "#names-group span[id|='name']", [ "name-is-example", "name-is-div" ] );
	assert.t( "string containing hyphen",
		"#names-group span[id|='name-is']",
		[ "name-is-example", "name-is-div" ] );
	assert.t( "string ending with hyphen", "#names-group span[id|='name-is-']", [] );
} );

QUnit.test( "attributes - special characters", function( assert ) {
	assert.expect( 16 );

	var attrbad;
	var div = document.createElement( "div" );

	// trac-3729
	div.innerHTML = "<div id='foo' xml:test='something'></div>";
	assert.deepEqual( jQuery( "[xml\\:test]", div ).get(),
		[ div.firstChild ],
		"attribute name containing colon" );

	// Make sure attribute value quoting works correctly.
	// See jQuery trac-6093; trac-6428; trac-13894.
	// Use seeded results to bypass querySelectorAll optimizations.
	attrbad = jQuery(
		"<input type='hidden' id='attrbad_space' name='foo bar'/>" +
		"<input type='hidden' id='attrbad_dot' value='2' name='foo.baz'/>" +
		"<input type='hidden' id='attrbad_brackets' value='2' name='foo[baz]'/>" +
		"<input type='hidden' id='attrbad_leading_digits' name='agent' value='007'/>" +
		"<input type='hidden' id='attrbad_injection' data-attr='foo_baz&#39;]'/>" +
		"<input type='hidden' id='attrbad_quote' data-attr='&#39;'/>" +
		"<input type='hidden' id='attrbad_backslash' data-attr='&#92;'/>" +
		"<input type='hidden' id='attrbad_backslash_quote' data-attr='&#92;&#39;'/>" +
		"<input type='hidden' id='attrbad_backslash_backslash' data-attr='&#92;&#92;'/>" +
		"<input type='hidden' id='attrbad_unicode' data-attr='&#x4e00;'/>"
	).appendTo( "#qunit-fixture" ).get();


	assert.deepEqual( jQuery( attrbad ).filter( "input[name=foo\\ bar]" ).get(),
		q( "attrbad_space" ),
		"identifier containing space" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[name=foo\\.baz]" ).get(),
		q( "attrbad_dot" ),
		"identifier containing dot" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[name=foo\\[baz\\]]" ).get(),
		q( "attrbad_brackets" ),
		"identifier containing brackets" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[data-attr='foo_baz\\']']" ).get(),
		q( "attrbad_injection" ),
		"string containing quote and right bracket" );

	assert.deepEqual( jQuery( attrbad ).filter( "input[value=\\30 \\30\\37 ]" ).get(),
		q( "attrbad_leading_digits" ),
		"identifier containing escaped leading digits with whitespace termination" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[value=\\00003007]" ).get(),
		q( "attrbad_leading_digits" ),
		"identifier containing escaped leading digits without whitespace termination" );

	assert.deepEqual( jQuery( attrbad ).filter( "input[data-attr='\\'']" ).get(),
		q( "attrbad_quote" ),
		"string containing quote" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[data-attr='\\\\']" ).get(),
		q( "attrbad_backslash" ),
		"string containing backslash" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[data-attr='\\\\\\'']" ).get(),
		q( "attrbad_backslash_quote" ),
		"string containing backslash and quote" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[data-attr='\\\\\\\\']" ).get(),
		q( "attrbad_backslash_backslash" ),
		"string containing adjacent backslashes" );

	assert.deepEqual( jQuery( attrbad ).filter( "input[data-attr='\\5C\\\\']" ).get(),
		q( "attrbad_backslash_backslash" ),
		"string containing numeric-escape backslash and backslash" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[data-attr='\\5C \\\\']" ).get(),
		q( "attrbad_backslash_backslash" ),
		"string containing numeric-escape-with-trailing-space backslash and backslash" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[data-attr='\\5C\t\\\\']" ).get(),
		q( "attrbad_backslash_backslash" ),
		"string containing numeric-escape-with-trailing-tab backslash and backslash" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[data-attr='\\04e00']" ).get(),
		q( "attrbad_unicode" ),
		"Long numeric escape (BMP)" );

	document.getElementById( "attrbad_unicode" ).setAttribute( "data-attr", "\uD834\uDF06A" );
	assert.deepEqual( jQuery( attrbad ).filter( "input[data-attr='\\01D306A']" ).get(),
		q( "attrbad_unicode" ),
		"Long numeric escape (non-BMP)" );
} );

QUnit.test( "attributes - others", function( assert ) {
	assert.expect( 14 );

	var div = document.getElementById( "foo" );

	assert.t( "Find elements with a tabindex attribute", "[tabindex]", [ "listWithTabIndex", "foodWithNegativeTabIndex", "linkWithTabIndex", "linkWithNegativeTabIndex", "linkWithNoHrefWithTabIndex", "linkWithNoHrefWithNegativeTabIndex" ] );

	assert.t( "Selector list with multiple quoted attribute-equals",
		"#form input[type='radio'], #form input[type='hidden']",
		[ "radio1", "radio2", "hidden1" ] );
	assert.t( "Selector list with differently-quoted attribute-equals",
		"#form input[type='radio'], #form input[type=\"hidden\"]",
		[ "radio1", "radio2", "hidden1" ] );
	assert.t( "Selector list with quoted and unquoted attribute-equals",
		"#form input[type='radio'], #form input[type=hidden]",
		[ "radio1", "radio2", "hidden1" ] );

	assert.t( "Object.prototype property \"constructor\" (negative)", "[constructor]", [] );
	assert.t( "Gecko Object.prototype property \"watch\" (negative)", "[watch]", [] );
	div.setAttribute( "constructor", "foo" );
	div.setAttribute( "watch", "bar" );
	assert.t( "Object.prototype property \"constructor\"", "[constructor='foo']", [ "foo" ] );
	assert.t( "Gecko Object.prototype property \"watch\"", "[watch='bar']", [ "foo" ] );

	// trac-11115
	assert.ok( jQuery( "<input type='checkbox' checked='checked'/>" ).prop( "checked", false ).is( "[checked]" ),
		"[checked] selects by attribute (positive)"
	);
	assert.ok( !jQuery( "<input type='checkbox'/>" ).prop( "checked", true ).is( "[checked]" ),
		"[checked] selects by attribute (negative)"
	);

	assert.t( "empty name", "[name='']", [ "name-empty" ] );
	assert.t( "prefixed empty name", "#empty-name-parent [name='']", [ "name-empty" ] );

	var emptyNameContainer = jQuery( ".empty-name-container" );
	assert.deepEqual( emptyNameContainer.find( "[name='']" ).get(),
		q( "name-empty" ),
		"empty name with context" );
	assert.deepEqual( emptyNameContainer.find( "#empty-name-parent [name='']" ).get(),
		q( "name-empty" ),
		"prefixed empty name with context" );
} );

QUnit.test( "pseudo - (parent|empty)", function( assert ) {
	assert.expect( 3 );
	assert.t( "Empty", "#qunit-fixture ul:empty", [ "firstUL" ] );
	assert.t( "Empty with comment node", "#qunit-fixture ol:empty", [ "empty" ] );

	if ( QUnit.jQuerySelectors ) {
		assert.t( "Is A Parent", "#qunit-fixture p:parent",
			[ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	} else {
		assert.ok( "skip", ":parent not supported in selector-native" );
	}
} );

QUnit.test( "pseudo - (first|last|only)-(child|of-type)", function( assert ) {
	assert.expect( 12 );

	assert.t( "First Child", "#qunit-fixture p:first-child", [ "firstp", "sndp" ] );
	assert.t( "First Child (leading id)", "#qunit-fixture p:first-child", [ "firstp", "sndp" ] );
	assert.t( "First Child (leading class)", ".nothiddendiv div:first-child", [ "nothiddendivchild" ] );
	assert.t( "First Child (case-insensitive)", "#qunit-fixture p:FIRST-CHILD", [ "firstp", "sndp" ] );

	assert.t( "Last Child", "#qunit-fixture p:last-child", [ "sap" ] );
	assert.t( "Last Child (leading id)", "#qunit-fixture a:last-child", [ "simon1", "anchor1", "mark", "yahoo", "anchor2", "simon", "liveLink1", "liveLink2" ] );

	assert.t( "Only Child", "#qunit-fixture a:only-child", [ "simon1", "anchor1", "yahoo", "anchor2", "liveLink1", "liveLink2" ] );

	assert.t( "First-of-type", "#qunit-fixture > p:first-of-type", [ "firstp" ] );
	assert.t( "Last-of-type", "#qunit-fixture > p:last-of-type", [ "first" ] );
	assert.t( "Only-of-type", "#qunit-fixture > :only-of-type", [ "name+value", "firstUL", "empty", "floatTest", "iframe", "table", "last" ] );

	// Verify that the child position isn't being cached improperly
	var secondChildren = jQuery( "p:nth-child(2)" ).before( "<div></div>" );

	assert.t( "No longer second child", "p:nth-child(2)", [] );
	secondChildren.prev().remove();
	assert.t( "Restored second child", "p:nth-child(2)", [ "ap", "en" ] );
} );

QUnit.test( "pseudo - nth-child", function( assert ) {
	assert.expect( 30 );

	assert.t( "Nth-child", "p:nth-child(1)", [ "firstp", "sndp" ] );
	assert.t( "Nth-child (with whitespace)", "p:nth-child( 1 )", [ "firstp", "sndp" ] );
	assert.t( "Nth-child (case-insensitive)", "#form #select1 option:NTH-child(3)", [ "option1c" ] );
	assert.t( "Not nth-child", "#qunit-fixture p:not(:nth-child(1))", [ "ap", "en", "sap", "first" ] );

	assert.t( "Nth-child(2)", "#qunit-fixture form#form > *:nth-child(2)", [ "text1" ] );
	assert.t( "Nth-child(2)", "#qunit-fixture form#form > :nth-child(2)", [ "text1" ] );

	assert.t( "Nth-child(-1)", "#form #select1 option:nth-child(-1)", [] );
	assert.t( "Nth-child(3)", "#form #select1 option:nth-child(3)", [ "option1c" ] );
	assert.t( "Nth-child(0n+3)", "#form #select1 option:nth-child(0n+3)", [ "option1c" ] );
	assert.t( "Nth-child(1n+0)", "#form #select1 option:nth-child(1n+0)", [ "option1a", "option1b", "option1c", "option1d" ] );
	assert.t( "Nth-child(1n)", "#form #select1 option:nth-child(1n)", [ "option1a", "option1b", "option1c", "option1d" ] );
	assert.t( "Nth-child(n)", "#form #select1 option:nth-child(n)", [ "option1a", "option1b", "option1c", "option1d" ] );
	assert.t( "Nth-child(even)", "#form #select1 option:nth-child(even)", [ "option1b", "option1d" ] );
	assert.t( "Nth-child(odd)", "#form #select1 option:nth-child(odd)", [ "option1a", "option1c" ] );
	assert.t( "Nth-child(2n)", "#form #select1 option:nth-child(2n)", [ "option1b", "option1d" ] );
	assert.t( "Nth-child(2n+1)", "#form #select1 option:nth-child(2n+1)", [ "option1a", "option1c" ] );
	assert.t( "Nth-child(2n + 1)", "#form #select1 option:nth-child(2n + 1)", [ "option1a", "option1c" ] );
	assert.t( "Nth-child(+2n + 1)", "#form #select1 option:nth-child(+2n + 1)", [ "option1a", "option1c" ] );
	assert.t( "Nth-child(3n)", "#form #select1 option:nth-child(3n)", [ "option1c" ] );
	assert.t( "Nth-child(3n+1)", "#form #select1 option:nth-child(3n+1)", [ "option1a", "option1d" ] );
	assert.t( "Nth-child(3n+2)", "#form #select1 option:nth-child(3n+2)", [ "option1b" ] );
	assert.t( "Nth-child(3n+3)", "#form #select1 option:nth-child(3n+3)", [ "option1c" ] );
	assert.t( "Nth-child(3n-1)", "#form #select1 option:nth-child(3n-1)", [ "option1b" ] );
	assert.t( "Nth-child(3n-2)", "#form #select1 option:nth-child(3n-2)", [ "option1a", "option1d" ] );
	assert.t( "Nth-child(3n-3)", "#form #select1 option:nth-child(3n-3)", [ "option1c" ] );
	assert.t( "Nth-child(3n+0)", "#form #select1 option:nth-child(3n+0)", [ "option1c" ] );
	assert.t( "Nth-child(-1n+3)", "#form #select1 option:nth-child(-1n+3)", [ "option1a", "option1b", "option1c" ] );
	assert.t( "Nth-child(-n+3)", "#form #select1 option:nth-child(-n+3)", [ "option1a", "option1b", "option1c" ] );
	assert.t( "Nth-child(-1n + 3)", "#form #select1 option:nth-child(-1n + 3)", [ "option1a", "option1b", "option1c" ] );

	if ( QUnit.jQuerySelectors || this.safari ) {
		assert.deepEqual(
			jQuery( [ document.createElement( "a" ) ].concat( q( "ap" ) ) )
				.filter( ":nth-child(n)" )
				.get(),
			q( "ap" ),
			"Seeded nth-child"
		);
	} else {
		// Support: Chrome 75+, Firefox 67+
		// Some browsers mark disconnected elements as matching `:nth-child(n)`
		// so let's skip the test.
		assert.ok( "skip", "disconnected elements match ':nth-child(n)' in Chrome/Firefox" );
	}
} );

QUnit.test( "pseudo - nth-last-child", function( assert ) {
	assert.expect( 30 );

	jQuery( "#qunit-fixture" ).append( "<form id='nth-last-child-form'></form><i></i><i></i><i></i><i></i>" );
	assert.t( "Nth-last-child", "form:nth-last-child(5)", [ "nth-last-child-form" ] );
	assert.t( "Nth-last-child (with whitespace)", "form:nth-last-child( 5 )", [ "nth-last-child-form" ] );


	assert.t( "Nth-last-child (case-insensitive)", "#form #select1 option:NTH-last-child(3)", [ "option1b" ] );
	assert.t( "Not nth-last-child", "#qunit-fixture p:not(:nth-last-child(1))", [ "firstp", "ap", "sndp", "en", "first" ] );

	assert.t( "Nth-last-child(-1)", "#form #select1 option:nth-last-child(-1)", [] );
	assert.t( "Nth-last-child(3)", "#form #select1 :nth-last-child(3)", [ "option1b" ] );
	assert.t( "Nth-last-child(3)", "#form #select1 *:nth-last-child(3)", [ "option1b" ] );
	assert.t( "Nth-last-child(3)", "#form #select1 option:nth-last-child(3)", [ "option1b" ] );
	assert.t( "Nth-last-child(0n+3)", "#form #select1 option:nth-last-child(0n+3)", [ "option1b" ] );
	assert.t( "Nth-last-child(1n+0)", "#form #select1 option:nth-last-child(1n+0)", [ "option1a", "option1b", "option1c", "option1d" ] );
	assert.t( "Nth-last-child(1n)", "#form #select1 option:nth-last-child(1n)", [ "option1a", "option1b", "option1c", "option1d" ] );
	assert.t( "Nth-last-child(n)", "#form #select1 option:nth-last-child(n)", [ "option1a", "option1b", "option1c", "option1d" ] );
	assert.t( "Nth-last-child(even)", "#form #select1 option:nth-last-child(even)", [ "option1a", "option1c" ] );
	assert.t( "Nth-last-child(odd)", "#form #select1 option:nth-last-child(odd)", [ "option1b", "option1d" ] );
	assert.t( "Nth-last-child(2n)", "#form #select1 option:nth-last-child(2n)", [ "option1a", "option1c" ] );
	assert.t( "Nth-last-child(2n+1)", "#form #select1 option:nth-last-child(2n+1)", [ "option1b", "option1d" ] );
	assert.t( "Nth-last-child(2n + 1)", "#form #select1 option:nth-last-child(2n + 1)", [ "option1b", "option1d" ] );
	assert.t( "Nth-last-child(+2n + 1)", "#form #select1 option:nth-last-child(+2n + 1)", [ "option1b", "option1d" ] );
	assert.t( "Nth-last-child(3n)", "#form #select1 option:nth-last-child(3n)", [ "option1b" ] );
	assert.t( "Nth-last-child(3n+1)", "#form #select1 option:nth-last-child(3n+1)", [ "option1a", "option1d" ] );
	assert.t( "Nth-last-child(3n+2)", "#form #select1 option:nth-last-child(3n+2)", [ "option1c" ] );
	assert.t( "Nth-last-child(3n+3)", "#form #select1 option:nth-last-child(3n+3)", [ "option1b" ] );
	assert.t( "Nth-last-child(3n-1)", "#form #select1 option:nth-last-child(3n-1)", [ "option1c" ] );
	assert.t( "Nth-last-child(3n-2)", "#form #select1 option:nth-last-child(3n-2)", [ "option1a", "option1d" ] );
	assert.t( "Nth-last-child(3n-3)", "#form #select1 option:nth-last-child(3n-3)", [ "option1b" ] );
	assert.t( "Nth-last-child(3n+0)", "#form #select1 option:nth-last-child(3n+0)", [ "option1b" ] );
	assert.t( "Nth-last-child(-1n+3)", "#form #select1 option:nth-last-child(-1n+3)", [ "option1b", "option1c", "option1d" ] );
	assert.t( "Nth-last-child(-n+3)", "#form #select1 option:nth-last-child(-n+3)", [ "option1b", "option1c", "option1d" ] );
	assert.t( "Nth-last-child(-1n + 3)", "#form #select1 option:nth-last-child(-1n + 3)", [ "option1b", "option1c", "option1d" ] );

	if ( QUnit.jQuerySelectors || this.safari ) {
		assert.deepEqual(
			jQuery( [ document.createElement( "a" ) ].concat( q( "ap" ) ) )
				.filter( ":nth-last-child(n)" )
				.get(),
			q( "ap" ),
			"Seeded nth-last-child"
		);
	} else {
		// Support: Chrome 75+, Firefox 67+
		// Some browsers mark disconnected elements as matching `:nth-last-child(n)`
		// so let's skip the test.
		assert.ok( "skip", "disconnected elements match ':nth-last-child(n)' in Chrome/Firefox" );
	}
} );

QUnit.test( "pseudo - nth-of-type", function( assert ) {
	assert.expect( 9 );
	assert.t( "Nth-of-type(-1)", ":nth-of-type(-1)", [] );
	assert.t( "Nth-of-type(3)", "#ap :nth-of-type(3)", [ "mark" ] );
	assert.t( "Nth-of-type(n)", "#ap :nth-of-type(n)", [ "google", "groups", "code1", "anchor1", "mark" ] );
	assert.t( "Nth-of-type(0n+3)", "#ap :nth-of-type(0n+3)", [ "mark" ] );
	assert.t( "Nth-of-type(2n)", "#ap :nth-of-type(2n)", [ "groups" ] );
	assert.t( "Nth-of-type(even)", "#ap :nth-of-type(even)", [ "groups" ] );
	assert.t( "Nth-of-type(2n+1)", "#ap :nth-of-type(2n+1)", [ "google", "code1", "anchor1", "mark" ] );
	assert.t( "Nth-of-type(odd)", "#ap :nth-of-type(odd)", [ "google", "code1", "anchor1", "mark" ] );
	assert.t( "Nth-of-type(-n+2)", "#qunit-fixture > :nth-of-type(-n+2)", [ "firstp", "ap", "foo", "nothiddendiv", "name+value", "firstUL", "empty", "form", "floatTest", "iframe", "lengthtest", "table", "last" ] );
} );

QUnit.test( "pseudo - nth-last-of-type", function( assert ) {
	assert.expect( 9 );
	assert.t( "Nth-last-of-type(-1)", ":nth-last-of-type(-1)", [] );
	assert.t( "Nth-last-of-type(3)", "#ap :nth-last-of-type(3)", [ "google" ] );
	assert.t( "Nth-last-of-type(n)", "#ap :nth-last-of-type(n)", [ "google", "groups", "code1", "anchor1", "mark" ] );
	assert.t( "Nth-last-of-type(0n+3)", "#ap :nth-last-of-type(0n+3)", [ "google" ] );
	assert.t( "Nth-last-of-type(2n)", "#ap :nth-last-of-type(2n)", [ "groups" ] );
	assert.t( "Nth-last-of-type(even)", "#ap :nth-last-of-type(even)", [ "groups" ] );
	assert.t( "Nth-last-of-type(2n+1)", "#ap :nth-last-of-type(2n+1)", [ "google", "code1", "anchor1", "mark" ] );
	assert.t( "Nth-last-of-type(odd)", "#ap :nth-last-of-type(odd)", [ "google", "code1", "anchor1", "mark" ] );
	assert.t( "Nth-last-of-type(-n+2)", "#qunit-fixture > :nth-last-of-type(-n+2)", [ "ap", "name+value", "first", "firstUL", "empty", "floatTest", "iframe", "table", "testForm", "disabled-tests", "siblingTest", "fx-test-group", "last" ] );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "pseudo - has", function( assert ) {
	assert.expect( 4 );

	assert.t( "Basic test", "p:has(a)", [ "firstp", "ap", "en", "sap" ] );
	assert.t( "Basic test (irrelevant whitespace)", "p:has( a )", [ "firstp", "ap", "en", "sap" ] );
	assert.t( "Nested with overlapping candidates",
		"#qunit-fixture div:has(div:has(div:not([id])))",
		[ "moretests", "t2037", "fx-test-group", "fx-queue" ] );

	// Support: Safari 15.4+, Chrome 105+
	// `qSA` in Safari/Chrome throws for `:has()` with only unsupported arguments
	// but if you add a supported arg to the list, it will run and just potentially
	// return no results. Make sure this is accounted for. (gh-5098)
	// Note: Chrome 105 has this behavior only in 105.0.5195.125 or newer;
	// initially it shipped with a fully forgiving parsing in `:has()`.
	assert.t( "Nested with list arguments",
		"#qunit-fixture div:has(faketag, div:has(faketag, div:not([id])))",
		[ "moretests", "t2037", "fx-test-group", "fx-queue" ] );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "pseudo - contains", function( assert ) {
	assert.expect( 9 );

	var gh335 = document.getElementById( "qunit-fixture" ).appendChild(
		document.createElement( "mark" ) );
	gh335.id = "gh-335";
	gh335.appendChild( document.createTextNode( "raw line 1\nline 2" ) );

	assert.ok( jQuery( "a:contains('')" ).length, "empty string" );
	assert.t( "unquoted argument", "a:contains(Google)", [ "google", "groups" ] );
	assert.t( "unquoted argument with whitespace", "a:contains(Google Groups)", [ "groups" ] );
	assert.t( "quoted argument with whitespace and parentheses",
		"a:contains('Google Groups (Link)')", [ "groups" ] );
	assert.t( "quoted argument with double quotes and parentheses",
		"a:contains(\"(Link)\")", [ "groups" ] );
	assert.t( "unquoted argument with whitespace and paired parentheses",
		"a:contains(Google Groups (Link))", [ "groups" ] );
	assert.t( "unquoted argument with paired parentheses", "a:contains((Link))", [ "groups" ] );
	assert.t( "quoted argument with CSS escapes",
		"span:contains(\"\\\"'\\53F0 \\5317 Ta\\301 ibe\\30C i\")",
		[ "utf8class1" ] );

	assert.t( "collapsed whitespace", "mark:contains('line 1\\A line')", [ "gh-335" ] );
} );

QUnit.test( "pseudo - misc", function( assert ) {
	assert.expect( 32 );

	var select, tmp, input;

	jQuery( "<h1 id='h1'></h1><h2 id='h2'></h2><h2 id='h2-2'></h2>" ).prependTo( "#qunit-fixture" );

	if ( QUnit.jQuerySelectors ) {
		assert.t( "Headers", "#qunit-fixture :header", [ "h1", "h2", "h2-2" ] );
		assert.t( "Headers(case-insensitive)", "#qunit-fixture :Header", [ "h1", "h2", "h2-2" ] );
	} else {
		assert.ok( "skip", ":header not supported in selector-native" );
		assert.ok( "skip", ":header not supported in selector-native" );
	}

	if ( QUnit.jQuerySelectors ) {
		assert.t( "Multiple matches with the same context (cache check)",
			"#form select:has(option:first-child:contains('o'))",
			[ "select1", "select2", "select3", "select4" ]
		);
		assert.ok( jQuery( "#qunit-fixture :not(:has(:has(*)))" ).length, "All not grandparents" );

		select = document.getElementById( "select1" );
		assert.ok( jQuery( select ).is( ":has(option)" ), "Has Option Matches" );
	} else {
		assert.ok( "skip", ":has not supported in selector-native" );
		assert.ok( "skip", ":has not supported in selector-native" );
		assert.ok( "skip", ":has not supported in selector-native" );
	}

	tmp = document.createElement( "div" );
	tmp.id = "tmp_input";
	document.body.appendChild( tmp );

	jQuery.each( [ "button", "submit", "reset" ], function( i, type ) {
		var els = jQuery(
			"<input id='input_%' type='%'/><button id='button_%' type='%'>test</button>"
				.replace( /%/g, type )
		).appendTo( tmp );

		if ( QUnit.jQuerySelectors ) {
			assert.t( "Input Buttons :" + type, "#tmp_input :" + type, [ "input_" + type, "button_" + type ] );

			assert.ok( jQuery( els[ 0 ] ).is( ":" + type ), "Input Matches :" + type );
			assert.ok( jQuery( els[ 1 ] ).is( ":" + type ), "Button Matches :" + type );
		} else {
			assert.ok( "skip", ":" + type + " not supported in selector-native" );
			assert.ok( "skip", ":" + type + " not supported in selector-native" );
			assert.ok( "skip", ":" + type + " not supported in selector-native" );
		}
	} );

	document.body.removeChild( tmp );

	// Recreate tmp
	tmp = document.createElement( "div" );
	tmp.id = "tmp_input";
	tmp.innerHTML = "<span>Hello I am focusable.</span>";
	// Setting tabIndex should make the element focusable
	// https://html.spec.whatwg.org/#the-tabindex-attribute
	document.body.appendChild( tmp );
	tmp.tabIndex = 0;
	tmp.focus();
	if ( document.activeElement !== tmp || ( document.hasFocus && !document.hasFocus() ) ||
		( document.querySelectorAll && !document.querySelectorAll( "div:focus" ).length ) ) {
		assert.ok( true, "The div was not focused. Skip checking the :focus match." );
		assert.ok( true, "The div was not focused. Skip checking the :focus match." );
	} else {
		assert.t( "tabIndex element focused", ":focus", [ "tmp_input" ] );
		assert.ok( jQuery( tmp ).is( ":focus" ), ":focus matches tabIndex div" );
	}

	// Blur tmp
	tmp.blur();
	document.body.focus();
	assert.ok( !jQuery( tmp ).is( ":focus" ), ":focus doesn't match tabIndex div" );
	document.body.removeChild( tmp );

	// Input focus/active
	input = document.createElement( "input" );
	input.type = "text";
	input.id = "focus-input";

	document.body.appendChild( input );
	input.focus();

	// Inputs can't be focused unless the document has focus
	if ( document.activeElement !== input || ( document.hasFocus && !document.hasFocus() ) ||
		( document.querySelectorAll && !document.querySelectorAll( "input:focus" ).length ) ) {
		assert.ok( true, "The input was not focused. Skip checking the :focus match." );
		assert.ok( true, "The input was not focused. Skip checking the :focus match." );
	} else {
		assert.t( "Element focused", "input:focus", [ "focus-input" ] );
		assert.ok( jQuery( input ).is( ":focus" ), ":focus matches" );
	}

	input.blur();

	// When IE is out of focus, blur does not work. Force it here.
	if ( document.activeElement === input ) {
		document.body.focus();
	}

	assert.ok( !jQuery( input ).is( ":focus" ), ":focus doesn't match" );
	document.body.removeChild( input );


	assert.deepEqual(
		jQuery( "[id='select1'] *:not(:last-child), [id='select2'] *:not(:last-child)", q( "qunit-fixture" )[ 0 ] ).get(),
		q( "option1a", "option1b", "option1c", "option2a", "option2b", "option2c" ),
		"caching system tolerates recursive selection"
	);

	if ( QUnit.jQuerySelectors ) {
		// Tokenization edge cases
		assert.t( "Sequential pseudos", "#qunit-fixture p:has(:contains(mark)):has(code)", [ "ap" ] );
		assert.t( "Sequential pseudos", "#qunit-fixture p:has(:contains(mark)):has(code):contains(This link)", [ "ap" ] );

		assert.t( "Pseudo argument containing ')'", "p:has(>a.GROUPS[src!=')'])", [ "ap" ] );
		assert.t( "Pseudo argument containing ')'", "p:has(>a.GROUPS[src!=')'])", [ "ap" ] );
		assert.t( "Pseudo followed by token containing ')'", "p:contains(id=\"foo\")[id!=\\)]", [ "sndp" ] );
		assert.t( "Pseudo followed by token containing ')'", "p:contains(id=\"foo\")[id!=')']", [ "sndp" ] );

		assert.t( "Multi-pseudo", "#ap:has(*), #ap:has(*)", [ "ap" ] );
		assert.t( "Multi-pseudo with leading nonexistent id", "#nonexistent:has(*), #ap:has(*)", [ "ap" ] );

		assert.t( "Tokenization stressor", "a[class*=blog]:not(:has(*, :contains(!)), :contains(!)), br:contains(]), p:contains(]):not(.qunit-source), :not(:empty):not(:parent):not(.qunit-source)", [ "ap", "mark", "yahoo", "simon" ] );
	} else {
		assert.ok( "skip", ":has not supported in selector-native" );
		assert.ok( "skip", ":has not supported in selector-native" );

		assert.ok( "skip", ":has not supported in selector-native" );
		assert.ok( "skip", ":has not supported in selector-native" );
		assert.ok( "skip", ":contains not supported in selector-native" );
		assert.ok( "skip", ":contains not supported in selector-native" );

		assert.ok( "skip", ":has not supported in selector-native" );
		assert.ok( "skip", ":has supported in selector-native" );

		assert.ok( "skip", ":has not supported in selector-native" );
	}

	if ( QUnit.jQuerySelectorsPos ) {
		assert.t( "Multi-positional", "#ap:gt(0), #ap:lt(1)", [ "ap" ] );
		assert.t( "Multi-positional with leading nonexistent id", "#nonexistent:gt(0), #ap:lt(1)", [ "ap" ] );
	} else {
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
	}
} );

QUnit.test( "pseudo - :not", function( assert ) {
	assert.expect( 43 );

	assert.t( "Not", "a.blog:not(.link)", [ "mark" ] );

	if ( QUnit.jQuerySelectors ) {
		assert.t( "Not - multiple", "#form option:not(:contains(Nothing),#option1b,:selected)", [ "option1c", "option1d", "option2b", "option2c", "option3d", "option3e", "option4e", "option5b", "option5c" ] );
		assert.t( "Not - recursive", "#form option:not(:not(:selected))[id^='option3']", [ "option3b", "option3c" ] );
	} else {
		assert.ok( "skip", ":contains not supported in selector-native" );
		assert.ok( "skip", ":selected not supported in selector-native" );
	}

	if ( QUnit.jQuerySelectorsPos ) {
		assert.t( ":not() with :first", "#foo p:not(:first) .link", [ "simon" ] );
	} else {
		assert.ok( "skip", "Positional selectors are not supported" );
	}

	assert.t( ":not() failing interior", "#qunit-fixture p:not(.foo)", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( ":not() failing interior", "#qunit-fixture p:not(#blargh)", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );

	if ( QUnit.jQuerySelectors || !QUnit.isIE ) {
		assert.t( ":not() failing interior", "#qunit-fixture p:not(div.foo)", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
		assert.t( ":not() failing interior", "#qunit-fixture p:not(p.foo)", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
		assert.t( ":not() failing interior", "#qunit-fixture p:not(div#blargh)", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
		assert.t( ":not() failing interior", "#qunit-fixture p:not(p#blargh)", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	} else {
		// Support: IE 11+
		// IE doesn't support `:not(complex selector)`.
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
	}

	assert.t( ":not Multiple", "#qunit-fixture p:not(a)", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( ":not Multiple", "#qunit-fixture p:not( a )", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
	assert.t( ":not Multiple", "#qunit-fixture p:not( p )", [] );
	assert.t( ":not Multiple", "p:not(p)", [] );

	if ( QUnit.jQuerySelectors || !QUnit.isIE ) {
		assert.t( ":not Multiple", "#qunit-fixture p:not(a, b)", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
		assert.t( ":not Multiple", "#qunit-fixture p:not(a, b, div)", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );
		assert.t( ":not Multiple", "p:not(a,p)", [] );
		assert.t( ":not Multiple", "p:not(p,a)", [] );
		assert.t( ":not Multiple", "p:not(a,p,b)", [] );
	} else {
		// Support: IE 11+
		// IE doesn't support `:not(complex selector)`.
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
	}

	if ( QUnit.jQuerySelectors ) {
		assert.t( ":not Multiple", ":input:not(:image,:input,:submit)", [] );
		assert.t( ":not Multiple", "#qunit-fixture p:not(:has(a), :nth-child(1))", [ "first" ] );
	} else {
		assert.ok( "skip", ":image, :input, :submit not supported in selector-native" );
		assert.ok( "skip", ":has not supported in selector-native" );
	}

	assert.t( "No element not selector", ".container div:not(.excluded) div", [] );

	assert.t( ":not() Existing attribute", "#form select:not([multiple])", [ "select1", "select2", "select5" ] );
	assert.t( ":not() Equals attribute", "#form select:not([name=select1])", [ "select2", "select3", "select4", "select5" ] );
	assert.t( ":not() Equals quoted attribute", "#form select:not([name='select1'])", [ "select2", "select3", "select4", "select5" ] );

	assert.t( ":not() Multiple Class", "#foo a:not(.blog)", [ "yahoo", "anchor2" ] );
	assert.t( ":not() Multiple Class", "#foo a:not(.link)", [ "yahoo", "anchor2" ] );

	if ( QUnit.jQuerySelectors || !QUnit.isIE ) {
		assert.t( ":not() Multiple Class", "#foo a:not(.blog.link)", [ "yahoo", "anchor2" ] );
	} else {
		// Support: IE 11+
		// IE doesn't support `:not(complex selector)`.
		assert.ok( "skip", ":not(complex selector) not supported in selector-native" );
	}

	if ( QUnit.jQuerySelectors ) {
		assert.t( ":not chaining (compound)", "#qunit-fixture div[id]:not(:has(div, span)):not(:has(*))", [ "nothiddendivchild", "divWithNoTabIndex", "fx-tests" ] );
		assert.t( ":not chaining (with attribute)", "#qunit-fixture form[id]:not([action$='formaction']):not(:button)", [ "lengthtest", "name-tests", "testForm", "disabled-tests" ] );
		assert.t( ":not chaining (colon in attribute)", "#qunit-fixture form[id]:not([action='form:action']):not(:button)", [ "form", "lengthtest", "name-tests", "testForm", "disabled-tests" ] );
		assert.t( ":not chaining (colon in attribute and nested chaining)", "#qunit-fixture form[id]:not([action='form:action']:button):not(:input)", [ "form", "lengthtest", "name-tests", "testForm", "disabled-tests" ] );
		assert.t( ":not chaining", "#form select:not(.select1):contains(Nothing) > option:not(option)", [] );
	} else {
		assert.ok( "skip", ":has not supported in selector-native" );
		assert.ok( "skip", ":button not supported in selector-native" );
		assert.ok( "skip", ":button not supported in selector-native" );
		assert.ok( "skip", ":button not supported in selector-native" );
		assert.ok( "skip", ":contains not supported in selector-native" );
	}

	if ( QUnit.jQuerySelectorsPos ) {
		assert.t( "positional :not()", "#foo p:not(:last)", [ "sndp", "en" ] );
		assert.t( "positional :not() prefix", "#foo p:not(:last) a", [ "yahoo" ] );
		assert.t( "compound positional :not()", "#foo p:not(:first, :last)", [ "en" ] );
		assert.t( "compound positional :not()", "#foo p:not(:first, :even)", [ "en" ] );
		assert.t( "compound positional :not()", "#foo p:not(:first, :odd)", [ "sap" ] );
		assert.t( "reordered compound positional :not()", "#foo p:not(:odd, :first)", [ "sap" ] );

		assert.t( "positional :not() with pre-filter", "#foo p:not([id]:first)", [ "en", "sap" ] );
		assert.t( "positional :not() with post-filter", "#foo p:not(:first[id])", [ "en", "sap" ] );
		assert.t( "positional :not() with pre-filter", "#foo p:not([lang]:first)", [ "sndp", "sap" ] );
		assert.t( "positional :not() with post-filter", "#foo p:not(:first[lang])", [ "sndp", "en", "sap" ] );
	} else {
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );

		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
		assert.ok( "skip", "Positional selectors are not supported" );
	}
} );

QUnit[ QUnit.jQuerySelectorsPos ? "test" : "skip" ]( "pseudo - position", function( assert ) {
	assert.expect( 34 );

	assert.t( "First element", "#qunit-fixture p:first", [ "firstp" ] );
	assert.t( "First element(case-insensitive)", "#qunit-fixture p:fiRst", [ "firstp" ] );
	assert.t( "nth Element", "#qunit-fixture p:nth(1)", [ "ap" ] );
	assert.t( "First Element", "#qunit-fixture p:first", [ "firstp" ] );
	assert.t( "Last Element", "p:last", [ "first" ] );
	assert.t( "Even Elements", "#qunit-fixture p:even", [ "firstp", "sndp", "sap" ] );
	assert.t( "Odd Elements", "#qunit-fixture p:odd", [ "ap", "en", "first" ] );
	assert.t( "Position Equals", "#qunit-fixture p:eq(1)", [ "ap" ] );
	assert.t( "Position Equals (negative)", "#qunit-fixture p:eq(-1)", [ "first" ] );
	assert.t( "Position Greater Than", "#qunit-fixture p:gt(0)", [ "ap", "sndp", "en", "sap", "first" ] );
	assert.t( "Position Less Than", "#qunit-fixture p:lt(3)", [ "firstp", "ap", "sndp" ] );
	assert.t( "Position Less Than Big Number", "#qunit-fixture p:lt(9007199254740991)", [ "firstp", "ap", "sndp", "en", "sap", "first" ] );

	assert.t( "Check position filtering", "div#nothiddendiv:eq(0)", [ "nothiddendiv" ] );
	assert.t( "Check position filtering", "div#nothiddendiv:last", [ "nothiddendiv" ] );
	assert.t( "Check position filtering", "div#nothiddendiv:not(:gt(0))", [ "nothiddendiv" ] );
	assert.t( "Check position filtering", "#foo > :not(:first)", [ "en", "sap" ] );
	assert.t( "Check position filtering", "#qunit-fixture select > :not(:gt(2))", [ "option1a", "option1b", "option1c" ] );
	assert.t( "Check position filtering", "#qunit-fixture select:lt(2) :not(:first)", [ "option1b", "option1c", "option1d", "option2a", "option2b", "option2c", "option2d" ] );
	assert.t( "Check position filtering", "div.nothiddendiv:eq(0)", [ "nothiddendiv" ] );
	assert.t( "Check position filtering", "div.nothiddendiv:last", [ "nothiddendiv" ] );
	assert.t( "Check position filtering", "div.nothiddendiv:not(:lt(0))", [ "nothiddendiv" ] );

	assert.t( "Check element position", "#qunit-fixture div div:eq(0)", [ "nothiddendivchild" ] );
	assert.t( "Check element position", "#select1 option:eq(3)", [ "option1d" ] );
	assert.t( "Check element position", "#qunit-fixture div div:eq(10)", [ "no-clone-exception" ] );
	assert.t( "Check element position", "#qunit-fixture div div:first", [ "nothiddendivchild" ] );
	assert.t( "Check element position", "#qunit-fixture div > div:first", [ "nothiddendivchild" ] );
	assert.t( "Check element position", "#qunit-fixture div:first a:first", [ "yahoo" ] );
	assert.t( "Check element position", "#qunit-fixture div:first > p:first", [ "sndp" ] );
	assert.t( "Check element position", "div#nothiddendiv:first > div:first", [ "nothiddendivchild" ] );
	assert.t( "Chained pseudo after a pos pseudo", "#listWithTabIndex li:eq(0):contains(Rice)", [ "foodWithNegativeTabIndex" ] );

	assert.t( "Check sort order with POS and comma", "#qunit-fixture em>em>em>em:first-child,div>em:first", [ "siblingfirst", "siblinggreatgrandchild" ] );

	assert.t( "Isolated position", "#qunit-fixture :last", [ "last" ] );

	assert.deepEqual(
		jQuery( "#qunit-fixture > p" ).filter( "*:lt(2) + *" ).get(),
		q( "ap" ),
		"Seeded pos with trailing relative" );

	// jQuery trac-12526
	var context = jQuery( "#qunit-fixture" ).append( "<div id='jquery12526'></div>" )[ 0 ];
	assert.deepEqual( jQuery( ":last", context ).get(), q( "jquery12526" ),
		"Post-manipulation positional" );
} );

QUnit.test( "pseudo - form", function( assert ) {
	assert.expect( 16 );

	var extraTexts = jQuery( "<input id=\"impliedText\"/><input id=\"capitalText\" type=\"TEXT\">" ).appendTo( "#form" );

	if ( QUnit.jQuerySelectors ) {
		assert.t( "Form element :radio", "#form :radio", [ "radio1", "radio2" ] );
		assert.t( "Form element :checkbox", "#form :checkbox", [ "check1", "check2" ] );
		assert.t( "Form element :text", "#form :text", [ "text1", "text2", "hidden2", "name", "impliedText", "capitalText" ] );
		assert.t( "Form element :radio:checked", "#form :radio:checked", [ "radio2" ] );
		assert.t( "Form element :checkbox:checked", "#form :checkbox:checked", [ "check1" ] );
		assert.t( "Form element :radio:checked, :checkbox:checked", "#form :radio:checked, #form :checkbox:checked", [ "radio2", "check1" ] );
	} else {
		assert.ok( "skip", ":radio not supported in selector-native" );
		assert.ok( "skip", ":checkbox not supported in selector-native" );
		assert.ok( "skip", ":text not supported in selector-native" );
		assert.ok( "skip", ":radio not supported in selector-native" );
		assert.ok( "skip", ":checkbox not supported in selector-native" );
		assert.ok( "skip", ":radio not supported in selector-native" );
	}

	if ( QUnit.jQuerySelectors ) {
		assert.t( "Selected option element",
			"#form option:selected",
			[ "option1a", "option2d", "option3b", "option3c", "option4b", "option4c", "option4d",
				"option5a" ] );
		assert.t( "Select options via :selected", "#select1 option:selected", [ "option1a" ] );
		assert.t( "Select options via :selected", "#select2 option:selected", [ "option2d" ] );
		assert.t( "Select options via :selected", "#select3 option:selected", [ "option3b", "option3c" ] );
		assert.t( "Select options via :selected", "select[name='select2'] option:selected", [ "option2d" ] );
	} else {
		assert.ok( "skip", ":selected not supported in selector-native" );
		assert.ok( "skip", ":selected not supported in selector-native" );
		assert.ok( "skip", ":selected not supported in selector-native" );
		assert.ok( "skip", ":selected not supported in selector-native" );
		assert.ok( "skip", ":selected not supported in selector-native" );
	}

	if ( QUnit.jQuerySelectors ) {
		assert.t( "Form element :input", "#form :input", [ "text1", "text2", "radio1", "radio2", "check1", "check2", "hidden1", "hidden2", "name", "search", "button", "area1", "select1", "select2", "select3", "select4", "select5", "impliedText", "capitalText" ] );

		// trac-12600
		assert.ok(
			jQuery( "<select value='12600'><option value='option' selected='selected'></option><option value=''></option></select>" )
				.prop( "value", "option" )
				.is( ":input[value='12600']" ),

			":input[value=foo] selects select by attribute"
		);
		assert.ok( jQuery( "<input type='text' value='12600'/>" ).prop( "value", "option" ).is( ":input[value='12600']" ),
			":input[value=foo] selects text input by attribute"
		);
	} else {
		assert.ok( "skip", ":input not supported in selector-native" );
		assert.ok( "skip", ":input not supported in selector-native" );
		assert.ok( "skip", ":input not supported in selector-native" );
	}

	assert.t( "Selected option elements are also :checked", "#form option:checked",
		[ "option1a", "option2d", "option3b", "option3c", "option4b", "option4c", "option4d",
			"option5a" ] );
	assert.t( "Hidden inputs are still :enabled",
		"#hidden1:enabled",
		[ "hidden1" ] );

	extraTexts.remove();
} );

QUnit.test( "pseudo - :(dis|en)abled, explicitly disabled", function( assert ) {
	assert.expect( 2 );

	// Set a meaningless disabled property on a common ancestor
	var container = document.getElementById( "disabled-tests" );
	container.disabled = true;

	// Support: IE 6 - 11
	// Unset the property where it is not meaningless
	if ( document.getElementById( "enabled-input" ).isDisabled ) {
		container.disabled = undefined;
	}

	assert.t(
		"Explicitly disabled elements",
		"#enabled-fieldset :disabled",
		[ "disabled-input", "disabled-textarea", "disabled-button",
			"disabled-select", "disabled-optgroup", "disabled-option" ]
	);

	assert.t(
		"Enabled elements",
		"#enabled-fieldset :enabled",
		[ "enabled-input", "enabled-textarea", "enabled-button",
			"enabled-select", "enabled-optgroup", "enabled-option" ]
	);
} );

QUnit.test( "pseudo - :(dis|en)abled, optgroup and option", function( assert ) {
	assert.expect( 2 );

	assert.t(
		":disabled",
		"#disabled-select-inherit :disabled, #enabled-select-inherit :disabled",
		[ "disabled-optgroup-inherit", "disabled-optgroup-option", "en_disabled-optgroup-inherit",
			"en_disabled-optgroup-option" ]
	);

	assert.t(
		":enabled",
		"#disabled-select-inherit :enabled, #enabled-select-inherit :enabled",
		[ "enabled-optgroup-inherit", "enabled-optgroup-option", "enabled-select-option" ]
	);
} );

QUnit.test( "pseudo - fieldset:(dis|en)abled", function( assert ) {
	assert.expect( 2 );

	assert.t( "Disabled fieldset", "fieldset:disabled", [ "disabled-fieldset" ] );
	assert.t( "Enabled fieldset", "fieldset:enabled", [ "enabled-fieldset" ] );
} );

QUnit.test( "pseudo - :disabled by ancestry", function( assert ) {
	assert.expect( 1 );

	assert.t(
		"Inputs inherit disabled from fieldset",
		"#disabled-fieldset :disabled",
		[ "disabled-fieldset-input", "disabled-fieldset-textarea",
			"disabled-fieldset-button" ]
	);
} );

QUnit.test( "pseudo - a:(dis|en)abled", function( assert ) {
	assert.expect( 2 );

	var enabled, disabled,
		container = jQuery( "<div></div>" ),
		anchor = jQuery( "<a href='#'>Link</a>" );

	container.appendTo( "#qunit-fixture" );

	enabled = container.find( "a:enabled" );
	disabled = container.find( "a:disabled" );

	assert.strictEqual( enabled.length, 0, ":enabled doesn't match anchor elements" );
	assert.strictEqual( disabled.length, 0, ":disabled doesn't match anchor elements" );
} );

QUnit.test( "pseudo - :target and :root", function( assert ) {
	assert.expect( 2 );

	// Target
	var oldHash,
		$link = jQuery( "<a></a>" ).attr( {
			href: "#",
			id: "new-link"
		} ).appendTo( "#qunit-fixture" );

	oldHash = window.location.hash;
	window.location.hash = "new-link";

	assert.t( ":target", ":target", [ "new-link" ] );

	$link.remove();
	window.location.hash = oldHash;

	// Root
	assert.equal( jQuery( ":root" )[ 0 ], document.documentElement, ":root selector" );
} );

QUnit.test( "pseudo - :lang", function( assert ) {
	assert.expect( QUnit.jQuerySelectors ? 105 : 55 );

	var docElem = document.documentElement,
		docXmlLang = docElem.getAttribute( "xml:lang" ),
		docLang = docElem.lang,
		foo = document.getElementById( "foo" ),
		anchor = document.getElementById( "anchor2" ),
		xml = createWithFriesXML(),
		testLang = function( text, elem, container, lang, extra ) {
			var message,
				full = lang + "-" + extra;

			message = "lang=" + lang + " " + text;
			container.setAttribute( container.ownerDocument.documentElement.nodeName === "HTML" ? "lang" : "xml:lang", lang );
			assertMatch( message, elem, ":lang(" + lang + ")" );
			assertMatch( message, elem, ":lang(" + mixCase( lang ) + ")" );
			assertNoMatch( message, elem, ":lang(" + full + ")" );
			assertNoMatch( message, elem, ":lang(" + mixCase( full ) + ")" );
			assertNoMatch( message, elem, ":lang(" + lang + "-)" );
			assertNoMatch( message, elem, ":lang(" + full + "-)" );
			assertNoMatch( message, elem, ":lang(" + lang + "glish)" );
			assertNoMatch( message, elem, ":lang(" + full + "glish)" );

			message = "lang=" + full + " " + text;
			container.setAttribute( container.ownerDocument.documentElement.nodeName === "HTML" ? "lang" : "xml:lang", full );
			assertMatch( message, elem, ":lang(" + lang + ")" );
			assertMatch( message, elem, ":lang(" + mixCase( lang ) + ")" );
			assertMatch( message, elem, ":lang(" + full + ")" );
			assertMatch( message, elem, ":lang(" + mixCase( full ) + ")" );
			assertNoMatch( message, elem, ":lang(" + lang + "-)" );
			assertNoMatch( message, elem, ":lang(" + full + "-)" );
			assertNoMatch( message, elem, ":lang(" + lang + "glish)" );
			assertNoMatch( message, elem, ":lang(" + full + "glish)" );
		},
		mixCase = function( str ) {
			var ret = str.split( "" ),
				i = ret.length;
			while ( i-- ) {
				if ( i & 1 ) {
					ret[ i ] = ret[ i ].toUpperCase();
				}
			}
			return ret.join( "" );
		},
		assertMatch = function( text, elem, selector ) {
			assert.ok( jQuery( elem ).is( selector ), text + " match " + selector );
		},
		assertNoMatch = function( text, elem, selector ) {
			assert.ok( !jQuery( elem ).is( selector ), text + " fail " + selector );
		};

	// Prefixing and inheritance
	assert.ok( jQuery( docElem ).is( ":lang(" + docElem.lang + ")" ), "starting :lang" );
	testLang( "document", anchor, docElem, "en", "us" );
	testLang( "grandparent", anchor, anchor.parentNode.parentNode, "yue", "hk" );
	assert.ok( !jQuery( anchor ).is( ":lang(en), :lang(en-us)" ),
		":lang does not look above an ancestor with specified lang" );
	testLang( "self", anchor, anchor, "es", "419" );
	assert.ok(
		!jQuery( anchor ).is( ":lang(en), :lang(en-us), :lang(yue), :lang(yue-hk)" ),
		":lang does not look above self with specified lang"
	);

	// Searching by language tag
	anchor.parentNode.parentNode.lang = "arab";
	anchor.parentNode.lang = anchor.parentNode.id = "ara-sa";
	anchor.lang = "ara";
	assert.deepEqual( jQuery( ":lang(ara)", foo ).get(), [ anchor.parentNode, anchor ], "Find by :lang" );

	// Selector validity
	anchor.parentNode.lang = "ara";
	anchor.lang = "ara\\b";
	assert.deepEqual( jQuery( ":lang(ara\\b)", foo ).get(), [], ":lang respects backslashes" );
	assert.deepEqual( jQuery( ":lang(ara\\\\b)", foo ).get(), [ anchor ],
		":lang respects escaped backslashes" );
	assert.throws( function() {
		jQuery( "#qunit-fixture:lang(c++)" );
	}, ":lang value must be a valid identifier" );

	if ( QUnit.jQuerySelectors ) {

		// XML
		foo = jQuery( "response", xml )[ 0 ];
		anchor = jQuery( "#seite1", xml )[ 0 ];
		testLang( "XML document", anchor, xml.documentElement, "en", "us" );
		testLang( "XML grandparent", anchor, foo, "yue", "hk" );
		assert.ok( !jQuery( anchor ).is( ":lang(en), :lang(en-us)" ),
			"XML :lang does not look above an ancestor with specified lang" );
		testLang( "XML self", anchor, anchor, "es", "419" );
		assert.ok(
			!jQuery( anchor ).is( ":lang(en), :lang(en-us), :lang(yue), :lang(yue-hk)" ),
			"XML :lang does not look above self with specified lang" );
	}

	// Cleanup
	if ( docXmlLang == null ) {
		docElem.removeAttribute( "xml:lang" );
	} else {
		docElem.setAttribute( "xml:lang", docXmlLang );
	}
	docElem.lang = docLang;
} );

QUnit.test( "context", function( assert ) {
	assert.expect( 21 );

	var context,
		selector = ".blog",
		expected = q( "mark", "simon" ),
		iframe = document.getElementById( "iframe" ),
		iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

	assert.deepEqual( jQuery( selector, document ).get(), expected, "explicit document context" );
	assert.deepEqual( jQuery( selector ).get(), expected, "unspecified context becomes document" );
	assert.deepEqual( jQuery( selector, undefined ).get(), expected,
		"undefined context becomes document" );
	assert.deepEqual( jQuery( selector, null ).get(), expected, "null context becomes document" );

	iframeDoc.open();
	iframeDoc.write( "<body><p id='foo'>bar</p></body>" );
	iframeDoc.close();
	expected = [ iframeDoc.getElementById( "foo" ) ];
	assert.deepEqual( jQuery( "p", iframeDoc ).get(), expected, "Other document context (simple)" );

	if ( QUnit.jQuerySelectors ) {
		assert.deepEqual( jQuery( "p:contains(ar)", iframeDoc ).get(), expected,
			"Other document context (complex)" );
	} else {
		assert.ok( "skip", ":contains not supported in selector-native" );
	}

	assert.deepEqual( jQuery( "span", iframeDoc ).get(), [],
		"Other document context (simple, no results)" );
	assert.deepEqual( jQuery( "* span", iframeDoc ).get(), [],
		"Other document context (complex, no results)" );

	context = document.getElementById( "nothiddendiv" );
	assert.deepEqual( jQuery( "*", context ).get(), q( "nothiddendivchild" ), "<div> context" );

	assert.deepEqual( jQuery( "* > *", context ).get(), [], "<div> context (no results)" );

	context.removeAttribute( "id" );
	assert.deepEqual( jQuery( "*", context ).get(), q( "nothiddendivchild" ), "no-id element context" );

	if ( QUnit.jQuerySelectors ) {
		assert.deepEqual( jQuery( "* > *", context ).get(), [], "no-id element context (no results)" );
	} else {
		assert.ok( "skip", ":contains not supported in selector-native" );
	}

	assert.strictEqual( context.getAttribute( "id" ) || "", "", "id not added by no-id selection" );

	context = document.getElementById( "lengthtest" );
	assert.deepEqual( jQuery( "input", context ).get(), q( "length", "idTest" ), "<form> context" );
	assert.deepEqual( jQuery( "select", context ).get(), [], "<form> context (no results)" );

	context = document.getElementById( "台北Táiběi" );
	expected = q( "台北Táiběi-child" );
	assert.deepEqual( jQuery( "span[id]", context ).get(), expected, "context with non-ASCII id" );
	assert.deepEqual( jQuery( "#台北Táiběi span[id]", context.parentNode ).get(), expected,
		"context with non-ASCII id selector prefix" );

	context = document.createDocumentFragment();

	// Capture *independent* expected nodes before they're detached from the page
	expected = q( "siblingnext", "siblingspan" );
	context.appendChild( document.getElementById( "siblingTest" ) );

	assert.deepEqual(
		jQuery( "em:nth-child(2)", context ).get(),
		expected.slice( 0, 1 ),
		"DocumentFragment context"
	);
	assert.deepEqual( jQuery( "span", context ).get(), expected.slice( 1 ),
		"DocumentFragment context by tag name" );
	assert.deepEqual( jQuery( "p", context ).get(), [], "DocumentFragment context (no results)" );

	if ( QUnit.jQuerySelectors ) {
		assert.deepEqual(
			jQuery( "em + :not(:has(*)):not(:empty), foo", context.firstChild ).get(),
			expected.slice( 0, 1 ),
			"Non-qSA path correctly sets detached context for sibling selectors (jQuery trac-14351)"
		);
	} else {
		assert.ok( "skip", ":has not supported in selector-native" );
	}
} );

// Support: IE 11+
// IE doesn't support the :scope pseudo-class so it will trigger MutationObservers.
// The test is skipped there.
QUnit.testUnlessIE( "selectors maintaining context don't trigger mutation observers", function( assert ) {
	assert.expect( 1 );

	var timeout,
		done = assert.async(),
		container = jQuery( "<div></div>" ),
		child = jQuery( "<div></div>" );

	child.appendTo( container );
	container.appendTo( "#qunit-fixture" );

	var observer = new MutationObserver(  function() {
		clearTimeout( timeout );
		observer.disconnect();
		assert.ok( false, "Mutation observer fired during selection" );
		done();
	} );
	observer.observe( container[ 0 ], { attributes: true } );

	container.find( "div div" );

	timeout = setTimeout( function() {
		observer.disconnect();
		assert.ok( true, "Mutation observer didn't fire during selection" );
		done();
	} );
} );

QUnit.test( "caching does not introduce bugs", function( assert ) {
	assert.expect( 3 );

	var sap = document.getElementById( "sap" );

	jQuery( ":not(code)", document.getElementById( "ap" ) );
	assert.deepEqual(
		jQuery( ":not(code)", document.getElementById( "foo" ) ).get(),
		q( "sndp", "en", "yahoo", "sap", "anchor2", "simon" ),
		"Reusing selector with new context"
	);

	if ( QUnit.jQuerySelectorsPos ) {
		assert.t( "Deep ancestry caching in post-positional element matcher (jQuery trac-14657)",
			"#qunit-fixture a:lt(3):parent",
			[ "simon1", "google", "groups" ] );
	} else {
		assert.ok( "skip", "Positional selectors are not supported" );
	}

	sap.className = "original";
	jQuery( "#qunit-fixture .original" );
	document.getElementById( "nothiddendiv" ).appendChild(
		sap.cloneNode( true ) ).className = "clone";
	assert.equal( jQuery( "#qunit-fixture .clone [href*='2']" ).length, 1,
		"Cloning does not poison caches" );
} );


QUnit.test( "disconnected nodes", function( assert ) {
	assert.expect( 1 );

	var $div = jQuery( "<div></div>" );
	assert.equal( $div.is( "div" ), true, "Make sure .is('nodeName') works on disconnected nodes." );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "disconnected nodes", function( assert ) {
	assert.expect( 3 );

	var $opt = jQuery( "<option></option>" ).attr( "value", "whipit" ).appendTo( "#qunit-fixture" ).detach();
	assert.equal( $opt.val(), "whipit", "option value" );
	assert.equal( $opt.is( ":selected" ), false, "unselected option" );
	$opt.prop( "selected", true );
	assert.equal( $opt.is( ":selected" ), true, "selected option" );
} );

// Support: IE 11+
// IE doesn't support Shadow DOM.
QUnit.testUnlessIE( "Shadow DOM nodes supported as root", function( assert ) {
	assert.expect( 2 );

	var shadowHost = jQuery( "<div></div>" ).appendTo( "#qunit-fixture" )[ 0 ];
	var shadowRoot = shadowHost.attachShadow( { mode: "open" } );

	shadowRoot.innerHTML = "<div class='vagabond'><p></p></div>";
	assert.equal( jQuery( shadowRoot ).find( ".vagabond" ).length, 1,
		"Selection by class with shadow root" );
	assert.equal( jQuery( shadowRoot ).find( "p" ).length, 1,
		"Paragraph element selected from shadow root" );
} );

testIframe(
	"attributes - jQuery.attr",
	"selector/html5_selector.html",
	function( assert, jQuery, window, document ) {
		assert.expect( 38 );

		/**
		 * Returns an array of elements with the given IDs
		 * q & t are added here for the iFrame's context
		 */
		function q() {
			var r = [],
				i = 0;

			for ( ; i < arguments.length; i++ ) {
				r.push( document.getElementById( arguments[ i ] ) );
			}
			return r;
		}

		/**
		 * Asserts that a select matches the given IDs
		 * @example t("Check for something", "//[a]", ["foo", "bar"]);
		 * @param {String} message - Assertion name
		 * @param {String} selector - jQuery selector
		 * @param {Array} expectedIds - Array of ids to construct what is expected
		 */
		function t( message, selector, expectedIds ) {
			var elems = jQuery( selector ).get();

			assert.deepEqual( elems, q.apply( q, expectedIds ), message + " (" + selector + ")" );
		}

		// ====== All known boolean attributes, including html5 booleans ======
		// autobuffer, autofocus, autoplay, async, checked,
		// compact, controls, declare, defer, disabled,
		// formnovalidate, hidden, indeterminate (property only),
		// ismap, itemscope, loop, multiple, muted, nohref, noresize,
		// noshade, nowrap, novalidate, open, pubdate, readonly, required,
		// reversed, scoped, seamless, selected, truespeed, visible (skipping visible attribute, which is on a barprop object)

		t( "Attribute Exists", "[autobuffer]",     [ "video1" ] );
		t( "Attribute Exists", "[autofocus]",      [ "text1" ] );
		t( "Attribute Exists", "[autoplay]",       [ "video1" ] );
		t( "Attribute Exists", "[async]",          [ "script1" ] );
		t( "Attribute Exists", "[checked]",        [ "check1" ] );
		t( "Attribute Exists", "[compact]",        [ "dl" ] );
		t( "Attribute Exists", "[controls]",       [ "video1" ] );
		t( "Attribute Exists", "[declare]",        [ "object1" ] );
		t( "Attribute Exists", "[defer]",          [ "script1" ] );
		t( "Attribute Exists", "[disabled]",       [ "check1" ] );
		t( "Attribute Exists", "[formnovalidate]", [ "form1" ] );
		t( "Attribute Exists", "[hidden]",         [ "div1" ] );
		t( "Attribute Exists", "[indeterminate]",  [] );
		t( "Attribute Exists", "[ismap]",          [ "img1" ] );
		t( "Attribute Exists", "[itemscope]",      [ "div1" ] );
		t( "Attribute Exists", "[loop]",           [ "video1" ] );
		t( "Attribute Exists", "[multiple]",       [ "select1" ] );
		t( "Attribute Exists", "[muted]",          [ "audio1" ] );
		t( "Attribute Exists", "[nohref]",         [ "area1" ] );
		t( "Attribute Exists", "[noresize]",       [ "textarea1" ] );
		t( "Attribute Exists", "[noshade]",        [ "hr1" ] );
		t( "Attribute Exists", "[nowrap]",         [ "td1", "div1" ] );
		t( "Attribute Exists", "[novalidate]",     [ "form1" ] );
		t( "Attribute Exists", "[open]",           [ "details1" ] );
		t( "Attribute Exists", "[pubdate]",        [ "article1" ] );
		t( "Attribute Exists", "[readonly]",       [ "text1" ] );
		t( "Attribute Exists", "[required]",       [ "text1" ] );
		t( "Attribute Exists", "[reversed]",       [ "ol1" ] );
		t( "Attribute Exists", "[scoped]",         [ "style1" ] );
		t( "Attribute Exists", "[seamless]",       [ "iframe1" ] );
		t( "Attribute Exists", "[selected]",       [ "option1" ] );
		t( "Attribute Exists", "[truespeed]",      [ "marquee1" ] );

		// Enumerated attributes (these are not boolean content attributes)
		jQuery.expandedEach = jQuery.each;
		jQuery.expandedEach( [ "draggable", "contenteditable", "aria-disabled" ], function( i, val ) {
			t( "Enumerated attribute", "[" + val + "]", [ "div1" ] );
		} );
		t( "Enumerated attribute", "[spellcheck]", [ "span1" ] );

		t( "tabindex selector does not retrieve all elements in IE6/7 (trac-8473)",
			"form, [tabindex]", [ "form1", "text1" ] );
		t( "Improperly named form elements do not interfere with form selections (trac-9570)", "form[name='formName']", [ "form1" ] );
	}
);

QUnit.test( "find in document fragments", function( assert ) {
	assert.expect( 1 );

	var elem,
		nonnodes = jQuery( "#nonnodes" ).contents(),
		fragment = document.createDocumentFragment();

	nonnodes.each( function() {
		fragment.appendChild( this );
	} );

	elem = jQuery( fragment ).find( "#nonnodesElement" );
	assert.strictEqual( elem.length, 1, "Selection works" );
} );

function getUniqueSortFixtures() {
	var i,
		detached = [],
		body = document.body,
		fixture = document.getElementById( "qunit-fixture" ),
		detached1 = document.createElement( "p" ),
		detached2 = document.createElement( "ul" ),
		detachedChild = detached1.appendChild( document.createElement( "a" ) ),
		detachedGrandchild = detachedChild.appendChild( document.createElement( "b" ) );

	for ( i = 0; i < 12; i++ ) {
		detached.push( document.createElement( "li" ) );
		detached[ i ].id = "detached" + i;
		detached2.appendChild( document.createElement( "li" ) ).id = "detachedChild" + i;
	}

	return {
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
				detached2.childNodes[ 3 ],
				detached2.childNodes[ 0 ],
				detached2.childNodes[ 2 ],
				detached2.childNodes[ 1 ]
			],
			expected: [
				detached2.childNodes[ 0 ],
				detached2.childNodes[ 1 ],
				detached2.childNodes[ 2 ],
				detached2.childNodes[ 3 ]
			]
		},
		"Attached/detached mixture": {
			input: [ detached1, fixture, detached2, document, detachedChild, body, detachedGrandchild ],
			expected: [ document, body, fixture ],
			length: 3
		}
	};
}

QUnit.test( "jQuery.uniqueSort", function( assert ) {
	assert.expect( 14 );

	var fixtures = getUniqueSortFixtures();

	function Arrayish( arr ) {
		var i = this.length = arr.length;
		while ( i-- ) {
			this[ i ] = arr[ i ];
		}
	}
	Arrayish.prototype = {
		sliceForTestOnly: [].slice
	};

	jQuery.each( fixtures, function( label, fixture ) {
		var length = fixture.length || fixture.input.length;

		// We duplicate `fixture.input` because otherwise it is modified by `uniqueSort`
		// and the second test becomes worthless.
		assert.deepEqual(
			jQuery.uniqueSort( fixture.input.slice( 0 ) )
				.slice( 0, length ),
			fixture.expected,
			label + " (array)"
		);

		assert.deepEqual(
			jQuery.uniqueSort( new Arrayish( fixture.input ) )
				.sliceForTestOnly( 0, length ),
			fixture.expected,
			label + " (quasi-array)"
		);
	} );
} );

QUnit.test( "uniqueSort()", function( assert ) {
	assert.expect( 28 );

	var fixtures = getUniqueSortFixtures();

	jQuery.each( fixtures, function( label, fixture ) {
		var length = fixture.length || fixture.input.length,
			fixtureInputCopy = fixture.input.slice( 0 ),
			sortedElem = jQuery( fixture.input ).uniqueSort();

		assert.deepEqual( fixture.input, fixtureInputCopy, "Fixture not modified (" + label + ")" );

		assert.deepEqual( sortedElem.slice( 0, length ).toArray(), fixture.expected, label );

		// Chaining
		assert.ok( sortedElem instanceof jQuery, "chaining" );
		assert.deepEqual( sortedElem.end().toArray(), fixture.input, label );
	} );
} );

testIframe(
	"jQuery.uniqueSort works cross-window (trac-14381)",
	"selector/mixed_sort.html",
	function( assert, jQuery, window, document, actual, expected ) {
		assert.expect( 1 );

		assert.deepEqual( actual, expected, "Mixed array was sorted correctly" );
	}
);

testIframe(
	"jQuery selector cache collides with multiple jQueries on a page",
	"selector/cache.html",
	function( assert, jQuery, window, document ) {
		var $cached = window.$cached;

		assert.expect( 4 );
		assert.notStrictEqual( jQuery, $cached, "Loaded two engines" );
		assert.deepEqual( $cached( ".test a" ).get(), [ document.getElementById( "collision" ) ], "Select collision anchor with first sizzle" );
		assert.equal( jQuery( ".evil a" ).length, 0, "Select nothing with second sizzle" );
		assert.equal( jQuery( ".evil a" ).length, 0, "Select nothing again with second sizzle" );
	}
);

QUnit.test( "Iframe dispatch should not affect jQuery (trac-13936)", function( assert ) {
	assert.expect( 1 );
	var loaded = false,
		thrown = false,
		iframe = document.getElementById( "iframe" ),
		iframeDoc = iframe.contentDocument || iframe.contentWindow.document,
		done = assert.async();

	jQuery( iframe ).on( "load", function() {
		var form;

		try {
			iframeDoc = this.contentDocument || this.contentWindow.document;
			form = jQuery( "#navigate", iframeDoc )[ 0 ];
		} catch ( e ) {
			thrown = e;
		}

		if ( loaded ) {
			assert.strictEqual( thrown, false, "No error thrown from post-reload jQuery call" );

			// clean up
			jQuery( iframe ).off();

			done();
		} else {
			loaded = true;
			form.submit();
		}
	} );

	iframeDoc.open();
	iframeDoc.write( "<body><form id='navigate' action='?'></form></body>" );
	iframeDoc.close();
} );

QUnit.test( "jQuery.escapeSelector", function( assert ) {
	assert.expect( 58 );

	// Edge cases
	assert.equal( jQuery.escapeSelector(), "undefined", "Converts undefined to string" );
	assert.equal( jQuery.escapeSelector( "-" ), "\\-", "Escapes standalone dash" );
	assert.equal( jQuery.escapeSelector( "-a" ), "-a", "Doesn't escape leading dash followed by non-number" );
	assert.equal( jQuery.escapeSelector( "--" ), "--", "Doesn't escape standalone double dash" );
	assert.equal( jQuery.escapeSelector( "\uFFFD" ), "\uFFFD",
		"Doesn't escape standalone replacement character" );
	assert.equal( jQuery.escapeSelector( "a\uFFFD" ), "a\uFFFD",
		"Doesn't escape trailing replacement character" );
	assert.equal( jQuery.escapeSelector( "\uFFFDb" ), "\uFFFDb",
		"Doesn't escape leading replacement character" );
	assert.equal( jQuery.escapeSelector( "a\uFFFDb" ), "a\uFFFDb",
		"Doesn't escape embedded replacement character" );

	// Derived from CSSOM tests
	// https://test.csswg.org/harness/test/cssom-1_dev/section/7.1/

	// String conversion
	assert.equal( jQuery.escapeSelector( true ), "true", "Converts boolean true to string" );
	assert.equal( jQuery.escapeSelector( false ), "false", "Converts boolean true to string" );
	assert.equal( jQuery.escapeSelector( null ), "null", "Converts null to string" );
	assert.equal( jQuery.escapeSelector( "" ), "", "Doesn't modify empty string" );

	// Null bytes
	assert.equal( jQuery.escapeSelector( "\0" ), "\uFFFD",
		"Escapes null-character input as replacement character" );
	assert.equal( jQuery.escapeSelector( "a\0" ), "a\uFFFD",
		"Escapes trailing-null input as replacement character" );
	assert.equal( jQuery.escapeSelector( "\0b" ), "\uFFFDb",
		"Escapes leading-null input as replacement character" );
	assert.equal( jQuery.escapeSelector( "a\0b" ), "a\uFFFDb",
		"Escapes embedded-null input as replacement character" );

	// Number prefix
	assert.equal( jQuery.escapeSelector( "0a" ), "\\30 a", "Escapes leading 0" );
	assert.equal( jQuery.escapeSelector( "1a" ), "\\31 a", "Escapes leading 1" );
	assert.equal( jQuery.escapeSelector( "2a" ), "\\32 a", "Escapes leading 2" );
	assert.equal( jQuery.escapeSelector( "3a" ), "\\33 a", "Escapes leading 3" );
	assert.equal( jQuery.escapeSelector( "4a" ), "\\34 a", "Escapes leading 4" );
	assert.equal( jQuery.escapeSelector( "5a" ), "\\35 a", "Escapes leading 5" );
	assert.equal( jQuery.escapeSelector( "6a" ), "\\36 a", "Escapes leading 6" );
	assert.equal( jQuery.escapeSelector( "7a" ), "\\37 a", "Escapes leading 7" );
	assert.equal( jQuery.escapeSelector( "8a" ), "\\38 a", "Escapes leading 8" );
	assert.equal( jQuery.escapeSelector( "9a" ), "\\39 a", "Escapes leading 9" );

	// Letter-number prefix
	assert.equal( jQuery.escapeSelector( "a0b" ), "a0b", "Doesn't escape embedded 0" );
	assert.equal( jQuery.escapeSelector( "a1b" ), "a1b", "Doesn't escape embedded 1" );
	assert.equal( jQuery.escapeSelector( "a2b" ), "a2b", "Doesn't escape embedded 2" );
	assert.equal( jQuery.escapeSelector( "a3b" ), "a3b", "Doesn't escape embedded 3" );
	assert.equal( jQuery.escapeSelector( "a4b" ), "a4b", "Doesn't escape embedded 4" );
	assert.equal( jQuery.escapeSelector( "a5b" ), "a5b", "Doesn't escape embedded 5" );
	assert.equal( jQuery.escapeSelector( "a6b" ), "a6b", "Doesn't escape embedded 6" );
	assert.equal( jQuery.escapeSelector( "a7b" ), "a7b", "Doesn't escape embedded 7" );
	assert.equal( jQuery.escapeSelector( "a8b" ), "a8b", "Doesn't escape embedded 8" );
	assert.equal( jQuery.escapeSelector( "a9b" ), "a9b", "Doesn't escape embedded 9" );

	// Dash-number prefix
	assert.equal( jQuery.escapeSelector( "-0a" ), "-\\30 a", "Escapes 0 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-1a" ), "-\\31 a", "Escapes 1 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-2a" ), "-\\32 a", "Escapes 2 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-3a" ), "-\\33 a", "Escapes 3 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-4a" ), "-\\34 a", "Escapes 4 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-5a" ), "-\\35 a", "Escapes 5 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-6a" ), "-\\36 a", "Escapes 6 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-7a" ), "-\\37 a", "Escapes 7 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-8a" ), "-\\38 a", "Escapes 8 after leading dash" );
	assert.equal( jQuery.escapeSelector( "-9a" ), "-\\39 a", "Escapes 9 after leading dash" );

	// Double dash prefix
	assert.equal( jQuery.escapeSelector( "--a" ), "--a", "Doesn't escape leading double dash" );

	// Miscellany
	assert.equal( jQuery.escapeSelector( "\x01\x02\x1E\x1F" ), "\\1 \\2 \\1e \\1f ",
		"Escapes C0 control characters" );
	assert.equal( jQuery.escapeSelector( "\x80\x2D\x5F\xA9" ), "\x80\x2D\x5F\xA9",
		"Doesn't escape general punctuation or non-ASCII ISO-8859-1 characters" );
	assert.equal(
		jQuery.escapeSelector( "\x7F\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90" +
			"\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F" ),
		"\\7f \x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90" +
		"\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F",
		"Escapes DEL control character"
	);
	assert.equal( jQuery.escapeSelector( "\xA0\xA1\xA2" ), "\xA0\xA1\xA2",
		"Doesn't escape non-ASCII ISO-8859-1 characters" );
	assert.equal( jQuery.escapeSelector( "a0123456789b" ), "a0123456789b",
		"Doesn't escape embedded numbers" );
	assert.equal( jQuery.escapeSelector( "abcdefghijklmnopqrstuvwxyz" ), "abcdefghijklmnopqrstuvwxyz",
		"Doesn't escape lowercase ASCII letters" );
	assert.equal( jQuery.escapeSelector( "ABCDEFGHIJKLMNOPQRSTUVWXYZ" ), "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		"Doesn't escape uppercase ASCII letters" );
	assert.equal( jQuery.escapeSelector( "\x20\x21\x78\x79" ), "\\ \\!xy",
		"Escapes non-word ASCII characters" );

	// Astral symbol (U+1D306 TETRAGRAM FOR CENTRE)
	assert.equal( jQuery.escapeSelector( "\uD834\uDF06" ), "\uD834\uDF06",
		"Doesn't escape astral characters" );

	// Lone surrogates
	assert.equal( jQuery.escapeSelector( "\uDF06" ), "\uDF06", "Doesn't escape lone low surrogate" );
	assert.equal( jQuery.escapeSelector( "\uD834" ), "\uD834", "Doesn't escape lone high surrogate" );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "custom pseudos", function( assert ) {
	assert.expect( 6 );

	try {
		jQuery.expr.filters.foundation = jQuery.expr.filters.root;
		assert.deepEqual( jQuery.find( ":foundation" ), [ document.documentElement ], "Copy element filter with new name" );
	} finally {
		delete jQuery.expr.filters.foundation;
	}

	try {
		jQuery.expr.setFilters.primary = jQuery.expr.setFilters.first;
		assert.t( "Copy set filter with new name", "div#qunit-fixture :primary", [ "firstp" ] );
	} finally {
		delete jQuery.expr.setFilters.primary;
	}

	try {
		jQuery.expr.filters.aristotlean = jQuery.expr.createPseudo( function() {
			return function( elem ) {
				return !!elem.id;
			};
		} );
		assert.t( "Custom element filter", "#foo :aristotlean", [ "sndp", "en", "yahoo", "sap", "anchor2", "simon" ] );
	} finally {
		delete jQuery.expr.filters.aristotlean;
	}

	try {
		jQuery.expr.filters.endswith = jQuery.expr.createPseudo( function( text ) {
			return function( elem ) {
				return jQuery.text( elem ).slice( -text.length ) === text;
			};
		} );
		assert.t( "Custom element filter with argument", "a:endswith(ogle)", [ "google" ] );
	} finally {
		delete jQuery.expr.filters.endswith;
	}

	try {
		jQuery.expr.setFilters.second = jQuery.expr.createPseudo( function() {
			return jQuery.expr.createPseudo( function( seed, matches ) {
				if ( seed[ 1 ] ) {
					matches[ 1 ] = seed[ 1 ];
					seed[ 1 ] = false;
				}
			} );
		} );
		assert.t( "Custom set filter", "#qunit-fixture p:second", [ "ap" ] );
	} finally {
		delete jQuery.expr.filters.second;
	}

	try {
		jQuery.expr.setFilters.slice = jQuery.expr.createPseudo( function( argument ) {
			var bounds = argument.split( ":" );
			return jQuery.expr.createPseudo( function( seed, matches ) {
				var i = bounds[ 1 ];

				// Match elements found at the specified indexes
				while ( --i >= bounds[ 0 ] ) {
					if ( seed[ i ] ) {
						matches[ i ] = seed[ i ];
						seed[ i ] = false;
					}
				}
			} );
		} );
		assert.t( "Custom set filter with argument", "#qunit-fixture p:slice(1:3)", [ "ap", "sndp" ] );
	} finally {
		delete jQuery.expr.filters.slice;
	}
} );
