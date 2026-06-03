import cron from 'node-cron'
import { triggerUpdateOfAllAgentAbsences } from './useCases/triggerUpdateOfAllAgentAbsences'
import { sendMailToMaintainer } from './services/sendMailToMaintainer'
import { errorToString } from './lib/errorToString'

import '@/utils/env'

const triggerUpdateOfAllAgentAbsencesHandler = async () => { // feel stupid
   try {
      await triggerUpdateOfAllAgentAbsences()
   } catch (error) {
      sendMailToMaintainer({ subject: 'test', content: `triggerUpdateOfAllAgentAbsences failed at ${Date.now()} ${errorToString(error)}` })
   }
}

export const kelioPluginSheduler = async () => {

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

