import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch("http://localhost:8000/api/v1/tickets", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return Response.json(
      { error: "Failed to fetch tickets" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return Response.json(data);
}
