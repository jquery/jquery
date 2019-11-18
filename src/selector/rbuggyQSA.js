import document from "../var/document.js";
import isIE from "../var/isIE.js";
import whitespace from "./var/whitespace.js";

var rbuggyQSA = [],
	testEl = document.createElement( "div" ),
	input = document.createElement( "input" );

testEl.innerHTML = "<a href=''></a>";

// Support: Chrome 38 - 77 only
// Chrome considers anchor elements with href to match ":enabled"
// See https://bugs.chromium.org/p/chromium/issues/detail?id=993387
if ( testEl.querySelectorAll( ":enabled" ).length ) {
	rbuggyQSA.push( ":enabled" );
}

// Support: IE 9 - 11+
// IE's :disabled selector does not pick up the children of disabled fieldsets
if ( isIE ) {
	rbuggyQSA.push( ":enabled", ":disabled" );
}

// Support: IE 11+, Edge 15 - 18+
// IE 11/Edge don't find elements on a `[name='']` query in some cases.
// Adding a temporary attribute to the document before the selection works
// around the issue.
// Interestingly, IE 10 & older don't seem to have the issue.
input.setAttribute( "name", "" );
testEl.appendChild( input );
if ( !testEl.querySelectorAll( "[name='']" ).length ) {
	rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
		whitespace + "*(?:''|\"\")" );
}

rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );

export default rbuggyQSA;
