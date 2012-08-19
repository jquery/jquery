<?php
//try very hard to disable output buffering
@ini_set("output_buffering", 0);
@apache_setenv("no-gzip", 1);
@ini_set("zlib.output_compression", 0);
ob_start();
?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title>Test case for jQuery ticket #12282</title>
</head>
<body>

<h1>TEST</h1>
<script type="text/javascript" src="../../../dist/jquery.js"></script>
<script type="text/javascript">
jQuery( document ).ready(function() {
	window.parent.iframeCallback( jQuery('#container').length === 1 );
});
</script>

<?php
//send the top of the document without sending the bottom portion
echo str_repeat(" ", 1024 * 8), "\n";
ob_flush();
?>

<h2>Sleeping for 1 seconds (simulating server side process)</h2>

<?php
//sleep for a bit, simulating a server side process
sleep(1);
?>

<div id="container">ready</h2>
</body>
</html>