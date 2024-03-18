import { jQuery } from "../core.js";
import { access } from "../core/access.js";
import { nodeName } from "../core/nodeName.js";
import { rnothtmlwhite } from "../var/rnothtmlwhite.js";
import { isIE } from "../var/isIE.js";

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ];
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = elem.getAttribute( name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Support: IE <=11+
// An input loses its value after becoming a radio
if ( isIE ) {
	jQuery.attrHooks.type = {
		set: function( elem, value ) {
			if ( value === "radio" && nodeName( elem, "input" ) ) {
				var val = elem.value;
				elem.setAttribute( "type", value );
				if ( val ) {
					elem.value = val;
				}
				return value;
			}
		}
	};
}

// HTML boolean attributes have special behavior - the attribute presence
// corresponds to the `true` value and the lack of it - to `false`. The only
// officially valid values are an empty string or the attribute name.
// See https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
//
// Because of that, jQuery used to normalize the value to the name in both
// the getter & setter. However, the spec occasionally adds more values, making
// the attribute non-boolean anymore.
//
// For backwards compatibility, jQuery keeps special logic for select more popular
// attributes that are or were boolean attributes (this list is not meant
// to expand):
// 1. In the getter, an empty string is converted to the lowercase name.
// 2. In the setter, `false` means attribute removal and `true` is converted to name.
// For other getter/setter inputs no special logic is applied.
jQuery.each( (
	"disabled checked readonly selected required hidden open autofocus multiple"
).split( " " ), function( _i, name ) {
	jQuery.attrHooks[ name ] = {
		get: function( elem ) {
			return elem.getAttribute( name ) === "" ?
				name.toLowerCase() :
				null;
		},

		set: function( elem, value, name ) {
			if ( value === false ) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
				return name;
			}

			if ( value === true ) {

				// Transform `true` into the attribute name for compatibility
				// with older jQuery and the pattern of the boolean attribute
				// setter mirroring the associated property one.
				elem.setAttribute( name, name );
				return name;
			}
		}
	};
} );
