module("traversing");

test("find(String)", function() {
	expect(5);
	equals( 'Yahoo', jQuery('#foo').find('.blogTest').text(), 'Check for find' );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	equals( j.find("div").length, 0, "Check node,textnode,comment to find zero divs" );

	same( jQuery("#main").find("> div").get(), q("foo", "moretests", "tabindex-tests", "liveHandlerOrder", "siblingTest"), "find child elements" );
	same( jQuery("#main").find("> #foo, > #moretests").get(), q("foo", "moretests"), "find child elements" );
	same( jQuery("#main").find("> #foo > p").get(), q("sndp", "en", "sap"), "find child elements" );
});

test("is(String)", function() {
	expect(26);
	ok( jQuery('#form').is('form'), 'Check for element: A form must be a form' );
	ok( !jQuery('#form').is('div'), 'Check for element: A form is not a div' );
	ok( jQuery('#mark').is('.blog'), 'Check for class: Expected class "blog"' );
	ok( !jQuery('#mark').is('.link'), 'Check for class: Did not expect class "link"' );
	ok( jQuery('#simon').is('.blog.link'), 'Check for multiple classes: Expected classes "blog" and "link"' );
	ok( !jQuery('#simon').is('.blogTest'), 'Check for multiple classes: Expected classes "blog" and "link", but not "blogTest"' );
	ok( jQuery('#en').is('[lang="en"]'), 'Check for attribute: Expected attribute lang to be "en"' );
	ok( !jQuery('#en').is('[lang="de"]'), 'Check for attribute: Expected attribute lang to be "en", not "de"' );
	ok( jQuery('#text1').is('[type="text"]'), 'Check for attribute: Expected attribute type to be "text"' );
	ok( !jQuery('#text1').is('[type="radio"]'), 'Check for attribute: Expected attribute type to be "text", not "radio"' );
	ok( jQuery('#text2').is(':disabled'), 'Check for pseudoclass: Expected to be disabled' );
	ok( !jQuery('#text1').is(':disabled'), 'Check for pseudoclass: Expected not disabled' );
	ok( jQuery('#radio2').is(':checked'), 'Check for pseudoclass: Expected to be checked' );
	ok( !jQuery('#radio1').is(':checked'), 'Check for pseudoclass: Expected not checked' );
	ok( jQuery('#foo').is(':has(p)'), 'Check for child: Expected a child "p" element' );
	ok( !jQuery('#foo').is(':has(ul)'), 'Check for child: Did not expect "ul" element' );
	ok( jQuery('#foo').is(':has(p):has(a):has(code)'), 'Check for childs: Expected "p", "a" and "code" child elements' );
	ok( !jQuery('#foo').is(':has(p):has(a):has(code):has(ol)'), 'Check for childs: Expected "p", "a" and "code" child elements, but no "ol"' );
	ok( !jQuery('#foo').is(0), 'Expected false for an invalid expression - 0' );
	ok( !jQuery('#foo').is(null), 'Expected false for an invalid expression - null' );
	ok( !jQuery('#foo').is(''), 'Expected false for an invalid expression - ""' );
	ok( !jQuery('#foo').is(undefined), 'Expected false for an invalid expression - undefined' );

	// test is() with comma-seperated expressions
	ok( jQuery('#en').is('[lang="en"],[lang="de"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
	ok( jQuery('#en').is('[lang="de"],[lang="en"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
	ok( jQuery('#en').is('[lang="en"] , [lang="de"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
	ok( jQuery('#en').is('[lang="de"] , [lang="en"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
});

test("index()", function() {
	expect(1);

	equals( jQuery("#text2").index(), 2, "Returns the index of a child amongst its siblings" )
});

test("index(Object|String|undefined)", function() {
	expect(16);

	var elements = jQuery([window, document]),
		inputElements = jQuery('#radio1,#radio2,#check1,#check2');

	// Passing a node
	equals( elements.index(window), 0, "Check for index of elements" );
	equals( elements.index(document), 1, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('radio1')), 0, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('radio2')), 1, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('check1')), 2, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('check2')), 3, "Check for index of elements" );
	equals( inputElements.index(window), -1, "Check for not found index" );
	equals( inputElements.index(document), -1, "Check for not found index" );

	// Passing a jQuery object
	// enabled since [5500]
	equals( elements.index( elements ), 0, "Pass in a jQuery object" );
	equals( elements.index( elements.eq(1) ), 1, "Pass in a jQuery object" );
	equals( jQuery("#form :radio").index( jQuery("#radio2") ), 1, "Pass in a jQuery object" );

	// Passing a selector or nothing
	// enabled since [6330]
	equals( jQuery('#text2').index(), 2, "Check for index amongst siblings" );
	equals( jQuery('#form').children().eq(4).index(), 4, "Check for index amongst siblings" );
	equals( jQuery('#radio2').index('#form :radio') , 1, "Check for index within a selector" );
	equals( jQuery('#form :radio').index( jQuery('#radio2') ), 1, "Check for index within a selector" );
	equals( jQuery('#radio2').index('#form :text') , -1, "Check for index not found within a selector" );
});

test("filter(Selector)", function() {
	expect(5);
	same( jQuery("#form input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	same( jQuery("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')" );
	same( jQuery("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	equals( j.filter("span").length, 1, "Check node,textnode,comment to filter the one span" );
	equals( j.filter("[name]").length, 0, "Check node,textnode,comment to filter the one span" );
});

test("filter(Function)", function() {
	expect(2);

	same( jQuery("p").filter(function() { return !jQuery("a", this).length }).get(), q("sndp", "first"), "filter(Function)" );

	same( jQuery("p").filter(function(i, elem) { return !jQuery("a", elem).length }).get(), q("sndp", "first"), "filter(Function) using arg" );
});

test("filter(Element)", function() {
	expect(1);

	var element = document.getElementById("text1");
	same( jQuery("#form input").filter(element).get(), q("text1"), "filter(Element)" );
});

test("filter(Array)", function() {
	expect(1);

	var elements = [ document.getElementById("text1") ];
	same( jQuery("#form input").filter(elements).get(), q("text1"), "filter(Element)" );
});

test("filter(jQuery)", function() {
	expect(1);

	var elements = jQuery("#text1");
	same( jQuery("#form input").filter(elements).get(), q("text1"), "filter(Element)" );
})

test("closest()", function() {
	expect(11);
	same( jQuery("body").closest("body").get(), q("body"), "closest(body)" );
	same( jQuery("body").closest("html").get(), q("html"), "closest(html)" );
	same( jQuery("body").closest("div").get(), [], "closest(div)" );
	same( jQuery("#main").closest("span,#html").get(), q("html"), "closest(span,#html)" );

	same( jQuery("div:eq(1)").closest("div:first").get(), [], "closest(div:first)" );
	same( jQuery("div").closest("body:first div:last").get(), q("fx-tests"), "closest(body:first div:last)" );

	// Test .closest() limited by the context
	var jq = jQuery("#nothiddendivchild");
	same( jq.closest("html", document.body).get(), [], "Context limited." );
	same( jq.closest("body", document.body).get(), [], "Context limited." );
	same( jq.closest("#nothiddendiv", document.body).get(), q("nothiddendiv"), "Context not reached." );
	
	//Test that .closest() returns unique'd set
	equals( jQuery('#main p').closest('#main').length, 1, "Closest should return a unique set" );

	// Test on disconnected node
	equals( jQuery("<div><p></p></div>").find("p").closest("table").length, 0, "Make sure disconnected closest work." );
});

test("closest(Array)", function() {
	expect(7);
	same( jQuery("body").closest(["body"]), [{selector:"body", elem:document.body, level:1}], "closest([body])" );
	same( jQuery("body").closest(["html"]), [{selector:"html", elem:document.documentElement, level:2}], "closest([html])" );
	same( jQuery("body").closest(["div"]), [], "closest([div])" );
	same( jQuery("#yahoo").closest(["div"]), [{"selector":"div", "elem": document.getElementById("foo"), "level": 3}, { "selector": "div", "elem": document.getElementById("main"), "level": 4 }], "closest([div])" );
	same( jQuery("#main").closest(["span,#html"]), [{selector:"span,#html", elem:document.documentElement, level:4}], "closest([span,#html])" );

	same( jQuery("body").closest(["body","html"]), [{selector:"body", elem:document.body, level:1}, {selector:"html", elem:document.documentElement, level:2}], "closest([body, html])" );
	same( jQuery("body").closest(["span","html"]), [{selector:"html", elem:document.documentElement, level:2}], "closest([body, html])" );
});

test("not(Selector)", function() {
	expect(7);
	equals( jQuery("#main > p#ap > a").not("#google").length, 2, "not('selector')" );
	same( jQuery("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')" );
	same( jQuery("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );
	same( jQuery("#form option").not("option.emptyopt:contains('Nothing'),[selected],[value='1']").get(), q("option1c", "option1d", "option2c", "option3d", "option3e", "option4e","option5b"), "not('complex selector')");

	same( jQuery('#ap *').not('code').get(), q("google", "groups", "anchor1", "mark"), "not('tag selector')" );
	same( jQuery('#ap *').not('code, #mark').get(), q("google", "groups", "anchor1"), "not('tag, ID selector')" );
	same( jQuery('#ap *').not('#mark, code').get(), q("google", "groups", "anchor1"), "not('ID, tag selector')");
});

test("not(Element)", function() {
	expect(1);

	var selects = jQuery("#form select");
	same( selects.not( selects[1] ).get(), q("select1", "select3", "select4", "select5"), "filter out DOM element");
});

test("not(Function)", function() {
	same( jQuery("p").not(function() { return jQuery("a", this).length }).get(), q("sndp", "first"), "not(Function)" );
});

test("not(Array)", function() {
	expect(2);

	equals( jQuery("#main > p#ap > a").not(document.getElementById("google")).length, 2, "not(DOMElement)" );
	equals( jQuery("p").not(document.getElementsByTagName("p")).length, 0, "not(Array-like DOM collection)" );
});

test("not(jQuery)", function() {
	expect(1);

	same( jQuery("p").not(jQuery("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(jQuery)" );
});

test("has(Element)", function() {
	expect(2);

	var obj = jQuery("#main").has(jQuery("#sndp")[0]);
	same( obj.get(), q("main"), "Keeps elements that have the element as a descendant" );

	var multipleParent = jQuery("#main, #header").has(jQuery("#sndp")[0]);
	same( obj.get(), q("main"), "Does not include elements that do not have the element as a descendant" );
});

test("has(Selector)", function() {
	expect(3);

	var obj = jQuery("#main").has("#sndp");
	same( obj.get(), q("main"), "Keeps elements that have any element matching the selector as a descendant" );

	var multipleParent = jQuery("#main, #header").has("#sndp");
	same( obj.get(), q("main"), "Does not include elements that do not have the element as a descendant" );

	var multipleHas = jQuery("#main").has("#sndp, #first");
	same( multipleHas.get(), q("main"), "Only adds elements once" );
});

test("has(Arrayish)", function() {
	expect(3);

	var simple = jQuery("#main").has(jQuery("#sndp"));
	same( simple.get(), q("main"), "Keeps elements that have any element in the jQuery list as a descendant" );

	var multipleParent = jQuery("#main, #header").has(jQuery("#sndp"));
	same( multipleParent.get(), q("main"), "Does not include elements that do not have an element in the jQuery list as a descendant" );

	var multipleHas = jQuery("#main").has(jQuery("#sndp, #first"));
	same( simple.get(), q("main"), "Only adds elements once" );
});

test("andSelf()", function() {
	expect(4);
	same( jQuery("#en").siblings().andSelf().get(), q("sndp", "en", "sap"), "Check for siblings and self" );
	same( jQuery("#foo").children().andSelf().get(), q("foo", "sndp", "en", "sap"), "Check for children and self" );
	same( jQuery("#sndp, #en").parent().andSelf().get(), q("foo","sndp","en"), "Check for parent and self" );
	same( jQuery("#groups").parents("p, div").andSelf().get(), q("main", "ap", "groups"), "Check for parents and self" );
});

test("siblings([String])", function() {
	expect(5);
	same( jQuery("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	same( jQuery("#sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" );
	same( jQuery("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
	same( jQuery("#foo").siblings("form, b").get(), q("form", "floatTest", "lengthtest", "name-tests", "testForm"), "Check for multiple filters" );
	var set = q("sndp", "en", "sap");
	same( jQuery("#en, #sndp").siblings().get(), set, "Check for unique results from siblings" );
});

test("children([String])", function() {
	expect(3);
	same( jQuery("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	same( jQuery("#foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children" );
	same( jQuery("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("parent([String])", function() {
	expect(5);
	equals( jQuery("#groups").parent()[0].id, "ap", "Simple parent check" );
	equals( jQuery("#groups").parent("p")[0].id, "ap", "Filtered parent check" );
	equals( jQuery("#groups").parent("div").length, 0, "Filtered parent check, no match" );
	equals( jQuery("#groups").parent("div, p")[0].id, "ap", "Check for multiple filters" );
	same( jQuery("#en, #sndp").parent().get(), q("foo"), "Check for unique results from parent" );
});

test("parents([String])", function() {
	expect(5);
	equals( jQuery("#groups").parents()[0].id, "ap", "Simple parents check" );
	equals( jQuery("#groups").parents("p")[0].id, "ap", "Filtered parents check" );
	equals( jQuery("#groups").parents("div")[0].id, "main", "Filtered parents check2" );
	same( jQuery("#groups").parents("p, div").get(), q("ap", "main"), "Check for multiple filters" );
	same( jQuery("#en, #sndp").parents().get(), q("foo", "main", "dl", "body", "html"), "Check for unique results from parents" );
});

test("parentsUntil([String])", function() {
	expect(9);
	
	var parents = jQuery("#groups").parents();
	
	same( jQuery("#groups").parentsUntil().get(), parents.get(), "parentsUntil with no selector (nextAll)" );
	same( jQuery("#groups").parentsUntil(".foo").get(), parents.get(), "parentsUntil with invalid selector (nextAll)" );
	same( jQuery("#groups").parentsUntil("#html").get(), parents.not(':last').get(), "Simple parentsUntil check" );
	equals( jQuery("#groups").parentsUntil("#ap").length, 0, "Simple parentsUntil check" );
	same( jQuery("#groups").parentsUntil("#html, #body").get(), parents.slice( 0, 3 ).get(), "Less simple parentsUntil check" );
	same( jQuery("#groups").parentsUntil("#html", "div").get(), jQuery("#main").get(), "Filtered parentsUntil check" );
	same( jQuery("#groups").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multiple-filtered parentsUntil check" );
	equals( jQuery("#groups").parentsUntil("#html", "span").length, 0, "Filtered parentsUntil check, no match" );
	same( jQuery("#groups, #ap").parentsUntil("#html", "p,div,dl").get(), parents.slice( 0, 3 ).get(), "Multi-source, multiple-filtered parentsUntil check" );
});

test("next([String])", function() {
	expect(4);
	equals( jQuery("#ap").next()[0].id, "foo", "Simple next check" );
	equals( jQuery("#ap").next("div")[0].id, "foo", "Filtered next check" );
	equals( jQuery("#ap").next("p").length, 0, "Filtered next check, no match" );
	equals( jQuery("#ap").next("div, p")[0].id, "foo", "Multiple filters" );
});

test("prev([String])", function() {
	expect(4);
	equals( jQuery("#foo").prev()[0].id, "ap", "Simple prev check" );
	equals( jQuery("#foo").prev("p")[0].id, "ap", "Filtered prev check" );
	equals( jQuery("#foo").prev("div").length, 0, "Filtered prev check, no match" );
	equals( jQuery("#foo").prev("p, div")[0].id, "ap", "Multiple filters" );
});

test("nextAll([String])", function() {
	expect(4);
	
	var elems = jQuery('#form').children();
	
	same( jQuery("#label-for").nextAll().get(), elems.not(':first').get(), "Simple nextAll check" );
	same( jQuery("#label-for").nextAll('input').get(), elems.not(':first').filter('input').get(), "Filtered nextAll check" );
	same( jQuery("#label-for").nextAll('input,select').get(), elems.not(':first').filter('input,select').get(), "Multiple-filtered nextAll check" );
	same( jQuery("#label-for, #hidden1").nextAll('input,select').get(), elems.not(':first').filter('input,select').get(), "Multi-source, multiple-filtered nextAll check" );
});

test("prevAll([String])", function() {
	expect(4);
	
	var elems = jQuery( jQuery('#form').children().slice(0, 12).get().reverse() );
	
	same( jQuery("#area1").prevAll().get(), elems.get(), "Simple prevAll check" );
	same( jQuery("#area1").prevAll('input').get(), elems.filter('input').get(), "Filtered prevAll check" );
	same( jQuery("#area1").prevAll('input,select').get(), elems.filter('input,select').get(), "Multiple-filtered prevAll check" );
	same( jQuery("#area1, #hidden1").prevAll('input,select').get(), elems.filter('input,select').get(), "Multi-source, multiple-filtered prevAll check" );
});

test("nextUntil([String])", function() {
	expect(11);
	
	var elems = jQuery('#form').children().slice( 2, 12 );
	
	same( jQuery("#text1").nextUntil().get(), jQuery("#text1").nextAll().get(), "nextUntil with no selector (nextAll)" );
	same( jQuery("#text1").nextUntil(".foo").get(), jQuery("#text1").nextAll().get(), "nextUntil with invalid selector (nextAll)" );
	same( jQuery("#text1").nextUntil("#area1").get(), elems.get(), "Simple nextUntil check" );
	equals( jQuery("#text1").nextUntil("#text2").length, 0, "Simple nextUntil check" );
	same( jQuery("#text1").nextUntil("#area1, #radio1").get(), jQuery("#text1").next().get(), "Less simple nextUntil check" );
	same( jQuery("#text1").nextUntil("#area1", "input").get(), elems.not("button").get(), "Filtered nextUntil check" );
	same( jQuery("#text1").nextUntil("#area1", "button").get(), elems.not("input").get(), "Filtered nextUntil check" );
	same( jQuery("#text1").nextUntil("#area1", "button,input").get(), elems.get(), "Multiple-filtered nextUntil check" );
	equals( jQuery("#text1").nextUntil("#area1", "div").length, 0, "Filtered nextUntil check, no match" );
	same( jQuery("#text1, #hidden1").nextUntil("#area1", "button,input").get(), elems.get(), "Multi-source, multiple-filtered nextUntil check" );
	
	same( jQuery("#text1").nextUntil("[class=foo]").get(), jQuery("#text1").nextAll().get(), "Non-element nodes must be skipped, since they have no attributes" );
});

test("prevUntil([String])", function() {
	expect(10);
	
	var elems = jQuery("#area1").prevAll();
	
	same( jQuery("#area1").prevUntil().get(), elems.get(), "prevUntil with no selector (prevAll)" );
	same( jQuery("#area1").prevUntil(".foo").get(), elems.get(), "prevUntil with invalid selector (prevAll)" );
	same( jQuery("#area1").prevUntil("label").get(), elems.not(':last').get(), "Simple prevUntil check" );
	equals( jQuery("#area1").prevUntil("#button").length, 0, "Simple prevUntil check" );
	same( jQuery("#area1").prevUntil("label, #search").get(), jQuery("#area1").prev().get(), "Less simple prevUntil check" );
	same( jQuery("#area1").prevUntil("label", "input").get(), elems.not(':last').not("button").get(), "Filtered prevUntil check" );
	same( jQuery("#area1").prevUntil("label", "button").get(), elems.not(':last').not("input").get(), "Filtered prevUntil check" );
	same( jQuery("#area1").prevUntil("label", "button,input").get(), elems.not(':last').get(), "Multiple-filtered prevUntil check" );
	equals( jQuery("#area1").prevUntil("label", "div").length, 0, "Filtered prevUntil check, no match" );
	same( jQuery("#area1, #hidden1").prevUntil("label", "button,input").get(), elems.not(':last').get(), "Multi-source, multiple-filtered prevUntil check" );
});

test("contents()", function() {
	expect(12);
	equals( jQuery("#ap").contents().length, 9, "Check element contents" );
	ok( jQuery("#iframe").contents()[0], "Check existance of IFrame document" );
	var ibody = jQuery("#loadediframe").contents()[0].body;
	ok( ibody, "Check existance of IFrame body" );

	equals( jQuery("span", ibody).text(), "span text", "Find span in IFrame and check its text" );

	jQuery(ibody).append("<div>init text</div>");
	equals( jQuery("div", ibody).length, 2, "Check the original div and the new div are in IFrame" );

	equals( jQuery("div:last", ibody).text(), "init text", "Add text to div in IFrame" );

	jQuery("div:last", ibody).text("div text");
	equals( jQuery("div:last", ibody).text(), "div text", "Add text to div in IFrame" );

	jQuery("div:last", ibody).remove();
	equals( jQuery("div", ibody).length, 1, "Delete the div and check only one div left in IFrame" );

	equals( jQuery("div", ibody).text(), "span text", "Make sure the correct div is still left after deletion in IFrame" );

	jQuery("<table/>", ibody).append("<tr><td>cell</td></tr>").appendTo(ibody);
	jQuery("table", ibody).remove();
	equals( jQuery("div", ibody).length, 1, "Check for JS error on add and delete of a table in IFrame" );

	// using contents will get comments regular, text, and comment nodes
	var c = jQuery("#nonnodes").contents().contents();
	equals( c.length, 1, "Check node,textnode,comment contents is just one" );
	equals( c[0].nodeValue, "hi", "Check node,textnode,comment contents is just the one from span" );
});

test("add(String|Element|Array|undefined)", function() {
	expect(16);
	same( jQuery("#sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document" );
	same( jQuery("#sndp").add( jQuery("#en")[0] ).add( jQuery("#sap") ).get(), q("sndp", "en", "sap"), "Check elements from document" );
	ok( jQuery([]).add(jQuery("#form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for jQuery(form.elements) since it's ambiguous in IE
	// use jQuery([]).add(form.elements) instead.
	//equals( jQuery([]).add(jQuery("#form")[0].elements).length, jQuery(jQuery("#form")[0].elements).length, "Array in constructor must equals array in add()" );

	var divs = jQuery("<div/>").add("#sndp");
	ok( !divs[0].parentNode, "Make sure the first element is still the disconnected node." );

	divs = jQuery("<div>test</div>").add("#sndp");
	equals( divs[0].parentNode.nodeType, 11, "Make sure the first element is still the disconnected node." );

	divs = jQuery("#sndp").add("<div/>");
	ok( !divs[1].parentNode, "Make sure the first element is still the disconnected node." );

	var tmp = jQuery("<div/>");

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>").appendTo(tmp)).add(jQuery("<p id='x2'>xxx</p>").appendTo(tmp));
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>").appendTo(tmp)[0]).add(jQuery("<p id='x2'>xxx</p>").appendTo(tmp)[0]);
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>")).add(jQuery("<p id='x2'>xxx</p>"));
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var notDefined;
	equals( jQuery([]).add(notDefined).length, 0, "Check that undefined adds nothing" );

	ok( jQuery([]).add( document.getElementById('form') ).length >= 13, "Add a form (adds the elements)" );
});

test("add(String, Context)", function() {
	expect(6);

	equals( jQuery(document).add("#form").length, 2, "Make sure that using regular context document still works." );
	equals( jQuery(document.body).add("#form").length, 2, "Using a body context." );
	equals( jQuery(document.body).add("#html").length, 1, "Using a body context." );

	equals( jQuery(document).add("#form", document).length, 2, "Use a passed in document context." );
	equals( jQuery(document).add("#form", document.body).length, 2, "Use a passed in body context." );
	equals( jQuery(document).add("#html", document.body).length, 1, "Use a passed in body context." );
});
