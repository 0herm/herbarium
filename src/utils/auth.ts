import config from '@config'
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const {
    HOST,
    PORT,
    USER,
    PASSWORD,
    DB,
} = config.database

const {
    AUTH_URL
} = config.auth

export const auth = betterAuth({
    database: new Pool({
        host: HOST,
        port: Number(PORT),
        user: USER,
        password: PASSWORD,
        database: DB
    }),
    emailAndPassword: { 
        enabled: true,
        requireEmailVerification: false,
    },
    baseURL: AUTH_URL,
    trustedOrigins: [AUTH_URL],
    secret: config.auth.AUTH_SECRET,
    telemetry: { enabled: config.auth.AUTH_TELEMETRY },
})