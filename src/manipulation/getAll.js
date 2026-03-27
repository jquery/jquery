import { jQuery } from "../core.js";
import { nodeName } from "../core/nodeName.js";
import { arr } from "../var/arr.js";

export function getAll( context, tag ) {

	var ret;

	if ( context.getElementsByTagName ) {

		// Use slice to snapshot the live collection from gEBTN
		ret = arr.slice.call( context.getElementsByTagName( tag || "*" ) );

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
