<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/*">
<html>
<head>
	<title>jQuery Docs - API</title>
	<link rel="stylesheet" href="style/style.css"/>
	<script src="../dist/jquery.js"></script>
	<script src="js/tooltip.js"></script>
	<script src="js/pager.js"></script>
	<script src="js/doc.js"></script>
</head>
<body>
	<h1>jQuery Docs - API</h1>
	<ul id="docs">
		<xsl:for-each select="method[not(@private)]">
			<xsl:sort select="@name"/>
			<xsl:sort select="count(params)"/>
			<li>
				<span class='type'><span class='tooltip'><xsl:value-of select="@type"/></span></span>
				<span class='fn'>
					<a href='#{@name}' class='name' title=''><xsl:value-of select="@name"/></a>
						<xsl:if test="not(@property)">(
							<xsl:for-each select="params">
								<span class='arg-type tooltip'><xsl:value-of select="@type"/></span><xsl:text> </xsl:text>
								<span class='arg-name tooltip' title='{desc}'><xsl:value-of select="@name"/></span>
								<xsl:if test="position() != last()">
									<xsl:if test="@any"> or </xsl:if>
									<xsl:if test="not(@any)">, </xsl:if>
								</xsl:if>
							</xsl:for-each>
						 )</xsl:if>
				</span>
				<div class='short'>
					<xsl:value-of select="@short"/>
				</div>
				<div class='more'>
					<div class='desc'>
						<xsl:value-of select="desc"/>
					</div>
					<xsl:for-each select="examples">
						<div class='example'>
							<h5>Example:</h5>
							<xsl:if test="desc">
								<p><xsl:value-of select="desc"/></p>
							</xsl:if>
							<pre><xsl:value-of select="code"/></pre>
							<xsl:if test="before">
								<b>HTML:</b>
								<pre><xsl:value-of select="before"/></pre>
							</xsl:if>
							<xsl:if test="result">
								<b>Result:</b>
								<pre><xsl:value-of select="result"/></pre>
							</xsl:if>
						</div>
					</xsl:for-each>
				</div>
			</li>
		</xsl:for-each>
	</ul>

	<p class="raw"><b>Raw Data:</b><xsl:text> </xsl:text><a href="data/jquery-docs-json.js">JSON</a>, <a href="data/jquery-docs-jsonp.js">JSONP</a>, <a href="data/jquery-docs-xml.xml">XML</a></p>
</body>
</html>
</xsl:template>

</xsl:stylesheet>
