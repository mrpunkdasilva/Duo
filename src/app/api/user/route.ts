import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfileController, changePasswordController } from "./application/controllers/user.controller";
import { openApiDocument } from "@/lib/openapi";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    if (searchParams.get("openapi") === "true") {
      return NextResponse.json(openApiDocument);
    }

    logger.info("GET /api/user - Fetching profile");
    const result = await getProfile();
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    logger.error({ error }, "Error in GET /api/user");
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    logger.info("PUT /api/user - Updating profile");
    const body = await request.json();
    const result = await updateProfileController(body);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    logger.error({ error }, "Error in PUT /api/user");
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    logger.info("PATCH /api/user - Changing password");
    const body = await request.json();
    const result = await changePasswordController(body);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    logger.error({ error }, "Error in PATCH /api/user");
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
