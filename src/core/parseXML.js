import { jQuery } from "../core.js";

// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );

	parserErrorElem = xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( parserErrorElem ) {
		jQuery.error( "Invalid XML: " +
			jQuery.map( parserErrorElem.childNodes, function( el ) {
				return el.textContent;
			} ).join( "\n" )
		);
	}
	return xml;
};
