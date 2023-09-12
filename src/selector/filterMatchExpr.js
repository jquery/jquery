import { whitespace } from "../var/whitespace.js";
import { identifier } from "./var/identifier.js";
import { attributes } from "./var/attributes.js";
import { pseudos } from "./var/pseudos.js";

export var filterMatchExpr = {
	ID: new RegExp( "^#(" + identifier + ")" ),
	CLASS: new RegExp( "^\\.(" + identifier + ")" ),
	TAG: new RegExp( "^(" + identifier + "|[*])" ),
	ATTR: new RegExp( "^" + attributes ),
	PSEUDO: new RegExp( "^" + pseudos ),
	CHILD: new RegExp(
		"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
		whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
		whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" )
};
