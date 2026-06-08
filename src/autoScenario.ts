import { insertAgentAbsenceFileQuery } from "@/db/insertAgentAbsenceFileQuery.js"
import { truncateAgentAbsenceFileQuery } from "@/db/truncateAgentAbsenceFileQuery.js"
import { errorToString } from "@/lib/errorToString.js"
import { logger } from "@/lib/logger.js"
import { removeColonPrefixFromXmlString } from "@/lib/removeColonPrefixFromXmlString.js"
import { rejectListElementByShema } from "@/services/rejectListElementByShema.js"
import { toAbsenceFileDto } from "@/type/AbsenceFile.dto.js"
import { AbsenceFileSchema } from "@/type/AbsenceFile.js"
import { getSoapAgentAbsenceRequestsList } from "./soap/getSoapAgentAbsenceRequestsList.js"
import { extractXmlElementsByTag } from "./services/extractXmlElementsByTag.js"
import { AbsenceRequest } from "./type/AbsenceRequest.js"

let xmlWithPrefix: string
let xml: string


try {
   xmlWithPrefix = await getSoapAgentAbsenceRequestsList()
} catch (error) {
   throw new Error(`failed to get Xml: ${errorToString(error)}`)
}

xml = removeColonPrefixFromXmlString(xmlWithPrefix)
console.log("xml")
console.log(xml)

const data = extractXmlElementsByTag(xml, 'AbsenceRequest')
if (data.length < 1)
   logger.warn('no absence files at all')

const { validatedOject, rejectedObjectWithCause } = rejectListElementByShema(data, AbsenceRequest)

console.log('validated')
console.dir(validatedOject)

if (rejectedObjectWithCause.length > 0) {
   logger.warn('rejectedObjectWithCause : ')
   rejectedObjectWithCause.map((o) => {
      logger.warn(o)
      logger.warn(o.error)
      logger.warn('---')
   })
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
