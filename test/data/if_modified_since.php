<?php
error_reporting(0);

$ts = $_REQUEST['ts'];

$ifModifiedSince = isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) ? stripslashes($_SERVER['HTTP_IF_MODIFIED_SINCE']) : false;
if ($ifModifiedSince == $ts) {
	header('HTTP/1.0 304 Not Modified');
	die; // stop processing
}

header("Last-Modified: " . $ts);

if ( $ifModifiedSince ) {
	echo "OK: " . $ts;
} else {
	echo "FAIL";
}

?>
