import Card from "../components/Card"

const Features = () => {
    return (
        <div>
            {/* Main Features Section */}
            <div className="overflow-hidden bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                        <div className="lg:pr-8 lg:pt-4">
                            <div className="lg:max-w-lg">
                                <h2 className="text-base font-semibold leading-7 text-emerald-600">Store Reviews Made Simple</h2>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Why Choose StoreRate?</p>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    Everything you need to make informed shopping decisions and share your experiences with a trusted community of reviewers.
                                </p>
                                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                                    <div className="relative pl-9">
                                        <dt className="inline font-semibold text-gray-900">
                                            <div className="absolute left-1 top-1 h-5 w-5 text-emerald-600">
                                                ⭐
                                            </div>
                                            Rate & Review.
                                        </dt>
                                        <dd className="inline">Share your authentic experiences with a simple 1-5 star rating system and detailed reviews that help others make better shopping decisions.</dd>
                                    </div>
                                    <div className="relative pl-9">
                                        <dt className="inline font-semibold text-gray-900">
                                            <div className="absolute left-1 top-1 h-5 w-5 text-emerald-600">
                                                🔍
                                            </div>
                                            Smart Discovery.
                                        </dt>
                                        <dd className="inline">Find top-rated stores in your area with advanced search, filtering, and personalized recommendations based on your preferences.</dd>
                                    </div>
                                    <div className="relative pl-9">
                                        <dt className="inline font-semibold text-gray-900">
                                            <div className="absolute left-1 top-1 h-5 w-5 text-emerald-600">
                                                👥
                                            </div>
                                            Trusted Community.
                                        </dt>
                                        <dd className="inline">Connect with verified reviewers and build trust through authentic community feedback and recommendations from real shoppers.</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            {/* Placeholder for image - you can add your image here later */}
                            <div className="w-full max-w-none rounded-xl bg-gradient-to-br from-emerald-50 to-blue-50 shadow-xl ring-1 ring-gray-400/10 sm:w-96 h-96 flex items-center justify-center">
                                <span className="text-gray-400 text-lg">Your Image Here</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-gradient-to-r from-emerald-50/50 to-blue-50/50 py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Real feedback from our community of store reviewers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-white/30">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-lg">
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                "StoreRate helped me find the best local coffee shops. The reviews are honest and detailed, exactly what I needed!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="text-emerald-600 font-semibold">S</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Sarah Chen</div>
                                    <div className="text-sm text-gray-500">Coffee Enthusiast</div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-white/30">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-lg">
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                "As a business owner, StoreRate gives me valuable feedback from customers. It's helped improve my service quality."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold">M</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Mike Rodriguez</div>
                                    <div className="text-sm text-gray-500">Store Owner</div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-white/30">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-lg">
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                "The community here is amazing. I trust the reviews because they're from real people with real experiences."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="text-emerald-600 font-semibold">A</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">Alex Thompson</div>
                                    <div className="text-sm text-gray-500">Regular Reviewer</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Features