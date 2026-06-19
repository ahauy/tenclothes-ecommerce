import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  DollarSign,
  Users,
  ExternalLink,
  Calendar,
  Download,
  Loader2,
  UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { dashboardService } from "../services/dashboard.service";
import { orderService } from "../services/order.service";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface StatsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  newBuyersRate: number;
  returningBuyersRate: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

interface ChartPoint {
  name: string;
  sales: number;
  orders: number;
}

interface TopProduct {
  productId: string;
  title: string;
  image: string;
  sold: number;
  revenue: number;
  stock: number;
  str: number;
  hotSize: string;
  season: string;
}

interface LowStockItem {
  productId: string;
  title: string;
  slug: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  image: string;
}

interface ReturnedSku {
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
}

interface ReturnStats {
  avgReturnRate: number;
  topReturnedSkus: ReturnedSku[];
}

interface OrderItem {
  _id: string;
  orderCode: string;
  customer: {
    fullName: string;
  };
  items: {
    title: string;
    quantity: number;
  }[];
  orderStatus: string;
  finalAmount: number;
  createdAt: string;
}

const StatCard = ({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "none";
  trendValue?: string;
  icon: React.ElementType;
  loading: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 border border-neutral-100 relative overflow-hidden group hover:shadow-sm transition-all duration-300"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-1">
          {label}
        </p>
        {loading ? (
          <div className="h-8 w-24 bg-neutral-100 animate-pulse mt-1" />
        ) : (
          <h3 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            {value}
          </h3>
        )}
      </div>
      <div className="p-2 bg-neutral-50 rounded-full group-hover:bg-neutral-900 group-hover:text-white transition-all duration-500">
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 h-4">
      {!loading && trend && trend !== "none" && (
        <>
          <span
            className={cn(
              "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded",
              trend === "up"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600",
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {trendValue}
          </span>
          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest">
            so với kỳ trước
          </span>
        </>
      )}
    </div>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const [range, setRange] = useState<string>("7d");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [returnStats, setReturnStats] = useState<ReturnStats>({ avgReturnRate: 0, topReturnedSkus: [] });
  const [ongoingOrders, setOngoingOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [exporting, setExporting] = useState<boolean>(false);

  // Fetch dashboard dynamic statistics
  const fetchDashboardStats = async (rangeType: string, sDate?: string, eDate?: string) => {
    setLoading(true);
    try {
      const res = await dashboardService.getStats({
        range: rangeType,
        startDate: sDate,
        endDate: eDate,
      });
      if (res.status) {
        setStats(res.data.stats);
        setChartData(res.data.chartData);
        setTopProducts(res.data.topProducts || []);
        setLowStock(res.data.lowStock || []);
        setReturnStats(res.data.returns || { avgReturnRate: 0, topReturnedSkus: [] });
      }
    } catch (err: unknown) {
      console.error(err);
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Không thể tải số liệu thống kê dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Fetch real ongoing orders
  const fetchOngoingOrders = async () => {
    try {
      const res = await orderService.getOrders({
        page: 1,
        limit: 5,
        orderStatus: "processing",
      });
      // In case there aren't many processing orders, get all recent orders
      if (res.status && res.data?.content) {
        if (res.data.content.length > 0) {
          setOngoingOrders(res.data.content);
        } else {
          const recentRes = await orderService.getOrders({ page: 1, limit: 5 });
          if (recentRes.status && recentRes.data?.content) {
            setOngoingOrders(recentRes.data.content);
          }
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng thực tế:", err);
    }
  };

  useEffect(() => {
    if (range !== "custom") {
      fetchDashboardStats(range);
    }
    fetchOngoingOrders();
  }, [range]);

  const handleApplyCustomFilter = () => {
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }
    fetchDashboardStats("custom", startDate, endDate);
  };

  const handleExportReport = async () => {
    setExporting(true);
    try {
      const blob = await dashboardService.exportReport({
        range,
        startDate: range === "custom" ? startDate : undefined,
        endDate: range === "custom" ? endDate : undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `TenClothes_BaoCaoTaiChinh_${range}_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Xuất file báo cáo tài chính Excel thành công!");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Không thể xuất file báo cáo. Vui lòng thử lại sau.");
    } finally {
      setExporting(false);
    }
  };

  // Helper format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  // Setup Pie Chart Data for New vs Returning Buyers
  const pieData = stats
    ? [
        { name: "Người mua mới", value: stats.newBuyersRate },
        { name: "Người mua lại", value: stats.returningBuyersRate },
      ]
    : [
        { name: "Người mua mới", value: 50 },
        { name: "Người mua lại", value: 50 },
      ];

  const COLORS = ["#1A1A1A", "#A3A3A3"];

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy"
    };
    return map[status] || status;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-2 block">
            DASHBOARD OVERVIEW
          </span>
          <h2 className="text-4xl font-semibold text-neutral-900 tracking-tight">
            Thống kê hệ thống
          </h2>
          <p className="text-neutral-500 font-light text-sm mt-1">
            Phân tích dữ liệu doanh thu, tăng trưởng và khách hàng.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Time range selector group */}
          <div className="flex bg-neutral-50 p-1 border border-neutral-100">
            {[
              { id: "today", label: "Hôm nay" },
              { id: "7d", label: "7 ngày" },
              { id: "30d", label: "30 ngày" },
              { id: "this_month", label: "Tháng này" },
              { id: "last_month", label: "Tháng trước" },
              { id: "custom", label: "Tùy chọn" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setRange(t.id)}
                className={cn(
                  "px-3 py-1.5 text-[9px] font-bold transition-all uppercase tracking-widest",
                  range === t.id
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-400 hover:text-neutral-600",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            disabled={exporting}
            className="flex items-center gap-2 px-6 py-3 border border-neutral-200 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white disabled:opacity-50 transition-all duration-300 cursor-pointer"
          >
            {exporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Date Pickers for Custom Range */}
      {range === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-wrap items-end gap-4 bg-neutral-50/50 p-5 border border-neutral-100"
        >
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-neutral-200 bg-white text-xs text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
          <button
            onClick={handleApplyCustomFilter}
            disabled={loading}
            className="px-6 py-2.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300 cursor-pointer disabled:opacity-50"
          >
            Áp dụng
          </button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Doanh thu"
          value={stats ? formatCurrency(stats.totalRevenue) : "$0"}
          trend={stats && stats.revenueGrowth !== 0 ? (stats.revenueGrowth > 0 ? "up" : "down") : "none"}
          trendValue={stats ? `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}%` : "0%"}
          icon={DollarSign}
          loading={loading}
        />
        <StatCard
          label="Đơn hàng"
          value={stats ? stats.totalOrders.toLocaleString("vi-VN") : 0}
          trend={stats && stats.ordersGrowth !== 0 ? (stats.ordersGrowth > 0 ? "up" : "down") : "none"}
          trendValue={stats ? `${stats.ordersGrowth > 0 ? "+" : ""}${stats.ordersGrowth.toFixed(1)}%` : "0%"}
          icon={ShoppingBag}
          loading={loading}
        />
        <StatCard
          label="Số khách hàng"
          value={stats ? stats.totalCustomers.toLocaleString("vi-VN") : 0}
          icon={Users}
          loading={loading}
        />
        <StatCard
          label="Người mua lại"
          value={stats ? `${stats.returningBuyersRate.toFixed(1)}%` : "0%"}
          icon={UserCheck}
          loading={loading}
        />
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 border border-neutral-100 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">
                Tăng trưởng doanh thu
              </h4>
              <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-widest">
                Biểu đồ phát triển doanh số trong kỳ báo cáo
              </p>
            </div>
          </div>
          {loading ? (
            <div className="h-[320px] w-full bg-neutral-50 animate-pulse flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
            </div>
          ) : (
            <div className="h-[320px] w-full min-h-[320px]">
              <ResponsiveContainer width="99%" height="100%" minHeight={320}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.05} />
                      <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F9F9F9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#A3A3A3", fontWeight: 500 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#A3A3A3", fontWeight: 500 }}
                    tickFormatter={(val) => {
                      if (val >= 1000000) return `${(val / 1000000).toFixed(0)}M`;
                      if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                      return val;
                    }}
                  />
                  <Tooltip
                    cursor={{
                      stroke: "#1A1A1A",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                    formatter={(val: unknown) => [formatCurrency(Number(val) || 0), "Doanh thu"]}
                    contentStyle={{
                      borderRadius: 0,
                      border: "none",
                      backgroundColor: "#1A1A1A",
                      color: "#FFF",
                      fontSize: 9,
                      padding: "8px 12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#1A1A1A"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Customer Structure (Quiet Luxury Doughnut Chart) */}
        <div className="bg-white p-8 border border-neutral-100 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-2">
              Phân tích khách hàng mua
            </h4>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
              Tỷ lệ khách hàng mới & khách hàng mua lại
            </p>
          </div>
          {loading ? (
            <div className="h-[220px] bg-neutral-50 animate-pulse flex items-center justify-center my-6">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
            </div>
          ) : (
            <div className="relative h-[220px] flex items-center justify-center my-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: unknown) => [`${(Number(val) || 0).toFixed(1)}%`, "Tỷ lệ"]}
                    contentStyle={{
                      borderRadius: 0,
                      border: "none",
                      backgroundColor: "#1A1A1A",
                      color: "#FFF",
                      fontSize: 9,
                      padding: "6px 10px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-medium block">
                  Khách hàng kỳ này
                </span>
                <span className="text-2xl font-bold text-neutral-900">
                  {stats ? stats.totalCustomers : 0}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-neutral-50">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-neutral-900" />
                <span className="text-neutral-500 font-light">Khách hàng mới (New Buyers)</span>
              </div>
              <span className="font-semibold text-neutral-900">
                {stats ? `${stats.newBuyersRate.toFixed(1)}%` : "0%"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-neutral-300" />
                <span className="text-neutral-500 font-light">Mua lại (Returning Buyers)</span>
              </div>
              <span className="font-semibold text-neutral-900">
                {stats ? `${stats.returningBuyersRate.toFixed(1)}%` : "0%"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Selling Products */}
        <div className="bg-white p-8 border border-neutral-100 flex flex-col justify-between hover:shadow-sm transition-all duration-300">
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-1">
              Sản phẩm bán chạy
            </h4>
            <p className="text-[9px] text-neutral-400 uppercase tracking-widest mb-6">
              Hiệu suất bán ra (STR%) & Mùa vụ thịnh hành
            </p>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-neutral-50 animate-pulse border border-neutral-100" />
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-neutral-400 uppercase tracking-widest">
                Chưa có dữ liệu sản phẩm
              </div>
            ) : (
              <div className="space-y-5">
                {topProducts.map((product) => (
                  <div key={product.productId} className="flex gap-4 items-center">
                    <div className="w-12 h-16 bg-neutral-50 border border-neutral-100 flex-shrink-0 overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-300">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-[11px] font-bold text-neutral-900 truncate uppercase tracking-wider">{product.title}</h5>
                      <div className="flex items-center gap-3 mt-1.5 text-[9px] text-neutral-400 font-medium tracking-wide">
                        <span>Đã bán: <strong className="text-neutral-800">{product.sold}</strong></span>
                        <span>Doanh thu: <strong className="text-neutral-800">{formatCurrency(product.revenue)}</strong></span>
                      </div>
                      {/* Sell-Through Rate Progress Bar */}
                      <div className="mt-2.5">
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                          <span>Tỷ lệ bán ra (STR)</span>
                          <span className="text-neutral-800">{product.str}%</span>
                        </div>
                        <div className="w-full h-1 bg-neutral-100">
                          <div className="h-full bg-neutral-950" style={{ width: `${product.str}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0 text-right">
                      <span className="px-2 py-0.5 bg-neutral-50 border border-neutral-100 text-[8px] font-black uppercase tracking-widest text-neutral-500">
                        {product.season}
                      </span>
                      <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">
                        Hot Size: <strong className="text-neutral-800">{product.hotSize}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-8 border border-neutral-100 flex flex-col justify-between hover:shadow-sm transition-all duration-300">
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-1">
              Cảnh báo hết kho
            </h4>
            <p className="text-[9px] text-neutral-400 uppercase tracking-widest mb-6">
              Các biến thể sản phẩm tồn kho sắp hết (≤ 10)
            </p>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-neutral-50 animate-pulse border border-neutral-100" />
                ))}
              </div>
            ) : lowStock.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-neutral-400 uppercase tracking-widest">
                Tồn kho đầy đủ
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {lowStock.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="w-10 h-14 bg-neutral-50 border border-neutral-100 flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-300">No Image</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-[11px] font-bold text-neutral-900 truncate uppercase tracking-wider">{item.title}</h5>
                        <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-wider">
                          SKU: <span className="font-mono text-neutral-700">{item.sku}</span> | Size: <span className="text-neutral-700">{item.size}</span>
                        </p>
                        <p className="text-[9px] text-neutral-400 uppercase tracking-wider">
                          Màu: <span className="text-neutral-700">{item.color}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={cn(
                        "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border",
                        item.stock === 0
                          ? "bg-red-50 text-red-600 border-red-100"
                          : item.stock <= 5
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-neutral-50 text-neutral-500 border-neutral-100"
                      )}>
                        Tồn: {item.stock}
                      </span>
                      <Link
                        to={`/products?sku=${item.sku}`}
                        className="text-[8px] font-black text-neutral-900 uppercase tracking-widest border-b border-neutral-900 pb-0.5 hover:text-neutral-400 hover:border-neutral-400 transition-colors"
                      >
                        Nhập hàng
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Return Rate & Sku Returns */}
        <div className="bg-white p-8 border border-neutral-100 flex flex-col justify-between hover:shadow-sm transition-all duration-300">
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest mb-1">
              Tỷ lệ hoàn trả hàng
            </h4>
            <p className="text-[9px] text-neutral-400 uppercase tracking-widest mb-6">
              Hiệu suất đổi trả hàng & Phân tích nguyên nhân
            </p>
            {loading ? (
              <div className="space-y-4">
                <div className="h-20 bg-neutral-50 animate-pulse border border-neutral-100" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-neutral-50 animate-pulse border border-neutral-100" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Average Return Rate Card */}
                <div className="bg-neutral-50/50 p-4 border border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">Tỷ lệ trả hàng trung bình</span>
                    <span className="text-2xl font-bold text-neutral-900">{returnStats.avgReturnRate}%</span>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border",
                    returnStats.avgReturnRate > 15
                      ? "bg-red-50 text-red-600 border-red-100"
                      : returnStats.avgReturnRate > 5
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-green-50 text-green-600 border-green-100"
                  )}>
                    {returnStats.avgReturnRate > 15 ? "Cao" : returnStats.avgReturnRate > 5 ? "Trung bình" : "Tốt"}
                  </span>
                </div>

                {/* Top Returned SKUs */}
                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-neutral-900 uppercase tracking-[0.15em] block">Top SKU bị đổi trả nhiều nhất</span>
                  {returnStats.topReturnedSkus.length === 0 ? (
                    <div className="h-36 flex items-center justify-center text-xs text-neutral-400 uppercase tracking-widest">
                      Không có đơn đổi trả nào trong kỳ
                    </div>
                  ) : (
                    returnStats.topReturnedSkus.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center justify-between border-b border-neutral-50 last:border-0 pb-3 last:pb-0">
                        <div className="flex gap-3 items-center min-w-0">
                          <div className="w-10 h-14 bg-neutral-50 border border-neutral-100 flex-shrink-0 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-300">No Image</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-[11px] font-bold text-neutral-900 truncate uppercase tracking-wider">{item.title}</h5>
                            <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-wider">
                              SKU: <span className="font-mono text-neutral-700">{item.sku}</span> | Size: <span className="text-neutral-700">{item.size}</span>
                            </p>
                            {/* Reason display */}
                            <p className="text-[9px] text-red-500 font-medium tracking-wide mt-1 uppercase">
                              Lý do: <span className="font-normal text-neutral-600 italic text-[9px] capitalize">{item.reason}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] font-bold text-neutral-900 block">{item.returnRate}%</span>
                          <span className="text-[8px] text-neutral-400 font-medium uppercase tracking-widest block mt-0.5">
                            Trả: {item.cancelledQty}/{item.orderedQty}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real Orders Table */}
      <div className="bg-white border border-neutral-100 overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-neutral-50">
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">
              Đơn hàng gần đây
            </h4>
            <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest">
              Theo dõi đơn hàng cập nhật mới nhất
            </p>
          </div>
          <Link
            to="/orders"
            className="text-[9px] font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-900 pb-0.5 hover:text-neutral-400 hover:border-neutral-400 transition-all"
          >
            Quản lý đơn hàng
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-50/50">
                <th className="px-8 py-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  Mã Đơn
                </th>
                <th className="px-8 py-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  Khách Hàng
                </th>
                <th className="px-8 py-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  Sản Phẩm
                </th>
                <th className="px-8 py-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  Trạng Thái
                </th>
                <th className="px-8 py-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">
                  Tổng Tiền
                </th>
                <th className="px-8 py-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {ongoingOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-10 text-center text-xs text-neutral-400 uppercase tracking-widest">
                    Chưa phát sinh đơn hàng nào
                  </td>
                </tr>
              ) : (
                ongoingOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-neutral-50/30 transition-colors group"
                  >
                    <td className="px-8 py-5 text-[10px] font-bold text-neutral-900 uppercase">
                      {order.orderCode}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-neutral-900">
                          {order.customer.fullName}
                        </span>
                        <span className="text-[9px] text-neutral-400 lowercase">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[10px] text-neutral-500 font-medium max-w-xs truncate">
                      {order.items.map((i) => i.title).join(", ")}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-none border",
                          order.orderStatus === "delivered"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : order.orderStatus === "cancelled"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : order.orderStatus === "shipped"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : order.orderStatus === "processing"
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-neutral-50 text-neutral-500 border-neutral-100",
                        )}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[11px] font-bold text-neutral-900 text-right">
                      {formatCurrency(order.finalAmount)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Link
                        to={`/orders?id=${order._id}`}
                        className="p-1.5 hover:bg-neutral-900 hover:text-white transition-all inline-block border border-neutral-100 hover:border-neutral-900"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
