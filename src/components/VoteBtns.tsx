'use client'

import { cn } from "@/lib/utils"
import { db } from "@/models/client/config"
import { db as dbName, voteCollection } from "@/models/name"
import { useAuthStore } from "@/store/auth"
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"
import { Models, Query } from "appwrite"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const VoteBtns = (
  {
    type,
    id,
    upVotes,
    downVotes,
    className
  }
    :
    {
      type: 'question' | 'answer'
      id: string
      upVotes: Models.DocumentList<Models.Document>
      downVotes: Models.DocumentList<Models.Document>
      className?: string
    }
) => {
  const [votedDoc, setVotedDoc] = useState<Models.Document | null>() // undefined indicates no fetching yet
  const [voteRes, setVoteRes] = useState<number>(upVotes.total - downVotes.total)
  const { user } = useAuthStore()
  const router = useRouter()
  const toggleVote = async (up: boolean = true) => {
    if (!user) return router.push('/login')
    if (votedDoc === undefined) return
    try {
      const res = await fetch(
        '/api/vote',
        {
          method: 'POST',
          body: JSON.stringify({
            votedByID: user.$id,
            voteStatus: up ? 'upVoted' : 'downVoted',
            type,
            typeID: id
          })
        }
      )
      const data = await res.json()
      if (!res.ok) throw data
      setVoteRes(data.data.voteResult)
      setVotedDoc(data.data.document)
    } catch (err: any) {
      window.alert(err.msg || 'Something went wrong')
    }
  }
  useEffect(() => {
    (async () => {
      if (user) {
        const res = await db.listDocuments(dbName, voteCollection, [Query.equal('type', type), Query.equal('typeID', id), Query.equal('votedByID', user.$id)])
        setVotedDoc(res.documents[0] || null)
      }
    })()
  }, [id, type, user])
  return (
    <div className={cn('flex shrink-0 flex-col items-center justify-start gap-y-4', className)}>
      <button
        onClick={() => toggleVote()}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10',
          votedDoc?.voteStatus === 'upVoted' ? 'border-orange-500 text-orange-500' : 'border-white/30'
        )}>
        <IconCaretUpFilled />
      </button>
      <span>
        {voteRes}
      </span>
      <button
        onClick={() => toggleVote(false)}
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10',
          votedDoc?.voteStatus === 'downVoted' ? 'border-orange-500 text-orange-500' : 'border-white/30'
        )}>
        <IconCaretDownFilled />
      </button>
    </div>
  )
}

export default VoteBtns