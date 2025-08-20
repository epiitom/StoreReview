import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "../components/Button"

const UpdatePasswordModal = ({ isOpen, onClose, onUpdate }) => {
  const [passwordData, setPasswordData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
    setError("")
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match")
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: passwordData.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        onUpdate("Password updated successfully!")
        onClose()
        setPasswordData({
          email: "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Network error. Please try again.")
      console.log(error)
    }

    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Update Password</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={passwordData.email}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              name="currentPassword"
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              required
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1 py-2 rounded-lg"
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showUpdatePassword, setShowUpdatePassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(formData)

    if (result.success) {
      // Navigate based on user role
      const userData = JSON.parse(localStorage.getItem("user"))
      switch (userData.role) {
        case "admin":
          navigate("/admin")
          break
        case "store_owner":
          navigate("/store-dashboard")
          break
        case "normal":
          navigate("/dashboard")
          break
        default:
          navigate("/dashboard")
      }
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  const handleUpdatePassword = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(""), 5000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600 mb-2">StoreRate</h1>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to rate and discover amazing stores</p>
        </div>

        <div className="bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-10 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowUpdatePassword(true)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
                >
                  Update Password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <UpdatePasswordModal
        isOpen={showUpdatePassword}
        onClose={() => setShowUpdatePassword(false)}
        onUpdate={handleUpdatePassword}
      />
    </div>
  )
}

export default Login