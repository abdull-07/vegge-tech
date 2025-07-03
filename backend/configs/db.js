import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database Connected"))

        await mongoose.connect(`${process.env.MONGODB_UID}/veggetech`)
    } catch (error) {
        console.log("error.massage")
    }
}

export default connectDB