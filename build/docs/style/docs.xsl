<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/*">
<html>
<head>
	<title>jQuery Docs - API</title>
	<link rel="stylesheet" href="style/style.css"/>
	<script src="../jquery-svn.js"></script>
	<script src="js/tooltip.js"></script>
	<script src="js/pager.js"></script>
	<script src="js/doc2.js"></script>
</head>
<body>
	<h1>jQuery Docs - API</h1>
	<ul id="docs">
		<xsl:for-each select="method[not(@private)]">
			<xsl:sort select="@name"/>
			<xsl:sort select="count(params)"/>
			<li>
				<span class='type'><span title='TYPE' class='tooltip'><xsl:value-of select="@type"/></span></span>
				<span class='fn'>
					<a href='#{@name}' class='name' title=''><xsl:value-of select="@name"/></a>
						<xsl:if test="not(@property)">(
							<xsl:for-each select="params">
								<span class='arg-type tooltip' title='TYPE'><xsl:value-of select="@type"/></span><xsl:text> </xsl:text>
								<span class='arg-name tooltip' title='{@desc}'><xsl:value-of select="@name"/></span>
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
</body>
</html>
</xsl:template>

</xsl:stylesheet>
