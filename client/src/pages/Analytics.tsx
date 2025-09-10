import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type AnalyticsData = {
  linkId: string;
  totalClicks: number;
  uniqueIPs: number;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  locationData: Record<string, number>;
};

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

export default function AnalyticsPage() {
  const { id } = useParams(); // /analytics/:id
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const res = await axiosInstance.get(`/analytics/${id}`);
      setAnalytics(res.data);
    } catch (error) {
      console.error("Error fetching analytics", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
        <p className="text-red-600 dark:text-red-400">No analytics found</p>
      </div>
    );
  }

  // Transform breakdown data for recharts
  const toChartData = (data: Record<string, number>) =>
    Object.entries(data).map(([key, value]) => ({ name: key, value }));

  const deviceData = toChartData(analytics.deviceBreakdown);
  const browserData = toChartData(analytics.browserBreakdown);
  const locationData = toChartData(analytics.locationData);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          📊 Advanced Analytics
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 text-sm rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Total Clicks" value={analytics.totalClicks} />
          <SummaryCard title="Unique Visitors" value={analytics.uniqueIPs} />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          <AnalyticsCard title="📱 Device Breakdown">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {deviceData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </AnalyticsCard>

          <AnalyticsCard title="🌐 Browser Breakdown">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={browserData}>
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AnalyticsCard>
        </div>

        {/* Location Table */}
        <AnalyticsCard title="📍 Location Data">
          {locationData.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No data</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                      Location
                    </th>
                    <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                      Clicks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locationData.map((loc, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {loc.name}
                      </td>
                      <td className="px-4 py-2 font-semibold text-indigo-600 dark:text-indigo-400">
                        {loc.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AnalyticsCard>
      </main>
    </div>
  );
}

// ✅ Reusable components
const SummaryCard = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-5 shadow text-center">
    <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
      {value}
    </p>
  </div>
);

const AnalyticsCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-5 shadow space-y-4">
    <h3 className="text-gray-900 dark:text-white text-lg font-medium">
      {title}
    </h3>
    {children}
  </div>
);
