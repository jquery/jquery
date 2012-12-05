<?php
error_reporting(0);
$callback = $_REQUEST['callback'];
$json = $_REQUEST['json'];
$text = json_encode(file_get_contents(dirname(__FILE__)."/with_fries.xml"));
echo "$callback($text)";
?>
