'use server'

import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import config from '@config'

const execAsync = promisify(exec)
const backupFilePath = path.join(process.cwd(), 'db/backup.sql')


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function importBackup(prevState: FormStateImport, formData: FormData): Promise<FormStateImport> {
    try {        
        if (!await fileExists()) {
            return {
                error: 'Backup file not found. Please ensure backup.sql exists in the /db directory.',
                success: false
            }
        }

        const { HOST, PORT, USER, PASSWORD, DB } = config.database

        const psqlClear   = `psql -h ${HOST} -p ${PORT} -U ${USER} ${DB} -c "TRUNCATE TABLE recipes"`
        const psqlCommand = `psql -h ${HOST} -p ${PORT} -U ${USER} ${DB} < "${backupFilePath}"`
        
        const env = {
            ...process.env,
            PGPASSWORD: PASSWORD
        }

        await execAsync(psqlClear, { env })

        const { stderr } = await execAsync(psqlCommand, { env })

        if (stderr && stderr.trim()) {
            return {
                error: `Database import failed: ${stderr.trim()}`,
                success: false
            }
        }

        return {
            success: true
        }
    } catch {
        return {
            error: 'An unexpected error occurred during import.',
            success: false
        }
    }
}

export async function fileExists() {
    try {
        await fs.promises.access(backupFilePath, fs.constants.F_OK)
        return true
    } catch {
        return false
    }
}

export async function exportBackup(): Promise<{ error?: string; success?: boolean; data?: Buffer }> {
    try {
        const { HOST, PORT, USER, PASSWORD, DB } = config.database
        
        const command = `pg_dump -h ${HOST} -p ${PORT} -U ${USER} -d ${DB} --data-only -F p -f "${backupFilePath}"`
        
        const env = {
            ...process.env,
            PGPASSWORD: PASSWORD
        }

        const { stderr } = await execAsync(command, { env })

        if (stderr && stderr.trim()) {
            return {
                error: `Database export failed: ${stderr.trim()}`,
                success: false
            }
        }

        const fileBuffer = await fs.promises.readFile(backupFilePath)

        return {
            success: true,
            data: fileBuffer
        }
    } catch {
        return {
            error: 'An unexpected error occurred during export.',
            success: false
        }
    }
}
