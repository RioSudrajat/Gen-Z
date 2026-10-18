const allowedPaths = [
  /^\/app\/?$/,
  /^\/app\/(?:assets(?:\/[a-z0-9-]+)?|portfolio(?:\/[a-z0-9-]+)?|rewards|points|gen-z|activity|account|support)\/?$/,
];

export function allowedReturnTo(value: unknown) {
  return typeof value === "string" &&
    allowedPaths.some((pattern) => pattern.test(value))
    ? value
    : "/app";
}
