import { useState, useEffect } from "react"
import { userAPI } from "../services/api"

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        role: "normal_user",
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false)
const [userToDelete, setUserToDelete] = useState(null)
const [deleting, setDeleting] = useState(false)

// Add these handler functions
const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
}

const handleConfirmDelete = async () => {
    if (!userToDelete) return
    
    setDeleting(true)
    try {
        await userAPI.deleteUser(userToDelete.id) // Replace with your actual delete API call
        await fetchUsers() // Refresh the users list
        setShowDeleteModal(false)
        setUserToDelete(null)
    } catch (error) {
        console.error("Error deleting user:", error)
    } finally {
        setDeleting(false)
    }
}

const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
}

const handleDeleteBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
        handleCloseDeleteModal()
    }
}
   
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

    const handleSearch = async (query) => {
        if (!query || query.trim().length === 0) {
            fetchUsers();
            return;
        }

        setSearchLoading(true);
        try {
            const response = await userAPI.searchByName(query.trim());
            setUsers(response.data);
        } catch (error) {
            if (error.response?.status === 404) {
                setUsers([]);
            } else {
                console.error("Error searching users:", error);
                // Show error to user instead of silent failure
                alert('Error searching users. Please try again.');
            }
        } finally {
            setSearchLoading(false);
        }
    };

    // Fix the debouncing logic
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
    };

    // eslint-disable-next-line no-unused-vars
    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }

        setDeleteLoading(userId);
        try {
            await userAPI.deleteUser(userId);
            // Remove user from local state
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            let errorMessage = "Failed to delete user";
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.status === 404) {
                errorMessage = "User not found";
            } else if (error.response?.status === 400) {
                errorMessage = "Cannot delete this user";
            }
            
            alert(errorMessage);
        } finally {
            setDeleteLoading(null);
        }
    };

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

        // Frontend validation
        if (formData.password !== formData.confirmPassword) {
            setCreateError("Passwords do not match")
            setCreateLoading(false)
            return
        }

        // Updated password validation to match backend
        if (formData.password.length < 8 || formData.password.length > 16) {
            setCreateError("Password must be 8-16 characters")
            setCreateLoading(false)
            return
        }

        // Password complexity validation to match backend
        if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
            setCreateError("Password must contain at least one uppercase letter and one special character")
            setCreateLoading(false)
            return
        }

        try {
            // Remove confirmPassword from the data sent to API
            // eslint-disable-next-line no-unused-vars
            const { confirmPassword, ...userData } = formData
            
            console.log('Sending user data:', userData) // Debug log
            
            const response = await userAPI.createUser(userData)
            
            console.log('API Response:', response.data) // Debug log
            
            // SUCCESS: If we reach here without throwing, user was created successfully
            // The backend returns the created user object on success
            
            // Refresh users list
            await fetchUsers()
            
            // Reset form and close modal
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                address: "",
                role: "normal_user",
            })
            
            setShowCreateModal(false)
            
        } catch (error) {
            // Handle different types of errors
            console.log('Full error object:', error) // Debug log
            console.log('Error response:', error.response?.data) // Debug log
            
            if (error.response?.data?.error) {
                // Backend validation error
                setCreateError(error.response.data.error)
            } else if (error.response?.status === 400) {
                setCreateError("Invalid data provided. Please check all fields.")
            } else if (error.response?.status === 401) {
                setCreateError("You are not authorized to create users.")
            } else {
                setCreateError("An error occurred while creating the user")
            }
            
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
            role: "normal_user",
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
                    className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create New User
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search users by name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {searchLoading && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                {showDeleteModal && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleDeleteBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer">
                            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete "{userToDelete?.name}"? This action cannot be undone and will remove all associated data.
                        </p>
                        <div className="flex space-x-3">
                            <button 
                                type="button" 
                                onClick={handleCloseDeleteModal}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {deleting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Deleting...
                                    </div>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}

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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                            {searchQuery ? 'No users found matching your search' : 'No users found'}
                        </td>
                    </tr>
                ) : (
                    users.map((user, index) => (
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => handleDeleteClick(user)}
                                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Create New User</h3>
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
                                        <option value="normal_user">Regular User</option>
                                        <option value="store_owner">Store Owner</option>
                                        <option value="admin">Admin</option>
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
                                        placeholder="Enter password (8-16 characters)"
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

export default UsersManagement