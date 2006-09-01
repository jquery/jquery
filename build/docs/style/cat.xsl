<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
<xsl:output method="html"/>
  <xsl:template match="/docs">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>jQuery Printable API</title>
        <link rel="stylesheet" href="style/cat.css"/>
      </head>
      <body>
        <h1>jQuery Printable API</h1>
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>
  
  <xsl:template match="cat">
    <h2><xsl:value-of select="@value"/></h2>
    <ul class="list">
      <xsl:for-each select="method[not(@private)]">
        <xsl:sort select="@name"/>
        <xsl:sort select="count(params)"/>
        <li>
          <xsl:value-of select="@name"/>(<xsl:for-each select="params">
            <xsl:value-of select="@name"/>
            <xsl:if test="position() != last()">, </xsl:if>
          </xsl:for-each>)
        </li>
      </xsl:for-each>
      <xsl:apply-templates select="cat"/>
    </ul>
  </xsl:template>
</xsl:stylesheet>
