import { Button } from "@/components/ui/button";
import { Input } from "../components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cards from '../components/cards'


const LandingPage = () => {
  const [longUrl, setLongUrl] = useState();
  const navigate = useNavigate()

  const handleShorten = (e) => {
    e.preventDefault()
    if(longUrl)navigate(`/auth?createNew=${longUrl}`)
  }
  return (
    <div className="w-full flex flex-col items-center bg-[url('/stars.svg')] bg-top bg-no-repeat bg-contain mt-10">
      <h2 className="my-8 sm:my-12 text-3xl sm:text-6xl lg:text-7xl text-black text-center text-balance font-bold leading-tight">
        The only URL <span className="relative">
            <span className="relative inline-block">
          Shortener
          <span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 "></span>
        </span>{" "} </span>
         <br /> you’ll ever need !! 
      </h2>

      <form className="sm:h-14 mt-12 flex flex-col sm:flex-row w-full md:w-3/4 gap-2 items-center font-semibold" onSubmit={handleShorten}>
        <Input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="paste your long https://exampleyurl.com here"
          className="h-full flex-1 py-2 px-4 outline-none border-blue-900 focus:outline-none"
        />
        <Button className="h-full transform transition-all duration-300 ease-in-out hover:rounded-xl" type="submit">
          Get your link for free <ArrowRight />
        </Button>
      </form>

      <img src="/banner.jpeg" alt="banner" className="w-full my-11 md:px-11" />

      <Cards />
    </div>
  );
};

export default LandingPage;
