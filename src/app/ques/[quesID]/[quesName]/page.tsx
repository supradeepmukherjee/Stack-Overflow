import Particles from '@/components/ui/particles'
import ShimmerButton from '@/components/ui/shimmer-button'
import { TracingBeam } from '@/components/ui/tracing-beam'
import VoteBtns from '@/components/VoteBtns'
import { answerCollection, attachmentsBucket, commentCollection, db as dbName, questionCollection, voteCollection } from '@/models/name'
import { db, users } from '@/models/server/config'
import { UserPrefs } from '@/store/auth'
import convert from '@/utils/relativeTime'
import Link from 'next/link'
import { Query } from 'node-appwrite'
import EditQues from './EditQues'
import DeleteQues from './DeleteQues'
import { MDPreview } from '@/components/RTE'
import { avatars, storage } from '@/models/client/config'
import slugify from '@/utils/slugify'
import Comments from '@/components/Comments'
import Answers from '@/components/Answers'

const EditOrDelete = async (
  { params }:
    {
      params: {
        quesID: string
        quesName: string
      }
    }
) => {
  const [ques, ans, upVotes, downVotes, comments] = await Promise.all([
    db.getDocument(dbName, questionCollection, params.quesID),
    db.listDocuments(dbName, answerCollection, [Query.equal('quesID', params.quesID), Query.orderDesc('$createdAt')]),
    db.listDocuments(dbName, voteCollection, [Query.equal('typeID', params.quesID), Query.equal('type', 'question'), Query.equal('voteStatus', 'upVoted'), Query.limit(1)]),
    db.listDocuments(dbName, voteCollection, [Query.equal('typeID', params.quesID), Query.equal('type', 'question'), Query.equal('voteStatus', 'downVoted'), Query.limit(1)]),
    db.listDocuments(dbName, commentCollection, [Query.equal('type', 'question'), Query.equal('typeID', params.quesID), Query.orderDesc('$createdAt')])
  ])
  const author = await users.get<UserPrefs>(ques.authorID); // outside of Promise.all as it's dependent on the question
  [comments.documents, ans.documents] = await Promise.all([
    Promise.all(comments.documents.map(async c => {
      const author = await users.get<UserPrefs>(c.authorID)
      return {
        ...c,
        author: {
          $id: author.$id,
          name: author.name,
          reputation: author.prefs.reputation
        }
      }
    })),
    Promise.all(ans.documents.map(async a => {
      const [author, comments, upVotes, downVotes] = await Promise.all([
        users.get<UserPrefs>(a.authorID),
        db.listDocuments(dbName, commentCollection, [Query.equal('typeID', a.$id), Query.equal('type', 'answer'), Query.orderDesc('$createdAt')]),
        db.listDocuments(dbName, voteCollection, [Query.equal('typeID', a.$id), Query.equal('type', 'answer'), Query.equal('voteStatus', 'upVoted'), Query.limit(1)]),
        db.listDocuments(dbName, voteCollection, [Query.equal('typeID', a.$id), Query.equal('type', 'answer'), Query.equal('voteStatus', 'downVoted'), Query.limit(1)]),
      ])
      comments.documents = await Promise.all(comments.documents.map(async c => {
        const author = await users.get<UserPrefs>(c.authorID)
        return {
          ...c,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation
          }
        }
      }))
      return {
        ...a,
        comments,
        upVoteDocs: upVotes,
        downVoteDocs: downVotes,
        author: {
          $id: author.$id,
          name: author.name,
          reputation: author.prefs.reputation
        }
      }
    }))
  ])
  return (
    <TracingBeam>
      <Particles className='fixed inset-0 h-full w-full' quantity={500} ease={100} color='#fff' refresh />
      <div className="relative mx-auto px-4 pb-20 pt-36">
        <div className="flex">
          <div className="w-full">
            <h1 className="mb-1 text-3xl font-bold">
              {ques.title}
            </h1>
            <div className="flex gap-4 text-sm">
              <span>
                Asked {convert(new Date(ques.$createdAt))}
              </span>
              <span>
                Answers {ans.total}
              </span>
              <span>
                Votes {downVotes.total + upVotes.total}
              </span>
            </div>
          </div>
          <Link href='/ques/ask' className='ml-auto inline-block shrink-0'>
            <ShimmerButton className='shadow-2xl'>
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                Ask a Question
              </span>
            </ShimmerButton>
          </Link>
        </div>
        <hr className="my-4 border-white/40" />
        <div className="flex gap-4">
          <div className="flex gap-4 flex-col items-center shrink-0">
            <VoteBtns downVotes={downVotes} id={ques.$id} type='question' upVotes={upVotes} className='w-full' />
            <EditQues authorID={ques.authorID} quesID={ques.$id} quesTitle={ques.title} />
            <DeleteQues authorID={ques.authorID} quesID={ques.$id} />
          </div>
          <div className="w-full-overflow-auto">
            <MDPreview source={ques.content} className='rounded-xl p-4' />
            <picture>
              <img src={storage.getFilePreview(attachmentsBucket, ques.attachmentID).href} alt={ques.title} className='mt-3 rounded-lg' />
            </picture>
            <div className="flex flex-wrap mt-3 items-center gap-3 text-sm">
              {ques.tags.map((t: string) => (
                <Link href={`/ques?tag=${t}`} key={t} className='inline-block rounded-lg px-2 py-0.5 bg-white/10 duration-200 hover:bg-white/20'>
                  #{t}
                </Link>
              ))}
            </div>
            <div className="flex mt-4 items-center justify-end gap-1">
              <picture>
                <img src={avatars.getInitials(author.name, 36, 36).href} alt={author.name} className='rounded-lg' />
              </picture>
              <div className="block leading-tight">
                <Link href={`/users/${author.$id}/${slugify(author.name)}`} className='text-orange-500 hover:text-orange-600'>
                  {author.name}
                </Link>
                <p>
                  <strong>
                    {author.prefs.reputation}
                  </strong>
                </p>
              </div>
            </div>
            <Comments className='mt-4' comments={comments} type='question' typeID={ques.$id} />
            <hr className='my-4 border-white/40' />
          </div>
        </div>
        <Answers ans={ans} quesID={ques.$id} />
      </div>
    </TracingBeam>
  )
}

export default EditOrDelete