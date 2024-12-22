 import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { promisify } from "node:util";

const command = path.resolve(
    `node_modules/.bin/promises-aplus-tests${os.platform() === "win32" ? ".cmd" : ""}`
);
const args = ["--reporter", "dot", "--timeout", "2000"];
const tests = [
    "test/promises_aplus_adapters/deferred.cjs",
    "test/promises_aplus_adapters/when.cjs"
];

const spawnAsync = promisify((cmd, args, options, callback) => {
    const child = spawn(cmd, args, options);
    child.on("close", (code) => {
        if (code !== 0) {
            callback(new Error(`Test failed with exit code ${code}`));
        } else {
            callback(null);
        }
    });
});

async function runTests() {
    console.log("🔄 Starting Promises/A+ compliance tests...");

    const results = await Promise.allSettled(
        tests.map(async (test) => {
            try {
                console.log(`🚀 Running test: ${test}`);
                await spawnAsync(command, [test, ...args], { shell: true, stdio: "inherit" });
                console.log(`✅ Test passed: ${test}`);
            } catch (error) {
                console.error(`❌ Test failed: ${test}`, error);
                throw error; // Fail fast in CI/CD pipelines
            }
        })
    );

    const failedTests = results.filter(({ status }) => status === "rejected");

    if (failedTests.length > 0) {
        console.error("🚨 Some tests failed. Stopping release process.");
        process.exit(1); // Exit with a non-zero code to signal failure in CI/CD
    }

    console.log("🎉 All tests passed successfully!");
}

runTests().catch((error) => {
    console.error("🚨 An unexpected error occurred during test execution:", error);
    process.exit(1);
});
