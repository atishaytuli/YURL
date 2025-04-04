import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {logout} from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkIcon, LogIn, LogOut } from "lucide-react";
import Announcement from "./Announcment";
import { UrlState } from "@/context";
import {BarLoader} from "react-spinners";

const Header = () => {
  const { loading, fn: fnLogout } = useFetch(logout);
  const navigate = useNavigate();

  const { user, fetchUser } = UrlState();

  return (
    <header>
      <Announcement />
      <nav className="px-4 md:px-6 lg:px-24 py-6 flex items-center justify-between">
        <Link to="/">
          <img
            src="/YURL.png"
            alt="YURL-Logo"
            className="h-12 sm:h-10 md:h-12"
          />
        </Link>

        <div className="flex gap-4">
          {!user ? (
            <Button
              onClick={() => navigate("/auth")}
              className="w-12 h-12 rounded-full overflow-hidden outline-none bg-blue-200 text-blue-800 text-2xl font-semibold hover:bg-blue-100 transform transition-all duration-300 ease-in-out hover:scale-[0.95]"
            >
              <LogIn />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                <Avatar className="w-12 h-12 bg-blue-200">
                  <AvatarImage src={user?.user_metadata?.profile_pic} />
                  <AvatarFallback className="bg-blue-200">👀</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 font-semibold">
                  <Link to="/dashboard" className="flex">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    fnLogout().then(() => {
                      fetchUser();
                      navigate("/auth");
                    });
                  }}
                  className="text-red-400"
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
  );
};

export default Header;
