import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch("http://localhost:8000/api/v1/users/count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch user count" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err: any) {
    console.error("GET /api/users/count failed:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
