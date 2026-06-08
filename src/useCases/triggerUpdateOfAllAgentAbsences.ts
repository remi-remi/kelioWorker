import { insertAgentAbsenceFileQuery } from "@/db/insertAgentAbsenceFileQuery.js"
import { truncateAgentAbsenceFileQuery } from "@/db/truncateAgentAbsenceFileQuery.js"
import { errorToString } from "@/lib/errorToString.js"
import { logger } from "@/lib/logger.js"
import { removeColonPrefixFromXmlString } from "@/lib/removeColonPrefixFromXmlString.js"
import { extractXmlElementsByTag } from "@/services/extractXmlElementsByTag.js"
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

   xml = removeColonPrefixFromXmlString(xmlWithPrefix)

   const data = extractXmlElementsByTag(xml, 'AbsenceFile')
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

   logger.info(`${validatedOject.length} requétes`)

   try {
      // await truncateAgentAbsenceFileQuery()
      // await insertAgentAbsenceFileQuery(validatedObjectListDto)
   } catch (e) {
      logger.error(`error during insert/truncate :`, e)
      throw new Error(`DB request failed, tryed to truncate then insert error: ${errorToString(e)}`)
   }

   for (const abs of validatedObjectListDto)
      logger.verbose(`${abs.lastName} ${abs.firstName} est absent du ${abs.startDate} au ${abs.endDate}`)
}
