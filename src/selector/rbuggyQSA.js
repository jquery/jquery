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

if ( !support.cssSupportsSelector ) {

	// Support: Chrome 105+, Safari 15.4+
	// `:has()` uses a forgiving selector list as an argument so our regular
	// `try-catch` mechanism fails to catch `:has()` with arguments not supported
	// natively like `:has(:contains("Foo"))`. Where supported & spec-compliant,
	// we now use `CSS.supports("selector(:is(SELECTOR_TO_BE_TESTED))")`, but
	// outside that we mark `:has` as buggy.
	rbuggyQSA.push( ":has" );
}

rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );

export default rbuggyQSA;
