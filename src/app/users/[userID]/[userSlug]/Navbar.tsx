'use client'

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

const Navbar = () => {
  const { userID, userSlug } = useParams()
  const pathName = usePathname()
  const items = [
    {
      name: 'Summary',
      href: `/users/${userID}/${userSlug}`
    },
    {
      name: 'Questions',
      href: `/users/${userID}/${userSlug}/ques`
    },
    {
      name: 'Answers',
      href: `/users/${userID}/${userSlug}/ans`
    },
    {
      name: 'Votes',
      href: `/users/${userID}/${userSlug}/votes`
    },
  ]
  return (
    <ul className="flex w-full shrink-0 gap-1 overflow-auto sm:w-40 sm:flex-col">
      {items.map(i => (
        <li key={i.name}>
          <Link href={i.href} className={`block px-3 py-0.5 w-full rounded-full duration-200 ${pathName === i.href ? 'bg-white/20' : 'hover:bg-white/20'}`}>
            {i.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Navbar