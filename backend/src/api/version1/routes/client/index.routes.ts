import { type Express } from "express"
import authRoutesClient from "./auth.routes" 
import productControllerClient from "./products.routes"
import orderRouterClient from "./order.routes"
import checkoutRouter from "./checkout.routes"
import cartRouter from "./cart.routes"

const mainV1RoutesClient = (app: Express): void => {
  const apiVersion1 = "/api/version1"

  app.use(`${apiVersion1}/auth`, authRoutesClient)

  app.use(`${apiVersion1}/products`, productControllerClient)

  app.use(`${apiVersion1}/orders`, orderRouterClient)

  app.use(`${apiVersion1}/checkout`, checkoutRouter)

  app.use(`${apiVersion1}/cart`, cartRouter)
}

export default mainV1RoutesClient