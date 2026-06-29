#!/usr/bin/env bash

set -euo pipefail

# $1: Version
# $2: Blog URL

if (( $(echo "$BASH_VERSION" | cut -f1 -d.) < 5 )); then
	echo "Bash 5 or newer required. If you're on macOS, the built-in Bash is too old; install a newer one from Homebrew."
	exit 1
fi

cdn=tmp/release/cdn
dist=tmp/release/dist

if [[ -z "$1" ]]; then
	echo "Version is not set (1st argument)"
	exit 1
fi

if [[ -z "$2" ]]; then
	echo "Blog URL is not set (2nd argument)"
	exit 1
fi

is_prerelease() {
	local v=${1%%+*} # drop build metadata like +exp.sha
	[[ $v == *-* ]] # true (0) if prerelease, false (1) otherwise
}

# Push files to cdn repo
npm run release:cdn "$1"
cd $cdn
git add -A
git commit -S -m "jquery: Add version $1"

# Wait for confirmation from user to push changes to cdn repo
read -p "Press enter to push changes to cdn repo"
git push
cd -

# Push files to dist repo
# shellcheck disable=SC2086
npm run release:dist "$1" "$2"
cd $dist
git add -A
git commit -S -m "Release: $1"
# -s to sign and annotate tag (recommended for releases)
git tag -s "$1" -m "Release: $1"

# Wait for confirmation from user to push changes to dist repo
read -p "Press enter to push changes to dist repo & publish to npm"
git push --follow-tags
if is_prerelease "$1"; then
	npm publish --tag beta
else
	npm publish
fi
cd -

# Restore AUTHORS URL
sed -i '' -e "s|$1/AUTHORS.txt|main/AUTHORS.txt|" package.json
git add package.json

# Remove built files from tracking.
# Leave the changelog.md committed.
# Leave the tmp folder as some files are needed
# after the release (such as for emailing archives).
npm run build:clean
git rm --cached -r dist/ dist-module/
git add dist/package.json dist/wrappers dist-module/package.json dist-module/wrappers
git commit -S -m "Release: remove dist files from main branch"

# Wait for confirmation from user to push changes
read -p "Press enter to push changes to main branch"
git push
