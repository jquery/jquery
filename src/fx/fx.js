jQuery.fn.extend({

	/**
	 * Displays each of the set of matched elements if they are hidden.
	 *
	 * @example $("p").show()
	 * @before <p style="display: none">Hello</p>
	 * @result [ <p style="display: block">Hello</p> ]
	 *
	 * @name show
	 * @type jQuery
	 * @cat Effects
	 */
	
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
	 * @cat Effects
	 * @see hide(String|Number,Function)
	 */
	show: function(speed,callback){
		var hidden = this.filter(":hidden");
		speed ?
			hidden.animate({
				height: "show", width: "show", opacity: "show"
			}, speed, callback) :
			
			hidden.each(function(){
				this.style.display = this.oldblock ? this.oldblock : "";
				if ( jQuery.css(this,"display") == "none" )
					this.style.display = "block";
			});
		return this;
	},
	
	/**
	 * Hides each of the set of matched elements if they are shown.
	 *
	 * @example $("p").hide()
	 * @before <p>Hello</p>
	 * @result [ <p style="display: none">Hello</p> ]
	 *
	 * @name hide
	 * @type jQuery
	 * @cat Effects
	 */
	
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
	 * @cat Effects
	 * @see show(String|Number,Function)
	 */
	hide: function(speed,callback){
		var visible = this.filter(":visible");
		speed ?
			visible.animate({
				height: "hide", width: "hide", opacity: "hide"
			}, speed, callback) :
			
			visible.each(function(){
				this.oldblock = this.oldblock || jQuery.css(this,"display");
				if ( this.oldblock == "none" )
					this.oldblock = "block";
				this.style.display = "none";
			});
		return this;
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,
	
	/**
	 * Toggles each of the set of matched elements. If they are shown,
	 * toggle makes them hidden. If they are hidden, toggle
	 * makes them shown.
	 *
	 * @example $("p").toggle()
	 * @before <p>Hello</p><p style="display: none">Hello Again</p>
	 * @result [ <p style="display: none">Hello</p>, <p style="display: block">Hello Again</p> ]
	 *
	 * @name toggle
	 * @type jQuery
	 * @cat Effects
	 */
	toggle: function( fn, fn2 ){
		var args = arguments;
		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle( fn, fn2 ) :
			this.each(function(){
				jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]
					.apply( jQuery(this), args );
			});
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
	 * @cat Effects
	 * @see slideUp(String|Number,Function)
	 * @see slideToggle(String|Number,Function)
	 */
	slideDown: function(speed,callback){
		return this.animate({height: "show"}, speed, callback);
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
	 * @cat Effects
	 * @see slideDown(String|Number,Function)
	 * @see slideToggle(String|Number,Function)
	 */
	slideUp: function(speed,callback){
		return this.animate({height: "hide"}, speed, callback);
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
	 * @cat Effects
	 * @see slideDown(String|Number,Function)
	 * @see slideUp(String|Number,Function)
	 */
	slideToggle: function(speed, callback){
		return this.each(function(){
			var state = jQuery(this).is(":hidden") ? "show" : "hide";
			jQuery(this).animate({height: state}, speed, callback);
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
	 * @cat Effects
	 * @see fadeOut(String|Number,Function)
	 * @see fadeTo(String|Number,Number,Function)
	 */
	fadeIn: function(speed, callback){
		return this.animate({opacity: "show"}, speed, callback);
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
	 * @cat Effects
	 * @see fadeIn(String|Number,Function)
	 * @see fadeTo(String|Number,Number,Function)
	 */
	fadeOut: function(speed, callback){
		return this.animate({opacity: "hide"}, speed, callback);
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
	 * @cat Effects
	 * @see fadeIn(String|Number,Function)
	 * @see fadeOut(String|Number,Function)
	 */
	fadeTo: function(speed,to,callback){
		return this.animate({opacity: to}, speed, callback);
	},
	
	/**
	 * A function for making your own, custom animations. The key aspect of
	 * this function is the object of style properties that will be animated,
	 * and to what end. Each key within the object represents a style property
	 * that will also be animated (for example: "height", "top", or "opacity").
	 *
	 * Note that properties should be specified using camel case
	 * eg. marginLeft instead of margin-left.
	 *
	 * The value associated with the key represents to what end the property
	 * will be animated. If a number is provided as the value, then the style
	 * property will be transitioned from its current state to that new number.
	 * Otherwise if the string "hide", "show", or "toggle" is provided, a default
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
	 * @example $("p").animate({
	 *   opacity: 'show'
	 * }, "slow", "easein");
	 * @desc An example of using an 'easing' function to provide a different style of animation. This will only work if you have a plugin that provides this easing function (Only 'linear' is provided by default, with jQuery).
	 *
	 * @name animate
	 * @type jQuery
	 * @param Hash params A set of style attributes that you wish to animate, and to what end.
	 * @param String|Number speed (optional) A string representing one of the three predefined speeds ("slow", "normal", or "fast") or the number of milliseconds to run the animation (e.g. 1000).
	 * @param String easing (optional) The name of the easing effect that you want to use (Plugin Required).
	 * @param Function callback (optional) A function to be executed whenever the animation completes.
	 * @cat Effects
	 */
	animate: function( prop, speed, easing, callback ) {
		return this.queue(function(){
		
			this.curAnim = jQuery.extend({}, prop);
			var opt = jQuery.speed(speed, easing, callback);
			
			for ( var p in prop ) {
				var e = new jQuery.fx( this, opt, p );
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
	
	speed: function(speed, easing, fn) {
		var opt = speed && speed.constructor == Object ? speed : {
			complete: fn || !fn && easing || 
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && easing.constructor != Function && easing
		};

		opt.duration = (opt.duration && opt.duration.constructor == Number ? 
			opt.duration : 
			{ slow: 600, fast: 200 }[opt.duration]) || 400;
	
		// Queueing
		opt.old = opt.complete;
		opt.complete = function(){
			jQuery.dequeue(this, "fx");
			if ( jQuery.isFunction( opt.old ) )
				opt.old.apply( this );
		};
	
		return opt;
	},
	
	easing: {},
	
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

		// The styles
		var y = elem.style;
		
		// Store display property
		var oldDisplay = jQuery.css(elem, "display");

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
			
			y.display = "block"; // Set display property to block for animation
		};

		// Figure out the maximum number to run to
		z.max = function(){
			return parseFloat( jQuery.css(elem,prop) );
		};

		// Get the current size
		z.cur = function(){
			var r = parseFloat( jQuery.curCSS(elem, prop) );
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
			if ( !elem.orig ) elem.orig = {};

			// Remember where we started, so that we can go back to it later
			elem.orig[prop] = this.cur();

			options.show = true;

			// Begin the animation
			z.custom(0, elem.orig[prop]);

			// Stupid IE, look what you made me do
			if ( prop != "opacity" )
				y[prop] = "1px";
		};

		// Simple 'hide' function
		z.hide = function(){
			if ( !elem.orig ) elem.orig = {};

			// Remember where we started, so that we can go back to it later
			elem.orig[prop] = this.cur();

			options.hide = true;

			// Begin the animation
			z.custom(elem.orig[prop], 0);
		};
		
		//Simple 'toggle' function
		z.toggle = function() {
			if ( !elem.orig ) elem.orig = {};

			// Remember where we started, so that we can go back to it later
			elem.orig[prop] = this.cur();

			if(oldDisplay == "none")  {
				options.show = true;
				
				// Stupid IE, look what you made me do
				if ( prop != "opacity" )
					y[prop] = "1px";

				// Begin the animation
				z.custom(0, elem.orig[prop]);	
			} else {
				options.hide = true;

				// Begin the animation
				z.custom(elem.orig[prop], 0);
			}		
		};

		// Each step of an animation
		z.step = function(firstNum, lastNum){
			var t = (new Date()).getTime();

			if (t > options.duration + z.startTime) {
				// Stop the timer
				clearInterval(z.timer);
				z.timer = null;

				z.now = lastNum;
				z.a();

				if (elem.curAnim) elem.curAnim[ prop ] = true;

				var done = true;
				for ( var i in elem.curAnim )
					if ( elem.curAnim[i] !== true )
						done = false;

				if ( done ) {
					// Reset the overflow
					y.overflow = "";
					
					// Reset the display
					y.display = oldDisplay;
					if (jQuery.css(elem, "display") == "none")
						y.display = "block";

					// Hide the element if the "hide" operation was done
					if ( options.hide ) 
						y.display = "none";

					// Reset the properties, if the item has been hidden or shown
					if ( options.hide || options.show )
						for ( var p in elem.curAnim )
							if (p == "opacity")
								jQuery.attr(y, p, elem.orig[p]);
							else
								y[p] = "";
				}

				// If a callback was provided, execute it
				if ( done && jQuery.isFunction( options.complete ) )
					// Execute the complete function
					options.complete.apply( elem );
			} else {
				var n = t - this.startTime;
				// Figure out where in the animation we are and set the number
				var p = n / options.duration;
				
				// If the easing function exists, then use it 
				z.now = options.easing && jQuery.easing[options.easing] ?
					jQuery.easing[options.easing](p, n,  firstNum, (lastNum-firstNum), options.duration) :
					// else use default linear easing
					((-Math.cos(p*Math.PI)/2) + 0.5) * (lastNum-firstNum) + firstNum;

				// Perform the next step of the animation
				z.a();
			}
		};
	
	}
});
