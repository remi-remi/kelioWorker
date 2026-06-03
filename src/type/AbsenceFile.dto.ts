import { Type, Static } from 'typebox'
import { AbsenceFile } from './AbsenceFile.js'

export const AbsenceFileDtoSchema = Type.Object({
   id: Type.Number(),
   absenceTypeAbbreviation: Type.String(),
   creationDate: Type.String({ format: 'date' }),
   endDate: Type.String({ format: 'date' }),
   startInTheMorning: Type.Boolean(),
   endingTheAfternoon: Type.Boolean(),
   existRelatedDocument: Type.Boolean(),
   startDate: Type.String({ format: 'date' }),
   totalInDays: Type.Optional(Type.Number()),
   totalInHours: Type.Optional(Type.Number()), // may get his use later, to know if this absence is significent 
   employeeFirstName: Type.String(),
   employeeSurname: Type.String(),
   employeeKey: Type.Number(),
})

export type AbsenceFileDto = Static<typeof AbsenceFileDtoSchema>

export const toAbsenceFileDto = (absenceFile: AbsenceFile): AbsenceFileDto => ({
   id: absenceFile.absenceFileKey,
   absenceTypeAbbreviation: absenceFile.absenceTypeAbbreviation,
   creationDate: absenceFile.creationDate,
   endDate: absenceFile.endDate,
   startInTheMorning: absenceFile.startInTheMorning,
   endingTheAfternoon: absenceFile.endingTheAfternoon,
   existRelatedDocument: absenceFile.existRelatedDocument,
   startDate: absenceFile.startDate,
   totalInDays: absenceFile.totalInDays,
   totalInHours: absenceFile.totalInHours,
   employeeFirstName: absenceFile.employeeFirstName,
   employeeSurname: absenceFile.employeeSurname,
   employeeKey: absenceFile.employeeKey,
})
