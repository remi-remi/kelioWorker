import cron from 'node-cron'
import { configDotenv } from 'dotenv'

import { triggerUpdateOfAllAgentAbsences } from './src/useCases/triggerUpdateOfAllAgentAbsences.js'

configDotenv({ path: './.env' })

export const kelioPluginSheduler = async () => {

   console.log("node cron schedule now")
   cron.schedule('0 * * * *', () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      console.log(`(k) > ${hours}:${minutes} triggerUpdateOfAllAgentAbsences() `);
      triggerUpdateOfAllAgentAbsences()
   })

}
kelioPluginSheduler()

