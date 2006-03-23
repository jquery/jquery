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
			if ( this[o+f] != null ) return true;
			this[o+f]++;
			return $.apply(this,f,[e]);
		}); };
		
		// Deprecated
		//$.fn["on"+o] = function(f){ return this.bind(o, f); };
	})();
}

$.fn.hover = function(f,g) {
	// Check if mouse(over|out) are still within the same parent element
	return this.each(function(){
		var obj = this;
		addEvent(this, "mouseover", function(e) {
			var p = ( e.fromElement != null ? e.fromElement : e.relatedTarget );
			while ( p && p != obj ) p = p.parentNode;
			if ( p == obj ) return false;
			return $.apply(obj,f,[e]);
		});
		addEvent(this, "mouseout", function(e) {
			var p = ( e.toElement != null ? e.toElement : e.relatedTarget );
			while ( p && p != obj ) p = p.parentNode;
			if ( p == obj ) return false;
			return $.apply(obj,g,[e]);
		});
	});
};

// Deprecated
$.fn.onhover = $.fn.hover;

$.fn.ready = function(f) {
	return this.each(function(){
		if ( this.$$timer ) {
			this.$$ready.push( f );
		} else {
			var obj = this;
			this.$$ready = [ f ];
			this.$$timer = setInterval( function(){
				if ( obj && obj.getElementsByTagName && obj.getElementById && obj.body ) {
					clearInterval( obj.$$timer );
					obj.$$timer = null;
					for ( var i = 0; i < obj.$$ready.length; i++ )
						$.apply( obj, obj.$$ready[i] );
					obj.$$ready = null;
				}
			}, 13 );
		}
	});
};

// Deprecated
$.fn.onready = $.fn.ready;

$.fn.toggle = function(a,b) {
	return a && b ? this.click(function(e){
		this.$$last = this.$$last == a ? b : a;
		e.preventDefault();
		return $.apply( this, this.$$last, [e] ) || false;
	}) : this._toggle();
};
