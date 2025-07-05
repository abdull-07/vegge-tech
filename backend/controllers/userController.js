import User from "../models/UserModel.js"
import { generateToken } from "../utils/generateToken.js"


// * User Registration Controller, This function handles user registration by checking if the user already exists,
//  /api/user/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) { return res.status(400).json({ message: "All fields are required" }) } // if any one field is emprty

        const existingUser = await User.findOne({ email })
        if (existingUser) { return res.status(409).json({ message: "User already exist" }) } // check if user exists

        const newUser = await User.create({ name, email, password }) // create new user

        const token = generateToken(newUser._id) //generate token for user

        // Set token as httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(201).json({
            message: "User Registered Successfully",
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        })

    } catch (error) {
        console.error("Registration error:", error.message)

        res.status(500).json({ message: "Something went wrong, please try again later." })
    }
}


// * User Login Controller, This function handles user login by checking if the user exists and if the password matches.
//  /api/user/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) { return res.status(400).json({ message: "Email and Password is required" }) } // if any one field is empty

        const user = await User.findOne({ email })
        if (!user) { return res.status(404).json({ message: "User not found" }) } // check if user exists

        const isPasswordMatch = await user.matchPassword(password) // check if password matches
        if (!isPasswordMatch) { return res.status(401).json({ message: "Invalid Passworrd" }) } // if password does not match

        const token = generateToken(user._id) // generate token for user

        // Set token as httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })


        res.status(200).json({
            message: "User logs in Successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        })

    } catch (error) {
        console.error("Login error:", error.message)
        res.status(500).json({ message: "Something went wrong, please try again later." })

    }
}

// Check authenticated user
//  /api/user/check-auth
export const checkAuthuser = async (req, res) => {
    try {

        const user = await User.findById(req.userId).select("-password")

        return res.status(200).json({ user })
    } catch (error) {
        console.error("Authentication error:", error.message)
        res.status(500).json({ message: "Internal Server Error" })

    }
}

// User Logout Controller
//  /api/user/logout
export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict', // <-- fix here
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        return res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.error("Logout error:", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
