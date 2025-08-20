
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "../components/Button"
import Card from "../components/Card"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
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

  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-6 py-16">
  <div className="max-w-2xl w-full ">
    <div className="text-center">
      <h1 className="text-5xl font-extrabold text-emerald-600 mb-4 tracking-tight">StoreRate</h1>
      <h2 className="text-3xl font-semibold text-gray-900">Welcome Back</h2>
      <p className="mt-3 text-lg text-gray-600">Sign in to rate and discover amazing stores</p>
    </div>

    <Card className="p-10 shadow-xl rounded-2xl border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-base font-medium text-gray-700 mb-2"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 text-base"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-base font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 text-base"
            placeholder="Enter your password"
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full py-4 text-lg rounded-xl shadow-md hover:shadow-lg transition-all"
          size="lg"
        >
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-base">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  </div>
</div>

  )
}

export default Login
