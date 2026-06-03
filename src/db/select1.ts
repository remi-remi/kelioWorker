import { db } from "@/utils/knexInstance";

export const select1 = () => {
   return db.raw('select 1');
};

