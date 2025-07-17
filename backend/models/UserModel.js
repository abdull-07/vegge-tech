import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
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
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" }, 
        quantity: { type: Number, default: 1 } 
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
