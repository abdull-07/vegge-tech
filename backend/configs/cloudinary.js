import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            // cloudinary_url: process.env.CLOUDINARY_URL,
        })
        console.log(`Cloudinary connected: ${cloudinary.config().cloudinary_cloud_name}`);
    } catch (error) {
        console.error(`Cloudinary connection error: ${error.message}`);
        process.exit(1);
    }
}

export default connectCloudinary;