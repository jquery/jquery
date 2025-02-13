import { jQuery } from "../core.js";
import { document } from "../var/document.js";
import { documentElement } from "../var/documentElement.js";
import { support } from "../var/support.js";
import { isIE } from "../var/isIE.js";

var reliableTrDimensionsVal, reliableColDimensionsVal,
	table = document.createElement( "table" );

// Executing table tests requires only one layout, so they're executed
// at the same time to save the second computation.
function computeTableStyleTests() {
	if (

		// This is a singleton, we need to execute it only once
		!table ||

		// Finish early in limited (non-browser) environments
		!table.style
	) {
		return;
	}

	var trStyle,
		col = document.createElement( "col" ),
		tr = document.createElement( "tr" ),
		td = document.createElement( "td" );

	table.style.cssText = "position:absolute;left:-11111px;" +
		"border-collapse:separate;border-spacing:0";
	tr.style.cssText = "box-sizing:content-box;border:1px solid;height:1px";
	td.style.cssText = "height:9px;width:9px;padding:0";

	col.span = 2;

	documentElement
		.appendChild( table )
		.appendChild( col )
		.parentNode
		.appendChild( tr )
		.appendChild( td )
		.parentNode
		.appendChild( td.cloneNode( true ) );

	// Don't run until window is visible
	if ( table.offsetWidth === 0 ) {
		documentElement.removeChild( table );
		return;
	}

	trStyle = window.getComputedStyle( tr );

	// Support: Firefox 135+
	// Firefox always reports computed width as if `span` was 1.
	// Support: Safari 18.3+
	// In Safari, computed width for columns is always 0.
	// In both these browsers, using `offsetWidth` solves the issue.
	// Support: IE 11+
	// In IE, `<col>` computed width is `"auto"` unless `width` is set
	// explicitly via CSS so measurements there remain incorrect. Because of
	// the lack of a proper workaround, we accept this limitation, treating
	// IE as passing the test.
	reliableColDimensionsVal = isIE || Math.round( parseFloat(
		window.getComputedStyle( col ).width )
	) === 18;

	// Support: IE 10 - 11+
	// IE misreports `getComputedStyle` of table rows with width/height
	// set in CSS while `offset*` properties report correct values.
	// Support: Firefox 70 - 135+
	// Only Firefox includes border widths
	// in computed dimensions for table rows. (gh-4529)
	reliableTrDimensionsVal = Math.round( parseFloat( trStyle.height ) +
		parseFloat( trStyle.borderTopWidth ) +
		parseFloat( trStyle.borderBottomWidth ) ) === tr.offsetHeight;

	documentElement.removeChild( table );

	// Nullify the table so it wouldn't be stored in the memory;
	// it will also be a sign that checks were already performed.
	table = null;
}

jQuery.extend( support, {
	reliableTrDimensions: function() {
		computeTableStyleTests();
		return reliableTrDimensionsVal;
	},

	reliableColDimensions: function() {
		computeTableStyleTests();
		return reliableColDimensionsVal;
	}
} );

export { support };
