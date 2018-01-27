define( [
	"../core/toType"
], function( toType ) {
	"use strict";

	return function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return toType( obj ) === "function" && toType( obj.nodeType ) !== "number";
  };

} );
