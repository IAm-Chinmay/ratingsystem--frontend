import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import AdminDashboard from "./features/admin/Dashboard";
import StoreDashboard from "./features/storeOwner/StoreDashboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import UserList from "./features/admin/UserList";
import StoreList from "./features/admin/StoreList";
import StoreBrowser from "./pages/StoreBrowser";
import UpdatePassword from "./features/auth/UpdatePassword";
import AddUser from "./features/admin/AddUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StoreList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/store/dashboard"
          element={
            <ProtectedRoute allowedRoles={["store_owner"]}>
              <StoreDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/stores"
          element={
            <ProtectedRoute allowedRoles={["normal"]}>
              <StoreBrowser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-password"
          element={
            <ProtectedRoute allowedRoles={["normal", "store_owner"]}>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
