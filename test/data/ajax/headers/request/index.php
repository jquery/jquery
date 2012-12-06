<?php

$headers = array();

foreach( $_SERVER as $key => $value ) {
	$key = str_replace( "_" , "-" , substr($key,0,5) == "HTTP_" ? substr($key,5) : $key );
	$headers[ $key ] = $value;
}

foreach( explode( "," , $_GET["headers"] ) as $key ) {
	echo "$key: " . @$headers[ strtoupper( $key ) ] . "\n";
}
