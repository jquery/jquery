/**
 * This test page is for selector tests that address selector issues that have already been addressed in jQuery functions
 *   and which only work because jQuery has hooked into Sizzle.
 * These tests may or may not fail in an independent Sizzle.
 */

module("selector - jQuery only", { teardown: moduleTeardown });

/**
 * Loads an iframe for the selector context
 * @param {String} fileName - Name of the html file to load
 * @param {String} name - Test name
 * @param {Function} fn - Test callback containing the tests to run
 */
var testIframe = function( fileName, name, fn ) {

	var loadFixture = function() {

		// Creates iframe with cache disabled
		var src = "./data/" + fileName + ".html?" + parseInt( Math.random()*1000, 10 ),
			iframe = jQuery("<iframe />").css({
				width: 500, height: 500, position: "absolute", top: -600, left: -600, visibility: "hidden"
			}).appendTo("body")[0];
		iframe.contentWindow.location = src;
		return iframe;
	};

	test(name, function() {
		// pause execution for now
		stop();

		// load fixture in iframe
		var iframe = loadFixture(),
			win = iframe.contentWindow,
			interval = setInterval( function() {
				if ( win && win.jQuery && win.jQuery.isReady ) {
					clearInterval( interval );
					// continue
					start();
					// call actual tests passing the correct jQuery instance to use
					fn.call( this, win.jQuery, win );
					document.body.removeChild( iframe );
					iframe = null;
				}
			}, 15 );
	});
};

testIframe("selector", "attributes - jQuery.attr", function( jQuery, window ) {
	expect(34);

	var document = window.document;

	/**
	 * Returns an array of elements with the given IDs, eg.
	 */
	var q = function() {
	 	var r = [];
	 
	 	for ( var i = 0; i < arguments.length; i++ ) {
	 		r.push( document.getElementById( arguments[i] ) );
	 	}
	 
	 	return r;
	};
			   
	/**
	 * Asserts that a select matches the given IDs * @example t("Check for something", "//[a]", ["foo", "baar"]);
	 * @param {String} a - Assertion name
	 * @param {String} b - Sizzle selector
	 * @param {String} c - Array of ids to construct what is expected
	 */
	var t = function( a, b, c ) {
		var f = jQuery(b).get(), s = "";
		
		for ( var i = 0; i < f.length; i++ ) {
	 		s += (s && ",") + '"' + f[i].id + '"';
		}

		deepEqual(f, q.apply( q, c ), a + " (" + b + ")");
	};

	// ====== All known boolean attributes, including html5 booleans ======
	// autobuffer, autofocus, autoplay, async, checked,
	// compact, controls, declare, defer, disabled,
	// formnovalidate, hidden, indeterminate (property only),
	// ismap, itemscope, loop, multiple, muted, nohref, noresize,
	// noshade, nowrap, novalidate, open, pubdate, readonly, required,
	// reversed, scoped, seamless, selected, truespeed, visible (skipping visible attribute, which is on a barprop object)

	t( "Attribute Exists", "[autobuffer]",     ["video1"]);
	t( "Attribute Exists", "[autofocus]",      ["text1"]);
	t( "Attribute Exists", "[autoplay]",       ["video1"]);
	t( "Attribute Exists", "[async]",          ["script1"]);
	t( "Attribute Exists", "[checked]",        ["check1"]);
	t( "Attribute Exists", "[compact]",        ["dl"]);
	t( "Attribute Exists", "[controls]",       ["video1"]);
	t( "Attribute Exists", "[declare]",        ["object1"]);
	t( "Attribute Exists", "[defer]",          ["script1"]);
	t( "Attribute Exists", "[disabled]",       ["check1"]);
	t( "Attribute Exists", "[formnovalidate]", ["form1"]);
	t( "Attribute Exists", "[hidden]",         ["div1"]);
	t( "Attribute Exists", "[indeterminate]",  []);
	t( "Attribute Exists", "[ismap]",          ["img1"]);
	t( "Attribute Exists", "[itemscope]",      ["div1"]);
	// t( "Attribute Exists", "[loop]",           ["video1"]); // IE 6/7 cannot differentiate here. loop is also used on img, input, and marquee tags as well as video/audio. getAttributeNode unfortunately only retrieves the property value.
	t( "Attribute Exists", "[multiple]",       ["select1"]);
	t( "Attribute Exists", "[muted]",          ["audio1"]);
	// t( "Attribute Exists", "[nohref]",         ["area1"]); // IE 6/7 keep this set to false regardless of presence. The attribute node is not retrievable.
	t( "Attribute Exists", "[noresize]",       ["textarea1"]);
	t( "Attribute Exists", "[noshade]",        ["hr1"]);
	t( "Attribute Exists", "[nowrap]",         ["td1", "div1"]);
	t( "Attribute Exists", "[novalidate]",     ["form1"]);
	t( "Attribute Exists", "[open]",           ["details1"]);
	t( "Attribute Exists", "[pubdate]",        ["article1"]);
	t( "Attribute Exists", "[readonly]",       ["text1"]);
	t( "Attribute Exists", "[required]",       ["text1"]);
	t( "Attribute Exists", "[reversed]",       ["ol1"]);
	t( "Attribute Exists", "[scoped]",         ["style1"]);
	t( "Attribute Exists", "[seamless]",       ["iframe1"]);
	// t( "Attribute Exists", "[selected]",       ["option1"]); // IE8's querySelectorAll fails here. Redirecting to oldSizzle would work, but it would require an additional support test as well as a check for the selected attribute within the qsa logic
	t( "Attribute Exists", "[truespeed]",      ["marquee1"]);

	// Enumerated attributes (these are not boolean content attributes)
	jQuery.each([ "draggable", "contenteditable", "aria-disabled" ], function( i, val ) {
		t( "Enumerated attribute", "[" + val + "]", ["div1"]);
	});
	t( "Enumerated attribute", "[spellcheck]", ["span1"]);

	// t( "tabindex selector does not retrieve all elements in IE6/7(#8473)", "form, [tabindex]", ["form1", "text1"]); // Uncomment this when the tabindex attrHook is deprecated

	t( "Improperly named form elements do not interfere with form selections (#9570)", "form[name='formName']", ["form1"]);
});
