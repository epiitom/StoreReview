
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "store_owner":
        return "Store Owner"
      case "normal":
        return "User"
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-emerald-600">StoreRate</h1>
              </div>
              {title && (
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-medium text-sm">{user?.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500">{getRoleDisplayName(user?.role)}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}

export default Layout
