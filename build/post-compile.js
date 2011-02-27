#!/usr/bin/env node

var print = require("sys").print,
	src = require("fs").readFileSync(process.argv[2], "utf8");

// Previously done in sed but reimplemented here due to portability issues
print(src.replace(/^(\s*\*\/)(.+)/m, "$1\n$2;"));
