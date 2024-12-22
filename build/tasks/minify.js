 import fs from "node:fs/promises";
import path from "node:path";
import swc from "@swc/core";
import processForDist from "./dist.js";
import getTimestamp from "./lib/getTimestamp.js";

const rjs = /\.js$/;

export default async function minify({ filename, dir, esm, releaseDate }) {
    try {
        const filePath = path.join(dir, filename);
        const contents = await fs.readFile(filePath, "utf8");

        // Extract version from the file
        const versionMatch = /jQuery JavaScript Library ([^\n]+)/.exec(contents);
        if (!versionMatch) {
            throw new Error(`Version not found in ${filename}.`);
        }
        const version = versionMatch[1];

        // Minify with SWC
        const { code, map: incompleteMap } = await swc.minify(contents, {
            compress: {
                ecma: esm ? 2015 : 5,
                hoist_funs: false,
                loops: false,
            },
            format: {
                ecma: esm ? 2015 : 5,
                asciiOnly: true,
                comments: false,
                preamble: `/*! jQuery ${version}` +
                    ` | Release Date: ${releaseDate}` +
                    " | (c) OpenJS Foundation and other contributors" +
                    " | jquery.org/license */\n",
            },
            inlineSourcesContent: false,
            mangle: true,
            module: esm,
            sourceMap: true,
        });

        // Define filenames for minified files and sourcemaps
        const minFilename = filename.replace(rjs, ".min.js");
        const mapFilename = filename.replace(rjs, ".min.map");

        // Correct source map properties
        const map = JSON.stringify({
            ...JSON.parse(incompleteMap),
            file: minFilename,
            sources: [filename],
        });

        // Write the minified code and map to the directory
        await Promise.all([
            fs.writeFile(path.join(dir, minFilename), code),
            fs.writeFile(path.join(dir, mapFilename), map),
        ]);

        // Process files for distribution
        processForDist(contents, filename, version, releaseDate);
        processForDist(code, minFilename, version, releaseDate);
        processForDist(map, mapFilename, version, releaseDate);

        console.log(
            `[${getTimestamp()}] ${minFilename} (${version}) with ${
                mapFilename
            } created successfully.`
        );
    } catch (error) {
        console.error(`Error during minification process: ${error.message}`);
        throw error;
    }
}
