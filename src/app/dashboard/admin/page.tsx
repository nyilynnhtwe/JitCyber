"use client";
import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  BarChart2,
  MessageSquare,
  ArrowUpRight,
  UserPlus,
  FileText
} from "lucide-react";
import Link from "next/link";

export default function AdminHomePage() {
  const [stats, setStats] = useState({
    users: 0,
    topics: 0,
    sessions: 0,
    messages: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats({
          users: data.users || 0,
          topics: data.topics || 0,
          sessions: data.sessions || 0,
          messages: data.messages || 0
        });
      } catch (e) {
        console.error(e);
      }
    }
    fetchStats();
  }, []);

  // Recent activity data
  const activities = [
    { user: "John Doe", action: "created new topic", time: "10 min ago" },
    { user: "Jane Smith", action: "updated profile", time: "30 min ago" },
    { user: "Mike Johnson", action: "completed course", time: "1 hour ago" },
    { user: "Sarah Williams", action: "posted comment", time: "2 hours ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.users}
          change="+12%"
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          color="bg-indigo-100"
        />
        <StatsCard
          title="Topics"
          value={stats.topics}
          change="+5"
          icon={<BookOpen className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatsCard
          title="Sessions"
          value={stats.sessions}
          change="+24%"
          icon={<BarChart2 className="w-6 h-6 text-amber-600" />}
          color="bg-amber-100"
        />
        <StatsCard
          title="Messages"
          value={stats.messages}
          change="+18"
          icon={<MessageSquare className="w-6 h-6 text-rose-600" />}
          color="bg-rose-100"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Analytics Overview</h3>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </div>

          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center text-gray-500">
              <BarChart2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>Analytics chart will appear here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">User Reports</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
              Generate report <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center text-gray-500">
              <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p>User reports will appear here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">System Status</h3>
            <div className="text-sm text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              All systems operational
            </div>
          </div>

          <div className="space-y-3">
            <StatusItem title="API Service" status="operational" />
            <StatusItem title="Database" status="operational" />
            <StatusItem title="Authentication" status="operational" />
            <StatusItem title="File Storage" status="operational" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components
function StatsCard({ title, value, change, icon, color }: {
  title: string;
  value: number;
  change: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            {icon}
          </div>
        </div>
        <div className="mt-3 flex items-center text-sm text-green-600">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {change}
        </div>
      </div>
    </div>
  );
}

function StatusItem({ title, status }: { title: string; status: string }) {
  const statusColor = status === "operational" ? "bg-green-500" : "bg-red-500";
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-700">{title}</span>
      <div className="flex items-center">
        <span className={`w-2 h-2 rounded-full mr-2 ${statusColor}`}></span>
        <span className="text-sm capitalize">{status}</span>
      </div>
    </div>
  );
}