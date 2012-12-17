<?php
	header("X-Content-Security-Policy: default-src localhost 'self';");
	header("X-WebKit-CSP: script-src 'self'; style-src 'self' 'unsafe-inline'");
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>CSP Test Page</title>

	<script src="../dist/jquery.js"></script>
</head>
<body>
	<p>CSP Test Page</p>
</body>
</html>
