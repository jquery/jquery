import path from "node:path";
import { fileURLToPath } from "node:url";
import resolve from "@rollup/plugin-node-resolve";

const dirname = path.dirname( fileURLToPath( import.meta.url ) );

export default {
	input: `${ dirname }/src-pure-esm/main.js`,
	output: {
		dir: `${ dirname }/tmp/rollup-pure-esm`,
		format: "iife",
		sourcemap: true
	},
	plugins: [
		resolve()
	]
};
