// A method for quickly swapping in/out CSS properties to get correct calculations.
export function swap( elem, options, callback ) {
	var name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	try {
		return callback.call( elem );
	} finally {

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
}
