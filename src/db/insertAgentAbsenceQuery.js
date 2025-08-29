import { knex } from '../../../../utils/importKnex.js'

export const insertAgentAbsenceQuery = (data) => {
   const formattedData = Array.isArray(data) ? data : [data];

   return knex('agent_absence_period').insert(formattedData);
};

