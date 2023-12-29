import chalk from "chalk";
import createDriver from "./createDriver.js";

export async function runSelenium(
	url,
	{ browser },
	{
		debug,
		headless
	} = {}
) {
	if ( debug ) {
		if ( headless ) {
			console.warn( chalk.italic( "Cannot debug in headless mode." ) );
		}
	}

	const driver = await createDriver( { browser, headless } );

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
