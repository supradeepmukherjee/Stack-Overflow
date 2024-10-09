import Pagination from '@/components/Pagination'
import QuesCard from '@/components/QuesCard'
import ShimmerButton from '@/components/ui/shimmer-button'
import { answerCollection, db as dbName, questionCollection, voteCollection } from '@/models/name'
import { db, users } from '@/models/server/config'
import { UserPrefs } from '@/store/auth'
import Link from 'next/link'
import { Query } from 'node-appwrite'
import Search from './Search'

const Ques = async (
  { searchParams }
    :
    {
      searchParams: {
        page?: string
        search?: string
        tag?: string
      }
    }
) => {
  searchParams.page ||= '1'
  const queries = [Query.orderDesc('$createdAt'), Query.offset((+searchParams.page - 1) * 25), Query.limit(25)]
  if (searchParams.tag) queries.push(Query.equal('tags', searchParams.tag))
  if (searchParams.search) queries.push(Query.or([Query.search('title', searchParams.search), Query.search('content', searchParams.search)]))
  const ques = await db.listDocuments(dbName, questionCollection, queries)
  ques.documents = await Promise.all(
    ques.documents.map(
      async ques => {
        const [author, ans, votes] = await Promise.all([
          users.get<UserPrefs>(ques.authorID),
          db.listDocuments(dbName, answerCollection, [Query.equal('quesID', ques.$id), Query.limit(1)]),
          db.listDocuments(dbName, voteCollection, [Query.equal('type', 'question'), Query.equal('typeID', ques.$id), Query.limit(1)]),
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
      }
    )
  )
  return (
    <div className='container px-4 pb-20 pt-36 mx-auto'>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          All Questions
        </h1>
        <Link href='/ques/ask'>
          <ShimmerButton className='shadow-2xl'>
            <span className="text-center whitespace-pre-wrap text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Ask a Question
            </span>
          </ShimmerButton>
        </Link>
      </div>
      <div className="mb-4">
        <Search />
      </div>
      <div className="mb-4">
        <p>
          {ques.total} questions
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