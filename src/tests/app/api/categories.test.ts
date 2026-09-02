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
const mockCategoryFind = jest.fn();
const mockCategoryFindOne = jest.fn();
const mockCategoryFindOneAndUpdate = jest.fn();
const mockCategoryFindOneAndDelete = jest.fn();
const mockCategoryCreate = jest.fn();

jest.mock("@/models/user", () => ({
  __esModule: true,
  default: { findOne: (...args: unknown[]) => mockUserFindOne(...args) },
}));

jest.mock("@/models/category", () => ({
  __esModule: true,
  default: {
    find: (...args: unknown[]) => mockCategoryFind(...args),
    findOne: (...args: unknown[]) => mockCategoryFindOne(...args),
    findOneAndUpdate: (...args: unknown[]) => mockCategoryFindOneAndUpdate(...args),
    findOneAndDelete: (...args: unknown[]) => mockCategoryFindOneAndDelete(...args),
    create: (...args: unknown[]) => mockCategoryCreate(...args),
  },
}));

import { GET, POST, PUT, DELETE } from "@/app/api/categories/route";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

function makeRequest(body?: unknown) {
  return {
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
}

const mockSession = { user: { email: "test@test.com" } };
const mockUserWithCouple = { _id: "user1", coupleId: "couple1" };

describe("GET /api/categories", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("should return empty array when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const res = await GET();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toEqual([]);
  });

  it("should return categories when user has couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const sortResult = [{ _id: "cat1", name: "Food" }];
    mockCategoryFind.mockReturnValue({ sort: jest.fn().mockResolvedValue(sortResult) });

    const res = await GET();
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});

describe("POST /api/categories", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await POST(makeRequest({ name: "Test" }));
    expect(res.status).toBe(401);
  });

  it("should return 400 when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const res = await POST(makeRequest({ name: "Test" }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 400 when name is empty", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const res = await POST(makeRequest({ name: "  " }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 400 when category name already exists", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCategoryFindOne.mockResolvedValue({ _id: "existing" });
    const res = await POST(makeRequest({ name: "Food" }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 201 on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCategoryFindOne
      .mockResolvedValueOnce(null)
      .mockReturnValueOnce({ sort: jest.fn().mockResolvedValue(null) });
    mockCategoryCreate.mockResolvedValue({ _id: "new1", name: "Food" });

    const res = await POST(makeRequest({ name: "Food", icon: "🍽️", color: "#ff0000" }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
  });

  it("should return 500 when category creation throws", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCategoryFindOne.mockRejectedValue(new Error("DB error"));
    const res = await POST(makeRequest({ name: "Food" }));
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
  });
});

describe("PUT /api/categories", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await PUT(makeRequest({ id: "cat1", name: "New" }));
    expect(res.status).toBe(401);
  });

  it("should return 400 when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const res = await PUT(makeRequest({ id: "cat1", name: "New" }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 400 when id is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const res = await PUT(makeRequest({ name: "New" }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 400 when category name already exists", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCategoryFindOne.mockResolvedValue({ _id: "other" });
    const res = await PUT(makeRequest({ id: "cat1", name: "Existing" }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 404 when category not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCategoryFindOne.mockResolvedValue(null);
    mockCategoryFindOneAndUpdate.mockResolvedValue(null);
    const res = await PUT(makeRequest({ id: "cat1", name: "New" }));
    const data = await res.json();
    expect(res.status).toBe(404);
  });

  it("should return 200 on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCategoryFindOne.mockResolvedValue(null);
    mockCategoryFindOneAndUpdate.mockResolvedValue({ _id: "cat1", name: "New" });
    const res = await PUT(makeRequest({ id: "cat1", name: "New" }));
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should return 500 when update throws", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCategoryFindOne.mockRejectedValue(new Error("DB error"));
    const res = await PUT(makeRequest({ id: "cat1", name: "New" }));
    const data = await res.json();
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/categories", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await DELETE(makeRequest({ id: "cat1" }));
    expect(res.status).toBe(401);
  });

  it("should return 400 when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const res = await DELETE(makeRequest({ id: "cat1" }));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 400 when id is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    const res = await DELETE(makeRequest({}));
    const data = await res.json();
    expect(res.status).toBe(400);
  });

  it("should return 404 when category not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCategoryFindOneAndDelete.mockResolvedValue(null);
    const res = await DELETE(makeRequest({ id: "cat1" }));
    const data = await res.json();
    expect(res.status).toBe(404);
  });

  it("should return 200 on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCategoryFindOneAndDelete.mockResolvedValue({ _id: "cat1" });
    const res = await DELETE(makeRequest({ id: "cat1" }));
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should return 500 when delete throws", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue(mockUserWithCouple);
    mockCategoryFindOneAndDelete.mockRejectedValue(new Error("DB error"));
    const res = await DELETE(makeRequest({ id: "cat1" }));
    const data = await res.json();
    expect(res.status).toBe(500);
  });
});
