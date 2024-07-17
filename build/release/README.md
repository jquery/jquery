# Releasing jQuery

This document describes the process for releasing a new version of jQuery. It is intended for jQuery team members and collaborators who have been granted permission to release new versions.

## Prerequisites

Before you can release a new version of jQuery, you need to have the following tools installed:

- [Node.js](https://nodejs.org/) (latest LTS version)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [git](https://git-scm.com/)

## Setup

1. Clone the jQuery repo:

	```sh
	git clone git@github.com:jquery/jquery.git
	cd jquery
	```

1. Install the dependencies:

	```sh
	npm install
	```

1. Log into npm with a user that has access to the `jquery` package.

	```sh
	npm login
	```

The release script will not run if not logged in.

1. Set `JQUERY_GITHUB_TOKEN` in the shell environment that will be used to run `npm run release`. The token can be [created on GitHub](https://github.com/settings/tokens/new?scopes=repo&description=release-it) and only needs the `repo` scope. This token is used to publish GitHub release notes and generate a list of contributors for the blog post.

	```sh
	export JQUERY_GITHUB_TOKEN=...
	```

The release script will not run without this token.

## Release Process

1. Ensure all milestoned issues/PRs are closed, or reassign to a new milestone.
1. Verify all tests are passing in [CI](https://github.com/jquery/jquery/actions).
1. Run any release-only tests, such as those in the [`test/integration`](../../test/integration/) folder.
1. Ensure AUTHORS.txt file is up to date (this will be verified by the release script).

	- Use `npm run authors:update` to update.

1. Create draft blog post on blog.jquery.com; save the link before publishing. The link is required to run the release.

	- Highlight major changes and reason for release.
	- Add HTML from the `changelog.html` generated in the below release script.
	- Use HTML from the `contributors.html` generated in the below release script in the "Thanks" section.

1. Run a dry run of the release script:

	```sh
	BLOG_URL=https://blog.jquery.com/... npm run release -- -d
	```

1. If the dry run is successful, run the release script:

	```sh
	BLOG_URL=https://blog.jquery.com/... npm run release
	```

	This will run the pre-release script, which includes checking authors, running tests, running the build, and cloning the CDN and jquery-dist repos in the `tmp/` folder.

	It will then walk you through the rest of the release process: creating the tag, publishing to npm, publishing release notes on GitHub, and pushing the updated branch and new tag to the jQuery repo.

	Finally, it will run the post-release script, which will ask you to confirm the files prepared in `tmp/release/cdn` and `tmp/release/dist` are correct before pushing to the respective repos. It will also prepare a commit for the jQuery repo to remove the release files and update the AUTHORS.txt URL in the package.json. It will ask for confirmation before pushing that commit as well.

	For a pre-release, run:

	```sh
	BLOG_URL=https://blog.jquery.com/... npm run release -- --preRelease=beta
	```

	`preRelease` can also be set to `alpha` or `rc`.

	**Note**: `preReleaseBase` is set in the npm script to `1` to ensure any pre-releases start at `.1` instead of `.0`. This does not interfere with stable releases.

1. Run the post-release script:

	```sh
	./build/release/post-release.sh $VERSION $BLOG_URL
	```

	This will push the release files to the CDN and jquery-dist repos, and push the commit to the jQuery repo to remove the release files and update the AUTHORS.txt URL in the package.json.

1. Once the release is complete, publish the blog post.

## Stable releases

Stable releases have a few more steps:

1. Close the milestone matching the current release: https://github.com/jquery/jquery/milestones. Ensure there is a new milestone for the next release.
1. Update jQuery on https://github.com/jquery/jquery-wp-content.
1. Update jQuery on https://github.com/jquery/blog.jquery.com-theme.
1. Update latest jQuery version for [healthyweb.org](https://github.com/jquery/healthyweb.org/blob/main/wrangler.toml).
1. Update the shipping version on [jquery.com home page](https://github.com/jquery/jquery.com).

	```sh
	git pull jquery/jquery.com
	# Edit index.html and download.md
	git commit
	npm version patch
	git push origin main --tags
	```

1. Update the version used in [jQuery docs demos](https://github.com/jquery/api.jquery.com/blob/main/entries2html.xsl).

1. Email archives to CDNs.

| CDN | Emails | Include |
| --- | ------ | ------- |
| Google | hosted-libraries@google | `tmp/archives/googlecdn-jquery-*.zip` |
| Microsoft | damian.edwards@microsoft, Chris.Sfanos@microsoft | `tmp/archives/mscdn-jquery-*.zip` |
| CDNJS | ryan@ryankirkman, thomasalwyndavis@gmail | Blog post link |
