import { logger } from '@/lib/logger.js';
import { TObject, Static, TUnion } from 'typebox';
import { TLocalizedValidationError } from 'typebox/error';
import { Value } from 'typebox/value';

type RejectedObjectWithCause = { obj: unknown; error: TLocalizedValidationError[] }

export const rejectListElementByShema = <S extends TObject>(
   list: unknown[],
   schema: S | TUnion<S[]>,
): {
   validatedOject: Static<S>[],
   rejectedObjectWithCause: RejectedObjectWithCause[],
} => {
   type ShemaStatic = Static<S>

   const validatedOject: ShemaStatic[] = []
   const rejectedObjectWithCause: RejectedObjectWithCause[] = []

   for (const obj of list) {
      if (!Value.Check(schema, obj)) {
         const errors = [...Value.Errors(schema, obj)]
         rejectedObjectWithCause.push({ obj: obj, error: errors })
         logger.verbose(`obj rejected :`, obj)
         logger.verbose(`reason:`, errors)
      } else
         validatedOject.push(obj as ShemaStatic)
   }

   logger.verbose(`rejectListElementByShema called: ${validatedOject.length} accepted, ${rejectedObjectWithCause.length} rejected`)

   return { validatedOject, rejectedObjectWithCause }
}

