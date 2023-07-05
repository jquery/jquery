import { jQuery } from "../core.js";
import { toType } from "../core/toType.js";
import { isAttached } from "../core/isAttached.js";
import { arr } from "../var/arr.js";
import { rtagName } from "./var/rtagName.js";
import { rscriptType } from "./var/rscriptType.js";
import { wrapMap } from "./wrapMap.js";
import { getAll } from "./getAll.js";
import { setGlobalEval } from "./setGlobalEval.js";
import { isArrayLike } from "../core/isArrayLike.js";

var rhtml = /<|&#?\w+;/;

export function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" && ( elem.nodeType || isArrayLike( elem ) ) ) {
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || arr;

				// Create wrappers & descend into them.
				j = wrap.length;
				while ( --j > -1 ) {
					tmp = tmp.appendChild( context.createElement( wrap[ j ] ) );
				}

				tmp.innerHTML = jQuery.htmlPrefilter( elem );

				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}
