QUnit.module( "selector", { teardown: moduleTeardown } );

/**
 * This test page is for selector tests that require jQuery in order to do the selection
 */

QUnit.test( "element", function( assert ) {
	assert.expect( 7 );

	var fixture = document.getElementById( "qunit-fixture" );

	assert.deepEqual( jQuery( "p", fixture ).get(), q( "firstp", "ap", "sndp", "en", "sap", "first" ), "Finding elements with a Node context." );
	assert.deepEqual( jQuery( "p", "#qunit-fixture" ).get(), q( "firstp", "ap", "sndp", "en", "sap", "first" ), "Finding elements with a selector context." );
	assert.deepEqual( jQuery( "p", jQuery( "#qunit-fixture" ) ).get(), q( "firstp", "ap", "sndp", "en", "sap", "first" ), "Finding elements with a jQuery object context." );
	assert.deepEqual( jQuery( "#qunit-fixture" ).find( "p" ).get(), q( "firstp", "ap", "sndp", "en", "sap", "first" ), "Finding elements with a context via .find()." );

	assert.ok( jQuery( "#length" ).length, "<input name=\"length\"> cannot be found under IE, see #945" );
	assert.ok( jQuery( "#lengthtest input" ).length, "<input name=\"length\"> cannot be found under IE, see #945" );

	// #7533
	assert.equal( jQuery( "<div id=\"A'B~C.D[E]\"><p>foo</p></div>" ).find( "p" ).length, 1, "Find where context root is a node and has an ID with CSS3 meta characters" );
} );

QUnit.test( "id", function( assert ) {
	assert.expect( 26 );

	var a;

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
	assert.t( "Escaped ID", "#test\\.foo\\[5\\]bar", [ "test.foo[5]bar" ] );
	assert.t( "Descendant escaped ID", "div #foo\\:bar", [ "foo:bar" ] );
	assert.t( "Descendant escaped ID", "div #test\\.foo\\[5\\]bar", [ "test.foo[5]bar" ] );
	assert.t( "Child escaped ID", "form > #foo\\:bar", [ "foo:bar" ] );
	assert.t( "Child escaped ID", "form > #test\\.foo\\[5\\]bar", [ "test.foo[5]bar" ] );

	assert.t( "ID Selector, child ID present", "#form > #radio1", [ "radio1" ] ); // bug #267
	assert.t( "ID Selector, not an ancestor ID", "#form #first", [] );
	assert.t( "ID Selector, not a child ID", "#form > #option1a", [] );

	assert.t( "All Children of ID", "#foo > *", [ "sndp", "en", "sap" ] );
	assert.t( "All Children of ID with no children", "#firstUL > *", [] );

	a = jQuery( "<a id='backslash\\foo'></a>" ).appendTo( "#qunit-fixture" );
	assert.t( "ID Selector contains backslash", "#backslash\\\\foo", [ "backslash\\foo" ] );

	assert.t( "ID Selector on Form with an input that has a name of 'id'", "#lengthtest", [ "lengthtest" ] );

	assert.t( "ID selector with non-existent ancestor", "#asdfasdf #foobar", [] ); // bug #986

	assert.t( "Underscore ID", "#types_all", [ "types_all" ] );
	assert.t( "Dash ID", "#qunit-fixture", [ "qunit-fixture" ] );

	assert.t( "ID with weird characters in it", "#name\\+value", [ "name+value" ] );
} );

QUnit.test( "class", function( assert ) {
	assert.expect( 4 );

	assert.deepEqual( jQuery( ".blog", document.getElementsByTagName( "p" ) ).get(), q( "mark", "simon" ), "Finding elements with a context." );
	assert.deepEqual( jQuery( ".blog", "p" ).get(), q( "mark", "simon" ), "Finding elements with a context." );
	assert.deepEqual( jQuery( ".blog", jQuery( "p" ) ).get(), q( "mark", "simon" ), "Finding elements with a context." );
	assert.deepEqual( jQuery( "p" ).find( ".blog" ).get(), q( "mark", "simon" ), "Finding elements with a context." );
} );

QUnit.test( "name", function( assert ) {
	assert.expect( 5 );

	var form;

	assert.t( "Name selector", "input[name=action]", [ "text1" ] );
	assert.t( "Name selector with single quotes", "input[name='action']", [ "text1" ] );
	assert.t( "Name selector with double quotes", "input[name=\"action\"]", [ "text1" ] );

	assert.t( "Name selector for grouped input", "input[name='types[]']", [ "types_all", "types_anime", "types_movie" ] );

	form = jQuery( "<form><input name='id'/></form>" ).appendTo( "body" );
	assert.equal( jQuery( "input", form[ 0 ] ).length, 1, "Make sure that rooted queries on forms (with possible expandos) work." );

	form.remove();
} );

QUnit.test( "selectors with comma", function( assert ) {
	assert.expect( 4 );

	var fixture = jQuery( "<div><h2><span/></h2><div><p><span/></p><p/></div></div>" );

	assert.equal( fixture.find( "h2, div p" ).filter( "p" ).length, 2, "has to find two <p>" );
	assert.equal( fixture.find( "h2, div p" ).filter( "h2" ).length, 1, "has to find one <h2>" );
	assert.equal( fixture.find( "h2 , div p" ).filter( "p" ).length, 2, "has to find two <p>" );
	assert.equal( fixture.find( "h2 , div p" ).filter( "h2" ).length, 1, "has to find one <h2>" );
} );

QUnit.test( "child and adjacent", function( assert ) {
	assert.expect( 27 );

	assert.t( "Child", "p > a", [ "simon1", "google", "groups", "mark", "yahoo", "simon" ] );
	assert.t( "Child", "p> a", [ "simon1", "google", "groups", "mark", "yahoo", "simon" ] );
	assert.t( "Child", "p >a", [ "simon1", "google", "groups", "mark", "yahoo", "simon" ] );
	assert.t( "Child", "p>a", [ "simon1", "google", "groups", "mark", "yahoo", "simon" ] );
	assert.t( "Child w/ Class", "p > a.blog", [ "mark", "simon" ] );
	assert.t( "All Children", "code > *", [ "anchor1", "anchor2" ] );
	assert.selectInFixture( "All Grandchildren", "p > * > *", [ "anchor1", "anchor2" ] );
	assert.t( "Adjacent", "p + p", [ "ap", "en", "sap" ] );
	assert.t( "Adjacent", "p#firstp + p", [ "ap" ] );
	assert.t( "Adjacent", "p[lang=en] + p", [ "sap" ] );
	assert.t( "Adjacent", "a.GROUPS + code + a", [ "mark" ] );
	assert.t( "Element Preceded By", "#groups ~ a", [ "mark" ] );
	assert.t( "Element Preceded By", "#length ~ input", [ "idTest" ] );
	assert.t( "Element Preceded By", "#siblingfirst ~ em", [ "siblingnext", "siblingthird" ] );
	assert.t( "Element Preceded By (multiple)", "#siblingTest em ~ em ~ em ~ span", [ "siblingspan" ] );

	if ( jQuery.find.compile ) {
		assert.t( "Element Preceded By, Containing", "#liveHandlerOrder ~ div em:contains('1')", [ "siblingfirst" ] );
		assert.t( "Combinators are not skipped when mixing general and specific", "#siblingTest > em:contains('x') + em ~ span", [] );
		assert.equal( jQuery( "#listWithTabIndex li:eq(2) ~ li" ).length, 1, "Find by general sibling combinator (#8310)" );
	} else {
		assert.ok( "skip", ":contains not supported in selector-native" );
		assert.ok( "skip", ":contains not supported in selector-native" );
		assert.ok( "skip", ":eq not supported in selector-native" );
	}

	assert.t( "Multiple combinators selects all levels", "#siblingTest em *", [ "siblingchild", "siblinggrandchild", "siblinggreatgrandchild" ] );
	assert.t( "Multiple combinators selects all levels", "#siblingTest > em *", [ "siblingchild", "siblinggrandchild", "siblinggreatgrandchild" ] );
	assert.t( "Multiple sibling combinators doesn't miss general siblings", "#siblingTest > em:first-child + em ~ span", [ "siblingspan" ] );

	assert.equal( jQuery( "#listWithTabIndex" ).length, 1, "Parent div for next test is found via ID (#8310)" );
	assert.equal( jQuery( "#__sizzle__" ).length, 0, "Make sure the temporary id assigned by sizzle is cleared out (#8310)" );
	assert.equal( jQuery( "#listWithTabIndex" ).length, 1, "Parent div for previous test is still found via ID (#8310)" );

	assert.t( "Verify deep class selector", "div.blah > p > a", [] );
	assert.t( "No element deep selector", "div.foo > span > a", [] );
	assert.t( "Non-existent ancestors", ".fototab > .thumbnails > a", [] );
} );

QUnit.test( "attributes", function( assert ) {
	assert.expect( 54 );

	var attrbad, div, withScript;

	assert.t( "Find elements with a tabindex attribute", "[tabindex]", [ "listWithTabIndex", "foodWithNegativeTabIndex", "linkWithTabIndex", "linkWithNegativeTabIndex", "linkWithNoHrefWithTabIndex", "linkWithNoHrefWithNegativeTabIndex" ] );

	assert.t( "Attribute Exists", "#qunit-fixture a[title]", [ "google" ] );
	assert.t( "Attribute Exists (case-insensitive)", "#qunit-fixture a[TITLE]", [ "google" ] );
	assert.t( "Attribute Exists", "#qunit-fixture *[title]", [ "google" ] );
	assert.t( "Attribute Exists", "#qunit-fixture [title]", [ "google" ] );
	assert.t( "Attribute Exists", "#qunit-fixture a[ title ]", [ "google" ] );

	assert.t( "Boolean attribute exists", "#select2 option[selected]", [ "option2d" ] );
	assert.t( "Boolean attribute equals", "#select2 option[selected='selected']", [ "option2d" ] );

	assert.t( "Attribute Equals", "#qunit-fixture a[rel='bookmark']", [ "simon1" ] );
	assert.t( "Attribute Equals", "#qunit-fixture a[rel='bookmark']", [ "simon1" ] );
	assert.t( "Attribute Equals", "#qunit-fixture a[rel=bookmark]", [ "simon1" ] );
	assert.t( "Attribute Equals", "#qunit-fixture a[href='http://www.google.com/']", [ "google" ] );
	assert.t( "Attribute Equals", "#qunit-fixture a[ rel = 'bookmark' ]", [ "simon1" ] );
	assert.t( "Attribute Equals Number", "#qunit-fixture option[value='1']", [ "option1b", "option2b", "option3b", "option4b", "option5c" ] );
	assert.t( "Attribute Equals Number", "#qunit-fixture li[tabIndex='-1']", [ "foodWithNegativeTabIndex" ] );

	document.getElementById( "anchor2" ).href = "#2";
	assert.t( "href Attribute", "p a[href^='#']", [ "anchor2" ] );
	assert.t( "href Attribute", "p a[href*='#']", [ "simon1", "anchor2" ] );

	assert.t( "for Attribute", "form label[for]", [ "label-for" ] );
	assert.t( "for Attribute in form", "#form [for=action]", [ "label-for" ] );

	assert.t( "Attribute containing []", "input[name^='foo[']", [ "hidden2" ] );
	assert.t( "Attribute containing []", "input[name^='foo[bar]']", [ "hidden2" ] );
	assert.t( "Attribute containing []", "input[name*='[bar]']", [ "hidden2" ] );
	assert.t( "Attribute containing []", "input[name$='bar]']", [ "hidden2" ] );
	assert.t( "Attribute containing []", "input[name$='[bar]']", [ "hidden2" ] );
	assert.t( "Attribute containing []", "input[name$='foo[bar]']", [ "hidden2" ] );
	assert.t( "Attribute containing []", "input[name*='foo[bar]']", [ "hidden2" ] );

	assert.t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type='hidden']", [ "radio1", "radio2", "hidden1" ] );
	assert.t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=\"hidden\"]", [ "radio1", "radio2", "hidden1" ] );
	assert.t( "Multiple Attribute Equals", "#form input[type='radio'], #form input[type=hidden]", [ "radio1", "radio2", "hidden1" ] );

	assert.t( "Attribute selector using UTF8", "span[lang=中文]", [ "台北" ] );

	assert.t( "Attribute Begins With", "a[href ^= 'http://www']", [ "google", "yahoo" ] );
	assert.t( "Attribute Ends With", "a[href $= 'org/']", [ "mark" ] );
	assert.t( "Attribute Contains", "a[href *= 'google']", [ "google", "groups" ] );

	if ( jQuery.find.compile ) {
		assert.t( "Empty values", "#select1 option[value!='']", [ "option1b", "option1c", "option1d" ] );
		assert.t( "Attribute Is Not Equal", "#ap a[hreflang!='en']", [ "google", "groups", "anchor1" ] );
		assert.t( "Select options via :selected", "#select1 option:selected", [ "option1a" ] );
		assert.t( "Select options via :selected", "#select2 option:selected", [ "option2d" ] );
		assert.t( "Select options via :selected", "#select3 option:selected", [ "option3b", "option3c" ] );
		assert.t( "Select options via :selected", "select[name='select2'] option:selected", [ "option2d" ] );
	} else {
		assert.ok( "skip", "!= not supported in selector-native" );
		assert.ok( "skip", "!= not supported in selector-native" );
		assert.ok( "skip", ":selected not supported in selector-native" );
		assert.ok( "skip", ":selected not supported in selector-native" );
		assert.ok( "skip", ":selected not supported in selector-native" );
		assert.ok( "skip", ":selected not supported in selector-native" );
	}

	assert.t( "Empty values", "#select1 option[value='']", [ "option1a" ] );


	assert.t( "Grouped Form Elements", "input[name='foo[bar]']", [ "hidden2" ] );

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
	).appendTo( "#qunit-fixture" ).get();

	assert.t( "Underscores don't need escaping", "input[id=types_all]", [ "types_all" ] );

	assert.t( "input[type=text]", "#form input[type=text]", [ "text1", "text2", "hidden2", "name" ] );
	assert.t( "input[type=search]", "#form input[type=search]", [ "search" ] );

	withScript = supportjQuery( "<div><span><script src=''/></span></div>" );
	assert.ok( withScript.find( "#moretests script[src]" ).has( "script" ), "script[src] (jQuery #13777)" );

	div = document.getElementById( "foo" );
	assert.t( "Object.prototype property \"constructor\" (negative)", "[constructor]", [] );
	assert.t( "Gecko Object.prototype property \"watch\" (negative)", "[watch]", [] );
	div.setAttribute( "constructor", "foo" );
	div.setAttribute( "watch", "bar" );
	assert.t( "Object.prototype property \"constructor\"", "[constructor='foo']", [ "foo" ] );
	assert.t( "Gecko Object.prototype property \"watch\"", "[watch='bar']", [ "foo" ] );

	assert.t( "Value attribute is retrieved correctly", "input[value=Test]", [ "text1", "text2" ] );

	if ( jQuery.find.compile ) {

		// #12600
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
	}


	// #11115
	assert.ok( jQuery( "<input type='checkbox' checked='checked'/>" ).prop( "checked", false ).is( "[checked]" ),
		"[checked] selects by attribute (positive)"
	);
	assert.ok( !jQuery( "<input type='checkbox'/>" ).prop( "checked", true ).is( "[checked]" ),
		"[checked] selects by attribute (negative)"
	);
} );

QUnit.test( "disconnected nodes", function( assert ) {
	assert.expect( 1 );

	var $div = jQuery( "<div/>" );
	assert.equal( $div.is( "div" ), true, "Make sure .is('nodeName') works on disconnected nodes." );
} );

QUnit[ jQuery.find.compile ? "test" : "skip" ]( "disconnected nodes", function( assert ) {
	assert.expect( 3 );

	var $opt = jQuery( "<option></option>" ).attr( "value", "whipit" ).appendTo( "#qunit-fixture" ).detach();
	assert.equal( $opt.val(), "whipit", "option value" );
	assert.equal( $opt.is( ":selected" ), false, "unselected option" );
	$opt.prop( "selected", true );
	assert.equal( $opt.is( ":selected" ), true, "selected option" );
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
		 * @param {String} a - Assertion name
		 * @param {String} b - Sizzle selector
		 * @param {Array} c - Array of ids to construct what is expected
		 */
		function t( a, b, c ) {
			var f = jQuery( b ).get(),
				s = "",
				i = 0;

			for ( ; i < f.length; i++ ) {
				s += ( s && "," ) + "'" + f[ i ].id + "'";
			}

			assert.deepEqual( f, q.apply( q, c ), a + " (" + b + ")" );
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

		t( "tabindex selector does not retrieve all elements in IE6/7 (#8473)",
			"form, [tabindex]", [ "form1", "text1" ] );
		t( "Improperly named form elements do not interfere with form selections (#9570)", "form[name='formName']", [ "form1" ] );
	}
);

QUnit.test( "jQuery.contains", function( assert ) {
	assert.expect( 16 );

	var container = document.getElementById( "nonnodes" ),
		element = container.firstChild,
		text = element.nextSibling,
		nonContained = container.nextSibling,
		detached = document.createElement( "a" );
	assert.ok( element && element.nodeType === 1, "preliminary: found element" );
	assert.ok( text && text.nodeType === 3, "preliminary: found text" );
	assert.ok( nonContained, "preliminary: found non-descendant" );
	assert.ok( jQuery.contains( container, element ), "child" );
	assert.ok( jQuery.contains( container.parentNode, element ), "grandchild" );
	assert.ok( jQuery.contains( container, text ), "text child" );
	assert.ok( jQuery.contains( container.parentNode, text ), "text grandchild" );
	assert.ok( !jQuery.contains( container, container ), "self" );
	assert.ok( !jQuery.contains( element, container ), "parent" );
	assert.ok( !jQuery.contains( container, nonContained ), "non-descendant" );
	assert.ok( !jQuery.contains( container, document ), "document" );
	assert.ok( !jQuery.contains( container, document.documentElement ), "documentElement (negative)" );
	assert.ok( !jQuery.contains( container, null ), "Passing null does not throw an error" );
	assert.ok( jQuery.contains( document, document.documentElement ), "documentElement (positive)" );
	assert.ok( jQuery.contains( document, element ), "document container (positive)" );
	assert.ok( !jQuery.contains( document, detached ), "document container (negative)" );
} );

QUnit.test( "jQuery.uniqueSort", function( assert ) {
	assert.expect( 15 );

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
				detached2.childNodes[ 0 ],
				detached2.childNodes[ 1 ],
				detached2.childNodes[ 2 ],
				detached2.childNodes[ 3 ]
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

	jQuery.each( tests, function( label, test ) {
		var length = test.length || test.input.length;
		assert.deepEqual( jQuery.uniqueSort( test.input ).slice( 0, length ), test.expected, label + " (array)" );
		assert.deepEqual( jQuery.uniqueSort( new Arrayish( test.input ) ).slice( 0, length ), test.expected, label + " (quasi-array)" );
	} );

	assert.strictEqual( jQuery.unique, jQuery.uniqueSort, "jQuery.unique() is an alias for jQuery.uniqueSort()" );
} );

testIframe(
	"Sizzle cache collides with multiple Sizzles on a page",
	"selector/sizzle_cache.html",
	function( assert, jQuery, window, document ) {
		var $cached = window.$cached;

		assert.expect( 4 );
		assert.notStrictEqual( jQuery, $cached, "Loaded two engines" );
		assert.deepEqual( $cached( ".test a" ).get(), [ document.getElementById( "collision" ) ], "Select collision anchor with first sizzle" );
		assert.equal( jQuery( ".evil a" ).length, 0, "Select nothing with second sizzle" );
		assert.equal( jQuery( ".evil a" ).length, 0, "Select nothing again with second sizzle" );
	}
);

QUnit.asyncTest( "Iframe dispatch should not affect jQuery (#13936)", 1, function( assert ) {
	var loaded = false,
		thrown = false,
		iframe = document.getElementById( "iframe" ),
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
			assert.strictEqual( thrown, false, "No error thrown from post-reload jQuery call" );

			// clean up
			jQuery( iframe ).off();

			QUnit.start();
		} else {
			loaded = true;
			form.submit();
		}
	} );

	iframeDoc.open();
	iframeDoc.write( "<body><form id='navigate' action='?'></form></body>" );
	iframeDoc.close();
} );

QUnit.test( "Ensure escapeSelector exists (escape tests in Sizzle)", function( assert ) {
	assert.expect( 1 );

	assert.equal( jQuery.escapeSelector( "#foo.bar" ), "\\#foo\\.bar", "escapeSelector present" );
} );
