'use client'

import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

const Search = () => {
  const pathName = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const searchHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('search', search)
    router.push(`${pathName}?${newSearchParams}`)
  }
  useEffect(() => {
    setSearch(() => searchParams.get('search') || '')
  }, [searchParams])
  return (
    <form className="flex w-full flex-row gap-4" onSubmit={searchHandler}>
      <Input type="text" value={search} placeholder="Search Questions" onChange={e => setSearch(e.target.value)} />
      <button className="rounded shrink-0 px-4 py-2 font-bold text-white bg-orange-500 hover:bg-orange-600">
        Search
      </button>
    </form>
  )
}

export default Search