/**
 * Pretty print a time in milliseconds.
 */
export function prettyMs( time ) {
	const minutes = Math.floor( time / 60000 );
	const seconds = Math.floor( time / 1000 );
	const ms = Math.floor( time % 1000 );

	let prettyTime = `${ ms }ms`;
	if ( seconds > 0 ) {
		prettyTime = `${ seconds }s ${ prettyTime }`;
	}
	if ( minutes > 0 ) {
		prettyTime = `${ minutes }m ${ prettyTime }`;
	}

	return prettyTime;
}
