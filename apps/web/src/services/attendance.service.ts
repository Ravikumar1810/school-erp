import api from "@/lib/axios";

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LEAVE";

export interface AttendanceStudent {
  id: string;
  userId: string;
  name: string;
  email: string;
  admissionNumber: string;
  className: string;
  section: string;
  rollNumber: string;
}

export interface AttendanceMarker {
  id: string;
  name: string;
  email: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  student: AttendanceStudent;
  date: string;
  status: AttendanceStatus;
  markedBy: AttendanceMarker;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAttendancePayload {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface UpdateAttendancePayload {
  status?: AttendanceStatus;
  remarks?: string;
}

class AttendanceService {
  async getAll(): Promise<
    AttendanceRecord[]
  > {
    const { data } = await api.get<
      AttendanceRecord[]
    >("/attendance");

    return data;
  }

  async getById(
    attendanceId: string,
  ): Promise<AttendanceRecord> {
    const { data } =
      await api.get<AttendanceRecord>(
        `/attendance/${attendanceId}`,
      );

    return data;
  }

  async getMyAttendance(): Promise<
    AttendanceRecord[]
  > {
    const { data } = await api.get<
      AttendanceRecord[]
    >("/attendance/me");

    return data;
  }

  async create(
    payload: CreateAttendancePayload,
  ): Promise<AttendanceRecord> {
    const { data } =
      await api.post<AttendanceRecord>(
        "/attendance",
        payload,
      );

    return data;
  }

  async update(
    attendanceId: string,
    payload: UpdateAttendancePayload,
  ): Promise<AttendanceRecord> {
    const { data } =
      await api.patch<AttendanceRecord>(
        `/attendance/${attendanceId}`,
        payload,
      );

    return data;
  }
}

export const attendanceService =
  new AttendanceService();