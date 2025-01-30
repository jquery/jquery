import { support } from "./support.js";

// Build QSA regex.
// Regex strategy adopted from Diego Perini.
export var rbuggyQSA = [];

if ( !support.cssHas ) {

	// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
	// Our regular `try-catch` mechanism fails to detect natively-unsupported
	// pseudo-classes inside `:has()` (such as `:has(:contains("Foo"))`)
	// in browsers that parse the `:has()` argument as a forgiving selector list.
	// https://drafts.csswg.org/selectors/#relational now requires the argument
	// to be parsed unforgivingly, but browsers have not yet fully adjusted.
	rbuggyQSA.push( ":has" );
}

rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
