import { jQuery } from "../core.js";
import { nodeName } from "../core/nodeName.js";

export function getAll( context, tag ) {

	var ret;

	if ( context.querySelectorAll ) {

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
