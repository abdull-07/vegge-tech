import heroImg from "../assets/herro-header-1.jpeg";
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="w-full h-[600px] md:h-[700px] relative overflow-hidden">
      <img
        src={heroImg}
        alt="Fresh and Pure"
        className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
      />

      {/* Enhanced overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
            <span className="text-white text-sm font-medium">🌱 Farm Fresh Quality</span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl mb-6">
            100% Fresh and
            <span className="block text-primary drop-shadow-lg">Pure Natural</span>
          </h1>
          
          {/* Subtitle */}
          <p className="mt-4 text-white text-lg md:text-xl lg:text-2xl font-medium max-w-2xl mx-auto drop-shadow-lg">
            Handpicked goodness delivered to your door in just 60 minutes
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link 
              to="/all-products" 
              className="group bg-primary hover:bg-secondary text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
            >
              🛒 Shop Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link 
              to="/deals-offers" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-xl"
            >
              🔥 View Deals
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/90">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">Fresh Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">60 Min Delivery</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;
