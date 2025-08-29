import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_URL || "http://0.0.0.0:8000"
const API_KEY = process.env.API_KEY || "dev-key-123"

export async function POST(request: NextRequest) {
  try {
    const { feature, value } = await request.json()

    if (!feature || value === undefined) {
      return NextResponse.json({ success: false, error: "Feature and value are required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/assess_fairness`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ feature, value }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Fairness assessment API error:", error)
    return NextResponse.json({ success: false, error: "Failed to assess fairness" }, { status: 500 })
  }
}
