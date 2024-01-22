import { Role } from "@/lib/types/auth";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function IsRole(role: Role): (args: any) => boolean {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return ({ session }: any) => {
    if (session && session.data.role & role) {
      return true;
    }
    // console.error('\x1b[31m"%s %s\x1b[0m',
    //   `[AUTH], TABLE:${listKey}, OPERATION:${operation}`,
    //   `role:${session ? Role[session.data.role] : "no session"}-${Role[role]}`)
    return false;
  };
}
