import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname( fileURLToPath( import.meta.url ) );
const TMP_BUNDLERS_DIR = path.resolve( dirname, "..", "tmp" );

export async function cleanTmpBundlersDir() {
	await fs.rm( TMP_BUNDLERS_DIR, {
		force: true,
		recursive: true
	} );
}
