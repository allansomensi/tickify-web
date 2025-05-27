import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/types/user";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.decode(token) as {
      sub: string;
      role: string;
      iat?: number;
      exp?: number;
    };
    if (!decoded || !decoded.sub || !decoded.role) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const user: Pick<User, "username" | "role"> = {
      username: decoded.sub,
      role: decoded.role,
    };
    return Response.json(user);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
