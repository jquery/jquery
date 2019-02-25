/* global startIframeTest */

jQuery( function() {
	"use strict";

	var elem = jQuery( "<div></div><span></span><a></a>" );
	var result = "";
	var i;
	for ( i of elem ) {
		result += i.nodeName;
	}

	startIframeTest( result );
} );
