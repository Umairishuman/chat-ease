import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONOGODB_URI;

async function connectDB() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI is not defined in environment variables');
        throw new Error('Please define the MONGODB_URI environment variable');
    }
    
}