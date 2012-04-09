(function( jQuery ) {

var fxNow, timerId,
	elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	rMarginProp = /^margin/,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	preFilters = [],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				start = tween.cur(),
				end, unit;

			if ( parts ) {
				end = parseFloat( parts[2] );
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" ) {
					jQuery.style( this, prop, (end || 1) + unit);
					start = ( (end || 1) / tween.cur() ) * start || 0;
					jQuery.style( this, prop, start + unit);
				}

				// If a +=/-= token was provided, we're doing a relative animation
				if ( parts[1] ) {
					end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
				}

				tween.unit = unit;
				tween.end = end;
				tween.start = start;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

function callTweeners( animation, props ) {
	function loop( collection, prop ) {
		var index = 0,
			length = collection && collection.length;
		if ( length ) {
			for ( ; index < length ; index++ ) {
				if ( collection[ index ].call( animation, prop, props[ prop ] ) ) {
					return true;
				}
			}
		}
	}
	var propIndex, propTweens, index, tweenersLength, result;
	for ( propIndex in props ) {
		if ( !loop( tweeners[ propIndex ], propIndex ) ) {
			loop( tweeners[ "*" ], propIndex );
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		index = 0,
		tweenerIndex = 0,
		length = preFilters.length,
		deferred = jQuery.Deferred().always(function() {
			// remove cirular reference
			delete animation.tick;
		}),
		finished = deferred.pipe( undefined, function( ended ) {
			if ( ended ) {
				return jQuery.Deferred().resolveWith( this, [] );
			}
		}),
		animation = {
			elem: elem,
			originalProperties: properties,
			originalOptions: options,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( {}, options ),
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			finish: finished.done,
			tweens: [],
			createTween: function( prop, end, easing ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			tick: function() {
				var currentTime = fxNow || createFxNow(),
					elapsed = Math.min( currentTime - animation.startTime, animation.duration ),
					percent = animation.duration ? elapsed / animation.duration : 1,
					index = 0,
					length = animation.tweens.length;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}

				if ( percent === 1 || !length ) {
					deferred.resolveWith( elem, [ currentTime ] );
					return false;
				} else {
					return animation.duration - elapsed;
				}
			},
			stop: function( gotoEnd ) {
				var index = 0,
					length = animation.tweens.length;

				if ( gotoEnd ) {
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}
				}
				deferred.rejectWith( elem, [ gotoEnd ] );
				return this;
			}
		};

	deferred.promise( animation );

	for ( ; index < length ; index++ ) {
		result = preFilters[ index ].call( animation,
			elem, animation.props, animation.opts );
		if ( result ) {
			return result;
		}
	}
	callTweeners( animation, animation.props );
	jQuery.extend( animation.tick, {
		animation: animation,
		queue: animation.opts.queue,
		elem: elem
	});
	jQuery.fx.timer( animation.tick );
	return animation;
}




jQuery.Animation = Animation;

Animation.preFilter = function( callback, prepend ) {
	preFilters[ prepend ? "unshift" : "push" ]( callback );
};

Animation.tweener = function( props, callback ) {
	if ( typeof props === "function" ) {
		callback = props;
		props = [ "*" ];
	} else {
		props = props.split(" ");
	}

	var prop,
		index = 0,
		length = props.length;

	for ( ; index < length ; index++ ) {
		prop = props[ index ];
		tweeners[ prop ] = tweeners[ prop ] || [];
		tweeners[ prop ].unshift( callback );
	}
};

Animation.preFilter(function( elem, props, opts ) {
	var index, name, value, hooks, replace,
		isElement = elem.nodeType === 1;

	// camelCase and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		if ( index !== name ) {
			props[ name ] = props[ index ];
			delete props[ index ];
		}

		if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
			replace = hooks.expand( props[ name ] );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'p' from above because we have the correct "name"
			for ( index in replace ) {
				if ( ! ( index in props ) ) {
					props[ index ] = replace[ index ];
				}
			}
		}
	}

	// custom easing pass
	opts.specialEasing = opts.specialEasing || {};
	for ( index in props ) {
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			opts.specialEasing[ index ] = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}
	}

	// height/width overflow pass
	if ( isElement && ( props.height || props.width ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ elem.style.overflow, elem.style.overflowX, elem.style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( elem.nodeName ) === "inline" ) {
				elem.style.display = "inline-block";

			} else {
				elem.style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		elem.style.overflow = "hidden";
		this.finish(function() {
			jQuery.each( [ "", "X", "Y" ], function( index, value ) {
				elem.style[ "overflow" + value ] = opts.overflow[ index ];
			});
		});
	}
});

// special case hide/show stuff
Animation.preFilter(function( elem, props, opts ) {
	var prop, value, length, dataShow, tween,
		index = 0,
		orig = {},
		hidden = jQuery( elem ).is(":hidden"),
		handled = [];

	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			if ( value === "hide" && hidden || value === "show" && !hidden ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" );
		if ( !dataShow ) {
			dataShow = {};
			jQuery._data( elem, "fxshow", dataShow );
		}
		if ( hidden ) {
			showHide([ elem ], true );
		} else {
			this.finish( hide );
		}
		this.finish(function() {
			var prop;
			jQuery.removeData( elem, "fxshow", true );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = this.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !(prop in dataShow) ) {
				if ( hidden ) {
					tween.end = dataShow[ prop ] = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				} else {
					dataShow[ prop ] = tween.start;
				}
			}
		}
	}

	function hide() {
		showHide([ elem ]);
	}
});

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ],
			_default = Tween.propHooks._default;

		if ( hooks && hooks.get ) {
			return hooks.get( this );
		} else {
			return _default.get( this );
		}
	},
	run: function( percent ) {
		var eased = jQuery.easing[ this.easing ]( percent, this.options.duration * percent, 0, 1, this.options.duration ),
			hooks = Tween.propHooks[ this.prop ],
			_default = Tween.propHooks._default;

		this.now = ( this.end - this.start ) * eased + this.start;
		this.pos = eased;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			_default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var parsed, result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			result = jQuery.css( tween.elem, tween.prop );
			// Empty strings, null, undefined and "auto" are converted to 0,
			// complex values such as "rotate(1rad)" are returned as is,
			// simple values such as "10px" are parsed to Float.
			return isNaN( parsed = parseFloat( result ) ) ?
				!result || result === "auto" ? 0 : result : parsed;
		},
		set: function( tween ) {
			var stepHook = jQuery.fx.step[ tween.prop ];

			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( stepHook ) {
				stepHook( tween );
			} else if ( jQuery.cssHooks[ tween.prop ] ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else if ( tween.elem.style && tween.elem.style[ tween.prop ] != null ) {
				tween.elem.style[ tween.prop ] = tween.now + tween.unit;
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

function showHide( elements, show ) {
	var elem, display,
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( elem.style ) {
			if ( show ) {
				display = elem.style.display;

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
					display = elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( (display === "" && jQuery.css(elem, "display") === "none") ||
					!jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
					jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
				}
			} else {
				display = jQuery.css( elem, "display" );

				if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
					jQuery._data( elem, "olddisplay", display );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( elem.style ) {
			if ( show ) {
				display = elem.style.display;

				if ( display === "" || display === "none" ) {
					elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
				}
			} else {
				elem.style.display = "none";
			}
		}
	}

	return elements;
}

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx( "show", 3 ), speed, easing, callback );
		} else {
			return showHide( this, true );
		}
	},
	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx( "hide", 3 ), speed, easing, callback );
		} else {
			return showHide( this );
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction( fn ) && jQuery.isFunction( fn2 ) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery( this ).is(":hidden");
				showHide([ this ], state );
			});

		} else {
			this.animate( genFx( "toggle", 3 ), fn, fn2, callback );
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			Animation( this, prop, optall ).finish( optall.complete );

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].animation.stop( gotoEnd );
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});


// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
		}
	},

	timers: [],

	fx: Tween.prototype.init

});

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	timer: function( timer ) {
		if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
			timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	// Back Compat <1.8 extension point
	step: {}
});

// Ensure props that can't be negative don't go there on undershoot easing
jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
	// exclude marginTop, marginLeft, marginBottom and marginRight from this list
	if ( !rMarginProp.test( prop ) ) {
		Tween.propHooks[ prop ] = {
			set: function( tween ) {
				tween.now = Math.max( 0, tween.now );
				Tween.propHooks._default.set( tween );
			}
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}

})( jQuery );
