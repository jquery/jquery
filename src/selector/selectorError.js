import { jQuery } from "../core.js";

export function selectorError( msg ) {
	jQuery.error( "Syntax error, unrecognized expression: " + msg );
}
