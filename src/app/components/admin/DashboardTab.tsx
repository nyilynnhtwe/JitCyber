import StatCard from "./StatCard";

export default function DashboardTab({ numOfUsers }: { numOfUsers: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Total Users"
        value={numOfUsers.toString()}
        trend="↑ 12% from last month"
        color="blue"
      />

      <StatCard
        title="System Status"
        value="Normal"
        trend="All systems operational"
        color="green"
      />
    </div>
  );
}