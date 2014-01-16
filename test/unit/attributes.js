module( "attributes", {
	teardown: moduleTeardown
});

function bareObj( value ) {
	return value;
}

function functionReturningObj( value ) {
	return function() {
		return value;
	};
}

/*
	======== local reference =======
	bareObj and functionReturningObj can be used to test passing functions to setters
	See testVal below for an example

	bareObj( value );
		This function returns whatever value is passed in

	functionReturningObj( value );
		Returns a function that returns the value
*/

test( "jQuery.propFix integrity test", function() {
	expect( 1 );

	//  This must be maintained and equal jQuery.attrFix when appropriate
	//  Ensure that accidental or erroneous property
	//  overwrites don't occur
	//  This is simply for better code coverage and future proofing.
	var props = {
		"tabindex": "tabIndex",
		"readonly": "readOnly",
		"for": "htmlFor",
		"class": "className",
		"maxlength": "maxLength",
		"cellspacing": "cellSpacing",
		"cellpadding": "cellPadding",
		"rowspan": "rowSpan",
		"colspan": "colSpan",
		"usemap": "useMap",
		"frameborder": "frameBorder",
		"contenteditable": "contentEditable"
	};

	deepEqual( props, jQuery.propFix, "jQuery.propFix passes integrity check" );
});

test( "attr(String)", function() {
	expect( 50 );

	var extras, body, $body,
		select, optgroup, option, $img, styleElem,
		$button, $form, $a;

	equal( jQuery("#text1").attr("type"), "text", "Check for type attribute" );
	equal( jQuery("#radio1").attr("type"), "radio", "Check for type attribute" );
	equal( jQuery("#check1").attr("type"), "checkbox", "Check for type attribute" );
	equal( jQuery("#simon1").attr("rel"), "bookmark", "Check for rel attribute" );
	equal( jQuery("#google").attr("title"), "Google!", "Check for title attribute" );
	equal( jQuery("#mark").attr("hreflang"), "en", "Check for hreflang attribute" );
	equal( jQuery("#en").attr("lang"), "en", "Check for lang attribute" );
	equal( jQuery("#simon").attr("class"), "blog link", "Check for class attribute" );
	equal( jQuery("#name").attr("name"), "name", "Check for name attribute" );
	equal( jQuery("#text1").attr("name"), "action", "Check for name attribute" );
	ok( jQuery("#form").attr("action").indexOf("formaction") >= 0, "Check for action attribute" );
	equal( jQuery("#text1").attr("value", "t").attr("value"), "t", "Check setting the value attribute" );
	equal( jQuery("#text1").attr("value", "").attr("value"), "", "Check setting the value attribute to empty string" );
	equal( jQuery("<div value='t'></div>").attr("value"), "t", "Check setting custom attr named 'value' on a div" );
	equal( jQuery("#form").attr("blah", "blah").attr("blah"), "blah", "Set non-existent attribute on a form" );
	equal( jQuery("#foo").attr("height"), undefined, "Non existent height attribute should return undefined" );

	// [7472] & [3113] (form contains an input with name="action" or name="id")
	extras = jQuery("<input id='id' name='id' /><input id='name' name='name' /><input id='target' name='target' />").appendTo("#testForm");
	equal( jQuery("#form").attr("action","newformaction").attr("action"), "newformaction", "Check that action attribute was changed" );
	equal( jQuery("#testForm").attr("target"), undefined, "Retrieving target does not equal the input with name=target" );
	equal( jQuery("#testForm").attr("target", "newTarget").attr("target"), "newTarget", "Set target successfully on a form" );
	equal( jQuery("#testForm").removeAttr("id").attr("id"), undefined, "Retrieving id does not equal the input with name=id after id is removed [#7472]" );
	// Bug #3685 (form contains input with name="name")
	equal( jQuery("#testForm").attr("name"), undefined, "Retrieving name does not retrieve input with name=name" );
	extras.remove();

	equal( jQuery("#text1").attr("maxlength"), "30", "Check for maxlength attribute" );
	equal( jQuery("#text1").attr("maxLength"), "30", "Check for maxLength attribute" );
	equal( jQuery("#area1").attr("maxLength"), "30", "Check for maxLength attribute" );

	// using innerHTML in IE causes href attribute to be serialized to the full path
	jQuery("<a/>").attr({
		"id": "tAnchor5",
		"href": "#5"
	}).appendTo("#qunit-fixture");
	equal( jQuery("#tAnchor5").attr("href"), "#5", "Check for non-absolute href (an anchor)" );
	jQuery("<a id='tAnchor6' href='#5' />").appendTo("#qunit-fixture");
	equal( jQuery("#tAnchor5").prop("href"), jQuery("#tAnchor6").prop("href"), "Check for absolute href prop on an anchor" );

	jQuery("<script type='jquery/test' src='#5' id='scriptSrc'></script>").appendTo("#qunit-fixture");
	equal( jQuery("#tAnchor5").prop("href"), jQuery("#scriptSrc").prop("src"), "Check for absolute src prop on a script" );

	// list attribute is readonly by default in browsers that support it
	jQuery("#list-test").attr( "list", "datalist" );
	equal( jQuery("#list-test").attr("list"), "datalist", "Check setting list attribute" );

	// Related to [5574] and [5683]
	body = document.body;
	$body = jQuery( body );

	strictEqual( $body.attr("foo"), undefined, "Make sure that a non existent attribute returns undefined" );

	body.setAttribute( "foo", "baz" );
	equal( $body.attr("foo"), "baz", "Make sure the dom attribute is retrieved when no expando is found" );

	$body.attr( "foo","cool" );
	equal( $body.attr("foo"), "cool", "Make sure that setting works well when both expando and dom attribute are available" );

	body.removeAttribute("foo"); // Cleanup

	select = document.createElement("select");
	optgroup = document.createElement("optgroup");
	option = document.createElement("option");

	optgroup.appendChild( option );
	select.appendChild( optgroup );

	equal( jQuery( option ).prop("selected"), true, "Make sure that a single option is selected, even when in an optgroup." );

	$img = jQuery("<img style='display:none' width='215' height='53' src='data/1x1.jpg'/>").appendTo("body");
	equal( $img.attr("width"), "215", "Retrieve width attribute an an element with display:none." );
	equal( $img.attr("height"), "53", "Retrieve height attribute an an element with display:none." );

	// Check for style support
	styleElem = jQuery("<div/>").appendTo("#qunit-fixture").css({
		background: "url(UPPERlower.gif)"
	});
	ok( !!~styleElem.attr("style").indexOf("UPPERlower.gif"), "Check style attribute getter" );
	ok( !!~styleElem.attr("style", "position:absolute;").attr("style").indexOf("absolute"), "Check style setter" );

	// Check value on button element (#1954)
	$button = jQuery("<button>text</button>").insertAfter("#button");
	strictEqual( $button.attr("value"), undefined, "Absence of value attribute on a button" );
	equal( $button.attr( "value", "foobar" ).attr("value"), "foobar", "Value attribute on a button does not return innerHTML" );
	equal( $button.attr("value", "baz").html(), "text", "Setting the value attribute does not change innerHTML" );

	// Attributes with a colon on a table element (#1591)
	equal( jQuery("#table").attr("test:attrib"), undefined, "Retrieving a non-existent attribute on a table with a colon does not throw an error." );
	equal( jQuery("#table").attr( "test:attrib", "foobar" ).attr("test:attrib"), "foobar", "Setting an attribute on a table with a colon does not throw an error." );

	$form = jQuery("<form class='something'></form>").appendTo("#qunit-fixture");
	equal( $form.attr("class"), "something", "Retrieve the class attribute on a form." );

	$a = jQuery("<a href='#' onclick='something()'>Click</a>").appendTo("#qunit-fixture");
	equal( $a.attr("onclick"), "something()", "Retrieve ^on attribute without anonymous function wrapper." );

	ok( jQuery("<div/>").attr("doesntexist") === undefined, "Make sure undefined is returned when no attribute is found." );
	ok( jQuery("<div/>").attr("title") === undefined, "Make sure undefined is returned when no attribute is found." );
	equal( jQuery("<div/>").attr( "title", "something" ).attr("title"), "something", "Set the title attribute." );
	ok( jQuery().attr("doesntexist") === undefined, "Make sure undefined is returned when no element is there." );
	equal( jQuery("<div/>").attr("value"), undefined, "An unset value on a div returns undefined." );
	strictEqual( jQuery("<select><option value='property'></option></select>").attr("value"), undefined, "An unset value on a select returns undefined." );

	$form = jQuery("#form").attr( "enctype", "multipart/form-data" );
	equal( $form.prop("enctype"), "multipart/form-data", "Set the enctype of a form (encoding in IE6/7 #6743)" );

});

test( "attr(String) on cloned elements, #9646", function() {
	expect( 4 );

	var div,
		input = jQuery("<input name='tester' />");

	input.attr("name");

	strictEqual( input.clone( true ).attr( "name", "test" )[ 0 ].name, "test", "Name attribute should be changed on cloned element" );

	div = jQuery("<div id='tester' />");
	div.attr("id");

	strictEqual( div.clone( true ).attr( "id", "test" )[ 0 ].id, "test", "Id attribute should be changed on cloned element" );

	input = jQuery("<input value='tester' />");
	input.attr("value");

	strictEqual( input.clone( true ).attr( "value", "test" )[ 0 ].value, "test", "Value attribute should be changed on cloned element" );

	strictEqual( input.clone( true ).attr( "value", 42 )[ 0 ].value, "42", "Value attribute should be changed on cloned element" );
});

test( "attr(String) in XML Files", function() {
	expect( 3 );
	var xml = createDashboardXML();
	equal( jQuery( "locations", xml ).attr("class"), "foo", "Check class attribute in XML document" );
	equal( jQuery( "location", xml ).attr("for"), "bar", "Check for attribute in XML document" );
	equal( jQuery( "location", xml ).attr("checked"), "different", "Check that hooks are not attached in XML document" );
});

test( "attr(String, Function)", function() {
	expect( 2 );

	equal(
		jQuery("#text1").attr( "value", function() {
			return this.id;
		}).attr("value"),
		"text1",
		"Set value from id"
	);

	equal(
		jQuery("#text1").attr( "title", function(i) {
			return i;
		}).attr("title"),
		"0",
		"Set value with an index"
	);
});

test( "attr(Hash)", function() {
	expect( 3 );
	var pass = true;
	jQuery("div").attr({
		"foo": "baz",
		"zoo": "ping"
	}).each(function() {
		if ( this.getAttribute("foo") !== "baz" && this.getAttribute("zoo") !== "ping" ) {
			pass = false;
		}
	});

	ok( pass, "Set Multiple Attributes" );

	equal(
		jQuery("#text1").attr({
			"value": function() {
				return this["id"];
			}}).attr("value"),
		"text1",
		"Set attribute to computed value #1"
	);

	equal(
		jQuery("#text1").attr({
			"title": function(i) {
				return i;
			}
		}).attr("title"),
		"0",
		"Set attribute to computed value #2"
	);
});

test( "attr(String, Object)", function() {
	expect( 71 );

	var $input, $text, $details,
		attributeNode, commentNode, textNode, obj,
		table, td, j, type,
		check, thrown, button, $radio, $radios, $svg,
		div = jQuery("div").attr("foo", "bar"),
		i = 0,
		fail = false;

	for ( ; i < div.length; i++ ) {
		if ( div[ i ].getAttribute("foo") !== "bar" ) {
			fail = i;
			break;
		}
	}

	equal( fail, false, "Set Attribute, the #" + fail + " element didn't get the attribute 'foo'" );

	ok(
		jQuery("#foo").attr({
			"width": null
		}),
		"Try to set an attribute to nothing"
	);

	jQuery("#name").attr( "name", "something" );
	equal( jQuery("#name").attr("name"), "something", "Set name attribute" );
	jQuery("#name").attr( "name", null );
	equal( jQuery("#name").attr("name"), undefined, "Remove name attribute" );

	$input = jQuery( "<input>", {
		name: "something",
		id: "specified"
	});
	equal( $input.attr("name"), "something", "Check element creation gets/sets the name attribute." );
	equal( $input.attr("id"), "specified", "Check element creation gets/sets the id attribute." );

	// As of fixing #11115, we only guarantee boolean property update for checked and selected
	$input = jQuery("<input type='checkbox'/>").attr( "checked", true );
	equal( $input.prop("checked"), true, "Setting checked updates property (verified by .prop)" );
	equal( $input[0].checked, true, "Setting checked updates property (verified by native property)" );
	$input = jQuery("<option/>").attr( "selected", true );
	equal( $input.prop("selected"), true, "Setting selected updates property (verified by .prop)" );
	equal( $input[0].selected, true, "Setting selected updates property (verified by native property)" );

	$input = jQuery("#check2");
	$input.prop( "checked", true ).prop( "checked", false ).attr( "checked", true );
	equal( $input.attr("checked"), "checked", "Set checked (verified by .attr)" );
	$input.prop( "checked", false ).prop( "checked", true ).attr( "checked", false );
	equal( $input.attr("checked"), undefined, "Remove checked (verified by .attr)" );

	$input = jQuery("#text1").prop( "readOnly", true ).prop( "readOnly", false ).attr( "readonly", true );
	equal( $input.attr("readonly"), "readonly", "Set readonly (verified by .attr)" );
	$input.prop( "readOnly", false ).prop( "readOnly", true ).attr( "readonly", false );
	equal( $input.attr("readonly"), undefined, "Remove readonly (verified by .attr)" );

	$input = jQuery("#check2").attr( "checked", true ).attr( "checked", false ).prop( "checked", true );
	equal( $input[0].checked, true, "Set checked property (verified by native property)" );
	equal( $input.prop("checked"), true, "Set checked property (verified by .prop)" );
	equal( $input.attr("checked"), undefined, "Setting checked property doesn't affect checked attribute" );
	$input.attr( "checked", false ).attr( "checked", true ).prop( "checked", false );
	equal( $input[0].checked, false, "Clear checked property (verified by native property)" );
	equal( $input.prop("checked"), false, "Clear checked property (verified by .prop)" );
	equal( $input.attr("checked"), "checked", "Clearing checked property doesn't affect checked attribute" );

	$input = jQuery("#check2").attr( "checked", false ).attr( "checked", "checked" );
	equal( $input.attr("checked"), "checked", "Set checked to 'checked' (verified by .attr)" );

	$radios = jQuery("#checkedtest").find("input[type='radio']");
	$radios.eq( 1 ).trigger("click");
	equal( $radios.eq( 1 ).prop("checked"), true, "Second radio was checked when clicked" );
	equal( $radios.eq( 0 ).attr("checked"), "checked", "First radio is still [checked]" );

	$input = jQuery("#text1").attr( "readonly", false ).prop( "readOnly", true );
	equal( $input[0].readOnly, true, "Set readonly property (verified by native property)" );
	equal( $input.prop("readOnly"), true, "Set readonly property (verified by .prop)" );
	$input.attr( "readonly", true ).prop( "readOnly", false );
	equal( $input[0].readOnly, false, "Clear readonly property (verified by native property)" );
	equal( $input.prop("readOnly"), false, "Clear readonly property (verified by .prop)" );

	$input = jQuery("#name").attr( "maxlength", "5" );
	equal( $input[0].maxLength, 5, "Set maxlength (verified by native property)" );
	$input.attr( "maxLength", "10" );
	equal( $input[0].maxLength, 10, "Set maxlength (verified by native property)" );

	// HTML5 boolean attributes
	$text = jQuery("#text1").attr({
		"autofocus": true,
		"required": true
	});
	equal( $text.attr("autofocus"), "autofocus", "Reading autofocus attribute yields 'autofocus'" );
	equal( $text.attr( "autofocus", false ).attr("autofocus"), undefined, "Setting autofocus to false removes it" );
	equal( $text.attr("required"), "required", "Reading required attribute yields 'required'" );
	equal( $text.attr( "required", false ).attr("required"), undefined, "Setting required attribute to false removes it" );

	$details = jQuery("<details open></details>").appendTo("#qunit-fixture");
	equal( $details.attr("open"), "open", "open attribute presence indicates true" );
	equal( $details.attr( "open", false ).attr("open"), undefined, "Setting open attribute to false removes it" );

	$text.attr( "data-something", true );
	equal( $text.attr("data-something"), "true", "Set data attributes");
	equal( $text.data("something"), true, "Setting data attributes are not affected by boolean settings");
	$text.attr( "data-another", false );
	equal( $text.attr("data-another"), "false", "Set data attributes");
	equal( $text.data("another"), false, "Setting data attributes are not affected by boolean settings" );
	equal( $text.attr( "aria-disabled", false ).attr("aria-disabled"), "false", "Setting aria attributes are not affected by boolean settings" );
	$text.removeData("something").removeData("another").removeAttr("aria-disabled");

	jQuery("#foo").attr("contenteditable", true);
	equal( jQuery("#foo").attr("contenteditable"), "true", "Enumerated attributes are set properly" );

	attributeNode = document.createAttribute("irrelevant");
	commentNode = document.createComment("some comment");
	textNode = document.createTextNode("some text");
	obj = {};

	jQuery.each( [ commentNode, textNode, attributeNode ], function( i, elem ) {
		var $elem = jQuery( elem );
		$elem.attr( "nonexisting", "foo" );
		strictEqual( $elem.attr("nonexisting"), undefined, "attr(name, value) works correctly on comment and text nodes (bug #7500)." );
	});

	// Register the property name to avoid generating a new global when testing window
	Globals.register("nonexisting");
	jQuery.each( [ window, document, obj, "#firstp" ], function( i, elem ) {
		var oldVal = elem.nonexisting,
			$elem = jQuery( elem );
		strictEqual( $elem.attr("nonexisting"), undefined, "attr works correctly for non existing attributes (bug #7500)." );
		equal( $elem.attr( "nonexisting", "foo" ).attr("nonexisting"), "foo", "attr falls back to prop on unsupported arguments" );
		elem.nonexisting = oldVal;
	});

	table = jQuery("#table").append("<tr><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr>");
	td = table.find("td").eq(0);
	td.attr( "rowspan", "2" );
	equal( td[ 0 ]["rowSpan"], 2, "Check rowspan is correctly set" );
	td.attr( "colspan", "2" );
	equal( td[ 0 ]["colSpan"], 2, "Check colspan is correctly set" );
	table.attr("cellspacing", "2");
	equal( table[ 0 ]["cellSpacing"], "2", "Check cellspacing is correctly set" );

	equal( jQuery("#area1").attr("value"), undefined, "Value attribute is distinct from value property." );

	// for #1070
	jQuery("#name").attr( "someAttr", "0" );
	equal( jQuery("#name").attr("someAttr"), "0", "Set attribute to a string of '0'" );
	jQuery("#name").attr( "someAttr", 0 );
	equal( jQuery("#name").attr("someAttr"), "0", "Set attribute to the number 0" );
	jQuery("#name").attr( "someAttr", 1 );
	equal( jQuery("#name").attr("someAttr"), "1", "Set attribute to the number 1" );

	// using contents will get comments regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();

	j.attr( "name", "attrvalue" );
	equal( j.attr("name"), "attrvalue", "Check node,textnode,comment for attr" );
	j.removeAttr("name");

	// Type
	type = jQuery("#check2").attr("type");
	try {
		jQuery("#check2").attr( "type", "hidden" );
		ok( true, "No exception thrown on input type change" );
	} catch( e ) {
		ok( true, "Exception thrown on input type change: " + e );
	}

	check = document.createElement("input");
	thrown = true;
	try {
		jQuery( check ).attr( "type", "checkbox" );
	} catch( e ) {
		thrown = false;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equal( "checkbox", jQuery( check ).attr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

	check = jQuery("<input />");
	thrown = true;
	try {
		check.attr( "type", "checkbox" );
	} catch( e ) {
		thrown = false;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equal( "checkbox", check.attr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

	button = jQuery("#button");
	try {
		button.attr( "type", "submit" );
		ok( true, "No exception thrown on button type change" );
	} catch( e ) {
		ok( true, "Exception thrown on button type change: " + e );
	}

	$radio = jQuery( "<input>", {
		"value": "sup",
		"type": "radio"
	}).appendTo("#testForm");
	equal( $radio.val(), "sup", "Value is not reset when type is set after value on a radio" );

	// Setting attributes on svg elements (bug #3116)
	$svg = jQuery(
		"<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' baseProfile='full' width='200' height='200'>" +

			"<circle cx='200' cy='200' r='150' />" +
			"</svg>"
		).appendTo("body");
	equal( $svg.attr( "cx", 100 ).attr("cx"), "100", "Set attribute on svg element" );
	$svg.remove();

	// undefined values are chainable
	jQuery("#name").attr( "maxlength", "5" ).removeAttr("nonexisting");
	equal( typeof jQuery("#name").attr( "maxlength", undefined ), "object", ".attr('attribute', undefined) is chainable (#5571)" );
	equal( jQuery("#name").attr( "maxlength", undefined ).attr("maxlength"), "5", ".attr('attribute', undefined) does not change value (#5571)" );
	equal( jQuery("#name").attr( "nonexisting", undefined ).attr("nonexisting"), undefined, ".attr('attribute', undefined) does not create attribute (#5571)" );
});

test( "attr - extending the boolean attrHandle", function() {
	expect( 1 );
	var called = false,
		_handle = jQuery.expr.attrHandle.checked || $.noop;
	jQuery.expr.attrHandle.checked = function() {
		called = true;
		_handle.apply( this, arguments );
	};
	jQuery( "input" ).attr( "checked" );
	called = false;
	jQuery( "input" ).attr( "checked" );
	ok( called, "The boolean attrHandle does not drop custom attrHandles" );
});

test( "attr(String, Object) - Loaded via XML document", function() {
	expect( 2 );
	var xml = createDashboardXML(),
		titles = [];
	jQuery( "tab", xml ).each(function() {
		titles.push( jQuery( this ).attr("title") );
	});
	equal( titles[ 0 ], "Location", "attr() in XML context: Check first title" );
	equal( titles[ 1 ], "Users", "attr() in XML context: Check second title" );
});

test( "attr(String, Object) - Loaded via XML fragment", function() {
	expect( 2 );
	var frag = createXMLFragment(),
		$frag = jQuery( frag );

	$frag.attr( "test", "some value" );
	equal( $frag.attr("test"), "some value", "set attribute" );
	$frag.attr( "test", null );
	equal( $frag.attr("test"), undefined, "remove attribute" );
});

test( "attr('tabindex')", function() {
	expect( 8 );

	// elements not natively tabbable
	equal( jQuery("#listWithTabIndex").attr("tabindex"), "5", "not natively tabbable, with tabindex set to 0" );
	equal( jQuery("#divWithNoTabIndex").attr("tabindex"), undefined, "not natively tabbable, no tabindex set" );

	// anchor with href
	equal( jQuery("#linkWithNoTabIndex").attr("tabindex"), undefined, "anchor with href, no tabindex set" );
	equal( jQuery("#linkWithTabIndex").attr("tabindex"), "2", "anchor with href, tabindex set to 2" );
	equal( jQuery("#linkWithNegativeTabIndex").attr("tabindex"), "-1", "anchor with href, tabindex set to -1" );

	// anchor without href
	equal( jQuery("#linkWithNoHrefWithNoTabIndex").attr("tabindex"), undefined, "anchor without href, no tabindex set" );
	equal( jQuery("#linkWithNoHrefWithTabIndex").attr("tabindex"), "1", "anchor without href, tabindex set to 2" );
	equal( jQuery("#linkWithNoHrefWithNegativeTabIndex").attr("tabindex"), "-1", "anchor without href, no tabindex set" );
});

test( "attr('tabindex', value)", function() {
	expect( 9 );

	var element = jQuery("#divWithNoTabIndex");
	equal( element.attr("tabindex"), undefined, "start with no tabindex" );

	// set a positive string
	element.attr( "tabindex", "1" );
	equal( element.attr("tabindex"), "1", "set tabindex to 1 (string)" );

	// set a zero string
	element.attr( "tabindex", "0" );
	equal( element.attr("tabindex"), "0", "set tabindex to 0 (string)" );

	// set a negative string
	element.attr( "tabindex", "-1" );
	equal( element.attr("tabindex"), "-1", "set tabindex to -1 (string)" );

	// set a positive number
	element.attr( "tabindex", 1 );
	equal( element.attr("tabindex"), "1", "set tabindex to 1 (number)" );

	// set a zero number
	element.attr( "tabindex", 0 );
	equal(element.attr("tabindex"), "0", "set tabindex to 0 (number)");

	// set a negative number
	element.attr( "tabindex", -1 );
	equal( element.attr("tabindex"), "-1", "set tabindex to -1 (number)" );

	element = jQuery("#linkWithTabIndex");
	equal( element.attr("tabindex"), "2", "start with tabindex 2" );

	element.attr( "tabindex", -1 );
	equal( element.attr("tabindex"), "-1", "set negative tabindex" );
});

test( "removeAttr(String)", function() {
	expect( 12 );
	var $first;

	equal( jQuery("#mark").removeAttr("class").attr("class"), undefined, "remove class" );
	equal( jQuery("#form").removeAttr("id").attr("id"), undefined, "Remove id" );
	equal( jQuery("#foo").attr( "style", "position:absolute;" ).removeAttr("style").attr("style"), undefined, "Check removing style attribute" );
	equal( jQuery("#form").attr( "style", "position:absolute;" ).removeAttr("style").attr("style"), undefined, "Check removing style attribute on a form" );
	equal( jQuery("<div style='position: absolute'></div>").appendTo("#foo").removeAttr("style").prop("style").cssText, "", "Check removing style attribute (#9699 Webkit)" );
	equal( jQuery("#fx-test-group").attr( "height", "3px" ).removeAttr("height").get( 0 ).style.height, "1px", "Removing height attribute has no effect on height set with style attribute" );

	jQuery("#check1").removeAttr("checked").prop( "checked", true ).removeAttr("checked");
	equal( document.getElementById("check1").checked, false, "removeAttr sets boolean properties to false" );
	jQuery("#text1").prop( "readOnly", true ).removeAttr("readonly");
	equal( document.getElementById("text1").readOnly, false, "removeAttr sets boolean properties to false" );

	jQuery("#option2c").removeAttr("selected");
	equal( jQuery("#option2d").attr("selected"), "selected", "Removing `selected` from an option that is not selected does not remove selected from the currently selected option (#10870)" );

	try {
		$first = jQuery("#first").attr( "contenteditable", "true" ).removeAttr("contenteditable");
		equal( $first.attr("contenteditable"), undefined, "Remove the contenteditable attribute" );
	} catch( e ) {
		ok( false, "Removing contenteditable threw an error (#10429)" );
	}

	$first = jQuery("<div Case='mixed'></div>");
	equal( $first.attr("Case"), "mixed", "case of attribute doesn't matter" );
	$first.removeAttr("Case");
	equal( $first.attr( "Case" ), undefined, "mixed-case attribute was removed" );
});

test( "removeAttr(String) in XML", function() {
	expect( 7 );
	var xml = createDashboardXML(),
		iwt = jQuery( "infowindowtab", xml );

	equal( iwt.attr("normal"), "ab", "Check initial value" );
	iwt.removeAttr("Normal");
	equal( iwt.attr("normal"), "ab", "Should still be there" );
	iwt.removeAttr("normal");
	equal( iwt.attr("normal"), undefined, "Removed" );

	equal( iwt.attr("mixedCase"), "yes", "Check initial value" );
	equal( iwt.attr("mixedcase"), undefined, "toLowerCase not work good" );
	iwt.removeAttr("mixedcase");
	equal( iwt.attr("mixedCase"), "yes", "Should still be there" );
	iwt.removeAttr("mixedCase");
	equal( iwt.attr("mixedCase"), undefined, "Removed" );
});

test( "removeAttr(Multi String, variable space width)", function() {
	expect( 8 );

	var div = jQuery("<div id='a' alt='b' title='c' rel='d'></div>"),
		tests = {
			id: "a",
			alt: "b",
			title: "c",
			rel: "d"
		};

	jQuery.each( tests, function( key, val ) {
		equal( div.attr( key ), val, "Attribute `" + key + "` exists, and has a value of `" + val + "`" );
	});

	div.removeAttr( "id   alt title  rel  " );

	jQuery.each( tests, function( key ) {
		equal( div.attr( key ), undefined, "Attribute `" + key + "` was removed" );
	});
});

test( "prop(String, Object)", function() {

	expect( 17 );

	equal( jQuery("#text1").prop("value"), "Test", "Check for value attribute" );
	equal( jQuery("#text1").prop( "value", "Test2" ).prop("defaultValue"), "Test", "Check for defaultValue attribute" );
	equal( jQuery("#select2").prop("selectedIndex"), 3, "Check for selectedIndex attribute" );
	equal( jQuery("#foo").prop("nodeName").toUpperCase(), "DIV", "Check for nodeName attribute" );
	equal( jQuery("#foo").prop("tagName").toUpperCase(), "DIV", "Check for tagName attribute" );
	equal( jQuery("<option/>").prop("selected"), false, "Check selected attribute on disconnected element." );

	equal( jQuery("#listWithTabIndex").prop("tabindex"), 5, "Check retrieving tabindex" );
	jQuery("#text1").prop( "readonly", true );
	equal( document.getElementById("text1").readOnly, true, "Check setting readOnly property with 'readonly'" );
	equal( jQuery("#label-for").prop("for"), "action", "Check retrieving htmlFor" );
	jQuery("#text1").prop("class", "test");
	equal( document.getElementById("text1").className, "test", "Check setting className with 'class'" );
	equal( jQuery("#text1").prop("maxlength"), 30, "Check retrieving maxLength" );
	jQuery("#table").prop( "cellspacing", 1 );
	equal( jQuery("#table").prop("cellSpacing"), "1", "Check setting and retrieving cellSpacing" );
	jQuery("#table").prop( "cellpadding", 1 );
	equal( jQuery("#table").prop("cellPadding"), "1", "Check setting and retrieving cellPadding" );
	jQuery("#table").prop( "rowspan", 1 );
	equal( jQuery("#table").prop("rowSpan"), 1, "Check setting and retrieving rowSpan" );
	jQuery("#table").prop( "colspan", 1 );
	equal( jQuery("#table").prop("colSpan"), 1, "Check setting and retrieving colSpan" );
	jQuery("#table").prop( "usemap", 1 );
	equal( jQuery("#table").prop("useMap"), 1, "Check setting and retrieving useMap" );
	jQuery("#table").prop( "frameborder", 1 );
	equal( jQuery("#table").prop("frameBorder"), 1, "Check setting and retrieving frameBorder" );
});

test( "prop(String, Object) on null/undefined", function() {

  expect( 14 );

	var select, optgroup, option, attributeNode, commentNode, textNode, obj, $form,
		body = document.body,
		$body = jQuery( body );

	ok( $body.prop("nextSibling") === null, "Make sure a null expando returns null" );
	body["foo"] = "bar";
	equal( $body.prop("foo"), "bar", "Make sure the expando is preferred over the dom attribute" );
	body["foo"] = undefined;
	ok( $body.prop("foo") === undefined, "Make sure the expando is preferred over the dom attribute, even if undefined" );

	select = document.createElement("select");
	optgroup = document.createElement("optgroup");
	option = document.createElement("option");

	optgroup.appendChild( option );
	select.appendChild( optgroup );

	equal( jQuery( option ).prop("selected"), true, "Make sure that a single option is selected, even when in an optgroup." );
	equal( jQuery( document ).prop("nodeName"), "#document", "prop works correctly on document nodes (bug #7451)." );

	attributeNode = document.createAttribute("irrelevant");
	commentNode = document.createComment("some comment");
	textNode = document.createTextNode("some text");
	obj = {};
	jQuery.each( [ document, attributeNode, commentNode, textNode, obj, "#firstp" ], function( i, ele ) {
		strictEqual( jQuery( ele ).prop("nonexisting"), undefined, "prop works correctly for non existing attributes (bug #7500)." );
	});

	obj = {};
	jQuery.each( [ document, obj ], function( i, ele ) {
		var $ele = jQuery( ele );
		$ele.prop( "nonexisting", "foo" );
		equal( $ele.prop("nonexisting"), "foo", "prop(name, value) works correctly for non existing attributes (bug #7500)." );
	});
	jQuery( document ).removeProp("nonexisting");

	$form = jQuery("#form").prop( "enctype", "multipart/form-data" );
	equal( $form.prop("enctype"), "multipart/form-data", "Set the enctype of a form (encoding in IE6/7 #6743)" );
});

test( "prop('tabindex')", function() {
	expect( 11 );

	// inputs without tabIndex attribute
	equal( jQuery("#inputWithoutTabIndex").prop("tabindex"), 0, "input without tabindex" );
	equal( jQuery("#buttonWithoutTabIndex").prop("tabindex"), 0, "button without tabindex" );
	equal( jQuery("#textareaWithoutTabIndex").prop("tabindex"), 0, "textarea without tabindex" );

	// elements not natively tabbable
	equal( jQuery("#listWithTabIndex").prop("tabindex"), 5, "not natively tabbable, with tabindex set to 0" );
	equal( jQuery("#divWithNoTabIndex").prop("tabindex"), -1, "not natively tabbable, no tabindex set" );

	// anchor with href
	equal( jQuery("#linkWithNoTabIndex").prop("tabindex"), 0, "anchor with href, no tabindex set" );
	equal( jQuery("#linkWithTabIndex").prop("tabindex"), 2, "anchor with href, tabindex set to 2" );
	equal( jQuery("#linkWithNegativeTabIndex").prop("tabindex"), -1, "anchor with href, tabindex set to -1" );

	// anchor without href
	equal( jQuery("#linkWithNoHrefWithNoTabIndex").prop("tabindex"), -1, "anchor without href, no tabindex set" );
	equal( jQuery("#linkWithNoHrefWithTabIndex").prop("tabindex"), 1, "anchor without href, tabindex set to 2" );
	equal( jQuery("#linkWithNoHrefWithNegativeTabIndex").prop("tabindex"), -1, "anchor without href, no tabindex set" );
});

test( "prop('tabindex', value)", 10, function() {

	var clone,
		element = jQuery("#divWithNoTabIndex");

	equal( element.prop("tabindex"), -1, "start with no tabindex" );

	// set a positive string
	element.prop( "tabindex", "1" );
	equal( element.prop("tabindex"), 1, "set tabindex to 1 (string)" );

	// set a zero string
	element.prop( "tabindex", "0" );
	equal( element.prop("tabindex"), 0, "set tabindex to 0 (string)" );

	// set a negative string
	element.prop( "tabindex", "-1" );
	equal( element.prop("tabindex"), -1, "set tabindex to -1 (string)" );

	// set a positive number
	element.prop( "tabindex", 1 );
	equal( element.prop("tabindex"), 1, "set tabindex to 1 (number)" );

	// set a zero number
	element.prop( "tabindex", 0 );
	equal( element.prop("tabindex"), 0, "set tabindex to 0 (number)" );

	// set a negative number
	element.prop( "tabindex", -1 );
	equal( element.prop("tabindex"), -1, "set tabindex to -1 (number)" );

	element = jQuery("#linkWithTabIndex");
	equal( element.prop("tabindex"), 2, "start with tabindex 2" );

	element.prop( "tabindex", -1 );
	equal( element.prop("tabindex"), -1, "set negative tabindex" );

	clone = element.clone();
	clone.prop( "tabindex", 1 );
	equal( clone[ 0 ].getAttribute("tabindex"), "1", "set tabindex on cloned element" );
});

test( "removeProp(String)", function() {
	expect( 6 );
	var attributeNode = document.createAttribute("irrelevant"),
		commentNode = document.createComment("some comment"),
		textNode = document.createTextNode("some text"),
		obj = {};

	strictEqual(
		jQuery( "#firstp" ).prop( "nonexisting", "foo" ).removeProp( "nonexisting" )[ 0 ]["nonexisting"],
		undefined,
		"removeprop works correctly on DOM element nodes"
	);

	jQuery.each( [ document, obj ], function( i, ele ) {
		var $ele = jQuery( ele );
		$ele.prop( "nonexisting", "foo" ).removeProp("nonexisting");
		strictEqual( ele["nonexisting"], undefined, "removeProp works correctly on non DOM element nodes (bug #7500)." );
	});
	jQuery.each( [ commentNode, textNode, attributeNode ], function( i, ele ) {
		var $ele = jQuery( ele );
		$ele.prop( "nonexisting", "foo" ).removeProp("nonexisting");
		strictEqual( ele["nonexisting"], undefined, "removeProp works correctly on non DOM element nodes (bug #7500)." );
	});
});

test( "val() after modification", function() {

	expect( 1 );

	document.getElementById("text1").value = "bla";
	equal( jQuery("#text1").val(), "bla", "Check for modified value of input element" );
});


test( "val()", function() {

	expect( 20 + ( jQuery.fn.serialize ? 6 : 0 ) );

	var checks, $button;
	equal( jQuery("#text1").val(), "Test", "Check for value of input element" );
	// ticket #1714 this caused a JS error in IE
	equal( jQuery("#first").val(), "", "Check a paragraph element to see if it has a value" );
	ok( jQuery([]).val() === undefined, "Check an empty jQuery object will return undefined from val" );

	equal( jQuery("#select2").val(), "3", "Call val() on a single='single' select" );

	deepEqual( jQuery("#select3").val(), [ "1", "2" ], "Call val() on a multiple='multiple' select" );

	equal( jQuery("#option3c").val(), "2", "Call val() on a option element with value" );

	equal( jQuery("#option3a").val(), "", "Call val() on a option element with empty value" );

	equal( jQuery("#option3e").val(), "no value", "Call val() on a option element with no value attribute" );

	equal( jQuery("#option3a").val(), "", "Call val() on a option element with no value attribute" );

	jQuery("#select3").val("");
	deepEqual( jQuery("#select3").val(), [""], "Call val() on a multiple='multiple' select" );

	deepEqual( jQuery("#select4").val(), [], "Call val() on multiple='multiple' select with all disabled options" );

	jQuery("#select4 optgroup").add("#select4 > [disabled]").attr( "disabled", false );
	deepEqual( jQuery("#select4").val(), [ "2", "3" ], "Call val() on multiple='multiple' select with some disabled options" );

	jQuery("#select4").attr( "disabled", true );
	deepEqual( jQuery("#select4").val(), [ "2", "3" ], "Call val() on disabled multiple='multiple' select" );

	equal( jQuery("#select5").val(), "3", "Check value on ambiguous select." );

	jQuery("#select5").val( 1 );
	equal( jQuery("#select5").val(), "1", "Check value on ambiguous select." );

	jQuery("#select5").val( 3 );
	equal( jQuery("#select5").val(), "3", "Check value on ambiguous select." );

	strictEqual(
		jQuery("<select name='select12584' id='select12584'><option value='1' disabled='disabled'>1</option></select>").val(),
		null,
		"Select-one with only option disabled (#12584)"
	);

	if ( jQuery.fn.serialize ) {
		checks = jQuery("<input type='checkbox' name='test' value='1'/><input type='checkbox' name='test' value='2'/><input type='checkbox' name='test' value=''/><input type='checkbox' name='test'/>").appendTo("#form");

		deepEqual( checks.serialize(), "", "Get unchecked values." );

		equal( checks.eq( 3 ).val(), "on", "Make sure a value of 'on' is provided if none is specified." );

		checks.val([ "2" ]);
		deepEqual( checks.serialize(), "test=2", "Get a single checked value." );

		checks.val([ "1", "" ]);
		deepEqual( checks.serialize(), "test=1&test=", "Get multiple checked values." );

		checks.val([ "", "2" ]);
		deepEqual( checks.serialize(), "test=2&test=", "Get multiple checked values." );

		checks.val([ "1", "on" ]);
		deepEqual( checks.serialize(), "test=1&test=on", "Get multiple checked values." );

		checks.remove();
	}

	$button = jQuery("<button value='foobar'>text</button>").insertAfter("#button");
	equal( $button.val(), "foobar", "Value retrieval on a button does not return innerHTML" );
	equal( $button.val("baz").html(), "text", "Setting the value does not change innerHTML" );

	equal( jQuery("<option/>").val("test").attr("value"), "test", "Setting value sets the value attribute" );
});

test("val() with non-matching values on dropdown list", function() {
	expect( 3 );

	jQuery("#select5").val( "" );
	equal( jQuery("#select5").val(), null, "Non-matching set on select-one" );

	var select6 = jQuery("<select multiple id=\"select6\"><option value=\"1\">A</option><option value=\"2\">B</option></select>").appendTo("#form");
	jQuery(select6).val( "nothing" );
	equal( jQuery(select6).val(), null, "Non-matching set (single value) on select-multiple" );

	jQuery(select6).val( ["nothing1", "nothing2"] );
	equal( jQuery(select6).val(), null, "Non-matching set (array of values) on select-multiple" );

	select6.remove();
});

if ( "value" in document.createElement("meter") &&
			"value" in document.createElement("progress") ) {

	test( "val() respects numbers without exception (Bug #9319)", function() {

		expect( 4 );

		var $meter = jQuery("<meter min='0' max='10' value='5.6'></meter>"),
			$progress = jQuery("<progress max='10' value='1.5'></progress>");

		try {
			equal( typeof $meter.val(), "number", "meter, returns a number and does not throw exception" );
			equal( $meter.val(), $meter[ 0 ].value, "meter, api matches host and does not throw exception" );

			equal( typeof $progress.val(), "number", "progress, returns a number and does not throw exception" );
			equal( $progress.val(), $progress[ 0 ].value, "progress, api matches host and does not throw exception" );

		} catch( e ) {}

		$meter.remove();
		$progress.remove();
	});
}

var testVal = function( valueObj ) {
	expect( 9 );

	jQuery("#text1").val( valueObj("test") );
	equal( document.getElementById("text1").value, "test", "Check for modified (via val(String)) value of input element" );

	jQuery("#text1").val( valueObj( undefined ) );
	equal( document.getElementById("text1").value, "", "Check for modified (via val(undefined)) value of input element" );

	jQuery("#text1").val( valueObj( 67 ) );
	equal( document.getElementById("text1").value, "67", "Check for modified (via val(Number)) value of input element" );

	jQuery("#text1").val( valueObj( null ) );
	equal( document.getElementById("text1").value, "", "Check for modified (via val(null)) value of input element" );

	var j,
		$select = jQuery( "<select multiple><option value='1'/><option value='2'/></select>" ),
		$select1 = jQuery("#select1");

	$select1.val( valueObj("3") );
	equal( $select1.val(), "3", "Check for modified (via val(String)) value of select element" );

	$select1.val( valueObj( 2 ) );
	equal( $select1.val(), "2", "Check for modified (via val(Number)) value of select element" );

	$select1.append("<option value='4'>four</option>");
	$select1.val( valueObj( 4 ) );
	equal( $select1.val(), "4", "Should be possible to set the val() to a newly created option" );

	// using contents will get comments regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();
	j.val( valueObj( "asdf" ) );
	equal( j.val(), "asdf", "Check node,textnode,comment with val()" );
	j.removeAttr("value");

	$select.val( valueObj( [ "1", "2" ] ) );
	deepEqual( $select.val(), [ "1", "2" ], "Should set array of values" );
};

test( "val(String/Number)", function() {
	testVal( bareObj );
});

test( "val(Function)", function() {
	testVal( functionReturningObj );
});

test( "val(Array of Numbers) (Bug #7123)", function() {
	expect( 4 );
	jQuery("#form").append("<input type='checkbox' name='arrayTest' value='1' /><input type='checkbox' name='arrayTest' value='2' /><input type='checkbox' name='arrayTest' value='3' checked='checked' /><input type='checkbox' name='arrayTest' value='4' />");
	var elements = jQuery("input[name=arrayTest]").val([ 1, 2 ]);
	ok( elements[ 0 ].checked, "First element was checked" );
	ok( elements[ 1 ].checked, "Second element was checked" );
	ok( !elements[ 2 ].checked, "Third element was unchecked" );
	ok( !elements[ 3 ].checked, "Fourth element remained unchecked" );

	elements.remove();
});

test( "val(Function) with incoming value", function() {
	expect( 10 );

	var oldVal = jQuery("#text1").val();

	jQuery("#text1").val(function( i, val ) {
		equal( val, oldVal, "Make sure the incoming value is correct." );
		return "test";
	});

	equal( document.getElementById("text1").value, "test", "Check for modified (via val(String)) value of input element" );

	oldVal = jQuery("#text1").val();

	jQuery("#text1").val(function( i, val ) {
		equal( val, oldVal, "Make sure the incoming value is correct." );
		return 67;
	});

	equal( document.getElementById("text1").value, "67", "Check for modified (via val(Number)) value of input element" );

	oldVal = jQuery("#select1").val();

	jQuery("#select1").val(function( i, val ) {
		equal( val, oldVal, "Make sure the incoming value is correct." );
		return "3";
	});

	equal( jQuery("#select1").val(), "3", "Check for modified (via val(String)) value of select element" );

	oldVal = jQuery("#select1").val();

	jQuery("#select1").val(function( i, val ) {
		equal( val, oldVal, "Make sure the incoming value is correct." );
		return 2;
	});

	equal( jQuery("#select1").val(), "2", "Check for modified (via val(Number)) value of select element" );

	jQuery("#select1").append("<option value='4'>four</option>");

	oldVal = jQuery("#select1").val();

	jQuery("#select1").val(function( i, val ) {
		equal( val, oldVal, "Make sure the incoming value is correct." );
		return 4;
	});

	equal( jQuery("#select1").val(), "4", "Should be possible to set the val() to a newly created option" );
});

// testing if a form.reset() breaks a subsequent call to a select element's .val() (in IE only)
test( "val(select) after form.reset() (Bug #2551)", function() {
	expect( 3 );

	jQuery("<form id='kk' name='kk'><select id='kkk'><option value='cf'>cf</option><option value='gf'>gf</option></select></form>").appendTo("#qunit-fixture");

	jQuery("#kkk").val("gf");

	document["kk"].reset();

	equal( jQuery("#kkk")[ 0 ].value, "cf", "Check value of select after form reset." );
	equal( jQuery("#kkk").val(), "cf", "Check value of select after form reset." );

	// re-verify the multi-select is not broken (after form.reset) by our fix for single-select
	deepEqual( jQuery("#select3").val(), ["1", "2"], "Call val() on a multiple='multiple' select" );

	jQuery("#kk").remove();
});

var testAddClass = function( valueObj ) {
	expect( 9 );

	var pass, j, i,
		div = jQuery("#qunit-fixture div");
	div.addClass( valueObj("test") );
	pass = true;
	for ( i = 0; i < div.length; i++ ) {
		if ( !~div.get( i ).className.indexOf("test") ) {
			pass = false;
		}
	}
	ok( pass, "Add Class" );

	// using contents will get regular, text, and comment nodes
	j = jQuery("#nonnodes").contents();
	j.addClass( valueObj("asdf") );
	ok( j.hasClass("asdf"), "Check node,textnode,comment for addClass" );

	div = jQuery("<div/>");

	div.addClass( valueObj("test") );
	equal( div.attr("class"), "test", "Make sure there's no extra whitespace." );

	div.attr( "class", " foo" );
	div.addClass( valueObj("test") );
	equal( div.attr("class"), "foo test", "Make sure there's no extra whitespace." );

	div.attr( "class", "foo" );
	div.addClass( valueObj("bar baz") );
	equal( div.attr("class"), "foo bar baz", "Make sure there isn't too much trimming." );

	div.removeClass();
	div.addClass( valueObj("foo") ).addClass( valueObj("foo") );
	equal( div.attr("class"), "foo", "Do not add the same class twice in separate calls." );

	div.addClass( valueObj("fo") );
	equal( div.attr("class"), "foo fo", "Adding a similar class does not get interrupted." );
	div.removeClass().addClass("wrap2");
	ok( div.addClass("wrap").hasClass("wrap"), "Can add similarly named classes");

	div.removeClass();
	div.addClass( valueObj("bar bar") );
	equal( div.attr("class"), "bar", "Do not add the same class twice in the same call." );
};

test( "addClass(String)", function() {
	testAddClass( bareObj );
});

test( "addClass(Function)", function() {
	testAddClass( functionReturningObj );
});

test( "addClass(Function) with incoming value", function() {
	expect( 52 );
	var pass, i,
		div = jQuery("#qunit-fixture div"),
		old = div.map(function() {
			return jQuery(this).attr("class") || "";
		});

	div.addClass(function( i, val ) {
		if ( this.id !== "_firebugConsole" ) {
			equal( val, old[ i ], "Make sure the incoming value is correct." );
			return "test";
		}
	});

	pass = true;
	for ( i = 0; i < div.length; i++ ) {
		if ( div.get(i).className.indexOf("test") === -1 ) {
			pass = false;
		}
	}
	ok( pass, "Add Class" );
});

var testRemoveClass = function(valueObj) {
	expect( 8 );

	var $set = jQuery("#qunit-fixture div"),
		div = document.createElement("div");

	$set.addClass("test").removeClass( valueObj("test") );

	ok( !$set.is(".test"), "Remove Class" );

	$set.addClass("test").addClass("foo").addClass("bar");
	$set.removeClass( valueObj("test") ).removeClass( valueObj("bar") ).removeClass( valueObj("foo") );

	ok( !$set.is(".test,.bar,.foo"), "Remove multiple classes" );

	// Make sure that a null value doesn't cause problems
	$set.eq( 0 ).addClass("expected").removeClass( valueObj( null ) );
	ok( $set.eq( 0 ).is(".expected"), "Null value passed to removeClass" );

	$set.eq( 0 ).addClass("expected").removeClass( valueObj("") );
	ok( $set.eq( 0 ).is(".expected"), "Empty string passed to removeClass" );

	// using contents will get regular, text, and comment nodes
	$set = jQuery("#nonnodes").contents();
	$set.removeClass( valueObj("asdf") );
	ok( !$set.hasClass("asdf"), "Check node,textnode,comment for removeClass" );


	jQuery( div ).removeClass( valueObj("foo") );
	strictEqual( jQuery( div ).attr("class"), undefined, "removeClass doesn't create a class attribute" );

	div.className = " test foo ";

	jQuery( div ).removeClass( valueObj("foo") );
	equal( div.className, "test", "Make sure remaining className is trimmed." );

	div.className = " test ";

	jQuery( div ).removeClass( valueObj("test") );
	equal( div.className, "", "Make sure there is nothing left after everything is removed." );
};

test( "removeClass(String) - simple", function() {
	testRemoveClass( bareObj );
});

test( "removeClass(Function) - simple", function() {
	testRemoveClass( functionReturningObj );
});

test( "removeClass(Function) with incoming value", function() {
	expect( 52 );

	var $divs = jQuery("#qunit-fixture div").addClass("test"), old = $divs.map(function() {
		return jQuery( this ).attr("class");
	});

	$divs.removeClass(function( i, val ) {
		if ( this.id !== "_firebugConsole" ) {
			equal( val, old[ i ], "Make sure the incoming value is correct." );
			return "test";
		}
	});

	ok( !$divs.is(".test"), "Remove Class" );
});

test( "removeClass() removes duplicates", function() {
	expect( 1 );

	var $div = jQuery( jQuery.parseHTML("<div class='x x x'></div>") );

	$div.removeClass("x");

	ok( !$div.hasClass("x"), "Element with multiple same classes does not escape the wrath of removeClass()" );
});

test("removeClass(undefined) is a no-op", function() {
	expect( 1 );

	var $div = jQuery("<div class='base second'></div>");
	$div.removeClass( undefined );

	ok( $div.hasClass("base") && $div.hasClass("second"), "Element still has classes after removeClass(undefined)" );
});

var testToggleClass = function(valueObj) {
	expect( 17 );

	var e = jQuery("#firstp");
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass( valueObj("test") );
	ok( e.is(".test"), "Assert class present" );
	e.toggleClass( valueObj("test") );
	ok( !e.is(".test"), "Assert class not present" );

	// class name with a boolean
	e.toggleClass( valueObj("test"), false );
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass( valueObj("test"), true );
	ok( e.is(".test"), "Assert class present" );
	e.toggleClass( valueObj("test"), false );
	ok( !e.is(".test"), "Assert class not present" );

	// multiple class names
	e.addClass("testA testB");
	ok( e.is(".testA.testB"), "Assert 2 different classes present" );
	e.toggleClass( valueObj("testB testC") );
	ok( (e.is(".testA.testC") && !e.is(".testB")), "Assert 1 class added, 1 class removed, and 1 class kept" );
	e.toggleClass( valueObj("testA testC") );
	ok( (!e.is(".testA") && !e.is(".testB") && !e.is(".testC")), "Assert no class present" );

	// toggleClass storage
	e.toggleClass( true );
	ok( e[ 0 ].className === "", "Assert class is empty (data was empty)" );
	e.addClass("testD testE");
	ok( e.is(".testD.testE"), "Assert class present" );
	e.toggleClass();
	ok( !e.is(".testD.testE"), "Assert class not present" );
	ok( jQuery._data(e[ 0 ], "__className__") === "testD testE", "Assert data was stored" );
	e.toggleClass();
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );
	e.toggleClass( false );
	ok( !e.is(".testD.testE"), "Assert class not present" );
	e.toggleClass( true );
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );
	e.toggleClass();
	e.toggleClass( false );
	e.toggleClass();
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );

	// Cleanup
	e.removeClass("testD");
	QUnit.expectJqData( e[ 0 ], "__className__" );
};

test( "toggleClass(String|boolean|undefined[, boolean])", function() {
	testToggleClass( bareObj );
});

test( "toggleClass(Function[, boolean])", function() {
	testToggleClass( functionReturningObj );
});

test( "toggleClass(Function[, boolean]) with incoming value", function() {
	expect( 14 );

	var e = jQuery("#firstp"),
		old = e.attr("class") || "";

	ok( !e.is(".test"), "Assert class not present" );

	e.toggleClass(function( i, val ) {
		equal( old, val, "Make sure the incoming value is correct." );
		return "test";
	});
	ok( e.is(".test"), "Assert class present" );

	old = e.attr("class");

	e.toggleClass(function( i, val ) {
		equal( old, val, "Make sure the incoming value is correct." );
		return "test";
	});
	ok( !e.is(".test"), "Assert class not present" );

	old = e.attr("class") || "";

	// class name with a boolean
	e.toggleClass(function( i, val, state ) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, false, "Make sure that the state is passed in." );
		return "test";
	}, false );
	ok( !e.is(".test"), "Assert class not present" );

	old = e.attr("class") || "";

	e.toggleClass(function( i, val, state ) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, true, "Make sure that the state is passed in." );
		return "test";
	}, true );
	ok( e.is(".test"), "Assert class present" );

	old = e.attr("class");

	e.toggleClass(function( i, val, state ) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, false, "Make sure that the state is passed in." );
		return "test";
	}, false );
	ok( !e.is(".test"), "Assert class not present" );
});

test( "addClass, removeClass, hasClass", function() {
	expect( 17 );

	var jq = jQuery("<p>Hi</p>"), x = jq[ 0 ];

	jq.addClass("hi");
	equal( x.className, "hi", "Check single added class" );

	jq.addClass("foo bar");
	equal( x.className, "hi foo bar", "Check more added classes" );

	jq.removeClass();
	equal( x.className, "", "Remove all classes" );

	jq.addClass("hi foo bar");
	jq.removeClass("foo");
	equal( x.className, "hi bar", "Check removal of one class" );

	ok( jq.hasClass("hi"), "Check has1" );
	ok( jq.hasClass("bar"), "Check has2" );

	jq = jQuery("<p class='class1\nclass2\tcla.ss3\n\rclass4'></p>");

	ok( jq.hasClass("class1"), "Check hasClass with line feed" );
	ok( jq.is(".class1"), "Check is with line feed" );
	ok( jq.hasClass("class2"), "Check hasClass with tab" );
	ok( jq.is(".class2"), "Check is with tab" );
	ok( jq.hasClass("cla.ss3"), "Check hasClass with dot" );
	ok( jq.hasClass("class4"), "Check hasClass with carriage return" );
	ok( jq.is(".class4"), "Check is with carriage return" );

	jq.removeClass("class2");
	ok( jq.hasClass("class2") === false, "Check the class has been properly removed" );
	jq.removeClass("cla");
	ok( jq.hasClass("cla.ss3"), "Check the dotted class has not been removed" );
	jq.removeClass("cla.ss3");
	ok( jq.hasClass("cla.ss3") === false, "Check the dotted class has been removed" );
	jq.removeClass("class4");
	ok( jq.hasClass("class4") === false, "Check the class has been properly removed" );
});

test( "addClass, removeClass, hasClass on many elements", function() {
	expect( 19 );

	var elem = jQuery( "<p>p0</p><p>p1</p><p>p2</p>" );

	elem.addClass( "hi" );
	equal( elem[ 0 ].className, "hi", "Check single added class" );
	equal( elem[ 1 ].className, "hi", "Check single added class" );
	equal( elem[ 2 ].className, "hi", "Check single added class" );

	elem.addClass( "foo bar" );
	equal( elem[ 0 ].className, "hi foo bar", "Check more added classes" );
	equal( elem[ 1 ].className, "hi foo bar", "Check more added classes" );
	equal( elem[ 2 ].className, "hi foo bar", "Check more added classes" );

	elem.removeClass();
	equal( elem[ 0 ].className, "", "Remove all classes" );
	equal( elem[ 1 ].className, "", "Remove all classes" );
	equal( elem[ 2 ].className, "", "Remove all classes" );

	elem.addClass( "hi foo bar" );
	elem.removeClass( "foo" );
	equal( elem[ 0 ].className, "hi bar", "Check removal of one class" );
	equal( elem[ 1 ].className, "hi bar", "Check removal of one class" );
	equal( elem[ 2 ].className, "hi bar", "Check removal of one class" );

	ok( elem.hasClass( "hi" ), "Check has1" );
	ok( elem.hasClass( "bar" ), "Check has2" );

	ok( jQuery( "<p class='hi'>p0</p><p>p1</p><p>p2</p>" ).hasClass( "hi" ),
		"Did find a class in the first element" );
	ok( jQuery( "<p>p0</p><p class='hi'>p1</p><p>p2</p>" ).hasClass( "hi" ),
		"Did find a class in the second element" );
	ok( jQuery( "<p>p0</p><p>p1</p><p class='hi'>p2</p>" ).hasClass( "hi" ),
		"Did find a class in the last element" );

	ok( jQuery( "<p class='hi'>p0</p><p class='hi'>p1</p><p class='hi'>p2</p>" ).hasClass( "hi" ),
		"Did find a class when present in all elements" );

	ok( !jQuery( "<p class='hi0'>p0</p><p class='hi1'>p1</p><p class='hi2'>p2</p>" ).hasClass( "hi" ),
		"Did not find a class when not present" );
});

test( "contents().hasClass() returns correct values", function() {
	expect( 2 );

	var $div = jQuery("<div><span class='foo'></span><!-- comment -->text</div>"),
	$contents = $div.contents();

	ok( $contents.hasClass("foo"), "Found 'foo' in $contents" );
	ok( !$contents.hasClass("undefined"), "Did not find 'undefined' in $contents (correctly)" );
});

test( "hasClass correctly interprets non-space separators (#13835)", function() {
	expect( 4 );

	var
		map = {
			tab: "&#9;",
			"line-feed": "&#10;",
			"form-feed": "&#12;",
			"carriage-return": "&#13;"
		},
		classes = jQuery.map( map, function( separator, label ) {
			return " " + separator + label + separator + " ";
		}),
		$div = jQuery( "<div class='" + classes + "'></div>" );

	jQuery.each( map, function( label ) {
		ok( $div.hasClass( label ), label.replace( "-", " " ) );
	});
});

test( "coords returns correct values in IE6/IE7, see #10828", function() {
	expect( 1 );

	var area,
		map = jQuery("<map />");

	area = map.html("<area shape='rect' coords='0,0,0,0' href='#' alt='a' />").find("area");
	equal( area.attr("coords"), "0,0,0,0", "did not retrieve coords correctly" );
});

test( "should not throw at $(option).val() (#14686)", 1, function() {
	try {
		jQuery( "<option/>" ).val();
		ok( true );
	} catch ( _ ) {
		ok( false );
	}
});
