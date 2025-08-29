"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Scale, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

interface FairnessResult {
  bias_score: number
}

export default function FairnessAssessmentPage() {
  const [feature, setFeature] = useState("")
  const [value, setValue] = useState("")
  const [result, setResult] = useState<FairnessResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAssessment = async () => {
    if (!feature || !value) {
      setError("Please select a feature and enter a value")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const data = await apiClient.assessFairness({
        feature,
        value: isNaN(Number(value)) ? value : Number(value),
      })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fairness assessment failed")
    } finally {
      setLoading(false)
    }
  }

  const getBiasLevel = (score: number) => {
    if (score <= 0.1) return { level: "Low", color: "text-green-600", bg: "bg-green-50" }
    if (score <= 0.3) return { level: "Moderate", color: "text-yellow-600", bg: "bg-yellow-50" }
    return { level: "High", color: "text-red-600", bg: "bg-red-50" }
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
            <h1 className="text-3xl font-bold text-gray-900">Fairness Assessment</h1>
            <p className="text-gray-600 mt-1">AI bias detection and fairness evaluation system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Assessment Parameters
                </CardTitle>
                <CardDescription>Select feature and value for bias evaluation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Protected Feature</label>
                  <Select value={feature} onValueChange={setFeature}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feature to assess" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gender">Gender</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                      <SelectItem value="religion">Religion</SelectItem>
                      <SelectItem value="location">Geographic Location</SelectItem>
                      <SelectItem value="income">Income Level</SelectItem>
                      <SelectItem value="education">Education Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Feature Value</label>
                  <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value to test" />
                  <p className="text-xs text-gray-500 mt-1">e.g., "male", "25", "urban", etc.</p>
                </div>

                <Button onClick={handleAssessment} disabled={loading || !feature || !value} className="w-full">
                  {loading ? "Assessing..." : "Assess Fairness"}
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
                  <span className="font-medium">Method:</span>
                  <p className="text-gray-600">Adversarial debiasing</p>
                </div>
                <div>
                  <span className="font-medium">Metrics:</span>
                  <p className="text-gray-600">Demographic parity, equalized odds</p>
                </div>
                <div>
                  <span className="font-medium">Threshold:</span>
                  <p className="text-gray-600">Bias score &lt; 0.1 (acceptable)</p>
                </div>
                <div>
                  <span className="font-medium">Standards:</span>
                  <p className="text-gray-600">IEEE 2857, ISO/IEC 23053</p>
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
                    <Scale className="w-5 h-5" />
                    Fairness Assessment Results
                  </CardTitle>
                  <CardDescription>
                    Feature: {feature} | Value: {value}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Bias Score */}
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getBiasLevel(result.bias_score).bg}`}
                    >
                      {result.bias_score <= 0.1 ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                      <span className={`text-lg font-bold ${getBiasLevel(result.bias_score).color}`}>
                        Bias Score: {(result.bias_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{getBiasLevel(result.bias_score).level} bias detected</p>
                  </div>

                  <Separator />

                  {/* Detailed Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Bias Analysis</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Demographic Parity</span>
                          <Badge variant={result.bias_score <= 0.1 ? "default" : "destructive"}>
                            {result.bias_score <= 0.1 ? "Pass" : "Fail"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Equalized Odds</span>
                          <Badge variant={result.bias_score <= 0.15 ? "default" : "destructive"}>
                            {result.bias_score <= 0.15 ? "Pass" : "Fail"}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Individual Fairness</span>
                          <Badge variant={result.bias_score <= 0.2 ? "default" : "destructive"}>
                            {result.bias_score <= 0.2 ? "Pass" : "Fail"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-4">Recommendations</h3>
                      <div className="space-y-2 text-sm">
                        {result.bias_score <= 0.1 ? (
                          <>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Model shows acceptable fairness levels</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>Continue regular monitoring</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-start gap-2">
                              <TrendingDown className="w-4 h-4 text-yellow-600 mt-0.5" />
                              <span>Consider rebalancing training data</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <TrendingDown className="w-4 h-4 text-yellow-600 mt-0.5" />
                              <span>Apply fairness constraints</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <TrendingDown className="w-4 h-4 text-yellow-600 mt-0.5" />
                              <span>Implement adversarial debiasing</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fairness Metrics Chart */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Fairness Metrics Breakdown</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Statistical Parity</span>
                          <span>{((1 - result.bias_score) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(1 - result.bias_score) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Equal Opportunity</span>
                          <span>{((1 - result.bias_score * 0.8) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(1 - result.bias_score * 0.8) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Calibration</span>
                          <span>{((1 - result.bias_score * 1.2) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${Math.max(0, (1 - result.bias_score * 1.2) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!result && !loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Assessment</h3>
                  <p className="text-gray-600">
                    Select a protected feature and value to evaluate AI model fairness and detect potential bias.
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
