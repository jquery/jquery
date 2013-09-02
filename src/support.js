define([
	"./core",
	"./var/strundefined",
	"./var/support",
	// This is listed as a dependency for build order, but it's still optional in builds
	"./core/ready"
], function( jQuery, strundefined, support ) {

// Note: most support tests are defined in their respective modules.

jQuery(function() {
	// We need to execute this one support test ASAP because we need to know
	// if body.style.zoom needs to be set.

	var container,
		div = document.createElement( "div" ),
		divReset =
			"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;" +
			"display:block;padding:0;margin:0;border:0",
		body = document.getElementsByTagName("body")[0];

	if ( !body ) {
		// Return for frameset docs that don't have a body
		return;
	}

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	container = document.createElement( "div" );
	container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

	body.appendChild( container ).appendChild( div );

	// Will be changed later if needed.
	support.inlineBlockNeedsLayout = false;

	if ( typeof div.style.zoom !== strundefined ) {
		// Support: IE<8
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		div.innerHTML = "";
		div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
		support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

		if ( support.inlineBlockNeedsLayout ) {
			// Prevent IE 6 from affecting layout for positioned elements #11048
			// Prevent IE from shrinking the body in IE 7 mode #12869
			// Support: IE<8
			body.style.zoom = 1;
		}
	}

	body.removeChild( container );

	// Null elements to avoid leaks in IE
	container = div = null;
});

});
