import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    avatar?: string | null;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      userId: string;
      name?: string | null;
      email?: string | null;
      avatar?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userId?: string;
    avatar?: string | null;
  }
}
