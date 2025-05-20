import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // koristi relativni ili alias path

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
