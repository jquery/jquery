/**
 * A Rollup plugin accepting a file overrides map and changing
 * module sources to the overridden ones where provided. Files
 * without overrides are loaded from disk.
 *
 * @param {Map<string, string>} fileOverrides
 */
export default function rollupFileOverrides( fileOverrides ) {
	return {
		name: "jquery-file-overrides",
		load( id ) {
			if ( fileOverrides.has( id ) ) {

				// Replace the module by a fake source.
				return fileOverrides.get( id );
			}

			// Handle this module via the file system.
			return null;
		}
	};
}
