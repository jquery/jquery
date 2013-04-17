module( "manipulation", {
	teardown: moduleTeardown
});

// Ensure that an extended Array prototype doesn't break jQuery
Array.prototype.arrayProtoFn = function() {
	throw("arrayProtoFn should not be called");
};

function manipulationBareObj( value ) {
	return value;
}

function manipulationFunctionReturningObj( value ) {
	return function() {
		return value;
	};
}

/*
	======== local reference =======
	manipulationBareObj and manipulationFunctionReturningObj can be used to test passing functions to setters
	See testVal below for an example

	bareObj( value );
		This function returns whatever value is passed in

	functionReturningObj( value );
		Returns a function that returns the value
*/

test( "text()", function() {

	expect( 5 );

	var expected, frag, $newLineTest;

	expected = "This link has class=\"blog\": Simon Willison's Weblog";
	equal( jQuery("#sap").text(), expected, "Check for merged text of more then one element." );

	// Check serialization of text values
	equal( jQuery(document.createTextNode("foo")).text(), "foo", "Text node was retrieved from .text()." );
	notEqual( jQuery(document).text(), "", "Retrieving text for the document retrieves all text (#10724)." );

	// Retrieve from document fragments #10864
	frag = document.createDocumentFragment();
	frag.appendChild( document.createTextNode("foo") );

	equal( jQuery(frag).text(), "foo", "Document Fragment Text node was retrieved from .text()." );

	$newLineTest = jQuery("<div>test<br/>testy</div>").appendTo("#moretests");
	$newLineTest.find("br").replaceWith("\n");
	equal( $newLineTest.text(), "test\ntesty", "text() does not remove new lines (#11153)" );

	$newLineTest.remove();
});

test( "text(undefined)", function() {

	expect( 1 );

	equal( jQuery("#foo").text("<div").text(undefined)[ 0 ].innerHTML, "&lt;div", ".text(undefined) is chainable (#5571)" );
});

function testText( valueObj ) {

	expect( 4 );

	var val, j;

	val = valueObj("<div><b>Hello</b> cruel world!</div>");
	equal( jQuery("#foo").text(val)[ 0 ].innerHTML.replace(/>/g, "&gt;"), "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );

	// using contents will get comments regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();
	j.text( valueObj("hi!") );
	equal( jQuery( j[ 0 ] ).text(), "hi!", "Check node,textnode,comment with text()" );
	equal( j[ 1 ].nodeValue, " there ", "Check node,textnode,comment with text()" );

	// Blackberry 4.6 doesn't maintain comments in the DOM
	equal( jQuery("#nonnodes")[ 0 ].childNodes.length < 3 ? 8 : j[ 2 ].nodeType, 8, "Check node,textnode,comment with text()" );
}

test( "text(String)", function() {
	testText( manipulationBareObj );
});

test( "text(Function)", function() {
	testText( manipulationFunctionReturningObj );
});

test( "text(Function) with incoming value", function() {

	expect( 2 );

	var old = "This link has class=\"blog\": Simon Willison's Weblog";

	jQuery("#sap").text(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "foobar";
	});

	equal( jQuery("#sap").text(), "foobar", "Check for merged text of more then one element." );
});

function testAppendForObject( valueObj, isFragment ) {
	var $base,
		type = isFragment ? " (DocumentFragment)" : " (Element)",
		text = "This link has class=\"blog\": Simon Willison's Weblog",
		el = document.getElementById("sap").cloneNode( true ),
		first = document.getElementById("first"),
		yahoo = document.getElementById("yahoo");

	if ( isFragment ) {
		$base = document.createDocumentFragment();
		jQuery( el ).contents().each(function() {
			$base.appendChild( this );
		});
		$base = jQuery( $base );
	} else {
		$base = jQuery( el );
	}

	equal( $base.clone().append( valueObj(first.cloneNode(true)) ).text(),
		text + "Try them out:",
		"Check for appending of element" + type
	);

	equal( $base.clone().append( valueObj([ first.cloneNode(true), yahoo.cloneNode(true) ]) ).text(),
		text + "Try them out:Yahoo",
		"Check for appending of array of elements" + type
	);

	equal( $base.clone().append( valueObj(jQuery("#yahoo, #first").clone()) ).text(),
		text + "YahooTry them out:",
		"Check for appending of jQuery object" + type
	);

	equal( $base.clone().append( valueObj( 5 ) ).text(),
		text + "5",
		"Check for appending a number" + type
	);

	equal( $base.clone().append( valueObj([ jQuery("#first").clone(), jQuery("#yahoo, #google").clone() ]) ).text(),
		text + "Try them out:GoogleYahoo",
		"Check for appending of array of jQuery objects"
	);

	equal( $base.clone().append( valueObj(" text with spaces ") ).text(),
		text + " text with spaces ",
		"Check for appending text with spaces" + type
	);

	equal( $base.clone().append( valueObj([]) ).text(),
		text,
		"Check for appending an empty array" + type
	);

	equal( $base.clone().append( valueObj("") ).text(),
		text,
		"Check for appending an empty string" + type
	);

	equal( $base.clone().append( valueObj(document.getElementsByTagName("foo")) ).text(),
		text,
		"Check for appending an empty nodelist" + type
	);

	equal( $base.clone().append( "<span></span>", "<span></span>", "<span></span>" ).children().length,
		$base.children().length + 3,
		"Make sure that multiple arguments works." + type
	);

	equal( $base.clone().append( valueObj(document.getElementById("form").cloneNode(true)) ).children("form").length,
		1,
		"Check for appending a form (#910)" + type
	);
}

function testAppend( valueObj ) {

	expect( 78 );

	testAppendForObject( valueObj, false );
	testAppendForObject( valueObj, true );

	var defaultText, result, message, iframe, iframeDoc, j, d,
		$input, $radioChecked, $radioUnchecked, $radioParent, $map, $table;

	defaultText = "Try them out:";
	result = jQuery("#first").append( valueObj("<b>buga</b>") );

	equal( result.text(), defaultText + "buga", "Check if text appending works" );
	equal( jQuery("#select3").append( valueObj("<option value='appendTest'>Append Test</option>") ).find("option:last-child").attr("value"), "appendTest", "Appending html options to select element" );

	jQuery("form").append( valueObj("<input name='radiotest' type='radio' checked='checked' />") );
	jQuery("form input[name=radiotest]").each(function() {
		ok( jQuery(this).is(":checked"), "Append checked radio" );
	}).remove();

	jQuery("form").append( valueObj("<input name='radiotest2' type='radio' checked    =   'checked' />") );
	jQuery("form input[name=radiotest2]").each(function() {
		ok( jQuery(this).is(":checked"), "Append alternately formated checked radio" );
	}).remove();

	jQuery("form").append( valueObj("<input name='radiotest3' type='radio' checked />") );
	jQuery("form input[name=radiotest3]").each(function() {
		ok( jQuery(this).is(":checked"), "Append HTML5-formated checked radio" );
	}).remove();

	jQuery("form").append( valueObj("<input type='radio' checked='checked' name='radiotest4' />") );
	jQuery("form input[name=radiotest4]").each(function() {
		ok( jQuery(this).is(":checked"), "Append with name attribute after checked attribute" );
	}).remove();

	message = "Test for appending a DOM node to the contents of an iframe";
	iframe = jQuery("#iframe")[ 0 ];
	iframeDoc = iframe.contentDocument || iframe.contentWindow && iframe.contentWindow.document;

	try {
		if ( iframeDoc && iframeDoc.body ) {
			equal( jQuery(iframeDoc.body).append( valueObj("<div id='success'>test</div>") )[ 0 ].lastChild.id, "success", message );
		} else {
			ok( true, message + " - can't test" );
		}
	} catch( e ) {
		strictEqual( e.message || e, undefined, message );
	}

	jQuery("<fieldset/>").appendTo("#form").append( valueObj("<legend id='legend'>test</legend>") );
	t( "Append legend", "#legend", [ "legend" ] );

	$map = jQuery("<map/>").append( valueObj("<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.jquery.com/' alt='jQuery'>") );

	equal( $map[ 0 ].childNodes.length, 1, "The area was inserted." );
	equal( $map[ 0 ].firstChild.nodeName.toLowerCase(), "area", "The area was inserted." );

	jQuery("#select1").append( valueObj("<OPTION>Test</OPTION>") );
	equal( jQuery("#select1 option:last-child").text(), "Test", "Appending OPTION (all caps)" );

	jQuery("#select1").append( valueObj("<optgroup label='optgroup'><option>optgroup</option></optgroup>") );
	equal( jQuery("#select1 optgroup").attr("label"), "optgroup", "Label attribute in newly inserted optgroup is correct" );
	equal( jQuery("#select1 option").last().text(), "optgroup", "Appending optgroup" );

	$table = jQuery("#table");

	jQuery.each( "thead tbody tfoot colgroup caption tr th td".split(" "), function( i, name ) {
		$table.append( valueObj( "<" + name + "/>" ) );
		equal( $table.find( name ).length, 1, "Append " + name );
		ok( jQuery.parseHTML( "<" + name + "/>" ).length, name + " wrapped correctly" );
	});

	jQuery("#table colgroup").append( valueObj("<col/>") );
	equal( jQuery("#table colgroup col").length, 1, "Append col" );

	jQuery("#form")
		.append( valueObj("<select id='appendSelect1'></select>") )
		.append( valueObj("<select id='appendSelect2'><option>Test</option></select>") );
	t( "Append Select", "#appendSelect1, #appendSelect2", [ "appendSelect1", "appendSelect2" ] );

	equal( "Two nodes", jQuery("<div />").append( "Two", " nodes" ).text(), "Appending two text nodes (#4011)" );
	equal( jQuery("<div />").append( "1", "", 3 ).text(), "13", "If median is false-like value, subsequent arguments should not be ignored" );

	// using contents will get comments regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();
	d = jQuery("<div/>").appendTo("#nonnodes").append( j );

	equal( jQuery("#nonnodes").length, 1, "Check node,textnode,comment append moved leaving just the div" );
	equal( d.contents().length, 3, "Check node,textnode,comment append works" );
	d.contents().appendTo("#nonnodes");
	d.remove();
	equal( jQuery("#nonnodes").contents().length, 3, "Check node,textnode,comment append cleanup worked" );

	$input = jQuery("<input type='checkbox'/>").prop( "checked", true ).appendTo("#testForm");
	equal( $input[ 0 ].checked, true, "A checked checkbox that is appended stays checked" );

	$radioChecked = jQuery("input[type='radio'][name='R1']").eq( 1 );
	$radioParent = $radioChecked.parent();
	$radioUnchecked = jQuery("<input type='radio' name='R1' checked='checked'/>").appendTo( $radioParent );
	$radioChecked.trigger("click");
	$radioUnchecked[ 0 ].checked = false;

	jQuery("<div/>").insertBefore($radioParent).append($radioParent);

	equal( $radioChecked[ 0 ].checked, true, "Reappending radios uphold which radio is checked" );
	equal( $radioUnchecked[ 0 ].checked, false, "Reappending radios uphold not being checked" );

	equal( jQuery("<div/>").append( valueObj("option<area/>") )[ 0 ].childNodes.length, 2, "HTML-string with leading text should be processed correctly" );
}

test( "append(String|Element|Array<Element>|jQuery)", function() {
	testAppend( manipulationBareObj );
});

test( "append(Function)", function() {
	testAppend( manipulationFunctionReturningObj );
});

test( "append(param) to object, see #11280", function() {

	expect( 5 );

	var object = jQuery( document.createElement("object") ).appendTo( document.body );

	equal( object.children().length, 0, "object does not start with children" );

	object.append( jQuery("<param type='wmode' name='foo'>") );
	equal( object.children().length, 1, "appended param" );
	equal( object.children().eq(0).attr("name"), "foo", "param has name=foo" );

	object = jQuery("<object><param type='baz' name='bar'></object>");
	equal( object.children().length, 1, "object created with child param" );
	equal( object.children().eq(0).attr("name"), "bar", "param has name=bar" );
});

test( "append(Function) with incoming value", function() {

	expect( 12 );

	var defaultText, result, select, old, expected;

	defaultText = "Try them out:";
	old = jQuery("#first").html();

	result = jQuery("#first").append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	});
	equal( result.text(), defaultText + "buga", "Check if text appending works" );

	select = jQuery("#select3");
	old = select.html();

	equal( select.append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<option value='appendTest'>Append Test</option>";
	}).find("option:last-child").attr("value"), "appendTest", "Appending html options to select element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	old = jQuery("#sap").html();

	jQuery("#sap").append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return document.getElementById("first");
	});
	equal( jQuery("#sap").text(), expected, "Check for appending of element" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	old = jQuery("#sap").html();

	jQuery("#sap").append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return [ document.getElementById("first"), document.getElementById("yahoo") ];
	});
	equal( jQuery("#sap").text(), expected, "Check for appending of array of elements" );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	old = jQuery("#sap").html();

	jQuery("#sap").append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return jQuery("#yahoo, #first");
	});
	equal( jQuery("#sap").text(), expected, "Check for appending of jQuery object" );

	QUnit.reset();
	old = jQuery("#sap").html();

	jQuery("#sap").append(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return 5;
	});
	ok( jQuery("#sap")[ 0 ].innerHTML.match( /5$/ ), "Check for appending a number" );

	QUnit.reset();
});

test( "XML DOM manipulation (#9960)", function() {

	expect( 5 );

	var
		xmlDoc1 = jQuery.parseXML("<scxml xmlns='http://www.w3.org/2005/07/scxml' version='1.0'><state x='100' y='100' initial='actions' id='provisioning'></state><state x='100' y='100' id='error'></state><state x='100' y='100' id='finished' final='true'></state></scxml>"),
		xmlDoc2 = jQuery.parseXML("<scxml xmlns='http://www.w3.org/2005/07/scxml' version='1.0'><state id='provisioning3'></state></scxml>"),
		xml1 = jQuery( xmlDoc1 ),
		xml2 = jQuery( xmlDoc2 ),
		scxml1 = jQuery( "scxml", xml1 ),
		scxml2 = jQuery( "scxml", xml2 ),
		state = scxml2.find("state");

	scxml1.append( state );
	strictEqual( scxml1[0].lastChild, state[0], "append" );

	scxml1.prepend( state );
	strictEqual( scxml1[0].firstChild, state[0], "prepend" );

	scxml1.find("#finished").after( state );
	strictEqual( scxml1[0].lastChild, state[0], "after" );

	scxml1.find("#provisioning").before( state );
	strictEqual( scxml1[0].firstChild, state[0], "before" );

	scxml2.replaceWith( scxml1 );
	deepEqual( jQuery( "state", xml2 ).get(), scxml1.find("state").get(), "replaceWith" );
});

test( "append HTML5 sectioning elements (Bug #6485)", function() {

	expect( 2 );

	var article, aside;

	jQuery("#qunit-fixture").append("<article style='font-size:10px'><section><aside>HTML5 elements</aside></section></article>");

	article = jQuery("article");
	aside = jQuery("aside");

	equal( article.get( 0 ).style.fontSize, "10px", "HTML5 elements are styleable" );
	equal( aside.length, 1, "HTML5 elements do not collapse their children" );
});

if ( jQuery.css ) {
	test( "HTML5 Elements inherit styles from style rules (Bug #10501)", function() {

		expect( 1 );

		jQuery("#qunit-fixture").append("<article id='article'></article>");
		jQuery("#article").append("<section>This section should have a pink background.</section>");

		// In IE, the missing background color will claim its value is "transparent"
		notEqual( jQuery("section").css("background-color"), "transparent", "HTML5 elements inherit styles" );
	});
}

test( "html(String) with HTML5 (Bug #6485)", function() {

	expect( 2 );

	jQuery("#qunit-fixture").html("<article><section><aside>HTML5 elements</aside></section></article>");
	equal( jQuery("#qunit-fixture").children().children().length, 1, "Make sure HTML5 article elements can hold children. innerHTML shortcut path" );
	equal( jQuery("#qunit-fixture").children().children().children().length, 1, "Make sure nested HTML5 elements can hold children." );
});

test( "IE8 serialization bug", function() {

	expect( 2 );
	var wrapper = jQuery("<div></div>");

	wrapper.html("<div></div><article></article>");
	equal( wrapper.children("article").length, 1, "HTML5 elements are insertable with .html()" );

	wrapper.html("<div></div><link></link>");
	equal( wrapper.children("link").length, 1, "Link elements are insertable with .html()" );
});

test( "html() object element #10324", function() {

	expect( 1 );

	var object = jQuery("<object id='object2'><param name='object2test' value='test'></param></object>?").appendTo("#qunit-fixture"),
		clone = object.clone();

	equal( clone.html(), object.html(), "html() returns correct innerhtml of cloned object elements" );
});

test( "append(xml)", function() {

	expect( 1 );

	var xmlDoc, xml1, xml2;

	function createXMLDoc() {
		// Initialize DOM based upon latest installed MSXML or Netscape
		var elem, n, len,
			aActiveX =
				[ "MSXML6.DomDocument",
				"MSXML3.DomDocument",
				"MSXML2.DomDocument",
				"MSXML.DomDocument",
				"Microsoft.XmlDom" ];

		if ( document.implementation && "createDocument" in document.implementation ) {
			return document.implementation.createDocument( "", "", null );
		} else {
			// IE
			for ( n = 0, len = aActiveX.length; n < len; n++ ) {
				try {
					elem = new ActiveXObject( aActiveX[ n ] );
					return elem;
				} catch(_) {}
			}
		}
	}

	xmlDoc = createXMLDoc();
	xml1 = xmlDoc.createElement("head");
	xml2 = xmlDoc.createElement("test");

	ok( jQuery(xml1).append(xml2), "Append an xml element to another without raising an exception." );

});

test( "appendTo(String|Element|Array<Element>|jQuery)", function() {

	expect( 16 );

	var defaultText, l, expected, num, div;

	defaultText = "Try them out:";
	jQuery("<b>buga</b>").appendTo("#first");
	equal( jQuery("#first").text(), defaultText + "buga", "Check if text appending works" );
	equal( jQuery("<option value='appendTest'>Append Test</option>").appendTo("#select3").parent().find("option:last-child").attr("value"), "appendTest", "Appending html options to select element" );

	l = jQuery("#first").children().length + 2;
	jQuery("<strong>test</strong>");
	jQuery("<strong>test</strong>");
	jQuery([ jQuery("<strong>test</strong>")[ 0 ], jQuery("<strong>test</strong>")[ 0 ] ])
		.appendTo("#first");
	equal( jQuery("#first").children().length, l, "Make sure the elements were inserted." );
	equal( jQuery("#first").children().last()[ 0 ].nodeName.toLowerCase(), "strong", "Verify the last element." );

	QUnit.reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	jQuery( document.getElementById("first") ).appendTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for appending of element" );

	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	jQuery([ document.getElementById("first"), document.getElementById("yahoo") ]).appendTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for appending of array of elements" );

	QUnit.reset();
	ok( jQuery(document.createElement("script")).appendTo("body").length, "Make sure a disconnected script can be appended." );

	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	jQuery("#yahoo, #first").appendTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for appending of jQuery object" );

	jQuery("#select1").appendTo("#foo");
	t( "Append select", "#foo select", [ "select1" ] );

	div = jQuery("<div/>").on( "click", function() {
		ok( true, "Running a cloned click." );
	});
	div.appendTo("#qunit-fixture, #moretests");

	jQuery("#qunit-fixture div").last().trigger("click");
	jQuery("#moretests div").last().trigger("click");

	div = jQuery("<div/>").appendTo("#qunit-fixture, #moretests");

	equal( div.length, 2, "appendTo returns the inserted elements" );

	div.addClass("test");

	ok( jQuery("#qunit-fixture div").last().hasClass("test"), "appendTo element was modified after the insertion" );
	ok( jQuery("#moretests div").last().hasClass("test"), "appendTo element was modified after the insertion" );

	div = jQuery("<div/>");
	jQuery("<span>a</span><b>b</b>").filter("span").appendTo( div );

	equal( div.children().length, 1, "Make sure the right number of children were inserted." );

	div = jQuery("#moretests div");

	num = jQuery("#qunit-fixture div").length;
	div.remove().appendTo("#qunit-fixture");

	equal( jQuery("#qunit-fixture div").length, num, "Make sure all the removed divs were inserted." );
});

function testPrepend( val ) {

	expect( 6 );

	var defaultText, result, expected;

	defaultText = "Try them out:";
	result = jQuery("#first").prepend( val("<b>buga</b>") );

	equal( result.text(), "buga" + defaultText, "Check if text prepending works" );
	equal( jQuery("#select3").prepend( val("<option value='prependTest'>Prepend Test</option>" ) ).find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element" );

	QUnit.reset();
	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend( val(document.getElementById("first")) );
	equal( jQuery("#sap").text(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend( val([ document.getElementById("first"), document.getElementById("yahoo") ]) );
	equal( jQuery("#sap").text(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend( val(jQuery("#yahoo, #first")) );
	equal( jQuery("#sap").text(), expected, "Check for prepending of jQuery object" );

	QUnit.reset();
	expected = "Try them out:GoogleYahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#sap").prepend( val([ jQuery("#first"), jQuery("#yahoo, #google") ]) );
	equal( jQuery("#sap").text(), expected, "Check for prepending of array of jQuery objects" );
}

test( "prepend(String|Element|Array<Element>|jQuery)", function() {
	testPrepend( manipulationBareObj );
});

test( "prepend(Function)", function() {
	testPrepend( manipulationFunctionReturningObj );
});

test( "prepend(Function) with incoming value", function() {

	expect( 10 );

	var defaultText, old, result, expected;

	defaultText = "Try them out:";
	old = jQuery("#first").html();
	result = jQuery("#first").prepend(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	});

	equal( result.text(), "buga" + defaultText, "Check if text prepending works" );

	old = jQuery("#select3").html();

	equal( jQuery("#select3").prepend(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return "<option value='prependTest'>Prepend Test</option>";
	}).find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element" );

	QUnit.reset();
	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery("#sap").html();

	jQuery("#sap").prepend(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return document.getElementById("first");
	});

	equal( jQuery("#sap").text(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery("#sap").html();

	jQuery("#sap").prepend(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return [ document.getElementById("first"), document.getElementById("yahoo") ];
	});

	equal( jQuery("#sap").text(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery("#sap").html();

	jQuery("#sap").prepend(function( i, val ) {
		equal( val, old, "Make sure the incoming value is correct." );
		return jQuery("#yahoo, #first");
	});

	equal( jQuery("#sap").text(), expected, "Check for prepending of jQuery object" );
});

test( "prependTo(String|Element|Array<Element>|jQuery)", function() {

	expect( 6 );

	var defaultText, expected;

	defaultText = "Try them out:";
	jQuery("<b>buga</b>").prependTo("#first");
	equal( jQuery("#first").text(), "buga" + defaultText, "Check if text prepending works" );
	equal( jQuery("<option value='prependTest'>Prepend Test</option>").prependTo("#select3").parent().find("option:first-child").attr("value"), "prependTest", "Prepending html options to select element" );

	QUnit.reset();
	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery( document.getElementById("first") ).prependTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for prepending of element" );

	QUnit.reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery( [ document.getElementById("first"), document.getElementById("yahoo") ] ).prependTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for prepending of array of elements" );

	QUnit.reset();
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#yahoo, #first").prependTo("#sap");
	equal( jQuery("#sap").text(), expected, "Check for prepending of jQuery object" );

	QUnit.reset();
	jQuery("<select id='prependSelect1'></select>").prependTo("#form");
	jQuery("<select id='prependSelect2'><option>Test</option></select>").prependTo("#form");

	t( "Prepend Select", "#prependSelect2, #prependSelect1", [ "prependSelect2", "prependSelect1" ] );
});

function testBefore( val ) {

	expect( 7 );

	var expected, set;

	expected = "This is a normal link: bugaYahoo";
	jQuery("#yahoo").before( val("<b>buga</b>") );
	equal( jQuery("#en").text(), expected, "Insert String before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:Yahoo";
	jQuery("#yahoo").before( val(document.getElementById("first")) );
	equal( jQuery("#en").text(), expected, "Insert element before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery("#yahoo").before( val([ document.getElementById("first"), document.getElementById("mark") ]) );
	equal( jQuery("#en").text(), expected, "Insert array of elements before" );

	QUnit.reset();
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	jQuery("#yahoo").before( val(jQuery("#mark, #first")) );
	equal( jQuery("#en").text(), expected, "Insert jQuery before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:GooglediveintomarkYahoo";
	jQuery("#yahoo").before( val([ jQuery("#first"), jQuery("#mark, #google") ]) );
	equal( jQuery("#en").text(), expected, "Insert array of jQuery objects before" );

	set = jQuery("<div/>").before("<span>test</span>");
	equal( set[ 0 ].nodeName.toLowerCase(), "div", "Insert before a disconnected node should be a no-op" );
	equal( set.length, 1, "Insert the element before the disconnected node. should be a no-op" );
}

test( "before(String|Element|Array<Element>|jQuery)", function() {
	testBefore( manipulationBareObj );
});

test( "before(Function)", function() {
	testBefore( manipulationFunctionReturningObj );
});

test( "before and after w/ empty object (#10812)", function() {

	expect( 1 );

	var res;

	res = jQuery( "#notInTheDocument" ).before( "(" ).after( ")" );
	equal( res.length, 0, "didn't choke on empty object" );
});

test( "before and after on disconnected node (#10517)", function() {

	expect( 6 );

	var expectedBefore = "This is a normal link: bugaYahoo",
		expectedAfter = "This is a normal link: Yahoobuga";

	equal( jQuery("<input type='checkbox'/>").before("<div/>").length, 1, "before() on disconnected node is no-op" );
	equal( jQuery("<input type='checkbox'/>").after("<div/>").length, 1, "after() on disconnected node is no-op" );

	QUnit.reset();
	jQuery("#yahoo").add("<span/>").before("<b>buga</b>");
	equal( jQuery("#en").text(), expectedBefore, "Insert String before with disconnected node last" );

	QUnit.reset();
	jQuery("<span/>").add("#yahoo").before("<b>buga</b>");
	equal( jQuery("#en").text(), expectedBefore, "Insert String before with disconnected node first" );

	QUnit.reset();
	jQuery("#yahoo").add("<span/>").after("<b>buga</b>");
	equal( jQuery("#en").text(), expectedAfter, "Insert String after with disconnected node last" );

	QUnit.reset();
	jQuery("<span/>").add("#yahoo").after("<b>buga</b>");
	equal( jQuery("#en").text(), expectedAfter, "Insert String after with disconnected node first" );
});

test( "insertBefore(String|Element|Array<Element>|jQuery)", function() {

	expect( 4 );

	var expected;

	expected = "This is a normal link: bugaYahoo";
	jQuery("<b>buga</b>").insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert String before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:Yahoo";
	jQuery( document.getElementById("first") ).insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert element before" );

	QUnit.reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery( [ document.getElementById("first"), document.getElementById("mark") ] ).insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert array of elements before" );

	QUnit.reset();
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	jQuery("#mark, #first").insertBefore("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert jQuery before" );
});

function testAfter( val ) {

	expect( 7 );

	var set, expected;

	expected = "This is a normal link: Yahoobuga";
	jQuery("#yahoo").after( val("<b>buga</b>") );
	equal( jQuery("#en").text(), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	jQuery("#yahoo").after( val(document.getElementById("first")) );
	equal( jQuery("#en").text(), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery("#yahoo").after( val([ document.getElementById("first"), document.getElementById("mark") ]) );
	equal( jQuery("#en").text(), expected, "Insert array of elements after" );

	QUnit.reset();
	expected = "This is a normal link: YahoodiveintomarkTry them out:";
	jQuery("#yahoo").after(val( jQuery("#mark, #first") ));
	equal( jQuery("#en").text(), expected, "Insert jQuery after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:Googlediveintomark";
	jQuery("#yahoo").after( val([ jQuery("#first"), jQuery("#mark, #google") ]) );
	equal( jQuery("#en").text(), expected, "Insert array of jQuery objects after" );

	set = jQuery("<div/>").before("<span>test</span>");
	equal( set[ 0 ].nodeName.toLowerCase(), "div", "Insert after a disconnected node should be a no-op" );
	equal( set.length, 1, "Insert the element after the disconnected node should be a no-op" );
}

test( "after(String|Element|Array<Element>|jQuery)", function() {
	testAfter( manipulationBareObj );
});

test( "after(Function)", function() {
	testAfter( manipulationFunctionReturningObj );
});

test( "insertAfter(String|Element|Array<Element>|jQuery)", function() {

	expect( 4 ) ;

	var expected;

	expected = "This is a normal link: Yahoobuga";
	jQuery("<b>buga</b>").insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert String after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:";
	jQuery( document.getElementById("first") ).insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert element after" );

	QUnit.reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery( [ document.getElementById("first"), document.getElementById("mark") ] ).insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert array of elements after" );

	QUnit.reset();
	expected = "This is a normal link: YahoodiveintomarkTry them out:";
	jQuery("#mark, #first").insertAfter("#yahoo");
	equal( jQuery("#en").text(), expected, "Insert jQuery after" );
});

function testReplaceWith( val ) {

	var tmp, y, child, child2, set, non_existent, $div,
		expected = 26;

	expect( expected );

	jQuery("#yahoo").replaceWith( val("<b id='replace'>buga</b>") );
	ok( jQuery("#replace")[ 0 ], "Replace element with element from string" );
	ok( !jQuery("#yahoo")[ 0 ], "Verify that original element is gone, after string" );

	jQuery("#anchor2").replaceWith( val(document.getElementById("first")) );
	ok( jQuery("#first")[ 0 ], "Replace element with element" );
	ok( !jQuery("#anchor2")[ 0 ], "Verify that original element is gone, after element" );

	jQuery("#qunit-fixture").append("<div id='bar'><div id='baz'></div></div>");
	jQuery("#baz").replaceWith( val("Baz") );
	equal( jQuery("#bar").text(),"Baz", "Replace element with text" );
	ok( !jQuery("#baz")[ 0 ], "Verify that original element is gone, after element" );

	jQuery("#bar").replaceWith( "<div id='yahoo'></div>", "...", "<div id='baz'></div>" );
	deepEqual( jQuery("#yahoo, #baz").get(), q( "yahoo", "baz" ),  "Replace element with multiple arguments (#13722)" );
	strictEqual( jQuery("#yahoo")[0].nextSibling, jQuery("#baz")[0].previousSibling, "Argument order preserved" );
	deepEqual( jQuery("#bar").get(), [], "Verify that original element is gone, after multiple arguments" );

	jQuery("#google").replaceWith( val([ document.getElementById("first"), document.getElementById("mark") ]) );
	deepEqual( jQuery("#mark, #first").get(), q( "first", "mark" ),  "Replace element with array of elements" );
	ok( !jQuery("#google")[ 0 ], "Verify that original element is gone, after array of elements" );

	jQuery("#groups").replaceWith( val(jQuery("#mark, #first")) );
	deepEqual( jQuery("#mark, #first").get(), q( "first", "mark" ),  "Replace element with jQuery collection" );
	ok( !jQuery("#groups")[ 0 ], "Verify that original element is gone, after jQuery collection" );

	jQuery("#mark, #first").replaceWith( val("<span class='replacement'></span><span class='replacement'></span>") );
	equal( jQuery("#qunit-fixture .replacement").length, 4, "Replace multiple elements (#12449)" );
	deepEqual( jQuery("#mark, #first").get(), [], "Verify that original elements are gone, after replace multiple" );

	tmp = jQuery("<b>content</b>")[0];
	jQuery("#anchor1").contents().replaceWith( val(tmp) );
	deepEqual( jQuery("#anchor1").contents().get(), [ tmp ], "Replace text node with element" );


	tmp = jQuery("<div/>").appendTo("#qunit-fixture").on( "click", function() {
		ok( true, "Newly bound click run." );
	});
	y = jQuery("<div/>").appendTo("#qunit-fixture").on( "click", function() {
		ok( false, "Previously bound click run." );
	});
	child = y.append("<b>test</b>").find("b").on( "click", function() {
		ok( true, "Child bound click run." );
		return false;
	});

	y.replaceWith( val(tmp) );

	tmp.trigger("click");
	y.trigger("click"); // Shouldn't be run
	child.trigger("click"); // Shouldn't be run


	y = jQuery("<div/>").appendTo("#qunit-fixture").on( "click", function() {
		ok( false, "Previously bound click run." );
	});
	child2 = y.append("<u>test</u>").find("u").on( "click", function() {
		ok( true, "Child 2 bound click run." );
		return false;
	});

	y.replaceWith( val(child2) );

	child2.trigger("click");


	set = jQuery("<div/>").replaceWith( val("<span>test</span>") );
	equal( set[0].nodeName.toLowerCase(), "div", "No effect on a disconnected node." );
	equal( set.length, 1, "No effect on a disconnected node." );
	equal( set[0].childNodes.length, 0, "No effect on a disconnected node." );


	non_existent = jQuery("#does-not-exist").replaceWith( val("<b>should not throw an error</b>") );
	equal( non_existent.length, 0, "Length of non existent element." );

	$div = jQuery("<div class='replacewith'></div>").appendTo("#qunit-fixture");
	$div.replaceWith( val("<div class='replacewith'></div><script>" +
		"equal( jQuery('.replacewith').length, 1, 'Check number of elements in page.' );" +
		"</script>") );

	jQuery("#qunit-fixture").append("<div id='replaceWith'></div>");
	equal( jQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists." );
	jQuery("#replaceWith").replaceWith( val("<div id='replaceWith'></div>") );
	equal( jQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists after replacement." );
	jQuery("#replaceWith").replaceWith( val("<div id='replaceWith'></div>") );
	equal( jQuery("#qunit-fixture").find("div[id=replaceWith]").length, 1, "Make sure only one div exists after subsequent replacement." );

	return expected;
}

test( "replaceWith(String|Element|Array<Element>|jQuery)", function() {
	testReplaceWith( manipulationBareObj );
});

test( "replaceWith(Function)", function() {
	expect( testReplaceWith(manipulationFunctionReturningObj) + 1 );

	var y = jQuery("#foo")[ 0 ];

	jQuery( y ).replaceWith(function() {
		equal( this, y, "Make sure the context is coming in correctly." );
	});
});

test( "replaceWith(string) for more than one element", function() {

	expect( 3 );

	equal( jQuery("#foo p").length, 3, "ensuring that test data has not changed" );

	jQuery("#foo p").replaceWith("<span>bar</span>");
	equal(jQuery("#foo span").length, 3, "verify that all the three original element have been replaced");
	equal(jQuery("#foo p").length, 0, "verify that all the three original element have been replaced");
});

test( "empty replaceWith (#13401; #13596)", 4, function() {
	expect( 6 );

	var $el = jQuery("<div/>"),
		tests = {
			"empty string": "",
			"empty array": [],
			"empty collection": jQuery("#nonexistent")
		};

	jQuery.each( tests, function( label, input ) {
		$el.html("<a/>").children().replaceWith( input );
		strictEqual( $el.html(), "", "replaceWith(" + label + ")" );
		$el.html("<b/>").children().replaceWith(function() { return input; });
		strictEqual( $el.html(), "", "replaceWith(function returning " + label + ")" );
	});
});

test( "replaceAll(String|Element|Array<Element>|jQuery)", function() {

	expect( 10 );

	jQuery("<b id='replace'>buga</b>").replaceAll("#yahoo");
	ok( jQuery("#replace")[ 0 ], "Replace element with string" );
	ok( !jQuery("#yahoo")[ 0 ], "Verify that original element is gone, after string" );

	QUnit.reset();
	jQuery( document.getElementById("first") ).replaceAll("#yahoo");
	ok( jQuery("#first")[ 0 ], "Replace element with element" );
	ok( !jQuery("#yahoo")[ 0 ], "Verify that original element is gone, after element" );

	QUnit.reset();
	jQuery( [ document.getElementById("first"), document.getElementById("mark") ] ).replaceAll("#yahoo");
	ok( jQuery("#first")[ 0 ], "Replace element with array of elements" );
	ok( jQuery("#mark")[ 0 ], "Replace element with array of elements" );
	ok( !jQuery("#yahoo")[ 0 ], "Verify that original element is gone, after array of elements" );

	QUnit.reset();
	jQuery("#mark, #first").replaceAll("#yahoo");
	ok( jQuery("#first")[ 0 ], "Replace element with set of elements" );
	ok( jQuery("#mark")[ 0 ], "Replace element with set of elements" );
	ok( !jQuery("#yahoo")[ 0 ], "Verify that original element is gone, after set of elements" );
});

test( "jQuery.clone() (#8017)", function() {

	expect( 2 );

	ok( jQuery.clone && jQuery.isFunction( jQuery.clone ) , "jQuery.clone() utility exists and is a function.");

	var main = jQuery("#qunit-fixture")[ 0 ],
		clone = jQuery.clone( main );

	equal( main.childNodes.length, clone.childNodes.length, "Simple child length to ensure a large dom tree copies correctly" );
});

test( "append to multiple elements (#8070)", function() {

	expect( 2 );

	var selects = jQuery("<select class='test8070'></select><select class='test8070'></select>").appendTo("#qunit-fixture");
	selects.append("<OPTION>1</OPTION><OPTION>2</OPTION>");

	equal( selects[ 0 ].childNodes.length, 2, "First select got two nodes" );
	equal( selects[ 1 ].childNodes.length, 2, "Second select got two nodes" );
});

test( "table manipulation", function() {
	expect( 2 );

	var table = jQuery("<table style='font-size:16px'></table>").appendTo("#qunit-fixture").empty(),
		height = table[0].offsetHeight;

	table.append("<tr><td>DATA</td></tr>");
	ok( table[0].offsetHeight - height >= 15, "appended rows are visible" );

	table.empty();
	height = table[0].offsetHeight;
	table.prepend("<tr><td>DATA</td></tr>");
	ok( table[0].offsetHeight - height >= 15, "prepended rows are visible" );
});

test( "clone()", function() {

	expect( 45 );

	var div, clone, form, body;

	equal( jQuery("#en").text(), "This is a normal link: Yahoo", "Assert text for #en" );
	equal( jQuery("#first").append( jQuery("#yahoo").clone() ).text(), "Try them out:Yahoo", "Check for clone" );
	equal( jQuery("#en").text(), "This is a normal link: Yahoo", "Reassert text for #en" );

	jQuery.each( "table thead tbody tfoot tr td div button ul ol li select option textarea iframe".split(" "), function( i, nodeName ) {
		equal( jQuery( "<" + nodeName + "/>" ).clone()[ 0 ].nodeName.toLowerCase(), nodeName, "Clone a " + nodeName );
	});
	equal( jQuery("<input type='checkbox' />").clone()[ 0 ].nodeName.toLowerCase(), "input", "Clone a <input type='checkbox' />" );

	// Check cloning non-elements
	equal( jQuery("#nonnodes").contents().clone().length, 3, "Check node,textnode,comment clone works (some browsers delete comments on clone)" );

	// Verify that clones of clones can keep event listeners
	div = jQuery("<div><ul><li>test</li></ul></div>").on( "click", function() {
		ok( true, "Bound event still exists." );
	});
	clone = div.clone( true ); div.remove();
	div = clone.clone( true ); clone.remove();

	equal( div.length, 1, "One element cloned" );
	equal( div[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div.trigger("click");

	// Manually clean up detached elements
	div.remove();

	// Verify that cloned children can keep event listeners
	div = jQuery("<div/>").append([ document.createElement("table"), document.createElement("table") ]);
	div.find("table").on( "click", function() {
		ok( true, "Bound event still exists." );
	});

	clone = div.clone( true );
	equal( clone.length, 1, "One element cloned" );
	equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	clone.find("table").trigger("click");

	// Manually clean up detached elements
	div.remove();
	clone.remove();

	// Make sure that doing .clone() doesn't clone event listeners
	div = jQuery("<div><ul><li>test</li></ul></div>").on( "click", function() {
		ok( false, "Bound event still exists after .clone()." );
	});
	clone = div.clone();

	clone.trigger("click");

	// Manually clean up detached elements
	clone.remove();
	div.remove();

	// Test both html() and clone() for <embed> and <object> types
	div = jQuery("<div/>").html("<embed height='355' width='425' src='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'></embed>");

	clone = div.clone( true );
	equal( clone.length, 1, "One element cloned" );
	equal( clone.html(), div.html(), "Element contents cloned" );
	equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// this is technically an invalid object, but because of the special
	// classid instantiation it is the only kind that IE has trouble with,
	// so let's test with it too.
	div = jQuery("<div/>").html("<object height='355' width='425' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone( true );
	equal( clone.length, 1, "One element cloned" );
	equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div = div.find("object");
	clone = clone.find("object");
	// oldIE adds extra attributes and <param> elements, so just test for existence of the defined set
	jQuery.each( [ "height", "width", "classid" ], function( i, attr ) {
		equal( clone.attr( attr ), div.attr( attr ), "<object> attribute cloned: " + attr );
	} );
	(function() {
		var params = {};

		clone.find("param").each(function( index, param ) {
			params[ param.attributes.name.nodeValue.toLowerCase() ] =
				param.attributes.value.nodeValue.toLowerCase();
		});

		div.find("param").each(function( index, param ) {
			var key = param.attributes.name.nodeValue.toLowerCase();
			equal( params[ key ], param.attributes.value.nodeValue.toLowerCase(), "<param> cloned: " + key );
		});
	})();

	// and here's a valid one.
	div = jQuery("<div/>").html("<object height='355' width='425' type='application/x-shockwave-flash' data='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>");

	clone = div.clone(true);
	equal( clone.length, 1, "One element cloned" );
	equal( clone.html(), div.html(), "Element contents cloned" );
	equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	div = jQuery("<div/>").data({ "a": true });
	clone = div.clone( true );
	equal( clone.data("a"), true, "Data cloned." );
	clone.data( "a", false );
	equal( clone.data("a"), false, "Ensure cloned element data object was correctly modified" );
	equal( div.data("a"), true, "Ensure cloned element data object is copied, not referenced" );

	// manually clean up detached elements
	div.remove();
	clone.remove();

	form = document.createElement("form");
	form.action = "/test/";

	div = document.createElement("div");
	div.appendChild( document.createTextNode("test") );
	form.appendChild( div );

	equal( jQuery(form).clone().children().length, 1, "Make sure we just get the form back." );

	body = jQuery("body").clone();
	equal( body.children()[ 0 ].id, "qunit", "Make sure cloning body works" );
	body.remove();
});

test( "clone(script type=non-javascript) (#11359)", function() {

	expect( 3 );

	var src = jQuery("<script type='text/filler'>Lorem ipsum dolor sit amet</script><q><script type='text/filler'>consectetur adipiscing elit</script></q>"),
		dest = src.clone();

	equal( dest[ 0 ].text, "Lorem ipsum dolor sit amet", "Cloning preserves script text" );
	equal( dest.last().html(), src.last().html(), "Cloning preserves nested script text" );
	ok( /^\s*<scr.pt\s+type=['"]?text\/filler['"]?\s*>consectetur adipiscing elit<\/scr.pt>\s*$/i.test( dest.last().html() ), "Cloning preserves nested script text" );
	dest.remove();
});

test( "clone(form element) (Bug #3879, #6655)", function() {

	expect( 5 );

	var clone, element;

	element = jQuery("<select><option>Foo</option><option value='selected' selected>Bar</option></select>");

	equal( element.clone().find("option").filter(function() { return this.selected; }).val(), "selected", "Selected option cloned correctly" );

	element = jQuery("<input type='checkbox' value='foo'>").attr( "checked", "checked" );
	clone = element.clone();

	equal( clone.is(":checked"), element.is(":checked"), "Checked input cloned correctly" );
	equal( clone[ 0 ].defaultValue, "foo", "Checked input defaultValue cloned correctly" );

	element = jQuery("<input type='text' value='foo'>");
	clone = element.clone();
	equal( clone[ 0 ].defaultValue, "foo", "Text input defaultValue cloned correctly" );

	element = jQuery("<textarea>foo</textarea>");
	clone = element.clone();
	equal( clone[ 0 ].defaultValue, "foo", "Textarea defaultValue cloned correctly" );
});

test( "clone(multiple selected options) (Bug #8129)", function() {

	expect( 1 );

	var element = jQuery("<select><option>Foo</option><option selected>Bar</option><option selected>Baz</option></select>");

	equal( element.clone().find("option:selected").length, element.find("option:selected").length, "Multiple selected options cloned correctly" );

});

test( "clone() on XML nodes", function() {

	expect( 2 );

	var xml = createDashboardXML(),
		root = jQuery(xml.documentElement).clone(),
		origTab = jQuery("tab", xml).eq( 0 ),
		cloneTab = jQuery("tab", root).eq( 0 );

	origTab.text("origval");
	cloneTab.text("cloneval");
	equal( origTab.text(), "origval", "Check original XML node was correctly set" );
	equal( cloneTab.text(), "cloneval", "Check cloned XML node was correctly set" );
});

test( "clone() on local XML nodes with html5 nodename", function() {

	expect( 2 );

	var $xmlDoc = jQuery( jQuery.parseXML( "<root><meter /></root>" ) ),
		$meter = $xmlDoc.find( "meter" ).clone();

	equal( $meter[ 0 ].nodeName, "meter", "Check if nodeName was not changed due to cloning" );
	equal( $meter[ 0 ].nodeType, 1, "Check if nodeType is not changed due to cloning" );
});

test( "html(undefined)", function() {

	expect( 1 );

	equal( jQuery("#foo").html("<i>test</i>").html(undefined).html().toLowerCase(), "<i>test</i>", ".html(undefined) is chainable (#5571)" );
});

test( "html() on empty set", function() {

	expect( 1 );

	strictEqual( jQuery().html(), undefined, ".html() returns undefined for empty sets (#11962)" );
});

function childNodeNames( node ) {
	return jQuery.map( node.childNodes, function( child ) {
		return child.nodeName.toUpperCase();
	}).join(" ");
}

function testHtml( valueObj ) {
	expect( 37 );

	var actual, expected, tmp,
		div = jQuery("<div></div>"),
		fixture = jQuery("#qunit-fixture");

	div.html( valueObj("<div id='parent_1'><div id='child_1'/></div><div id='parent_2'/>") );
	equal( div.children().length, 2, "Found children" );
	equal( div.children().children().length, 1, "Found grandchild" );

	actual = []; expected = [];
	tmp = jQuery("<map/>").html( valueObj("<area alt='area'/>") ).each(function() {
		expected.push("AREA");
		actual.push( childNodeNames( this ) );
	});
	equal( expected.length, 1, "Expecting one parent" );
	deepEqual( actual, expected, "Found the inserted area element" );

	equal( div.html(valueObj(5)).html(), "5", "Setting a number as html" );
	equal( div.html(valueObj(0)).html(), "0", "Setting a zero as html" );

	div.html( valueObj("&#160;&amp;") );
	equal(
		div[ 0 ].innerHTML.replace( /\xA0/, "&nbsp;" ),
		"&nbsp;&amp;",
		"Entities are passed through correctly"
	);

	tmp = "&lt;div&gt;hello1&lt;/div&gt;";
	equal( div.html(valueObj(tmp) ).html().replace( />/g, "&gt;" ), tmp, "Escaped html" );
	tmp = "x" + tmp;
	equal( div.html(valueObj( tmp )).html().replace( />/g, "&gt;" ), tmp, "Escaped html, leading x" );
	tmp = " " + tmp.slice( 1 );
	equal( div.html(valueObj( tmp )).html().replace( />/g, "&gt;" ), tmp, "Escaped html, leading space" );

	actual = []; expected = []; tmp = {};
	jQuery("#nonnodes").contents().html( valueObj("<b>bold</b>") ).each(function() {
		var html = jQuery( this ).html();
		tmp[ this.nodeType ] = true;
		expected.push( this.nodeType === 1 ? "<b>bold</b>" : undefined );
		actual.push( html ? html.toLowerCase() : html );
	});
	deepEqual( actual, expected, "Set containing element, text node, comment" );
	ok( tmp[ 1 ], "element" );
	ok( tmp[ 3 ], "text node" );
	ok( tmp[ 8 ], "comment" );

	actual = []; expected = [];
	fixture.children("div").html( valueObj("<b>test</b>") ).each(function() {
		expected.push("B");
		actual.push( childNodeNames( this ) );
	});
	equal( expected.length, 7, "Expecting many parents" );
	deepEqual( actual, expected, "Correct childNodes after setting HTML" );

	actual = []; expected = [];
	fixture.html( valueObj("<style>.foobar{color:green;}</style>") ).each(function() {
		expected.push("STYLE");
		actual.push( childNodeNames( this ) );
	});
	equal( expected.length, 1, "Expecting one parent" );
	deepEqual( actual, expected, "Found the inserted style element" );

	fixture.html( valueObj("<select/>") );
	jQuery("#qunit-fixture select").html( valueObj("<option>O1</option><option selected='selected'>O2</option><option>O3</option>") );
	equal( jQuery("#qunit-fixture select").val(), "O2", "Selected option correct" );

	tmp = fixture.html(
		valueObj([
			"<script type='something/else'>ok( false, 'evaluated: non-script' );</script>",
			"<script type='text/javascript'>ok( true, 'evaluated: text/javascript' );</script>",
			"<script type='text/ecmascript'>ok( true, 'evaluated: text/ecmascript' );</script>",
			"<script>ok( true, 'evaluated: no type' );</script>",
			"<div>",
				"<script type='something/else'>ok( false, 'evaluated: inner non-script' );</script>",
				"<script type='text/javascript'>ok( true, 'evaluated: inner text/javascript' );</script>",
				"<script type='text/ecmascript'>ok( true, 'evaluated: inner text/ecmascript' );</script>",
				"<script>ok( true, 'evaluated: inner no type' );</script>",
			"</div>"
		].join(""))
	).find("script");
	equal( tmp.length, 8, "All script tags remain." );
	equal( tmp[ 0 ].type, "something/else", "Non-evaluated type." );
	equal( tmp[ 1 ].type, "text/javascript", "Evaluated type." );

	fixture.html( valueObj("<script type='text/javascript'>ok( true, 'Injection of identical script' );</script>") );
	fixture.html( valueObj("<script type='text/javascript'>ok( true, 'Injection of identical script' );</script>") );
	fixture.html( valueObj("<script type='text/javascript'>ok( true, 'Injection of identical script' );</script>") );
	fixture.html( valueObj("foo <form><script type='text/javascript'>ok( true, 'Injection of identical script (#975)' );</script></form>") );

	jQuery.scriptorder = 0;
	fixture.html( valueObj([
		"<script>",
			"equal( jQuery('#scriptorder').length, 1,'Execute after html' );",
			"equal( jQuery.scriptorder++, 0, 'Script is executed in order' );",
		"</script>",
		"<span id='scriptorder'><script>equal( jQuery.scriptorder++, 1, 'Script (nested) is executed in order');</script></span>",
		"<script>equal( jQuery.scriptorder++, 2, 'Script (unnested) is executed in order' );</script>"
	].join("")) );

	QUnit.reset();
	fixture.html( valueObj( fixture.text() ) );
	ok( /^[^<]*[^<\s][^<]*$/.test( fixture.html() ), "Replace html with text" );
}

test( "html(String)", function() {
	testHtml( manipulationBareObj );
});

test( "html(Function)", function() {
	testHtml( manipulationFunctionReturningObj );
});

test( "html(Function) with incoming value", function() {

	expect( 18 );

	var els, actualhtml, pass, j, $div, $div2, insert;

	els = jQuery("#foo > p");
	actualhtml = els.map(function() {
		return jQuery( this ).html();
	});

	els.html(function( i, val ) {
		equal( val, actualhtml[ i ], "Make sure the incoming value is correct." );
		return "<b>test</b>";
	});

	pass = true;
	els.each(function() {
		if ( this.childNodes.length !== 1 ) {
			pass = false;
		}
	});
	ok( pass, "Set HTML" );

	QUnit.reset();
	// using contents will get comments regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();
	actualhtml = j.map(function() {
		return jQuery( this ).html();
	});

	j.html(function( i, val ) {
		equal( val, actualhtml[ i ], "Make sure the incoming value is correct." );
		return "<b>bold</b>";
	});

	// Handle the case where no comment is in the document
	if ( j.length === 2 ) {
		equal( null, null, "Make sure the incoming value is correct." );
	}

	equal( j.html().replace( / xmlns="[^"]+"/g, "" ).toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	$div = jQuery("<div />");

	equal( $div.html(function( i, val ) {
		equal( val, "", "Make sure the incoming value is correct." );
		return 5;
	}).html(), "5", "Setting a number as html" );

	equal( $div.html(function( i, val ) {
		equal( val, "5", "Make sure the incoming value is correct." );
		return 0;
	}).html(), "0", "Setting a zero as html" );

	$div2 = jQuery("<div/>");
	insert = "&lt;div&gt;hello1&lt;/div&gt;";
	equal( $div2.html(function( i, val ) {
		equal( val, "", "Make sure the incoming value is correct." );
		return insert;
	}).html().replace(/>/g, "&gt;"), insert, "Verify escaped insertion." );

	equal( $div2.html(function( i, val ) {
		equal( val.replace(/>/g, "&gt;"), insert, "Make sure the incoming value is correct." );
		return "x" + insert;
	}).html().replace( />/g, "&gt;" ), "x" + insert, "Verify escaped insertion." );

	equal( $div2.html(function( i, val ) {
		equal( val.replace( />/g, "&gt;" ), "x" + insert, "Make sure the incoming value is correct." );
		return " " + insert;
	}).html().replace( />/g, "&gt;" ), " " + insert, "Verify escaped insertion." );
});

test( "clone()/html() don't expose jQuery/Sizzle expandos (#12858)", function() {

	expect( 2 );

	var $content = jQuery("<div><b><i>text</i></b></div>").appendTo("#qunit-fixture"),
		expected = /^<b><i>text<\/i><\/b>$/i;

	// Attach jQuery and Sizzle data (the latter with a non-qSA nth-child)
	try {
		$content.find(":nth-child(1):lt(4)").data( "test", true );

	// But don't break on a non-Sizzle build
	} catch( e ) {
		$content.find("*").data( "test", true );
	}

	ok( expected.test( $content.clone( false )[ 0 ].innerHTML ), "clone()" );
	ok( expected.test( $content.html() ), "html()" );
});

function testRemove( method ) {
	var markup, div,
		first = jQuery("#ap").children().first();

	first.data("foo", "bar");

	jQuery("#ap").children()[ method ]();
	ok( jQuery("#ap").text().length > 10, "Check text is not removed" );
	equal( jQuery("#ap").children().length, 0, "Check remove" );

	equal( first.data("foo"), method === "remove" ? null : "bar", "first data" );

	QUnit.reset();
	jQuery("#ap").children()[ method ]("a");
	ok( jQuery("#ap").text().length > 10, "Check text is not removed" );
	equal( jQuery("#ap").children().length, 1, "Check filtered remove" );

	jQuery("#ap").children()[ method ]("a, code");
	equal( jQuery("#ap").children().length, 0, "Check multi-filtered remove" );

	// Positional and relative selectors
	markup = "<div><span>1</span><span>2</span><span>3</span><span>4</span></div>";
	div = jQuery( markup );
	div.children().remove("span:nth-child(2n)");
	equal( div.text(), "13", "relative selector in " + method );
	div = jQuery( markup );
	div.children().remove("span:first");
	equal( div.text(), "234", "positional selector in " + method );
	div = jQuery( markup );
	div.children().remove("span:last");
	equal( div.text(), "123", "positional selector in " + method );

	// using contents will get comments regular, text, and comment nodes
	// Handle the case where no comment is in the document
	ok( jQuery("#nonnodes").contents().length >= 2, "Check node,textnode,comment remove works" );
	jQuery("#nonnodes").contents()[ method ]();
	equal( jQuery("#nonnodes").contents().length, 0, "Check node,textnode,comment remove works" );

	// manually clean up detached elements
	if (method === "detach") {
		first.remove();
	}
}

test( "remove()", 11, function() {
	testRemove("remove");
});

test( "remove() event cleaning ", 1, function() {
	var count, first, cleanUp;

	count = 0;
	first = jQuery("#ap").children().first();
	cleanUp = first.on( "click", function() {
		count++;
	}).remove().appendTo("#qunit-fixture").trigger("click");

	strictEqual( 0, count, "Event handler has been removed" );

	// Clean up detached data
	cleanUp.remove();
});

test( "remove() in document order #13779", 1, function() {
	var last,
		cleanData = jQuery.cleanData;

	jQuery.cleanData = function( nodes ) {
		last = jQuery.text( nodes[0] );
		cleanData.call( this, nodes );
	};

	jQuery("#qunit-fixture").append(
		jQuery.parseHTML(
			"<div class='removal-fixture'>1</div>" +
			"<div class='removal-fixture'>2</div>" +
			"<div class='removal-fixture'>3</div>"
		)
	);

	jQuery(".removal-fixture").remove();

	equal( last, 3, "The removal fixtures were removed in document order" );

	jQuery.cleanData = cleanData;
});

test( "detach()", 11, function() {
	testRemove("detach");
});

test( "detach() event cleaning ", 1, function() {
	var count, first, cleanUp;

	count = 0;
	first = jQuery("#ap").children().first();
	cleanUp = first.on( "click", function() {
		count++;
	}).detach().appendTo("#qunit-fixture").trigger("click");

	strictEqual( 1, count, "Event handler has not been removed" );

	// Clean up detached data
	cleanUp.remove();
});

test("empty()", function() {

	expect( 3 );

	equal( jQuery("#ap").children().empty().text().length, 0, "Check text is removed" );
	equal( jQuery("#ap").children().length, 4, "Check elements are not removed" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.empty();
	equal( j.html(), "", "Check node,textnode,comment empty works" );
});

test( "jQuery.cleanData", function() {

	expect( 14 );

	var type, pos, div, child;

	type = "remove";

	// Should trigger 4 remove event
	div = getDiv().remove();

	// Should both do nothing
	pos = "Outer";
	div.trigger("click");

	pos = "Inner";
	div.children().trigger("click");

	type = "empty";
	div = getDiv();
	child = div.children();

	// Should trigger 2 remove event
	div.empty();

	// Should trigger 1
	pos = "Outer";
	div.trigger("click");

	// Should do nothing
	pos = "Inner";
	child.trigger("click");

	// Should trigger 2
	div.remove();

	type = "html";

	div = getDiv();
	child = div.children();

	// Should trigger 2 remove event
	div.html("<div></div>");

	// Should trigger 1
	pos = "Outer";
	div.trigger("click");

	// Should do nothing
	pos = "Inner";
	child.trigger("click");

	// Should trigger 2
	div.remove();

	function getDiv() {
		var div = jQuery("<div class='outer'><div class='inner'></div></div>").on( "click", function() {
			ok( true, type + " " + pos + " Click event fired." );
		}).on( "focus", function() {
			ok( true, type + " " + pos + " Focus event fired." );
		}).find("div").on( "click", function() {
			ok( false, type + " " + pos + " Click event fired." );
		}).on( "focus", function() {
			ok( false, type + " " + pos + " Focus event fired." );
		}).end().appendTo("body");

		div[ 0 ].detachEvent = div[ 0 ].removeEventListener = function( t ) {
			ok( true, type + " Outer " + t + " event unbound" );
		};

		div[ 0 ].firstChild.detachEvent = div[ 0 ].firstChild.removeEventListener = function( t ) {
			ok( true, type + " Inner " + t + " event unbound" );
		};

		return div;
	}
});

test( "jQuery.buildFragment - no plain-text caching (Bug #6779)", function() {

	expect( 1 );

	// DOM manipulation fails if added text matches an Object method
	var i,
		$f = jQuery( "<div />" ).appendTo( "#qunit-fixture" ),
		bad = [ "start-", "toString", "hasOwnProperty", "append", "here&there!", "-end" ];

	for ( i = 0; i < bad.length; i++ ) {
		try {
			$f.append( bad[ i ] );
		}
		catch( e ) {}
	}
	equal( $f.text(), bad.join(""), "Cached strings that match Object properties" );
	$f.remove();
});

test( "jQuery.html - execute scripts escaped with html comment or CDATA (#9221)", function() {

	expect( 3 );

	jQuery([
				"<script type='text/javascript'>",
				"<!--",
				"ok( true, '<!-- handled' );",
				"//-->",
				"</script>"
			].join("\n")).appendTo("#qunit-fixture");
	jQuery([
				"<script type='text/javascript'>",
				"<![CDATA[",
				"ok( true, '<![CDATA[ handled' );",
				"//]]>",
				"</script>"
			].join("\n")).appendTo("#qunit-fixture");
	jQuery([
				"<script type='text/javascript'>",
				"<!--//--><![CDATA[//><!--",
				"ok( true, '<!--//--><![CDATA[//><!-- (Drupal case) handled' );",
				"//--><!]]>",
				"</script>"
			].join("\n")).appendTo("#qunit-fixture");
});

test( "jQuery.buildFragment - plain objects are not a document #8950", function() {

	expect( 1 );

	try {
		jQuery( "<input type='hidden'>", {} );
		ok( true, "Does not allow attribute object to be treated like a doc object" );
	} catch ( e ) {}
});

test( "jQuery.clone - no exceptions for object elements #9587", function() {

	expect( 1 );

	try {
		jQuery("#no-clone-exception").clone();
		ok( true, "cloned with no exceptions" );
	} catch( e ) {
		ok( false, e.message );
	}
});

test( "Cloned, detached HTML5 elems (#10667,10670)", function() {

	expect( 7 );

	var $clone,
		$section = jQuery( "<section>" ).appendTo( "#qunit-fixture" );

	// First clone
	$clone = $section.clone();

	// Infer that the test is being run in IE<=8
	if ( $clone[ 0 ].outerHTML && !jQuery.support.opacity ) {
		// This branch tests cloning nodes by reading the outerHTML, used only in IE<=8
		equal( $clone[ 0 ].outerHTML, "<section></section>", "detached clone outerHTML matches '<section></section>'" );
	} else {
		// This branch tests a known behaviour in modern browsers that should never fail.
		// Included for expected test count symmetry (expecting 1)
		equal( $clone[ 0 ].nodeName, "SECTION", "detached clone nodeName matches 'SECTION' in modern browsers" );
	}

	// Bind an event
	$section.on( "click", function() {
		ok( true, "clone fired event" );
	});

	// Second clone (will have an event bound)
	$clone = $section.clone( true );

	// Trigger an event from the first clone
	$clone.trigger("click");
	$clone.off("click");

	// Add a child node with text to the original
	$section.append("<p>Hello</p>");

	// Third clone (will have child node and text)
	$clone = $section.clone( true );

	equal( $clone.find("p").text(), "Hello", "Assert text in child of clone" );

	// Trigger an event from the third clone
	$clone.trigger("click");
	$clone.off("click");

	// Add attributes to copy
	$section.attr({
		"class": "foo bar baz",
		"title": "This is a title"
	});

	// Fourth clone (will have newly added attributes)
	$clone = $section.clone( true );

	equal( $clone.attr("class"), $section.attr("class"), "clone and element have same class attribute" );
	equal( $clone.attr("title"), $section.attr("title"), "clone and element have same title attribute" );

	// Remove the original
	$section.remove();

	// Clone the clone
	$section = $clone.clone( true );

	// Remove the clone
	$clone.remove();

	// Trigger an event from the clone of the clone
	$section.trigger("click");

	// Unbind any remaining events
	$section.off("click");
	$clone.off("click");
});

test( "Guard against exceptions when clearing safeChildNodes", function() {

	expect( 1 );

	var div;

	try {
		div = jQuery("<div/><hr/><code/><b/>");
	} catch(e) {}

	ok( div && div.jquery, "Created nodes safely, guarded against exceptions on safeChildNodes[ -1 ]" );
});

test( "Ensure oldIE creates a new set on appendTo (#8894)", function() {

	expect( 5 );

	strictEqual( jQuery("<div/>").clone().addClass("test").appendTo("<div/>").end().end().hasClass("test"), false, "Check jQuery.fn.appendTo after jQuery.clone" );
	strictEqual( jQuery("<div/>").find("p").end().addClass("test").appendTo("<div/>").end().end().hasClass("test"), false, "Check jQuery.fn.appendTo after jQuery.fn.find" );
	strictEqual( jQuery("<div/>").text("test").addClass("test").appendTo("<div/>").end().end().hasClass("test"), false, "Check jQuery.fn.appendTo after jQuery.fn.text" );
	strictEqual( jQuery("<bdi/>").clone().addClass("test").appendTo("<div/>").end().end().hasClass("test"), false, "Check jQuery.fn.appendTo after clone html5 element" );
	strictEqual( jQuery("<p/>").appendTo("<div/>").end().length, jQuery("<p>test</p>").appendTo("<div/>").end().length, "Elements created with createElement and with createDocumentFragment should be treated alike" );
});

test( "html() - script exceptions bubble (#11743)", function() {

	expect( 3 );

	raises(function() {
		jQuery("#qunit-fixture").html("<script>undefined(); ok( false, 'Exception not thrown' );</script>");
		ok( false, "Exception ignored" );
	}, "Exception bubbled from inline script" );

	if ( jQuery.ajax ) {
		var onerror = window.onerror;
		window.onerror = function() {
			ok( true, "Exception thrown in remote script" );
		};

		jQuery("#qunit-fixture").html("<script src='data/badcall.js'></script>");
		ok( true, "Exception ignored" );
		window.onerror = onerror;
	} else {
		ok( true, "No jQuery.ajax" );
		ok( true, "No jQuery.ajax" );
	}
});

test( "checked state is cloned with clone()", function() {

	expect( 2 );

	var elem = jQuery.parseHTML("<input type='checkbox' checked='checked'/>")[ 0 ];
	elem.checked = false;
	equal( jQuery(elem).clone().attr("id","clone")[ 0 ].checked, false, "Checked false state correctly cloned" );

	elem = jQuery.parseHTML("<input type='checkbox'/>")[ 0 ];
	elem.checked = true;
	equal( jQuery(elem).clone().attr("id","clone")[ 0 ].checked, true, "Checked true state correctly cloned" );
});

test( "manipulate mixed jQuery and text (#12384, #12346)", function() {

	expect( 2 );

	var div = jQuery("<div>a</div>").append( "&nbsp;", jQuery("<span>b</span>"), "&nbsp;", jQuery("<span>c</span>") ),
		nbsp = String.fromCharCode( 160 );

	equal( div.text(), "a" + nbsp + "b" + nbsp+ "c", "Appending mixed jQuery with text nodes" );

	div = jQuery("<div><div></div></div>")
		.find("div")
		.after( "<p>a</p>", "<p>b</p>" )
		.parent();
	equal( div.find("*").length, 3, "added 2 paragraphs after inner div" );
});

testIframeWithCallback( "buildFragment works even if document[0] is iframe's window object in IE9/10 (#12266)", "manipulation/iframe-denied.html", function( test ) {
	expect( 1 );

	ok( test.status, test.description );
});

test( "script evaluation (#11795)", function() {

	expect( 13 );

	var scriptsIn, scriptsOut,
		fixture = jQuery("#qunit-fixture").empty(),
		objGlobal = (function() {
			return this;
		})(),
		isOk = objGlobal.ok,
		notOk = function() {
			var args = arguments;
			args[ 0 ] = !args[ 0 ];
			return isOk.apply( this, args );
		};

	objGlobal.ok = notOk;
	scriptsIn = jQuery([
		"<script type='something/else'>ok( false, 'evaluated: non-script' );</script>",
		"<script type='text/javascript'>ok( true, 'evaluated: text/javascript' );</script>",
		"<script type='text/ecmascript'>ok( true, 'evaluated: text/ecmascript' );</script>",
		"<script>ok( true, 'evaluated: no type' );</script>",
		"<div>",
			"<script type='something/else'>ok( false, 'evaluated: inner non-script' );</script>",
			"<script type='text/javascript'>ok( true, 'evaluated: inner text/javascript' );</script>",
			"<script type='text/ecmascript'>ok( true, 'evaluated: inner text/ecmascript' );</script>",
			"<script>ok( true, 'evaluated: inner no type' );</script>",
		"</div>"
	].join(""));
	scriptsIn.appendTo( jQuery("<div class='detached'/>") );
	objGlobal.ok = isOk;

	scriptsOut = fixture.append( scriptsIn ).find("script");
	equal( scriptsOut[ 0 ].type, "something/else", "Non-evaluated type." );
	equal( scriptsOut[ 1 ].type, "text/javascript", "Evaluated type." );
	deepEqual( scriptsOut.get(), fixture.find("script").get(), "All script tags remain." );

	objGlobal.ok = notOk;
	scriptsOut = scriptsOut.add( scriptsOut.clone() ).appendTo( fixture.find("div") );
	deepEqual( fixture.find("div script").get(), scriptsOut.get(), "Scripts cloned without reevaluation" );
	fixture.append( scriptsOut.detach() );
	deepEqual( fixture.children("script").get(), scriptsOut.get(), "Scripts detached without reevaluation" );
	objGlobal.ok = isOk;

	if ( jQuery.ajax ) {
		Globals.register("testBar");
		jQuery("#qunit-fixture").append( "<script src='" + url("data/test.js") + "'/>" );
		strictEqual( window["testBar"], "bar", "Global script evaluation" );
	} else {
		ok( true, "No jQuery.ajax" );
		ok( true, "No jQuery.ajax" );
	}
});

test( "jQuery._evalUrl (#12838)", function() {

	expect( 5 );

	var message, expectedArgument,
		ajax = jQuery.ajax,
		evalUrl = jQuery._evalUrl;

	message = "jQuery.ajax implementation";
	expectedArgument = 1;
	jQuery.ajax = function( input ) {
		equal( ( input.url || input ).slice( -1 ), expectedArgument, message );
		expectedArgument++;
	};
	jQuery("#qunit-fixture").append("<script src='1'/><script src='2'/>");
	equal( expectedArgument, 3, "synchronous execution" );

	message = "custom implementation";
	expectedArgument = 3;
	jQuery._evalUrl = jQuery.ajax;
	jQuery.ajax = function( options ) {
		strictEqual( options, {}, "Unexpected call to jQuery.ajax" );
	};
	jQuery("#qunit-fixture").append("<script src='3'/><script src='4'/>");

	jQuery.ajax = ajax;
	jQuery._evalUrl = evalUrl;
});

test( "insertAfter, insertBefore, etc do not work when destination is original element. Element is removed (#4087)", function() {

	expect( 10 );

	var elems;

	jQuery.each([
		"appendTo",
		"prependTo",
		"insertBefore",
		"insertAfter",
		"replaceAll"
	], function( index, name ) {
		elems = jQuery( [
			"<ul id='test4087-complex'><li class='test4087'><div>c1</div>h1</li><li><div>c2</div>h2</li></ul>",
			"<div id='test4087-simple'><div class='test4087-1'>1<div class='test4087-2'>2</div><div class='test4087-3'>3</div></div></div>",
			"<div id='test4087-multiple'><div class='test4087-multiple'>1</div><div class='test4087-multiple'>2</div></div>"
		].join("") ).appendTo( "#qunit-fixture" );

		// complex case based on http://jsfiddle.net/pbramos/gZ7vB/
		jQuery("#test4087-complex div")[ name ]("#test4087-complex li:last-child div:last-child");
		equal( jQuery("#test4087-complex li:last-child div").length, name === "replaceAll" ? 1 : 2, name +" a node to itself, complex case." );

		// simple case
		jQuery( ".test4087-1" )[ name ](".test4087-1");
		equal( jQuery(".test4087-1").length, 1, name +" a node to itself, simple case." );

		// clean for next test
		jQuery("#test4087-complex").remove();
		jQuery("#test4087-simple").remove();
		jQuery("#test4087-multiple").remove();
	});
});

test( "Index for function argument should be received (#13094)", 2, function() {
	var i = 0;

	jQuery("<div/><div/>").before(function( index ) {
		equal( index, i++, "Index should be correct" );
	});

});

test( "Make sure jQuery.fn.remove can work on elements in documentFragment", 1, function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement("div") );

	jQuery( div ).remove();

	equal( fragment.childNodes.length, 0, "div element was removed from documentFragment" );
});

test( "Make sure specific elements with content created correctly (#13232)", 20, function() {
	var results = [],
		args = [],
		elems = {
			thead: "<tr><td>thead</td></tr>",
			tbody: "<tr><td>tbody</td></tr>",
			tfoot: "<tr><td>tfoot</td></tr>",
			colgroup: "<col span='5' />",
			caption: "caption",
			tr: "<td>tr</td>",
			th: "th",
			td: "<div>td</div>",
			optgroup: "<option>optgroup</option>",
			option: "option"
		};

	jQuery.each( elems, function( name, value ) {
		var html = "<" + name + ">" + value + "</" + name + ">";
		ok( jQuery.nodeName( jQuery.parseHTML( "<" + name + ">" + value + "</" + name + ">" )[ 0 ], name ), name + " is created correctly" );

		results.push( name );
		args.push( html );
	});

	jQuery.fn.append.apply( jQuery("<div/>"), args ).children().each(function( i ) {
		ok( jQuery.nodeName( this, results[ i ] ) );
	});
});
