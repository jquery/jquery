#!/usr/bin/env node
/*
 * jQuery Release Note Generator
 */

var fs = require("fs"),
	http = require("http"),
	tmpl = require("mustache"),
	extract = /<a href="\/ticket\/(\d+)" title="View ticket">(.*?)<[^"]+"component">\s*(\S+)/g;

var opts = {
	version: "1.7.2rc1",
	short_version: "1.7.2rc1",
	final_version: "1.7.2",
	categories: []
};

http.request({
	host: "bugs.jquery.com",
	port: 80,
	method: "GET",
	path: "/query?status=closed&resolution=fixed&component=!web&order=component&milestone=" + opts.final_version
}, function (res) {
	var data = [];

	res.on( "data", function( chunk ) {
		data.push( chunk );
	});

	res.on( "end", function() {
		var match,
			file = data.join(""),
			cur;

		while ( (match = extract.exec( file )) ) {
			if ( "#" + match[1] !== match[2] ) {
				var cat = match[3];

				if ( !cur || cur.name !== cat ) {
					cur = { name: match[3], niceName: match[3].replace(/^./, function(a){ return a.toUpperCase(); }), bugs: [] };
					opts.categories.push( cur );
				}

				cur.bugs.push({ ticket: match[1], title: match[2] });
			}
		}

		buildNotes();
	});
}).end();

function buildNotes() {
	console.log( tmpl.to_html( fs.readFileSync("release-notes.txt", "utf8"), opts ) );
}
