import { readFile, writeFile } from "node:fs/promises";
import util from "node:util";
import { argv } from "node:process";
import { exec as nodeExec } from "node:child_process";
import { rimraf } from "rimraf";

const pkg = JSON.parse( await readFile( "./package.json", "utf8" ) );

const exec = util.promisify( nodeExec );

const version = argv[ 2 ];
const blogURL = argv[ 3 ];

if ( !version ) {
	throw new Error( "No version specified" );
}

if ( !blogURL || !blogURL.startsWith( "https://blog.jquery.com/" ) ) {
	throw new Error( "Invalid blog post URL" );
}

// The dist repo is cloned during release
const distRepoFolder = "tmp/release/dist";

// Files to be included in the dist repo.
// README.md and bower.json are generated.
// package.json is a simplified version of the original.
const files = [
	"dist",
	"dist-module",
	"src",
	"LICENSE.txt",
	"AUTHORS.txt",
	"changelog.md"
];

async function generateBower() {
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
	const readme = await readFile(
		"./build/fixtures/README.md",
		"utf8"
	);

	return readme
		.replace( /@VERSION/g, version )
		.replace( /@BLOG_POST_LINK/g, blogURL );
}

/**
 * Copy necessary files over to the dist repo
 */
async function copyFiles() {

	// Remove any extraneous files before copy
	await rimraf( [
		`${ distRepoFolder }/dist`,
		`${ distRepoFolder }/dist-module`,
		`${ distRepoFolder }/src`
	] );

	// Copy all files
	await Promise.all(
		files.map( function( path ) {
			console.log( `Copying ${ path }...` );
			return exec( `cp -rf ${ path } ${ distRepoFolder }/${ path }` );
		} )
	);

	// Remove the wrapper from the dist repo
	await rimraf( [
		`${ distRepoFolder }/src/wrapper.js`
	] );

	// Set the version in src/core.js
	const core = await readFile( `${ distRepoFolder }/src/core.js`, "utf8" );
	await writeFile(
		`${ distRepoFolder }/src/core.js`,
		core.replace( /@VERSION/g, version )
	);

	// Write generated README
	console.log( "Generating README.md..." );
	const readme = await generateReadme();
	await writeFile( `${ distRepoFolder }/README.md`, readme );

	// Write generated Bower file
	console.log( "Generating bower.json..." );
	const bower = await generateBower();
	await writeFile( `${ distRepoFolder }/bower.json`, bower );

	// Write simplified package.json
	console.log( "Writing package.json..." );
	await writeFile(
		`${ distRepoFolder }/package.json`,
		JSON.stringify(
			{
				...pkg,
				scripts: undefined,
				dependencies: undefined,
				devDependencies: undefined,
				commitplease: undefined
			},
			null,
			2

		// Add final newline
		) + "\n"
	);

	console.log( "Files copied to dist repo." );
}

copyFiles();
