import browserstackLocal from "browserstack-local";

export async function localTunnel( localIdentifier, opts = {} ) {
	const tunnel = new browserstackLocal.Local();

	return new Promise( ( resolve, reject ) => {

		// https://www.browserstack.com/docs/local-testing/binary-params
		tunnel.start(
			{
				"enable-logging-for-api": "",
				localIdentifier,
				...opts
			},
			async( error ) => {
				if ( error || !tunnel.isRunning() ) {
					return reject( error );
				}
				resolve( {
					stop: function stopTunnel() {
						return new Promise( ( resolve, reject ) => {
							tunnel.stop( ( error ) => {
								if ( error ) {
									return reject( error );
								}
								resolve();
							} );
						} );
					}
				} );
			}
		);
	} );
}
