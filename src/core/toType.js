import { class2type } from "../var/class2type.js";
import { toString } from "../var/toString.js";

export function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	return typeof obj === "object" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
