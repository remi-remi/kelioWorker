import { db } from "@/utils/knexInstance.js";

export const select1 = () => {
   return db.raw('select 1');
};

