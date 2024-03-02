import jsdom from "jsdom";

const { JSDOM } = jsdom;

const windows = Object.create( null );

export async function runJSDOM( url, { reportId, verbose } ) {
	const virtualConsole = new jsdom.VirtualConsole();
	virtualConsole.sendTo( console );
	virtualConsole.removeAllListeners( "clear" );

	const { window } = await JSDOM.fromURL( url, {
		resources: "usable",
		runScripts: "dangerously",
		virtualConsole
	} );
	if ( verbose ) {
		console.log( "JSDOM window opened.", reportId );
	}
	windows[ reportId ] = window;

	return new Promise( ( resolve ) => {
		window.finish = resolve;
	} );
}

export function cleanupJSDOM( reportId, { verbose } ) {
	const window = windows[ reportId ];
	if ( window ) {
		if ( window.finish ) {
			window.finish();
		}
		window.close();
		delete windows[ reportId ];
		if ( verbose ) {
			console.log( "Closed JSDOM window.", reportId );
		}
	}
}

export function cleanupAllJSDOM( { verbose } ) {
	const windowsRemaining = Object.keys( windows ).length;
	if ( windowsRemaining ) {
		if ( verbose ) {
			console.log(
				`Cleaning up ${ windowsRemaining } JSDOM window${
					windowsRemaining > 1 ? "s" : ""
				}...`
			);
		}
		for ( const id in windows ) {
			cleanupJSDOM( id, { verbose } );
		}
	}
}
