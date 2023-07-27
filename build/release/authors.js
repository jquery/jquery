

import fs from "node:fs/promises";
import util from "node:util";
import { exec as nodeExec } from "node:child_process";

const exec = util.promisify( nodeExec );

const rnewline = /\r?\n/;
const rdate = /^\[(\d+)\] /;

const ignore = [
	/dependabot\[bot\]/
];

function compareAuthors( a, b ) {
	const aName = a.replace( rdate, "" ).replace( / <.*>/, "" );
	const bName = b.replace( rdate, "" ).replace( / <.*>/, "" );
	return aName === bName;
}

function uniq( arr ) {
	const unique = [];
	for ( const item of arr ) {
		if ( ignore.some( re => re.test( item ) ) ) {
			continue;
		}
		if ( item && !unique.find( ( e ) => compareAuthors( e, item ) ) ) {
			unique.push( item );
		}
	}
	return unique;
}

function cleanupSizzle() {
	console.log( "Cleaning up..." );
	return exec( "npx rimraf .sizzle" );
}

function cloneSizzle() {
	console.log( "Cloning Sizzle..." );
	return exec( "git clone https://github.com/jquery/sizzle .sizzle" );
}

async function getLastAuthor() {
	const authorsTxt = await fs.readFile( "AUTHORS.txt", "utf8" );
	return authorsTxt.trim().split( rnewline ).pop();
}

async function logAuthors( preCommand ) {
	let command = "git log --pretty=format:\"[%at] %aN <%aE>\"";
	if ( preCommand ) {
		command = `${ preCommand } && ${ command }`;
	}
	const { stdout } = await exec( command );
	return uniq( stdout.trim().split( rnewline ).reverse() );
}

async function getSizzleAuthors() {
	await cloneSizzle();
	const authors = await logAuthors( "cd .sizzle" );
	await cleanupSizzle();
	return authors;
}

function sortAuthors( a, b ) {
	const [ , aDate ] = rdate.exec( a );
	const [ , bDate ] = rdate.exec( b );
	return Number( aDate ) - Number( bDate );
}

function formatAuthor( author ) {
	return author.replace( rdate, "" );
}

export async function getAuthors() {
	console.log( "Getting authors..." );
	const authors = await logAuthors();
	const sizzleAuthors = await getSizzleAuthors();
	return uniq( authors.concat( sizzleAuthors ) ).sort( sortAuthors ).map( formatAuthor );
}

export async function checkAuthors() {
	const authors = await getAuthors();
	const lastAuthor = await getLastAuthor();

	if ( authors[ authors.length - 1 ] !== lastAuthor ) {
		console.log( "AUTHORS.txt: ", lastAuthor );
		console.log( "Last 20 in git: ", authors.slice( -20 ) );
		throw new Error( "Last author in AUTHORS.txt does not match last git author" );
	}
	console.log( "AUTHORS.txt is up to date" );
}

export async function updateAuthors() {
	const authors = await getAuthors();

	const authorsTxt = "Authors ordered by first contribution.\n\n" + authors.join( "\n" ) + "\n";
	await fs.writeFile( "AUTHORS.txt", authorsTxt );

	console.log( "AUTHORS.txt updated" );
}
