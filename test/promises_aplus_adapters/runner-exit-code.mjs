import assert from "node:assert";
import { runTests } from "../../build/tasks/promises_aplus_tests.js";

// Regression test for `npm run test:promises_aplus` exiting 0 when a Promises/A+
// suite fails. The runner used to spawn each suite without inspecting its exit
// code, so CI could not catch regressions in Deferred's A+ compliance.
//
// The sub-process is stubbed so the aggregation logic is exercised directly; the
// real suite is still run by the npm script itself.

const exitWith = ( code ) => () => Promise.resolve( code );

assert.strictEqual(
	await runTests( { runTest: exitWith( 0 ), testFiles: [ "a.cjs", "b.cjs" ] } ),
	true,
	"all suites passing must be reported as success"
);

assert.strictEqual(
	await runTests( { runTest: exitWith( 1 ), testFiles: [ "a.cjs" ] } ),
	false,
	"a failing suite must be reported as failure"
);

assert.strictEqual(
	await runTests( { runTest: exitWith( 0 ), testFiles: [] } ),
	true,
	"no suites is vacuously successful"
);

// The bug: one failing suite among passing ones was ignored.
const mixed = ( test ) => Promise.resolve( test === "failing.cjs" ? 1 : 0 );
assert.strictEqual(
	await runTests( {
		runTest: mixed,
		testFiles: [ "passing.cjs", "failing.cjs" ]
	} ),
	false,
	"a single failing suite among passing ones must fail the run"
);

console.log( "promises_aplus_tests: exit code propagation OK" );
