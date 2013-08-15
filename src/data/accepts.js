define([
	"../core"
], function( jQuery ) {

/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( elem ) {
	// Do not set data on non-element because it will not be cleared (#8335).
	if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
		return false;
	}

	var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

	// nodes accept data unless otherwise specified; rejection can be conditional
	return !noData || noData !== true && elem.getAttribute("classid") === noData;
};

return jQuery.acceptData;
});
