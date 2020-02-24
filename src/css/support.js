import document from "../var/document.js";
import documentElement from "../var/documentElement.js";
import support from "../var/support.js";

var reliableTrDimensionsVal;

// Support: IE 11+, Edge 15 - 18+
// IE/Edge misreport `getComputedStyle` of table rows with width/height
// set in CSS while `offset*` properties report correct values.
support.reliableTrDimensions = function() {
	var table, tr, trChild, trStyle;
	if ( reliableTrDimensionsVal == null ) {
		table = document.createElement( "table" );
		tr = document.createElement( "tr" );
		trChild = document.createElement( "div" );

		table.style.cssText = "position:absolute;left:-11111px";
		tr.style.height = "1px";
		trChild.style.height = "9px";

		documentElement
			.appendChild( table )
			.appendChild( tr )
			.appendChild( trChild );

		trStyle = window.getComputedStyle( tr );
		reliableTrDimensionsVal = parseInt( trStyle.height ) > 3;

		documentElement.removeChild( table );
	}
	return reliableTrDimensionsVal;
};

export default support;
