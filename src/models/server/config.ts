import env from '@/env'
import { Avatars, Client, Databases, Storage, Users } from 'node-appwrite'

const client = new Client()

client
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.id)
    .setKey(env.appwrite.key)

const db = new Databases(client)
const avatars = new Avatars(client)
const storage = new Storage(client)
const users = new Users(client)

export { avatars, client, db, storage, users }
