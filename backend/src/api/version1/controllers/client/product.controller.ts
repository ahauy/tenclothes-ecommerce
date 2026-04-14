import { Request, Response } from "express"
import { getBestSellingService, getCategoryFilterService, getLatestCollectionService, getListProductService, getProductDetailService, getRelatedProductsService } from "../../services/client/product.service"
import { IRequestQueryFilter } from "../../../../interfaces/reqQuery.interface"
import { IProduct } from "../../../../interfaces/model.interfaces"
import ApiError from "../../../../helpers/ApiError"

export const getListProduct = async (req: Request<{slug?: string}, {}, {}, IRequestQueryFilter>, res: Response): Promise<void> => {
  try {
    const queryFilter: IRequestQueryFilter = req.query
    const slug: string | undefined = req.params.slug

    const { products, currentPage, totalPages, totalProducts } = await getListProductService(queryFilter, slug)

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
    console.error("Có lỗi trong getListProduct: ", error);

    // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message, // Sẽ in ra "Email đã được sử dụng!"
      });
      return;
    }

    // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
    res.status(500).json({ message: "Lỗi hệ thống!" });
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
    console.error("Có lỗi trong getProductDetail: ", error);

    // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message, // Sẽ in ra "Email đã được sử dụng!"
      });
      return;
    }

    // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
}


export const getCategoryFilters = async (req: Request<{slug: string}>, res: Response): Promise<void> => {
  try {
    const slug: string = req.params.slug

    const dynamicFilters = await getCategoryFilterService(slug)

    res.status(200).json({
      status: true,
      message: "Lấy bộ lọc động thành công!",
      data: dynamicFilters
    })

  } catch (error) {
    console.error("Có lỗi trong getCategoryFilters: ", error);

    // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message, // Sẽ in ra "Email đã được sử dụng!"
      });
      return;
    }

    // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
}

export const getLatestCollection = async (req: Request<{}, {}, {}, {limit?: string}>, res: Response): Promise<void> => {
  try {
    
    const limit: number = Number(req.query.limit) || 10

    const data = await getLatestCollectionService(limit)

    res.status(200).json({
      status: true,
      message: "Lấy danh sách sản phẩm mới nhất thành công!",
      data: data
    })

  } catch (error) {
    console.error("Có lỗi trong getLatestCollection: ", error);

    // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message, // Sẽ in ra "Email đã được sử dụng!"
      });
      return;
    }

    // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
}

export const getBestSelling = async (req: Request<{}, {}, {}, {limit?: string}>, res: Response): Promise<void> => {
  try {
    const limit: number = Number(req.query.limit) || 10

    const data = await getBestSellingService(limit)

    res.status(200).json({
      status: true,
      message: "Lấy danh sách sản phẩm bán chạy nhất thành công!",
      data: data
    })
  } catch (error) {
    console.error("Có lỗi trong getBestSelling: ", error);

    // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message, // Sẽ in ra "Email đã được sử dụng!"
      });
      return;
    }

    // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
}

export const getRelatedProducts = async (req: Request<{}, {}, {}, {slug: string, limit: string}>, res: Response): Promise<void> => {
  try {
    
    const slug: string = req.query.slug
    const limit: number = Number(req.query.limit) || 10

    const data = await getRelatedProductsService(slug, limit)

    res.status(200).json({
      status: true,
      message: "Lấy danh sách sản phẩm bán chạy nhất thành công!",
      data: data
    })

  } catch (error) {
    console.error("Có lỗi trong getRelatedProducts: ", error);

    // Kiểm tra xem lỗi này có phải là Error object do mình chủ động throw ra không
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        status: false,
        message: error.message, // Sẽ in ra "Email đã được sử dụng!"
      });
      return;
    }

    // Nếu là các lỗi không lường trước được (rớt mạng, sập DB...) thì mới trả 500
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
}