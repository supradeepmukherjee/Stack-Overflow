import { Permission } from "node-appwrite"
import { db as dbName, voteCollection } from "../name"
import { db } from "./config"

const createVoteCollection = async () => {
    await db.createCollection(dbName, voteCollection, voteCollection, [
        Permission.read('any'),
        Permission.create('users'),
        Permission.read('users'),
        Permission.update('users'),
        Permission.delete('users'),
    ])
    console.log('Votes Collection Created')
    //  attributes
    await Promise.all([
        db.createEnumAttribute(dbName, voteCollection, 'type', ['question', 'answer'], true),
        db.createEnumAttribute(dbName, voteCollection, 'voteStatus', ['upVoted', 'downVoted'], true),
        db.createStringAttribute(dbName, voteCollection, 'typeID', 20, true),
        db.createStringAttribute(dbName, voteCollection, 'votedByID', 20, true),
    ])
}

export default createVoteCollection