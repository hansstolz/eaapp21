import 'dotenv/config';
import mariadb from 'mariadb';
import fs from 'node:fs';
const u = new URL(process.env.DATABASE_URL);
const db = u.pathname.slice(1);
const c = await mariadb.createConnection({host:u.hostname,port:Number(u.port||3306),user:decodeURIComponent(u.username),password:decodeURIComponent(u.password),database:db});
const save = (name, value) => fs.writeFileSync(`output/ea-orders-audit/${name}.json`, JSON.stringify(value, (_,v)=>typeof v==='bigint'?String(v):v,2));
try {
 const meta = {};
 const queries = {
 columns: "SELECT COLUMN_NAME,COLUMN_TYPE,COLUMN_DEFAULT,IS_NULLABLE,EXTRA FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME='ea_orders' ORDER BY ORDINAL_POSITION",
 views: 'SELECT TABLE_NAME,VIEW_DEFINITION FROM information_schema.VIEWS WHERE TABLE_SCHEMA=?',
 triggers: 'SELECT TRIGGER_NAME,EVENT_OBJECT_TABLE,ACTION_STATEMENT FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA=?',
 routines: 'SELECT ROUTINE_NAME,ROUTINE_TYPE,ROUTINE_DEFINITION FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA=?',
 events: 'SELECT EVENT_NAME,EVENT_DEFINITION FROM information_schema.EVENTS WHERE EVENT_SCHEMA=?',
 foreignKeys: "SELECT TABLE_NAME,COLUMN_NAME,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA=? AND (TABLE_NAME='ea_orders' OR REFERENCED_TABLE_NAME='ea_orders')",
 size: "SELECT TABLE_ROWS,DATA_LENGTH,INDEX_LENGTH FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME='ea_orders'"
 };
 for(const [name,sql] of Object.entries(queries)) meta[name]=await c.query(sql,[db]);
 save('database-metadata',meta);
 const fields=meta.columns.map(x=>x.COLUMN_NAME);
 const expressions=fields.map((f,i)=>`SUM(CASE WHEN \`${f}\` IS NOT NULL AND TRIM(CAST(\`${f}\` AS CHAR)) NOT IN ('','0','0.00','0000-00-00 00:00:00') THEN 1 ELSE 0 END) AS f${i}`);
 const [row]=await c.query(`SELECT COUNT(*) AS total, ${expressions.join(',')} FROM ea_orders`);
 save('population',{rows:row.total,fields:Object.fromEntries(fields.map((f,i)=>[f,row[`f${i}`]]))});
 console.log(JSON.stringify({objects:Object.fromEntries(Object.entries(meta).map(([k,v])=>[k,v.length])),rows:String(row.total),size:meta.size},(_,v)=>typeof v==='bigint'?String(v):v));
} finally { await c.end(); }
