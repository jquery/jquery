// Simple script loader that uses jQuery.readyWait via jQuery.holdReady()

//Hold on jQuery!
jQuery.holdReady(true);

var readyRegExp = /^(complete|loaded)$/;

function assetLoaded( evt ){
	var node = evt.currentTarget || evt.srcElement;
	if ( evt.type === "load" || readyRegExp.test(node.readyState) ) {
		jQuery.holdReady(false);
	}
}

setTimeout( function() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	if ( script.addEventListener ) {
		script.addEventListener( "load", assetLoaded, false );
	} else {
		script.attachEvent( "onreadystatechange", assetLoaded );
	}
	script.src = "data/readywaitasset.js";
	document.getElementsByTagName("head")[0].appendChild(script);
}, 2000 );
