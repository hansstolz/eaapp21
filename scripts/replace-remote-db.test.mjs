import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("./replace-remote-db.mjs", import.meta.url));
for (const scenario of ["preview", "success", "target-dump-failure", "source-dump-failure", "verification-failure"]) {
  test(scenario, async () => {
    const cwd = await mkdtemp(join(tmpdir(), "ea-transfer-test-"));
    try {
      const mock = join(cwd, "client.mjs");
      const log = join(cwd, "calls.log");
      await writeFile(mock, `#!/usr/bin/env node
import { appendFileSync, readFileSync } from 'node:fs';
let input = '';
for await (const chunk of process.stdin) input += chunk;
const args = process.argv.slice(2);
const config = args[0];
const source = config.includes('source.cnf');
const dump = args.includes('--single-transaction');
appendFileSync(process.env.TEST_LOG, JSON.stringify({ source, dump, input }) + '\\n');
if (dump) {
  if (process.env.SCENARIO === (source ? 'source-dump-failure' : 'target-dump-failure')) process.exit(1);
  console.log('-- fixture dump');
} else if (input.includes('DEFAULT_CHARACTER_SET_NAME')) console.log('utf8mb4\\tutf8mb4_unicode_ci');
else if (input.includes('TABLE_TYPE')) console.log('example\\tBASE TABLE');
else if (input.includes('COUNT(*)')) console.log(!source && process.env.SCENARIO === 'verification-failure' ? '3' : '2');
else if (input.includes('SELECT 1')) console.log('1');
// Confirm credentials are in a private options file rather than arguments.
if (!readFileSync(config.slice('--defaults-file='.length), 'utf8').includes('password=')) process.exit(2);
`, { mode: 0o700 });
      const result = spawnSync(process.execPath, [script, ...(scenario === "preview" ? [] : ["--execute"])], {
        cwd, encoding: "utf8", env: {
          ...process.env,
          DATABASE_URL: "mysql://source:secret@localhost:3306/local_db",
          TARGET_DATABASE_URL: "mysql://target:secret@example.invalid:3306/remote_db",
          MYSQL_BIN: mock, MYSQLDUMP_BIN: mock, TEST_LOG: log, SCENARIO: scenario,
        },
      });
      assert.equal(result.status, ["preview", "success"].includes(scenario) ? 0 : 1, result.stderr);
      assert.ok(!`${result.stdout}${result.stderr}`.includes("secret"));
      if (scenario === "preview") {
        assert.deepEqual(await readdir(cwd), ["client.mjs"]);
        return;
      }
      const calls = (await readFile(log, "utf8")).trim().split("\n").map(JSON.parse);
      const reset = calls.findIndex((call) => call.input.includes("DROP DATABASE"));
      if (scenario.endsWith("dump-failure")) assert.equal(reset, -1);
      else {
        assert.ok(reset > calls.findIndex((call) => call.dump && call.source));
        assert.ok(reset > calls.findIndex((call) => call.dump && !call.source));
        assert.ok(calls[reset].input.includes("`remote_db`"));
        assert.ok(!calls.some((call) => call.source && call.input.includes("DROP DATABASE")));
        const folder = (await readdir(join(cwd, "backups/database")))[0];
        assert.ok((await readFile(join(cwd, "backups/database", folder, "target-before.sql"), "utf8")).includes("fixture dump"));
      }
    } finally { await rm(cwd, { recursive: true, force: true }); }
  });
}
