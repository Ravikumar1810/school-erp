import api from "@/lib/axios";

export interface AnalyticsSummary {
  totalStudents: number;
  totalTeachers: number;
  attendanceRate: number;
  averagePerformance: number;
}

export interface AttendanceDistribution {
  present: number;
  absent: number;
  leave: number;
  total: number;
}

export interface AttendanceTrendItem {
  date: string;
  present: number;
  absent: number;
  leave: number;
}

export interface SubjectPerformanceItem {
  subject: string;
  average: number;
}

export interface ClassPerformanceItem {
  className: string;
  average: number;
}

export interface SuperAdminAnalyticsData {
  summary:
    AnalyticsSummary;

  attendanceDistribution:
    AttendanceDistribution;

  attendanceTrend:
    AttendanceTrendItem[];

  subjectPerformance:
    SubjectPerformanceItem[];

  classPerformance:
    ClassPerformanceItem[];
}

export const analyticsService = {
  async getSuperAdminAnalytics():
    Promise<SuperAdminAnalyticsData> {
    const response =
      await api.get<SuperAdminAnalyticsData>(
        "/analytics/super-admin",
      );

    return response.data;
  },
};