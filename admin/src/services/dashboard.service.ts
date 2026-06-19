import api from "../utils/axios";

export interface DashboardStatsResponse {
  status: boolean;
  message: string;
  data: {
    stats: {
      totalRevenue: number;
      totalOrders: number;
      totalCustomers: number;
      newBuyersRate: number;
      returningBuyersRate: number;
      revenueGrowth: number;
      ordersGrowth: number;
    };
    chartData: {
      name: string;
      sales: number;
      orders: number;
    }[];
    topProducts?: {
      productId: string;
      title: string;
      image: string;
      sold: number;
      revenue: number;
      stock: number;
      str: number;
      hotSize: string;
      season: string;
    }[];
    lowStock?: {
      productId: string;
      title: string;
      slug: string;
      sku: string;
      color: string;
      size: string;
      stock: number;
      image: string;
    }[];
    returns?: {
      avgReturnRate: number;
      topReturnedSkus: {
        sku: string;
        title: string;
        color: string;
        size: string;
        image: string;
        productId: string;
        orderedQty: number;
        cancelledQty: number;
        returnRate: number;
        reason: string;
      }[];
    };
  };
}

export const dashboardService = {
  getStats: async (params: {
    range: string;
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardStatsResponse> => {
    const response = await api.get("/dashboard/stats", { params });
    return response.data;
  },

  exportReport: async (params: {
    range: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> => {
    const response = await api.get("/dashboard/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};
export default dashboardService;
