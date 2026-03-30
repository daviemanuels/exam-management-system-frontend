import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 bg-gray-100 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
