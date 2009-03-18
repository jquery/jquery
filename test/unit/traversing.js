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

test("filter()", function() {
	expect(6);
	isSet( jQuery("#form input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	isSet( jQuery("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')" );
	isSet( jQuery("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')" );
	isSet( jQuery("p").filter(function() { return !jQuery("a", this).length }).get(), q("sndp", "first"), "filter(Function)" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	equals( j.filter("span").length, 1, "Check node,textnode,comment to filter the one span" );
	equals( j.filter("[name]").length, 0, "Check node,textnode,comment to filter the one span" );
});

test("closest()", function() {
	expect(6);
	isSet( jQuery("body").closest("body").get(), q("body"), "closest(body)" );
	isSet( jQuery("body").closest("html").get(), q("html"), "closest(html)" );
	isSet( jQuery("body").closest("div").get(), [], "closest(div)" );
	isSet( jQuery("#main").closest("span,#html").get(), q("html"), "closest(span,#html)" );

	isSet( jQuery("div:eq(1)").closest("div:first").get(), [], "closest(div:first)" );
	isSet( jQuery("div").closest("body:first div:last").get(), q("fx-tests"), "closest(body:first div:last)" );
});

test("not()", function() {
	expect(11);
	equals( jQuery("#main > p#ap > a").not("#google").length, 2, "not('selector')" );
	equals( jQuery("#main > p#ap > a").not(document.getElementById("google")).length, 2, "not(DOMElement)" );
	isSet( jQuery("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')" );
	isSet( jQuery("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );
	isSet( jQuery("p").not(jQuery("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(jQuery)" );
	equals( jQuery("p").not(document.getElementsByTagName("p")).length, 0, "not(Array-like DOM collection)" );
	isSet( jQuery("#form option").not("option.emptyopt:contains('Nothing'),[selected],[value='1']").get(), q("option1c", "option1d", "option2c", "option3d", "option3e" ), "not('complex selector')");

	var selects = jQuery("#form select");
	isSet( selects.not( selects[1] ), q("select1", "select3"), "filter out DOM element");

	isSet( jQuery('#ap *').not('code'), q("google", "groups", "anchor1", "mark"), "not('tag selector')" );
	isSet( jQuery('#ap *').not('code, #mark'), q("google", "groups", "anchor1"), "not('tag, ID selector')" );
	isSet( jQuery('#ap *').not('#mark, code'), q("google", "groups", "anchor1"), "not('ID, tag selector')"); 
});

test("andSelf()", function() {
	expect(4);
	isSet( jQuery("#en").siblings().andSelf().get(), q("sndp", "sap","en"), "Check for siblings and self" );
	isSet( jQuery("#foo").children().andSelf().get(), q("sndp", "en", "sap", "foo"), "Check for children and self" );
	isSet( jQuery("#sndp, #en").parent().andSelf().get(), q("foo","sndp","en"), "Check for parent and self" );
	isSet( jQuery("#groups").parents("p, div").andSelf().get(), q("main", "ap", "groups"), "Check for parents and self" );
});

test("siblings([String])", function() {
	expect(5);
	isSet( jQuery("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	isSet( jQuery("#sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" );
	isSet( jQuery("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
	isSet( jQuery("#foo").siblings("form, b").get(), q("form", "floatTest", "lengthtest", "name-tests", "testForm"), "Check for multiple filters" );
	var set = q("en", "sap", "sndp");
	isSet( jQuery("#en, #sndp").siblings().get(), set, "Check for unique results from siblings" );
});

test("children([String])", function() {
	expect(3);
	isSet( jQuery("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	isSet( jQuery("#foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children" );
	isSet( jQuery("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("parent([String])", function() {
	expect(5);
	equals( jQuery("#groups").parent()[0].id, "ap", "Simple parent check" );
	equals( jQuery("#groups").parent("p")[0].id, "ap", "Filtered parent check" );
	equals( jQuery("#groups").parent("div").length, 0, "Filtered parent check, no match" );
	equals( jQuery("#groups").parent("div, p")[0].id, "ap", "Check for multiple filters" );
	isSet( jQuery("#en, #sndp").parent().get(), q("foo"), "Check for unique results from parent" );
});

test("parents([String])", function() {
	expect(5);
	equals( jQuery("#groups").parents()[0].id, "ap", "Simple parents check" );
	equals( jQuery("#groups").parents("p")[0].id, "ap", "Filtered parents check" );
	equals( jQuery("#groups").parents("div")[0].id, "main", "Filtered parents check2" );
	isSet( jQuery("#groups").parents("p, div").get(), q("main", "ap"), "Check for multiple filters" );
	isSet( jQuery("#en, #sndp").parents().get(), q("foo", "main", "dl", "body", "html"), "Check for unique results from parents" );
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

test("slice()", function() {
	expect(6);
	
	var $links = jQuery("#ap a");
	
	isSet( $links.slice(1,2), q("groups"), "slice(1,2)" );
	isSet( $links.slice(1), q("groups", "anchor1", "mark"), "slice(1)" );
	isSet( $links.slice(0,3), q("google", "groups", "anchor1"), "slice(0,3)" );
	isSet( $links.slice(-1), q("mark"), "slice(-1)" );

	isSet( $links.eq(1), q("groups"), "eq(1)" );
	
	isSet( $links.eq('2'), q("anchor1"), "eq('2')" );
});

test("map()", function() {
	expect(2);//expect(6);

	isSet(
		jQuery("#ap").map(function(){
			return jQuery(this).find("a").get();
		}),
		q("google", "groups", "anchor1", "mark"),
		"Array Map"
	);

	isSet(
		jQuery("#ap > a").map(function(){
			return this.parentNode;
		}),
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