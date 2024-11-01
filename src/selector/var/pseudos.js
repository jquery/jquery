import { identifier } from "./identifier.js";
import { attributes } from "./attributes.js";

// Defines the prefix for pseudo-classes, e.g., ":hover" or ":focus" etc.
const pseudoPrefix = ":" + identifier;

// Start the non-capturing group for arguments. (?:...) means non-capturing group (groups the elements without capturing the match for back-referencing)
const argsStart = "(?:\\((";

// 1. Quoted Arguments:
//    - Single quotes: '...'
//    - Double quotes: "..."
const quotedArguments =
  "('((?:\\\\.|[^\\\\'])*)'|" +               // Single-quoted argument
  "\"((?:\\\\.|[^\\\\\"])*)\")|";            // Double-quoted argument


// 2. Simple Arguments:
//    - Unquoted arguments without special characters
//    - Allows escaped characters
//(?:...) to match any sequence of characters except single quotes and backslashes

const simpleArguments =
  "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|"; // this is a non-capturing group, allows any escaped char. but not "(","[","]" and "\" , or chars in "attributes".

// 3. Fallback for Any Other Arguments:
//    - Matches any characters if previous patterns fail
const fallbackArguments = ".*";

// Combine all argument patterns with alternatives
const combinedArguments =
  quotedArguments +
  simpleArguments +
  fallbackArguments;

// Close the argument group and the non-capturing group
const argsEnd = ")\\)|)";

// Assemble the full pseudo-class regex pattern
export const pseudos = pseudoPrefix + argsStart + combinedArguments + argsEnd;
