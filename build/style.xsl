<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:output method="xml" indent="yes" />
	
	<!-- TODO convert @type array notation to bracket notation, eg. Array<DOMElement> to [DOMElement] -->
	<xsl:template match="/*">
		<api xmlns="http://openajax.org/metadata">
			<class name="jQuery">
				<constructors>
					<xsl:for-each select="//function[@name='jQuery']">
						<constructor>
							<shortDescription><xsl:value-of select="desc" /></shortDescription>
							<description><xsl:value-of select="longdesc" /></description>
							<xsl:call-template name="parameters" />
							<returnType datatype="{@return}" />
							<xsl:call-template name="examples" />
						</constructor>
					</xsl:for-each>
				</constructors>
				<properties>
					<xsl:for-each select="//property">
						<xsl:sort select="translate(@name,'$.','')"/>
						<xsl:sort select="count(params)"/>
						<property name="{@name}" readonly="true" datatype="{@return}" default="">
							<xsl:call-template name="scope" />
							<shortDescription><xsl:value-of select="desc" /></shortDescription>
							<description><xsl:value-of select="longdesc" /></description>
							<xsl:call-template name="examples" />
						</property>
					</xsl:for-each>
				</properties>
				<methods>
					<xsl:for-each select="//function[@name!='jQuery']">
						<xsl:sort select="translate(@name,'$.','')"/>
						<xsl:sort select="count(params)"/>
						<method name="{@name}">
							<xsl:call-template name="scope" />
							<shortDescription><xsl:value-of select="desc" /></shortDescription>
							<description><xsl:value-of select="longdesc" /></description>
							<xsl:call-template name="parameters" />
							<returnType datatype="{@return}" />
							<xsl:call-template name="examples" />
						</method>
					</xsl:for-each>
				</methods>
			</class>
		</api>
	</xsl:template>
	
	<xsl:template name="scope">
		<xsl:attribute name="scope">
			<xsl:choose>
				<xsl:when test="starts-with(@name, 'jQuery.')">static</xsl:when>
				<xsl:when test="not(starts-with(@name, 'jQuery.'))">instance</xsl:when>
			</xsl:choose>
		</xsl:attribute>
	</xsl:template>
	
	<xsl:template name="parameters">
		<parameters>
			<xsl:for-each select="params">
				<parameter name="{@name}" datatype="{@type}">
					<xsl:attribute name="usage">
						<xsl:choose>
							<xsl:when test="not(@optional)">required</xsl:when>
							<xsl:when test="@optional">optional</xsl:when>
						</xsl:choose>
					</xsl:attribute>
					<description><xsl:value-of select="desc" /></description>
					<!-- TODO part of the spec, but with a very different interpretation -->
					<xsl:choose>
						<xsl:when test="../option">
							<properties>
								<xsl:for-each select="../option">
									<property name="{@name}" datatype="{@type}" default="{@default}">
										<description><xsl:value-of select="desc" /></description>
									</property>
								</xsl:for-each>
							</properties>
						</xsl:when>
					</xsl:choose>
				</parameter>
			</xsl:for-each>
		</parameters>
	</xsl:template>
	
	<xsl:template name="examples">
		<examples>
			<xsl:for-each select="example">
				<example>
					<description><xsl:value-of select="desc" /></description>
					<xsl:copy-of select="code|html|css" />
				</example>
			</xsl:for-each>
		</examples>
	</xsl:template>
	
</xsl:stylesheet>
