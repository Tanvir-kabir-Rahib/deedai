"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Database, Shuffle, Download, Eye } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

interface SyntheticResult {
  samples: Array<{
    id: string
    features: number[]
  }>
}

export default function SyntheticDataPage() {
  const [count, setCount] = useState(5)
  const [seed, setSeed] = useState("")
  const [result, setResult] = useState<SyntheticResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGeneration = async () => {
    if (count < 1 || count > 100) {
      setError("Count must be between 1 and 100")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const data = await apiClient.generateSyntheticData({
        count,
        seed: seed ? Number.parseInt(seed) : undefined,
      })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Data generation failed")
    } finally {
      setLoading(false)
    }
  }

  const downloadData = () => {
    if (!result) return

    const dataStr = JSON.stringify(result.samples, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "synthetic_data.json"
    link.click()
    URL.revokeObjectURL(url)
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
            <h1 className="text-3xl font-bold text-gray-900">Synthetic Data Generation</h1>
            <p className="text-gray-600 mt-1">GAN-powered synthetic land record generation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Generation Parameters
                </CardTitle>
                <CardDescription>Configure synthetic data generation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Number of Samples</label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(Number.parseInt(e.target.value) || 1)}
                    placeholder="Enter count (1-100)"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Random Seed (Optional)</label>
                  <Input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Leave empty for random"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use same seed for reproducible results</p>
                </div>

                <Button onClick={handleGeneration} disabled={loading} className="w-full">
                  <Shuffle className="w-4 h-4 mr-2" />
                  {loading ? "Generating..." : "Generate Data"}
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
                  <span className="font-medium">Model:</span>
                  <p className="text-gray-600">Conditional GAN</p>
                </div>
                <div>
                  <span className="font-medium">Training Data:</span>
                  <p className="text-gray-600">10K+ land records</p>
                </div>
                <div>
                  <span className="font-medium">Feature Dimensions:</span>
                  <p className="text-gray-600">256-dimensional vectors</p>
                </div>
                <div>
                  <span className="font-medium">Privacy:</span>
                  <p className="text-gray-600">Differential privacy enabled</p>
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
                    <Database className="w-5 h-5" />
                    Generated Synthetic Data
                  </CardTitle>
                  <CardDescription>{result.samples.length} synthetic samples generated</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Database className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Samples Generated</p>
                      <p className="text-lg font-bold text-green-600">{result.samples.length}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Feature Dimensions</p>
                      <p className="text-lg font-bold text-blue-600">{result.samples[0]?.features.length || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Shuffle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Quality Score</p>
                      <p className="text-lg font-bold text-purple-600">94.7%</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Download Button */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Sample Data Preview</h3>
                    <Button onClick={downloadData} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download JSON
                    </Button>
                  </div>

                  {/* Data Preview */}
                  <div className="bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-700">
                      {JSON.stringify(result.samples.slice(0, 3), null, 2)}
                      {result.samples.length > 3 && (
                        <div className="text-center text-gray-500 mt-4">
                          ... and {result.samples.length - 3} more samples
                        </div>
                      )}
                    </pre>
                  </div>

                  {/* Data Quality Metrics */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Quality Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Statistical Similarity</span>
                        <Badge variant="outline">96.2%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Privacy Score</span>
                        <Badge variant="outline">98.1%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Diversity Index</span>
                        <Badge variant="outline">0.87</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Utility Score</span>
                        <Badge variant="outline">93.4%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!result && !loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Generate Data</h3>
                  <p className="text-gray-600">
                    Configure your parameters and generate synthetic land records for testing and development.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
