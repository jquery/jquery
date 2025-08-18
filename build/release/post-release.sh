#!/bin/sh

set -euo pipefail

# $1: Version
# $2: Blog URL

cdn=tmp/release/cdn
dist=tmp/release/dist

if [[ -z "$1" ]] then
	echo "Version is not set (1st argument)"
	exit 1
fi

if [[ -z "$2" ]] then
	echo "Blog URL is not set (2nd argument)"
	exit 1
fi

# Push files to cdn repo
npm run release:cdn $1
cd $cdn
git add -A
git commit -m "jquery: Add version $1"

# Wait for confirmation from user to push changes to cdn repo
read -p "Press enter to push changes to cdn repo"
git push
cd -

# Push files to dist repo
npm run release:dist $1 $2
cd $dist
git add -A
git commit -m "Release: $1"
# -s to sign and annotate tag (recommended for releases)
git tag -s $1 -m "Release: $1"

# Wait for confirmation from user to push changes to dist repo
read -p "Press enter to push changes to dist repo & publish to npm"
git push --follow-tags
npm publish
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
git commit -m "Release: remove dist files from main branch"

# Wait for confirmation from user to push changes
read -p "Press enter to push changes to main branch"
git push
