import { db } from '../../../../utils/importKnex.js'

export const insertAgentAbsenceQuery = (data) => {
   const formattedData = Array.isArray(data) ? data : [data];

   return db('agent_absence_period').insert(formattedData);
};

