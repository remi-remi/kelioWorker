import { configDotenv } from 'dotenv'

configDotenv({ path: './.env' })

import { getSoapAgentAbsencePeriodsList_SIM, getSoapAgentAbsencePeriodsList } from './src/soap/getSoapAgentAbsencePeriodsList.js'
import { parseXmlAgentAbsencePeriodsListToJs } from './src/services/parseXmlAgentAbsencePeriodsListToJs.js'
import { mergeAgentAbsencePeriods } from './src/services/mergeAgentAbsencePeriods.js'

console.log("LAUNCH 490 ------------------------------------------------------------------------------------------------------------------------")

console.log(` SOAP_URL: ${process.env.SOAP_URL}`)

export const autoScenario = () => {
   getSoapAgentAbsencePeriodsList_SIM().then((xmlPeriodsList) => {
      parseXmlAgentAbsencePeriodsListToJs(xmlPeriodsList).then((parsedOject) => {
         //console.log(`parsedOject:`)
         console.log("490 --- parsed")
         console.table(parsedOject)
         const mergedAbense = mergeAgentAbsencePeriods(parsedOject)
         console.log("490 --- merged")
         console.table(mergedAbense)
      })
   })
}
