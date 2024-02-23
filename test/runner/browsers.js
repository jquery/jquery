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
	"Mobile Safari",
	"jsdom"
];

// A function that can be used to update the above list.
export async function getAvailableBrowsers() {
	const browsers = await getBrowsers( { flat: true } );
	const available = [ ...new Set( browsers.map( ( { browser } ) => browser ) ) ];
	return available.concat( "jsdom" );
}
