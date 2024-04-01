import { Builder, Capabilities, logging } from "selenium-webdriver";
import Chrome from "selenium-webdriver/chrome.js";
import Edge from "selenium-webdriver/edge.js";
import Firefox from "selenium-webdriver/firefox.js";
import { browserSupportsHeadless } from "../lib/getBrowserString.js";

// Set script timeout to 10min
const DRIVER_SCRIPT_TIMEOUT = 1000 * 60 * 10;

export default async function createDriver( { browserName, headless, url, verbose } ) {
	const capabilities = Capabilities[ browserName ]();
	const prefs = new logging.Preferences();
	prefs.setLevel( logging.Type.BROWSER, logging.Level.ALL );
	capabilities.setLoggingPrefs( prefs );

	let driver = new Builder().withCapabilities( capabilities );

	const chromeOptions = new Chrome.Options();
	chromeOptions.addArguments( "--enable-chrome-browser-cloud-management" );

	// Alter the chrome binary path if
	// the CHROME_BIN environment variable is set
	if ( process.env.CHROME_BIN ) {
		if ( verbose ) {
			console.log( `Setting chrome binary to ${ process.env.CHROME_BIN }` );
		}
		chromeOptions.setChromeBinaryPath( process.env.CHROME_BIN );
	}

	const firefoxOptions = new Firefox.Options();

	if ( process.env.FIREFOX_BIN ) {
		if ( verbose ) {
			console.log( `Setting firefox binary to ${ process.env.FIREFOX_BIN }` );
		}

		firefoxOptions.setBinary( process.env.FIREFOX_BIN );
	}

	const edgeOptions = new Edge.Options();
	edgeOptions.addArguments( "--enable-chrome-browser-cloud-management" );

	// Alter the edge binary path if
	// the EDGE_BIN environment variable is set
	if ( process.env.EDGE_BIN ) {
		if ( verbose ) {
			console.log( `Setting edge binary to ${ process.env.EDGE_BIN }` );
		}
		edgeOptions.setEdgeChromiumBinaryPath( process.env.EDGE_BIN );
	}

	if ( headless ) {
		chromeOptions.addArguments( "--headless=new" );
		firefoxOptions.addArguments( "--headless" );
		edgeOptions.addArguments( "--headless=new" );
		if ( !browserSupportsHeadless( browserName ) ) {
			console.log(
				`Headless mode is not supported for ${ browserName }.` +
					"Running in normal mode instead."
			);
		}
	}

	driver = await driver
		.setChromeOptions( chromeOptions )
		.setFirefoxOptions( firefoxOptions )
		.setEdgeOptions( edgeOptions )
		.build();

	if ( verbose ) {
		const driverCapabilities = await driver.getCapabilities();
		const name = driverCapabilities.getBrowserName();
		const version = driverCapabilities.getBrowserVersion();
		console.log( `\nDriver created for ${ name } ${ version }` );
	}

	// Increase script timeout to 10min
	await driver.manage().setTimeouts( { script: DRIVER_SCRIPT_TIMEOUT } );

	// Set the first URL for the browser
	await driver.get( url );

	return driver;
}
