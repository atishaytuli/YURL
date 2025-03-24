import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/header";

const AppLayout = () => {
  return (
    <>
      <Header />

      <main className="min-h-screen w-full container mx-auto">
        <Outlet />
      </main>

      <footer className="px-10 mb-4 flex items-center justify-between">
        <p>© 2025 YURL | Handmade in India for all over the world.</p>
        <a href="#">LinkedIn</a>
      </footer>
    </>
  );
};

export default AppLayout;
