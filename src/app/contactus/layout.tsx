import React, { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "../components/Navbar";
import AdminSidebar from "../admin/components/sidebar";
import Sidebar from "../vanowner/SideBar";
import Authprovider from "../AuthenticatorComp/provider";

interface Props {
  children: ReactNode;
}

const ContactUsLayout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    // Logged-in user layout with sidebar
    return (
      <div className="h-screen w-full flex overflow-hidden">
        <Authprovider>
          <div className="h-screen sticky top-0 left-0 z-20">
            {session.user.role === "ADMIN" && <AdminSidebar />}
            {session.user.role === "SERVICE" && <Sidebar />}
          </div>
          <main className="flex-1 h-screen overflow-y-auto">{children}</main>
        </Authprovider>
      </div>
    );
  }

  // Non-logged-in user layout with navbar
  return (
    <div className="h-screen flex flex-col">
      <Authprovider>
        <Navbar />
      </Authprovider>
      <main className="overflow-y-auto">{children}</main>
    </div>
  );
};

export default ContactUsLayout;
