import { Type, Static } from 'typebox'

export const AbsenceRequestShema = Type.Object({
   absenceRequestKey: Type.Number(),
   absenceTypeAbbreviation: Type.String(),
   absenceTypeDescription: Type.String(),
   absenceTypeKey: Type.Number(),
   comment: Type.Optional(Type.String()), // the Aberation 
   creationDate: Type.String({ format: 'date' }),
   durationInDays: Type.Number(),
   durationInHours: Type.Number(),
   endDate: Type.String({ format: 'date' }),
   startInTheMorning: Type.Boolean(),
   endingTheAfternoon: Type.Boolean(),
   lastModificationDate: Type.String({ pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(Z|[+-]\\d{2}:\\d{2})?$' }),
   splitHolidaysWaiver: Type.Number(),
   startDate: Type.String({ format: 'date' }),
   totalInDays: Type.Number(),
   totalInHours: Type.Number(),
   archivedEmployee: Type.Boolean(),
   employeeFirstName: Type.String(),
   employeeKey: Type.Number(),
   employeeSurname: Type.String(),
})

export type AbsenceRequest = Static<typeof AbsenceRequestShema>

