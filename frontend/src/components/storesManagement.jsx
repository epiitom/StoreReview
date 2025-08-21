import { useState, useEffect } from "react"
import Card from "../components/Card"
import Button from "../components/Button"
import StarRating from "../components/StarRating"
import { storeAPI } from "../services/api"

const StoresManagement = () => {
  const [stores, setStores] = useState([])
  const [storeOwners, setStoreOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [storeToDelete, setStoreToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  })
  const [submitting, setSubmitting] = useState(false)
  
  // Assuming you have user context or auth context to check if user is admin
  // eslint-disable-next-line no-unused-vars
  const [userRole, setUserRole] = useState("admin") // Replace with actual user role from context/auth

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchStores(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await storeAPI.createStore(formData)
      await fetchStores(searchTerm)
      setShowCreateForm(false)
      setFormData({ name: "", email: "", address: "", owner_id: "" })
    } catch (error) {
      console.error("Error creating store:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (store) => {
    setStoreToDelete(store)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!storeToDelete) return
    
    setDeleting(true)
    try {
      await storeAPI.deleteStore(storeToDelete.id)
      await fetchStores(searchTerm)
      setShowDeleteModal(false)
      setStoreToDelete(null)
    } catch (error) {
      console.error("Error deleting store:", error)
    } finally {
      setDeleting(false)
    }
  }

  const handleCloseModal = () => {
    setShowCreateForm(false)
    setFormData({ name: "", email: "", address: "", owner_id: "" })
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setStoreToDelete(null)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  const handleDeleteBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseDeleteModal()
    }
  }

  if (loading && !searchTerm) {
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
        {userRole === "admin" && (
          <Button className ="cursor-pointer" onClick={() => setShowCreateForm(true)}>Create Store</Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search stores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Create Store Modal */}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleDeleteBackdropClick}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2 cursor-pointer">Delete Store</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete "{storeToDelete?.name}"? This action cannot be undone and will also remove all associated ratings.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseDeleteModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleConfirmDelete}
                    loading={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          {loading && searchTerm ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
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
                  {userRole === "admin" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
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
                    {userRole === "admin" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteClick(store)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}

export default StoresManagement