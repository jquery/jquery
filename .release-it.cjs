"use strict";

const blogURL = process.env.BLOG_URL;

if ( !blogURL ) {
	throw new Error( "No blog URL specified" );
}

module.exports = {
	hooks: {
		"before:init": [
			"npm run release:clean",
			"npm ci",
			"npm run authors:check",
			"npm test",
			"mkdir -p tmp/release",
			"git clone https://github.com/jquery/jquery-dist tmp/release/dist",
			"git clone https://github.com/jquery/codeorigin.jquery.com tmp/release/cdn"
		],
		"before:git:release": "git add -f dist/ dist-module/ changelog.md",
		"after:version:bump":
			"sed -i 's/main/AUTHORS.txt/${version}/AUTHORS.txt/' package.json",
		"after:release": `./build/release/post-release.sh \${version} ${ blogURL }`
	},
	git: {
		changelog: "npm run release:changelog -- ${from} ${to}",
		commitMessage: "Release: ${version}",
		getLatestTagFromAllRefs: true,
		requireBranch: "main"
	},
	github: {
		release: true,
		tokenRef: "JQUERY_GITHUB_TOKEN"
	},
	npm: {
		publish: true
	}
};
