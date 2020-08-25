/* global startIframeTest */

var timeoutId, type;

function finalize() {
	startIframeTest( type, window.downloadedScriptCalled );
}

timeoutId = setTimeout( function() {
	finalize();
}, 1000 );

jQuery
	.ajax( {
		url: "csp-ajax-script-downloaded.js",
		dataType: "script",
		method: "POST",
		beforeSend: function( _jqXhr, settings ) {
			type = settings.type;
		}
	} )
	.then( function() {
		clearTimeout( timeoutId );
		finalize();
	} );
