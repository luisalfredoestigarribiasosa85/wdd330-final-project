import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function copyPartials() {
  try {
    const distPath = resolve(__dirname, "dist", "partials");
    const srcPath = resolve(__dirname, "src", "partials");

    // Create partials directory in dist
    await fs.ensureDir(distPath);

    // Copy partials
    await fs.copy(srcPath, distPath);
    console.log("Successfully copied partials to dist folder");
  } catch (err) {
    console.error("Error copying partials:", err);
    process.exit(1);
  }
}

copyPartials();
