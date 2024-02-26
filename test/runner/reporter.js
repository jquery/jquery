import chalk from "chalk";
import { getBrowserString } from "./lib/getBrowserString.js";
import { prettyMs } from "./lib/prettyMs.js";

export function reportTest( test, reportId, { browser, headless } ) {
	if ( test.status === "passed" ) {

		// Write to console without newlines
		process.stdout.write( "." );
		return;
	}

	let message = `Test ${ test.status } on ${ chalk.yellow(
		getBrowserString( browser, headless )
	) } (${ chalk.bold( reportId ) }).`;
	message += `\n${ chalk.bold( `${ test.suiteName }: ${ test.name }` ) }`;

	// Prefer failed assertions over error messages
	if ( test.assertions.filter( ( a ) => !!a && !a.passed ).length ) {
		test.assertions.forEach( ( assertion, i ) => {
			if ( !assertion.passed ) {
				message += `\n${ i + 1 }. ${ chalk.red( assertion.message ) }`;
				message += `\n${ chalk.gray( assertion.stack ) }`;
			}
		} );
	} else if ( test.errors.length ) {
		for ( const error of test.errors ) {
			message += `\n${ chalk.red( error.message ) }`;
			message += `\n${ chalk.gray( error.stack ) }`;
		}
	}

	console.log( "\n\n" + message );

	if ( test.status === "failed" ) {
		return message;
	}
}

export function reportEnd( result, reportId, { browser, headless, modules } ) {
	console.log(
		`\n\nTests for ${ chalk.yellow( modules.join( ", " ) ) } on ${ chalk.yellow(
			getBrowserString( browser, headless )
		) } finished in ${ prettyMs( result.runtime ) } (${ chalk.bold( reportId ) }).`
	);
	console.log(
		( result.status !== "passed" ?
			`${ chalk.red( result.testCounts.failed ) } failed. ` :
			"" ) +
			`${ chalk.green( result.testCounts.total ) } passed. ` +
			`${ chalk.gray( result.testCounts.skipped ) } skipped.`
	);
	return result.testCounts;
}
