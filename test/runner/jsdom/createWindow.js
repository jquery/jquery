import jsdom from "jsdom";

const { JSDOM } = jsdom;

export default async function createWindow( { reportId, url, verbose } ) {
	const virtualConsole = new jsdom.VirtualConsole();
	virtualConsole.sendTo( console );
	virtualConsole.removeAllListeners( "clear" );

	const { window } = await JSDOM.fromURL( url, {
		resources: "usable",
		runScripts: "dangerously",
		virtualConsole
	} );

	if ( verbose ) {
		console.log( `JSDOM window created (${ reportId })` );
	}

	return window;
}
