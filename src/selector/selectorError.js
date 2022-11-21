function selectorError( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
}

export default selectorError;
