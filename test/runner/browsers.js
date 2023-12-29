// This list is static, so no requests are required
// in the command help menu.

import { getBrowsers } from "./browserstack/api.js";

export const browsers = [
	"chrome",
  "ie",
  "firefox",
  "edge",
  "safari",
  "opera",
  "yandex",
  "IE Mobile",
  "Android Browser",
  "Mobile Safari"
];

// A function that can be used to update the above list.
export async function getAvailableBrowsers() {
	const browsers = await getBrowsers( true );
	const available = browsers.reduce( ( acc, browser ) => {
		if ( !acc.includes( browser.browser ) ) {
			acc.push( browser.browser );
		}
		return acc;
	}, [] );
	return available;
}
