'use client'

import { db } from "@/models/client/config"
import { db as dbName, questionCollection } from "@/models/name"
import { useAuthStore } from "@/store/auth"
import { IconTrash } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

const DeleteQues = (
    { quesID, authorID }
        :
        {
            quesID: string
            authorID: string
        }
) => {
    const router = useRouter()
    const { user } = useAuthStore()
    const delQues = async () => {
        try {
            await db.deleteDocument(dbName, questionCollection, quesID)
            router.push('/ques')
        } catch (err: any) {
            window.alert(err.msg || 'Something went wrong')
        }
    }
    return user?.$id === authorID ? (
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10" onClick={delQues}>
            <IconTrash className="h-4 w-4" />
        </button>
    ) : null
}

export default DeleteQues