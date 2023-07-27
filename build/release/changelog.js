import { writeFile } from "node:fs/promises";
import { argv } from "node:process";
import { exec as nodeExec } from "node:child_process";
import util from "node:util";
import { marked } from "marked";

const exec = util.promisify( nodeExec );

const rbeforeHash = /.#$/;
const rendsWithHash = /#$/;
const rcherry = / \(cherry picked from commit [^)]+\)/;
const rcommit = /Fix(?:e[sd])? ((?:[a-zA-Z0-9_-]{1,39}\/[a-zA-Z0-9_-]{1,100}#)|#|gh-)(\d+)/g;
const rcomponent = /^([^ :]+):\s*([^\n]+)/;
const rnewline = /\r?\n/;

const prevVersion = argv[ 2 ];
const nextVersion = argv[ 3 ];
const blogUrl = process.env.BLOG_URL;

if ( !prevVersion || !nextVersion ) {
	throw new Error( "Usage: `node changelog.js PREV_VERSION NEXT_VERSION`" );
}

function ticketUrl( ticketId ) {
	return `https://github.com/jquery/jquery/issues/${ ticketId }`;
}

function getTicketsForCommit( commit ) {
	var tickets = [];

	commit.replace( rcommit, function( _match, refType, ticketId ) {
		var ticket = {
			url: ticketUrl( ticketId ),
			label: "#" + ticketId
		};

		// If the refType has anything before the #, assume it's a GitHub ref
		if ( rbeforeHash.test( refType ) ) {

			// console.log( refType );
			refType = refType.replace( rendsWithHash, "" );
			ticket.url = `https://github.com/${ refType }/issues/${ ticketId }`;
			ticket.label = refType + ticket.label;
		}

		tickets.push( ticket );
	} );

	return tickets;
}

async function getCommits() {
	const format =
		"__COMMIT__%n%s (__TICKETREF__[%h](https://github.com/jquery/jquery/commit/%H))%n%b";
	const { stdout } = await exec(
		`git log --format="${ format }" ${ prevVersion }..${ nextVersion }`
	);
	const commits = stdout.split( "__COMMIT__" ).slice( 1 );

	return removeReverts( commits.map( parseCommit ).sort( sortCommits ) );
}

function parseCommit( commit ) {
	const tickets = getTicketsForCommit( commit )
		.map( ( ticket ) => {
			return `[${ ticket.label }](${ ticket.url })`;
		} )
		.join( ", " );

	// Drop the commit message body
	let message = `${ commit.trim().split( rnewline )[ 0 ] }`;

	// Add any ticket references
	message = message.replace( "__TICKETREF__", tickets ? `${ tickets }, ` : "" );

	// Remove cherry pick references
	message = message.replace( rcherry, "" );

	return message;
}

function sortCommits( a, b ) {
	const aComponent = rcomponent.exec( a );
	const bComponent = rcomponent.exec( b );

	if ( aComponent && bComponent ) {
		if ( aComponent[ 1 ] < bComponent[ 1 ] ) {
			return -1;
		}
		if ( aComponent[ 1 ] > bComponent[ 1 ] ) {
			return 1;
		}
		return 0;
	}

	if ( a < b ) {
		return -1;
	}
	if ( a > b ) {
		return 1;
	}
	return 0;
}

/**
 * Remove all revert commits and the commit it is reverting
 */
function removeReverts( commits ) {
	const remove = [];

	commits.forEach( function( commit ) {
		const match = /\*\s*Revert "([^"]*)"/.exec( commit );

		// Ignore double reverts
		if ( match && !/^Revert "([^"]*)"/.test( match[ 0 ] ) ) {
			remove.push( commit, match[ 0 ] );
		}
	} );

	remove.forEach( function( message ) {
		const index = commits.findIndex( ( commit ) => commit.includes( message ) );
		if ( index > -1 ) {

			// console.log( "Removing ", commits[ index ] );
			commits.splice( index, 1 );
		}
	} );

	return commits;
}

function addHeaders( commits ) {
	const components = {};
	let markdown = "";

	commits.forEach( function( commit ) {
		const match = rcomponent.exec( commit );
		if ( match ) {
			let component = match[ 1 ];
			if ( !/^[A-Z]/.test( component ) ) {
				component =
					component.slice( 0, 1 ).toUpperCase() +
					component.slice( 1 ).toLowerCase();
			}
			if ( !components[ component.toLowerCase() ] ) {
				markdown += "\n## " + component + "\n\n";
				components[ component.toLowerCase() ] = true;
			}
			markdown += `- ${ match[ 2 ] }\n`;
		} else {
			markdown += `- ${ commit }\n`;
		}
	} );

	return markdown;
}

async function getGitHubContributor( sha ) {
	const response = await fetch(
		`https://api.github.com/repos/jquery/jquery/commits/${ sha }`,
		{
			headers: {
				Accept: "application/vnd.github+json",
				Authorization: `Bearer ${ process.env.JQUERY_GITHUB_TOKEN }`,
				"X-GitHub-Api-Version": "2022-11-28"
			}
		}
	);
	const data = await response.json();

	if ( !data.commit || !data.author ) {

		// The data may contain multiple helpful fields
		throw new Error( JSON.stringify( data ) );
	}
	return { name: data.commit.author.name, url: data.author.html_url };
}

function uniqueContributors( contributors ) {
	const seen = {};
	return contributors.filter( ( contributor ) => {
		if ( seen[ contributor.name ] ) {
			return false;
		}
		seen[ contributor.name ] = true;
		return true;
	} );
}

async function getContributors() {
	const { stdout } = await exec(
		`git log --format="%H" ${ prevVersion }..${ nextVersion }`
	);
	const shas = stdout.split( rnewline ).filter( Boolean );
	const contributors = await Promise.all( shas.map( getGitHubContributor ) );

	return uniqueContributors( contributors )

		// Sort by last name
		.sort( ( a, b ) => {
			const aName = a.name.split( " " );
			const bName = b.name.split( " " );
			return aName[ aName.length - 1 ].localeCompare( bName[ bName.length - 1 ] );
		} )
		.map( ( { name, url } ) => {
			if ( name === "Timmy Willison" || name.includes( "dependabot" ) ) {
				return;
			}
			return `<a href="${ url }">${ name }</a>`;
		} )
		.filter( Boolean ).join( "\n" );
}

async function generate() {
	const commits = await getCommits();
	const contributors = await getContributors();

	let changelog = "# Changelog\n";
	if ( blogUrl ) {
		changelog += `\n${ blogUrl }\n`;
	}
	changelog += addHeaders( commits );

	// Write markdown to changelog.md
	await writeFile( "changelog.md", changelog );

	// Write HTML to changelog.html for blog post
	await writeFile( "changelog.html", marked.parse( changelog ) );

	// Write contributors HTML for blog post
	await writeFile( "contributors.html", contributors );

	// Log regular changelog for release-it
	console.log( changelog );

	return changelog;
}

generate();
