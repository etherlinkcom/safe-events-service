import { getRequiredSecret, isUsableSecret } from "./required-secret";

describe("required secret validation", () => {
  it("accepts sufficiently long non-placeholder values", () => {
    expect(isUsableSecret("a-secure-value-with-sufficient-length")).toBe(true);
  });

  it("rejects missing, short, and placeholder values", () => {
    expect(isUsableSecret(undefined)).toBe(false);
    expect(isUsableSecret("short")).toBe(false);
    expect(isUsableSecret("replace-with-a-real-secret-value")).toBe(false);
    expect(isUsableSecret("password-value-that-is-long-enough")).toBe(false);
  });

  it("throws a configuration error for invalid required values", () => {
    expect(() => getRequiredSecret("TEST_SECRET", undefined)).toThrow(
      "TEST_SECRET must be set",
    );
  });
});
