 import fs from "node:fs/promises";
import path from "node:path";

const projectDir = path.resolve(".");
const externalDir = path.resolve(projectDir, "external");

const files = {
    "bootstrap/bootstrap.css": "bootstrap/dist/css/bootstrap.css",
    "bootstrap/bootstrap.min.css": "bootstrap/dist/css/bootstrap.min.css",
    "bootstrap/bootstrap.min.css.map": "bootstrap/dist/css/bootstrap.min.css.map",

    "core-js-bundle/core-js-bundle.js": "core-js-bundle/minified.js",
    "core-js-bundle/LICENSE": "core-js-bundle/LICENSE",

    "npo/npo.js": "native-promise-only/lib/npo.src.js",

    "qunit/qunit.js": "qunit/qunit/qunit.js",
    "qunit/qunit.css": "qunit/qunit/qunit.css",
    "qunit/LICENSE.txt": "qunit/LICENSE.txt",

    "requirejs/require.js": "requirejs/require.js",

    "sinon/sinon.js": "sinon/pkg/sinon.js",
    "sinon/LICENSE.txt": "sinon/LICENSE"
};

async function copyFileWithLogging(from, to) {
    try {
        const toDir = path.dirname(to);
        await fs.mkdir(toDir, { recursive: true });
        await fs.copyFile(from, to);
        console.log(`✅ Copied: ${from} → ${to}`);
    } catch (error) {
        console.error(`❌ Failed to copy: ${from} → ${to}`, error);
        throw error;
    }
}

async function npmcopy() {
    try {
        console.log("🔄 Starting file copy process...");
        await fs.mkdir(externalDir, { recursive: true });

        for (const [dest, source] of Object.entries(files)) {
            const from = path.resolve(projectDir, "node_modules", source);
            const to = path.resolve(externalDir, dest);

            try {
                await copyFileWithLogging(from, to);
            } catch (error) {
                console.error(`⚠️ Error processing file: ${source}`, error);
            }
        }

        console.log("🎉 File copy process completed successfully.");
    } catch (error) {
        console.error("🚨 File copy process failed:", error);
        process.exit(1);
    }
}

npmcopy();
