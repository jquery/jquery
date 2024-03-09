import path from "node:path";
import { fileURLToPath } from "node:url";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const dirname = path.dirname( fileURLToPath( import.meta.url ) );

export default {
	input: `${ dirname }/src-esm-commonjs/main.js`,
	output: {
		dir: `${ dirname }/tmp/rollup-commonjs`,
		format: "iife",
		sourcemap: true
	},
	plugins: [
		resolve(),
		commonjs()
	]
};
