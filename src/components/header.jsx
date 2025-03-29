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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import Announcement from "./Announcment";
import { UrlState } from "@/context";

const Header = () => {
  const navigate = useNavigate();
  const {user, fetchUser}= UrlState()

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

        <div>
          {!user ? (
            <Button onClick={() => navigate("/auth")}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-12 h-12 rounded-full overflow-hidden outline-none border-2 border-orange-500">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LinkIcon />
                  <span>My Links</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 font-semibold">
                  <LogOut className="h-4" />
                  <span>LogOut</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
