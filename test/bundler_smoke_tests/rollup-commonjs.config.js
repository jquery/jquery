import path from "node:path";
import { fileURLToPath } from "node:url";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const dirname = path.dirname( fileURLToPath( import.meta.url ) );
const TEST_DIR = path.resolve( dirname, ".." );

export default {
	input: `${ dirname }/src-esm-commonjs/main.js`,
	output: {
		dir: `${ TEST_DIR }/data/core/tmp-bundlers/rollup-commonjs`,
		format: "es",
		sourcemap: true
	},
	plugins: [
		resolve(),
		commonjs()
	]
};
