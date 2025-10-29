import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    vipNumber?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      vipNumber?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    vipNumber?: string | null;
  }
}

