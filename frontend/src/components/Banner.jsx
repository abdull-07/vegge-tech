import React from 'react'
import { bannerImages } from '../assets/images.js'
import { HiArrowRight } from "react-icons/hi";
import { Link } from 'react-router-dom'

const Banner = ({hideButton}) => {
    return (
        <div className="relative">
            <div className="w-full h-[600px] md:h-[700px] relative overflow-hidden">
                <img
                    src={bannerImages.herro2}
                    alt="Why We Are the Best"
                    className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />

                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/40 to-transparent"></div>
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Quality badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                            <span className="text-white text-sm font-medium">🏆 Premium Quality</span>
                        </div>
                        
                        {/* Main heading */}
                        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl mb-6">
                            Why We Are
                            <span className="block text-primary drop-shadow-lg">the Best</span>
                        </h1>
                        
                        {/* Enhanced description */}
                        <p className="mt-6 text-white text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
                            We deliver farm-fresh fruits and vegetables directly to your doorstep,
                            ensuring purity, nutrition, and unbeatable quality every time.
                        </p>
                        
                        {/* Feature highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-3xl mb-3">🚜</div>
                                <h3 className="text-white font-bold text-lg mb-2">Farm Direct</h3>
                                <p className="text-white/80 text-sm">Sourced directly from local farms</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-3xl mb-3">⚡</div>
                                <h3 className="text-white font-bold text-lg mb-2">60 Min Delivery</h3>
                                <p className="text-white/80 text-sm">Lightning fast delivery service</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="text-3xl mb-3">🛡️</div>
                                <h3 className="text-white font-bold text-lg mb-2">Quality Assured</h3>
                                <p className="text-white/80 text-sm">100% satisfaction guarantee</p>
                            </div>
                        </div>
                        
                        {/* CTA Button */}
                        {!hideButton && (
                            <Link 
                                to="/all-products"
                                className="group inline-flex items-center gap-3 bg-primary hover:bg-secondary text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
                            >
                                <span>🌱 Explore Products</span>
                                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        )}
                    </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>
        </div>
    )
}

export default Banner
