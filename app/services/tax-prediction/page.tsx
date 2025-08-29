"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calculator, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

export default function TaxPredictionPage() {
  const [plotId, setPlotId] = useState("")
  const [paymentHistory, setPaymentHistory] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePredictTax = async () => {
    if (!plotId.trim() || !paymentHistory.trim()) {
      setError("Please enter both plot ID and payment history")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    // Parse payment history into array
    const payments = paymentHistory
      .split(",")
      .map((p) => Number.parseFloat(p.trim()))
      .filter((p) => !isNaN(p))

    const response = await apiClient.predictTax(plotId, payments)

    if (response.success) {
      setResult(response.data)
    } else {
      setError(response.error || "Failed to predict tax compliance")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-3 text-white">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Tax Compliance Prediction</h1>
                <p className="text-muted-foreground">Predict tax evasion risks using LSTM networks</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Tax Analysis Input</CardTitle>
              <CardDescription>Enter plot information and payment history for compliance prediction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="plot-id">Plot ID</Label>
                <Input
                  id="plot-id"
                  value={plotId}
                  onChange={(e) => setPlotId(e.target.value)}
                  placeholder="e.g., PLOT-BD-2024-001"
                />
              </div>

              <div>
                <Label htmlFor="payment-history">Payment History (comma-separated amounts)</Label>
                <Input
                  id="payment-history"
                  value={paymentHistory}
                  onChange={(e) => setPaymentHistory(e.target.value)}
                  placeholder="e.g., 5000, 4800, 5200, 4900, 5100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter last 5-10 tax payment amounts separated by commas
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Analysis Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Payment sequence analysis using LSTM</li>
                  <li>• Historical compliance pattern detection</li>
                  <li>• Risk scoring based on payment irregularities</li>
                </ul>
              </div>

              <Button
                onClick={handlePredictTax}
                disabled={loading || !plotId.trim() || !paymentHistory.trim()}
                className="w-full"
              >
                {loading ? "Analyzing Compliance..." : "Predict Tax Compliance"}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Analysis</CardTitle>
              <CardDescription>Tax evasion risk assessment using LSTM networks</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="text-center">
                    {result.evasion_risk > 0.6 ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-full bg-destructive/10 text-destructive mx-auto w-fit">
                          <AlertTriangle className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-destructive">High Risk</h3>
                        <p className="text-muted-foreground">High probability of tax evasion detected</p>
                      </div>
                    ) : result.evasion_risk > 0.3 ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-full bg-yellow-100 text-yellow-600 mx-auto w-fit">
                          <TrendingUp className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-yellow-600">Medium Risk</h3>
                        <p className="text-muted-foreground">Some irregularities in payment patterns</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-4 rounded-full bg-green-100 text-green-600 mx-auto w-fit">
                          <CheckCircle className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-green-600">Low Risk</h3>
                        <p className="text-muted-foreground">Consistent payment patterns detected</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Evasion Risk Score</Label>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-medium">{(result.evasion_risk * 100).toFixed(1)}%</span>
                          <Badge
                            variant={
                              result.evasion_risk > 0.6
                                ? "destructive"
                                : result.evasion_risk > 0.3
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {result.evasion_risk > 0.6
                              ? "High Risk"
                              : result.evasion_risk > 0.3
                                ? "Medium Risk"
                                : "Low Risk"}
                          </Badge>
                        </div>
                        <Progress value={result.evasion_risk * 100} className="h-2" />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Compliance Status</Label>
                      <div className="mt-2">
                        <Badge variant={result.evasion_risk > 0.6 ? "destructive" : "default"} className="text-sm">
                          {result.evasion_risk > 0.6 ? "REQUIRES INVESTIGATION" : "COMPLIANT"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Recommendations</Label>
                      <div className="mt-2 space-y-1">
                        {result.evasion_risk > 0.6 ? (
                          <>
                            <p className="text-sm">• Schedule compliance audit</p>
                            <p className="text-sm">• Review payment history in detail</p>
                            <p className="text-sm">• Send compliance notice</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm">• Continue regular monitoring</p>
                            <p className="text-sm">• Maintain current payment schedule</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter plot information and payment history to analyze tax compliance</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>Advanced AI technologies for tax compliance prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-lg bg-chart-3/10 text-chart-3 mx-auto w-fit mb-3">
                  <Calculator className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">LSTM Networks</h3>
                <p className="text-sm text-muted-foreground">
                  Long Short-Term Memory networks for payment sequence analysis
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-accent/10 text-accent-foreground mx-auto w-fit mb-3">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Pattern Recognition</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced pattern detection in payment behaviors and timing
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-primary/10 text-primary mx-auto w-fit mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Compliance Boost</h3>
                <p className="text-sm text-muted-foreground">
                  40% improvement in tax compliance through predictive analytics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
