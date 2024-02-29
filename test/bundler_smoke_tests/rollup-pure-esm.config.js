import path from "node:path";
import { fileURLToPath } from "node:url";
import resolve from "@rollup/plugin-node-resolve";

const dirname = path.dirname( fileURLToPath( import.meta.url ) );
const TEST_DIR = path.resolve( dirname, ".." );

export default {
	input: `${ dirname }/src-pure-esm/main.js`,
	output: {
		dir: `${ TEST_DIR }/data/core/tmp-bundlers/rollup-pure-esm`,
		format: "es",
		sourcemap: true
	},
	plugins: [
		resolve()
	]
};
