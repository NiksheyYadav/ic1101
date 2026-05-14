import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 
    "http://aetheris-api-prod.eba-3ijumbws.ap-south-1.elasticbeanstalk.com";
    
  try {
    const body = await req.json();
    console.log("[Sync-Fallback] Syncing to backend:", backendUrl);
    
    const response = await fetch(`${backendUrl}/v1/auth/github-sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Sync-Fallback] Error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
