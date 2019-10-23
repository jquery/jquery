import class2type from "../var/class2type";
import toString from "../var/toString";

function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	return typeof obj === "object" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}

export default toType;
