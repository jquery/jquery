import chalk from "chalk";
import { getBrowserString } from "./lib/getBrowserString.js";
import { prettyMs } from "./lib/prettyMs.js";

export function reportTest( test, reportId, { browser, headless } ) {
	if ( test.status === "passed" ) {

		// Write to console without newlines
		process.stdout.write( "." );
		return;
	}

	let message = `${ chalk.bold( `${ test.suiteName }: ${ test.name }` ) }`;
	message += `\nTest ${ test.status } on ${ chalk.yellow(
		getBrowserString( browser, headless )
	) } (${ chalk.bold( reportId ) }).`;

	// test.assertions only contains passed assertions;
	// test.errors contains all failed asssertions
	if ( test.errors.length ) {
		for ( const error of test.errors ) {
			message += "\n";
			message += `\n${ error.message }`;
			message += `\n${ chalk.gray( error.stack ) }`;
			if ( error.expected && error.actual ) {
				message += `\nexpected: ${ JSON.stringify( error.expected ) }`;
				message += `\nactual: ${ chalk.red( JSON.stringify( error.actual ) ) }`;
			}
		}
	}

	console.log( "\n\n" + message );

	// Only return failed messages
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
