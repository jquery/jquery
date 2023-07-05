import { whitespace } from "./whitespace.js";

export var rtrim = new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);
