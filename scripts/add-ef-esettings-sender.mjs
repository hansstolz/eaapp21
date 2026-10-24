import 'dotenv/config';
import mariadb from 'mariadb';

const url = new URL(process.env.DATABASE_URL);
const connection = await mariadb.createConnection({
  host: url.hostname, port: Number(url.port || 3306),
  user: decodeURIComponent(url.username), password: decodeURIComponent(url.password),
});
try {
  const columns = await connection.query('SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?', ['ef', 'ea_esettings', 'sender']);
  if (columns.length) throw new Error('sender existiert bereits; keine Änderungen vorgenommen.');
  await connection.query(`ALTER TABLE ef.ea_esettings ADD COLUMN sender TEXT
    GENERATED ALWAYS AS (
      CONCAT_WS(CHAR(10),
        NULLIF(TRIM(name), ''),
        NULLIF(TRIM(name2), ''),
        NULLIF(TRIM(street), ''),
        NULLIF(CONCAT_WS('/',
          NULLIF(CONCAT_WS(' ', NULLIF(TRIM(postcode), ''), NULLIF(TRIM(city), '')), ''),
          CASE UPPER(TRIM(country)) WHEN 'DE' THEN 'Germany' WHEN 'NL' THEN 'Netherlands' ELSE NULLIF(TRIM(country), '') END
        ), ''),
        '',
        CASE WHEN NULLIF(TRIM(fon), '') IS NOT NULL THEN CONCAT('Fon: ', TRIM(fon)) END,
        CASE WHEN NULLIF(TRIM(fax), '') IS NOT NULL THEN CONCAT('Fax: ', TRIM(fax)) END,
        CASE WHEN NULLIF(TRIM(email), '') IS NOT NULL THEN CONCAT('email: ', TRIM(email), '(bevorzugt)') END,
        NULLIF(TRIM(web), ''),
        '',
        CASE WHEN NULLIF(TRIM(tax_id), '') IS NOT NULL THEN CONCAT('USt-ID: ',
          CASE WHEN UPPER(LEFT(TRIM(tax_id), 2)) = 'DE'
            THEN CONCAT('DE ', TRIM(SUBSTRING(TRIM(tax_id), 3))) ELSE TRIM(tax_id) END) END,
        CASE WHEN invoiceDateIsDeliveryDate = 1 THEN 'Rechnungsdatum ist Lieferdatum' END
      )
    ) VIRTUAL`);
  const rows = await connection.query('SELECT uid_esettings, sender FROM ef.ea_esettings ORDER BY uid_esettings');
  for (const row of rows) console.log(JSON.stringify(row));
  const definition = await connection.query('SELECT COLUMN_NAME, EXTRA, GENERATION_EXPRESSION FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?', ['ef', 'ea_esettings', 'sender']);
  console.log(JSON.stringify(definition));
} finally {
  await connection.end();
}
