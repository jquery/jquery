import chalk from "chalk";
import { getBrowserString } from "../lib/getBrowserString.js";
import { prettyMs } from "../lib/prettyMs.js";

export function reportTest( test, { browser, headless } ) {
	if ( test.status === "passed" ) {

		// Write to console without newlines
		process.stdout.write( "." );
		return;
	}

	console.log(
		`\n\nTest ${ test.status } on ${ chalk.yellow(
			getBrowserString( browser, headless )
		) }.`
	);
	console.log( chalk.bold( `${ test.suiteName }: ${ test.name }` ) );

	// Prefer failed assertions over error messages
	if ( test.assertions.filter( ( a ) => !!a && !a.passed ).length ) {
		test.assertions.forEach( ( assertion, i ) => {
			if ( !assertion.passed ) {
				console.error( `${ i + 1 }. ${ chalk.red( assertion.message ) }` );
				console.error( chalk.gray( assertion.stack ) );
			}
		} );
	} else if ( test.errors.length ) {
		for ( const error of test.errors ) {
			console.error( chalk.red( error.message ) );
			console.error( chalk.gray( error.stack ) );
		}
	}
}

export function reportEnd( result, { browser, headless, modules } ) {
	console.log(
		`\n\nTests for ${ chalk.yellow( modules.join( ", " ) ) } on ${ chalk.yellow(
			getBrowserString( browser, headless )
		) } finished in ${ prettyMs( result.runtime ) }.`
	);
	console.log(
		( result.status !== "passed" ?
			`${ chalk.red( result.testCounts.failed ) } failed. ` :
			"" ) +
			`${ chalk.green( result.testCounts.total ) } passed. ` +
			`${ chalk.gray( result.testCounts.skipped ) } skipped.`
	);
	return result.testCounts.failed || 0;
}
