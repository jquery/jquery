"use strict";

const { argv } = require( "process" );
const fs = require( "fs" );
const util = require( "util" );
const exec = util.promisify( require( "child_process" ).exec );
const { rimraf } = require( "rimraf" );
const { validBlogUrl } = require( "./validBlogUrl" );

const version = argv[ 2 ];
const blogUrl = argv[ 3 ];

const isValidBlogUrl = validBlogUrl( version, blogUrl );

// The dist repo is cloned during release
const distFolder = "./.dist";

// Files to be included in the dist repo.
// README.md and bower.json are generated.
const files = [ "dist", "src", "LICENSE.txt", "AUTHORS.txt", "package.json" ];

async function generateBower() {
	const pkg = JSON.parse( await fs.promises.readFile( "./package.json", "utf8" ) );

	return JSON.stringify(
		{
			name: pkg.name,
			main: pkg.main,
			license: "MIT",
			ignore: [ "package.json" ],
			keywords: pkg.keywords
		},
		null,
		2
	);
}

async function generateReadme() {
	const readme = await fs.promises.readFile(
		"./build/fixtures/README.md",
		"utf8"
	);

	return readme
		.replace( /@VERSION/g, version )
		.replace( /@BLOG_POST_LINK/g, blogUrl );
}

/**
 * Copy necessary files over to the dist repo
 */
async function copyFiles() {

	// Remove extraneous files before copy
	await rimraf( [ `./${distFolder}/dist`, `./${distFolder}/src` ] );

	// Copy all files
	await Promise.all(
		files.map( function( path ) {
			console.log( `Copying ${path}...` );
			return exec( `cp -rf ${path} ${distFolder}/${path}` );
		} )
	);

	// Remove the wrapper & the ESLint config from the dist repo
	await rimraf( [
		`${distFolder}/src/wrapper.js`,
		`${distFolder}/src/.eslintrc.json`,
		`${distFolder}/dist/.eslintrc.json`
	] );

	// Write generated README
	if ( isValidBlogUrl ) {
		const readme = await generateReadme();
		await fs.promises.writeFile( `${distFolder}/README.md`, readme );
	}

	// Write generated Bower file
	const bower = await generateBower();
	await fs.promises.writeFile( `${distFolder}/bower.json`, bower );

	console.log( "Files copied to dist repo." );
}

copyFiles();
