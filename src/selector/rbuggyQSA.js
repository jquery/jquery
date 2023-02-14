import isIE from "../var/isIE.js";
import whitespace from "../var/whitespace.js";
import support from "./support.js";

var rbuggyQSA = [];

if ( isIE ) {
	rbuggyQSA.push(

		// Support: IE 9 - 11+
		// IE's :disabled selector does not pick up the children of disabled fieldsets
		":enabled",
		":disabled",

		// Support: IE 11+
		// IE 11 doesn't find elements on a `[name='']` query in some cases.
		// Adding a temporary attribute to the document before the selection works
		// around the issue.
		"\\[" + whitespace + "*name" + whitespace + "*=" +
			whitespace + "*(?:''|\"\")"
	);
}

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

export default rbuggyQSA;
