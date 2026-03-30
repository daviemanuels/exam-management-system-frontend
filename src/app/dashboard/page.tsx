export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">Total de Exames: 120</div>

        <div className="bg-white p-4 rounded shadow">Usuários: 8</div>

        <div className="bg-white p-4 rounded shadow">Hoje: 15 exames</div>
      </div>
    </div>
  );
}
