export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-primaryDark text-white p-4">
      <h1 className="text-xl font-bold mb-6">Exam System</h1>

      <nav className="flex flex-col gap-2">
        <a className="hover:bg-primary p-2 rounded cursor-pointer">Dashboard</a>

        <a className="hover:bg-primary p-2 rounded cursor-pointer">Usuários</a>

        <a className="hover:bg-primary p-2 rounded cursor-pointer">Exames</a>

        <a className="hover:bg-primary p-2 rounded cursor-pointer">Logs</a>
      </nav>
    </aside>
  );
}
