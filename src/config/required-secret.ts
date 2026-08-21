const PLACEHOLDER_PATTERN =
  /^(replace-with|change-me|changeme|password|secret)([-_]|$)/i;

export const isUsableSecret = (
  value: string | undefined,
  minimumLength = 16,
): value is string =>
  Boolean(
    value && value.length >= minimumLength && !PLACEHOLDER_PATTERN.test(value),
  );

export const getRequiredSecret = (
  name: string,
  value: string | undefined,
  minimumLength = 16,
): string => {
  if (!isUsableSecret(value, minimumLength)) {
    throw new Error(
      `${name} must be set to a non-placeholder value of at least ${minimumLength} characters.`,
    );
  }
  return value;
};
