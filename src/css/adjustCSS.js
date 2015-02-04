define([
	"../core",
	"../var/rfxnum"
], function( jQuery, rfxnum ) {

function adjustCSS( elem, prop, value, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = value && value[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
		// Starting value computation is required for potential unit mismatches
		recasted = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rfxnum.exec( jQuery.css( elem, prop ) );

	if ( recasted && recasted[ 3 ] !== unit ) {
		// Trust units reported by jQuery.css
		unit = unit || recasted[ 3 ];

		// Make sure we update the tween properties later on
		value = value || [];

		// Iteratively approximate from a nonzero starting point
		recasted = +initial || 1;

		do {
			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			recasted = recasted / scale;
			jQuery.style( elem, prop, recasted + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations
		);
	}

	if ( value ) {
		recasted = +recasted || +initial || 0;
		adjusted = value[ 1 ] ?
			recasted + ( value[ 1 ] + 1 ) * value[ 2 ] :
			+value[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = recasted;
			tween.end = adjusted;
		}
	}
	return adjusted;
}

return adjustCSS;
});
