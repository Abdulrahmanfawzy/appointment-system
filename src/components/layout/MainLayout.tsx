import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";

// src/components/layout/MainLayout.tsx

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="px-8 py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
