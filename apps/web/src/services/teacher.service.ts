import api from "@/lib/axios";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherPayload {
  name: string;
  email: string;
  password: string;
}

export interface DeleteTeacherResponse {
  message: string;
}

class TeacherService {
  async getAll(): Promise<Teacher[]> {
    const { data } = await api.get<Teacher[]>(
      "/teachers",
    );

    return data;
  }

  async create(
    payload: CreateTeacherPayload,
  ): Promise<Teacher> {
    const { data } = await api.post<Teacher>(
      "/teachers",
      payload,
    );

    return data;
  }

  async delete(
    teacherId: string,
  ): Promise<DeleteTeacherResponse> {
    const { data } =
      await api.delete<DeleteTeacherResponse>(
        `/teachers/${teacherId}`,
      );

    return data;
  }
}

export const teacherService =
  new TeacherService();