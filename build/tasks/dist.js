// Process files for distribution.
export default function processForDist( text, filename ) {
	if ( !text ) {
		throw new Error( "text required for processForDist" );
	}

	if ( !filename ) {
		throw new Error( "filename required for processForDist" );
	}

	// Ensure files use only \n for line endings, not \r\n
	if ( /\x0d\x0a/.test( text ) ) {
		throw new Error( filename + ": Incorrect line endings (\\r\\n)" );
	}

	// Ensure only ASCII chars so script tags don't need a charset attribute
	if ( text.length !== Buffer.byteLength( text, "utf8" ) ) {
		let message = filename + ": Non-ASCII characters detected:\n";
		for ( let i = 0; i < text.length; i++ ) {
			const c = text.charCodeAt( i );
			if ( c > 127 ) {
				message += "- position " + i + ": " + c + "\n";
				message += "==> " + text.substring( i - 20, i + 20 );
				break;
			}
		}
		throw new Error( message );
	}
}
