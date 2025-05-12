import url from "url";
import { coreMockserverHandler } from "./middleware-handlers.js";

/**
 * Connect-compatible middleware factory for mocking server responses.
 * Used by Ajax tests run in Node.
 */
export function MockserverMiddlewareFactory() {

	/**
	 * @param {http.IncomingMessage} req
	 * @param {http.ServerResponse} resp
	 * @param {Function} next Continue request handling
	 */
	return async function( req, resp, next ) {
		const parsed = url.parse( req.url, /* parseQuery */ true );
		const context = {
			parsed,
			url: req.url,
			method: req.method,
			headers: req.headers
		};

		try {
			const response = await coreMockserverHandler( {
				context,
				originalReq: req
			} );
			if ( response === null ) {
				next();
				return;
			}
			resp.writeHead( response.status, response.headers );
			resp.end( response.body );
		} catch ( err ) {

			// TODO this is needed because jtr doesn't await the middleware; we should fix that
			console.error( err );
			next( err );
		}
	};
}

export default MockserverMiddlewareFactory;
