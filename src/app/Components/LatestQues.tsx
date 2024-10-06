import { db, users } from "@/models/server/config"
import { answerCollection, db as dbName, questionCollection, voteCollection } from "@/models/name"
import { Query } from "node-appwrite"
import { UserPrefs } from "@/store/auth"
import QuesCard from "@/components/QuesCard"

const LatestQues = async () => {
    const ques = await db.listDocuments(dbName, questionCollection, [Query.limit(5), Query.orderDesc('$createdAt')])
    ques.documents = await Promise.all(ques.documents.map(async ques => {
        const [author, ans, votes] = await Promise.all([
            users.get<UserPrefs>(ques.authorID),
            db.listDocuments(dbName, answerCollection, [
                Query.equal('quesID', ques.$id),
                Query.limit(1) // for optimisation(how?)
            ]),
            db.listDocuments(dbName, voteCollection, [
                Query.equal('type', 'question'),
                Query.equal('typeID', ques.$id),
                Query.limit(1) // for optimisation(how?)
            ])
        ])
        return {
            ...ques,
            totalAns: ans.total,
            totalVotes: votes.total,
            author: {
                $id: author.$id,
                reputation: author.prefs.reputation,
                name: author.name
            }
        }
    }))
    return (
        <div className="space-y-6">
            {ques.documents.map(q => <QuesCard key={q.$id} ques={q} />)}
        </div>
    )
}

export default LatestQues