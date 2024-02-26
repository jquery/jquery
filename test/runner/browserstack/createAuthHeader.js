const textEncoder = new TextEncoder();

export function createAuthHeader( username, accessKey ) {
	const encoded = textEncoder.encode( `${ username }:${ accessKey }` );
	const base64 = btoa( String.fromCodePoint.apply( null, encoded ) );
	return `Basic ${ base64 }`;
}
