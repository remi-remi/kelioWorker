import { db } from "@/utils/knexInstance";
import humps from "humps";
export const insertAgentAbsenceFileQuery = (camelData) => {
    let data = humps.decamelizeKeys(camelData);
    return db('agent_absence_file').insert(data);
};
