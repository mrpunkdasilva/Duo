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
const mockPlaceCountDocuments = jest.fn();
const mockPlaceAggregate = jest.fn();
const mockPlaceFind = jest.fn();

jest.mock("@/models/user", () => ({
  __esModule: true,
  default: { findOne: (...args: unknown[]) => mockUserFindOne(...args) },
}));

jest.mock("@/models/place", () => ({
  __esModule: true,
  default: {
    countDocuments: (...args: unknown[]) => mockPlaceCountDocuments(...args),
    aggregate: (...args: unknown[]) => mockPlaceAggregate(...args),
    find: (...args: unknown[]) => mockPlaceFind(...args),
  },
}));

import { GET } from "@/app/api/stats/route";
import { getServerSession } from "next-auth";

const mockSession = { user: { email: "test@test.com" } };

describe("GET /api/stats", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 401 when no session", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await GET({} as any);
    expect(res.status).toBe(401);
  });

  it("should return zeroed stats when user has no couple", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: null });
    const res = await GET({} as any);
    const data = await res.json();
    expect(data.data.totalPlaces).toBe(0);
    expect(data.data.visitedPlaces).toBe(0);
    expect(data.data.pendingPlaces).toBe(0);
  });

  it("should return stats on success", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: "c1" });
    mockPlaceCountDocuments
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(4);
    mockPlaceAggregate.mockResolvedValue([
      { _id: "restaurant", count: 5 },
      { _id: "park", count: 5 },
    ]);
    const chain = { sort: jest.fn().mockReturnThis(), limit: jest.fn().mockResolvedValue([]) };
    mockPlaceFind.mockReturnValue(chain);

    const res = await GET({} as any);
    const data = await res.json();
    expect(data.data.totalPlaces).toBe(10);
    expect(data.data.visitedPlaces).toBe(4);
    expect(data.data.pendingPlaces).toBe(6);
    expect(data.data.categoryBreakdown.restaurant).toBe(5);
    expect(data.data.categoryBreakdown.park).toBe(5);
  });

  it("should return 500 when query throws", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
    mockUserFindOne.mockResolvedValue({ coupleId: "c1" });
    mockPlaceCountDocuments.mockRejectedValue(new Error("DB error"));
    const res = await GET({} as any);
    const data = await res.json();
    expect(res.status).toBe(500);
  });
});
