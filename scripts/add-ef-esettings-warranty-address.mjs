import 'dotenv/config';
import mariadb from 'mariadb';

const url = new URL(process.env.DATABASE_URL);
const connection = await mariadb.createConnection({
  host: url.hostname, port: Number(url.port || 3306),
  user: decodeURIComponent(url.username), password: decodeURIComponent(url.password),
});
try {
  const rows = await connection.query('SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?', ['ef', 'ea_esettings']);
  const columns = new Set(rows.map(row => row.COLUMN_NAME));
  if (columns.has('address_warranty')) throw new Error('address_warranty existiert bereits; keine Änderungen vorgenommen.');
  const customers = await connection.query('SELECT uid_esettings FROM ef.ea_esettings WHERE user_group = ?', ['88+DE']);
  if (customers.length !== 1) throw new Error('Kein eindeutiger Einstellungsdatensatz für 88+DE; keine Änderungen vorgenommen.');
  await connection.query(`ALTER TABLE ef.ea_esettings
    ${columns.has('warranty_vat_no') ? '' : 'ADD COLUMN warranty_vat_no VARCHAR(50) NULL AFTER warranty_country,'}
    ADD COLUMN address_warranty TEXT GENERATED ALWAYS AS (
      CONCAT_WS(CHAR(10),
        NULLIF(TRIM(warranty_name), ''),
        NULLIF(TRIM(warranty_street), ''),
        NULLIF(CONCAT_WS(', ',
          NULLIF(CONCAT_WS(' ', NULLIF(TRIM(warranty_postcode), ''), NULLIF(TRIM(warranty_city), '')), ''),
          NULLIF(TRIM(warranty_country), '')
        ), ''),
        CASE WHEN NULLIF(TRIM(warranty_vat_no), '') IS NOT NULL THEN CONCAT('VAT: ', TRIM(warranty_vat_no)) END
      )
    ) VIRTUAL`);
  await connection.query(`UPDATE ef.ea_esettings SET warranty_name = ?, warranty_street = ?, warranty_postcode = ?, warranty_city = ?, warranty_country = ?, warranty_vat_no = ? WHERE uid_esettings = ?`, [
    'Cycling Sports Group Europe B.V.', 'Geeresteinselaan 57', '3931 JB', 'Woudenbergl', 'NL', 'NL008672404B01', customers[0].uid_esettings,
  ]);
  const [result] = await connection.query('SELECT uid_esettings, address_warranty FROM ef.ea_esettings WHERE uid_esettings = ?', [customers[0].uid_esettings]);
  const expected = 'Cycling Sports Group Europe B.V.\nGeeresteinselaan 57\n3931 JB Woudenbergl, NL\nVAT: NL008672404B01';
  if (result.address_warranty !== expected) throw new Error('Die berechnete Garantieadresse entspricht nicht der Vorgabe.');
  console.log(JSON.stringify(result, null, 2));
} finally {
  await connection.end();
}
