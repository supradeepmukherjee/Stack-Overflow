'use client'

import { BackgroundBeams } from "@/components/ui/background-beams"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

const Layout = ({ children }: { children: ReactNode }) => {
    const { session } = useAuthStore()
    const router = useRouter()
    useEffect(() => {
        if (session) router.push('/')
    }, [router, session])
    if (session) return null
    return (
        <div className="relative flex h-screen flex-col items-center justify-center py-12">
            <BackgroundBeams />
            <div className="relative">
                {children}
            </div>
        </div>
    )
}

export default Layout