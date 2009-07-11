module("attributes");

test("attr(String)", function() {
	expect(27);
	equals( jQuery('#text1').attr('value'), "Test", 'Check for value attribute' );
	equals( jQuery('#text1').attr('value', "Test2").attr('defaultValue'), "Test", 'Check for defaultValue attribute' );
	equals( jQuery('#text1').attr('type'), "text", 'Check for type attribute' );
	equals( jQuery('#radio1').attr('type'), "radio", 'Check for type attribute' );
	equals( jQuery('#check1').attr('type'), "checkbox", 'Check for type attribute' );
	equals( jQuery('#simon1').attr('rel'), "bookmark", 'Check for rel attribute' );
	equals( jQuery('#google').attr('title'), "Google!", 'Check for title attribute' );
	equals( jQuery('#mark').attr('hreflang'), "en", 'Check for hreflang attribute' );
	equals( jQuery('#en').attr('lang'), "en", 'Check for lang attribute' );
	equals( jQuery('#simon').attr('class'), "blog link", 'Check for class attribute' );
	equals( jQuery('#name').attr('name'), "name", 'Check for name attribute' );
	equals( jQuery('#text1').attr('name'), "action", 'Check for name attribute' );
	ok( jQuery('#form').attr('action').indexOf("formaction") >= 0, 'Check for action attribute' );
	equals( jQuery('#text1').attr('maxlength'), '30', 'Check for maxlength attribute' );
	equals( jQuery('#text1').attr('maxLength'), '30', 'Check for maxLength attribute' );
	equals( jQuery('#area1').attr('maxLength'), '30', 'Check for maxLength attribute' );
	equals( jQuery('#select2').attr('selectedIndex'), 3, 'Check for selectedIndex attribute' );
	equals( jQuery('#foo').attr('nodeName').toUpperCase(), 'DIV', 'Check for nodeName attribute' );
	equals( jQuery('#foo').attr('tagName').toUpperCase(), 'DIV', 'Check for tagName attribute' );

	jQuery('<a id="tAnchor5"></a>').attr('href', '#5').appendTo('#main'); // using innerHTML in IE causes href attribute to be serialized to the full path
	equals( jQuery('#tAnchor5').attr('href'), "#5", 'Check for non-absolute href (an anchor)' );

	equals( jQuery("<option/>").attr("selected"), false, "Check selected attribute on disconnected element." );


	// Related to [5574] and [5683]
	var body = document.body, $body = jQuery(body);

	ok( $body.attr('foo') === undefined, 'Make sure that a non existent attribute returns undefined' );
	ok( $body.attr('nextSibling') === null, 'Make sure a null expando returns null' );

	body.setAttribute('foo', 'baz');
	equals( $body.attr('foo'), 'baz', 'Make sure the dom attribute is retrieved when no expando is found' );

	body.foo = 'bar';
	equals( $body.attr('foo'), 'bar', 'Make sure the expando is preferred over the dom attribute' );

	$body.attr('foo','cool');
	equals( $body.attr('foo'), 'cool', 'Make sure that setting works well when both expando and dom attribute are available' );

	body.foo = undefined;
	ok( $body.attr('foo') === undefined, 'Make sure the expando is preferred over the dom attribute, even if undefined' );

	body.removeAttribute('foo'); // Cleanup
});

if ( !isLocal ) {
	test("attr(String) in XML Files", function() {
		expect(2);
		stop();
		jQuery.get("data/dashboard.xml", function(xml) {
			equals( jQuery("locations", xml).attr("class"), "foo", "Check class attribute in XML document" );
			equals( jQuery("location", xml).attr("for"), "bar", "Check for attribute in XML document" );
			start();
		});
	});
}

test("attr(String, Function)", function() {
	expect(2);
	equals( jQuery('#text1').attr('value', function() { return this.id })[0].value, "text1", "Set value from id" );
	equals( jQuery('#text1').attr('title', function(i) { return i }).attr('title'), "0", "Set value with an index");
});

test("attr(Hash)", function() {
	expect(3);
	var pass = true;
	jQuery("div").attr({foo: 'baz', zoo: 'ping'}).each(function(){
		if ( this.getAttribute('foo') != "baz" && this.getAttribute('zoo') != "ping" ) pass = false;
	});
	ok( pass, "Set Multiple Attributes" );
       equals( jQuery('#text1').attr({'value': function() { return this.id; }})[0].value, "text1", "Set attribute to computed value #1" );
       equals( jQuery('#text1').attr({'title': function(i) { return i; }}).attr('title'), "0", "Set attribute to computed value #2");

});

test("attr(String, Object)", function() {
	expect(24);
	var div = jQuery("div").attr("foo", "bar"),
		fail = false;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).getAttribute('foo') != "bar" ){
			fail = i;
			break;
		}
	}
	equals( fail, false, "Set Attribute, the #"+fail+" element didn't get the attribute 'foo'" );

	ok( jQuery("#foo").attr({"width": null}), "Try to set an attribute to nothing" );

	jQuery("#name").attr('name', 'something');
	equals( jQuery("#name").attr('name'), 'something', 'Set name attribute' );
	jQuery("#check2").attr('checked', true);
	equals( document.getElementById('check2').checked, true, 'Set checked attribute' );
	jQuery("#check2").attr('checked', false);
	equals( document.getElementById('check2').checked, false, 'Set checked attribute' );
	jQuery("#text1").attr('readonly', true);
	equals( document.getElementById('text1').readOnly, true, 'Set readonly attribute' );
	jQuery("#text1").attr('readonly', false);
	equals( document.getElementById('text1').readOnly, false, 'Set readonly attribute' );
	jQuery("#name").attr('maxlength', '5');
	equals( document.getElementById('name').maxLength, '5', 'Set maxlength attribute' );
	jQuery("#name").attr('maxLength', '10');
	equals( document.getElementById('name').maxLength, '10', 'Set maxlength attribute' );

	var table = jQuery('#table').append("<tr><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr><tr><td>cell</td><td>cell</td></tr>"),
		td = table.find('td:first');
	td.attr("rowspan", "2");
	equals( td[0].rowSpan, 2, "Check rowspan is correctly set" );
	td.attr("colspan", "2");
	equals( td[0].colSpan, 2, "Check colspan is correctly set" );
	table.attr("cellspacing", "2");
	equals( table[0].cellSpacing, 2, "Check cellspacing is correctly set" );

	// for #1070
	jQuery("#name").attr('someAttr', '0');
	equals( jQuery("#name").attr('someAttr'), '0', 'Set attribute to a string of "0"' );
	jQuery("#name").attr('someAttr', 0);
	equals( jQuery("#name").attr('someAttr'), 0, 'Set attribute to the number 0' );
	jQuery("#name").attr('someAttr', 1);
	equals( jQuery("#name").attr('someAttr'), 1, 'Set attribute to the number 1' );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();

	j.attr("name", "attrvalue");
	equals( j.attr("name"), "attrvalue", "Check node,textnode,comment for attr" );
	j.removeAttr("name");

	reset();

	var type = jQuery("#check2").attr('type');
	var thrown = false;
	try {
		jQuery("#check2").attr('type','hidden');
	} catch(e) {
		thrown = true;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( type, jQuery("#check2").attr('type'), "Verify that you can't change the type of an input element" );

	var check = document.createElement("input");
	var thrown = true;
	try {
		jQuery(check).attr('type','checkbox');
	} catch(e) {
		thrown = false;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "checkbox", jQuery(check).attr('type'), "Verify that you can change the type of an input element that isn't in the DOM" );

	var check = jQuery("<input />");
	var thrown = true;
	try {
		check.attr('type','checkbox');
	} catch(e) {
		thrown = false;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "checkbox", check.attr('type'), "Verify that you can change the type of an input element that isn't in the DOM" );

	var button = jQuery("#button");
	var thrown = false;
	try {
		button.attr('type','submit');
	} catch(e) {
		thrown = true;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "button", button.attr('type'), "Verify that you can't change the type of a button element" );
});

if ( !isLocal ) {
	test("attr(String, Object) - Loaded via XML document", function() {
		expect(2);
		stop();
		jQuery.get('data/dashboard.xml', function(xml) {
			var titles = [];
			jQuery('tab', xml).each(function() {
				titles.push(jQuery(this).attr('title'));
			});
			equals( titles[0], 'Location', 'attr() in XML context: Check first title' );
			equals( titles[1], 'Users', 'attr() in XML context: Check second title' );
			start();
		});
	});
}

test("attr('tabindex')", function() {
	expect(8);

	// elements not natively tabbable
	equals(jQuery('#listWithTabIndex').attr('tabindex'), 5, 'not natively tabbable, with tabindex set to 0');
	equals(jQuery('#divWithNoTabIndex').attr('tabindex'), undefined, 'not natively tabbable, no tabindex set');

	// anchor with href
	equals(jQuery('#linkWithNoTabIndex').attr('tabindex'), 0, 'anchor with href, no tabindex set');
	equals(jQuery('#linkWithTabIndex').attr('tabindex'), 2, 'anchor with href, tabindex set to 2');
	equals(jQuery('#linkWithNegativeTabIndex').attr('tabindex'), -1, 'anchor with href, tabindex set to -1');

	// anchor without href
	equals(jQuery('#linkWithNoHrefWithNoTabIndex').attr('tabindex'), undefined, 'anchor without href, no tabindex set');
	equals(jQuery('#linkWithNoHrefWithTabIndex').attr('tabindex'), 1, 'anchor without href, tabindex set to 2');
	equals(jQuery('#linkWithNoHrefWithNegativeTabIndex').attr('tabindex'), -1, 'anchor without href, no tabindex set');
});

test("attr('tabindex', value)", function() {
	expect(9);

	var element = jQuery('#divWithNoTabIndex');
	equals(element.attr('tabindex'), undefined, 'start with no tabindex');

	// set a positive string
	element.attr('tabindex', '1');
	equals(element.attr('tabindex'), 1, 'set tabindex to 1 (string)');

	// set a zero string
	element.attr('tabindex', '0');
	equals(element.attr('tabindex'), 0, 'set tabindex to 0 (string)');

	// set a negative string
	element.attr('tabindex', '-1');
	equals(element.attr('tabindex'), -1, 'set tabindex to -1 (string)');

	// set a positive number
	element.attr('tabindex', 1);
	equals(element.attr('tabindex'), 1, 'set tabindex to 1 (number)');

	// set a zero number
	element.attr('tabindex', 0);
	equals(element.attr('tabindex'), 0, 'set tabindex to 0 (number)');

	// set a negative number
	element.attr('tabindex', -1);
	equals(element.attr('tabindex'), -1, 'set tabindex to -1 (number)');

	element = jQuery('#linkWithTabIndex');
	equals(element.attr('tabindex'), 2, 'start with tabindex 2');

	element.attr('tabindex', -1);
	equals(element.attr('tabindex'), -1, 'set negative tabindex');
});

test("addClass(String)", function() {
	expect(2);
	var div = jQuery("div");
	div.addClass("test");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	 if ( div.get(i).className.indexOf("test") == -1 ) pass = false;
	}
	ok( pass, "Add Class" );

	// using contents will get regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.addClass("asdf");
	ok( j.hasClass("asdf"), "Check node,textnode,comment for addClass" );
});

test("removeClass(String) - simple", function() {
	expect(5);

	var $divs = jQuery('div');

	$divs.addClass("test").removeClass("test");

	ok( !$divs.is('.test'), "Remove Class" );

	reset();

	$divs.addClass("test").addClass("foo").addClass("bar");
	$divs.removeClass("test").removeClass("bar").removeClass("foo");

	ok( !$divs.is('.test,.bar,.foo'), "Remove multiple classes" );

	reset();

	// Make sure that a null value doesn't cause problems
	$divs.eq(0).addClass("test").removeClass(null);
	ok( $divs.eq(0).is('.test'), "Null value passed to removeClass" );

	$divs.eq(0).addClass("test").removeClass("");
	ok( $divs.eq(0).is('.test'), "Empty string passed to removeClass" );

	// using contents will get regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.removeClass("asdf");
	ok( !j.hasClass("asdf"), "Check node,textnode,comment for removeClass" );
});

test("toggleClass(String|boolean|undefined[, boolean])", function() {
	expect(17);

	var e = jQuery("#firstp");
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass("test");
	ok( e.is(".test"), "Assert class present" );
	e.toggleClass("test");
	ok( !e.is(".test"), "Assert class not present" );

	// class name with a boolean
	e.toggleClass("test", false);
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass("test", true);
	ok( e.is(".test"), "Assert class present" );
	e.toggleClass("test", false);
	ok( !e.is(".test"), "Assert class not present" );

	// multiple class names
	e.addClass("testA testB");
	ok( (e.is(".testA.testB")), "Assert 2 different classes present" );
	e.toggleClass("testB testC");
	ok( (e.is(".testA.testC") && !e.is(".testB")), "Assert 1 class added, 1 class removed, and 1 class kept" );
	e.toggleClass("testA testC");
	ok( (!e.is(".testA") && !e.is(".testB") && !e.is(".testC")), "Assert no class present" );

	// toggleClass storage
	e.toggleClass(true);
	ok( e.get(0).className === "", "Assert class is empty (data was empty)" );
	e.addClass("testD testE");
	ok( e.is(".testD.testE"), "Assert class present" );
	e.toggleClass();
	ok( !e.is(".testD.testE"), "Assert class not present" );
	ok( e.data('__className__') === 'testD testE', "Assert data was stored" );
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
	e.removeData('__className__');
});

test("removeAttr(String", function() {
	expect(1);
	equals( jQuery('#mark').removeAttr("class")[0].className, "", "remove class" );
});

test("jQuery.className", function() {
	expect(6);
	var x = jQuery("<p>Hi</p>")[0];
	var c = jQuery.className;
	c.add(x, "hi");
	equals( x.className, "hi", "Check single added class" );
	c.add(x, "foo bar");
	equals( x.className, "hi foo bar", "Check more added classes" );
	c.remove(x);
	equals( x.className, "", "Remove all classes" );
	c.add(x, "hi foo bar");
	c.remove(x, "foo");
	equals( x.className, "hi bar", "Check removal of one class" );
	ok( c.has(x, "hi"), "Check has1" );
	ok( c.has(x, "bar"), "Check has2" );
});
