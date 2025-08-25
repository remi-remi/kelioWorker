import { configDotenv } from 'dotenv'

import { getSoapAgentAbsencePeriodsList_SIM } from './src/soap/getSoapAgentAbsencePeriodsList.js'
import { parseXmlAgentAbsencePeriodsListToJs } from './src/services/parseXmlAgentAbsencePeriodsListToJs.js'

configDotenv({ path: './.env' })

console.log(` SOAP_URL: ${process.env.SOAP_URL}`)

getSoapAgentAbsencePeriodsList_SIM().then((xmlPeriodsList) => {
   parseXmlAgentAbsencePeriodsListToJs(xmlPeriodsList).then((parsedOject) => {
      console.table(parsedOject)
   })
})
