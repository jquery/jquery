<?php
	header("X-Content-Security-Policy: default-src 'self';");
	header("X-WebKit-CSP: script-src 'self'");
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>CSP Test Page</title>
	<script src="../../jquery.js"></script>
	<script src="csp.js"></script>
</head>
<body>
	<p>CSP Test Page</p>
</body>
</html>
