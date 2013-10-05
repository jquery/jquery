var installer,
	which = require( "which" ),
	spawn = require( "child_process" ).spawn;

try {
	which.sync( "bower" );
} catch( error ) {
	console.error( "Bower must be installed to build jQuery." );
	console.error( "Please install Bower by running the following command:" );
	console.error( "npm install -g bower" );
	process.exit( 1 );
}

installer = spawn( "bower", [ "install" ] );
installer.stdout.on( "data", function( data ) {
	console.log( data );
});
installer.stderr.on( "data", function( data ) {
	console.error( data );
});
installer.on( "close", function( code ) {
	process.exit( code );
});
