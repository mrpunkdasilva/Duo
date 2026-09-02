jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  __esModule: true,
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

const mockFindOne = jest.fn();
const mockCreate = jest.fn();

jest.mock("@/models/user", () => ({
  __esModule: true,
  default: { findOne: (...args: unknown[]) => mockFindOne(...args), create: (...args: unknown[]) => mockCreate(...args) },
}));

import { POST } from "@/app/api/auth/register/route";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

function makeRequest(body: unknown) {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
}

describe("POST /api/auth/register", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 400 when fields are missing", async () => {
    const res = await POST(makeRequest({ name: "", email: "", password: "" }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Nome, email e senha são obrigatórios");
  });

  it("should return 400 when password is less than 6 chars", async () => {
    const res = await POST(makeRequest({ name: "Test", email: "a@b.com", password: "12345" }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("A senha deve ter pelo menos 6 caracteres");
  });

  it("should return 400 when email already exists", async () => {
    mockFindOne.mockResolvedValue({ _id: "existing" });
    const res = await POST(makeRequest({ name: "Test", email: "a@b.com", password: "123456" }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("Este email já está em uso");
  });

  it("should return 201 on success", async () => {
    mockFindOne.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
    mockCreate.mockResolvedValue({ _id: "new123", name: "Test", email: "a@b.com" });

    const res = await POST(makeRequest({ name: "Test", email: "a@b.com", password: "123456" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe("Test");
  });
});
