import { cookies } from "next/headers";
import { User } from "@/types/user";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const token = (await cookies()).get("token")?.value;
  const { id } = params;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch user" },
        { status: res.status },
      );
    }

    const data: User = await res.json();
    return Response.json(data);
  } catch (err: any) {
    console.error(`GET /api/users/edit/${id} failed:`, err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const token = (await cookies()).get("token")?.value;
  const { id } = params;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const payload = { ...body, id };

    const res = await fetch(`http://localhost:8000/api/v1/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return Response.json(
        { error: errorData.error || "Failed to update user" },
        { status: res.status },
      );
    }

    const data: User = await res.json();
    return Response.json(data);
  } catch (err: any) {
    console.error(`PUT /api/users/edit/${id} failed:`, err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
