import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_URL || "http://0.0.0.0:8000"
const API_KEY = process.env.API_KEY || "dev-key-123"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}/verify_ownership/${id}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Ownership verification API error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify ownership" }, { status: 500 })
  }
}
