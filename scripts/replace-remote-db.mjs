import "dotenv/config";
import { spawn } from "node:child_process";
import { createReadStream, openSync, closeSync } from "node:fs";
import { mkdir, mkdtemp, writeFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";

const args = process.argv.slice(2);
const execute = args.includes("--execute");
const quote = (value) => `\`${value.replaceAll("`", "``")}\``;
const option = (value) => `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("\n", "\\n").replaceAll("\r", "\\r")}"`;

function connection(name) {
  if (!process.env[name]) throw new Error(`${name} fehlt in .env.`);
  let url;
  try { url = new URL(process.env[name]); } catch { throw new Error(`${name} ist keine gültige URL.`); }
  if (!["mysql:", "mariadb:"].includes(url.protocol)) throw new Error(`${name}: mysql:// oder mariadb:// erforderlich.`);
  const database = decodeURIComponent(url.pathname.slice(1));
  if (!/^[a-zA-Z0-9_$-]+$/.test(database) || ["mysql", "sys", "information_schema", "performance_schema"].includes(database.toLowerCase()))
    throw new Error(`${name}: ungültige oder geschützte Datenbank.`);
  if (url.search) throw new Error(`${name}: URL-Parameter werden nicht unterstützt. TLS wird separat konfiguriert.`);
  return { host: url.hostname, port: url.port || "3306", user: decodeURIComponent(url.username), password: decodeURIComponent(url.password), database };
}

async function run(binary, config, parameters, { input, output, sql } = {}) {
  const fd = output ? openSync(output, "wx", 0o600) : null;
  try {
    return await new Promise((resolveRun, reject) => {
      const child = spawn(binary, [`--defaults-file=${config}`, ...parameters], { stdio: ["pipe", fd ?? "pipe", "pipe"] });
      let stdout = "";
      let stderr = "";
      child.stdout?.on("data", (chunk) => { stdout += chunk; });
      child.stderr.on("data", (chunk) => { stderr += chunk; });
      child.stdin.on("error", () => {});
      child.on("error", () => reject(new Error(`${binary} konnte nicht gestartet werden.`)));
      child.on("close", (code) => code === 0 ? resolveRun(stdout) : reject(new Error(`${binary} fehlgeschlagen (${code}): ${stderr.trim()}`)));
      if (input) {
        const stream = createReadStream(input);
        stream.on("error", () => child.kill());
        child.on("close", () => stream.destroy());
        stream.pipe(child.stdin);
      } else child.stdin.end(sql ?? "");
    });
  } finally { if (fd !== null) closeSync(fd); }
}

async function main() {
  if (args.some((arg) => arg !== "--execute")) throw new Error("Verwendung: npm run db:replace-remote -- [--execute]");
  const source = connection("DATABASE_URL");
  const target = connection("TARGET_DATABASE_URL");
  if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(source.host)) throw new Error("Die Quelle muss localhost sein.");
  if (["localhost", "127.0.0.1", "::1", "[::1]"].includes(target.host)) throw new Error("Das Ziel muss ein externer Server sein.");
  console.log(`Quelle: ${source.host}:${source.port}/${source.database}`);
  console.log(`Ziel:   ${target.host}:${target.port}/${target.database}`);
  if (!execute) {
    console.log("Vorschau: Ziel sichern → Quelle exportieren → Zieldatenbank löschen/neu anlegen → importieren → Tabellen und Zeilenzahlen prüfen.");
    console.log("Keine Verbindung hergestellt, keine Daten verändert. Start mit --execute (vorher Schreibzugriffe auf beiden Seiten pausieren).");
    return;
  }
  const directory = await mkdtemp(join(tmpdir(), "ea-db-transfer-"));
  let backupDirectory;
  let replacing = false;
  try {
    async function config(name, db, remote) {
      const path = join(directory, `${name}.cnf`);
      const tls = remote ? `ssl-mode=VERIFY_IDENTITY\n${process.env.TARGET_DB_SSL_CA ? `ssl-ca=${option(resolve(process.env.TARGET_DB_SSL_CA))}\n` : ""}` : "";
      await writeFile(path, `[client]\nprotocol=tcp\nhost=${option(db.host)}\nport=${db.port}\nuser=${option(db.user)}\npassword=${option(db.password)}\nconnect-timeout=15\ndefault-character-set=utf8mb4\n${tls}`, { mode: 0o600 });
      return path;
    }
    const sourceConfig = await config("source", source, false);
    const targetConfig = await config("target", target, true);
    const mysql = process.env.MYSQL_BIN || "mysql";
    const dump = process.env.MYSQLDUMP_BIN || "mysqldump";
    const query = (cfg, database, sql) => run(mysql, cfg, ["--batch", "--skip-column-names", ...(database ? [database] : [])], { sql });
    // Read-only preflight: require an existing target so a backup is always possible.
    await query(targetConfig, target.database, "SELECT 1;");
    const schema = (await query(sourceConfig, source.database, "SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME=DATABASE();")).trim().split("\t");
    if (schema.length !== 2 || schema.some((value) => !/^[a-zA-Z0-9_]+$/.test(value))) throw new Error("Quell-Zeichensatz konnte nicht bestimmt werden.");
    const inventorySql = "SELECT TABLE_NAME, TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() ORDER BY TABLE_NAME;";
    async function inventory(cfg, database) {
      const rows = (await query(cfg, database, inventorySql)).trim();
      const result = [];
      for (const line of rows ? rows.split("\n") : []) {
        const [name, type] = line.split("\t");
        const count = type === "BASE TABLE" ? (await query(cfg, database, `SELECT COUNT(*) FROM ${quote(name)};`)).trim() : null;
        result.push({ name, type, count });
      }
      return result;
    }
    const expected = await inventory(sourceConfig, source.database);
    const root = resolve("backups/database");
    await mkdir(root, { recursive: true, mode: 0o700 });
    backupDirectory = await mkdtemp(join(root, `${new Date().toISOString().replaceAll(":", "-")}-`));
    const dumpArgs = ["--single-transaction", "--quick", "--hex-blob", "--routines", "--events", "--triggers", "--no-tablespaces", "--set-gtid-purged=OFF", "--column-statistics=0"];
    console.log("Sichere externe Datenbank …");
    const backup = join(backupDirectory, "target-before.sql");
    await run(dump, targetConfig, [...dumpArgs, target.database], { output: backup });
    if (!(await stat(backup)).size) throw new Error("Zielbackup ist leer.");
    console.log("Exportiere lokale Datenbank …");
    const localDump = join(backupDirectory, "source.sql");
    await run(dump, sourceConfig, [...dumpArgs, source.database], { output: localDump });
    if (!(await stat(localDump)).size) throw new Error("Quelldump ist leer.");
    await writeFile(join(backupDirectory, "manifest.json"), JSON.stringify({ source: `${source.host}/${source.database}`, target: `${target.host}/${target.database}`, expected }, null, 2), { mode: 0o600 });
    console.log(`Backups: ${backupDirectory}`);
    replacing = true;
    await query(targetConfig, null, `DROP DATABASE ${quote(target.database)}; CREATE DATABASE ${quote(target.database)} CHARACTER SET ${schema[0]} COLLATE ${schema[1]};`);
    await run(mysql, targetConfig, [target.database], { input: localDump });
    const actual = await inventory(targetConfig, target.database);
    if (JSON.stringify(expected) !== JSON.stringify(actual)) throw new Error("Tabellen/Views oder Zeilenzahlen stimmen nicht überein.");
    console.log(`Übertragung abgeschlossen: ${actual.length} Tabellen/Views geprüft. Trigger, Routinen und Events sind im Dump enthalten.`);
  } catch (error) {
    if (replacing) console.error("Import/Prüfung fehlgeschlagen. Ziel kann unvollständig sein. Schreibzugriffe pausiert lassen und target-before.sql wiederherstellen.");
    if (backupDirectory) console.error(`Sicherungsdateien: ${backupDirectory}`);
    throw error;
  } finally { await rm(directory, { recursive: true, force: true }); }
}

main().catch((error) => {
  // Never print a raw connection URL (it contains credentials).
  let message = error.message;
  for (const key of ["DATABASE_URL", "TARGET_DATABASE_URL"]) {
    if (process.env[key]) message = message.replaceAll(process.env[key], "[Datenbank-URL]");
  }
  console.error(message);
  process.exitCode = 1;
});
