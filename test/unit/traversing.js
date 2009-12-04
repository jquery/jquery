module("traversing");

test("end()", function() {
	expect(3);
	equals( 'Yahoo', jQuery('#yahoo').parent().end().text(), 'Check for end' );
	ok( jQuery('#yahoo').end(), 'Check for end with nothing to end' );

	var x = jQuery('#yahoo');
	x.parent();
	equals( 'Yahoo', jQuery('#yahoo').text(), 'Check for non-destructive behaviour' );
});

test("find(String)", function() {
	expect(2);
	equals( 'Yahoo', jQuery('#foo').find('.blogTest').text(), 'Check for find' );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	equals( j.find("div").length, 0, "Check node,textnode,comment to find zero divs" );
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
	expect(1);

	same( jQuery("p").filter(function() { return !jQuery("a", this).length }).get(), q("sndp", "first"), "filter(Function)" );
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
	expect(9);
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
});

test("closest(Array)", function() {
	expect(6);
	same( jQuery("body").closest(["body"]), [{selector:"body", elem:document.body}], "closest([body])" );
	same( jQuery("body").closest(["html"]), [{selector:"html", elem:document.documentElement}], "closest([html])" );
	same( jQuery("body").closest(["div"]), [], "closest([div])" );
	same( jQuery("#main").closest(["span,#html"]), [{selector:"span,#html", elem:document.documentElement}], "closest([span,#html])" );

	same( jQuery("body").closest(["body","html"]), [{selector:"body", elem:document.body}, {selector:"html", elem:document.documentElement}], "closest([body, html])" );
	same( jQuery("body").closest(["span","html"]), [{selector:"html", elem:document.documentElement}], "closest([body, html])" );
});

test("not(Selector)", function() {
	expect(7);
	equals( jQuery("#main > p#ap > a").not("#google").length, 2, "not('selector')" );
	same( jQuery("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')" );
	same( jQuery("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );
	same( jQuery("#form option").not("option.emptyopt:contains('Nothing'),[selected],[value='1']").get(), q("option1c", "option1d", "option2c", "option3d", "option3e" ), "not('complex selector')");

	same( jQuery('#ap *').not('code').get(), q("google", "groups", "anchor1", "mark"), "not('tag selector')" );
	same( jQuery('#ap *').not('code, #mark').get(), q("google", "groups", "anchor1"), "not('tag, ID selector')" );
	same( jQuery('#ap *').not('#mark, code').get(), q("google", "groups", "anchor1"), "not('ID, tag selector')");
});

test("not(Element)", function() {
	expect(1);

	var selects = jQuery("#form select");
	same( selects.not( selects[1] ).get(), q("select1", "select3"), "filter out DOM element");
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
})

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
	expect(10);
	
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

test("slice()", function() {
	expect(7);

	var $links = jQuery("#ap a");

	same( $links.slice(1,2).get(), q("groups"), "slice(1,2)" );
	same( $links.slice(1).get(), q("groups", "anchor1", "mark"), "slice(1)" );
	same( $links.slice(0,3).get(), q("google", "groups", "anchor1"), "slice(0,3)" );
	same( $links.slice(-1).get(), q("mark"), "slice(-1)" );

	same( $links.eq(1).get(), q("groups"), "eq(1)" );
	same( $links.eq('2').get(), q("anchor1"), "eq('2')" );
	same( $links.eq(-1).get(), q("mark"), "eq(-1)" );
});

test("first()/last()", function() {
	expect(4);

	var $links = jQuery("#ap a"), $none = jQuery("asdf");

	same( $links.first().get(), q("google"), "first()" );
	same( $links.last().get(), q("mark"), "last()" );

	same( $none.first().get(), [], "first() none" );
	same( $none.last().get(), [], "last() none" );
});

test("map()", function() {
	expect(2);//expect(6);

	same(
		jQuery("#ap").map(function(){
			return jQuery(this).find("a").get();
		}).get(),
		q("google", "groups", "anchor1", "mark"),
		"Array Map"
	);

	same(
		jQuery("#ap > a").map(function(){
			return this.parentNode;
		}).get(),
		q("ap","ap","ap"),
		"Single Map"
	);

	return;//these haven't been accepted yet

	//for #2616
	var keys = jQuery.map( {a:1,b:2}, function( v, k ){
		return k;
	}, [ ] );

	equals( keys.join(""), "ab", "Map the keys from a hash to an array" );

	var values = jQuery.map( {a:1,b:2}, function( v, k ){
		return v;
	}, [ ] );

	equals( values.join(""), "12", "Map the values from a hash to an array" );

	var scripts = document.getElementsByTagName("script");
	var mapped = jQuery.map( scripts, function( v, k ){
		return v;
	}, {length:0} );

	equals( mapped.length, scripts.length, "Map an array(-like) to a hash" );

	var flat = jQuery.map( Array(4), function( v, k ){
		return k % 2 ? k : [k,k,k];//try mixing array and regular returns
	});

	equals( flat.join(""), "00012223", "try the new flatten technique(#2616)" );
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
