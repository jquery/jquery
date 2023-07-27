#!/usr/bin/env sh

# First argument is the version
# Second argument is the blog URL

# Push files to dist repo
npm run release:dist $1 $2
cd .dist
git add -A
npm version $1
git push --follow-tags
cd -

# Push files to cdn repo
npx rimraf cdn
npm run release:cdn $1
cd .cdn
git add -A
git commit -m "jquery: Add version $1"
git push
cd -

# Restore AUTHORS URL
sed -i "s/$1\/AUTHORS.txt/3.x-stable\/AUTHORS.txt/" package.json
git add package.json

# Remove dist from 3.x-stable branch
git rm --cached --ignore-unmatch dist/*.js dist/*.map
git commit -m 'Release: remove dist from 3.x-stable branch'
git push
