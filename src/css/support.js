import document from "../var/document.js";
import documentElement from "../var/documentElement.js";
import support from "../var/support.js";

( function() {

var reliableTrDimensionsVal,
	div = document.createElement( "div" );

// Finish early in limited (non-browser) environments
if ( !div.style ) {
	return;
}

// Support: IE 10 - 11+
// IE misreports `getComputedStyle` of table rows with width/height
// set in CSS while `offset*` properties report correct values.
// Support: Firefox 70+
// Only Firefox includes border widths
// in computed dimensions. (gh-4529)
support.reliableTrDimensions = function() {
	var table, tr, trStyle;
	if ( reliableTrDimensionsVal == null ) {
		table = document.createElement( "table" );
		tr = document.createElement( "tr" );

		table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
		tr.style.cssText = "border:1px solid";

		// Support: Chrome 86+
		// Height set through cssText does not get applied.
		// Computed height then comes back as 0.
		tr.style.height = "1px";
		div.style.height = "9px";

		// Support: Android Chrome 86+
		// In our bodyBackground.html iframe,
		// display for all div elements is set to "inline",
		// which causes a problem only in Android Chrome, but
		// not consistently across all devices.
		// Ensuring the div is display: block
		// gets around this issue.
		div.style.display = "block";

		documentElement
			.appendChild( table )
			.appendChild( tr )
			.appendChild( div );

		trStyle = window.getComputedStyle( tr );
		reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
				parseInt( trStyle.borderTopWidth, 10 ) +
				parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

		documentElement.removeChild( table );
	}
	return reliableTrDimensionsVal;
};
} )();

export default support;
