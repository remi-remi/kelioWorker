import { configDotenv } from 'dotenv';
import { triggerUpdateOfAllAgentAbsences } from './useCases/triggerUpdateOfAllAgentAbsences.js';
configDotenv({ path: '../ENVIRONMENT/.env.kelioWorker' });
console.log("LAUNCH -----------------------------------------------------------------------------------------------------------------------");
console.log(` SOAP_URL: ${process.env.SOAP_URL}`);
await triggerUpdateOfAllAgentAbsences();
