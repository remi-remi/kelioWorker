import fetch from "node-fetch";
import xml2js from "xml2js";

const SOAP_URL = process.env.SOAP_URL;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const OFFSET_RANGE = 90;

const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ech="http://echange.service.open.bodet.com">
   <soapenv:Header/>
   <soapenv:Body>
      <ech:exportAbsencePeriodsList>
         <ech:exportFilter>
            <ech:AskedAbsence>
               <ech:populationFilter>AMIE</ech:populationFilter>
               <ech:populationMode>0</ech:populationMode>
               <ech:limitedToAPeriod>false</ech:limitedToAPeriod>
               <ech:dateMode>1</ech:dateMode>
               <ech:startOffset>0</ech:startOffset>
               <ech:endOffset>${OFFSET_RANGE}</ech:endOffset>
            </ech:AskedAbsence>
         </ech:exportFilter>
      </ech:exportAbsencePeriodsList>
   </soapenv:Body>
</soapenv:Envelope>`;

/*
function logMemory(stage) {
   const used = process.memoryUsage();
   console.log(
      `${stage} -> RSS=${(used.rss / 1024 / 1024).toFixed(2)} MB, HeapUsed=${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`
   );
}

function fuseAbsences(entries) {
   // Sort by employee + date
   const sorted = [...entries].sort((a, b) => {
      if (a.kelioId !== b.kelioId) return a.kelioId - b.kelioId;
      return a.date.localeCompare(b.date);
   });

   const fused = [];
   let current = null;

   for (const e of sorted) {
      const key = e.kelioId;

      if (
         current &&
         current.kelioId === key &&
         new Date(e.date) <= new Date(current.endDate).getTime() + 24 * 3600 * 1000
      ) {
         // Extend the current period
         current.endDate = e.date;
         current.lastEndTime = e.endTime;
      } else {
         // Start a new period
         current = {
            kelioId: key,
            firstName: e.firstName,
            lastName: e.lastName,
            startDate: e.date,
            endDate: e.date,
            lastEndTime: e.endTime,
            extractionDate: e.extractionDate
         };
         fused.push(current);
      }
   }

   return fused;
}
*/
async function fetchAbsences() {
   try {
      console.time("SOAP request duration");
      const res = await fetch(SOAP_URL, {
         method: "POST",
         headers: {
            "Content-Type": "text/xml;charset=UTF-8",
            "Authorization": "Basic " + Buffer.from(`${USERNAME}:${PASSWORD}`).toString("base64"),
         },
         body: soapBody,
      });

      const xml = await res.text();
      console.timeEnd("SOAP request duration");

      logMemory("After XML fetch (string in memory)");

      // Parse XML into JS object
      console.time("XML parsing duration");
      const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });
      console.timeEnd("XML parsing duration");
      /*
            logMemory("After XML parsing (raw object in memory)");
      
            const periods =
               parsed["soap:Envelope"]?.["soap:Body"]?.["ns1:exportAbsencePeriodsListResponse"]?.["ns1:exportedAbsencePeriods"]?.["ns1:AbsencePeriod"] || [];
      
            const periodArray = Array.isArray(periods) ? periods : [periods];
            const extractionDate = new Date().toISOString();
      
            const simplified = periodArray.map(p => ({
               extractionDate,
               lastName: "XXX",
               firstName: p["ns1:employeeFirstName"],
               kelioId: parseInt(p["ns1:employeeKey"], 10),
               date: p["ns1:date"],
               startTime: p["ns1:startTime"],
               endTime: p["ns1:endTime"]
            }));
      
            logMemory("After JSON simplification");
      
            const fused = fuseAbsences(simplified);
      
            logMemory("After fusion to periods");
      
            console.log(`Total demi-days: ${simplified.length}, Total periods: ${fused.length}`);
            console.table(fused); // Show first 10 fused absences
            */
   } catch (err) {
      console.error("Error fetching absences:", err);
   }
}

fetchAbsences();


