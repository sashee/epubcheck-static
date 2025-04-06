import packageJson from "./package.json" with {type: "json"};
import {createWriteStream} from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import {extract} from "zip-lib";
import os from "node:os";
import {pipeline} from "node:stream/promises";

const __dirname = import.meta.dirname;

const withTempFile = (fn) => withTempDir((dir) => fn(path.join(dir, "file")));

const withTempDir = async (fn) => {
	const dir = await fs.mkdtemp(await fs.realpath(os.tmpdir()) + path.sep);
	try {
		return await fn(dir);
	}finally {
		fs.rm(dir, {recursive: true});
	}
};

const {libVersion} = packageJson.version.match(/^[^.]+\.[^.]+\.[^.]+-(?<libVersion>.*)$/).groups;

const downloadUrl = `https://github.com/w3c/epubcheck/releases/download/${libVersion}/epubcheck-${libVersion.replace(/^v?/, "")}.zip`;
console.log(downloadUrl);

const res = await fetch(downloadUrl);
if (!res.ok) {
	console.error(res);
	throw new Error("Download failed");
}

await withTempFile(async (zipFile) => {
	console.log(zipFile);
	await pipeline(
		res.body,
		createWriteStream(zipFile),
	);

	const targetDir = path.join(__dirname, "vendor");

	await fs.rm(targetDir, {recursive: true, force: true});
	await fs.mkdir(targetDir, {recursive: true});

	await withTempDir(async (tempDir) => {
		await extract(zipFile, tempDir);
		const files = await fs.readdir(tempDir, {withFileTypes: true});
		console.log(files);
		if (files.length === 1 && files[0].isDirectory()) {
			// if there is a single directory in the target then flatten it
			await fs.cp(path.join(tempDir, files[0].name), targetDir, {recursive: true});
		}else {
			throw new Error(`Expected to have a single top-level directory in the zip file but found more than one entries: ${files}. This case is not handles since epubchecker published its releases zipped with a top-level directory at the time of writing this script`);
		}
	});
});

