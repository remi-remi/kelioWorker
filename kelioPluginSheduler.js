import cron from 'node-cron'
import { configDotenv } from 'dotenv'

import { triggerUpdateOfAllAgentAbsences } from './src/useCases/triggerUpdateOfAllAgentAbsences.js'

configDotenv({ path: './.env' })

export const kelioPluginSheduler = async () => {

   cron.schedule('0 */1 * * *', () => {
      console.log('(K) CRON RELAUNCH (1 hour)')
      triggerUpdateOfAllAgentAbsences()
   })

}

