import { z } from "zod";

export const getDashboardQuerySchema = z.object({
  query: z.object({
    range: z.enum(["today", "yesterday", "7d", "30d", "this_month", "last_month", "custom"], {
      message: "Khoảng thời gian (range) không hợp lệ"
    }).default("7d"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }).refine(data => {
    if (data.range === "custom") {
      return !!data.startDate && !!data.endDate;
    }
    return true;
  }, {
    message: "startDate và endDate là bắt buộc khi chọn khoảng thời gian tùy chỉnh (custom)",
    path: ["startDate"]
  })
});
