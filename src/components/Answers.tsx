'use client'

import { useAuthStore } from "@/store/auth"
import { Models } from "appwrite"
import { FormEvent, useState } from "react"
import VoteBtns from "./VoteBtns"
import { IconTrash } from "@tabler/icons-react"
import RTE, { MDPreview } from "./RTE"
import { avatars } from "@/models/client/config"
import Link from "next/link"
import slugify from "@/utils/slugify"
import Comments from "./Comments"

const Answers = (
  { ans: ans_, quesID }
    :
    {
      ans: Models.DocumentList<Models.Document>
      quesID: string
    }
) => {
  const [ans, setAns] = useState(ans_)
  const [newAns, setNewAns] = useState('')
  const { user } = useAuthStore()
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newAns || !user) return
    try {
      const res = await fetch('/api/ans', {
        method: 'POST',
        body: JSON.stringify({
          quesID,
          ans: newAns,
          authorID: user.$id
        })
      })
      const data = await res.json()
      if (!res.ok) throw data
      setNewAns('')
      setAns(a => ({
        total: a.total + 1,
        documents: [
          ...a.documents,
          {
            ...data,
            author: user,
            upVotesDocs: {
              documents: [],
              total: 0
            },
            downVotesDocs: {
              documents: [],
              total: 0
            },
            comments: {
              documents: [],
              total: 0
            },
          }
        ]
      }))
    } catch (err: any) {
      window.alert(err.msg || 'Error Posting answer')
    }
  }
  const delAnswer = async (ansID: string) => {
    try {
      const res = await fetch('/api/ans', {
        method: 'DELETE',
        body: JSON.stringify({ ansID })
      })
      const data = await res.json()
      if (!res.ok) throw data
      setAns(a => ({
        total: a.total - 1,
        documents: a.documents.filter(a => a.$id !== ansID)
      }))
    } catch (err: any) {
      window.alert(err.msg || 'Error deleting answer')
    }
  }
  return (
    <>
      <h2 className="mb-4 text-xl">
        {ans.total}
      </h2>
      {ans.documents.map(a => (
        <div key={a.$id} className="flex gap-4">
          <div className="flex flex-col shrink-0 items-center gap-4">
            <VoteBtns downVotes={a.downVotesDocs} id={a.$id} type="answer" upVotes={a.upVotesDocs} />
            {user?.$id !== a.authorID ? null :
              (
                <button onClick={() => delAnswer(a.$id)} className="flex h-10 w-10 items-center justify-center p-1 rounded-full border border-red-500 text-red-500 duration-200 hover:bg-red-500/10">
                  <IconTrash className="h-4 w-4" />
                </button>
              )}
          </div>
          <div className="w-full overflow-auto">
            <MDPreview className="rounded-xl p-4" source={a.content} />
            <div className="mt-4 flex items-center justify-end gap-1">
              <picture>
                <img src={avatars.getInitials(a.author.name, 36, 36).href} alt={a.author.name} className="rounded-lg" />
              </picture>
              <div className="block leading-tight">
                <Link href={`/users/${a.author.$id}/${slugify(a.author.name)}`} className="text-orange-500 hover:text-orange-600">
                  {a.author.name}
                </Link>
                <p>
                  <strong>
                    {a.author.reputation}
                  </strong>
                </p>
              </div>
            </div>
            <Comments className='mt-4' comments={a.comments} type='answer' typeID={a.$id} />
            <hr className="my-4 border-white/40" />
          </div>
        </div>
      ))}
      <hr className="my-4 border-white/40" />
      <form onSubmit={submitHandler} className="space-y-2">
        <h2 className="mb-4 text-xl">
          Your Answer
        </h2>
        <RTE value={newAns} onChange={val => setNewAns(val || '')} />
          <button className="rounded shrink-0 px-4 py-2 bg-orange-500 font-bold text-white hover:bg-orange-600">
            Post your Answer
          </button>
      </form>
    </>
  )
}

export default Answers