import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import config from '@config'
import { headers } from 'next/headers'
import { auth } from '@parent/frontend/src/utils/auth'


const DB_BACKUP_DIR = path.resolve(process.cwd(), 'db')
const { HOST, PORT, USER, DB, PASSWORD } = config.database

export async function GET(): Promise<Response> {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
    if(!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!HOST || !PORT || !USER || !DB || !PASSWORD) {
        console.error('Error: Missing environment variables')
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    const outputFilePath = path.join(DB_BACKUP_DIR, 'backup.sql')
    const command = `PGPASSWORD="${PASSWORD}" pg_dump --data-only -h ${HOST} -p ${PORT} -U ${USER} -d ${DB} -F p -f ${outputFilePath}`

    return new Promise((resolve) => {
        const child = exec(command, (error) => {
            if (error) {
                console.error('Error during pg_dump')
                resolve(NextResponse.json({ error: 'Backup failed' }, { status: 500 }))
            } else {
                try {
                    const fileBuffer = fs.readFileSync(outputFilePath)
                    const fileArray = new Uint8Array(fileBuffer)
                    resolve(new Response(fileArray, {
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Content-Disposition': 'attachment; filename="backup.sql"'
                        }
                    }))
                } catch (readError) {
                    console.error('Error reading backup file:', readError)
                    resolve(NextResponse.json({ error: 'Failed to read backup file' }, { status: 500 }))
                }
            }
        })

        child.stdout?.pipe(process.stdout)
        child.stderr?.pipe(process.stderr)
    })
}
