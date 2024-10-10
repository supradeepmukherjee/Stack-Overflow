'use client'

import { useAuthStore } from "@/store/auth"
import Link from "next/link"
import { useParams } from "next/navigation"

const EditBtn = () => {
    const { userID, userSlug } = useParams()
    const { user } = useAuthStore()
    if (user?.$id !== userID) return null
    return (
        <Link href={`/users/${userID}/${userSlug}/edit`} className="relative px-4 py-2 rounded-full border border-neutral-200 text-sm font-medium text-black dark:text-white dark:border-white/20">
            <span>
                Edit
            </span>
            <span className="absolute h-px w-1/2 inset-x-0 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"/>
        </Link>
    )
}

export default EditBtn