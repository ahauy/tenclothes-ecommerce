import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  DollarSign,
  Users,
  Clock,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

const salesData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 5000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 1890 },
  { name: "Sat", sales: 2390 },
  { name: "Sun", sales: 3490 },
];

const ongoingOrders = [
  {
    id: "#ORD-7721",
    customer: "Alexander Wang",
    item: "Silk Evening Dress",
    status: "In Transit",
    total: "$1,200",
    date: "2 mins ago",
  },
  {
    id: "#ORD-7722",
    customer: "Elena Rossi",
    item: "Cashmere Overcoat",
    status: "Processing",
    total: "$3,450",
    date: "15 mins ago",
  },
  {
    id: "#ORD-7723",
    customer: "Julian Smith",
    item: "Leather Chelsea Boots",
    status: "In Transit",
    total: "$890",
    date: "1 hour ago",
  },
  {
    id: "#ORD-7724",
    customer: "Sophia Chen",
    item: "Wool Blend Blazer",
    status: "Pending",
    total: "$560",
    date: "3 hours ago",
  },
];

const StatCard = ({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend: "up" | "down";
  trendValue: string;
  icon: any;
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
        <h3 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          {value}
        </h3>
      </div>
      <div className="p-2 bg-neutral-50 rounded-full group-hover:bg-neutral-900 group-hover:text-white transition-all duration-500">
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
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
        với tháng trước
      </span>
    </div>
  </motion.div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-2 block">
            DASHBOARD OVERVIEW
          </span>
          <h2 className="text-4xl font-semibold text-neutral-900 tracking-tight">
            Thống kê hệ thống
          </h2>
          <p className="text-neutral-500 font-light text-sm mt-1">
            Phân tích dữ liệu kinh doanh thời gian thực.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 border border-neutral-200 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all duration-300">
            Xuất báo cáo
          </button>
          <button className="px-6 py-2.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all duration-300">
            Chiến dịch mới
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Doanh thu"
          value="$128,430"
          trend="up"
          trendValue="+12.5%"
          icon={DollarSign}
        />
        <StatCard
          label="Đơn hàng"
          value="1,240"
          trend="up"
          trendValue="+5.2%"
          icon={ShoppingBag}
        />
        <StatCard
          label="Khách hàng"
          value="456"
          trend="down"
          trendValue="-2.1%"
          icon={Users}
        />
        <StatCard
          label="Tỷ lệ hoàn"
          value="3.2%"
          trend="up"
          trendValue="+0.4%"
          icon={Clock}
        />
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 border border-neutral-100">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">
                Tăng trưởng doanh thu
              </h4>
              <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-tighter">
                Số liệu dựa trên 7 ngày gần nhất
              </p>
            </div>
            <div className="flex bg-neutral-50 p-1">
              {["7D", "30D", "1Y"].map((t) => (
                <button
                  key={t}
                  className={cn(
                    "px-3 py-1 text-[9px] font-bold transition-all",
                    t === "7D"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-400 hover:text-neutral-600",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
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
                />
                <Tooltip
                  cursor={{
                    stroke: "#1A1A1A",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
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
        </div>

        {/* Featured Products (Light Theme) */}
        <div className="bg-white p-8 border border-neutral-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">
              Sản phẩm nổi bật
            </h4>
            <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-7 flex-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-5 items-center group cursor-pointer"
              >
                <div className="w-14 h-18 bg-neutral-50 overflow-hidden relative">
                  <img
                    src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop`}
                    alt="product"
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 border border-black/5 group-hover:border-black/0 transition-all" />
                </div>
                <div className="flex-1 flex flex-col justify-center border-b border-neutral-50 pb-3 group-hover:border-neutral-200 transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 mb-0.5">
                    Premium Silk Shirt
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-neutral-400 font-medium uppercase">
                      Collection 2026
                    </span>
                    <span className="text-xs font-semibold text-neutral-900">
                      $299.00
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-8 w-full py-3 bg-neutral-50 text-neutral-900 text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-900 hover:text-white transition-all duration-500">
            Xem tất cả bộ sưu tập
          </button>
        </div>
      </div>

      {/* Ongoing Orders Section (New) */}
      <div className="bg-white border border-neutral-100 overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-neutral-50">
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">
              Đơn hàng đang xử lý
            </h4>
            <p className="text-[9px] text-neutral-400 mt-1 uppercase tracking-widest">
              Theo dõi lộ trình giao hàng thời gian thực
            </p>
          </div>
          <button className="text-[9px] font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-900 pb-0.5 hover:text-neutral-400 hover:border-neutral-400 transition-all">
            Tất cả đơn hàng
          </button>
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
              {ongoingOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-50/30 transition-colors group"
                >
                  <td className="px-8 py-5 text-[10px] font-bold text-neutral-900">
                    {order.id}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-neutral-900">
                        {order.customer}
                      </span>
                      <span className="text-[9px] text-neutral-400 lowercase">
                        {order.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[10px] text-neutral-500 font-medium">
                    {order.item}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-none border",
                        order.status === "In Transit"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : order.status === "Processing"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-neutral-50 text-neutral-500 border-neutral-100",
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-[11px] font-bold text-neutral-900 text-right">
                    {order.total}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-1.5 hover:bg-neutral-900 hover:text-white transition-all">
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
