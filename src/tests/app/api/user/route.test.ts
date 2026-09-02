jest.mock("@/lib/openapi", () => ({
  openApiDocument: { openapi: "3.0.3", info: { title: "Test API" } },
}));

jest.mock("@/lib/logger", () => ({
  __esModule: true,
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const mockGetProfile = jest.fn();
const mockUpdateProfileController = jest.fn();
const mockChangePasswordController = jest.fn();

jest.mock("@/app/api/user/application/controllers/user.controller", () => ({
  getProfile: (...args: unknown[]) => mockGetProfile(...args),
  updateProfileController: (...args: unknown[]) => mockUpdateProfileController(...args),
  changePasswordController: (...args: unknown[]) => mockChangePasswordController(...args),
}));

import { GET, PUT, PATCH } from "@/app/api/user/route";

function makeRequest(url: string, body?: unknown) {
  return {
    url,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as import("next/server").NextRequest;
}

describe("GET /api/user", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return openapi document when openapi=true", async () => {
    const req = makeRequest("http://localhost/api/user?openapi=true");
    const res = await GET(req);
    const data = await res.json();
    expect(data.openapi).toBe("3.0.3");
  });

  it("should return profile on success", async () => {
    const req = makeRequest("http://localhost/api/user");
    mockGetProfile.mockResolvedValue({ status: 200, body: { data: { name: "John" } } });
    const res = await GET(req);
    const data = await res.json();
    expect(data.data.name).toBe("John");
    expect(res.status).toBe(200);
  });

  it("should handle errors", async () => {
    const req = makeRequest("http://localhost/api/user");
    mockGetProfile.mockRejectedValue(new Error("fail"));
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});

describe("PUT /api/user", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should update profile on success", async () => {
    const req = makeRequest("http://localhost/api/user", { name: "Jane" });
    mockUpdateProfileController.mockResolvedValue({ status: 200, body: { data: { name: "Jane" } } });
    const res = await PUT(req);
    const data = await res.json();
    expect(data.data.name).toBe("Jane");
  });

  it("should handle errors", async () => {
    const req = makeRequest("http://localhost/api/user", { name: "Jane" });
    mockUpdateProfileController.mockRejectedValue(new Error("fail"));
    const res = await PUT(req);
    expect(res.status).toBe(500);
  });
});

describe("PATCH /api/user", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should change password on success", async () => {
    const req = makeRequest("http://localhost/api/user", { currentPassword: "old", newPassword: "new123" });
    mockChangePasswordController.mockResolvedValue({ status: 200, body: { data: { success: true } } });
    const res = await PATCH(req);
    const data = await res.json();
    expect(data.data.success).toBe(true);
  });

  it("should handle errors", async () => {
    const req = makeRequest("http://localhost/api/user", { currentPassword: "old", newPassword: "new123" });
    mockChangePasswordController.mockRejectedValue(new Error("fail"));
    const res = await PATCH(req);
    expect(res.status).toBe(500);
  });
});
