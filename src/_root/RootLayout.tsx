import { Outlet } from "react-router-dom";

import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";

const RootLayout = () => {
  return (
    <div className="relative w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 md:ml-64">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
