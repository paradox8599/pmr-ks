import { Role } from "@/lib/types/auth";

export function IsRole(role: Role): (args: any) => boolean {
  return ({ session }: any) => {
    if (session && session.data.role & role) {
      return true;
    } else {
      // console.error('\x1b[31m"%s %s\x1b[0m',
      //   `[AUTH], TABLE:${listKey}, OPERATION:${operation}`,
      //   `role:${session ? Role[session.data.role] : "no session"}-${Role[role]}`)
      return false;
    }
  };
}
