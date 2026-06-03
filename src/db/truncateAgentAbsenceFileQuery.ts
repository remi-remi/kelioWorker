import { db } from "@/utils/knexInstance.js";

export const truncateAgentAbsenceFileQuery = () => {
   return db('agent_absence_file').truncate();
};
