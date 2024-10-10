'use client'

import { FloatingNav } from "@/components/ui/floating-navbar"
import { useAuthStore } from "@/store/auth"
import slugify from "@/utils/slugify"
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react"

const Header = () => {
    const { user } = useAuthStore()
    const items = [
        {
            name: 'Home',
            link: '/',
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />
        },
        {
            name: 'Questions',
            link: '/ques',
            icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />
        },
    ]
    if (user)
        items.push({
            name: 'Profile',
            link: `/users/${user.$id}/${slugify(user.name)}`,
            icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
        })
    return (
        <div className="relative h-full">
            <FloatingNav navItems={items} />
        </div>
    )
}

export default Header