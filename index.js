import { configDotenv } from 'dotenv'

configDotenv({ path: './.env' })

console.log(` SOAP_URL: ${process.env.SOAP_URL}`)
