
import { useState, useEffect } from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import Layout from "../components/Layout"
import Card from "../components/Card"
import Button from "../components/Button"
import StarRating from "../components/StarRating"
import { adminAPI, userAPI, storeAPI, ratingAPI } from "../services/api"

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
              className={`
                                px-3 py-2 text-sm font-medium rounded-md transition-colors
                                ${
                                  item.current
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }
                            `}
            >
              {item.name}
            </Link>
          ))}
        </nav>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
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
  )
}

const UsersManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Users Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`
                                        inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                        ${
                                          user.role === "admin"
                                            ? "bg-red-100 text-red-800"
                                            : user.role === "store_owner"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-green-100 text-green-800"
                                        }
                                    `}
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
    </Card>
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
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Store</h3>
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

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Create Store
              </Button>
            </div>
          </form>
        </Card>
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
