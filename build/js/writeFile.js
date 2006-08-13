importPackage(java.io);

function writeFile( file, stream ) {
	var buffer = new PrintWriter( new FileWriter( file ) );
	buffer.print( stream );
	buffer.close();
}
