import Pagination from "@/components/Pagination"
import { MDPreview } from "@/components/RTE"
import { answerCollection, db as dbName, questionCollection } from "@/models/name"
import { db } from '@/models/server/config'
import Link from "next/link"
import { Query } from 'node-appwrite'

const Ans = async (
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
  const ans = await db.listDocuments(dbName, answerCollection, [Query.equal('authorID', params.userID), Query.orderDesc('$createdAt'), Query.offset((+searchParams.page - 1) * 25), Query.limit(25)])
  ans.documents = await Promise.all(ans.documents.map(async a => {
    const ques = await db.getDocument(dbName, questionCollection, a.quesID, [Query.select(['title'])])
    return { ...a, ques }
  }))
  return (
    <div className='px-4'>
      <div className="mb-4">
        <p>
          {ans.total} Answers
        </p>
      </div>
      <div className="mb-4 max-w-3xl space-y-6">
        {ans.documents.map(a => (
          <div key={a.$id}>
            <div className="max-h-40 overflow-auto">
              <MDPreview source={a.content} className="rounded-lg p-4" />
            </div>
            <Link href={`/ques/${a.quesID}/${a.ques.title}`} className="mt-3 inline-block shrink-0 rounded px-4 py-2 font-bold text-white bg-orange-500 hover:bg-orange-600">
              Question
            </Link>
          </div>
        ))}
      </div>
      <Pagination limit={25} total={ans.total} />
    </div>
  )
}

export default Ans