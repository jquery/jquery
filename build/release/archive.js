import { readdir, writeFile } from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import path from "node:path";
import util from "node:util";
import os from "node:os";
import { exec as nodeExec } from "node:child_process";
import archiver from "archiver";

const exec = util.promisify( nodeExec );

async function md5sum( files, folder ) {
	if ( os.platform() === "win32" ) {
		const rmd5 = /[a-f0-9]{32}/;
		const sum = [];

		for ( let i = 0; i < files.length; i++ ) {
			const { stdout } = await exec( "certutil -hashfile " + files[ i ] + " MD5", {
				cwd: folder
			} );
			sum.push( rmd5.exec( stdout )[ 0 ] + " " + files[ i ] );
		}

		return sum.join( "\n" );
	}

	const { stdout } = await exec( "md5 -r " + files.join( " " ), { cwd: folder } );
	return stdout;
}

export default function archive( { cdn, folder, version } ) {
	return new Promise( async( resolve, reject ) => {
		console.log( `Creating production archive for ${ cdn }...` );

		const md5file = cdn + "-md5.txt";
		const output = createWriteStream(
			path.join( folder, cdn + "-jquery-" + version + ".zip" )
		);

		output.on( "close", resolve );
		output.on( "error", reject );

		const archive = archiver( "zip" );
		archive.pipe( output );

		const files = await readdir( folder );
		const sum = await md5sum( files, folder );
		await writeFile( path.join( folder, md5file ), sum );
		files.push( md5file );

		files.forEach( ( file ) => {
			const stream = createReadStream( path.join( folder, file ) );
			archive.append( stream, {
				name: path.basename( file )
			} );
		} );

		archive.finalize();
	} );
}
