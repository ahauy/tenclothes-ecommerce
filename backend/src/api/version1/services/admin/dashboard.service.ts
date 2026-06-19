import mongoose from "mongoose";
import ExcelJS from "exceljs";
import { Order } from "../../../../models/order.model";
import { IOrder } from "../../../../interfaces/model.interfaces";
import Product from "../../../../models/product.model";


// Vietnam offset is +7 hours
const VN_OFFSET = 7 * 60 * 60 * 1000;

export const getRangeDates = (range: string, startDate?: string, endDate?: string) => {
  const now = new Date();
  
  const getVnStartOfDay = (date: Date) => {
    const vnTimeMs = date.getTime() + VN_OFFSET;
    const vnDate = new Date(vnTimeMs);
    vnDate.setUTCHours(0, 0, 0, 0);
    return new Date(vnDate.getTime() - VN_OFFSET);
  };
  
  const getVnEndOfDay = (date: Date) => {
    const vnTimeMs = date.getTime() + VN_OFFSET;
    const vnDate = new Date(vnTimeMs);
    vnDate.setUTCHours(23, 59, 59, 999);
    return new Date(vnDate.getTime() - VN_OFFSET);
  };

  let start = new Date();
  let end = new Date();
  let prevStart = new Date();
  let prevEnd = new Date();

  const todayStart = getVnStartOfDay(now);
  const todayEnd = getVnEndOfDay(now);

  switch (range) {
    case "today": {
      start = todayStart;
      end = todayEnd;
      prevStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
      prevEnd = new Date(todayEnd.getTime() - 24 * 60 * 60 * 1000);
      break;
    }
    case "yesterday": {
      start = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
      end = new Date(todayEnd.getTime() - 24 * 60 * 60 * 1000);
      prevStart = new Date(start.getTime() - 24 * 60 * 60 * 1000);
      prevEnd = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      break;
    }
    case "7d": {
      start = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000);
      end = todayEnd;
      prevStart = new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000);
      prevEnd = new Date(start.getTime() - 1);
      break;
    }
    case "30d": {
      start = new Date(todayStart.getTime() - 29 * 24 * 60 * 60 * 1000);
      end = todayEnd;
      prevStart = new Date(start.getTime() - 30 * 24 * 60 * 60 * 1000);
      prevEnd = new Date(start.getTime() - 1);
      break;
    }
    case "this_month": {
      const vnTimeMs = now.getTime() + VN_OFFSET;
      const vnNow = new Date(vnTimeMs);
      
      const firstDayVn = new Date(Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), 1, 0, 0, 0, 0));
      start = new Date(firstDayVn.getTime() - VN_OFFSET);
      end = todayEnd;
      
      const prevFirstDayVn = new Date(Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth() - 1, 1, 0, 0, 0, 0));
      prevStart = new Date(prevFirstDayVn.getTime() - VN_OFFSET);
      
      const prevLastDayVn = new Date(Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), 0, 23, 59, 59, 999));
      prevEnd = new Date(prevLastDayVn.getTime() - VN_OFFSET);
      break;
    }
    case "last_month": {
      const vnTimeMs = now.getTime() + VN_OFFSET;
      const vnNow = new Date(vnTimeMs);
      
      const firstDayVn = new Date(Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth() - 1, 1, 0, 0, 0, 0));
      start = new Date(firstDayVn.getTime() - VN_OFFSET);
      
      const lastDayVn = new Date(Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), 0, 23, 59, 59, 999));
      end = new Date(lastDayVn.getTime() - VN_OFFSET);
      
      const prevFirstDayVn = new Date(Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth() - 2, 1, 0, 0, 0, 0));
      prevStart = new Date(prevFirstDayVn.getTime() - VN_OFFSET);
      
      const prevLastDayVn = new Date(Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth() - 1, 0, 23, 59, 59, 999));
      prevEnd = new Date(prevLastDayVn.getTime() - VN_OFFSET);
      break;
    }
    case "custom": {
      if (startDate && endDate) {
        start = getVnStartOfDay(new Date(startDate));
        end = getVnEndOfDay(new Date(endDate));
        const duration = end.getTime() - start.getTime() + 1;
        prevStart = new Date(start.getTime() - duration);
        prevEnd = new Date(start.getTime() - 1);
      }
      break;
    }
  }

  return { start, end, prevStart, prevEnd };
};

const getPeriodStats = async (start: Date, end: Date) => {
  const filter = {
    createdAt: { $gte: start, $lte: end },
    orderStatus: { $ne: "cancelled" },
    $or: [
      { "customer.paymentMethod": { $ne: "momo" } },
      { paymentStatus: { $in: ["paid", "refunded"] } }
    ]
  };

  const orders = await Order.find(filter).lean();

  const totalRevenue = orders.reduce((sum, order) => sum + (order.finalAmount || 0), 0);
  const totalOrders = orders.length;

  return { totalRevenue, totalOrders, orders };
};

const calculateBuyerRates = async (orders: IOrder[], start: Date) => {
  if (orders.length === 0) {
    return {
      totalCustomers: 0,
      newBuyersCount: 0,
      returningBuyersCount: 0,
      newBuyersRate: 0,
      returningBuyersRate: 0
    };
  }

  const getCustomerId = (order: IOrder) => {
    return order.userId ? order.userId.toString() : order.customer.email.toLowerCase();
  };

  const customerIdsInPeriod = Array.from(new Set(orders.map(getCustomerId)));

  const userIds = customerIdsInPeriod.filter(id => mongoose.Types.ObjectId.isValid(id)).map(id => new mongoose.Types.ObjectId(id));
  const emails = customerIdsInPeriod.filter(id => !mongoose.Types.ObjectId.isValid(id));

  const previousOrders = await Order.find({
    createdAt: { $lt: start },
    orderStatus: { $ne: "cancelled" },
    $or: [
      { userId: { $in: userIds } },
      { "customer.email": { $in: emails } }
    ]
  }).select("userId customer.email").lean();

  const returningCustomersSet = new Set<string>();
  for (const pOrder of previousOrders) {
    if (pOrder.userId) {
      returningCustomersSet.add(pOrder.userId.toString());
    } else if (pOrder.customer?.email) {
      returningCustomersSet.add(pOrder.customer.email.toLowerCase());
    }
  }

  let returningBuyersCount = 0;
  for (const cid of customerIdsInPeriod) {
    if (returningCustomersSet.has(cid)) {
      returningBuyersCount++;
    }
  }

  const newBuyersCount = customerIdsInPeriod.length - returningBuyersCount;
  const newBuyersRate = Math.round((newBuyersCount / customerIdsInPeriod.length) * 1000) / 10;
  const returningBuyersRate = Math.round((returningBuyersCount / customerIdsInPeriod.length) * 1000) / 10;

  return {
    totalCustomers: customerIdsInPeriod.length,
    newBuyersCount,
    returningBuyersCount,
    newBuyersRate,
    returningBuyersRate
  };
};

interface IChartDataPoint {
  name: string;
  sales: number;
  orders: number;
}

const generateChartData = (orders: IOrder[], start: Date, end: Date, range: string) => {
  const getVnDateKey = (date: Date, type: "hour" | "day") => {
    const vnTime = new Date(date.getTime() + VN_OFFSET);
    const day = String(vnTime.getUTCDate()).padStart(2, "0");
    const month = String(vnTime.getUTCMonth() + 1).padStart(2, "0");
    if (type === "hour") {
      return `${String(vnTime.getUTCHours()).padStart(2, "0")}h`;
    }
    return `${day}/${month}`;
  };

  const dataMap = new Map<string, { revenue: number; orders: number }>();

  if (range === "today" || range === "yesterday") {
    for (let h = 0; h < 24; h++) {
      const label = `${String(h).padStart(2, "0")}h`;
      dataMap.set(label, { revenue: 0, orders: 0 });
    }

    for (const order of orders) {
      const label = getVnDateKey(order.createdAt, "hour");
      const current = dataMap.get(label) || { revenue: 0, orders: 0 };
      dataMap.set(label, {
        revenue: current.revenue + (order.finalAmount || 0),
        orders: current.orders + 1
      });
    }
  } else {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 31) {
      const iterDate = new Date(start.getTime() + VN_OFFSET);
      const endLocal = new Date(end.getTime() + VN_OFFSET);
      
      while (iterDate <= endLocal) {
        const day = String(iterDate.getUTCDate()).padStart(2, "0");
        const month = String(iterDate.getUTCMonth() + 1).padStart(2, "0");
        const label = `${day}/${month}`;
        dataMap.set(label, { revenue: 0, orders: 0 });
        iterDate.setUTCDate(iterDate.getUTCDate() + 1);
      }

      for (const order of orders) {
        const label = getVnDateKey(order.createdAt, "day");
        const current = dataMap.get(label);
        if (current) {
          dataMap.set(label, {
            revenue: current.revenue + (order.finalAmount || 0),
            orders: current.orders + 1
          });
        }
      }
    } else {
      let currentStart = new Date(start);
      let weekNum = 1;
      
      while (currentStart < end) {
        const currentEnd = new Date(currentStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
        const actualEnd = currentEnd > end ? end : currentEnd;
        
        const startLabel = getVnDateKey(currentStart, "day");
        const endLabel = getVnDateKey(actualEnd, "day");
        const label = `Tuần ${weekNum} (${startLabel}-${endLabel})`;
        
        dataMap.set(label, { revenue: 0, orders: 0 });
        
        for (const order of orders) {
          if (order.createdAt >= currentStart && order.createdAt <= actualEnd) {
            const current = dataMap.get(label)!;
            dataMap.set(label, {
              revenue: current.revenue + (order.finalAmount || 0),
              orders: current.orders + 1
            });
          }
        }
        
        currentStart = new Date(currentEnd.getTime() + 1);
        weekNum++;
      }
    }
  }

  const chartData: IChartDataPoint[] = [];
  dataMap.forEach((val, key) => {
    chartData.push({
      name: key,
      sales: val.revenue,
      orders: val.orders
    });
  });

  return chartData;
};

export const getDashboardStatsService = async (
  range: string,
  startDate?: string,
  endDate?: string
) => {
  const { start, end, prevStart, prevEnd } = getRangeDates(range, startDate, endDate);

  const [currentPeriod, prevPeriod] = await Promise.all([
    getPeriodStats(start, end),
    getPeriodStats(prevStart, prevEnd)
  ]);

  const buyerRates = await calculateBuyerRates(currentPeriod.orders, start);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = calculateGrowth(currentPeriod.totalRevenue, prevPeriod.totalRevenue);
  const ordersGrowth = calculateGrowth(currentPeriod.totalOrders, prevPeriod.totalOrders);

  const chartData = generateChartData(currentPeriod.orders, start, end, range);

  // 1. Calculate Top Selling Products (topProducts)
  const productStatsMap = new Map<string, {
    productId: string;
    title: string;
    image: string;
    sold: number;
    revenue: number;
    sizeCounts: Record<string, number>;
  }>();

  for (const order of currentPeriod.orders) {
    for (const item of order.items) {
      if (!item.productId) continue;
      const pIdStr = item.productId.toString();
      let pStats = productStatsMap.get(pIdStr);
      if (!pStats) {
        pStats = {
          productId: pIdStr,
          title: item.title,
          image: item.image,
          sold: 0,
          revenue: 0,
          sizeCounts: {},
        };
        productStatsMap.set(pIdStr, pStats);
      }
      pStats.sold += item.quantity;
      pStats.revenue += item.quantity * item.salePrice;
      
      const sz = item.size;
      pStats.sizeCounts[sz] = (pStats.sizeCounts[sz] || 0) + item.quantity;
    }
  }

  const top4ProductStats = Array.from(productStatsMap.values())
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 4);

  const topProducts = await Promise.all(
    top4ProductStats.map(async (stats) => {
      const dbProduct = await Product.findOne({ _id: stats.productId, deleted: false }).lean();
      const currentStock = dbProduct ? dbProduct.totalStock || 0 : 0;
      const str = stats.sold + currentStock > 0 
        ? Math.round((stats.sold / (stats.sold + currentStock)) * 100) 
        : 0;

      let hotSize = "-";
      let maxQty = 0;
      for (const [size, qty] of Object.entries(stats.sizeCounts)) {
        if (qty > maxQty) {
          maxQty = qty;
          hotSize = size;
        }
      }

      const titleLower = stats.title.toLowerCase();
      let season = "Bốn mùa";
      if (titleLower.includes("xuân") || titleLower.includes("hè") || titleLower.includes("spring") || titleLower.includes("summer")) {
        season = "Xuân Hè";
      } else if (titleLower.includes("thu") || titleLower.includes("đông") || titleLower.includes("autumn") || titleLower.includes("winter")) {
        season = "Thu Đông";
      }

      return {
        productId: stats.productId,
        title: dbProduct ? dbProduct.title : stats.title,
        image: dbProduct && dbProduct.productStyles?.[0]?.images?.[0] ? dbProduct.productStyles[0].images[0] : stats.image,
        sold: stats.sold,
        revenue: stats.revenue,
        stock: currentStock,
        str,
        hotSize,
        season,
      };
    })
  );

  // 2. Calculate Low Stock Warnings (lowStock)
  const lowStockProducts = await Product.find({
    deleted: false,
    isActive: true,
    "variants.stock": { $lte: 10 }
  })
    .select("title slug productStyles variants")
    .limit(20)
    .lean();

  const lowStockList: Array<{
    productId: string;
    title: string;
    slug: string;
    sku: string;
    color: string;
    size: string;
    stock: number;
    image: string;
  }> = [];

  for (const product of lowStockProducts) {
    for (const variant of product.variants) {
      if (variant.stock <= 10) {
        const style = product.productStyles?.find(s => s.colorName === variant.colorName);
        const image = style?.images?.[0] || product.productStyles?.[0]?.images?.[0] || "";
        
        lowStockList.push({
          productId: product._id.toString(),
          title: product.title,
          slug: product.slug,
          sku: variant.sku || "",
          color: variant.colorName,
          size: variant.size,
          stock: variant.stock,
          image,
        });
      }
    }
  }

  lowStockList.sort((a, b) => a.stock - b.stock);
  const lowStock = lowStockList.slice(0, 10);

  // 3. Calculate Return Rate by SKU (returns)
  const allOrdersInPeriod = await Order.find({
    createdAt: { $gte: start, $lte: end }
  }).lean();

  const orderedQtyMap = new Map<string, number>();
  const cancelledQtyMap = new Map<string, number>();
  const skuInfoMap = new Map<string, { title: string; color: string; size: string; image: string; productId: string }>();

  let totalOrderedItems = 0;
  let totalCancelledItems = 0;

  for (const order of allOrdersInPeriod) {
    const isCancelled = order.orderStatus === "cancelled";
    for (const item of order.items) {
      const sku = item.sku;
      orderedQtyMap.set(sku, (orderedQtyMap.get(sku) || 0) + item.quantity);
      totalOrderedItems += item.quantity;
      
      if (isCancelled) {
        cancelledQtyMap.set(sku, (cancelledQtyMap.get(sku) || 0) + item.quantity);
        totalCancelledItems += item.quantity;
      }
      
      if (!skuInfoMap.has(sku)) {
        skuInfoMap.set(sku, {
          title: item.title,
          color: item.color,
          size: item.size,
          image: item.image,
          productId: item.productId.toString(),
        });
      }
    }
  }

  const getReturnReason = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("váy") || titleLower.includes("đầm") || titleLower.includes("dress")) {
      return "Phom váy nhỏ, chật ngực";
    }
    if (titleLower.includes("blazer") || titleLower.includes("vest") || titleLower.includes("khoác") || titleLower.includes("jacket")) {
      return "Vải dễ nhăn, phom rộng";
    }
    if (titleLower.includes("quần") || titleLower.includes("pant") || titleLower.includes("jean")) {
      return "Chiều dài quần không vừa, rộng eo";
    }
    if (titleLower.includes("sơ mi") || titleLower.includes("shirt")) {
      return "Chất vải mỏng, tay áo ngắn";
    }
    if (titleLower.includes("phông") || titleLower.includes("t-shirt") || titleLower.includes("thun")) {
      return "Sai màu sắc thực tế, co giãn kém";
    }
    return "Không vừa kích cỡ thông thường";
  };

  const skuReturnsList = [];
  for (const [sku, orderedQty] of orderedQtyMap.entries()) {
    const cancelledQty = cancelledQtyMap.get(sku) || 0;
    const returnRate = orderedQty > 0 ? Math.round((cancelledQty / orderedQty) * 100) : 0;
    const info = skuInfoMap.get(sku);

    if (info && cancelledQty > 0) {
      skuReturnsList.push({
        sku,
        title: info.title,
        color: info.color,
        size: info.size,
        image: info.image,
        productId: info.productId,
        orderedQty,
        cancelledQty,
        returnRate,
        reason: getReturnReason(info.title),
      });
    }
  }

  skuReturnsList.sort((a, b) => b.cancelledQty - a.cancelledQty);
  const topReturnedSkus = skuReturnsList.slice(0, 5);
  const avgReturnRate = totalOrderedItems > 0 ? Math.round((totalCancelledItems / totalOrderedItems) * 100) : 0;

  return {
    stats: {
      totalRevenue: currentPeriod.totalRevenue,
      totalOrders: currentPeriod.totalOrders,
      totalCustomers: buyerRates.totalCustomers,
      newBuyersRate: buyerRates.newBuyersRate,
      returningBuyersRate: buyerRates.returningBuyersRate,
      revenueGrowth,
      ordersGrowth
    },
    chartData,
    topProducts,
    lowStock,
    returns: {
      avgReturnRate,
      topReturnedSkus,
    }
  };
};

export const exportFinancialReportService = async (
  range: string,
  startDate?: string,
  endDate?: string
): Promise<Buffer> => {
  const { start, end } = getRangeDates(range, startDate, endDate);
  
  const statsResult = await getDashboardStatsService(range, startDate, endDate);
  const { stats, chartData } = statsResult;

  const ordersFilter = {
    createdAt: { $gte: start, $lte: end },
    $or: [
      { "customer.paymentMethod": { $ne: "momo" } },
      { paymentStatus: { $in: ["paid", "refunded"] } }
    ]
  };
  const orders = await Order.find(ordersFilter).sort({ createdAt: -1 }).lean();

  const rangeLabels: Record<string, string> = {
    today: "Hôm nay",
    yesterday: "Hôm qua",
    "7d": "7 ngày qua",
    "30d": "30 ngày qua",
    this_month: "Tháng này",
    last_month: "Tháng trước",
    custom: "Tùy chỉnh"
  };

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "TenClothes Admin";
  workbook.lastModifiedBy = "TenClothes System";
  workbook.created = new Date();
  workbook.modified = new Date();

  const wsOverview = workbook.addWorksheet("Tổng quan & Doanh thu");
  wsOverview.views = [{ showGridLines: true }];

  wsOverview.mergeCells("A2:C2");
  const titleCell = wsOverview.getCell("A2");
  titleCell.value = "TENCLOTHES E-COMMERCE";
  titleCell.font = { name: "Arial", size: 16, bold: true, color: { argb: "FF1A1A1A" } };
  
  wsOverview.mergeCells("A3:C3");
  const subtitleCell = wsOverview.getCell("A3");
  subtitleCell.value = "BÁO CÁO TÀI CHÍNH & HOẠT ĐỘNG KINH DOANH";
  subtitleCell.font = { name: "Arial", size: 12, bold: true, color: { argb: "FF555555" } };

  wsOverview.mergeCells("A4:C4");
  const rangeCell = wsOverview.getCell("A4");
  const formatDateStr = (d: Date) => {
    const vnTime = new Date(d.getTime() + VN_OFFSET);
    return `${String(vnTime.getUTCDate()).padStart(2, "0")}/${String(vnTime.getUTCMonth() + 1).padStart(2, "0")}/${vnTime.getUTCFullYear()}`;
  };
  rangeCell.value = `Khoảng thời gian: ${rangeLabels[range] || range} (${formatDateStr(start)} - ${formatDateStr(end)})`;
  rangeCell.font = { name: "Arial", size: 10, italic: true, color: { argb: "FF777777" } };

  const kpiHeaders = ["Chỉ số chính", "Giá trị thực tế", "Tăng trưởng so với kỳ trước"];
  wsOverview.getRow(6).values = kpiHeaders;
  const kpiHeaderRow = wsOverview.getRow(6);
  kpiHeaderRow.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
  kpiHeaderRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1A1A1A" }
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCCCCCC" } },
      left: { style: "thin", color: { argb: "FFCCCCCC" } },
      bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
      right: { style: "thin", color: { argb: "FFCCCCCC" } }
    };
  });

  const kpis = [
    { label: "Doanh thu (VND)", value: stats.totalRevenue, growth: stats.revenueGrowth, format: "#,##0" },
    { label: "Tổng đơn hàng", value: stats.totalOrders, growth: stats.ordersGrowth, format: "#,##0" },
    { label: "Số khách hàng", value: stats.totalCustomers, growth: null, format: "#,##0" },
    { label: "Tỷ lệ người mua mới", value: stats.newBuyersRate / 100, growth: null, format: "0.0%" },
    { label: "Tỷ lệ người mua lại", value: stats.returningBuyersRate / 100, growth: null, format: "0.0%" }
  ];

  kpis.forEach((kpi, idx) => {
    const rowNum = 7 + idx;
    const r = wsOverview.getRow(rowNum);
    r.getCell(1).value = kpi.label;
    r.getCell(2).value = kpi.value;
    r.getCell(3).value = kpi.growth !== null ? `${kpi.growth > 0 ? "+" : ""}${kpi.growth.toFixed(1)}%` : "-";
    
    r.getCell(1).alignment = { horizontal: "left", vertical: "middle" };
    r.getCell(2).alignment = { horizontal: "right", vertical: "middle" };
    r.getCell(3).alignment = { horizontal: "center", vertical: "middle" };
    
    r.getCell(2).numFmt = kpi.format;
    
    r.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10 };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE0E0E0" } },
        left: { style: "thin", color: { argb: "FFE0E0E0" } },
        bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
        right: { style: "thin", color: { argb: "FFE0E0E0" } }
      };
    });
  });

  wsOverview.getCell("A14").value = "CHI TIẾT TĂNG TRƯỞNG THEO THỜI GIAN";
  wsOverview.getCell("A14").font = { name: "Arial", size: 11, bold: true, color: { argb: "FF333333" } };

  const chartHeaders = ["Mốc thời gian", "Doanh thu (VND)", "Số đơn hàng"];
  wsOverview.getRow(16).values = chartHeaders;
  const chartHeaderRow = wsOverview.getRow(16);
  chartHeaderRow.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF333333" } };
  chartHeaderRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF2F2F2" }
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCCCCCC" } },
      left: { style: "thin", color: { argb: "FFCCCCCC" } },
      bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
      right: { style: "thin", color: { argb: "FFCCCCCC" } }
    };
  });

  chartData.forEach((point, idx) => {
    const rowNum = 17 + idx;
    const r = wsOverview.getRow(rowNum);
    r.getCell(1).value = point.name;
    r.getCell(2).value = point.sales;
    r.getCell(3).value = point.orders;

    r.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    r.getCell(2).alignment = { horizontal: "right", vertical: "middle" };
    r.getCell(3).alignment = { horizontal: "right", vertical: "middle" };

    r.getCell(2).numFmt = "#,##0";
    r.getCell(3).numFmt = "#,##0";

    r.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10 };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE0E0E0" } },
        left: { style: "thin", color: { argb: "FFE0E0E0" } },
        bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
        right: { style: "thin", color: { argb: "FFE0E0E0" } }
      };
    });
  });

  wsOverview.getColumn(1).width = 30;
  wsOverview.getColumn(2).width = 20;
  wsOverview.getColumn(3).width = 25;

  const wsOrders = workbook.addWorksheet("Danh sách đơn hàng");
  wsOrders.views = [{ showGridLines: true }];

  const orderColumns = [
    { header: "Mã đơn hàng", key: "orderCode", width: 15 },
    { header: "Khách hàng", key: "customerName", width: 25 },
    { header: "Email", key: "email", width: 25 },
    { header: "Điện thoại", key: "phone", width: 15 },
    { header: "Thanh toán", key: "paymentMethod", width: 15 },
    { header: "Trạng thái đơn", key: "orderStatus", width: 15 },
    { header: "Trạng thái tiền", key: "paymentStatus", width: 15 },
    { header: "Tiền hàng (VND)", key: "totalAmount", width: 18 },
    { header: "Giảm giá (VND)", key: "discountAmount", width: 18 },
    { header: "Thực nhận (VND)", key: "finalAmount", width: 18 },
    { header: "Ngày tạo", key: "createdAt", width: 20 }
  ];
  wsOrders.columns = orderColumns;

  const ordersHeaderRow = wsOrders.getRow(1);
  ordersHeaderRow.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
  ordersHeaderRow.height = 25;
  ordersHeaderRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1A1A1A" }
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCCCCCC" } },
      left: { style: "thin", color: { argb: "FFCCCCCC" } },
      bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
      right: { style: "thin", color: { argb: "FFCCCCCC" } }
    };
  });

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy"
    };
    return map[status] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const map: Record<string, string> = {
      unpaid: "Chưa thanh toán",
      paid: "Đã thanh toán",
      refunded: "Đã hoàn tiền"
    };
    return map[status] || status;
  };

  orders.forEach((order) => {
    const vnCreatedAt = new Date(order.createdAt.getTime() + VN_OFFSET);
    const dateFormatted = `${String(vnCreatedAt.getUTCDate()).padStart(2, "0")}/${String(vnCreatedAt.getUTCMonth() + 1).padStart(2, "0")}/${vnCreatedAt.getUTCFullYear()} ${String(vnCreatedAt.getUTCHours()).padStart(2, "0")}:${String(vnCreatedAt.getUTCMinutes()).padStart(2, "0")}`;

    const r = wsOrders.addRow({
      orderCode: order.orderCode,
      customerName: order.customer.fullName,
      email: order.customer.email,
      phone: order.customer.phone,
      paymentMethod: order.customer.paymentMethod.toUpperCase(),
      orderStatus: getStatusText(order.orderStatus),
      paymentStatus: getPaymentStatusText(order.paymentStatus),
      totalAmount: order.totalAmount,
      discountAmount: order.discountAmount || 0,
      finalAmount: order.finalAmount || 0,
      createdAt: dateFormatted
    });

    r.getCell(8).numFmt = "#,##0";
    r.getCell(9).numFmt = "#,##0";
    r.getCell(10).numFmt = "#,##0";

    r.getCell(1).alignment = { horizontal: "center" };
    r.getCell(4).alignment = { horizontal: "center" };
    r.getCell(5).alignment = { horizontal: "center" };
    r.getCell(6).alignment = { horizontal: "center" };
    r.getCell(7).alignment = { horizontal: "center" };
    r.getCell(8).alignment = { horizontal: "right" };
    r.getCell(9).alignment = { horizontal: "right" };
    r.getCell(10).alignment = { horizontal: "right" };
    r.getCell(11).alignment = { horizontal: "center" };

    r.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10 };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE0E0E0" } },
        left: { style: "thin", color: { argb: "FFE0E0E0" } },
        bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
        right: { style: "thin", color: { argb: "FFE0E0E0" } }
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer as unknown as Buffer;
};
