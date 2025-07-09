import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import {
  Users,
  Store,
  Star,
  LayoutDashboard,
  LogOut,
  UserPlus,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setStats({
          totalUsers: res.data.users,
          totalStores: res.data.stores,
          totalRatings: res.data.ratings,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            An overview of your platform's activity.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <StatCard
                title="Total Users"
                count={stats.totalUsers}
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Total Stores"
                count={stats.totalStores}
                icon={Store}
                color="green"
              />
              <StatCard
                title="Total Ratings"
                count={stats.totalRatings}
                icon={Star}
                color="yellow"
              />
            </div>

            <QuickActions />
          </>
        )}
      </main>
    </div>
  );
}

function Sidebar({ onLogout }) {
  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
      current: true,
    },
    { icon: Users, label: "Manage Users", path: "/admin/users" },
    { icon: Store, label: "Manage Stores", path: "/admin/stores" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-6 text-center border-b">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center">
          <ShieldCheck className="mr-2" /> Admin Panel
        </h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors ${
              item.current ? "bg-blue-50 text-blue-600 font-semibold" : ""
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function StatCard({ title, count, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-6 transform transition-transform hover:-translate-y-1">
      <div className={`p-4 rounded-full ${colors[color]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-4xl font-bold text-gray-800">{count}</p>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/admin/add-user"
          className="flex items-center bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add New User
        </Link>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <LoaderCircle className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
  );
}
