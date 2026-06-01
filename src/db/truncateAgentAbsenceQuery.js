import { db } from '../../../../utils/importKnex.js'

export const truncateAgentAbsenceQuery = () => {
   return db('agent_absence_period').truncate();
};
