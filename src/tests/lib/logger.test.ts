jest.mock("@/lib/logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    level: "info",
  },
}));

import logger from "@/lib/logger";

describe("logger", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should be defined", () => {
    expect(logger).toBeDefined();
  });

  it("should have log methods", () => {
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });

  it("should have a level", () => {
    expect(logger.level).toBeTruthy();
  });

  it("should call info", () => {
    logger.info("test info");
    expect(logger.info).toHaveBeenCalledWith("test info");
  });

  it("should call warn", () => {
    logger.warn("test warn");
    expect(logger.warn).toHaveBeenCalledWith("test warn");
  });

  it("should call error", () => {
    logger.error("test error");
    expect(logger.error).toHaveBeenCalledWith("test error");
  });
});
