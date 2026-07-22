import api from "@/lib/axios";

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "STUDENT";
  avatar: string | null;
  isActive: boolean;
  admissionNumber: string;
  className: string;
  section: string;
  rollNumber: string;
  dateOfBirth: string | null;
  parentName: string | null;
  parentPhone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  password: string;
  admissionNumber: string;
  className: string;
  section: string;
  rollNumber: string;
  dateOfBirth?: string;
  parentName?: string;
  parentPhone?: string;
}

export interface UpdateStudentPayload {
  name?: string;
  email?: string;
  admissionNumber?: string;
  className?: string;
  section?: string;
  rollNumber?: string;
  dateOfBirth?: string;
  parentName?: string;
  parentPhone?: string;
}

export interface DeleteStudentResponse {
  message: string;
}

class StudentService {
  async getAll(): Promise<Student[]> {
    const { data } = await api.get<Student[]>(
      "/students",
    );

    return data;
  }

  async getById(
    studentId: string,
  ): Promise<Student> {
    const { data } = await api.get<Student>(
      `/students/${studentId}`,
    );

    return data;
  }

  async getMyProfile(): Promise<Student> {
    const { data } = await api.get<Student>(
      "/students/me",
    );

    return data;
  }

  async create(
    payload: CreateStudentPayload,
  ): Promise<Student> {
    const { data } = await api.post<Student>(
      "/students",
      payload,
    );

    return data;
  }

  async update(
    studentId: string,
    payload: UpdateStudentPayload,
  ): Promise<Student> {
    const { data } = await api.patch<Student>(
      `/students/${studentId}`,
      payload,
    );

    return data;
  }

  async delete(
    studentId: string,
  ): Promise<DeleteStudentResponse> {
    const { data } =
      await api.delete<DeleteStudentResponse>(
        `/students/${studentId}`,
      );

    return data;
  }
}

export const studentService =
  new StudentService();