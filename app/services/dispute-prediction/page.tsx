"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Network, Users } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

export default function DisputePredictionPage() {
  const [plotId, setPlotId] = useState("")
  const [ownershipData, setOwnershipData] = useState("")
  const [neighboringPlots, setNeighboringPlots] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePredictDispute = async () => {
    if (!plotId.trim() || !ownershipData.trim()) {
      setError("Please enter plot ID and ownership data")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    // Parse neighboring plots
    const neighbors = neighboringPlots
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    const response = await apiClient.predictDispute(plotId, ownershipData, neighbors)

    if (response.success) {
      setResult(response.data)
    } else {
      setError(response.error || "Failed to predict dispute risk")
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
              <div className="p-2 rounded-lg bg-accent text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Dispute Forecasting Service</h1>
                <p className="text-muted-foreground">Predict land disputes using Graph Neural Networks</p>
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
              <CardTitle>Plot Analysis Input</CardTitle>
              <CardDescription>Enter plot and ownership information for dispute risk assessment</CardDescription>
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
                <Label htmlFor="ownership-data">Ownership Information</Label>
                <Textarea
                  id="ownership-data"
                  value={ownershipData}
                  onChange={(e) => setOwnershipData(e.target.value)}
                  placeholder="Enter ownership details, transfer history, legal status, etc."
                  className="min-h-24"
                />
              </div>

              <div>
                <Label htmlFor="neighboring-plots">Neighboring Plot IDs (comma-separated)</Label>
                <Input
                  id="neighboring-plots"
                  value={neighboringPlots}
                  onChange={(e) => setNeighboringPlots(e.target.value)}
                  placeholder="e.g., PLOT-BD-2024-002, PLOT-BD-2024-003"
                />
                <p className="text-xs text-muted-foreground mt-1">Optional: Adjacent plots for network analysis</p>
              </div>

              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Risk Factors Analyzed</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ownership transfer frequency</li>
                  <li>• Boundary overlap patterns</li>
                  <li>• Historical dispute records</li>
                  <li>• Neighboring plot conflicts</li>
                </ul>
              </div>

              <Button
                onClick={handlePredictDispute}
                disabled={loading || !plotId.trim() || !ownershipData.trim()}
                className="w-full"
              >
                {loading ? "Analyzing Risk..." : "Predict Dispute Risk"}
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
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Dispute prediction using GraphSAGE with Attention</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="text-center">
                    {result.dispute_risk > 0.7 ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-full bg-destructive/10 text-destructive mx-auto w-fit">
                          <AlertTriangle className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-destructive">High Risk</h3>
                        <p className="text-muted-foreground">High probability of future disputes</p>
                      </div>
                    ) : result.dispute_risk > 0.4 ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-full bg-yellow-100 text-yellow-600 mx-auto w-fit">
                          <TrendingUp className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-yellow-600">Medium Risk</h3>
                        <p className="text-muted-foreground">Moderate dispute probability</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-4 rounded-full bg-green-100 text-green-600 mx-auto w-fit">
                          <CheckCircle className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-green-600">Low Risk</h3>
                        <p className="text-muted-foreground">Low probability of disputes</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Dispute Risk Score</Label>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-medium">{(result.dispute_risk * 100).toFixed(1)}%</span>
                          <Badge
                            variant={
                              result.dispute_risk > 0.7
                                ? "destructive"
                                : result.dispute_risk > 0.4
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {result.dispute_risk > 0.7
                              ? "High Risk"
                              : result.dispute_risk > 0.4
                                ? "Medium Risk"
                                : "Low Risk"}
                          </Badge>
                        </div>
                        <Progress value={result.dispute_risk * 100} className="h-2" />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Risk Category</Label>
                      <div className="mt-2">
                        <Badge variant={result.dispute_risk > 0.7 ? "destructive" : "default"} className="text-sm">
                          {result.dispute_risk > 0.7 ? "REQUIRES ATTENTION" : "STABLE"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Prevention Measures</Label>
                      <div className="mt-2 space-y-1">
                        {result.dispute_risk > 0.7 ? (
                          <>
                            <p className="text-sm">• Conduct boundary survey</p>
                            <p className="text-sm">• Review ownership documentation</p>
                            <p className="text-sm">• Engage with neighboring owners</p>
                            <p className="text-sm">• Consider mediation services</p>
                          </>
                        ) : result.dispute_risk > 0.4 ? (
                          <>
                            <p className="text-sm">• Monitor ownership changes</p>
                            <p className="text-sm">• Maintain clear boundaries</p>
                            <p className="text-sm">• Keep documentation updated</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm">• Continue regular monitoring</p>
                            <p className="text-sm">• Maintain good neighbor relations</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Network Analysis</Label>
                      <div className="mt-2">
                        <p className="text-sm">
                          {neighboringPlots
                            ? `Analyzed ${neighboringPlots.split(",").length} neighboring plots for network effects`
                            : "No neighboring plots provided for network analysis"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter plot information to analyze dispute risk using AI</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>Advanced AI technologies for dispute prediction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-lg bg-accent/10 text-accent-foreground mx-auto w-fit mb-3">
                  <Network className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">GraphSAGE with Attention</h3>
                <p className="text-sm text-muted-foreground">
                  Graph neural network for analyzing ownership relationships
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2 mx-auto w-fit mb-3">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Network Effects</h3>
                <p className="text-sm text-muted-foreground">
                  Analysis of neighboring plot relationships and conflict propagation
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-primary/10 text-primary mx-auto w-fit mb-3">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Conflict Reduction</h3>
                <p className="text-sm text-muted-foreground">
                  30% reduction in land conflicts through predictive intervention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
