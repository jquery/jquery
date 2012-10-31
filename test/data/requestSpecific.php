<?php
error_reporting(0);
if($_GET['name'] == 'foo') {
	echo "bar";
	die();
}
if($_POST['name'] == 'peter') {
	echo "pan";
	die();
}

echo '';
?>
