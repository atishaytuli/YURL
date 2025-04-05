import { Button } from "@/components/ui/button"
import { Input } from "../components/ui/input"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Cards from "../components/cards"

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState()
  const navigate = useNavigate()

  const handleShorten = (e) => {
    e.preventDefault()
    if (longUrl) navigate(`/auth?createNew=${longUrl}`)
  }

  return (
    <div className="w-full flex flex-col items-center bg-[url('/stars.svg')] bg-top bg-no-repeat bg-contain mt-6 sm:mt-10 px-4 sm:px-6">
      <h2 className="my-6 sm:my-8 md:my-12 text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-black text-center font-bold leading-tight">
        The only URL{" "}
        <span className="relative">
          <span className="relative inline-block">
            Shortener
            <span className="absolute bottom-0 left-0 w-full h-1 sm:h-2 bg-yellow-300"></span>
          </span>{" "}
        </span>
        <br /> you'll ever need !!
      </h2>

      <form
        className="mt-8 sm:mt-12 flex flex-col sm:flex-row w-full max-w-4xl gap-2 items-center font-semibold"
        onSubmit={handleShorten}
      >
        <Input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="paste your long https://exampleyurl.com here"
          className="h-12 sm:h-14 flex-1 py-2 px-4 outline-none border-blue-900 focus:outline-none"
        />
        <Button
          className="w-full sm:w-auto h-12 sm:h-14 transform transition-all duration-300 ease-in-out hover:rounded-xl text-sm sm:text-base"
          type="submit"
        >
          Get your link for free <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <div className="w-full my-8 md:my-11 md:px-6 lg:px-11">
        <img src="/banner.jpeg" alt="banner" className="w-full rounded-lg" />
      </div>

      <Cards />
    </div>
  )
}

export default LandingPage

