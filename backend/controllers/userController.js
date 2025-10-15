import User from "../models/UserModel.js"
import { generateToken } from "../utils/generateToken.js"
import { validateEmail, validatePassword, validateName } from "../utils/emailValidator.js"
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/emailService.js"
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

        // Generate token for user
        const token = generateToken(newUser._id)

        // Send verification email
        try {
            await sendVerificationEmail(
                newUser.email,
                newUser.name,
                verificationToken
            );
            console.log(`Verification email sent to ${newUser.email}`);
        } catch (emailError) {
            console.error("Error sending verification email:", emailError);
            // Log the error but don't fail the registration
            // We'll still create the user but warn about the email issue
            
            // Set token as httpOnly cookie even if email fails
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            return res.status(201).json({
                message: "User registered successfully, but there was an issue sending the verification email. Please use the 'Resend verification email' option.",
                emailError: true,
                token,
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    isVerified: newUser.isVerified
                }
            });
        }

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
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
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
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
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
        let { token } = req.params;
        
        if (!token) {
            console.log("No token provided in request");
            return res.status(400).json({ message: "Verification token is required" });
        }
        
        // Decode the token in case it was URL encoded
        token = decodeURIComponent(token);
        
        console.log(`Attempting to verify email with token: ${token}`);
        console.log(`Token length: ${token.length}`);
        
        // Find user with the verification token - without expiry check first
        const user = await User.findOne({ verificationToken: token });
        
        if (!user) {
            console.log(`No user found with token: ${token}`);
            // Check if user exists but is already verified
            const verifiedUser = await User.findOne({ 
                verificationToken: { $exists: false },
                isVerified: true 
            });
            if (verifiedUser) {
                console.log("User might already be verified");
                return res.status(400).json({ 
                    message: "This email has already been verified. You can now login with your credentials." 
                });
            }
            return res.status(400).json({ 
                message: "Invalid verification token. Please request a new verification email." 
            });
        }
        
        console.log(`User found: ${user.email}, Token expiry: ${user.verificationExpires}`);
        
        // Now check if token is expired
        if (user.verificationExpires) {
            const tokenExpiry = new Date(user.verificationExpires);
            const now = new Date();
            
            console.log(`Token expiry check: Expiry=${tokenExpiry.toISOString()}, Now=${now.toISOString()}`);
            
            if (tokenExpiry < now) {
                console.log('Token has expired');
                
                // Generate a new token for the user
                const newVerificationToken = crypto.randomBytes(32).toString('hex');
                const newTokenExpiry = new Date();
                newTokenExpiry.setHours(newTokenExpiry.getHours() + 24); // Token valid for 24 hours
                
                // Update user with new token
                user.verificationToken = newVerificationToken;
                user.verificationExpires = newTokenExpiry;
                await user.save();
                
                // Send a new verification email
                try {
                    await sendVerificationEmail(
                        user.email,
                        user.name,
                        newVerificationToken
                    );
                    console.log(`New verification email sent to ${user.email}`);
                } catch (emailError) {
                    console.error("Error sending new verification email:", emailError);
                }
                
                return res.status(400).json({ 
                    message: "Verification token has expired. A new verification email has been sent to your email address." 
                });
            }
        }
        
        // If we get here, the token is valid and not expired
        console.log(`Verifying user: ${user.email}`);
        
        // Update user as verified
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();
        
        console.log(`User ${user.email} verified successfully`);
        
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
        
        // Send verification email
        try {
            await sendVerificationEmail(
                user.email,
                user.name,
                verificationToken
            );
            console.log(`Verification email resent to ${user.email}`);
        } catch (emailError) {
            console.error("Error sending verification email:", emailError);
            // Return specific error for email sending failure
            return res.status(500).json({ 
                message: "Failed to send verification email. Please try again later.",
                emailError: true
            });
        }
        
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
        
        // Send password reset email
        try {
            await sendPasswordResetEmail(
                user.email,
                user.name,
                resetToken
            );
            console.log(`Password reset email sent to ${user.email}`);
        } catch (emailError) {
            console.error("Error sending password reset email:", emailError);
            // Return specific error for email sending failure
            return res.status(500).json({ 
                message: "Failed to send password reset email. Please try again later.",
                emailError: true
            });
        }
        
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
}// U
// pdate user profile
// /api/user/update-profile
export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        
        // Validate name
        if (name) {
            const nameValidation = validateName(name);
            if (!nameValidation.isValid) {
                return res.status(400).json({ message: nameValidation.message });
            }
        }
        
        // Find user by ID
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Update user fields
        if (name) user.name = name.trim();
        
        // Save updated user
        await user.save();
        
        // Return updated user without password
        const updatedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            role: user.role
        };
        
        return res.status(200).json({ 
            message: "Profile updated successfully", 
            user: updatedUser 
        });
    } catch (error) {
        console.error("Update profile error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

// Change user password
// /api/user/change-password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }
        
        // Validate new password strength
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ message: passwordValidation.message });
        }
        
        // Find user by ID
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Verify current password
        const isPasswordMatch = await user.matchPassword(currentPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};//
//  Add a new address for the user
// /api/user/address
export const addAddress = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { firstName, lastName, streetAddress, phoneNumber, city, state, zipCode, isDefault } = req.body;

        // Basic validation
        if (!firstName || !lastName || !streetAddress || !phoneNumber || !city || !state || !zipCode) {
            return res.status(400).json({ message: "All address fields are required" });
        }

        // Find user by ID
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create new address object
        const newAddress = {
            firstName,
            lastName,
            streetAddress,
            phoneNumber,
            city,
            state,
            zipCode,
            isDefault: isDefault || false
        };

        // If this is the first address or set as default, update other addresses
        if (isDefault || user.addresses.length === 0) {
            // Set all existing addresses to non-default
            user.addresses.forEach(address => {
                address.isDefault = false;
            });
            
            // Set the new address as default
            newAddress.isDefault = true;
        }

        // Add the new address to the user's addresses array
        user.addresses.push(newAddress);
        
        // Save the updated user
        await user.save();
        
        return res.status(201).json({
            message: "Address added successfully",
            address: newAddress,
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Add address error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

// Get all addresses for the user
// /api/user/addresses
export const getAddresses = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Find user by ID
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({
            addresses: user.addresses || []
        });
    } catch (error) {
        console.error("Get addresses error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

// Update an address
// /api/user/address/:addressId
export const updateAddress = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { addressId } = req.params;
        const { firstName, lastName, streetAddress, phoneNumber, city, state, zipCode, isDefault } = req.body;

        // Basic validation
        if (!firstName || !lastName || !streetAddress || !phoneNumber || !city || !state || !zipCode) {
            return res.status(400).json({ message: "All address fields are required" });
        }

        // Find user by ID
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the address to update
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        
        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Update the address
        user.addresses[addressIndex] = {
            ...user.addresses[addressIndex].toObject(),
            firstName,
            lastName,
            streetAddress,
            phoneNumber,
            city,
            state,
            zipCode,
            isDefault: isDefault || false
        };

        // If set as default, update other addresses
        if (isDefault) {
            // Set all other addresses to non-default
            user.addresses.forEach((address, index) => {
                if (index !== addressIndex) {
                    address.isDefault = false;
                }
            });
            
            // Ensure this address is default
            user.addresses[addressIndex].isDefault = true;
        }

        // Save the updated user
        await user.save();
        
        return res.status(200).json({
            message: "Address updated successfully",
            address: user.addresses[addressIndex],
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Update address error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

// Delete an address
// /api/user/address/:addressId
export const deleteAddress = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { addressId } = req.params;

        // Find user by ID
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the address to delete
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        
        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Check if this was the default address
        const wasDefault = user.addresses[addressIndex].isDefault;

        // Remove the address
        user.addresses.splice(addressIndex, 1);

        // If the deleted address was the default and there are other addresses,
        // set the first remaining address as default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        // Save the updated user
        await user.save();
        
        return res.status(200).json({
            message: "Address deleted successfully",
            addresses: user.addresses
        });
    } catch (error) {
        console.error("Delete address error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

// Add item to cart
// /api/user/cart/add
export const addToCart = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { productId, quantity = 1, name, price, imageUrl } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Find user by ID
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if item already exists in cart
        const existingItemIndex = user.cartItem.findIndex(
            item => item.productId.toString() === productId.toString()
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            user.cartItem[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            const cartItem = {
                productId,
                quantity,
                name,
                price,
                imageUrl
            };
            user.cartItem.push(cartItem);
        }

        // Save the updated user
        await user.save();
        
        return res.status(200).json({
            message: "Item added to cart successfully",
            cartItem: user.cartItem
        });
    } catch (error) {
        console.error("Add to cart error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

// Update cart item quantity
// /api/user/cart/update
export const updateCartItem = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        // Find user by ID
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the cart item
        const cartItemIndex = user.cartItem.findIndex(
            item => item.productId.toString() === productId.toString()
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            user.cartItem.splice(cartItemIndex, 1);
        } else {
            // Update quantity
            user.cartItem[cartItemIndex].quantity = quantity;
        }

        // Save the updated user
        await user.save();
        
        return res.status(200).json({
            message: "Cart updated successfully",
            cartItem: user.cartItem
        });
    } catch (error) {
        console.error("Update cart error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

// Remove item from cart
// /api/user/cart/remove
export const removeFromCart = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Find user by ID
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove the item from cart
        user.cartItem = user.cartItem.filter(
            item => item.productId.toString() !== productId.toString()
        );

        // Save the updated user
        await user.save();
        
        return res.status(200).json({
            message: "Item removed from cart successfully",
            cartItem: user.cartItem
        });
    } catch (error) {
        console.error("Remove from cart error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

// Get user's cart
// /api/user/cart
export const getCart = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Find user by ID - don't populate for now to avoid issues
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // console.log("Cart items from DB:", user.cartItem);
        
        return res.status(200).json({
            cartItem: user.cartItem || [],
            debug: {
                userId: req.userId,
                cartItemCount: user.cartItem ? user.cartItem.length : 0
            }
        });
    } catch (error) {
        console.error("Get cart error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

// Clear user's cart (typically after successful order)
// /api/user/cart/clear
export const clearCart = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Find user by ID
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Clear the cart
        user.cartItem = [];

        // Save the updated user
        await user.save();
        
        return res.status(200).json({
            message: "Cart cleared successfully",
            cartItem: []
        });
    } catch (error) {
        console.error("Clear cart error:", error.message);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};