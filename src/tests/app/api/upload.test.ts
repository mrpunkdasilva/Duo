jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  __esModule: true,
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

import { POST } from "@/app/api/upload/route";
import { v2 as cloudinary } from "cloudinary";

function makeRequestWithFile(file: File | null) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  return {
    formData: jest.fn().mockResolvedValue(formData),
  } as unknown as Request;
}

describe("POST /api/upload", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return 400 when no file", async () => {
    const res = await POST(makeRequestWithFile(null));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("No file");
  });

  it("should return url on success", async () => {
    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    Object.defineProperty(mockFile, "arrayBuffer", { value: () => Promise.resolve(new ArrayBuffer(4)) });
    const req = makeRequestWithFile(mockFile);

    const uploadStreamMock = cloudinary.uploader.upload_stream as jest.Mock;
    uploadStreamMock.mockImplementation((_opts: unknown, cb: (err: null, result: { secure_url: string }) => void) => {
      cb(null, { secure_url: "https://cloudinary.com/img.jpg" });
      return { end: jest.fn() };
    });

    const res = await POST(req);
    const data = await res.json();
    expect(data.url).toBe("https://cloudinary.com/img.jpg");
  });

  it("should return 500 when upload fails", async () => {
    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    Object.defineProperty(mockFile, "arrayBuffer", { value: () => Promise.resolve(new ArrayBuffer(4)) });
    const req = makeRequestWithFile(mockFile);

    const uploadStreamMock = cloudinary.uploader.upload_stream as jest.Mock;
    uploadStreamMock.mockImplementation((_opts: unknown, cb: (err: Error) => void) => {
      cb(new Error("Upload failed"));
      return { end: jest.fn() };
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
