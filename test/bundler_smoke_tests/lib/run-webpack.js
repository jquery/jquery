import webpack from "webpack";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname( fileURLToPath( import.meta.url ) );
const configPath = path.resolve( dirname, "..", "webpack.config.cjs" );

// See https://webpack.js.org/api/node/#webpack
export async function runWebpack() {
	return new Promise( async( resolve, reject ) => {
		console.log( "Running Webpack" );

		const { default: config } = await import( configPath );

		webpack( config, ( err, stats ) => {
			if ( err || stats.hasErrors() ) {
				console.error( "Errors detected during Webpack compilation" );
				reject( err );
				return;
			}

			console.log( "Build completed: Webpack" );
			resolve();
		} );
	} );
}
