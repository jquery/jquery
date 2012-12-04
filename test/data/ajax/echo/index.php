<?php

	$requestArray = "REQUEST";
	
	if ( isset( $_REQUEST["requestArray"] ) ) {
		$requestArray = $_REQUEST["requestArray"];
	}
	
	$requestArray =& ${"_$requestArray"};

	$response = array(
		"status" => "200",
		"statusText" => "",
		"contentType" => "text/plain",
		"content" => "",
		"callback" => "",
		"delay" => 0
	);

	foreach( $response as $field => &$value ) {
		if ( isset( $requestArray[ $field ] ) ) {
			$value = $requestArray[ $field ];
		}
	}
	
	if ( is_array( $response["content"] ) ) {
		$response["content"] = http_build_query( $response["content"] );
	}
	
	if ( !$response["callback"] && preg_match( '/index.php\/([^\/\?&]+)/', $_SERVER["REQUEST_URI"], $match ) ) {
		$response["callback"] = $match[ 1 ];
	}

	header("HTTP/1.1 $response[status] $response[statusText]");
	header("Content-Type: $response[contentType]");

	if ( $response["delay"] ) {
		sleep( $response["delay"] );
	}

	echo $response["callback"]
		? "$response[callback](" . json_encode("$response[content]") . ");"
		: "$response[content]";
