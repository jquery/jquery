$.speed = function(s,o) {
	if ( o && o.constructor == Function ) { o = { onComplete: o }; }
	o = o || {};
	var ss = {"crawl":1200,"xslow":850,"slow":600,"medium":400,"fast":200,"xfast":75,"normal":400};
	o.duration = typeof s == "number" ? s : ss[s] || 400;

	o.oldComplete = o.onComplete;
	o.onComplete = function(){
		$.dequeue(this, 'fx');
		if ( o.oldComplete && o.oldComplete.constructor == Function ) {
			$.apply( this, o.oldComplete );
		}
	};

	return o;
};

$.queue = {};

$.dequeue = function(elem,type){
	type = type || 'fx';

	if ( elem.$$queue && elem.$$queue[type] ) {
		// Remove self
		elem.$$queue[type].shift();

		// Get next function
		var f = elem.$$queue[type][0];
	
		if ( f ) {
			$.apply( elem, f );
		}
	}
};

$.fn.queue = function(type,fn){
	if ( !fn ) {
		fn = type;
		type = 'fx';
	}

	return this.each(function(){
		if ( !this.$$queue ) {
			this.$$queue = {};
		}

		if ( !this.$$queue[type] ) {
			this.$$queue[type] = [];
		}

		this.$$queue[type].push( fn );
	
		if ( this.$$queue[type].length == 1 ) {
			$.apply(this,fn);
		}
	});
};

$.fn._hide = $.fn.hide;

$.fn.hide = function(a,o) {
	o = $.speed(a,o);
	return a ? this.queue(function(){
		new $.fx.FadeSize(this,o).hide();
	}) : this._hide();
};

$.fn._show = $.fn.show;

$.fn.show = function(a,o) {
	o = $.speed(a,o);
	return a ? this.queue(function(){
		new $.fx.FadeSize(this,o).show();
	}) : this._show();
};

$.fn.slideDown = function(a,o) {
	o = $.speed(a,o);
	return this.queue(function(){
		new $.fx.Resize(this,o).show("height");
	});
};

$.fn.slideUp = function(a,o) {
	o = $.speed(a,o);
	return this.queue(function(){
		new $.fx.Resize(this,o).hide("height");
	});
};

$.fn.fadeOut = function(a,o) {
	o = $.speed(a,o);
	return a ? this.queue(function(){
		new $.fx.Opacity(this,o,1).hide();
	}) : this._hide();
};

$.fn.fadeIn = function(a,o) {
	o = $.speed(a,o);
	return a ? this.queue(function(){
		new $.fx.Opacity(this,o,1).show();
	}) : this._show();
};

$.fn.fadeTo = function(a,ev,o) {
	o = $.speed(a,o);
	return a ? this.queue(function(){
		ef = new $.fx.Opacity(this,o);
		ef.custom(ef.cur(),parseFloat(ev));
		ef.show();
	}) : this._show();
};

$.fn.center = function(f) {
	return this.each(function(){
		if ( !f && this.nodeName == 'IMG' &&
				 !this.offsetWidth && !this.offsetHeight ) {
			var self = this;
			setTimeout(function(){
				$(self).center(true);
			}, 13);
		} else {
			var s = this.style;
			var p = this.parentNode;
			if ( $.css(p,"position") == 'static' ) {
				p.style.position = 'relative';
			}
			s.position = 'absolute';
			s.left = (($.css(p,"width") - $.css(this,"width"))/2) + "px";
			s.top = (($.css(p,"height") - $.css(this,"height"))/2) + "px";
		}
  });
};

$.setAuto = function(e,p) {
	var a = e.style[p];
	var o = $.css(e,p);
	e.style[p] = 'auto';
	var n = $.css(e,p);
	if ( o != n ) {
		e.style[p] = a;
	}
};

/*
 * I originally wrote fx() as a clone of moo.fx and in the process
 * of making it small in size the code became illegible to sane
 * people. You've been warned.
 */

$.fx = function(el,op,ty){

	var z = this;

	// The users options
	z.o = {
		duration: (op && op.duration) || 400,
		onComplete: (op && op.onComplete) || op
	};

	// The element
	z.el = el;

	// The styles
	var y = z.el.style;

	// Simple function for setting a style value
	z.a = function(){
		z.el.style[ty] = z.now+'px';
	};

	// Figure out the maximum number to run to
	z.max = function(){return z.el["$$orig"+ty]||z.cur();};

	// Get the current size
	z.cur = function(){return $.css(z.el,ty);};

	// Start an animation from one number to another
	z.custom = function(from,to){
		z.startTime = (new Date()).getTime();
		z.now = from;
		z.a();

		z.timer = setInterval(function(){
			z.step(from, to);
		}, 13);
	};

	// Simple 'show' function
	z.show = function(){
		y.display = "block";
		z.o.auto = true;
		z.custom(0,z.max());
	};

	// Simple 'hide' function
	z.hide = function(){
		// Remember where we started, so that we can go back to it later
		z.el["$$orig"+ty] = this.cur();

		// Begin the animation
		z.custom(z.cur(),0);
	};

	// Toggle between showing and hiding an element
	z.toggle = function(){
		if ( z.cur() > 0 ) {
			z.hide();
		} else {
			z.show();
		}
	};

	// Remember  the overflow of the element
	z.oldOverflow = y.overflow;

	// Make sure that nothing sneaks out
	y.overflow = "hidden";

	// Each step of an animation
	z.step = function(firstNum, lastNum){
		var t = (new Date()).getTime();

		if (t > z.o.duration + z.startTime) {
			// Stop the timer
			clearInterval(z.timer);
			z.timer = null;

			z.now = lastNum;
			z.a();

			// Reset the overflow
			y.overflow = z.oldOverflow;

			// If the element was shown, and not using a custom number,
			// set its height and/or width to auto
			if ( (ty == "height" || ty == "width") && z.o.auto ) {
				$.setAuto( z.el, ty );
			}

			// If a callback was provided, execute it
			if( z.o.onComplete.constructor == Function ) {

				// Yes, this is a weird place for this, but it needs to be executed
				// only once per cluster of effects.
				// If the element is, effectively, hidden - hide it
				if ( y.height == "0px" || y.width == "0px" ) {
					y.display = "none";
				}

				$.apply( z.el, z.o.onComplete );
			}
		} else {
			// Figure out where in the animation we are and set the number
			var p = (t - this.startTime) / z.o.duration;
			z.now = ((-Math.cos(p*Math.PI)/2) + 0.5) * (lastNum-firstNum) + firstNum;

			// Perform the next step of the animation
			z.a();
		}
	};

};

$.fx.fn = ["show","hide","toggle"];
$.fx.ty = ["Height","Width","Left","Top"];

(function(){
	for(var $i in $.fx.ty){(function(){
		var c = $.fx.ty[$i];
		$.fx[c] = function(a,b){
			return new $.fx(a,b,c.toLowerCase());
		};
	})();}
})();

$.fx.Opacity = function(a,b,sv){
	var o = new $.fx(a,b,"opacity");
	o.cur = function(){return parseFloat(o.el.style.opacity);};
	o.a = function() {
		var e = o.el.style;
		if (o.now == 1) { o.now = 0.9999; }
		if (window.ActiveXObject) {
			e.filter = "alpha(opacity=" + o.now*100 + ")";
		}
		e.opacity = o.now;
	};
	o.io = o.now = (sv || o.cur());
	o.a();
	return o;
};

$.fx.Resize = function(e,o){
	var z = this;
	var h = new $.fx.Height(e,o);
	if(o) { o.onComplete = null; }
	var w = new $.fx.Width(e,o);
	function c(a,b,d){return (!a||a==d||b==d);}
	for(var i in $.fx.fn){(function(){
		var j = $.fx.fn[i];
		z[j] = function(a,b){
			if(c(a,b,"height")) { h[j](); }
			if(c(a,b,"width")) { w[j](); }
		};
	})();}
};

$.fx.FadeSize = function(e,o){
	var z = this;
	var r = new $.fx.Resize(e,o);
	if(o) { o.onComplete = null; }
	var p = new $.fx.Opacity(e,o,1);
	for(var i in $.fx.fn){(function(){
		var j = $.fx.fn[i];
		z[j] = function(a,b){p[j]();r[j](a,b);};
	})();}
};
