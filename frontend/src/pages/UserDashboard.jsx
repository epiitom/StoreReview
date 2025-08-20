
import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import Card from "../components/Card"
import Button from "../components/Button"
import StarRating from "../components/StarRating"
import { storeAPI, ratingAPI } from "../services/api"

const UserDashboard = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStore, setSelectedStore] = useState(null)
  const [rating, setRating] = useState(0)
  const [submittingRating, setSubmittingRating] = useState(false)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async (search = "") => {
    try {
      setLoading(true)
      const response = await storeAPI.getStores({ search })
      setStores(response.data)
    } catch (error) {
      console.error("Error fetching stores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchStores(searchTerm)
  }

  const handleRateStore = (store) => {
    setSelectedStore(store)
    setRating(store.user_submitted_rating || 0)
  }

  const submitRating = async () => {
    if (!selectedStore || rating === 0) return

    try {
      setSubmittingRating(true)

      if (selectedStore.user_submitted_rating) {
        // Update existing rating
        await ratingAPI.updateRating(selectedStore.id, { rating })
      } else {
        // Submit new rating
        await ratingAPI.submitRating({
          store_id: selectedStore.id,
          rating,
        })
      }

      // Refresh stores to get updated ratings
      await fetchStores(searchTerm)
      setSelectedStore(null)
      setRating(0)
    } catch (error) {
      console.error("Error submitting rating:", error)
    } finally {
      setSubmittingRating(false)
    }
  }

  if (loading) {
    return (
      <Layout title="Browse Stores">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Browse Stores">
      {/* Search Bar */}
      <div className="mb-8">
        <Card>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Search stores by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <Button type="submit">Search</Button>
          </form>
        </Card>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card key={store.id} hover className="flex flex-col">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
              <p className="text-gray-600 mb-2">{store.email}</p>
              {store.address && <p className="text-gray-500 text-sm mb-4">{store.address}</p>}

              <div className="flex items-center justify-between mb-4">
                <StarRating rating={Number.parseFloat(store.overall_rating)} readonly />
                <span className="text-sm text-gray-500">({store.total_ratings} reviews)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              {store.user_submitted_rating ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-emerald-600 font-medium">Your rating:</span>
                  <StarRating rating={store.user_submitted_rating} readonly size="sm" />
                </div>
              ) : (
                <span className="text-sm text-gray-500">Not rated yet</span>
              )}

              <Button size="sm" variant="outline" onClick={() => handleRateStore(store)}>
                {store.user_submitted_rating ? "Update Rating" : "Rate Store"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No stores found</p>
          <p className="text-gray-400">Try adjusting your search terms</p>
        </div>
      )}

      {/* Rating Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Rate {selectedStore.name}</h3>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">How would you rate this store?</p>
              <div className="flex justify-center">
                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setSelectedStore(null)
                  setRating(0)
                }}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={submitRating} loading={submittingRating} disabled={rating === 0}>
                {selectedStore.user_submitted_rating ? "Update" : "Submit"} Rating
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default UserDashboard
