import { knex } from '../../../../utils/importKnex.js'

export const selectAgentAbsenceQuery = () => {
   return knex('agent_absence_period').select();
};

