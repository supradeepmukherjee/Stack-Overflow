import Pagination from "@/components/Pagination"
import QuesCard from "@/components/QuesCard"
import { answerCollection, db as dbName, questionCollection, voteCollection } from "@/models/name"
import { db, users } from '@/models/server/config'
import { UserPrefs } from "@/store/auth"
import { Query } from "node-appwrite"

const Ques = async (
  { params, searchParams }
    :
    {
      params: {
        userID: string
        userSlug: string
      }
      searchParams: { page?: string }
    }
) => {
  searchParams.page ||= '1'
  const ques = await db.listDocuments(dbName, questionCollection, [Query.equal('authorID', params.userID), Query.orderDesc('$createdAt'), Query.offset((+searchParams.page - 1) * 25), Query.limit(25)])
  ques.documents = await Promise.all(ques.documents.map(async q => {
    const [author, ans, votes] = await Promise.all([
      users.get<UserPrefs>(q.authorID),
      db.listDocuments(dbName, answerCollection, [Query.equal('quesID', q.$id), Query.limit(1)]),
      db.listDocuments(dbName, voteCollection, [Query.equal('type', 'question'), Query.equal('typeID', q.$id), Query.limit(1)])
    ])
    return {
      ...q,
      totalAnswers: ans.total,
      totalVotes: votes.total,
      author: {
        $id: author.$id,
        reputation: author.prefs.reputation,
        name: author.name
      }
    }
  }))
  return (
    <div className="px-4">
      <div className="mb-4">
        <p>
          {ques.total} Questions
        </p>
      </div>
      <div className="mb-4 max-w-3xl space-y-6">
        {ques.documents.map(q => <QuesCard ques={q} key={q.$id} />)}
      </div>
      <Pagination total={ques.total} limit={25} />
    </div>
  )
}

export default Ques