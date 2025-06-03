import { Ticket } from "@/types/ticket";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const token = (await cookies()).get("token")?.value;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // If an ID is provided, fetch a single ticket
    if (id) {
      const res = await fetch(`http://localhost:8000/api/v1/tickets/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        return Response.json(
          { error: "Failed to fetch ticket" },
          { status: res.status },
        );
      }

      const data = await res.json();
      return Response.json(data);
    }

    // Otherwise, fetch all tickets
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
  } catch (err) {
    console.error("GET /api/tickets failed:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const res = await fetch("http://localhost:8000/api/v1/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return Response.json(
        { error: errorData.error || "Failed to create tickets" },
        { status: res.status },
      );
    }

    const data: Ticket = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("POST /api/tickets failed:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return Response.json({ error: "Missing ticket ID" }, { status: 400 });
    }

    const res = await fetch("http://localhost:8000/api/v1/tickets", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const error = await res.json();
      return Response.json(
        { error: error.message || "Failed to delete ticket" },
        { status: res.status },
      );
    }

    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/tickets failed:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
