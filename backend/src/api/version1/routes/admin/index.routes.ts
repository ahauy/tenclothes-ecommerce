import { type Express } from "express"
import authRoutesAdmin from "./auth.routes"
import productRouter from "./product.routes"

const mainV1RoutesAdmin = (app: Express): void => {
  const apiVersion1Admin = "/api/version1/admin"

  app.use(`${apiVersion1Admin}/auth`, authRoutesAdmin)

  app.use(`${apiVersion1Admin}/product`, productRouter)
}

export default mainV1RoutesAdmin