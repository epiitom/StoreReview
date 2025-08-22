import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "../components/Button"
import Card from "../components/Card"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    role: "normal_user", // Set default value
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  // Client-side validation
  const validateForm = () => {
    // Check required fields
    if (!formData.name.trim()) {
      return "Name is required"
    }
    if (!formData.email.trim()) {
      return "Email is required"
    }
    if (!formData.password) {
      return "Password is required"
    }
    if (!formData.confirmPassword) {
      return "Please confirm your password"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address"
    }

    // Password validation
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long"
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match"
    }

    // Role validation
    if (!["normal_user", "store_owner"].includes(formData.role)) {
      return "Please select a valid account type"
    }

    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value // Keep original value with spaces during typing
    }))
    
    // Clear error when user starts typing
    if (error) {
      setError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Client-side validation
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      // Prepare data for backend (remove confirmPassword and ensure proper format)
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registerData } = formData
      
      // Ensure data types are correct and trim only when submitting
      const cleanedData = {
        name: registerData.name.trim(),
        email: registerData.email.toLowerCase().trim(), // Normalize email
        password: registerData.password,
        address: registerData.address?.trim() || null, // Send null if empty
        role: registerData.role
      }

      console.log('Sending registration data:', cleanedData) // Debug log

      const result = await register(cleanedData)

      if (result.success) {
        navigate("/login", {
          state: { message: "Registration successful! Please sign in." },
        })
      } else {
        // Handle different types of errors
        if (result.error === 'User with this email already exists' || 
            result.error === 'Email already exists') {
          setError("An account with this email already exists")
        } else if (result.details && Array.isArray(result.details)) {
          // Handle validation errors from backend
          const errorMessages = result.details.map(detail => 
            `${detail.field}: ${detail.message}`
          ).join(', ')
          setError(errorMessages)
        } else {
          setError(result.error || "Registration failed. Please try again.")
        }
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError("Network error. Please check your connection and try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white py-5 px-2">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-600 mb-2">StoreRate</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">Join our community of store reviewers</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Account Type <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                disabled={loading}
                required
              >
                <option value="normal">Regular User</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your address (optional)"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your password (min. 6 characters)"
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              className="w-full cursor-pointer" 
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Register