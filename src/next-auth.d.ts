// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullname: string;
      phone: string;
      dob: string;
      scores: Record<string, number>[]; // Adjust type as needed
    };
    expires: string;
  }

  interface User {
    id: string;
    fullname: string;
    phone: string;
    dob: string;
    scores: Record<string, number>[]; // Adjust type as needed
  }

  interface JWT {
    id: string;
    fullname: string;
    phone: string;
    dob: string;
    scores: Record<string, number>[]; // Adjust type as needed
  }
}
