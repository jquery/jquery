import createDriver from "./createDriver.js";

export async function runSelenium(
	url,
	{ browser },
	{ debug, headless, verbose } = {}
) {
	if ( debug && headless ) {
		throw new Error( "Cannot debug in headless mode." );
	}

	const driver = await createDriver( {
		browserName: browser,
		headless,
		verbose
	} );

	try {
		await driver.get( url );
		await driver.executeScript(
`return new Promise( ( resolve ) => {
	QUnit.on( "runEnd", resolve );
} )`
		);
	} finally {
		if ( !debug || headless ) {
			await driver.quit();
		}
	}
}
