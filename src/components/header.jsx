import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import { logout } from "@/db/apiAuth"
import useFetch from "@/hooks/use-fetch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkIcon, LogIn, LogOut } from "lucide-react"
import Announcement from "./Announcment"
import { UrlState } from "@/context"
import { BarLoader } from "react-spinners"

const Header = () => {
  const { loading, fn: fnLogout } = useFetch(logout)
  const navigate = useNavigate()

  const { user, fetchUser } = UrlState()

  return (
    <header>
      <Announcement />
      <nav className="px-4 sm:px-6 md:px-10 lg:px-24 py-4 sm:py-6 flex items-center justify-between">
        <Link to="/">
          <img src="/YURL.png" alt="YURL-Logo" className="h-8 sm:h-10 md:h-12" />
        </Link>

        <div className="flex gap-2 sm:gap-4">
          {!user ? (
            <Button
              onClick={() => navigate("/auth")}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden outline-none bg-blue-200 text-blue-800 text-xl sm:text-2xl font-semibold hover:bg-blue-100 transform transition-all duration-300 ease-in-out hover:scale-[0.95] p-0"
            >
              <LogIn className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-200">
                  <AvatarImage src={user?.user_metadata?.profile_pic} />
                  <AvatarFallback className="bg-blue-200 text-base sm:text-lg">👀</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-sm sm:text-base">{user?.user_metadata?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-blue-600 font-semibold text-sm sm:text-base">
                  <Link to="/dashboard" className="flex items-center w-full">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser()
                      navigate("/auth")
                    })
                  }}
                  className="text-red-500 text-sm sm:text-base"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </header>
  )
}

export default Header

