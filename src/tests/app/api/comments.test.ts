jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  __esModule: true,
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

const mockUserFindOne = jest.fn();
const mockCommentFind = jest.fn();
const mockCommentCreate = jest.fn();
const mockCommentFindById = jest.fn();
const mockCommentFindOneAndDelete = jest.fn();

jest.mock("@/models/user", () => ({
  __esModule: true,
  default: { findOne: (...args: unknown[]) => mockUserFindOne(...args) },
}));

jest.mock("@/models/comment", () => ({
  __esModule: true,
  default: {
    find: (...args: unknown[]) => mockCommentFind(...args),
    create: (...args: unknown[]) => mockCommentCreate(...args),
    findById: (...args: unknown[]) => mockCommentFindById(...args),
    findOneAndDelete: (...args: unknown[]) => mockCommentFindOneAndDelete(...args),
  },
}));

import { GET, POST, DELETE } from "@/app/api/comments/route";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

function makeUrl(path: string, params?: Record<string, string>) {
  const url = new URL(`http://localhost${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

function makeRequest(body?: unknown) {
  return { json: jest.fn().mockResolvedValue(body) } as unknown as NextRequest;
}

const mockSession = { user: { email: "test@test.com" } };

describe("GET /api/comments", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const req = { url: makeUrl("/api/comments", { placeId: "p1" }) } as unknown as NextRequest;
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("should return 400 when placeId is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const req = { url: makeUrl("/api/comments") } as unknown as NextRequest;
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("should return comments on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const chain = { populate: jest.fn().mockReturnThis(), sort: jest.fn().mockResolvedValue([]) };
    mockCommentFind.mockReturnValue(chain);
    const req = { url: makeUrl("/api/comments", { placeId: "p1" }) } as unknown as NextRequest;
    const res = await GET(req);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should return empty data when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const req = { url: makeUrl("/api/comments", { placeId: "p1" }) } as unknown as NextRequest;
    const res = await GET(req);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toEqual([]);
  });
});

const mockUserWithCouple = { _id: "user1", coupleId: "couple1" };

describe("POST /api/comments", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await POST(makeRequest({ placeId: "p1", text: "Hello" }));
    expect(res.status).toBe(401);
  });

  it("should return 400 when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const res = await POST(makeRequest({ placeId: "p1", text: "Hello" }));
    expect(res.status).toBe(400);
  });

  it("should return 400 when text is empty", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const res = await POST(makeRequest({ placeId: "p1", text: "" }));
    expect(res.status).toBe(400);
  });

  it("should return 201 on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCommentCreate.mockResolvedValue({ _id: "c1" });
    mockCommentFindById.mockReturnValue({ populate: jest.fn().mockResolvedValue({ _id: "c1" }) });
    const res = await POST(makeRequest({ placeId: "p1", text: "Nice!" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
  });

  it("should return 500 when comment creation throws", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCommentCreate.mockRejectedValue(new Error("DB error"));
    const res = await POST(makeRequest({ placeId: "p1", text: "Hello" }));
    const data = await res.json();
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/comments", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await DELETE(makeRequest({ id: "c1" }));
    expect(res.status).toBe(401);
  });

  it("should return 400 when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const res = await DELETE(makeRequest({ id: "c1" }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 400 when id is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const res = await DELETE(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("should return 404 when comment not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCommentFindOneAndDelete.mockResolvedValue(null);
    const res = await DELETE(makeRequest({ id: "c1" }));
    expect(res.status).toBe(404);
  });

  it("should return 200 on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCommentFindOneAndDelete.mockResolvedValue({ _id: "c1" });
    const res = await DELETE(makeRequest({ id: "c1" }));
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should return 500 when delete throws", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCommentFindOneAndDelete.mockRejectedValue(new Error("DB error"));
    const res = await DELETE(makeRequest({ id: "c1" }));
    const data = await res.json();
    expect(res.status).toBe(500);
  });
});
