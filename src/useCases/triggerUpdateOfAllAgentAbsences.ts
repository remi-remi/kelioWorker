import { insertAgentAbsenceFileQuery } from "@/db/insertAgentAbsenceFileQuery.js"
import { truncateAgentAbsenceFileQuery } from "@/db/truncateAgentAbsenceFileQuery.js"
import { errorToString } from "@/lib/errorToString.js"
import { logger } from "@/lib/logger.js"
import { removeColonPrefixFromXmlString } from "@/lib/removeColonPrefixFromXmlString.js"
import { parseAbsenceFileFromXml } from "@/services/parseAbsenceFileFromXml.js"
import { rejectListElementByShema } from "@/services/rejectListElementByShema.js"
import { getSoapAgentAbsencePeriodsList } from "@/soap/getSoapAgentAbsencePeriodsList.js"
import { toAbsenceFileDto } from "@/type/AbsenceFile.dto.js"
import { AbsenceFileSchema } from "@/type/AbsenceFile.js"

let xmlWithPrefix: string
let xml: string

export const triggerUpdateOfAllAgentAbsences = async () => {

   try {
      xmlWithPrefix = await getSoapAgentAbsencePeriodsList()
   } catch (error) {
      throw new Error(`failed to get Xml: ${errorToString(error)}`)
   }

   console.log(xmlWithPrefix)
   xml = removeColonPrefixFromXmlString(xmlWithPrefix)
   console.log(xml)
   const data = parseAbsenceFileFromXml(xml)
   if (data.length < 1)
      logger.warn('no absence files at all')

   const { validatedOject, rejectedObjectWithCause } = rejectListElementByShema(data, AbsenceFileSchema)


   if (rejectedObjectWithCause.length > 0) {
      logger.warn('rejectedObjectWithCause : ')
      logger.warn(rejectedObjectWithCause)
   }

   logger.debug('validatedOject: ')
   logger.debug(validatedOject)

   const validatedObjectListDto = validatedOject.map((o) => (toAbsenceFileDto(o)))

   try {
      await truncateAgentAbsenceFileQuery()
      await insertAgentAbsenceFileQuery(validatedObjectListDto)
   } catch (e) {
      throw new Error(`DB request failed, tryed to truncate then insert e: ${errorToString(e)}`)
   }

   for (const abs of validatedOject)
      logger.verbose(`${abs.employeeSurname} ${abs.employeeFirstName} est absent du ${abs.startDate} au ${abs.endDate}`)
}
