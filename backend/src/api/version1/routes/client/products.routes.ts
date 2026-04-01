import express, { Router } from 'express';
import { getListProduct, getProductDetail } from '../../controllers/client/product.controller';

const productControllerClient: Router = express.Router()

productControllerClient.get("/", getListProduct)

productControllerClient.get("/:slug", getProductDetail)

export default productControllerClient;