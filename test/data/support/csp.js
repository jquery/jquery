var src;
if ( window.frameElement ) {
	src = window.parent.document.getElementById("jquery-js").src.replace( /^(?![^\/?#]+:)/, window.parent.location.pathname.replace( /[^\/]$/, "$0/" ) );

	window.setTimeout(function() {
		jQuery(function() {
			window.parent.iframeCallback( jQuery.support );
		});
	}, 300 );

} else {
	src = "../../../dist/jquery.js";
}

document.write( "<script id='jquery-js' src='" + src + "'><\x2Fscript>" );


