import { coreMockserverHandler } from "./middleware-handlers.js";

export async function NginxMockserverHandler( r ) {
	const context = {

		// This needs to be passed from the nginx config via:
		// set $test_dirname "/path/to/the/jquery/repo/test";
		dirname: r.variables.test_dirname,

		method: r.method,
		headers: r.headersIn,
		requestText: r.requestText
	};

	context.url = `${ r.uri }${ context.search }`;

	context.parsed = {
		pathname: r.uri,
		search: context.search,
		query: context.args
	};

	const coreResponse = await coreMockserverHandler( {
		context,
		console: r
	} );
	const response = coreResponse ??
		{ status: 404, headers: {}, body: "Not Found" };

	const singularHeaders = new Set( [ "content-type" ] );

	// Manually set the HTTP status
	r.status = response.status;

	r.headersOut[ "content-type" ] = "text/html; charset=UTF-8";

	// Loop over the headers and set them in the response
	for ( const [ header, value ] of Object.entries( response.headers ) ) {
		const lowerHeader = header.toLowerCase();

		// The njs module doesn't send empty headers, so we send a whitespace one instead.
		const finalValue = value || " ";

		if ( singularHeaders.has( lowerHeader ) ) {
			r.headersOut[ lowerHeader ] = finalValue;
		} else {

			// The njs module doesn't automatically join values of repeated headers,
			// so we join them by ourselves.
			r.headersOut[ lowerHeader ] = `${
				r.headersOut[ lowerHeader ] === undefined ?
					"" :
					`${ r.headersOut[ lowerHeader ] }, `
			}${ finalValue }`;
		}
	}

	// Finalize the response if required (depends on your API)
	r.return( response.status, response.body );
}

export async function TestHandler( r ) {
	r.return( 200, "Hello from nginx!" );
}

export default {
	NginxMockserverHandler,
	TestHandler
};
