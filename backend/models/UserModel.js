import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be less than 50 characters']
    },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        trim: true,
        index: true // Add index for faster queries
    },
    password: { 
        type: String, 
        required: true, 
        minlength: [8, 'Password must be at least 8 characters long'] 
    },
    profilePicture: {
        type: String,
        default: 'default-avatar.png'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
    cartItem: [{ 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true }, 
        quantity: { type: Number, default: 1, min: 1 },
        // Optional fields for faster frontend rendering
        name: { type: String },
        price: { type: Number },
        imageUrl: { type: String }
    }],
    // Address information
    addresses: [{
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        streetAddress: { type: String, trim: true },
        phoneNumber: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        zipCode: { type: String, trim: true },
        isDefault: { type: Boolean, default: false }
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true })


// Hashing password beforeing saving 
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) { return next() }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// Match the password when user logs in
// This method will be used in the userController.js to compare the password entered by the user
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User
