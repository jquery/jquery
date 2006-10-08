importPackage(java.io);

function writeFile( file, stream ) {
	var buffer = new PrintWriter( new FileWriter( file ) );
	buffer.print( stream );
	buffer.close();
}

function read( file ) {
	var jq = new File(file);
	var reader = new BufferedReader(new FileReader(jq));
	var line = null;
	var buffer = new java.lang.StringBuffer(jq.length());
	while( (line = reader.readLine()) != null) {
		buffer.append(line);
		buffer.append("\n");
	}
	return buffer.toString();
}