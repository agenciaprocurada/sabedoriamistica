import type { Metadata } from "next";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function AdminPainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-4 pb-24 md:p-8 md:pb-8">{children}</main>
      </div>
    </div>
  );
}
