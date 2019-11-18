import jQuery from "../core.js";
import isAttached from "../core/isAttached.js";
import getStyles from "./var/getStyles.js";

function curCSS( elem, name, computed ) {
	var ret;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for `.css('--customProperty')` (gh-3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

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
