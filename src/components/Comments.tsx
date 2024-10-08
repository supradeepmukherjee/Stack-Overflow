'use client'

import { cn } from "@/lib/utils"
import { db } from "@/models/client/config"
import { commentCollection, db as dbName } from "@/models/name"
import { useAuthStore } from "@/store/auth"
import convert from "@/utils/relativeTime"
import slugify from "@/utils/slugify"
import { IconTrash } from "@tabler/icons-react"
import { ID, Models } from "appwrite"
import Link from "next/link"
import { FormEvent, Fragment, useState } from "react"

const Comments = (
  { comments: comments_, type, typeID, className }
    :
    {
      comments: Models.DocumentList<Models.Document>
      type: 'question' | 'answer'
      typeID: string
      className?: string
    }
) => {
  const [comments, setComments] = useState(comments_)
  const [newComment, setNewComment] = useState('')
  const { user } = useAuthStore()
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newComment || !user) return
    try {
      const res = await db.createDocument(dbName, commentCollection, ID.unique(), {
        content: newComment,
        authorID: user.$id,
        type,
        typeID
      })
      setNewComment('')
      setComments(c => ({
        total: c.total + 1,
        documents: [...c.documents, { ...res, author: user }]
      }))
    } catch (err: any) {
      window.alert(err.msg || 'Error Creating Comment')
    }
  }
  const delComment = async (id: string) => {
    try {
      await db.deleteDocument(dbName, commentCollection, id)
      setComments(c => ({
        total: c.total - 1,
        documents: c.documents.filter(c => c.$id !== id)
      }))
    } catch (err: any) {
      window.alert(err.msg || 'Error Deleting Comment')
    }
  }
  return (
    <div className={cn('flex flex-col gap-2 pl-4', className)}>
      {comments.documents.map(c => (
        <Fragment key={c.$id}>
          <hr className="border-white/40" />
          <div className="flex gap-2">
            <p className="text-sm">
              {c.content} :
              <Link href={`/users/${c.authorID}/${slugify(c.author.name)}`} className="text-orange-500 hover:text-orange-600">
                {c.author.name}
              </Link>
              <span className="opacity-60">
                {convert(new Date(c.$createdAt))}
              </span>
            </p>
            {user?.$id !== c.authorID ? null :
              <button onClick={() => delComment(c.$id)} className="shrink-0 text-red-500 hover:text-red-600">
                <IconTrash className="h-4 w-4" />
              </button>
            }
          </div>
        </Fragment>
      ))}
      <hr className="border-white/40" />
      <form onSubmit={submitHandler} className="flex items-center gap-2">
        <textarea rows={1} placeholder="Add a Comment" value={newComment} className="w-full rounded-md border border-white/20 bg-white/10 p-2 outline-none" onChange={e => setNewComment(e.target.value)}/>
        <button className="rounded shrink-0 px-4 py-2 font-bold text-white bg-orange-500 hover:bg-orange-600">
          Add Comment
        </button>
      </form>
    </div>
  )
}

export default Comments