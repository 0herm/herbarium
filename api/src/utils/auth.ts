import config from '#constants'
import { betterAuth } from 'better-auth'
import pg from 'pg'

const { Pool } = pg

export const auth = betterAuth({
    database: new Pool({
        host: config.DB_HOST,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB
    }),
    emailAndPassword: { 
        enabled: true,
        requireEmailVerification: false,
    },
    baseURL: config.AUTH_URL,
    secret: config.AUTH_SECRET,
})
