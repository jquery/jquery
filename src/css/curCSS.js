import { jQuery } from "../core.js";
import { isAttached } from "../core/isAttached.js";
import { getStyles } from "./var/getStyles.js";
import { rcustomProp } from "./var/rcustomProp.js";
import { rtrimCSS } from "../var/rtrimCSS.js";

export function curCSS( elem, name, computed ) {
	var ret,
		isCustomProp = rcustomProp.test( name );

	computed = computed || getStyles( elem );

	if ( computed ) {

		// getPropertyValue is needed for `.css('--customProperty')` (gh-3144)
		// Some regular properties - if their camelCased form is identical to
		// the kebab-cased one - would return the value from `getPropertyValue`
		// instead of directly from a property of `computed`. The value from
		// direct property access would be identical, though, so this is not
		// an issue.
		//
		// A fallback to direct property access is needed as `computed`, being
		// the output of `getComputedStyle`, contains camelCased keys and
		// `getPropertyValue` requires kebab-case ones.
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( isCustomProp && ret ) {

			// Support: Firefox 105 - 135+
			// Spec requires trimming whitespace for custom properties (gh-4926).
			// Firefox only trims leading whitespace.
			//
			// Fall back to `undefined` if empty string returned.
			// This collapses a missing definition with property defined
			// and set to an empty string but there's no standard API
			// allowing us to differentiate them without a performance penalty
			// and returning `undefined` aligns with older jQuery.
			//
			// rtrimCSS treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimCSS, "$1" ) || undefined;
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}
	}

	return ret;
}
