import { knex } from '../../../../utils/importKnex.js'

export const truncateAgentAbsenceQuery = () => {
   return knex('agent_absence_period').truncate();
};
