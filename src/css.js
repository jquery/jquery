(function( jQuery ) {

var ralpha = /alpha\([^)]*\)/,
	ropacity = /opacity=([^)]*)/,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	// cache check for defaultView.getComputedStyle
	getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,

	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return jQuery.css( elem, name, value );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem ) {
				// We should always get a number back from opacity
				var ret = curCSS( elem, "opacity", "opacity" );
				return ret === "" ? "1" : ret;
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"zIndex": true,
		"fontWeight": true,
		"opacity": true,
		"zoom": true,
		"lineHeight": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return undefined;
		}

		// Make sure that we're working with the right name
		var ret, origName = name.replace( rdashAlpha, fcamelCase ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( typeof value === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, value, extra ) {
		// Make sure that we're working with the right name
		var ret, origName = name.replace( rdashAlpha, fcamelCase ),
			hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value, just use jQuery.style (DEPRECATED)
		if ( value !== undefined ) {
			jQuery.style( elem, name, value );

		// If a hook was provided get the computed value from there
		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name, origName );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					val = getWH( elem, name, extra );

				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val + "px";
			}
		},

		set: function( elem, value ) {
			if ( value !== "" ) {
				// ignore negative width and height values #1599
				value = parseFloat(value);

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test((computed ? elem.currentStyle.filter : elem.style.filter) || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				"1";
		},

		set: function( elem, value ) {
			var style = elem.style;

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// Set the alpha filter to set the opacity
			var opacity = parseInt( value, 10 ) + "" === "NaN" ?
				"" :
				"alpha(opacity=" + value * 100 + ")";

			var filter = style.filter || elem.currentStyle.filter || "";

			style.filter = ralpha.test(filter) ?
				filter.replace(ralpha, opacity) :
				opacity;
		}
	};
}

if ( getComputedStyle ) {
	curCSS = function( elem, newName, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
		}

		return ret;
	};

} else if ( document.documentElement.currentStyle ) {
	curCSS = function( elem, name ) {
		var left, rsLeft, ret = elem.currentStyle[ name ], style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			elem.runtimeStyle.left = elem.currentStyle.left;
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			elem.runtimeStyle.left = rsLeft;
		}

		return ret;
	};
}

function getWH( elem, name, extra ) {
	var which = name === "width" ? cssWidth : cssHeight,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

	if ( extra === "border" ) {
		return val;
	}

	jQuery.each( which, function() {
		if ( !extra ) {
			val -= parseFloat(jQuery.css( elem, "padding" + this )) || 0;
		}

		if ( extra === "margin" ) {
			val += parseFloat(jQuery.css( elem, "margin" + this )) || 0;

		} else {
			val -= parseFloat(jQuery.css( elem, "border" + this + "Width" )) || 0;
		}
	});

	return val;
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth, height = elem.offsetHeight,
			skip = elem.nodeName.toLowerCase() === "tr";

		return width === 0 && height === 0 && !skip ?
			true :
			width > 0 && height > 0 && !skip ?
				false :
				(elem.style.display || jQuery.css( elem, "display" )) === "none";
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

})( jQuery );
