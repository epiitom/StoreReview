
import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import Card from "../components/Card"
import StarRating from "../components/StarRating"
import { storeAPI } from "../services/api"

const StoreOwnerDashboard = () => {
  const [store, setStore] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStoreData()
  }, [])

  const fetchStoreData = async () => {
    try {
      setLoading(true)
      const [storeResponse, ratingsResponse] = await Promise.all([storeAPI.getMyStore(), storeAPI.getMyStoreRatings()])

      setStore(storeResponse.data)
      setRatings(ratingsResponse.data)
    } catch (error) {
      console.error("Error fetching store data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Layout title="Store Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    )
  }

  if (!store) {
    return (
      <Layout title="Store Dashboard">
        <Card>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Store Found</h3>
            <p className="text-gray-500">
              You don't have a store assigned to your account yet. Please contact an administrator to set up your store.
            </p>
          </div>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout title="Store Dashboard">
      {/* Store Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <span className="ml-2 text-gray-900">{store.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-gray-900">{store.email}</span>
            </div>
            {store.address && (
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <span className="ml-2 text-gray-900">{store.address}</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating Overview</h2>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {Number.parseFloat(store.average_rating).toFixed(1)}
            </div>
            <StarRating rating={Number.parseFloat(store.average_rating)} readonly size="lg" />
            <p className="text-gray-500 mt-2">
              Based on {store.total_ratings} review{store.total_ratings !== 1 ? "s" : ""}
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Ratings */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Ratings</h2>

        {ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((rating, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-medium text-sm">
                          {rating.user_name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{rating.user_name}</p>
                        <p className="text-sm text-gray-500">{rating.user_email}</p>
                      </div>
                    </div>

                    {rating.user_address && <p className="text-sm text-gray-600 mb-2 ml-11">{rating.user_address}</p>}
                  </div>

                  <div className="text-right">
                    <StarRating rating={rating.rating} readonly />
                    <p className="text-xs text-gray-500 mt-1">{formatDate(rating.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No ratings yet</p>
            <p className="text-gray-400 text-sm">Ratings from customers will appear here</p>
          </div>
        )}
      </Card>
    </Layout>
  )
}

export default StoreOwnerDashboard
