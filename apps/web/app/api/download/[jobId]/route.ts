import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  const token = request.headers.get("authorization");

  // Also check query param fallback
  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token");

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = token;
  } else if (queryToken) {
    headers["Authorization"] = `Bearer ${queryToken}`;
  }

  try {
    const res = await fetch(`${API_BASE}/v1/training-jobs/${jobId}/download`, {
      headers,
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Download failed" },
        { status: res.status }
      );
    }

    const blob = await res.arrayBuffer();
    const filename = `aetheris_model_${jobId.slice(0, 8)}.zip`;

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": blob.byteLength.toString(),
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Backend unreachable" },
      { status: 502 }
    );
  }
}
