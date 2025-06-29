import React from 'react'
import logo from '../assets/nav-log0.svg'
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-text-light bg-background-dark">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-text-light/30 pb-6">
                {/* Left Side – Logo and About */}
                <div className="md:max-w-96">
                    <NavLink to="/">
                        <img
                            className="h-9"
                            src={logo}
                            alt="Veggetech"
                        />
                    </NavLink>
                    <p className="mt-6 text-sm">
                        At Veggetech, we bring you the freshest fruits and vegetables—
                        handpicked from farms, delivered with care, and always 100% natural.
                    </p>
                </div>

                {/* Right Side – Navigation + Contact */}
                <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-10 sm:gap-20">
                    {/* Import pages */}
                    <div>
                        <h2 className="font-semibold mb-5 text-text">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><NavLink to="/" className="hover:text-primary transition">Home</NavLink></li>
                            <li><NavLink to="/about" className="hover:text-primary transition">About Us</NavLink></li>
                            <li><NavLink to="/faq" className="hover:text-primary transition">FAQ</NavLink></li>
                            <li><NavLink to="/contact" className="hover:text-primary transition">Contact Us</NavLink></li>
                            <li><NavLink to="/privacy" className="hover:text-primary transition">Privacy Policy</NavLink></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold mb-5 text-text">Get in Touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+92-123-4567890</p>
                            <p>support@veggetech.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="pt-4 text-center text-xs md:text-sm pb-5 text-text-light">
                &copy; {new Date().getFullYear()} Veggetech. All rights reserved.
            </p>
        </footer>
    );
}

export default Footer
