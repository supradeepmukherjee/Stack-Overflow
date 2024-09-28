import { db } from "./config"
import { db as dbName } from "../name"
import createQuesCollection from "./question.collection"
import createAnsCollection from "./answer.collection"
import createCommentCollection from "./comment.collection"
import createVoteCollection from "./vote.collection"

const getOrCreateDB = async () => {
    try {
        await db.get(dbName)
        console.log('DB Connected')
    } catch (err) {
        try {
            await db.create(dbName, dbName)
            console.log('DB created')
            await Promise.all([createQuesCollection(), createAnsCollection(), createCommentCollection(), createVoteCollection()])
            console.log('Collections Created & DB Connected')
        } catch (err) {
            console.log('Failed to created DB/Collections', err)
        }
    }
    return db
}

export default getOrCreateDB