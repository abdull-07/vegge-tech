import heroImg from "../assets/herro-header-1.jpeg";
import {Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="w-full h-[500px] md:h-[600px] relative overflow-hidden">
      <img
        src={heroImg}
        alt="Fresh and Pure"
        className="w-full h-full object-cover"
      />

      {/* Optional text overlay */}
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
          100% Fresh and Pure Natural
        </h1>
        <p className="mt-4 text-white text-lg md:text-xl font-medium">
          Handpicked goodness delivered to your door.
        </p>
        <Link to="/all-products" className="mt-6 bg-primary hover:bg-secondary-hover hover:translate-x- text-text-white px-6 py-3 rounded-full transition duration-300">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Hero;
