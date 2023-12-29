const browserMap = {
	chrome: "Chrome",
	edge: "Edge",
	firefox: "Firefox",
	ie: "IE",
	opera: "Opera",
	safari: "Safari"
};

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
	let str = browserMap[ browser.toLowerCase() ] || browser;
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
	if ( headless ) {
		str += " (headless)";
	}
	return str;
}
