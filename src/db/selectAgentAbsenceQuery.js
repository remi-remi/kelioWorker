import { db } from '../../../../utils/importKnex.js'

export const selectAgentAbsenceQuery = () => {
   return db('agent_absence_period').select();
};

