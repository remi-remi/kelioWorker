import { configDotenv } from 'dotenv'

configDotenv({ path: './.env' })

import { getSoapAgentAbsencePeriodsList } from './src/soap/getSoapAgentAbsencePeriodsList.js'
import { parseXmlAgentAbsencePeriodsListToJs } from './src/services/parseXmlAgentAbsencePeriodsListToJs.js'
import { mergeAgentAbsencePeriods } from './src/services/mergeAgentAbsencePeriods.js'
import { kelioPluginSheduler } from './kelioPluginSheduler.js'
import { getSoapAbsenceFileList_sim } from './src/soap/getSoapAbsenceFileList_sim.js'

console.log("LAUNCH -----------------------------------------------------------------------------------------------------------------------")

console.log(` SOAP_URL: ${process.env.SOAP_URL}`)

// const xml = getSoapAbsenceFileList_sim()
const xml = await getSoapAgentAbsencePeriodsList()
const cleanXml = xml.replace(/(<\/?)\w+:(\w+[^>]*>)/g, "$1$2")

// console.dir(cleanXml)

function xmlToObj(xml) {
   const periods = []

   const periodRegex = /<AbsenceFile>([\s\S]*?)<\/AbsenceFile>/g
   let periodMatch

   while ((periodMatch = periodRegex.exec(xml)) !== null) {
      const periodContent = periodMatch[1]
      const period = {}

      const tagRegex = /<(\w+)(?:\s[^>]*)?>([^<]*)<\/\1>/g
      let tagMatch

      while ((tagMatch = tagRegex.exec(periodContent)) !== null) {
         const key = tagMatch[1]
         const value = tagMatch[2].trim()

         // boolean conversion
         if (value === 'true' || value === 'false')
            period[key] = value === 'true'
         else if (value && !isNaN(value))
            period[key] = Number(value)
         else if (value === '')
            period[key] = null
         else
            period[key] = value
      }

      periods.push(period)
   }

   return periods

}

const data = xmlToObj(cleanXml)
console.dir(data)

const testSubject = (data.filter((o) => {
   if (o.employeeKey != 621) return false

   delete o.employeeFirstName
   delete o.employeeSurname
   delete o.comment

   return true
}))



console.dir(testSubject)

// const autoScenarioReloadNow = () => {
//    getSoapAgentAbsencePeriodsList_SIM().then((xmlPeriodsList) => {
//       parseXmlAgentAbsencePeriodsListToJs(xmlPeriodsList).then((parsedOject) => {
//          //console.log(`parsedOject:`)
//          console.log("490 --- parsed")
//          console.table(parsedOject)
//          const mergedAbense = mergeAgentAbsencePeriods(parsedOject)
//          console.log("490 --- merged")
//          console.table(mergedAbense)
//       })
//    })
// }
//
// const autoScenarioUseSheduler = () => {
//    kelioPluginSheduler()
// }
// autoScenarioUseSheduler() 
