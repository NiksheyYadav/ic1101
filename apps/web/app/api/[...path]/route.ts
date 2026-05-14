import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(request, params.path);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(request, params.path);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(request, params.path);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleProxy(request, params.path);
}

async function handleProxy(request: NextRequest, pathArray: string[]) {
  try {
    // Determine target URL
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    // Fix common mistake where user adds /docs to the API URL
    if (baseUrl.endsWith("/docs")) {
      baseUrl = baseUrl.replace(/\/docs$/, "");
    }
    // Remove trailing slash
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }

    const path = pathArray.join("/");
    const searchParams = request.nextUrl.search;
    
    const targetUrl = `${baseUrl}/${path}${searchParams}`;

    // Read request body if present
    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const body = hasBody ? await request.text() : undefined;

    // Filter headers to avoid issues with host and origin
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      // Don't forward host or origin, let fetch handle it
      if (!['host', 'origin', 'referer', 'connection', 'content-length'].includes(lowerKey)) {
        headers.set(key, value);
      }
    });

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: body,
      // @ts-ignore
      duplex: 'half' 
    });

    // Get response body and content type
    const contentType = response.headers.get("content-type");
    let responseBody;
    
    if (contentType?.includes("application/zip") || contentType?.includes("application/octet-stream")) {
      responseBody = await response.blob();
    } else {
      responseBody = await response.text();
    }

    // Forward response headers
    const resHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (!['connection', 'content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        resHeaders.set(key, value);
      }
    });

    return new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders
    });
  } catch (error: any) {
    console.error("API Proxy Error:", error);
    return new Response(JSON.stringify({ error: "API Proxy Error", details: error.message }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
}
