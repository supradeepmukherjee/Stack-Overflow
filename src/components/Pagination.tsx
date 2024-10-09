'use client'

import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const Pagination = (
    { total, limit, className }
        :
        {
            total: number
            limit: number
            className?: string
        }
) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathName = usePathname()
    const pg = searchParams.get('page') || '1'
    const totalPgs = Math.ceil(total / limit)
    const changePage = (next: boolean = true) => {
        if (next) {
            if (pg >= String(totalPgs)) return
        } else {
            if (pg <= '1') return
        }
        const pgNumber = Number(pg)
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set('page', `${next ? pgNumber + 1 : pgNumber - 1}`)
        router.push(`${pathName}?${newSearchParams}`)
    }
    return (
        <div className="flex items-center justify-center gap-4">
            <button className={cn('rounded-lg px-2 py-0.5 duration-200 bg-white/10 hover:bg-white/20', className)} onClick={() => changePage(false)} disabled={pg <= '1'}>
                Previous
            </button>
            <span>
                {pg} of {totalPgs || '1'} {/* condition works if pg=0 */}
            </span>
            <button className={cn('rounded-lg px-2 py-0.5 duration-200 bg-white/10 hover:bg-white/20', className)} onClick={() => changePage()} disabled={pg >= String(totalPgs)}>
                Next
            </button>
        </div>
    )
}

export default Pagination