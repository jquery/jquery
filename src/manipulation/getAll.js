import { jQuery } from "../core.js";
import { nodeName } from "../core/nodeName.js";

export function getAll( context, tag ) {

	// Support: IE <=9 - 11+
	// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.querySelectorAll !== "undefined" ) {

		// Note: we don't escape the tag here as we only pass
		// ones that don't require escaping. As soon as that changes,
		// wrap `tag` with `jQuery.escapeSelector`.
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}
