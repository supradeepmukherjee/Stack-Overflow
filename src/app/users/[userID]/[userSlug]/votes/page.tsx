import Pagination from "@/components/Pagination"
import { cn } from "@/lib/utils"
import { answerCollection, db as dbName, questionCollection, voteCollection } from "@/models/name"
import { db, users } from '@/models/server/config'
import convert from "@/utils/relativeTime"
import slugify from "@/utils/slugify"
import Link from "next/link"
import { Query } from "node-appwrite"

const Votes = async (
  { params, searchParams }
    :
    {
      params: {
        userID: string
        userSlug: string
      }
      searchParams: {
        page?: string
        voteStatus?: 'upVoted' | 'downVoted'
      }
    }
) => {
  searchParams.page ||= '1'
  const queries = [Query.equal('votedByID', params.userID), Query.orderDesc('$createdAt'), Query.offset((+searchParams.page - 1) * 25), Query.limit(25)]
  if (searchParams.voteStatus) queries.push(Query.equal('voteStatus', searchParams.voteStatus))
  const votes = await db.listDocuments(dbName, voteCollection, queries)
  votes.documents = await Promise.all(votes.documents.map(async v => {
    const quesOfTypeQues =
      v.type !== 'question' ? null :
        await db.getDocument(dbName, questionCollection, v.typeID, [Query.select(['title'])])
    if (quesOfTypeQues) return { ...v, ques: quesOfTypeQues }
    const ans = await db.getDocument(dbName, answerCollection, v.typeID)
    const quesOfTypeAns = await db.getDocument(dbName, answerCollection, ans.quesID, [Query.select(['title'])])
    return { ...v, ques: quesOfTypeAns }
  }))
  const path = `/users/${params.userID}/${params.userSlug}/votes`
  return (
    <div className="px-4">
      <div className="flex justify-between mb-4">
        <p>
          {votes.total} votes
        </p>
        <ul className="flex gap-1">
          <LI classNameCondition={!searchParams.voteStatus} path={path} text="All" />
          <LI classNameCondition={searchParams?.voteStatus === 'upVoted'} path={path} text="Upvotes" voteCondition="?voteStatus=upVoted" />
          <LI classNameCondition={searchParams?.voteStatus === 'downVoted'} path={path} text="Downvotes" voteCondition="?voteStatus=downVoted" />
        </ul>
      </div>
      <div className="mb-4 max-w-3xl space-y-6">
        {votes.documents.map(v => (
          <div className="border border-white/40 p-4 rounded-xl duration-200 hover:bg-white/10" key={v.$id}>
            <div className="flex">
              <p className="mr-4 shrink-0">
                {v.voteStatus}
              </p>
              <p>
                <Link href={`/ques/${v.ques.$id}/${slugify(v.ques.title)}`} className="text-orange-500 hover:text-orange-600">
                  {v.ques.title}
                </Link>
              </p>
            </div>
            <p className="text-sm text-right">
              {convert(new Date(v.$createdAt))}
            </p>
          </div>
        ))}
      </div>
      <Pagination total={votes.total} limit={25} />
    </div>
  )
}

const LI = (
  { path, voteCondition, classNameCondition, text }
    :
    {
      path: string
      voteCondition?: string
      classNameCondition: boolean
      text: string
    }
) => (
  <li>
    <Link href={path + voteCondition} className={cn('block w-full rounded-full px-3 py-0.5 duration-200', classNameCondition ? 'bg-white/20' : 'hover:bg-white/20')}>
      {text}
    </Link>
  </li>
)

export default Votes