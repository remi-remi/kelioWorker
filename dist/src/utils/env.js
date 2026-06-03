import dotenv from 'dotenv';
// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
// const EXEC_PATH = dirname(fileURLToPath(import.meta.url));
const ENVIRONMENT_PATH = `@/../.env`;
console.log(`reading ENVIRONMENT_PATH: ${ENVIRONMENT_PATH}`);
dotenv.config({ path: ENVIRONMENT_PATH });
// put env const required to run the API, it may be very usefull to recreate ENV by scratch more easily
const requiredEnvVars = [
    'DB_HOST',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'MYSQL_DATABASE',
    'SOAP_URL',
    'SOAP_USERNAME',
    'SOAP_PASSWORD',
    'BREVO_API_KEY',
    'MAINTAINER_EMAIL',
];
let allEnvVarsSet = true;
requiredEnvVars.forEach((envVar) => {
    // console.log(`envVar:${envVar}: ${process.env[envVar]}`)
    if (typeof process.env[envVar] === 'undefined' || process.env[envVar] === null) {
        console.error(`ERROR: Missing environment variable: ${envVar}`);
        allEnvVarsSet = false;
    }
});
console.log('all environment variable required in env.ts checked');
if (!allEnvVarsSet)
    process.exit(1);
// console.log('new Date() before force UTC-> ' + new Date());
process.env.TZ = 'UTC';
// console.log('process.env.TZ set to UTC');
// console.log('new Date() with UTC -> ' + new Date())
