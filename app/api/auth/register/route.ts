export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch("http://localhost:8000/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    return Response.json(
      { error: error?.message || "Registration failed" },
      { status: res.status },
    );
  }

  return Response.json({ success: true });
}
