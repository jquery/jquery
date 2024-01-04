/*
 * Optional limited selector module for custom builds.
 *
 * Note that this DOES NOT SUPPORT many documented jQuery
 * features in exchange for its smaller size:
 *
 * * Attribute not equal selector (!=)
 * * Positional selectors (:first; :eq(n); :odd; etc.)
 * * Type selectors (:input; :checkbox; :button; etc.)
 * * State-based selectors (:animated; :visible; :hidden; etc.)
 * * :has(selector) in browsers without native support
 * * :not(complex selector) in IE
 * * custom selectors via jQuery extensions
 * * Reliable functionality on XML fragments
 * * Matching against non-elements
 * * Reliable sorting of disconnected nodes
 * * querySelectorAll bug fixes (e.g., unreliable :focus on WebKit)
 *
 * If any of these are unacceptable tradeoffs, either use the full
 * selector engine or  customize this stub for the project's specific
 * needs.
 */

import { jQuery } from "./core.js";
import { document } from "./var/document.js";
import { whitespace } from "./var/whitespace.js";
import { isIE } from "./var/isIE.js";
import { rleadingCombinator } from "./selector/var/rleadingCombinator.js";
import { rdescend } from "./selector/var/rdescend.js";
import { rsibling } from "./selector/var/rsibling.js";
import { matches } from "./selector/var/matches.js";
import { testContext } from "./selector/testContext.js";
import { filterMatchExpr } from "./selector/filterMatchExpr.js";
import { preFilter } from "./selector/preFilter.js";
import { tokenize } from "./selector/tokenize.js";
import { toSelector } from "./selector/toSelector.js";

// The following utils are attached directly to the jQuery object.
import "./selector/escapeSelector.js";
import "./selector/uniqueSort.js";

var matchExpr = jQuery.extend( {
	needsContext: new RegExp( "^" + whitespace + "*[>+~]" )
}, filterMatchExpr );

jQuery.extend( {
	find: function( selector, context, results, seed ) {
		var elem, nid, groups, newSelector,
			newContext = context && context.ownerDocument,

			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9,
			i = 0;

		results = results || [];
		context = context || document;

		// Same basic safeguard as in the full selector module
		if ( !selector || typeof selector !== "string" ) {
			return results;
		}

		// Early return if context is not an element, document or document fragment
		if ( nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
			return [];
		}

		if ( seed ) {
			while ( ( elem = seed[ i++ ] ) ) {
				if ( jQuery.find.matchesSelector( elem, selector ) ) {
					results.push( elem );
				}
			}
		} else {

			newSelector = selector;
			newContext = context;

			// qSA considers elements outside a scoping root when evaluating child or
			// descendant combinators, which is not what we want.
			// In such cases, we work around the behavior by prefixing every selector in the
			// list with an ID selector referencing the scope context.
			// The technique has to be used as well when a leading combinator is used
			// as such selectors are not recognized by querySelectorAll.
			// Thanks to Andrew Dupont for this technique.
			if ( nodeType === 1 &&
				( rdescend.test( selector ) || rleadingCombinator.test( selector ) ) ) {

				// Expand context for sibling selectors
				newContext = rsibling.test( selector ) &&
					testContext( context.parentNode ) ||
					context;

				// Outside of IE, if we're not changing the context we can
				// use :scope instead of an ID.
				if ( newContext !== context || isIE ) {

					// Capture the context ID, setting it first if necessary
					if ( ( nid = context.getAttribute( "id" ) ) ) {
						nid = jQuery.escapeSelector( nid );
					} else {
						context.setAttribute( "id", ( nid = jQuery.expando ) );
					}
				}

				// Prefix every selector in the list
				groups = tokenize( selector );
				i = groups.length;
				while ( i-- ) {
					groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
						toSelector( groups[ i ] );
				}
				newSelector = groups.join( "," );
			}

			try {
				jQuery.merge( results, newContext.querySelectorAll( newSelector ) );
			} finally {
				if ( nid === jQuery.expando ) {
					context.removeAttribute( "id" );
				}
			}
		}

		return results;
	},
	expr: {

		// Can be adjusted by the user
		cacheLength: 50,

		match: matchExpr,
		preFilter: preFilter
	}
} );

jQuery.extend( jQuery.find, {
	matches: function( expr, elements ) {
		return jQuery.find( expr, null, null, elements );
	},
	matchesSelector: function( elem, expr ) {
		return matches.call( elem, expr );
	},
	tokenize: tokenize
} );

export { jQuery, jQuery as $ };
