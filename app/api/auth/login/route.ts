import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const res = await fetch("http://localhost:8000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await res.json();

  (await cookies()).set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return Response.json({ success: true });
}
