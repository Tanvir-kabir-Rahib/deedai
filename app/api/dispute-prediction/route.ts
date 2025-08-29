import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_URL || "http://0.0.0.0:8000"
const API_KEY = process.env.API_KEY || "dev-key-123"

export async function POST(request: NextRequest) {
  try {
    const { graphData } = await request.json()

    if (!graphData) {
      return NextResponse.json({ success: false, error: "Graph data is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/predict_dispute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ graph_data: graphData }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Dispute prediction API error:", error)
    return NextResponse.json({ success: false, error: "Failed to predict dispute" }, { status: 500 })
  }
}
