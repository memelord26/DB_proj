import mysql from "mysql2/promise"

let celebConnection;
export const createCelebConnection = async () => {
    if (!celebConnection){
        celebConnection = await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER, 
            password: process.env.DATABASE_PASSWORD,
            database: process.env.CELEBS_DB,
        })
    }
    return celebConnection;
}

let usersConnection;
export const createUsersConnection = async () => {
    if (!usersConnection){
        usersConnection = await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER, 
            password: process.env.DATABASE_PASSWORD,
            database: process.env.USERS_DB,
        })
    }
    return usersConnection;
}
