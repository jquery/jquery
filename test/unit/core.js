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
	expect(8);

	var main = $("#main");
	isSet( $("div p", main).get(), q("sndp", "en", "sap"), "Basic selector with jQuery object as context" );

/*
	// disabled since this test was doing nothing. i tried to fix it but i'm not sure
	// what the expected behavior should even be. FF returns "\n" for the text node
	// make sure this is handled
	var crlfContainer = $('<p>\r\n</p>');
	var x = crlfContainer.contents().get(0).nodeValue;
	equals( x, what???, "Check for \\r and \\n in jQuery()" );
*/

	/* // Disabled until we add this functionality in
	var pass = true;
	try {
		$("<div>Testing</div>").appendTo(document.getElementById("iframe").contentDocument.body);
	} catch(e){
		pass = false;
	}
	ok( pass, "$('&lt;tag&gt;') needs optional document parameter to ease cross-frame DOM wrangling, see #968" );*/

	var code = $("<code/>");
	equals( code.length, 1, "Correct number of elements generated for code" );
	var img = $("<img/>");
	equals( img.length, 1, "Correct number of elements generated for img" );
	var div = $("<div/><hr/><code/><b/>");
	equals( div.length, 4, "Correct number of elements generated for div hr code b" );

	// can actually yield more than one, when iframes are included, the window is an array as well
	equals( $(window).length, 1, "Correct number of elements generated for window" );

	equals( $(document).length, 1, "Correct number of elements generated for document" );

	equals( $([1,2,3]).get(1), 2, "Test passing an array to the factory" );

	equals( $(document.body).get(0), $('body').get(0), "Test passing an html node to the factory" );
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
		version = v ? v[1] : null;
		equals( version, browsers[i], "Checking UA string" );
	}
});

test("noConflict", function() {
	expect(6);

	var old = jQuery;
	var newjQuery = jQuery.noConflict();

	equals( newjQuery, old, "noConflict returned the jQuery object" );
	equals( jQuery, old, "Make sure jQuery wasn't touched." );
	equals( $, "$", "Make sure $ was reverted." );

	jQuery = $ = old;

	newjQuery = jQuery.noConflict(true);

	equals( newjQuery, old, "noConflict returned the jQuery object" );
	equals( jQuery, "jQuery", "Make sure jQuery was reverted." );
	equals( $, "$", "Make sure $ was reverted." );

	jQuery = $ = old;
});

test("isFunction", function() {
	expect(21);

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
	ok( jQuery.isFunction(obj.getAttribute), "getAttribute Function" );

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
	ok( jQuery.isFunction(input.focus), "A default function property" );

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

var foo = false;

test("$('html')", function() {
	expect(6);

	reset();
	foo = false;
	var s = $("<script>var foo='test';</script>")[0];
	ok( s, "Creating a script" );
	ok( !foo, "Make sure the script wasn't executed prematurely" );
	$("body").append(s);
	ok( foo, "Executing a scripts contents in the right context" );

	reset();
	ok( $("<link rel='stylesheet'/>")[0], "Creating a link" );

	reset();

	var j = $("<span>hi</span> there <!-- mon ami -->");
	ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	ok( !$("<option>test</option>")[0].selected, "Make sure that options are auto-selected #2050" );
});

test("$('html', context)", function() {
	expect(1);

	var $div = $("<div/>");
	var $span = $("<span/>", $div);
	equals($span.length, 1, "Verify a span created with a div context works, #1763");
});

if ( !isLocal ) {
test("$(selector, xml).text(str) - Loaded via XML document", function() {
	expect(2);
	stop();
	$.get('data/dashboard.xml', function(xml) {
		// tests for #1419 where IE was a problem
		equals( $("tab:first", xml).text(), "blabla", "Verify initial text correct" );
		$("tab:first", xml).text("newtext");
		equals( $("tab:first", xml).text(), "newtext", "Verify new text correct" );
		start();
	});
});
}

test("length", function() {
	expect(1);
	equals( $("p").length, 6, "Get Number of Elements Found" );
});

test("size()", function() {
	expect(1);
	equals( $("p").size(), 6, "Get Number of Elements Found" );
});

test("get()", function() {
	expect(1);
	isSet( $("p").get(), q("firstp","ap","sndp","en","sap","first"), "Get All Elements" );
});

test("get(Number)", function() {
	expect(1);
	equals( $("p").get(0), document.getElementById("firstp"), "Get A Single Element" );
});

test("add(String|Element|Array|undefined)", function() {
	expect(12);
	isSet( $("#sndp").add("#en").add("#sap").get(), q("sndp", "en", "sap"), "Check elements from document" );
	isSet( $("#sndp").add( $("#en")[0] ).add( $("#sap") ).get(), q("sndp", "en", "sap"), "Check elements from document" );
	ok( $([]).add($("#form")[0].elements).length >= 13, "Check elements from array" );

	// For the time being, we're discontinuing support for $(form.elements) since it's ambiguous in IE
	// use $([]).add(form.elements) instead.
	//equals( $([]).add($("#form")[0].elements).length, $($("#form")[0].elements).length, "Array in constructor must equals array in add()" );

	var x = $([]).add($("<p id='x1'>xxx</p>")).add($("<p id='x2'>xxx</p>"));
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var x = $([]).add("<p id='x1'>xxx</p>").add("<p id='x2'>xxx</p>");
	equals( x[0].id, "x1", "Check on-the-fly element1" );
	equals( x[1].id, "x2", "Check on-the-fly element2" );

	var notDefined;
	equals( $([]).add(notDefined).length, 0, "Check that undefined adds nothing" );

	// Added after #2811
	equals( $([]).add([window,document,document.body,document]).length, 3, "Pass an array" );
	equals( $(document).add(document).length, 1, "Check duplicated elements" );
	equals( $(window).add(window).length, 1, "Check duplicated elements using the window" );
	ok( $([]).add( document.getElementById('form') ).length >= 13, "Add a form (adds the elements)" );
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
	expect(10);

	var elements = $([window, document]),
		inputElements = $('#radio1,#radio2,#check1,#check2');

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
	expect(26);
	equals( $('#text1').attr('value'), "Test", 'Check for value attribute' );
	equals( $('#text1').attr('value', "Test2").attr('defaultValue'), "Test", 'Check for defaultValue attribute' );
	equals( $('#text1').attr('type'), "text", 'Check for type attribute' );
	equals( $('#radio1').attr('type'), "radio", 'Check for type attribute' );
	equals( $('#check1').attr('type'), "checkbox", 'Check for type attribute' );
	equals( $('#simon1').attr('rel'), "bookmark", 'Check for rel attribute' );
	equals( $('#google').attr('title'), "Google!", 'Check for title attribute' );
	equals( $('#mark').attr('hreflang'), "en", 'Check for hreflang attribute' );
	equals( $('#en').attr('lang'), "en", 'Check for lang attribute' );
	equals( $('#simon').attr('class'), "blog link", 'Check for class attribute' );
	equals( $('#name').attr('name'), "name", 'Check for name attribute' );
	equals( $('#text1').attr('name'), "action", 'Check for name attribute' );
	ok( $('#form').attr('action').indexOf("formaction") >= 0, 'Check for action attribute' );
	equals( $('#text1').attr('maxlength'), '30', 'Check for maxlength attribute' );
	equals( $('#text1').attr('maxLength'), '30', 'Check for maxLength attribute' );
	equals( $('#area1').attr('maxLength'), '30', 'Check for maxLength attribute' );
	equals( $('#select2').attr('selectedIndex'), 3, 'Check for selectedIndex attribute' );
	equals( $('#foo').attr('nodeName'), 'DIV', 'Check for nodeName attribute' );
	equals( $('#foo').attr('tagName'), 'DIV', 'Check for tagName attribute' );

	$('<a id="tAnchor5"></a>').attr('href', '#5').appendTo('#main'); // using innerHTML in IE causes href attribute to be serialized to the full path
	equals( $('#tAnchor5').attr('href'), "#5", 'Check for non-absolute href (an anchor)' );


	// Related to [5574] and [5683]
	var body = document.body, $body = $(body);

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
		$.get("data/dashboard.xml", function(xml) {
			equals( $("locations", xml).attr("class"), "foo", "Check class attribute in XML document" );
			equals( $("location", xml).attr("for"), "bar", "Check for attribute in XML document" );
			start();
		});
	});
}

test("attr(String, Function)", function() {
	expect(2);
	equals( $('#text1').attr('value', function() { return this.id })[0].value, "text1", "Set value from id" );
	equals( $('#text1').attr('title', function(i) { return i }).attr('title'), "0", "Set value with an index");
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
	expect(17);
	var div = $("div").attr("foo", "bar");
		fail = false;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).getAttribute('foo') != "bar" ){
			fail = i;
			break;
		}
	}
	equals( fail, false, "Set Attribute, the #"+fail+" element didn't get the attribute 'foo'" );

	ok( $("#foo").attr({"width": null}), "Try to set an attribute to nothing" );

	$("#name").attr('name', 'something');
	equals( $("#name").attr('name'), 'something', 'Set name attribute' );
	$("#check2").attr('checked', true);
	equals( document.getElementById('check2').checked, true, 'Set checked attribute' );
	$("#check2").attr('checked', false);
	equals( document.getElementById('check2').checked, false, 'Set checked attribute' );
	$("#text1").attr('readonly', true);
	equals( document.getElementById('text1').readOnly, true, 'Set readonly attribute' );
	$("#text1").attr('readonly', false);
	equals( document.getElementById('text1').readOnly, false, 'Set readonly attribute' );
	$("#name").attr('maxlength', '5');
	equals( document.getElementById('name').maxLength, '5', 'Set maxlength attribute' );
	$("#name").attr('maxLength', '10');
	equals( document.getElementById('name').maxLength, '10', 'Set maxlength attribute' );

	// for #1070
	$("#name").attr('someAttr', '0');
	equals( $("#name").attr('someAttr'), '0', 'Set attribute to a string of "0"' );
	$("#name").attr('someAttr', 0);
	equals( $("#name").attr('someAttr'), 0, 'Set attribute to the number 0' );
	$("#name").attr('someAttr', 1);
	equals( $("#name").attr('someAttr'), 1, 'Set attribute to the number 1' );

	// using contents will get comments regular, text, and comment nodes
	var j = $("#nonnodes").contents();

	j.attr("name", "attrvalue");
	equals( j.attr("name"), "attrvalue", "Check node,textnode,comment for attr" );
	j.removeAttr("name");

	reset();

	var type = $("#check2").attr('type');
	var thrown = false;
	try {
		$("#check2").attr('type','hidden');
	} catch(e) {
		thrown = true;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( type, $("#check2").attr('type'), "Verify that you can't change the type of an input element" );

	var check = document.createElement("input");
	var thrown = true;
	try {
		$(check).attr('type','checkbox');
	} catch(e) {
		thrown = false;
	}
	ok( thrown, "Exception thrown when trying to change type property" );
	equals( "checkbox", $(check).attr('type'), "Verify that you can change the type of an input element that isn't in the DOM" );
});

if ( !isLocal ) {
	test("attr(String, Object) - Loaded via XML document", function() {
		expect(2);
		stop();
		$.get('data/dashboard.xml', function(xml) {
			var titles = [];
			$('tab', xml).each(function() {
				titles.push($(this).attr('title'));
			});
			equals( titles[0], 'Location', 'attr() in XML context: Check first title' );
			equals( titles[1], 'Users', 'attr() in XML context: Check second title' );
			start();
		});
	});
}

test("css(String|Hash)", function() {
	expect(19);

	equals( $('#main').css("display"), 'none', 'Check for css property "display"');

	ok( $('#foo').is(':visible'), 'Modifying CSS display: Assert element is visible');
	$('#foo').css({display: 'none'});
	ok( !$('#foo').is(':visible'), 'Modified CSS display: Assert element is hidden');
	$('#foo').css({display: 'block'});
	ok( $('#foo').is(':visible'), 'Modified CSS display: Assert element is visible');

	$('#floatTest').css({styleFloat: 'right'});
	equals( $('#floatTest').css('styleFloat'), 'right', 'Modified CSS float using "styleFloat": Assert float is right');
	$('#floatTest').css({cssFloat: 'left'});
	equals( $('#floatTest').css('cssFloat'), 'left', 'Modified CSS float using "cssFloat": Assert float is left');
	$('#floatTest').css({'float': 'right'});
	equals( $('#floatTest').css('float'), 'right', 'Modified CSS float using "float": Assert float is right');
	$('#floatTest').css({'font-size': '30px'});
	equals( $('#floatTest').css('font-size'), '30px', 'Modified CSS font-size: Assert font-size is 30px');

	$.each("0,0.25,0.5,0.75,1".split(','), function(i, n) {
		$('#foo').css({opacity: n});
		equals( $('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		$('#foo').css({opacity: parseFloat(n)});
		equals( $('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	$('#foo').css({opacity: ''});
	equals( $('#foo').css('opacity'), '1', "Assert opacity is 1 when set to an empty String" );
});

test("css(String, Object)", function() {
	expect(21);
	ok( $('#foo').is(':visible'), 'Modifying CSS display: Assert element is visible');
	$('#foo').css('display', 'none');
	ok( !$('#foo').is(':visible'), 'Modified CSS display: Assert element is hidden');
	$('#foo').css('display', 'block');
	ok( $('#foo').is(':visible'), 'Modified CSS display: Assert element is visible');

	$('#floatTest').css('styleFloat', 'left');
	equals( $('#floatTest').css('styleFloat'), 'left', 'Modified CSS float using "styleFloat": Assert float is left');
	$('#floatTest').css('cssFloat', 'right');
	equals( $('#floatTest').css('cssFloat'), 'right', 'Modified CSS float using "cssFloat": Assert float is right');
	$('#floatTest').css('float', 'left');
	equals( $('#floatTest').css('float'), 'left', 'Modified CSS float using "float": Assert float is left');
	$('#floatTest').css('font-size', '20px');
	equals( $('#floatTest').css('font-size'), '20px', 'Modified CSS font-size: Assert font-size is 20px');

	$.each("0,0.25,0.5,0.75,1".split(','), function(i, n) {
		$('#foo').css('opacity', n);
		equals( $('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a String" );
		$('#foo').css('opacity', parseFloat(n));
		equals( $('#foo').css('opacity'), parseFloat(n), "Assert opacity is " + parseFloat(n) + " as a Number" );
	});
	$('#foo').css('opacity', '');
	equals( $('#foo').css('opacity'), '1', "Assert opacity is 1 when set to an empty String" );
	// for #1438, IE throws JS error when filter exists but doesn't have opacity in it
	if (jQuery.browser.msie) {
		$('#foo').css("filter", "progid:DXImageTransform.Microsoft.Chroma(color='red');");
	}
	equals( $('#foo').css('opacity'), '1', "Assert opacity is 1 when a different filter is set in IE, #1438" );

	// using contents will get comments regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	j.css("padding-left", "1px");
	equals( j.css("padding-left"), "1px", "Check node,textnode,comment css works" );

	// opera sometimes doesn't update 'display' correctly, see #2037
	$("#t2037")[0].innerHTML = $("#t2037")[0].innerHTML
	equals( $("#t2037 .hidden").css("display"), "none", "Make sure browser thinks it is hidden" );
});

test("jQuery.css(elem, 'height') doesn't clear radio buttons (bug #1095)", function () {
	expect(4);

	var $checkedtest = $("#checkedtest");
	// IE6 was clearing "checked" in jQuery.css(elem, "height");
	jQuery.css($checkedtest[0], "height");
	ok( !! $(":radio:first", $checkedtest).attr("checked"), "Check first radio still checked." );
	ok( ! $(":radio:last", $checkedtest).attr("checked"), "Check last radio still NOT checked." );
	ok( !! $(":checkbox:first", $checkedtest).attr("checked"), "Check first checkbox still checked." );
	ok( ! $(":checkbox:last", $checkedtest).attr("checked"), "Check last checkbox still NOT checked." );
});

test("width()", function() {
	expect(9);

	var $div = $("#nothiddendiv");
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
	equals($div.width(), 30, "Test border specified with ems");
	$div.css("padding", "2%");
	equals($div.width(), 30, "Test padding specified with percent");
	$div.hide();
	equals($div.width(), 30, "Test hidden div");

	$div.css({ display: "", border: "", padding: "" });

	$("#nothiddendivchild").css({ padding: "3px", border: "2px solid #fff" });
	equals($("#nothiddendivchild").width(), 20, "Test child width with border and padding");
	$("#nothiddendiv, #nothiddendivchild").css({ border: "", padding: "", width: "" });
});

test("height()", function() {
	expect(8);

	var $div = $("#nothiddendiv");
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
	equals($div.height(), 30, "Test border specified with ems");
	$div.css("padding", "2%");
	equals($div.height(), 30, "Test padding specified with percent");
	$div.hide();
	equals($div.height(), 30, "Test hidden div");

	$div.css({ display: "", border: "", padding: "", height: "1px" });
});

test("text()", function() {
	expect(1);
	var expected = "This link has class=\"blog\": Simon Willison's Weblog";
	equals( $('#sap').text(), expected, 'Check for merged text of more then one element.' );
});

test("wrap(String|Element)", function() {
	expect(8);
	var defaultText = 'Try them out:'
	var result = $('#first').wrap('<div class="red"><span></span></div>').text();
	equals( defaultText, result, 'Check for wrapping of on-the-fly html' );
	ok( $('#first').parent().parent().is('.red'), 'Check if wrapper has class "red"' );

	reset();
	var defaultText = 'Try them out:'
	var result = $('#first').wrap(document.getElementById('empty')).parent();
	ok( result.is('ol'), 'Check for element wrapping' );
	equals( result.text(), defaultText, 'Check for element wrapping' );

	reset();
	$('#check1').click(function() {
		var checkbox = this;
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
		$(checkbox).wrap( '<div id="c1" style="display:none;"></div>' );
		ok( checkbox.checked, "Checkbox's state is erased after wrap() action, see #769" );
	}).click();

	// using contents will get comments regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	j.wrap("<i></i>");
	equals( $("#nonnodes > i").length, 3, "Check node,textnode,comment wraps ok" );
	equals( $("#nonnodes > i").text(), j.text() + j[1].nodeValue, "Check node,textnode,comment wraps doesn't hurt text" );
});

test("wrapAll(String|Element)", function() {
	expect(8);
	var prev = $("#first")[0].previousSibling;
	var p = $("#first")[0].parentNode;
	var result = $('#first,#firstp').wrapAll('<div class="red"><div id="tmp"></div></div>');
	equals( result.parent().length, 1, 'Check for wrapping of on-the-fly html' );
	ok( $('#first').parent().parent().is('.red'), 'Check if wrapper has class "red"' );
	ok( $('#firstp').parent().parent().is('.red'), 'Check if wrapper has class "red"' );
	equals( $("#first").parent().parent()[0].previousSibling, prev, "Correct Previous Sibling" );
	equals( $("#first").parent().parent()[0].parentNode, p, "Correct Parent" );

	reset();
	var prev = $("#first")[0].previousSibling;
	var p = $("#first")[0].parentNode;
	var result = $('#first,#firstp').wrapAll(document.getElementById('empty'));
	equals( $("#first").parent()[0], $("#firstp").parent()[0], "Same Parent" );
	equals( $("#first").parent()[0].previousSibling, prev, "Correct Previous Sibling" );
	equals( $("#first").parent()[0].parentNode, p, "Correct Parent" );
});

test("wrapInner(String|Element)", function() {
	expect(6);
	var num = $("#first").children().length;
	var result = $('#first').wrapInner('<div class="red"><div id="tmp"></div></div>');
	equals( $("#first").children().length, 1, "Only one child" );
	ok( $("#first").children().is(".red"), "Verify Right Element" );
	equals( $("#first").children().children().children().length, num, "Verify Elements Intact" );

	reset();
	var num = $("#first").children().length;
	var result = $('#first').wrapInner(document.getElementById('empty'));
	equals( $("#first").children().length, 1, "Only one child" );
	ok( $("#first").children().is("#empty"), "Verify Right Element" );
	equals( $("#first").children().children().length, num, "Verify Elements Intact" );
});

test("append(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(21);
	var defaultText = 'Try them out:'
	var result = $('#first').append('<b>buga</b>');
	equals( result.text(), defaultText + 'buga', 'Check if text appending works' );
	equals( $('#select3').append('<option value="appendTest">Append Test</option>').find('option:last-child').attr('value'), 'appendTest', 'Appending html options to select element');

	reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	$('#sap').append(document.getElementById('first'));
	equals( expected, $('#sap').text(), "Check for appending of element" );

	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$('#sap').append([document.getElementById('first'), document.getElementById('yahoo')]);
	equals( expected, $('#sap').text(), "Check for appending of array of elements" );

	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$('#sap').append($("#first, #yahoo"));
	equals( expected, $('#sap').text(), "Check for appending of jQuery object" );

	reset();
	$("#sap").append( 5 );
	ok( $("#sap")[0].innerHTML.match( /5$/ ), "Check for appending a number" );

	reset();
	$("#sap").append( " text with spaces " );
	ok( $("#sap")[0].innerHTML.match(/ text with spaces $/), "Check for appending text with spaces" );

	reset();
	ok( $("#sap").append([]), "Check for appending an empty array." );
	ok( $("#sap").append(""), "Check for appending an empty string." );
	ok( $("#sap").append(document.getElementsByTagName("foo")), "Check for appending an empty nodelist." );

	reset();
	$("#sap").append(document.getElementById('form'));
	equals( $("#sap>form").size(), 1, "Check for appending a form" ); // Bug #910

	reset();
	var pass = true;
	try {
		$( $("#iframe")[0].contentWindow.document.body ).append("<div>test</div>");
	} catch(e) {
		pass = false;
	}

	ok( pass, "Test for appending a DOM node to the contents of an IFrame" );

	reset();
	$('<fieldset/>').appendTo('#form').append('<legend id="legend">test</legend>');
	t( 'Append legend', '#legend', ['legend'] );

	reset();
	$('#select1').append('<OPTION>Test</OPTION>');
	equals( $('#select1 option:last').text(), "Test", "Appending &lt;OPTION&gt; (all caps)" );

	$('#table').append('<colgroup></colgroup>');
	ok( $('#table colgroup').length, "Append colgroup" );

	$('#table colgroup').append('<col/>');
	ok( $('#table colgroup col').length, "Append col" );

	reset();
	$('#table').append('<caption></caption>');
	ok( $('#table caption').length, "Append caption" );

	reset();
	$('form:last')
		.append('<select id="appendSelect1"></select>')
		.append('<select id="appendSelect2"><option>Test</option></select>');

	t( "Append Select", "#appendSelect1, #appendSelect2", ["appendSelect1", "appendSelect2"] );

	// using contents will get comments regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	var d = $("<div/>").appendTo("#nonnodes").append(j);
	equals( $("#nonnodes").length, 1, "Check node,textnode,comment append moved leaving just the div" );
	ok( d.contents().length >= 2, "Check node,textnode,comment append works" );
	d.contents().appendTo("#nonnodes");
	d.remove();
	ok( $("#nonnodes").contents().length >= 2, "Check node,textnode,comment append cleanup worked" );
});

test("appendTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(6);
	var defaultText = 'Try them out:'
	$('<b>buga</b>').appendTo('#first');
	equals( $("#first").text(), defaultText + 'buga', 'Check if text appending works' );
	equals( $('<option value="appendTest">Append Test</option>').appendTo('#select3').parent().find('option:last-child').attr('value'), 'appendTest', 'Appending html options to select element');

	reset();
	var expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:";
	$(document.getElementById('first')).appendTo('#sap');
	equals( expected, $('#sap').text(), "Check for appending of element" );

	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$([document.getElementById('first'), document.getElementById('yahoo')]).appendTo('#sap');
	equals( expected, $('#sap').text(), "Check for appending of array of elements" );

	reset();
	expected = "This link has class=\"blog\": Simon Willison's WeblogTry them out:Yahoo";
	$("#first, #yahoo").appendTo('#sap');
	equals( expected, $('#sap').text(), "Check for appending of jQuery object" );

	reset();
	$('#select1').appendTo('#foo');
	t( 'Append select', '#foo select', ['select1'] );
});

test("prepend(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(5);
	var defaultText = 'Try them out:'
	var result = $('#first').prepend('<b>buga</b>');
	equals( result.text(), 'buga' + defaultText, 'Check if text prepending works' );
	equals( $('#select3').prepend('<option value="prependTest">Prepend Test</option>').find('option:first-child').attr('value'), 'prependTest', 'Prepending html options to select element');

	reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	$('#sap').prepend(document.getElementById('first'));
	equals( expected, $('#sap').text(), "Check for prepending of element" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$('#sap').prepend([document.getElementById('first'), document.getElementById('yahoo')]);
	equals( expected, $('#sap').text(), "Check for prepending of array of elements" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$('#sap').prepend($("#first, #yahoo"));
	equals( expected, $('#sap').text(), "Check for prepending of jQuery object" );
});

test("prependTo(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(6);
	var defaultText = 'Try them out:'
	$('<b>buga</b>').prependTo('#first');
	equals( $('#first').text(), 'buga' + defaultText, 'Check if text prepending works' );
	equals( $('<option value="prependTest">Prepend Test</option>').prependTo('#select3').parent().find('option:first-child').attr('value'), 'prependTest', 'Prepending html options to select element');

	reset();
	var expected = "Try them out:This link has class=\"blog\": Simon Willison's Weblog";
	$(document.getElementById('first')).prependTo('#sap');
	equals( expected, $('#sap').text(), "Check for prepending of element" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$([document.getElementById('yahoo'), document.getElementById('first')]).prependTo('#sap');
	equals( expected, $('#sap').text(), "Check for prepending of array of elements" );

	reset();
	expected = "Try them out:YahooThis link has class=\"blog\": Simon Willison's Weblog";
	$("#yahoo, #first").prependTo('#sap');
	equals( expected, $('#sap').text(), "Check for prepending of jQuery object" );

	reset();
	$('<select id="prependSelect1"></select>').prependTo('form:last');
	$('<select id="prependSelect2"><option>Test</option></select>').prependTo('form:last');

	t( "Prepend Select", "#prependSelect1, #prependSelect2", ["prependSelect1", "prependSelect2"] );
});

test("before(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: bugaYahoo';
	$('#yahoo').before('<b>buga</b>');
	equals( expected, $('#en').text(), 'Insert String before' );

	reset();
	expected = "This is a normal link: Try them out:Yahoo";
	$('#yahoo').before(document.getElementById('first'));
	equals( expected, $('#en').text(), "Insert element before" );

	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$('#yahoo').before([document.getElementById('first'), document.getElementById('mark')]);
	equals( expected, $('#en').text(), "Insert array of elements before" );

	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$('#yahoo').before($("#first, #mark"));
	equals( expected, $('#en').text(), "Insert jQuery before" );
});

test("insertBefore(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: bugaYahoo';
	$('<b>buga</b>').insertBefore('#yahoo');
	equals( expected, $('#en').text(), 'Insert String before' );

	reset();
	expected = "This is a normal link: Try them out:Yahoo";
	$(document.getElementById('first')).insertBefore('#yahoo');
	equals( expected, $('#en').text(), "Insert element before" );

	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$([document.getElementById('first'), document.getElementById('mark')]).insertBefore('#yahoo');
	equals( expected, $('#en').text(), "Insert array of elements before" );

	reset();
	expected = "This is a normal link: Try them out:diveintomarkYahoo";
	$("#first, #mark").insertBefore('#yahoo');
	equals( expected, $('#en').text(), "Insert jQuery before" );
});

test("after(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: Yahoobuga';
	$('#yahoo').after('<b>buga</b>');
	equals( expected, $('#en').text(), 'Insert String after' );

	reset();
	expected = "This is a normal link: YahooTry them out:";
	$('#yahoo').after(document.getElementById('first'));
	equals( expected, $('#en').text(), "Insert element after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$('#yahoo').after([document.getElementById('first'), document.getElementById('mark')]);
	equals( expected, $('#en').text(), "Insert array of elements after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$('#yahoo').after($("#first, #mark"));
	equals( expected, $('#en').text(), "Insert jQuery after" );
});

test("insertAfter(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(4);
	var expected = 'This is a normal link: Yahoobuga';
	$('<b>buga</b>').insertAfter('#yahoo');
	equals( expected, $('#en').text(), 'Insert String after' );

	reset();
	expected = "This is a normal link: YahooTry them out:";
	$(document.getElementById('first')).insertAfter('#yahoo');
	equals( expected, $('#en').text(), "Insert element after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$([document.getElementById('mark'), document.getElementById('first')]).insertAfter('#yahoo');
	equals( expected, $('#en').text(), "Insert array of elements after" );

	reset();
	expected = "This is a normal link: YahooTry them out:diveintomark";
	$("#mark, #first").insertAfter('#yahoo');
	equals( expected, $('#en').text(), "Insert jQuery after" );
});

test("replaceWith(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(10);
	$('#yahoo').replaceWith('<b id="replace">buga</b>');
	ok( $("#replace")[0], 'Replace element with string' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after string' );

	reset();
	$('#yahoo').replaceWith(document.getElementById('first'));
	ok( $("#first")[0], 'Replace element with element' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after element' );

	reset();
	$('#yahoo').replaceWith([document.getElementById('first'), document.getElementById('mark')]);
	ok( $("#first")[0], 'Replace element with array of elements' );
	ok( $("#mark")[0], 'Replace element with array of elements' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after array of elements' );

	reset();
	$('#yahoo').replaceWith($("#first, #mark"));
	ok( $("#first")[0], 'Replace element with set of elements' );
	ok( $("#mark")[0], 'Replace element with set of elements' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after set of elements' );
});

test("replaceAll(String|Element|Array&lt;Element&gt;|jQuery)", function() {
	expect(10);
	$('<b id="replace">buga</b>').replaceAll("#yahoo");
	ok( $("#replace")[0], 'Replace element with string' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after string' );

	reset();
	$(document.getElementById('first')).replaceAll("#yahoo");
	ok( $("#first")[0], 'Replace element with element' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after element' );

	reset();
	$([document.getElementById('first'), document.getElementById('mark')]).replaceAll("#yahoo");
	ok( $("#first")[0], 'Replace element with array of elements' );
	ok( $("#mark")[0], 'Replace element with array of elements' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after array of elements' );

	reset();
	$("#first, #mark").replaceAll("#yahoo");
	ok( $("#first")[0], 'Replace element with set of elements' );
	ok( $("#mark")[0], 'Replace element with set of elements' );
	ok( !$("#yahoo")[0], 'Verify that original element is gone, after set of elements' );
});

test("end()", function() {
	expect(3);
	equals( 'Yahoo', $('#yahoo').parent().end().text(), 'Check for end' );
	ok( $('#yahoo').end(), 'Check for end with nothing to end' );

	var x = $('#yahoo');
	x.parent();
	equals( 'Yahoo', $('#yahoo').text(), 'Check for non-destructive behaviour' );
});

test("find(String)", function() {
	expect(2);
	equals( 'Yahoo', $('#foo').find('.blogTest').text(), 'Check for find' );

	// using contents will get comments regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	equals( j.find("div").length, 0, "Check node,textnode,comment to find zero divs" );
});

test("clone()", function() {
	expect(20);
	equals( 'This is a normal link: Yahoo', $('#en').text(), 'Assert text for #en' );
	var clone = $('#yahoo').clone();
	equals( 'Try them out:Yahoo', $('#first').append(clone).text(), 'Check for clone' );
	equals( 'This is a normal link: Yahoo', $('#en').text(), 'Reassert text for #en' );

	var cloneTags = [
		"<table/>", "<tr/>", "<td/>", "<div/>",
		"<button/>", "<ul/>", "<ol/>", "<li/>",
		"<input type='checkbox' />", "<select/>", "<option/>", "<textarea/>",
		"<tbody/>", "<thead/>", "<tfoot/>", "<iframe/>"
	];
	for (var i = 0; i < cloneTags.length; i++) {
		var j = $(cloneTags[i]);
		equals( j[0].tagName, j.clone()[0].tagName, 'Clone a &lt;' + cloneTags[i].substring(1));
	}

	// using contents will get comments regular, text, and comment nodes
	var cl = $("#nonnodes").contents().clone();
	ok( cl.length >= 2, "Check node,textnode,comment clone works (some browsers delete comments on clone)" );
});

if (!isLocal) {
test("clone() on XML nodes", function() {
	expect(2);
	stop();
	$.get("data/dashboard.xml", function (xml) {
		var root = $(xml.documentElement).clone();
		$("tab:first", xml).text("origval");
		$("tab:first", root).text("cloneval");
		equals($("tab:first", xml).text(), "origval", "Check original XML node was correctly set");
		equals($("tab:first", root).text(), "cloneval", "Check cloned XML node was correctly set");
		start();
	});
});
}

test("is(String)", function() {
	expect(26);
	ok( $('#form').is('form'), 'Check for element: A form must be a form' );
	ok( !$('#form').is('div'), 'Check for element: A form is not a div' );
	ok( $('#mark').is('.blog'), 'Check for class: Expected class "blog"' );
	ok( !$('#mark').is('.link'), 'Check for class: Did not expect class "link"' );
	ok( $('#simon').is('.blog.link'), 'Check for multiple classes: Expected classes "blog" and "link"' );
	ok( !$('#simon').is('.blogTest'), 'Check for multiple classes: Expected classes "blog" and "link", but not "blogTest"' );
	ok( $('#en').is('[lang="en"]'), 'Check for attribute: Expected attribute lang to be "en"' );
	ok( !$('#en').is('[lang="de"]'), 'Check for attribute: Expected attribute lang to be "en", not "de"' );
	ok( $('#text1').is('[type="text"]'), 'Check for attribute: Expected attribute type to be "text"' );
	ok( !$('#text1').is('[type="radio"]'), 'Check for attribute: Expected attribute type to be "text", not "radio"' );
	ok( $('#text2').is(':disabled'), 'Check for pseudoclass: Expected to be disabled' );
	ok( !$('#text1').is(':disabled'), 'Check for pseudoclass: Expected not disabled' );
	ok( $('#radio2').is(':checked'), 'Check for pseudoclass: Expected to be checked' );
	ok( !$('#radio1').is(':checked'), 'Check for pseudoclass: Expected not checked' );
	ok( $('#foo').is(':has(p)'), 'Check for child: Expected a child "p" element' );
	ok( !$('#foo').is(':has(ul)'), 'Check for child: Did not expect "ul" element' );
	ok( $('#foo').is(':has(p):has(a):has(code)'), 'Check for childs: Expected "p", "a" and "code" child elements' );
	ok( !$('#foo').is(':has(p):has(a):has(code):has(ol)'), 'Check for childs: Expected "p", "a" and "code" child elements, but no "ol"' );
	ok( !$('#foo').is(0), 'Expected false for an invalid expression - 0' );
	ok( !$('#foo').is(null), 'Expected false for an invalid expression - null' );
	ok( !$('#foo').is(''), 'Expected false for an invalid expression - ""' );
	ok( !$('#foo').is(undefined), 'Expected false for an invalid expression - undefined' );

	// test is() with comma-seperated expressions
	ok( $('#en').is('[lang="en"],[lang="de"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
	ok( $('#en').is('[lang="de"],[lang="en"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
	ok( $('#en').is('[lang="en"] , [lang="de"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
	ok( $('#en').is('[lang="de"] , [lang="en"]'), 'Comma-seperated; Check for lang attribute: Expect en or de' );
});

test("$.extend(Object, Object)", function() {
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
	expect(4);
	equals( $("#text1").val(), "Test", "Check for value of input element" );
	equals( !$("#text1").val(), "", "Check for value of input element" );
	// ticket #1714 this caused a JS error in IE
	equals( $("#first").val(), "", "Check a paragraph element to see if it has a value" );
	ok( $([]).val() === undefined, "Check an empty jQuery object will return undefined from val" );
});

test("val(String)", function() {
	expect(4);
	document.getElementById('text1').value = "bla";
	equals( $("#text1").val(), "bla", "Check for modified value of input element" );
	$("#text1").val('test');
	ok ( document.getElementById('text1').value == "test", "Check for modified (via val(String)) value of input element" );

	$("#select1").val("3");
	equals( $("#select1").val(), "3", "Check for modified (via val(String)) value of select element" );

	// using contents will get comments regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	j.val("asdf");
	equals( j.val(), "asdf", "Check node,textnode,comment with val()" );
	j.removeAttr("value");
});

var scriptorder = 0;

test("html(String)", function() {
	expect(11);
	var div = $("#main > div");
	div.html("<b>test</b>");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).childNodes.length != 1 ) pass = false;
	}
	ok( pass, "Set HTML" );

	reset();
	// using contents will get comments regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	j.html("<b>bold</b>");

	// this is needed, or the expando added by jQuery unique will yield a different html
	j.find('b').removeData();
	equals( j.html().toLowerCase(), "<b>bold</b>", "Check node,textnode,comment with html()" );

	$("#main").html("<select/>");
	$("#main select").html("<option>O1</option><option selected='selected'>O2</option><option>O3</option>");
	equals( $("#main select").val(), "O2", "Selected option correct" );

	stop();

	$("#main").html('<script type="text/javascript">ok( true, "$().html().evalScripts() Evals Scripts Twice in Firefox, see #975" );</script>');

	$("#main").html('foo <form><script type="text/javascript">ok( true, "$().html().evalScripts() Evals Scripts Twice in Firefox, see #975" );</script></form>');

	// it was decided that waiting to execute ALL scripts makes sense since nested ones have to wait anyway so this test case is changed, see #1959
	$("#main").html("<script>equals(scriptorder++, 0, 'Script is executed in order');equals($('#scriptorder').length, 1,'Execute after html (even though appears before)')<\/script><span id='scriptorder'><script>equals(scriptorder++, 1, 'Script (nested) is executed in order');equals($('#scriptorder').length, 1,'Execute after html')<\/script></span><script>equals(scriptorder++, 2, 'Script (unnested) is executed in order');equals($('#scriptorder').length, 1,'Execute after html')<\/script>");

	setTimeout( start, 100 );
});

test("filter()", function() {
	expect(6);
	isSet( $("#form input").filter(":checked").get(), q("radio2", "check1"), "filter(String)" );
	isSet( $("p").filter("#ap, #sndp").get(), q("ap", "sndp"), "filter('String, String')" );
	isSet( $("p").filter("#ap,#sndp").get(), q("ap", "sndp"), "filter('String,String')" );
	isSet( $("p").filter(function() { return !$("a", this).length }).get(), q("sndp", "first"), "filter(Function)" );

	// using contents will get comments regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	equals( j.filter("span").length, 1, "Check node,textnode,comment to filter the one span" );
	equals( j.filter("[name]").length, 0, "Check node,textnode,comment to filter the one span" );
});

test("not()", function() {
	expect(8);
	equals( $("#main > p#ap > a").not("#google").length, 2, "not('selector')" );
	equals( $("#main > p#ap > a").not(document.getElementById("google")).length, 2, "not(DOMElement)" );
	isSet( $("p").not(".result").get(), q("firstp", "ap", "sndp", "en", "sap", "first"), "not('.class')" );
	isSet( $("p").not("#ap, #sndp, .result").get(), q("firstp", "en", "sap", "first"), "not('selector, selector')" );
	isSet( $("p").not($("#ap, #sndp, .result")).get(), q("firstp", "en", "sap", "first"), "not(jQuery)" );
	equals( $("p").not(document.getElementsByTagName("p")).length, 0, "not(Array-like DOM collection)" );
	isSet( $("#form option").not("option.emptyopt:contains('Nothing'),[selected],[value='1']").get(), q("option1c", "option1d", "option2c", "option3d" ), "not('complex selector')");

	var selects = $("#form select");
	isSet( selects.not( selects[1] ), q("select1", "select3"), "filter out DOM element");
});

test("andSelf()", function() {
	expect(4);
	isSet( $("#en").siblings().andSelf().get(), q("sndp", "sap","en"), "Check for siblings and self" );
	isSet( $("#foo").children().andSelf().get(), q("sndp", "en", "sap", "foo"), "Check for children and self" );
	isSet( $("#en, #sndp").parent().andSelf().get(), q("foo","en","sndp"), "Check for parent and self" );
	isSet( $("#groups").parents("p, div").andSelf().get(), q("ap", "main", "groups"), "Check for parents and self" );
});

test("siblings([String])", function() {
	expect(5);
	isSet( $("#en").siblings().get(), q("sndp", "sap"), "Check for siblings" );
	isSet( $("#sndp").siblings(":has(code)").get(), q("sap"), "Check for filtered siblings (has code child element)" );
	isSet( $("#sndp").siblings(":has(a)").get(), q("en", "sap"), "Check for filtered siblings (has anchor child element)" );
	isSet( $("#foo").siblings("form, b").get(), q("form", "lengthtest", "testForm", "floatTest"), "Check for multiple filters" );
	isSet( $("#en, #sndp").siblings().get(), q("sndp", "sap", "en"), "Check for unique results from siblings" );
});

test("children([String])", function() {
	expect(3);
	isSet( $("#foo").children().get(), q("sndp", "en", "sap"), "Check for children" );
	isSet( $("#foo").children(":has(code)").get(), q("sndp", "sap"), "Check for filtered children" );
	isSet( $("#foo").children("#en, #sap").get(), q("en", "sap"), "Check for multiple filters" );
});

test("parent([String])", function() {
	expect(5);
	equals( $("#groups").parent()[0].id, "ap", "Simple parent check" );
	equals( $("#groups").parent("p")[0].id, "ap", "Filtered parent check" );
	equals( $("#groups").parent("div").length, 0, "Filtered parent check, no match" );
	equals( $("#groups").parent("div, p")[0].id, "ap", "Check for multiple filters" );
	isSet( $("#en, #sndp").parent().get(), q("foo"), "Check for unique results from parent" );
});

test("parents([String])", function() {
	expect(5);
	equals( $("#groups").parents()[0].id, "ap", "Simple parents check" );
	equals( $("#groups").parents("p")[0].id, "ap", "Filtered parents check" );
	equals( $("#groups").parents("div")[0].id, "main", "Filtered parents check2" );
	isSet( $("#groups").parents("p, div").get(), q("ap", "main"), "Check for multiple filters" );
	isSet( $("#en, #sndp").parents().get(), q("foo", "main", "dl", "body", "html"), "Check for unique results from parents" );
});

test("next([String])", function() {
	expect(4);
	equals( $("#ap").next()[0].id, "foo", "Simple next check" );
	equals( $("#ap").next("div")[0].id, "foo", "Filtered next check" );
	equals( $("#ap").next("p").length, 0, "Filtered next check, no match" );
	equals( $("#ap").next("div, p")[0].id, "foo", "Multiple filters" );
});

test("prev([String])", function() {
	expect(4);
	equals( $("#foo").prev()[0].id, "ap", "Simple prev check" );
	equals( $("#foo").prev("p")[0].id, "ap", "Filtered prev check" );
	equals( $("#foo").prev("div").length, 0, "Filtered prev check, no match" );
	equals( $("#foo").prev("p, div")[0].id, "ap", "Multiple filters" );
});

test("show()", function() {
	expect(15);
	var pass = true, div = $("div");
	div.show().each(function(){
		if ( this.style.display == "none" ) pass = false;
	});
	ok( pass, "Show" );

	$("#main").append('<div id="show-tests"><div><p><a href="#"></a></p><code></code><pre></pre><span></span></div><table><thead><tr><th></th></tr></thead><tbody><tr><td></td></tr></tbody></table><ul><li></li></ul></div>');
	var test = {
		"div"      : "block",
		"p"        : "block",
		"a"        : "inline",
		"code"     : "inline",
		"pre"      : "block",
		"span"     : "inline",
		"table"    : $.browser.msie ? "block" : "table",
		"thead"    : $.browser.msie ? "block" : "table-header-group",
		"tbody"    : $.browser.msie ? "block" : "table-row-group",
		"tr"       : $.browser.msie ? "block" : "table-row",
		"th"       : $.browser.msie ? "block" : "table-cell",
		"td"       : $.browser.msie ? "block" : "table-cell",
		"ul"       : "block",
		"li"       : $.browser.msie ? "block" : "list-item"
	};

	$.each(test, function(selector, expected) {
		var elem = $(selector, "#show-tests").show();
		equals( elem.css("display"), expected, "Show using correct display type for " + selector );
	});
});

test("addClass(String)", function() {
	expect(2);
	var div = $("div");
	div.addClass("test");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	 if ( div.get(i).className.indexOf("test") == -1 ) pass = false;
	}
	ok( pass, "Add Class" );

	// using contents will get regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	j.addClass("asdf");
	ok( j.hasClass("asdf"), "Check node,textnode,comment for addClass" );
});

test("removeClass(String) - simple", function() {
	expect(4);
	var div = $("div").addClass("test").removeClass("test"),
		pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
		if ( div.get(i).className.indexOf("test") != -1 ) pass = false;
	}
	ok( pass, "Remove Class" );

	reset();
	var div = $("div").addClass("test").addClass("foo").addClass("bar");
	div.removeClass("test").removeClass("bar").removeClass("foo");
	var pass = true;
	for ( var i = 0; i < div.size(); i++ ) {
	 if ( div.get(i).className.match(/test|bar|foo/) ) pass = false;
	}
	ok( pass, "Remove multiple classes" );

	reset();
	var div = $("div:eq(0)").addClass("test").removeClass("");
	ok( div.is('.test'), "Empty string passed to removeClass" );

	// using contents will get regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	j.removeClass("asdf");
	ok( !j.hasClass("asdf"), "Check node,textnode,comment for removeClass" );
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
	expect(1);
	equals( $('#mark').removeAttr("class")[0].className, "", "remove class" );
});

test("text(String)", function() {
	expect(4);
	equals( $("#foo").text("<div><b>Hello</b> cruel world!</div>")[0].innerHTML, "&lt;div&gt;&lt;b&gt;Hello&lt;/b&gt; cruel world!&lt;/div&gt;", "Check escaped text" );

	// using contents will get comments regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	j.text("hi!");
	equals( $(j[0]).text(), "hi!", "Check node,textnode,comment with text()" );
	equals( j[1].nodeValue, " there ", "Check node,textnode,comment with text()" );
	equals( j[2].nodeType, 8, "Check node,textnode,comment with text()" );
});

test("$.each(Object,Function)", function() {
	expect(12);
	$.each( [0,1,2], function(i, n){
		equals( i, n, "Check array iteration" );
	});

	$.each( [5,6,7], function(i, n){
		equals( i, n - 5, "Check array iteration" );
	});

	$.each( { name: "name", lang: "lang" }, function(i, n){
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

test("$.prop", function() {
	expect(2);
	var handle = function() { return this.id };
	equals( $.prop($("#ap")[0], handle), "ap", "Check with Function argument" );
	equals( $.prop($("#ap")[0], "value"), "value", "Check with value argument" );
});

test("$.className", function() {
	expect(6);
	var x = $("<p>Hi</p>")[0];
	var c = $.className;
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

test("$.data", function() {
	expect(5);
	var div = $("#foo")[0];
	equals( jQuery.data(div, "test"), undefined, "Check for no data exists" );
	jQuery.data(div, "test", "success");
	equals( jQuery.data(div, "test"), "success", "Check for added data" );
	jQuery.data(div, "test", "overwritten");
	equals( jQuery.data(div, "test"), "overwritten", "Check for overwritten data" );
	jQuery.data(div, "test", undefined);
	equals( jQuery.data(div, "test"), "overwritten", "Check that data wasn't removed");
	jQuery.data(div, "test", null);
	ok( jQuery.data(div, "test") === null, "Check for null data");
});

test(".data()", function() {
	expect(18);
	var div = $("#foo");
	equals( div.data("test"), undefined, "Check for no data exists" );
	div.data("test", "success");
	equals( div.data("test"), "success", "Check for added data" );
	div.data("test", "overwritten");
	equals( div.data("test"), "overwritten", "Check for overwritten data" );
	div.data("test", undefined);
	equals( div.data("test"), "overwritten", "Check that data wasn't removed");
	div.data("test", null);
	ok( div.data("test") === null, "Check for null data");

	div.data("test", "overwritten");
	var hits = {test:0}, gets = {test:0};

	div
		.bind("setData",function(e,key,value){ hits[key] += value; })
		.bind("setData.foo",function(e,key,value){ hits[key] += value; })
		.bind("getData",function(e,key){ gets[key] += 1; })
		.bind("getData.foo",function(e,key){ gets[key] += 3; });

	div.data("test.foo", 2);
	equals( div.data("test"), "overwritten", "Check for original data" );
	equals( div.data("test.foo"), 2, "Check for namespaced data" );
	equals( div.data("test.bar"), "overwritten", "Check for unmatched namespace" );
	equals( hits.test, 2, "Check triggered setter functions" );
	equals( gets.test, 5, "Check triggered getter functions" );

	hits.test = 0;
	gets.test = 0;

	div.data("test", 1);
	equals( div.data("test"), 1, "Check for original data" );
	equals( div.data("test.foo"), 2, "Check for namespaced data" );
	equals( div.data("test.bar"), 1, "Check for unmatched namespace" );
	equals( hits.test, 1, "Check triggered setter functions" );
	equals( gets.test, 5, "Check triggered getter functions" );

	hits.test = 0;
	gets.test = 0;

	div
		.bind("getData",function(e,key){ return key + "root"; })
		.bind("getData.foo",function(e,key){ return key + "foo"; });

	equals( div.data("test"), "testroot", "Check for original data" );
	equals( div.data("test.foo"), "testfoo", "Check for namespaced data" );
	equals( div.data("test.bar"), "testroot", "Check for unmatched namespace" );
});

test("$.removeData", function() {
	expect(1);
	var div = $("#foo")[0];
	jQuery.data(div, "test", "testing");
	jQuery.removeData(div, "test");
	equals( jQuery.data(div, "test"), undefined, "Check removal of data" );
});

test(".removeData()", function() {
	expect(6);
	var div = $("#foo");
	div.data("test", "testing");
	div.removeData("test");
	equals( div.data("test"), undefined, "Check removal of data" );

	div.data("test", "testing");
	div.data("test.foo", "testing2");
	div.removeData("test.bar");
	equals( div.data("test.foo"), "testing2", "Make sure data is intact" );
	equals( div.data("test"), "testing", "Make sure data is intact" );

	div.removeData("test");
	equals( div.data("test.foo"), "testing2", "Make sure data is intact" );
	equals( div.data("test"), undefined, "Make sure data is intact" );

	div.removeData("test.foo");
	equals( div.data("test.foo"), undefined, "Make sure data is intact" );
});

test("remove()", function() {
	expect(6);
	$("#ap").children().remove();
	ok( $("#ap").text().length > 10, "Check text is not removed" );
	equals( $("#ap").children().length, 0, "Check remove" );

	reset();
	$("#ap").children().remove("a");
	ok( $("#ap").text().length > 10, "Check text is not removed" );
	equals( $("#ap").children().length, 1, "Check filtered remove" );

	// using contents will get comments regular, text, and comment nodes
	equals( $("#nonnodes").contents().length, 3, "Check node,textnode,comment remove works" );
	$("#nonnodes").contents().remove();
	equals( $("#nonnodes").contents().length, 0, "Check node,textnode,comment remove works" );
});

test("empty()", function() {
	expect(3);
	equals( $("#ap").children().empty().text().length, 0, "Check text is removed" );
	equals( $("#ap").children().length, 4, "Check elements are not removed" );

	// using contents will get comments regular, text, and comment nodes
	var j = $("#nonnodes").contents();
	j.empty();
	equals( j.html(), "", "Check node,textnode,comment empty works" );
});

test("slice()", function() {
	expect(5);
	isSet( $("#ap a").slice(1,2), q("groups"), "slice(1,2)" );
	isSet( $("#ap a").slice(1), q("groups", "anchor1", "mark"), "slice(1)" );
	isSet( $("#ap a").slice(0,3), q("google", "groups", "anchor1"), "slice(0,3)" );
	isSet( $("#ap a").slice(-1), q("mark"), "slice(-1)" );

	isSet( $("#ap a").eq(1), q("groups"), "eq(1)" );
});

test("map()", function() {
	expect(2);//expect(6);

	isSet(
		$("#ap").map(function(){
			return $(this).find("a").get();
		}),
		q("google", "groups", "anchor1", "mark"),
		"Array Map"
	);

	isSet(
		$("#ap > a").map(function(){
			return this.parentNode;
		}),
		q("ap","ap","ap"),
		"Single Map"
	);

	return;//these haven't been accepted yet

	//for #2616
	var keys = $.map( {a:1,b:2}, function( v, k ){
		return k;
	}, [ ] );

	equals( keys.join(""), "ab", "Map the keys from a hash to an array" );

	var values = $.map( {a:1,b:2}, function( v, k ){
		return v;
	}, [ ] );

	equals( values.join(""), "12", "Map the values from a hash to an array" );

	var scripts = document.getElementsByTagName("script");
	var mapped = $.map( scripts, function( v, k ){
		return v;
	}, {length:0} );

	equals( mapped.length, scripts.length, "Map an array(-like) to a hash" );

	var flat = $.map( Array(4), function( v, k ){
		return k % 2 ? k : [k,k,k];//try mixing array and regular returns
	});

	equals( flat.join(""), "00012223", "try the new flatten technique(#2616)" );
});

test("contents()", function() {
	expect(12);
	equals( $("#ap").contents().length, 9, "Check element contents" );
	ok( $("#iframe").contents()[0], "Check existance of IFrame document" );
	var ibody = $("#loadediframe").contents()[0].body;
	ok( ibody, "Check existance of IFrame body" );

	equals( $("span", ibody).text(), "span text", "Find span in IFrame and check its text" );

	$(ibody).append("<div>init text</div>");
	equals( $("div", ibody).length, 2, "Check the original div and the new div are in IFrame" );

	equals( $("div:last", ibody).text(), "init text", "Add text to div in IFrame" );

	$("div:last", ibody).text("div text");
	equals( $("div:last", ibody).text(), "div text", "Add text to div in IFrame" );

	$("div:last", ibody).remove();
	equals( $("div", ibody).length, 1, "Delete the div and check only one div left in IFrame" );

	equals( $("div", ibody).text(), "span text", "Make sure the correct div is still left after deletion in IFrame" );

	$("<table/>", ibody).append("<tr><td>cell</td></tr>").appendTo(ibody);
	$("table", ibody).remove();
	equals( $("div", ibody).length, 1, "Check for JS error on add and delete of a table in IFrame" );

	// using contents will get comments regular, text, and comment nodes
	var c = $("#nonnodes").contents().contents();
	equals( c.length, 1, "Check node,textnode,comment contents is just one" );
	equals( c[0].nodeValue, "hi", "Check node,textnode,comment contents is just the one from span" );
});

test("$.makeArray", function(){
	expect(15);

	equals( $.makeArray($('html>*'))[0].nodeName, "HEAD", "Pass makeArray a jQuery object" );

	equals( $.makeArray(document.getElementsByName("PWD")).slice(0,1)[0].name, "PWD", "Pass makeArray a nodelist" );

	equals( (function(){ return $.makeArray(arguments); })(1,2).join(""), "12", "Pass makeArray an arguments array" );

	equals( $.makeArray([1,2,3]).join(""), "123", "Pass makeArray a real array" );

	equals( $.makeArray().length, 0, "Pass nothing to makeArray and expect an empty array" );

	equals( $.makeArray( 0 )[0], 0 , "Pass makeArray a number" );

	equals( $.makeArray( "foo" )[0], "foo", "Pass makeArray a string" );

	equals( $.makeArray( true )[0].constructor, Boolean, "Pass makeArray a boolean" );

	equals( $.makeArray( document.createElement("div") )[0].nodeName, "DIV", "Pass makeArray a single node" );

	equals( $.makeArray( {length:2, 0:"a", 1:"b"} ).join(""), "ab", "Pass makeArray an array like map (with length)" );

	equals( $.makeArray( document.documentElement.childNodes ).slice(0,1)[0].nodeName, "HEAD", "Pass makeArray a childNodes array" );

	//function, is tricky as it has length
	equals( $.makeArray( function(){ return 1;} )[0](), 1, "Pass makeArray a function" );
	//window, also has length
	equals( $.makeArray(window)[0], window, "Pass makeArray the window" );

	equals( $.makeArray(/a/)[0].constructor, RegExp, "Pass makeArray a regex" );

	ok( $.makeArray(document.getElementById('form')).length >= 13, "Pass makeArray a form (treat as elements)" );
});
