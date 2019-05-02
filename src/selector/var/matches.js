define( [
	"../../var/documentElement"
], function( documentElement ) {

"use strict";

return documentElement.matches || documentElement.msMatchesSelector;

} );
