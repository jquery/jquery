import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";

const command = path.resolve(
	`node_modules/.bin/promises-aplus-tests${ os.platform() === "win32" ? ".cmd" : "" }`
);
const args = [ "--reporter", "dot", "--timeout", "2000" ];
const tests = [
	"test/promises_aplus_adapters/deferred.cjs",
	"test/promises_aplus_adapters/when.cjs"
];

async function runTests() {
	tests.forEach( ( test ) => {
		spawn(
			command,
			[ test ].concat( args ),
			{ shell: true, stdio: "inherit" }
		);
	} );
}

runTests();
