import { avatars } from "@/models/client/config"
import { users } from "@/models/server/config"
import { UserPrefs } from "@/store/auth"
import convert from "@/utils/relativeTime"
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react"
import { ReactNode } from "react"
import EditBtn from "./EditBtn"
import Navbar from "./Navbar"

const Layout = async (
  { children, params }
    :
    {
      children: ReactNode
      params: {
        userID: string
        userSlug: string
      }
    }
) => {
  const user = await users.get<UserPrefs>(params.userID)
  return (
    <div className="container mx-auto space-y-4 px-4 pb-20 pt-32">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-40 shrink-0">
          <picture className="w-full block">
            <img src={avatars.getInitials(user.name, 200, 200).href} alt={user.name} className="h-full w-full rounded-xl object-cover" />
          </picture>
        </div>
        <div className="w-full">
          <div className="flex items-start justify-between">
            <div className="block space-y-0.5">
              <h1 className="text-3xl font-bold">
                {user.name}
              </h1>
              <p className="text-lg text-gray-500">
                {user.email}
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-500 font-bold">
                <IconUserFilled /> Dropped
                {convert(new Date(user.$createdAt))}
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-500">
                <IconClockFilled /> Last Activity&nbsp;
                {convert(new Date(user.$updatedAt))}
              </p>
            </div>
            <div className="shrink-0">
              <EditBtn />
            </div>
          </div>
        </div>
      </div>
      <Navbar />
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}

export default Layout