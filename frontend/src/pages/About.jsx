import React, { useEffect, useState } from 'react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className={`bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto px-4 text-center relative">
          <div className="absolute inset-0 "></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">About Veggetech</h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto drop-shadow-md">
              Bringing fresh, healthy groceries from farm to your doorstep with love and care
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Story Section */}
        <section className={`mb-20 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                At <strong className="text-primary">Veggetech</strong>, we started with a simple mission: to make fresh,
                healthy groceries accessible to everyone. Founded by a team of food enthusiasts and tech innovators,
                we saw the gap between quality produce and convenient delivery.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We partner directly with trusted local farms to bring you the freshest fruits, vegetables, and
                grocery essentials. Every product is handpicked, quality-checked, and delivered with care to
                ensure you get nothing but the best.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5000+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-gray-600">Partner Farms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 shadow-lg">
                <div className="text-6xl mb-4 text-center">🌱</div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Farm to Table</h3>
                <p className="text-gray-600 text-center">
                  Direct sourcing ensures maximum freshness and supports local farming communities
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className={`mb-20 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Our Foundation</h2>
              <p className="text-lg text-indigo-700 max-w-2xl mx-auto">
                Built on strong values and a clear vision for the future of grocery shopping
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Our Mission</h3>
                <p className="text-white/90 text-center text-sm">
                  To revolutionize grocery shopping by delivering the freshest, highest-quality produce
                  directly from farms to your doorstep, making healthy eating convenient and affordable.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Our Vision</h3>
                <p className="text-white/90 text-center text-sm">
                  To become the leading digital grocery platform, creating a sustainable ecosystem
                  that benefits customers, farmers, and communities while promoting healthy living.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center">Our Values</h3>
                <p className="text-white/90 text-center text-sm">
                  Quality, transparency, sustainability, and customer satisfaction drive everything we do.
                  We believe in building trust through consistent excellence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className={`mb-20 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Why Choose Veggetech?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">100% Fresh & Organic</h3>
                  <p className="text-gray-600 text-sm">Handpicked produce from certified organic farms</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Lightning Fast Delivery</h3>
                  <p className="text-gray-600 text-sm">Same-day delivery within 60 minutes</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Transparent Pricing</h3>
                  <p className="text-gray-600 text-sm">No hidden charges, fair prices for everyone</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">24/7 Customer Support</h3>
                  <p className="text-gray-600 text-sm">Always here to help with any questions</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Secure Payments</h3>
                  <p className="text-gray-600 text-sm">Multiple payment options with secure checkout</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Supporting Local Farmers</h3>
                  <p className="text-gray-600 text-sm">Direct partnerships that benefit farming communities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={`mb-20 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working together to bring you the best grocery experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white">👨‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ahmed Khan</h3>
              <p className="text-primary font-medium mb-2">CEO & Founder</p>
              <p className="text-gray-600 text-sm">10+ years in food industry and sustainable agriculture</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-secondary to-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white">👩‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Sarah Ali</h3>
              <p className="text-primary font-medium mb-2">CTO</p>
              <p className="text-gray-600 text-sm">Tech innovator focused on seamless user experiences</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-white">🌾</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hassan Malik</h3>
              <p className="text-primary font-medium mb-2">Head of Operations</p>
              <p className="text-gray-600 text-sm">Ensuring quality and timely delivery across all regions</p>
            </div>
          </div>
        </section>

        {/* Trust & Stats */}
        <section className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Trusted by Thousands</h2>
            <p className="text-xl mb-8 text-white/90">
              Join our growing community of health-conscious customers who trust us for their daily grocery needs
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-yellow-200">5000+</div>
                <div className="text-white/90 font-medium">Happy Customers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-yellow-200">50+</div>
                <div className="text-white/90 font-medium">Partner Farms</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-yellow-200">10K+</div>
                <div className="text-white/90 font-medium">Orders Delivered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all">
                <div className="text-3xl md:text-4xl font-bold mb-2 text-yellow-200">99%</div>
                <div className="text-white/90 font-medium">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;