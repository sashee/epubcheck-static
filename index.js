import packageJson from "./package.json" with {type: "json"};
import {dirname, join} from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const {libVersion} = packageJson.version.match(/^[^.]+\.[^.]+\.[^.]+-(?<libVersion>.*)$/).groups;

export const version = libVersion;

export const path = join(__dirname, "vendor", "epubcheck.jar");
