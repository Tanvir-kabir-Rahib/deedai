"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Map, CheckCircle, AlertTriangle, Upload } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

export default function BoundaryValidationPage() {
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

  const handleValidateBoundary = async () => {
    if (!file) {
      setError("Please select a satellite image to analyze")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const response = await apiClient.validateBoundary(file)

    if (response.success) {
      setResult(response.data)
    } else {
      setError(response.error || "Failed to validate boundary")
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
              <div className="p-2 rounded-lg bg-chart-2 text-white">
                <Map className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Boundary Validation Service</h1>
                <p className="text-muted-foreground">Validate plot boundaries using satellite imagery and AI</p>
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
              <CardTitle>Satellite Image Upload</CardTitle>
              <CardDescription>Upload satellite imagery for boundary validation analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="satellite-image">Select Satellite Image</Label>
                <div className="mt-2">
                  <Input
                    id="satellite-image"
                    type="file"
                    accept=".jpg,.jpeg,.png,.tiff,.tif"
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

              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Supported Formats</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• JPEG/JPG - Standard satellite imagery</li>
                  <li>• PNG - High-quality imagery</li>
                  <li>• TIFF/TIF - GeoTIFF with coordinate data</li>
                </ul>
              </div>

              <Button onClick={handleValidateBoundary} disabled={loading || !file} className="w-full">
                {loading ? "Validating Boundaries..." : "Validate Boundaries"}
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
              <CardTitle>Validation Results</CardTitle>
              <CardDescription>Boundary analysis using ResNet-50 CNN</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="text-center">
                    {result.valid ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-full bg-green-100 text-green-600 mx-auto w-fit">
                          <CheckCircle className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-green-600">Boundaries Valid</h3>
                        <p className="text-muted-foreground">No boundary conflicts or overlaps detected</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-4 rounded-full bg-destructive/10 text-destructive mx-auto w-fit">
                          <AlertTriangle className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl font-bold text-destructive">Boundary Issues Found</h3>
                        <p className="text-muted-foreground">Potential boundary conflicts or overlaps detected</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Validation Status</Label>
                      <div className="mt-2">
                        <Badge variant={result.valid ? "default" : "destructive"} className="text-sm">
                          {result.valid ? "VALID BOUNDARIES" : "BOUNDARY CONFLICTS"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Overlaps Detected</Label>
                      <div className="mt-2">
                        <span className="text-lg font-medium">{result.overlaps?.length || 0}</span>
                        <p className="text-xs text-muted-foreground mt-1">Number of boundary overlap regions found</p>
                      </div>
                    </div>

                    {result.overlaps && result.overlaps.length > 0 && (
                      <div className="p-4 border rounded-lg">
                        <Label className="text-sm font-medium text-muted-foreground">Overlap Details</Label>
                        <div className="mt-2 space-y-2">
                          {result.overlaps.map((overlap: any, index: number) => (
                            <div key={index} className="p-2 bg-muted rounded text-sm">
                              <p>
                                Overlap {index + 1}: {overlap.description || "Boundary conflict detected"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Map className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload satellite imagery and click "Validate Boundaries" to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>Advanced computer vision technologies for boundary validation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2 mx-auto w-fit mb-3">
                  <Map className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">ResNet-50 CNN</h3>
                <p className="text-sm text-muted-foreground">
                  Deep convolutional neural network for satellite image analysis
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-accent/10 text-accent-foreground mx-auto w-fit mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">GIS Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Geographic Information System integration for precise boundary detection
                </p>
              </div>

              <div className="text-center">
                <div className="p-3 rounded-lg bg-primary/10 text-primary mx-auto w-fit mb-3">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="font-medium mb-2">Conflict Prevention</h3>
                <p className="text-sm text-muted-foreground">
                  90% reduction in boundary disputes through early detection
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
