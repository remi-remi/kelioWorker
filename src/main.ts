import cron from 'node-cron'

import '@/utils/env.js'
import { errorToString } from './lib/errorToString.js'
import { sendMailToMaintainer } from './services/sendMailToMaintainer.js'
import { triggerUpdateOfAllAgentAbsences } from './useCases/triggerUpdateOfAllAgentAbsences.js'

const triggerUpdateOfAllAgentAbsencesHandler = async () => { // feel stupid
   try {
      await triggerUpdateOfAllAgentAbsences()
   } catch (error) {
      sendMailToMaintainer({ subject: 'test', content: `triggerUpdateOfAllAgentAbsences failed at ${Date.now()} ${errorToString(error)}` })
   }
}

export const kelioPluginSheduler = async () => {

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

