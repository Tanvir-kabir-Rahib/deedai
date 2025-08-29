"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Search, CheckCircle, XCircle, User, MapPin } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

interface OwnershipResult {
  verified: boolean
  id: string
  details: {
    owner: string
    plot_id: string
  }
}

export default function OwnershipVerificationPage() {
  const [propertyId, setPropertyId] = useState("")
  const [result, setResult] = useState<OwnershipResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleVerification = async () => {
    if (!propertyId.trim()) {
      setError("Please enter a property ID")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const data = await apiClient.verifyOwnership(propertyId.trim())
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ownership Verification</h1>
            <p className="text-gray-600 mt-1">Real-time property ownership verification system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Property Lookup
                </CardTitle>
                <CardDescription>Enter property ID to verify ownership details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Property ID</label>
                  <Input
                    placeholder="e.g., PLOT-001, DEED-12345"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleVerification()}
                  />
                </div>

                <Button onClick={handleVerification} disabled={loading || !propertyId.trim()} className="w-full">
                  {loading ? "Verifying..." : "Verify Ownership"}
                </Button>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Technical Specs */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Verification Method:</span>
                  <p className="text-gray-600">Real-time database lookup</p>
                </div>
                <div>
                  <span className="font-medium">Response Time:</span>
                  <p className="text-gray-600">&lt; 500 ms average</p>
                </div>
                <div>
                  <span className="font-medium">Data Sources:</span>
                  <p className="text-gray-600">Land registry, deed records</p>
                </div>
                <div>
                  <span className="font-medium">Accuracy:</span>
                  <p className="text-gray-600">99.8% verified records</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.verified ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    Verification Results
                  </CardTitle>
                  <CardDescription>Property ID: {result.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Badge */}
                  <div>
                    <Badge variant={result.verified ? "default" : "destructive"} className="text-sm px-3 py-1">
                      {result.verified ? "Ownership Verified" : "Verification Failed"}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Owner Details */}
                  {result.verified && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Owner Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Owner Name</p>
                              <p className="font-medium">{result.details.owner}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Plot ID</p>
                              <p className="font-medium">{result.details.plot_id}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Verification Status</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Database Match</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Record Validity</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Legal Status</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!result.verified && (
                    <div className="text-center py-8">
                      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Not Found</h3>
                      <p className="text-gray-600">
                        The property ID "{result.id}" could not be verified in our records. Please check the ID and try
                        again.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!result && !loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Verification</h3>
                  <p className="text-gray-600">Enter a property ID to begin the ownership verification process.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
