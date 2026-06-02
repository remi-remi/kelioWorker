import { configDotenv } from 'dotenv'

configDotenv({ path: '../ENVIRONMENT/.env.kelioWorker' })

import { getSoapAgentAbsencePeriodsList } from '@/soap/getSoapAgentAbsencePeriodsList.js'
import { rejectListElementByShema } from './services/rejectListElementByShema'
import { AbsenceFileSchema } from './type/AbsenceFile'
import { logger } from './lib/logger'
import { parseAbsenceFileFromXml } from './services/parseAbsenceFileFromXml'

console.log("LAUNCH -----------------------------------------------------------------------------------------------------------------------")

console.log(` SOAP_URL: ${process.env.SOAP_URL}`)

let xml: string
try {
   xml = await getSoapAgentAbsencePeriodsList()
} catch (error) {
   process.exit(1)
}

const removeColonPrefixFromXmlString = (xml: string) => xml.replace(/(<\/?)[^:>]+:/g, "$1")

const data = parseAbsenceFileFromXml(
   removeColonPrefixFromXmlString(xml)
)

const { validatedOject, rejectedObjectWithCause } = rejectListElementByShema(data, AbsenceFileSchema)
console.log('rejectedObjectWithCause : ')
console.dir(rejectedObjectWithCause)

const testSubject = (validatedOject.filter((o) => {
   if (o.employeeKey != 621)
      return false
   return true
}))

console.dir(testSubject)

for (const abs of testSubject)
   logger.info(`${abs.employeeSurname} ${abs.employeeFirstName} est absent du ${abs.startDate} au ${abs.endDate}`)
