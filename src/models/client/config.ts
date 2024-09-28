import env from '@/env'
import { Account, Avatars, Client, Databases, Storage } from 'appwrite'

const client = new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.id)

const account = new Account(client)
const db = new Databases(client)
const avatars = new Avatars(client)
const storage = new Storage(client)

export { account, avatars, client, db, storage }