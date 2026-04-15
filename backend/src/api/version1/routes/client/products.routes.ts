import express, { Router } from "express";
import {
  getBestSelling,
  getCategoryFilters,
  getLatestCollection,
  getListProduct,
  getProductDetail,
  getRelatedProducts,
  searchProducts,
} from "../../controllers/client/product.controller";

const productControllerClient: Router = express.Router();

productControllerClient.get("/category/:slug", getListProduct);

productControllerClient.get("/category/:slug/filters", getCategoryFilters);

productControllerClient.get("/latest-collection", getLatestCollection);

productControllerClient.get("/best-selling", getBestSelling);

productControllerClient.get("/related-collection", getRelatedProducts)

productControllerClient.get("/search", searchProducts)

productControllerClient.get("/:slug", getProductDetail);

export default productControllerClient;
