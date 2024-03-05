export function buildBrowserFromString( str ) {
	const [ browser, versionOrDevice, os, osVersion ] = str.split( "_" );

	// If the version starts with a colon, it's a device
	if ( versionOrDevice && versionOrDevice.startsWith( ":" ) ) {
		return {
			browser,
			device: versionOrDevice.slice( 1 ),
			os,
			os_version: osVersion
		};
	}

	return {
		browser,
		browser_version: versionOrDevice,
		os,
		os_version: osVersion
	};
}
