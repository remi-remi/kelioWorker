import cron from 'node-cron'

import '@/utils/env.js'
import { errorToString } from './lib/errorToString.js'
import { sendMailToMaintainer } from './services/sendMailToMaintainer.js'
import { triggerUpdateOfAllAgentAbsences } from './useCases/triggerUpdateOfAllAgentAbsences.js'
import { logger } from './lib/logger.js'

const triggerUpdateOfAllAgentAbsencesHandler = () => {
   triggerUpdateOfAllAgentAbsences().catch((error) => {
      sendMailToMaintainer({
         subject: 'something failed running "triggerUpdateOfAllAgentAbsences"',
         content: `triggerUpdateOfAllAgentAbsences failed at ${Date.now()} ${errorToString(error)}`
      })
      logger.error(`triggerUpdateOfAllAgentAbsences failed:`, error)
   })
}

export const kelioPluginSheduler = () => {

   triggerUpdateOfAllAgentAbsencesHandler()

   console.log("node cron schedule now")
   cron.schedule('0 * * * *', () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      triggerUpdateOfAllAgentAbsencesHandler()
      console.log(`(k) > ${hours}:${minutes} triggerUpdateOfAllAgentAbsences() `);
   })

}

kelioPluginSheduler()

