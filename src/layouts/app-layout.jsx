import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/header";
import Cards from '../components/cards';

const AppLayout = () => {
  return (
    <>
      <Header />

      <main className="min-h-screen w-full container mx-auto ">
        <Outlet />

      </main>
      <footer className="font-semibold px-6 md:px-20 mt-16 mb-6 flex flex-col md:flex-row items-center justify-between text-blue-900">
        <p className="text-center md:text-left text-black">
          <span className="bg-blue-800 text-white px-2"># YURL</span> 
          &nbsp; Handmade in India, serving the world.
        </p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <a href="#" className="text-black bg-blue-200 px-3 hover:bg-blue-300 transition">
            LinkedIn
          </a>
          <a href="#" className="text-black bg-yellow-400 px-3 hover:bg-yellow-500 transition">
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
};

export default AppLayout;
