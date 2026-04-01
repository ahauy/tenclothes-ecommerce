import mongoose from "mongoose";

// LvW6DWEQ4goRp4cG
// e-commerce_db_user
// mongodb+srv://e-commerce_db_user:LvW6DWEQ4goRp4cG@cluster0.nfyidlt.mongodb.net/?appName=Cluster0

export const connectDB = async(): Promise<void> => {
  try {
    await mongoose.connect(process.env["MONGODB_URL"]!)
    console.log("Liên kết CSDL thành công!")
  } catch (error) {
    console.error("Liên kết cơ sở dữ liệu thất bại: ", error)
    process.exit(1)
  }
}