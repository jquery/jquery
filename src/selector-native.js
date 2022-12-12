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
 * * :has(selector)
 * * :not(complex selector)
 * * custom selectors via jQuery extensions
 * * Leading combinators (e.g., $collection.find("> *"))
 * * Reliable functionality on XML fragments
 * * Requiring all parts of a selector to match elements under context
 *     (e.g., $div.find("div > *") now matches children of $div)
 * * Matching against non-elements
 * * Reliable sorting of disconnected nodes
 * * querySelectorAll bug fixes (e.g., unreliable :focus on WebKit)
 *
 * If any of these are unacceptable tradeoffs, either use the full
 * selector engine or  customize this stub for the project's specific
 * needs.
 */

import jQuery from "./core.js";
import document from "./var/document.js";
import documentElement from "./var/documentElement.js";
import whitespace from "./var/whitespace.js";

// The following utils are attached directly to the jQuery object.
import "./selector/escapeSelector.js";
import "./selector/uniqueSort.js";

// Support: IE 9 - 11+
// IE requires a prefix.
var matches = documentElement.matches || documentElement.msMatchesSelector;

jQuery.extend( {
	find: function( selector, context, results, seed ) {
		var elem, nodeType,
			i = 0;

		results = results || [];
		context = context || document;

		// Same basic safeguard as in the full selector module
		if ( !selector || typeof selector !== "string" ) {
			return results;
		}

		// Early return if context is not an element, document or document fragment
		if ( ( nodeType = context.nodeType ) !== 1 && nodeType !== 9 && nodeType !== 11 ) {
			return [];
		}

		if ( seed ) {
			while ( ( elem = seed[ i++ ] ) ) {
				if ( jQuery.find.matchesSelector( elem, selector ) ) {
					results.push( elem );
				}
			}
		} else {
			jQuery.merge( results, context.querySelectorAll( selector ) );
		}

		return results;
	},
	expr: {
		attrHandle: {},
		match: {
			bool: new RegExp( "^(?:checked|selected|async|autofocus|autoplay|controls|defer" +
				"|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$", "i" ),
			needsContext: new RegExp( "^" + whitespace + "*[>+~]" )
		}
	}
} );

jQuery.extend( jQuery.find, {
	matches: function( expr, elements ) {
		return jQuery.find( expr, null, null, elements );
	},
	matchesSelector: function( elem, expr ) {
		return matches.call( elem, expr );
	}
} );
