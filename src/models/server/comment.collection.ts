import { Permission } from "node-appwrite"
import { commentCollection, db as dbName } from "../name"
import { db } from "./config"

const createCommentCollection = async () => {
    await db.createCollection(dbName, commentCollection, commentCollection, [
        Permission.read('any'),
        Permission.create('users'),
        Permission.read('users'),
        Permission.update('users'),
        Permission.delete('users'),
    ])
    console.log('Comments Collection Created')
    //  attributes
    await Promise.all([
        db.createStringAttribute(dbName, commentCollection, 'content', 10000, true),
        db.createEnumAttribute(dbName, commentCollection, 'type', ['question', 'answer'], true),
        db.createStringAttribute(dbName, commentCollection, 'typeID', 20, true),
        db.createStringAttribute(dbName, commentCollection, 'authorID', 20, true),
    ])
}

export default createCommentCollection