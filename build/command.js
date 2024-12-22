 import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { build } from "./tasks/build.js";
import slimExclude from "./tasks/lib/slim-exclude.js";

// Define CLI options
const options = [
    {
        name: "filename",
        alias: "f",
        type: "string",
        description: "Set the filename of the built file.",
        default: "jquery.js",
    },
    {
        name: "dir",
        alias: "d",
        type: "string",
        description: "Set the output directory for the built file.",
        default: "./dist",
    },
    {
        name: "version",
        alias: "v",
        type: "string",
        description: "Set the version to include in the built file.",
    },
    {
        name: "watch",
        alias: "w",
        type: "boolean",
        description: "Watch source files and rebuild on changes.",
        default: false,
    },
    {
        name: "exclude",
        alias: "e",
        type: "array",
        description: "Modules to exclude from the build.",
    },
    {
        name: "include",
        alias: "i",
        type: "array",
        description: "Modules to include in the build.",
    },
    {
        name: "esm",
        type: "boolean",
        description: "Build an ES module (ESM) bundle.",
        default: false,
    },
    {
        name: "factory",
        type: "boolean",
        description: "Build the factory bundle.",
        default: false,
    },
    {
        name: "slim",
        alias: "s",
        type: "boolean",
        description: `Build a slim bundle excluding: ${slimExclude.join(", ")}`,
        default: false,
    },
    {
        name: "amd",
        type: "string",
        description: "Set the name of the AMD module.",
    },
];

// Initialize yargs
const argv = yargs(hideBin(process.argv))
    .version(false)
    .usage("Usage: $0 [options]")
    .command("$0", "Build a jQuery bundle", (yargs) => {
        options.forEach(({ name, alias, type, description, default: def }) => {
            yargs.option(name, {
                alias,
                type,
                description,
                default: def,
            });
        });
    })
    .help()
    .argv;

// Run the build process with the parsed arguments
build(argv);
