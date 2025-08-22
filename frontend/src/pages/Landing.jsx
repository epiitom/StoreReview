import { Link } from "react-router-dom"
import Button from "../components/Button"
import Card from "../components/Card"
import Hero from "../components/Hero"
import Features from "../components/Features"
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      <nav className="relative z-7 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-lg text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-emerald-600">StoreReview</span>
            </div>

         

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="px-4 py-2 cursor-pointer text-sm border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="px-4 py-2 cursor-pointer text-sm bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero/>

      {/* Features Section */}
     <Features/>

      {/* Secondary CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card className="relative overflow-hidden p-12 shadow-xl rounded-2xl border border-white/20 bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Join Our Community?</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Start rating stores, discovering new places, and helping others make better shopping decisions today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register" className="group">
                <Button
                  size="lg"
                  className="px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 transform hover:-translate-y-1"
                >
                  Create Free Account
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Button>
              </Link>

              <div className="text-center">
                <p className="text-gray-500 mb-2">Already have an account?</p>
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200 text-lg"
                >
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              By joining StoreReview, you agree to our
              <a href="/terms" className="text-emerald-600 hover:text-emerald-700 ml-1">
                Terms of Service
              </a>{" "}
              and
              <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 ml-1">
                Privacy Policy
              </a>
            </p>
            <div>
            <p className="text-xs text-gray-400">© 2025 StoreReview. All rights reserved.</p>
            <p className ="text-neutral-600">Created by Prathmesh Kale</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
