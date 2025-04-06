import {test} from "node:test";
import { promisify } from "node:util";
import { exec } from "node:child_process";
import * as epubcheck from "./index.js";
const execProm = promisify(exec);

test("can be called", async () => {
	const {stdout} = await execProm(`java -jar ${epubcheck.path} --version`);
	console.log(stdout);
});
