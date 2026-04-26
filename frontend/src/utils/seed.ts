
import 'dotenv/config'
import { auth } from './auth'

if (
    !process.env.AUTH_EMAIL
    || !process.env.AUTH_PASSWORD
    || !process.env.AUTH_NAME
) {
    throw new Error('Missing essential environment variables.')
}

auth.api.signUpEmail({ body: {
    email: process.env.AUTH_EMAIL,
    password: process.env.AUTH_PASSWORD,
    name: process.env.AUTH_NAME
} }).then(user => {
    console.log('User signed up:', user.user.email)
}).catch(error => {
    console.error('Error signing up user:', error)
})
