<?php
$wait = $_REQUEST['wait'];
if($wait) {
	sleep($wait);
}
$xml = $_REQUEST['xml'];
if($xml) {
	header("Content-type: text/xml");
	eval("\$result = $xml;");
	echo "<math><calculation>$xml</calculation><result>$result</result></math>";
	die();
}
$name = $_REQUEST['name'];
if($name == 'foo') {
	echo "bar";
	die();
} else if($name == 'peter') {
	echo "pan";
	die();
}
$request = apache_request_headers();
$request = $request['X-Custom-Header'];
if(strlen($request) > 0) {
	echo $request;
	die();
}
echo 'ERROR <script type="text/javascript">ok( true, "name.php executed" );</script>';
?>