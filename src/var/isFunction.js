define( function() {
	"use strict";

	return function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52, QtWeb <=3.8.5, WebKit <=534.34,
		// wkhtmltopdf tool <=0.12.5
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node or DOM collection as a function.
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			[ "[object HTMLCollection]", "[object NodeList]" ]
				.indexOf( toString.call( obj ) ) === -1;
	};

} );
