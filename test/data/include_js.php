(function() {

window.hasPHP = false /* <?php echo "*" + "/ || true /*"; ?> */;

if ( !window.top.jQueryIncludes ) {
	
	window.top.jQueryIncludes = (function() {
	
		var location = window.top.document.location.href,
			baseURL = location.replace( /\/test\/.+/, "/"),
			version = /(?:&|\?)jquery=([^&]+?)(?:$|&)/.exec( location ),
			includes, i;

		if ( version ) {
			version = version[ 1 ];
			if( version === "min" ) {
				includes = [ baseURL + "dist/jquery.min.js" ];
			} else if( version === "dist" ) {
				includes = [ baseURL + "dist/jquery.js" ];
			} else {
				includes = [ "http://code.jquery.com/jquery-" + version + ".js" ];
			}
		} else {
			includes = [
				"core",
				"callbacks",
				"deferred",
				"support",
				"data",
				"queue",
				"attributes",
				"event",
				"sizzle/sizzle",
				"sizzle-jquery",
				"traversing",
				"manipulation",
				"css",
				"ajax",
				"ajax/jsonp",
				"ajax/script",
				"ajax/xhr",
				"effects",
				"offset",
				"dimensions",
				"exports"
			];
			for ( i = includes.length; i--; ) {
				includes[ i ] = baseURL + "src/" + includes[ i ] + ".js";
			}	
		}
		
		for ( i = includes.length; i--; ) {
			includes[ i ] = "<script src='" + includes[ i ] + "'><" + "/script>";
		}

		return includes.join( "\n" );
	})();
}

document.write( window.top.jQueryIncludes );

})();
