// We're overriding the old toggle function, so
// remember it for later
jQuery.prototype._toggle = jQuery.prototype.toggle;

/**
 * Toggle between two function calls every other click.
 */
jQuery.prototype.toggle = function(a,b) {
	// If two functions are passed in, we're
	// toggling on a click
	return a && b ? this.click(function(e){
		// Figure out which function to execute
		this.last = this.last == a ? b : a;
		
		// Make sure that clicks don't pass through
		e.preventDefault();
		
		// and execute the function
		return jQuery.apply( this, this.last, [e] ) || false;
	}) :
	
	// Otherwise, execute the old toggle function
	this._toggle();
};

/**
 * Toggle between two function calls on mouse over/out.
 */
jQuery.prototype.hover = function(f,g) {
	
	// A private function for haandling mouse 'hovering'
	function handleHover(e) {
		// Check if mouse(over|out) are still within the same parent element
		var p = e.fromElement || e.toElement || e.relatedTarget;
		while ( p && p != this ) p = p.parentNode;
		
		// If we actually just moused on to a sub-element, ignore it
		if ( p == this ) return false;
		
		// Execute the right function
		return (e.type == "mouseover" ? f : g).apply(this,[e]);
	}
	
	// Bind the function to the two event listeners
	return this.mouseover(handleHover).mouseout(handleHover);
};

/**
 * Bind a function to fire when the DOM is ready.
 */
jQuery.prototype.ready = function(f) {
	// If the DOM is already ready
	if ( jQuery.isReady )
		// Execute the function immediately
		jQuery.apply( document, f );
		
	// Otherwise, remember the function for later
	else {
		// Add the function to the wait list
		jQuery.readyList.push( f );
	}

	return this;
};

(function(){
	/*
	 * Bind a number of event-handling functions, dynamically
	 */
	var e = ("blur,focus,contextmenu,load,resize,scroll,unload,click,dblclick," +
		"mousedown,mouseup,mouseenter,mouseleave,mousemove,mouseover,mouseout," +
		"change,reset,select,submit,keydown,keypress,keyup").split(",");

	// Go through all the event names, but make sure that
	// it is enclosed properly
	for ( var i = 0; i < e.length; i++ ) {(function(){
			
		var o = e[i];
		
		// Handle event binding
		jQuery.prototype[o] = function(f){ return this.bind(o, f); };
		
		// Handle event unbinding
		jQuery.prototype["un"+o] = function(f){ return this.unbind(o, f); };
		
		// Handle event triggering
		jQuery.prototype["do"+o] = function(){ return this.trigger(o); };
		
		// Finally, handle events that only fire once
		jQuery.prototype["one"+o] = function(f){
			// Attach the event listener
			return this.bind(o, function(e){
				// TODO: Remove the event listener, instead of this hack
				
				// If this function has already been executed, stop
				if ( this[o+f] !== null )
					return true;
				
				// Otherwise, mark as having been executed
				this[o+f]++;
				
				// And execute the bound function
				return jQuery.apply(this,f,[e]);
			});
		};
			
	})();}
		
	/*
	 * All the code that makes DOM Ready work nicely.
	 */
	 
	jQuery.isReady = false;
	jQuery.readyList = [];
	
	// Handle when the DOM is ready
	jQuery.ready = function() {
		// Make sure that the DOM hasn't already loaded
		if ( !jQuery.isReady ) {
			// Remember that the DOM is ready
			jQuery.isReady = true;
			
			// If there are functions bound, to execute
			if ( jQuery.readyList ) {
				// Execute all of them
				for ( var i = 0; i < jQuery.readyList.length; i++ )
					jQuery.apply( document, jQuery.readyList[i] );
				
				// Reset the list of functions
				jQuery.readyList = null;
			}
		}
	};
	
	// If Mozilla is used
	if ( jQuery.browser == "mozilla" || jQuery.browser == "opera" ) {
		// Use the handy event callback
		jQuery.event.add( document, "DOMContentLoaded", jQuery.ready );
	
	// If IE is used, use the excellent hack by Matthias Miller
	// http://www.outofhanwell.com/blog/index.php?title=the_window_onload_problem_revisited
	} else if ( jQuery.browser == "msie" ) {
	
		// Only works if you document.write() it
		document.write("<scr" + "ipt id=__ie_init defer=true " + 
			"src=javascript:void(0)><\/script>");
	
		// Use the defer script hack
		var script = document.getElementById("__ie_init");
		script.onreadystatechange = function() {
			if ( this.readyState == "complete" )
				jQuery.ready();
		};
	
		// Clear from memory
		script = null;
	
	// If Safari  is used
	} else if ( jQuery.browser == "safari" ) {
		// Continually check to see if the document.readyState is valid
		jQuery.safariTimer = setInterval(function(){
			// loaded and complete are both valid states
			if ( document.readyState == "loaded" || 
				document.readyState == "complete" ) {
	
				// If either one are found, remove the timer
				clearInterval( jQuery.safariTimer );
				jQuery.safariTimer = null;
	
				// and execute any waiting functions
				jQuery.ready();
			}
		}, 10);
	}
	
	// A fallback to window.onload, that will always work
	jQuery.event.add( window, "load", jQuery.ready );
	
})();
