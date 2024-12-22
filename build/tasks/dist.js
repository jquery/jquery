// Process files for distribution with additional validations and enhancements.
export default function processForDist(text, filename, version, releaseDate) {
    if (!text) {
        throw new Error("Text content is required for processForDist.");
    }

    if (!filename) {
        throw new Error("Filename is required for processForDist.");
    }

    if (!version) {
        throw new Error("Version is required for processForDist.");
    }

    if (!releaseDate) {
        throw new Error("Release date is required for processForDist.");
    }

    // Ensure files use only \n for line endings, not \r\n
    if (/\x0d\x0a/.test(text)) {
        throw new Error(`${filename}: Incorrect line endings (\\r\\n).`);
    }

    // Ensure only ASCII chars so script tags don't need a charset attribute
    if (text.length !== Buffer.byteLength(text, "utf8")) {
        let message = `${filename}: Non-ASCII characters detected:\n`;
        for (let i = 0; i < text.length; i++) {
            const c = text.charCodeAt(i);
            if (c > 127) {
                message += `- Position ${i}: ${c}\n`;
                message += `==> ${text.substring(Math.max(0, i - 20), i + 20)}`;
                break;
            }
        }
        throw new Error(message);
    }

    // Validate embedded version and release date
    if (!text.includes(version)) {
        throw new Error(`${filename}: Embedded version mismatch. Expected: ${version}`);
    }

    if (!text.includes(releaseDate)) {
        throw new Error(`${filename}: Release date mismatch. Expected: ${releaseDate}`);
    }

    // Normalize line endings for consistency
    text = text.replace(/\r\n/g, "\n");

    console.log(`[processForDist] Processed file: ${filename}`);
    console.log(`[processForDist] Version: ${version}`);
    console.log(`[processForDist] Release Date: ${releaseDate}`);
    
    return text;
}
