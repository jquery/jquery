<?php
	# Support: Firefox
	header("X-Content-Security-Policy: default-src 'self';");

	# Support: Webkit, Safari 5
	# http://stackoverflow.com/questions/13663302/why-does-my-content-security-policy-work-everywhere-but-safari
	header("X-WebKit-CSP: script-src " . $_SERVER["HTTP_HOST"] . " 'self'");

	header("Content-Security-Policy: default-src 'self'");
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
