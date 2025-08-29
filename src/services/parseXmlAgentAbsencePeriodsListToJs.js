import xml2js from "xml2js";

import formatUtcDateToSqlDate from '../../../../utils/formatUtcDateToSqlDate.js'

/**
* Parses raw SOAP XML from Kelio into a cleaned JS object format
* keeping only the relevant fields: date, startTime, endTime, kelioId, etc.
*
* @param {string} xml - The raw SOAP XML string from Kelio
* @returns {Promise<Array<Object>>} Cleaned absence periods
*/
export async function parseXmlAgentAbsencePeriodsListToJs(xml) {
   const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });


   const periods =
      parsed["soap:Envelope"]?.["soap:Body"]?.["ns1:exportAbsencePeriodsListResponse"]?.["ns1:exportedAbsencePeriods"]?.["ns1:AbsencePeriod"] || [];

   const periodArray = Array.isArray(periods) ? periods : [periods];
   const extractionDate = formatUtcDateToSqlDate(new Date().toISOString())

   return periodArray.map((p) => ({
      extractionDate,
      lastName: p["ns1:employeeSurname"],
      firstName: p["ns1:employeeFirstName"],
      kelioId: parseInt(p["ns1:employeeKey"], 10),
      date: p["ns1:date"],
      startTime: p["ns1:startTime"],
      endTime: p["ns1:endTime"],
   }));
}
