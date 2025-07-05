import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, require: true, trim: true },
    email: { type: String, require: true, unique: true, lowercase: true },
    password: { type: String, require: true, minlength: 8 },
    cartItem: { productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" }, quantity: { type: Number, default: 0 } }
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
