import util from "node:util";
import { exec as nodeExec } from "node:child_process";

const exec = util.promisify( nodeExec );

export default async function isCleanWorkingDir() {
	const { stdout } = await exec( "git status --untracked-files=no --porcelain" );
	return !stdout.trim();
}
