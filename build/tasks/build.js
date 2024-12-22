async function getLastModifiedDate() {
    try {
        const { stdout } = await exec("git log -1 --format=\"%at\"");
        return new Date(parseInt(stdout, 10) * 1000);
    } catch (error) {
        console.error("Failed to retrieve last modified date from git. Using current date as fallback.", error);
        return new Date(); // Fallback to the current date
    }
}

async function writeCompiled({ code, dir, filename, version }) {
    const date = process.env.RELEASE_DATE
        ? new Date(process.env.RELEASE_DATE)
        : await getLastModifiedDate();

    const compiledContents = code

        // Embed Version
        .replace(/@VERSION/g, version)

        // Embed Date
        .replace(/@DATE/g, date.toISOString().replace(/:\d+\.\d+Z$/, "Z")); // Format: yyyy-mm-ddThh:mmZ

    await fs.writeFile(path.join(dir, filename), compiledContents);
    console.log(`[${getTimestamp()}] ${filename} v${version} created.`);
}
