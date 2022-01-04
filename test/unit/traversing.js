QUnit.module( "traversing", { afterEach: moduleTeardown } );

QUnit.test( "find(String)", function( assert ) {
	assert.expect( 1 );
	assert.equal( jQuery( "#foo" ).find( ".blogTest" ).text(), "Yahoo", "Basic selector" );
} );

QUnit.test( "find(String) under non-elements", function( assert ) {
	assert.expect( 2 );

	var j = jQuery( "#nonnodes" ).contents();
	assert.equal( j.find( "div" ).length, 0, "Check node,textnode,comment to find zero divs" );
	assert.equal( j.find( "div" ).addBack().length, 3, "Check node,textnode,comment to find zero divs, but preserves pushStack" );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "find(leading combinator)", function( assert ) {
	assert.expect( 4 );

	assert.deepEqual( jQuery( "#qunit-fixture" ).find( "> div" ).get(), q( "foo", "nothiddendiv", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest", "fx-test-group" ), "find child elements" );
	assert.deepEqual( jQuery( "#qunit-fixture" ).find( "> #foo, > #moretests" ).get(), q( "foo", "moretests" ), "find child elements" );
	assert.deepEqual( jQuery( "#qunit-fixture" ).find( "> #foo > p" ).get(), q( "sndp", "en", "sap" ), "find child elements" );

	assert.deepEqual( jQuery( "#siblingTest, #siblingfirst" ).find( "+ *" ).get(), q( "siblingnext", "fx-test-group" ), "ensure document order" );
} );

QUnit.test( "find(node|jQuery object)", function( assert ) {
	assert.expect( 13 );

	var $foo = jQuery( "#foo" ),
		$blog = jQuery( ".blogTest" ),
		$first = jQuery( "#first" ),
		$two = $blog.add( $first ),
		$twoMore = jQuery( "#ap" ).add( $blog ),
		$fooTwo = $foo.add( $blog );

	assert.equal( $foo.find( $blog ).text(), "Yahoo", "Find with blog jQuery object" );
	assert.equal( $foo.find( $blog[ 0 ] ).text(), "Yahoo", "Find with blog node" );
	assert.equal( $foo.find( $first ).length, 0, "#first is not in #foo" );
	assert.equal( $foo.find( $first[ 0 ] ).length, 0, "#first not in #foo (node)" );
	assert.deepEqual( $foo.find( $two ).get(), $blog.get(), "Find returns only nodes within #foo" );
	assert.deepEqual( $foo.find( $twoMore ).get(), $blog.get(), "...regardless of order" );
	assert.ok( $fooTwo.find( $blog ).is( ".blogTest" ), "Blog is part of the collection, but also within foo" );
	assert.ok( $fooTwo.find( $blog[ 0 ] ).is( ".blogTest" ), "Blog is part of the collection, but also within foo(node)" );

	assert.equal( $two.find( $foo ).length, 0, "Foo is not in two elements" );
	assert.equal( $two.find( $foo[ 0 ] ).length, 0, "Foo is not in two elements(node)" );
	assert.equal( $two.find( $first ).length, 0, "first is in the collection and not within two" );
	assert.equal( $two.find( $first ).length, 0, "first is in the collection and not within two(node)" );

	assert.equal( $two.find( $foo[ 0 ] ).addBack().length, 2, "find preserves the pushStack, see trac-12009" );
} );

QUnit.test( "is(falsy|invalid)", function( assert ) {
	assert.expect( 5 );

	assert.ok( !jQuery( "#foo" ).is( 0 ), "Expected false for an invalid expression - 0" );
	assert.ok( !jQuery( "#foo" ).is( null ), "Expected false for an invalid expression - null" );
	assert.ok( !jQuery( "#foo" ).is( "" ), "Expected false for an invalid expression - \"\"" );
	assert.ok( !jQuery( "#foo" ).is( undefined ), "Expected false for an invalid expression - undefined" );
	assert.ok( !jQuery( "#foo" ).is( { plain: "object" } ), "Check passing invalid object" );
} );

QUnit.test( "is(String)", function( assert ) {
	assert.expect( 33 );

	var link = document.getElementById( "simon1" ),
		input = document.getElementById( "text1" ),
		option = document.getElementById( "option1a" ),
		disconnected = document.createElement( "div" );

	assert.ok( jQuery( "#form" ).is( "form" ), "Check for element: A form must be a form" );
	assert.ok( !jQuery( "#form" ).is( "div" ), "Check for element: A form is not a div" );
	assert.ok( jQuery( "#mark" ).is( ".blog" ), "Check for class: Expected class 'blog'" );
	assert.ok( !jQuery( "#mark" ).is( ".link" ), "Check for class: Did not expect class 'link'" );
	assert.ok( jQuery( "#simon" ).is( ".blog.link" ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	assert.ok( !jQuery( "#simon" ).is( ".blogTest" ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	assert.ok( jQuery( "#en" ).is( "[lang=\"en\"]" ), "Check for attribute: Expected attribute lang to be 'en'" );
	assert.ok( !jQuery( "#en" ).is( "[lang=\"de\"]" ), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	assert.ok( jQuery( "#text1" ).is( "[type=\"text\"]" ), "Check for attribute: Expected attribute type to be 'text'" );
	assert.ok( !jQuery( "#text1" ).is( "[type=\"radio\"]" ), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	assert.ok( jQuery( "#text2" ).is( ":disabled" ), "Check for pseudoclass: Expected to be disabled" );
	assert.ok( !jQuery( "#text1" ).is( ":disabled" ), "Check for pseudoclass: Expected not disabled" );
	assert.ok( jQuery( "#radio2" ).is( ":checked" ), "Check for pseudoclass: Expected to be checked" );
	assert.ok( !jQuery( "#radio1" ).is( ":checked" ), "Check for pseudoclass: Expected not checked" );

	// test is() with comma-separated expressions
	assert.ok( jQuery( "#en" ).is( "[lang=\"en\"],[lang=\"de\"]" ), "Comma-separated; Check for lang attribute: Expect en or de" );
	assert.ok( jQuery( "#en" ).is( "[lang=\"de\"],[lang=\"en\"]" ), "Comma-separated; Check for lang attribute: Expect en or de" );
	assert.ok( jQuery( "#en" ).is( "[lang=\"en\"] , [lang=\"de\"]" ), "Comma-separated; Check for lang attribute: Expect en or de" );
	assert.ok( jQuery( "#en" ).is( "[lang=\"de\"] , [lang=\"en\"]" ), "Comma-separated; Check for lang attribute: Expect en or de" );

	link.title = "Don't click me";
	assert.ok( jQuery( link ).is( "[rel='bookmark']" ), "attribute-equals string (delimited via apostrophes)" );
	assert.ok( jQuery( link ).is( "[rel=bookmark]" ), "attribute-equals identifier" );
	assert.ok( jQuery( link ).is( "[\nrel = bookmark\t]" ),
		"attribute-equals identifier (whitespace ignored)" );
	assert.ok( jQuery( link ).is( "a[title=\"Don't click me\"]" ),
		"attribute-equals string containing single quote" );

	// jQuery trac-12303
	input.setAttribute( "data-pos", ":first" );
	assert.ok( jQuery( input ).is( "input[data-pos=\\:first]" ),
		"attribute-equals POS in identifier" );
	assert.ok( jQuery( input ).is( "input[data-pos=':first']" ),
		"attribute-equals POS in string" );

	if ( QUnit.jQuerySelectors ) {
		assert.ok( jQuery( input ).is( ":input[data-pos=':first']" ),
			"attribute-equals POS in string after pseudo" );
	} else {
		assert.ok( "skip", ":input not supported in selector-native" );
	}

	option.setAttribute( "test", "" );
	assert.ok( jQuery( option ).is( "[id=option1a]" ),
		"id attribute-equals identifier" );

	if ( QUnit.jQuerySelectors ) {
		assert.ok( jQuery( option ).is( "[id*=option1][type!=checkbox]" ),
			"attribute-not-equals identifier" );
	} else {
		assert.ok( "skip", "attribute-not-equals not supported in selector-native" );
	}

	assert.ok( jQuery( option ).is( "[id*=option1]" ), "attribute-contains identifier" );
	assert.ok( !jQuery( option ).is( "[test^='']" ),
		"attribute-starts-with empty string (negative)" );

	option.className = "=]";
	assert.ok( jQuery( option ).is( ".\\=\\]" ),
		"class selector with attribute-equals confusable" );

	assert.ok( jQuery( disconnected ).is( "div" ), "disconnected element" );
	assert.ok( jQuery( link ).is( "* > *" ), "child combinator matches in document" );
	assert.ok( !jQuery( disconnected ).is( "* > *" ), "child combinator fails in fragment" );
} );

QUnit.test( "is() against non-elements (trac-10178)", function( assert ) {
	assert.expect( 14 );

	var label, i, test,
		collection = jQuery( document ),
		tests = [ "a", "*" ],
		nonelements = {
			text: document.createTextNode( "" ),
			comment: document.createComment( "" ),
			document: document,
			window: window,
			array: [],
			"plain object": {},
			"function": function() {}
		};

	for ( label in nonelements ) {
		collection[ 0 ] = nonelements[ label ];
		for ( i = 0; i < tests.length; i++ ) {
			test = tests[ i ];
			assert.ok( !collection.is( test ), label + " does not match \"" + test + "\"" );
		}
	}
} );

QUnit.test( "is(jQuery)", function( assert ) {
	assert.expect( 19 );
	assert.ok( jQuery( "#form" ).is( jQuery( "form" ) ), "Check for element: A form is a form" );
	assert.ok( !jQuery( "#form" ).is( jQuery( "div" ) ), "Check for element: A form is not a div" );
	assert.ok( jQuery( "#mark" ).is( jQuery( ".blog" ) ), "Check for class: Expected class 'blog'" );
	assert.ok( !jQuery( "#mark" ).is( jQuery( ".link" ) ), "Check for class: Did not expect class 'link'" );
	assert.ok( jQuery( "#simon" ).is( jQuery( ".blog.link" ) ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	assert.ok( !jQuery( "#simon" ).is( jQuery( ".blogTest" ) ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	assert.ok( jQuery( "#en" ).is( jQuery( "[lang=\"en\"]" ) ), "Check for attribute: Expected attribute lang to be 'en'" );
	assert.ok( !jQuery( "#en" ).is( jQuery( "[lang=\"de\"]" ) ), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	assert.ok( jQuery( "#text1" ).is( jQuery( "[type=\"text\"]" ) ), "Check for attribute: Expected attribute type to be 'text'" );
	assert.ok( !jQuery( "#text1" ).is( jQuery( "[type=\"radio\"]" ) ), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	assert.ok( !jQuery( "#text1" ).is( jQuery( "input:disabled" ) ), "Check for pseudoclass: Expected not disabled" );
	assert.ok( jQuery( "#radio2" ).is( jQuery( "input:checked" ) ), "Check for pseudoclass: Expected to be checked" );
	assert.ok( !jQuery( "#radio1" ).is( jQuery( "input:checked" ) ), "Check for pseudoclass: Expected not checked" );

	// Some raw elements
	assert.ok( jQuery( "#form" ).is( jQuery( "#qunit-fixture form" )[ 0 ] ), "Check for element: A form is a form" );
	assert.ok( !jQuery( "#form" ).is( jQuery( "div" )[ 0 ] ), "Check for element: A form is not a div" );
	assert.ok( jQuery( "#mark" ).is( jQuery( ".blog" )[ 0 ] ), "Check for class: Expected class 'blog'" );
	assert.ok( !jQuery( "#mark" ).is( jQuery( ".link" )[ 0 ] ), "Check for class: Did not expect class 'link'" );
	assert.ok( jQuery( "#simon" ).is( jQuery( ".blog.link" )[ 0 ] ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	assert.ok( !jQuery( "#simon" ).is( jQuery( ".blogTest" )[ 0 ] ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "is() with :has() selectors", function( assert ) {
	assert.expect( 6 );

	assert.ok( jQuery( "#foo" ).is( ":has(p)" ), "Check for child: Expected a child 'p' element" );
	assert.ok( !jQuery( "#foo" ).is( ":has(ul)" ), "Check for child: Did not expect 'ul' element" );
	assert.ok( jQuery( "#foo" ).is( ":has(p):has(a):has(code)" ), "Check for childs: Expected 'p', 'a' and 'code' child elements" );
	assert.ok( !jQuery( "#foo" ).is( ":has(p):has(a):has(code):has(ol)" ), "Check for childs: Expected 'p', 'a' and 'code' child elements, but no 'ol'" );

	assert.ok( jQuery( "#foo" ).is( jQuery( "div:has(p)" ) ), "Check for child: Expected a child 'p' element" );
	assert.ok( !jQuery( "#foo" ).is( jQuery( "div:has(ul)" ) ), "Check for child: Did not expect 'ul' element" );
} );

QUnit[ QUnit.jQuerySelectorsPos ? "test" : "skip" ]( "is() with positional selectors", function( assert ) {
	assert.expect( 27 );

	var
		posp = jQuery(
			"<p id='posp'><a class='firsta' href='#'><em>first</em></a>" +
			"<a class='seconda' href='#'><b>test</b></a><em></em></p>"
		).appendTo( "#qunit-fixture" ),
		isit = function( sel, match, expect ) {
			assert.equal(
				jQuery( sel ).is( match ),
				expect,
				"jQuery('" + sel + "').is('" + match + "')"
			);
		};

	isit( "#posp", "p:last", true );
	isit( "#posp", "#posp:first", true );
	isit( "#posp", "#posp:eq(2)", false );
	isit( "#posp", "#posp a:first", false );

	isit( "#posp .firsta", "#posp a:first", true );
	isit( "#posp .firsta", "#posp a:last", false );
	isit( "#posp .firsta", "#posp a:even", true );
	isit( "#posp .firsta", "#posp a:odd", false );
	isit( "#posp .firsta", "#posp a:eq(0)", true );
	isit( "#posp .firsta", "#posp a:eq(9)", false );
	isit( "#posp .firsta", "#posp em:eq(0)", false );
	isit( "#posp .firsta", "#posp em:first", false );
	isit( "#posp .firsta", "#posp:first", false );

	isit( "#posp .seconda", "#posp a:first", false );
	isit( "#posp .seconda", "#posp a:last", true );
	isit( "#posp .seconda", "#posp a:gt(0)", true );
	isit( "#posp .seconda", "#posp a:lt(5)", true );
	isit( "#posp .seconda", "#posp a:lt(1)", false );

	isit( "#posp em", "#posp a:eq(0) em", true );
	isit( "#posp em", "#posp a:lt(1) em", true );
	isit( "#posp em", "#posp a:gt(1) em", false );
	isit( "#posp em", "#posp a:first em", true );
	isit( "#posp em", "#posp a em:last", true );
	isit( "#posp em", "#posp a em:eq(2)", false );

	assert.ok( jQuery( "#option1b" ).is( "#select1 option:not(:first)" ), "POS inside of :not() (trac-10970)" );

	assert.ok( jQuery( posp[ 0 ] ).is( "p:last" ), "context constructed from a single node (trac-13797)" );
	assert.ok( !jQuery( posp[ 0 ] ).find( "#firsta" ).is( "a:first" ), "context derived from a single node (trac-13797)" );
} );

QUnit.test( "index()", function( assert ) {
	assert.expect( 2 );

	assert.equal( jQuery( "#text2" ).index(), 2, "Returns the index of a child amongst its siblings" );

	assert.equal( jQuery( "<div></div>" ).index(), -1, "Node without parent returns -1" );
} );

QUnit.test( "index(Object|String|undefined)", function( assert ) {
	assert.expect( 16 );

	var elements = jQuery( [ window, document ] ),
		inputElements = jQuery( "#radio1,#radio2,#check1,#check2" );

	// Passing a node
	assert.equal( elements.index( window ), 0, "Check for index of elements" );
	assert.equal( elements.index( document ), 1, "Check for index of elements" );
	assert.equal( inputElements.index( document.getElementById( "radio1" ) ), 0, "Check for index of elements" );
	assert.equal( inputElements.index( document.getElementById( "radio2" ) ), 1, "Check for index of elements" );
	assert.equal( inputElements.index( document.getElementById( "check1" ) ), 2, "Check for index of elements" );
	assert.equal( inputElements.index( document.getElementById( "check2" ) ), 3, "Check for index of elements" );
	assert.equal( inputElements.index( window ), -1, "Check for not found index" );
	assert.equal( inputElements.index( document ), -1, "Check for not found index" );

	// Passing a jQuery object
	// enabled since [5500]
	assert.equal( elements.index( elements ), 0, "Pass in a jQuery object" );
	assert.equal( elements.index( elements.eq( 1 ) ), 1, "Pass in a jQuery object" );
	assert.equal( jQuery( "#form input[type='radio']" ).index( jQuery( "#radio2" ) ), 1, "Pass in a jQuery object" );

	// Passing a selector or nothing
	// enabled since [6330]
	assert.equal( jQuery( "#text2" ).index(), 2, "Check for index amongst siblings" );
	assert.equal( jQuery( "#form" ).children().eq( 4 ).index(), 4, "Check for index amongst siblings" );
	assert.equal( jQuery( "#radio2" ).index( "#form input[type='radio']" ), 1, "Check for index within a selector" );
	assert.equal( jQuery( "#form input[type='radio']" ).index( jQuery( "#radio2" ) ), 1, "Check for index within a selector" );
	assert.equal( jQuery( "#radio2" ).index( "#form input[type='text']" ), -1, "Check for index not found within a selector" );
} );

QUnit.test( "filter(Selector|undefined)", function( assert ) {
	assert.expect( 9 );
	assert.deepEqual( jQuery( "#form input" ).filter( ":checked" ).get(), q( "radio2", "check1" ), "filter(String)" );
	assert.deepEqual( jQuery( "p" ).filter( "#ap, #sndp" ).get(), q( "ap", "sndp" ), "filter('String, String')" );
	assert.deepEqual( jQuery( "p" ).filter( "#ap,#sndp" ).get(), q( "ap", "sndp" ), "filter('String,String')" );

	assert.deepEqual( jQuery( "p" ).filter( null ).get(),      [], "filter(null) should return an empty jQuery object" );
	assert.deepEqual( jQuery( "p" ).filter( undefined ).get(), [], "filter(undefined) should return an empty jQuery object" );
	assert.deepEqual( jQuery( "p" ).filter( 0 ).get(),         [], "filter(0) should return an empty jQuery object" );
	assert.deepEqual( jQuery( "p" ).filter( "" ).get(),        [], "filter('') should return an empty jQuery object" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery( "#nonnodes" ).contents();
	assert.equal( j.filter( "span" ).length, 1, "Check node,textnode,comment to filter the one span" );
	assert.equal( j.filter( "[name]" ).length, 0, "Check node,textnode,comment to filter the one span" );
} );

QUnit.test( "filter(Function)", function( assert ) {
	assert.expect( 2 );

	assert.deepEqual( jQuery( "#qunit-fixture p" ).filter( function() {
		return !jQuery( "a", this ).length;
	} ).get(), q( "sndp", "first" ), "filter(Function)" );

	assert.deepEqual( jQuery( "#qunit-fixture p" ).filter( function( i, elem ) { return !jQuery( "a", elem ).length; } ).get(), q( "sndp", "first" ), "filter(Function) using arg" );
} );

QUnit.test( "filter(Element)", function( assert ) {
	assert.expect( 1 );

	var element = document.getElementById( "text1" );
	assert.deepEqual( jQuery( "#form input" ).filter( element ).get(), q( "text1" ), "filter(Element)" );
} );

QUnit.test( "filter(Array)", function( assert ) {
	assert.expect( 1 );

	var elements = [ document.getElementById( "text1" ) ];
	assert.deepEqual( jQuery( "#form input" ).filter( elements ).get(), q( "text1" ), "filter(Element)" );
} );

QUnit.test( "filter(jQuery)", function( assert ) {
	assert.expect( 1 );

	var elements = jQuery( "#text1" );
	assert.deepEqual( jQuery( "#form input" ).filter( elements ).get(), q( "text1" ), "filter(Element)" );
} );

QUnit[ QUnit.jQuerySelectorsPos ? "test" : "skip" ]( "filter() with positional selectors", function( assert ) {
	assert.expect( 19 );

	var filterit = function( sel, filter, length ) {
		assert.equal( jQuery( sel ).filter( filter ).length, length, "jQuery( " + sel + " ).filter( " + filter + " )" );
	};

	jQuery( "" +
		"<p id='posp'>" +
			"<a class='firsta' href='#'>" +
				"<em>first</em>" +
			"</a>" +
			"<a class='seconda' href='#'>" +
				"<b>test</b>" +
			"</a>" +
			"<em></em>" +
		"</p>" ).appendTo( "#qunit-fixture" );

	filterit( "#posp", "#posp:first", 1 );
	filterit( "#posp", "#posp:eq(2)", 0 );
	filterit( "#posp", "#posp a:first", 0 );

	// Keep in mind this is within the selection and
	// not in relation to other elements (.is() is a different story)
	filterit( "#posp .firsta", "#posp a:first", 1 );
	filterit( "#posp .firsta", "#posp a:last", 1 );
	filterit( "#posp .firsta", "#posp a:last-child", 0 );
	filterit( "#posp .firsta", "#posp a:even", 1 );
	filterit( "#posp .firsta", "#posp a:odd", 0 );
	filterit( "#posp .firsta", "#posp a:eq(0)", 1 );
	filterit( "#posp .firsta", "#posp a:eq(9)", 0 );
	filterit( "#posp .firsta", "#posp em:eq(0)", 0 );
	filterit( "#posp .firsta", "#posp em:first", 0 );
	filterit( "#posp .firsta", "#posp:first", 0 );

	filterit( "#posp .seconda", "#posp a:first", 1 );
	filterit( "#posp .seconda", "#posp em:first", 0 );
	filterit( "#posp .seconda", "#posp a:last", 1 );
	filterit( "#posp .seconda", "#posp a:gt(0)", 0 );
	filterit( "#posp .seconda", "#posp a:lt(5)", 1 );
	filterit( "#posp .seconda", "#posp a:lt(1)", 1 );
} );

QUnit.test( "closest()", function( assert ) {
	assert.expect( 14 );

	var jq;

	assert.deepEqual( jQuery( "body" ).closest( "body" ).get(), q( "body" ), "closest(body)" );
	assert.deepEqual( jQuery( "body" ).closest( "html" ).get(), q( "html" ), "closest(html)" );
	assert.deepEqual( jQuery( "body" ).closest( "div" ).get(), [], "closest(div)" );
	assert.deepEqual( jQuery( "#qunit-fixture" ).closest( "span,#html" ).get(), q( "html" ), "closest(span,#html)" );

	// Test .closest() limited by the context
	jq = jQuery( "#nothiddendivchild" );
	assert.deepEqual( jq.closest( "html", document.body ).get(), [], "Context limited." );
	assert.deepEqual( jq.closest( "body", document.body ).get(), [], "Context limited." );
	assert.deepEqual( jq.closest( "#nothiddendiv", document.body ).get(), q( "nothiddendiv" ), "Context not reached." );

	//Test that .closest() returns unique'd set
	assert.equal( jQuery( "#qunit-fixture p" ).closest( "#qunit-fixture" ).length, 1, "Closest should return a unique set" );

	// Test on disconnected node
	assert.equal( jQuery( "<div><p></p></div>" ).find( "p" ).closest( "table" ).length, 0, "Make sure disconnected closest work." );

	assert.deepEqual(
		jQuery( "#firstp" ).closest( q( "qunit-fixture" ) ).get(),
		q( "qunit-fixture" ),
		"Non-string match target"
	);

	// Bug trac-7369
	assert.equal( jQuery( "<div foo='bar'></div>" ).closest( "[foo]" ).length, 1, "Disconnected nodes with attribute selector" );
	assert.equal( jQuery( "<div>text</div>" ).closest( "[lang]" ).length, 0, "Disconnected nodes with text and non-existent attribute selector" );

	assert.ok( !jQuery( document ).closest( "#foo" ).length, "Calling closest on a document fails silently" );

	jq = jQuery( "<div>text</div>" );
	assert.deepEqual( jq.contents().closest( "*" ).get(), jq.get(), "Text node input (trac-13332)" );
} );

QUnit[ QUnit.jQuerySelectorsPos ? "test" : "skip" ]( "closest() with positional selectors", function( assert ) {
	assert.expect( 3 );

	assert.deepEqual( jQuery( "#qunit-fixture" ).closest( "div:first" ).get(), [],
		"closest(div:first)" );
	assert.deepEqual( jQuery( "#qunit-fixture div" ).closest( "body:first div:last" ).get(), [],
		"closest(body:first div:last)" );
	assert.deepEqual(
		jQuery( "#qunit-fixture div" ).closest( "body:first div:last", document ).get(),
		[],
		"closest(body:first div:last, document)"
	);
} );

QUnit.test( "closest(jQuery)", function( assert ) {
	assert.expect( 8 );
	var $child = jQuery( "#nothiddendivchild" ),
		$parent = jQuery( "#nothiddendiv" ),
		$sibling = jQuery( "#foo" ),
		$body = jQuery( "body" );
	assert.ok( $child.closest( $parent ).is( "#nothiddendiv" ), "closest( jQuery('#nothiddendiv') )" );
	assert.ok( $child.closest( $parent[ 0 ] ).is( "#nothiddendiv" ), "closest( jQuery('#nothiddendiv') ) :: node" );
	assert.ok( $child.closest( $child ).is( "#nothiddendivchild" ), "child is included" );
	assert.ok( $child.closest( $child[ 0 ] ).is( "#nothiddendivchild" ), "child is included  :: node" );
	assert.equal( $child.closest( document.createElement( "div" ) ).length, 0, "created element is not related" );
	assert.equal( $child.closest( $sibling ).length, 0, "Sibling not a parent of child" );
	assert.equal( $child.closest( $sibling[ 0 ] ).length, 0, "Sibling not a parent of child :: node" );
	assert.ok( $child.closest( $body.add( $parent ) ).is( "#nothiddendiv" ), "Closest ancestor retrieved." );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "not(Selector)", function( assert ) {
	assert.expect( 7 );
	assert.equal( jQuery( "#qunit-fixture > p#ap > a" ).not( "#google" ).length, 2, "not('selector')" );

	assert.deepEqual(
		jQuery( "#qunit-fixture p" ).not( ".result" ).get(),
		q(
			"firstp",
			"ap",
			"sndp",
			"en",
			"sap",
			"first"
		),
		"not('.class')"
	);


	assert.deepEqual(
		jQuery( "#qunit-fixture p" ).not( "#ap, #sndp, .result" ).get(),
		q(
			"firstp",
			"en",
			"sap",
			"first"
		),
		"not('selector, selector')"
	);

	assert.deepEqual( jQuery( "#ap *" ).not( "code" ).get(), q( "google", "groups", "anchor1", "mark" ), "not('tag selector')" );
	assert.deepEqual( jQuery( "#ap *" ).not( "code, #mark" ).get(), q( "google", "groups", "anchor1" ), "not('tag, ID selector')" );
	assert.deepEqual( jQuery( "#ap *" ).not( "#mark, code" ).get(), q( "google", "groups", "anchor1" ), "not('ID, tag selector')" );

	assert.deepEqual(
		jQuery( "#form option" ).not( "option.emptyopt:contains('Nothing'),optgroup *,[value='1']" ).get(),
		q( "option1c", "option1d", "option2c", "option2d", "option3c", "option3d", "option3e", "option4d", "option4e", "option5a", "option5b" ),
		"not('complex selector')"
	);
} );

QUnit.test( "not(undefined)", function( assert ) {
	assert.expect( 4 );

	var all = jQuery( "p" ).get();
	assert.deepEqual( jQuery( "p" ).not( null ).get(),      all, "not(null) should have no effect" );
	assert.deepEqual( jQuery( "p" ).not( undefined ).get(), all, "not(undefined) should have no effect" );
	assert.deepEqual( jQuery( "p" ).not( 0 ).get(),         all, "not(0) should have no effect" );
	assert.deepEqual( jQuery( "p" ).not( "" ).get(),        all, "not('') should have no effect" );
} );

QUnit.test( "not(Element)", function( assert ) {
	assert.expect( 1 );

	var selects = jQuery( "#form select" );
	assert.deepEqual( selects.not( selects[ 1 ] ).get(), q( "select1", "select3", "select4", "select5" ), "filter out DOM element" );
} );

QUnit.test( "not(Function)", function( assert ) {
	assert.expect( 1 );

	assert.deepEqual( jQuery( "#qunit-fixture p" ).not( function() { return jQuery( "a", this ).length; } ).get(), q( "sndp", "first" ), "not(Function)" );
} );

QUnit.test( "not(Array)", function( assert ) {
	assert.expect( 2 );

	assert.equal( jQuery( "#qunit-fixture > p#ap > a" ).not( document.getElementById( "google" ) ).length, 2, "not(DOMElement)" );
	assert.equal( jQuery( "p" ).not( document.getElementsByTagName( "p" ) ).length, 0, "not(Array-like DOM collection)" );
} );

QUnit.test( "not(jQuery)", function( assert ) {
	assert.expect( 1 );

	assert.deepEqual(
		jQuery( "#qunit-fixture p" ).not( jQuery( "#ap, #sndp, .result" ) ).get(),
		q( "firstp", "en", "sap", "first" ),
		"not(jQuery)"
	);
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "not(Selector) excludes non-element nodes (gh-2808)", function( assert ) {
	assert.expect( 3 );

	var mixedContents = jQuery( "#nonnodes" ).contents(),
		childElements = q( "nonnodesElement" );

	assert.deepEqual( mixedContents.not( "*" ).get(), [], "not *" );
	assert.deepEqual( mixedContents.not( "[id=a],[id=b]" ).get(), childElements, "not [id=a],[id=b]" );
	assert.deepEqual( mixedContents.not( "[id=a],*,[id=b]" ).get(), [], "not [id=a],*,[id=b]" );
} );

QUnit.test( "not(arraylike) passes non-element nodes (gh-3226)", function( assert ) {
	assert.expect( 5 );

	var mixedContents = jQuery( "<span id='nonnodesElement'>hi</span> there <!-- mon ami -->" ),
		mixedLength = mixedContents.length,
		firstElement = mixedContents.first();

	assert.deepEqual( mixedContents.not( mixedContents ).get(), [], "not everything" );
	assert.deepEqual( mixedContents.not( firstElement ).length, mixedLength - 1, "not firstElement" );
	assert.deepEqual( mixedContents.not( [ firstElement[ 0 ].nextSibling ] ).length, mixedLength - 1, "not textnode array" );
	assert.deepEqual( mixedContents.not( firstElement[ 0 ].nextSibling ).length, mixedLength - 1, "not textnode" );
	assert.deepEqual( mixedContents.not( document.body ).get(), mixedContents.get(), "not with unmatched element" );
} );

QUnit.test( "has(Element)", function( assert ) {
	assert.expect( 3 );
	var obj, detached, multipleParent;

	obj = jQuery( "#qunit-fixture" ).has( jQuery( "#sndp" )[ 0 ] );
	assert.deepEqual( obj.get(), q( "qunit-fixture" ), "Keeps elements that have the element as a descendant" );

	detached = jQuery( "<a><b><i></i></b></a>" );
	assert.deepEqual( detached.has( detached.find( "i" )[ 0 ] ).get(), detached.get(), "...Even when detached" );

	multipleParent = jQuery( "#qunit-fixture, #header" ).has( jQuery( "#sndp" )[ 0 ] );
	assert.deepEqual( multipleParent.get(), q( "qunit-fixture" ), "Does not include elements that do not have the element as a descendant" );
} );

QUnit.test( "has(Selector)", function( assert ) {
	assert.expect( 5 );

	var obj, detached, multipleParent, multipleHas;

	obj = jQuery( "#qunit-fixture" ).has( "#sndp" );
	assert.deepEqual( obj.get(), q( "qunit-fixture" ), "Keeps elements that have any element matching the selector as a descendant" );

	detached = jQuery( "<a><b><i></i></b></a>" );
	assert.deepEqual( detached.has( "i" ).get(), detached.get(), "...Even when detached" );

	multipleParent = jQuery( "#qunit-fixture, #header" ).has( "#sndp" );
	assert.deepEqual( multipleParent.get(), q( "qunit-fixture" ), "Does not include elements that do not have the element as a descendant" );

	multipleParent = jQuery( "#select1, #select2, #select3" ).has( "#option1a, #option3a" );
	assert.deepEqual( multipleParent.get(), q( "select1", "select3" ), "Multiple contexts are checks correctly" );

	multipleHas = jQuery( "#qunit-fixture" ).has( "#sndp, #first" );
	assert.deepEqual( multipleHas.get(), q( "qunit-fixture" ), "Only adds elements once" );
} );

QUnit.test( "has(Arrayish)", function( assert ) {
	assert.expect( 4 );

	var simple, detached, multipleParent, multipleHas;

	simple = jQuery( "#qunit-fixture" ).has( jQuery( "#sndp" ) );
	assert.deepEqual( simple.get(), q( "qunit-fixture" ), "Keeps elements that have any element in the jQuery list as a descendant" );

	detached = jQuery( "<a><b><i></i></b></a>" );
	assert.deepEqual( detached.has( detached.find( "i" ) ).get(), detached.get(), "...Even when detached" );

	multipleParent = jQuery( "#qunit-fixture, #header" ).has( jQuery( "#sndp" ) );
	assert.deepEqual( multipleParent.get(), q( "qunit-fixture" ), "Does not include elements that do not have an element in the jQuery list as a descendant" );

	multipleHas = jQuery( "#qunit-fixture" ).has( jQuery( "#sndp, #first" ) );
	assert.deepEqual( multipleHas.get(), q( "qunit-fixture" ), "Only adds elements once" );
} );

QUnit.test( "addBack()", function( assert ) {
	assert.expect( 5 );
	assert.deepEqual( jQuery( "#en" ).siblings().addBack().get(), q( "sndp", "en", "sap" ), "Check for siblings and self" );
	assert.deepEqual( jQuery( "#foo" ).children().addBack().get(), q( "foo", "sndp", "en", "sap" ), "Check for children and self" );
	assert.deepEqual( jQuery( "#sndp, #en" ).parent().addBack().get(), q( "foo", "sndp", "en" ), "Check for parent and self" );
	assert.deepEqual( jQuery( "#groups" ).parents( "p, div" ).addBack().get(), q( "qunit-fixture", "ap", "groups" ), "Check for parents and self" );
	assert.deepEqual( jQuery( "#select1 > option" ).filter( ":first-child" ).addBack( ":last-child" ).get(), q( "option1a", "option1d" ), "Should contain the last elems plus the *filtered* prior set elements" );
} );

QUnit.test( "siblings([String])", function( assert ) {
	assert.expect( 6 );
	assert.deepEqual( jQuery( "#en" ).siblings().get(), q( "sndp", "sap" ), "Check for siblings" );
	assert.deepEqual( jQuery( "#nonnodes" ).contents().eq( 1 ).siblings().get(), q( "nonnodesElement" ), "Check for text node siblings" );
	assert.deepEqual(
		jQuery( "#foo" ).siblings( "form, b" ).get(),
		q( "form", "floatTest", "lengthtest", "name-tests", "testForm", "disabled-tests" ),
		"Check for multiple filters"
	);

	var set = q( "sndp", "en", "sap" );
	assert.deepEqual( jQuery( "#en, #sndp" ).siblings().get(), set, "Check for unique results from siblings" );
	assert.deepEqual( jQuery( "#option5a" ).siblings( "option[data-attr]" ).get(), q( "option5c" ), "Has attribute selector in siblings (trac-9261)" );
	assert.equal( jQuery( "<a></a>" ).siblings().length, 0, "Detached elements have no siblings (trac-11370)" );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "siblings([String])", function( assert ) {
	assert.expect( 2 );
	assert.deepEqual( jQuery( "#sndp" ).siblings( ":has(code)" ).get(), q( "sap" ), "Check for filtered siblings (has code child element)" );
	assert.deepEqual( jQuery( "#sndp" ).siblings( ":has(a)" ).get(), q( "en", "sap" ), "Check for filtered siblings (has anchor child element)" );
} );

QUnit.test( "children([String])", function( assert ) {
	assert.expect( 2 );
	assert.deepEqual( jQuery( "#foo" ).children().get(), q( "sndp", "en", "sap" ), "Check for children" );
	assert.deepEqual( jQuery( "#foo" ).children( "#en, #sap" ).get(), q( "en", "sap" ), "Check for multiple filters" );
} );

QUnit[ QUnit.jQuerySelectors ? "test" : "skip" ]( "children([String])", function( assert ) {
	assert.expect( 1 );
	assert.deepEqual( jQuery( "#foo" ).children( ":has(code)" ).get(), q( "sndp", "sap" ), "Check for filtered children" );
} );

QUnit.test( "parent([String])", function( assert ) {
	assert.expect( 6 );

	var $el;

	assert.equal( jQuery( "#groups" ).parent()[ 0 ].id, "ap", "Simple parent check" );
	assert.equal( jQuery( "#groups" ).parent( "p" )[ 0 ].id, "ap", "Filtered parent check" );
	assert.equal( jQuery( "#groups" ).parent( "div" ).length, 0, "Filtered parent check, no match" );
	assert.equal( jQuery( "#groups" ).parent( "div, p" )[ 0 ].id, "ap", "Check for multiple filters" );
	assert.deepEqual( jQuery( "#en, #sndp" ).parent().get(), q( "foo" ), "Check for unique results from parent" );

	$el = jQuery( "<div>text</div>" );
	assert.deepEqual( $el.contents().parent().get(), $el.get(), "Check for parent of text node (trac-13265)" );
} );

QUnit.test( "parents([String])", function( assert ) {
	assert.expect( 6 );
	assert.equal( jQuery( "#groups" ).parents()[ 0 ].id, "ap", "Simple parents check" );
	assert.deepEqual( jQuery( "#nonnodes" ).contents().eq( 1 ).parents().eq( 0 ).get(), q( "nonnodes" ), "Text node parents check" );
	assert.equal( jQuery( "#groups" ).parents( "p" )[ 0 ].id, "ap", "Filtered parents check" );
	assert.equal( jQuery( "#groups" ).parents( "div" )[ 0 ].id, "qunit-fixture", "Filtered parents check2" );
	assert.deepEqual( jQuery( "#groups" ).parents( "p, div" ).get(), q( "ap", "qunit-fixture" ), "Check for multiple filters" );
	assert.deepEqual( jQuery( "#en, #sndp" ).parents().get(), q( "foo", "qunit-fixture", "body", "html" ), "Check for unique results from parents" );
} );

QUnit.test( "parentsUntil([String])", function( assert ) {
	assert.expect( 10 );

	var parents = jQuery( "#groups" ).parents();

	assert.deepEqual( jQuery( "#groups" ).parentsUntil().get(), parents.get(), "parentsUntil with no selector (nextAll)" );
	assert.deepEqual( jQuery( "#groups" ).parentsUntil( ".foo" ).get(), parents.get(), "parentsUntil with invalid selector (nextAll)" );
	assert.deepEqual( jQuery( "#groups" ).parentsUntil( "#html" ).get(), parents.slice( 0, -1 ).get(), "Simple parentsUntil check" );
	assert.equal( jQuery( "#groups" ).parentsUntil( "#ap" ).length, 0, "Simple parentsUntil check" );
	assert.deepEqual( jQuery( "#nonnodes" ).contents().eq( 1 ).parentsUntil( "#html" ).eq( 0 ).get(), q( "nonnodes" ), "Text node parentsUntil check" );
	assert.deepEqual( jQuery( "#groups" ).parentsUntil( "#html, #body" ).get(), parents.slice( 0, 2 ).get(), "Less simple parentsUntil check" );
	assert.deepEqual( jQuery( "#groups" ).parentsUntil( "#html", "div" ).get(), jQuery( "#qunit-fixture" ).get(), "Filtered parentsUntil check" );
	assert.deepEqual( jQuery( "#groups" ).parentsUntil( "#html", "p,div" ).get(), parents.slice( 0, 2 ).get(), "Multiple-filtered parentsUntil check" );
	assert.equal( jQuery( "#groups" ).parentsUntil( "#html", "span" ).length, 0, "Filtered parentsUntil check, no match" );
	assert.deepEqual( jQuery( "#groups, #ap" ).parentsUntil( "#html", "p,div" ).get(), parents.slice( 0, 2 ).get(), "Multi-source, multiple-filtered parentsUntil check" );
} );

QUnit.test( "next([String])", function( assert ) {
	assert.expect( 6 );
	assert.equal( jQuery( "#ap" ).next()[ 0 ].id, "foo", "Simple next check" );
	assert.equal( jQuery( "<div>text<a id='element'></a></div>" ).contents().eq( 0 ).next().attr( "id" ), "element", "Text node next check" );
	assert.equal( jQuery( "#ap" ).next( "div" )[ 0 ].id, "foo", "Filtered next check" );
	assert.equal( jQuery( "#ap" ).next( "p" ).length, 0, "Filtered next check, no match" );
	assert.equal( jQuery( "#ap" ).next( "div, p" )[ 0 ].id, "foo", "Multiple filters" );
	assert.equal( jQuery( "body" ).next().length, 0, "Simple next check, no match" );
} );

QUnit.test( "prev([String])", function( assert ) {
	assert.expect( 5 );
	assert.equal( jQuery( "#foo" ).prev()[ 0 ].id, "ap", "Simple prev check" );
	assert.deepEqual( jQuery( "#nonnodes" ).contents().eq( 1 ).prev().get(), q( "nonnodesElement" ), "Text node prev check" );
	assert.equal( jQuery( "#foo" ).prev( "p" )[ 0 ].id, "ap", "Filtered prev check" );
	assert.equal( jQuery( "#foo" ).prev( "div" ).length, 0, "Filtered prev check, no match" );
	assert.equal( jQuery( "#foo" ).prev( "p, div" )[ 0 ].id, "ap", "Multiple filters" );
} );

QUnit.test( "nextAll([String])", function( assert ) {
	assert.expect( 5 );

	var elems = jQuery( "#form" ).children();

	assert.deepEqual( jQuery( "#label-for" ).nextAll().get(), elems.slice( 1 ).get(), "Simple nextAll check" );
	assert.equal( jQuery( "<div>text<a id='element'></a></div>" ).contents().eq( 0 ).nextAll().attr( "id" ), "element", "Text node nextAll check" );
	assert.deepEqual( jQuery( "#label-for" ).nextAll( "input" ).get(), elems.slice( 1 ).filter( "input" ).get(), "Filtered nextAll check" );
	assert.deepEqual( jQuery( "#label-for" ).nextAll( "input,select" ).get(), elems.slice( 1 ).filter( "input,select" ).get(), "Multiple-filtered nextAll check" );
	assert.deepEqual( jQuery( "#label-for, #hidden1" ).nextAll( "input,select" ).get(), elems.slice( 1 ).filter( "input,select" ).get(), "Multi-source, multiple-filtered nextAll check" );
} );

QUnit.test( "prevAll([String])", function( assert ) {
	assert.expect( 5 );

	var elems = jQuery( jQuery( "#form" ).children().slice( 0, 12 ).get().reverse() );

	assert.deepEqual( jQuery( "#area1" ).prevAll().get(), elems.get(), "Simple prevAll check" );
	assert.deepEqual( jQuery( "#nonnodes" ).contents().eq( 1 ).prevAll().get(), q( "nonnodesElement" ), "Text node prevAll check" );
	assert.deepEqual( jQuery( "#area1" ).prevAll( "input" ).get(), elems.filter( "input" ).get(), "Filtered prevAll check" );
	assert.deepEqual( jQuery( "#area1" ).prevAll( "input,select" ).get(), elems.filter( "input,select" ).get(), "Multiple-filtered prevAll check" );
	assert.deepEqual( jQuery( "#area1, #hidden1" ).prevAll( "input,select" ).get(), elems.filter( "input,select" ).get(), "Multi-source, multiple-filtered prevAll check" );
} );

QUnit.test( "nextUntil([String])", function( assert ) {
	assert.expect( 12 );

	var elems = jQuery( "#form" ).children().slice( 2, 12 );

	assert.deepEqual( jQuery( "#text1" ).nextUntil().get(), jQuery( "#text1" ).nextAll().get(), "nextUntil with no selector (nextAll)" );
	assert.equal( jQuery( "<div>text<a id='element'></a></div>" ).contents().eq( 0 ).nextUntil().attr( "id" ), "element", "Text node nextUntil with no selector (nextAll)" );
	assert.deepEqual( jQuery( "#text1" ).nextUntil( ".foo" ).get(), jQuery( "#text1" ).nextAll().get(), "nextUntil with invalid selector (nextAll)" );
	assert.deepEqual( jQuery( "#text1" ).nextUntil( "#area1" ).get(), elems.get(), "Simple nextUntil check" );
	assert.equal( jQuery( "#text1" ).nextUntil( "#text2" ).length, 0, "Simple nextUntil check" );
	assert.deepEqual( jQuery( "#text1" ).nextUntil( "#area1, #radio1" ).get(), jQuery( "#text1" ).next().get(), "Less simple nextUntil check" );
	assert.deepEqual( jQuery( "#text1" ).nextUntil( "#area1", "input" ).get(), elems.not( "button" ).get(), "Filtered nextUntil check" );
	assert.deepEqual( jQuery( "#text1" ).nextUntil( "#area1", "button" ).get(), elems.not( "input" ).get(), "Filtered nextUntil check" );
	assert.deepEqual( jQuery( "#text1" ).nextUntil( "#area1", "button,input" ).get(), elems.get(), "Multiple-filtered nextUntil check" );
	assert.equal( jQuery( "#text1" ).nextUntil( "#area1", "div" ).length, 0, "Filtered nextUntil check, no match" );
	assert.deepEqual( jQuery( "#text1, #hidden1" ).nextUntil( "#area1", "button,input" ).get(), elems.get(), "Multi-source, multiple-filtered nextUntil check" );

	assert.deepEqual( jQuery( "#text1" ).nextUntil( "[class=foo]" ).get(), jQuery( "#text1" ).nextAll().get(), "Non-element nodes must be skipped, since they have no attributes" );
} );

QUnit.test( "prevUntil([String])", function( assert ) {
	assert.expect( 11 );

	var elems = jQuery( "#area1" ).prevAll();

	assert.deepEqual( jQuery( "#area1" ).prevUntil().get(), elems.get(), "prevUntil with no selector (prevAll)" );
	assert.deepEqual( jQuery( "#nonnodes" ).contents().eq( 1 ).prevUntil().get(), q( "nonnodesElement" ), "Text node prevUntil with no selector (prevAll)" );
	assert.deepEqual( jQuery( "#area1" ).prevUntil( ".foo" ).get(), elems.get(), "prevUntil with invalid selector (prevAll)" );
	assert.deepEqual( jQuery( "#area1" ).prevUntil( "label" ).get(), elems.slice( 0, -1 ).get(), "Simple prevUntil check" );
	assert.equal( jQuery( "#area1" ).prevUntil( "#button" ).length, 0, "Simple prevUntil check" );
	assert.deepEqual( jQuery( "#area1" ).prevUntil( "label, #search" ).get(), jQuery( "#area1" ).prev().get(), "Less simple prevUntil check" );
	assert.deepEqual( jQuery( "#area1" ).prevUntil( "label", "input" ).get(), elems.slice( 0, -1 ).not( "button" ).get(), "Filtered prevUntil check" );
	assert.deepEqual( jQuery( "#area1" ).prevUntil( "label", "button" ).get(), elems.slice( 0, -1 ).not( "input" ).get(), "Filtered prevUntil check" );
	assert.deepEqual( jQuery( "#area1" ).prevUntil( "label", "button,input" ).get(), elems.slice( 0, -1 ).get(), "Multiple-filtered prevUntil check" );
	assert.equal( jQuery( "#area1" ).prevUntil( "label", "div" ).length, 0, "Filtered prevUntil check, no match" );
	assert.deepEqual( jQuery( "#area1, #hidden1" ).prevUntil( "label", "button,input" ).get(), elems.slice( 0, -1 ).get(), "Multi-source, multiple-filtered prevUntil check" );
} );

QUnit.test( "contents()", function( assert ) {
	assert.expect( 12 );
	var ibody, c;

	assert.equal( jQuery( "#ap" ).contents().length, 9, "Check element contents" );
	assert.ok( jQuery( "#iframe" ).contents()[ 0 ], "Check existence of IFrame document" );
	ibody = jQuery( "#loadediframe" ).contents()[ 0 ].body;
	assert.ok( ibody, "Check existence of IFrame body" );

	assert.equal( jQuery( "span", ibody ).text(), "span text", "Find span in IFrame and check its text" );

	jQuery( ibody ).append( "<div>init text</div>" );
	assert.equal( jQuery( "div", ibody ).length, 2, "Check the original div and the new div are in IFrame" );

	assert.equal( jQuery( "div", ibody ).last().text(), "init text", "Add text to div in IFrame" );

	jQuery( "div", ibody ).last().text( "div text" );
	assert.equal( jQuery( "div", ibody ).last().text(), "div text", "Add text to div in IFrame" );

	jQuery( "div", ibody ).last().remove();
	assert.equal( jQuery( "div", ibody ).length, 1, "Delete the div and check only one div left in IFrame" );

	assert.equal( jQuery( "div", ibody ).text(), "span text", "Make sure the correct div is still left after deletion in IFrame" );

	jQuery( "<table></table>", ibody ).append( "<tr><td>cell</td></tr>" ).appendTo( ibody );
	jQuery( "table", ibody ).remove();
	assert.equal( jQuery( "div", ibody ).length, 1, "Check for JS error on add and delete of a table in IFrame" );

	// using contents will get comments regular, text, and comment nodes
	c = jQuery( "#nonnodes" ).contents().contents();
	assert.equal( c.length, 1, "Check node,textnode,comment contents is just one" );
	assert.equal( c[ 0 ].nodeValue, "hi", "Check node,textnode,comment contents is just the one from span" );
} );

QUnit.test( "contents() for <template />", function( assert ) {
	assert.expect( 4 );

	jQuery( "#qunit-fixture" ).append(
		"<template id='template'>" +
		"    <div id='template-div0'>" +
		"        <span>Hello, Web Component!</span>" +
		"    </div>" +
		"    <div id='template-div1'></div>" +
		"    <div id='template-div2'></div>" +
		"</template>"
	);

	var contents = jQuery( "#template" ).contents();
	assert.equal( contents.length, 6, "Check template element contents" );

	assert.equal( contents.find( "span" ).text(), "Hello, Web Component!", "Find span in template and check its text" );

	jQuery( "<div id='templateTest'></div>" ).append(
			jQuery( jQuery.map( contents, function( node ) {
					return document.importNode( node, true );
			} ) )
	).appendTo( "#qunit-fixture" );

	contents = jQuery( "#templateTest" ).contents();
	assert.equal( contents.length, 6, "Check cloned nodes of template element contents" );

	assert.equal( contents.filter( "div" ).length, 3, "Count cloned elements from template" );
} );

QUnit.testUnlessIE( "contents() for <template /> remains inert", function( assert ) {
	assert.expect( 2 );

	Globals.register( "testScript" );
	Globals.register( "testImgOnload" );

	jQuery( "#qunit-fixture" ).append(
		"<template id='template'>" +
		"    <script>testScript = 1;</script>" +
		"    <img src='" + baseURL + "1x1.jpg' onload='testImgOnload = 1' >" +
		"</template>"
	);

	var content = jQuery( "#template" ).contents();

	assert.strictEqual( window.testScript, true, "script in template isn't executed" );
	assert.strictEqual( window.testImgOnload, true, "onload of image in template isn't executed" );
} );

QUnit.test( "contents() for <object />", function( assert ) {
	assert.expect( 2 );

	var svgObject = jQuery( "<object id='svg-object' data='" + baseURL + "1x1.svg'></object>" );
	var done = assert.async();

	svgObject.on( "load", function() {
		var contents = jQuery( "#svg-object" ).contents();
		assert.equal( contents.length, 1, "Check object contents" );
		assert.equal( contents.find( "svg" ).length, 1, "Find svg within object" );
		done();
	} );

	jQuery( "#qunit-fixture" ).append( svgObject );
} );

QUnit.test( "contents() for <object /> with children", function( assert ) {
	assert.expect( 1 );

	var object = "<object type='application/x-shockwave-flash' width='200' height='300' id='penguin'>" +
		"<param name='movie' value='flash/penguin.swf'>" +
		"<param name='quality' value='high'>" +
		"<img src='images/penguin.jpg' width='200' height='300' alt='Penguin'>" +
	"</object>";

	var contents = jQuery( object ).contents();
	assert.equal( contents.length, 3, "Check object contents children are correct" );
} );

QUnit.test( "contents() for <frame />", function( assert ) {
	assert.expect( 2 );

	var iframe = jQuery( "<iframe id='frame-contents' src='" + baseURL + "frame.html'></iframe>" );
	var done = assert.async();

	iframe.on( "load", function() {
		var container = jQuery( "#frame-contents" ).contents();
		var contents = container.find( "#test-frame" ).contents();
		assert.equal( contents.length, 1, "Check frame contents" );
		assert.equal( contents.find( "body" ).length, 1, "Find body within frame" );
		done();
	} );

	jQuery( "#qunit-fixture" ).append( iframe );
} );

QUnit.test( "sort direction", function( assert ) {
	assert.expect( 12 );

	var elems = jQuery( "#ap, #select1 > *, #moretests > form" ),
		methodDirections = {
			parent: false,
			parents: true,
			parentsUntil: true,
			next: false,
			prev: false,
			nextAll: false,
			prevAll: true,
			nextUntil: false,
			prevUntil: true,
			siblings: false,
			children: false,
			contents: false
		};

	jQuery.each( methodDirections, function( method, reversed ) {
		var actual = elems[ method ]().get(),
			forward = jQuery.uniqueSort( [].concat( actual ) );
		assert.deepEqual( actual, reversed ? forward.reverse() : forward, "Correct sort direction for " + method );
	} );
} );

QUnit.test( "add(String selector)", function( assert ) {
	assert.expect( 2 );

	var divs;

	assert.deepEqual(
		jQuery( "#sndp" ).add( "#en" ).add( "#sap" ).toArray(),
		q( "sndp", "en", "sap" ),
		"Check elements from document"
	);

	divs = jQuery( "<div></div>" ).add( "#sndp" );
	assert.ok( divs[ 0 ].parentNode, "Sort with the disconnected node last (started with disconnected first)." );
} );

QUnit.test( "add(String selector, String context)", function( assert ) {
	assert.expect( 1 );

	assert.deepEqual(
		jQuery( [] ).add( "div", "#nothiddendiv" ).toArray(),
		q( "nothiddendivchild" ),
		"Check elements from document"
	);
} );

QUnit.test( "add(String html)", function( assert ) {
	assert.expect( 3 );

	var x,
		divs = jQuery( "#sndp" ).add( "<div></div>" );

	assert.ok( !divs[ 1 ].parentNode, "Sort with the disconnected node last." );

	x = jQuery( [] ).add( "<p id='x1'>xxx</p>" ).add( "<p id='x2'>xxx</p>" );
	assert.equal( x[ 0 ].id, "x1", "Check detached element1" );
	assert.equal( x[ 1 ].id, "x2", "Check detached element2" );
} );

QUnit.test( "add(jQuery)", function( assert ) {
	assert.expect( 4 );

	var x,
		tmp = jQuery( "<div></div>" );

	x = jQuery( [] )
	.add(
		jQuery( "<p id='x1'>xxx</p>" ).appendTo( tmp )
	)
	.add(
		jQuery( "<p id='x2'>xxx</p>" ).appendTo( tmp )
	);

	assert.equal( x[ 0 ].id, "x1", "Check element1 in detached parent" );
	assert.equal( x[ 1 ].id, "x2", "Check element2 in detached parent" );

	x = jQuery( [] )
	.add(
		jQuery( "<p id='x1'>xxx</p>" )
	)
	.add(
		jQuery( "<p id='x2'>xxx</p>" )
	);

	assert.equal( x[ 0 ].id, "x1", "Check detached element1" );
	assert.equal( x[ 1 ].id, "x2", "Check detached element2" );
} );

QUnit.test( "add(Element)", function( assert ) {
	assert.expect( 2 );

	var x,
		tmp = jQuery( "<div></div>" );

	x = jQuery( [] ).add( jQuery( "<p id='x1'>xxx</p>" ).appendTo( tmp )[ 0 ] ).add( jQuery( "<p id='x2'>xxx</p>" ).appendTo( tmp )[ 0 ] );
	assert.equal( x[ 0 ].id, "x1", "Check on-the-fly element1" );
	assert.equal( x[ 1 ].id, "x2", "Check on-the-fly element2" );
} );

QUnit.test( "add(Array elements)", function( assert ) {
	assert.expect( 1 );

	assert.deepEqual(
		jQuery( "#sndp" ).add( jQuery( "#en" )[ 0 ] ).add( jQuery( "#sap" ) ).toArray(),
		q( "sndp", "en", "sap" ),
		"Check elements from document"
	);
} );

QUnit.test( "add(Window)", function( assert ) {
	assert.expect( 1 );

	var frame1 = document.createElement( "iframe" ),
		frame2 = document.createElement( "iframe" );

	// This increases window.length and sets window[i] available
	document.body.appendChild( frame1 );
	document.body.appendChild( frame2 );

	// Window is tricky because it is a lot like an array, even Array#slice will
	// turn it into a multi-item array.
	assert.equal( jQuery( [] ).add( window ).length, 1, "Add a window" );

	document.body.removeChild( frame1 );
	document.body.removeChild( frame2 );
} );

QUnit.test( "add(NodeList|undefined|HTMLFormElement|HTMLSelectElement)", function( assert ) {
	assert.expect( 4 );

	var ps, notDefined;

	ps = document.getElementsByTagName( "p" );

	assert.equal( jQuery( [] ).add( ps ).length, ps.length, "Add a NodeList" );

	assert.equal( jQuery( [] ).add( notDefined ).length, 0, "Adding undefined adds nothing" );

	assert.equal( jQuery( [] ).add( document.getElementById( "form" ) ).length, 1, "Add a form" );
	assert.equal( jQuery( [] ).add( document.getElementById( "select1" ) ).length, 1, "Add a select" );

	// We no longer support .add(form.elements), unfortunately.
	// There is no way, in browsers, to reliably determine the difference
	// between form.elements and form - and doing .add(form) and having it
	// add the form elements is way to unexpected, so this gets the boot.
	//ok( jQuery([]).add(jQuery("#form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for jQuery(form.elements) since it's ambiguous in IE
	// use jQuery([]).add(form.elements) instead.
	//equal( jQuery([]).add(jQuery("#form")[0].elements).length, jQuery(jQuery("#form")[0].elements).length, "Array in constructor must equals array in add()" );
} );

QUnit.test( "add(String, Context)", function( assert ) {
	assert.expect( 6 );

	assert.deepEqual( jQuery( "#firstp" ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add selector to selector " );
	assert.deepEqual( jQuery( document.getElementById( "firstp" ) ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add gEBId to selector" );
	assert.deepEqual( jQuery( document.getElementById( "firstp" ) ).add( document.getElementById( "ap" ) ).get(), q( "firstp", "ap" ), "Add gEBId to gEBId" );

	var ctx = document.getElementById( "firstp" );
	assert.deepEqual( jQuery( "#firstp" ).add( "#ap", ctx ).get(), q( "firstp" ), "Add selector to selector " );
	assert.deepEqual( jQuery( document.getElementById( "firstp" ) ).add( "#ap", ctx ).get(), q( "firstp" ), "Add gEBId to selector, not in context" );
	assert.deepEqual( jQuery( document.getElementById( "firstp" ) ).add( "#ap", document.getElementsByTagName( "body" )[ 0 ] ).get(), q( "firstp", "ap" ), "Add gEBId to selector, in context" );
} );

QUnit.test( "eq('-1') trac-10616", function( assert ) {
	assert.expect( 3 );
	var $divs = jQuery( "div" );

	assert.equal( $divs.eq( -1 ).length, 1, "The number -1 returns a selection that has length 1" );
	assert.equal( $divs.eq( "-1" ).length, 1, "The string '-1' returns a selection that has length 1" );
	assert.deepEqual( $divs.eq( "-1" ), $divs.eq( -1 ), "String and number -1 match" );
} );

QUnit.test( "index(no arg) trac-10977", function( assert ) {
	assert.expect( 2 );
	var $list, fragment, div;

	$list = jQuery( "<ul id='indextest'><li class='zero'>THIS ONE</li><li class='one'>a</li><li class='two'>b</li><li class='three'>c</li></ul>" );
	jQuery( "#qunit-fixture" ).append( $list );
	assert.strictEqual( jQuery( "#indextest li.zero" ).first().index(), 0, "No Argument Index Check" );
	$list.remove();

	fragment = document.createDocumentFragment();
	div = fragment.appendChild( document.createElement( "div" ) );

	assert.equal( jQuery( div ).index(), 0, "If jQuery#index called on element whose parent is fragment, it still should work correctly" );
} );

QUnit.test( "traversing non-elements with attribute filters (trac-12523)", function( assert ) {
	assert.expect( 5 );

	var nonnodes = jQuery( "#nonnodes" ).contents();

	assert.equal( nonnodes.filter( "[id]" ).length, 1, ".filter" );
	assert.equal( nonnodes.find( "[id]" ).length, 0, ".find" );
	assert.strictEqual( nonnodes.is( "[id]" ), true, ".is" );
	assert.deepEqual( nonnodes.closest( "[id='nonnodes']" ).get(), q( "nonnodes" ), ".closest" );
	assert.deepEqual( nonnodes.parents( "[id='nonnodes']" ).get(), q( "nonnodes" ), ".parents" );
} );
