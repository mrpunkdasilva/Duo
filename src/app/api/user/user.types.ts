export interface UserData {
  name: string;
  email: string;
  image: string | null;
  bannerColor: string | null;
  createdAt: Date;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  image?: string;
  bannerColor?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}
