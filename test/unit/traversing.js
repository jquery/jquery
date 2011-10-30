module("traversing", { teardown: moduleTeardown });

test("find(String)", function() {
	expect(5);
	equal( "Yahoo", jQuery("#foo").find(".blogTest").text(), "Check for find" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	equal( j.find("div").length, 0, "Check node,textnode,comment to find zero divs" );

	deepEqual( jQuery("#qunit-fixture").find("> div").get(), q("foo", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest"), "find child elements" );
	deepEqual( jQuery("#qunit-fixture").find("> #foo, > #moretests").get(), q("foo", "moretests"), "find child elements" );
	deepEqual( jQuery("#qunit-fixture").find("> #foo > p").get(), q("sndp", "en", "sap"), "find child elements" );
});

test("find(node|jQuery object)", function() {
	expect( 11 );

	var $foo = jQuery("#foo"),
		$blog = jQuery(".blogTest"),
		$first = jQuery("#first"),
		$two = $blog.add( $first ),
		$fooTwo = $foo.add( $blog );

	equal( $foo.find( $blog ).text(), "Yahoo", "Find with blog jQuery object" );
	equal( $foo.find( $blog[0] ).text(), "Yahoo", "Find with blog node" );
	equal( $foo.find( $first ).length, 0, "#first is not in #foo" );
	equal( $foo.find( $first[0]).length, 0, "#first not in #foo (node)" );
	ok( $foo.find( $two ).is(".blogTest"), "Find returns only nodes within #foo" );
	ok( $fooTwo.find( $blog ).is(".blogTest"), "Blog is part of the collection, but also within foo" );
	ok( $fooTwo.find( $blog[0] ).is(".blogTest"), "Blog is part of the collection, but also within foo(node)" );

	equal( $two.find( $foo ).length, 0, "Foo is not in two elements" );
	equal( $two.find( $foo[0] ).length, 0, "Foo is not in two elements(node)" );
	equal( $two.find( $first ).length, 0, "first is in the collection and not within two" );
	equal( $two.find( $first ).length, 0, "first is in the collection and not within two(node)" );

});

test("is(String|undefined)", function() {
	expect(29);
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
	ok( jQuery("#foo").is(":has(p)"), "Check for child: Expected a child 'p' element" );
	ok( !jQuery("#foo").is(":has(ul)"), "Check for child: Did not expect 'ul' element" );
	ok( jQuery("#foo").is(":has(p):has(a):has(code)"), "Check for childs: Expected 'p', 'a' and 'code' child elements" );
	ok( !jQuery("#foo").is(":has(p):has(a):has(code):has(ol)"), "Check for childs: Expected 'p', 'a' and 'code' child elements, but no 'ol'" );

	ok( !jQuery("#foo").is(0), "Expected false for an invalid expression - 0" );
	ok( !jQuery("#foo").is(null), "Expected false for an invalid expression - null" );
	ok( !jQuery("#foo").is(""), "Expected false for an invalid expression - \"\"" );
	ok( !jQuery("#foo").is(undefined), "Expected false for an invalid expression - undefined" );
	ok( !jQuery("#foo").is({ plain: "object" }), "Check passing invalid object" );

	// test is() with comma-seperated expressions
	ok( jQuery("#en").is("[lang=\"en\"],[lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( jQuery("#en").is("[lang=\"de\"],[lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( jQuery("#en").is("[lang=\"en\"] , [lang=\"de\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );
	ok( jQuery("#en").is("[lang=\"de\"] , [lang=\"en\"]"), "Comma-seperated; Check for lang attribute: Expect en or de" );

	ok( !jQuery(window).is('a'), "Checking is on a window does not throw an exception(#10178)" );
	ok( !jQuery(document).is('a'), "Checking is on a document does not throw an exception(#10178)" );
});

test("is(jQuery)", function() {
	expect(21);
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
	ok( jQuery("#foo").is( jQuery("div:has(p)") ), "Check for child: Expected a child 'p' element" );
	ok( !jQuery("#foo").is( jQuery("div:has(ul)") ), "Check for child: Did not expect 'ul' element" );

	// Some raw elements
	ok( jQuery("#form").is( jQuery("form")[0] ), "Check for element: A form is a form" );
	ok( !jQuery("#form").is( jQuery("div")[0] ), "Check for element: A form is not a div" );
	ok( jQuery("#mark").is( jQuery(".blog")[0] ), "Check for class: Expected class 'blog'" );
	ok( !jQuery("#mark").is( jQuery(".link")[0] ), "Check for class: Did not expect class 'link'" );
	ok( jQuery("#simon").is( jQuery(".blog.link")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link'" );
	ok( !jQuery("#simon").is( jQuery(".blogTest")[0] ), "Check for multiple classes: Expected classes 'blog' and 'link', but not 'blogTest'" );
});

test("is() with positional selectors", function() {
	expect(23);

	var html = jQuery(
				'<p id="posp"><a class="firsta" href="#"><em>first</em></a><a class="seconda" href="#"><b>test</b></a><em></em></p>'
			).appendTo( "body" ),
		isit = function(sel, match, expect) {
			equal( jQuery( sel ).is( match ), expect, "jQuery( " + sel + " ).is( " + match + " )" );
		};

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

	html.remove();
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
	equal( jQuery("#form :radio").index( jQuery("#radio2") ), 1, "Pass in a jQuery object" );

	// Passing a selector or nothing
	// enabled since [6330]
	equal( jQuery("#text2").index(), 2, "Check for index amongst siblings" );
	equal( jQuery("#form").children().eq(4).index(), 4, "Check for index amongst siblings" );
	equal( jQuery("#radio2").index("#form :radio") , 1, "Check for index within a selector" );
	equal( jQuery("#form :radio").index( jQuery("#radio2") ), 1, "Check for index within a selector" );
	equal( jQuery("#radio2").index("#form :text") , -1, "Check for index not found within a selector" );
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

	deepEqual( jQuery("#qunit-fixture p").filter(function() { return !jQuery("a", this).length }).get(), q("sndp", "first"), "filter(Function)" );

	deepEqual( jQuery("#qunit-fixture p").filter(function(i, elem) { return !jQuery("a", elem).length }).get(), q("sndp", "first"), "filter(Function) using arg" );
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

	var html = jQuery('' +
		'<p id="posp">' +
			'<a class="firsta" href="#">' +
				'<em>first</em>' +
			'</a>' +
			'<a class="seconda" href="#">' +
				'<b>test</b>' +
			'</a>' +
			'<em></em>' +
		'</p>').appendTo( "body" ),
		filterit = function(sel, filter, length) {
			equal( jQuery( sel ).filter( filter ).length, length, "jQuery( " + sel + " ).filter( " + filter + " )" );
		};

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
	html.remove();
});

test("closest()", function() {
	expect(13);
	deepEqual( jQuery("body").closest("body").get(), q("body"), "closest(body)" );
	deepEqual( jQuery("body").closest("html").get(), q("html"), "closest(html)" );
	deepEqual( jQuery("body").closest("div").get(), [], "closest(div)" );
	deepEqual( jQuery("#qunit-fixture").closest("span,#html").get(), q("html"), "closest(span,#html)" );

	deepEqual( jQuery("div:eq(1)").closest("div:first").get(), [], "closest(div:first)" );
	deepEqual( jQuery("div").closest("body:first div:last").get(), q("fx-tests"), "closest(body:first div:last)" );

	// Test .closest() limited by the context
	var jq = jQuery("#nothiddendivchild");
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
});

test("closest(Array)", function() {
	expect(7);
	deepEqual( jQuery("body").closest(["body"]), [{selector:"body", elem:document.body, level:1}], "closest([body])" );
	deepEqual( jQuery("body").closest(["html"]), [{selector:"html", elem:document.documentElement, level:2}], "closest([html])" );
	deepEqual( jQuery("body").closest(["div"]), [], "closest([div])" );
	deepEqual( jQuery("#yahoo").closest(["div"]), [{"selector":"div", "elem": document.getElementById("foo"), "level": 3}, { "selector": "div", "elem": document.getElementById("qunit-fixture"), "level": 4 }], "closest([div])" );
	deepEqual( jQuery("#qunit-fixture").closest(["span,#html"]), [{selector:"span,#html", elem:document.documentElement, level:4}], "closest([span,#html])" );

	deepEqual( jQuery("body").closest(["body","html"]), [{selector:"body", elem:document.body, level:1}, {selector:"html", elem:document.documentElement, level:2}], "closest([body, html])" );
	deepEqual( jQuery("body").closest(["span","html"]), [{selector:"html", elem:document.documentElement, level:2}], "closest([body, html])" );
});

test("closest(jQuery)", function() {
	expect(8);
	var $child = jQuery("#nothiddendivchild"),
		$parent = jQuery("#nothiddendiv"),
		$main = jQuery("#qunit-fixture"),
		$body = jQuery("body");
	ok( $child.closest( $parent ).is("#nothiddendiv"), "closest( jQuery('#nothiddendiv') )" );
	ok( $child.closest( $parent[0] ).is("#nothiddendiv"), "closest( jQuery('#nothiddendiv') ) :: node" );
	ok( $child.closest( $child ).is("#nothiddendivchild"), "child is included" );
	ok( $child.closest( $child[0] ).is("#nothiddendivchild"), "child is included  :: node" );
	equal( $child.closest( document.createElement("div") ).length, 0, "created element is not related" );
	equal( $child.closest( $main ).length, 0, "Main not a parent of child" );
	equal( $child.closest( $main[0] ).length, 0, "Main not a parent of child :: node" );
	ok( $child.closest( $body.add($parent) ).is("#nothiddendiv"), "Closest ancestor retrieved." );
});

test("not(Selector|undefined)", function() {
	expect(11);
	equal( jQuery("#qunit-fixture > p#ap > a").not("#google").length, 2, "not('selector')" );
	deepEqual( jQuery("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')" );
	deepEqual( jQuery("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );
	deepEqual( jQuery("#form option").not("option.emptyopt:contains('Nothing'),[selected],[value='1']").get(), q("option1c", "option1d", "option2c", "option3d", "option3e", "option4e","option5b"), "not('complex selector')");

	deepEqual( jQuery("#ap *").not("code").get(), q("google", "groups", "anchor1", "mark"), "not('tag selector')" );
	deepEqual( jQuery("#ap *").not("code, #mark").get(), q("google", "groups", "anchor1"), "not('tag, ID selector')" );
	deepEqual( jQuery("#ap *").not("#mark, code").get(), q("google", "groups", "anchor1"), "not('ID, tag selector')");

	var all = jQuery("p").get();
	deepEqual( jQuery("p").not(null).get(),      all, "not(null) should have no effect");
	deepEqual( jQuery("p").not(undefined).get(), all, "not(undefined) should have no effect");
	deepEqual( jQuery("p").not(0).get(),         all, "not(0) should have no effect");
	deepEqual( jQuery("p").not("").get(),        all, "not('') should have no effect");
});

test("not(Element)", function() {
	expect(1);

	var selects = jQuery("#form select");
	deepEqual( selects.not( selects[1] ).get(), q("select1", "select3", "select4", "select5"), "filter out DOM element");
});

test("not(Function)", function() {
	deepEqual( jQuery("#qunit-fixture p").not(function() { return jQuery("a", this).length }).get(), q("sndp", "first"), "not(Function)" );
});

test("not(Array)", function() {
	expect(2);

	equal( jQuery("#qunit-fixture > p#ap > a").not(document.getElementById("google")).length, 2, "not(DOMElement)" );
	equal( jQuery("p").not(document.getElementsByTagName("p")).length, 0, "not(Array-like DOM collection)" );
});

test("not(jQuery)", function() {
	expect(1);

	deepEqual( jQuery("p").not(jQuery("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(jQuery)" );
});

test("has(Element)", function() {
	expect(2);

	var obj = jQuery("#qunit-fixture").has(jQuery("#sndp")[0]);
	deepEqual( obj.get(), q("qunit-fixture"), "Keeps elements that have the element as a descendant" );

	var multipleParent = jQuery("#qunit-fixture, #header").has(jQuery("#sndp")[0]);
	deepEqual( obj.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );
});

test("has(Selector)", function() {
	expect(3);

	var obj = jQuery("#qunit-fixture").has("#sndp");
	deepEqual( obj.get(), q("qunit-fixture"), "Keeps elements that have any element matching the selector as a descendant" );

	var multipleParent = jQuery("#qunit-fixture, #header").has("#sndp");
	deepEqual( obj.get(), q("qunit-fixture"), "Does not include elements that do not have the element as a descendant" );

	var multipleHas = jQuery("#qunit-fixture").has("#sndp, #first");
	deepEqual( multipleHas.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("has(Arrayish)", function() {
	expect(3);

	var simple = jQuery("#qunit-fixture").has(jQuery("#sndp"));
	deepEqual( simple.get(), q("qunit-fixture"), "Keeps elements that have any element in the jQuery list as a descendant" );

	var multipleParent = jQuery("#qunit-fixture, #header").has(jQuery("#sndp"));
	deepEqual( multipleParent.get(), q("qunit-fixture"), "Does not include elements that do not have an element in the jQuery list as a descendant" );

	var multipleHas = jQuery("#qunit-fixture").has(jQuery("#sndp, #first"));
	deepEqual( simple.get(), q("qunit-fixture"), "Only adds elements once" );
});

test("andSelf()", function() {
	expect(4);
	deepEqual( jQuery("#en").siblings().andSelf().get(), q("sndp", "en", "sap"), "Check for siblings and self" );
	deepEqual( jQuery("#foo").children().andSelf().get(), q("foo", "sndp", "en", "sap"), "Check for children and self" );
	deepEqual( jQuery("#sndp, #en").parent().andSelf().get(), q("foo","sndp","en"), "Check for parent and self" );
	deepEqual( jQuery("#groups").parents("p, div").andSelf().get(), q("qunit-fixture", "ap", "groups"), "Check for parents and self" );
});

test("siblings([String])", function() {
	expect(6);
	deepEqual( jQuery("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	deepEqual( jQuery("#sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" );
	deepEqual( jQuery("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
	deepEqual( jQuery("#foo").siblings("form, b").get(), q("form", "floatTest", "lengthtest", "name-tests", "testForm"), "Check for multiple filters" );
	var set = q("sndp", "en", "sap");
	deepEqual( jQuery("#en, #sndp").siblings().get(), set, "Check for unique results from siblings" );
	deepEqual( jQuery("#option5a").siblings("option[data-attr]").get(), q("option5c"), "Has attribute selector in siblings (#9261)" );
});

test("children([String])", function() {
	expect(3);
	deepEqual( jQuery("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	deepEqual( jQuery("#foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children" );
	deepEqual( jQuery("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("parent([String])", function() {
	expect(5);
	equal( jQuery("#groups").parent()[0].id, "ap", "Simple parent check" );
	equal( jQuery("#groups").parent("p")[0].id, "ap", "Filtered parent check" );
	equal( jQuery("#groups").parent("div").length, 0, "Filtered parent check, no match" );
	equal( jQuery("#groups").parent("div, p")[0].id, "ap", "Check for multiple filters" );
	deepEqual( jQuery("#en, #sndp").parent().get(), q("foo"), "Check for unique results from parent" );
});

test("parents([String])", function() {
	expect(5);
	equal( jQuery("#groups").parents()[0].id, "ap", "Simple parents check" );
	equal( jQuery("#groups").parents("p")[0].id, "ap", "Filtered parents check" );
	equal( jQuery("#groups").parents("div")[0].id, "qunit-fixture", "Filtered parents check2" );
	deepEqual( jQuery("#groups").parents("p, div").get(), q("ap", "qunit-fixture"), "Check for multiple filters" );
	deepEqual( jQuery("#en, #sndp").parents().get(), q("foo", "qunit-fixture", "dl", "body", "html"), "Check for unique results from parents" );
});

test("parentsUntil([String])", function() {
	expect(9);

	var parents = jQuery("#groups").parents();

	deepEqual( jQuery("#groups").parentsUntil().get(), parents.get(), "parentsUntil with no selector (nextAll)" );
	deepEqual( jQuery("#groups").parentsUntil(".foo").get(), parents.get(), "parentsUntil with invalid selector (nextAll)" );
	deepEqual( jQuery("#groups").parentsUntil("#html").get(), parents.not(":last").get(), "Simple parentsUntil check" );
	equal( jQuery("#groups").parentsUntil("#ap").length, 0, "Simple parentsUntil check" );
	deepEqual( jQuery("#groups").parentsUntil("#html, #body").get(), parents.slice( 0, 3 ).get(), "Less simple parentsUntil check" );
	deepEqual( jQuery("#groups").parentsUntil("#html", "div").get(), jQuery("#qunit-fixture").get(), "Filtered parentsUntil check" );
	deepEqual( jQuery("#groups").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multiple-filtered parentsUntil check" );
	equal( jQuery("#groups").parentsUntil("#html", "span").length, 0, "Filtered parentsUntil check, no match" );
	deepEqual( jQuery("#groups, #ap").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multi-source, multiple-filtered parentsUntil check" );
});

test("next([String])", function() {
	expect(4);
	equal( jQuery("#ap").next()[0].id, "foo", "Simple next check" );
	equal( jQuery("#ap").next("div")[0].id, "foo", "Filtered next check" );
	equal( jQuery("#ap").next("p").length, 0, "Filtered next check, no match" );
	equal( jQuery("#ap").next("div, p")[0].id, "foo", "Multiple filters" );
});

test("prev([String])", function() {
	expect(4);
	equal( jQuery("#foo").prev()[0].id, "ap", "Simple prev check" );
	equal( jQuery("#foo").prev("p")[0].id, "ap", "Filtered prev check" );
	equal( jQuery("#foo").prev("div").length, 0, "Filtered prev check, no match" );
	equal( jQuery("#foo").prev("p, div")[0].id, "ap", "Multiple filters" );
});

test("nextAll([String])", function() {
	expect(4);

	var elems = jQuery("#form").children();

	deepEqual( jQuery("#label-for").nextAll().get(), elems.not(":first").get(), "Simple nextAll check" );
	deepEqual( jQuery("#label-for").nextAll("input").get(), elems.not(":first").filter("input").get(), "Filtered nextAll check" );
	deepEqual( jQuery("#label-for").nextAll("input,select").get(), elems.not(":first").filter("input,select").get(), "Multiple-filtered nextAll check" );
	deepEqual( jQuery("#label-for, #hidden1").nextAll("input,select").get(), elems.not(":first").filter("input,select").get(), "Multi-source, multiple-filtered nextAll check" );
});

test("prevAll([String])", function() {
	expect(4);

	var elems = jQuery( jQuery("#form").children().slice(0, 12).get().reverse() );

	deepEqual( jQuery("#area1").prevAll().get(), elems.get(), "Simple prevAll check" );
	deepEqual( jQuery("#area1").prevAll("input").get(), elems.filter("input").get(), "Filtered prevAll check" );
	deepEqual( jQuery("#area1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multiple-filtered prevAll check" );
	deepEqual( jQuery("#area1, #hidden1").prevAll("input,select").get(), elems.filter("input,select").get(), "Multi-source, multiple-filtered prevAll check" );
});

test("nextUntil([String])", function() {
	expect(11);

	var elems = jQuery("#form").children().slice( 2, 12 );

	deepEqual( jQuery("#text1").nextUntil().get(), jQuery("#text1").nextAll().get(), "nextUntil with no selector (nextAll)" );
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
	expect(10);

	var elems = jQuery("#area1").prevAll();

	deepEqual( jQuery("#area1").prevUntil().get(), elems.get(), "prevUntil with no selector (prevAll)" );
	deepEqual( jQuery("#area1").prevUntil(".foo").get(), elems.get(), "prevUntil with invalid selector (prevAll)" );
	deepEqual( jQuery("#area1").prevUntil("label").get(), elems.not(":last").get(), "Simple prevUntil check" );
	equal( jQuery("#area1").prevUntil("#button").length, 0, "Simple prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label, #search").get(), jQuery("#area1").prev().get(), "Less simple prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label", "input").get(), elems.not(":last").not("button").get(), "Filtered prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label", "button").get(), elems.not(":last").not("input").get(), "Filtered prevUntil check" );
	deepEqual( jQuery("#area1").prevUntil("label", "button,input").get(), elems.not(":last").get(), "Multiple-filtered prevUntil check" );
	equal( jQuery("#area1").prevUntil("label", "div").length, 0, "Filtered prevUntil check, no match" );
	deepEqual( jQuery("#area1, #hidden1").prevUntil("label", "button,input").get(), elems.not(":last").get(), "Multi-source, multiple-filtered prevUntil check" );
});

test("contents()", function() {
	expect(12);
	equal( jQuery("#ap").contents().length, 9, "Check element contents" );
	ok( jQuery("#iframe").contents()[0], "Check existance of IFrame document" );
	var ibody = jQuery("#loadediframe").contents()[0].body;
	ok( ibody, "Check existance of IFrame body" );

	equal( jQuery("span", ibody).text(), "span text", "Find span in IFrame and check its text" );

	jQuery(ibody).append("<div>init text</div>");
	equal( jQuery("div", ibody).length, 2, "Check the original div and the new div are in IFrame" );

	equal( jQuery("div:last", ibody).text(), "init text", "Add text to div in IFrame" );

	jQuery("div:last", ibody).text("div text");
	equal( jQuery("div:last", ibody).text(), "div text", "Add text to div in IFrame" );

	jQuery("div:last", ibody).remove();
	equal( jQuery("div", ibody).length, 1, "Delete the div and check only one div left in IFrame" );

	equal( jQuery("div", ibody).text(), "span text", "Make sure the correct div is still left after deletion in IFrame" );

	jQuery("<table/>", ibody).append("<tr><td>cell</td></tr>").appendTo(ibody);
	jQuery("table", ibody).remove();
	equal( jQuery("div", ibody).length, 1, "Check for JS error on add and delete of a table in IFrame" );

	// using contents will get comments regular, text, and comment nodes
	var c = jQuery("#nonnodes").contents().contents();
	equal( c.length, 1, "Check node,textnode,comment contents is just one" );
	equal( c[0].nodeValue, "hi", "Check node,textnode,comment contents is just the one from span" );
});

test("add(String|Element|Array|undefined)", function() {
	expect(16);
	deepEqual( jQuery("#sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document" );
	deepEqual( jQuery("#sndp").add( jQuery("#en")[0] ).add( jQuery("#sap") ).get(), q("sndp", "en", "sap"), "Check elements from document" );

	// We no longer support .add(form.elements), unfortunately.
	// There is no way, in browsers, to reliably determine the difference
	// between form.elements and form - and doing .add(form) and having it
	// add the form elements is way to unexpected, so this gets the boot.
	// ok( jQuery([]).add(jQuery("#form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for jQuery(form.elements) since it's ambiguous in IE
	// use jQuery([]).add(form.elements) instead.
	//equal( jQuery([]).add(jQuery("#form")[0].elements).length, jQuery(jQuery("#form")[0].elements).length, "Array in constructor must equals array in add()" );

	var divs = jQuery("<div/>").add("#sndp");
	ok( !divs[0].parentNode, "Make sure the first element is still the disconnected node." );

	divs = jQuery("<div>test</div>").add("#sndp");
	equal( divs[0].parentNode.nodeType, 11, "Make sure the first element is still the disconnected node." );

	divs = jQuery("#sndp").add("<div/>");
	ok( !divs[1].parentNode, "Make sure the first element is still the disconnected node." );

	var tmp = jQuery("<div/>");

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>").appendTo(tmp)).add(jQuery("<p id='x2'>xxx</p>").appendTo(tmp));
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>").appendTo(tmp)[0]).add(jQuery("<p id='x2'>xxx</p>").appendTo(tmp)[0]);
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>")).add(jQuery("<p id='x2'>xxx</p>"));
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	equal( x[0].id, "x1", "Check on-the-fly element1" );
	equal( x[1].id, "x2", "Check on-the-fly element2" );

	var notDefined;
	equal( jQuery([]).add(notDefined).length, 0, "Check that undefined adds nothing" );

	equal( jQuery([]).add( document.getElementById("form") ).length, 1, "Add a form" );
	equal( jQuery([]).add( document.getElementById("select1") ).length, 1, "Add a select" );
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

