import React from 'react'
import { bannerImages } from '../assets/images.js'
import { FaArrowRight } from "react-icons/fa"; // FontAwesome
import { HiArrowRight } from "react-icons/hi"; // HeroIcons
import { Link } from 'react-router-dom'

const Banner = ({hideButton}) => {
    return (
        <div>
            <div className="w-full h-[500px] md:h-[600px] relative overflow-hidden">
                <img
                    src={bannerImages.herro2}
                    alt="Fresh and Pure"
                    className="w-full h-full object-cover"
                />

                {/* Optional text overlay */}
                <div className="absolute inset-0 bg-black/30 flex flex-col items-end-safe justify-center text-center px-4">
                    <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                        Why We Are the Best
                    </h1>
                    <p className="mt-4 text-white text-lg md:text-xl font-medium max-w-2xl">
                        We deliver farm-fresh fruits and vegetables directly to your doorstep,
                        ensuring purity, nutrition, and unbeatable quality every time.
                    </p>
                    {!hideButton && (<Link 
                        to="/all-products"
                        className="group mt-6 bg-primary hover:bg-secondary-hover text-text-white px-6 py-3 rounded-full transition duration-300 inline-flex items-center gap-2"
                    >
                        Explore Products
                        <span className="transition-transform transform group-hover:translate-x-1 duration-300">
                            <HiArrowRight className="w-5 h-5 text-white" />
                        </span>
                    </Link>)}
                </div>
            </div>
        </div>
    )
}

export default Banner
