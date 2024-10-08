'use client'

import { useAuthStore } from "@/store/auth"
import slugify from "@/utils/slugify"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"

const EditQues = (
    { quesID, quesTitle, authorID }
        :
        {
            quesID: string
            quesTitle: string
            authorID: string
        }
) => {
    const { user } = useAuthStore()
    return user?.$id === authorID ? (
        <Link href={`/ques/${quesID}/${slugify(quesTitle)}/edit`} className="flex h-10 w-10 items-center justify-center rounded-full border p-1 duration hover:bg-white/10">
            <IconEdit className="h-4 w-4" />
        </Link>
    ) : null
}

export default EditQues