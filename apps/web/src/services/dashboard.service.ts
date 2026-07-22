import api from "@/lib/axios";

// =========================================================
// TYPES
// =========================================================

export interface AttendanceOverview {
  total: number;
  present: number;
  absent: number;
  leave: number;
  attendanceRate?: number;
}

export interface SuperAdminDashboardData {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    attendanceRate: number;
    averagePerformance: number;
  };

  attendanceOverview: AttendanceOverview;

  marksOverview: {
    totalRecords: number;
    averagePerformance: number;
  };
}

export interface AdminDashboardData {
  stats: {
    totalStudents: number;
    attendanceRate: number;
    averagePerformance: number;
    totalMarkRecords: number;
  };

  attendanceOverview: AttendanceOverview;
}

export interface SubjectPerformance {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
}

export interface StudentDashboardData {
  student: {
    id: string;
    name: string;
    admissionNumber: string;
    className: string;
    section: string;
    rollNumber: string;
  };

  stats: {
    attendanceRate: number;
    averagePerformance: number;
    totalSubjects: number;
    totalAttendanceRecords: number;
  };

  attendanceOverview: AttendanceOverview;

  subjectPerformance: SubjectPerformance[];
}

// =========================================================
// SERVICE
// =========================================================

export const dashboardService = {
  async getSuperAdminDashboard(): Promise<SuperAdminDashboardData> {
    const response =
      await api.get<SuperAdminDashboardData>(
        "/dashboard/super-admin",
      );

    return response.data;
  },

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const response =
      await api.get<AdminDashboardData>(
        "/dashboard/admin",
      );

    return response.data;
  },

  async getStudentDashboard(): Promise<StudentDashboardData> {
    const response =
      await api.get<StudentDashboardData>(
        "/dashboard/student",
      );

    return response.data;
  },
};