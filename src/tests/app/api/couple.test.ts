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

jest.mock("@/lib/helpers", () => ({
  generateInviteCode: jest.fn(() => "ABC123"),
}));

const mockUserFindById = jest.fn();
const mockUserSave = jest.fn();
const mockCoupleFindById = jest.fn();
const mockCoupleFindOne = jest.fn();
const mockCoupleCreate = jest.fn();
const mockCoupleDeleteOne = jest.fn();

jest.mock("@/models/user", () => ({
  __esModule: true,
  default: {
    findById: (...args: unknown[]) => mockUserFindById(...args),
  },
}));

jest.mock("@/models/couple", () => ({
  __esModule: true,
  default: {
    findById: (...args: unknown[]) => mockCoupleFindById(...args),
    findOne: (...args: unknown[]) => mockCoupleFindOne(...args),
    create: (...args: unknown[]) => mockCoupleCreate(...args),
    deleteOne: (...args: unknown[]) => mockCoupleDeleteOne(...args),
  },
}));

import { GET, PUT, POST } from "@/app/api/couple/route";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

function makeRequest(body?: unknown) {
  return { json: jest.fn().mockResolvedValue(body) } as unknown as NextRequest;
}

const mockSession = { user: { id: "user1" } };

function makePopulatedUser(overrides: Record<string, unknown> = {}) {
  return {
    _id: { toString: () => "user1" },
    name: "User 1",
    coupleId: "couple1",
    save: mockUserSave,
    ...overrides,
  };
}

describe("GET /api/couple", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("should return null data when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const user = makePopulatedUser({ coupleId: null as string | null });
    mockUserFindById.mockReturnValue({ populate: jest.fn().mockResolvedValue(user) });
    const res = await GET();
    const data = await res.json();
    expect(data.data).toBeNull();
  });

  it("should return partner info when couple has 2 users", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const user = makePopulatedUser();
    mockUserFindById.mockReturnValue({ populate: jest.fn().mockResolvedValue(user) });
    mockCoupleFindById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        inviteCode: "ABC123",
        users: [
          { _id: { toString: () => "user1" }, name: "User 1" },
          { _id: { toString: () => "user2" }, name: "User 2", image: "img.jpg" },
        ],
      }),
    });
    const res = await GET();
    const data = await res.json();
    expect(data.data.partner.name).toBe("User 2");
  });

  it("should return null partner when couple has only 1 user", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const user = makePopulatedUser();
    mockUserFindById.mockReturnValue({ populate: jest.fn().mockResolvedValue(user) });
    mockCoupleFindById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        inviteCode: "ABC123",
        users: [{ _id: { toString: () => "user1" }, name: "User 1" }],
      }),
    });
    const res = await GET();
    const data = await res.json();
    expect(data.data.partner).toBeNull();
  });
});

describe("PUT /api/couple", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await PUT();
    expect(res.status).toBe(401);
  });

  it("should return existing invite code if couple already exists", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue({
      _id: "user1",
      coupleId: "couple1",
      save: mockUserSave,
    });
    mockCoupleFindById.mockResolvedValue({ inviteCode: "EXISTING" });
    const res = await PUT();
    const data = await res.json();
    expect(data.data.inviteCode).toBe("EXISTING");
  });

  it("should create new couple and return invite code", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue({
      _id: "user1",
      coupleId: null,
      save: mockUserSave,
    });
    mockCoupleFindOne.mockResolvedValue(null);
    mockCoupleCreate.mockResolvedValue({ _id: "couple1", inviteCode: "ABC123" });
    const res = await PUT();
    const data = await res.json();
    expect(data.data.inviteCode).toBe("ABC123");
    expect(mockUserSave).toHaveBeenCalled();
  });
});

describe("POST /api/couple", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await POST(makeRequest({ inviteCode: "ABC123" }));
    expect(res.status).toBe(401);
  });

  it("should return 400 when inviteCode is missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("should return 404 when couple not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue({ _id: "user1", coupleId: null, save: mockUserSave });
    mockCoupleFindOne.mockResolvedValue(null);
    const res = await POST(makeRequest({ inviteCode: "ABC123" }));
    expect(res.status).toBe(404);
  });

  it("should return 400 when couple is full", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue({ _id: "user1", coupleId: null, save: mockUserSave });
    mockCoupleFindOne.mockResolvedValue({
      _id: "couple1",
      users: ["u1", "u2"],
    });
    const res = await POST(makeRequest({ inviteCode: "ABC123" }));
    expect(res.status).toBe(400);
  });

  it("should return 400 when user already in this couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue({
      _id: { toString: () => "user1" },
      coupleId: null,
      save: mockUserSave,
    });
    mockCoupleFindOne.mockResolvedValue({
      _id: "couple1",
      users: [{ toString: () => "user1" }],
      save: jest.fn(),
    });
    const res = await POST(makeRequest({ inviteCode: "ABC123" }));
    expect(res.status).toBe(400);
  });

  it("should return null data when user not found (GET)", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
    const res = await GET();
    const data = await res.json();
    expect(data.data).toBeNull();
  });

  it("should return null when couple is null (GET)", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const user = makePopulatedUser();
    mockUserFindById.mockReturnValue({ populate: jest.fn().mockResolvedValue(user) });
    mockCoupleFindById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });
    const res = await GET();
    const data = await res.json();
    expect(data.data).toBeNull();
  });

  it("should return 404 when user not found (PUT)", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue(null);
    const res = await PUT();
    expect(res.status).toBe(404);
  });

  it("should handle stale coupleId and create new couple (PUT)", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue({
      _id: "user1",
      coupleId: "staleCouple",
      save: mockUserSave,
    });
    mockCoupleFindById.mockResolvedValue(null);
    mockCoupleFindOne.mockResolvedValue(null);
    mockCoupleCreate.mockResolvedValue({ _id: "couple2", inviteCode: "NEW123" });
    const res = await PUT();
    const data = await res.json();
    expect(data.data.inviteCode).toBe("NEW123");
    expect(mockUserSave).toHaveBeenCalledTimes(2);
  });

  it("should retry invite code on collision (PUT)", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue({
      _id: "user1",
      coupleId: null,
      save: mockUserSave,
    });
    mockCoupleFindOne
      .mockResolvedValueOnce({ _id: "existing" })
      .mockResolvedValueOnce(null);
    mockCoupleCreate.mockResolvedValue({ _id: "couple1", inviteCode: "ABC123" });
    const res = await PUT();
    const data = await res.json();
    expect(data.data.inviteCode).toBe("ABC123");
  });

  it("should return 404 when user not found (POST)", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue(null);
    const res = await POST(makeRequest({ inviteCode: "ABC123" }));
    expect(res.status).toBe(404);
  });

  it("should clean up existing couple before joining new one (POST)", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    const mockSave = jest.fn();
    mockUserFindById.mockResolvedValue({
      _id: { toString: () => "user1" },
      coupleId: "oldCouple",
      save: mockSave,
    });

    const populatedCouple = {
      _id: "newCouple",
      users: [
        { _id: { toString: () => "user2" }, name: "User 2" },
        { _id: { toString: () => "user1" }, name: "User 1" },
      ],
    };

    mockCoupleFindById
      .mockResolvedValueOnce({ _id: "oldCouple", users: ["user1"] })
      .mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(populatedCouple) });

    mockCoupleFindOne.mockResolvedValue({
      _id: "newCouple",
      users: [{ toString: () => "user2" }],
      save: jest.fn(),
    });

    const res = await POST(makeRequest({ inviteCode: "ABC123" }));
    const data = await res.json();
    expect(data.data.partnerName).toBe("User 2");
  });

  it("should return 400 when existing couple has 2+ users (POST)", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue({
      _id: { toString: () => "user1" },
      coupleId: "existingCouple",
      save: mockUserSave,
    });
    mockCoupleFindById.mockResolvedValue({
      _id: "existingCouple",
      users: ["user1", "user2"],
    });
    const res = await POST(makeRequest({ inviteCode: "ABC123" }));
    expect(res.status).toBe(400);
  });

  it("should handle join success with fallback partner name (POST)", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindById.mockResolvedValue({
      _id: { toString: () => "user1" },
      coupleId: null,
      save: mockUserSave,
    });
    mockCoupleFindOne.mockResolvedValue({
      _id: "newCouple",
      users: [{ toString: () => "user2" }],
      save: jest.fn(),
    });
    mockCoupleFindById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: "newCouple",
        users: [
          { _id: { toString: () => "user2" }, name: null },
          { _id: { toString: () => "user1" }, name: "User 1" },
        ],
      }),
    });
    const res = await POST(makeRequest({ inviteCode: "ABC123" }));
    const data = await res.json();
    expect(data.data.partnerName).toBe("Parceiro(a)");
  });
});
