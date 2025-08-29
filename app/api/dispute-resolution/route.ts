import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_URL || "http://0.0.0.0:8000"
const API_KEY = process.env.API_KEY || "dev-key-123"

export async function POST(request: NextRequest) {
  try {
    const { state } = await request.json()

    if (!state) {
      return NextResponse.json({ success: false, error: "State data is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/resolve_dispute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ state }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Dispute resolution API error:", error)
    return NextResponse.json({ success: false, error: "Failed to resolve dispute" }, { status: 500 })
  }
}
