<?php
error_reporting(0);

$ts = $_REQUEST['ts'];
$etag = md5($ts);

$ifNoneMatch = isset($_SERVER['HTTP_IF_NONE_MATCH']) ? stripslashes($_SERVER['HTTP_IF_NONE_MATCH']) : "";
preg_match('/"([^"]+)"/', $ifNoneMatch, $matches);
$ifNoneMatch = isset($matches[1]) ? $matches[1] : false;

if ($ifNoneMatch == $etag) {
	header('HTTP/1.0 304 Not Modified');
	die; // stop processing
}

header("Etag: W/\"" . $etag . "\"");

if ( $ifNoneMatch ) {
	echo "OK: " . $etag;
} else {
	echo "FAIL";
}

?>
