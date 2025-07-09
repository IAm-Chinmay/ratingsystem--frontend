import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  LogOut, // Import the LogOut icon
  UserPlus,
  LayoutDashboard,
  Store,
  Users,
  UserCog,
  KeyRound,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const roleRoutes = {
    admin: [
      {
        to: "/admin/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        to: "/admin/users",
        label: "User List",
        icon: <Users className="w-5 h-5" />,
      },
      {
        to: "/admin/stores",
        label: "Store List",
        icon: <Store className="w-5 h-5" />,
      },
      {
        to: "/admin/add-user",
        label: "Add New User",
        icon: <UserCog className="w-5 h-5" />,
      },
    ],
    store_owner: [
      {
        to: "/store/dashboard",
        label: "My Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
    ],
    user: [
      {
        to: "/user/stores",
        label: "Browse Stores",
        icon: <ShoppingBag className="w-5 h-5" />,
      },
    ],
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderUserRole = (role) => {
    const roleStyles = {
      admin: "bg-red-100 text-red-700",
      store_owner: "bg-blue-100 text-blue-700",
      user: "bg-green-100 text-green-700",
    };
    const roleIcons = {
      admin: <ShieldCheck className="w-4 h-4" />,
      store_owner: <Store className="w-4 h-4" />,
      user: <Users className="w-4 h-4" />,
    };
    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
          roleStyles[role] || ""
        }`}
      >
        {roleIcons[role]}
        {role.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {user ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user.name}!
              </h1>
              <p className="mt-2 text-gray-600">
                You are logged in as a {renderUserRole(user.role)}.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              {roleRoutes[user.role]?.map((route) => (
                <Link
                  key={route.to}
                  to={route.to}
                  className="w-full flex items-center gap-4 p-4 rounded-lg bg-gray-100 hover:bg-gray-200 hover:shadow-sm transition-all duration-300"
                >
                  <div className="text-blue-600">{route.icon}</div>
                  <span className="font-medium text-gray-700">
                    {route.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link
                to="/update-password"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                Change Password
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to the Store Rating System
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Your one-stop solution to rate and review stores.
              <br />
              Log in or create an account to get started.
            </p>
            <div className="mt-8 flex justify-center items-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-md font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 text-md font-semibold px-6 py-3 rounded-lg shadow-md border border-gray-200 hover:bg-gray-100 transition-transform hover:scale-105"
              >
                <UserPlus className="w-5 h-5" />
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
