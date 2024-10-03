'use client'
import { BackgroundBeams } from "@/components/ui/background-beams"
import { cn } from "@/lib/utils"
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


export const BottomGradient = () => (
    <>
        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from:transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
        <span className="absolute inset-x-10 -bottom-px block mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
)

export const LabelInputContainer = ({ children, className }: { children: ReactNode, className?: string }) => (
    <div className={cn('flex w-full flex-col space-y-2', className)}>
        {children}
    </div>
)

export default Layout