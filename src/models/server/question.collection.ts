import { IndexType, Permission } from "node-appwrite"
import { db as dbName, questionCollection } from "../name"
import { db } from "./config"

const createQuesCollection = async () => {
    await db.createCollection(dbName, questionCollection, questionCollection, [
        Permission.read('any'),
        Permission.create('users'),
        Permission.read('users'),
        Permission.update('users'),
        Permission.delete('users'),
    ])
    console.log('Questions Collection Created')
    //  attributes
    await Promise.all([
        db.createStringAttribute(dbName, questionCollection, 'title', 90, true),
        db.createStringAttribute(dbName, questionCollection, 'content', 10000, true),
        db.createStringAttribute(dbName, questionCollection, 'authorID', 20, true),
        db.createStringAttribute(dbName, questionCollection, 'tags', 20, true, undefined, true),
        db.createStringAttribute(dbName, questionCollection, 'attachmentID', 20, false),
    ])
    // indexes
    await Promise.all([
        db.createIndex(dbName, questionCollection, 'title', IndexType.Fulltext, ['title'], ['asc']),
        db.createIndex(dbName, questionCollection, 'content', IndexType.Fulltext, ['content'], ['asc']),
    ])
}

export default createQuesCollection