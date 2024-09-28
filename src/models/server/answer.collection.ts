import { Permission } from "node-appwrite"
import { answerCollection, db as dbName, } from "../name"
import { db } from "./config"

const createAnsCollection = async () => {
    await db.createCollection(dbName, answerCollection, answerCollection, [
        Permission.read('any'),
        Permission.create('users'),
        Permission.read('users'),
        Permission.update('users'),
        Permission.delete('users'),
    ])
    console.log('Questions Collection Created')
    //  attributes
    await Promise.all([
        db.createStringAttribute(dbName, answerCollection, 'quesID', 20, false),
        db.createStringAttribute(dbName, answerCollection, 'content', 10000, true),
        db.createStringAttribute(dbName, answerCollection, 'authorID', 20, true),
    ])
}

export default createAnsCollection