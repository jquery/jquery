/** 
 * This plugin overrides jQuery's height() and width() functions and
 * adds more handy stuff for cross-browser compatibility.
 */

/**
 * Returns the css height value for the first matched element.
 * If used on document, returns the document's height (innerHeight)
 * If used on window, returns the viewport's (window) height
 *
 * @example $("#testdiv").height()
 * @result "200px"
 *
 * @example $(document).height();
 * @result 800
 *
 * @example $(window).height();
 * @result 400
 * 
 * @name height
 * @type Object
 * @cat Dimensions
 */
$.fn.height = function() {
	if ( this.get(0) == window )
		return self.innerHeight ||
			jQuery.boxModel && document.documentElement.clientHeight ||
			document.body.clientHeight;
	
	if ( this.get(0) == document )
		return Math.max( document.body.scrollHeight, document.body.offsetHeight );
	
	return this.css("height");
};

/**
 * Returns the css width value for the first matched element.
 * If used on document, returns the document's width (innerWidth)
 * If used on window, returns the viewport's (window) width
 *
 * @example $("#testdiv").width()
 * @result "200px"
 *
 * @example $(document).width();
 * @result 800
 *
 * @example $(window).width();
 * @result 400
 * 
 * @name width
 * @type Object
 * @cat Dimensions
 */
$.fn.width = function() {
	if ( this.get(0) == window )
		return self.innerWidth ||
			jQuery.boxModel && document.documentElement.clientWidth ||
			document.body.clientWidth;
	
	if ( this.get(0) == document )
		return Math.max( document.body.scrollWidth, document.body.offsetWidth );
	
	return this.css("width");
};

/**
 * Returns the inner height value (without border) for the first matched element.
 * If used on document, returns the document's height (innerHeight)
 * If used on window, returns the viewport's (window) height
 *
 * @example $("#testdiv").innerHeight()
 * @result 800
 * 
 * @name innerHeight
 * @type Number
 * @cat Dimensions
 */
$.fn.innerHeight = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.height() :
		this.get(0).offsetHeight - parseInt(this.css("borderTop") || 0) - parseInt(this.css("borderBottom") || 0);
};

/**
 * Returns the inner width value (without border) for the first matched element.
 * If used on document, returns the document's Width (innerWidth)
 * If used on window, returns the viewport's (window) width
 *
 * @example $("#testdiv").innerWidth()
 * @result 1000
 * 
 * @name innerWidth
 * @type Number
 * @cat Dimensions
 */
$.fn.innerWidth = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.width() :
		this.get(0).offsetWidth - parseInt(this.css("borderLeft") || 0) - parseInt(this.css("borderRight") || 0);
};

/**
 * Returns the outer height value (including border) for the first matched element.
 * Cannot be used on document or window.
 *
 * @example $("#testdiv").outerHeight()
 * @result 1000
 * 
 * @name outerHeight
 * @type Number
 * @cat Dimensions
 */
$.fn.outerHeight = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.height() :
		this.get(0).offsetHeight;	
};

/**
 * Returns the outer width value (including border) for the first matched element.
 * Cannot be used on document or window.
 *
 * @example $("#testdiv").outerWidth()
 * @result 1000
 * 
 * @name outerWidth
 * @type Number
 * @cat Dimensions
 */
$.fn.outerWidth = function() {
	return this.get(0) == window || this.get(0) == document ?
		this.width() :
		this.get(0).offsetWidth;	
};

/**
 * Returns how many pixels the user has scrolled to the right (scrollLeft).
 * Works on containers with overflow: auto and window/document.
 *
 * @example $("#testdiv").scrollLeft()
 * @result 100
 * 
 * @name scrollLeft
 * @type Number
 * @cat Dimensions
 */
$.fn.scrollLeft = function() {
	if ( this.get(0) == window || this.get(0) == document )
		return self.pageXOffset ||
			jQuery.boxModel && document.documentElement.scrollLeft ||
			document.body.scrollLeft;
	
	return this.get(0).scrollLeft;
};

/**
 * Returns how many pixels the user has scrolled to the bottom (scrollTop).
 * Works on containers with overflow: auto and window/document.
 *
 * @example $("#testdiv").scrollTop()
 * @result 100
 * 
 * @name scrollTop
 * @type Number
 * @cat Dimensions
 */
$.fn.scrollTop = function() {
	if ( this.get(0) == window || this.get(0) == document )
		return self.pageYOffset ||
			jQuery.boxModel && document.documentElement.scrollTop ||
			document.body.scrollTop;

	return this.get(0).scrollTop;
};