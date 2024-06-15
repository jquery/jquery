import webpack from "webpack";

// See https://webpack.js.org/api/node/#webpack
export async function runWebpack() {
	return new Promise( async( resolve, reject ) => {
		console.log( "Running Webpack" );

		const { default: config } = await import( "../webpack.config.cjs" );

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
