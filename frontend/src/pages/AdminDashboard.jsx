
import { useState, useEffect } from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import Layout from "../components/Layout"
import Card from "../components/Card"
import Button from "../components/Button"
import StarRating from "../components/StarRating"
import { adminAPI, userAPI, storeAPI, ratingAPI } from "../services/api"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"



const AdminDashboard = () => {
  const location = useLocation()
  const isMainDashboard = location.pathname === "/admin" || location.pathname === "/admin/"

  const navigation = [
    { name: "Dashboard", href: "/admin", current: isMainDashboard },
    { name: "Users", href: "/admin/users", current: location.pathname === "/admin/users" },
    { name: "Stores", href: "/admin/stores", current: location.pathname === "/admin/stores" },
    { name: "Ratings", href: "/admin/ratings", current: location.pathname === "/admin/ratings" },
  ]

  return (
    <Layout title="Admin Dashboard">
      {/* Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                item.current ? "bg-emerald-100 text-emerald-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
          
            </Link>
          ))}
        </nav>
               <div className="flex gap-1.5 p-2.5">
  <Link to="/admin/users">
    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
      Users
    </Button>
  </Link>

  <Link to="/admin/stores">
    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
      Stores
    </Button>
  </Link>

  <Link to="/admin/ratings">
    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
      Ratings
    </Button>
  </Link>
</div>
      </div>

      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/stores" element={<StoresManagement />} />
        <Route path="/ratings" element={<RatingsManagement />} />
      </Routes>
    </Layout>
  )
}

const DashboardOverview = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboard()
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }


  const chartData = [
    {
      name: "Users",
      value: stats?.total_users || 0,
      fill: "#10b981",
    },
    {
      name: "Stores",
      value: stats?.total_stores || 0,
      fill: "#3b82f6",
    },
    {
      name: "Ratings",
      value: stats?.total_ratings || 0,
      fill: "#f59e0b",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">{stats?.total_users || 0}</div>
            <p className="text-gray-600">Total Users</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats?.total_stores || 0}</div>
            <p className="text-gray-600">Total Stores</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats?.total_ratings || 0}</div>
            <p className="text-gray-600">Total Ratings</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats?.average_rating ? Number.parseFloat(stats.average_rating).toFixed(1) : "0.0"}
            </div>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Statistics Overview</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

const UsersManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    role: "admin",
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers()
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setCreateError("")
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setCreateError("Passwords do not match")
      setCreateLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setCreateError("Password must be at least 6 characters")
      setCreateLoading(false)
      return
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...userData } = formData
      const response = await userAPI.createUser(userData)

      if (response.success) {
        // Refresh users list
        await fetchUsers()
        // Reset form and close modal
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          address: "",
          role: "admin",
        })
        setShowCreateModal(false)
      } else {
        setCreateError(response.error || "Failed to create user")
      }
    } catch (error) {
      setCreateError("An error occurred while creating the user")
      console.error("Error creating user:", error)
    } finally {
      setCreateLoading(false)
    }
  }

  const closeModal = () => {
    setShowCreateModal(false)
    setCreateError("")
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      role: "admin",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600 mt-1">Manage system users and administrators</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New User
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-medium text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : user.role === "store_owner"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.address || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create New Admin User</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                {createError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {createError}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter email address"
                  />
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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter address (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="normal">Regular User</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Confirm password"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {createLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating...
                      </>
                    ) : (
                      "Create User"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const StoresManagement = () => {
  const [stores, setStores] = useState([])
  const [storeOwners, setStoreOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [storesResponse, ownersResponse] = await Promise.all([storeAPI.getStores(), storeAPI.getStoreOwner()])
      setStores(storesResponse.data)
      setStoreOwners(ownersResponse.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await storeAPI.createStore(formData)
      await fetchData()
      setShowCreateForm(false)
      setFormData({ name: "", email: "", address: "", owner_id: "" })
    } catch (error) {
      console.error("Error creating store:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setShowCreateForm(false)
    setFormData({ name: "", email: "", address: "", owner_id: "" })
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Stores Management</h2>
        <Button onClick={() => setShowCreateForm(true)}>Create Store</Button>
      </div>

      {showCreateForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Create New Store</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Owner</label>
                  <select
                    required
                    value={formData.owner_id}
                    onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select a store owner</option>
                    {storeOwners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting}>
                    Create Store
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{store.name}</div>
                      <div className="text-sm text-gray-500">{store.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StarRating rating={Number.parseFloat(store.overall_rating)} readonly />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.total_ratings}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.address || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

const RatingsManagement = () => {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRatings()
  }, [])

  const fetchRatings = async () => {
    try {
      const response = await ratingAPI.getAllRatings()
      setRatings(response.data)
    } catch (error) {
      console.error("Error fetching ratings:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">All Ratings</h2>

      <div className="space-y-4">
        {ratings.map((rating, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{rating.user_name}</p>
                    <p className="text-sm text-gray-500">{rating.user_email}</p>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div>
                    <p className="font-medium text-gray-900">{rating.store_name}</p>
                    <p className="text-sm text-gray-500">{rating.store_email}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <StarRating rating={rating.rating} readonly />
                <p className="text-xs text-gray-500 mt-1">{new Date(rating.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ratings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No ratings yet</p>
        </div>
      )}
    </Card>
  )
}

export default AdminDashboard
