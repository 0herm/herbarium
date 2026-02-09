import dotenv from 'dotenv'

dotenv.config({path: '../.env'})

const requiredEnvironmentVariables = [
    'POSTGRES_DB',
    'POSTGRES_USER',
    'POSTGRES_HOST_PROD',
    'POSTGRES_PASSWORD',
    'AUTH_SECRET',
    'AUTH_URL'
]

const missingVariables = requiredEnvironmentVariables.filter(
    (key) => !process.env[key]
)

if (missingVariables.length > 0) {
    throw new Error(
        'Missing essential environment variables:\n' +
            missingVariables
                .map((key) => `${key}: ${process.env[key] || 'undefined'}`)
                .join('\n')
    )
}

const env = Object.fromEntries(
    requiredEnvironmentVariables.map((key) => [key, process.env[key]])
)

const config = {
    DB: env.POSTGRES_DB,
    DB_USER: env.POSTGRES_USER,
    DB_HOST: env.POSTGRES_HOST_PROD,
    DB_PASSWORD: env.POSTGRES_PASSWORD,
    DB_PORT: Number(process.env.DB_PORT) || 5432,
    DB_MAX_CONN: 20,
    DB_IDLE_TIMEOUT_MS: 5000,
    DB_TIMEOUT_MS: 3000,
    CACHE_TTL: 1000,
    AUTH_SECRET: env.AUTH_SECRET,
    AUTH_URL: env.AUTH_URL
}

export default config
