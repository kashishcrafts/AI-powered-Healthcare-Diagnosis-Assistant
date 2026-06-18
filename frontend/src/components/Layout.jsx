import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#0a0f1a]">
      <Sidebar />
      <main className="flex-1 ml-[80px] lg:ml-[280px] transition-all duration-300">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
