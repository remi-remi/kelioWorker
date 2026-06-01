import path from "path"
import '@/utils/env'

console.log('\nknex config from .env :');
console.log(`  address: ${process.env.DB_HOST}`, `\n  db username : ${process.env.MYSQL_USER}`, `\n  db name : ${process.env.MYSQL_DATABASE}`);
const passwordLength = process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD.length : 0;
console.log(`  db password length: ${passwordLength} characters`);


const baseConfig = {
   client: 'mysql',
   connection: {
      host: process.env.DB_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
   },
};

export default {
   development: baseConfig,
   production: baseConfig,
};

console.log('knex configuration exported\n')

