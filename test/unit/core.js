module("core");

test("Basic requirements", function() {
	expect(7);
	ok( Array.prototype.push, "Array.push()" );
	ok( Function.prototype.apply, "Function.apply()" );
	ok( document.getElementById, "getElementById" );
	ok( document.getElementsByTagName, "getElementsByTagName" );
	ok( RegExp, "RegExp" );
	ok( jQuery, "jQuery" );
	ok( $, "$" );
});

test("jQuery()", function() {
	expect(8);

	var main = jQuery("#main");
	isSet( jQuery("div p", main).get(), q("sndp", "en", "sap"), "Basic selector with jQuery object as context" );

/*
	// disabled since this test was doing nothing. i tried to fix it but i'm not sure
	// what the expected behavior should even be. FF returns "\n" for the text node
	// make sure this is handled
	var crlfContainer = jQuery('<p>\r\n</p>');
	var x = crlfContainer.contents().get(0).nodeValue;
	equals( x, what???, "Check for \\r and \\n in jQuery()" );
*/

	/* // Disabled until we add this functionality in
	var pass = true;
	try {
		jQuery("<div>Testing</div>").appendTo(document.getElementById("iframe").contentDocument.body);
	} catch(e){
		pass = false;
	}
	ok( pass, "jQuery('&lt;tag&gt;') needs optional document parameter to ease cross-frame DOM wrangling, see #968" );*/

	var code = jQuery("<code/>");
	equals( code.length, 1, "Correct number of elements generated for code" );
	var img = jQuery("<img/>");
	equals( img.length, 1, "Correct number of elements generated for img" );
	var div = jQuery("<div/><hr/><code/><b/>");
	equals( div.length, 4, "Correct number of elements generated for div hr code b" );

	// can actually yield more than one, when iframes are included, the window is an array as well
	equals( jQuery(window).length, 1, "Correct number of elements generated for window" );

	equals( jQuery(document).length, 1, "Correct number of elements generated for document" );

	equals( jQuery([1,2,3]).get(1), 2, "Test passing an array to the factory" );

	equals( jQuery(document.body).get(0), jQuery('body').get(0), "Test passing an html node to the factory" );
});

test("selector state", function() {
	expect(30);

	var test;
	
	test = jQuery();
	equals( test.selector, "", "Empty jQuery Selector" );
	equals( test.context, document, "Empty jQuery Context" );
	
	test = jQuery(document);
	equals( test.selector, "", "Document Selector" );
	equals( test.context, document, "Document Context" );
	
	test = jQuery(document.body);
	equals( test.selector, "", "Body Selector" );
	equals( test.context, document.body, "Body Context" );
	
	test = jQuery("#main");
	equals( test.selector, "#main", "#main Selector" );
	equals( test.context, document, "#main Context" );

	test = jQuery("#notfoundnono");
	equals( test.selector, "#notfoundnono", "#notfoundnono Selector" );
	equals( test.context, document, "#notfoundnono Context" );
	
	test = jQuery("#main", document);
	equals( test.selector, "#main", "#main Selector" );
	equals( test.context, document, "#main Context" );
	
	test = jQuery("#main", document.body);
	equals( test.selector, "#main", "#main Selector" );
	equals( test.context, document.body, "#main Context" );

	// Test cloning
	test = jQuery(test);
	equals( test.selector, "#main", "#main Selector" );
	equals( test.context, document.body, "#main Context" );
	
	test = jQuery(document.body).find("#main");
	equals( test.selector, "#main", "#main find Selector" );
	equals( test.context, document.body, "#main find Context" );

	test = jQuery("#main").filter("div");
	equals( test.selector, "#main.filter(div)", "#main filter Selector" );
	equals( test.context, document, "#main filter Context" );
	
	test = jQuery("#main").not("div");
	equals( test.selector, "#main.not(div)", "#main not Selector" );
	equals( test.context, document, "#main not Context" );
	
	test = jQuery("#main").filter("div").not("div");
	equals( test.selector, "#main.filter(div).not(div)", "#main filter, not Selector" );
	equals( test.context, document, "#main filter, not Context" );
	
	test = jQuery("#main").filter("div").not("div").end();
	equals( test.selector, "#main.filter(div)", "#main filter, not, end Selector" );
	equals( test.context, document, "#main filter, not, end Context" );
	
	test = jQuery("#main").parent("body");
	equals( test.selector, "#main.parent(body)", "#main parent Selector" );
	equals( test.context, document, "#main parent Context" );
	
	test = jQuery("#main").eq(0);
	equals( test.selector, "#main.slice(0,1)", "#main eq Selector" );
	equals( test.context, document, "#main eq Context" );
});

test("browser", function() {
	expect(13);
	var browsers = {
		//Internet Explorer
		"Mozilla/5.0 (Windows; U; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)": "6.0",
		"Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.1; .NET CLR 1.1.4322; InfoPath.1; .NET CLR 2.0.50727)": "7.0",
		/** Failing #1876
		 * "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 1.1.4322; .NET CLR 3.0.04506.30)": "7.0",
		 */
		//Browsers with Gecko engine
		//Mozilla
		"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.12) Gecko/20050915" : "1.7.12",
		//Firefox
		"Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en-US; rv:1.8.1.3) Gecko/20070309 Firefox/2.0.0.3": "1.8.1.3",
		//Netscape
		"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7.5) Gecko/20070321 Netscape/8.1.3" : "1.7.5",
		//Flock
		"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.0.11) Gecko/20070321 Firefox/1.5.0.11 Flock/0.7.12" : "1.8.0.11",
		//Opera browser
		"Opera/9.20 (X11; Linux x86_64; U; en)": "9.20",
		"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 9.20" : "9.20",
		"Mozilla/5.0 (Windows NT 5.1; U; pl; rv:1.8.0) Gecko/20060728 Firefox/1.5.0 Opera 9.20": "9.20",
		//WebKit engine
		"Mozilla/5.0 (Macintosh; U; PPC Mac OS X; sv-se) AppleWebKit/418.9 (KHTML, like Gecko) Safari/419.3": "418.9",
		"Mozilla/5.0 (Macintosh; U; PPC Mac OS X; en) AppleWebKit/418.8 (KHTML, like Gecko) Safari/419.3" : "418.8",
		"Mozilla/5.0 (Macintosh; U; PPC Mac OS X; sv-se) AppleWebKit/312.8 (KHTML, like Gecko) Safari/312.5": "312.8",
		//Other user agent string
		"Other browser's user agent 1.0":null
	};
	for (var i in browsers) {
		var v = i.toLowerCase().match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ); // RegEx from Core jQuery.browser.version check
		var version = v ? v[1] : null;
		equals( version, browsers[i], "Checking UA string" );
	}
});

test("noConflict", function() {
	expect(6);

	var $$ = jQuery;

	equals( jQuery, jQuery.noConflict(), "noConflict returned the jQuery object" );
	equals( jQuery, $$, "Make sure jQuery wasn't touched." );
	equals( $, original$, "Make sure $ was reverted." );

	jQuery = $ = $$;

	equals( jQuery.noConflict(true), $$, "noConflict returned the jQuery object" );
	equals( jQuery, originaljQuery, "Make sure jQuery was reverted." );
	equals( $, original$, "Make sure $ was reverted." );

	jQuery = $$;
});

test("isFunction", function() {
	expect(19);

	// Make sure that false values return false
	ok( !jQuery.isFunction(), "No Value" );
	ok( !jQuery.isFunction( null ), "null Value" );
	ok( !jQuery.isFunction( undefined ), "undefined Value" );
	ok( !jQuery.isFunction( "" ), "Empty String Value" );
	ok( !jQuery.isFunction( 0 ), "0 Value" );

	// Check built-ins
	// Safari uses "(Internal Function)"
	ok( jQuery.isFunction(String), "String Function("+String+")" );
	ok( jQuery.isFunction(Array), "Array Function("+Array+")" );
	ok( jQuery.isFunction(Object), "Object Function("+Object+")" );
	ok( jQuery.isFunction(Function), "Function Function("+Function+")" );

	// When stringified, this could be misinterpreted
	var mystr = "function";
	ok( !jQuery.isFunction(mystr), "Function String" );

	// When stringified, this could be misinterpreted
	var myarr = [ "function" ];
	ok( !jQuery.isFunction(myarr), "Function Array" );

	// When stringified, this could be misinterpreted
	var myfunction = { "function": "test" };
	ok( !jQuery.isFunction(myfunction), "Function Object" );

	// Make sure normal functions still work
	var fn = function(){};
	ok( jQuery.isFunction(fn), "Normal Function" );

	var obj = document.createElement("object");

	// Firefox says this is a function
	ok( !jQuery.isFunction(obj), "Object Element" );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( jQuery.isFunction(obj.getAttribute), "getAttribute Function" );

	var nodes = document.body.childNodes;

	// Safari says this is a function
	ok( !jQuery.isFunction(nodes), "childNodes Property" );

	var first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	ok( !jQuery.isFunction(first), "A normal DOM Element" );

	var input = document.createElement("input");
	input.type = "text";
	document.body.appendChild( input );

	// IE says this is an object
	// Since 1.3, this isn't supported (#2968)
	//ok( jQuery.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	var a = document.createElement("a");
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	ok( !jQuery.isFunction(a), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme(callback){
		function fn(response){
			callback(response);
		}

		ok( jQuery.isFunction(fn), "Recursive Function Call" );

		fn({ some: "data" });
	};

	callme(function(){
		callme(function(){});
	});
});

test("jQuery('html')", function() {
	expect(8);

	reset();
	jQuery.foo = false;
	var s = jQuery("<script>jQuery.foo='test';</script>")[0];
	ok( s, "Creating a script" );
	ok( !jQuery.foo, "Make sure the script wasn't executed prematurely" );
	jQuery("body").append("<script>jQuery.foo='test';</script>");
	ok( jQuery.foo, "Executing a scripts contents in the right context" );

	reset();
	ok( jQuery("<link rel='stylesheet'/>")[0], "Creating a link" );

	ok( !jQuery("<script/>")[0].parentNode, "Create a script" );

	ok( jQuery("<input/>").attr("type", "hidden"), "Create an input and set the type." );

	var j = jQuery("<span>hi</span> there <!-- mon ami -->");
	ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	ok( !jQuery("<option>test</option>")[0].selected, "Make sure that options are auto-selected #2050" );
});

test("jQuery('html', context)", function() {
	expect(1);

	var $div = jQuery("<div/>");
	var $span = jQuery("<span/>", $div);
	equals($span.length, 1, "Verify a span created with a div context works, #1763");
});

if ( !isLocal ) {
test("jQuery(selector, xml).text(str) - Loaded via XML document", function() {
	expect(2);
	stop();
	jQuery.get('data/dashboard.xml', function(xml) {
		// tests for #1419 where IE was a problem
		var tab = jQuery("tab", xml).eq(0);
		equals( tab.text(), "blabla", "Verify initial text correct" );
		tab.text("newtext");
		equals( tab.text(), "newtext", "Verify new text correct" );
		start();
	});
});
}

test("length", function() {
	expect(1);
	equals( jQuery("p").length, 6, "Get Number of Elements Found" );
});

test("size()", function() {
	expect(1);
	equals( jQuery("p").size(), 6, "Get Number of Elements Found" );
});

test("get()", function() {
	expect(1);
	isSet( jQuery("p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("get(Number)", function() {
	expect(1);
	equals( jQuery("p").get(0), document.getElementById("firstp"), "Get A Single Element" );
});

test("add(String|Element|Array|undefined)", function() {
	expect(12);
	isSet( jQuery("#sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document" );
	isSet( jQuery("#sndp").add( jQuery("#en")[0] ).add( jQuery("#sap") ).get(), q("sndp", "en", "sap"), "Check elements from document" );
	ok( jQuery([]).add(jQuery("#form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for jQuery(form.elements) since it's ambiguous in IE
	// use jQuery([]).add(form.elements) instead.
	//equals( jQuery([]).add(jQuery("#form")[0].elements).length, jQuery(jQuery("#form")[0].elements).length, "Array in constructor must equals array in add()" );

	var x = jQuery([]).add(jQuery("<p id='x1'>xxx</p>")).add(jQuery("<p id='x2'>xxx</p>"));
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var x = jQuery([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var notDefined;
	equals( jQuery([]).add(notDefined).length, 0, "Check that undefined adds nothing" );

	// Added after #2811
	equals( jQuery([]).add([window,document,document.body,document]).length, 3, "Pass an array" );
	equals( jQuery(document).add(document).length, 1, "Check duplicated elements" );
	equals( jQuery(window).add(window).length, 1, "Check duplicated elements using the window" );
	ok( jQuery([]).add( document.getElementById('form') ).length >= 13, "Add a form (adds the elements)" );
});

test("each(Function)", function() {
	expect(1);
	var div = jQuery("div");
	div.each(function(){this.foo = 'zoo';});
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).foo != "zoo" ) pass = false;
	}
	ok( pass, "Execute a function, Relative" );
});

test("index(Object)", function() {
	expect(10);

	var elements = jQuery([window, document]),
		inputElements = jQuery('#radio1,#radio2,#check1,#check2');

	equals( elements.index(window), 0, "Check for index of elements" );
	equals( elements.index(document), 1, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('radio1')), 0, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('radio2')), 1, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('check1')), 2, "Check for index of elements" );
	equals( inputElements.index(document.getElementById('check2')), 3, "Check for index of elements" );
	equals( inputElements.index(window), -1, "Check for not found index" );
	equals( inputElements.index(document), -1, "Check for not found index" );

	// enabled since [5500]
	equals( elements.index( elements ), 0, "Pass in a jQuery object" );
	equals( elements.index( elements.eq(1) ), 1, "Pass in a jQuery object" );
});

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
	expect(1);
	var pass = true;
	jQuery("div").attr({foo: 'baz', zoo: 'ping'}).each(function(){
		if ( this.getAttribute('foo') != "baz" && this.getAttribute('zoo') != "ping" ) pass = false;
	});
	ok( pass, "Set Multiple Attributes" );
});

test("attr(String, Object)", function() {
	expect(19);
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

test("css(String|Hash)", function() {
	expect(19);

	equals( jQuery('#main').css("display"), 'none', 'Check for css property "display"');

	ok( jQuery('#foo').is(':visible'), 'Modifying CSS display: Assert element is visible');
	jQuery('#foo').css({display: 'none'});
	ok( !jQuery('#foo').is(':visible'), 'Modified CSS display: Assert element is hidden');
	jQuery('#foo').css({display: 'block'});
	ok( jQuery('#foo').is(':visible'), 'Modified CSS display: Assert element is visible');

	jQuery('#floatTest').css({styleFloat: 'right'});
	equals( jQuery('#floatTest').css('styleFloat'), 'right', 'Modified CSS float using "styleFloat": Assert float is right');
	jQuery('#floatTest').css({cssFloat: 'left'});
	equals( jQuery('#floatTest').css('cssFloat'), 'left', 'Modified CSS float using "cssFloat": Assert float is left');
	jQuery('#floatTest').css({'float': 'right'});
	equals( jQuery('#floatTest').css('float'), 'right', 'Modified CSS float using "float": Assert float is right');
	jQuery('#floatTest').css({'font-size': '30px'});
	equals( jQuery('#floatTest').css('font-size'), '30px', 'Modified CSS font-size: Assert font-size is 30px');

	jQuery.each("0,0.25,0.5,0.75,1".split(','), function(i, n) {
		jQuery('#foo').css({opacity: n});
		equals( jQuery('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		jQuery('#foo').css({opacity: parseFloat(n)});
		equals( jQuery('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	jQuery('#foo').css({opacity: ''});
	equals( jQuery('#foo').css('opacity'), '1', "Assert opacity is 1 when set to an empty String" );
});

test("css(String, Object)", function() {
	expect(21);
	ok( jQuery('#foo').is(':visible'), 'Modifying CSS display: Assert element is visible');
	jQuery('#foo').css('display', 'none');
	ok( !jQuery('#foo').is(':visible'), 'Modified CSS display: Assert element is hidden');
	jQuery('#foo').css('display', 'block');
	ok( jQuery('#foo').is(':visible'), 'Modified CSS display: Assert element is visible');

	jQuery('#floatTest').css('styleFloat', 'left');
	equals( jQuery('#floatTest').css('styleFloat'), 'left', 'Modified CSS float using "styleFloat": Assert float is left');
	jQuery('#floatTest').css('cssFloat', 'right');
	equals( jQuery('#floatTest').css('cssFloat'), 'right', 'Modified CSS float using "cssFloat": Assert float is right');
	jQuery('#floatTest').css('float', 'left');
	equals( jQuery('#floatTest').css('float'), 'left', 'Modified CSS float using "float": Assert float is left');
	jQuery('#floatTest').css('font-size', '20px');
	equals( jQuery('#floatTest').css('font-size'), '20px', 'Modified CSS font-size: Assert font-size is 20px');

	jQuery.each("0,0.25,0.5,0.75,1".split(','), function(i, n) {
		jQuery('#foo').css('opacity', n);
		equals( jQuery('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		jQuery('#foo').css('opacity', parseFloat(n));
		equals( jQuery('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	jQuery('#foo').css('opacity', '');
	equals( jQuery('#foo').css('opacity'), '1', "Assert opacity is 1 when set to an empty String" );
	// for #1438, IE throws JS error when filter exists but doesn't have opacity in it
	if (jQuery.browser.msie) {
		jQuery('#foo').css("filter", "progid:DXImageTransform.Microsoft.Chroma(color='red');");
	}
	equals( jQuery('#foo').css('opacity'), '1', "Assert opacity is 1 when a different filter is set in IE, #1438" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.css("padding-left", "1px");
	equals( j.css("padding-left"), "1px", "Check node,textnode,comment css works" );

	// opera sometimes doesn't update 'display' correctly, see #2037
	jQuery("#t2037")[0].innerHTML = jQuery("#t2037")[0].innerHTML
	equals( jQuery("#t2037 .hidden").css("display"), "none", "Make sure browser thinks it is hidden" );
});

test("jQuery.css(elem, 'height') doesn't clear radio buttons (bug #1095)", function () {
	expect(4);

	var $checkedtest = jQuery("#checkedtest");
	// IE6 was clearing "checked" in jQuery.css(elem, "height");
	jQuery.css($checkedtest[0], "height");
	ok( !! jQuery(":radio:first", $checkedtest).attr("checked"), "Check first radio still checked." );
	ok( ! jQuery(":radio:last", $checkedtest).attr("checked"), "Check last radio still NOT checked." );
	ok( !! jQuery(":checkbox:first", $checkedtest).attr("checked"), "Check first checkbox still checked." );
	ok( ! jQuery(":checkbox:last", $checkedtest).attr("checked"), "Check last checkbox still NOT checked." );
});

test("width()", function() {
	expect(8);

	var $div = jQuery("#nothiddendiv");
	$div.width(30);
	equals($div.width(), 30, "Test set to 30 correctly");
	$div.width(-1); // handle negative numbers by ignoring #1599
	equals($div.width(), 30, "Test negative width ignored");
	$div.css("padding", "20px");
	equals($div.width(), 30, "Test padding specified with pixels");
	$div.css("border", "2px solid #fff");
	equals($div.width(), 30, "Test border specified with pixels");
	$div.css("padding", "2em");
	equals($div.width(), 30, "Test padding specified with ems");
	$div.css("border", "1em solid #fff");
	//DISABLED - Opera 9.6 fails this test, returns 8
	//equals($div.width(), 30, "Test border specified with ems");
	$div.css("padding", "2%");
	equals($div.width(), 30, "Test padding specified with percent");
	$div.hide();
	equals($div.width(), 30, "Test hidden div");

	$div.css({ display: "", border: "", padding: "" });

	jQuery("#nothiddendivchild").css({ padding: "3px", border: "2px solid #fff" });
	equals(jQuery("#nothiddendivchild").width(), 20, "Test child width with border and padding");
	jQuery("#nothiddendiv, #nothiddendivchild").css({ border: "", padding: "", width: "" });
});

test("height()", function() {
	expect(7);

	var $div = jQuery("#nothiddendiv");
	$div.height(30);
	equals($div.height(), 30, "Test set to 30 correctly");
	$div.height(-1); // handle negative numbers by ignoring #1599
	equals($div.height(), 30, "Test negative height ignored");
	$div.css("padding", "20px");
	equals($div.height(), 30, "Test padding specified with pixels");
	$div.css("border", "2px solid #fff");
	equals($div.height(), 30, "Test border specified with pixels");
	$div.css("padding", "2em");
	equals($div.height(), 30, "Test padding specified with ems");
	$div.css("border", "1em solid #fff");
	//DISABLED - Opera 9.6 fails this test, returns 8
	//equals($div.height(), 30, "Test border specified with ems");
	$div.css("padding", "2%");
	equals($div.height(), 30, "Test padding specified with percent");
	$div.hide();
	equals($div.height(), 30, "Test hidden div");

	$div.css({ display: "", border: "", padding: "", height: "1px" });
});

test("text()", function() {
	expect(1);
	var expected = "This link has class=\"blog\": Simon Willison's Weblog";
	equals( jQuery('#sap').text(), expected, 'Check for merged text of more then one element.' );
});

test("wrap(String|Element)", function() {
	expect(10);
	var defaultText = 'Try them out:'
	var result = jQuery('#first').wrap('<div class="red"><span></span></div>').text();
	equals( defaultText, result, 'Check for wrapping of on-the-fly html' );
	ok( jQuery('#first').parent().parent().is('.red'), 'Check if wrapper has class "red"' );

	reset();
	var defaultText = 'Try them out:'
	var result = jQuery('#first').wrap(document.getElementById('empty')).parent();
	ok( result.is('ol'), 'Check for element wrapping' );
	equals( result.text(), defaultText, 'Check for element wrapping' );

	reset();
	jQuery('#check1').click(function() {
		var checkbox = this;
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
		jQuery(checkbox).wrap( '<div id="c1" style="display:none;"></div>' );
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
	}).click();

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.wrap("<i></i>");
	equals( jQuery("#nonnodes > i").length, 3, "Check node,textnode,comment wraps ok" );
	equals( jQuery("#nonnodes > i").text(), j.text() + j[1].nodeValue, "Check node,textnode,comment wraps doesn't hurt text" );

	// Try wrapping a disconnected node
	j = jQuery("<label/>").wrap("<li/>");
	equals( j[0].nodeName.toUpperCase(), "LABEL", "Element is a label" );
	equals( j[0].parentNode.nodeName.toUpperCase(), "LI", "Element has been wrapped" );
});

test("wrapAll(String|Element)", function() {
	expect(8);
	var prev = jQuery("#firstp")[0].previousSibling;
	var p = jQuery("#firstp,#first")[0].parentNode;
	var result = jQuery('#firstp,#first').wrapAll('<div class="red"><div id="tmp"></div></div>');
	equals( result.parent().length, 1, 'Check for wrapping of on-the-fly html' );
	ok( jQuery('#first').parent().parent().is('.red'), 'Check if wrapper has class "red"' );
	ok( jQuery('#firstp').parent().parent().is('.red'), 'Check if wrapper has class "red"' );
	equals( jQuery("#first").parent().parent()[0].previousSibling, prev, "Correct Previous Sibling" );
	equals( jQuery("#first").parent().parent()[0].parentNode, p, "Correct Parent" );

	reset();
	var prev = jQuery("#firstp")[0].previousSibling;
	var p = jQuery("#first")[0].parentNode;
	var result = jQuery('#firstp,#first').wrapAll(document.getElementById('empty'));
	equals( jQuery("#first").parent()[0], jQuery("#firstp").parent()[0], "Same Parent" );
	equals( jQuery("#first").parent()[0].previousSibling, prev, "Correct Previous Sibling" );
	equals( jQuery("#first").parent()[0].parentNode, p, "Correct Parent" );
});

test("wrapInner(String|Element)", function() {
	expect(6);
	var num = jQuery("#first").children().length;
	var result = jQuery('#first').wrapInner('<div class="red"><div id="tmp"></div></div>');
	equals( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is(".red"), "Verify Right Element" );
	equals( jQuery("#first").children().children().children().length, num, "Verify Elements Intact" );

	reset();
	var num = jQuery("#first").children().length;
	var result = jQuery('#first').wrapInner(document.getElementById('empty'));
	equals( jQuery("#first").children().length, 1, "Only one child" );
	ok( jQuery("#first").children().is("#empty"), "Verify Right Element" );
	equals( jQuery("#first").children().children().length, num, "Verify Elements Intact" );
});

test("append(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(21);
	var defaultText = 'Try them out:'
	var result = jQuery('#first').append('<b>buga</b>');
	equals( result.text(), defaultText + 'buga', 'Check if text appending works' );
	equals( jQuery('#select3').append('<option value="appendTest">Append Test</option>').find('option:last-child').attr('value'), 'appendTest', 'Appending html options to select element');

	reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	jQuery('#sap').append(document.getElementById('first'));
	equals( expected, jQuery('#sap').text(), "Check for appending of element" );

	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	jQuery('#sap').append([document.getElementById('first'), document.getElementById('yahoo')]);
	equals( expected, jQuery('#sap').text(), "Check for appending of array of elements" );

	reset();
	expected = document.querySelectorAll ?
		"This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:" :
		"This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	jQuery('#sap').append(jQuery("#first, #yahoo"));
	equals( expected, jQuery('#sap').text(), "Check for appending of jQuery object" );

	reset();
	jQuery("#sap").append( 5 );
	ok( jQuery("#sap")[0].innerHTML.match( /5$/ ), "Check for appending a number" );

	reset();
	jQuery("#sap").append( " text with spaces " );
	ok( jQuery("#sap")[0].innerHTML.match(/ text with spaces $/), "Check for appending text with spaces" );

	reset();
	ok( jQuery("#sap").append([]), "Check for appending an empty array." );
	ok( jQuery("#sap").append(""), "Check for appending an empty string." );
	ok( jQuery("#sap").append(document.getElementsByTagName("foo")), "Check for appending an empty nodelist." );

	reset();
	jQuery("#sap").append(document.getElementById('form'));
	equals( jQuery("#sap>form").size(), 1, "Check for appending a form" ); // Bug #910

	reset();
	var pass = true;
	try {
		jQuery( jQuery("#iframe")[0].contentWindow.document.body ).append("<div>test</div>");
	} catch(e) {
		pass = false;
	}

	ok( pass, "Test for appending a DOM node to the contents of an IFrame" );

	reset();
	jQuery('<fieldset/>').appendTo('#form').append('<legend id="legend">test</legend>');
	t( 'Append legend', '#legend', ['legend'] );

	reset();
	jQuery('#select1').append('<OPTION>Test</OPTION>');
	equals( jQuery('#select1 option:last').text(), "Test", "Appending &lt;OPTION&gt; (all caps)" );

	jQuery('#table').append('<colgroup></colgroup>');
	ok( jQuery('#table colgroup').length, "Append colgroup" );

	jQuery('#table colgroup').append('<col/>');
	ok( jQuery('#table colgroup col').length, "Append col" );

	reset();
	jQuery('#table').append('<caption></caption>');
	ok( jQuery('#table caption').length, "Append caption" );

	reset();
	jQuery('form:last')
		.append('<select id="appendSelect1"></select>')
		.append('<select id="appendSelect2"><option>Test</option></select>');

	t( "Append Select", "#appendSelect1, #appendSelect2", ["appendSelect1", "appendSelect2"] );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	var d = jQuery("<div/>").appendTo("#nonnodes").append(j);
	equals( jQuery("#nonnodes").length, 1, "Check node,textnode,comment append moved leaving just the div" );
	ok( d.contents().length >= 2, "Check node,textnode,comment append works" );
	d.contents().appendTo("#nonnodes");
	d.remove();
	ok( jQuery("#nonnodes").contents().length >= 2, "Check node,textnode,comment append cleanup worked" );
});

test("appendTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(7);
	var defaultText = 'Try them out:'
	jQuery('<b>buga</b>').appendTo('#first');
	equals( jQuery("#first").text(), defaultText + 'buga', 'Check if text appending works' );
	equals( jQuery('<option value="appendTest">Append Test</option>').appendTo('#select3').parent().find('option:last-child').attr('value'), 'appendTest', 'Appending html options to select element');

	reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	jQuery(document.getElementById('first')).appendTo('#sap');
	equals( expected, jQuery('#sap').text(), "Check for appending of element" );

	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	jQuery([document.getElementById('first'), document.getElementById('yahoo')]).appendTo('#sap');
	equals( expected, jQuery('#sap').text(), "Check for appending of array of elements" );

	reset();
	ok( jQuery(document.createElement("script")).appendTo("body").length, "Make sure a disconnected script can be appended." );

	reset();
	expected = document.querySelectorAll ?
		"This link has class=\"blog\": Simon Willison's WeblogYahooTry them out:" :
		"This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	jQuery("#first, #yahoo").appendTo('#sap');
	equals( expected, jQuery('#sap').text(), "Check for appending of jQuery object" );

	reset();
	jQuery('#select1').appendTo('#foo');
	t( 'Append select', '#foo select', ['select1'] );
});

test("prepend(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(5);
	var defaultText = 'Try them out:'
	var result = jQuery('#first').prepend('<b>buga</b>');
	equals( result.text(), 'buga' + defaultText, 'Check if text prepending works' );
	equals( jQuery('#select3').prepend('<option value="prependTest">Prepend Test</option>').find('option:first-child').attr('value'), 'prependTest', 'Prepending html options to select element');

	reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery('#sap').prepend(document.getElementById('first'));
	equals( expected, jQuery('#sap').text(), "Check for prepending of element" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery('#sap').prepend([document.getElementById('first'), document.getElementById('yahoo')]);
	equals( expected, jQuery('#sap').text(), "Check for prepending of array of elements" );

	reset();
	expected = document.querySelectorAll ?
		"YahooTry them out:This link has class=\"blog\": Simon Willison's Weblog" :
		"Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery('#sap').prepend(jQuery("#first, #yahoo"));
	equals( expected, jQuery('#sap').text(), "Check for prepending of jQuery object" );
});

test("prependTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(6);
	var defaultText = 'Try them out:'
	jQuery('<b>buga</b>').prependTo('#first');
	equals( jQuery('#first').text(), 'buga' + defaultText, 'Check if text prepending works' );
	equals( jQuery('<option value="prependTest">Prepend Test</option>').prependTo('#select3').parent().find('option:first-child').attr('value'), 'prependTest', 'Prepending html options to select element');

	reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	jQuery(document.getElementById('first')).prependTo('#sap');
	equals( expected, jQuery('#sap').text(), "Check for prepending of element" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery([document.getElementById('yahoo'), document.getElementById('first')]).prependTo('#sap');
	equals( expected, jQuery('#sap').text(), "Check for prepending of array of elements" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	jQuery("#yahoo, #first").prependTo('#sap');
	equals( expected, jQuery('#sap').text(), "Check for prepending of jQuery object" );

	reset();
	jQuery('<select id="prependSelect1"></select>').prependTo('form:last');
	jQuery('<select id="prependSelect2"><option>Test</option></select>').prependTo('form:last');

	t( "Prepend Select", "#prependSelect2, #prependSelect1", ["prependSelect2", "prependSelect1"] );
});

test("before(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: bugaYahoo';
	jQuery('#yahoo').before('<b>buga</b>');
	equals( expected, jQuery('#en').text(), 'Insert String before' );

	reset();
	expected = "This is a normal link: Try them out:Yahoo";
	jQuery('#yahoo').before(document.getElementById('first'));
	equals( expected, jQuery('#en').text(), "Insert element before" );

	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery('#yahoo').before([document.getElementById('first'), document.getElementById('mark')]);
	equals( expected, jQuery('#en').text(), "Insert array of elements before" );

	reset();
	expected = document.querySelectorAll ?
		"This is a normal link: diveintomarkTry them out:Yahoo" :
		"This is a normal link: Try them out:diveintomarkYahoo";
	jQuery('#yahoo').before(jQuery("#first, #mark"));
	equals( expected, jQuery('#en').text(), "Insert jQuery before" );
});

test("insertBefore(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: bugaYahoo';
	jQuery('<b>buga</b>').insertBefore('#yahoo');
	equals( expected, jQuery('#en').text(), 'Insert String before' );

	reset();
	expected = "This is a normal link: Try them out:Yahoo";
	jQuery(document.getElementById('first')).insertBefore('#yahoo');
	equals( expected, jQuery('#en').text(), "Insert element before" );

	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	jQuery([document.getElementById('first'), document.getElementById('mark')]).insertBefore('#yahoo');
	equals( expected, jQuery('#en').text(), "Insert array of elements before" );

	reset();
	expected = document.querySelectorAll ?
		"This is a normal link: diveintomarkTry them out:Yahoo" :
		"This is a normal link: Try them out:diveintomarkYahoo";
	jQuery("#first, #mark").insertBefore('#yahoo');
	equals( expected, jQuery('#en').text(), "Insert jQuery before" );
});

test("after(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: Yahoobuga';
	jQuery('#yahoo').after('<b>buga</b>');
	equals( expected, jQuery('#en').text(), 'Insert String after' );

	reset();
	expected = "This is a normal link: YahooTry them out:";
	jQuery('#yahoo').after(document.getElementById('first'));
	equals( expected, jQuery('#en').text(), "Insert element after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery('#yahoo').after([document.getElementById('first'), document.getElementById('mark')]);
	equals( expected, jQuery('#en').text(), "Insert array of elements after" );

	reset();
	expected = document.querySelectorAll ?
		"This is a normal link: YahoodiveintomarkTry them out:" :
		"This is a normal link: YahooTry them out:diveintomark";
	jQuery('#yahoo').after(jQuery("#first, #mark"));
	equals( expected, jQuery('#en').text(), "Insert jQuery after" );
});

test("insertAfter(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: Yahoobuga';
	jQuery('<b>buga</b>').insertAfter('#yahoo');
	equals( expected, jQuery('#en').text(), 'Insert String after' );

	reset();
	expected = "This is a normal link: YahooTry them out:";
	jQuery(document.getElementById('first')).insertAfter('#yahoo');
	equals( expected, jQuery('#en').text(), "Insert element after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery([document.getElementById('mark'), document.getElementById('first')]).insertAfter('#yahoo');
	equals( expected, jQuery('#en').text(), "Insert array of elements after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	jQuery("#mark, #first").insertAfter('#yahoo');
	equals( expected, jQuery('#en').text(), "Insert jQuery after" );
});

test("replaceWith(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(10);
	jQuery('#yahoo').replaceWith('<b id="replace">buga</b>');
	ok( jQuery("#replace")[0], 'Replace element with string' );
	ok( !jQuery("#yahoo")[0], 'Verify that original element is gone, after string' );

	reset();
	jQuery('#yahoo').replaceWith(document.getElementById('first'));
	ok( jQuery("#first")[0], 'Replace element with element' );
	ok( !jQuery("#yahoo")[0], 'Verify that original element is gone, after element' );

	reset();
	jQuery('#yahoo').replaceWith([document.getElementById('first'), document.getElementById('mark')]);
	ok( jQuery("#first")[0], 'Replace element with array of elements' );
	ok( jQuery("#mark")[0], 'Replace element with array of elements' );
	ok( !jQuery("#yahoo")[0], 'Verify that original element is gone, after array of elements' );

	reset();
	jQuery('#yahoo').replaceWith(jQuery("#first, #mark"));
	ok( jQuery("#first")[0], 'Replace element with set of elements' );
	ok( jQuery("#mark")[0], 'Replace element with set of elements' );
	ok( !jQuery("#yahoo")[0], 'Verify that original element is gone, after set of elements' );
});

test("replaceAll(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(10);
	jQuery('<b id="replace">buga</b>').replaceAll("#yahoo");
	ok( jQuery("#replace")[0], 'Replace element with string' );
	ok( !jQuery("#yahoo")[0], 'Verify that original element is gone, after string' );

	reset();
	jQuery(document.getElementById('first')).replaceAll("#yahoo");
	ok( jQuery("#first")[0], 'Replace element with element' );
	ok( !jQuery("#yahoo")[0], 'Verify that original element is gone, after element' );

	reset();
	jQuery([document.getElementById('first'), document.getElementById('mark')]).replaceAll("#yahoo");
	ok( jQuery("#first")[0], 'Replace element with array of elements' );
	ok( jQuery("#mark")[0], 'Replace element with array of elements' );
	ok( !jQuery("#yahoo")[0], 'Verify that original element is gone, after array of elements' );

	reset();
	jQuery("#first, #mark").replaceAll("#yahoo");
	ok( jQuery("#first")[0], 'Replace element with set of elements' );
	ok( jQuery("#mark")[0], 'Replace element with set of elements' );
	ok( !jQuery("#yahoo")[0], 'Verify that original element is gone, after set of elements' );
});

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

test("clone()", function() {
	expect(20);
	equals( 'This is a normal link: Yahoo', jQuery('#en').text(), 'Assert text for #en' );
	var clone = jQuery('#yahoo').clone();
	equals( 'Try them out:Yahoo', jQuery('#first').append(clone).text(), 'Check for clone' );
	equals( 'This is a normal link: Yahoo', jQuery('#en').text(), 'Reassert text for #en' );

	var cloneTags = [
		"<table/>", "<tr/>", "<td/>", "<div/>",
		"<button/>", "<ul/>", "<ol/>", "<li/>",
		"<input type='checkbox' />", "<select/>", "<option/>", "<textarea/>",
		"<tbody/>", "<thead/>", "<tfoot/>", "<iframe/>"
	];
	for (var i = 0; i < cloneTags.length; i++) {
		var j = jQuery(cloneTags[i]);
		equals( j[0].tagName, j.clone()[0].tagName, 'Clone a &lt;' + cloneTags[i].substring(1));
	}

	// using contents will get comments regular, text, and comment nodes
	var cl = jQuery("#nonnodes").contents().clone();
	ok( cl.length >= 2, "Check node,textnode,comment clone works (some browsers delete comments on clone)" );
});

if (!isLocal) {
test("clone() on XML nodes", function() {
	expect(2);
	stop();
	jQuery.get("data/dashboard.xml", function (xml) {
		var root = jQuery(xml.documentElement).clone();
		var origTab = jQuery("tab", xml).eq(0);
		var cloneTab = jQuery("tab", root).eq(0);
		origTab.text("origval");
		cloneTab.text("cloneval");
		equals(origTab.text(), "origval", "Check original XML node was correctly set");
		equals(cloneTab.text(), "cloneval", "Check cloned XML node was correctly set");
		start();
	});
});
}

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

test("jQuery.merge()", function() {
	expect(6);
		
	var parse = jQuery.merge;
	
	same( parse([],[]), [], "Empty arrays" );
	
	same( parse([1],[2]), [1,2], "Basic" );
	same( parse([1,2],[3,4]), [1,2,3,4], "Basic" );
	
	same( parse([1,2],[]), [1,2], "Second empty" );
	same( parse([],[1,2]), [1,2], "First empty" );	
	
	// Fixed at [5998], #3641
	same( parse([-2,-1], [0,1,2]), [-2,-1,0,1,2], "Second array including a zero (falsy)");
});

test("jQuery.extend(Object, Object)", function() {
	expect(20);

	var settings = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		optionsCopy = { xnumber2: 1, xstring2: "x", xxx: "newstring" },
		merged = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "x", xxx: "newstring" },
		deep1 = { foo: { bar: true } },
		deep1copy = { foo: { bar: true } },
		deep2 = { foo: { baz: true }, foo2: document },
		deep2copy = { foo: { baz: true }, foo2: document },
		deepmerged = { foo: { bar: true, baz: true }, foo2: document };

	jQuery.extend(settings, options);
	isObj( settings, merged, "Check if extended: settings must be extended" );
	isObj( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(settings, null, options);
	isObj( settings, merged, "Check if extended: settings must be extended" );
	isObj( options, optionsCopy, "Check if not modified: options must not be modified" );

	jQuery.extend(true, deep1, deep2);
	isObj( deep1.foo, deepmerged.foo, "Check if foo: settings must be extended" );
	isObj( deep2.foo, deep2copy.foo, "Check if not deep2: options must not be modified" );
	equals( deep1.foo2, document, "Make sure that a deep clone was not attempted on the document" );

	var nullUndef;
	nullUndef = jQuery.extend({}, options, { xnumber2: null });
	ok( nullUndef.xnumber2 === null, "Check to make sure null values are copied");

	nullUndef = jQuery.extend({}, options, { xnumber2: undefined });
	ok( nullUndef.xnumber2 === options.xnumber2, "Check to make sure undefined values are not copied");

	nullUndef = jQuery.extend({}, options, { xnumber0: null });
	ok( nullUndef.xnumber0 === null, "Check to make sure null values are inserted");

	var target = {};
	var recursive = { foo:target, bar:5 };
	jQuery.extend(true, target, recursive);
	isObj( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

	var ret = jQuery.extend(true, { foo: [] }, { foo: [0] } ); // 1907
	equals( ret.foo.length, 1, "Check to make sure a value with coersion 'false' copies over when necessary to fix #1907" );

	var ret = jQuery.extend(true, { foo: "1,2,3" }, { foo: [1, 2, 3] } );
	ok( typeof ret.foo != "string", "Check to make sure values equal with coersion (but not actually equal) overwrite correctly" );

	var ret = jQuery.extend(true, { foo:"bar" }, { foo:null } );
	ok( typeof ret.foo !== 'undefined', "Make sure a null value doesn't crash with deep extend, for #1908" );

	var obj = { foo:null };
	jQuery.extend(true, obj, { foo:"notnull" } );
	equals( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	jQuery.extend(func, { key: "value" } );
	equals( func.key, "value", "Verify a function can be extended" );

	var defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" },
		options1 = { xnumber2: 1, xstring2: "x" },
		options1Copy = { xnumber2: 1, xstring2: "x" },
		options2 = { xstring2: "xx", xxx: "newstringx" },
		options2Copy = { xstring2: "xx", xxx: "newstringx" },
		merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	var settings = jQuery.extend({}, defaults, options1, options2);
	isObj( settings, merged2, "Check if extended: settings must be extended" );
	isObj( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	isObj( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	isObj( options2, options2Copy, "Check if not modified: options2 must not be modified" );
});

test("val()", function() {
	expect(8);

	equals( jQuery("#text1").val(), "Test", "Check for value of input element" );
	// ticket #1714 this caused a JS error in IE
	equals( jQuery("#first").val(), "", "Check a paragraph element to see if it has a value" );
	ok( jQuery([]).val() === undefined, "Check an empty jQuery object will return undefined from val" );
	
	equals( jQuery('#select2').val(), '3', 'Call val() on a single="single" select' );

	isSet( jQuery('#select3').val(), ['1', '2'], 'Call val() on a multiple="multiple" select' );

	equals( jQuery('#option3c').val(), '2', 'Call val() on a option element with value' );
	
	equals( jQuery('#option3a').val(), '', 'Call val() on a option element with empty value' );
	
	equals( jQuery('#option3e').val(), 'no value', 'Call val() on a option element with no value attribute' );
	
});

test("val(String/Number)", function() {
	expect(6);
	document.getElementById('text1').value = "bla";
	equals( jQuery("#text1").val(), "bla", "Check for modified value of input element" );
	
	jQuery("#text1").val('test');
	equals( document.getElementById('text1').value, "test", "Check for modified (via val(String)) value of input element" );
	
	jQuery("#text1").val(67);
	equals( document.getElementById('text1').value, "67", "Check for modified (via val(Number)) value of input element" );

	jQuery("#select1").val("3");
	equals( jQuery("#select1").val(), "3", "Check for modified (via val(String)) value of select element" );

	jQuery("#select1").val(2);
	equals( jQuery("#select1").val(), "2", "Check for modified (via val(Number)) value of select element" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.val("asdf");
	equals( j.val(), "asdf", "Check node,textnode,comment with val()" );
	j.removeAttr("value");
});

test("html(String)", function() {
	expect(17);
	
	jQuery.scriptorder = 0;
	
	var div = jQuery("#main > div");
	div.html("<b>test</b>");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).childNodes.length != 1 ) pass = false;
	}
	ok( pass, "Set HTML" );

	reset();
	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.html("<b>bold</b>");

	// this is needed, or the expando added by jQuery unique will yield a different html
	j.find('b').removeData();
	equals( j.html().replace(/ xmlns="[^"]+"/g, "").toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	jQuery("#main").html("<select/>");
	jQuery("#main select").html("<option>O1</option><option selected='selected'>O2</option><option>O3</option>");
	equals( jQuery("#main select").val(), "O2", "Selected option correct" );

	var $div = jQuery('<div />');
	equals( $div.html( 5 ).html(), '5', 'Setting a number as html' );
	equals( $div.html( 0 ).html(), '0', 'Setting a zero as html' );

	reset();

	jQuery("#main").html('<script type="something/else">ok( false, "Non-script evaluated." );</script><script type="text/javascript">ok( true, "text/javascript is evaluated." );</script><script>ok( true, "No type is evaluated." );</script><div><script type="text/javascript">ok( true, "Inner text/javascript is evaluated." );</script><script>ok( true, "Inner No type is evaluated." );</script><script type="something/else">ok( false, "Non-script evaluated." );</script></div>');

	stop();

	jQuery("#main").html('<script type="text/javascript">ok( true, "jQuery().html().evalScripts() Evals Scripts Twice in Firefox, see #975" );</script>');

	jQuery("#main").html('foo <form><script type="text/javascript">ok( true, "jQuery().html().evalScripts() Evals Scripts Twice in Firefox, see #975" );</script></form>');

	// it was decided that waiting to execute ALL scripts makes sense since nested ones have to wait anyway so this test case is changed, see #1959
	jQuery("#main").html("<script>equals(jQuery.scriptorder++, 0, 'Script is executed in order');equals(jQuery('#scriptorder').length, 1,'Execute after html (even though appears before)')<\/script><span id='scriptorder'><script>equals(jQuery.scriptorder++, 1, 'Script (nested) is executed in order');equals(jQuery('#scriptorder').length, 1,'Execute after html')<\/script></span><script>equals(jQuery.scriptorder++, 2, 'Script (unnested) is executed in order');equals(jQuery('#scriptorder').length, 1,'Execute after html')<\/script>");

	setTimeout( start, 100 );
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
	isSet( jQuery("div").closest("body:first div:last").get(), q("divWithNoTabIndex"), "closest(body:first div:last)" );
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
	isSet( jQuery("#groups").parents("p, div").andSelf().get(), q("ap", "main", "groups"), "Check for parents and self" );
});

test("siblings([String])", function() {
	expect(5);
	isSet( jQuery("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	isSet( jQuery("#sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" );
	isSet( jQuery("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
	isSet( jQuery("#foo").siblings("form, b").get(), q("form", "lengthtest", "name-tests", "testForm", "floatTest"), "Check for multiple filters" );
	var set = document.querySelectorAll ? q("en", "sap", "sndp") : q("sndp", "sap", "en");
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
	isSet( jQuery("#groups").parents("p, div").get(), q("ap", "main"), "Check for multiple filters" );
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

test("show()", function() {
	expect(15);
	var pass = true, div = jQuery("div");
	div.show().each(function(){
		if ( this.style.display == "none" ) pass = false;
	});
	ok( pass, "Show" );

	jQuery("#main").append('<div id="show-tests"><div><p><a href="#"></a></p><code></code><pre></pre><span></span></div><table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table><ul><li></li></ul></div>');
	var test = {
		"div"      : "block",
		"p"        : "block",
		"a"        : "inline",
		"code"     : "inline",
		"pre"      : "block",
		"span"     : "inline",
		"table"    : jQuery.browser.msie ? "block" : "table",
		"thead"    : jQuery.browser.msie ? "block" : "table-header-group",
		"tbody"    : jQuery.browser.msie ? "block" : "table-row-group",
		"tr"       : jQuery.browser.msie ? "block" : "table-row",
		"th"       : jQuery.browser.msie ? "block" : "table-cell",
		"td"       : jQuery.browser.msie ? "block" : "table-cell",
		"ul"       : "block",
		"li"       : jQuery.browser.msie ? "block" : "list-item"
	};

	jQuery.each(test, function(selector, expected) {
		var elem = jQuery(selector, "#show-tests").show();
		equals( elem.css("display"), expected, "Show using correct display type for " + selector );
	});
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

test("toggleClass(String)", function() {
	expect(6);
	var e = jQuery("#firstp");
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass("test");
	ok( e.is(".test"), "Assert class present" );
	e.toggleClass("test");
	ok( !e.is(".test"), "Assert class not present" );

	e.toggleClass("test", false);
	ok( !e.is(".test"), "Assert class not present" );
	e.toggleClass("test", true);
	ok( e.is(".test"), "Assert class present" );
	e.toggleClass("test", false);
	ok( !e.is(".test"), "Assert class not present" );
});

test("removeAttr(String", function() {
	expect(1);
	equals( jQuery('#mark').removeAttr("class")[0].className, "", "remove class" );
});

test("text(String)", function() {
	expect(4);
	equals( jQuery("#foo").text("<div><b>Hello</b> cruel world!</div>")[0].innerHTML.replace(/>/g, "&gt;"), "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.text("hi!");
	equals( jQuery(j[0]).text(), "hi!", "Check node,textnode,comment with text()" );
	equals( j[1].nodeValue, " there ", "Check node,textnode,comment with text()" );
	equals( j[2].nodeType, 8, "Check node,textnode,comment with text()" );
});

test("jQuery.each(Object,Function)", function() {
	expect(12);
	jQuery.each( [0,1,2], function(i, n){
		equals( i, n, "Check array iteration" );
	});

	jQuery.each( [5,6,7], function(i, n){
		equals( i, n - 5, "Check array iteration" );
	});

	jQuery.each( { name: "name", lang: "lang" }, function(i, n){
		equals( i, n, "Check object iteration" );
	});

        var total = 0;
        jQuery.each([1,2,3], function(i,v){ total += v; });
        equals( total, 6, "Looping over an array" );
        total = 0;
        jQuery.each([1,2,3], function(i,v){ total += v; if ( i == 1 ) return false; });
        equals( total, 3, "Looping over an array, with break" );
        total = 0;
        jQuery.each({"a":1,"b":2,"c":3}, function(i,v){ total += v; });
        equals( total, 6, "Looping over an object" );
        total = 0;
        jQuery.each({"a":3,"b":3,"c":3}, function(i,v){ total += v; return false; });
        equals( total, 3, "Looping over an object, with break" );
});

test("jQuery.prop", function() {
	expect(2);
	var handle = function() { return this.id };
	equals( jQuery.prop(jQuery("#ap")[0], handle), "ap", "Check with Function argument" );
	equals( jQuery.prop(jQuery("#ap")[0], "value"), "value", "Check with value argument" );
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

test("remove()", function() {
	expect(6);
	jQuery("#ap").children().remove();
	ok( jQuery("#ap").text().length > 10, "Check text is not removed" );
	equals( jQuery("#ap").children().length, 0, "Check remove" );

	reset();
	jQuery("#ap").children().remove("a");
	ok( jQuery("#ap").text().length > 10, "Check text is not removed" );
	equals( jQuery("#ap").children().length, 1, "Check filtered remove" );

	// using contents will get comments regular, text, and comment nodes
	equals( jQuery("#nonnodes").contents().length, 3, "Check node,textnode,comment remove works" );
	jQuery("#nonnodes").contents().remove();
	equals( jQuery("#nonnodes").contents().length, 0, "Check node,textnode,comment remove works" );
});

test("empty()", function() {
	expect(3);
	equals( jQuery("#ap").children().empty().text().length, 0, "Check text is removed" );
	equals( jQuery("#ap").children().length, 4, "Check elements are not removed" );

	// using contents will get comments regular, text, and comment nodes
	var j = jQuery("#nonnodes").contents();
	j.empty();
	equals( j.html(), "", "Check node,textnode,comment empty works" );
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

test("jQuery.makeArray", function(){
	expect(15);

	equals( jQuery.makeArray(jQuery('html>*'))[0].nodeName.toUpperCase(), "HEAD", "Pass makeArray a jQuery object" );

	equals( jQuery.makeArray(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );

	equals( (function(){ return jQuery.makeArray(arguments); })(1,2).join(""), "12", "Pass makeArray an arguments array" );

	equals( jQuery.makeArray([1,2,3]).join(""), "123", "Pass makeArray a real array" );

	equals( jQuery.makeArray().length, 0, "Pass nothing to makeArray and expect an empty array" );

	equals( jQuery.makeArray( 0 )[0], 0 , "Pass makeArray a number" );

	equals( jQuery.makeArray( "foo" )[0], "foo", "Pass makeArray a string" );

	equals( jQuery.makeArray( true )[0].constructor, Boolean, "Pass makeArray a boolean" );

	equals( jQuery.makeArray( document.createElement("div") )[0].nodeName.toUpperCase(), "DIV", "Pass makeArray a single node" );

	equals( jQuery.makeArray( {length:2, 0:"a", 1:"b"} ).join(""), "ab", "Pass makeArray an array like map (with length)" );

	ok( !!jQuery.makeArray( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "Pass makeArray a childNodes array" );

	// function, is tricky as it has length
	equals( jQuery.makeArray( function(){ return 1;} )[0](), 1, "Pass makeArray a function" );
	
	//window, also has length
	equals( jQuery.makeArray(window)[0], window, "Pass makeArray the window" );

	equals( jQuery.makeArray(/a/)[0].constructor, RegExp, "Pass makeArray a regex" );

	ok( jQuery.makeArray(document.getElementById('form')).length >= 13, "Pass makeArray a form (treat as elements)" );
});
