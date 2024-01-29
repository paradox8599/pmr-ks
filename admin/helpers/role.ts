import { Role } from "../../src/lib/types/auth";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function IsRole(role: Role): (args: any) => boolean {
  return ({ session }) => ((session?.data.role ?? 0) & role) > 0;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function IsNotRole(role: Role): (args: any) => boolean {
  const restRole = ~(~0 << 8) ^ role;
  return ({ session }) => ((session?.data.role ?? 0) & restRole) > 0;
}
