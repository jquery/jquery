import { Builder, Capabilities } from "selenium-webdriver";
import Chrome from "selenium-webdriver/chrome.js";
import Edge from "selenium-webdriver/edge.js";
import Firefox from "selenium-webdriver/firefox.js";

export default async function createDriver( { browser, headless } ) {
	const capabilities = Capabilities[ browser ]();
	let driver = new Builder().withCapabilities( capabilities );

	const chromeOptions = new Chrome.Options();
	chromeOptions.addArguments( "--enable-chrome-browser-cloud-management" );

	// Alter the chrome binary path if
	// the CHROME_BIN environment variable is set
	if ( process.env.CHROME_BIN ) {
		chromeOptions.setChromeBinaryPath( process.env.CHROME_BIN );
	}

	const firefoxOptions = new Firefox.Options();

	const edgeOptions = new Edge.Options();
	edgeOptions.addArguments( "--enable-chrome-browser-cloud-management" );

	// Alter the edge binary path if
	// the EDGE_BIN environment variable is set
	if ( process.env.EDGE_BIN ) {
		edgeOptions.setEdgeChromiumBinaryPath( process.env.EDGE_BIN );
	}

	if ( headless ) {
		chromeOptions.addArguments( "--headless=new" );
		firefoxOptions.addArguments( "--headless" );
		edgeOptions.addArguments( "--headless=new" );
		if ( browser !== "chrome" && browser !== "firefox" && browser !== "edge" ) {
			console.log( `Headless mode is not supported for ${ browser }. Running in normal mode instead.` );
		}
	}

	driver = await driver
		.setChromeOptions( chromeOptions )
		.setFirefoxOptions( firefoxOptions )
		.setEdgeOptions( edgeOptions )
		.build();

	// Increase script timeout to 10min
	await driver.manage().setTimeouts( { script: 60000 * 10 } );

	return driver;
}
