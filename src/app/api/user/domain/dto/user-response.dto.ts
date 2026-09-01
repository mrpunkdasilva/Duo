export interface UserDataResponse {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bannerColor: string | null;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}
