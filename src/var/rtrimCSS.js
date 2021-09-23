define( [
	"./whitespace"
], function( whitespace ) {

"use strict";

return new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);

} );
