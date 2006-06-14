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

$.$$isReady = false;
$.$$ready = [];

// Handle when the DOM is ready
$.ready = function() {
	$.$$isReady = true;
	if ( $.$$ready ) {
		for ( var i = 0; i < $.$$ready.length; i++ ) {
			$.apply( document, $.$$ready[i] );
		}
		$.$$ready = [];
	}
};

// If Mozilla is used
if ( $.browser == "mozilla" ) {
	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", $.ready, null );

// If IE is used, use the excellent hack by Matthias Miller
// http://www.outofhanwell.com/blog/index.php?title=the_window_onload_problem_revisited
} else if ( $.browser == "msie" ) {

	// Only works if you document.write() it
	document.write('<script id="__ie_init" defer="true" ' + 
		'src="javascript:void 0"><\/script>');

	// Use the defer script hack
	var script = document.getElementById('__ie_init');
	script.onreadystatechange = function() {
		if ( this.readyState == 'complete' ) {
			$.ready();
		}
	};

	// Clear from memory
	script = null;

// If Safari or Opera is used
} else {
	$.$$timer = setInterval(function(){
                if ( document.readyState == "loaded" || 
			document.readyState == "complete" ) {

			clearInterval( $.$$timer );
			$.$$timer = null;

			$.ready();
		}
	}, 10);
}

// A fallback, that will always work, just in case
$.event.add( window, "load", $.ready );

/**
 * Bind a function to fire when the DOM is ready.
 */
$.fn.ready = function(f) {
	if ( $.$$isReady ) {
		$.apply( document, f );
	} else {
		if ( ! $.$$ready ) {
			$.$$ready = [];
		}

		$.$$ready.push( f );
	}

	return this;
};

$.fn.toggle = function(a,b) {
	return a && b ? this.click(function(e){
		this.$$last = this.$$last == a ? b : a;
		e.preventDefault();
		return $.apply( this, this.$$last, [e] ) || false;
	}) : this._toggle();
};
