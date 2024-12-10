import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://samiran4209:Samiran123@cluster0.7efnk.mongodb.net/", {
    });
    console.log('MongoDB database connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process if the connection fails
  }
};

export default connectDB;
