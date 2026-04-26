import pg from 'pg'
import config from '@config'

const {
    HOST,
    PORT,
    USER,
    PASSWORD,
    DB
} = config.database

const { Pool } = pg
const pool = new Pool({
    host: HOST,
    port: Number(PORT),
    user: USER,
    password: PASSWORD,
    database: DB
})

export default async function run(query: string, params: (string | number | null)[]) {
    const con = await pool.connect()
    try {
        return await con.query(query, params)
    } finally {
        con.release()
    }
}