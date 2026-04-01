import { type Express } from "express"
import authRoutesClient from "./auth.routes" 
import productControllerClient from "./products.routes"

const mainV1RoutesClient = (app: Express): void => {
  const apiVersion1 = "/api/version1"

  app.use(`${apiVersion1}/auth`, authRoutesClient)

  app.use(`${apiVersion1}/products`, productControllerClient)
}

export default mainV1RoutesClient