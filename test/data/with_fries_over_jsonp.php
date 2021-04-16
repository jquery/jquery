<?php
error_reporting(0);
function cleanCallback( $callback ) {
	return preg_replace( '/[^a-z0-9_]/i', '', $callback );
}
$callback = $_REQUEST['callback'];
$cleanCallback = cleanCallback( $callback );
$json = $_REQUEST['json'];
$text = json_encode(file_get_contents(dirname(__FILE__)."/with_fries.xml"));
echo "$cleanCallback($text)\n";
?>
