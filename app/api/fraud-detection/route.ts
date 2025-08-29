import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_URL || "http://0.0.0.0:8000"
const API_KEY = process.env.API_KEY || "dev-key-123"

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ success: false, error: "Data array is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/detect_fraud`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ data }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Fraud detection API error:", error)
    return NextResponse.json({ success: false, error: "Failed to detect fraud" }, { status: 500 })
  }
}
