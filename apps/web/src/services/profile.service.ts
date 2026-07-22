import api from "@/lib/axios";

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "STUDENT";

export interface StudentProfileDetails {
  id: string;
  admissionNumber: string;
  className: string;
  section: string;
  rollNumber: string;
  dateOfBirth: string | null;
  parentName: string;
  parentPhone: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  student: StudentProfileDetails | null;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const profileService = {
  async getMyProfile(): Promise<Profile> {
    const response =
      await api.get<Profile>(
        "/profile/me",
      );

    return response.data;
  },

  async updateMyProfile(
    payload: UpdateProfilePayload,
  ): Promise<Profile> {
    const response =
      await api.patch<Profile>(
        "/profile/me",
        payload,
      );

    return response.data;
  },

  async changePassword(
    payload: ChangePasswordPayload,
  ): Promise<ChangePasswordResponse> {
    const response =
      await api.patch<ChangePasswordResponse>(
        "/profile/change-password",
        payload,
      );

    return response.data;
  },
};