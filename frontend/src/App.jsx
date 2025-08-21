import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminDashboard from "./pages/AdminDashboard"
import UserDashboard from "./pages/UserDashboard"
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import Landing from "./pages/Landing"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path ="/Landing" element={<Landing/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["normal_user"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/store-dashboard"
              element={
                <ProtectedRoute allowedRoles={["store_owner"]}>
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
            <Route path="/" element={<Navigate to="/Landing" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
