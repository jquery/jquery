(function(){
	var e = ["blur","focus","contextmenu","load","resize","scroll","unload",
		"click","dblclick","mousedown","mouseup","mouseenter","mouseleave",
		"mousemove","mouseover","mouseout","change","reset","select","submit",
		"keydown","keypress","keyup","abort","error","ready"];

	for ( var i = 0; i < e.length; i++ ) {
		(function(){
			var o = e[i];
			$.fn[o] = function(f){ return this.bind(o, f); };
			$.fn["un"+o] = function(f){ return this.unbind(o, f); };
			$.fn["do"+o] = function(){ return this.trigger(o); };
			$.fn["one"+o] = function(f){ return this.bind(o, function(e){
				if ( this[o+f] !== null ) { return true; }
				this[o+f]++;
				return $.apply(this,f,[e]);
			}); };
		
			// Deprecated
			//$.fn["on"+o] = function(f){ return this.bind(o, f); };
		})();
	}
})();

$.fn.hover = function(f,g) {
	// Check if mouse(over|out) are still within the same parent element
	return this.each(function(){
		var obj = this;
		$.event.add(this, "mouseover", function(e) {
			var p = ( e.fromElement !== null ? e.fromElement : e.relatedTarget );
			while ( p && p != obj ) { p = p.parentNode; }
			if ( p == obj ) { return false; }
			return $.apply(obj,f,[e]);
		});
		$.event.add(this, "mouseout", function(e) {
			var p = ( e.toElement !== null ? e.toElement : e.relatedTarget );
			while ( p && p != obj ) { p = p.parentNode; }
			if ( p == obj ) { return false; }
			return $.apply(obj,g,[e]);
		});
	});
};

// Handle when the DOM is ready
$.ready = function(isFinal) {
	// If the timer was running, stop it
	if ( $.$$timer ) {
		clearInterval( $.$$timer );
		$.$$timer = null;
	}

	// If the last script to fire was in the body,
	// we assume that it's trying to do a document.write
	var s = document.getElementsByTagName("script");
	s = s[s.length-1].parentNode.nodeName == "HEAD";

	// Only execute if we're doing a sane way, or the window
	// is loaded, or the final script is in the head
	// and there's something to execute
	if ( ( !$.badReady || isFinal || s ) && $.$$ready ) {
		for ( var i = 0; i < $.$$ready.length; i++ ) {
			$.apply( document, $.$$ready[i] );
		}
		$.$$ready = null;
	}
};

// Based off of:
// http://linguiste.org/projects/behaviour-DOMContentLoaded/example.html

// If Mozilla is used
if ( $.browser == "mozilla" ) {
	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", $.ready, null );

// If IE is used
} else if ( $.browser == "msie" ) {
	// Use the defer script hack
	var script = document.createElement('SCRIPT');
	script.type = 'text/javascript';
	script.src = 'javascript:$.ready();void(0);';
	script.defer = true;
	document.getElementsByTagName('HEAD')[0].appendChild(script);
	script = null;

// Otherwise, try it the hacky way
} else {
	$.badReady = true;
}

// A fallback, that will always work, just in case
$.event.add( window, "load", function(){
	$.ready(true);
});

/**
 * Bind a function to fire when the DOM is ready.
 */
$.fn.ready = function(f) {
	return this.each(function(){
		if ( $.$$ready ) {
			$.$$ready.push( f );
		} else {
			var o = this;
			$.$$ready = [ f ];

			// Only do our hacky thing if we don't have the nice
			// Mozilla or IE ways of doing it	
			if ( $.$$badReady ) {
				// The trick is to check for the availability of a couple common
				// DOM functions, if they exist, assume the DOM is ready
				$.$$timer = setInterval( function(){
					if ( o && o.getElementsByTagName && o.getElementById && o.body ) {
						$.ready();
					}
				}, 10 );
			}
		}
	});
};

$.fn.toggle = function(a,b) {
	return a && b ? this.click(function(e){
		this.$$last = this.$$last == a ? b : a;
		e.preventDefault();
		return $.apply( this, this.$$last, [e] ) || false;
	}) : this._toggle();
};
