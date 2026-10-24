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
  if (columns.has('footer_lists') || columns.has('footer_mails')) throw new Error('Mindestens ein Footer-Feld existiert bereits; keine Änderungen vorgenommen.');
  const settings = await connection.query('SELECT uid_esettings FROM ef.ea_esettings WHERE user_group = ?', ['88+DE']);
  if (settings.length !== 1) throw new Error('Kein eindeutiger Einstellungsdatensatz für 88+DE; keine Änderungen vorgenommen.');
  const extraFields = [
    ['footer_company_name', 'VARCHAR(150)'],
    ['bank_account_holder', 'VARCHAR(150)'],
    ['bank_name', 'VARCHAR(150)'],
  ].filter(([name]) => !columns.has(name)).map(([name, type]) => `ADD COLUMN ${name} ${type} NULL`);
  await connection.query(`ALTER TABLE ef.ea_esettings
    ${extraFields.length ? extraFields.join(', ') + ',' : ''}
    ADD COLUMN footer_lists TEXT GENERATED ALWAYS AS (
      CONCAT_WS(' • ',
        COALESCE(NULLIF(TRIM(footer_company_name), ''), NULLIF(TRIM(name), '')),
        NULLIF(TRIM(name2), ''),
        NULLIF(TRIM(street), ''),
        NULLIF(CONCAT_WS(' ', NULLIF(TRIM(postcode), ''), NULLIF(TRIM(city), '')), '')
      )
    ) VIRTUAL,
    ADD COLUMN footer_mails TEXT GENERATED ALWAYS AS (
      CONCAT_WS(' ',
        CONCAT('Bankverbindung ', LOWER(TRIM(name)), ','),
        COALESCE(NULLIF(TRIM(bank_account_holder), ''), NULLIF(TRIM(name2), '')),
        CASE WHEN NULLIF(TRIM(BIC), '') IS NOT NULL THEN CONCAT('BIC: ', TRIM(BIC)) END,
        CASE WHEN NULLIF(TRIM(IBAN), '') IS NOT NULL THEN CONCAT('IBAN: ', TRIM(IBAN)) END,
        CASE WHEN NULLIF(TRIM(bank_name), '') IS NOT NULL THEN CONCAT(', ', TRIM(bank_name)) END
      )
    ) VIRTUAL`);
  await connection.query('UPDATE ef.ea_esettings SET footer_company_name = ?, bank_account_holder = ?, bank_name = ? WHERE uid_esettings = ?', [
    'Eighty-Aid Germany', 'Markus Johann Dellinger', 'VR-Bank Wuerzburg', settings[0].uid_esettings,
  ]);
  const [result] = await connection.query('SELECT uid_esettings, footer_lists, footer_mails FROM ef.ea_esettings WHERE uid_esettings = ?', [settings[0].uid_esettings]);
  if (result.footer_lists !== 'Eighty-Aid Germany • Markus Dellinger • Leistenstr. 3 • 97082 Würzburg'
    || result.footer_mails !== 'Bankverbindung eighty-aid, Markus Johann Dellinger BIC: GENODEF1WU1 IBAN: DE62 7909 0000 0002 0977 96 , VR-Bank Wuerzburg') {
    throw new Error('Die berechneten Fußzeilen entsprechen nicht der Vorgabe.');
  }
  console.log(JSON.stringify(result, null, 2));
} finally {
  await connection.end();
}
