define( [
	"../core",
	"../var/document",
	"../var/documentElement",
	"../var/support"
], function( jQuery, document, documentElement, support ) {

"use strict";

var reliableTrDimensionsVal;

// Support: IE 11+, Edge 15 - 18+
// IE/Edge misreport `getComputedStyle` of table rows with width/height
// set in CSS while `offset*` properties report correct values.
support.reliableTrDimensions = function() {
	var table;
	if ( reliableTrDimensionsVal == null ) {
		table = document.createElement( "table" );
		jQuery.extend( table.style, { position: "absolute", left: "-11111px" } );
		documentElement.appendChild( table ).innerHTML =
			"<tbody><tr style='height:1px'><div style='height:11px'></div></tr></tbody>";

		reliableTrDimensionsVal = parseFloat(
			window.getComputedStyle( table.firstChild.firstChild ).height ) > 3;

		documentElement.removeChild( table );
	}
	return reliableTrDimensionsVal;
};

return support;

} );
