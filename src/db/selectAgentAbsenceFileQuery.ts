import { db } from "@/utils/knexInstance.js";

export const selectAgentAbsenceFileQuery = () => {
   return db('agent_absence_file').select();
};

