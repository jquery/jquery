<?php
error_reporting(0);
$callback = $_REQUEST['callback'];
$json = $_REQUEST['json'];
if($json) {
	echo $callback . '([ {"name": "John", "age": 21}, {"name": "Peter", "age": 25 } ])';
} else {
	echo $callback . '({ "data": {"lang": "en", "length": 25} })';
}
?>
