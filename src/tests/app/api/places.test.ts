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
const mockPlaceFind = jest.fn();
const mockPlaceCreate = jest.fn();
const mockPlaceFindOneAndUpdate = jest.fn();
const mockPlaceFindOneAndDelete = jest.fn();
const mockPlaceFindOne = jest.fn();

jest.mock("@/models/user", () => ({
  __esModule: true,
  default: { findOne: (...args: unknown[]) => mockUserFindOne(...args) },
}));

jest.mock("@/models/place", () => ({
  __esModule: true,
  default: {
    find: (...args: unknown[]) => mockPlaceFind(...args),
    findOne: (...args: unknown[]) => mockPlaceFindOne(...args),
    create: (...args: unknown[]) => mockPlaceCreate(...args),
    findOneAndUpdate: (...args: unknown[]) => mockPlaceFindOneAndUpdate(...args),
    findOneAndDelete: (...args: unknown[]) => mockPlaceFindOneAndDelete(...args),
  },
}));

import { GET, POST, PUT, DELETE } from "@/app/api/places/route";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

function makeUrl(params?: Record<string, string>) {
  const url = new URL("http://localhost/api/places");
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

function makeRequest(body?: unknown) {
  return { json: jest.fn().mockResolvedValue(body) } as unknown as NextRequest;
}

const mockSession = { user: { email: "test@test.com" } };
const mockUserWithCouple = { _id: "user1", coupleId: "couple1" };

describe("GET /api/places", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const req = { url: makeUrl() } as unknown as NextRequest;
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("should return empty array when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const req = { url: makeUrl() } as unknown as NextRequest;
    const res = await GET(req);
    const data = await res.json();
    expect(data.data).toEqual([]);
  });

  it("should return places on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const chain = { sort: jest.fn().mockReturnThis(), limit: jest.fn().mockResolvedValue([]) };
    mockPlaceFind.mockReturnValue(chain);
    const req = { url: makeUrl() } as unknown as NextRequest;
    const res = await GET(req);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should apply limit when provided", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const limitFn = jest.fn().mockResolvedValue([]);
    const chain = { sort: jest.fn().mockReturnThis(), limit: limitFn };
    mockPlaceFind.mockReturnValue(chain);
    const req = { url: makeUrl({ limit: "5" }) } as unknown as NextRequest;
    await GET(req);
    expect(limitFn).toHaveBeenCalledWith(5);
  });

  it("should return single place when id param is provided", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockPlaceFindOne.mockResolvedValue({ _id: "p1", name: "Place 1" });
    const req = { url: makeUrl({ id: "p1" }) } as unknown as NextRequest;
    const res = await GET(req);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should return 404 when single place not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockPlaceFindOne.mockResolvedValue(null);
    const req = { url: makeUrl({ id: "p1" }) } as unknown as NextRequest;
    const res = await GET(req);
    expect(res.status).toBe(404);
  });
});

describe("POST /api/places", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await POST(makeRequest({ name: "Cafe" }));
    expect(res.status).toBe(401);
  });

  it("should return 400 when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const res = await POST(makeRequest({ name: "Cafe" }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 400 when name is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const res = await POST(makeRequest({ name: "" }));
    expect(res.status).toBe(400);
  });

  it("should return 201 on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockPlaceCreate.mockResolvedValue({ _id: "p1", name: "Cafe" });
    const res = await POST(makeRequest({ name: "Cafe" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
  });

  it("should return 500 when creation throws", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockPlaceCreate.mockRejectedValue(new Error("DB error"));
    const res = await POST(makeRequest({ name: "Cafe" }));
    const data = await res.json();
    expect(res.status).toBe(500);
  });
});

describe("PUT /api/places", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await PUT(makeRequest({ id: "p1", name: "New" }));
    expect(res.status).toBe(401);
  });

  it("should return 400 when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const res = await PUT(makeRequest({ id: "p1", name: "New" }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 400 when id is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const res = await PUT(makeRequest({ name: "New" }));
    expect(res.status).toBe(400);
  });

  it("should return 404 when place not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockPlaceFindOneAndUpdate.mockResolvedValue(null);
    const res = await PUT(makeRequest({ id: "p1", name: "New" }));
    expect(res.status).toBe(404);
  });

  it("should return 200 on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockPlaceFindOneAndUpdate.mockResolvedValue({ _id: "p1", name: "New" });
    const res = await PUT(makeRequest({ id: "p1", name: "New" }));
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should return 500 when update throws", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockPlaceFindOneAndUpdate.mockRejectedValue(new Error("DB error"));
    const res = await PUT(makeRequest({ id: "p1", name: "New" }));
    const data = await res.json();
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/places", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await DELETE(makeRequest({ id: "p1" }));
    expect(res.status).toBe(401);
  });

  it("should return 400 when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const res = await DELETE(makeRequest({ id: "p1" }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 400 when id is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const res = await DELETE(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("should return 404 when place not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockPlaceFindOneAndDelete.mockResolvedValue(null);
    const res = await DELETE(makeRequest({ id: "p1" }));
    expect(res.status).toBe(404);
  });

  it("should return 200 on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockPlaceFindOneAndDelete.mockResolvedValue({ _id: "p1" });
    const res = await DELETE(makeRequest({ id: "p1" }));
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should return 500 when delete throws", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockPlaceFindOneAndDelete.mockRejectedValue(new Error("DB error"));
    const res = await DELETE(makeRequest({ id: "p1" }));
    const data = await res.json();
    expect(res.status).toBe(500);
  });
});
