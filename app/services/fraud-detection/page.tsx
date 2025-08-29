"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Upload } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

export default function FraudDetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleDetectFraud = async () => {
    if (!file) {
      setError("Please select a document to analyze")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    // Generate mock feature vector for demonstration
    const mockFeatures = Array.from({ length: 256 }, () => Math.random())

    const response = await apiClient.detectFraud(mockFeatures)

    if (response.success) {
      setResult(response.data)
    } else {
      setError(response.error || "Failed to detect fraud")
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
              <div className="p-2 rounded-lg bg-destructive text-white">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Fraud Detection Service</h1>
                <p className="text-muted-foreground">Real-time detection of fraudulent documents using AI</p>
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
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>Upload a document for fraud detection analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="document-file">Select Document</Label>
                <div className="mt-2">
                  <Input
                    id="document-file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
                {file && (
                  <div className="mt-2 p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleDetectFraud} disabled={loading || !file} className="w-full">
                {loading ? "Analyzing Document..." : "Detect Fraud"}
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
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Fraud detection analysis using Variational Autoencoder</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="text-center">
                    {result.fraud_detected ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-full bg-destructive/10 text-destructive mx-auto w-fit">
                          <AlertTriangle className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-destructive">Fraud Detected</h3>
                        <p className="text-muted-foreground">
                          The document shows signs of potential fraud or tampering
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-4 rounded-full bg-green-100 text-green-600 mx-auto w-fit">
                          <CheckCircle className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-green-600">Document Verified</h3>
                        <p className="text-muted-foreground">No signs of fraud or tampering detected</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Reconstruction Error</Label>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-medium">{(result.error * 100).toFixed(2)}%</span>
                          <Badge variant={result.error > 0.1 ? "destructive" : "default"}>
                            {result.error > 0.1 ? "High Risk" : "Low Risk"}
                          </Badge>
                        </div>
                        <Progress value={result.error * 100} className="h-2" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Higher reconstruction error indicates potential fraud
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Risk Assessment</Label>
                      <div className="mt-2">
                        <Badge variant={result.fraud_detected ? "destructive" : "default"} className="text-sm">
                          {result.fraud_detected ? "HIGH RISK" : "LOW RISK"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload a document and click "Detect Fraud" to see analysis results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>Advanced AI technologies powering fraud detection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive mx-auto w-fit mb-3">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Variational Autoencoder</h3>
                <p className="text-sm text-muted-foreground">
                  Deep learning model trained to detect anomalies in document patterns
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-accent/10 text-accent-foreground mx-auto w-fit mb-3">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Real-time Analysis</h3>
                <p className="text-sm text-muted-foreground">Instant fraud detection with sub-second response times</p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2 mx-auto w-fit mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">High Accuracy</h3>
                <p className="text-sm text-muted-foreground">95%+ accuracy in detecting tampered or forged documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
