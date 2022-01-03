import jQuery from "../core.js";
import isAttached from "../core/isAttached.js";
import getStyles from "./var/getStyles.js";
import rcustomProp from "./var/rcustomProp.js";
import rtrim from "../var/rtrim.js";

function curCSS( elem, name, computed ) {
	var ret,
		isCustomProp = rcustomProp.test( name );

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for `.css('--customProperty')` (gh-3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		// trim whitespace for custom property (issue gh-4926)
		if ( isCustomProp ) {

			// rtrim treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrim, "$1" );
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}

export default curCSS;
