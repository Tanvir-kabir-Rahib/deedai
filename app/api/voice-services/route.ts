import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.API_URL || "http://0.0.0.0:8000"
const API_KEY = process.env.API_KEY || "dev-key-123"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "Audio file is required" }, { status: 400 })
    }

    const backendFormData = new FormData()
    backendFormData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/asr_bn`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
      },
      body: backendFormData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Voice services API error:", error)
    return NextResponse.json({ success: false, error: "Failed to transcribe audio" }, { status: 500 })
  }
}
