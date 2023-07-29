import child_process from "child_process";
import debug from "debug";
import fs from "fs";
import { updateOriginalFileWithChanges } from "./sync/cssSync.js";
import { removeSourceMaps } from "./utils/fileUtils.js";
import { getChangeLocationsInOriginalFile } from "./utils/sourceMapUtils.js";

const log = debug("sourcesync");

class SourceSync {
  constructor(sourcePath, outputPath) {
    this.config = {
      cssOutputFile: outputPath,
      sourceFile: sourcePath,
    };
  }

  async buildCss() {
    child_process.execSync(
      `npx lightningcss --bundle --sourcemap ${this.config.sourceFile} -o ${this.config.cssOutputFile}`
    );
  }

  async removeCssSourceMaps() {
    let fileContent = await fs.promises.readFile(
      this.config.cssOutputFile,
      "utf8"
    );
    let linesWithoutSourceMaps = removeSourceMaps(fileContent);

    const newFileContent = linesWithoutSourceMaps.join("\n");

    await fs.promises.writeFile(this.config.cssOutputFile, newFileContent);
  }

  async startSync() {
    await this.buildCss();
    await this.removeCssSourceMaps();
    let unchangedFileContent = await fs.promises.readFile(
      this.config.cssOutputFile,
      "utf8"
    );

    fs.watchFile(this.config.cssOutputFile, async () => {
      const changedFileContent = await fs.promises.readFile(
        this.config.cssOutputFile,
        "utf8"
      );
      log("output.css changed");
      const changes = await getChangeLocationsInOriginalFile(
        unchangedFileContent,
        changedFileContent
      );
      const changedFiles = Array.from(
        new Set(changes.map((change) => change.originalFile))
      );

      for (let changedFile of changedFiles) {
        log(`Updating ${changedFile}`);
        const fileSpecificChanges = changes.filter(
          (change) => change.originalFile === changedFile
        );
        await updateOriginalFileWithChanges(fileSpecificChanges, changedFile);
      }
      unchangedFileContent = changedFileContent;
    });
  }
}

export { SourceSync };
