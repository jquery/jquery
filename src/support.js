define([
	"./core",
	"./var/support",
	"./core/init", // Needed for hasOwn support test
	// This is listed as a dependency for build order, but it's still optional in builds
	"./core/ready"
], function( jQuery, support ) {

// Support: IE<9
// Iteration over object's inherited properties before its own
var i;
for ( i in jQuery( support ) ) {
	break;
}
support.ownFirst = i === "0";

// Note: most support tests are defined in their respective modules.

});
