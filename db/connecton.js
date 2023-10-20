import mongoose from "mongoose";

mongoose.set('strictQuery', false)
console.log('mongodb url', process.env.DBCONNECTION)
export const connectMongoDB = async () => {
  try {
    const connectDB = await mongoose.connect(`mongodb://127.0.0.1:27017/los`);
    console.log(`Database connected: ${connectDB.connection.host}`.cyan.underline);
  } 
  catch (error) {
      console.log(error);
      process.exit(1);
  }
}

