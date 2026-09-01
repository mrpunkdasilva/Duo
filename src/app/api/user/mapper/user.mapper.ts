import { UserData } from "../domain/user.types";
import { UserDataResponse } from "../dto/user-response.dto";
import { IUser } from "@/models/user";

export function toUserDataResponse(user: IUser): UserDataResponse {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image || null,
    bannerColor: user.bannerColor || null,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toUserData(user: IUser): UserData {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image || null,
    bannerColor: user.bannerColor || null,
    createdAt: user.createdAt,
  };
}
