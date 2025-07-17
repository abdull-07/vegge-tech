import User from "../models/UserModel.js"
import { generateToken } from "../utils/generateToken.js"
import { validateEmail, validatePassword, validateName } from "../utils/emailValidator.js"
import crypto from 'crypto'


// * User Registration Controller, This function handles user registration by checking if the user already exists,
//  /api/user/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Validate name
        const nameValidation = validateName(name)
        if (!nameValidation.isValid) {
            return res.status(400).json({ message: nameValidation.message })
        }

        // Validate email format and check for temp/fake emails
        const emailValidation = await validateEmail(email)
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: emailValidation.message })
        }

        // Validate password strength
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.isValid) {
            return res.status(400).json({ message: passwordValidation.message })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() })
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email address" })
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const tokenExpiry = new Date()
        tokenExpiry.setHours(tokenExpiry.getHours() + 24) // Token valid for 24 hours

        // Create new user
        const newUser = await User.create({ 
            name: name.trim(), 
            email: email.toLowerCase(), 
            password,
            verificationToken,
            verificationExpires: tokenExpiry
        })

        // TODO: Send verification email with token
        // This would typically be implemented with an email service like SendGrid, Mailgun, etc.
        // For now, we'll skip the actual email sending and just generate the token

        // Generate token for user
        const token = generateToken(newUser._id)

        // Set token as httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(201).json({
            message: "User registered successfully! Please check your email to verify your account.",
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                isVerified: newUser.isVerified
            }
        })

    } catch (error) {
        console.error("Registration error:", error.message)

        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(409).json({ message: "Email address is already registered" })
        }

        res.status(500).json({ message: "Something went wrong, please try again later." })
    }
}


// * User Login Controller, This function handles user login by checking if the user exists and if the password matches.
//  /api/user/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) { 
            return res.status(400).json({ message: "Email and Password are required" }) 
        }

        // Find user and validate email format
        const emailValidation = await validateEmail(email)
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: emailValidation.message })
        }

        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) { 
            // Use a generic message for security (don't reveal if user exists)
            return res.status(401).json({ message: "Invalid email or password" }) 
        }

        const isPasswordMatch = await user.matchPassword(password)
        if (!isPasswordMatch) { 
            // Use a generic message for security
            return res.status(401).json({ message: "Invalid email or password" }) 
        }

        // Update last login timestamp
        user.lastLogin = new Date()
        await user.save()

        const token = generateToken(user._id)

        // Set token as httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role
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
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findById(req.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
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
// Verify user email
// /api/user/verify-email/:token
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        if (!token) {
            return res.status(400).json({ message: "Verification token is required" });
        }
        
        // Find user with the verification token
        const user = await User.findOne({ 
            verificationToken: token,
            verificationExpires: { $gt: Date.now() } // Check if token hasn't expired
        });
        
        if (!user) {
            return res.status(400).json({ 
                message: "Invalid or expired verification token. Please request a new verification email." 
            });
        }
        
        // Update user as verified
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();
        
        return res.status(200).json({ 
            message: "Email verified successfully! You can now login with your credentials." 
        });
    } catch (error) {
        console.error("Email verification error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
}

// Resend verification email
// /api/user/resend-verification
export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        // Validate email format
        const emailValidation = await validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: emailValidation.message });
        }
        
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            // For security reasons, don't reveal if user exists
            return res.status(200).json({ 
                message: "If your email exists in our system, a verification link will be sent to your inbox." 
            });
        }
        
        // If user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: "This email is already verified." });
        }
        
        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valid for 24 hours
        
        // Update user with new token
        user.verificationToken = verificationToken;
        user.verificationExpires = tokenExpiry;
        await user.save();
        
        // TODO: Send verification email with token
        // This would typically be implemented with an email service
        
        return res.status(200).json({ 
            message: "If your email exists in our system, a verification link will be sent to your inbox." 
        });
    } catch (error) {
        console.error("Resend verification error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
}

// Reset password request
// /api/user/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        // Validate email format
        const emailValidation = await validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: emailValidation.message });
        }
        
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            // For security reasons, don't reveal if user exists
            return res.status(200).json({ 
                message: "If your email exists in our system, a password reset link will be sent to your inbox." 
            });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpiry = new Date();
        resetExpiry.setHours(resetExpiry.getHours() + 1); // Token valid for 1 hour
        
        // Update user with reset token
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpiry;
        await user.save();
        
        // TODO: Send password reset email with token
        // This would typically be implemented with an email service
        
        return res.status(200).json({ 
            message: "If your email exists in our system, a password reset link will be sent to your inbox." 
        });
    } catch (error) {
        console.error("Forgot password error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
}

// Reset password with token
// /api/user/reset-password/:token
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        if (!token || !password) {
            return res.status(400).json({ message: "Token and new password are required" });
        }
        
        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ message: passwordValidation.message });
        }
        
        // Find user with the reset token
        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if token hasn't expired
        });
        
        if (!user) {
            return res.status(400).json({ 
                message: "Invalid or expired reset token. Please request a new password reset." 
            });
        }
        
        // Update user password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        
        return res.status(200).json({ 
            message: "Password reset successfully! You can now login with your new password." 
        });
    } catch (error) {
        console.error("Reset password error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
}