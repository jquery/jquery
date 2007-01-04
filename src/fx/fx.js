jQuery.fn.extend({

	// overwrite the old show method
	_show: jQuery.fn.show,
	
	/**
	 * Show all matched elements using a graceful animation and firing an
	 * optional callback after completion.
	 *
	 * The height, width, and opacity of each of the matched elements 
	 * are changed dynamically according to the specified speed.
	 *
	 * @example $("p").show("slow");
	 *
	 * @example $("p").show("slow",function(){
	 *   alert("Animation Done.");
	 * });
	 *
	 * @name show
	 * @type jQuery
	 * @param String|Number speed A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).
	 * @param Function callback (optional) A function to be executed whenever the animation completes.
	 * @param String easing (optional) easing effect
	 * @cat Effects/Animations
	 * @see hide(String|Number,Function)
	 */
	show: function(speed,callback, easing){
		return speed ? this.animate({
			height: "show", width: "show", opacity: "show"
		}, speed, callback, easing) : this._show();
	},
	
	// Overwrite the old hide method
	_hide: jQuery.fn.hide,
	
	/**
	 * Hide all matched elements using a graceful animation and firing an
	 * optional callback after completion.
	 *
	 * The height, width, and opacity of each of the matched elements 
	 * are changed dynamically according to the specified speed.
	 *
	 * @example $("p").hide("slow");
	 *
	 * @example $("p").hide("slow",function(){
	 *   alert("Animation Done.");
	 * });
	 *
	 * @name hide
	 * @type jQuery
	 * @param String|Number speed A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).
	 * @param Function callback (optional) A function to be executed whenever the animation completes.
	 * @param String easing (optional) easing effect
	 * @cat Effects/Animations
	 * @see show(String|Number,Function)
	 */
	hide: function(speed,callback, easing){
		return speed ? this.animate({
			height: "hide", width: "hide", opacity: "hide"
		}, speed, callback, easing) : this._hide();
	},
	
	/**
	 * Reveal all matched elements by adjusting their height and firing an
	 * optional callback after completion.
	 *
	 * Only the height is adjusted for this animation, causing all matched
	 * elements to be revealed in a "sliding" manner.
	 *
	 * @example $("p").slideDown("slow");
	 *
	 * @example $("p").slideDown("slow",function(){
	 *   alert("Animation Done.");
	 * });
	 *
	 * @name slideDown
	 * @type jQuery
	 * @param String|Number speed (optional) A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).
	 * @param Function callback (optional) A function to be executed whenever the animation completes.
	 * @param String easing (optional) easing effect
	 * @cat Effects/Animations
	 * @see slideUp(String|Number,Function)
	 * @see slideToggle(String|Number,Function)
	 */
	slideDown: function(speed,callback, easing){
		return this.animate({height: "show"}, speed, callback, easing);
	},
	
	/**
	 * Hide all matched elements by adjusting their height and firing an
	 * optional callback after completion.
	 *
	 * Only the height is adjusted for this animation, causing all matched
	 * elements to be hidden in a "sliding" manner.
	 *
	 * @example $("p").slideUp("slow");
	 *
	 * @example $("p").slideUp("slow",function(){
	 *   alert("Animation Done.");
	 * });
	 *
	 * @name slideUp
	 * @type jQuery
	 * @param String|Number speed (optional) A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).
	 * @param Function callback (optional) A function to be executed whenever the animation completes.
	 * @param String easing (optional) easing effect
	 * @cat Effects/Animations
	 * @see slideDown(String|Number,Function)
	 * @see slideToggle(String|Number,Function)
	 */
	slideUp: function(speed,callback, easing){
		return this.animate({height: "hide"}, speed, callback, easing);
	},

	/**
	 * Toggle the visibility of all matched elements by adjusting their height and firing an
	 * optional callback after completion.
	 *
	 * Only the height is adjusted for this animation, causing all matched
	 * elements to be hidden in a "sliding" manner.
	 *
	 * @example $("p").slideToggle("slow");
	 *
	 * @example $("p").slideToggle("slow",function(){
	 *   alert("Animation Done.");
	 * });
	 *
	 * @name slideToggle
	 * @type jQuery
	 * @param String|Number speed (optional) A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).
	 * @param Function callback (optional) A function to be executed whenever the animation completes.
	 * @param String easing (optional) easing effect
	 * @cat Effects/Animations
	 * @see slideDown(String|Number,Function)
	 * @see slideUp(String|Number,Function)
	 */
	slideToggle: function(speed, callback, easing){
		return this.each(function(){
			var state = jQuery(this).is(":hidden") ? "show" : "hide";
			jQuery(this).animate({height: state}, speed, callback, easing);
		});
	},
	
	/**
	 * Fade in all matched elements by adjusting their opacity and firing an
	 * optional callback after completion.
	 *
	 * Only the opacity is adjusted for this animation, meaning that
	 * all of the matched elements should already have some form of height
	 * and width associated with them.
	 *
	 * @example $("p").fadeIn("slow");
	 *
	 * @example $("p").fadeIn("slow",function(){
	 *   alert("Animation Done.");
	 * });
	 *
	 * @name fadeIn
	 * @type jQuery
	 * @param String|Number speed (optional) A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).
	 * @param Function callback (optional) A function to be executed whenever the animation completes.
	 * @param String easing (optional) easing effect
	 * @cat Effects/Animations
	 * @see fadeOut(String|Number,Function)
	 * @see fadeTo(String|Number,Number,Function)
	 */
	fadeIn: function(speed, callback, easing){
		return this.animate({opacity: "show"}, speed, callback, easing);
	},
	
	/**
	 * Fade out all matched elements by adjusting their opacity and firing an
	 * optional callback after completion.
	 *
	 * Only the opacity is adjusted for this animation, meaning that
	 * all of the matched elements should already have some form of height
	 * and width associated with them.
	 *
	 * @example $("p").fadeOut("slow");
	 *
	 * @example $("p").fadeOut("slow",function(){
	 *   alert("Animation Done.");
	 * });
	 *
	 * @name fadeOut
	 * @type jQuery
	 * @param String|Number speed (optional) A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).
	 * @param Function callback (optional) A function to be executed whenever the animation completes.
	 * @param String easing (optional) easing effect
	 * @cat Effects/Animations
	 * @see fadeIn(String|Number,Function)
	 * @see fadeTo(String|Number,Number,Function)
	 */
	fadeOut: function(speed, callback, easing){
		return this.animate({opacity: "hide"}, speed, callback, easing);
	},
	
	/**
	 * Fade the opacity of all matched elements to a specified opacity and firing an
	 * optional callback after completion.
	 *
	 * Only the opacity is adjusted for this animation, meaning that
	 * all of the matched elements should already have some form of height
	 * and width associated with them.
	 *
	 * @example $("p").fadeTo("slow", 0.5);
	 *
	 * @example $("p").fadeTo("slow", 0.5, function(){
	 *   alert("Animation Done.");
	 * });
	 *
	 * @name fadeTo
	 * @type jQuery
	 * @param String|Number speed A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).
	 * @param Number opacity The opacity to fade to (a number from 0 to 1).
	 * @param Function callback (optional) A function to be executed whenever the animation completes.
	 * @param String easing (optional) easing effect
	 * @cat Effects/Animations
	 * @see fadeIn(String|Number,Function)
	 * @see fadeOut(String|Number,Function)
	 */
	fadeTo: function(speed,to,callback, easing){
		return this.animate({opacity: to}, speed, callback, easing);
	},
	
	/**
	 * A function for making your own, custom, animations. The key aspect of
	 * this function is the object of style properties that will be animated,
	 * and to what end. Each key within the object represents a style property
	 * that will also be animated (for example: "height", "top", or "opacity").
	 *
	 * The value associated with the key represents to what end the property
	 * will be animated. If a number is provided as the value, then the style
	 * property will be transitioned from its current state to that new number.
	 * Oterwise if the string "hide", "show", or "toggle" is provided, a default
	 * animation will be constructed for that property.
	 *
	 * @example $("p").animate({
	 *   height: 'toggle', opacity: 'toggle'
	 * }, "slow");
	 *
	 * @example $("p").animate({
	 *   left: 50, opacity: 'show'
	 * }, 500);
	 *
	 * @name animate
	 * @type jQuery
	 * @param Hash params A set of style attributes that you wish to animate, and to what end.
	 * @param String|Number speed (optional) A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).
	 * @param Function callback (optional) A function to be executed whenever the animation completes.
	 * @param String easing (optional) easing effect
	 * @cat Effects/Animations
	 */
	animate: function(prop,speed,callback, easing) {
		return this.queue(function(){
		
			this.curAnim = jQuery.extend({}, prop);
			
			for ( var p in prop ) {
				var e = new jQuery.fx( this, jQuery.speed(speed,callback), p, easing );
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
	
	speed: function(s,o) {
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
	
	fx: function( elem, options, prop, easing ){

		var z = this;

		// The users options
		z.o = {
			duration: options.duration || 400,
			complete: options.complete,
			step: options.step,
			easing : easing || 'linear'
		};
		
		// The element
		z.el = elem;

		// The styles
		var y = z.el.style;
		
		// Store display property
		var oldDisplay = jQuery.css(z.el, 'display');
		// Set display property to block for animation
		y.display = "block";
		// Make sure that nothing sneaks out
		y.overflow = "hidden";

		// Simple function for setting a style value
		z.a = function(){
			if ( options.step )
				options.step.apply( elem, [ z.now ] );

			if ( prop == "opacity" )
				jQuery.attr(y, "opacity", z.now); // Let attr handle opacity
			else if ( parseInt(z.now) ) // My hate for IE will never die
				y[prop] = parseInt(z.now) + "px";
		};

		// Figure out the maximum number to run to
		z.max = function(){
			return parseFloat( jQuery.css(z.el,prop) );
		};

		// Get the current size
		z.cur = function(){
			var r = parseFloat( jQuery.curCSS(z.el, prop) );
			return r && r > -10000 ? r : z.max();
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
		z.show = function(){
			if ( !z.el.orig ) z.el.orig = {};

			// Remember where we started, so that we can go back to it later
			z.el.orig[prop] = this.cur();

			z.o.show = true;

			// Begin the animation
			z.custom(0, z.el.orig[prop]);

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
			z.custom(z.el.orig[prop], 0);
		};
		
		//Simple 'toggle' function
		z.toggle = function() {
			if ( !z.el.orig ) z.el.orig = {};

			// Remember where we started, so that we can go back to it later
			z.el.orig[prop] = this.cur();

			if(oldDisplay == 'none')  {
				z.o.show = true;
				
				// Stupid IE, look what you made me do
				if ( prop != "opacity" )
					y[prop] = "1px";

				// Begin the animation
				z.custom(0, z.el.orig[prop]);	
			} else {
				z.o.hide = true;

				// Begin the animation
				z.custom(z.el.orig[prop], 0);
			}		
		};

		// Each step of an animation
		z.step = function(firstNum, lastNum){
			var t = (new Date()).getTime();

			if (t > z.o.duration + z.startTime) {
				// Stop the timer
				clearInterval(z.timer);
				z.timer = null;

				z.now = lastNum;
				z.a();

				if (z.el.curAnim) z.el.curAnim[ prop ] = true;

				var done = true;
				for ( var i in z.el.curAnim )
					if ( z.el.curAnim[i] !== true )
						done = false;

				if ( done ) {
					// Reset the overflow
					y.overflow = '';
					
					// Reset the display
					y.display = oldDisplay;
					if (jQuery.css(z.el, 'display') == 'none')
						y.display = 'block';

					// Hide the element if the "hide" operation was done
					if ( z.o.hide ) 
						y.display = 'none';

					// Reset the properties, if the item has been hidden or shown
					if ( z.o.hide || z.o.show )
						for ( var p in z.el.curAnim )
							if (p == "opacity")
								jQuery.attr(y, p, z.el.orig[p]);
							else
								y[p] = '';
				}

				// If a callback was provided, execute it
				if( done && z.o.complete && z.o.complete.constructor == Function )
					// Execute the complete function
					z.o.complete.apply( z.el );
			} else {
				var n = t - this.startTime;
				// Figure out where in the animation we are and set the number
				var p = n / z.o.duration;
				//if the easing exists the use it else use default linear easing
				if (jQuery.easing[z.o.easing])
					z.now = jQuery.easing[z.o.easing](p, n,  firstNum, (lastNum-firstNum), z.o.duration);
				else 
					z.now = jQuery.easingLinear(p, n,  firstNum, (lastNum-firstNum), z.o.duration);

				// Perform the next step of the animation
				z.a();
			}
		};
	
	},
	
	easingLinear :  function(p, n, firstNum, delta, duration) {
			var nm, m, a, s;
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * delta + firstNum;
	},
	
	/**
	 *
	 * @param Integer p period step in animation
	 * @param Integer n current time
	 * @param Mixed firstNum begin value
	 * @param Mixed delta change in
	 * @param Integer duration duration
	 */
	easing :  {
		linear: function(p, n, firstNum, delta, duration) {
			var nm, m, a, s;
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * delta + firstNum;
		},
		
		easein: function(p, n, firstNum, delta, duration) {
			return delta*(n/=duration)*n*n + firstNum;
		},
		
		easeou: function(p, n, firstNum, delta, duration) {
			return -delta * ((n=n/duration-1)*n*n*n - 1) + firstNum;
		},
		
		easeboth: function(p, n, firstNum, delta, duration) {
			if ((n/=duration/2) < 1)
				return delta/2*n*n*n*n + firstNum;
				return -delta/2 * ((n-=2)*n*n*n - 2) + firstNum;
		},
		
		bounceout: function(p, n, firstNum, delta, duration) {
			if ((n/=duration) < (1/2.75)) {
				return delta*(7.5625*n*n) + firstNum;
			} else if (n < (2/2.75)) {
				return delta*(7.5625*(n-=(1.5/2.75))*n + .75) + firstNum;
			} else if (n < (2.5/2.75)) {
				return delta*(7.5625*(n-=(2.25/2.75))*n + .9375) + firstNum;
			} else {
				return delta*(7.5625*(n-=(2.625/2.75))*n + .984375) + firstNum;
			}
		},
		
		bouncein: function(p, n, firstNum, delta, duration) {
			if (jQuery.easing.bounceout)
				return delta - jQuery.easing.bounceout (p, duration - n, 0, delta, duration) + firstNum;
			return firstNum + delta;
		},
		
		bounceboth: function(p, n, firstNum, delta, duration) {
			if (jQuery.easing.bouncein && jQuery.easing.bounceout)
				if (n < duration/2)
					return jQuery.easing.bouncein(p, n*2, 0, delta, duration) * .5 + firstNum;
				return jQuery.easing.bounceout(p, n*2-duration, 0, delta, duration) * .5 + delta*.5 + firstNum; 
			return firstNum + delta;
		},
		
		elasticin: function(p, n, firstNum, delta, duration) {
			var nm, m, a, s;
   			if (n == 0)
   				return firstNum;
   			if ((n/=duration)==1)
   				return firstNum+delta;
   			a = delta * 0.3;
   			p=duration*.3;
			if (a < Math.abs(delta)) {
				a=delta;
				s=p/4;
			} else { 
				s = p/(2*Math.PI) * Math.asin (delta/a);
			}
			return -(a*Math.pow(2,10*(n-=1)) * Math.sin( (n*duration-s)*(2*Math.PI)/p )) + firstNum; 
		},
		
		elasticout:function(p, n, firstNum, delta, duration) {
			var nm, m, a, s;
			if (n==0)
				return firstNum;
			if ((n/=duration/2)==2)
				return firstNum + delta;
   			a = delta * 0.3;
   			p=duration*.3;
			if (a < Math.abs(delta)){
				a = delta;
				s=p/4;
			} else { 
				s = p/(2*Math.PI) * Math.asin (delta/a);
			}
			return a*Math.pow(2,-10*n) * Math.sin( (n*duration-s)*(2*Math.PI)/p ) + delta + firstNum;
		},
		
		elasticboth: function(p, n, firstNum, delta, duration) {
			var nm, m, a, s;
			if (n==0)
				return firstNum;
			if ((n/=duration/2)==2)
				return firstNum + delta;
   			a = delta * 0.3;
   			p=duration*.3;
			if (a < Math.abs(delta)){
				a = delta;
				s=p/4;
			} else { 
				s = p/(2*Math.PI) * Math.asin (delta/a);
			}
			if (n < 1) {
				return -.5*(a*Math.pow(2,10*(n-=1)) * Math.sin( (n*duration-s)*(2*Math.PI)/p )) + firstNum;
			}
			return a*Math.pow(2,-10*(n-=1)) * Math.sin( (n*duration-s)*(2*Math.PI)/p )*.5 + delta + firstNum; 
		}
	}

});