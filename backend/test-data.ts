import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./src/configs/database";
import Product from "./src/models/product.model";
import { Order } from "./src/models/order.model";

async function main() {
  await connectDB();
  console.log("DB connected successfully.");

  const products = await Product.find({ deleted: false }).limit(3).lean();
  console.log("Sample Products:", JSON.stringify(products, null, 2));

  const orders = await Order.find({}).limit(3).lean();
  console.log("Sample Orders:", JSON.stringify(orders, null, 2));

  process.exit(0);
}

main();
