
import { useState, useEffect } from "react"
import { Routes, Route, Link, useLocation } from "react-router-dom"
import Layout from "../components/Layout"
import Card from "../components/Card"
import Button from "../components/Button"
import StarRating from "../components/StarRating"
import { adminAPI, ratingAPI } from "../services/api"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import StoresManagement from "../components/storesManagement"
import UsersManagement from "../components/UsersManagement"
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
        <nav className="flex space-x-8 cursor-pointer">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer`}
            >
          
            </Link>
          ))}
        </nav>
               <div className="flex gap-1.5 p-2.5 ">
      <Link to="/admin">
    <Button className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white">
      Overview
    </Button>
  </Link>           
  <Link to="/admin/users">
    <Button className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white">
      Users
    </Button>
  </Link>

  <Link to="/admin/stores">
    <Button className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white">
      Stores
    </Button>
  </Link>

  <Link to="/admin/ratings">
    <Button className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white">
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
              {stats?.average_rating ? Number.parseFloat(stats.average_rating).toFixed(1) : "3"}
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
