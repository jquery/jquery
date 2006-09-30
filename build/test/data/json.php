<?php
$json = $_REQUEST['json'];
if($json) {
	echo '[ {"name": "John", "age": 21}, {"name": "Peter", "age": 25 } ]';
} else {
	echo '{ "data": {"lang": "en", "length": 25} }';
}
?>