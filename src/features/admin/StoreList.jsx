import { useEffect, useState } from "react";
import API from "../../api/axios";
import SortableTable from "../../components/SortableTable";
import { Search, Store, ListFilter, Frown } from "lucide-react";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/stores")
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch stores:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredStores = stores.filter((s) =>
    [s.name, s.email, s.address]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const tableColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "averageRating", label: "Rating" },
  ];

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Store className="w-8 h-8 mr-3 text-blue-600" />
              Store Management
            </h1>
            <p className="mt-1 text-gray-500">
              Search, view, and manage all registered stores.
            </p>
          </div>
          <div className="w-full md:w-auto flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or address..."
                className="w-full md:w-80 border rounded-lg p-2 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="hidden sm:flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ListFilter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading stores...
            </div>
          ) : filteredStores.length > 0 ? (
            <SortableTable data={filteredStores} columns={tableColumns} />
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-center text-gray-500">
              <Frown className="w-16 h-16 mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold">No Stores Found</h3>
              <p className="mt-1">
                Your search for "{search}" did not match any stores.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
