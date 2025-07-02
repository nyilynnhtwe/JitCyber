// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullName: string;
      phone: string;
      dob: string;
    };
    expires: string;
  }

  interface User {
    id: string;
    fullName: string;
    phone: string;
    dob: string;
  }

  interface JWT {
    id: string;
    fullName: string;
    phone: string;
  }
}
