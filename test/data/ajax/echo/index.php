<?php
require_once( '../../_fix_magic_quotes.php' );

/**
 * Echo
 *
 * Script used as helper in AJAX tests to
 * simulate different kinds of server responses.
 */

function isPosted() {
	return isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'POST';
}

function getHttpHeaders() {
	$headers = array();

	foreach( $_SERVER as $key => $value ) {
		if ( strpos( $key, 'HTTP_' ) === 0 ) {
			$key = strtolower( str_replace( '_' , '-' , substr( $key, 5 ) ) );
			$headers[ $key ] = $value;
		}
	}

	// PHP doesn't include content headers in the HTTP_ match group.
	// -- http://php.net/manual/en/reserved.variables.server.php#110763
	if ( isset( $_SERVER['CONTENT_LENGTH'] ) ) {
		$headers['content-length'] = $_SERVER['CONTENT_LENGTH'];
	}
	if ( isset( $_SERVER['CONTENT_TYPE'] ) ) {
		$headers['content-type'] = $_SERVER['CONTENT_TYPE'];
	}

	return $headers;
}

$useSecondaryParams = isset( $_POST['secondaryParams'] ) || isset( $_GET['secondaryParams'] );
// Generally we want to use POST data for POST, and GET data for GET.
// If not, secondaryParams is set, and we do the opposite.
$usePost = ( isPosted() && !$useSecondaryParams ) || ( !isPosted() && $useSecondaryParams );
$params = $usePost ? $_POST : $_GET;
$response = array(
	'statusCode' => 200,
	'statusText' => '',

	'contentType' => false,
	'content' => '',

	'callback' => false,
	'extend' => false,
	'delay' => 0
);

// Extend default response with data from the echo request parameters.
foreach( $response as $key => $value ) {
	if ( isset( $params[ $key ] ) ) {
		$response[ $key ] = $params[ $key ];
	}
}

// Callback: Even in a POST request, the callback is still in the GET query.
if ( isPosted() && !$response['callback'] && isset( $_GET['callback'] ) ) {
	$response['callback'] = $_GET['callback'];
}

// Path info: For test "JSONP Query string REST-like"
if ( !$response['callback'] && isset( $_SERVER['PATH_INFO'] ) ) {
	// Shift off the leading slash
	$response['callback'] = substr( $_SERVER['PATH_INFO'], 1 );
}

// Callback: Filter out non-safe characters (XSS)
if ( $response['callback'] ) {
	$response['callback'] = preg_replace( '/[^][.\\\'\\"_A-Za-z0-9]/', '', $response['callback'] );
}

// Content: When passed an array of content, respond with a query string of that.
if ( is_array( $response['content'] ) ) {
	$response['content'] = http_build_query( $response['content'] );
}

// Status code: Convert to number
if ( !is_int( $response['statusCode'] ) ) {
	$response['statusCode'] = (int) $response['statusCode'];
}

// Execute any configured delay
if ( $response['delay'] ) {
	sleep( $response['delay'] );
}

header( 'HTTP/1.1 ' . "{$response['statusCode']} {$response['statusText']}", true, $response['statusCode'] );

// Simple echo
if ( !$response['extend'] ) {

	if ( !$response['contentType'] ) {
		$response['contentType'] = $response['callback'] ? 'text/javascript; charset=UTF-8' : 'text/plain; charset=UTF-8';
	}
	header( "Content-Type: {$response['contentType']}" );

	echo $response['callback']
		? $response['callback'] . '(' . json_encode( $response['content'] ) . ');'
		: $response['content'];

	exit;
}

// Advanced echo
$data = array();
$data['method'] = isset( $_SERVER['REQUEST_METHOD'] ) ? $_SERVER['REQUEST_METHOD'] : null;
$data['content'] = $response['content'];

// All headers or a subset based on given whitelist
if ( isset( $response['extend']['headers'] ) && is_array( $response['extend']['headers'] ) ) {
	$headers = array();
	$all = getHttpHeaders();
	foreach ( $response['extend']['headers'] as $key ) {
		$allKey = strtolower( $key );
		if ( isset( $all[ $allKey ] ) ) {
			$headers[ $key ] = $all[ $allKey ];
		}
	}
} else {
	$headers = getHttpHeaders();
}

// json_encode stringifies associative arrays to {}.
// However if the PHP array is empty, it will consider it to be a
// numerical array and thuss stringify to [].
// Casting to stdClass object fixes this.
$data['headers'] = (object)$headers;

if ( !$response['contentType'] ) {
	$response['contentType'] = $response['callback'] ? 'text/javascript; charset=UTF-8' : 'application/json; charset=UTF-8';
}
header( "Content-Type: {$response['contentType']}" );

echo $response['callback']
	? $response['callback'] . '(' . json_encode( $data ) . ');'
	: json_encode( $data );
