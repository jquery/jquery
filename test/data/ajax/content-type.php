<?php
	$type = $_REQUEST['content-type'];
	header("Content-type: $type");
	echo $_REQUEST['response']
?>
