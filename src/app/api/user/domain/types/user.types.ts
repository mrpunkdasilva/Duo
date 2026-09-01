export interface UserData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bannerColor: string | null;
  createdAt: Date;
}

export interface UpdateProfileData {
  name: string;
  email: string;
  image?: string;
  bannerColor?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
