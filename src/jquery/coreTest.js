module("core");

test("Basic requirements", function() {
	expect(7);
	ok( Array.prototype.push, "Array.push()" );
	ok( Function.prototype.apply, "Function.apply()" );
	ok( document.getElementById, "getElementById" );
	ok( document.getElementsByTagName, "getElementsByTagName" );
	ok( RegExp, "RegExp" );
	ok( jQuery, "jQuery" );
	ok( $, "$()" );
});

test("$()", function() {
	var main = $("#main");
	isSet( $("div p", main).get(), q("sndp", "en", "sap"), "Basic selector with jQuery object as context" );
});

test("length", function() {
	ok( $("div").length == 2, "Get Number of Elements Found" );
});

test("size()", function() {
	ok( $("div").size() == 2, "Get Number of Elements Found" );
});

test("get()", function() {
	isSet( $("div").get(), q("main","foo"), "Get All Elements" );
});

test("get(Number)", function() {
	ok( $("div").get(0) == document.getElementById("main"), "Get A Single Element" );
});

test("add(String|Element|Array)", function() {
	isSet( $("#sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document" );
	isSet( $("#sndp").add( $("#en")[0] ).add( $("#sap") ).get(), q("sndp", "en", "sap"), "Check elements from document" );
	ok( $([]).add($("#form")[0].elements).length > 13, "Check elements from array" );
	
	var x = $([]).add($("<p id='x1'>xxx</p>")).add($("<p id='x2'>xxx</p>"));
	ok( x[0].id == "x1", "Check on-the-fly element1" );
	ok( x[1].id == "x2", "Check on-the-fly element2" );
	
	var x = $([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	ok( x[0].id == "x1", "Check on-the-fly element1" );
	ok( x[1].id == "x2", "Check on-the-fly element2" );
});

test("each(Function)", function() {
	expect(1);
	var div = $("div");
	div.each(function(){this.foo = 'zoo';});
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	  if ( div.get(i).foo != "zoo" ) pass = false;
	}
	ok( pass, "Execute a function, Relative" );
});

test("index(Object)", function() {
	expect(8);
	ok( $([window, document]).index(window) == 0, "Check for index of elements" );
	ok( $([window, document]).index(document) == 1, "Check for index of elements" );
	var inputElements = $('#radio1,#radio2,#check1,#check2');
	ok( inputElements.index(document.getElementById('radio1')) == 0, "Check for index of elements" );
	ok( inputElements.index(document.getElementById('radio2')) == 1, "Check for index of elements" );
	ok( inputElements.index(document.getElementById('check1')) == 2, "Check for index of elements" );
	ok( inputElements.index(document.getElementById('check2')) == 3, "Check for index of elements" );
	ok( inputElements.index(window) == -1, "Check for not found index" );
	ok( inputElements.index(document) == -1, "Check for not found index" );
});

test("attr(String)", function() {
	expect(12);
	ok( $('#text1').attr('value') == "Test", 'Check for value attribute' );
	ok( $('#text1').attr('type') == "text", 'Check for type attribute' );
	ok( $('#radio1').attr('type') == "radio", 'Check for type attribute' );
	ok( $('#check1').attr('type') == "checkbox", 'Check for type attribute' );
	ok( $('#simon1').attr('rel') == "bookmark", 'Check for rel attribute' );
	ok( $('#google').attr('title') == "Google!", 'Check for title attribute' );
	ok( $('#mark').attr('hreflang') == "en", 'Check for hreflang attribute' );
	ok( $('#en').attr('lang') == "en", 'Check for lang attribute' );
	ok( $('#simon').attr('class') == "blog link", 'Check for class attribute' );
	ok( $('#name').attr('name') == "name", 'Check for name attribute' );
	ok( $('#text1').attr('name') == "action", 'Check for name attribute' );
	ok( $('#form').attr('action').indexOf("formaction") >= 0, 'Check for action attribute' );
});

test("attr(String, Function)", function() {
	expect(2);
	ok( $('#text1').attr('value', function() { return this.id })[0].value == "text1", "Set value from id" );
	ok( $('#text1').attr('title', function(i) { return i }).attr('title') == "0", "Set value with an index");
});

test("attr(Hash)", function() {
	expect(1);
	var pass = true;
	$("div").attr({foo: 'baz', zoo: 'ping'}).each(function(){
	  if ( this.getAttribute('foo') != "baz" && this.getAttribute('zoo') != "ping" ) pass = false;
	});
	ok( pass, "Set Multiple Attributes" );
});

test("attr(String, Object)", function() {
	expect(6);
	var div = $("div");
	div.attr("foo", "bar");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	  if ( div.get(i).getAttribute('foo') != "bar" ) pass = false;
	}
	ok( pass, "Set Attribute" );
	
	$("#name").attr('name', 'something');
	ok( $("#name").attr('name') == 'something', 'Set name attribute' );
	$("#check2").attr('checked', true);
	ok( document.getElementById('check2').checked == true, 'Set checked attribute' );
	$("#check2").attr('checked', false);
	ok( document.getElementById('check2').checked == false, 'Set checked attribute' );
	$("#text1").attr('readonly', true);
	ok( document.getElementById('text1').readOnly == true, 'Set readonly attribute' );
	$("#text1").attr('readonly', false);
	ok( document.getElementById('text1').readOnly == false, 'Set readonly attribute' );
});

if ( location.protocol != "file:" ) {
	test("attr(String, Object)x", function() {
		expect(2);
		stop();
		$.get('data/dashboard.xml', function(xml) { 
	  	var titles = [];
	  	$('tab', xml).each(function() {
	    	titles.push($(this).attr('title'));
	  	});
	  	ok( titles[0] == 'Location', 'attr() in XML context: Check first title' );
	  	ok( titles[1] == 'Users', 'attr() in XML context: Check second title' );
	  	start();
		});
	});
}

test("css(String|Hash)", function() {
	expect(8);
	
	ok( $('#main').css("display") == 'none', 'Check for css property "display"');
	
	ok( $('#foo').is(':visible'), 'Modifying CSS display: Assert element is visible');
	$('#foo').css({display: 'none'});
	ok( !$('#foo').is(':visible'), 'Modified CSS display: Assert element is hidden');
	$('#foo').css({display: 'block'});
	ok( $('#foo').is(':visible'), 'Modified CSS display: Assert element is visible');
	
	$('#floatTest').css({styleFloat: 'right'});
	ok( $('#floatTest').css('styleFloat') == 'right', 'Modified CSS float using "styleFloat": Assert float is right');
	$('#floatTest').css({cssFloat: 'left'});
	ok( $('#floatTest').css('cssFloat') == 'left', 'Modified CSS float using "cssFloat": Assert float is left');
	$('#floatTest').css({'float': 'right'});
	ok( $('#floatTest').css('float') == 'right', 'Modified CSS float using "float": Assert float is right');
	$('#floatTest').css({'font-size': '30px'});
	ok( $('#floatTest').css('font-size') == '30px', 'Modified CSS font-size: Assert font-size is 30px');
});

test("css(String, Object)", function() {
	expect(7);
	ok( $('#foo').is(':visible'), 'Modifying CSS display: Assert element is visible');
	$('#foo').css('display', 'none');
	ok( !$('#foo').is(':visible'), 'Modified CSS display: Assert element is hidden');
	$('#foo').css('display', 'block');
	ok( $('#foo').is(':visible'), 'Modified CSS display: Assert element is visible');
	
	$('#floatTest').css('styleFloat', 'left');
	ok( $('#floatTest').css('styleFloat') == 'left', 'Modified CSS float using "styleFloat": Assert float is left');
	$('#floatTest').css('cssFloat', 'right');
	ok( $('#floatTest').css('cssFloat') == 'right', 'Modified CSS float using "cssFloat": Assert float is right');
	$('#floatTest').css('float', 'left');
	ok( $('#floatTest').css('float') == 'left', 'Modified CSS float using "float": Assert float is left');
	$('#floatTest').css('font-size', '20px');
	ok( $('#floatTest').css('font-size') == '20px', 'Modified CSS font-size: Assert font-size is 20px');
});

test("text()", function() {
	var expected = "This link has class=\"blog\": Simon Willison's Weblog";
	ok( $('#sap').text() == expected, 'Check for merged text of more then one element.' );
});

test("wrap(String|Element)", function() {
	expect(4);
	var defaultText = 'Try them out:'
	var result = $('#first').wrap('<div class="red"><span></span></div>').text();
	ok( defaultText == result, 'Check for wrapping of on-the-fly html' );
	ok( $('#first').parent().parent().is('.red'), 'Check if wrapper has class "red"' );

	reset();
	var defaultText = 'Try them out:'
	var result = $('#first').wrap(document.getElementById('empty')).parent();
	ok( result.is('ol'), 'Check for element wrapping' );
	ok( result.text() == defaultText, 'Check for element wrapping' );
});

test("append(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(9);
	var defaultText = 'Try them out:'
	var result = $('#first').append('<b>buga</b>');
	ok( result.text() == defaultText + 'buga', 'Check if text appending works' );
	ok( $('#select3').append('<option value="appendTest">Append Test</option>').find('option:last-child').attr('value') == 'appendTest', 'Appending html options to select element');
	
	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	$('#sap').append(document.getElementById('first'));
	ok( expected == $('#sap').text(), "Check for appending of element" );
	
	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$('#sap').append([document.getElementById('first'), document.getElementById('yahoo')]);
	ok( expected == $('#sap').text(), "Check for appending of array of elements" );
	
	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$('#sap').append($("#first, #yahoo"));
	ok( expected == $('#sap').text(), "Check for appending of jQuery object" );

	reset();
	$("#sap").append( 5 );
	ok( $("#sap")[0].innerHTML.match( /5$/ ), "Check for appending a number" );

	reset();
	ok( $("#sap").append([]), "Check for appending an empty array." );
	ok( $("#sap").append(""), "Check for appending an empty string." );
	ok( $("#sap").append(document.getElementsByTagName("foo")), "Check for appending an empty nodelist." );
});

test("appendTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(5);
	var defaultText = 'Try them out:'
	$('<b>buga</b>').appendTo('#first');
	ok( $("#first").text() == defaultText + 'buga', 'Check if text appending works' );
	ok( $('<option value="appendTest">Append Test</option>').appendTo('#select3').parent().find('option:last-child').attr('value') == 'appendTest', 'Appending html options to select element');
	
	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	$(document.getElementById('first')).appendTo('#sap');
	ok( expected == $('#sap').text(), "Check for appending of element" );
	
	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$([document.getElementById('first'), document.getElementById('yahoo')]).appendTo('#sap');
	ok( expected == $('#sap').text(), "Check for appending of array of elements" );
	
	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$("#first, #yahoo").appendTo('#sap');
	ok( expected == $('#sap').text(), "Check for appending of jQuery object" );
});

test("prepend(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(5);
	var defaultText = 'Try them out:'
	var result = $('#first').prepend('<b>buga</b>');
	ok( result.text() == 'buga' + defaultText, 'Check if text prepending works' );
	ok( $('#select3').prepend('<option value="prependTest">Prepend Test</option>').find('option:first-child').attr('value') == 'prependTest', 'Prepending html options to select element');
	
	reset();
	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	$('#sap').prepend(document.getElementById('first'));
	ok( expected == $('#sap').text(), "Check for prepending of element" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$('#sap').prepend([document.getElementById('first'), document.getElementById('yahoo')]);
	ok( expected == $('#sap').text(), "Check for prepending of array of elements" );
	
	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$('#sap').prepend($("#first, #yahoo"));
	ok( expected == $('#sap').text(), "Check for prepending of jQuery object" );
});

test("prependTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(5);
	var defaultText = 'Try them out:'
	$('<b>buga</b>').prependTo('#first');
	ok( $('#first').text() == 'buga' + defaultText, 'Check if text prepending works' );
	ok( $('<option value="prependTest">Prepend Test</option>').prependTo('#select3').parent().find('option:first-child').attr('value') == 'prependTest', 'Prepending html options to select element');
	
	reset();
	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	$(document.getElementById('first')).prependTo('#sap');
	ok( expected == $('#sap').text(), "Check for prepending of element" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$([document.getElementById('yahoo'), document.getElementById('first')]).prependTo('#sap');
	ok( expected == $('#sap').text(), "Check for prepending of array of elements" );
	
	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$("#yahoo, #first").prependTo('#sap');
	ok( expected == $('#sap').text(), "Check for prepending of jQuery object" );
});

test("before(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: bugaYahoo';
	$('#yahoo').before('<b>buga</b>');
	ok( expected == $('#en').text(), 'Insert String before' );
	
	reset();
	expected = "This is a normal link: Try them out:Yahoo";
	$('#yahoo').before(document.getElementById('first'));
	ok( expected == $('#en').text(), "Insert element before" );
	
	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$('#yahoo').before([document.getElementById('first'), document.getElementById('mark')]);
	ok( expected == $('#en').text(), "Insert array of elements before" );
	
	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$('#yahoo').before($("#first, #mark"));
	ok( expected == $('#en').text(), "Insert jQuery before" );
});

test("insertBefore(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: bugaYahoo';
	$('<b>buga</b>').insertBefore('#yahoo');
	ok( expected == $('#en').text(), 'Insert String before' );
	
	reset();
	expected = "This is a normal link: Try them out:Yahoo";
	$(document.getElementById('first')).insertBefore('#yahoo');
	ok( expected == $('#en').text(), "Insert element before" );
	
	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$([document.getElementById('first'), document.getElementById('mark')]).insertBefore('#yahoo');
	ok( expected == $('#en').text(), "Insert array of elements before" );
	
	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$("#first, #mark").insertBefore('#yahoo');
	ok( expected == $('#en').text(), "Insert jQuery before" );
});

test("after(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: Yahoobuga';
	$('#yahoo').after('<b>buga</b>');
	ok( expected == $('#en').text(), 'Insert String after' );
	
	reset();
	expected = "This is a normal link: YahooTry them out:";
	$('#yahoo').after(document.getElementById('first'));
	ok( expected == $('#en').text(), "Insert element after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$('#yahoo').after([document.getElementById('first'), document.getElementById('mark')]);
	ok( expected == $('#en').text(), "Insert array of elements after" );
	
	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$('#yahoo').after($("#first, #mark"));
	ok( expected == $('#en').text(), "Insert jQuery after" );
});

test("insertAfter(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: Yahoobuga';
	$('<b>buga</b>').insertAfter('#yahoo');
	ok( expected == $('#en').text(), 'Insert String after' );
	
	reset();
	expected = "This is a normal link: YahooTry them out:";
	$(document.getElementById('first')).insertAfter('#yahoo');
	ok( expected == $('#en').text(), "Insert element after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$([document.getElementById('mark'), document.getElementById('first')]).insertAfter('#yahoo');
	ok( expected == $('#en').text(), "Insert array of elements after" );
	
	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$("#mark, #first").insertAfter('#yahoo');
	ok( expected == $('#en').text(), "Insert jQuery after" );
});

test("end()", function() {
	expect(3);
	ok( 'Yahoo' == $('#yahoo').parent().end().text(), 'Check for end' );
	ok( $('#yahoo').end(), 'Check for end with nothing to end' );
	
	var x = $('#yahoo');
	x.parent();
	ok( 'Yahoo' == $('#yahoo').text(), 'Check for non-destructive behaviour' );
});

test("find(String)", function() {
	ok( 'Yahoo' == $('#foo').find('.blogTest').text(), 'Check for find' );
});

test("clone()", function() {
	expect(3);
	ok( 'This is a normal link: Yahoo' == $('#en').text(), 'Assert text for #en' );
	var clone = $('#yahoo').clone();
	ok( 'Try them out:Yahoo' == $('#first').append(clone).text(), 'Check for clone' );
	ok( 'This is a normal link: Yahoo' == $('#en').text(), 'Reassert text for #en' );
});

test("is(String)", function() {
	expect(22);
	ok( $('#form').is('form'), 'Check for element: A form must be a form' );
	ok( !$('#form').is('div'), 'Check for element: A form is not a div' );
	ok( $('#mark').is('.blog'), 'Check for class: Expected class "blog"' );
	ok( !$('#mark').is('.link'), 'Check for class: Did not expect class "link"' );
	ok( $('#simon').is('.blog.link'), 'Check for multiple classes: Expected classes "blog" and "link"' );
	ok( !$('#simon').is('.blogTest'), 'Check for multiple classes: Expected classes "blog" and "link", but not "blogTest"' );
	ok( $('#en').is('[@lang="en"]'), 'Check for attribute: Expected attribute lang to be "en"' );
	ok( !$('#en').is('[@lang="de"]'), 'Check for attribute: Expected attribute lang to be "en", not "de"' );
	ok( $('#text1').is('[@type="text"]'), 'Check for attribute: Expected attribute type to be "text"' );
	ok( !$('#text1').is('[@type="radio"]'), 'Check for attribute: Expected attribute type to be "text", not "radio"' );
	ok( $('#text2').is(':disabled'), 'Check for pseudoclass: Expected to be disabled' );
	ok( !$('#text1').is(':disabled'), 'Check for pseudoclass: Expected not disabled' );
	ok( $('#radio2').is(':checked'), 'Check for pseudoclass: Expected to be checked' );
	ok( !$('#radio1').is(':checked'), 'Check for pseudoclass: Expected not checked' );
	ok( $('#foo').is('[p]'), 'Check for child: Expected a child "p" element' );
	ok( !$('#foo').is('[ul]'), 'Check for child: Did not expect "ul" element' );
	ok( $('#foo').is('[p][a][code]'), 'Check for childs: Expected "p", "a" and "code" child elements' );
	ok( !$('#foo').is('[p][a][code][ol]'), 'Check for childs: Expected "p", "a" and "code" child elements, but no "ol"' );
	ok( !$('#foo').is(0), 'Expected false for an invalid expression - 0' );
	ok( !$('#foo').is(null), 'Expected false for an invalid expression - null' );
	ok( !$('#foo').is(''), 'Expected false for an invalid expression - ""' );
	ok( !$('#foo').is(undefined), 'Expected false for an invalid expression - undefined' );
});

test("$.extend(Object, Object)", function() {
	expect(2);
	var settings = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options =     { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		optionsCopy = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		merged = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "x", xxx: "newstring" };
	jQuery.extend(settings, options);
	isSet( settings, merged, "Check if extended: settings must be extended" );
	isSet ( options, optionsCopy, "Check if not modified: options must not be modified" );
});

test("$.extend(Object, Object, Object, Object)", function() {
	expect(4);
	var defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options1 =     { xnumber2: 1, xstring2: "x" },
		options1Copy = { xnumber2: 1, xstring2: "x" },
		options2 =     { xstring2: "xx", xxx: "newstringx" },
		options2Copy = { xstring2: "xx", xxx: "newstringx" },
		merged = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };
	var settings = jQuery.extend({}, defaults, options1, options2);
	isSet( settings, merged, "Check if extended: settings must be extended" );
	isSet ( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	isSet ( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	isSet ( options2, options2Copy, "Check if not modified: options2 must not be modified" );
});

test("val()", function() {
	expect(2);
	ok( $("#text1").val() == "Test", "Check for value of input element" );
	ok( !$("#text1").val() == "", "Check for value of input element" );
});

test("val(String)", function() {
	expect(2);
	document.getElementById('text1').value = "bla";
	ok( $("#text1").val() == "bla", "Check for modified value of input element" );
	$("#text1").val('test');
	ok ( document.getElementById('text1').value == "test", "Check for modified (via val(String)) value of input element" );
});

test("html(String)", function() {
	expect(1);
	var div = $("div");
	div.html("<b>test</b>");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	  if ( div.get(i).childNodes.length == 0 ) pass = false;
	}
	ok( pass, "Set HTML" );
});

test("filter()", function() {
	expect(4);
	isSet( $("input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	isSet( $("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')" );
	isSet( $("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')" );
	isSet( $("p").filter(function() { return !$("a", this).length }).get(), q("sndp", "first"), "filter(Function)" );
});

test("not()", function() {
	expect(3);
	ok( $("#main > p#ap > a").not("#google").length == 2, "not('selector')" );
	isSet( $("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );
	isSet( $("p").not($("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(jQuery)" );
});


test("siblings([String])", function() {
	expect(4);
	isSet( $("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	isSet( $("#sndp").siblings("[code]").get(), q("sap"), "Check for filtered siblings (has code child element)" ); 
	isSet( $("#sndp").siblings("[a]").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
	isSet( $("#foo").siblings("form, b").get(), q("form", "floatTest"), "Check for multiple filters" );
});

test("children([String])", function() {
	expect(3);
	isSet( $("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	isSet( $("#foo").children("[code]").get(), q("sndp", "sap"), "Check for filtered children" );
	isSet( $("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("parent[s]([String])", function() {
	expect(8);
	ok( $("#groups").parent()[0].id == "ap", "Simple parent check" );
	ok( $("#groups").parent("p")[0].id == "ap", "Filtered parent check" );
	ok( $("#groups").parent("div").length == 0, "Filtered parent check, no match" );
	ok( $("#groups").parent("div, p")[0].id == "ap", "Check for multiple filters" );
	
	ok( $("#groups").parents()[0].id == "ap", "Simple parents check" );
	ok( $("#groups").parents("p")[0].id == "ap", "Filtered parents check" );
	ok( $("#groups").parents("div")[0].id == "main", "Filtered parents check2" );
	isSet( $("#groups").parents("p, div").get(), q("ap", "main"), "Check for multiple filters" );
});

test("next/prev([String])", function() {
	expect(8);
	ok( $("#ap").next()[0].id == "foo", "Simple next check" );
	ok( $("#ap").next("div")[0].id == "foo", "Filtered next check" );
	ok( $("#ap").next("p").length == 0, "Filtered next check, no match" );
	ok( $("#ap").next("div, p")[0].id == "foo", "Multiple filters" );
	
	ok( $("#foo").prev()[0].id == "ap", "Simple prev check" );
	ok( $("#foo").prev("p")[0].id == "ap", "Filtered prev check" );
	ok( $("#foo").prev("div").length == 0, "Filtered prev check, no match" );
	ok( $("#foo").prev("p, div")[0].id == "ap", "Multiple filters" );
});

test("show()", function() {
	expect(1);
	var pass = true, div = $("div");
	div.show().each(function(){
	  if ( this.style.display == "none" ) pass = false;
	});
	ok( pass, "Show" );
});

test("addClass(String)", function() {
	var div = $("div");
	div.addClass("test");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	 if ( div.get(i).className.indexOf("test") == -1 ) pass = false;
	}
	ok( pass, "Add Class" );
});

test("removeClass(String) - simple", function() {
	expect(1);
	var div = $("div").addClass("test").removeClass("test"),
		pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).className.indexOf("test") != -1 ) pass = false;
	}
	ok( pass, "Remove Class" );
});

test("removeClass(String) - add three classes and remove again", function() {
	expect(1);
	var div = $("div").addClass("test").addClass("foo").addClass("bar");
	div.removeClass("test").removeClass("bar").removeClass("foo");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	 if ( div.get(i).className.match(/test|bar|foo/) ) pass = false;
	}
	ok( pass, "Remove multiple classes" );
});

test("toggleClass(String)", function() {
	expect(3);
	var e = $("#firstp");
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass("test");
	ok( e.is(".test"), "Assert class present" ); 
	e.toggleClass("test");
	ok( !e.is(".test"), "Assert class not present" );
});

test("removeAttr(String", function() {
	ok( $('#mark').removeAttr("class")[0].className == "", "remove class" );
});

test("text(String)", function() {
	expect(1);
	ok( $("#foo").text("<div><b>Hello</b> cruel world!</div>")[0].innerHTML == "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );
});

test("$.each(Object,Function)", function() {
	expect(8);
	$.each( [0,1,2], function(i, n){
		ok( i == n, "Check array iteration" );
	});
	
	$.each( [5,6,7], function(i, n){
		ok( i == n - 5, "Check array iteration" );
	});
	 
	$.each( { name: "name", lang: "lang" }, function(i, n){
		ok( i == n, "Check object iteration" );
	});
});

test("$.prop", function() {
	expect(2);
	var handle = function() { return this.id };
	ok( $.prop($("#ap")[0], handle) == "ap", "Check with Function argument" );
	ok( $.prop($("#ap")[0], "value") == "value", "Check with value argument" );
});

test("$.className", function() {
	expect(6);
	var x = $("<p>Hi</p>")[0];
	var c = $.className;
	c.add(x, "hi");
	ok( x.className == "hi", "Check single added class" );
	c.add(x, "foo bar");
	ok( x.className == "hi foo bar", "Check more added classes" );
	c.remove(x);
	ok( x.className == "", "Remove all classes" );
	c.add(x, "hi foo bar");
	c.remove(x, "foo");
	ok( x.className == "hi bar", "Check removal of one class" );
	ok( c.has(x, "hi"), "Check has1" );
	ok( c.has(x, "bar"), "Check has2" );
});

test("remove()", function() {
	$("#ap").children().remove();
	ok( $("#ap").text().length > 10, "Check text is not removed" );
	ok( $("#ap").children().length == 0, "Check remove" );
	
	reset();
	$("#ap").children().remove("a");
	ok( $("#ap").text().length > 10, "Check text is not removed" );
	ok( $("#ap").children().length == 1, "Check filtered remove" );
});

test("empty()", function() {
	ok( $("#ap").children().empty().text().length == 0, "Check text is removed" );
	ok( $("#ap").children().length == 4, "Check elements are not removed" );
});

test("eq(), gt(), lt(), contains()", function() {
	ok( $("#ap a").eq(1)[0].id == "groups", "eq()" );
	isSet( $("#ap a").gt(0).get(), q("groups", "anchor1", "mark"), "gt()" );
	isSet( $("#ap a").lt(3).get(), q("google", "groups", "anchor1"), "lt()" );
	isSet( $("#foo a").contains("log").get(), q("anchor2", "simon"), "contains()" );
});
