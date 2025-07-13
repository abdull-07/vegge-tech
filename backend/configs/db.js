import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.error('MONGO_URL is not defined in environment variables');
            process.exit(1);
        }
        
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            // Add any additional connection options if needed
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
