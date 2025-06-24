export default function StatCard({ 
  title, 
  value, 
  trend, 
  color = "blue" 
}: { 
  title: string;
  value: string;
  trend: string;
  color?: "blue" | "green" | "red";
}) {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-gray-500 text-xs mt-2">
        {trend}
      </div>
    </div>
  );
}