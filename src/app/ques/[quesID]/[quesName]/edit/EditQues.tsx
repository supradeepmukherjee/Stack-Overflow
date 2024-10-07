'use client'

import QuesForm from "@/components/QuesForm"
import { useAuthStore } from "@/store/auth"
import slugify from "@/utils/slugify"
import { Models } from "appwrite"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const EditQues = ({ ques }: { ques: Models.Document }) => {
  const { user } = useAuthStore()
  const router = useRouter()
  useEffect(() => {
    if (ques.authorID !== user?.$id) router.push(`/ques/${ques.$id}/${slugify(ques.title)}`)
  }, [ques.$id, ques.authorID, ques.title, router, user?.$id])
  if (ques.authorID !== user?.$id) return null
  return (
    <div>
      <div className="block pb-20 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="mb-10 mt-4 text-2xl">
            Edit your Question
          </h1>
          <div className="flex flex-wrap md:flex-row-reverse">
            <div className="w-full md:w-1/3"></div>
            <div className="w-full md:w-2/3">
              <QuesForm ques={ques} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditQues