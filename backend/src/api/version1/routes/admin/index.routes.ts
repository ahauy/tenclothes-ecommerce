import { type Express } from "express"
import authRoutesAdmin from "./auth.routes"
import productRouter from "./product.routes"
import uploadRouter from "./upload.routes"
import categoryRouter from "./category.routes"
import orderRouter from "./order.routes"
import reviewRouterAdmin from "./review.routes"
import dashboardRouter from "./dashboard.routes"
import userRouter from "./user.routes"
import staffRouter from "./staff.routes"

const mainV1RoutesAdmin = (app: Express): void => {
  const apiVersion1Admin = "/api/version1/admin"

  app.use(`${apiVersion1Admin}/auth`, authRoutesAdmin)

  app.use(`${apiVersion1Admin}/products`, productRouter)
  app.use(`${apiVersion1Admin}/orders`, orderRouter)
  app.use(`${apiVersion1Admin}/upload`, uploadRouter)
  app.use(`${apiVersion1Admin}/category`, categoryRouter)
  app.use(`${apiVersion1Admin}/reviews`, reviewRouterAdmin)
  app.use(`${apiVersion1Admin}/dashboard`, dashboardRouter)
  app.use(`${apiVersion1Admin}/user`, userRouter)
  app.use(`${apiVersion1Admin}/staffs`, staffRouter)
  app.use(`${apiVersion1Admin}/staff`, staffRouter)
}

export default mainV1RoutesAdmin