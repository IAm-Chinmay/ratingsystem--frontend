import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Star, KeyRound, MessageSquareWarning } from "lucide-react";
import API from "../../api/axios";
import { useAuthStore } from "../../store/authStore";

export default function StoreDashboard() {
  const [avgRating, setAvgRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/store-owner/dashboard")
      .then((res) => {
        setAvgRating(res.data.averageRating);
        setRatings(res.data.ratings);
      })
      .catch((err) => {
        console.error("Failed to load dashboard", err);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Store Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/update-password"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Password</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-3xl font-bold text-gray-800">
                {avgRating ? parseFloat(avgRating).toFixed(1) : "N/A"}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent User Ratings
            </h2>
            {ratings.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
                <MessageSquareWarning className="w-12 h-12 mb-4 text-gray-400" />
                <p className="font-medium">
                  No ratings have been submitted yet.
                </p>
                <p className="text-sm">
                  Check back later to see what your users think!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b-2 border-gray-100">
                    <tr>
                      <th className="p-3 text-sm font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="p-3 text-sm font-semibold text-gray-600">
                        Email
                      </th>
                      <th className="p-3 text-sm font-semibold text-gray-600 text-right">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map((r, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="p-3 text-sm text-gray-700 font-medium">
                          {r.user.name}
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {r.user.email}
                        </td>
                        <td className="p-3 text-sm text-gray-800 font-bold text-right flex justify-end items-center gap-1">
                          {r.rating}
                          <Star className="w-4 h-4 text-yellow-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
