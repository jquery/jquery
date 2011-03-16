(function( jQuery ) {

var rclass = /[\n\t\r]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			if ( this.nodeType === 1 ) {
				jQuery.removeAttr( this, name );
			}
		});
	},
	
	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},
	
	removeProp: function( name ) {
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class") || "") );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ",
							setClass = elem.className;

						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspaces );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( !arguments.length ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
					if ( one && !values.length && options.length ) {
						return jQuery( options[ index ] ).val();
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray(val) ) {
				val = jQuery.map(val, function (value) {
					return value == null ? "" : value + "";
				});
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
	
	attrFix: {},
	
	attr: function( elem, name, value, pass ) {
		
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || elem.nodeType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var ret,
			notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			hooks;

		// Normalize the name if needed
		name = notxml && jQuery.attrFix[ name ] || name;

		hooks = jQuery.attrHooks[ name ];

		if ( value !== undefined ) {

			if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value )) !== undefined ) {
				return ret;

			} else if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return undefined;

			} else {
				elem.setAttribute( name, value );
				return value;
			}

		} else {

			if ( hooks && "get" in hooks && notxml && ((ret = hooks.get( elem )) !== undefined || name === "tabIndex") ) {
				return ret;

			} else {
				var attr = elem.getAttribute( name );

				// Non-existent attributes return null, we normalize to undefined
				return attr === null || attr === "undefined" || attr === "null" ?
					undefined :
					attr;
			}
		}
	},
	
	removeAttr: function( elem, name ) {
		name = jQuery.attrFix[ name ] || name;
		
		if ( jQuery.support.getSetAttribute ) {
			elem.removeAttribute( name );
		} else {
			// set property to null if getSetAttribute not supported (IE6-7)
			// setting className to null makes the class "null"
			if ( name === "className" ) {
				elem.className = "";
			} else {
				elem.setAttribute( name, null );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				}
			}
		}
	},
	
	propFix: {},
	
	prop: function( elem, name, value ) {
		
		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || elem.nodeType === 2 ) {
			return undefined;
		}
		
		var ret, hooks, notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem );
		
		// Try to normalize/fix the name
		name = notxml && jQuery.propFix[ name ] || name;
		
		hooks = jQuery.propHooks[ name ];
		
		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value )) !== undefined ) {
				return ret;
			
			} else {
				return (elem[ name ] = value);
			}
		
		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem )) !== undefined ) {
				return ret;
				
			} else {
				return elem[ name ];
			}
		}
	},
	
	propHooks: {}
});

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !jQuery.support.getSetAttribute ) {
	jQuery.attrFix = jQuery.extend( jQuery.attrFix, {
		"for": "htmlFor",
		"class": "className",
		readonly: "readOnly",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		rowspan: "rowSpan",
		colspan: "colSpan",
		tabindex: "tabIndex",
		usemap: "useMap",
		frameborder: "frameBorder"
	});

	// Action attribute in ie6/7 returns form objects
	jQuery.attrHooks.action = {
		get: function( elem ) {
			return elem.nodeName === "FORM" ?
				elem.getAttributeNode("action").nodeValue :
				elem.getAttribute("action");
		},
		set: function( elem, value ) {
			elem.nodeName === "FORM" ?
				elem.getAttributeNode("action").nodeValue = value :
				elem.setAttribute("action", value);
			return value;
		}
	};
}

// Remove certain attrs if set to false
jQuery.each([ "selected", "checked", "readonly", "disabled" ], function( i, name ) {
	name = jQuery.attrFix[ name ] || name;

	jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
		set: function( elem, value ) {
			if ( !value ) { // '', undefined, false, null will remove attr
				jQuery.removeAttr( elem, name );
				return false;
			}

			elem.setAttribute( name, value );
			return value;
		}
	});
});

// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
jQuery.attrHooks[ jQuery.attrFix.tabindex || "tabindex" ] = {
	get: function( elem ) {
		var attributeNode = elem.getAttributeNode("tabIndex");

		return attributeNode && attributeNode.specified ?
			parseInt( attributeNode.value, 10 ) :
			rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
				0 :
				undefined;
	}
};

// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "style" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				return elem.getAttribute( name, 2 );
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			return elem.style.cssText;
		},
		
		set: function( elem, value ) {
			return (elem.style.cssText = "" + value);
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {

	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			
			if ( parent ) {
				parent.selectedIndex;
				
				// TODO: We may need an attrHook for selected that simply defers to prop?
				// The attr is undefined if the option is created with createElement and not on the DOM
				
				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

})( jQuery );