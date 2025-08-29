export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `http://0.0.0.0:8000${endpoint}`
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      }

      console.log("[v0] Making secure API request to:", url)

      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("[v0] API response received:", result)

      return result
    } catch (error) {
      console.error("[v0] API request failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Deed Parsing
  async parseDeed(text: string) {
    return this.request("/deed-parsing", {
      method: "POST",
      body: JSON.stringify({ text }),
    })
  }

  // Fraud Detection
  async detectFraud(data: number[]) {
    return this.request("/fraud-detection", {
      method: "POST",
      body: JSON.stringify({ data }),
    })
  }

  // Dispute Prediction
  async predictDispute(plotId: string, ownershipData: string, neighbors: string[]) {
    return this.request("/dispute-prediction", {
      method: "POST",
      body: JSON.stringify({
        plot_id: plotId,
        ownership_data: ownershipData,
        neighbors,
      }),
    })
  }

  // Boundary Validation
  async validateBoundary(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    return this.request("/boundary-validation", {
      method: "POST",
      body: formData,
    })
  }

  // Tax Prediction
  async predictTax(plotId: string, paymentHistory: number[]) {
    return this.request("/tax-prediction", {
      method: "POST",
      body: JSON.stringify({
        plot_id: plotId,
        payment_history: paymentHistory,
      }),
    })
  }

  // Dispute Resolution
  async resolveDispute(disputeId: string, disputeDetails: string, parties: string) {
    return this.request("/dispute-resolution", {
      method: "POST",
      body: JSON.stringify({
        dispute_id: disputeId,
        dispute_details: disputeDetails,
        parties,
      }),
    })
  }

  // Ownership Verification
  async verifyOwnership(id: string) {
    const response = await this.request(`/ownership-verification/${id}`, {
      method: "GET",
    })
    return response.success ? response.data : Promise.reject(new Error(response.error))
  }

  // Voice Services (Bengali ASR)
  async processVoice(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await this.request("/voice-services", {
      method: "POST",
      body: formData,
    })
    return response.success ? response.data : Promise.reject(new Error(response.error))
  }

  // Synthetic Data Generation
  async generateSyntheticData(params: { seed?: number; count: number }) {
    const response = await this.request("/synthetic-data", {
      method: "POST",
      body: JSON.stringify(params),
    })
    return response.success ? response.data : Promise.reject(new Error(response.error))
  }

  // Fairness Assessment
  async assessFairness(params: { feature: string; value: any }) {
    const response = await this.request("/fairness-assessment", {
      method: "POST",
      body: JSON.stringify(params),
    })
    return response.success ? response.data : Promise.reject(new Error(response.error))
  }
}

export const apiClient = new ApiClient()
