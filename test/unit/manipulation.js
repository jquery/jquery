QUnit.module( "manipulation", {
	teardown: moduleTeardown
} );

// Ensure that an extended Array prototype doesn't break jQuery
Array.prototype.arrayProtoFn = function() {
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

QUnit.test( "text()", function( assert ) {

	assert.expect( 5 );

	var expected, frag, $newLineTest;

	expected = "This link has class=\"blog\": Simon Willison's Weblog";
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for merged text of more then one element." );

	// Check serialization of text values
	assert.equal( jQuery( document.createTextNode( "foo" ) ).text(), "foo", "Text node was retrieved from .text()." );
	assert.notEqual( jQuery( document ).text(), "", "Retrieving text for the document retrieves all text (#10724)." );

	// Retrieve from document fragments #10864
	frag = document.createDocumentFragment();
	frag.appendChild( document.createTextNode( "foo" ) );

	assert.equal( jQuery( frag ).text(), "foo", "Document Fragment Text node was retrieved from .text()." );

	$newLineTest = jQuery( "<div>test<br/>testy</div>" ).appendTo( "#moretests" );
	$newLineTest.find( "br" ).replaceWith( "\n" );
	assert.equal( $newLineTest.text(), "test\ntesty", "text() does not remove new lines (#11153)" );

	$newLineTest.remove();
} );

QUnit.test( "text(undefined)", function( assert ) {

	assert.expect( 1 );

	assert.equal( jQuery( "#foo" ).text( "<div" ).text( undefined )[ 0 ].innerHTML, "&lt;div", ".text(undefined) is chainable (#5571)" );
} );

function testText( valueObj, assert ) {

	assert.expect( 6 );

	var val, j, expected, $multipleElements, $parentDiv, $childDiv;

	val = valueObj( "<div><b>Hello</b> cruel world!</div>" );
	assert.equal( jQuery( "#foo" ).text( val )[ 0 ].innerHTML.replace( />/g, "&gt;" ), "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );

	// using contents will get comments regular, text, and comment nodes
	j = jQuery( "#nonnodes" ).contents();
	j.text( valueObj( "hi!" ) );
	assert.equal( jQuery( j[ 0 ] ).text(), "hi!", "Check node,textnode,comment with text()" );
	assert.equal( j[ 1 ].nodeValue, " there ", "Check node,textnode,comment with text()" );

	assert.equal( j[ 2 ].nodeType, 8, "Check node,textnode,comment with text()" );

	// Update multiple elements #11809
	expected = "New";

	$multipleElements = jQuery( "<div>Hello</div>" ).add( "<div>World</div>" );
	$multipleElements.text( expected );

	assert.equal( $multipleElements.eq( 0 ).text(), expected, "text() updates multiple elements (#11809)" );
	assert.equal( $multipleElements.eq( 1 ).text(), expected, "text() updates multiple elements (#11809)" );

	// Prevent memory leaks #11809
	$childDiv = jQuery( "<div/>" );
	$childDiv.data( "leak", true );
	$parentDiv = jQuery( "<div/>" );
	$parentDiv.append( $childDiv );
	$parentDiv.text( "Dry off" );
}

QUnit.test( "text(String)", function( assert ) {
	testText( manipulationBareObj, assert );
} );

QUnit.test( "text(Function)", function( assert ) {
	testText( manipulationFunctionReturningObj, assert );
} );

QUnit.test( "text(Function) with incoming value", function( assert ) {

	assert.expect( 2 );

	var old = "This link has class=\"blog\": Simon Willison's Weblog";

	jQuery( "#sap" ).text( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return "foobar";
	} );

	assert.equal( jQuery( "#sap" ).text(), "foobar", "Check for merged text of more then one element." );
} );

function testAppendForObject( valueObj, isFragment, assert ) {
	var $base,
		type = isFragment ? " (DocumentFragment)" : " (Element)",
		text = "This link has class=\"blog\": Simon Willison's Weblog",
		el = document.getElementById( "sap" ).cloneNode( true ),
		first = document.getElementById( "first" ),
		yahoo = document.getElementById( "yahoo" );

	if ( isFragment ) {
		$base = document.createDocumentFragment();
		jQuery( el ).contents().each( function() {
			$base.appendChild( this );
		} );
		$base = jQuery( $base );
	} else {
		$base = jQuery( el );
	}

	assert.equal( $base.clone().append( valueObj( first.cloneNode( true ) ) ).text(),
		text + "Try them out:",
		"Check for appending of element" + type
	);

	assert.equal( $base.clone().append( valueObj( [ first.cloneNode( true ), yahoo.cloneNode( true ) ] ) ).text(),
		text + "Try them out:Yahoo",
		"Check for appending of array of elements" + type
	);

	assert.equal( $base.clone().append( valueObj( jQuery( "#yahoo, #first" ).clone() ) ).text(),
		text + "YahooTry them out:",
		"Check for appending of jQuery object" + type
	);

	assert.equal( $base.clone().append( valueObj( 5 ) ).text(),
		text + "5",
		"Check for appending a number" + type
	);

	assert.equal( $base.clone().append( valueObj( [ jQuery( "#first" ).clone(), jQuery( "#yahoo, #google" ).clone() ] ) ).text(),
		text + "Try them out:GoogleYahoo",
		"Check for appending of array of jQuery objects"
	);

	assert.equal( $base.clone().append( valueObj( " text with spaces " ) ).text(),
		text + " text with spaces ",
		"Check for appending text with spaces" + type
	);

	assert.equal( $base.clone().append( valueObj( [] ) ).text(),
		text,
		"Check for appending an empty array" + type
	);

	assert.equal( $base.clone().append( valueObj( "" ) ).text(),
		text,
		"Check for appending an empty string" + type
	);

	assert.equal( $base.clone().append( valueObj( document.getElementsByTagName( "foo" ) ) ).text(),
		text,
		"Check for appending an empty nodelist" + type
	);

	assert.equal( $base.clone().append( "<span></span>", "<span></span>", "<span></span>" ).children().length,
		$base.children().length + 3,
		"Make sure that multiple arguments works." + type
	);

	assert.equal( $base.clone().append( valueObj( document.getElementById( "form" ).cloneNode( true ) ) ).children( "form" ).length,
		1,
		"Check for appending a form (#910)" + type
	);
}

function testAppend( valueObj, assert ) {

	assert.expect( 78 );

	testAppendForObject( valueObj, false, assert );
	testAppendForObject( valueObj, true, assert );

	var defaultText, result, message, iframe, iframeDoc, j, d,
		$input, $radioChecked, $radioUnchecked, $radioParent, $map, $table;

	defaultText = "Try them out:";
	result = jQuery( "#first" ).append( valueObj( "<b>buga</b>" ) );

	assert.equal( result.text(), defaultText + "buga", "Check if text appending works" );
	assert.equal( jQuery( "#select3" ).append( valueObj( "<option value='appendTest'>Append Test</option>" ) ).find( "option:last-child" ).attr( "value" ), "appendTest", "Appending html options to select element" );

	jQuery( "#qunit-fixture form" ).append( valueObj( "<input name='radiotest' type='radio' checked='checked' />" ) );
	jQuery( "#qunit-fixture form input[name=radiotest]" ).each( function() {
		assert.ok( jQuery( this ).is( ":checked" ), "Append checked radio" );
	} ).remove();

	jQuery( "#qunit-fixture form" ).append( valueObj( "<input name='radiotest2' type='radio' checked    =   'checked' />" ) );
	jQuery( "#qunit-fixture form input[name=radiotest2]" ).each( function() {
		assert.ok( jQuery( this ).is( ":checked" ), "Append alternately formated checked radio" );
	} ).remove();

	jQuery( "#qunit-fixture form" ).append( valueObj( "<input name='radiotest3' type='radio' checked />" ) );
	jQuery( "#qunit-fixture form input[name=radiotest3]" ).each( function() {
		assert.ok( jQuery( this ).is( ":checked" ), "Append HTML5-formated checked radio" );
	} ).remove();

	jQuery( "#qunit-fixture form" ).append( valueObj( "<input type='radio' checked='checked' name='radiotest4' />" ) );
	jQuery( "#qunit-fixture form input[name=radiotest4]" ).each( function() {
		assert.ok( jQuery( this ).is( ":checked" ), "Append with name attribute after checked attribute" );
	} ).remove();

	message = "Test for appending a DOM node to the contents of an iframe";
	iframe = jQuery( "#iframe" )[ 0 ];
	iframeDoc = iframe.contentDocument || iframe.contentWindow && iframe.contentWindow.document;

	try {
		if ( iframeDoc && iframeDoc.body ) {
			assert.equal( jQuery( iframeDoc.body ).append( valueObj( "<div id='success'>test</div>" ) )[ 0 ].lastChild.id, "success", message );
		} else {
			assert.ok( true, message + " - can't test" );
		}
	} catch ( e ) {
		assert.strictEqual( e.message || e, undefined, message );
	}

	jQuery( "<fieldset/>" ).appendTo( "#form" ).append( valueObj( "<legend id='legend'>test</legend>" ) );
	assert.t( "Append legend", "#legend", [ "legend" ] );

	$map = jQuery( "<map/>" ).append( valueObj( "<area id='map01' shape='rect' coords='50,50,150,150' href='http://www.jquery.com/' alt='jQuery'>" ) );

	assert.equal( $map[ 0 ].childNodes.length, 1, "The area was inserted." );
	assert.equal( $map[ 0 ].firstChild.nodeName.toLowerCase(), "area", "The area was inserted." );

	jQuery( "#select1" ).append( valueObj( "<OPTION>Test</OPTION>" ) );
	assert.equal( jQuery( "#select1 option:last-child" ).text(), "Test", "Appending OPTION (all caps)" );

	jQuery( "#select1" ).append( valueObj( "<optgroup label='optgroup'><option>optgroup</option></optgroup>" ) );
	assert.equal( jQuery( "#select1 optgroup" ).attr( "label" ), "optgroup", "Label attribute in newly inserted optgroup is correct" );
	assert.equal( jQuery( "#select1 option" ).last().text(), "optgroup", "Appending optgroup" );

	$table = jQuery( "#table" );

	jQuery.each( "thead tbody tfoot colgroup caption tr th td".split( " " ), function( i, name ) {
		$table.append( valueObj( "<" + name + "/>" ) );
		assert.equal( $table.find( name ).length, 1, "Append " + name );
		assert.ok( jQuery.parseHTML( "<" + name + "/>" ).length, name + " wrapped correctly" );
	} );

	jQuery( "#table colgroup" ).append( valueObj( "<col/>" ) );
	assert.equal( jQuery( "#table colgroup col" ).length, 1, "Append col" );

	jQuery( "#form" )
		.append( valueObj( "<select id='appendSelect1'></select>" ) )
		.append( valueObj( "<select id='appendSelect2'><option>Test</option></select>" ) );
	assert.t( "Append Select", "#appendSelect1, #appendSelect2", [ "appendSelect1", "appendSelect2" ] );

	assert.equal( "Two nodes", jQuery( "<div />" ).append( "Two", " nodes" ).text(), "Appending two text nodes (#4011)" );
	assert.equal( jQuery( "<div />" ).append( "1", "", 3 ).text(), "13", "If median is false-like value, subsequent arguments should not be ignored" );

	// using contents will get comments regular, text, and comment nodes
	j = jQuery( "#nonnodes" ).contents();
	d = jQuery( "<div/>" ).appendTo( "#nonnodes" ).append( j );

	assert.equal( jQuery( "#nonnodes" ).length, 1, "Check node,textnode,comment append moved leaving just the div" );
	assert.equal( d.contents().length, 3, "Check node,textnode,comment append works" );
	d.contents().appendTo( "#nonnodes" );
	d.remove();
	assert.equal( jQuery( "#nonnodes" ).contents().length, 3, "Check node,textnode,comment append cleanup worked" );

	$input = jQuery( "<input type='checkbox'/>" ).prop( "checked", true ).appendTo( "#testForm" );
	assert.equal( $input[ 0 ].checked, true, "A checked checkbox that is appended stays checked" );

	$radioChecked = jQuery( "input[type='radio'][name='R1']" ).eq( 1 );
	$radioParent = $radioChecked.parent();
	$radioUnchecked = jQuery( "<input type='radio' name='R1' checked='checked'/>" ).appendTo( $radioParent );
	$radioChecked.trigger( "click" );
	$radioUnchecked[ 0 ].checked = false;

	jQuery( "<div/>" ).insertBefore( $radioParent ).append( $radioParent );

	assert.equal( $radioChecked[ 0 ].checked, true, "Reappending radios uphold which radio is checked" );
	assert.equal( $radioUnchecked[ 0 ].checked, false, "Reappending radios uphold not being checked" );

	assert.equal( jQuery( "<div/>" ).append( valueObj( "option<area/>" ) )[ 0 ].childNodes.length, 2, "HTML-string with leading text should be processed correctly" );
}

QUnit.test( "append(String|Element|Array<Element>|jQuery)", function( assert ) {
	testAppend( manipulationBareObj, assert );
} );

QUnit.test( "append(Function)", function( assert ) {
	testAppend( manipulationFunctionReturningObj, assert );
} );

QUnit.test( "append(param) to object, see #11280", function( assert ) {

	assert.expect( 5 );

	var object = jQuery( document.createElement( "object" ) ).appendTo( document.body );

	assert.equal( object.children().length, 0, "object does not start with children" );

	object.append( jQuery( "<param type='wmode' name='foo'>" ) );
	assert.equal( object.children().length, 1, "appended param" );
	assert.equal( object.children().eq( 0 ).attr( "name" ), "foo", "param has name=foo" );

	object = jQuery( "<object><param type='baz' name='bar'></object>" );
	assert.equal( object.children().length, 1, "object created with child param" );
	assert.equal( object.children().eq( 0 ).attr( "name" ), "bar", "param has name=bar" );
} );

QUnit.test( "append(Function) returns String", function( assert ) {

	assert.expect( 4 );

	var defaultText, result, select, old;

	defaultText = "Try them out:";
	old = jQuery( "#first" ).html();

	result = jQuery( "#first" ).append( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	} );
	assert.equal( result.text(), defaultText + "buga", "Check if text appending works" );

	select = jQuery( "#select3" );
	old = select.html();

	assert.equal( select.append( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return "<option value='appendTest'>Append Test</option>";
	} ).find( "option:last-child" ).attr( "value" ), "appendTest", "Appending html options to select element" );
} );

QUnit.test( "append(Function) returns Element", function( assert ) {

	assert.expect( 2 );
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:",
		old = jQuery( "#sap" ).html();

	jQuery( "#sap" ).append( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return document.getElementById( "first" );
	} );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for appending of element" );
} );

QUnit.test( "append(Function) returns Array<Element>", function( assert ) {

	assert.expect( 2 );
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo",
		old = jQuery( "#sap" ).html();

	jQuery( "#sap" ).append( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return [ document.getElementById( "first" ), document.getElementById( "yahoo" ) ];
	} );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for appending of array of elements" );
} );

QUnit.test( "append(Function) returns jQuery", function( assert ) {

	assert.expect( 2 );
	var expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:",
		old = jQuery( "#sap" ).html();

	jQuery( "#sap" ).append( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return jQuery( "#yahoo, #first" );
	} );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for appending of jQuery object" );
} );

QUnit.test( "append(Function) returns Number", function( assert ) {

	assert.expect( 2 );
	var old = jQuery( "#sap" ).html();

	jQuery( "#sap" ).append( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return 5;
	} );
	assert.ok( jQuery( "#sap" )[ 0 ].innerHTML.match( /5$/ ), "Check for appending a number" );
} );

QUnit.test( "XML DOM manipulation (#9960)", function( assert ) {

	assert.expect( 5 );

	var xmlDoc1 = jQuery.parseXML( "<scxml xmlns='http://www.w3.org/2005/07/scxml' version='1.0'><state x='100' y='100' initial='actions' id='provisioning'></state><state x='100' y='100' id='error'></state><state x='100' y='100' id='finished' final='true'></state></scxml>" ),
		xmlDoc2 = jQuery.parseXML( "<scxml xmlns='http://www.w3.org/2005/07/scxml' version='1.0'><state id='provisioning3'></state></scxml>" ),
		xml1 = jQuery( xmlDoc1 ),
		xml2 = jQuery( xmlDoc2 ),
		scxml1 = jQuery( "scxml", xml1 ),
		scxml2 = jQuery( "scxml", xml2 ),
		state = scxml2.find( "state" );

	scxml1.append( state );
	assert.strictEqual( scxml1[ 0 ].lastChild, state[ 0 ], "append" );

	scxml1.prepend( state );
	assert.strictEqual( scxml1[ 0 ].firstChild, state[ 0 ], "prepend" );

	scxml1.find( "#finished" ).after( state );
	assert.strictEqual( scxml1[ 0 ].lastChild, state[ 0 ], "after" );

	scxml1.find( "#provisioning" ).before( state );
	assert.strictEqual( scxml1[ 0 ].firstChild, state[ 0 ], "before" );

	scxml2.replaceWith( scxml1 );
	assert.deepEqual( jQuery( "state", xml2 ).get(), scxml1.find( "state" ).get(), "replaceWith" );
} );

QUnit.test( "append HTML5 sectioning elements (Bug #6485)", function( assert ) {

	assert.expect( 2 );

	var article, aside;

	jQuery( "#qunit-fixture" ).append( "<article style='font-size:10px'><section><aside>HTML5 elements</aside></section></article>" );

	article = jQuery( "article" );
	aside = jQuery( "aside" );

	assert.equal( article.get( 0 ).style.fontSize, "10px", "HTML5 elements are styleable" );
	assert.equal( aside.length, 1, "HTML5 elements do not collapse their children" );
} );

if ( jQuery.css ) {
	QUnit.test( "HTML5 Elements inherit styles from style rules (Bug #10501)", function( assert ) {

		assert.expect( 1 );

		jQuery( "#qunit-fixture" ).append( "<article id='article'></article>" );
		jQuery( "#article" ).append( "<section>This section should have a pink background.</section>" );

		// In IE, the missing background color will claim its value is "transparent"
		assert.notEqual( jQuery( "section" ).css( "background-color" ), "transparent", "HTML5 elements inherit styles" );
	} );
}

QUnit.test( "html(String) with HTML5 (Bug #6485)", function( assert ) {

	assert.expect( 2 );

	jQuery( "#qunit-fixture" ).html( "<article><section><aside>HTML5 elements</aside></section></article>" );
	assert.equal( jQuery( "#qunit-fixture" ).children().children().length, 1, "Make sure HTML5 article elements can hold children. innerHTML shortcut path" );
	assert.equal( jQuery( "#qunit-fixture" ).children().children().children().length, 1, "Make sure nested HTML5 elements can hold children." );
} );

QUnit.test( "html(String) tag-hyphenated elements (Bug #1987)", function( assert ) {

	assert.expect( 27 );

	jQuery.each( "thead tbody tfoot colgroup caption tr th td".split( " " ), function( i, name ) {
		var j = jQuery( "<" + name + "-d></" + name + "-d><" + name + "-d></" + name + "-d>" );
		assert.ok( j[ 0 ], "Create a tag-hyphenated element" );
		assert.ok( jQuery.nodeName( j[ 0 ], name.toUpperCase() + "-D" ), "Hyphenated node name" );
		assert.ok( jQuery.nodeName( j[ 1 ], name.toUpperCase() + "-D" ), "Hyphenated node name" );
	} );

	var j = jQuery( "<tr-multiple-hyphens><td-with-hyphen>text</td-with-hyphen></tr-multiple-hyphens>" );
	assert.ok( jQuery.nodeName( j[ 0 ], "TR-MULTIPLE-HYPHENS" ), "Tags with multiple hyphens" );
	assert.ok( jQuery.nodeName( j.children()[ 0 ], "TD-WITH-HYPHEN" ), "Tags with multiple hyphens" );
	assert.equal( j.children().text(), "text", "Tags with multiple hyphens behave normally" );
} );

QUnit.test( "Tag name processing respects the HTML Standard (gh-2005)", function( assert ) {

	assert.expect( 240 );

	var wrapper = jQuery( "<div></div>" ),
		nameTerminatingChars = "\x20\t\r\n\f".split( "" ),
		specialChars = "[ ] { } _ - = + \\ ( ) * & ^ % $ # @ ! ~ ` ' ; ? ¥ « µ λ ⊕ ≈ ξ ℜ ♣ €"
			.split( " " );

	specialChars.push( specialChars.join( "" ) );

	jQuery.each( specialChars, function( i, characters ) {
		assertSpecialCharsSupport( "html", characters );
		assertSpecialCharsSupport( "append", characters );
	} );

	jQuery.each( nameTerminatingChars, function( i, character ) {
		assertNameTerminatingCharsHandling( "html", character );
		assertNameTerminatingCharsHandling( "append", character );
	} );

	function buildChild( method, html ) {
		wrapper[ method ]( html );
		return wrapper.children()[ 0 ];
	}

	function assertSpecialCharsSupport( method, characters ) {
		// Support: Android 4.4 only
		// Chromium < 35 incorrectly upper-cases µ; Android 4.4 uses such a version by default
		// (and its WebView, being un-updatable, will use it for eternity) so we need to blacklist
		// that one for the tests to pass.
		if ( characters === "µ" && /chrome/i.test( navigator.userAgent ) &&
			navigator.userAgent.match( /chrome\/(\d+)/i )[ 1 ] < 35 ) {
			assert.ok( true, "This Chromium version upper-cases µ incorrectly; skip test" );
			assert.ok( true, "This Chromium version upper-cases µ incorrectly; skip test" );
			assert.ok( true, "This Chromium version upper-cases µ incorrectly; skip test" );
			return;
		}

		var child,
			codepoint = characters.charCodeAt( 0 ).toString( 16 ).toUpperCase(),
			description = characters.length === 1 ?
				"U+" + ( "000" + codepoint ).slice( -4 ) + " " + characters :
				"all special characters",
			nodeName = "valid" + characters + "tagname";

		child = buildChild( method, "<" + nodeName + "></" + nodeName + ">" );
		assert.equal( child.nodeName.toUpperCase(), nodeName.toUpperCase(),
			method + "(): Paired tag name includes " + description );

		child = buildChild( method, "<" + nodeName + ">" );
		assert.equal( child.nodeName.toUpperCase(), nodeName.toUpperCase(),
			method + "(): Unpaired tag name includes " + description );

		child = buildChild( method, "<" + nodeName + "/>" );
		assert.equal( child.nodeName.toUpperCase(), nodeName.toUpperCase(),
			method + "(): Self-closing tag name includes " + description );
	}

	function assertNameTerminatingCharsHandling( method, character ) {
		var child,
			codepoint = character.charCodeAt( 0 ).toString( 16 ).toUpperCase(),
			description = "U+" + ( "000" + codepoint ).slice( -4 ) + " " + character,
			nodeName = "div" + character + "this-will-be-discarded";

		child = buildChild( method, "<" + nodeName + "></" + nodeName + ">" );
		assert.equal( child.nodeName.toUpperCase(), "DIV",
			method + "(): Paired tag name terminated by " + description );

		child = buildChild( method, "<" + nodeName + ">" );
		assert.equal( child.nodeName.toUpperCase(), "DIV",
			method + "(): Unpaired open tag name terminated by " + description );

		child = buildChild( method, "<" + nodeName + "/>" );
		assert.equal( child.nodeName.toUpperCase(), "DIV",
			method + "(): Self-closing tag name terminated by " + description );
	}
} );

QUnit.test( "IE8 serialization bug", function( assert ) {

	assert.expect( 2 );
	var wrapper = jQuery( "<div></div>" );

	wrapper.html( "<div></div><article></article>" );
	assert.equal( wrapper.children( "article" ).length, 1, "HTML5 elements are insertable with .html()" );

	wrapper.html( "<div></div><link></link>" );
	assert.equal( wrapper.children( "link" ).length, 1, "Link elements are insertable with .html()" );
} );

QUnit.test( "html() object element #10324", function( assert ) {

	assert.expect( 1 );

	var object = jQuery( "<object id='object2'><param name='object2test' value='test'></param></object>?" ).appendTo( "#qunit-fixture" ),
		clone = object.clone();

	assert.equal( clone.html(), object.html(), "html() returns correct innerhtml of cloned object elements" );
} );

QUnit.test( "append(xml)", function( assert ) {

	assert.expect( 1 );

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
					elem = new window.ActiveXObject( aActiveX[ n ] );
					return elem;
				} catch ( _ ) {}
			}
		}
	}

	xmlDoc = createXMLDoc();
	xml1 = xmlDoc.createElement( "head" );
	xml2 = xmlDoc.createElement( "test" );

	assert.ok( jQuery( xml1 ).append( xml2 ), "Append an xml element to another without raising an exception." );

} );

QUnit.test( "appendTo(String)", function( assert ) {

	assert.expect( 4 );

	var l, defaultText;

	defaultText = "Try them out:";
	jQuery( "<b>buga</b>" ).appendTo( "#first" );
	assert.equal( jQuery( "#first" ).text(), defaultText + "buga", "Check if text appending works" );
	assert.equal( jQuery( "<option value='appendTest'>Append Test</option>" ).appendTo( "#select3" ).parent().find( "option:last-child" ).attr( "value" ), "appendTest", "Appending html options to select element" );

	l = jQuery( "#first" ).children().length + 2;
	jQuery( "<strong>test</strong>" );
	jQuery( "<strong>test</strong>" );
	jQuery( [ jQuery( "<strong>test</strong>" )[ 0 ], jQuery( "<strong>test</strong>" )[ 0 ] ] )
		.appendTo( "#first" );
	assert.equal( jQuery( "#first" ).children().length, l, "Make sure the elements were inserted." );
	assert.equal( jQuery( "#first" ).children().last()[ 0 ].nodeName.toLowerCase(), "strong", "Verify the last element." );
} );

QUnit.test( "appendTo(Element|Array<Element>)", function( assert ) {

	assert.expect( 2 );

	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	jQuery( document.getElementById( "first" ) ).appendTo( "#sap" );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for appending of element" );

	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	jQuery( [ document.getElementById( "first" ), document.getElementById( "yahoo" ) ] ).appendTo( "#sap" );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for appending of array of elements" );

} );

QUnit.test( "appendTo(jQuery)", function( assert ) {

	assert.expect( 10 );

	var expected, num, div;
	assert.ok( jQuery( document.createElement( "script" ) ).appendTo( "body" ).length, "Make sure a disconnected script can be appended." );

	expected = "This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:";
	jQuery( "#yahoo, #first" ).appendTo( "#sap" );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for appending of jQuery object" );

	jQuery( "#select1" ).appendTo( "#foo" );
	assert.t( "Append select", "#foo select", [ "select1" ] );

	div = jQuery( "<div/>" ).on( "click", function() {
		assert.ok( true, "Running a cloned click." );
	} );
	div.appendTo( "#qunit-fixture, #moretests" );

	jQuery( "#qunit-fixture div" ).last().trigger( "click" );
	jQuery( "#moretests div" ).last().trigger( "click" );

	div = jQuery( "<div/>" ).appendTo( "#qunit-fixture, #moretests" );

	assert.equal( div.length, 2, "appendTo returns the inserted elements" );

	div.addClass( "test" );

	assert.ok( jQuery( "#qunit-fixture div" ).last().hasClass( "test" ), "appendTo element was modified after the insertion" );
	assert.ok( jQuery( "#moretests div" ).last().hasClass( "test" ), "appendTo element was modified after the insertion" );

	div = jQuery( "<div/>" );
	jQuery( "<span>a</span><b>b</b>" ).filter( "span" ).appendTo( div );

	assert.equal( div.children().length, 1, "Make sure the right number of children were inserted." );

	div = jQuery( "#moretests div" );

	num = jQuery( "#qunit-fixture div" ).length;
	div.remove().appendTo( "#qunit-fixture" );

	assert.equal( jQuery( "#qunit-fixture div" ).length, num, "Make sure all the removed divs were inserted." );
} );

QUnit.test( "prepend(String)", function( assert ) {

	assert.expect( 2 );

	var result, expected;
	expected = "Try them out:";
	result = jQuery( "#first" ).prepend( "<b>buga</b>" );
	assert.equal( result.text(), "buga" + expected, "Check if text prepending works" );
	assert.equal( jQuery( "#select3" ).prepend( "<option value='prependTest'>Prepend Test</option>"  ).find( "option:first-child" ).attr( "value" ), "prependTest", "Prepending html options to select element" );
} );

QUnit.test( "prepend(Element)", function( assert ) {

	assert.expect( 1 );

	var expected;
	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery( "#sap" ).prepend( document.getElementById( "first" ) );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for prepending of element" );
} );

QUnit.test( "prepend(Array<Element>)", function( assert ) {

	assert.expect( 1 );

	var expected;
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery( "#sap" ).prepend( [ document.getElementById( "first" ), document.getElementById( "yahoo" ) ] );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for prepending of array of elements" );
} );

QUnit.test( "prepend(jQuery)", function( assert ) {

	assert.expect( 1 );

	var expected;
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery( "#sap" ).prepend( jQuery( "#yahoo, #first" ) );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for prepending of jQuery object" );
} );

QUnit.test( "prepend(Array<jQuery>)", function( assert ) {

	assert.expect( 1 );

	var expected;
	expected = "Try them out:GoogleYahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery( "#sap" ).prepend( [ jQuery( "#first" ), jQuery( "#yahoo, #google" ) ] );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for prepending of array of jQuery objects" );
} );

QUnit.test( "prepend(Function) with incoming value -- String", function( assert ) {

	assert.expect( 4 );

	var defaultText, old, result;

	defaultText = "Try them out:";
	old = jQuery( "#first" ).html();
	result = jQuery( "#first" ).prepend( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return "<b>buga</b>";
	} );

	assert.equal( result.text(), "buga" + defaultText, "Check if text prepending works" );

	old = jQuery( "#select3" ).html();

	assert.equal( jQuery( "#select3" ).prepend( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return "<option value='prependTest'>Prepend Test</option>";
	} ).find( "option:first-child" ).attr( "value" ), "prependTest", "Prepending html options to select element" );
} );

QUnit.test( "prepend(Function) with incoming value -- Element", function( assert ) {

	assert.expect( 2 );

	var old, expected;
	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery( "#sap" ).html();

	jQuery( "#sap" ).prepend( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return document.getElementById( "first" );
	} );

	assert.equal( jQuery( "#sap" ).text(), expected, "Check for prepending of element" );
} );

QUnit.test( "prepend(Function) with incoming value -- Array<Element>", function( assert ) {

	assert.expect( 2 );

	var old, expected;
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery( "#sap" ).html();

	jQuery( "#sap" ).prepend( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return [ document.getElementById( "first" ), document.getElementById( "yahoo" ) ];
	} );

	assert.equal( jQuery( "#sap" ).text(), expected, "Check for prepending of array of elements" );
} );

QUnit.test( "prepend(Function) with incoming value -- jQuery", function( assert ) {

	assert.expect( 2 );

	var old, expected;
	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	old = jQuery( "#sap" ).html();

	jQuery( "#sap" ).prepend( function( i, val ) {
		assert.equal( val, old, "Make sure the incoming value is correct." );
		return jQuery( "#yahoo, #first" );
	} );

	assert.equal( jQuery( "#sap" ).text(), expected, "Check for prepending of jQuery object" );
} );

QUnit.test( "prependTo(String)", function( assert ) {

	assert.expect( 2 );

	var defaultText;

	defaultText = "Try them out:";
	jQuery( "<b>buga</b>" ).prependTo( "#first" );
	assert.equal( jQuery( "#first" ).text(), "buga" + defaultText, "Check if text prepending works" );
	assert.equal( jQuery( "<option value='prependTest'>Prepend Test</option>" ).prependTo( "#select3" ).parent().find( "option:first-child" ).attr( "value" ), "prependTest", "Prepending html options to select element" );

} );

QUnit.test( "prependTo(Element)", function( assert ) {

	assert.expect( 1 );

	var expected;

	expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery( document.getElementById( "first" ) ).prependTo( "#sap" );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for prepending of element" );
} );

QUnit.test( "prependTo(Array<Element>)", function( assert ) {

	assert.expect( 1 );

	var expected;

	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery( [ document.getElementById( "first" ), document.getElementById( "yahoo" ) ] ).prependTo( "#sap" );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for prepending of array of elements" );
} );

QUnit.test( "prependTo(jQuery)", function( assert ) {

	assert.expect( 1 );

	var expected;

	expected = "YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery( "#yahoo, #first" ).prependTo( "#sap" );
	assert.equal( jQuery( "#sap" ).text(), expected, "Check for prepending of jQuery object" );
} );

QUnit.test( "prependTo(Array<jQuery>)", function( assert ) {

	assert.expect( 1 );

	jQuery( "<select id='prependSelect1'></select>" ).prependTo( "#form" );
	jQuery( "<select id='prependSelect2'><option>Test</option></select>" ).prependTo( "#form" );

	assert.t( "Prepend Select", "#prependSelect2, #prependSelect1", [ "prependSelect2", "prependSelect1" ] );
} );

QUnit.test( "before(String)", function( assert ) {

	assert.expect( 1 );

	var expected;

	expected = "This is a normal link: bugaYahoo";
	jQuery( "#yahoo" ).before( manipulationBareObj( "<b>buga</b>" ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert String before" );
} );

QUnit.test( "before(Element)", function( assert ) {

	assert.expect( 1 );

	var expected;

	expected = "This is a normal link: Try them out:Yahoo";
	jQuery( "#yahoo" ).before( manipulationBareObj( document.getElementById( "first" ) ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert element before" );
} );

QUnit.test( "before(Array<Element>)", function( assert ) {

	assert.expect( 1 );

	var expected;
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery( "#yahoo" ).before( manipulationBareObj( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert array of elements before" );
} );

QUnit.test( "before(jQuery)", function( assert ) {

	assert.expect( 1 );

	var expected;
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	jQuery( "#yahoo" ).before( manipulationBareObj( jQuery( "#mark, #first" ) ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert jQuery before" );
} );

QUnit.test( "before(Array<jQuery>)", function( assert ) {

	assert.expect( 1 );

	var expected;
	expected = "This is a normal link: Try them out:GooglediveintomarkYahoo";
	jQuery( "#yahoo" ).before( manipulationBareObj( [ jQuery( "#first" ), jQuery( "#mark, #google" ) ] ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert array of jQuery objects before" );
} );

QUnit.test( "before(Function) -- Returns String", function( assert ) {

	assert.expect( 1 );

	var expected;

	expected = "This is a normal link: bugaYahoo";
	jQuery( "#yahoo" ).before( manipulationFunctionReturningObj( "<b>buga</b>" ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert String before" );
} );

QUnit.test( "before(Function) -- Returns Element", function( assert ) {

	assert.expect( 1 );

	var expected;

	expected = "This is a normal link: Try them out:Yahoo";
	jQuery( "#yahoo" ).before( manipulationFunctionReturningObj( document.getElementById( "first" ) ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert element before" );
} );

QUnit.test( "before(Function) -- Returns Array<Element>", function( assert ) {

	assert.expect( 1 );

	var expected;
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery( "#yahoo" ).before( manipulationFunctionReturningObj( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert array of elements before" );
} );

QUnit.test( "before(Function) -- Returns jQuery", function( assert ) {

	assert.expect( 1 );

	var expected;
	expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	jQuery( "#yahoo" ).before( manipulationFunctionReturningObj( jQuery( "#mark, #first" ) ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert jQuery before" );
} );

QUnit.test( "before(Function) -- Returns Array<jQuery>", function( assert ) {

	assert.expect( 1 );

	var expected;
	expected = "This is a normal link: Try them out:GooglediveintomarkYahoo";
	jQuery( "#yahoo" ).before( manipulationFunctionReturningObj( [ jQuery( "#first" ), jQuery( "#mark, #google" ) ] ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert array of jQuery objects before" );
} );

QUnit.test( "before(no-op)", function( assert ) {

	assert.expect( 2 );

	var set;
	set = jQuery( "<div/>" ).before( "<span>test</span>" );
	assert.equal( set[ 0 ].nodeName.toLowerCase(), "div", "Insert before a disconnected node should be a no-op" );
	assert.equal( set.length, 1, "Insert the element before the disconnected node. should be a no-op" );
} );

QUnit.test( "before and after w/ empty object (#10812)", function( assert ) {

	assert.expect( 1 );

	var res;

	res = jQuery( "#notInTheDocument" ).before( "(" ).after( ")" );
	assert.equal( res.length, 0, "didn't choke on empty object" );
} );

QUnit.test( ".before() and .after() disconnected node", function( assert ) {

	assert.expect( 2 );

	assert.equal( jQuery( "<input type='checkbox'/>" ).before( "<div/>" ).length, 1, "before() on disconnected node is no-op" );
	assert.equal( jQuery( "<input type='checkbox'/>" ).after( "<div/>" ).length, 1, "after() on disconnected node is no-op" );
} );

QUnit.test( "insert with .before() on disconnected node last", function( assert ) {

	assert.expect( 1 );

	var expectedBefore = "This is a normal link: bugaYahoo";

	jQuery( "#yahoo" ).add( "<span/>" ).before( "<b>buga</b>" );
	assert.equal( jQuery( "#en" ).text(), expectedBefore, "Insert String before with disconnected node last" );
} );

QUnit.test( "insert with .before() on disconnected node first", function( assert ) {

	assert.expect( 1 );

	var expectedBefore = "This is a normal link: bugaYahoo";

	jQuery( "<span/>" ).add( "#yahoo" ).before( "<b>buga</b>" );
	assert.equal( jQuery( "#en" ).text(), expectedBefore, "Insert String before with disconnected node first" );
} );

QUnit.test( "insert with .before() on disconnected node last", function( assert ) {

	assert.expect( 1 );

	var expectedAfter = "This is a normal link: Yahoobuga";

	jQuery( "#yahoo" ).add( "<span/>" ).after( "<b>buga</b>" );
	assert.equal( jQuery( "#en" ).text(), expectedAfter, "Insert String after with disconnected node last" );
} );

QUnit.test( "insert with .before() on disconnected node last", function( assert ) {

	assert.expect( 1 );

	var expectedAfter = "This is a normal link: Yahoobuga";

	jQuery( "<span/>" ).add( "#yahoo" ).after( "<b>buga</b>" );
	assert.equal( jQuery( "#en" ).text(), expectedAfter, "Insert String after with disconnected node first" );
} );

QUnit.test( "insertBefore(String)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: bugaYahoo";
	jQuery( "<b>buga</b>" ).insertBefore( "#yahoo" );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert String before" );
} );

QUnit.test( "insertBefore(Element)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: Try them out:Yahoo";
	jQuery( document.getElementById( "first" ) ).insertBefore( "#yahoo" );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert element before" );
} );

QUnit.test( "insertBefore(Array<Element>)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] ).insertBefore( "#yahoo" );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert array of elements before" );
} );

QUnit.test( "insertBefore(jQuery)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: diveintomarkTry them out:Yahoo";
	jQuery( "#mark, #first" ).insertBefore( "#yahoo" );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert jQuery before" );
} );

QUnit.test( ".after(String)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: Yahoobuga";
	jQuery( "#yahoo" ).after( "<b>buga</b>" );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert String after" );
} );

QUnit.test( ".after(Element)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: YahooTry them out:";
	jQuery( "#yahoo" ).after( document.getElementById( "first" ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert element after" );
} );

QUnit.test( ".after(Array<Element>)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery( "#yahoo" ).after( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert array of elements after" );
} );

QUnit.test( ".after(jQuery)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: YahooTry them out:Googlediveintomark";
	jQuery( "#yahoo" ).after( [ jQuery( "#first" ), jQuery( "#mark, #google" ) ] );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert array of jQuery objects after" );
} );

QUnit.test( ".after(Function) returns String", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: Yahoobuga",
		val = manipulationFunctionReturningObj;
	jQuery( "#yahoo" ).after( val( "<b>buga</b>" ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert String after" );
} );

QUnit.test( ".after(Function) returns Element", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: YahooTry them out:",
		val = manipulationFunctionReturningObj;
	jQuery( "#yahoo" ).after( val( document.getElementById( "first" ) ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert element after" );
} );

QUnit.test( ".after(Function) returns Array<Element>", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: YahooTry them out:diveintomark",
		val = manipulationFunctionReturningObj;
	jQuery( "#yahoo" ).after( val( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert array of elements after" );
} );

QUnit.test( ".after(Function) returns jQuery", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: YahooTry them out:Googlediveintomark",
		val = manipulationFunctionReturningObj;
	jQuery( "#yahoo" ).after( val( [ jQuery( "#first" ), jQuery( "#mark, #google" ) ] ) );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert array of jQuery objects after" );
} );

QUnit.test( ".after(disconnected node)", function( assert ) {

	assert.expect( 2 );

	var set = jQuery( "<div/>" ).before( "<span>test</span>" );
	assert.equal( set[ 0 ].nodeName.toLowerCase(), "div", "Insert after a disconnected node should be a no-op" );
	assert.equal( set.length, 1, "Insert the element after the disconnected node should be a no-op" );
} );

QUnit.test( "insertAfter(String)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: Yahoobuga";
	jQuery( "<b>buga</b>" ).insertAfter( "#yahoo" );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert String after" );
} );

QUnit.test( "insertAfter(Element)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: YahooTry them out:";
	jQuery( document.getElementById( "first" ) ).insertAfter( "#yahoo" );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert element after" );
} );

QUnit.test( "insertAfter(Array<Element>)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] ).insertAfter( "#yahoo" );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert array of elements after" );
} );

QUnit.test( "insertAfter(jQuery)", function( assert ) {

	assert.expect( 1 );

	var expected = "This is a normal link: YahoodiveintomarkTry them out:";
	jQuery( "#mark, #first" ).insertAfter( "#yahoo" );
	assert.equal( jQuery( "#en" ).text(), expected, "Insert jQuery after" );
} );

function testReplaceWith( val, assert ) {

	var tmp, y, child, child2, set, nonExistent, $div,
		expected = 29;

	assert.expect( expected );

	jQuery( "#yahoo" ).replaceWith( val( "<b id='replace'>buga</b>" ) );
	assert.ok( jQuery( "#replace" )[ 0 ], "Replace element with element from string" );
	assert.ok( !jQuery( "#yahoo" )[ 0 ], "Verify that original element is gone, after string" );

	jQuery( "#anchor2" ).replaceWith( val( document.getElementById( "first" ) ) );
	assert.ok( jQuery( "#first" )[ 0 ], "Replace element with element" );
	assert.ok( !jQuery( "#anchor2" )[ 0 ], "Verify that original element is gone, after element" );

	jQuery( "#qunit-fixture" ).append( "<div id='bar'><div id='baz'></div></div>" );
	jQuery( "#baz" ).replaceWith( val( "Baz" ) );
	assert.equal( jQuery( "#bar" ).text(), "Baz", "Replace element with text" );
	assert.ok( !jQuery( "#baz" )[ 0 ], "Verify that original element is gone, after element" );

	jQuery( "#bar" ).replaceWith( "<div id='yahoo'></div>", "...", "<div id='baz'></div>" );
	assert.deepEqual( jQuery( "#yahoo, #baz" ).get(), q( "yahoo", "baz" ),  "Replace element with multiple arguments (#13722)" );
	assert.strictEqual( jQuery( "#yahoo" )[ 0 ].nextSibling, jQuery( "#baz" )[ 0 ].previousSibling, "Argument order preserved" );
	assert.deepEqual( jQuery( "#bar" ).get(), [], "Verify that original element is gone, after multiple arguments" );

	jQuery( "#google" ).replaceWith( val( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] ) );
	assert.deepEqual( jQuery( "#mark, #first" ).get(), q( "first", "mark" ),  "Replace element with array of elements" );
	assert.ok( !jQuery( "#google" )[ 0 ], "Verify that original element is gone, after array of elements" );

	jQuery( "#groups" ).replaceWith( val( jQuery( "#mark, #first" ) ) );
	assert.deepEqual( jQuery( "#mark, #first" ).get(), q( "first", "mark" ),  "Replace element with jQuery collection" );
	assert.ok( !jQuery( "#groups" )[ 0 ], "Verify that original element is gone, after jQuery collection" );

	jQuery( "#mark, #first" ).replaceWith( val( "<span class='replacement'></span><span class='replacement'></span>" ) );
	assert.equal( jQuery( "#qunit-fixture .replacement" ).length, 4, "Replace multiple elements (#12449)" );
	assert.deepEqual( jQuery( "#mark, #first" ).get(), [], "Verify that original elements are gone, after replace multiple" );

	tmp = jQuery( "<b>content</b>" )[ 0 ];
	jQuery( "#anchor1" ).contents().replaceWith( val( tmp ) );
	assert.deepEqual( jQuery( "#anchor1" ).contents().get(), [ tmp ], "Replace text node with element" );

	tmp = jQuery( "<div/>" ).appendTo( "#qunit-fixture" ).on( "click", function() {
		assert.ok( true, "Newly bound click run." );
	} );
	y = jQuery( "<div/>" ).appendTo( "#qunit-fixture" ).on( "click", function() {
		assert.ok( false, "Previously bound click run." );
	} );
	child = y.append( "<b>test</b>" ).find( "b" ).on( "click", function() {
		assert.ok( true, "Child bound click run." );
		return false;
	} );

	y.replaceWith( val( tmp ) );

	tmp.trigger( "click" );
	y.trigger( "click" ); // Shouldn't be run
	child.trigger( "click" ); // Shouldn't be run

	y = jQuery( "<div/>" ).appendTo( "#qunit-fixture" ).on( "click", function() {
		assert.ok( false, "Previously bound click run." );
	} );
	child2 = y.append( "<u>test</u>" ).find( "u" ).on( "click", function() {
		assert.ok( true, "Child 2 bound click run." );
		return false;
	} );

	y.replaceWith( val( child2 ) );

	child2.trigger( "click" );

	set = jQuery( "<div/>" ).replaceWith( val( "<span>test</span>" ) );
	assert.equal( set[ 0 ].nodeName.toLowerCase(), "div", "No effect on a disconnected node." );
	assert.equal( set.length, 1, "No effect on a disconnected node." );
	assert.equal( set[ 0 ].childNodes.length, 0, "No effect on a disconnected node." );

	child = jQuery( "#qunit-fixture" ).children().first();
	$div = jQuery( "<div class='pathological'/>" ).insertBefore( child );
	$div.replaceWith( $div );
	assert.deepEqual( jQuery( ".pathological", "#qunit-fixture" ).get(), $div.get(),
		"Self-replacement" );
	$div.replaceWith( child );
	assert.deepEqual( jQuery( "#qunit-fixture" ).children().first().get(), child.get(),
		"Replacement with following sibling (#13810)" );
	assert.deepEqual( jQuery( ".pathological", "#qunit-fixture" ).get(), [],
		"Replacement with following sibling (context removed)" );

	nonExistent = jQuery( "#does-not-exist" ).replaceWith( val( "<b>should not throw an error</b>" ) );
	assert.equal( nonExistent.length, 0, "Length of non existent element." );

	$div = jQuery( "<div class='replacewith'></div>" ).appendTo( "#qunit-fixture" );
	$div.replaceWith( val( "<div class='replacewith'></div><script>" +
		"equal( jQuery('.replacewith').length, 1, 'Check number of elements in page.' );" +
		"</script>" ) );

	jQuery( "#qunit-fixture" ).append( "<div id='replaceWith'></div>" );
	assert.equal( jQuery( "#qunit-fixture" ).find( "div[id=replaceWith]" ).length, 1, "Make sure only one div exists." );
	jQuery( "#replaceWith" ).replaceWith( val( "<div id='replaceWith'></div>" ) );
	assert.equal( jQuery( "#qunit-fixture" ).find( "div[id=replaceWith]" ).length, 1, "Make sure only one div exists after replacement." );
	jQuery( "#replaceWith" ).replaceWith( val( "<div id='replaceWith'></div>" ) );
	assert.equal( jQuery( "#qunit-fixture" ).find( "div[id=replaceWith]" ).length, 1, "Make sure only one div exists after subsequent replacement." );

	return expected;
}

QUnit.test( "replaceWith(String|Element|Array<Element>|jQuery)", function( assert ) {
	testReplaceWith( manipulationBareObj, assert );
} );

QUnit.test( "replaceWith(Function)", function( assert ) {
	assert.expect( testReplaceWith( manipulationFunctionReturningObj, assert ) + 1 );

	var y = jQuery( "#foo" )[ 0 ];

	jQuery( y ).replaceWith( function() {
		assert.equal( this, y, "Make sure the context is coming in correctly." );
	} );
} );

QUnit.test( "replaceWith(string) for more than one element", function( assert ) {

	assert.expect( 3 );

	assert.equal( jQuery( "#foo p" ).length, 3, "ensuring that test data has not changed" );

	jQuery( "#foo p" ).replaceWith( "<span>bar</span>" );
	assert.equal( jQuery( "#foo span" ).length, 3, "verify that all the three original element have been replaced" );
	assert.equal( jQuery( "#foo p" ).length, 0, "verify that all the three original element have been replaced" );
} );

QUnit.test( "Empty replaceWith (trac-13401; trac-13596; gh-2204)", function( assert ) {

	assert.expect( 25 );

	var $el = jQuery( "<div/><div/>" ).html( "<p>0</p>" ),
		expectedHTML = $el.html(),
		tests = {
			"empty string": "",
			"empty array": [],
			"array of empty string": [ "" ],
			"empty collection": jQuery( "#nonexistent" ),

			// in case of jQuery(...).replaceWith();
			"undefined": undefined
		};

	jQuery.each( tests, function( label, input ) {
		$el.html( "<a/>" ).children().replaceWith( input );
		assert.strictEqual( $el.html(), "", "replaceWith(" + label + ")" );
		$el.html( "<b/>" ).children().replaceWith( function() { return input; } );
		assert.strictEqual( $el.html(), "", "replaceWith(function returning " + label + ")" );
		$el.html( "<i/>" ).children().replaceWith( function( i ) { return input; } );
		assert.strictEqual( $el.html(), "", "replaceWith(other function returning " + label + ")" );
		$el.html( "<p/>" ).children().replaceWith( function( i ) {
			return i ?
				input :
				jQuery( this ).html( i + "" );
		} );
		assert.strictEqual( $el.eq( 0 ).html(), expectedHTML,
			"replaceWith(function conditionally returning context)" );
		assert.strictEqual( $el.eq( 1 ).html(), "",
			"replaceWith(function conditionally returning " + label + ")" );
	} );
} );

QUnit.test( "replaceAll(String)", function( assert ) {

	assert.expect( 2 );

	jQuery( "<b id='replace'>buga</b>" ).replaceAll( "#yahoo" );
	assert.ok( jQuery( "#replace" )[ 0 ], "Replace element with string" );
	assert.ok( !jQuery( "#yahoo" )[ 0 ], "Verify that original element is gone, after string" );
} );

QUnit.test( "replaceAll(Element)", function( assert ) {

	assert.expect( 2 );

	jQuery( document.getElementById( "first" ) ).replaceAll( "#yahoo" );
	assert.ok( jQuery( "#first" )[ 0 ], "Replace element with element" );
	assert.ok( !jQuery( "#yahoo" )[ 0 ], "Verify that original element is gone, after element" );
} );

QUnit.test( "replaceAll(Array<Element>)", function( assert ) {

	assert.expect( 3 );

	jQuery( [ document.getElementById( "first" ), document.getElementById( "mark" ) ] ).replaceAll( "#yahoo" );
	assert.ok( jQuery( "#first" )[ 0 ], "Replace element with array of elements" );
	assert.ok( jQuery( "#mark" )[ 0 ], "Replace element with array of elements" );
	assert.ok( !jQuery( "#yahoo" )[ 0 ], "Verify that original element is gone, after array of elements" );
} );

QUnit.test( "replaceAll(jQuery)", function( assert ) {

	assert.expect( 3 );

	jQuery( "#mark, #first" ).replaceAll( "#yahoo" );
	assert.ok( jQuery( "#first" )[ 0 ], "Replace element with set of elements" );
	assert.ok( jQuery( "#mark" )[ 0 ], "Replace element with set of elements" );
	assert.ok( !jQuery( "#yahoo" )[ 0 ], "Verify that original element is gone, after set of elements" );
} );

QUnit.test( "jQuery.clone() (#8017)", function( assert ) {

	assert.expect( 2 );

	assert.ok( jQuery.clone && jQuery.isFunction( jQuery.clone ), "jQuery.clone() utility exists and is a function." );

	var main = jQuery( "#qunit-fixture" )[ 0 ],
		clone = jQuery.clone( main );

	assert.equal( main.childNodes.length, clone.childNodes.length, "Simple child length to ensure a large dom tree copies correctly" );
} );

QUnit.test( "append to multiple elements (#8070)", function( assert ) {

	assert.expect( 2 );

	var selects = jQuery( "<select class='test8070'></select><select class='test8070'></select>" ).appendTo( "#qunit-fixture" );
	selects.append( "<OPTION>1</OPTION><OPTION>2</OPTION>" );

	assert.equal( selects[ 0 ].childNodes.length, 2, "First select got two nodes" );
	assert.equal( selects[ 1 ].childNodes.length, 2, "Second select got two nodes" );
} );

QUnit.test( "table manipulation", function( assert ) {
	assert.expect( 2 );

	var table = jQuery( "<table style='font-size:16px'></table>" ).appendTo( "#qunit-fixture" ).empty(),
		height = table[ 0 ].offsetHeight;

	table.append( "<tr><td>DATA</td></tr>" );
	assert.ok( table[ 0 ].offsetHeight - height >= 15, "appended rows are visible" );

	table.empty();
	height = table[ 0 ].offsetHeight;
	table.prepend( "<tr><td>DATA</td></tr>" );
	assert.ok( table[ 0 ].offsetHeight - height >= 15, "prepended rows are visible" );
} );

QUnit.test( "clone()", function( assert ) {

	assert.expect( 45 );

	var div, clone, form, body;

	assert.equal( jQuery( "#en" ).text(), "This is a normal link: Yahoo", "Assert text for #en" );
	assert.equal( jQuery( "#first" ).append( jQuery( "#yahoo" ).clone() ).text(), "Try them out:Yahoo", "Check for clone" );
	assert.equal( jQuery( "#en" ).text(), "This is a normal link: Yahoo", "Reassert text for #en" );

	jQuery.each( "table thead tbody tfoot tr td div button ul ol li select option textarea iframe".split( " " ), function( i, nodeName ) {
		assert.equal( jQuery( "<" + nodeName + "/>" ).clone()[ 0 ].nodeName.toLowerCase(), nodeName, "Clone a " + nodeName );
	} );
	assert.equal( jQuery( "<input type='checkbox' />" ).clone()[ 0 ].nodeName.toLowerCase(), "input", "Clone a <input type='checkbox' />" );

	// Check cloning non-elements
	assert.equal( jQuery( "#nonnodes" ).contents().clone().length, 3, "Check node,textnode,comment clone works (some browsers delete comments on clone)" );

	// Verify that clones of clones can keep event listeners
	div = jQuery( "<div><ul><li>test</li></ul></div>" ).on( "click", function() {
		assert.ok( true, "Bound event still exists." );
	} );
	clone = div.clone( true ); div.remove();
	div = clone.clone( true ); clone.remove();

	assert.equal( div.length, 1, "One element cloned" );
	assert.equal( div[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div.trigger( "click" );

	// Manually clean up detached elements
	div.remove();

	// Verify that cloned children can keep event listeners
	div = jQuery( "<div/>" ).append( [ document.createElement( "table" ), document.createElement( "table" ) ] );
	div.find( "table" ).on( "click", function() {
		assert.ok( true, "Bound event still exists." );
	} );

	clone = div.clone( true );
	assert.equal( clone.length, 1, "One element cloned" );
	assert.equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	clone.find( "table" ).trigger( "click" );

	// Manually clean up detached elements
	div.remove();
	clone.remove();

	// Make sure that doing .clone() doesn't clone event listeners
	div = jQuery( "<div><ul><li>test</li></ul></div>" ).on( "click", function() {
		assert.ok( false, "Bound event still exists after .clone()." );
	} );
	clone = div.clone();

	clone.trigger( "click" );

	// Manually clean up detached elements
	clone.remove();
	div.remove();

	// Test both html() and clone() for <embed> and <object> types
	div = jQuery( "<div/>" ).html( "<embed height='355' width='425' src='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'></embed>" );

	clone = div.clone( true );
	assert.equal( clone.length, 1, "One element cloned" );
	assert.equal( clone.html(), div.html(), "Element contents cloned" );
	assert.equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	// this is technically an invalid object, but because of the special
	// classid instantiation it is the only kind that IE has trouble with,
	// so let's test with it too.
	div = jQuery( "<div/>" ).html( "<object height='355' width='425' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>" );

	clone = div.clone( true );
	assert.equal( clone.length, 1, "One element cloned" );
	assert.equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );
	div = div.find( "object" );
	clone = clone.find( "object" );

	// oldIE adds extra attributes and <param> elements, so just test for existence of the defined set
	jQuery.each( [ "height", "width", "classid" ], function( i, attr ) {
		assert.equal( clone.attr( attr ), div.attr( attr ), "<object> attribute cloned: " + attr );
	} );
	( function() {
		var params = {};

		clone.find( "param" ).each( function( index, param ) {
			params[ param.attributes.name.nodeValue.toLowerCase() ] =
				param.attributes.value.nodeValue.toLowerCase();
		} );

		div.find( "param" ).each( function( index, param ) {
			var key = param.attributes.name.nodeValue.toLowerCase();
			assert.equal( params[ key ], param.attributes.value.nodeValue.toLowerCase(), "<param> cloned: " + key );
		} );
	} )();

	// and here's a valid one.
	div = jQuery( "<div/>" ).html( "<object height='355' width='425' type='application/x-shockwave-flash' data='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='movie' value='http://www.youtube.com/v/3KANI2dpXLw&amp;hl=en'>  <param name='wmode' value='transparent'> </object>" );

	clone = div.clone( true );
	assert.equal( clone.length, 1, "One element cloned" );
	assert.equal( clone.html(), div.html(), "Element contents cloned" );
	assert.equal( clone[ 0 ].nodeName.toUpperCase(), "DIV", "DIV element cloned" );

	div = jQuery( "<div/>" ).data( { "a": true } );
	clone = div.clone( true );
	assert.equal( clone.data( "a" ), true, "Data cloned." );
	clone.data( "a", false );
	assert.equal( clone.data( "a" ), false, "Ensure cloned element data object was correctly modified" );
	assert.equal( div.data( "a" ), true, "Ensure cloned element data object is copied, not referenced" );

	// manually clean up detached elements
	div.remove();
	clone.remove();

	form = document.createElement( "form" );
	form.action = "/test/";

	div = document.createElement( "div" );
	div.appendChild( document.createTextNode( "test" ) );
	form.appendChild( div );

	assert.equal( jQuery( form ).clone().children().length, 1, "Make sure we just get the form back." );

	body = jQuery( "body" ).clone();
	assert.equal( body.children()[ 0 ].id, "qunit", "Make sure cloning body works" );
	body.remove();
} );

QUnit.test( "clone(script type=non-javascript) (#11359)", function( assert ) {

	assert.expect( 3 );

	var src = jQuery( "<script type='text/filler'>Lorem ipsum dolor sit amet</script><q><script type='text/filler'>consectetur adipiscing elit</script></q>" ),
		dest = src.clone();

	assert.equal( dest[ 0 ].text, "Lorem ipsum dolor sit amet", "Cloning preserves script text" );
	assert.equal( dest.last().html(), src.last().html(), "Cloning preserves nested script text" );
	assert.ok( /^\s*<scr.pt\s+type=['"]?text\/filler['"]?\s*>consectetur adipiscing elit<\/scr.pt>\s*$/i.test( dest.last().html() ), "Cloning preserves nested script text" );
	dest.remove();
} );

QUnit.test( "clone(form element) (Bug #3879, #6655)", function( assert ) {

	assert.expect( 5 );

	var clone, element;

	element = jQuery( "<select><option>Foo</option><option value='selected' selected>Bar</option></select>" );

	assert.equal( element.clone().find( "option" ).filter( function() { return this.selected; } ).val(), "selected", "Selected option cloned correctly" );

	element = jQuery( "<input type='checkbox' value='foo'>" ).attr( "checked", "checked" );
	clone = element.clone();

	assert.equal( clone.is( ":checked" ), element.is( ":checked" ), "Checked input cloned correctly" );
	assert.equal( clone[ 0 ].defaultValue, "foo", "Checked input defaultValue cloned correctly" );

	element = jQuery( "<input type='text' value='foo'>" );
	clone = element.clone();
	assert.equal( clone[ 0 ].defaultValue, "foo", "Text input defaultValue cloned correctly" );

	element = jQuery( "<textarea>foo</textarea>" );
	clone = element.clone();
	assert.equal( clone[ 0 ].defaultValue, "foo", "Textarea defaultValue cloned correctly" );
} );

QUnit.test( "clone(multiple selected options) (Bug #8129)", function( assert ) {

	assert.expect( 1 );

	var element = jQuery( "<select><option>Foo</option><option selected>Bar</option><option selected>Baz</option></select>" );

	function getSelectedOptions( collection ) {
		return collection.find( "option" ).filter( function( option ) {
			return option.selected;
		} );
	}

	assert.equal(
		getSelectedOptions( element.clone() ).length,
		getSelectedOptions( element ).length,
		"Multiple selected options cloned correctly"
	);
} );

QUnit.test( "clone() on XML nodes", function( assert ) {

	assert.expect( 2 );

	var xml = createDashboardXML(),
		root = jQuery( xml.documentElement ).clone(),
		origTab = jQuery( "tab", xml ).eq( 0 ),
		cloneTab = jQuery( "tab", root ).eq( 0 );

	origTab.text( "origval" );
	cloneTab.text( "cloneval" );
	assert.equal( origTab.text(), "origval", "Check original XML node was correctly set" );
	assert.equal( cloneTab.text(), "cloneval", "Check cloned XML node was correctly set" );
} );

QUnit.test( "clone() on local XML nodes with html5 nodename", function( assert ) {

	assert.expect( 2 );

	var $xmlDoc = jQuery( jQuery.parseXML( "<root><meter /></root>" ) ),
		$meter = $xmlDoc.find( "meter" ).clone();

	assert.equal( $meter[ 0 ].nodeName, "meter", "Check if nodeName was not changed due to cloning" );
	assert.equal( $meter[ 0 ].nodeType, 1, "Check if nodeType is not changed due to cloning" );
} );

QUnit.test( "html(undefined)", function( assert ) {

	assert.expect( 1 );

	assert.equal( jQuery( "#foo" ).html( "<i>test</i>" ).html( undefined ).html().toLowerCase(), "<i>test</i>", ".html(undefined) is chainable (#5571)" );
} );

QUnit.test( "html() on empty set", function( assert ) {

	assert.expect( 1 );

	assert.strictEqual( jQuery().html(), undefined, ".html() returns undefined for empty sets (#11962)" );
} );

function childNodeNames( node ) {
	return jQuery.map( node.childNodes, function( child ) {
		return child.nodeName.toUpperCase();
	} ).join( " " );
}

function testHtml( valueObj, assert ) {
	assert.expect( 40 );

	var actual, expected, tmp,
		div = jQuery( "<div></div>" ),
		fixture = jQuery( "#qunit-fixture" );

	div.html( valueObj( "<div id='parent_1'><div id='child_1'/></div><div id='parent_2'/>" ) );
	assert.equal( div.children().length, 2, "Found children" );
	assert.equal( div.children().children().length, 1, "Found grandchild" );

	actual = []; expected = [];
	tmp = jQuery( "<map/>" ).html( valueObj( "<area alt='area'/>" ) ).each( function() {
		expected.push( "AREA" );
		actual.push( childNodeNames( this ) );
	} );
	assert.equal( expected.length, 1, "Expecting one parent" );
	assert.deepEqual( actual, expected, "Found the inserted area element" );

	assert.equal( div.html( valueObj( 5 ) ).html(), "5", "Setting a number as html" );
	assert.equal( div.html( valueObj( 0 ) ).html(), "0", "Setting a zero as html" );
	assert.equal( div.html( valueObj( Infinity ) ).html(), "Infinity", "Setting Infinity as html" );
	assert.equal( div.html( valueObj( NaN ) ).html(), "", "Setting NaN as html" );
	assert.equal( div.html( valueObj( 1e2 ) ).html(), "100", "Setting exponential number notation as html" );

	div.html( valueObj( "&#160;&amp;" ) );
	assert.equal(
		div[ 0 ].innerHTML.replace( /\xA0/, "&nbsp;" ),
		"&nbsp;&amp;",
		"Entities are passed through correctly"
	);

	tmp = "&lt;div&gt;hello1&lt;/div&gt;";
	assert.equal( div.html( valueObj( tmp ) ).html().replace( />/g, "&gt;" ), tmp, "Escaped html" );
	tmp = "x" + tmp;
	assert.equal( div.html( valueObj( tmp ) ).html().replace( />/g, "&gt;" ), tmp, "Escaped html, leading x" );
	tmp = " " + tmp.slice( 1 );
	assert.equal( div.html( valueObj( tmp ) ).html().replace( />/g, "&gt;" ), tmp, "Escaped html, leading space" );

	actual = []; expected = []; tmp = {};
	jQuery( "#nonnodes" ).contents().html( valueObj( "<b>bold</b>" ) ).each( function() {
		var html = jQuery( this ).html();
		tmp[ this.nodeType ] = true;
		expected.push( this.nodeType === 1 ? "<b>bold</b>" : undefined );
		actual.push( html ? html.toLowerCase() : html );
	} );
	assert.deepEqual( actual, expected, "Set containing element, text node, comment" );
	assert.ok( tmp[ 1 ], "element" );
	assert.ok( tmp[ 3 ], "text node" );
	assert.ok( tmp[ 8 ], "comment" );

	actual = []; expected = [];
	fixture.children( "div" ).html( valueObj( "<b>test</b>" ) ).each( function() {
		expected.push( "B" );
		actual.push( childNodeNames( this ) );
	} );
	assert.equal( expected.length, 7, "Expecting many parents" );
	assert.deepEqual( actual, expected, "Correct childNodes after setting HTML" );

	actual = []; expected = [];
	fixture.html( valueObj( "<style>.foobar{color:green;}</style>" ) ).each( function() {
		expected.push( "STYLE" );
		actual.push( childNodeNames( this ) );
	} );
	assert.equal( expected.length, 1, "Expecting one parent" );
	assert.deepEqual( actual, expected, "Found the inserted style element" );

	fixture.html( valueObj( "<select/>" ) );
	jQuery( "#qunit-fixture select" ).html( valueObj( "<option>O1</option><option selected='selected'>O2</option><option>O3</option>" ) );
	assert.equal( jQuery( "#qunit-fixture select" ).val(), "O2", "Selected option correct" );

	tmp = fixture.html(
		valueObj( [
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
		].join( "" ) )
	).find( "script" );
	assert.equal( tmp.length, 8, "All script tags remain." );
	assert.equal( tmp[ 0 ].type, "something/else", "Non-evaluated type." );
	assert.equal( tmp[ 1 ].type, "text/javascript", "Evaluated type." );

	fixture.html( valueObj( "<script type='text/javascript'>ok( true, 'Injection of identical script' );</script>" ) );
	fixture.html( valueObj( "<script type='text/javascript'>ok( true, 'Injection of identical script' );</script>" ) );
	fixture.html( valueObj( "<script type='text/javascript'>ok( true, 'Injection of identical script' );</script>" ) );
	fixture.html( valueObj( "foo <form><script type='text/javascript'>ok( true, 'Injection of identical script (#975)' );</script></form>" ) );

	jQuery.scriptorder = 0;
	fixture.html( valueObj( [
		"<script>",
			"equal( jQuery('#scriptorder').length, 1,'Execute after html' );",
			"equal( jQuery.scriptorder++, 0, 'Script is executed in order' );",
		"</script>",
		"<span id='scriptorder'><script>equal( jQuery.scriptorder++, 1, 'Script (nested) is executed in order');</script></span>",
		"<script>equal( jQuery.scriptorder++, 2, 'Script (unnested) is executed in order' );</script>"
	].join( "" ) ) );

	fixture.html( valueObj( fixture.text() ) );
	assert.ok( /^[^<]*[^<\s][^<]*$/.test( fixture.html() ), "Replace html with text" );
}

QUnit.test( "html(String|Number)", function( assert ) {
	testHtml( manipulationBareObj, assert  );
} );

QUnit.test( "html(Function)", function( assert ) {
	testHtml( manipulationFunctionReturningObj, assert  );
} );

QUnit.test( "html(Function) with incoming value -- direct selection", function( assert ) {

	assert.expect( 4 );

	var els, actualhtml, pass;

	els = jQuery( "#foo > p" );
	actualhtml = els.map( function() {
		return jQuery( this ).html();
	} );

	els.html( function( i, val ) {
		assert.equal( val, actualhtml[ i ], "Make sure the incoming value is correct." );
		return "<b>test</b>";
	} );

	pass = true;
	els.each( function() {
		if ( this.childNodes.length !== 1 ) {
			pass = false;
		}
	} );
	assert.ok( pass, "Set HTML" );
} );

QUnit.test( "html(Function) with incoming value -- jQuery.contents()", function( assert ) {

	assert.expect( 14 );

	var actualhtml, j, $div, $div2, insert;

	j = jQuery( "#nonnodes" ).contents();
	actualhtml = j.map( function() {
		return jQuery( this ).html();
	} );

	j.html( function( i, val ) {
		assert.equal( val, actualhtml[ i ], "Make sure the incoming value is correct." );
		return "<b>bold</b>";
	} );

	// Handle the case where no comment is in the document
	if ( j.length === 2 ) {
		assert.equal( null, null, "Make sure the incoming value is correct." );
	}

	assert.equal( j.html().replace( / xmlns="[^"]+"/g, "" ).toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	$div = jQuery( "<div />" );

	assert.equal( $div.html( function( i, val ) {
		assert.equal( val, "", "Make sure the incoming value is correct." );
		return 5;
	} ).html(), "5", "Setting a number as html" );

	assert.equal( $div.html( function( i, val ) {
		assert.equal( val, "5", "Make sure the incoming value is correct." );
		return 0;
	} ).html(), "0", "Setting a zero as html" );

	$div2 = jQuery( "<div/>" );
	insert = "&lt;div&gt;hello1&lt;/div&gt;";
	assert.equal( $div2.html( function( i, val ) {
		assert.equal( val, "", "Make sure the incoming value is correct." );
		return insert;
	} ).html().replace( />/g, "&gt;" ), insert, "Verify escaped insertion." );

	assert.equal( $div2.html( function( i, val ) {
		assert.equal( val.replace( />/g, "&gt;" ), insert, "Make sure the incoming value is correct." );
		return "x" + insert;
	} ).html().replace( />/g, "&gt;" ), "x" + insert, "Verify escaped insertion." );

	assert.equal( $div2.html( function( i, val ) {
		assert.equal( val.replace( />/g, "&gt;" ), "x" + insert, "Make sure the incoming value is correct." );
		return " " + insert;
	} ).html().replace( />/g, "&gt;" ), " " + insert, "Verify escaped insertion." );
} );

QUnit.test( "clone()/html() don't expose jQuery/Sizzle expandos (#12858)", function( assert ) {

	assert.expect( 2 );

	var $content = jQuery( "<div><b><i>text</i></b></div>" ).appendTo( "#qunit-fixture" ),
		expected = /^<b><i>text<\/i><\/b>$/i;

	// Attach jQuery and Sizzle data (the latter with a non-qSA nth-child)
	try {
		$content.find( ":nth-child(1):lt(4)" ).data( "test", true );

	// But don't break on a non-Sizzle build
	} catch ( e ) {
		$content.find( "*" ).data( "test", true );
	}

	assert.ok( expected.test( $content.clone( false )[ 0 ].innerHTML ), "clone()" );
	assert.ok( expected.test( $content.html() ), "html()" );
} );

QUnit.test( "remove() no filters", function( assert ) {

	assert.expect( 2 );

	var first = jQuery( "#ap" ).children().first();

	first.data( "foo", "bar" );

	jQuery( "#ap" ).children().remove();
	assert.ok( jQuery( "#ap" ).text().length > 10, "Check text is not removed" );
	assert.equal( jQuery( "#ap" ).children().length, 0, "Check remove" );
} );

QUnit.test( "remove() with filters", function( assert ) {

	assert.expect( 8 );

	var markup, div;
	jQuery( "#ap" ).children().remove( "a" );
	assert.ok( jQuery( "#ap" ).text().length > 10, "Check text is not removed" );
	assert.equal( jQuery( "#ap" ).children().length, 1, "Check filtered remove" );

	jQuery( "#ap" ).children().remove( "a, code" );
	assert.equal( jQuery( "#ap" ).children().length, 0, "Check multi-filtered remove" );

	// Positional and relative selectors
	markup = "<div><span>1</span><span>2</span><span>3</span><span>4</span></div>";
	div = jQuery( markup );
	div.children().remove( "span:nth-child(2n)" );
	assert.equal( div.text(), "13", "relative selector in remove" );

	if ( jQuery.find.compile ) {
		div = jQuery( markup );
		div.children().remove( "span:first" );
		assert.equal( div.text(), "234", "positional selector in remove" );
		div = jQuery( markup );
		div.children().remove( "span:last" );
		assert.equal( div.text(), "123", "positional selector in remove" );
	} else {
		assert.ok( "skip", "Positional selectors not supported in selector-native" );
		assert.ok( "skip", "Positional selectors not supported in selector-native" );
	}

	// using contents will get comments regular, text, and comment nodes
	// Handle the case where no comment is in the document
	assert.ok( jQuery( "#nonnodes" ).contents().length >= 2, "Check node,textnode,comment remove works" );
	jQuery( "#nonnodes" ).contents().remove();
	assert.equal( jQuery( "#nonnodes" ).contents().length, 0, "Check node,textnode,comment remove works" );
} );

QUnit.test( "remove() event cleaning ", function( assert ) {
	assert.expect( 1 );

	var count, first, cleanUp;

	count = 0;
	first = jQuery( "#ap" ).children().first();
	cleanUp = first.on( "click", function() {
		count++;
	} ).remove().appendTo( "#qunit-fixture" ).trigger( "click" );

	assert.strictEqual( 0, count, "Event handler has been removed" );

	// Clean up detached data
	cleanUp.remove();
} );

QUnit.test( "remove() in document order #13779", function( assert ) {
	assert.expect( 1 );

	var last,
		cleanData = jQuery.cleanData;

	jQuery.cleanData = function( nodes ) {
		last = jQuery.text( nodes[ 0 ] );
		cleanData.call( this, nodes );
	};

	jQuery( "#qunit-fixture" ).append(
		jQuery.parseHTML(
			"<div class='removal-fixture'>1</div>" +
			"<div class='removal-fixture'>2</div>" +
			"<div class='removal-fixture'>3</div>"
		)
	);

	jQuery( ".removal-fixture" ).remove();

	assert.equal( last, 3, "The removal fixtures were removed in document order" );

	jQuery.cleanData = cleanData;
} );

QUnit.test( "detach() no filters", function( assert ) {

	assert.expect( 3 );

	var first = jQuery( "#ap" ).children().first();

	first.data( "foo", "bar" );

	jQuery( "#ap" ).children().detach();
	assert.ok( jQuery( "#ap" ).text().length > 10, "Check text is not removed" );
	assert.equal( jQuery( "#ap" ).children().length, 0, "Check remove" );

	assert.equal( first.data( "foo" ), "bar" );
	first.remove();

} );

QUnit.test( "detach() with filters", function( assert ) {

	assert.expect( 8 );

	var markup, div;
	jQuery( "#ap" ).children().detach( "a" );
	assert.ok( jQuery( "#ap" ).text().length > 10, "Check text is not removed" );
	assert.equal( jQuery( "#ap" ).children().length, 1, "Check filtered remove" );

	jQuery( "#ap" ).children().detach( "a, code" );
	assert.equal( jQuery( "#ap" ).children().length, 0, "Check multi-filtered remove" );

	// Positional and relative selectors
	markup = "<div><span>1</span><span>2</span><span>3</span><span>4</span></div>";
	div = jQuery( markup );
	div.children().detach( "span:nth-child(2n)" );
	assert.equal( div.text(), "13", "relative selector in detach" );

	if ( jQuery.find.compile ) {
		div = jQuery( markup );
		div.children().detach( "span:first" );
		assert.equal( div.text(), "234", "positional selector in detach" );
		div = jQuery( markup );
		div.children().detach( "span:last" );
		assert.equal( div.text(), "123", "positional selector in detach" );
	} else {
		assert.ok( "skip", "positional selectors not supported in selector-native" );
		assert.ok( "skip", "positional selectors not supported in selector-native" );
	}

	// using contents will get comments regular, text, and comment nodes
	// Handle the case where no comment is in the document
	assert.ok( jQuery( "#nonnodes" ).contents().length >= 2, "Check node,textnode,comment remove works" );
	jQuery( "#nonnodes" ).contents().detach();
	assert.equal( jQuery( "#nonnodes" ).contents().length, 0, "Check node,textnode,comment remove works" );
} );

QUnit.test( "detach() event cleaning ", function( assert ) {
	assert.expect( 1 );

	var count, first, cleanUp;

	count = 0;
	first = jQuery( "#ap" ).children().first();
	cleanUp = first.on( "click", function() {
		count++;
	} ).detach().appendTo( "#qunit-fixture" ).trigger( "click" );

	assert.strictEqual( 1, count, "Event handler has not been removed" );

	// Clean up detached data
	cleanUp.remove();
} );

QUnit.test( "empty()", function( assert ) {

	assert.expect( 3 );

	assert.equal( jQuery( "#ap" ).children().empty().text().length, 0, "Check text is removed" );
	assert.equal( jQuery( "#ap" ).children().length, 4, "Check elements are not removed" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery( "#nonnodes" ).contents();
	j.empty();
	assert.equal( j.html(), "", "Check node,textnode,comment empty works" );
} );

QUnit.test( "jQuery.cleanData", function( assert ) {

	assert.expect( 14 );

	var type, pos, div, child;

	type = "remove";

	// Should trigger 4 remove event
	div = getDiv().remove();

	// Should both do nothing
	pos = "Outer";
	div.trigger( "click" );

	pos = "Inner";
	div.children().trigger( "click" );

	type = "empty";
	div = getDiv();
	child = div.children();

	// Should trigger 2 remove event
	div.empty();

	// Should trigger 1
	pos = "Outer";
	div.trigger( "click" );

	// Should do nothing
	pos = "Inner";
	child.trigger( "click" );

	// Should trigger 2
	div.remove();

	type = "html";

	div = getDiv();
	child = div.children();

	// Should trigger 2 remove event
	div.html( "<div></div>" );

	// Should trigger 1
	pos = "Outer";
	div.trigger( "click" );

	// Should do nothing
	pos = "Inner";
	child.trigger( "click" );

	// Should trigger 2
	div.remove();

	function getDiv() {
		var div = jQuery( "<div class='outer'><div class='inner'></div></div>" ).on( "click", function() {
			assert.ok( true, type + " " + pos + " Click event fired." );
		} ).on( "focus", function() {
			assert.ok( true, type + " " + pos + " Focus event fired." );
		} ).find( "div" ).on( "click", function() {
			assert.ok( false, type + " " + pos + " Click event fired." );
		} ).on( "focus", function() {
			assert.ok( false, type + " " + pos + " Focus event fired." );
		} ).end().appendTo( "body" );

		div[ 0 ].detachEvent = div[ 0 ].removeEventListener = function( t ) {
			assert.ok( true, type + " Outer " + t + " event unbound" );
		};

		div[ 0 ].firstChild.detachEvent = div[ 0 ].firstChild.removeEventListener = function( t ) {
			assert.ok( true, type + " Inner " + t + " event unbound" );
		};

		return div;
	}
} );

QUnit.test( "jQuery.cleanData eliminates all private data (gh-2127)", function( assert ) {
	assert.expect( 3 );

	var div = jQuery( "<div/>" ).appendTo( "#qunit-fixture" );

	jQuery._data( div[ 0 ], "gh-2127", "testing" );

	assert.ok( !jQuery.isEmptyObject( jQuery._data( div[ 0 ] ) ),  "Ensure some private data exists" );

	div.remove();

	assert.ok( !jQuery.hasData( div[ 0 ] ), "Removed element hasData should return false" );

	assert.ok( jQuery.isEmptyObject( jQuery._data( div[ 0 ] ) ),
		"Private data is empty after node is removed" );

	div.remove();
} );

QUnit.test( "jQuery.cleanData eliminates all public data", function( assert ) {
	assert.expect( 3 );

	var key,
		div = jQuery( "<div/>" );
	div.data( "some", "data" );
	assert.ok( !jQuery.isEmptyObject( jQuery.data( div[ 0 ] ) ),  "Ensure some public data exists" );

	div.remove();

	assert.ok( !jQuery.hasData( div[ 0 ] ), "Removed element hasData should return false" );

	// Make sure the expando is gone
	for ( key in div[ 0 ] ) {
		if ( /^jQuery/.test( key ) ) {
			assert.strictEqual( div[ 0 ][ key ], undefined, "Expando was not removed when there was no more data" );
		}
	}
} );

QUnit.test( "domManip plain-text caching (trac-6779)", function( assert ) {

	assert.expect( 1 );

	// DOM manipulation fails if added text matches an Object method
	var i,
		$f = jQuery( "<div />" ).appendTo( "#qunit-fixture" ),
		bad = [ "start-", "toString", "hasOwnProperty", "append", "here&there!", "-end" ];

	for ( i = 0; i < bad.length; i++ ) {
		try {
			$f.append( bad[ i ] );
		}
		catch ( e ) {}
	}
	assert.equal( $f.text(), bad.join( "" ), "Cached strings that match Object properties" );
	$f.remove();
} );

QUnit.test( "domManip executes scripts containing html comments or CDATA (trac-9221)", function( assert ) {

	assert.expect( 3 );

	jQuery( [
		"<script type='text/javascript'>",
		"<!--",
		"ok( true, '<!-- handled' );",
		"//-->",
		"</script>"
	].join( "\n" ) ).appendTo( "#qunit-fixture" );

	jQuery( [
		"<script type='text/javascript'>",
		"<![CDATA[",
		"ok( true, '<![CDATA[ handled' );",
		"//]]>",
		"</script>"
	].join( "\n" ) ).appendTo( "#qunit-fixture" );

	jQuery( [
		"<script type='text/javascript'>",
		"<!--//--><![CDATA[//><!--",
		"ok( true, '<!--//--><![CDATA[//><!-- (Drupal case) handled' );",
		"//--><!]]>",
		"</script>"
	].join( "\n" ) ).appendTo( "#qunit-fixture" );
} );

testIframe(
	"domManip tolerates window-valued document[0] in IE9/10 (trac-12266)",
	"manipulation/iframe-denied.html",
	function( assert, jQuery, window, document, test ) {
		assert.expect( 1 );
		assert.ok( test.status, test.description );
	}
);

testIframe(
	"domManip executes scripts in iframes in the iframes' context",
	"manipulation/scripts-context.html",
	function( assert, framejQuery, frameWindow, frameDocument ) {
		assert.expect( 2 );
		jQuery( frameDocument.body ).append( "<script>window.scriptTest = true;<\x2fscript>" );
		assert.ok( !window.scriptTest, "script executed in iframe context" );
		assert.ok( frameWindow.scriptTest, "script executed in iframe context" );
	}
);

QUnit.test( "jQuery.clone - no exceptions for object elements #9587", function( assert ) {

	assert.expect( 1 );

	try {
		jQuery( "#no-clone-exception" ).clone();
		assert.ok( true, "cloned with no exceptions" );
	} catch ( e ) {
		assert.ok( false, e.message );
	}
} );

QUnit.test( "Cloned, detached HTML5 elems (#10667,10670)", function( assert ) {

	assert.expect( 7 );

	var $clone,
		$section = jQuery( "<section>" ).appendTo( "#qunit-fixture" );

	// First clone
	$clone = $section.clone();

	// This branch tests a known behaviour in modern browsers that should never fail.
	// Included for expected test count symmetry (expecting 1)
	assert.equal( $clone[ 0 ].nodeName, "SECTION", "detached clone nodeName matches 'SECTION'" );

	// Bind an event
	$section.on( "click", function() {
		assert.ok( true, "clone fired event" );
	} );

	// Second clone (will have an event bound)
	$clone = $section.clone( true );

	// Trigger an event from the first clone
	$clone.trigger( "click" );
	$clone.off( "click" );

	// Add a child node with text to the original
	$section.append( "<p>Hello</p>" );

	// Third clone (will have child node and text)
	$clone = $section.clone( true );

	assert.equal( $clone.find( "p" ).text(), "Hello", "Assert text in child of clone" );

	// Trigger an event from the third clone
	$clone.trigger( "click" );
	$clone.off( "click" );

	// Add attributes to copy
	$section.attr( {
		"class": "foo bar baz",
		"title": "This is a title"
	} );

	// Fourth clone (will have newly added attributes)
	$clone = $section.clone( true );

	assert.equal( $clone.attr( "class" ), $section.attr( "class" ), "clone and element have same class attribute" );
	assert.equal( $clone.attr( "title" ), $section.attr( "title" ), "clone and element have same title attribute" );

	// Remove the original
	$section.remove();

	// Clone the clone
	$section = $clone.clone( true );

	// Remove the clone
	$clone.remove();

	// Trigger an event from the clone of the clone
	$section.trigger( "click" );

	// Unbind any remaining events
	$section.off( "click" );
	$clone.off( "click" );
} );

QUnit.test( "Guard against exceptions when clearing safeChildNodes", function( assert ) {

	assert.expect( 1 );

	var div;

	try {
		div = jQuery( "<div/><hr/><code/><b/>" );
	} catch ( e ) {}

	assert.ok( div && div.jquery, "Created nodes safely, guarded against exceptions on safeChildNodes[ -1 ]" );
} );

QUnit.test( "Ensure oldIE creates a new set on appendTo (#8894)", function( assert ) {

	assert.expect( 5 );

	assert.strictEqual( jQuery( "<div/>" ).clone().addClass( "test" ).appendTo( "<div/>" ).end().end().hasClass( "test" ), false, "Check jQuery.fn.appendTo after jQuery.clone" );
	assert.strictEqual( jQuery( "<div/>" ).find( "p" ).end().addClass( "test" ).appendTo( "<div/>" ).end().end().hasClass( "test" ), false, "Check jQuery.fn.appendTo after jQuery.fn.find" );
	assert.strictEqual( jQuery( "<div/>" ).text( "test" ).addClass( "test" ).appendTo( "<div/>" ).end().end().hasClass( "test" ), false, "Check jQuery.fn.appendTo after jQuery.fn.text" );
	assert.strictEqual( jQuery( "<bdi/>" ).clone().addClass( "test" ).appendTo( "<div/>" ).end().end().hasClass( "test" ), false, "Check jQuery.fn.appendTo after clone html5 element" );
	assert.strictEqual( jQuery( "<p/>" ).appendTo( "<div/>" ).end().length, jQuery( "<p>test</p>" ).appendTo( "<div/>" ).end().length, "Elements created with createElement and with createDocumentFragment should be treated alike" );
} );

QUnit.asyncTest( "html() - script exceptions bubble (#11743)", 2, function( assert ) {
	var onerror = window.onerror;

	setTimeout( function() {
		window.onerror = onerror;

		QUnit.start();
	}, 1000 );

	window.onerror = function() {
		assert.ok( true, "Exception thrown" );

		if ( jQuery.ajax ) {
			window.onerror = function() {
				assert.ok( true, "Exception thrown in remote script" );
			};

			jQuery( "#qunit-fixture" ).html( "<script src='data/badcall.js'></script>" );
			assert.ok( true, "Exception ignored" );
		} else {
			assert.ok( true, "No jQuery.ajax" );
			assert.ok( true, "No jQuery.ajax" );
		}
	};

	jQuery( "#qunit-fixture" ).html( "<script>undefined();</script>" );
} );

QUnit.test( "checked state is cloned with clone()", function( assert ) {

	assert.expect( 2 );

	var elem = jQuery.parseHTML( "<input type='checkbox' checked='checked'/>" )[ 0 ];
	elem.checked = false;
	assert.equal( jQuery( elem ).clone().attr( "id", "clone" )[ 0 ].checked, false, "Checked false state correctly cloned" );

	elem = jQuery.parseHTML( "<input type='checkbox'/>" )[ 0 ];
	elem.checked = true;
	assert.equal( jQuery( elem ).clone().attr( "id", "clone" )[ 0 ].checked, true, "Checked true state correctly cloned" );
} );

QUnit.test( "manipulate mixed jQuery and text (#12384, #12346)", function( assert ) {

	assert.expect( 2 );

	var div = jQuery( "<div>a</div>" ).append( "&nbsp;", jQuery( "<span>b</span>" ), "&nbsp;", jQuery( "<span>c</span>" ) ),
		nbsp = String.fromCharCode( 160 );

	assert.equal( div.text(), "a" + nbsp + "b" + nbsp + "c", "Appending mixed jQuery with text nodes" );

	div = jQuery( "<div><div></div></div>" )
		.find( "div" )
		.after( "<p>a</p>", "<p>b</p>" )
		.parent();
	assert.equal( div.find( "*" ).length, 3, "added 2 paragraphs after inner div" );
} );

QUnit.test( "script evaluation (#11795)", function( assert ) {

	assert.expect( 13 );

	var scriptsIn, scriptsOut,
		fixture = jQuery( "#qunit-fixture" ).empty(),
		objGlobal = ( function() {
			return this;
		} )(),
		isOk = objGlobal.ok,
		notOk = function() {
			var args = arguments;
			args[ 0 ] = !args[ 0 ];
			return isOk.apply( this, args );
		};

	objGlobal.ok = notOk;
	scriptsIn = jQuery( [
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
	].join( "" ) );
	scriptsIn.appendTo( jQuery( "<div class='detached'/>" ) );
	objGlobal.ok = isOk;

	scriptsOut = fixture.append( scriptsIn ).find( "script" );
	assert.equal( scriptsOut[ 0 ].type, "something/else", "Non-evaluated type." );
	assert.equal( scriptsOut[ 1 ].type, "text/javascript", "Evaluated type." );
	assert.deepEqual( scriptsOut.get(), fixture.find( "script" ).get(), "All script tags remain." );

	objGlobal.ok = notOk;
	scriptsOut = scriptsOut.add( scriptsOut.clone() ).appendTo( fixture.find( "div" ) );
	assert.deepEqual( fixture.find( "div script" ).get(), scriptsOut.get(), "Scripts cloned without reevaluation" );
	fixture.append( scriptsOut.detach() );
	assert.deepEqual( fixture.children( "script" ).get(), scriptsOut.get(), "Scripts detached without reevaluation" );
	objGlobal.ok = isOk;

	if ( jQuery.ajax ) {
		Globals.register( "testBar" );
		jQuery( "#qunit-fixture" ).append( "<script src='" + url( "data/testbar.php" ) + "'/>" );
		assert.strictEqual( window.testBar, "bar", "Global script evaluation" );
	} else {
		assert.ok( true, "No jQuery.ajax" );
		assert.ok( true, "No jQuery.ajax" );
	}
} );

QUnit.test( "jQuery._evalUrl (#12838)", function( assert ) {

	assert.expect( 5 );

	var message, expectedArgument,
		ajax = jQuery.ajax,
		evalUrl = jQuery._evalUrl;

	message = "jQuery.ajax implementation";
	expectedArgument = 1;
	jQuery.ajax = function( input ) {
		assert.equal( ( input.url || input ).slice( -1 ), expectedArgument, message );
		expectedArgument++;
	};
	jQuery( "#qunit-fixture" ).append( "<script src='1'/><script src='2'/>" );
	assert.equal( expectedArgument, 3, "synchronous execution" );

	message = "custom implementation";
	expectedArgument = 3;
	jQuery._evalUrl = jQuery.ajax;
	jQuery.ajax = function( options ) {
		assert.strictEqual( options, {}, "Unexpected call to jQuery.ajax" );
	};
	jQuery( "#qunit-fixture" ).append( "<script src='3'/><script src='4'/>" );

	jQuery.ajax = ajax;
	jQuery._evalUrl = evalUrl;
} );

QUnit.test( "jQuery.htmlPrefilter (gh-1747)", function( assert ) {

	assert.expect( 5 );

	var expectedArgument,
		invocations = 0,
		done = assert.async(),
		htmlPrefilter = jQuery.htmlPrefilter,
		fixture = jQuery( "<div/>" ).appendTo( "#qunit-fixture" ),
		poison = "<script>jQuery.htmlPrefilter.assert.ok( false, 'script not executed' );</script>";

	jQuery.htmlPrefilter = function( html ) {
		invocations++;
		assert.equal( html, expectedArgument, "Expected input" );

		// Remove <script> and <del> elements
		return htmlPrefilter.apply( this, arguments )
			.replace( /<(script|del)(?=[\s>])[\w\W]*?<\/\1\s*>/ig, "" );
	};
	jQuery.htmlPrefilter.assert = assert;

	expectedArgument = "A-" + poison + "B-" + poison + poison + "C-";
	fixture.html( expectedArgument );

	expectedArgument = "D-" + poison + "E-" + "<del/><div>" + poison + poison + "</div>" + "F-";
	fixture.append( expectedArgument );

	expectedArgument = poison;
	fixture.find( "div" ).replaceWith( expectedArgument );

	assert.equal( invocations, 3, "htmlPrefilter invoked for all DOM manipulations" );
	assert.equal( fixture.html(), "A-B-C-D-E-F-", "htmlPrefilter modified HTML" );

	// Allow asynchronous script execution to generate assertions
	setTimeout( function() {
		jQuery.htmlPrefilter = htmlPrefilter;
		done();
	}, 100 );
} );

QUnit.test( "insertAfter, insertBefore, etc do not work when destination is original element. Element is removed (#4087)", function( assert ) {

	assert.expect( 10 );

	var elems;

	jQuery.each( [
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
		].join( "" ) ).appendTo( "#qunit-fixture" );

		// complex case based on https://jsfiddle.net/pbramos/gZ7vB/
		jQuery( "#test4087-complex div" )[ name ]( "#test4087-complex li:last-child div:last-child" );
		assert.equal( jQuery( "#test4087-complex li:last-child div" ).length, name === "replaceAll" ? 1 : 2, name + " a node to itself, complex case." );

		// simple case
		jQuery( ".test4087-1" )[ name ]( ".test4087-1" );
		assert.equal( jQuery( ".test4087-1" ).length, 1, name + " a node to itself, simple case." );

		// clean for next test
		jQuery( "#test4087-complex" ).remove();
		jQuery( "#test4087-simple" ).remove();
		jQuery( "#test4087-multiple" ).remove();
	} );
} );

QUnit.test( "Index for function argument should be received (#13094)", function( assert ) {
	assert.expect( 2 );

	var i = 0;

	jQuery( "<div/><div/>" ).before( function( index ) {
		assert.equal( index, i++, "Index should be correct" );
	} );

} );

QUnit.test( "Make sure jQuery.fn.remove can work on elements in documentFragment", function( assert ) {
	assert.expect( 1 );

	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) );

	jQuery( div ).remove();

	assert.equal( fragment.childNodes.length, 0, "div element was removed from documentFragment" );
} );

QUnit.test( "Make sure specific elements with content created correctly (#13232)", function( assert ) {
	assert.expect( 20 );

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
		assert.ok( jQuery.nodeName( jQuery.parseHTML( "<" + name + ">" + value + "</" + name + ">" )[ 0 ], name ), name + " is created correctly" );

		results.push( name );
		args.push( html );
	} );

	jQuery.fn.append.apply( jQuery( "<div/>" ), args ).children().each( function( i ) {
		assert.ok( jQuery.nodeName( this, results[ i ] ) );
	} );
} );

QUnit.test( "Validate creation of multiple quantities of certain elements (#13818)", function( assert ) {
	assert.expect( 44 );

	var tags = [ "thead", "tbody", "tfoot", "colgroup", "col", "caption", "tr", "th", "td", "optgroup", "option" ];

	jQuery.each( tags, function( index, tag ) {
		jQuery( "<" + tag + "/><" + tag + "/>" ).each( function() {
			assert.ok( jQuery.nodeName( this, tag ), tag + " empty elements created correctly" );
		} );

		jQuery( "<" + this + "></" + tag + "><" + tag + "></" + tag + ">" ).each( function() {
			assert.ok( jQuery.nodeName( this, tag ), tag + " elements with closing tag created correctly" );
		} );
	} );
} );

QUnit.test( "Make sure tr element will be appended to tbody element of table when present", function( assert ) {
	assert.expect( 1 );

	var html,
		table = document.createElement( "table" );

	table.appendChild( document.createElement( "tbody" ) );
	document.getElementById( "qunit-fixture" ).appendChild( table );

	jQuery( table ).append( "<tr><td>test</td></tr>" );

	// Lowercase and replace spaces to remove possible browser inconsistencies
	html = table.innerHTML.toLowerCase().replace( /\s/g, "" );

	assert.strictEqual( html, "<tbody><tr><td>test</td></tr></tbody>" );
} );

QUnit.test( "Make sure tr elements will be appended to tbody element of table when present", function( assert ) {
	assert.expect( 1 );

	var html,
		table = document.createElement( "table" );

	table.appendChild( document.createElement( "tbody" ) );
	document.getElementById( "qunit-fixture" ).appendChild( table );

	jQuery( table ).append( "<tr><td>1</td></tr><tr><td>2</td></tr>" );

	// Lowercase and replace spaces to remove possible browser inconsistencies
	html = table.innerHTML.toLowerCase().replace( /\s/g, "" );

	assert.strictEqual( html, "<tbody><tr><td>1</td></tr><tr><td>2</td></tr></tbody>" );
} );

QUnit.test( "Make sure tfoot element will not be appended to tbody element of table when present", function( assert ) {
	assert.expect( 1 );

	var html,
		table = document.createElement( "table" );

	table.appendChild( document.createElement( "tbody" ) );
	document.getElementById( "qunit-fixture" ).appendChild( table );

	jQuery( table ).append( "<tfoot/>" );

	// Lowercase and replace spaces to remove possible browser inconsistencies
	html = table.innerHTML.toLowerCase().replace( /\s/g, "" );

	assert.strictEqual( html, "<tbody></tbody><tfoot></tfoot>" );
} );

QUnit.test( "Make sure document fragment will be appended to tbody element of table when present", function( assert ) {
	assert.expect( 1 );

	var html,
		fragment = document.createDocumentFragment(),
		table = document.createElement( "table" ),
		tr = document.createElement( "tr" ),
		td = document.createElement( "td" );

	table.appendChild( document.createElement( "tbody" ) );
	document.getElementById( "qunit-fixture" ).appendChild( table );

	fragment.appendChild( tr );
	tr.appendChild( td );
	td.innerHTML = "test";

	jQuery( table ).append( fragment );

	// Lowercase and replace spaces to remove possible browser inconsistencies
	html = table.innerHTML.toLowerCase().replace( /\s/g, "" );

	assert.strictEqual( html, "<tbody><tr><td>test</td></tr></tbody>" );
} );

QUnit.test( "Make sure col element is appended correctly", function( assert ) {
	assert.expect( 1 );

	var table = jQuery( "<table cellpadding='0'><tr><td>test</td></tr></table>" );

	jQuery( table ).appendTo( "#qunit-fixture" );

	jQuery( "<col width='150'/>" ).prependTo( table );

	assert.strictEqual( table.find( "td" ).width(), 150 );
} );

QUnit.test( "Insert script with data-URI (gh-1887)", 1, function( assert ) {
	Globals.register( "testFoo" );
	Globals.register( "testSrcFoo" );

	var script = document.createElement( "script" ),
		fixture = document.getElementById( "qunit-fixture" ),
		done = assert.async();

	script.src = "data:text/javascript,testSrcFoo = 'foo';";

	fixture.appendChild( script );

	jQuery( fixture ).append( "<script src=\"data:text/javascript,testFoo = 'foo';\"></script>" );

	setTimeout( function() {
		if ( window.testSrcFoo === "foo" ) {
			assert.strictEqual( window.testFoo, window.testSrcFoo, "data-URI script executed" );

		} else {
			assert.ok( true, "data-URI script is not supported by this environment" );
		}

		done();
	}, 100 );
} );
