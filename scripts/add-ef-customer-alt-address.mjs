import "dotenv/config";
import mariadb from "mariadb";

const fields = {
  alt_company: 100,
  alt_first_name: 50,
  alt_last_name: 50,
  alt_street_address: 100,
  alt_postal_code: 20,
  alt_city: 50,
};
const names = Object.keys(fields);
const url = new URL(process.env.DATABASE_URL);
if (url.pathname !== "/ef") throw new Error("DATABASE_URL muss auf die Datenbank ef zeigen.");

const connection = await mariadb.createConnection({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: "ef",
  allowPublicKeyRetrieval: true,
});

const part = (field) => `NULLIF(TRIM(NEW.${field}), '')`;
const line = (...columns) => `NULLIF(CONCAT_WS(' ', ${columns.map(part).join(", ")}), '')`;
const address = `NULLIF(CONCAT_WS(CHAR(10),
  ${part("alt_company")},
  ${line("alt_first_name", "alt_last_name")},
  ${part("alt_street_address")},
  ${line("alt_postal_code", "alt_city")}
), '')`;

try {
  const columns = await connection.query("SHOW COLUMNS FROM ef.ea_customer");
  const missing = names.filter((name) => !columns.some((column) => column.Field === name));
  if (missing.length) {
    const additions = missing.map((name) => `ADD COLUMN ${name} VARCHAR(${fields[name]}) NULL`);
    await connection.query(`ALTER TABLE ef.ea_customer ${additions.join(", ")}`);
  }

  const triggers = await connection.query("SHOW TRIGGERS FROM ef WHERE `Table` = 'ea_customer'");
  const onInsert = `(${address}) IS NOT NULL`;
  const onUpdate = names.map((name) => `NOT (BINARY OLD.${name} <=> BINARY NEW.${name})`).join(" OR ");
  for (const [event, condition] of [["INSERT", onInsert], ["UPDATE", onUpdate]]) {
    const name = `ea_customer_alt_address_${event.toLowerCase()}`;
    if (triggers.some((trigger) => trigger.Trigger === name)) continue;
    await connection.query(`CREATE TRIGGER ef.${name} BEFORE ${event} ON ef.ea_customer
      FOR EACH ROW
      BEGIN
        IF ${condition} THEN
          SET NEW.delivery_address = ${address};
        END IF;
      END`);
  }
  console.log("Sechs Adressfelder und beide Trigger sind vorhanden.");
} finally {
  await connection.end();
}
