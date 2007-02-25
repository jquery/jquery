/*
 * jQuery @VERSION - New Wave Javascript
 *
 * Copyright (c) 2007 John Resig (jquery.com)
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
 * @param String|Function|Element|Array<Element>|jQuery a selector
 * @param jQuery|Element|Array<Element> c context
 * @cat Core
 */
var jQuery = function(a,c) {
	// If the context is global, return a new object
	if ( window == this )
		return new jQuery(a,c);

	// Make sure that a selection was provided
	a = a || document;
	
	// HANDLE: $(function)
	// Shortcut for document ready
	if ( jQuery.isFunction(a) )
		return new jQuery(document)[ jQuery.fn.ready ? "ready" : "load" ]( a );
	
	// Handle HTML strings
	if ( typeof a  == "string" ) {
		// HANDLE: $(html) -> $(array)
		var m = /^[^<]*(<(.|\s)+>)[^>]*$/.exec(a);
		if ( m )
			a = jQuery.clean( [ m[1] ] );
		
		// HANDLE: $(expr)
		else
			return new jQuery( c ).find( a );
	}
	
	return this.setArray(
		// HANDLE: $(array)
		a.constructor == Array && a ||

		// HANDLE: $(arraylike)
		// Watch for when an array-like object is passed as the selector
		(a.jquery || a.length && a != window && !a.nodeType && a[0] != undefined && a[0].nodeType) && jQuery.makeArray( a ) ||

		// HANDLE: $(*)
		[ a ] );
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
 * @desc Finds all p elements that are children of a div element.
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
 * @param Element|jQuery context (optional) A DOM Element, Document or jQuery to use as context
 * @cat Core
 * @type jQuery
 * @see $(Element)
 * @see $(Element<Array>)
 */
 
/**
 * Create DOM elements on-the-fly from the provided String of raw HTML.
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
 * @see appendTo(String)
 */

/**
 * Wrap jQuery functionality around a single or multiple DOM Element(s).
 *
 * This function also accepts XML Documents and Window objects
 * as valid arguments (even though they are not DOM Elements).
 *
 * @example $(document.body).background( "black" );
 * @desc Sets the background color of the page to black.
 *
 * @example $( myForm.elements ).hide()
 * @desc Hides all the input elements within a form
 *
 * @name $
 * @param Element|Array<Element> elems DOM element(s) to be encapsulated by a jQuery object.
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
 * See ready(Function) for details about the ready event. 
 * 
 * @example $(function(){
 *   // Document is ready
 * });
 * @desc Executes the function when the DOM is ready to be used.
 *
 * @example jQuery(function($) {
 *   // Your code using failsafe $ alias here...
 * });
 * @desc Uses both the shortcut for $(document).ready() and the argument
 * to write failsafe jQuery code using the $ alias, without relying on the
 * global alias.
 *
 * @name $
 * @param Function fn The function to execute when the DOM is ready.
 * @cat Core
 * @type jQuery
 * @see ready(Function)
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
	
	length: 0,

	/**
	 * Access all matched elements. This serves as a backwards-compatible
	 * way of accessing all matched elements (other than the jQuery object
	 * itself, which is, in fact, an array of elements).
	 *
	 * @example $("img").get();
	 * @before <img src="test1.jpg"/> <img src="test2.jpg"/>
	 * @result [ <img src="test1.jpg"/> <img src="test2.jpg"/> ]
	 * @desc Selects all images in the document and returns the DOM Elements as an Array
	 *
	 * @name get
	 * @type Array<Element>
	 * @cat Core
	 */

	/**
	 * Access a single matched element. num is used to access the
	 * Nth element matched.
	 *
	 * @example $("img").get(0);
	 * @before <img src="test1.jpg"/> <img src="test2.jpg"/>
	 * @result [ <img src="test1.jpg"/> ]
	 * @desc Selects all images in the document and returns the first one
	 *
	 * @name get
	 * @type Element
	 * @param Number num Access the element in the Nth position.
	 * @cat Core
	 */
	get: function( num ) {
		return num == undefined ?

			// Return a 'clean' array
			jQuery.makeArray( this ) :

			// Return just the object
			this[num];
	},
	
	/**
	 * Set the jQuery object to an array of elements, while maintaining
	 * the stack.
	 *
	 * @example $("img").pushStack([ document.body ]);
	 * @result $("img").pushStack() == [ document.body ]
	 *
	 * @private
	 * @name pushStack
	 * @type jQuery
	 * @param Elements elems An array of elements
	 * @cat Core
	 */
	pushStack: function( a ) {
		var ret = jQuery(a);
		ret.prevObject = this;
		return ret;
	},
	
	/**
	 * Set the jQuery object to an array of elements. This operation is
	 * completely destructive - be sure to use .pushStack() if you wish to maintain
	 * the jQuery stack.
	 *
	 * @example $("img").setArray([ document.body ]);
	 * @result $("img").setArray() == [ document.body ]
	 *
	 * @private
	 * @name setArray
	 * @type jQuery
	 * @param Elements elems An array of elements
	 * @cat Core
	 */
	setArray: function( a ) {
		this.length = 0;
		[].push.apply( this, a );
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
	 * @before <img/><img/>
	 * @result <img src="test0.jpg"/><img src="test1.jpg"/>
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
	 * @example $("*").index( $('#foobar')[0] ) 
	 * @before <div id="foobar"><b></b><span id="foo"></span></div>
	 * @result 0
	 * @desc Returns the index for the element with ID foobar
	 *
	 * @example $("*").index( $('#foo')[0] ) 
	 * @before <div id="foobar"><b></b><span id="foo"></span></div>
	 * @result 2
	 * @desc Returns the index for the element with ID foo within another element
	 *
	 * @example $("*").index( $('#bar')[0] ) 
	 * @before <div id="foobar"><b></b><span id="foo"></span></div>
	 * @result -1
	 * @desc Returns -1, as there is no element with ID bar
	 *
	 * @name index
	 * @type Number
	 * @param Element subject Object to search for
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
	 * @desc Returns the src attribute from the first image in the document.
	 *
	 * @name attr
	 * @type Object
	 * @param String name The name of the property to access.
	 * @cat DOM/Attributes
	 */

	/**
	 * Set a key/value object as properties to all matched elements.
	 *
	 * This serves as the best way to set a large number of properties
	 * on all matched elements.
	 *
	 * @example $("img").attr({ src: "test.jpg", alt: "Test Image" });
	 * @before <img/>
	 * @result <img src="test.jpg" alt="Test Image"/>
	 * @desc Sets src and alt attributes to all images.
	 *
	 * @name attr
	 * @type jQuery
	 * @param Map properties Key/value pairs to set as object properties.
	 * @cat DOM/Attributes
	 */

	/**
	 * Set a single property to a value, on all matched elements.
	 *
	 * Can compute values provided as ${formula}, see second example.
	 *
	 * Note that you can't set the name property of input elements in IE.
	 * Use $(html) or .append(html) or .html(html) to create elements
	 * on the fly including the name property.
	 *
	 * @example $("img").attr("src","test.jpg");
	 * @before <img/>
	 * @result <img src="test.jpg"/>
	 * @desc Sets src attribute to all images.
	 *
	 * @example $("img").attr("title", "${this.src}");
	 * @before <img src="test.jpg" />
	 * @result <img src="test.jpg" title="test.jpg" />
	 * @desc Sets title attribute from src attribute, a shortcut for attr(String,Function)
	 *
	 * @name attr
	 * @type jQuery
	 * @param String key The name of the property to set.
	 * @param Object value The value to set the property to.
	 * @cat DOM/Attributes
	 */
	 
	/**
	 * Set a single property to a computed value, on all matched elements.
	 *
	 * Instead of a value, a function is provided, that computes the value.
	 *
	 * @example $("img").attr("title", function() { return this.src });
	 * @before <img src="test.jpg" />
	 * @result <img src="test.jpg" title="test.jpg" />
	 * @desc Sets title attribute from src attribute.
	 *
	 * @example $("img").attr("title", function(index) { return this.title + (i + 1); });
	 * @before <img title="pic" /><img title="pic" /><img title="pic" />
	 * @result <img title="pic1" /><img title="pic2" /><img title="pic3" />
	 * @desc Enumerate title attribute.
	 *
	 * @name attr
	 * @type jQuery
	 * @param String key The name of the property to set.
	 * @param Function value A function returning the value to set.
	 * 	 	  Scope: Current element, argument: Index of current element
	 * @cat DOM/Attributes
	 */
	attr: function( key, value, type ) {
		var obj = key;
		
		// Look for the case where we're accessing a style value
		if ( key.constructor == String )
			if ( value == undefined )
				return this.length && jQuery[ type || "attr" ]( this[0], key ) || undefined;
			else {
				obj = {};
				obj[ key ] = value;
			}
		
		// Check to see if we're setting style values
		return this.each(function(index){
			// Set all the styles
			for ( var prop in obj )
				jQuery.attr(
					type ? this.style : this,
					prop, jQuery.prop(this, obj[prop], type, index, prop)
				);
		});
	},

	/**
	 * Access a style property on the first matched element.
	 * This method makes it easy to retrieve a style property value
	 * from the first matched element.
	 *
	 * @example $("p").css("color");
	 * @before <p style="color:red;">Test Paragraph.</p>
	 * @result "red"
	 * @desc Retrieves the color style of the first paragraph
	 *
	 * @example $("p").css("font-weight");
	 * @before <p style="font-weight: bold;">Test Paragraph.</p>
	 * @result "bold"
	 * @desc Retrieves the font-weight style of the first paragraph.
	 *
	 * @name css
	 * @type String
	 * @param String name The name of the property to access.
	 * @cat CSS
	 */

	/**
	 * Set a key/value object as style properties to all matched elements.
	 *
	 * This serves as the best way to set a large number of style properties
	 * on all matched elements.
	 *
	 * @example $("p").css({ color: "red", background: "blue" });
	 * @before <p>Test Paragraph.</p>
	 * @result <p style="color:red; background:blue;">Test Paragraph.</p>
	 * @desc Sets color and background styles to all p elements.
	 *
	 * @name css
	 * @type jQuery
	 * @param Map properties Key/value pairs to set as style properties.
	 * @cat CSS
	 */

	/**
	 * Set a single style property to a value, on all matched elements.
	 * If a number is provided, it is automatically converted into a pixel value.
	 *
	 * @example $("p").css("color","red");
	 * @before <p>Test Paragraph.</p>
	 * @result <p style="color:red;">Test Paragraph.</p>
	 * @desc Changes the color of all paragraphs to red
	 *
	 * @example $("p").css("left",30);
	 * @before <p>Test Paragraph.</p>
	 * @result <p style="left:30px;">Test Paragraph.</p>
	 * @desc Changes the left of all paragraphs to "30px"
	 *
	 * @name css
	 * @type jQuery
	 * @param String key The name of the property to set.
	 * @param String|Number value The value to set the property to.
	 * @cat CSS
	 */
	css: function( key, value ) {
		return this.attr( key, value, "curCSS" );
	},

	/**
	 * Get the text contents of all matched elements. The result is
	 * a string that contains the combined text contents of all matched
	 * elements. This method works on both HTML and XML documents.
	 *
	 * @example $("p").text();
	 * @before <p><b>Test</b> Paragraph.</p><p>Paraparagraph</p>
	 * @result Test Paragraph.Paraparagraph
	 * @desc Gets the concatenated text of all paragraphs
	 *
	 * @name text
	 * @type String
	 * @cat DOM/Attributes
	 */

	/**
	 * Set the text contents of all matched elements.
	 *
	 * Similar to html(), but escapes HTML (replace "<" and ">" with their
	 * HTML entities).
	 *
	 * @example $("p").text("<b>Some</b> new text.");
	 * @before <p>Test Paragraph.</p>
	 * @result <p>&lt;b&gt;Some&lt;/b&gt; new text.</p>
	 * @desc Sets the text of all paragraphs.
	 *
	 * @example $("p").text("<b>Some</b> new text.", true);
	 * @before <p>Test Paragraph.</p>
	 * @result <p>Some new text.</p>
	 * @desc Sets the text of all paragraphs.
	 *
	 * @name text
	 * @type String
	 * @param String val The text value to set the contents of the element to.
	 * @cat DOM/Attributes
	 */
	text: function(e) {
		if ( typeof e == "string" )
			return this.empty().append( document.createTextNode( e ) );

		var t = "";
		jQuery.each( e || this, function(){
			jQuery.each( this.childNodes, function(){
				if ( this.nodeType != 8 )
					t += this.nodeType != 1 ?
						this.nodeValue : jQuery.fn.text([ this ]);
			});
		});
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
	 * @param Element elem A DOM element that will be wrapped around the target.
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
	 * Append content to the inside of every matched element.
	 *
	 * This operation is similar to doing an appendChild to all the
	 * specified elements, adding them into the document.
	 *
	 * @example $("p").append("<b>Hello</b>");
	 * @before <p>I would like to say: </p>
	 * @result <p>I would like to say: <b>Hello</b></p>
	 * @desc Appends some HTML to all paragraphs.
	 *
	 * @example $("p").append( $("#foo")[0] );
	 * @before <p>I would like to say: </p><b id="foo">Hello</b>
	 * @result <p>I would like to say: <b id="foo">Hello</b></p>
	 * @desc Appends an Element to all paragraphs.
	 *
	 * @example $("p").append( $("b") );
	 * @before <p>I would like to say: </p><b>Hello</b>
	 * @result <p>I would like to say: <b>Hello</b></p>
	 * @desc Appends a jQuery object (similar to an Array of DOM Elements) to all paragraphs.
	 *
	 * @name append
	 * @type jQuery
	 * @param <Content> content Content to append to the target
	 * @cat DOM/Manipulation
	 * @see prepend(<Content>)
	 * @see before(<Content>)
	 * @see after(<Content>)
	 */
	append: function() {
		return this.domManip(arguments, true, 1, function(a){
			this.appendChild( a );
		});
	},

	/**
	 * Prepend content to the inside of every matched element.
	 *
	 * This operation is the best way to insert elements
	 * inside, at the beginning, of all matched elements.
	 *
	 * @example $("p").prepend("<b>Hello</b>");
	 * @before <p>I would like to say: </p>
	 * @result <p><b>Hello</b>I would like to say: </p>
	 * @desc Prepends some HTML to all paragraphs.
	 *
	 * @example $("p").prepend( $("#foo")[0] );
	 * @before <p>I would like to say: </p><b id="foo">Hello</b>
	 * @result <p><b id="foo">Hello</b>I would like to say: </p>
	 * @desc Prepends an Element to all paragraphs.
	 *	
	 * @example $("p").prepend( $("b") );
	 * @before <p>I would like to say: </p><b>Hello</b>
	 * @result <p><b>Hello</b>I would like to say: </p>
	 * @desc Prepends a jQuery object (similar to an Array of DOM Elements) to all paragraphs.
	 *
	 * @name prepend
	 * @type jQuery
	 * @param <Content> content Content to prepend to the target.
	 * @cat DOM/Manipulation
	 * @see append(<Content>)
	 * @see before(<Content>)
	 * @see after(<Content>)
	 */
	prepend: function() {
		return this.domManip(arguments, true, -1, function(a){
			this.insertBefore( a, this.firstChild );
		});
	},
	
	/**
	 * Insert content before each of the matched elements.
	 *
	 * @example $("p").before("<b>Hello</b>");
	 * @before <p>I would like to say: </p>
	 * @result <b>Hello</b><p>I would like to say: </p>
	 * @desc Inserts some HTML before all paragraphs.
	 *
	 * @example $("p").before( $("#foo")[0] );
	 * @before <p>I would like to say: </p><b id="foo">Hello</b>
	 * @result <b id="foo">Hello</b><p>I would like to say: </p>
	 * @desc Inserts an Element before all paragraphs.
	 *
	 * @example $("p").before( $("b") );
	 * @before <p>I would like to say: </p><b>Hello</b>
	 * @result <b>Hello</b><p>I would like to say: </p>
	 * @desc Inserts a jQuery object (similar to an Array of DOM Elements) before all paragraphs.
	 *
	 * @name before
	 * @type jQuery
	 * @param <Content> content Content to insert before each target.
	 * @cat DOM/Manipulation
	 * @see append(<Content>)
	 * @see prepend(<Content>)
	 * @see after(<Content>)
	 */
	before: function() {
		return this.domManip(arguments, false, 1, function(a){
			this.parentNode.insertBefore( a, this );
		});
	},

	/**
	 * Insert content after each of the matched elements.
	 *
	 * @example $("p").after("<b>Hello</b>");
	 * @before <p>I would like to say: </p>
	 * @result <p>I would like to say: </p><b>Hello</b>
	 * @desc Inserts some HTML after all paragraphs.
	 *
	 * @example $("p").after( $("#foo")[0] );
	 * @before <b id="foo">Hello</b><p>I would like to say: </p>
	 * @result <p>I would like to say: </p><b id="foo">Hello</b>
	 * @desc Inserts an Element after all paragraphs.
	 *
	 * @example $("p").after( $("b") );
	 * @before <b>Hello</b><p>I would like to say: </p>
	 * @result <p>I would like to say: </p><b>Hello</b>
	 * @desc Inserts a jQuery object (similar to an Array of DOM Elements) after all paragraphs.
	 *
	 * @name after
	 * @type jQuery
	 * @param <Content> content Content to insert after each target.
	 * @cat DOM/Manipulation
	 * @see append(<Content>)
	 * @see prepend(<Content>)
	 * @see before(<Content>)
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
	 * If there was no destructive operation before, an empty set is returned.
	 *
	 * @example $("p").find("span").end();
	 * @before <p><span>Hello</span>, how are you?</p>
	 * @result [ <p>...</p> ]
	 * @desc Selects all paragraphs, finds span elements inside these, and reverts the
	 * selection back to the paragraphs.
	 *
	 * @name end
	 * @type jQuery
	 * @cat DOM/Traversing
	 */
	end: function() {
		return this.prevObject || jQuery([]);
	},

	/**
	 * Searches for all elements that match the specified expression.
	 
	 * This method is a good way to find additional descendant
	 * elements with which to process.
	 *
	 * All searching is done using a jQuery expression. The expression can be
	 * written using CSS 1-3 Selector syntax, or basic XPath.
	 *
	 * @example $("p").find("span");
	 * @before <p><span>Hello</span>, how are you?</p>
	 * @result [ <span>Hello</span> ]
	 * @desc Starts with all paragraphs and searches for descendant span
	 * elements, same as $("p span")
	 *
	 * @name find
	 * @type jQuery
	 * @param String expr An expression to search with.
	 * @cat DOM/Traversing
	 */
	find: function(t) {
		return this.pushStack( jQuery.map( this, function(a){
			return jQuery.find(t,a);
		}), t );
	},

	/**
	 * Clone matched DOM Elements and select the clones. 
	 *
	 * This is useful for moving copies of the elements to another
	 * location in the DOM.
	 *
	 * @example $("b").clone().prependTo("p");
	 * @before <b>Hello</b><p>, how are you?</p>
	 * @result <b>Hello</b><p><b>Hello</b>, how are you?</p>
	 * @desc Clones all b elements (and selects the clones) and prepends them to all paragraphs.
	 *
	 * @name clone
	 * @type jQuery
	 * @param Boolean deep (Optional) Set to false if you don't want to clone all descendant nodes, in addition to the element itself.
	 * @cat DOM/Manipulation
	 */
	clone: function(deep) {
		return this.pushStack( jQuery.map( this, function(a){
			var a = a.cloneNode( deep != undefined ? deep : true );
			a.$events = null; // drop $events expando to avoid firing incorrect events
			return a;
		}) );
	},

	/**
	 * Removes all elements from the set of matched elements that do not
	 * match the specified expression(s). This method is used to narrow down
	 * the results of a search.
	 *
	 * Provide a comma-separated list of expressions to apply multiple filters at once.
	 *
	 * @example $("p").filter(".selected")
	 * @before <p class="selected">Hello</p><p>How are you?</p>
	 * @result [ <p class="selected">Hello</p> ]
	 * @desc Selects all paragraphs and removes those without a class "selected".
	 *
	 * @example $("p").filter(".selected, :first")
	 * @before <p>Hello</p><p>Hello Again</p><p class="selected">And Again</p>
	 * @result [ <p>Hello</p>, <p class="selected">And Again</p> ]
	 * @desc Selects all paragraphs and removes those without class "selected" and being the first one.
	 *
	 * @name filter
	 * @type jQuery
	 * @param String expression Expression(s) to search with.
	 * @cat DOM/Traversing
	 */
	 
	/**
	 * Removes all elements from the set of matched elements that do not
	 * pass the specified filter. This method is used to narrow down
	 * the results of a search.
	 *
	 * @example $("p").filter(function(index) {
	 *   return $("ol", this).length == 0;
	 * })
	 * @before <p><ol><li>Hello</li></ol></p><p>How are you?</p>
	 * @result [ <p>How are you?</p> ]
	 * @desc Remove all elements that have a child ol element
	 *
	 * @name filter
	 * @type jQuery
	 * @param Function filter A function to use for filtering
	 * @cat DOM/Traversing
	 */
	filter: function(t) {
		return this.pushStack(
			jQuery.isFunction( t ) &&
			jQuery.grep(this, function(el, index){
				return t.apply(el, [index])
			}) ||

			jQuery.multiFilter(t,this) );
	},

	/**
	 * Removes the specified Element from the set of matched elements. This
	 * method is used to remove a single Element from a jQuery object.
	 *
	 * @example $("p").not( $("#selected")[0] )
	 * @before <p>Hello</p><p id="selected">Hello Again</p>
	 * @result [ <p>Hello</p> ]
	 * @desc Removes the element with the ID "selected" from the set of all paragraphs.
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
	 * @desc Removes the element with the ID "selected" from the set of all paragraphs.
	 *
	 * @name not
	 * @type jQuery
	 * @param String expr An expression with which to remove matching elements
	 * @cat DOM/Traversing
	 */

	/**
	 * Removes any elements inside the array of elements from the set
	 * of matched elements. This method is used to remove one or more
	 * elements from a jQuery object.
	 *
	 * @example $("p").not( $("div p.selected") )
	 * @before <div><p>Hello</p><p class="selected">Hello Again</p></div>
	 * @result [ <p>Hello</p> ]
	 * @desc Removes all elements that match "div p.selected" from the total set of all paragraphs.
	 *
	 * @name not
	 * @type jQuery
	 * @param jQuery elems A set of elements to remove from the jQuery set of matched elements.
	 * @cat DOM/Traversing
	 */
	not: function(t) {
		return this.pushStack(
			t.constructor == String &&
			jQuery.multiFilter(t, this, true) ||

			jQuery.grep(this, function(a) {
				return ( t.constructor == Array || t.jquery )
					? jQuery.inArray( a, t ) < 0
					: a != t;
			})
		);
	},

	/**
	 * Adds more elements, matched by the given expression,
	 * to the set of matched elements.
	 *
	 * @example $("p").add("span")
	 * @before <p>Hello</p><span>Hello Again</span>
	 * @result [ <p>Hello</p>, <span>Hello Again</span> ]
	 *
	 * @name add
	 * @type jQuery
	 * @param String expr An expression whose matched elements are added
	 * @cat DOM/Traversing
	 */
	 
	/**
	 * Adds more elements, created on the fly, to the set of
	 * matched elements.
	 *
	 * @example $("p").add("<span>Again</span>")
	 * @before <p>Hello</p>
	 * @result [ <p>Hello</p>, <span>Again</span> ]
	 *
	 * @name add
	 * @type jQuery
	 * @param String html A string of HTML to create on the fly.
	 * @cat DOM/Traversing
	 */

	/**
	 * Adds one or more Elements to the set of matched elements.
	 *
	 * @example $("p").add( document.getElementById("a") )
	 * @before <p>Hello</p><p><span id="a">Hello Again</span></p>
	 * @result [ <p>Hello</p>, <span id="a">Hello Again</span> ]
	 *
	 * @example $("p").add( document.forms[0].elements )
	 * @before <p>Hello</p><p><form><input/><button/></form>
	 * @result [ <p>Hello</p>, <input/>, <button/> ]
	 *
	 * @name add
	 * @type jQuery
	 * @param Element|Array<Element> elements One or more Elements to add
	 * @cat DOM/Traversing
	 */
	add: function(t) {
		return this.pushStack( jQuery.merge(
			this.get(),
			t.constructor == String ?
				jQuery(t).get() :
				t.length != undefined && (!t.nodeName || t.nodeName == "FORM") ?
					t : [t] )
		);
	},

	/**
	 * Checks the current selection against an expression and returns true,
	 * if at least one element of the selection fits the given expression.
	 *
	 * Does return false, if no element fits or the expression is not valid.
	 *
	 * filter(String) is used internally, therefore all rules that apply there
	 * apply here, too.
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
	 * @name is
	 * @type Boolean
	 * @param String expr The expression with which to filter
	 * @cat DOM/Traversing
	 */
	is: function(expr) {
		return expr ? jQuery.filter(expr,this).r.length > 0 : false;
	},
	
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
	val: function( val ) {
		return val == undefined ?
			( this.length ? this[0].value : null ) :
			this.attr( "value", val );
	},
	
	/**
	 * Get the html contents of the first matched element.
	 * This property is not available on XML documents.
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
	 * This property is not available on XML documents.
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
	html: function( val ) {
		return val == undefined ?
			( this.length ? this[0].innerHTML : null ) :
			this.empty().append( val );
	},
	
	/**
	 * @private
	 * @name domManip
	 * @param Array args
	 * @param Boolean table Insert TBODY in TABLEs if one is not found.
	 * @param Number dir If dir<0, process args in reverse order.
	 * @param Function fn The function doing the DOM manipulation.
	 * @type jQuery
	 * @cat Core
	 */
	domManip: function(args, table, dir, fn){
		var clone = this.length > 1; 
		var a = jQuery.clean(args);
		if ( dir < 0 )
			a.reverse();

		return this.each(function(){
			var obj = this;

			if ( table && jQuery.nodeName(this, "table") && jQuery.nodeName(a[0], "tr") )
				obj = this.getElementsByTagName("tbody")[0] || this.appendChild(document.createElement("tbody"));

			jQuery.each( a, function(){
				fn.apply( obj, [ clone ? this.cloneNode(true) : this ] );
			});

		});
	}
};

/**
 * Extends the jQuery object itself. Can be used to add functions into
 * the jQuery namespace and to add plugin methods (plugins).
 * 
 * @example jQuery.fn.extend({
 *   check: function() {
 *     return this.each(function() { this.checked = true; });
 *   },
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
 * @cat JavaScript
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
	 * Run this function to give control of the $ variable back
	 * to whichever library first implemented it. This helps to make 
	 * sure that jQuery doesn't conflict with the $ object
	 * of other libraries.
	 *
	 * By using this function, you will only be able to access jQuery
	 * using the 'jQuery' variable. For example, where you used to do
	 * $("div p"), you now must do jQuery("div p").
	 *
	 * @example jQuery.noConflict();
	 * // Do something with jQuery
	 * jQuery("div p").hide();
	 * // Do something with another library's $()
	 * $("content").style.display = 'none';
	 * @desc Maps the original object that was referenced by $ back to $
	 *
	 * @example jQuery.noConflict();
	 * (function($) { 
	 *   $(function() {
	 *     // more code using $ as alias to jQuery
	 *   });
	 * })(jQuery);
	 * // other code using $ as an alias to the other library
	 * @desc Reverts the $ alias and then creates and executes a
	 * function to provide the $ as a jQuery alias inside the functions
	 * scope. Inside the function the original $ object is not available.
	 * This works well for most plugins that don't rely on any other library.
	 * 
	 *
	 * @name $.noConflict
	 * @type undefined
	 * @cat Core 
	 */
	noConflict: function() {
		if ( jQuery._$ )
			$ = jQuery._$;
		return jQuery;
	},

	// This may seem like some crazy code, but trust me when I say that this
	// is the only cross-browser way to do this. --John
	isFunction: function( fn ) {
		return !!fn && typeof fn != "string" &&
			typeof fn[0] == "undefined" && /function/i.test( fn + "" );
	},
	
	// check if an element is in a XML document
	isXMLDoc: function(elem) {
		return elem.tagName && elem.ownerDocument && !elem.ownerDocument.body;
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
	},

	/**
	 * A generic iterator function, which can be used to seemlessly
	 * iterate over both objects and arrays. This function is not the same
	 * as $().each() - which is used to iterate, exclusively, over a jQuery
	 * object. This function can be used to iterate over anything.
	 *
	 * The callback has two arguments:the key (objects) or index (arrays) as first
	 * the first, and the value as the second.
	 *
	 * @example $.each( [0,1,2], function(i, n){
	 *   alert( "Item #" + i + ": " + n );
	 * });
	 * @desc This is an example of iterating over the items in an array,
	 * accessing both the current item and its index.
	 *
	 * @example $.each( { name: "John", lang: "JS" }, function(i, n){
	 *   alert( "Name: " + i + ", Value: " + n );
	 * });
	 *
	 * @desc This is an example of iterating over the properties in an
	 * Object, accessing both the current item and its key.
	 *
	 * @name $.each
	 * @param Object obj The object, or array, to iterate over.
	 * @param Function fn The function that will be executed on every object.
	 * @type Object
	 * @cat JavaScript
	 */
	// args is for internal usage only
	each: function( obj, fn, args ) {
		if ( obj.length == undefined )
			for ( var i in obj )
				fn.apply( obj[i], args || [i, obj[i]] );
		else
			for ( var i = 0, ol = obj.length; i < ol; i++ )
				if ( fn.apply( obj[i], args || [i, obj[i]] ) === false ) break;
		return obj;
	},
	
	prop: function(elem, value, type, index, prop){
			// Handle executable functions
			if ( jQuery.isFunction( value ) )
				value = value.call( elem, [index] );
				
			// exclude the following css properties to add px
			var exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;

			// Handle passing in a number to a CSS property
			return value && value.constructor == Number && type == "curCSS" && !exclude.test(prop) ?
				value + "px" :
				value;
	},

	className: {
		// internal only, use addClass("class")
		add: function( elem, c ){
			jQuery.each( c.split(/\s+/), function(i, cur){
				if ( !jQuery.className.has( elem.className, cur ) )
					elem.className += ( elem.className ? " " : "" ) + cur;
			});
		},

		// internal only, use removeClass("class")
		remove: function( elem, c ){
			elem.className = c ?
				jQuery.grep( elem.className.split(/\s+/), function(cur){
					return !jQuery.className.has( c, cur );	
				}).join(" ") : "";
		},

		// internal only, use is(".class")
		has: function( t, c ) {
			t = t.className || t;
			// escape regex characters
			c = c.replace(/([\.\\\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
			return t && new RegExp("(^|\\s)" + c + "(\\s|$)").test( t );
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

			jQuery.each( d, function(){
				old["padding" + this] = 0;
				old["border" + this + "Width"] = 0;
			});

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
		
		if (prop == "opacity" && jQuery.browser.msie)
			return jQuery.attr(elem.style, "opacity");
			
		if (prop == "float" || prop == "cssFloat")
		    prop = jQuery.browser.msie ? "styleFloat" : "cssFloat";

		if (!force && elem.style[prop])
			ret = elem.style[prop];

		else if (document.defaultView && document.defaultView.getComputedStyle) {

			if (prop == "cssFloat" || prop == "styleFloat")
				prop = "float";

			prop = prop.replace(/([A-Z])/g,"-$1").toLowerCase();
			var cur = document.defaultView.getComputedStyle(elem, null);

			if ( cur )
				ret = cur.getPropertyValue(prop);
			else if ( prop == "display" )
				ret = "none";
			else
				jQuery.swap(elem, { display: "block" }, function() {
				    var c = document.defaultView.getComputedStyle(this, "");
				    ret = c && c.getPropertyValue(prop) || "";
				});

		} else if (elem.currentStyle) {

			var newProp = prop.replace(/\-(\w)/g,function(m,c){return c.toUpperCase();});
			ret = elem.currentStyle[prop] || elem.currentStyle[newProp];
			
		}

		return ret;
	},
	
	clean: function(a) {
		var r = [];

		jQuery.each( a, function(i,arg){
			if ( !arg ) return;

			if ( arg.constructor == Number )
				arg = arg.toString();
			
			 // Convert html string into DOM nodes
			if ( typeof arg == "string" ) {
				// Trim whitespace, otherwise indexOf won't work as expected
				var s = jQuery.trim(arg), div = document.createElement("div"), tb = [];

				var wrap =
					 // option or optgroup
					!s.indexOf("<opt") &&
					[1, "<select>", "</select>"] ||
					
					(!s.indexOf("<thead") || !s.indexOf("<tbody") || !s.indexOf("<tfoot")) &&
					[1, "<table>", "</table>"] ||
					
					!s.indexOf("<tr") &&
					[2, "<table><tbody>", "</tbody></table>"] ||
					
				 	// <thead> matched above
					(!s.indexOf("<td") || !s.indexOf("<th")) &&
					[3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
					
					[0,"",""];

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + s + wrap[2];
				
				// Move to the right depth
				while ( wrap[0]-- )
					div = div.firstChild;
				
				// Remove IE's autoinserted <tbody> from table fragments
				if ( jQuery.browser.msie ) {
					
					// String was a <table>, *may* have spurious <tbody>
					if ( !s.indexOf("<table") && s.indexOf("<tbody") < 0 ) 
						tb = div.firstChild && div.firstChild.childNodes;
						
					// String was a bare <thead> or <tfoot>
					else if ( wrap[1] == "<table>" && s.indexOf("<tbody") < 0 )
						tb = div.childNodes;

					for ( var n = tb.length-1; n >= 0 ; --n )
						if ( jQuery.nodeName(tb[n], "tbody") && !tb[n].childNodes.length )
							tb[n].parentNode.removeChild(tb[n]);
					
				}
				
				arg = div.childNodes;
			}

			if ( arg.length === 0 )
				return;
			
			if ( arg[0] == undefined )
				r.push( arg );
			else
				r = jQuery.merge( r, arg );

		});

		return r;
	},
	
	attr: function(elem, name, value){
		var fix = jQuery.isXMLDoc(elem) ? {} : {
			"for": "htmlFor",
			"class": "className",
			"float": jQuery.browser.msie ? "styleFloat" : "cssFloat",
			cssFloat: jQuery.browser.msie ? "styleFloat" : "cssFloat",
			innerHTML: "innerHTML",
			className: "className",
			value: "value",
			disabled: "disabled",
			checked: "checked",
			readonly: "readOnly",
			selected: "selected"
		};
		
		// IE actually uses filters for opacity ... elem is actually elem.style
		if ( name == "opacity" && jQuery.browser.msie && value != undefined ) {
			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			elem.zoom = 1; 

			// Set the alpha filter to set the opacity
			return elem.filter = elem.filter.replace(/alpha\([^\)]*\)/gi,"") +
				( value == 1 ? "" : "alpha(opacity=" + value * 100 + ")" );

		} else if ( name == "opacity" && jQuery.browser.msie )
			return elem.filter ? 
				parseFloat( elem.filter.match(/alpha\(opacity=(.*)\)/)[1] ) / 100 : 1;
		
		// Mozilla doesn't play well with opacity 1
		if ( name == "opacity" && jQuery.browser.mozilla && value == 1 )
			value = 0.9999;
			

		// Certain attributes only work when accessed via the old DOM 0 way
		if ( fix[name] ) {
			if ( value != undefined ) elem[fix[name]] = value;
			return elem[fix[name]];

		} else if ( value == undefined && jQuery.browser.msie && jQuery.nodeName(elem, "form") && (name == "action" || name == "method") )
			return elem.getAttributeNode(name).nodeValue;

		// IE elem.getAttribute passes even for style
		else if ( elem.tagName ) {
			if ( value != undefined ) elem.setAttribute( name, value );
			if ( jQuery.browser.msie && /href|src/.test(name) && !jQuery.isXMLDoc(elem) ) 
				return elem.getAttribute( name, 2 );
			return elem.getAttribute( name );

		// elem is actually elem.style ... set the style
		} else {
			name = name.replace(/-([a-z])/ig,function(z,b){return b.toUpperCase();});
			if ( value != undefined ) elem[name] = value;
			return elem[name];
		}
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
	 * @cat JavaScript
	 */
	trim: function(t){
		return t.replace(/^\s+|\s+$/g, "");
	},

	makeArray: function( a ) {
		var r = [];

		if ( a.constructor != Array )
			for ( var i = 0, al = a.length; i < al; i++ )
				r.push( a[i] );
		else
			r = a.slice( 0 );

		return r;
	},

	inArray: function( b, a ) {
		for ( var i = 0, al = a.length; i < al; i++ )
			if ( a[i] == b )
				return i;
		return -1;
	},

	/**
	 * Merge two arrays together, removing all duplicates.
	 *
	 * The result is the altered first argument with
	 * the unique elements from the second array added.
	 *
	 * @example $.merge( [0,1,2], [2,3,4] )
	 * @result [0,1,2,3,4]
	 * @desc Merges two arrays, removing the duplicate 2
	 *
	 * @example var array = [3,2,1];
	 * $.merge( array, [4,3,2] )
	 * @result array == [3,2,1,4]
	 * @desc Merges two arrays, removing the duplicates 3 and 2
	 *
	 * @name $.merge
	 * @type Array
	 * @param Array first The first array to merge, the unique elements of second added.
	 * @param Array second The second array to merge into the first, unaltered.
	 * @cat JavaScript
	 */
	merge: function(first, second) {
		var r = [].slice.call( first, 0 );

		// Now check for duplicates between the two arrays
		// and only add the unique items
		for ( var i = 0, sl = second.length; i < sl; i++ )
			// Check for duplicates
			if ( jQuery.inArray( second[i], r ) == -1 )
				// The item is unique, add it
				first.push( second[i] );

		return first;
	},

	/**
	 * Filter items out of an array, by using a filter function.
	 *
	 * The specified function will be passed two arguments: The
	 * current array item and the index of the item in the array. The
	 * function must return 'true' to keep the item in the array, 
	 * false to remove it.
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
	 * @cat JavaScript
	 */
	grep: function(elems, fn, inv) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( typeof fn == "string" )
			fn = new Function("a","i","return " + fn);

		var result = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, el = elems.length; i < el; i++ )
			if ( !inv && fn(elems[i],i) || inv && !fn(elems[i],i) )
				result.push( elems[i] );

		return result;
	},

	/**
	 * Translate all items in an array to another array of items.
	 *
	 * The translation function that is provided to this method is 
	 * called for each item in the array and is passed one argument: 
	 * The item to be translated.
	 *
	 * The function can then return the translated value, 'null'
	 * (to remove the item), or  an array of values - which will
	 * be flattened into the full array.
	 *
	 * @example $.map( [0,1,2], function(i){
	 *   return i + 4;
	 * });
	 * @result [4, 5, 6]
	 * @desc Maps the original array to a new one and adds 4 to each value.
	 *
	 * @example $.map( [0,1,2], function(i){
	 *   return i > 0 ? i + 1 : null;
	 * });
	 * @result [2, 3]
	 * @desc Maps the original array to a new one and adds 1 to each
	 * value if it is bigger then zero, otherwise it's removed-
	 * 
	 * @example $.map( [0,1,2], function(i){
	 *   return [ i, i + 1 ];
	 * });
	 * @result [0, 1, 1, 2, 2, 3]
	 * @desc Maps the original array to a new one, each element is added
	 * with it's original value and the value plus one.
	 *
	 * @name $.map
	 * @type Array
	 * @param Array array The Array to translate.
	 * @param Function fn The function to process each item against.
	 * @cat JavaScript
	 */
	map: function(elems, fn) {
		// If a string is passed in for the function, make a function
		// for it (a handy shortcut)
		if ( typeof fn == "string" )
			fn = new Function("a","return " + fn);

		var result = [], r = [];

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, el = elems.length; i < el; i++ ) {
			var val = fn(elems[i],i);

			if ( val !== null && val != undefined ) {
				if ( val.constructor != Array ) val = [val];
				result = result.concat( val );
			}
		}

		var r = result.length ? [ result[0] ] : [];

		check: for ( var i = 1, rl = result.length; i < rl; i++ ) {
			for ( var j = 0; j < i; j++ )
				if ( result[i] == r[j] )
					continue check;

			r.push( result[i] );
		}

		return r;
	}
});

/**
 * Contains flags for the useragent, read from navigator.userAgent.
 * Available flags are: safari, opera, msie, mozilla
 *
 * This property is available before the DOM is ready, therefore you can
 * use it to add ready events only for certain browsers.
 *
 * There are situations where object detections is not reliable enough, in that
 * cases it makes sense to use browser detection. Simply try to avoid both!
 *
 * A combination of browser and object detection yields quite reliable results.
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
 * @cat JavaScript
 */
 
/*
 * Whether the W3C compliant box model is being used.
 *
 * @property
 * @name $.boxModel
 * @type Boolean
 * @cat JavaScript
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

/**
 * Get a set of elements containing the unique parents of the matched
 * set of elements.
 *
 * Can be filtered with an optional expressions.
 *
 * @example $("p").parent()
 * @before <div><p>Hello</p><p>Hello</p></div>
 * @result [ <div><p>Hello</p><p>Hello</p></div> ]
 * @desc Find the parent element of each paragraph.
 *
 * @example $("p").parent(".selected")
 * @before <div><p>Hello</p></div><div class="selected"><p>Hello Again</p></div>
 * @result [ <div class="selected"><p>Hello Again</p></div> ]
 * @desc Find the parent element of each paragraph with a class "selected".
 *
 * @name parent
 * @type jQuery
 * @param String expr (optional) An expression to filter the parents with
 * @cat DOM/Traversing
 */

/**
 * Get a set of elements containing the unique ancestors of the matched
 * set of elements (except for the root element).
 *
 * Can be filtered with an optional expressions.
 *
 * @example $("span").parents()
 * @before <html><body><div><p><span>Hello</span></p><span>Hello Again</span></div></body></html>
 * @result [ <body>...</body>, <div>...</div>, <p><span>Hello</span></p> ]
 * @desc Find all parent elements of each span.
 *
 * @example $("span").parents("p")
 * @before <html><body><div><p><span>Hello</span></p><span>Hello Again</span></div></body></html>
 * @result [ <p><span>Hello</span></p> ]
 * @desc Find all parent elements of each span that is a paragraph.
 *
 * @name parents
 * @type jQuery
 * @param String expr (optional) An expression to filter the ancestors with
 * @cat DOM/Traversing
 */

/**
 * Get a set of elements containing the unique next siblings of each of the
 * matched set of elements.
 *
 * It only returns the very next sibling, not all next siblings.
 *
 * Can be filtered with an optional expressions.
 *
 * @example $("p").next()
 * @before <p>Hello</p><p>Hello Again</p><div><span>And Again</span></div>
 * @result [ <p>Hello Again</p>, <div><span>And Again</span></div> ]
 * @desc Find the very next sibling of each paragraph.
 *
 * @example $("p").next(".selected")
 * @before <p>Hello</p><p class="selected">Hello Again</p><div><span>And Again</span></div>
 * @result [ <p class="selected">Hello Again</p> ]
 * @desc Find the very next sibling of each paragraph that has a class "selected".
 *
 * @name next
 * @type jQuery
 * @param String expr (optional) An expression to filter the next Elements with
 * @cat DOM/Traversing
 */

/**
 * Get a set of elements containing the unique previous siblings of each of the
 * matched set of elements.
 *
 * Can be filtered with an optional expressions.
 *
 * It only returns the immediately previous sibling, not all previous siblings.
 *
 * @example $("p").prev()
 * @before <p>Hello</p><div><span>Hello Again</span></div><p>And Again</p>
 * @result [ <div><span>Hello Again</span></div> ]
 * @desc Find the very previous sibling of each paragraph.
 *
 * @example $("p").prev(".selected")
 * @before <div><span>Hello</span></div><p class="selected">Hello Again</p><p>And Again</p>
 * @result [ <div><span>Hello</span></div> ]
 * @desc Find the very previous sibling of each paragraph that has a class "selected".
 *
 * @name prev
 * @type jQuery
 * @param String expr (optional) An expression to filter the previous Elements with
 * @cat DOM/Traversing
 */

/**
 * Get a set of elements containing all of the unique siblings of each of the
 * matched set of elements.
 *
 * Can be filtered with an optional expressions.
 *
 * @example $("div").siblings()
 * @before <p>Hello</p><div><span>Hello Again</span></div><p>And Again</p>
 * @result [ <p>Hello</p>, <p>And Again</p> ]
 * @desc Find all siblings of each div.
 *
 * @example $("div").siblings(".selected")
 * @before <div><span>Hello</span></div><p class="selected">Hello Again</p><p>And Again</p>
 * @result [ <p class="selected">Hello Again</p> ]
 * @desc Find all siblings with a class "selected" of each div.
 *
 * @name siblings
 * @type jQuery
 * @param String expr (optional) An expression to filter the sibling Elements with
 * @cat DOM/Traversing
 */

/**
 * Get a set of elements containing all of the unique children of each of the
 * matched set of elements.
 *
 * Can be filtered with an optional expressions.
 *
 * @example $("div").children()
 * @before <p>Hello</p><div><span>Hello Again</span></div><p>And Again</p>
 * @result [ <span>Hello Again</span> ]
 * @desc Find all children of each div.
 *
 * @example $("div").children(".selected")
 * @before <div><span>Hello</span><p class="selected">Hello Again</p><p>And Again</p></div>
 * @result [ <p class="selected">Hello Again</p> ]
 * @desc Find all children with a class "selected" of each div.
 *
 * @name children
 * @type jQuery
 * @param String expr (optional) An expression to filter the child Elements with
 * @cat DOM/Traversing
 */
jQuery.each({
	parent: "a.parentNode",
	parents: "jQuery.parents(a)",
	next: "jQuery.nth(a,2,'nextSibling')",
	prev: "jQuery.nth(a,2,'previousSibling')",
	siblings: "jQuery.sibling(a.parentNode.firstChild,a)",
	children: "jQuery.sibling(a.firstChild)"
}, function(i,n){
	jQuery.fn[ i ] = function(a) {
		var ret = jQuery.map(this,n);
		if ( a && typeof a == "string" )
			ret = jQuery.multiFilter(a,ret);
		return this.pushStack( ret );
	};
});

/**
 * Append all of the matched elements to another, specified, set of elements.
 * This operation is, essentially, the reverse of doing a regular
 * $(A).append(B), in that instead of appending B to A, you're appending
 * A to B.
 *
 * @example $("p").appendTo("#foo");
 * @before <p>I would like to say: </p><div id="foo"></div>
 * @result <div id="foo"><p>I would like to say: </p></div>
 * @desc Appends all paragraphs to the element with the ID "foo"
 *
 * @name appendTo
 * @type jQuery
 * @param <Content> content Content to append to the selected element to.
 * @cat DOM/Manipulation
 * @see append(<Content>)
 */

/**
 * Prepend all of the matched elements to another, specified, set of elements.
 * This operation is, essentially, the reverse of doing a regular
 * $(A).prepend(B), in that instead of prepending B to A, you're prepending
 * A to B.
 *
 * @example $("p").prependTo("#foo");
 * @before <p>I would like to say: </p><div id="foo"><b>Hello</b></div>
 * @result <div id="foo"><p>I would like to say: </p><b>Hello</b></div>
 * @desc Prepends all paragraphs to the element with the ID "foo"
 *
 * @name prependTo
 * @type jQuery
 * @param <Content> content Content to prepend to the selected element to.
 * @cat DOM/Manipulation
 * @see prepend(<Content>)
 */

/**
 * Insert all of the matched elements before another, specified, set of elements.
 * This operation is, essentially, the reverse of doing a regular
 * $(A).before(B), in that instead of inserting B before A, you're inserting
 * A before B.
 *
 * @example $("p").insertBefore("#foo");
 * @before <div id="foo">Hello</div><p>I would like to say: </p>
 * @result <p>I would like to say: </p><div id="foo">Hello</div>
 * @desc Same as $("#foo").before("p")
 *
 * @name insertBefore
 * @type jQuery
 * @param <Content> content Content to insert the selected element before.
 * @cat DOM/Manipulation
 * @see before(<Content>)
 */

/**
 * Insert all of the matched elements after another, specified, set of elements.
 * This operation is, essentially, the reverse of doing a regular
 * $(A).after(B), in that instead of inserting B after A, you're inserting
 * A after B.
 *
 * @example $("p").insertAfter("#foo");
 * @before <p>I would like to say: </p><div id="foo">Hello</div>
 * @result <div id="foo">Hello</div><p>I would like to say: </p>
 * @desc Same as $("#foo").after("p")
 *
 * @name insertAfter
 * @type jQuery
 * @param <Content> content Content to insert the selected element after.
 * @cat DOM/Manipulation
 * @see after(<Content>)
 */

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after"
}, function(i,n){
	jQuery.fn[ i ] = function(){
		var a = arguments;
		return this.each(function(){
			for ( var j = 0, al = a.length; j < al; j++ )
				jQuery(a[j])[n]( this );
		});
	};
});

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
 * @cat DOM/Attributes
 */

/**
 * Adds the specified class(es) to each of the set of matched elements.
 *
 * @example $("p").addClass("selected")
 * @before <p>Hello</p>
 * @result [ <p class="selected">Hello</p> ]
 *
 * @example $("p").addClass("selected highlight")
 * @before <p>Hello</p>
 * @result [ <p class="selected highlight">Hello</p> ]
 *
 * @name addClass
 * @type jQuery
 * @param String class One or more CSS classes to add to the elements
 * @cat DOM/Attributes
 * @see removeClass(String)
 */

/**
 * Removes all or the specified class(es) from the set of matched elements.
 *
 * @example $("p").removeClass()
 * @before <p class="selected">Hello</p>
 * @result [ <p>Hello</p> ]
 *
 * @example $("p").removeClass("selected")
 * @before <p class="selected first">Hello</p>
 * @result [ <p class="first">Hello</p> ]
 *
 * @example $("p").removeClass("selected highlight")
 * @before <p class="highlight selected first">Hello</p>
 * @result [ <p class="first">Hello</p> ]
 *
 * @name removeClass
 * @type jQuery
 * @param String class (optional) One or more CSS classes to remove from the elements
 * @cat DOM/Attributes
 * @see addClass(String)
 */

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
 * @cat DOM/Attributes
 */

/**
 * Removes all matched elements from the DOM. This does NOT remove them from the
 * jQuery object, allowing you to use the matched elements further.
 *
 * Can be filtered with an optional expressions.
 *
 * @example $("p").remove();
 * @before <p>Hello</p> how are <p>you?</p>
 * @result how are
 *
 * @example $("p").remove(".hello");
 * @before <p class="hello">Hello</p> how are <p>you?</p>
 * @result how are <p>you?</p>
 *
 * @name remove
 * @type jQuery
 * @param String expr (optional) A jQuery expression to filter elements by.
 * @cat DOM/Manipulation
 */

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

jQuery.each( {
	removeAttr: function( key ) {
		jQuery.attr( this, key, "" );
		this.removeAttribute( key );
	},
	addClass: function(c){
		jQuery.className.add(this,c);
	},
	removeClass: function(c){
		jQuery.className.remove(this,c);
	},
	toggleClass: function( c ){
		jQuery.className[ jQuery.className.has(this,c) ? "remove" : "add" ](this, c);
	},
	remove: function(a){
		if ( !a || jQuery.filter( a, [this] ).r.length )
			this.parentNode.removeChild( this );
	},
	empty: function() {
		while ( this.firstChild )
			this.removeChild( this.firstChild );
	}
}, function(i,n){
	jQuery.fn[ i ] = function() {
		return this.each( n, arguments );
	};
});

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
jQuery.each( [ "eq", "lt", "gt", "contains" ], function(i,n){
	jQuery.fn[ n ] = function(num,fn) {
		return this.filter( ":" + n + "(" + num + ")", fn );
	};
});

/**
 * Get the current computed, pixel, width of the first matched element.
 *
 * @example $("p").width();
 * @before <p>This is just a test.</p>
 * @result 300
 *
 * @name width
 * @type String
 * @cat CSS
 */

/**
 * Set the CSS width of every matched element. If no explicit unit
 * was specified (like 'em' or '%') then "px" is added to the width.
 *
 * @example $("p").width(20);
 * @before <p>This is just a test.</p>
 * @result <p style="width:20px;">This is just a test.</p>
 *
 * @example $("p").width("20em");
 * @before <p>This is just a test.</p>
 * @result <p style="width:20em;">This is just a test.</p>
 *
 * @name width
 * @type jQuery
 * @param String|Number val Set the CSS property to the specified value.
 * @cat CSS
 */
 
/**
 * Get the current computed, pixel, height of the first matched element.
 *
 * @example $("p").height();
 * @before <p>This is just a test.</p>
 * @result 300
 *
 * @name height
 * @type String
 * @cat CSS
 */

/**
 * Set the CSS width of every matched element. If no explicit unit
 * was specified (like 'em' or '%') then "px" is added to the width.
 *
 * @example $("p").height(20);
 * @before <p>This is just a test.</p>
 * @result <p style="height:20px;">This is just a test.</p>
 *
 * @example $("p").height("20em");
 * @before <p>This is just a test.</p>
 * @result <p style="height:20em;">This is just a test.</p>
 *
 * @name height
 * @type jQuery
 * @param String|Number val Set the CSS property to the specified value.
 * @cat CSS
 */

jQuery.each( [ "height", "width" ], function(i,n){
	jQuery.fn[ n ] = function(h) {
		return h == undefined ?
			( this.length ? jQuery.css( this[0], n ) : null ) :
			this.css( n, h.constructor == String ? h : h + "px" );
	};
});
