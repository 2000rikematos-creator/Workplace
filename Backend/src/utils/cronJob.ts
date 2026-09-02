import pool from "./db.js";

export async function deleteOldData(){
    const sevenDaysAgo = Date.now()-(7*24*60*60*1000)
    try{
         await pool.query("DELETE from finished_tasks WHERE time_end < $1",[sevenDaysAgo])
    }catch(error){
        if(error instanceof Error){
            console.log("Error deleting old data",error.message)
        }
    }
}
