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
	ok( $("#name").name() == 'something', 'Set name attribute' );
	$("#check2").attr('checked', true);
	ok( document.getElementById('check2').checked == true, 'Set checked attribute' );
	$("#check2").attr('checked', false);
	ok( document.getElementById('check2').checked == false, 'Set checked attribute' );
	$("#text1").attr('readonly', true);
	ok( document.getElementById('text1').readOnly == true, 'Set readonly attribute' );
	$("#text1").attr('readonly', false);
	ok( document.getElementById('text1').readOnly == false, 'Set readonly attribute' );
});

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
	expect(5);
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

test("end()", function() {
	expect(2);
	ok( 'Yahoo' == $('#yahoo').parent().end().text(), 'Check for end' );
	ok( $('#yahoo').end(), 'Check for end with nothing to end' );
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

test("filter()", function() {
	isSet( $("input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	isSet( $("p").filter(["#ap", "#sndp"]).get(), q("ap", "sndp"), "filter(Array&lt;String&gt;)" );
	isSet( $("p").filter(function(el) { return !$("a", el).length }).get(), q("sndp", "first"), "filter(Function)" );
});

test("not(String)", function() {
	ok($("#main > p#ap > a").not("#google").length == 2, "not('selector')")
	// TODO: Comma-based selector
	//isSet( $("p").not("#ap, #sndp").get(), q("firstp", "en", "sap", "first", "result"), "not('selector, selector')" );
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

test("id()", function() {
	expect(3);
	ok( $(document.getElementById('main')).id() == "main", "Check for id" );
	ok( $("#foo").id() == "foo", "Check for id" );
	ok( !$("head").id(), "Check for id" );
});

test("title()", function() {
	expect(2);
	ok( $(document.getElementById('google')).title() == "Google!", "Check for title" );
	ok( !$("#yahoo").title(), "Check for title" );
});

test("name()", function() {
	expect(3);
	ok( $(document.getElementById('text1')).name() == "action", "Check for name" );
	ok( $("#hidden1").name() == "hidden", "Check for name" );
	ok( !$("#area1").name(), "Check for name" );
});


test("siblings([String])", function() {
	expect(3);
	isSet( $("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	isSet( $("#sndp").siblings("[code]").get(), q("sap"), "Check for filtered siblings (has code child element)" ); 
	isSet( $("#sndp").siblings("[a]").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
});

test("children([String])", function() {
	expect(2);
	isSet( $("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	isSet( $("#foo").children("[code]").get(), q("sndp", "sap"), "Check for filtered children" );
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

test("removeAttr(String", function() {
	ok( $('#mark').removeAttr("class")[0].className == "", "remove class" );
});

