<?php
	header("X-Content-Security-Policy: default-src 'self';");
	header("X-WebKit-CSP: script-src 'self'");
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>CSP Test Page</title>

</head>
<body>
	<script src="csp.js"></script>
	<p>CSP Test Page</p>
</body>
</html>
