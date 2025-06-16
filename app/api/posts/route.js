import { createConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(){
    try{
        const db = await createConnection()
        const sql = "SELECT * FROM movie_table"
        const [posts] = await db.query(sql)
        return NextResponse.json({posts:posts})
    } catch(error){
        console.log(error)
        return NextResponse.json({error: error.message})
    }
}