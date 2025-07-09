import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you might use navigate
import API from "../../api/axios";
import SortableTable from "../../components/SortableTable";
import { Users, Search, PlusCircle, Frown, LoaderCircle } from "lucide-react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/admin/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.address, u.role]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const tableColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    {
      key: "role",
      label: "Role",
      render: (role) => {
        const roleStyles = {
          admin: "bg-red-100 text-red-700",
          store_owner: "bg-yellow-100 text-yellow-700",
          normal: "bg-blue-100 text-blue-700",
        };
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              roleStyles[role] || "bg-gray-100 text-gray-700"
            }`}
          >
            {role.replace("_", " ").toUpperCase()}
          </span>
        );
      },
    },
  ];

  const handleRowClick = (user) => {
    alert(`Viewing details for user: ${user.name}`);
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="w-8 h-8 mr-3 text-indigo-600" />
              Users
            </h1>
            <p className="mt-2 text-md text-gray-600">
              Manage all users in the system.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full md:w-72 border border-gray-300 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link
              to="/admin/add-user"
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create User
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
              <LoaderCircle className="w-10 h-10 mb-4 text-indigo-600 animate-spin" />
              <p className="text-lg">Loading users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <SortableTable
              data={filteredUsers}
              columns={tableColumns}
              onRowClick={handleRowClick}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
              <Frown className="w-16 h-16 mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold">No Users Found</h3>
              <p className="mt-1">
                Your search for "{search}" returned no results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
