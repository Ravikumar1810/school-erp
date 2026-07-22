import api from "@/lib/axios";

export type ExamType =
  | "UNIT_TEST"
  | "MID_TERM"
  | "FINAL"
  | "ASSIGNMENT";

export type MarkResult =
  | "PASS"
  | "NEEDS_IMPROVEMENT";

export interface MarkStudent {
  id: string;
  userId: string;
  name: string;
  email: string;
  admissionNumber: string;
  className: string;
  section: string;
  rollNumber: string;
}

export interface MarkAddedBy {
  id: string;
  name: string;
  email: string;
}

export interface MarkRecord {
  id: string;
  studentId: string;
  student: MarkStudent;
  subject: string;
  examType: ExamType;
  marksObtained: number;
  maximumMarks: number;
  percentage: number;
  result: MarkResult;
  addedBy: MarkAddedBy;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarkPayload {
  studentId: string;
  subject: string;
  examType: ExamType;
  marksObtained: number;
  maximumMarks: number;
  remarks?: string;
}

export interface UpdateMarkPayload {
  marksObtained?: number;
  maximumMarks?: number;
  remarks?: string;
}

class MarkService {
  async getAll(): Promise<MarkRecord[]> {
    const { data } = await api.get<
      MarkRecord[]
    >("/marks");

    return data;
  }

  async getById(
    markId: string,
  ): Promise<MarkRecord> {
    const { data } =
      await api.get<MarkRecord>(
        `/marks/${markId}`,
      );

    return data;
  }

  async getMyMarks(): Promise<
    MarkRecord[]
  > {
    const { data } = await api.get<
      MarkRecord[]
    >("/marks/me");

    return data;
  }

  async create(
    payload: CreateMarkPayload,
  ): Promise<MarkRecord> {
    const { data } =
      await api.post<MarkRecord>(
        "/marks",
        payload,
      );

    return data;
  }

  async update(
    markId: string,
    payload: UpdateMarkPayload,
  ): Promise<MarkRecord> {
    const { data } =
      await api.patch<MarkRecord>(
        `/marks/${markId}`,
        payload,
      );

    return data;
  }
}

export const markService =
  new MarkService();