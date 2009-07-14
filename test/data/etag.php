<?php
error_reporting(0);

$ts = $_REQUEST['ts'];
$etag = md5($ts);

$ifNoneMatch = isset($_SERVER['HTTP_IF_NONE_MATCH']) ? stripslashes($_SERVER['HTTP_IF_NONE_MATCH']) : false;
if ($ifNoneMatch == $etag) {
    header('HTTP/1.0 304 Not Modified');
    die; // stop processing
}

header("Etag: " . $etag);

if ( $ifNoneMatch ) {
	echo "OK: " . $etag;
} else {
	echo "FAIL";
}

?>
