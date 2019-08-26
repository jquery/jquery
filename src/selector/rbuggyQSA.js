define( [
	"../var/document",
	"../var/isIE"
], function( document, isIE ) {

"use strict";

var rbuggyQSA = [],
	testEl = document.createElement( "div" );

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

rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );

return rbuggyQSA;

} );
