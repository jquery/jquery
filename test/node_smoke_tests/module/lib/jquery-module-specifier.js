import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname( fileURLToPath( import.meta.url ) );

const ROOT_DIR = path.resolve( dirname, "..", "..", "..", ".." );

// import does not work with Windows-style paths
function ensureUnixPath( path ) {
	return path.replace( /^[a-z]:/i, "" ).replace( /\\+/g, "/" );
}

// If `jQueryModuleSpecifier` is a real relative path, make it absolute
// to make sure it resolves to the same file inside utils from
// a subdirectory. Otherwise, leave it as-is as we may be testing `exports`
// so we need input as-is.
export const getJQueryModuleSpecifier = () => {
	const jQueryModuleInputSpecifier = process.argv[ 2 ];
	if ( !jQueryModuleInputSpecifier ) {
		throw new Error( "jQuery module specifier not passed" );
	}

	return jQueryModuleInputSpecifier.startsWith( "." ) ?
		ensureUnixPath( path.resolve( ROOT_DIR, jQueryModuleInputSpecifier ) ) :
		jQueryModuleInputSpecifier;
};
