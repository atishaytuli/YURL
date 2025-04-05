import { Outlet } from "react-router-dom"
import Header from "@/components/header"

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto w-full relative">
        <Outlet />
      </main>

      <footer className="font-semibold px-4 sm:px-6 md:px-10 lg:px-20 mt-10 md:mt-16 mb-4 md:mb-6 flex flex-col md:flex-row items-center justify-between text-blue-900">
        <p className="text-center md:text-left text-black mb-3 md:mb-0">
          <span className="bg-blue-800 text-white px-2"># YURL</span>
          &nbsp; Handmade in India, serving the world.
        </p>
        <div className="flex gap-3 md:gap-4">
          <a href="#" className="text-black bg-blue-200 px-3 py-1 hover:bg-blue-300 transition text-sm sm:text-base">
            LinkedIn
          </a>
          <a
            href="#"
            className="text-black bg-yellow-400 px-3 py-1 hover:bg-yellow-500 transition text-sm sm:text-base"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout

