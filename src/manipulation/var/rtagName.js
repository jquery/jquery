// rtagName captures the name from the first start tag in a string of HTML
// https://html.spec.whatwg.org/multipage/syntax.html#tag-open-state
// https://html.spec.whatwg.org/multipage/syntax.html#tag-name-state
export var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
