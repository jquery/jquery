import { version } from "node:process";

const nodeV18OrNewer = !/^v1[0-7]\./.test( version );

export default function verifyNodeVersion() {
	if ( !nodeV18OrNewer ) {
		console.log( "Old Node.js detected, task skipped..." );
		return false;
	}
	return true;
}
