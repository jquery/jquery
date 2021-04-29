<?php
error_reporting(0);
function cleanCallback( $callback ) {
	return preg_replace( '/[^a-z0-9_]/i', '', $callback );
}
$callback = $_REQUEST['callback'];
if ( ! $callback ) {
	$callback = explode("?",end(explode("/",$_SERVER['REQUEST_URI'])));
	$callback = $callback[0];
}
$json = $_REQUEST['json'] ?
	'[ { "name": "John", "age": 21 }, { "name": "Peter", "age": 25 } ]' :
	'{ "data": { "lang": "en", "length": 25 } }';
echo cleanCallback( $callback ) . '(' . $json . ')';
?>
