import { db } from "@/utils/knexInstance";
export const truncateAgentAbsenceFileQuery = () => {
    return db('agent_absence_file').truncate();
};
