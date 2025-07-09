import { useState } from "react";
import API from "../../api/axios";
import {
  User,
  Mail,
  Lock,
  MapPin,
  UserPlus,
  Eye,
  EyeOff,
  Shield,
  Store,
  Users,
} from "lucide-react";

export default function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (form.name.length < 20 || form.name.length > 60) {
      newErrors.name = "Name must be between 20 and 60 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password must be 8-16 characters long, with at least one uppercase letter and one special character.";
    }

    if (form.address.length > 400) {
      newErrors.address = "Address cannot exceed 400 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userRes = await API.post("/admin/add-user", form);

      if (form.role === "store_owner") {
        const userId = userRes.data.user.id;

        await API.post("/admin/add-store", {
          name: form.name,
          email: form.email,
          address: form.address,
          ownerId: userId,
        });
      }

      alert("User created successfully");
      setForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
      setErrors({});
    } catch (err) {
      alert("Failed to create user: " + (err.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case "name":
        return <User className="h-5 w-5 text-gray-400" />;
      case "email":
        return <Mail className="h-5 w-5 text-gray-400" />;
      case "password":
        return <Lock className="h-5 w-5 text-gray-400" />;
      case "address":
        return <MapPin className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "user":
        return <Users className="h-4 w-4" />;
      case "store_owner":
        return <Store className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "user":
        return "text-blue-600 bg-blue-50";
      case "store_owner":
        return "text-purple-600 bg-purple-50";
      case "admin":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Add New User
          </h2>
          <p className="text-gray-600">Create a new user account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-100">
          <div className="space-y-6">
            {["name", "email", "password", "address"].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {field === "address" ? "Address" : field}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {getFieldIcon(field)}
                  </div>
                  <input
                    type={
                      field === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    placeholder={`Enter ${
                      field === "address" ? "address" : field
                    }`}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    required
                    className={`w-full pl-10 pr-12 py-3 border ${
                      errors[field] ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 ${
                      errors[field]
                        ? "focus:ring-red-500"
                        : "focus:ring-blue-500"
                    } focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white`}
                  />
                  {field === "password" && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  )}
                </div>
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                )}
              </div>
            ))}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {getRoleIcon(form.role)}
                </div>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                >
                  <option value="user">User</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                    form.role
                  )}`}
                >
                  {getRoleIcon(form.role)}
                  {form.role === "store_owner"
                    ? "Store Owner"
                    : form.role.charAt(0).toUpperCase() + form.role.slice(1)}
                </span>
                {form.role === "store_owner" && (
                  <span className="text-xs text-gray-500">
                    Store will be created automatically
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create User
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
