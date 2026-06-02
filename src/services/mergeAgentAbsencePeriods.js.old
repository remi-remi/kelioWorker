const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const shouldMergeCurrentHalfDay = (halfDay, mergingPeriod) => {
   if (mergingPeriod == undefined) {
      console.warn("mergingPeriod null, first iteration ?")
      return false
   }
   const isSameAgent = mergingPeriod.kelioId === halfDay.kelioId;
   const currentEndTimestamp = new Date(mergingPeriod.endDate).getTime();
   const halfDayTimestamp = new Date(halfDay.date).getTime();
   const isConsecutiveDay = halfDayTimestamp <= currentEndTimestamp + ONE_DAY_MS;

   return (isSameAgent && isConsecutiveDay)
}

const createNewAbsencePeriod = (halfDay) => ({
   kelioId: halfDay.kelioId,
   firstName: halfDay.firstName,
   lastName: halfDay.lastName,
   startDate: halfDay.date,
   endDate: halfDay.date,
   lastEndTime: halfDay.endTime,
   extractionDate: halfDay.extractionDate,
});

export const mergeAgentAbsencePeriods = (halfDaysAbsences) => {

   const halfDaysAbsencesSortedByAgentAndDate = [...halfDaysAbsences].sort((a, b) => { // potential service
      if (a.kelioId !== b.kelioId) return a.kelioId - b.kelioId;
      return a.date.localeCompare(b.date);
   });

   const mergedAbsencePeriods = [];
   let mergingPeriod = undefined;

   for (const halfDay of halfDaysAbsencesSortedByAgentAndDate) {

      if (!mergingPeriod || !shouldMergeCurrentHalfDay(halfDay, mergingPeriod)) {

         mergingPeriod = createNewAbsencePeriod(halfDay)
         mergedAbsencePeriods.push(mergingPeriod);

      } else {

         mergingPeriod.endDate = halfDay.date;
         mergingPeriod.lastEndTime = halfDay.endTime;

      }
   }

   return mergedAbsencePeriods;
};

