<?php

header( "Sample-Header: Hello World" );
header( "Empty-Header: " );
header( "Sample-Header2: Hello World 2" );

$headers = array();

foreach( $_SERVER as $key => $value ) {

	$key = str_replace( "_" , "-" , substr( $key , 0 , 5 ) == "HTTP_" ? substr( $key , 5 ) : $key );
	$headers[ $key ] = $value;

}

foreach( explode( "_" , $_GET[ "keys" ] ) as $key ) {

	// Only echo if key exists in the header
	if ( isset( $headers[ strtoupper( $key ) ] ) ) {
		echo "$key: " . @$headers[ strtoupper( $key ) ] . "\n";
	}

}
