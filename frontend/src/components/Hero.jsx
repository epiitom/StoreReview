import { Link } from "react-router-dom"
import Button from "../components/Button"

const Hero = () => {
      return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="flex justify-center items-center mb-8">
      <span className="bg-gradient-to-r from-emerald-50 cursor-pointer to-blue-50 border border-emerald-200/60 py-3 px-8 rounded-full text-sm font-medium text-emerald-700 shadow-lg shadow-emerald-100/50 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out">
      ✨ Rate stores you love. Create stores that grow.
      </span>
      </div>
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Rate and Discover
              <span className="block text-emerald-600">Amazing Stores</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
              Join our trusted community to share authentic experiences, discover top-rated stores, and help others make
              confident shopping decisions with real reviews from real people.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/register" className="group">
                <Button
                  size="md"
                  className="px-7 py-3.5 cursor-pointer text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 "
                >
                  Start Rating Stores
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Button>
              </Link>

              <Link to="/login">
                <Button
                  variant="outline"
                  size="md"
                  className="px-7 py-3 cursor-pointer text-lg font-semibold rounded-xl border-2 border-emerald-600 text-emerald-600 hover:bg-neutral-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="text-2xl font-bold text-emerald-600">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="text-2xl font-bold text-blue-600">5K+</div>
                <div className="text-sm text-gray-600">Stores Rated</div>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                <div className="text-2xl font-bold text-emerald-600">50K+</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
}
export default Hero