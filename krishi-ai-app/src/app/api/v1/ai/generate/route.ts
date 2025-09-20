import { NextResponse } from "next/server";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export async function POST(req: Request) {
  try {
    const body = await req.json(); 
    // body should contain { lat, lon, cropHistory } etc.
    
    const res = await fetch(`${FASTAPI_URL}/ai/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`FastAPI error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error calling FastAPI:", error);
    return NextResponse.json(
      { error: "Failed to fetch from AI microservice" },
      { status: 500 }
    );
  }
}
