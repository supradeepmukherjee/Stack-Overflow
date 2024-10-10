import { MagicCard, MagicContainer } from "@/components/ui/magic-card"
import NumberTicker from "@/components/ui/number-ticker"
import { answerCollection, db as dbName, questionCollection } from "@/models/name"
import { db, users } from '@/models/server/config'
import { UserPrefs } from "@/store/auth"
import { Query } from "node-appwrite"

const User = async (
  { params }: {
    params: {
      userID: string
      userSlug: string
    }
  }
) => {
  const [author, ques, ans] = await Promise.all([
    users.get<UserPrefs>(params.userID),
    db.listDocuments(dbName, questionCollection, [Query.equal('authorID', params.userID), Query.limit(1)]),
    db.listDocuments(dbName, answerCollection, [Query.equal('authorID', params.userID), Query.limit(1)]),
  ])
  return (
    <MagicContainer className='flex h-[500px] w-full flex-col gap-4 lg:h-[250px] lg:flex-row'>
      <Card text="Reputation" tickerValue={author.prefs.reputation} />
      <Card text="Questions asked" tickerValue={ques.total} />
      <Card text="Answers give" tickerValue={ans.total} />
    </MagicContainer>
  )
}

const Card = (
  { text, tickerValue }
    :
    {
      text: string
      tickerValue: number
    }
) => (
  <MagicCard className="flex w-full flex-col items-center justify-center overflow-hidden p-20 cursor-pointer shadow-2xl">
    <div className="absolute inset-x-4 top-4">
      <h2 className="text-xl font-medium">
        {text}
      </h2>
    </div>
    <p className="text-4xl font-medium z-10 whitespace-nowrap text-gray-800 dark:text-gray-200">
      <NumberTicker value={tickerValue} />
    </p>
    <div className="absolute pointer-events-none h-full inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
  </MagicCard>
)

export default User