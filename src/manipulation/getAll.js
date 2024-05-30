import { jQuery } from "../core.js";
import { nodeName } from "../core/nodeName.js";

export function getAll( context, tag ) {

	var ret;

	if ( context.getElementsByTagName ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( context.querySelectorAll ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}
