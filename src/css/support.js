define( [
	"../core",
	"../var/document",
	"../var/documentElement",
	"../var/support"
], function( jQuery, document, documentElement, support ) {

"use strict";

( function() {

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal, reliableTrDimensionsVal, reliableColDimensionsVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" ),
		table = document.createElement( "table" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );

		// Support: Firefox <=48 - 61 only
		// Inside hidden iframes computed style is null in old Firefox.
		pixelPositionVal = divStyle && divStyle.top !== "1%";

		// Don't run until window is visible (https://github.com/jquery/jquery-ui/issues/2176)
		if ( div.offsetWidth === 0 ) {
			documentElement.removeChild( container );
			return;
		}

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the table so it wouldn't be stored in the memory;
		// it will also be a sign that checks were already performed.
		div = null;
	}

	// Executing table tests requires only one layout, so they're executed
	// at the same time to save the second computation.
	function computeTableStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !table ) {
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
		// Support: IE 11+, Edge 15 - 18+
		// In IE/Edge, `<col>` computed width is `"auto"` unless `width` is set
		// explicitly via CSS so measurements there remain incorrect. Because of
		// the lack of a proper workaround, we accept this limitation, treating
		// IE/Edge as passing the test. Detect them by checking for
		// `msMatchesSelector`; despite Edge 15+ implementing `matches`, all
		// IE 9+ and Edge Legacy versions implement `msMatchesSelector` as well.
		reliableColDimensionsVal = !!documentElement.msMatchesSelector || Math.round( parseFloat(
			window.getComputedStyle( col ).width )
		) === 18;

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
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

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		reliableTrDimensions: function() {
			computeTableStyleTests();
			return reliableTrDimensionsVal;
		},
		reliableColDimensions: function() {
			computeTableStyleTests();
			return reliableColDimensionsVal;
		}
	} );
} )();

return support;

} );
