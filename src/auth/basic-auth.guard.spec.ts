import { ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BasicAuthGuard } from "./basic-auth.guard";

type RequestHeaders = { authorization?: string };

const createContext = (headers: RequestHeaders): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  }) as unknown as ExecutionContext;

describe("BasicAuthGuard", () => {
  it("rejects requests when the token is not configured", () => {
    const configService = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as ConfigService;
    const guard = new BasicAuthGuard(configService);

    expect(
      guard.canActivate(createContext({ authorization: "Basic token" })),
    ).toBe(false);
  });

  it("rejects requests without a valid authorization header", () => {
    const configService = {
      get: jest.fn().mockReturnValue("token"),
    } as unknown as ConfigService;
    const guard = new BasicAuthGuard(configService);

    expect(guard.canActivate(createContext({}))).toBe(false);
    expect(
      guard.canActivate(createContext({ authorization: "Bearer token" })),
    ).toBe(false);
  });

  it("accepts the configured Basic authorization header", () => {
    const configService = {
      get: jest.fn().mockReturnValue("token"),
    } as unknown as ConfigService;
    const guard = new BasicAuthGuard(configService);

    expect(
      guard.canActivate(createContext({ authorization: "Basic token" })),
    ).toBe(true);
  });
});
