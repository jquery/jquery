import { jQuery } from "../core.js";
import { document } from "../var/document.js";
import { sort } from "../var/sort.js";
import { splice } from "../var/splice.js";
import { slice } from "../var/slice.js";

var hasDuplicate;

// Document order sorting
function sortOrder( a, b ) {

	// Flag for duplicate removal
	// Support: IE 11+
	// IE sometimes throws a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( a == b ) {
		hasDuplicate = true;
		return 0;
	}

	// Sort on method existence if only one input has compareDocumentPosition
	var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
	if ( compare ) {
		return compare;
	}

	// Calculate position if both inputs belong to the same document
	// Support: IE 11+
	// IE sometimes throws a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
		a.compareDocumentPosition( b ) :

		// Otherwise we know they are disconnected
		1;

	// Disconnected nodes
	if ( compare & 1 ) {

		// Choose the first element that is related to the document
		// Support: IE 11+
		// IE sometimes throws a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( a == document || a.ownerDocument == document &&
			jQuery.contains( document, a ) ) {
			return -1;
		}

		// Support: IE 11+
		// IE sometimes throws a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ( b == document || b.ownerDocument == document &&
			jQuery.contains( document, b ) ) {
			return 1;
		}

		// Maintain original order
		return 0;
	}

	return compare & 4 ? -1 : 1;
}

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
jQuery.uniqueSort = function( results ) {
	var j = 1,
		i = 1;

	hasDuplicate = false;

	sort.call( results, sortOrder );

	if ( hasDuplicate ) {

		// Pack the first instance of each unique element into the start of
		// results (starting at index 1 because index 0 is always kept), then
		// splice away the tail of duplicates.
		for ( ; i < results.length; i++ ) {
			if ( results[ i ] !== results[ i - 1 ] ) {
				results[ j++ ] = results[ i ];
			}
		}

		if ( Array.isArray( results ) ) {
			results.length = j;
		} else {
			splice.call( results, j );
		}
	}

	return results;
};

jQuery.fn.uniqueSort = function() {
	return this.pushStack( jQuery.uniqueSort( slice.apply( this ) ) );
};
