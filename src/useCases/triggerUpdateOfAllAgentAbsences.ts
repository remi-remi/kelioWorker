import { insertAgentAbsenceFileQuery } from "@/db/insertAgentAbsenceFileQuery.js"
import { truncateAgentAbsenceFileQuery } from "@/db/truncateAgentAbsenceFileQuery.js"
import { errorToString } from "@/lib/errorToString.js"
import { logger } from "@/lib/logger.js"
import { removeColonPrefixFromXmlString } from "@/lib/removeColonPrefixFromXmlString.js"
import { extractXmlElementsByTag } from "@/services/extractXmlElementsByTag.js"
import { rejectListElementByShema } from "@/services/rejectListElementByShema.js"
import { getSoapAgentAbsencePeriodsList } from "@/soap/getSoapAgentAbsencePeriodsList.js"
import { getSoapAgentAbsenceRequestsList } from "@/soap/getSoapAgentAbsenceRequestsList.js"
import { toAbsenceFileDto } from "@/type/AbsenceFile.dto.js"
import { AbsenceFileSchema } from "@/type/AbsenceFile.js"
import { AbsenceRequestShema } from "@/type/AbsenceRequest.js"
import Type from "typebox"

let xmlAbsenceWithPrefix: string
let xmlRequestWithPrefix: string
let absenceXml: string
let requestXml: string

export const triggerUpdateOfAllAgentAbsences = async () => {

   try {
      xmlAbsenceWithPrefix = await getSoapAgentAbsencePeriodsList()
      xmlRequestWithPrefix = await getSoapAgentAbsenceRequestsList()
   } catch (error) {
      throw new Error(`failed to get Xml error: ${errorToString(error)}`)
   }

   absenceXml = removeColonPrefixFromXmlString(xmlAbsenceWithPrefix)
   requestXml = removeColonPrefixFromXmlString(xmlRequestWithPrefix)

   const absenceData = extractXmlElementsByTag(absenceXml, 'AbsenceFile')
   if (absenceData.length < 1)
      logger.warn(`no absence files at all, absenceXml: ${absenceXml}`)

   const requestData = extractXmlElementsByTag(requestXml, 'AbsenceRequest')
   if (requestData.length < 1)
      logger.warn(`no request files at all, requestXml: ${requestXml}`)

   if (requestData.length < 1 && absenceData.length < 1) return;

   const absenceAndRequestData = [...absenceData, ...requestData]
   const {
      validatedOject: validAbsenceAndRequest,
      rejectedObjectWithCause: rejectedAbsenceAndRequestWithCause
   } = rejectListElementByShema(absenceAndRequestData, Type.Union([AbsenceFileSchema, AbsenceRequestShema]));

   if (rejectedAbsenceAndRequestWithCause.length > 0) {
      logger.warn('rejectedObjectWithCause : ')
      rejectedAbsenceAndRequestWithCause.map((o) => {
         logger.warn(o)
         logger.warn(o.error)
         logger.warn('---')
      })
   }

   const AbsenceAndRequestDto = validAbsenceAndRequest.map((o) => (toAbsenceFileDto(o)))

   logger.info(`absenceData (unsafe) ${absenceData.length}, requestData (unsafe) ${requestData.length},${AbsenceAndRequestDto.length} total`)


   try {
      await truncateAgentAbsenceFileQuery()
      await insertAgentAbsenceFileQuery(AbsenceAndRequestDto)
   } catch (e) {
      logger.error(`error during insert/truncate :`, e)
      throw new Error(`DB request failed, tryed to truncate then insert error: ${errorToString(e)}`)
   }

   for (const abs of AbsenceAndRequestDto) {
      logger.verbose(`${abs.lastName} ${abs.firstName} ${abs.pending == true ? 'WANT to be absent' : 'wont be here'} from ${abs.startDate} to ${abs.endDate}`)
   }
}
