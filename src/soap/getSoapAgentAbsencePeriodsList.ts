import { logger } from "@/lib/logger.js";
import fetch from "node-fetch";

const OFFSET_RANGE = 60;

const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ech="http://echange.service.open.bodet.com">
   <soapenv:Header/>
   <soapenv:Body>
      <ech:exportAbsenceFilesList>
         <ech:exportFilter>
            <ech:AskedAbsence>
               <ech:populationMode>0</ech:populationMode>
               <ech:limitedToAPeriod>false</ech:limitedToAPeriod>
               <ech:dateMode>1</ech:dateMode>
               <ech:startOffset>0</ech:startOffset>
               <ech:endOffset>${OFFSET_RANGE}</ech:endOffset>
            </ech:AskedAbsence>
         </ech:exportFilter>
      </ech:exportAbsenceFilesList>
   </soapenv:Body>
</soapenv:Envelope>`;

export const getSoapAgentAbsencePeriodsList = async function () {
   console.time("SOAP request duration");
   logger.debug(`launch soap on :${process.env.SOAP_URL}`);
   const res = await fetch(process.env.SOAP_URL!, {
      method: "POST",
      headers: {
         "Content-Type": "text/xml;charset=UTF-8",
         "Authorization": "Basic " + Buffer.from(`${process.env.SOAP_USERNAME}:${process.env.SOAP_PASSWORD}`).toString("base64"),
      },
      body: soapBody,
   });

   const xml = await res.text();
   console.timeEnd("SOAP request duration");

   const faultMatch = xml.match(/<faultstring>(.*?)<\/faultstring>/);
   if (faultMatch)
      throw new Error(`kelio error response: ${faultMatch[1]}`);

   if (!xml.includes('</ns1:exportedAbsenceFiles>'))
      throw new Error('kelio responded with wrong format, missing "</ns1:exportedAbsenceFiles>"');

   return (xml)
}
