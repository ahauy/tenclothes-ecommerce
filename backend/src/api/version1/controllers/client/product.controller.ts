import { Request, Response } from "express"
import { getListProductService, getProductDetailService } from "../../services/client/product.service"
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface"
import { IProduct } from "../../../../interfaces/model.interfaces"

export const getListProduct = async (req: Request<{}, {}, {}, IRequestQueryFilter>, res: Response): Promise<void> => {
  try {
    const queryFilter: IRequestQueryFilter = req.query

    const { products, currentPage, totalPages, totalProducts } = await getListProductService(queryFilter)

    res.status(200).json({
      status: true,
      message: "Lấy danh sách sản phẩm thành công!",
      data: {
        products,
        currentPage,
        totalPages,
        totalProducts
      }
    })
    return
  } catch (error) {
    console.error("Có lỗi trong getListProduct", error)

    res.status(500).json({
      status: false,
      message: "Hệ thống đang bảo trì hoặc gặp sự cố, vui lòng thử lại sau!",
      data: null,
    });
    return;
  }
} 

export const getProductDetail = async (req: Request<{slug: string}>, res: Response): Promise<void> => {
  try {
    const slug: string = req.params.slug

    const data: IProduct | null = await getProductDetailService(slug)
    
    if(!data) {
      res.status(404).json({
        status: false,
        message: "Không thể tìm thấy sản phẩm!",
        data: null
      })
      return
    } 

    res.status(200).json({
      status: true,
      message: "Lấy sản phẩm thành công!",
      data: {
        product: data
      }
    })
  } catch (error) {
    console.error("Có lỗi trong getListProduct", error)

    res.status(500).json({
      status: false,
      message: "Hệ thống đang bảo trì hoặc gặp sự cố, vui lòng thử lại sau!",
      data: null,
    });
    return;
  }
}