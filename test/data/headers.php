<?php

header( "Sample-Header: Hello World" );

$headers = array();

foreach( $_SERVER as $key => $value ) { 
	
	if ( substr( $key , 0 , 5 ) == "HTTP_" ) { 
		
		$key = str_replace( "_" , "-" , substr( $key , 5) );
		$headers[ $key ] = $value;

	}
	
} 

foreach( explode( "_" , $_GET[ "keys" ] ) as $key ) {
	echo "$key: " . $headers[ strtoupper( $key ) ] . "\n";
}
