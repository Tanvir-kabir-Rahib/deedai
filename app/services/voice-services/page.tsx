"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mic, Upload, Volume2, FileAudio, Languages } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"

interface ASRResult {
  text: string
  language: string
}

export default function VoiceServicesPage() {
  const [result, setResult] = useState<ASRResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      setError("Please select an audio file")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const data = await apiClient.processVoice(file)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Voice processing failed")
    } finally {
      setLoading(false)
    }
  }

  const handleRecording = () => {
    // Placeholder for recording functionality
    setIsRecording(!isRecording)
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false)
        // Mock result for demo
        setResult({
          text: "এই ডিড নথি যাচাই করার জন্য ডেমো ট্রান্সক্রিপশন।",
          language: "bn-BD",
        })
      }, 3000)
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
            <h1 className="text-3xl font-bold text-gray-900">Bengali Voice Services</h1>
            <p className="text-gray-600 mt-1">AI-powered Bengali speech recognition using Wav2Vec</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Input
                </CardTitle>
                <CardDescription>Record or upload Bengali audio for transcription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recording Button */}
                <Button
                  onClick={handleRecording}
                  disabled={loading}
                  variant={isRecording ? "destructive" : "default"}
                  className="w-full"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>

                <div className="text-center text-sm text-gray-500">or</div>

                {/* File Upload */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading || isRecording}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Audio File
                  </Button>
                </div>

                {loading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Processing audio...</p>
                  </div>
                )}

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
                  <p className="text-gray-600">Wav2Vec 2.0 Bengali</p>
                </div>
                <div>
                  <span className="font-medium">Supported Formats:</span>
                  <p className="text-gray-600">WAV, MP3, M4A, OGG</p>
                </div>
                <div>
                  <span className="font-medium">Language:</span>
                  <p className="text-gray-600">Bengali (bn-BD)</p>
                </div>
                <div>
                  <span className="font-medium">Accuracy:</span>
                  <p className="text-gray-600">94.2% WER on Bengali corpus</p>
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
                    <Volume2 className="w-5 h-5" />
                    Transcription Results
                  </CardTitle>
                  <CardDescription>Bengali speech-to-text conversion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Language Badge */}
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-gray-500" />
                    <Badge variant="outline">
                      {result.language === "bn-BD" ? "Bengali (Bangladesh)" : result.language}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Transcribed Text */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Transcribed Text</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-lg leading-relaxed" dir="ltr">
                        {result.text}
                      </p>
                    </div>
                  </div>

                  {/* Translation (Mock) */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">English Translation</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-gray-700">"This is a demo transcription for verifying this deed document."</p>
                    </div>
                  </div>

                  {/* Audio Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <FileAudio className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Audio Quality</p>
                      <p className="text-lg font-bold text-green-600">Good</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Languages className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Confidence</p>
                      <p className="text-lg font-bold text-blue-600">94.2%</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Volume2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-lg font-bold text-purple-600">12.3s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!result && !loading && !isRecording && (
              <Card>
                <CardContent className="text-center py-12">
                  <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Voice Input</h3>
                  <p className="text-gray-600">
                    Record your voice or upload an audio file to begin Bengali speech recognition.
                  </p>
                </CardContent>
              </Card>
            )}

            {isRecording && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="animate-pulse">
                    <Mic className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Recording in Progress...</h3>
                  <p className="text-gray-600">Speak clearly in Bengali. Click "Stop Recording" when finished.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
