export interface UpdateProfileDto {
  name: string;
  email: string;
  image?: string;
  bannerColor?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
