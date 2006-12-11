/*
 * jQuery @VERSION - New Wave Javascript
 *
 * Copyright (c) 2006 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date$
 * $Rev$
 */

// Global undefined variable
window.undefined = window.undefined;

/**
 * Create a new jQuery Object
 *
 * @constructor
 * @private
 * @name jQuery
 * @cat Core
 */
var jQuery = function(a,c) {

	// Shortcut for document ready (because $(document).each() is silly)
	if ( a && typeof a == "function" && jQuery.fn.ready && !a.nodeType && a[0] == undefined ) // Safari reports typeof on DOM NodeLists as a function
		return jQuery(document).ready(a);

	// Make sure that a selection was provided
	a = a || document;

	// Watch for when a jQuery object is passed as the selector
	if ( a.jquery )
		return jQuery( jQuery.merge( a, [] ) );

	// Watch for when a jQuery object is passed at the context
	if ( c && c.jquery )
		return jQuery( c ).find(a);

	// If the context is global, return a new object
	if ( window == this )
		return new jQuery(a,c);

	// Handle HTML strings
	if ( typeof a  == "string" ) {
		var m = /^[^<]*(<.+>)[^>]*$/.exec(a);
		if ( m ) a = jQuery.clean( [ m[1] ] );
	}

	// Watch for when an array is passed in
	this.set( a.constructor == Array || a.length && a != window && !a.nodeType && a[0] != undefined && a[0].nodeType ?
		// Assume that it is an array of DOM Elements
		jQuery.merge( a, [] ) :

		// Find the matching elements and save them for later
		jQuery.find( a, c ) );

	return this;
};

// Map over the $ in case of overwrite
if ( typeof $ != "undefined" )
	jQuery._$ = $;
	
// Map the jQuery namespace to the '$' one
var $ = jQuery;

/**
 * This function accepts a string containing a CSS or
 * basic XPath selector which is then used to match a set of elements.
 *
 * The core functionality of jQuery centers around this function.
 * Everything in jQuery is based upon this, or uses this in some way.
 * The most basic use of this function is to pass in an expression
 * (usually consisting of CSS or XPath), which then finds all matching
 * elements.
 *
 * By default, $() looks for DOM elements within the context of the
 * current HTML document.
 *
 * @example $("div > p")
 * @desc This finds all p elements that are children of a div element.
 * @before <p>one</p> <div><p>two</p></div> <p>three</p>
 * @result [ <p>two</p> ]
 *
 * @example $("input:radio", document.forms[0])
 * @desc Searches for all inputs of type radio within the first form in the document
 *
 * @example $("div", xml.responseXML)
 * @desc This finds all div elements within the specified XML document.
 *
 * @name $
 * @param String expr An expression to search with
 * @param Element context (optional) A DOM Element, or Document, representing the base context.
 * @cat Core
 * @type jQuery
 * @see $(Element)
 * @see $(Element<Array>)
 */
 
/**
 * This function accepts a string of raw HTML.
 *
 * The HTML string is different from the traditional selectors in that
 * it creates the DOM elements representing that HTML string, on the fly,
 * to be (assumedly) inserted into the document later.
 *
 * @example $("<div><p>Hello</p></div>").appendTo("#body")
 * @desc Creates a div element (and all of its contents) dynamically, 
 * and appends it to the element with the ID of body. Internally, an
 * element is created and it's innerHTML property set to the given markup.
 * It is therefore both quite flexible and limited. 
 *
 * @name $
 * @param String html A string of HTML to create on the fly.
 * @cat Core
 * @type jQuery
 */

/**
 * Wrap jQuery functionality around a specific DOM Element.
 * This function also accepts XML Documents and Window objects
 * as valid arguments (even though they are not DOM Elements).
 *
 * @example $(document).find("div > p")
 * @before <p>one</p> <div><p>two</p></div> <p>three</p>
 * @result [ <p>two</p> ]
 *
 * @example $(document.body).background( "black" );
 * @desc Sets the background color of the page to black.
 *
 * @name $
 * @param Element elem A DOM element to be encapsulated by a jQuery object.
 * @cat Core
 * @type jQuery
 */

/**
 * Wrap jQuery functionality around a set of DOM Elements.
 *
 * @example $( myForm.elements ).hide()
 * @desc Hides all the input elements within a form
 *
 * @name $
 * @param Array<Element> elems An array of DOM elements to be encapsulated by a jQuery object.
 * @cat Core
 * @type jQuery
 */

/**
 * A shorthand for $(document).ready(), allowing you to bind a function
 * to be executed when the DOM document has finished loading. This function
 * behaves just like $(document).ready(), in that it should be used to wrap
 * all of the other $() operations on your page. While this function is,
 * technically, chainable - there really isn't much use for chaining against it.
 * You can have as many $(document).ready events on your page as you like.
 *
 * @example $(function(){
 *   // Document is ready
 * });
 * @desc Executes the function when the DOM is ready to be used.
 *
 * @name $
 * @param Function fn The function to execute when the DOM is ready.
 * @cat Core
 * @type jQuery
 */

/**
 * A means of creating a cloned copy of a jQuery object. This function
 * copies the set of matched elements from one jQuery object and creates
 * another, new, jQuery object containing the same elements.
 *
 * @example var div = $("div");
 * $( div ).find("p");
 * @desc Locates all p elements with all div elements, without disrupting the original jQuery object contained in 'div' (as would normally be the case if a simple div.find("p") was done).
 *
 * @name $
 * @param jQuery obj The jQuery object to be cloned.
 * @cat Core
 * @type jQuery
 */

jQuery.fn = jQuery.prototype = {
	/**
	 * The current version of jQuery.
	 *
	 * @private
	 * @property
	 * @name jquery
	 * @type String
	 * @cat Core
	 */
	jquery: "@VERSION",

	/**
	 * The number of elements currently matched.
	 *
	 * @example $("img").length;
	 * @before <img src="test1.jpg"/> <img src="test2.jpg"/>
	 * @result 2
	 *
	 * @property
	 * @name length
	 * @type Number
	 * @cat Core
	 */

	/**
	 * The number of elements currently matched.
	 *
	 * @example $("img").size();
	 * @before <img src="test1.jpg"/> <img src="test2.jpg"/>
	 * @result 2
	 *
	 * @name size
	 * @type Number
	 * @cat Core
	 */
	size: function() {
		return this.length;
	},

	/**
	 * Access all matched elements. This serves as a backwards-compatible
	 * way of accessing all matched elements (other than the jQuery object
	 * itself, which is, in fact, an array of elements).
	 *
	 * @example $("img").get();
	 * @before <img src="test1.jpg"/> <img src="test2.jpg"/>
	 * @result [ <img src="test1.jpg"/> <img src="test2.jpg"/> ]
	 *
	 * @name get
	 * @type Array<Element>
	 * @cat Core
	 */

	/**
	 * Access a single matched element. num is used to access the
	 * Nth element matched.
	 *
	 * @example $("img").get(1);
	 * @before <img src="test1.jpg"/> <img src="test2.jpg"/>
	 * @result [ <img src="test1.jpg"/> ]
	 *
	 * @name get
	 * @type Element
	 * @param Number num Access the element in the Nth position.
	 * @cat Core
	 */
	get: function( num ) {
		return num == undefined ?

			// Return a 'clean' array
			jQuery.merge( this, [] ) :

			// Return just the object
			this[num];
	},
	
	/**
	 * Set the jQuery object to an array of elements.
	 *
	 * @example $("img").set([ document.body ]);
	 * @result $("img").set() == [ document.body ]
	 *
	 * @private
	 * @name set
	 * @type jQuery
	 * @param Elements elems An array of elements
	 * @cat Core
	 */
	set: function( array ) {
		// Use a tricky hack to make the jQuery object
		// look and feel like an array
		this.length = 0;
		[].push.apply( this, array );
		return this;
	},

	/**
	 * Execute a function within the context of every matched element.
	 * This means that every time the passed-in function is executed
	 * (which is once for every element matched) the 'this' keyword
	 * points to the specific element.
	 *
	 * Additionally, the function, when executed, is passed a single
	 * argument representing the position of the element in the matched
	 * set.
	 *
	 * @example $("img").each(function(i){
	 *   this.src = "test" + i + ".jpg";
	 * });
	 * @before <img/> <img/>
	 * @result <img src="test0.jpg"/> <img src="test1.jpg"/>
	 * @desc Iterates over two images and sets their src property
	 *
	 * @name each
	 * @type jQuery
	 * @param Function fn A function to execute
	 * @cat Core
	 */
	each: function( fn, args ) {
		return jQuery.each( this, fn, args );
	},

	/**
	 * Searches every matched element for the object and returns
	 * the index of the element, if found, starting with zero. 
	 * Returns -1 if the object wasn't found.
	 *
	 * @example $("*").index(document.getElementById('foobar')) 
	 * @before <div id="foobar"></div><b></b><span id="foo"></span>
	 * @result 0
	 *
	 * @example $("*").index(document.getElementById('foo')) 
	 * @before <div id="foobar"></div><b></b><span id="foo"></span>
	 * @result 2
	 *
	 * @example $("*").index(document.getElementById('bar')) 
	 * @before <div id="foobar"></div><b></b><span id="foo"></span>
	 * @result -1
	 *
	 * @name index
	 * @type Number
	 * @param Object obj Object to search for
	 * @cat Core
	 */
	index: function( obj ) {
		var pos = -1;
		this.each(function(i){
			if ( this == obj ) pos = i;
		});
		return pos;
	},

	/**
	 * Access a property on the first matched element.
	 * This method makes it easy to retrieve a property value
	 * from the first matched element.
	 *
	 * @example $("img").attr("src");
	 * @before <img src="test.jpg"/>
	 * @result test.jpg
	 *
	 * @name attr
	 * @type Object
	 * @param String name The name of the property to access.
	 * @cat DOM
	 */

	/**
	 * Set a hash of key/value object properties to all matched elements.
	 * This serves as the best way to set a large number of properties
	 * on all matched elements.
	 *
	 * @example $("img").attr({ src: "test.jpg", alt: "Test Image" });
	 * @before <img/>
	 * @result <img src="test.jpg" alt="Test Image"/>
	 *
	 * @name attr
	 * @type jQuery
	 * @param Hash prop A set of key/value pairs to set as object properties.
	 * @cat DOM
	 */

	/**
	 * Set a single property to a value, on all matched elements.
	 *
	 * Note that you can't set the name property of input elements in IE.
	 * Use $(html) or $().append(html) or $().html(html) to create elements
	 * on the fly including the name property.
	 *
	 * @example $("img").attr("src","test.jpg");
	 * @before <img/>
	 * @result <img src="test.jpg"/>
	 *
	 * @name attr
	 * @type jQuery
	 * @param String key The name of the property to set.
	 * @param Object value The value to set the property to.
	 * @cat DOM
	 */
	attr: function( key, value, type ) {
		// Check to see if we're setting style values
		return key.constructor != String || value != undefined ?
			this.each(function(){
				// See if we're setting a hash of styles
				if ( value == undefined )
					// Set all the styles
					for ( var prop in key )
						jQuery.attr(
							type ? this.style : this,
							prop, key[prop]
						);

				// See if we're setting a single key/value style
				else
					jQuery.attr(
						type ? this.style : this,
						key, value
					);
			}) :

			// Look for the case where we're accessing a style value
			jQuery[ type || "attr" ]( this[0], key );
	},

	/**
	 * Access a style property on the first matched element.
	 * This method makes it easy to retrieve a style property value
	 * from the first matched element.
	 *
	 * @example $("p").css("color");
	 * @before <p style="color:red;">Test Paragraph.</p>
	 * @result red
	 * @desc Retrieves the color style of the first paragraph
	 *
	 * @example $("p").css("fontWeight");
	 * @before <p style="font-weight: bold;">Test Paragraph.</p>
	 * @result bold
	 * @desc Retrieves the font-weight style of the first paragraph.
	 * Note that for all style properties with a dash (like 'font-weight'), you have to
	 * write it in camelCase. In other words: Every time you have a '-' in a 
	 * property, remove it and replace the next character with an uppercase 
	 * representation of itself. Eg. fontWeight, fontSize, fontFamily, borderWidth,
	 * borderStyle, borderBottomWidth etc.
	 *
	 * @name css
	 * @type Object
	 * @param String name The name of the property to access.
	 * @cat CSS
	 */

	/**
	 * Set a hash of key/value style properties to all matched elements.
	 * This serves as the best way to set a large number of style properties
	 * on all matched elements.
	 *
	 * @example $("p").css({ color: "red", background: "blue" });
	 * @before <p>Test Paragraph.</p>
	 * @result <p style="color:red; background:blue;">Test Paragraph.</p>
	 *
	 * @name css
	 * @type jQuery
	 * @param Hash prop A set of key/value pairs to set as style properties.
	 * @cat CSS
	 */

	/**
	 * Set a single style property to a value, on all matched elements.
	 *
	 * @example $("p").css("color","red");
	 * @before <p>Test Paragraph.</p>
	 * @result <p style="color:red;">Test Paragraph.</p>
	 * @desc Changes the color of all paragraphs to red
	 *
	 * @name css
	 * @type jQuery
	 * @param String key The name of the property to set.
	 * @param Object value The value to set the property to.
	 * @cat CSS
	 */
	css: function( key, value ) {
		return this.attr( key, value, "curCSS" );
	},

	/**
	 * Retrieve the text contents of all matched elements. The result is
	 * a string that contains the combined text contents of all matched
	 * elements. This method works on both HTML and XML documents.
	 *
	 * @example $("p").text();
	 * @before <p>Test Paragraph.</p>
	 * @result Test Paragraph.
	 *
	 * @name text
	 * @type String
	 * @cat DOM
	 */
	text: function(e) {
		e = e || this;
		var t = "";
		for ( var j = 0; j < e.length; j++ ) {
			var r = e[j].childNodes;
			for ( var i = 0; i < r.length; i++ )
				if ( r[i].nodeType != 8 )
					t += r[i].nodeType != 1 ?
						r[i].nodeValue : jQuery.fn.text([ r[i] ]);
		}
		return t;
	},

	/**
	 * Wrap all matched elements with a structure of other elements.
	 * This wrapping process is most useful for injecting additional
	 * stucture into a document, without ruining the original semantic
	 * qualities of a document.
	 *
	 * This works by going through the first element
	 * provided (which is generated, on the fly, from the provided HTML)
	 * and finds the deepest ancestor element within its
	 * structure - it is that element that will en-wrap everything else.
	 *
	 * This does not work with elements that contain text. Any necessary text
	 * must be added after the wrapping is done.
	 *
	 * @example $("p").wrap("<div class='wrap'></div>");
	 * @before <p>Test Paragraph.</p>
	 * @result <div class='wrap'><p>Test Paragraph.</p></div>
	 * 
	 * @name wrap
	 * @type jQuery
	 * @param String html A string of HTML, that will be created on the fly and wrapped around the target.
	 * @cat DOM/Manipulation
	 */

	/**
	 * Wrap all matched elements with a structure of other elements.
	 * This wrapping process is most useful for injecting additional
	 * stucture into a document, without ruining the original semantic
	 * qualities of a document.
	 *
	 * This works by going through the first element
	 * provided and finding the deepest ancestor element within its
	 * structure - it is that element that will en-wrap everything else.
	 *
 	 * This does not work with elements that contain text. Any necessary text
	 * must be added after the wrapping is done.
	 *
	 * @example $("p").wrap( document.getElementById('content') );
	 * @before <p>Test Paragraph.</p><div id="content"></div>
	 * @result <div id="content"><p>Test Paragraph.</p></div>
	 *
	 * @name wrap
	 * @type jQuery
	 * @param Element elem A DOM element that will be wrapped.
	 * @cat DOM/Manipulation
	 */
	wrap: function() {
		// The elements to wrap the target around
		var a = jQuery.clean(arguments);

		// Wrap each of the matched elements individually
		return this.each(function(){
			// Clone the structure that we're using to wrap
			var b = a[0].cloneNode(true);

			// Insert it before the element to be wrapped
			this.parentNode.insertBefore( b, this );

			// Find the deepest point in the wrap structure
			while ( b.firstChild )
				b = b.firstChild;

			// Move the matched element to within the wrap structure
			b.appendChild( this );
		});
	},

	/**
	 * Append any number of elements to the inside of every matched elements,
	 * generated from the provided HTML.
	 * This operation is similar to doing an appendChild to all the
	 * specified elements, adding them into the document.
	 *
	 * @example $("p").append("<b>Hello</b>");
	 * @before <p>I would like to say: </p>
	 * @result <p>I would like to say: <b>Hello</b></p>
	 *
	 * @name append
	 * @type jQuery
	 * @param String html A string of HTML, that will be created on the fly and appended to the target.
	 * @cat DOM/Manipulation
	 */

	/**
	 * Append an element to the inside of all matched elements.
	 * This operation is similar to doing an appendChild to all the
	 * specified elements, adding them into the document.
	 *
	 * @example $("p").append( $("#foo")[0] );
	 * @before <p>I would like to say: </p><b id="foo">Hello</b>
	 * @result <p>I would like to say: <b id="foo">Hello</b></p>
	 *
	 * @name append
	 * @type jQuery
	 * @param Element elem A DOM element that will be appended.
	 * @cat DOM/Manipulation
	 */

	/**
	 * Append any number of elements to the inside of all matched elements.
	 * This operation is similar to doing an appendChild to all the
	 * specified elements, adding them into the document.
	 *
	 * @example $("p").append( $("b") );
	 * @before <p>I would like to say: </p><b>Hello</b>
	 * @result <p>I would like to say: <b>Hello</b></p>
	 *
	 * @name append
	 * @type jQuery
	 * @param Array<Element> elems An array of elements, all of which will be appended.
	 * @cat DOM/Manipulation
	 */
	append: function() {
		return this.domManip(arguments, true, 1, function(a){
			this.appendChild( a );
		});
	},

	/**
	 * Prepend any number of elements to the inside of every matched elements,
	 * generated from the provided HTML.
	 * This operation is the best way to insert dynamically created elements
	 * inside, at the beginning, of all the matched element.
	 *
	 * @example $("p").prepend("<b>Hello</b>");
	 * @before <p>I would like to say: </p>
	 * @result <p><b>Hello</b>I would like to say: </p>
	 *
	 * @name prepend
	 * @type jQuery
	 * @param String html A string of HTML, that will be created on the fly and appended to the target.
	 * @cat DOM/Manipulation
	 */

	/**
	 * Prepend an element to the inside of all matched elements.
	 * This operation is the best way to insert an element inside, at the
	 * beginning, of all the matched element.
	 *
	 * @example $("p").prepend( $("#foo")[0] );
	 * @before <p>I would like to say: </p><b id="foo">Hello</b>
	 * @result <p><b id="foo">Hello</b>I would like to say: </p>
	 *	 
	 * @name prepend
	 * @type jQuery
	 * @param Element elem A DOM element that will be appended.
	 * @cat DOM/Manipulation
	 */

	/**
	 * Prepend any number of elements to the inside of all matched elements.
	 * This operation is the best way to insert a set of elements inside, at the
	 * beginning, of all the matched element.
	 *
	 * @example $("p").prepend( $("b") );
	 * @before <p>I would like to say: </p><b>Hello</b>
	 * @result <p><b>Hello</b>I would like to say: </p>
	 *
	 * @name prepend
	 * @type jQuery
	 * @param Array<Element> elems An array of elements, all of which will be appended.
	 * @cat DOM/Manipulation
	 */
	prepend: function() {
		return this.domManip(arguments, true, -1, function(a){
			this.insertBefore( a, this.firstChild );
		});
	},

	/**
	 * Insert any number of dynamically generated elements before each of the
	 * matched elements.
	 *
	 * @example $("p").before("<b>Hello</b>");
	 * @before <p>I would like to say: </p>
	 * @result <b>Hello</b><p>I would like to say: </p>
	 *
	 * @name before
	 * @type jQuery
	 * @param String html A string of HTML, that will be created on the fly and appended to the target.
	 * @cat DOM/Manipulation
	 */

	/**
	 * Insert an element before each of the matched elements.
	 *
	 * @example $("p").before( $("#foo")[0] );
	 * @before <p>I would like to say: </p><b id="foo">Hello</b>
	 * @result <b id="foo">Hello</b><p>I would like to say: </p>
	 *
	 * @name before
	 * @type jQuery
	 * @param Element elem A DOM element that will be appended.
	 * @cat DOM/Manipulation
	 */

	/**
	 * Insert any number of elements before each of the matched elements.
	 *
	 * @example $("p").before( $("b") );
	 * @before <p>I would like to say: </p><b>Hello</b>
	 * @result <b>Hello</b><p>I would like to say: </p>
	 *
	 * @name before
	 * @type jQuery
	 * @param Array<Element> elems An array of elements, all of which will be appended.
	 * @cat DOM/Manipulation
	 */
	before: function() {
		return this.domManip(arguments, false, 1, function(a){
			this.parentNode.insertBefore( a, this );
		});
	},

	/**
	 * Insert any number of dynamically generated elements after each of the
	 * matched elements.
	 *
	 * @example $("p").after("<b>Hello</b>");
	 * @before <p>I would like to say: </p>
	 * @result <p>I would like to say: </p><b>Hello</b>
	 *
	 * @name after
	 * @type jQuery
	 * @param String html A string of HTML, that will be created on the fly and appended to the target.
	 * @cat DOM/Manipulation
	 */

	/**
	 * Insert an element after each of the matched elements.
	 *
	 * @example $("p").after( $("#foo")[0] );
	 * @before <b id="foo">Hello</b><p>I would like to say: </p>
	 * @result <p>I would like to say: </p><b id="foo">Hello</b>
	 *
	 * @name after
	 * @type jQuery
	 * @param Element elem A DOM element that will be appended.
	 * @cat DOM/Manipulation
	 */

	/**
	 * Insert any number of elements after each of the matched elements.
	 *
	 * @example $("p").after( $("b") );
	 * @before <b>Hello</b><p>I would like to say: </p>
	 * @result <p>I would like to say: </p><b>Hello</b>
	 *
	 * @name after
	 * @type jQuery
	 * @param Array<Element> elems An array of elements, all of which will be appended.
	 * @cat DOM/Manipulation
	 */
	after: function() {
		return this.domManip(arguments, false, -1, function(a){
			this.parentNode.insertBefore( a, this.nextSibling );
		});
	},

	/**
	 * End the most recent 'destructive' operation, reverting the list of matched elements
	 * back to its previous state. After an end operation, the list of matched elements will
	 * revert to the last state of matched elements.
	 *
	 * @example $("p").find("span").end();
	 * @before <p><span>Hello</span>, how are you?</p>
	 * @result $("p").find("span").end() == [ <p>...</p> ]
	 *
	 * @name end
	 * @type jQuery
	 * @cat DOM/Traversing
	 */
	end: function() {
		if( !(this.stack && this.stack.length) )
			return this;
		return this.set( this.stack.pop() );
	},

	/**
	 * Searches for all elements that match the specified expression.
	 * This method is the optimal way of finding additional descendant
	 * elements with which to process.
	 *
	 * All searching is done using a jQuery expression. The expression can be
	 * written using CSS 1-3 Selector syntax, or basic XPath.
	 *
	 * @example $("p").find("span");
	 * @before <p><span>Hello</span>, how are you?</p>
	 * @result $("p").find("span") == [ <span>Hello</span> ]
	 *
	 * @name find
	 * @type jQuery
	 * @param String expr An expression to search with.
	 * @cat DOM/Traversing
	 */
	find: function(t) {
		return this.pushStack( jQuery.map( this, function(a){
			return jQuery.find(t,a);
		}));
	},

	/**
	 * Create cloned copies of all matched DOM Elements. This does
	 * not create a cloned copy of this particular jQuery object,
	 * instead it creates duplicate copies of all DOM Elements.
	 * This is useful for moving copies of the elements to another
	 * location in the DOM.
	 *
	 * @example $("b").clone().prependTo("p");
	 * @before <b>Hello</b><p>, how are you?</p>
	 * @result <b>Hello</b><p><b>Hello</b>, how are you?</p>
	 *
	 * @name clone
	 * @type jQuery
	 * @cat DOM/Manipulation
	 */
	clone: function(deep) {
		return this.pushStack( jQuery.map( this, function(a){
			return a.cloneNode( deep != undefined ? deep : true );
		}));
	},

	/**
	 * Removes all elements from the set of matched elements that do not
	 * match the specified expression. This method is used to narrow down
	 * the results of a search.
	 *
	 * All searching is done using a jQuery expression. The expression
	 * can be written using CSS 1-3 Selector syntax, or basic XPath.
	 *
	 * @example $("p").filter(".selected")
	 * @before <p class="selected">Hello</p><p>How are you?</p>
	 * @result $("p").filter(".selected") == [ <p class="selected">Hello</p> ]
	 *
	 * @name filter
	 * @type jQuery
	 * @param String expr An expression to search with.
	 * @cat DOM/Traversing
	 */

	/**
	 * Removes all elements from the set of matched elements that do not
	 * match at least one of the expressions passed to the function. This
	 * method is used when you want to filter the set of matched elements
	 * through more than one expression.
	 *
	 * Elements will be retained in the jQuery object if they match at
	 * least one of the expressions passed.
	 *
	 * @example $("p").filter([".selected", ":first"])
	 * @before <p>Hello</p><p>Hello Again</p><p class="selected">And Again</p>
	 * @result $("p").filter([".selected", ":first"]) == [ <p>Hello</p>, <p class="selected">And Again</p> ]
	 *
	 * @name filter
	 * @type jQuery
	 * @param Array<String> exprs A set of expressions to evaluate against
	 * @cat DOM/Traversing
	 */
	filter: function(t) {
		return this.pushStack(
			t.constructor == Array &&
			jQuery.map(this,function(a){
				for ( var i = 0; i < t.length; i++ )
					if ( jQuery.filter(t[i],[a]).r.length )
						return a;
				return null;
			}) ||

			t.constructor == Boolean &&
			( t ? this.get() : [] ) ||

			typeof t == "function" &&
			jQuery.grep( this, t ) ||

			jQuery.filter(t,this).r );
	},

	/**
	 * Removes the specified Element from the set of matched elements. This
	 * method is used to remove a single Element from a jQuery object.
	 *
	 * @example $("p").not( document.getElementById("selected") )
	 * @before <p>Hello</p><p id="selected">Hello Again</p>
	 * @result [ <p>Hello</p> ]
	 *
	 * @name not
	 * @type jQuery
	 * @param Element el An element to remove from the set
	 * @cat DOM/Traversing
	 */

	/**
	 * Removes elements matching the specified expression from the set
	 * of matched elements. This method is used to remove one or more
	 * elements from a jQuery object.
	 *
	 * @example $("p").not("#selected")
	 * @before <p>Hello</p><p id="selected">Hello Again</p>
	 * @result [ <p>Hello</p> ]
	 *
	 * @name not
	 * @type jQuery
	 * @param String expr An expression with which to remove matching elements
	 * @cat DOM/Traversing
	 */
	not: function(t) {
		return this.pushStack( typeof t == "string" ?
			jQuery.filter(t,this,false).r :
			jQuery.grep(this,function(a){ return a != t; }) );
	},

	/**
	 * Adds the elements matched by the expression to the jQuery object. This
	 * can be used to concatenate the result sets of two expressions.
	 *
	 * @example $("p").add("span")
	 * @before <p>Hello</p><p><span>Hello Again</span></p>
	 * @result [ <p>Hello</p>, <span>Hello Again</span> ]
	 *
	 * @name add
	 * @type jQuery
	 * @param String expr An expression whose matched elements are added
	 * @cat DOM/Traversing
	 */

	/**
	 * Adds each of the Elements in the array to the set of matched elements.
	 * This is used to add a set of Elements to a jQuery object.
	 *
	 * @example $("p").add([document.getElementById("a"), document.getElementById("b")])
	 * @before <p>Hello</p><p><span id="a">Hello Again</span><span id="b">And Again</span></p>
	 * @result [ <p>Hello</p>, <span id="a">Hello Again</span>, <span id="b">And Again</span> ]
	 *
	 * @name add
	 * @type jQuery
	 * @param Array<Element> els An array of Elements to add
	 * @cat DOM/Traversing
	 */

	/**
	 * Adds a single Element to the set of matched elements. This is used to
	 * add a single Element to a jQuery object.
	 *
	 * @example $("p").add( document.getElementById("a") )
	 * @before <p>Hello</p><p><span id="a">Hello Again</span></p>
	 * @result [ <p>Hello</p>, <span id="a">Hello Again</span> ]
	 *
	 * @name add
	 * @type jQuery
	 * @param Element el An Element to add
	 * @cat DOM/Traversing
	 */
	add: function(t) {
		return this.pushStack( jQuery.merge( this, typeof t == "string" ?
			jQuery.find(t) : t.constructor == Array ? t : [t] ) );
	},

	/**
	 * Checks the current selection against an expression and returns true,
	 * if at least one element of the selection fits the given expression.
	 * Does return false, if no element fits or the expression is not valid.
	 *
	 * @example $("input[@type='checkbox']").parent().is("form")
	 * @before <form><input type="checkbox" /></form>
	 * @result true
	 * @desc Returns true, because the parent of the input is a form element
	 * 
	 * @example $("input[@type='checkbox']").parent().is("form")
	 * @before <form><p><input type="checkbox" /></p></form>
	 * @result false
	 * @desc Returns false, because the parent of the input is a p element
	 *
	 * @example $("form").is(null)
	 * @before <form></form>
	 * @result false
	 * @desc An invalid expression always returns false.
	 *
	 * @name is
	 * @type Boolean
	 * @param String expr The expression with which to filter
	 * @cat DOM/Traversing
	 */
	is: function(expr) {
		return expr ? jQuery.filter(expr,this).r.length > 0 : false;
	},
	
	/**
	 * @private
	 * @name domManip
	 * @param Array args
	 * @param Boolean table
	 * @param Number dir
	 * @param Function fn The function doing the DOM manipulation.
	 * @type jQuery
	 * @cat Core
	 */
	domManip: function(args, table, dir, fn){
		var clone = this.size() > 1;
		var a = jQuery.clean(args);

		return this.each(function(){
			var obj = this;

			if ( table && this.nodeName.toUpperCase() == "TABLE" && a[0].nodeName.toUpperCase() != "THEAD" ) {
				var tbody = this.getElementsByTagName("tbody");

				if ( !tbody.length ) {
					obj = document.createElement("tbody");
					this.appendChild( obj );
				} else
					obj = tbody[0];
			}

			for ( var i = ( dir < 0 ? a.length - 1 : 0 );
				i != ( dir < 0 ? dir : a.length ); i += dir ) {
					fn.apply( obj, [ clone ? a[i].cloneNode(true) : a[i] ] );
			}
		});
	},

	/**
	 *
	 *
	 * @private
	 * @name pushStack
	 * @param Array a
	 * @param Array args
	 * @type jQuery
	 * @cat Core
	 */
	pushStack: function(a) {
		if ( !this.stack )
			this.stack = [];
		this.stack.push( this.get() );
		return this.set( a );
	}
};

/**
 * Extends the jQuery object itself. Can be used to add functions into
 * the jQuery namespace and to add plugin methods (plugins).
 * 
 * @example jQuery.fn.extend({
 *   check: function() {
 *     return this.each(function() { this.checked = true; });
 *   ),
 *   uncheck: function() {
 *     return this.each(function() { this.checked = false; });
 *   }
 * });
 * $("input[@type=checkbox]").check();
 * $("input[@type=radio]").uncheck();
 * @desc Adds two plugin methods.
 *
 * @example jQuery.extend({
 *   min: function(a, b) { return a < b ? a : b; },
 *   max: function(a, b) { return a > b ? a : b; }
 * });
 * @desc Adds two functions into the jQuery namespace
 *
 * @name $.extend
 * @param Object prop The object that will be merged into the jQuery object
 * @type Object
 * @cat Core
 */

/**
 * Extend one object with one or more others, returning the original,
 * modified, object. This is a great utility for simple inheritance.
 * 
 * @example var settings = { validate: false, limit: 5, name: "foo" };
 * var options = { validate: true, name: "bar" };
 * jQuery.extend(settings, options);
 * @result settings == { validate: true, limit: 5, name: "bar" }
 * @desc Merge settings and options, modifying settings
 *
 * @example var defaults = { validate: false, limit: 5, name: "foo" };
 * var options = { validate: true, name: "bar" };
 * var settings = jQuery.extend({}, defaults, options);
 * @result settings == { validate: true, limit: 5, name: "bar" }
 * @desc Merge defaults and options, without modifying the defaults
 *
 * @name $.extend
 * @param Object target The object to extend
 * @param Object prop1 The object that will be merged into the first.
 * @param Object propN (optional) More objects to merge into the first
 * @type Object
 * @cat Javascript
 */
jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0],
		a = 1;

	// extend jQuery itself if only one argument is passed
	if ( arguments.length == 1 ) {
		target = this;
		a = 0;
	}
	var prop;
	while (prop = arguments[a++])
		// Extend the base object
		for ( var i in prop ) target[i] = prop[i];

	// Return the modified object
	return target;
};

jQuery.extend({
	/**
	 * @private
	 * @name init
	 * @type undefined
	 * @cat Core
	 */
	init: function(){
		jQuery.initDone = true;

		jQuery.each( jQuery.macros.axis, function(i,n){
			jQuery.fn[ i ] = function(a) {
				var ret = jQuery.map(this,n);
				if ( a && typeof a == "string" )
					ret = jQuery.filter(a,ret).r;
				return this.pushStack( ret, arguments );
			};
		});

		jQuery.each( jQuery.macros.to, function(i,n){
			jQuery.fn[ i ] = function(){
				var a = arguments;
				return this.each(function(){
					for ( var j = 0; j < a.length; j++ )
						jQuery(a[j])[n]( this );
				});
			};
		});

		jQuery.each( jQuery.macros.each, function(i,n){
			jQuery.fn[ i ] = function() {
				return this.each( n, arguments );
			};
		});

		jQuery.each( jQuery.macros.filter, function(i,n){
			jQuery.fn[ n ] = function(num,fn) {
				return this.filter( ":" + n + "(" + num + ")", fn );
			};
		});

		jQuery.each( jQuery.macros.attr, function(i,n){
			n = n || i;
			jQuery.fn[ i ] = function(h) {
				return h == undefined ?
					this.length ? this[0][n] : null :
					this.attr( n, h );
			};
		});

		jQuery.each( jQuery.macros.css, function(i,n){
			jQuery.fn[ n ] = function(h) {
				return h == undefined ?
					( this.length ? jQuery.css( this[0], n ) : null ) :
					this.css( n, h );
			};
		});

	},

	/**
	 * A generic iterator function, which can be used to seemlessly
	 * iterate over both objects and arrays. This function is not the same
	 * as $().each() - which is used to iterate, exclusively, over a jQuery
	 * object. This function can be used to iterate over anything.
	 *
	 * @example $.each( [0,1,2], function(i){
	 *   alert( "Item #" + i + ": " + this );
	 * });
	 * @desc This is an example of iterating over the items in an array, accessing both the current item and its index.
	 *
	 * @example $.each( { name: "John", lang: "JS" }, function(i){
	 *   alert( "Name: " + i + ", Value: " + this );
	 * });
	 * @desc This is an example of iterating over the properties in an Object, accessing both the current item and its key.
	 *
	 * @name $.each
	 * @param Object obj The object, or array, to iterate over.
	 * @param Function fn The function that will be executed on every object.
	 * @type Object
	 * @cat Javascript
	 */
	// args is for internal usage only
	each: function( obj, fn, args ) {
		if ( obj.length == undefined )
			for ( var i in obj )
				fn.apply( obj[i], args || [i, obj[i]] );
		else
			for ( var i = 0; i < obj.length; i++ )
				if ( fn.apply( obj[i], args || [i, obj[i]] ) === false ) break;
		return obj;
	},

	className: {
		add: function(o,c){
			if (jQuery.className.has(o,c)) return;
			o.className += ( o.className ? " " : "" ) + c;
		},
		remove: function(o,c){
			if( !c ) {
				o.className = "";
			} else {
				var classes = o.className.split(" ");
				for(var i=0; i<classes.length; i++) {
					if(classes[i] == c) {
						classes.splice(i, 1);
						break;
					}
				}
				o.className = classes.join(' ');
			}
		},
		has: function(e,a) {
			if ( e.className != undefined )
				e = e.className;
			return new RegExp("(^|\\s)" + a + "(\\s|$)").test(e);
		}
	},

	/**
	 * Swap in/out style options.
	 * @private
	 */
	swap: function(e,o,f) {
		for ( var i in o ) {
			e.style["old"+i] = e.style[i];
			e.style[i] = o[i];
		}
		f.apply( e, [] );
		for ( var i in o )
			e.style[i] = e.style["old"+i];
	},

	css: function(e,p) {
		if ( p == "height" || p == "width" ) {
			var old = {}, oHeight, oWidth, d = ["Top","Bottom","Right","Left"];

			for ( var i=0; i<d.length; i++ ) {
				old["padding" + d[i]] = 0;
				old["border" + d[i] + "Width"] = 0;
			}

			jQuery.swap( e, old, function() {
				if (jQuery.css(e,"display") != "none") {
					oHeight = e.offsetHeight;
					oWidth = e.offsetWidth;
				} else {
					e = jQuery(e.cloneNode(true))
						.find(":radio").removeAttr("checked").end()
						.css({
							visibility: "hidden", position: "absolute", display: "block", right: "0", left: "0"
						}).appendTo(e.parentNode)[0];

					var parPos = jQuery.css(e.parentNode,"position");
					if ( parPos == "" || parPos == "static" )
						e.parentNode.style.position = "relative";

					oHeight = e.clientHeight;
					oWidth = e.clientWidth;

					if ( parPos == "" || parPos == "static" )
						e.parentNode.style.position = "static";

					e.parentNode.removeChild(e);
				}
			});

			return p == "height" ? oHeight : oWidth;
		}

		return jQuery.curCSS( e, p );
	},

	curCSS: function(elem, prop, force) {
		var ret;
		
		if (prop == 'opacity' && jQuery.browser.msie)
			return jQuery.attr(elem.style, 'opacity');
			
		if (prop == "float" || prop == "cssFloat")
		    prop = jQuery.browser.msie ? "styleFloat" : "cssFloat";

		if (!force && elem.style[prop]) {

			ret = elem.style[prop];

		} else if (document.defaultView && document.defaultView.getComputedStyle) {

			if (prop == "cssFloat" || prop == "styleFloat")
				prop = "float";

			prop = prop.replace(/([A-Z])/g,"-$1").toLowerCase();
			var cur = document.defaultView.getComputedStyle(elem, null);

			if ( cur )
				ret = cur.getPropertyValue(prop);
			else if ( prop == 'display' )
				ret = 'none';
			else
				jQuery.swap(elem, { display: 'block' }, function() {
				    var c = document.defaultView.getComputedStyle(this, '');
				    ret = c && c.getPropertyValue(prop) || '';
				});

		} else if (elem.currentStyle) {

			var newProp = prop.replace(/\-(\w)/g,function(m,c){return c.toUpperCase();});
			ret = elem.currentStyle[prop] || elem.currentStyle[newProp];
			
		}

		return ret;
	},
	
	clean: function(a) {
		var r = [];
		for ( var i = 0; i < a.length; i++ ) {
			var arg = a[i];
			if ( typeof arg == "string" ) { // Convert html string into DOM nodes
				// Trim whitespace, otherwise indexOf won't work as expected
				var s = jQuery.trim(arg), div = document.createElement("div"), wrap = [0,"",""];

				if ( !s.indexOf("<opt") ) // option or optgroup
					wrap = [1, "<select>", "</select>"];
				else if ( !s.indexOf("<thead") || !s.indexOf("<tbody") )
					wrap = [1, "<table>", "</table>"];
				else if ( !s.indexOf("<tr") )
					wrap = [2, "<table>", "</table>"];	// tbody auto-inserted
				else if ( !s.indexOf("<td") || !s.indexOf("<th") )
					wrap = [3, "<table><tbody><tr>", "</tr></tbody></table>"];

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + s + wrap[2];
				while ( wrap[0]-- ) div = div.firstChild;
				arg = div.childNodes;
			} 
			
			
			if ( arg.length != undefined && ( (jQuery.browser.safari && typeof arg == 'function') || !arg.nodeType ) ) // Safari reports typeof on a DOM NodeList to be a function
				for ( var n = 0; n < arg.length; n++ ) // Handles Array, jQuery, DOM NodeList collections
					r.push(arg[n]);
			else
				r.push(	arg.nodeType ? arg : document.createTextNode(arg.toString()) );
		}

		return r;
	},

	expr: {
		"": "m[2]== '*'||a.nodeName.toUpperCase()==m[2].toUpperCase()",
		"#": "a.getAttribute('id')&&a.getAttribute('id')==m[2]",
		":": {
			// Position Checks
			lt: "i<m[3]-0",
			gt: "i>m[3]-0",
			nth: "m[3]-0==i",
			eq: "m[3]-0==i",
			first: "i==0",
			last: "i==r.length-1",
			even: "i%2==0",
			odd: "i%2",

			// Child Checks
			"nth-child": "jQuery.sibling(a,m[3]).cur",
			"first-child": "jQuery.sibling(a,0).cur",
			"last-child": "jQuery.sibling(a,0).last",
			"only-child": "jQuery.sibling(a).length==1",

			// Parent Checks
			parent: "a.childNodes.length",
			empty: "!a.childNodes.length",

			// Text Check
			contains: "jQuery.fn.text.apply([a]).indexOf(m[3])>=0",

			// Visibility
			visible: "a.type!='hidden'&&jQuery.css(a,'display')!='none'&&jQuery.css(a,'visibility')!='hidden'",
			hidden: "a.type=='hidden'||jQuery.css(a,'display')=='none'||jQuery.css(a,'visibility')=='hidden'",

			// Form attributes
			enabled: "!a.disabled",
			disabled: "a.disabled",
			checked: "a.checked",
			selected: "a.selected || jQuery.attr(a, 'selected')",

			// Form elements
			text: "a.type=='text'",
			radio: "a.type=='radio'",
			checkbox: "a.type=='checkbox'",
			file: "a.type=='file'",
			password: "a.type=='password'",
			submit: "a.type=='submit'",
			image: "a.type=='image'",
			reset: "a.type=='reset'",
			button: "a.type=='button'",
			input: "/input|select|textarea|button/i.test(a.nodeName)"
		},
		".": "jQuery.className.has(a,m[2])",
		"@": {
			"=": "z==m[4]",
			"!=": "z!=m[4]",
			"^=": "z && !z.indexOf(m[4])",
			"$=": "z && z.substr(z.length - m[4].length,m[4].length)==m[4]",
			"*=": "z && z.indexOf(m[4])>=0",
			"": "z"
		},
		"[": "jQuery.find(m[2],a).length"
	},

	token: [
		"\\.\\.|/\\.\\.", "a.parentNode",
		">|/", "jQuery.sibling(a.firstChild)",
		"\\+", "jQuery.sibling(a).next",
		"~", function(a){
			var s = jQuery.sibling(a);
			return s.n >= 0 ? s.slice(s.n+1) : [];
		}
	],

	/**
	 * @name $.find
	 * @type Array<Element>
	 * @private
	 * @cat Core
	 */
	find: function( t, context ) {
		// Make sure that the context is a DOM Element
		if ( context && context.nodeType == undefined )
			context = null;

		// Set the correct context (if none is provided)
		context = context || document;

		if ( t.constructor != String ) return [t];

		if ( !t.indexOf("//") ) {
			context = context.documentElement;
			t = t.substr(2,t.length);
		} else if ( !t.indexOf("/") ) {
			context = context.documentElement;
			t = t.substr(1,t.length);
			// FIX Assume the root element is right :(
			if ( t.indexOf("/") >= 1 )
				t = t.substr(t.indexOf("/"),t.length);
		}

		var ret = [context];
		var done = [];
		var last = null;

		while ( t.length > 0 && last != t ) {
			var r = [];
			last = t;

			t = jQuery.trim(t).replace( /^\/\//i, "" );

			var foundToken = false;

			for ( var i = 0; i < jQuery.token.length; i += 2 ) {
				if ( foundToken ) continue;

				var re = new RegExp("^(" + jQuery.token[i] + ")");
				var m = re.exec(t);

				if ( m ) {
					r = ret = jQuery.map( ret, jQuery.token[i+1] );
					t = jQuery.trim( t.replace( re, "" ) );
					foundToken = true;
				}
			}

			if ( !foundToken ) {
				if ( !t.indexOf(",") || !t.indexOf("|") ) {
					if ( ret[0] == context ) ret.shift();
					done = jQuery.merge( done, ret );
					r = ret = [context];
					t = " " + t.substr(1,t.length);
				} else {
					var re2 = /^([#.]?)([a-z0-9\\*_-]*)/i;
					var m = re2.exec(t);

					if ( m[1] == "#" ) {
						// Ummm, should make this work in all XML docs
						var oid = document.getElementById(m[2]);
						r = ret = oid ? [oid] : [];
						t = t.replace( re2, "" );
					} else {
						if ( !m[2] || m[1] == "." ) m[2] = "*";

						for ( var i = 0; i < ret.length; i++ )
							r = jQuery.merge( r,
								m[2] == "*" ?
									jQuery.getAll(ret[i]) :
									ret[i].getElementsByTagName(m[2])
							);
					}
				}

			}

			if ( t ) {
				var val = jQuery.filter(t,r);
				ret = r = val.r;
				t = jQuery.trim(val.t);
			}
		}

		if ( ret && ret[0] == context ) ret.shift();
		done = jQuery.merge( done, ret );

		return done;
	},

	getAll: function(o,r) {
		r = r || [];
		var s = o.childNodes;
		for ( var i = 0; i < s.length; i++ )
			if ( s[i].nodeType == 1 ) {
				r.push( s[i] );
				jQuery.getAll( s[i], r );
			}
		return r;
	},

	attr: function(elem, name, value){
		var fix = {
			"for": "htmlFor",
			"class": "className",
			"float": jQuery.browser.msie ? "styleFloat" : "cssFloat",
			cssFloat: jQuery.browser.msie ? "styleFloat" : "cssFloat",
			innerHTML: "innerHTML",
			className: "className",
			value: "value",
			disabled: "disabled",
			checked: "checked",
			readonly: "readOnly"
		};
		
		// IE actually uses filters for opacity ... elem is actually elem.style
		if (name == "opacity" && jQuery.browser.msie && value != undefined) {
			// IE has trouble with opacity if it does not have layout
			// Would prefer to check element.hasLayout first but don't have access to the element here
			elem['zoom'] = 1; 
			if (value == 1) // Remove filter to avoid more IE weirdness
				return elem["filter"] = elem["filter"].replace(/alpha\([^\)]*\)/gi,"");
			else
				return elem["filter"] = elem["filter"].replace(/alpha\([^\)]*\)/gi,"") + "alpha(opacity=" + value * 100 + ")";
		} else if (name == "opacity" && jQuery.browser.msie) {
			return elem["filter"] ? parseFloat( elem["filter"].match(/alpha\(opacity=(.*)\)/)[1] )/100 : 1;
		}
		
		// Mozilla doesn't play well with opacity 1
		if (name == "opacity" && jQuery.browser.mozilla && value == 1) value = 0.9999;

		if ( fix[name] ) {
			if ( value != undefined ) elem[fix[name]] = value;
			return elem[fix[name]];
		} else if( value == undefined && jQuery.browser.msie && elem.nodeName && elem.nodeName.toUpperCase() == 'FORM' && (name == 'action' || name == 'method') ) {
			return elem.getAttributeNode(name).nodeValue;
		} else if ( elem.tagName ) { // IE elem.getAttribute passes even for style
			if ( value != undefined ) elem.setAttribute( name, value );
			return elem.getAttribute( name );
		} else {
			name = name.replace(/-([a-z])/ig,function(z,b){return b.toUpperCase();});
			if ( value != undefined ) elem[name] = value;
			return elem[name];
		}
	},

	// The regular expressions that power the parsing engine
	parse: [
		// Match: [@value='test'], [@foo]
		"\\[ *(@)S *([!*$^=]*) *('?\"?)(.*?)\\4 *\\]",

		// Match: [div], [div p]
		"(\\[)\s*(.*?)\s*\\]",

		// Match: :contains('foo')
		"(:)S\\(\"?'?([^\\)]*?)\"?'?\\)",

		// Match: :even, :last-chlid
		"([:.#]*)S"
	],

	filter: function(t,r,not) {
		// Figure out if we're doing regular, or inverse, filtering
		var g = not !== false ? jQuery.grep :
			function(a,f) {return jQuery.grep(a,f,true);};

		while ( t && /^[a-z[({<*:.#]/i.test(t) ) {

			var p = jQuery.parse;

			for ( var i = 0; i < p.length; i++ ) {
		
				// Look for, and replace, string-like sequences
				// and finally build a regexp out of it
				var re = new RegExp(
					"^" + p[i].replace("S", "([a-z*_-][a-z0-9_-]*)"), "i" );

				var m = re.exec( t );

				if ( m ) {
					// Re-organize the first match
					if ( !i )
						m = ["",m[1], m[3], m[2], m[5]];

					// Remove what we just matched
					t = t.replace( re, "" );

					break;
				}
			}

			// :not() is a special case that can be optimized by
			// keeping it out of the expression list
			if ( m[1] == ":" && m[2] == "not" )
				r = jQuery.filter(m[3],r,false).r;

			// Otherwise, find the expression to execute
			else {
				var f = jQuery.expr[m[1]];
				if ( f.constructor != String )
					f = jQuery.expr[m[1]][m[2]];

				// Build a custom macro to enclose it
				eval("f = function(a,i){" +
					( m[1] == "@" ? "z=jQuery.attr(a,m[3]);" : "" ) +
					"return " + f + "}");

				// Execute it against the current filter
				r = g( r, f );
			}
		}

		// Return an array of filtered elements (r)
		// and the modified expression string (t)
		return { r: r, t: t };
	},

	/**
	 * Remove the whitespace from the beginning and end of a string.
	 *
	 * @example $.trim("  hello, how are you?  ");
	 * @result "hello, how are you?"
	 *
	 * @name $.trim
	 * @type String
	 * @param String str The string to trim.
	 * @cat Javascript
	 */
	trim: function(t){
		return t.replace(/^\s+|\s+$/g, "");
	},

	/**
	 * All ancestors of a given element.
	 *
	 * @private
	 * @name $.parents
	 * @type Array<Element>
	 * @param Element elem The element to find the ancestors of.
	 * @cat DOM/Traversing
	 */
	parents: function( elem ){
		var matched = [];
		var cur = elem.parentNode;
		while ( cur && cur != document ) {
			matched.push( cur );
			cur = cur.parentNode;
		}
		return matched;
	},

	/**
	 * All elements on a specified axis.
	 *
	 * @private
	 * @name $.sibling
	 * @type Array
	 * @param Element elem The element to find all the siblings of (including itself).
	 * @cat DOM/Traversing
	 */
	sibling: function(elem, pos, not) {
		var elems = [];
		
		if(elem) {
			var siblings = elem.parentNode.childNodes;
			for ( var i = 0; i < siblings.length; i++ ) {
				if ( not === true && siblings[i] == elem ) continue;
	
				if ( siblings[i].nodeType == 1 )
					elems.push( siblings[i] );
				if ( siblings[i] == elem )
					elems.n = elems.length - 1;
			}
		}

		return jQuery.extend( elems, {
			last: elems.n == elems.length - 1,
			cur: pos == "even" && elems.n % 2 == 0 || pos == "odd" && elems.n % 2 || elems[pos] == elem,
			prev: elems[elems.n - 1],
			next: elems[elems.n + 1]
		});
	},

	/**
	 * Merge two arrays together, removing all duplicates. The final order
	 * or the new array is: All the results from the first array, followed
	 * by the unique results from the second array.
	 *
	 * @example $.merge( [0,1,2], [2,3,4] )
	 * @result [0,1,2,3,4]
	 *
	 * @example $.merge( [3,2,1], [4,3,2] )
	 * @result [3,2,1,4]
	 *
	 * @name $.merge
	 * @type Array
	 * @param Array first The first array to merge.
	 * @param Array second The second array to merge.
	 * @cat Javascript
	 */
	merge: function(first, second) {
		var result = [];

		// Move b over to the new array (this helps to avoid
		// StaticNodeList instances)
		for ( var k = 0; k < first.length; k++ )
			result[k] = first[k];

		// Now check for duplicates between a and b and only
		// add the unique items
		for ( var i = 0; i < second.length; i++ ) {
			var noCollision = true;

			// The collision-checking process
			for ( var j = 0; j < first.length; j++ )
				if ( second[i] == first[j] )
					noCollision = false;

			// If the item is unique, add it
			if ( noCollision )
				result.push( second[i] );
		}

		return result;
	},

	/**
	 * Filter items out of an array, by using a filter function.
	 * The specified function will be passed two arguments: The
	 * current array item and the index of the item in the array. The
	 * function should return 'true' if you wish to keep the item in
	 * the array, false if it should be removed.
	 *
	 * @example $.grep( [0,1,2], function(i){
	 *   return i > 0;
	 * });
	 * @result [1, 2]
	 *
	 * @name $.grep
	 * @type Array
	 * @param Array array The Array to find items in.
	 * @param Function fn The function to process each item against.
	 * @param Boolean inv Invert the selection - select the opposite of the function.
	 * @cat Javascript
	 */
	grep: function(elems, fn, inv) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( typeof fn == "string" )
			fn = new Function("a","i","return " + fn);

		var result = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0; i < elems.length; i++ )
			if ( !inv && fn(elems[i],i) || inv && !fn(elems[i],i) )
				result.push( elems[i] );

		return result;
	},

	/**
	 * Translate all items in an array to another array of items. 
	 * The translation function that is provided to this method is 
	 * called for each item in the array and is passed one argument: 
	 * The item to be translated. The function can then return:
	 * The translated value, 'null' (to remove the item), or 
	 * an array of values - which will be flattened into the full array.
	 *
	 * @example $.map( [0,1,2], function(i){
	 *   return i + 4;
	 * });
	 * @result [4, 5, 6]
	 *
	 * @example $.map( [0,1,2], function(i){
	 *   return i > 0 ? i + 1 : null;
	 * });
	 * @result [2, 3]
	 * 
	 * @example $.map( [0,1,2], function(i){
	 *   return [ i, i + 1 ];
	 * });
	 * @result [0, 1, 1, 2, 2, 3]
	 *
	 * @name $.map
	 * @type Array
	 * @param Array array The Array to translate.
	 * @param Function fn The function to process each item against.
	 * @cat Javascript
	 */
	map: function(elems, fn) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( typeof fn == "string" )
			fn = new Function("a","return " + fn);

		var result = [];

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0; i < elems.length; i++ ) {
			var val = fn(elems[i],i);

			if ( val !== null && val != undefined ) {
				if ( val.constructor != Array ) val = [val];
				result = jQuery.merge( result, val );
			}
		}

		return result;
	},

	/*
	 * A number of helper functions used for managing events.
	 * Many of the ideas behind this code orignated from Dean Edwards' addEvent library.
	 */
	event: {

		// Bind an event to an element
		// Original by Dean Edwards
		add: function(element, type, handler) {
			// For whatever reason, IE has trouble passing the window object
			// around, causing it to be cloned in the process
			if ( jQuery.browser.msie && element.setInterval != undefined )
				element = window;

			// Make sure that the function being executed has a unique ID
			if ( !handler.guid )
				handler.guid = this.guid++;

			// Init the element's event structure
			if (!element.events)
				element.events = {};

			// Get the current list of functions bound to this event
			var handlers = element.events[type];

			// If it hasn't been initialized yet
			if (!handlers) {
				// Init the event handler queue
				handlers = element.events[type] = {};

				// Remember an existing handler, if it's already there
				if (element["on" + type])
					handlers[0] = element["on" + type];
			}

			// Add the function to the element's handler list
			handlers[handler.guid] = handler;

			// And bind the global event handler to the element
			element["on" + type] = this.handle;

			// Remember the function in a global list (for triggering)
			if (!this.global[type])
				this.global[type] = [];
			this.global[type].push( element );
		},

		guid: 1,
		global: {},

		// Detach an event or set of events from an element
		remove: function(element, type, handler) {
			if (element.events)
				if (type && element.events[type])
					if ( handler )
						delete element.events[type][handler.guid];
					else
						for ( var i in element.events[type] )
							delete element.events[type][i];
				else
					for ( var j in element.events )
						this.remove( element, j );
		},

		trigger: function(type,data,element) {
			// Clone the incoming data, if any
			data = $.merge([], data || []);

			// Handle a global trigger
			if ( !element ) {
				var g = this.global[type];
				if ( g )
					for ( var i = 0; i < g.length; i++ )
						this.trigger( type, data, g[i] );

			// Handle triggering a single element
			} else if ( element["on" + type] ) {
				// Pass along a fake event
				data.unshift( this.fix({ type: type, target: element }) );

				// Trigger the event
				element["on" + type].apply( element, data );
			}
		},

		handle: function(event) {
			if ( typeof jQuery == "undefined" ) return false;

			event = jQuery.event.fix( event || window.event || {} ); // Empty object is for triggered events with no data

			// If no correct event was found, fail
			if ( !event ) return false;

			var returnValue = true;

			var c = this.events[event.type];

			var args = [].slice.call( arguments, 1 );
			args.unshift( event );

			for ( var j in c ) {
				if ( c[j].apply( this, args ) === false ) {
					event.preventDefault();
					event.stopPropagation();
					returnValue = false;
				}
			}

			// Clean up added properties in IE to prevent memory leak
			if (jQuery.browser.msie) event.target = event.preventDefault = event.stopPropagation = null;

			return returnValue;
		},

		fix: function(event) {
			// check IE
			if(jQuery.browser.msie) {
				// fix target property, if available
				// check prevents overwriting of fake target coming from trigger
				if(event.srcElement)
					event.target = event.srcElement;
					
				// calculate pageX/Y
				var e = document.documentElement, b = document.body;
				event.pageX = event.clientX + (e.scrollLeft || b.scrollLeft);
				event.pageY = event.clientY + (e.scrollTop || b.scrollTop);
					
			// check safari and if target is a textnode
			} else if(jQuery.browser.safari && event.target.nodeType == 3) {
				// target is readonly, clone the event object
				event = jQuery.extend({}, event);
				// get parentnode from textnode
				event.target = event.target.parentNode;
			}
			
			// fix preventDefault and stopPropagation
			if (!event.preventDefault)
				event.preventDefault = function() {
					this.returnValue = false;
				};
				
			if (!event.stopPropagation)
				event.stopPropagation = function() {
					this.cancelBubble = true;
				};
				
			return event;
		}
	}
});

/**
 * Contains flags for the useragent, read from navigator.userAgent.
 * Available flags are: safari, opera, msie, mozilla
 * This property is available before the DOM is ready, therefore you can
 * use it to add ready events only for certain browsers.
 *
 * @example $.browser.msie
 * @desc Returns true if the current useragent is some version of microsoft's internet explorer
 *
 * @example if($.browser.safari) { $( function() { alert("this is safari!"); } ); }
 * @desc Alerts "this is safari!" only for safari browsers
 *
 * @property
 * @name $.browser
 * @type Boolean
 * @cat Javascript
 */
 
/*
 * Wheather the W3C compliant box model is being used.
 *
 * @property
 * @name $.boxModel
 * @type Boolean
 * @cat Javascript
 */
new function() {
	var b = navigator.userAgent.toLowerCase();

	// Figure out what browser is being used
	jQuery.browser = {
		safari: /webkit/.test(b),
		opera: /opera/.test(b),
		msie: /msie/.test(b) && !/opera/.test(b),
		mozilla: /mozilla/.test(b) && !/(compatible|webkit)/.test(b)
	};

	// Check to see if the W3C box model is being used
	jQuery.boxModel = !jQuery.browser.msie || document.compatMode == "CSS1Compat";
};

jQuery.macros = {
	to: {
		/**
		 * Append all of the matched elements to another, specified, set of elements.
		 * This operation is, essentially, the reverse of doing a regular
		 * $(A).append(B), in that instead of appending B to A, you're appending
		 * A to B.
		 *
		 * @example $("p").appendTo("#foo");
		 * @before <p>I would like to say: </p><div id="foo"></div>
		 * @result <div id="foo"><p>I would like to say: </p></div>
		 *
		 * @name appendTo
		 * @type jQuery
		 * @param String expr A jQuery expression of elements to match.
		 * @cat DOM/Manipulation
		 */
		appendTo: "append",

		/**
		 * Prepend all of the matched elements to another, specified, set of elements.
		 * This operation is, essentially, the reverse of doing a regular
		 * $(A).prepend(B), in that instead of prepending B to A, you're prepending
		 * A to B.
		 *
		 * @example $("p").prependTo("#foo");
		 * @before <p>I would like to say: </p><div id="foo"><b>Hello</b></div>
		 * @result <div id="foo"><p>I would like to say: </p><b>Hello</b></div>
		 *
		 * @name prependTo
		 * @type jQuery
		 * @param String expr A jQuery expression of elements to match.
		 * @cat DOM/Manipulation
		 */
		prependTo: "prepend",

		/**
		 * Insert all of the matched elements before another, specified, set of elements.
		 * This operation is, essentially, the reverse of doing a regular
		 * $(A).before(B), in that instead of inserting B before A, you're inserting
		 * A before B.
		 *
		 * @example $("p").insertBefore("#foo");
		 * @before <div id="foo">Hello</div><p>I would like to say: </p>
		 * @result <p>I would like to say: </p><div id="foo">Hello</div>
		 *
		 * @name insertBefore
		 * @type jQuery
		 * @param String expr A jQuery expression of elements to match.
		 * @cat DOM/Manipulation
		 */
		insertBefore: "before",

		/**
		 * Insert all of the matched elements after another, specified, set of elements.
		 * This operation is, essentially, the reverse of doing a regular
		 * $(A).after(B), in that instead of inserting B after A, you're inserting
		 * A after B.
		 *
		 * @example $("p").insertAfter("#foo");
		 * @before <p>I would like to say: </p><div id="foo">Hello</div>
		 * @result <div id="foo">Hello</div><p>I would like to say: </p>
		 *
		 * @name insertAfter
		 * @type jQuery
		 * @param String expr A jQuery expression of elements to match.
		 * @cat DOM/Manipulation
		 */
		insertAfter: "after"
	},

	/**
	 * Get the current CSS width of the first matched element.
	 *
	 * @example $("p").width();
	 * @before <p>This is just a test.</p>
	 * @result "300px"
	 *
	 * @name width
	 * @type String
	 * @cat CSS
	 */

	/**
	 * Set the CSS width of every matched element. Be sure to include
	 * the "px" (or other unit of measurement) after the number that you
	 * specify, otherwise you might get strange results.
	 *
	 * @example $("p").width("20px");
	 * @before <p>This is just a test.</p>
	 * @result <p style="width:20px;">This is just a test.</p>
	 *
	 * @name width
	 * @type jQuery
	 * @param String val Set the CSS property to the specified value.
	 * @cat CSS
	 */

	/**
	 * Get the current CSS height of the first matched element.
	 *
	 * @example $("p").height();
	 * @before <p>This is just a test.</p>
	 * @result "14px"
	 *
	 * @name height
	 * @type String
	 * @cat CSS
	 */

	/**
	 * Set the CSS height of every matched element. Be sure to include
	 * the "px" (or other unit of measurement) after the number that you
	 * specify, otherwise you might get strange results.
	 *
	 * @example $("p").height("20px");
	 * @before <p>This is just a test.</p>
	 * @result <p style="height:20px;">This is just a test.</p>
	 *
	 * @name height
	 * @type jQuery
	 * @param String val Set the CSS property to the specified value.
	 * @cat CSS
	 */

	/**
	 * Get the current CSS top of the first matched element.
	 *
	 * @example $("p").top();
	 * @before <p>This is just a test.</p>
	 * @result "0px"
	 *
	 * @name top
	 * @type String
	 * @cat CSS
	 */

	/**
	 * Set the CSS top of every matched element. Be sure to include
	 * the "px" (or other unit of measurement) after the number that you
	 * specify, otherwise you might get strange results.
	 *
	 * @example $("p").top("20px");
	 * @before <p>This is just a test.</p>
	 * @result <p style="top:20px;">This is just a test.</p>
	 *
	 * @name top
	 * @type jQuery
	 * @param String val Set the CSS property to the specified value.
	 * @cat CSS
	 */

	/**
	 * Get the current CSS left of the first matched element.
	 *
	 * @example $("p").left();
	 * @before <p>This is just a test.</p>
	 * @result "0px"
	 *
	 * @name left
	 * @type String
	 * @cat CSS
	 */

	/**
	 * Set the CSS left of every matched element. Be sure to include
	 * the "px" (or other unit of measurement) after the number that you
	 * specify, otherwise you might get strange results.
	 *
	 * @example $("p").left("20px");
	 * @before <p>This is just a test.</p>
	 * @result <p style="left:20px;">This is just a test.</p>
	 *
	 * @name left
	 * @type jQuery
	 * @param String val Set the CSS property to the specified value.
	 * @cat CSS
	 */

	/**
	 * Get the current CSS position of the first matched element.
	 *
	 * @example $("p").position();
	 * @before <p>This is just a test.</p>
	 * @result "static"
	 *
	 * @name position
	 * @type String
	 * @cat CSS
	 */

	/**
	 * Set the CSS position of every matched element.
	 *
	 * @example $("p").position("relative");
	 * @before <p>This is just a test.</p>
	 * @result <p style="position:relative;">This is just a test.</p>
	 *
	 * @name position
	 * @type jQuery
	 * @param String val Set the CSS property to the specified value.
	 * @cat CSS
	 */

	/**
	 * Get the current CSS float of the first matched element.
	 *
	 * @example $("p").float();
	 * @before <p>This is just a test.</p>
	 * @result "none"
	 *
	 * @name float
	 * @type String
	 * @cat CSS
	 */

	/**
	 * Set the CSS float of every matched element.
	 *
	 * @example $("p").float("left");
	 * @before <p>This is just a test.</p>
	 * @result <p style="float:left;">This is just a test.</p>
	 *
	 * @name float
	 * @type jQuery
	 * @param String val Set the CSS property to the specified value.
	 * @cat CSS
	 */

	/**
	 * Get the current CSS overflow of the first matched element.
	 *
	 * @example $("p").overflow();
	 * @before <p>This is just a test.</p>
	 * @result "none"
	 *
	 * @name overflow
	 * @type String
	 * @cat CSS
	 */

	/**
	 * Set the CSS overflow of every matched element.
	 *
	 * @example $("p").overflow("auto");
	 * @before <p>This is just a test.</p>
	 * @result <p style="overflow:auto;">This is just a test.</p>
	 *
	 * @name overflow
	 * @type jQuery
	 * @param String val Set the CSS property to the specified value.
	 * @cat CSS
	 */

	/**
	 * Get the current CSS color of the first matched element.
	 *
	 * @example $("p").color();
	 * @before <p>This is just a test.</p>
	 * @result "black"
	 *
	 * @name color
	 * @type String
	 * @cat CSS
	 */

	/**
	 * Set the CSS color of every matched element.
	 *
	 * @example $("p").color("blue");
	 * @before <p>This is just a test.</p>
	 * @result <p style="color:blue;">This is just a test.</p>
	 *
	 * @name color
	 * @type jQuery
	 * @param String val Set the CSS property to the specified value.
	 * @cat CSS
	 */

	/**
	 * Get the current CSS background of the first matched element.
	 *
	 * @example $("p").background();
	 * @before <p style="background:blue;">This is just a test.</p>
	 * @result "blue"
	 *
	 * @name background
	 * @type String
	 * @cat CSS
	 */

	/**
	 * Set the CSS background of every matched element.
	 *
	 * @example $("p").background("blue");
	 * @before <p>This is just a test.</p>
	 * @result <p style="background:blue;">This is just a test.</p>
	 *
	 * @name background
	 * @type jQuery
	 * @param String val Set the CSS property to the specified value.
	 * @cat CSS
	 */

	css: "width,height,top,left,position,float,overflow,color,background".split(","),

	/**
	 * Reduce the set of matched elements to a single element.
	 * The position of the element in the set of matched elements
	 * starts at 0 and goes to length - 1.
	 *
	 * @example $("p").eq(1)
	 * @before <p>This is just a test.</p><p>So is this</p>
	 * @result [ <p>So is this</p> ]
	 *
	 * @name eq
	 * @type jQuery
	 * @param Number pos The index of the element that you wish to limit to.
	 * @cat Core
	 */

	/**
	 * Reduce the set of matched elements to all elements before a given position.
	 * The position of the element in the set of matched elements
	 * starts at 0 and goes to length - 1.
	 *
	 * @example $("p").lt(1)
	 * @before <p>This is just a test.</p><p>So is this</p>
	 * @result [ <p>This is just a test.</p> ]
	 *
	 * @name lt
	 * @type jQuery
	 * @param Number pos Reduce the set to all elements below this position.
	 * @cat Core
	 */

	/**
	 * Reduce the set of matched elements to all elements after a given position.
	 * The position of the element in the set of matched elements
	 * starts at 0 and goes to length - 1.
	 *
	 * @example $("p").gt(0)
	 * @before <p>This is just a test.</p><p>So is this</p>
	 * @result [ <p>So is this</p> ]
	 *
	 * @name gt
	 * @type jQuery
	 * @param Number pos Reduce the set to all elements after this position.
	 * @cat Core
	 */

	/**
	 * Filter the set of elements to those that contain the specified text.
	 *
	 * @example $("p").contains("test")
	 * @before <p>This is just a test.</p><p>So is this</p>
	 * @result [ <p>This is just a test.</p> ]
	 *
	 * @name contains
	 * @type jQuery
	 * @param String str The string that will be contained within the text of an element.
	 * @cat DOM/Traversing
	 */

	filter: [ "eq", "lt", "gt", "contains" ],

	attr: {
		/**
		 * Get the current value of the first matched element.
		 *
		 * @example $("input").val();
		 * @before <input type="text" value="some text"/>
		 * @result "some text"
		 *
		 * @name val
		 * @type String
		 * @cat DOM/Attributes
		 */

		/**
		 * Set the value of every matched element.
		 *
		 * @example $("input").val("test");
		 * @before <input type="text" value="some text"/>
		 * @result <input type="text" value="test"/>
		 *
		 * @name val
		 * @type jQuery
		 * @param String val Set the property to the specified value.
		 * @cat DOM/Attributes
		 */
		val: "value",

		/**
		 * Get the html contents of the first matched element.
		 *
		 * @example $("div").html();
		 * @before <div><input/></div>
		 * @result <input/>
		 *
		 * @name html
		 * @type String
		 * @cat DOM/Attributes
		 */

		/**
		 * Set the html contents of every matched element.
		 *
		 * @example $("div").html("<b>new stuff</b>");
		 * @before <div><input/></div>
		 * @result <div><b>new stuff</b></div>
		 *
		 * @name html
		 * @type jQuery
		 * @param String val Set the html contents to the specified value.
		 * @cat DOM/Attributes
		 */
		html: "innerHTML",

		/**
		 * Get the current id of the first matched element.
		 *
		 * @example $("input").id();
		 * @before <input type="text" id="test" value="some text"/>
		 * @result "test"
		 *
		 * @name id
		 * @type String
		 * @cat DOM/Attributes
		 */

		/**
		 * Set the id of every matched element.
		 *
		 * @example $("input").id("newid");
		 * @before <input type="text" id="test" value="some text"/>
		 * @result <input type="text" id="newid" value="some text"/>
		 *
		 * @name id
		 * @type jQuery
		 * @param String val Set the property to the specified value.
		 * @cat DOM/Attributes
		 */
		id: null,

		/**
		 * Get the current title of the first matched element.
		 *
		 * @example $("img").title();
		 * @before <img src="test.jpg" title="my image"/>
		 * @result "my image"
		 *
		 * @name title
		 * @type String
		 * @cat DOM/Attributes
		 */

		/**
		 * Set the title of every matched element.
		 *
		 * @example $("img").title("new title");
		 * @before <img src="test.jpg" title="my image"/>
		 * @result <img src="test.jpg" title="new image"/>
		 *
		 * @name title
		 * @type jQuery
		 * @param String val Set the property to the specified value.
		 * @cat DOM/Attributes
		 */
		title: null,

		/**
		 * Get the current name of the first matched element.
		 *
		 * @example $("input").name();
		 * @before <input type="text" name="username"/>
		 * @result "username"
		 *
		 * @name name
		 * @type String
		 * @cat DOM/Attributes
		 */

		/**
		 * Set the name of every matched element.
		 *
		 * @example $("input").name("user");
		 * @before <input type="text" name="username"/>
		 * @result <input type="text" name="user"/>
		 *
		 * @name name
		 * @type jQuery
		 * @param String val Set the property to the specified value.
		 * @cat DOM/Attributes
		 */
		name: null,

		/**
		 * Get the current href of the first matched element.
		 *
		 * @example $("a").href();
		 * @before <a href="test.html">my link</a>
		 * @result "test.html"
		 *
		 * @name href
		 * @type String
		 * @cat DOM/Attributes
		 */

		/**
		 * Set the href of every matched element.
		 *
		 * @example $("a").href("test2.html");
		 * @before <a href="test.html">my link</a>
		 * @result <a href="test2.html">my link</a>
		 *
		 * @name href
		 * @type jQuery
		 * @param String val Set the property to the specified value.
		 * @cat DOM/Attributes
		 */
		href: null,

		/**
		 * Get the current src of the first matched element.
		 *
		 * @example $("img").src();
		 * @before <img src="test.jpg" title="my image"/>
		 * @result "test.jpg"
		 *
		 * @name src
		 * @type String
		 * @cat DOM/Attributes
		 */

		/**
		 * Set the src of every matched element.
		 *
		 * @example $("img").src("test2.jpg");
		 * @before <img src="test.jpg" title="my image"/>
		 * @result <img src="test2.jpg" title="my image"/>
		 *
		 * @name src
		 * @type jQuery
		 * @param String val Set the property to the specified value.
		 * @cat DOM/Attributes
		 */
		src: null,

		/**
		 * Get the current rel of the first matched element.
		 *
		 * @example $("a").rel();
		 * @before <a href="test.html" rel="nofollow">my link</a>
		 * @result "nofollow"
		 *
		 * @name rel
		 * @type String
		 * @cat DOM/Attributes
		 */

		/**
		 * Set the rel of every matched element.
		 *
		 * @example $("a").rel("nofollow");
		 * @before <a href="test.html">my link</a>
		 * @result <a href="test.html" rel="nofollow">my link</a>
		 *
		 * @name rel
		 * @type jQuery
		 * @param String val Set the property to the specified value.
		 * @cat DOM/Attributes
		 */
		rel: null
	},

	axis: {
		/**
		 * Get a set of elements containing the unique parents of the matched
		 * set of elements.
		 *
		 * @example $("p").parent()
		 * @before <div><p>Hello</p><p>Hello</p></div>
		 * @result [ <div><p>Hello</p><p>Hello</p></div> ]
		 *
		 * @name parent
		 * @type jQuery
		 * @cat DOM/Traversing
		 */

		/**
		 * Get a set of elements containing the unique parents of the matched
		 * set of elements, and filtered by an expression.
		 *
		 * @example $("p").parent(".selected")
		 * @before <div><p>Hello</p></div><div class="selected"><p>Hello Again</p></div>
		 * @result [ <div class="selected"><p>Hello Again</p></div> ]
		 *
		 * @name parent
		 * @type jQuery
		 * @param String expr An expression to filter the parents with
		 * @cat DOM/Traversing
		 */
		parent: "a.parentNode",

		/**
		 * Get a set of elements containing the unique ancestors of the matched
		 * set of elements (except for the root element).
		 *
		 * @example $("span").ancestors()
		 * @before <html><body><div><p><span>Hello</span></p><span>Hello Again</span></div></body></html>
		 * @result [ <body>...</body>, <div>...</div>, <p><span>Hello</span></p> ]
		 *
		 * @name ancestors
		 * @type jQuery
		 * @cat DOM/Traversing
		 */

		/**
		 * Get a set of elements containing the unique ancestors of the matched
		 * set of elements, and filtered by an expression.
		 *
		 * @example $("span").ancestors("p")
		 * @before <html><body><div><p><span>Hello</span></p><span>Hello Again</span></div></body></html>
		 * @result [ <p><span>Hello</span></p> ]
		 *
		 * @name ancestors
		 * @type jQuery
		 * @param String expr An expression to filter the ancestors with
		 * @cat DOM/Traversing
		 */
		ancestors: jQuery.parents,

		/**
		 * Get a set of elements containing the unique ancestors of the matched
		 * set of elements (except for the root element).
		 *
		 * @example $("span").ancestors()
		 * @before <html><body><div><p><span>Hello</span></p><span>Hello Again</span></div></body></html>
		 * @result [ <body>...</body>, <div>...</div>, <p><span>Hello</span></p> ]
		 *
		 * @name parents
		 * @type jQuery
		 * @cat DOM/Traversing
		 */

		/**
		 * Get a set of elements containing the unique ancestors of the matched
		 * set of elements, and filtered by an expression.
		 *
		 * @example $("span").ancestors("p")
		 * @before <html><body><div><p><span>Hello</span></p><span>Hello Again</span></div></body></html>
		 * @result [ <p><span>Hello</span></p> ]
		 *
		 * @name parents
		 * @type jQuery
		 * @param String expr An expression to filter the ancestors with
		 * @cat DOM/Traversing
		 */
		parents: jQuery.parents,

		/**
		 * Get a set of elements containing the unique next siblings of each of the
		 * matched set of elements.
		 *
		 * It only returns the very next sibling, not all next siblings.
		 *
		 * @example $("p").next()
		 * @before <p>Hello</p><p>Hello Again</p><div><span>And Again</span></div>
		 * @result [ <p>Hello Again</p>, <div><span>And Again</span></div> ]
		 *
		 * @name next
		 * @type jQuery
		 * @cat DOM/Traversing
		 */

		/**
		 * Get a set of elements containing the unique next siblings of each of the
		 * matched set of elements, and filtered by an expression.
		 *
		 * It only returns the very next sibling, not all next siblings.
		 *
		 * @example $("p").next(".selected")
		 * @before <p>Hello</p><p class="selected">Hello Again</p><div><span>And Again</span></div>
		 * @result [ <p class="selected">Hello Again</p> ]
		 *
		 * @name next
		 * @type jQuery
		 * @param String expr An expression to filter the next Elements with
		 * @cat DOM/Traversing
		 */
		next: "jQuery.sibling(a).next",

		/**
		 * Get a set of elements containing the unique previous siblings of each of the
		 * matched set of elements.
		 *
		 * It only returns the immediately previous sibling, not all previous siblings.
		 *
		 * @example $("p").prev()
		 * @before <p>Hello</p><div><span>Hello Again</span></div><p>And Again</p>
		 * @result [ <div><span>Hello Again</span></div> ]
		 *
		 * @name prev
		 * @type jQuery
		 * @cat DOM/Traversing
		 */

		/**
		 * Get a set of elements containing the unique previous siblings of each of the
		 * matched set of elements, and filtered by an expression.
		 *
		 * It only returns the immediately previous sibling, not all previous siblings.
		 *
		 * @example $("p").prev(".selected")
		 * @before <div><span>Hello</span></div><p class="selected">Hello Again</p><p>And Again</p>
		 * @result [ <div><span>Hello</span></div> ]
		 *
		 * @name prev
		 * @type jQuery
		 * @param String expr An expression to filter the previous Elements with
		 * @cat DOM/Traversing
		 */
		prev: "jQuery.sibling(a).prev",

		/**
		 * Get a set of elements containing all of the unique siblings of each of the
		 * matched set of elements.
		 *
		 * @example $("div").siblings()
		 * @before <p>Hello</p><div><span>Hello Again</span></div><p>And Again</p>
		 * @result [ <p>Hello</p>, <p>And Again</p> ]
		 *
		 * @name siblings
		 * @type jQuery
		 * @cat DOM/Traversing
		 */

		/**
		 * Get a set of elements containing all of the unique siblings of each of the
		 * matched set of elements, and filtered by an expression.
		 *
		 * @example $("div").siblings(".selected")
		 * @before <div><span>Hello</span></div><p class="selected">Hello Again</p><p>And Again</p>
		 * @result [ <p class="selected">Hello Again</p> ]
		 *
		 * @name siblings
		 * @type jQuery
		 * @param String expr An expression to filter the sibling Elements with
		 * @cat DOM/Traversing
		 */
		siblings: "jQuery.sibling(a, null, true)",


		/**
		 * Get a set of elements containing all of the unique children of each of the
		 * matched set of elements.
		 *
		 * @example $("div").children()
		 * @before <p>Hello</p><div><span>Hello Again</span></div><p>And Again</p>
		 * @result [ <span>Hello Again</span> ]
		 *
		 * @name children
		 * @type jQuery
		 * @cat DOM/Traversing
		 */

		/**
		 * Get a set of elements containing all of the unique children of each of the
		 * matched set of elements, and filtered by an expression.
		 *
		 * @example $("div").children(".selected")
		 * @before <div><span>Hello</span><p class="selected">Hello Again</p><p>And Again</p></div>
		 * @result [ <p class="selected">Hello Again</p> ]
		 *
		 * @name children
		 * @type jQuery
		 * @param String expr An expression to filter the child Elements with
		 * @cat DOM/Traversing
		 */
		children: "jQuery.sibling(a.firstChild)"
	},

	each: {

		/**
		 * Remove an attribute from each of the matched elements.
		 *
		 * @example $("input").removeAttr("disabled")
		 * @before <input disabled="disabled"/>
		 * @result <input/>
		 *
		 * @name removeAttr
		 * @type jQuery
		 * @param String name The name of the attribute to remove.
		 * @cat DOM
		 */
		removeAttr: function( key ) {
			jQuery.attr( this, key, "" );
			this.removeAttribute( key );
		},

		/**
		 * Displays each of the set of matched elements if they are hidden.
		 *
		 * @example $("p").show()
		 * @before <p style="display: none">Hello</p>
		 * @result [ <p style="display: block">Hello</p> ]
		 *
		 * @name show
		 * @type jQuery
		 * @cat Effects
		 */
		show: function(){
			this.style.display = this.oldblock ? this.oldblock : "";
			if ( jQuery.css(this,"display") == "none" )
				this.style.display = "block";
		},

		/**
		 * Hides each of the set of matched elements if they are shown.
		 *
		 * @example $("p").hide()
		 * @before <p>Hello</p>
		 * @result [ <p style="display: none">Hello</p> ]
		 *
		 * var pass = true, div = $("div");
		 * div.hide().each(function(){
		 *   if ( this.style.display != "none" ) pass = false;
		 * });
		 * ok( pass, "Hide" );
		 *
		 * @name hide
		 * @type jQuery
		 * @cat Effects
		 */
		hide: function(){
			this.oldblock = this.oldblock || jQuery.css(this,"display");
			if ( this.oldblock == "none" )
				this.oldblock = "block";
			this.style.display = "none";
		},

		/**
		 * Toggles each of the set of matched elements. If they are shown,
		 * toggle makes them hidden. If they are hidden, toggle
		 * makes them shown.
		 *
		 * @example $("p").toggle()
		 * @before <p>Hello</p><p style="display: none">Hello Again</p>
		 * @result [ <p style="display: none">Hello</p>, <p style="display: block">Hello Again</p> ]
		 *
		 * @name toggle
		 * @type jQuery
		 * @cat Effects
		 */
		toggle: function(){
			jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ].apply( jQuery(this), arguments );
		},

		/**
		 * Adds the specified class to each of the set of matched elements.
		 *
		 * @example $("p").addClass("selected")
		 * @before <p>Hello</p>
		 * @result [ <p class="selected">Hello</p> ]
		 *
		 * @name addClass
		 * @type jQuery
		 * @param String class A CSS class to add to the elements
		 * @cat DOM
		 */
		addClass: function(c){
			jQuery.className.add(this,c);
		},

		/**
		 * Removes the specified class from the set of matched elements.
		 *
		 * @example $("p").removeClass("selected")
		 * @before <p class="selected">Hello</p>
		 * @result [ <p>Hello</p> ]
		 *
		 * @name removeClass
		 * @type jQuery
		 * @param String class A CSS class to remove from the elements
		 * @cat DOM
		 */
		removeClass: function(c){
			jQuery.className.remove(this,c);
		},

		/**
		 * Adds the specified class if it is not present, removes it if it is
		 * present.
		 *
		 * @example $("p").toggleClass("selected")
		 * @before <p>Hello</p><p class="selected">Hello Again</p>
		 * @result [ <p class="selected">Hello</p>, <p>Hello Again</p> ]
		 *
		 * @name toggleClass
		 * @type jQuery
		 * @param String class A CSS class with which to toggle the elements
		 * @cat DOM
		 */
		toggleClass: function( c ){
			jQuery.className[ jQuery.className.has(this,c) ? "remove" : "add" ](this, c);
		},

		/**
		 * Removes all matched elements from the DOM. This does NOT remove them from the
		 * jQuery object, allowing you to use the matched elements further.
		 *
		 * @example $("p").remove();
		 * @before <p>Hello</p> how are <p>you?</p>
		 * @result how are
		 *
		 * @name remove
		 * @type jQuery
		 * @cat DOM/Manipulation
		 */

		/**
		 * Removes only elements (out of the list of matched elements) that match
		 * the specified jQuery expression. This does NOT remove them from the
		 * jQuery object, allowing you to use the matched elements further.
		 *
		 * @example $("p").remove(".hello");
		 * @before <p class="hello">Hello</p> how are <p>you?</p>
		 * @result how are <p>you?</p>
		 *
		 * @name remove
		 * @type jQuery
		 * @param String expr A jQuery expression to filter elements by.
		 * @cat DOM/Manipulation
		 */
		remove: function(a){
			if ( !a || jQuery.filter( a, [this] ).r )
				this.parentNode.removeChild( this );
		},

		/**
		 * Removes all child nodes from the set of matched elements.
		 *
		 * @example $("p").empty()
		 * @before <p>Hello, <span>Person</span> <a href="#">and person</a></p>
		 * @result [ <p></p> ]
		 *
		 * @name empty
		 * @type jQuery
		 * @cat DOM/Manipulation
		 */
		empty: function(){
			while ( this.firstChild )
				this.removeChild( this.firstChild );
		},

		/**
		 * Binds a handler to a particular event (like click) for each matched element.
		 * The event handler is passed an event object that you can use to prevent
		 * default behaviour. To stop both default action and event bubbling, your handler
		 * has to return false.
		 *
		 * @example $("p").bind( "click", function() {
		 *   alert( $(this).text() );
		 * } )
		 * @before <p>Hello</p>
		 * @result alert("Hello")
		 *
		 * @example $("form").bind( "submit", function() { return false; } )
		 * @desc Cancel a default action and prevent it from bubbling by returning false
		 * from your function.
		 *
		 * @example $("form").bind( "submit", function(event) {
		 *   event.preventDefault();
		 * } );
		 * @desc Cancel only the default action by using the preventDefault method.
		 *
		 *
		 * @example $("form").bind( "submit", function(event) {
		 *   event.stopPropagation();
		 * } )
		 * @desc Stop only an event from bubbling by using the stopPropagation method.
		 *
		 * @name bind
		 * @type jQuery
		 * @param String type An event type
		 * @param Function fn A function to bind to the event on each of the set of matched elements
		 * @cat Events
		 */
		bind: function( type, fn ) {
			jQuery.event.add( this, type, fn );
		},

		/**
		 * The opposite of bind, removes a bound event from each of the matched
		 * elements. You must pass the identical function that was used in the original
		 * bind method.
		 *
		 * @example $("p").unbind( "click", function() { alert("Hello"); } )
		 * @before <p onclick="alert('Hello');">Hello</p>
		 * @result [ <p>Hello</p> ]
		 *
		 * @name unbind
		 * @type jQuery
		 * @param String type An event type
		 * @param Function fn A function to unbind from the event on each of the set of matched elements
		 * @cat Events
		 */

		/**
		 * Removes all bound events of a particular type from each of the matched
		 * elements.
		 *
		 * @example $("p").unbind( "click" )
		 * @before <p onclick="alert('Hello');">Hello</p>
		 * @result [ <p>Hello</p> ]
		 *
		 * @name unbind
		 * @type jQuery
		 * @param String type An event type
		 * @cat Events
		 */

		/**
		 * Removes all bound events from each of the matched elements.
		 *
		 * @example $("p").unbind()
		 * @before <p onclick="alert('Hello');">Hello</p>
		 * @result [ <p>Hello</p> ]
		 *
		 * @name unbind
		 * @type jQuery
		 * @cat Events
		 */
		unbind: function( type, fn ) {
			jQuery.event.remove( this, type, fn );
		},

		/**
		 * Trigger a type of event on every matched element.
		 *
		 * @example $("p").trigger("click")
		 * @before <p click="alert('hello')">Hello</p>
		 * @result alert('hello')
		 *
		 * @name trigger
		 * @type jQuery
		 * @param String type An event type to trigger.
		 * @cat Events
		 */
		trigger: function( type, data ) {
			jQuery.event.trigger( type, data, this );
		}
	}
};

jQuery.init();
