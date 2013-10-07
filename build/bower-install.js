var which = require( "which" ),
	spawn = require( "child_process" ).spawn;

try {
	which.sync( "bower" );
} catch( error ) {
	console.error( "Bower must be installed to build jQuery." );
	console.error( "Please install Bower by running the following command:" );
	console.error( "npm install -g bower" );
	process.exit( 0 );
}

spawn( "bower", [ "install" ], { stdio: "inherit" } );
