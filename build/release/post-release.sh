#!/usr/bin/env sh

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
npm version $1

# Wait for confirmation from user to push changes to dist repo
read -p "Press enter to push changes to dist repo"
git push --follow-tags
cd -

# Restore AUTHORS URL
sed -i "s/$1\/AUTHORS.txt/main\/AUTHORS.txt/" package.json
git add package.json

# Remove release files from tracking
npm run release:clean
git commit -m "Release: remove release-only files from main branch"

# Wait for confirmation from user to push changes
read -p "Press enter to push changes to main branch"
git push
