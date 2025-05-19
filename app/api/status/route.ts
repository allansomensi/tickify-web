export async function GET() {
  const res = await fetch("http://localhost:8000/api/v1/status", {
    method: "GET",
  });

  if (!res.ok) {
    return Response.json(
      { error: "Failed to fetch status" },
      { status: res.status },
    );
  }

  const data = await res.json();
  return Response.json(data);
}
