import 'dotenv/config';
import {writeFile} from 'node:fs/promises';
const url=new URL(process.env.DATABASE_URL);
Object.assign(process.env,{DB_HOST:url.hostname,DB_PORT:url.port||'3306',DB_USER:decodeURIComponent(url.username),DB_PASSWORD:decodeURIComponent(url.password),DB_NAME:url.pathname.slice(1)});
const base='/Users/go/nextjs/templates';
const {database}=await import(`${base}/dist/db/db.js`);
try {
 const [orders]=await database.query('SELECT uid_order, invoice_no, invoice_date, user_group FROM ea_orders WHERE invoice_no IN (88106,88177)');
 const [estimates]=await database.query('SELECT c.uid_costestimates, c.costestimate_no, c.uid_order,o.user_group FROM ea_orders_costestimates c JOIN ea_orders o ON o.uid_order=c.uid_order WHERE costestimate_no IN (57776,57779,57781)');
 const [warranties]=await database.query('SELECT uid_order,warranty_no,warranty_date,user_group FROM ea_warranty WHERE warranty_no=86071');
 console.log(JSON.stringify({orders,estimates,warranties}));
 if(process.argv.includes('--map-only')) process.exitCode=0;
 else {
 const {DocumentService}=await import(`${base}/dist/documents/service.js`);
 const {invoiceProvider}=await import(`${base}/dist/documents/invoice.js`);
 const {costestimateProvider}=await import(`${base}/dist/documents/costestimate.js`);
 const {warrantyProvider}=await import(`${base}/dist/documents/warranty.js`);
 const service=new DocumentService([invoiceProvider(`${base}/json/forms`),costestimateProvider(`${base}/json/forms`),warrantyProvider(`${base}/json/forms`)],`${base}/json`);
 const jobs=[...orders.map(r=>({type:'invoice',id:r.uid_order,no:r.invoice_no,group:r.user_group,date:r.invoice_date})),...estimates.map(r=>({type:'costestimate',id:r.uid_costestimates,no:r.costestimate_no,group:r.user_group})),...warranties.map(r=>({type:'warranty',id:r.uid_order,no:r.warranty_no,group:r.user_group,date:r.warranty_date}))];
 const results=[];
 for(const job of jobs){
  try{
   if(job.type!=='costestimate'&&(!job.date||new Date(job.date).getFullYear()<=1970)) throw Error('Datum fehlt: Erzeugung würde Datensatz verändern.');
   const docs=await service.generate({type:job.type,id:job.id,userGroup:job.group,language:'german',variant:'standard',copy:true,versions:['copy']});
   const path=`output/pdf/${job.type}_${job.no}_copy.pdf`;
   await writeFile(path,docs[0].content); results.push({...job,path});console.log('GENERATED',path);
  }catch(e){results.push({...job,error:e.message});console.log('ERROR',job.type,job.no,e.message);}
 }
 await writeFile('tmp/pdfs/generated.json',JSON.stringify(results,null,2));
 }
} finally {await database.end();}
