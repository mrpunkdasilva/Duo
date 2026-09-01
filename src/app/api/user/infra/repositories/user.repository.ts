import { connectToDatabase } from "@/lib/mongodb";
import User, { IUser } from "@/models/user";
import logger from "@/lib/logger";

const USER_FIELDS = "name email image bannerColor createdAt";

export async function findUserById(userId: string): Promise<IUser | null> {
  await connectToDatabase();
  return User.findById(userId).select(USER_FIELDS);
}

export async function findUserByIdWithPassword(userId: string): Promise<IUser | null> {
  await connectToDatabase();
  return User.findById(userId).select("+password");
}

export async function findUserByEmail(email: string, excludeId?: string): Promise<IUser | null> {
  await connectToDatabase();
  const query: Record<string, unknown> = { email };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return User.findOne(query);
}

export async function saveUser(user: IUser): Promise<void> {
  await user.save();
  logger.info({ userId: user._id }, "User saved successfully");
}
