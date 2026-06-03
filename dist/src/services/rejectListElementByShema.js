import { logger } from '@/lib/logger';
import { Value } from 'typebox/value';
export const rejectListElementByShema = (list, schema) => {
    const validatedOject = [];
    const rejectedObjectWithCause = [];
    for (const obj of list) {
        if (!Value.Check(schema, obj)) {
            const errors = [...Value.Errors(schema, obj)];
            rejectedObjectWithCause.push({ obj: obj, error: errors });
            logger.verbose(`obj rejected :`, obj);
            logger.verbose(`reason:`, errors);
        }
        else
            validatedOject.push(obj);
    }
    logger.verbose(`rejectListElementByShema called: ${validatedOject.length} accepted, ${rejectedObjectWithCause.length} rejected`);
    return { validatedOject, rejectedObjectWithCause };
};
