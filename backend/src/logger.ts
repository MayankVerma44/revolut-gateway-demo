type Level = "debug" | "info" | "warn" | "error";

const rank: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function redact(value: unknown): unknown {
  if (value && typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(input)) {
      const lower = key.toLowerCase();
      if (
        lower.includes("secret") ||
        lower.includes("authorization") ||
        lower.includes("password") ||
        lower === "email" ||
        lower === "phone" ||
        lower.includes("address")
      ) {
        output[key] = "[redacted]";
      } else {
        output[key] = redact(nested);
      }
    }
    return output;
  }
  return value;
}

export function log(level: Level, event: string, fields: Record<string, unknown> = {}): void {
  const min = (process.env.LOG_LEVEL as Level) || "info";
  if (rank[level] < rank[min]) return;
  const line = {
    ts: new Date().toISOString(),
    level,
    event,
    ...((redact(fields) as Record<string, unknown>) ?? {}),
  };
  const serialized = JSON.stringify(line);
  if (level === "error") console.error(serialized);
  else if (level === "warn") console.warn(serialized);
  else console.log(serialized);
}
