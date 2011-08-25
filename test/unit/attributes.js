module("attributes", { teardown: moduleTeardown });

var bareObj = function(value) { return value; };
var functionReturningObj = function(value) { return (function() { return value; }); };


test("jQuery.attrFix/jQuery.propFix integrity test", function() {
	expect(2);

	//  This must be maintained and equal jQuery.attrFix when appropriate
	//  Ensure that accidental or erroneous property
	//  overwrites don't occur
	//  This is simply for better code coverage and future proofing.
	var props = {
			tabindex: "tabIndex",
			readonly: "readOnly",
			"for": "htmlFor",
			"class": "className",
			maxlength: "maxLength",
			cellspacing: "cellSpacing",
			cellpadding: "cellPadding",
			rowspan: "rowSpan",
			colspan: "colSpan",
			usemap: "useMap",
			frameborder: "frameBorder",
			contenteditable: "contentEditable"
		};

	var propsShouldBe = {
		tabindex: "tabIndex"
	};

	deepEqual(propsShouldBe, jQuery.attrFix, "jQuery.attrFix passes integrity check");
	deepEqual(props, jQuery.propFix, "jQuery.propFix passes integrity check");
});

test("attr(String)", function() {
	expect(45);

	equals( jQuery("#text1").attr("type"), "text", "Check for type attribute" );
	equals( jQuery("#radio1").attr("type"), "radio", "Check for type attribute" );
	equals( jQuery("#check1").attr("type"), "checkbox", "Check for type attribute" );
	equals( jQuery("#simon1").attr("rel"), "bookmark", "Check for rel attribute" );
	equals( jQuery("#google").attr("title"), "Google!", "Check for title attribute" );
	equals( jQuery("#mark").attr("hreflang"), "en", "Check for hreflang attribute" );
	equals( jQuery("#en").attr("lang"), "en", "Check for lang attribute" );
	equals( jQuery("#simon").attr("class"), "blog link", "Check for class attribute" );
	equals( jQuery("#name").attr("name"), "name", "Check for name attribute" );
	equals( jQuery("#text1").attr("name"), "action", "Check for name attribute" );
	ok( jQuery("#form").attr("action").indexOf("formaction") >= 0, "Check for action attribute" );
	equals( jQuery("#text1").attr("value", "t").attr("value"), "t", "Check setting the value attribute" );
	equals( jQuery("<div value='t'></div>").attr("value"), "t", "Check setting custom attr named 'value' on a div" );
	equals( jQuery("#form").attr("blah", "blah").attr("blah"), "blah", "Set non-existant attribute on a form" );
	equals( jQuery("#foo").attr("height"), undefined, "Non existent height attribute should return undefined" );

	// [7472] & [3113] (form contains an input with name="action" or name="id")
	var extras = jQuery("<input name='id' name='name' /><input id='target' name='target' />").appendTo("#testForm");
	equals( jQuery("#form").attr("action","newformaction").attr("action"), "newformaction", "Check that action attribute was changed" );
	equals( jQuery("#testForm").attr("target"), undefined, "Retrieving target does not equal the input with name=target" );
	equals( jQuery("#testForm").attr("target", "newTarget").attr("target"), "newTarget", "Set target successfully on a form" );
	equals( jQuery("#testForm").removeAttr("id").attr("id"), undefined, "Retrieving id does not equal the input with name=id after id is removed [#7472]" );
	// Bug #3685 (form contains input with name="name")
	equals( jQuery("#testForm").attr("name"), undefined, "Retrieving name does not retrieve input with name=name" );
	extras.remove();

	equals( jQuery("#text1").attr("maxlength"), "30", "Check for maxlength attribute" );
	equals( jQuery("#text1").attr("maxLength"), "30", "Check for maxLength attribute" );
	equals( jQuery("#area1").attr("maxLength"), "30", "Check for maxLength attribute" );

	// using innerHTML in IE causes href attribute to be serialized to the full path
	jQuery("<a/>").attr({ "id": "tAnchor5", "href": "#5" }).appendTo("#qunit-fixture");
	equals( jQuery("#tAnchor5").attr("href"), "#5", "Check for non-absolute href (an anchor)" );

	// list attribute is readonly by default in browsers that support it
	jQuery("#list-test").attr("list", "datalist");
	equals( jQuery("#list-test").attr("list"), "datalist", "Check setting list attribute" );

	// Related to [5574] and [5683]
	var body = document.body, $body = jQuery(body);

	strictEqual( $body.attr("foo"), undefined, "Make sure that a non existent attribute returns undefined" );

	body.setAttribute("foo", "baz");
	equals( $body.attr("foo"), "baz", "Make sure the dom attribute is retrieved when no expando is found" );

	$body.attr("foo","cool");
	equals( $body.attr("foo"), "cool", "Make sure that setting works well when both expando and dom attribute are available" );

	body.removeAttribute("foo"); // Cleanup

	var select = document.createElement("select"), optgroup = document.createElement("optgroup"), option = document.createElement("option");
	optgroup.appendChild( option );
	select.appendChild( optgroup );

	equal( jQuery( option ).attr("selected"), "selected", "Make sure that a single option is selected, even when in an optgroup." );

	var $img = jQuery("<img style='display:none' width='215' height='53' src='http://static.jquery.com/files/rocker/images/logo_jquery_215x53.gif'/>").appendTo("body");
	equals( $img.attr("width"), "215", "Retrieve width attribute an an element with display:none." );
	equals( $img.attr("height"), "53", "Retrieve height attribute an an element with display:none." );

	// Check for style support
	ok( !!~jQuery("#dl").attr("style").indexOf("position"), "Check style attribute getter, also normalize css props to lowercase" );
	ok( !!~jQuery("#foo").attr("style", "position:absolute;").attr("style").indexOf("position"), "Check style setter" );

	// Check value on button element (#1954)
	var $button = jQuery("<button value='foobar'>text</button>").insertAfter("#button");
	equals( $button.attr("value"), "foobar", "Value retrieval on a button does not return innerHTML" );
	equals( $button.attr("value", "baz").html(), "text", "Setting the value does not change innerHTML" );

	// Attributes with a colon on a table element (#1591)
	equals( jQuery("#table").attr("test:attrib"), undefined, "Retrieving a non-existent attribute on a table with a colon does not throw an error." );
	equals( jQuery("#table").attr("test:attrib", "foobar").attr("test:attrib"), "foobar", "Setting an attribute on a table with a colon does not throw an error." );

	var $form = jQuery("<form class='something'></form>").appendTo("#qunit-fixture");
	equal( $form.attr("class"), "something", "Retrieve the class attribute on a form." );

	var $a = jQuery("<a href='#' onclick='something()'>Click</a>").appendTo("#qunit-fixture");
	equal( $a.attr("onclick"), "something()", "Retrieve ^on attribute without anonymous function wrapper." );

	ok( jQuery("<div/>").attr("doesntexist") === undefined, "Make sure undefined is returned when no attribute is found." );
	ok( jQuery("<div/>").attr("title") === undefined, "Make sure undefined is returned when no attribute is found." );
	equal( jQuery("<div/>").attr("title", "something").attr("title"), "something", "Set the title attribute." );
	ok( jQuery().attr("doesntexist") === undefined, "Make sure undefined is returned when no element is there." );
	equal( jQuery("<div/>").attr("value"), undefined, "An unset value on a div returns undefined." );
	equal( jQuery("<input/>").attr("value"), "", "An unset value on an input returns current value." );
});

if ( !isLocal ) {
	test("attr(String) in XML Files", function() {
		expect(3);
		stop();
		jQuery.get("data/dashboard.xml", function( xml ) {
			equal( jQuery( "locations", xml ).attr("class"), "foo", "Check class attribute in XML document" );
			equal( jQuery( "location", xml ).attr("for"), "bar", "Check for attribute in XML document" );
			equal( jQuery( "location", xml ).attr("checked"), "different", "Check that hooks are not attached in XML document" );
			start();
		});
	});
}

test("attr(String, Function)", function() {
	expect(2);
	equals( jQuery("#text1").attr("value", function() { return this.id; })[0].value, "text1", "Set value from id" );
	equals( jQuery("#text1").attr("title", function(i) { return i; }).attr("title"), "0", "Set value with an index");
});

test("attr(Hash)", function() {
	expect(3);
	var pass = true;
	jQuery("div").attr({foo: "baz", zoo: "ping"}).each(function(){
		if ( this.getAttribute("foo") != "baz" && this.getAttribute("zoo") != "ping" ) pass = false;
	});
	ok( pass, "Set Multiple Attributes" );
	equals( jQuery("#text1").attr({value: function() { return this.id; }})[0].value, "text1", "Set attribute to computed value #1" );
	equals( jQuery("#text1").attr({title: function(i) { return i; }}).attr("title"), "0", "Set attribute to computed value #2");

});

test("attr(String, Object)", function() {
	expect(75);

	var div = jQuery("div").attr("foo", "bar"),
		fail = false;

	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).getAttribute("foo") != "bar" ){
			fail = i;
			break;
		}
	}

	equals( fail, false, "Set Attribute, the #" + fail + " element didn't get the attribute 'foo'" );

	ok( jQuery("#foo").attr({ "width": null }), "Try to set an attribute to nothing" );

	jQuery("#name").attr("name", "something");
	equals( jQuery("#name").attr("name"), "something", "Set name attribute" );
	jQuery("#name").attr("name", null);
	equals( jQuery("#name").attr("name"), undefined, "Remove name attribute" );
	var $input = jQuery("<input>", { name: "something" });
	equals( $input.attr("name"), "something", "Check element creation gets/sets the name attribute." );

	jQuery("#check2").prop("checked", true).prop("checked", false).attr("checked", true);
	equals( document.getElementById("check2").checked, true, "Set checked attribute" );
	equals( jQuery("#check2").prop("checked"), true, "Set checked attribute" );
	equals( jQuery("#check2").attr("checked"), "checked", "Set checked attribute" );
	jQuery("#check2").attr("checked", false);
	equals( document.getElementById("check2").checked, false, "Set checked attribute" );
	equals( jQuery("#check2").prop("checked"), false, "Set checked attribute" );
	equals( jQuery("#check2").attr("checked"), undefined, "Set checked attribute" );
	jQuery("#text1").attr("readonly", true);
	equals( document.getElementById("text1").readOnly, true, "Set readonly attribute" );
	equals( jQuery("#text1").prop("readOnly"), true, "Set readonly attribute" );
	equals( jQuery("#text1").attr("readonly"), "readonly", "Set readonly attribute" );
	jQuery("#text1").attr("readonly", false);
	equals( document.getElementById("text1").readOnly, false, "Set readonly attribute" );
	equals( jQuery("#text1").prop("readOnly"), false, "Set readonly attribute" );
	equals( jQuery("#text1").attr("readonly"), undefined, "Set readonly attribute" );

	jQuery("#check2").prop("checked", true);
	equals( document.getElementById("check2").checked, true, "Set checked attribute" );
	equals( jQuery("#check2").prop("checked"), true, "Set checked attribute" );
	equals( jQuery("#check2").attr("checked"), "checked", "Set checked attribute" );
	jQuery("#check2").prop("checked", false);
	equals( document.getElementById("check2").checked, false, "Set checked attribute" );
	equals( jQuery("#check2").prop("checked"), false, "Set checked attribute" );
	equals( jQuery("#check2").attr("checked"), undefined, "Set checked attribute" );

	jQuery("#check2").attr("checked", "checked");
	equal( document.getElementById("check2").checked, true, "Set checked attribute with 'checked'" );
	equal( jQuery("#check2").prop("checked"), true, "Set checked attribute" );
	equal( jQuery("#check2").attr("checked"), "checked", "Set checked attribute" );

	jQuery("#text1").prop("readOnly", true);
	equals( document.getElementById("text1").readOnly, true, "Set readonly attribute" );
	equals( jQuery("#text1").prop("readOnly"), true, "Set readonly attribute" );
	equals( jQuery("#text1").attr("readonly"), "readonly", "Set readonly attribute" );
	jQuery("#text1").prop("readOnly", false);
	equals( document.getElementById("text1").readOnly, false, "Set readonly attribute" );
	equals( jQuery("#text1").prop("readOnly"), false, "Set readonly attribute" );
	equals( jQuery("#text1").attr("readonly"), undefined, "Set readonly attribute" );

	jQuery("#name").attr("maxlength", "5");
	equals( document.getElementById("name").maxLength, 5, "Set maxlength attribute" );
	jQuery("#name").attr("maxLength", "10");
	equals( document.getElementById("name").maxLength, 10, "Set maxlength attribute" );

	// HTML5 boolean attributes
	var $text = jQuery("#text1").attr({
		"autofocus": true,
		"required": true
	});
	equal( $text.attr("autofocus"), "autofocus", "Set boolean attributes to the same name" );
	equal( $text.attr("autofocus", false).attr("autofocus"), undefined, "Setting autofocus attribute to false removes it" );
	equal( $text.attr("required"), "required", "Set boolean attributes to the same name" );
	equal( $text.attr("required", false).attr("required"), undefined, "Setting required attribute to false removes it" );

	var $details = jQuery("<details open></details>").appendTo("#qunit-fixture");
	equal( $details.attr("open"), "open", "open attribute presense indicates true" );
	equal( $details.attr("open", false).attr("open"), undefined, "Setting open attribute to false removes it" );

	$text.attr("data-something", true);
	equal( $text.attr("data-something"), "true", "Set data attributes");
	equal( $text.data("something"), true, "Setting data attributes are not affected by boolean settings");
	$text.attr("data-another", false);
	equal( $text.attr("data-another"), "false", "Set data attributes");
	equal( $text.data("another"), false, "Setting data attributes are not affected by boolean settings" );
	equal( $text.attr("aria-disabled", false).attr("aria-disabled"), "false", "Setting aria attributes are not affected by boolean settings");
	$text.removeData("something").removeData("another").removeAttr("aria-disabled");

	jQuery("#foo").attr("contenteditable", true);
	equals( jQuery("#foo").attr("contenteditable"), "true", "Enumerated attributes are set properly" );

	var attributeNode = document.createAttribute("irrelevant"),
		commentNode = document.createComment("some comment"),
		textNode = document.createTextNode("some text"),
		obj = {};

	jQuery.each( [commentNode, textNode, attributeNode], function( i, elem ) {
		var $elem = jQuery( elem );
		$elem.attr( "nonexisting", "foo" );
		strictEqual( $elem.attr("nonexisting"), undefined, "attr(name, value) works correctly on comment and text nodes (bug #7500)." );
	});

	jQuery.each( [window, document, obj, "#firstp"], function( i, elem ) {
		var $elem = jQuery( elem );
		strictEqual( $elem.attr("nonexisting"), undefined, "attr works correctly for non existing attributes (bug #7500)." );
		equal( $elem.attr("something", "foo" ).attr("something"), "foo", "attr falls back to prop on unsupported arguments" );
	});

	var table = jQuery("#table").append("<tr><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr>"),
		td = table.find("td:first");
	td.attr("rowspan", "2");
	equals( td[0].rowSpan, 2, "Check rowspan is correctly set" );
	td.attr("colspan", "2");
	equals( td[0].colSpan, 2, "Check colspan is correctly set" );
	table.attr("cellspacing", "2");
	equals( table[0].cellSpacing, "2", "Check cellspacing is correctly set" );

	equals( jQuery("#area1").attr("value"), "foobar", "Value attribute retrieves the property for backwards compatibility." );

	// for #1070
	jQuery("#name").attr("someAttr", "0");
	equals( jQuery("#name").attr("someAttr"), "0", "Set attribute to a string of \"0\"" );
	jQuery("#name").attr("someAttr", 0);
	equals( jQuery("#name").attr("someAttr"), "0", "Set attribute to the number 0" );
	jQuery("#name").attr("someAttr", 1);
	equals( jQuery("#name").attr("someAttr"), "1", "Set attribute to the number 1" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();

	j.attr("name", "attrvalue");
	equals( j.attr("name"), "attrvalue", "Check node,textnode,comment for attr" );
	j.removeAttr("name");

	QUnit.reset();

	// Type
	var type = jQuery("#check2").attr("type");
	var thrown = false;
	try {
		jQuery("#check2").attr("type","hidden");
	} catch(e) {
		thrown = true;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( type, jQuery("#check2").attr("type"), "Verify that you can't change the type of an input element" );

	var check = document.createElement("input");
	var thrown = true;
	try {
		jQuery(check).attr("type", "checkbox");
	} catch(e) {
		thrown = false;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "checkbox", jQuery(check).attr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

	var check = jQuery("<input />");
	var thrown = true;
	try {
		check.attr("type","checkbox");
	} catch(e) {
		thrown = false;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "checkbox", check.attr("type"), "Verify that you can change the type of an input element that isn't in the DOM" );

	var button = jQuery("#button");
	var thrown = false;
	try {
		button.attr("type","submit");
	} catch(e) {
		thrown = true;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "button", button.attr("type"), "Verify that you can't change the type of a button element" );

	var $radio = jQuery("<input>", { "value": "sup", "type": "radio" }).appendTo("#testForm");
	equals( $radio.val(), "sup", "Value is not reset when type is set after value on a radio" );

	// Setting attributes on svg elements (bug #3116)
	var $svg = jQuery("<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' baseProfile='full' width='200' height='200'>"
		+ "<circle cx='200' cy='200' r='150' />"
	+ "</svg>").appendTo("body");
	equals( $svg.attr("cx", 100).attr("cx"), "100", "Set attribute on svg element" );
	$svg.remove();
});

test("attr(jquery_method)", function(){
	expect(7);

	var $elem = jQuery("<div />"),
		elem = $elem[0];

	// one at a time
	$elem.attr({html: "foo"}, true);
	equals( elem.innerHTML, "foo", "attr(html)");

	$elem.attr({text: "bar"}, true);
	equals( elem.innerHTML, "bar", "attr(text)");

	$elem.attr({css: {color: "red"}}, true);
	ok( /^(#ff0000|red)$/i.test(elem.style.color), "attr(css)");

	$elem.attr({height: 10}, true);
	equals( elem.style.height, "10px", "attr(height)");

	// Multiple attributes

	$elem.attr({
		width:10,
		css:{ paddingLeft:1, paddingRight:1 }
	}, true);

	equals( elem.style.width, "10px", "attr({...})");
	equals( elem.style.paddingLeft, "1px", "attr({...})");
	equals( elem.style.paddingRight, "1px", "attr({...})");
});

if ( !isLocal ) {
	test("attr(String, Object) - Loaded via XML document", function() {
		expect(2);
		stop();
		jQuery.get("data/dashboard.xml", function( xml ) {
			var titles = [];
			jQuery( "tab", xml ).each(function() {
				titles.push( jQuery(this).attr("title") );
			});
			equals( titles[0], "Location", "attr() in XML context: Check first title" );
			equals( titles[1], "Users", "attr() in XML context: Check second title" );
			start();
		});
	});
}

test("attr('tabindex')", function() {
	expect(8);

	// elements not natively tabbable
	equals(jQuery("#listWithTabIndex").attr("tabindex"), 5, "not natively tabbable, with tabindex set to 0");
	equals(jQuery("#divWithNoTabIndex").attr("tabindex"), undefined, "not natively tabbable, no tabindex set");

	// anchor with href
	equals(jQuery("#linkWithNoTabIndex").attr("tabindex"), 0, "anchor with href, no tabindex set");
	equals(jQuery("#linkWithTabIndex").attr("tabindex"), 2, "anchor with href, tabindex set to 2");
	equals(jQuery("#linkWithNegativeTabIndex").attr("tabindex"), -1, "anchor with href, tabindex set to -1");

	// anchor without href
	equals(jQuery("#linkWithNoHrefWithNoTabIndex").attr("tabindex"), undefined, "anchor without href, no tabindex set");
	equals(jQuery("#linkWithNoHrefWithTabIndex").attr("tabindex"), 1, "anchor without href, tabindex set to 2");
	equals(jQuery("#linkWithNoHrefWithNegativeTabIndex").attr("tabindex"), -1, "anchor without href, no tabindex set");
});

test("attr('tabindex', value)", function() {
	expect(9);

	var element = jQuery("#divWithNoTabIndex");
	equals(element.attr("tabindex"), undefined, "start with no tabindex");

	// set a positive string
	element.attr("tabindex", "1");
	equals(element.attr("tabindex"), 1, "set tabindex to 1 (string)");

	// set a zero string
	element.attr("tabindex", "0");
	equals(element.attr("tabindex"), 0, "set tabindex to 0 (string)");

	// set a negative string
	element.attr("tabindex", "-1");
	equals(element.attr("tabindex"), -1, "set tabindex to -1 (string)");

	// set a positive number
	element.attr("tabindex", 1);
	equals(element.attr("tabindex"), 1, "set tabindex to 1 (number)");

	// set a zero number
	element.attr("tabindex", 0);
	equals(element.attr("tabindex"), 0, "set tabindex to 0 (number)");

	// set a negative number
	element.attr("tabindex", -1);
	equals(element.attr("tabindex"), -1, "set tabindex to -1 (number)");

	element = jQuery("#linkWithTabIndex");
	equals(element.attr("tabindex"), 2, "start with tabindex 2");

	element.attr("tabindex", -1);
	equals(element.attr("tabindex"), -1, "set negative tabindex");
});

test("removeAttr(String)", function() {
	expect(8);
	equal( jQuery("#mark").removeAttr( "class" )[0].className, "", "remove class" );
	equal( jQuery("#form").removeAttr("id").attr("id"), undefined, "Remove id" );
	equal( jQuery("#foo").attr("style", "position:absolute;").removeAttr("style").attr("style"), undefined, "Check removing style attribute" );
	equal( jQuery("#form").attr("style", "position:absolute;").removeAttr("style").attr("style"), undefined, "Check removing style attribute on a form" );
	equal( jQuery("<div style='position: absolute'></div>").appendTo("#foo").removeAttr("style").prop("style").cssText, "", "Check removing style attribute (#9699 Webkit)" );
	equal( jQuery("#fx-test-group").attr("height", "3px").removeAttr("height").css("height"), "1px", "Removing height attribute has no effect on height set with style attribute" );

	jQuery("#check1").removeAttr("checked").prop("checked", true).removeAttr("checked");
	equal( document.getElementById("check1").checked, false, "removeAttr sets boolean properties to false" );
	jQuery("#text1").prop("readOnly", true).removeAttr("readonly");
	equal( document.getElementById("text1").readOnly, false, "removeAttr sets boolean properties to false" );
});

test("prop(String, Object)", function() {
	expect(30);

	equals( jQuery("#text1").prop("value"), "Test", "Check for value attribute" );
	equals( jQuery("#text1").prop("value", "Test2").prop("defaultValue"), "Test", "Check for defaultValue attribute" );
	equals( jQuery("#select2").prop("selectedIndex"), 3, "Check for selectedIndex attribute" );
	equals( jQuery("#foo").prop("nodeName").toUpperCase(), "DIV", "Check for nodeName attribute" );
	equals( jQuery("#foo").prop("tagName").toUpperCase(), "DIV", "Check for tagName attribute" );
	equals( jQuery("<option/>").prop("selected"), false, "Check selected attribute on disconnected element." );

	equals( jQuery("#listWithTabIndex").prop("tabindex"), 5, "Check retrieving tabindex" );
	jQuery("#text1").prop("readonly", true);
	equals( document.getElementById("text1").readOnly, true, "Check setting readOnly property with 'readonly'" );
	equals( jQuery("#label-for").prop("for"), "action", "Check retrieving htmlFor" );
	jQuery("#text1").prop("class", "test");
	equals( document.getElementById("text1").className, "test", "Check setting className with 'class'" );
	equals( jQuery("#text1").prop("maxlength"), 30, "Check retrieving maxLength" );
	jQuery("#table").prop("cellspacing", 1);
	equals( jQuery("#table").prop("cellSpacing"), "1", "Check setting and retrieving cellSpacing" );
	jQuery("#table").prop("cellpadding", 1);
	equals( jQuery("#table").prop("cellPadding"), "1", "Check setting and retrieving cellPadding" );
	jQuery("#table").prop("rowspan", 1);
	equals( jQuery("#table").prop("rowSpan"), 1, "Check setting and retrieving rowSpan" );
	jQuery("#table").prop("colspan", 1);
	equals( jQuery("#table").prop("colSpan"), 1, "Check setting and retrieving colSpan" );
	jQuery("#table").prop("usemap", 1);
	equals( jQuery("#table").prop("useMap"), 1, "Check setting and retrieving useMap" );
	jQuery("#table").prop("frameborder", 1);
	equals( jQuery("#table").prop("frameBorder"), 1, "Check setting and retrieving frameBorder" );
	QUnit.reset();

	var body = document.body, $body = jQuery( body );
	ok( $body.prop("nextSibling") === null, "Make sure a null expando returns null" );
	body.foo = "bar";
	equals( $body.prop("foo"), "bar", "Make sure the expando is preferred over the dom attribute" );
	body.foo = undefined;
	ok( $body.prop("foo") === undefined, "Make sure the expando is preferred over the dom attribute, even if undefined" );

	var select = document.createElement("select"), optgroup = document.createElement("optgroup"), option = document.createElement("option");
	optgroup.appendChild( option );
	select.appendChild( optgroup );

	equals( jQuery(option).prop("selected"), true, "Make sure that a single option is selected, even when in an optgroup." );
	equals( jQuery(document).prop("nodeName"), "#document", "prop works correctly on document nodes (bug #7451)." );

	var attributeNode = document.createAttribute("irrelevant"),
		commentNode = document.createComment("some comment"),
		textNode = document.createTextNode("some text"),
		obj = {};
	jQuery.each( [document, attributeNode, commentNode, textNode, obj, "#firstp"], function( i, ele ) {
		strictEqual( jQuery(ele).prop("nonexisting"), undefined, "prop works correctly for non existing attributes (bug #7500)." );
	});

	var obj = {};
	jQuery.each( [document, obj], function( i, ele ) {
		var $ele = jQuery( ele );
		$ele.prop( "nonexisting", "foo" );
		equal( $ele.prop("nonexisting"), "foo", "prop(name, value) works correctly for non existing attributes (bug #7500)." );
	});
	jQuery( document ).removeProp("nonexisting");
});

test("prop('tabindex')", function() {
	expect(8);

	// elements not natively tabbable
	equals(jQuery("#listWithTabIndex").prop("tabindex"), 5, "not natively tabbable, with tabindex set to 0");
	equals(jQuery("#divWithNoTabIndex").prop("tabindex"), undefined, "not natively tabbable, no tabindex set");

	// anchor with href
	equals(jQuery("#linkWithNoTabIndex").prop("tabindex"), 0, "anchor with href, no tabindex set");
	equals(jQuery("#linkWithTabIndex").prop("tabindex"), 2, "anchor with href, tabindex set to 2");
	equals(jQuery("#linkWithNegativeTabIndex").prop("tabindex"), -1, "anchor with href, tabindex set to -1");

	// anchor without href
	equals(jQuery("#linkWithNoHrefWithNoTabIndex").prop("tabindex"), undefined, "anchor without href, no tabindex set");
	equals(jQuery("#linkWithNoHrefWithTabIndex").prop("tabindex"), 1, "anchor without href, tabindex set to 2");
	equals(jQuery("#linkWithNoHrefWithNegativeTabIndex").prop("tabindex"), -1, "anchor without href, no tabindex set");
});

test("prop('tabindex', value)", function() {
	expect(9);

	var element = jQuery("#divWithNoTabIndex");
	equals(element.prop("tabindex"), undefined, "start with no tabindex");

	// set a positive string
	element.prop("tabindex", "1");
	equals(element.prop("tabindex"), 1, "set tabindex to 1 (string)");

	// set a zero string
	element.prop("tabindex", "0");
	equals(element.prop("tabindex"), 0, "set tabindex to 0 (string)");

	// set a negative string
	element.prop("tabindex", "-1");
	equals(element.prop("tabindex"), -1, "set tabindex to -1 (string)");

	// set a positive number
	element.prop("tabindex", 1);
	equals(element.prop("tabindex"), 1, "set tabindex to 1 (number)");

	// set a zero number
	element.prop("tabindex", 0);
	equals(element.prop("tabindex"), 0, "set tabindex to 0 (number)");

	// set a negative number
	element.prop("tabindex", -1);
	equals(element.prop("tabindex"), -1, "set tabindex to -1 (number)");

	element = jQuery("#linkWithTabIndex");
	equals(element.prop("tabindex"), 2, "start with tabindex 2");

	element.prop("tabindex", -1);
	equals(element.prop("tabindex"), -1, "set negative tabindex");
});

test("removeProp(String)", function() {
	expect(6);
	var attributeNode = document.createAttribute("irrelevant"),
		commentNode = document.createComment("some comment"),
		textNode = document.createTextNode("some text"),
		obj = {};

	strictEqual( jQuery( "#firstp" ).prop( "nonexisting", "foo" ).removeProp( "nonexisting" )[0].nonexisting, undefined, "removeprop works correctly on DOM element nodes" );

	jQuery.each( [document, obj], function( i, ele ) {
		var $ele = jQuery( ele );
		$ele.prop( "nonexisting", "foo" ).removeProp( "nonexisting" );
		strictEqual( ele.nonexisting, undefined, "removeProp works correctly on non DOM element nodes (bug #7500)." );
	});
	jQuery.each( [commentNode, textNode, attributeNode], function( i, ele ) {
		var $ele = jQuery( ele );
		$ele.prop( "nonexisting", "foo" ).removeProp( "nonexisting" );
		strictEqual( ele.nonexisting, undefined, "removeProp works correctly on non DOM element nodes (bug #7500)." );
	});
});

test("val()", function() {
	expect(26);

	document.getElementById("text1").value = "bla";
	equals( jQuery("#text1").val(), "bla", "Check for modified value of input element" );

	QUnit.reset();

	equals( jQuery("#text1").val(), "Test", "Check for value of input element" );
	// ticket #1714 this caused a JS error in IE
	equals( jQuery("#first").val(), "", "Check a paragraph element to see if it has a value" );
	ok( jQuery([]).val() === undefined, "Check an empty jQuery object will return undefined from val" );

	equals( jQuery("#select2").val(), "3", "Call val() on a single=\"single\" select" );

	same( jQuery("#select3").val(), ["1", "2"], "Call val() on a multiple=\"multiple\" select" );

	equals( jQuery("#option3c").val(), "2", "Call val() on a option element with value" );

	equals( jQuery("#option3a").val(), "", "Call val() on a option element with empty value" );

	equals( jQuery("#option3e").val(), "no value", "Call val() on a option element with no value attribute" );

	equals( jQuery("#option3a").val(), "", "Call val() on a option element with no value attribute" );

	jQuery("#select3").val("");
	same( jQuery("#select3").val(), [""], "Call val() on a multiple=\"multiple\" select" );

	same( jQuery("#select4").val(), [], "Call val() on multiple=\"multiple\" select with all disabled options" );

	jQuery("#select4 optgroup").add("#select4 > [disabled]").attr("disabled", false);
	same( jQuery("#select4").val(), ["2", "3"], "Call val() on multiple=\"multiple\" select with some disabled options" );

	jQuery("#select4").attr("disabled", true);
	same( jQuery("#select4").val(), ["2", "3"], "Call val() on disabled multiple=\"multiple\" select" );

	equals( jQuery("#select5").val(), "3", "Check value on ambiguous select." );

	jQuery("#select5").val(1);
	equals( jQuery("#select5").val(), "1", "Check value on ambiguous select." );

	jQuery("#select5").val(3);
	equals( jQuery("#select5").val(), "3", "Check value on ambiguous select." );

	var checks = jQuery("<input type='checkbox' name='test' value='1'/><input type='checkbox' name='test' value='2'/><input type='checkbox' name='test' value=''/><input type='checkbox' name='test'/>").appendTo("#form");

	same( checks.serialize(), "", "Get unchecked values." );

	equals( checks.eq(3).val(), "on", "Make sure a value of 'on' is provided if none is specified." );

	checks.val([ "2" ]);
	same( checks.serialize(), "test=2", "Get a single checked value." );

	checks.val([ "1", "" ]);
	same( checks.serialize(), "test=1&test=", "Get multiple checked values." );

	checks.val([ "", "2" ]);
	same( checks.serialize(), "test=2&test=", "Get multiple checked values." );

	checks.val([ "1", "on" ]);
	same( checks.serialize(), "test=1&test=on", "Get multiple checked values." );

	checks.remove();

	var $button = jQuery("<button value='foobar'>text</button>").insertAfter("#button");
	equals( $button.val(), "foobar", "Value retrieval on a button does not return innerHTML" );
	equals( $button.val("baz").html(), "text", "Setting the value does not change innerHTML" );

	equals( jQuery("<option/>").val("test").attr("value"), "test", "Setting value sets the value attribute" );
});

if ( "value" in document.createElement("meter") &&
			"value" in document.createElement("progress") ) {

	test("val() respects numbers without exception (Bug #9319)", function() {

		expect(4);

		var $meter = jQuery("<meter min='0' max='10' value='5.6'></meter>"),
			$progress = jQuery("<progress max='10' value='1.5'></progress>");

		try {
			equal( typeof $meter.val(), "number", "meter, returns a number and does not throw exception" );
			equal( $meter.val(), $meter[0].value, "meter, api matches host and does not throw exception" );

			equal( typeof $progress.val(), "number", "progress, returns a number and does not throw exception" );
			equal( $progress.val(), $progress[0].value, "progress, api matches host and does not throw exception" );

		} catch(e) {}

		$meter.remove();
		$progress.remove();
	});
}

var testVal = function(valueObj) {
	expect(8);

	QUnit.reset();
	jQuery("#text1").val(valueObj( "test" ));
	equals( document.getElementById("text1").value, "test", "Check for modified (via val(String)) value of input element" );

	jQuery("#text1").val(valueObj( undefined ));
	equals( document.getElementById("text1").value, "", "Check for modified (via val(undefined)) value of input element" );

	jQuery("#text1").val(valueObj( 67 ));
	equals( document.getElementById("text1").value, "67", "Check for modified (via val(Number)) value of input element" );

	jQuery("#text1").val(valueObj( null ));
	equals( document.getElementById("text1").value, "", "Check for modified (via val(null)) value of input element" );

	var $select1 = jQuery("#select1");
	$select1.val(valueObj( "3" ));
	equals( $select1.val(), "3", "Check for modified (via val(String)) value of select element" );

	$select1.val(valueObj( 2 ));
	equals( $select1.val(), "2", "Check for modified (via val(Number)) value of select element" );

	$select1.append("<option value='4'>four</option>");
	$select1.val(valueObj( 4 ));
	equals( $select1.val(), "4", "Should be possible to set the val() to a newly created option" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.val(valueObj( "asdf" ));
	equals( j.val(), "asdf", "Check node,textnode,comment with val()" );
	j.removeAttr("value");
}

test("val(String/Number)", function() {
	testVal(bareObj);
});

test("val(Function)", function() {
	testVal(functionReturningObj);
});

test( "val(Array of Numbers) (Bug #7123)", function() {
	expect(4);
	jQuery("#form").append("<input type='checkbox' name='arrayTest' value='1' /><input type='checkbox' name='arrayTest' value='2' /><input type='checkbox' name='arrayTest' value='3' checked='checked' /><input type='checkbox' name='arrayTest' value='4' />");
	var elements = jQuery("input[name=arrayTest]").val([ 1, 2 ]);
	ok( elements[0].checked, "First element was checked" );
	ok( elements[1].checked, "Second element was checked" );
	ok( !elements[2].checked, "Third element was unchecked" );
	ok( !elements[3].checked, "Fourth element remained unchecked" );

	elements.remove();
});

test("val(Function) with incoming value", function() {
	expect(10);

	QUnit.reset();
	var oldVal = jQuery("#text1").val();

	jQuery("#text1").val(function(i, val) {
		equals( val, oldVal, "Make sure the incoming value is correct." );
		return "test";
	});

	equals( document.getElementById("text1").value, "test", "Check for modified (via val(String)) value of input element" );

	oldVal = jQuery("#text1").val();

	jQuery("#text1").val(function(i, val) {
		equals( val, oldVal, "Make sure the incoming value is correct." );
		return 67;
	});

	equals( document.getElementById("text1").value, "67", "Check for modified (via val(Number)) value of input element" );

	oldVal = jQuery("#select1").val();

	jQuery("#select1").val(function(i, val) {
		equals( val, oldVal, "Make sure the incoming value is correct." );
		return "3";
	});

	equals( jQuery("#select1").val(), "3", "Check for modified (via val(String)) value of select element" );

	oldVal = jQuery("#select1").val();

	jQuery("#select1").val(function(i, val) {
		equals( val, oldVal, "Make sure the incoming value is correct." );
		return 2;
	});

	equals( jQuery("#select1").val(), "2", "Check for modified (via val(Number)) value of select element" );

	jQuery("#select1").append("<option value='4'>four</option>");

	oldVal = jQuery("#select1").val();

	jQuery("#select1").val(function(i, val) {
		equals( val, oldVal, "Make sure the incoming value is correct." );
		return 4;
	});

	equals( jQuery("#select1").val(), "4", "Should be possible to set the val() to a newly created option" );
});

// testing if a form.reset() breaks a subsequent call to a select element's .val() (in IE only)
test("val(select) after form.reset() (Bug #2551)", function() {
	expect(3);

	jQuery("<form id='kk' name='kk'><select id='kkk'><option value='cf'>cf</option><option 	value='gf'>gf</option></select></form>").appendTo("#qunit-fixture");

	jQuery("#kkk").val( "gf" );

	document.kk.reset();

	equal( jQuery("#kkk")[0].value, "cf", "Check value of select after form reset." );
	equal( jQuery("#kkk").val(), "cf", "Check value of select after form reset." );

	// re-verify the multi-select is not broken (after form.reset) by our fix for single-select
	same( jQuery("#select3").val(), ["1", "2"], "Call val() on a multiple=\"multiple\" select" );

	jQuery("#kk").remove();
});

var testAddClass = function(valueObj) {
	expect(9);

	var div = jQuery("div");
	div.addClass( valueObj("test") );
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( !~div.get(i).className.indexOf("test") ) {
			pass = false;
		}
	}
	ok( pass, "Add Class" );

	// using contents will get regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.addClass( valueObj("asdf") );
	ok( j.hasClass("asdf"), "Check node,textnode,comment for addClass" );

	div = jQuery("<div/>");

	div.addClass( valueObj("test") );
	equals( div.attr("class"), "test", "Make sure there's no extra whitespace." );

	div.attr("class", " foo");
	div.addClass( valueObj("test") );
	equals( div.attr("class"), "foo test", "Make sure there's no extra whitespace." );

	div.attr("class", "foo");
	div.addClass( valueObj("bar baz") );
	equals( div.attr("class"), "foo bar baz", "Make sure there isn't too much trimming." );

	div.removeClass();
	div.addClass( valueObj("foo") ).addClass( valueObj("foo") )
	equal( div.attr("class"), "foo", "Do not add the same class twice in separate calls." );

	div.addClass( valueObj("fo") );
	equal( div.attr("class"), "foo fo", "Adding a similar class does not get interrupted." );
	div.removeClass().addClass("wrap2");
	ok( div.addClass("wrap").hasClass("wrap"), "Can add similarly named classes");

	div.removeClass();
	div.addClass( valueObj("bar bar") );
	equal( div.attr("class"), "bar", "Do not add the same class twice in the same call." );
};

test("addClass(String)", function() {
	testAddClass(bareObj);
});

test("addClass(Function)", function() {
	testAddClass(functionReturningObj);
});

test("addClass(Function) with incoming value", function() {
	expect(48);
	var div = jQuery("div"), old = div.map(function(){
		return jQuery(this).attr("class") || "";
	});

	div.addClass(function(i, val) {
		if ( this.id !== "_firebugConsole") {
			equals( val, old[i], "Make sure the incoming value is correct." );
			return "test";
		}
	});

	var pass = true;
	for ( var i = 0; i < div.length; i++ ) {
		if ( div.get(i).className.indexOf("test") == -1 ) pass = false;
	}
	ok( pass, "Add Class" );
});

var testRemoveClass = function(valueObj) {
	expect(7);

	var $divs = jQuery("div");

	$divs.addClass("test").removeClass( valueObj("test") );

	ok( !$divs.is(".test"), "Remove Class" );

	QUnit.reset();
	$divs = jQuery("div");

	$divs.addClass("test").addClass("foo").addClass("bar");
	$divs.removeClass( valueObj("test") ).removeClass( valueObj("bar") ).removeClass( valueObj("foo") );

	ok( !$divs.is(".test,.bar,.foo"), "Remove multiple classes" );

	QUnit.reset();
	$divs = jQuery("div");

	// Make sure that a null value doesn't cause problems
	$divs.eq(0).addClass("test").removeClass( valueObj(null) );
	ok( $divs.eq(0).is(".test"), "Null value passed to removeClass" );

	$divs.eq(0).addClass("test").removeClass( valueObj("") );
	ok( $divs.eq(0).is(".test"), "Empty string passed to removeClass" );

	// using contents will get regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.removeClass( valueObj("asdf") );
	ok( !j.hasClass("asdf"), "Check node,textnode,comment for removeClass" );

	var div = document.createElement("div");
	div.className = " test foo ";

	jQuery(div).removeClass( valueObj("foo") );
	equals( div.className, "test", "Make sure remaining className is trimmed." );

	div.className = " test ";

	jQuery(div).removeClass( valueObj("test") );
	equals( div.className, "", "Make sure there is nothing left after everything is removed." );
};

test("removeClass(String) - simple", function() {
	testRemoveClass(bareObj);
});

test("removeClass(Function) - simple", function() {
	testRemoveClass(functionReturningObj);
});

test("removeClass(Function) with incoming value", function() {
	expect(48);

	var $divs = jQuery("div").addClass("test"), old = $divs.map(function(){
		return jQuery(this).attr("class");
	});

	$divs.removeClass(function(i, val) {
		if ( this.id !== "_firebugConsole" ) {
			equals( val, old[i], "Make sure the incoming value is correct." );
			return "test";
		}
	});

	ok( !$divs.is(".test"), "Remove Class" );

	QUnit.reset();
});

var testToggleClass = function(valueObj) {
	expect(17);

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
	ok( (e.is(".testA.testB")), "Assert 2 different classes present" );
	e.toggleClass( valueObj("testB testC") );
	ok( (e.is(".testA.testC") && !e.is(".testB")), "Assert 1 class added, 1 class removed, and 1 class kept" );
	e.toggleClass( valueObj("testA testC") );
	ok( (!e.is(".testA") && !e.is(".testB") && !e.is(".testC")), "Assert no class present" );

	// toggleClass storage
	e.toggleClass(true);
	ok( e[0].className === "", "Assert class is empty (data was empty)" );
	e.addClass("testD testE");
	ok( e.is(".testD.testE"), "Assert class present" );
	e.toggleClass();
	ok( !e.is(".testD.testE"), "Assert class not present" );
	ok( jQuery._data(e[0], "__className__") === "testD testE", "Assert data was stored" );
	e.toggleClass();
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );
	e.toggleClass(false);
	ok( !e.is(".testD.testE"), "Assert class not present" );
	e.toggleClass(true);
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );
	e.toggleClass();
	e.toggleClass(false);
	e.toggleClass();
	ok( e.is(".testD.testE"), "Assert class present (restored from data)" );

	// Cleanup
	e.removeClass("testD");
	jQuery.removeData(e[0], "__className__", true);
};

test("toggleClass(String|boolean|undefined[, boolean])", function() {
	testToggleClass(bareObj);
});

test("toggleClass(Function[, boolean])", function() {
	testToggleClass(functionReturningObj);
});

test("toggleClass(Fucntion[, boolean]) with incoming value", function() {
	expect(14);

	var e = jQuery("#firstp"), old = e.attr("class") || "";
	ok( !e.is(".test"), "Assert class not present" );

	e.toggleClass(function(i, val) {
		equal( old, val, "Make sure the incoming value is correct." );
		return "test";
	});
	ok( e.is(".test"), "Assert class present" );

	old = e.attr("class");

	e.toggleClass(function(i, val) {
		equal( old, val, "Make sure the incoming value is correct." );
		return "test";
	});
	ok( !e.is(".test"), "Assert class not present" );

	old = e.attr("class") || "";

	// class name with a boolean
	e.toggleClass(function(i, val, state) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, false, "Make sure that the state is passed in." );
		return "test";
	}, false );
	ok( !e.is(".test"), "Assert class not present" );

	old = e.attr("class") || "";

	e.toggleClass(function(i, val, state) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, true, "Make sure that the state is passed in." );
		return "test";
	}, true );
	ok( e.is(".test"), "Assert class present" );

	old = e.attr("class");

	e.toggleClass(function(i, val, state) {
		equal( old, val, "Make sure the incoming value is correct." );
		equal( state, false, "Make sure that the state is passed in." );
		return "test";
	}, false );
	ok( !e.is(".test"), "Assert class not present" );

	// Cleanup
	e.removeClass("test");
	jQuery.removeData(e[0], "__className__", true);
});

test("addClass, removeClass, hasClass", function() {
	expect(17);

	var jq = jQuery("<p>Hi</p>"), x = jq[0];

	jq.addClass("hi");
	equals( x.className, "hi", "Check single added class" );

	jq.addClass("foo bar");
	equals( x.className, "hi foo bar", "Check more added classes" );

	jq.removeClass();
	equals( x.className, "", "Remove all classes" );

	jq.addClass("hi foo bar");
	jq.removeClass("foo");
	equals( x.className, "hi bar", "Check removal of one class" );

	ok( jq.hasClass("hi"), "Check has1" );
	ok( jq.hasClass("bar"), "Check has2" );

	var jq = jQuery("<p class='class1\nclass2\tcla.ss3\n\rclass4'></p>");
	ok( jq.hasClass("class1"), "Check hasClass with line feed" );
	ok( jq.is(".class1"), "Check is with line feed" );
	ok( jq.hasClass("class2"), "Check hasClass with tab" );
	ok( jq.is(".class2"), "Check is with tab" );
	ok( jq.hasClass("cla.ss3"), "Check hasClass with dot" );
	ok( jq.hasClass("class4"), "Check hasClass with carriage return" );
	ok( jq.is(".class4"), "Check is with carriage return" );

	jq.removeClass("class2");
	ok( jq.hasClass("class2")==false, "Check the class has been properly removed" );
	jq.removeClass("cla");
	ok( jq.hasClass("cla.ss3"), "Check the dotted class has not been removed" );
	jq.removeClass("cla.ss3");
	ok( jq.hasClass("cla.ss3")==false, "Check the dotted class has been removed" );
	jq.removeClass("class4");
	ok( jq.hasClass("class4")==false, "Check the class has been properly removed" );
});

test("contents().hasClass() returns correct values", function() {
	expect(2);

	var $div = jQuery("<div><span class='foo'></span><!-- comment -->text</div>"),
	$contents = $div.contents();

	ok( $contents.hasClass("foo"), "Found 'foo' in $contents" );
	ok( !$contents.hasClass("undefined"), "Did not find 'undefined' in $contents (correctly)" );
});
