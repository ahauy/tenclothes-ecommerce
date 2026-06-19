import { Request, Response } from "express";
import {
  getDashboardStatsService,
  exportFinancialReportService
} from "../../services/admin/dashboard.service";

export const getDashboardStatsAdminController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { range, startDate, endDate } = req.query as {
      range: string;
      startDate?: string;
      endDate?: string;
    };

    const data = await getDashboardStatsService(range, startDate, endDate);

    res.status(200).json({
      status: true,
      message: "Lấy số liệu thống kê dashboard thành công!",
      data,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi trong getDashboardStatsAdminController: ", err);
    res.status(500).json({ 
      status: false, 
      message: `Lỗi hệ thống: ${err.message}`, 
      stack: err.stack 
    });
  }
};

export const exportFinancialReportController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { range, startDate, endDate } = req.query as {
      range: string;
      startDate?: string;
      endDate?: string;
    };

    const buffer = await exportFinancialReportService(range, startDate, endDate);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="TenClothes_BaoCaoTaiChinh_${range}_${Date.now()}.xlsx"`
    );
    res.setHeader("Content-Length", buffer.length);

    res.status(200).send(buffer);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi trong exportFinancialReportController: ", err);
    res.status(500).json({ 
      status: false, 
      message: `Lỗi hệ thống: ${err.message}`, 
      stack: err.stack 
    });
  }
};
