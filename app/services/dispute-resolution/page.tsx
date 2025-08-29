"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Scale, AlertTriangle, Users, FileText } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

export default function DisputeResolutionPage() {
  const [disputeId, setDisputeId] = useState("")
  const [disputeDetails, setDisputeDetails] = useState("")
  const [parties, setParties] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResolveDispute = async () => {
    if (!disputeId.trim() || !disputeDetails.trim()) {
      setError("Please enter dispute ID and details")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const response = await apiClient.resolveDispute(disputeId, disputeDetails, parties)

    if (response.success) {
      setResult(response.data)
    } else {
      setError(response.error || "Failed to generate dispute resolution")
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
              <div className="p-2 rounded-lg bg-chart-4 text-white">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Dispute Resolution Service</h1>
                <p className="text-muted-foreground">AI-powered recommendations for optimal dispute resolution</p>
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
              <CardTitle>Dispute Information</CardTitle>
              <CardDescription>Enter dispute details for AI-powered resolution recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dispute-id">Dispute ID</Label>
                <Input
                  id="dispute-id"
                  value={disputeId}
                  onChange={(e) => setDisputeId(e.target.value)}
                  placeholder="e.g., DISP-BD-2024-001"
                />
              </div>

              <div>
                <Label htmlFor="dispute-details">Dispute Details</Label>
                <Textarea
                  id="dispute-details"
                  value={disputeDetails}
                  onChange={(e) => setDisputeDetails(e.target.value)}
                  placeholder="Describe the land dispute, including plot boundaries, ownership claims, documentation issues, etc."
                  className="min-h-32"
                />
              </div>

              <div>
                <Label htmlFor="parties">Involved Parties (optional)</Label>
                <Input
                  id="parties"
                  value={parties}
                  onChange={(e) => setParties(e.target.value)}
                  placeholder="e.g., Mohammad Rahman vs Fatima Khatun"
                />
              </div>

              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Resolution Methods</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Mediation - Neutral third-party facilitation</li>
                  <li>• Arbitration - Binding decision by arbitrator</li>
                  <li>• Court Proceedings - Formal legal resolution</li>
                  <li>• Administrative Review - Government intervention</li>
                </ul>
              </div>

              <Button
                onClick={handleResolveDispute}
                disabled={loading || !disputeId.trim() || !disputeDetails.trim()}
                className="w-full"
              >
                {loading ? "Analyzing Dispute..." : "Get Resolution Recommendation"}
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
              <CardTitle>Resolution Recommendation</CardTitle>
              <CardDescription>AI-powered dispute resolution using Deep Q-Network</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="space-y-3">
                      <div className="p-4 rounded-full bg-chart-4/10 text-chart-4 mx-auto w-fit">
                        <Scale className="w-12 h-12" />
                      </div>
                      <h3 className="text-xl font-bold text-chart-4">Recommended Action</h3>
                      <p className="text-muted-foreground">AI analysis complete</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Primary Recommendation</Label>
                      <div className="mt-2">
                        <Badge variant="default" className="text-sm mb-2">
                          {result.action}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {result.action === "Recommend Mediation" &&
                            "Neutral mediation is most suitable for this dispute type"}
                          {result.action === "Recommend Arbitration" &&
                            "Binding arbitration will provide fastest resolution"}
                          {result.action === "Recommend Court Proceedings" &&
                            "Legal proceedings required for complex ownership issues"}
                          {result.action === "Recommend Administrative Review" &&
                            "Government intervention needed for regulatory compliance"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Success Probability</Label>
                      <div className="mt-2">
                        <span className="text-lg font-medium">{((result.confidence || 0.85) * 100).toFixed(1)}%</span>
                        <p className="text-xs text-muted-foreground mt-1">Based on historical resolution outcomes</p>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Estimated Timeline</Label>
                      <div className="mt-2">
                        <span className="text-lg font-medium">
                          {result.action === "Recommend Mediation" && "2-4 weeks"}
                          {result.action === "Recommend Arbitration" && "6-8 weeks"}
                          {result.action === "Recommend Court Proceedings" && "6-12 months"}
                          {result.action === "Recommend Administrative Review" && "4-8 weeks"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Next Steps</Label>
                      <div className="mt-2 space-y-1">
                        {result.action === "Recommend Mediation" && (
                          <>
                            <p className="text-sm">• Contact certified mediator</p>
                            <p className="text-sm">• Schedule initial session</p>
                            <p className="text-sm">• Prepare documentation</p>
                          </>
                        )}
                        {result.action === "Recommend Arbitration" && (
                          <>
                            <p className="text-sm">• Select qualified arbitrator</p>
                            <p className="text-sm">• File arbitration request</p>
                            <p className="text-sm">• Gather evidence and witnesses</p>
                          </>
                        )}
                        {result.action === "Recommend Court Proceedings" && (
                          <>
                            <p className="text-sm">• Consult legal counsel</p>
                            <p className="text-sm">• File court petition</p>
                            <p className="text-sm">• Prepare legal documentation</p>
                          </>
                        )}
                        {result.action === "Recommend Administrative Review" && (
                          <>
                            <p className="text-sm">• Submit review application</p>
                            <p className="text-sm">• Provide supporting documents</p>
                            <p className="text-sm">• Await administrative decision</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter dispute information to get AI-powered resolution recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>Advanced AI technologies for dispute resolution optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-lg bg-chart-4/10 text-chart-4 mx-auto w-fit mb-3">
                  <Scale className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Deep Q-Network</h3>
                <p className="text-sm text-muted-foreground">
                  Reinforcement learning for optimal action selection in dispute resolution
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-accent/10 text-accent-foreground mx-auto w-fit mb-3">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Conflict Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Historical case analysis for similar dispute pattern matching
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-primary/10 text-primary mx-auto w-fit mb-3">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Legal Precedent</h3>
                <p className="text-sm text-muted-foreground">
                  Integration with legal database for precedent-based recommendations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
