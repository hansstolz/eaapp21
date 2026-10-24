import 'dotenv/config';
import mariadb from 'mariadb';

const url = new URL(process.env.DATABASE_URL);
const connection = await mariadb.createConnection({
  host: url.hostname, port: Number(url.port || 3306),
  user: decodeURIComponent(url.username), password: decodeURIComponent(url.password),
});
try {
  const databases = await connection.query('SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?', ['ef']);
  if (!databases.length) throw new Error('Datenbank ef existiert nicht oder ist nicht zugänglich.');
  const tables = await connection.query('SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?', ['ef', 'ea_esettings']);
  if (tables.length) throw new Error('ef.ea_esettings existiert bereits; keine Änderungen vorgenommen.');
  await connection.query(`CREATE TABLE ef.ea_esettings (
    uid_esettings INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    name2 VARCHAR(150) NULL,
    street VARCHAR(150) NULL,
    postcode VARCHAR(20) NULL,
    city VARCHAR(100) NULL,
    country CHAR(2) NULL,
    invoiceDateIsDeliveryDate BOOLEAN NOT NULL DEFAULT TRUE,
    IBAN VARCHAR(42) NULL,
    BIC VARCHAR(11) NULL,
    tax_id VARCHAR(50) NULL,
    fon VARCHAR(50) NULL,
    fax VARCHAR(50) NULL,
    email VARCHAR(254) NULL,
    web VARCHAR(500) NULL,
    currency_text VARCHAR(50) NULL,
    hint TEXT NULL,
    warranty_name VARCHAR(150) NULL,
    warranty_street VARCHAR(150) NULL,
    warranty_postcode VARCHAR(20) NULL,
    warranty_city VARCHAR(100) NULL,
    warranty_country CHAR(2) NULL,
    mail_sender_address VARCHAR(254) NULL,
    user_print_language VARCHAR(50) NULL,
    user_group VARCHAR(50) NOT NULL,
    date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX ea_esettings_user_group (user_group)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  const data = {
    name: 'EIGHTY-AID', name2: 'Markus Dellinger', street: 'Leistenstr. 3',
    postcode: '97082', city: 'Würzburg', country: 'DE', invoiceDateIsDeliveryDate: true,
    IBAN: 'DE62 7909 0000 0002 0977 96', BIC: 'GENODEF1WU1', tax_id: 'DE168254679',
    fon: '0931 22 33 44', fax: '0931 22 33 55', email: 'help@eighty-aid.com',
    web: 'http://www.eighty-aid.com', currency_text: 'Euro', hint: 'hint',
    warranty_name: 'Cycling Sports Group Europe B.V.', warranty_street: 'Leistenstr. 3',
    warranty_postcode: '97082', warranty_city: 'Würzburg', warranty_country: 'NL',
    mail_sender_address: 'help@eighty-aid.com', user_print_language: 'german', user_group: '88+DE',
  };
  const fields = Object.keys(data);
  const result = await connection.query(`INSERT INTO ef.ea_esettings (${fields.map(field => '`' + field + '`').join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`, Object.values(data));
  const rows = await connection.query('SELECT uid_esettings, name, user_group, date_created, date_updated FROM ef.ea_esettings WHERE uid_esettings = ?', [result.insertId]);
  console.log(JSON.stringify(rows, (_, value) => typeof value === 'bigint' ? String(value) : value, 2));
  console.log((await connection.query('SHOW CREATE TABLE ef.ea_esettings'))[0]['Create Table']);
} finally {
  await connection.end();
}
