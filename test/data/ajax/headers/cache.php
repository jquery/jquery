<?php
require_once( '../../_fix_magic_quotes.php' );

$handlerKey = $_REQUEST['header'];
$value = $_REQUEST['value'];

$handlers = array(
	'If-Modified-Since' => array(
		'request' => 'HTTP_IF_MODIFIED_SINCE',
		'response' => 'Last-Modified',
	),
	'If-None-Match' => array(
		'request' => 'HTTP_IF_NONE_MATCH',
		'response' => 'Etag',
	),
);
$handler = $handlers[ $handlerKey ];

if ( $handlerKey === 'If-None-Match' ) {
	$value = md5( $value );
}

$requestHeader = isset( $_SERVER[ $handler['request'] ] ) ? $_SERVER[ $handler['request'] ] : false;
if ( $requestHeader === $value ) {
	header( 'HTTP/1.0 304 Not Modified', true, 304 );
} else {
	header( "{$handler['response']}: $value" );
	echo $requestHeader ? "OK: $value": 'FAIL';
}
