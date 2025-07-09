import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { User, Mail, Home, Lock, ArrowRight } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "normal",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!form.name || !form.email || !form.address || !form.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      await API.post("/auth/register", form);
      // A non-blocking success message could be passed via state to the login page
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email Address", icon: Mail },
    { name: "address", type: "text", placeholder: "Address", icon: Home },
    { name: "password", type: "password", placeholder: "Password", icon: Lock },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Create Account</h1>
          <p className="mt-2 text-gray-500">
            Join us and start your journey today!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {inputFields.map(({ name, type, placeholder, icon: Icon }) => (
            <div key={name} className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full py-3 pl-10 pr-4 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                required
              />
            </div>
          ))}

          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-4 py-3 text-lg font-semibold text-white transition-transform duration-200 bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? "Creating Account..." : "Register"}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
