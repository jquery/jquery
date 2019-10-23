// Only count HTML whitespace
// Other whitespace should count in values
// https://infra.spec.whatwg.org/#ascii-whitespace
export default ( /[^\x20\t\r\n\f]+/g );
