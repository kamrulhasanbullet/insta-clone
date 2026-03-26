import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="md:ml-64 xl:ml-72 min-h-screen">
        <div className="max-w-screen-sm mx-auto px-4 pb-20 md:pb-0">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
