// Only count HTML whitespace
// Other whitespace should count in values
// https://infra.spec.whatwg.org/#ascii-whitespace
export var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
