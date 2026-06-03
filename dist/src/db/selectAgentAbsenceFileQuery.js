import { db } from "@/utils/knexInstance";
export const selectAgentAbsenceFileQuery = () => {
    return db('agent_absence_file').select();
};
