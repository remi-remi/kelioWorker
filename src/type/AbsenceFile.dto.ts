import { Type, Static } from 'typebox'
import { AbsenceFile } from './AbsenceFile.js'
import { decode } from "html-entities"
import type { AbsenceRequest } from './AbsenceRequest.js'
import { removeAccents } from '@/lib/removeAccents.js'

export const AbsenceFileDtoSchema = Type.Object({
   originalId: Type.Number(),
   pending: Type.Boolean(),
   absenceTypeAbbreviation: Type.String(),
   creationDate: Type.String({ format: 'date' }),
   endDate: Type.String({ format: 'date' }),
   startInTheMorning: Type.Boolean(),
   endingTheAfternoon: Type.Boolean(),
   existRelatedDocument: Type.Boolean(),
   startDate: Type.String({ format: 'date' }),
   totalInDays: Type.Optional(Type.Number()),
   totalInHours: Type.Optional(Type.Number()), // may get his use later, to know if this absence is significent 
   firstName: Type.String(),
   lastName: Type.String(),
   employeeKey: Type.Number(),
})

export type AbsenceFileDto = Static<typeof AbsenceFileDtoSchema>

export const toAbsenceFileDto = (absence: AbsenceRequest | AbsenceFile): AbsenceFileDto => ({
   originalId: 'absenceRequestKey' in absence ? absence.absenceRequestKey : absence.absenceFileKey,
   pending: 'absenceRequestKey' in absence ? true : false,
   absenceTypeAbbreviation: absence.absenceTypeAbbreviation,
   creationDate: absence.creationDate,
   endDate: absence.endDate,
   startInTheMorning: absence.startInTheMorning,
   endingTheAfternoon: absence.endingTheAfternoon,
   existRelatedDocument: 'existRelatedDocument' in absence ? absence.existRelatedDocument : false,
   startDate: absence.startDate,
   totalInDays: absence.totalInDays,
   totalInHours: absence.totalInHours,
   firstName: removeAccents(decode(absence.employeeFirstName)),
   lastName: removeAccents(decode(absence.employeeSurname)),
   employeeKey: absence.employeeKey,
})

