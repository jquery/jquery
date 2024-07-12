"use strict";

const blogURL = process.env.BLOG_URL;

if ( !blogURL || !blogURL.startsWith( "https://blog.jquery.com/" ) ) {
	throw new Error( "A valid BLOG_URL must be set in the environment" );
}

module.exports = {
	preReleaseBase: 1,
	hooks: {
		"before:init": "bash ./build/release/pre-release.sh",
		"before:git:release": "git add -f dist/ dist-module/ changelog.md",
		"after:version:bump":
			"sed -i 's/main\\/AUTHORS.txt/${version}\\/AUTHORS.txt/' package.json",
		"after:release":
			`bash ./build/release/post-release.sh \${version} ${ blogURL }`
	},
	git: {
		changelog: "npm run release:changelog -- ${from} ${to}",
		commitMessage: "Release: ${version}",
		getLatestTagFromAllRefs: true,
		requireBranch: "main",
		requireCleanWorkingDir: true
	},
	github: {
		release: true,
		tokenRef: "JQUERY_GITHUB_TOKEN"
	},
	npm: {
		publish: true
	}
};
