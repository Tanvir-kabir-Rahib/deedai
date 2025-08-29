"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

export default function DeedParsingPage() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleParseDeed = async () => {
    if (!text.trim()) {
      setError("Please enter deed text to parse")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const response = await apiClient.parseDeed(text)

    if (response.success) {
      setResult(response.data)
    } else {
      setError(response.error || "Failed to parse deed")
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
              <div className="p-2 rounded-lg bg-primary text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Deed Parsing Service</h1>
                <p className="text-muted-foreground">AI-powered extraction of structured data from deed documents</p>
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
              <CardTitle>Document Input</CardTitle>
              <CardDescription>Enter the unstructured deed text or scanned document transcription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="deed-text">Deed Document Text</Label>
                <Textarea
                  id="deed-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter deed document text here... For example: 'This deed is executed between Mohammad Rahman, son of Abdul Rahman, residing at Dhaka, Bangladesh, and Fatima Khatun, daughter of Ibrahim Ali, regarding the transfer of land plot number 123 in Mouza Ramna, Thana Dhanmondi, District Dhaka...'"
                  className="min-h-48"
                />
              </div>

              <Button onClick={handleParseDeed} disabled={loading || !text.trim()} className="w-full">
                {loading ? "Processing Document..." : "Parse Deed Document"}
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
              <CardTitle>Extraction Results</CardTitle>
              <CardDescription>Structured data extracted from the deed document</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Document Successfully Parsed</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Owner</Label>
                      <p className="text-lg font-medium">{result.metadata?.owner || "Not found"}</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Plot ID</Label>
                      <p className="text-lg font-medium">{result.metadata?.plot_id || "Not found"}</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Registration Date</Label>
                      <p className="text-lg font-medium">{result.metadata?.registration || "Not found"}</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Confidence Score</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-medium">{((result.metadata?.confidence || 0) * 100).toFixed(1)}%</p>
                        <Badge variant={result.metadata?.confidence > 0.8 ? "default" : "secondary"}>
                          {result.metadata?.confidence > 0.8 ? "High" : "Medium"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter deed text and click "Parse Deed Document" to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>Advanced AI technologies powering the deed parsing service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-lg bg-primary/10 text-primary mx-auto w-fit mb-3">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">BERT Transformer</h3>
                <p className="text-sm text-muted-foreground">
                  12-layer BERT model fine-tuned for Bengali and English deed documents
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-accent/10 text-accent-foreground mx-auto w-fit mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Named Entity Recognition</h3>
                <p className="text-sm text-muted-foreground">
                  Automated extraction of names, dates, plot IDs, and legal entities
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2 mx-auto w-fit mb-3">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Confidence Scoring</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time confidence assessment for extracted information
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
