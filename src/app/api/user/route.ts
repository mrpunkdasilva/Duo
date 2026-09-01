import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfileController, changePasswordController } from "./user.controller";
import { openApiDocument } from "@/lib/openapi";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("openapi") === "true") {
    return NextResponse.json(openApiDocument);
  }

  logger.info("GET /api/user - Fetching profile");
  const result = await getProfile();
  return NextResponse.json(result.body, { status: result.status });
}

export async function PUT(request: NextRequest) {
  logger.info("PUT /api/user - Updating profile");
  const body = await request.json();
  const result = await updateProfileController(body);
  return NextResponse.json(result.body, { status: result.status });
}

export async function PATCH(request: NextRequest) {
  logger.info("PATCH /api/user - Changing password");
  const body = await request.json();
  const result = await changePasswordController(body);
  return NextResponse.json(result.body, { status: result.status });
}
