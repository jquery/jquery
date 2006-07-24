jQuery.fn.extend({

	// overwrite the old show method
	_show: jQuery.fn.show,
	
	/**
	 * The effects module overloads the show method to now allow 
	 * for a speed to the show operation. What actually happens is 
	 * that the height, width, and opacity to the matched elements 
	 * are changed dynamically. The only three current speeds are 
	 * "slow", "normal", and "fast". For example:
	 *   $("p").show("slow");
	 * Note: You should not run the show method on things 
	 * that are already shown. This can be circumvented by doing this:
	 *   $("p:hidden").show("slow");
	 */
	show: function(speed,callback){
		return speed ? this.animate({
			height: "show", width: "show", opacity: "show"
		}, speed, callback) : this._show();
	},
	
	// Overwrite the old hide method
	_hide: jQuery.fn.hide,
	
	/**
	 * The hide function behaves very similary to the show function, 
	 * but is just the opposite.
	 *   $("p:visible").hide("slow");
	 */
	hide: function(speed,callback){
		return speed ? this.animate({
			height: "hide", width: "hide", opacity: "hide"
		}, speed, callback) : this._hide();
	},
	
	/**
	 * This function increases the height and opacity for all matched 
	 * elements. This is very similar to 'show', but does not change 
	 * the width - creating a neat sliding effect.
	 *   $("p:hidden").slideDown("slow");
	 */
	slideDown: function(speed,callback){
		return this.animate({height: "show"}, speed, callback);
	},
	
	/**
	 * Just like slideDown, only it hides all matched elements.
	 *   $("p:visible").slideUp("slow");
	 */
	slideUp: function(speed,callback){
		return this.animate({height: "hide"}, speed, callback);
	},
	
	/**
	 * Adjusts the opacity of all matched elements from a hidden, 
	 * to a fully visible, state.
	 *   $("p:hidden").fadeIn("slow");
	 */
	fadeIn: function(speed,callback){
		return this.animate({opacity: "show"}, speed, callback);
	},
	
	/**
	 * Same as fadeIn, but transitions from a visible, to a hidden state.
	 *   $("p:visible").fadeOut("slow");
	 */
	fadeOut: function(speed,callback){
		return this.animate({opacity: "hide"}, speed, callback);
	},
	
	/**
	 * ...
	 */
	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},
	
	/**
	 *
	 */
	animate: function(prop,speed,callback) {
		return this.queue(function(){
			var i = 0;
			for ( var p in prop ) {
				var e = new jQuery.fx( this, jQuery.speed(speed,callback,i++), p );
				if ( prop[p].constructor == Number )
					e.custom( e.cur(), prop[p] );
				else
					e[ prop[p] ]( prop );
			}
		});
	},
	
	/**
	 *
	 * @private
	 */
	queue: function(type,fn){
		if ( !fn ) {
			fn = type;
			type = "fx";
		}
	
		return this.each(function(){
			if ( !this.queue )
				this.queue = {};
	
			if ( !this.queue[type] )
				this.queue[type] = [];
	
			this.queue[type].push( fn );
		
			if ( this.queue[type].length == 1 )
				fn.apply(this);
		});
	}

});

jQuery.extend({

	setAuto: function(e,p) {
		if ( e.notAuto ) return;

		if ( p == "height" && e.scrollHeight != parseInt(jQuery.curCSS(e,p)) ) return;
		if ( p == "width" && e.scrollWidth != parseInt(jQuery.curCSS(e,p)) ) return;

		// Remember the original height
		var a = e.style[p];

		// Figure out the size of the height right now
		var o = jQuery.curCSS(e,p,1);

		if ( p == "height" && e.scrollHeight != o ||
			p == "width" && e.scrollWidth != o ) return;

		// Set the height to auto
		e.style[p] = e.currentStyle ? "" : "auto";

		// See what the size of "auto" is
		var n = jQuery.curCSS(e,p,1);

		// Revert back to the original size
		if ( o != n && n != "auto" ) {
			e.style[p] = a;
			e.notAuto = true;
		}
	},
	
	speed: function(s,o,i) {
		o = o || {};
		
		if ( o.constructor == Function )
			o = { complete: o };
		
		var ss = { slow: 600, fast: 200 };
		o.duration = (s && s.constructor == Number ? s : ss[s]) || 400;
	
		// Queueing
		o.oldComplete = o.complete;
		o.complete = function(){
			jQuery.dequeue(this, "fx");
			if ( o.oldComplete && o.oldComplete.constructor == Function )
				o.oldComplete.apply( this );
		};
		
		if ( i > 0 )
			o.complete = null;
	
		return o;
	},
	
	queue: {},
	
	dequeue: function(elem,type){
		type = type || "fx";
	
		if ( elem.queue && elem.queue[type] ) {
			// Remove self
			elem.queue[type].shift();
	
			// Get next function
			var f = elem.queue[type][0];
		
			if ( f ) f.apply( elem );
		}
	},

	/*
	 * I originally wrote fx() as a clone of moo.fx and in the process
	 * of making it small in size the code became illegible to sane
	 * people. You've been warned.
	 */
	
	fx: function( elem, options, prop ){
	
		var z = this;
	
		// The users options
		z.o = {
			duration: options.duration || 400,
			complete: options.complete
		};
	
		// The element
		z.el = elem;
	
		// The styles
		var y = z.el.style;
	
		// Simple function for setting a style value
		z.a = function(){
			if ( prop == "opacity" ) {
				if (z.now == 1) z.now = 0.9999;
				if (window.ActiveXObject)
					y.filter = "alpha(opacity=" + z.now*100 + ")";
				else
					y.opacity = z.now;

			// My hate for IE will never die
			} else if ( parseInt(z.now) )
				y[prop] = parseInt(z.now) + "px";
			y.display = "block";
		};
	
		// Figure out the maximum number to run to
		z.max = function(){
			return parseFloat( jQuery.css(z.el,prop) );
		};
	
		// Get the current size
		z.cur = function(){
			return parseFloat( jQuery.curCSS(z.el, prop) ) || z.max();
		};
	
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
		z.show = function( p ){
			if ( !z.el.orig ) z.el.orig = {};

			// Remember where we started, so that we can go back to it later
			z.el.orig[prop] = this.cur();

			z.custom( 0, z.el.orig[prop] );

			// Stupid IE, look what you made me do
			if ( prop != "opacity" )
				y[prop] = "1px";
		};
	
		// Simple 'hide' function
		z.hide = function(){
			if ( !z.el.orig ) z.el.orig = {};

			// Remember where we started, so that we can go back to it later
			z.el.orig[prop] = this.cur();

			z.o.hide = true;

			// Begin the animation
			z.custom(z.cur(),0);
		};
	
		// IE has trouble with opacity if it does not have layout
		if ( jQuery.browser.msie && !z.el.currentStyle.hasLayout )
			y.zoom = "1";
	
		// Remember  the overflow of the element
		if ( !z.el.oldOverlay )
			z.el.oldOverflow = jQuery.css( z.el, "overflow" );
	
		// Make sure that nothing sneaks out
		if ( z.el.oldOverlay == "visible" )
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

				// Hide the element if the "hide" operation was done
				if ( z.o.hide ) y.display = 'none';
	
				// Reset the overflow
				y.overflow = z.el.oldOverflow;

				// If a callback was provided, execute it
				if( z.o.complete && z.o.complete.constructor == Function )
					// Execute the complete function
					z.o.complete.apply( z.el );

				// Reset the property, if the item has been hidden
				if ( z.o.hide )
					y[ prop ] = z.el.orig[ prop ].constructor == Number && prop != "opacity" ?
						z.el.orig[prop] + "px" : z.el.orig[prop];

				// set its height and/or width to auto
				jQuery.setAuto( z.el, prop );
			} else {
				// Figure out where in the animation we are and set the number
				var p = (t - this.startTime) / z.o.duration;
				z.now = ((-Math.cos(p*Math.PI)/2) + 0.5) * (lastNum-firstNum) + firstNum;
	
				// Perform the next step of the animation
				z.a();
			}
		};
	
	}

});
