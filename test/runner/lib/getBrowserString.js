const browserMap = {
	chrome: "Chrome",
	edge: "Edge",
	firefox: "Firefox",
	ie: "IE",
	jsdom: "JSDOM",
	opera: "Opera",
	safari: "Safari"
};

export function browserSupportsHeadless( browser ) {
	browser = browser.toLowerCase();
	return (
		browser === "chrome" ||
		browser === "firefox" ||
		browser === "edge"
	);
}

export function getBrowserString(
	{
		browser,
		browser_version: browserVersion,
		device,
		os,
		os_version: osVersion
	},
	headless
) {
	browser = browser.toLowerCase();
	browser = browserMap[ browser ] || browser;
	let str = browser;
	if ( browserVersion ) {
		str += ` ${ browserVersion }`;
	}
	if ( device ) {
		str += ` for ${ device }`;
	}
	if ( os ) {
		str += ` on ${ os }`;
	}
	if ( osVersion ) {
		str += ` ${ osVersion }`;
	}
	if ( headless && browserSupportsHeadless( browser ) ) {
		str += " (headless)";
	}
	return str;
}
