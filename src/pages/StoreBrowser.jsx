import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { Star, Search, LogOut, KeyRound } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const StarRating = ({ initialRating = 0, storeId, hasRated, onRate }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleRatingClick = (starValue) => {
    if (starValue === rating) return;
    setRating(starValue);
    onRate(storeId, starValue, hasRated);
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={starValue}
            className="focus:outline-none"
            onClick={() => handleRatingClick(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                starValue <= (hover || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
            />
          </button>
        );
      })}
    </div>
  );
};

const StoreCard = ({ store, onRatingSubmit }) => (
  <div className="border rounded-lg bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg space-y-4">
    <div>
      <h3 className="font-bold text-xl text-gray-800">{store.name}</h3>
      <p className="text-sm text-gray-500">{store.address}</p>
    </div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-4">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
        <span className="text-gray-600">
          Average:{" "}
          <span className="font-semibold text-gray-800">
            {store.averageRating ? store.averageRating.toFixed(1) : "N/A"}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-600 font-medium">Your Rating:</span>
        <StarRating
          initialRating={store.yourRating || 0}
          storeId={store.id}
          hasRated={!!store.yourRating}
          onRate={onRatingSubmit}
        />
      </div>
    </div>
  </div>
);
export default function StoreBrowser() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    setLoading(true);
    API.get("/user/stores")
      .then((res) => setStores(res.data))
      .catch(() => toast.error("Failed to fetch stores."))
      .finally(() => setLoading(false));
  }, []);

  const handleRatingSubmit = async (storeId, rating, hasRated) => {
    const apiCall = API[hasRated ? "put" : "post"]("/user/rate", {
      storeId,
      rating,
    });

    toast.promise(apiCall, {
      loading: "Submitting rating...",
      success: `Rating ${hasRated ? "updated" : "submitted"}!`,
      error: "Failed to submit rating.",
    });

    try {
      await apiCall;
      const res = await API.get("/user/stores");
      setStores(res.data);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const filteredStores = stores.filter((s) =>
    `${s.name} ${s.address}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Browse Stores
              </h1>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <Link
                  to="/update-password"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Change Password</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </header>

          {loading ? (
            <div className="text-center text-gray-500">Loading stores...</div>
          ) : filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onRatingSubmit={handleRatingSubmit}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No stores found.</div>
          )}
        </div>
      </div>
    </>
  );
}
