 import fs from "node:fs/promises";
import util from "node:util";
import { exec as nodeExec } from "node:child_process";

const exec = util.promisify(nodeExec);

const allowedLibraryTypes = new Set(["regular", "factory"]);
const allowedSourceTypes = new Set(["commonjs", "module", "dual"]);

async function runTests({ libraryType, sourceType, module }) {
    if (!allowedLibraryTypes.has(libraryType) || !allowedSourceTypes.has(sourceType)) {
        throw new Error(
            `Invalid configuration: libraryType "${libraryType}", sourceType "${sourceType}", module "${module}".`
        );
    }

    const dir = `./test/node_smoke_tests/${sourceType}/${libraryType}`;
    try {
        const files = await fs.readdir(dir, { withFileTypes: true });
        const testFiles = files.filter((file) => file.isFile());

        if (!testFiles.length) {
            throw new Error(`No test files found for ${libraryType} ${sourceType} "${module}".`);
        }

        await Promise.all(
            testFiles.map((testFile) =>
                exec(`node "${dir}/${testFile.name}" "${module}"`).catch((error) => {
                    console.error(`Test failed: ${testFile.name}`);
                    throw error;
                })
            )
        );

        console.log(`✅ Node smoke tests passed for ${libraryType} ${sourceType} "${module}".`);
    } catch (error) {
        console.error(`❌ Error running tests for ${libraryType} ${sourceType} "${module}":`, error);
        throw error;
    }
}

async function runDefaultTests() {
    const configurations = [
        // Regular, CommonJS
        { libraryType: "regular", sourceType: "commonjs", module: "jquery" },
        { libraryType: "regular", sourceType: "commonjs", module: "jquery/slim" },
        { libraryType: "regular", sourceType: "commonjs", module: "./dist/jquery.js" },
        { libraryType: "regular", sourceType: "commonjs", module: "./dist/jquery.slim.js" },

        // Regular, Module
        { libraryType: "regular", sourceType: "module", module: "jquery" },
        { libraryType: "regular", sourceType: "module", module: "jquery/slim" },
        { libraryType: "regular", sourceType: "module", module: "./dist-module/jquery.module.js" },
        { libraryType: "regular", sourceType: "module", module: "./dist-module/jquery.slim.module.js" },

        // Factory, CommonJS
        { libraryType: "factory", sourceType: "commonjs", module: "jquery/factory" },
        { libraryType: "factory", sourceType: "commonjs", module: "jquery/factory-slim" },
        { libraryType: "factory", sourceType: "commonjs", module: "./dist/jquery.factory.js" },
        { libraryType: "factory", sourceType: "commonjs", module: "./dist/jquery.factory.slim.js" },

        // Factory, Module
        { libraryType: "factory", sourceType: "module", module: "jquery/factory" },
        { libraryType: "factory", sourceType: "module", module: "jquery/factory-slim" },
        { libraryType: "factory", sourceType: "module", module: "./dist-module/jquery.factory.module.js" },
        { libraryType: "factory", sourceType: "module", module: "./dist-module/jquery.factory.slim.module.js" },

        // Dual, Regular
        { libraryType: "regular", sourceType: "dual", module: "jquery" },
        { libraryType: "regular", sourceType: "dual", module: "jquery/slim" },

        // Dual, Factory
        { libraryType: "factory", sourceType: "dual", module: "jquery/factory" },
        { libraryType: "factory", sourceType: "dual", module: "jquery/factory-slim" },
    ];

    try {
        await Promise.all(
            configurations.map((config) =>
                runTests(config).catch((error) => {
                    console.error(`Error in configuration:`, config, error);
                    throw error;
                })
            )
        );

        console.log("🎉 All default tests passed successfully.");
    } catch (error) {
        console.error("⚠️ Some tests failed. See above logs for details.");
        throw error;
    }
}

// Entry point for the test process
(async () => {
    try {
        await runDefaultTests();
    } catch (error) {
        console.error("🚨 Test process failed:", error);
        process.exit(1);
    }
})();
