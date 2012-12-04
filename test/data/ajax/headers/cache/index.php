<?php
$headers = array(

	"If-Modified-Since" => array(
		"request" => "HTTP_IF_MODIFIED_SINCE",
		"response" => "Last-Modified",
	),
	"If-None-Match" => array(
		"request" => "HTTP_IF_NONE_MATCH",
		"response" => "Etag",
	),	

);

$header = $_REQUEST["header"];
$value = $_REQUEST["value"];

if ( $header === "If-None-Match" ) {
	$value = md5( $value );
}

$headers = $headers[ $header ];

$requestHeader = isset( $_SERVER[ $headers["request"] ] ) ? stripslashes($_SERVER[ $headers["request"] ]) : false;
if ( $requestHeader === $value ) {
	header("HTTP/1.0 304 Not Modified");
} else {
	header("$headers[response]: $value");
	echo $requestHeader ? "OK: $value": "FAIL";
}
