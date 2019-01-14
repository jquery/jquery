/* global startIframeTest */

jQuery( function() {
	var script = document.createElement( "script" );
	script.setAttribute( "nonce", "jquery+hardcoded+nonce" );
	script.innerHTML = "startIframeTest()";
	$( document.head ).append( script );
} );
