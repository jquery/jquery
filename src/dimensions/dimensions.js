/** 
 * This plugin overrides jQuery's height() and width() functions and
 * adds more handy stuff for cross-browser compatibility.
 */

/**
 * Returns the css height value for the first matched element.
 * If used on document, returns the document's height (innerHeight)
 * If used on window, returns the viewports (window's) height
 *
 * @example $("#testdiv").height()
 * @result [ 200px ]
 * 
 * @name height
 * @type jQuery
 * @cat Dimensions
 */
$.fn.height = function() {

	if(this.get(0) == window) {
		if (self.innerHeight) return self.innerHeight;	
		else if (document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
		else if (document.body) return document.body.clientHeight;
	}
	
	if(this.get(0) == document) {

		var test1 = document.body.scrollHeight;
		var test2 = document.body.offsetHeight;
		if (test1 > test2) return document.body.scrollHeight;
		else return document.body.offsetHeight;		
	}
	
	return this.css("height");
}
/**
 * Returns the css width value for the first matched element.
 * If used on document, returns the document's width (innerWidth)
 * If used on window, returns the viewports (window's) width
 *
 * @example $("#testdiv").width()
 * @result [ 200px ]
 * 
 * @name width
 * @type jQuery
 * @cat Dimensions
 */
$.fn.width = function() {

	if(this.get(0) == window) {
		if (self.innerWidth) return self.innerWidth;	
		else if (document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth;
		else if (document.body) return document.body.clientWidth;
	}
	
	if(this.get(0) == document) {

		var test1 = document.body.scrollWidth;
		var test2 = document.body.offsetWidth;
		if (test1 > test2) return document.body.scrollWidth;
		else return document.body.offsetWidth;		
	}
	
	return this.css("width");
}
/**
 * Returns the inner height value (without border) for the first matched element.
 * If used on document, returns the document's height (innerHeight)
 * If used on window, returns the viewports (window's) height
 *
 * @example $("#testdiv").innerHeight()
 * @result [ 800px ]
 * 
 * @name innerHeight
 * @type jQuery
 * @cat Dimensions
 */
$.fn.innerHeight = function() {
	if(this.get(0) == window || this.get(0) == document) return this.height();
	return this.get(0).offsetHeight - (parseInt(this.css("borderTop")) + parseInt(this.css("borderBottom")));
}
/**
 * Returns the inner width value (without border) for the first matched element.
 * If used on document, returns the document's Width (innerWidth)
 * If used on window, returns the viewports (window's) width
 *
 * @example $("#testdiv").innerWidth()
 * @result [ 1000px ]
 * 
 * @name innerWidth
 * @type jQuery
 * @cat Dimensions
 */
$.fn.innerWidth = function() {
	if(this.get(0) == window || this.get(0) == document) return this.width();
	return this.get(0).offsetWidth - (parseInt(this.css("borderLeft")) + parseInt(this.css("borderRight")));
}
/**
 * Returns the outer height value (including border) for the first matched element.
 * Cannot be used on document or window.
 *
 * @example $("#testdiv").outerHeight()
 * @result [ 1000px ]
 * 
 * @name outerHeight
 * @type jQuery
 * @cat Dimensions
 */
$.fn.outerHeight = function() {
	if(this.get(0) == window || this.get(0) == document) return 0;
	return this.get(0).offsetHeight;	
}
/**
 * Returns the outer width value (including border) for the first matched element.
 * Cannot be used on document or window.
 *
 * @example $("#testdiv").outerWidth()
 * @result [ 1000px ]
 * 
 * @name outerWidth
 * @type jQuery
 * @cat Dimensions
 */
$.fn.outerWidth = function() {
	if(this.get(0) == window || this.get(0) == document) return 0;
	return this.get(0).offsetWidth;	
}
/**
 * Returns how many pixels the user has scrolled to the right (scrollLeft).
 * Works on containers with overflow: auto and window/document.
 *
 * @example $("#testdiv").scrollLeft()
 * @result [ 100px ]
 * 
 * @name scrollLeft
 * @type jQuery
 * @cat Dimensions
 */
$.fn.scrollLeft = function() {
	if(this.get(0) == window || this.get(0) == document) {
	if (self.pageXOffset) return self.pageXOffset;
	else if (document.documentElement && document.documentElement.scrollLeft) return document.documentElement.scrollLeft;
	else if (document.body) return document.body.scrollLeft;
	}
	return this.get(0).scrollLeft;
}
/**
 * Returns how many pixels the user has scrolled to the bottom (scrollTop).
 * Works on containers with overflow: auto and window/document.
 *
 * @example $("#testdiv").scrollTop()
 * @result [ 100px ]
 * 
 * @name scrollTop
 * @type jQuery
 * @cat Dimensions
 */
$.fn.scrollTop = function() {
	if(this.get(0) == window || this.get(0) == document) {
	if (self.pageYOffset) return self.pageYOffset;
	else if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
	else if (document.body) return document.body.scrollTop;
	}	
	return this.get(0).scrollTop;
}