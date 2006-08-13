Object.toXML = function( obj, tag ) {
  if ( obj.constructor == Array ) {
    var ret = "";
    for ( var i = 0; i < obj.length; i++ )
      ret += Object.toXML( obj[i], tag );
    return ret;
  } else if ( obj.constructor == Object ) {
    var tag = tag || "tmp";
    var p = "", child = "";

    for ( var i in obj )
      if ( obj[i].constructor == Array || /</.test(obj[i] + "") || Object.toXML.force[i] )
        child += Object.toXML( obj[i], i );
      else
        p += " " + i + "='" + (obj[i] + "").replace(/'/g, "&apos;") + "'";

    return "<" + tag + p + ( child ?  ">\n" + child + "</" + tag + ">\n" : "/>\n" );
  } else if ( obj.constructor == String ) {
    //obj = obj.replace(/&lt;/g,"<").replace(/&gt;/g,">");
    //return "<" + tag + "><![CDATA[" + obj + "]]></" + tag + ">";
    return "<" + tag + ">" + obj + "</" + tag + ">\n";
  }

  return "";
};

Object.toXML.force = {};
