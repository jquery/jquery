/* global startIframeTest */

jQuery( function() {
	$.globalEval( "startIframeTest()", { nonce: "jquery+hardcoded+nonce" } );
} );
