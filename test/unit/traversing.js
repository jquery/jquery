module("traversing", { teardown: moduleTeardown });

test( "find(String)", function() {
	expect( 1 );
	equal( jQuery("#foo").find(".blogTest").text(), "Yahoo", "Basic selector" );
});

test( "find(String) under non-elements", function() {
	expect( 2 );

	var j = jQuery("#nonnodes").contents();
	equal( j.find("div").length, 0, "Check node,textnode,comment to find zero divs" );
	equal( j.find("div").andSelf().length, 3, "Check node,textnode,comment to find zero divs, but preserves pushStack" );
});

test( "find(leading combinator)", function() {
	expect( 4 );

	deepEqual( jQuery("#qunit-fixture").find("> div").get(), q( "foo", "nothiddendiv", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest", "fx-test-group" ), "find child elements" );
	deepEqual( jQuery("#qunit-fixture").find("> #foo, > #moretests").get(), q( "foo", "moretests" ), "find child elements" );
	deepEqual( jQuery("#qunit-fixture").find("> #foo > p").get(), q( "sndp", "en", "sap" ), "find child elements" );

	deepEqual( jQuery("#siblingTest, #siblingfirst").find("+ *").get(), q( "siblingnext", "fx-test-group" ), "ensure document order" );
});

test( "find(node|jQuery object)", function() {
	expect( 13 );

	var $foo = jQuery("#foo"),
		$blog = jQuery(".blogTest"),
		$first = jQuery("#first"),
		$two = $blog.add( $first ),
		$twoMore = jQuery("#ap").add( $blog ),
		$fooTwo = $foo.add( $blog );

	equal( $foo.find( $blog ).text(), "Yahoo", "Find with blog jQuery object" );
	equal( $foo.find( $blog[ 0 ] ).text(), "Yahoo", "Find with blog node" );
	equal( $foo.find( $first ).length, 0, "#first is not in #foo" );
	equal( $foo.find( $first[ 0 ]).length, 0, "#first not in #foo (node)" );
	deepEqual( $foo.find( $two ).get(), $blog.get(), "Find returns only nodes within #foo" );
	deepEqual( $foo.find( $twoMore ).get(), $blog.get(), "...regardless of order" );
	ok( $fooTwo.find( $blog ).is(".blogTest"), "Blog is part of the collection, but also within foo" );
	ok( $fooTwo.find( $blog[ 0 ] ).is(".blogTest"), "Blog is part of the collection, but also within foo(node)" );

	equal( $two.find( $foo ).length, 0, "Foo is not in two elements" );
	equal( $two.find( $foo[ 0 ] ).length, 0, "Foo is not in two elements(node)" );
	equal( $two.find( $first ).length, 0, "first is in the collection and not within two" );
	equal( $two.find( $first ).length, 0, "first is in the collection and not within two(node)" );

	equal( $two.find( $foo[ 0 ] ).andSelf().length, 2, "find preserves the pushStack, see #12009" );
});

test("is(String|undefined)", function() {
	expect(23);
	ok( jQuery("#form").is("form"), "Check for element: A form must be a form" );
	ok( !jQuery("#form").is("div"), "Check for element: A form is not a div" );
	ok( jQuery("#mark").is(".blog"), "Check for class: Expected class 'blog'" );
	ok( !jQuery("#mark").is(".link"), "Check for class: Did not expect class 'link'" );
	ok( jQuery("#simon").is(".blog.link"), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !jQuery("#simon").is(".blogTest"), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	ok( jQuery("#en").is("[lang=\"en\"]"), "Check for attribute: Expected attribute lang to be 'en'" );
	ok( !jQuery("#en").is("[lang=\"de\"]"), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	ok( jQuery("#text1").is("[type=\"text\"]"), "Check for attribute: Expected attribute type to be 'text'" );
	ok( !jQuery("#text1").is("[type=\"radio\"]"), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	ok( jQuery("#text2").is(":disabled"), "Check for pseudoclass: Expected to be disabled" );
	ok( !jQuery("#text1").is(":disabled"), "Check for pseudoclass: Expected not disabled" );
	ok( jQuery("#radio2").is(":checked"), "Check for pseudoclass: Expected to be checked" );
	ok( !jQuery("#radio1").is(":checked"), "Check for pseudoclass: Expected not checked" );

	ok( !jQuery("#foo").is(0), "Expected false for an invalid expression - 0" );
	ok( !jQuery("#foo").is(null), "Expected false for an invalid expression - null" );
	ok( !jQuery("#foo").is(""), "Expected false for an invalid expression - \"\"" );
	ok( !jQuery("#foo").is(undefined), "Expected false for an invalid expression - undefined" );
	ok( !jQuery("#foo").is({ plain: "object" }), "Check passing invalid object" );

	// test is() with comma-separated expressions
	ok( jQuery("#en").is("[lang=\"en\"],[lang=\"de\"]"), "Comma-separated; Check for lang attribute: Expect en or de" );
	ok( jQuery("#en").is("[lang=\"de\"],[lang=\"en\"]"), "Comma-separated; Check for lang attribute: Expect en or de" );
	ok( jQuery("#en").is("[lang=\"en\"] , [lang=\"de\"]"), "Comma-separated; Check for lang attribute: Expect en or de" );
	ok( jQuery("#en").is("[lang=\"de\"] , [lang=\"en\"]"), "Comma-separated; Check for lang attribute: Expect en or de" );
});

test("is() against non-elements (#10178)", function() {
	expect(14);

	var label, i, test,
		collection = jQuery( document ),
		tests = [ "a", "*" ],
		nonelements = {
			text: document.createTextNode(""),
			comment: document.createComment(""),
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
			ok( !collection.is( test ), label + " does not match \"" + test + "\"" );
		}
	}
});

test("is(jQuery)", function() {
	expect(19);
	ok( jQuery("#form").is( jQuery("form") ), "Check for element: A form is a form" );
	ok( !jQuery("#form").is( jQuery("div") ), "Check for element: A form is not a div" );
	ok( jQuery("#mark").is( jQuery(".blog") ), "Check for class: Expected class 'blog'" );
	ok( !jQuery("#mark").is( jQuery(".link") ), "Check for class: Did not expect class 'link'" );
	ok( jQuery("#simon").is( jQuery(".blog.link") ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !jQuery("#simon").is( jQuery(".blogTest") ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
	ok( jQuery("#en").is( jQuery("[lang=\"en\"]") ), "Check for attribute: Expected attribute lang to be 'en'" );
	ok( !jQuery("#en").is( jQuery("[lang=\"de\"]") ), "Check for attribute: Expected attribute lang to be 'en', not 'de'" );
	ok( jQuery("#text1").is( jQuery("[type=\"text\"]") ), "Check for attribute: Expected attribute type to be 'text'" );
	ok( !jQuery("#text1").is( jQuery("[type=\"radio\"]") ), "Check for attribute: Expected attribute type to be 'text', not 'radio'" );
	ok( !jQuery("#text1").is( jQuery("input:disabled") ), "Check for pseudoclass: Expected not disabled" );
	ok( jQuery("#radio2").is( jQuery("input:checked") ), "Check for pseudoclass: Expected to be checked" );
	ok( !jQuery("#radio1").is( jQuery("input:checked") ), "Check for pseudoclass: Expected not checked" );

	// Some raw elements
	ok( jQuery("#form").is( jQuery("form")[0] ), "Check for element: A form is a form" );
	ok( !jQuery("#form").is( jQuery("div")[0] ), "Check for element: A form is not a div" );
	ok( jQuery("#mark").is( jQuery(".blog")[0] ), "Check for class: Expected class 'blog'" );
	ok( !jQuery("#mark").is( jQuery(".link")[0] ), "Check for class: Did not expect class 'link'" );
	ok( jQuery("#simon").is( jQuery(".blog.link")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !jQuery("#simon").is( jQuery(".blogTest")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
});

test("is() with :has() selectors", function() {
	expect(6);

	ok( jQuery("#foo").is(":has(p)"), "Check for child: Expected a child 'p' element" );
	ok( !jQuery("#foo").is(":has(ul)"), "Check for child: Did not expect 'ul' element" );
	ok( jQuery("#foo").is(":has(p):has(a):has(code)"), "Check for childs: Expected 'p', 'a' and 'code' child elements" );
	ok( !jQuery("#foo").is(":has(p):has(a):has(code):has(ol)"), "Check for childs: Expected 'p', 'a' and 'code' child elements, but no 'ol'" );

	ok( jQuery("#foo").is( jQuery("div:has(p)") ), "Check for child: Expected a child 'p' element" );
	ok( !jQuery("#foo").is( jQuery("div:has(ul)") ), "Check for child: Did not expect 'ul' element" );
});

test("is() with positional selectors", function() {
	expect(27);

	var
		posp = jQuery(
			"<p id='posp'><a class='firsta' href='#'><em>first</em></a>" +
			"<a class='seconda' href='#'><b>test</b></a><em></em></p>"
		).appendTo( "#qunit-fixture" ),
		isit = function( sel, match, expect ) {
			equal(
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

	ok( jQuery("#option1b").is("#select1 option:not(:first)"), "POS inside of :not() (#10970)" );

	ok( jQuery( posp[0] ).is("p:last"), "context constructed from a single node (#13797)" );
	ok( !jQuery( posp[0] ).find("#firsta").is("a:first"), "context derived from a single node (#13797)" );
});

test("index()", function() {
	expect( 2 );

	equal( jQuery("#text2").index(), 2, "Returns the index of a child amongst its siblings" );

	equal( jQuery("<div/>").index(), -1, "Node without parent returns -1" );
});

test("index(Object|String|undefined)", function() {
	expect(16);

	var elements = jQuery([window, document]),
		inputElements = jQuery("#radio1,#radio2,#check1,#check2");

	// Passing a node
	equal( elements.index(window), 0, "Check for index of elements" );
	equal( elements.index(document), 1, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("radio1")), 0, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("radio2")), 1, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("check1")), 2, "Check for index of elements" );
	equal( inputElements.index(document.getElementById("check2")), 3, "Check for index of elements" );
	equal( inputElements.index(window), -1, "Check for not found index" );
	equal( inputElements.index(document), -1, "Check for not found index" );

	// Passing a jQuery object
	// enabled since [5500]
	equal( elements.index( elements ), 0, "Pass in a jQuery object" );
	equal( elements.index( elements.eq(1) ), 1, "Pass in a jQuery object" );
	equal( jQuery("#form input[type='radio']").index( jQuery("#radio2") ), 1, "Pass in a jQuery object" );

	// Passing a selector or nothing
	// enabled since [6330]
	equal( jQuery("#text2").index(), 2, "Check for index amongst siblings" );
	equal( jQuery("#form").children().eq(4).index(), 4, "Check for index amongst siblings" );
	equal( jQuery("#radio2").index("#form input[type='radio']") , 1, "Check for index within a selector" );
	equal( jQuery("#form input[type='radio']").index( jQuery("#radio2") ), 1, "Check for index within a selector" );
	equal( jQuery("#radio2").index("#form input[type='text']") , -1, "Check for index not found within a selector" );
});

test("filter(Selector|undefined)", function() {
	expect(9);
	deepEqual( jQuery("#form input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	deepEqual( jQuery("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')" );
	deepEqual( jQuery("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')" );

	deepEqual( jQuery("p").filter(null).get(),      [], "filter(null) should return an empty jQuery object");
	deepEqual( jQuery("p").filter(undefined).get(), [], "filter(undefined) should return an empty jQuery object");
	deepEqual( jQuery("p").filter(0).get(),         [], "filter(0) should return an empty jQuery object");
	deepEqual( jQuery("p").filter("").get(),        [], "filter('') should return an empty jQuery object");

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	equal( j.filter("span").length, 1, "Check node,textnode,comment to filter the one span" );
	equal( j.filter("[name]").length, 0, "Check node,textnode,comment to filter the one span" );
});

test("filter(Function)", function() {
	expect(2);

	deepEqual( jQuery("#qunit-fixture p").filter(function() {
		return !jQuery("a", this).length;
	}).get(), q("sndp", "first"), "filter(Function)" );

	deepEqual( jQuery("#qunit-fixture p").filter(function(i, elem) { return !jQuery("a", elem).length; }).get(), q("sndp", "first"), "filter(Function) using arg" );
});

test("filter(Element)", function() {
	expect(1);

	var element = document.getElementById("text1");
	deepEqual( jQuery("#form input").filter(element).get(), q("text1"), "filter(Element)" );
});

test("filter(Array)", function() {
	expect(1);

	var elements = [ document.getElementById("text1") ];
	deepEqual( jQuery("#form input").filter(elements).get(), q("text1"), "filter(Element)" );
});

test("filter(jQuery)", function() {
	expect(1);

	var elements = jQuery("#text1");
	deepEqual( jQuery("#form input").filter(elements).get(), q("text1"), "filter(Element)" );
});


test("filter() with positional selectors", function() {
	expect(19);

	var filterit = function(sel, filter, length) {
		equal( jQuery( sel ).filter( filter ).length, length, "jQuery( " + sel + " ).filter( " + filter + " )" );
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

	filterit( "#posp", "#posp:first", 1);
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
});

test("closest()", function() {
	expect( 13 );

	var jq;

	deepEqual( jQuery("body").closest("body").get(), q("body"), "closest(body)" );
	deepEqual( jQuery("body").closest("html").get(), q("html"), "closest(html)" );
	deepEqual( jQuery("body").closest("div").get(), [], "closest(div)" );
	deepEqual( jQuery("#qunit-fixture").closest("span,#html").get(), q("html"), "closest(span,#html)" );

	// Test .closest() limited by the context
	jq = jQuery("#nothiddendivchild");
	deepEqual( jq.closest("html", document.body).get(), [], "Context limited." );
	deepEqual( jq.closest("body", document.body).get(), [], "Context limited." );
	deepEqual( jq.closest("#nothiddendiv", document.body).get(), q("nothiddendiv"), "Context not reached." );

	//Test that .closest() returns unique'd set
	equal( jQuery("#qunit-fixture p").closest("#qunit-fixture").length, 1, "Closest should return a unique set" );

	// Test on disconnected node
	equal( jQuery("<div><p></p></div>").find("p").closest("table").length, 0, "Make sure disconnected closest work." );

	// Bug #7369
	equal( jQuery("<div foo='bar'></div>").closest("[foo]").length, 1, "Disconnected nodes with attribute selector" );
	equal( jQuery("<div>text</div>").closest("[lang]").length, 0, "Disconnected nodes with text and non-existent attribute selector" );

	ok( !jQuery(document).closest("#foo").length, "Calling closest on a document fails silently" );

	jq = jQuery("<div>text</div>");
	deepEqual( jq.contents().closest("*").get(), jq.get(), "Text node input (#13332)" );
});

test("closest() with positional selectors", function() {
	expect( 2 );

	deepEqual( jQuery("#qunit-fixture").closest("div:first").get(), [], "closest(div:first)" );
	deepEqual( jQuery("#qunit-fixture div").closest("body:first div:last").get(), q("fx-tests"), "closest(body:first div:last)" );
});

test("closest(jQuery)", function() {
	expect(8);
	var $child = jQuery("#nothiddendivchild"),
		$parent = jQuery("#nothiddendiv"),
		$sibling = jQuery("#foo"),
		$body = jQuery("body");
	ok( $child.closest( $parent ).is("#nothiddendiv"), "closest( jQuery('#nothiddendiv') )" );
	ok( $child.closest( $parent[0] ).is("#nothiddendiv"), "closest( jQuery('#nothiddendiv') ) :: node" );
	ok( $child.closest( $child ).is("#nothiddendivchild"), "child is included" );
	ok( $child.closest( $child[0] ).is("#nothiddendivchild"), "child is included  :: node" );
	equal( $child.closest( document.createElement("div") ).length, 0, "created element is not related" );
	equal( $child.closest( $sibling ).length, 0, "Sibling not a parent of child" );
	equal( $child.closest( $sibling[0] ).length, 0, "Sibling not a parent of child :: node" );
	ok( $child.closest( $body.add($parent) ).is("#nothiddendiv"), "Closest ancestor retrieved." );
});

test("not(Selector|undefined)", function() {
	expect(11);
	equal( jQuery("#qunit-fixture > p#ap > a").not("#google").length, 2, "not('selector')" );
	deepEqual( jQuery("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')" );
	deepEqual( jQuery("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );

	deepEqual( jQuery("#ap *").not("code").get(), q("google", "groups", "anchor1", "mark"), "not('tag selector')" );
	deepEqual( jQuery("#ap *").not("code, #mark").get(), q("google", "groups", "anchor1"), "not('tag, ID selector')" );
	deepEqual( jQuery("#ap *").not("#mark, code").get(), q("google", "groups", "anchor1"), "not('ID, tag selector')");

	var all = jQuery("p").get();
	deepEqual( jQuery("p").not(null).get(),      all, "not(null) should have no effect");
	deepEqual( jQuery("p").not(undefined).get(), all, "not(undefined) should have no effect");
	deepEqual( jQuery("p").not(0).get(),         all, "not(0) should have no effect");
	deepEqual( jQuery("p").not("").get(),        all, "not('') should have no effect");

	deepEqual(
		jQuery("#form option").not("option.emptyopt:contains('Nothing'),optgroup *,[value='1']").get(),
		q("option1c", "option1d", "option2c", "option2d", "option3c", "option3d", "option3e", "option4d", "option4e", "option5a", "option5b"),
		"not('complex selector')"
	);
});

test("not(Element)", function() {
	expect(1);

	var selects = jQuery("#form select");
	deepEqual( selects.not( selects[1] ).get(), q("select1", "select3", "select4", "select5"), "filter out DOM element");
});

test("not(Function)", function() {
	expect(1);

	deepEqual( jQuery("#qunit-fixture p").not(function() { return jQuery("a", this).length; }).get(), q("sndp", "first"), "not(Function)" );
});

test("not(Array)", function() {
	expect(2);

	equal( jQuery("#qunit-fixture > p#ap > a").not(document.getElementById("google")).length, 2, "not(DOMElement)" );
	equal( jQuery("p").not(document.getElementsByTagName("p")).length, 0, "not(Array-like DOM collection)" );
});

test("not(jQuery)", function() {
	expect( 1 );

	deepEqual( jQuery("p").not(jQuery("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(jQuery)" );
});

test("has(Element)", function() {
	expect(3);
	var obj, detached, multipleParent;

	obj = jQuery("#qunit-fixture").has(jQuery("#sndp")[0]);
	deepEqual( obj.get(), q("qunit-fixture"), "Keeps elements that have the element as a descendant" );

	detached = jQuery("<a><b><i/></b></a>");
	deepEqual( detached.has( detached.find("i")[0] ).get(), detached.get(), "...Even when detached" );

	multipleParent = jQuery("#qunit-fixture, #header").has(jQuery("#sndp")[0]);
	deepEqual( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );
});

test("has(Selector)", function() {
	expect( 5 );

	var obj, detached, multipleParent, multipleHas;

	obj = jQuery("#qunit-fixture").has("#sndp");
	deepEqual( obj.get(), q("qunit-fixture"), "Keeps elements that have any element matching the selector as a descendant" );

	detached = jQuery("<a><b><i/></b></a>");
	deepEqual( detached.has("i").get(), detached.get(), "...Even when detached" );

	multipleParent = jQuery("#qunit-fixture, #header").has("#sndp");
	deepEqual( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );

	multipleParent = jQuery("#select1, #select2, #select3").has("#option1a, #option3a");
	deepEqual( multipleParent.get(), q("select1", "select3"), "Multiple contexts are checks correctly" );

	multipleHas = jQuery("#qunit-fixture").has("#sndp, #first");
	deepEqual( multipleHas.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("has(Arrayish)", function() {
	expect(4);

	var simple, detached, multipleParent, multipleHas;

	simple = jQuery("#qunit-fixture").has(jQuery("#sndp"));
	deepEqual( simple.get(), q("qunit-fixture"), "Keeps elements that have any element in the jQuery list as a descendant" );

	detached = jQuery("<a><b><i/></b></a>");
	deepEqual( detached.has( detached.find("i") ).get(), detached.get(), "...Even when detached" );

	multipleParent = jQuery("#qunit-fixture, #header").has(jQuery("#sndp"));
	deepEqual( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have an element in the jQuery list as a descendant" );

	multipleHas = jQuery("#qunit-fixture").has(jQuery("#sndp, #first"));
	deepEqual( multipleHas.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("addBack()", function() {
	expect(5);
	deepEqual( jQuery("#en").siblings().addBack().get(), q("sndp", "en", "sap"), "Check for siblings and self" );
	deepEqual( jQuery("#foo").children().addBack().get(), q("foo", "sndp", "en", "sap"), "Check for children and self" );
	deepEqual( jQuery("#sndp, #en").parent().addBack().get(), q("foo","sndp","en"), "Check for parent and self" );
	deepEqual( jQuery("#groups").parents("p, div").addBack().get(), q("qunit-fixture", "ap", "groups"), "Check for parents and self" );
	deepEqual( jQuery("#select1 > option").filter(":first-child").addBack(":last-child").get(), q("option1a", "option1d"), "Should contain the last elems plus the *filtered* prior set elements" );
});

test("siblings([String])", function() {
	expect(6);
	deepEqual( jQuery("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	deepEqual( jQuery("#nonnodes").contents().eq(1).siblings().get(), q("nonnodesElement"), "Check for text node siblings" );
	deepEqual( jQuery("#foo").siblings("form, b").get(), q("form", "floatTest", "lengthtest", "name-tests", "testForm"), "Check for multiple filters" );

	var set = q("sndp", "en", "sap");
	deepEqual( jQuery("#en, #sndp").siblings().get(), set, "Check for unique results from siblings" );
	deepEqual( jQuery("#option5a").siblings("option[data-attr]").get(), q("option5c"), "Has attribute selector in siblings (#9261)" );
	equal( jQuery("<a/>").siblings().length, 0, "Detached elements have no siblings (#11370)" );
});

test("siblings([String]) - jQuery only", function() {
	expect(2);
	deepEqual( jQuery("#sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" );
	deepEqual( jQuery("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
});

test("children([String])", function() {
	expect(2);
	deepEqual( jQuery("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	deepEqual( jQuery("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("children([String]) - jQuery only", function() {
	expect(1);
	deepEqual( jQuery("#foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children" );
});

test("parent([String])", function() {
	expect(6);

	var $el;

	equal( jQuery("#groups").parent()[0].id, "ap", "Simple parent check" );
	equal( jQuery("#groups").parent("p")[0].id, "ap", "Filtered parent check" );
	equal( jQuery("#groups").parent("div").length, 0, "Filtered parent check, no match" );
	equal( jQuery("#groups").parent("div, p")[0].id, "ap", "Check for multiple filters" );
	deepEqual( jQuery("#en, #sndp").parent().get(), q("foo"), "Check for unique results from parent" );

	$el = jQuery("<div>text</div>");
	strictEqual( $el.contents().parent()[0], $el[0], "Check for parent of text node (#13265)" );
});

test("parents([String])", function() {
	expect(6);
	equal( jQuery("#groups").parents()[0].id, "ap", "Simple parents check" );
	deepEqual( jQuery("#nonnodes").contents().eq(1).parents().eq(0).get(), q("nonnodes"), "Text node parents check" );
	equal( jQuery("#groups").parents("p")[0].id, "ap", "Filtered parents check" );
	equal( jQuery("#groups").parents("div")[0].id, "qunit-fixture", "Filtered parents check2" );
	deepEqual( jQuery("#groups").parents("p, div").get(), q("ap", "qunit-fixture"), "Check for multiple filters" );
	deepEqual( jQuery("#en, #sndp").parents().get(), q("foo", "qunit-fixture", "dl", "body", "html"), "Check for unique results from parents" );
});

test("parentsUntil([String])", function() {
	expect(10);

	var parents = jQuery("#groups").parents();

	deepEqual( jQuery("#groups").parentsUntil().get(), parents.get(), "parentsUntil with no selector (nextAll)" );
	deepEqual( jQuery("#groups").parentsUntil(".foo").get(), parents.get(), "parentsUntil with invalid selector (nextAll)" );
	deepEqual( jQuery("#groups").parentsUntil("#html").get(), parents.slice(0, -1).get(), "Simple parentsUntil check" );
	equal( jQuery("#groups").parentsUntil("#ap").length, 0, "Simple parentsUntil check" );
	deepEqual( jQuery("#nonnodes").contents().eq(1).parentsUntil("#html").eq(0).get(), q("nonnodes"), "Text node parentsUntil check" );
	deepEqual( jQuery("#groups").parentsUntil("#html, #body").get(), parents.slice( 0, 3 ).get(), "Less simple parentsUntil check" );
	deepEqual( jQuery("#groups").parentsUntil("#html", "div").get(), jQuery("#qunit-fixture").get(), "Filtered parentsUntil check" );
	deepEqual( jQuery("#groups").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multiple-filtered parentsUntil check" );
	equal( jQuery("#groups").parentsUntil("#html", "span").length, 0, "Filtered parentsUntil check, no match" );
	deepEqual( jQuery("#groups, #ap").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multi-source, multiple-filtered parentsUntil check" );
});

test("next([String])", function() {
	expect(6);
	equal( jQuery("#ap").next()[0].id, "foo", "Simple next check" );
	equal( jQuery("<div>text<a id='element'></a></div>").contents().eq(0).next().attr("id"), "element", "Text node next check" );
	equal( jQuery("#ap").next("div")[0].id, "foo", "Filtered next check" );
	equal( jQuery("#ap").next("p").length, 0, "Filtered next check, no match" );
	equal( jQuery("#ap").next("div, p")[0].id, "foo", "Multiple filters" );
	equal( jQuery("body").next().length, 0, "Simple next check, no match" );
});

test("prev([String])", function() {
	expect(5);
	equal( jQuery("#foo").prev()[0].id, "ap", "Simple prev check" );
	deepEqual( jQuery("#nonnodes").contents().eq(1).prev().get(), q("nonnodesElement"), "Text node prev check" );
	equal( jQuery("#foo").prev("p")[0].id, "ap", "Filtered prev check" );
	equal( jQuery("#foo").prev("div").length, 0, "Filtered prev check, no match" );
	equal( jQuery("#foo").prev("p, div")[0].id, "ap", "Multiple filters" );
});

test("nextAll([String])", function() {
	expect(5);

	var elems = jQuery("#form").children();

	deepEqual( jQuery("#label-for").nextAll().get(), elems.slice(1).get(), "Simple nextAll check" );
	equal( jQuery("<div>text<a id='element'></a></div>").contents().eq(0).nextAll().attr("id"), "element", "Text node nextAll check" );
	deepEqual( jQuery("#label-for").nextAll("input").get(), elems.slice(1).filter("input").get(), "Filtered nextAll check" );
	deepEqual( jQuery("#label-for").nextAll("input,select").get(), elems.slice(1).filter("input,select").get(), "Multiple-filtered nextAll check" );
	deepEqual( jQuery("#label-for, #hidden1").nextAll("input,select").get(), elems.slice(1).filter("input,select").get(), "Multi-source, multiple-filtered nextAll check" );
});

test("prevAll([String])", function() {
	expect(5);

	var elems = jQuery( jQuery("#form").children().slice(0, 12).get().reverse() );

	deepEqual( jQuery("#area1").prevAll().get(), elems.get(), "Simple prevAll check" );
	deepEqual( jQuery("#nonnodes").contents().eq(1).prevAll().get(), q("nonnodesElement"), "Text node prevAll check" );
	deepEqual( jQuery("#area1").prevAll("input").get(), elems.filter("input").get(), "Filtered prevAll check" );
	deepEqual( jQuery("#area1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multiple-filtered prevAll check" );
	deepEqual( jQuery("#area1, #hidden1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multi-source, multiple-filtered prevAll check" );
});

test("nextUntil([String])", function() {
	expect(12);

	var elems = jQuery("#form").children().slice( 2, 12 );

	deepEqual( jQuery("#text1").nextUntil().get(), jQuery("#text1").nextAll().get(), "nextUntil with no selector (nextAll)" );
	equal( jQuery("<div>text<a id='element'></a></div>").contents().eq(0).nextUntil().attr("id"), "element", "Text node nextUntil with no selector (nextAll)" );
	deepEqual( jQuery("#text1").nextUntil(".foo").get(), jQuery("#text1").nextAll().get(), "nextUntil with invalid selector (nextAll)" );
	deepEqual( jQuery("#text1").nextUntil("#area1").get(), elems.get(), "Simple nextUntil check" );
	equal( jQuery("#text1").nextUntil("#text2").length, 0, "Simple nextUntil check" );
	deepEqual( jQuery("#text1").nextUntil("#area1, #radio1").get(), jQuery("#text1").next().get(), "Less simple nextUntil check" );
	deepEqual( jQuery("#text1").nextUntil("#area1", "input").get(), elems.not("button").get(), "Filtered nextUntil check" );
	deepEqual( jQuery("#text1").nextUntil("#area1", "button").get(), elems.not("input").get(), "Filtered nextUntil check" );
	deepEqual( jQuery("#text1").nextUntil("#area1", "button,input").get(), elems.get(), "Multiple-filtered nextUntil check" );
	equal( jQuery("#text1").nextUntil("#area1", "div").length, 0, "Filtered nextUntil check, no match" );
	deepEqual( jQuery("#text1, #hidden1").nextUntil("#area1", "button,input").get(), elems.get(), "Multi-source, multiple-filtered nextUntil check" );

	deepEqual( jQuery("#text1").nextUntil("[class=foo]").get(), jQuery("#text1").nextAll().get(), "Non-element nodes must be skipped, since they have no attributes" );
});

test("prevUntil([String])", function() {
	expect(11);

	var elems = jQuery("#area1").prevAll();

	deepEqual( jQuery("#area1").prevUntil().get(), elems.get(), "prevUntil with no selector (prevAll)" );
	deepEqual( jQuery("#nonnodes").contents().eq(1).prevUntil().get(), q("nonnodesElement"), "Text node prevUntil with no selector (prevAll)" );
	deepEqual( jQuery("#area1").prevUntil(".foo").get(), elems.get(), "prevUntil with invalid selector (prevAll)" );
	deepEqual( jQuery("#area1").prevUntil("label").get(), elems.slice(0, -1).get(), "Simple prevUntil check" );
	equal( jQuery("#area1").prevUntil("#button").length, 0, "Simple prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label, #search").get(), jQuery("#area1").prev().get(), "Less simple prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label", "input").get(), elems.slice(0, -1).not("button").get(), "Filtered prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label", "button").get(), elems.slice(0, -1).not("input").get(), "Filtered prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label", "button,input").get(), elems.slice(0, -1).get(), "Multiple-filtered prevUntil check" );
	equal( jQuery("#area1").prevUntil("label", "div").length, 0, "Filtered prevUntil check, no match" );
	deepEqual( jQuery("#area1, #hidden1").prevUntil("label", "button,input").get(), elems.slice(0, -1).get(), "Multi-source, multiple-filtered prevUntil check" );
});

test("contents()", function() {
	expect(12);
	var ibody, c;

	equal( jQuery("#ap").contents().length, 9, "Check element contents" );
	ok( jQuery("#iframe").contents()[0], "Check existence of IFrame document" );
	ibody = jQuery("#loadediframe").contents()[0].body;
	ok( ibody, "Check existence of IFrame body" );

	equal( jQuery("span", ibody).text(), "span text", "Find span in IFrame and check its text" );

	jQuery(ibody).append("<div>init text</div>");
	equal( jQuery("div", ibody).length, 2, "Check the original div and the new div are in IFrame" );

	equal( jQuery("div", ibody).last().text(), "init text", "Add text to div in IFrame" );

	jQuery("div", ibody).last().text("div text");
	equal( jQuery("div", ibody).last().text(), "div text", "Add text to div in IFrame" );

	jQuery("div", ibody).last().remove();
	equal( jQuery("div", ibody).length, 1, "Delete the div and check only one div left in IFrame" );

	equal( jQuery("div", ibody).text(), "span text", "Make sure the correct div is still left after deletion in IFrame" );

	jQuery("<table/>", ibody).append("<tr><td>cell</td></tr>").appendTo(ibody);
	jQuery("table", ibody).remove();
	equal( jQuery("div", ibody).length, 1, "Check for JS error on add and delete of a table in IFrame" );

	// using contents will get comments regular, text, and comment nodes
	c = jQuery("#nonnodes").contents().contents();
	equal( c.length, 1, "Check node,textnode,comment contents is just one" );
	equal( c[0].nodeValue, "hi", "Check node,textnode,comment contents is just the one from span" );
});

test("sort direction", function() {
	expect( 12 );

	var elems = jQuery("#ap, #select1 > *, #moretests > form"),
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
			forward = jQuery.unique( [].concat( actual ) );
		deepEqual( actual, reversed ? forward.reverse() : forward, "Correct sort direction for " + method );
	});
});

test("add(String selector)", function() {
	expect( 2 );

	var divs;

	deepEqual(
		jQuery("#sndp").add("#en").add("#sap").toArray(),
		q("sndp", "en", "sap"),
		"Check elements from document"
	);

	divs = jQuery("<div/>").add("#sndp");
	ok( divs[0].parentNode, "Sort with the disconnected node last (started with disconnected first)." );
});

test("add(String selector, String context)", function() {
	expect( 1 );

	deepEqual(
		jQuery([]).add("div", "#nothiddendiv").toArray(),
		q("nothiddendivchild"),
		"Check elements from document"
	);
});

test("add(String html)", function() {
	expect( 3 );

	var x,
		divs = jQuery("#sndp").add("<div/>");

	ok( !divs[1].parentNode, "Sort with the disconnected node last." );


	x = jQuery([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	equal( x[0].id, "x1", "Check detached element1" );
	equal( x[1].id, "x2", "Check detached element2" );
});

test("add(jQuery)", function() {
	expect( 4 );

	var x,
		tmp = jQuery("<div/>");

	x = jQuery([])
	.add(
		jQuery("<p id='x1'>xxx</p>").appendTo(tmp)
	)
	.add(
		jQuery("<p id='x2'>xxx</p>").appendTo(tmp)
	);

	equal( x[0].id, "x1", "Check element1 in detached parent" );
	equal( x[1].id, "x2", "Check element2 in detached parent" );

	x = jQuery([])
	.add(
		jQuery("<p id='x1'>xxx</p>")
	)
	.add(
		jQuery("<p id='x2'>xxx</p>")
	);

	equal( x[0].id, "x1", "Check detached element1" );
	equal( x[1].id, "x2", "Check detached element2" );
});

test("add(Element)", function() {
	expect( 2 );

	var x,
		tmp = jQuery("<div/>");

	x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>").appendTo(tmp)[0]).add(jQuery("<p id='x2'>xxx</p>").appendTo(tmp)[0]);
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );
});

test("add(Array elements)", function() {
	expect( 1 );

	deepEqual(
		jQuery("#sndp").add( jQuery("#en")[0] ).add( jQuery("#sap") ).toArray(),
		q("sndp", "en", "sap"),
		"Check elements from document"
	);
});

test("add(Window)", function() {
	expect( 1 );

	var frame1 = document.createElement( "iframe" ),
		frame2 = document.createElement( "iframe" );

	// This increases window.length and sets window[i] available
	document.body.appendChild( frame1 );
	document.body.appendChild( frame2 );

	// Window is tricky because it is a lot like an array, even Array#slice will
	// turn it into a multi-item array.
	equal( jQuery([]).add( window ).length, 1, "Add a window" );

	document.body.removeChild( frame1 );
	document.body.removeChild( frame2 );
});

test("add(NodeList|undefined|HTMLFormElement|HTMLSelectElement)", function() {
	expect( 4 );

	var ps, notDefined;

	ps = document.getElementsByTagName("p");

	equal( jQuery([]).add(ps).length, ps.length, "Add a NodeList" );

	equal( jQuery([]).add(notDefined).length, 0, "Adding undefined adds nothing" );

	equal( jQuery([]).add( document.getElementById("form") ).length, 1, "Add a form" );
	equal( jQuery([]).add( document.getElementById("select1") ).length, 1, "Add a select" );

	// We no longer support .add(form.elements), unfortunately.
	// There is no way, in browsers, to reliably determine the difference
	// between form.elements and form - and doing .add(form) and having it
	// add the form elements is way to unexpected, so this gets the boot.
	//ok( jQuery([]).add(jQuery("#form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for jQuery(form.elements) since it's ambiguous in IE
	// use jQuery([]).add(form.elements) instead.
	//equal( jQuery([]).add(jQuery("#form")[0].elements).length, jQuery(jQuery("#form")[0].elements).length, "Array in constructor must equals array in add()" );
});

test("add(String, Context)", function() {
	expect(6);

	deepEqual( jQuery( "#firstp" ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add selector to selector " );
	deepEqual( jQuery( document.getElementById("firstp") ).add( "#ap" ).get(), q( "firstp", "ap" ), "Add gEBId to selector" );
	deepEqual( jQuery( document.getElementById("firstp") ).add( document.getElementById("ap") ).get(), q( "firstp", "ap" ), "Add gEBId to gEBId" );

	var ctx = document.getElementById("firstp");
	deepEqual( jQuery( "#firstp" ).add( "#ap", ctx ).get(), q( "firstp" ), "Add selector to selector " );
	deepEqual( jQuery( document.getElementById("firstp") ).add( "#ap", ctx ).get(), q( "firstp" ), "Add gEBId to selector, not in context" );
	deepEqual( jQuery( document.getElementById("firstp") ).add( "#ap", document.getElementsByTagName("body")[0] ).get(), q( "firstp", "ap" ), "Add gEBId to selector, in context" );
});

test("eq('-1') #10616", function() {
	expect(3);
	var $divs = jQuery( "div" );

	equal( $divs.eq( -1 ).length, 1, "The number -1 returns a selection that has length 1" );
	equal( $divs.eq( "-1" ).length, 1, "The string '-1' returns a selection that has length 1" );
	deepEqual( $divs.eq( "-1" ), $divs.eq( -1 ), "String and number -1 match" );
});

test("index(no arg) #10977", function() {
	expect(2);
	var $list, fragment, div;

	$list = jQuery("<ul id='indextest'><li class='zero'>THIS ONE</li><li class='one'>a</li><li class='two'>b</li><li class='three'>c</li></ul>");
	jQuery("#qunit-fixture").append( $list );
	strictEqual ( jQuery( "#indextest li.zero" ).first().index() , 0, "No Argument Index Check" );
	$list.remove();

	fragment = document.createDocumentFragment();
	div = fragment.appendChild( document.createElement("div") );

	equal( jQuery( div ).index(), 0, "If jQuery#index called on element whose parent is fragment, it still should work correctly" );
});

test("traversing non-elements with attribute filters (#12523)", function() {
	expect(5);

	var nonnodes = jQuery("#nonnodes").contents();

	equal( nonnodes.filter("[id]").length, 1, ".filter" );
	equal( nonnodes.find("[id]").length, 0, ".find" );
	strictEqual( nonnodes.is("[id]"), true, ".is" );
	deepEqual( nonnodes.closest("[id='nonnodes']").get(), q("nonnodes"), ".closest" );
	deepEqual( nonnodes.parents("[id='nonnodes']").get(), q("nonnodes"), ".parents" );
});
