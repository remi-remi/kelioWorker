import humps from "humps";

import { insertAgentAbsenceQuery } from "../db/insertAgentAbsenceQuery.js";
import { truncateAgentAbsenceQuery } from "../db/truncateAgentAbsenceQuery.js";
import { mergeAgentAbsencePeriods } from "../services/mergeAgentAbsencePeriods.js";
import { parseXmlAgentAbsencePeriodsListToJs } from "../services/parseXmlAgentAbsencePeriodsListToJs.js";
import { getSoapAgentAbsencePeriodsList } from "../soap/getSoapAgentAbsencePeriodsList.js";

export const triggerUpdateOfAllAgentAbsences = async () => {
   console.log("(k) triggerUpdateOfAllAgentAbsences");
   console.time("(k) triggerUpdateOfAllAgentAbsences took");

   const soapAgentAbsencePeriods = await getSoapAgentAbsencePeriodsList();
   const parsedAgentAbsencePeriods = await parseXmlAgentAbsencePeriodsListToJs(soapAgentAbsencePeriods);
   const mergedAgentAbsencePeriods = mergeAgentAbsencePeriods(parsedAgentAbsencePeriods);
   await truncateAgentAbsenceQuery();
   await insertAgentAbsenceQuery(humps.decamelizeKeys(mergedAgentAbsencePeriods));

   console.timeEnd("(k) triggerUpdateOfAllAgentAbsences took");
   console.log(`(k) triggerUpdateOfAllAgentAbsences : ${mergedAgentAbsencePeriods.length} absences`);
};
