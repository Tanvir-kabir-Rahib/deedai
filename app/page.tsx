"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  FileText,
  Shield,
  TrendingUp,
  Map,
  Calculator,
  Scale,
  CheckCircle,
  Mic,
  Database,
  Users,
  AlertTriangle,
  Activity,
} from "lucide-react"

const services = [
  {
    id: "deed-parsing",
    title: "Deed Parsing",
    description: "AI-powered extraction of structured data from deed documents using BERT transformers",
    icon: FileText,
    endpoint: "/parse_deed",
    color: "bg-primary",
    features: ["12-layer BERT Transformer", "Automated mutation detection", "Khatian data extraction"],
    href: "/services/deed-parsing",
  },
  {
    id: "fraud-detection",
    title: "Fraud Detection",
    description: "Real-time detection of fraudulent documents using Variational Autoencoders",
    icon: Shield,
    endpoint: "/detect_fraud",
    color: "bg-destructive",
    features: ["VAE-based anomaly detection", "Real-time validation", "Tampered document flagging"],
    href: "/services/fraud-detection",
  },
  {
    id: "dispute-prediction",
    title: "Dispute Forecasting",
    description: "Predict land disputes using Graph Neural Networks and historical data",
    icon: TrendingUp,
    endpoint: "/predict_dispute",
    color: "bg-accent",
    features: ["GraphSAGE with Attention", "30% conflict reduction", "Ownership graph analysis"],
    href: "/services/dispute-prediction",
  },
  {
    id: "boundary-validation",
    title: "Boundary Validation",
    description: "Validate plot boundaries using satellite imagery and ResNet-50 CNNs",
    icon: Map,
    endpoint: "/validate_boundary",
    color: "bg-chart-2",
    features: ["ResNet-50 CNN", "Satellite imagery analysis", "90% dispute prevention"],
    href: "/services/boundary-validation",
  },
  {
    id: "tax-prediction",
    title: "Tax Compliance",
    description: "Predict tax evasion risks using LSTM networks and payment history",
    icon: Calculator,
    endpoint: "/predict_tax",
    color: "bg-chart-3",
    features: ["LSTM networks", "40% compliance boost", "Payment sequence analysis"],
    href: "/services/tax-prediction",
  },
  {
    id: "dispute-resolution",
    title: "Dispute Resolution",
    description: "AI-powered recommendations for optimal dispute resolution actions",
    icon: Scale,
    endpoint: "/resolve_dispute",
    color: "bg-chart-4",
    features: ["Deep Q-Network", "Legal action recommendations", "Conflict resolution matching"],
    href: "/services/dispute-resolution",
  },
]

const additionalServices = [
  {
    id: "ownership-verification",
    title: "Ownership Verification",
    description: "Real-time verification of land ownership records",
    icon: CheckCircle,
    endpoint: "/verify_ownership",
    color: "bg-primary",
    href: "/services/ownership-verification",
  },
  {
    id: "voice-services",
    title: "Bengali Voice Services",
    description: "Voice-based access using Wav2Vec 2.0 ASR technology",
    icon: Mic,
    endpoint: "/asr_bn",
    color: "bg-accent",
    href: "/services/voice-services",
  },
  // {
  //   id: "synthetic-data",
  //   title: "Synthetic Data Generation",
  //   description: "Generate training data using Generative Adversarial Networks",
  //   icon: Database,
  //   endpoint: "/generate_synthetic_data",
  //   color: "bg-chart-2",
  //   href: "/services/synthetic-data",
  // },
  {
    id: "fairness-assessment",
    title: "Fairness Assessment",
    description: "Ensure unbiased AI decisions across demographics",
    icon: Users,
    endpoint: "/assess_fairness",
    color: "bg-chart-3",
    href: "/services/fairness-assessment",
  },
]

export default function LandAdminDashboard() {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleServiceCall = async (service: any, formData: any) => {
    setLoading(true)
    try {
      // Mock API call - replace with actual backend integration
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock responses based on service type
      const mockResponses = {
        "deed-parsing": {
          metadata: {
            owner: "Mohammad Rahman",
            plot_id: "PLOT-BD-2024-001",
            registration: "2024-01-15",
            confidence: 0.94,
          },
        },
        "fraud-detection": {
          fraud_detected: Math.random() > 0.7,
          error: Math.random() * 0.2,
        },
        "dispute-prediction": {
          dispute_risk: Math.random() * 0.8,
        },
        "boundary-validation": {
          valid: Math.random() > 0.3,
          overlaps: [],
        },
        "tax-prediction": {
          evasion_risk: Math.random() * 0.6,
        },
        "dispute-resolution": {
          action: "Recommend Mediation",
        },
      }

      setResults(mockResponses[service.id as keyof typeof mockResponses] || { status: "success" })
    } catch (error) {
      setResults({ error: "Service temporarily unavailable" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground text-balance">
                DeedAI E-Governance Platform
              </h1>
              <p className="text-muted-foreground mt-2 text-pretty">
                AI-Powered Land Administration Services for Bangladesh
              </p>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Activity className="w-4 h-4 mr-2" />
              System Online
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Core AI Services</TabsTrigger>
            <TabsTrigger value="additional">Additional Services</TabsTrigger>
            <TabsTrigger value="analytics">System Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${service.color} text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-heading">{service.title}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-pretty">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <Link href={service.href}>
                        <Button className="w-full mt-4 bg-transparent" variant="outline">
                          Access Service
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalServices.map((service) => {
                const Icon = service.icon
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className={`p-3 rounded-lg ${service.color} text-white mx-auto w-fit`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-lg font-heading">{service.title}</CardTitle>
                      <CardDescription className="text-pretty">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={service.href}>
                        <Button className="w-full bg-transparent" variant="outline">
                          Launch Service
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,847</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Fraud Detected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">-8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Disputes Prevented</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+30% improvement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.8%</div>
                  <Progress value={99.8} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Privacy & Security Features</CardTitle>
                <CardDescription>Advanced privacy-preserving technologies protecting citizen data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Federated Learning</p>
                      <p className="text-sm text-muted-foreground">Privacy-preserving model training</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Homomorphic Encryption</p>
                      <p className="text-sm text-muted-foreground">Secure computation on encrypted data</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Service Modal/Panel */}
        {activeService && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-heading">
                {services.find((s) => s.id === activeService)?.title} Service
              </CardTitle>
              <CardDescription>Test the AI service with sample data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeService === "deed-parsing" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deed-text">Deed Document Text</Label>
                    <Textarea
                      id="deed-text"
                      placeholder="Enter unstructured deed text or scanned document transcription..."
                      className="min-h-32"
                    />
                  </div>
                  <Button
                    onClick={() => handleServiceCall(services.find((s) => s.id === activeService)!, {})}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Processing..." : "Parse Deed Document"}
                  </Button>
                </div>
              )}

              {activeService === "fraud-detection" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fraud-file">Upload Document for Analysis</Label>
                    <Input id="fraud-file" type="file" accept=".pdf,.jpg,.png" />
                  </div>
                  <Button
                    onClick={() => handleServiceCall(services.find((s) => s.id === activeService)!, {})}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Analyzing..." : "Detect Fraud"}
                  </Button>
                </div>
              )}

              {activeService === "boundary-validation" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="boundary-image">Upload Satellite Image</Label>
                    <Input id="boundary-image" type="file" accept=".jpg,.png,.tiff" />
                  </div>
                  <Button
                    onClick={() => handleServiceCall(services.find((s) => s.id === activeService)!, {})}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Validating..." : "Validate Boundaries"}
                  </Button>
                </div>
              )}

              {results && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <pre className="text-sm">{JSON.stringify(results, null, 2)}</pre>
                  </AlertDescription>
                </Alert>
              )}

              <Button variant="outline" onClick={() => setActiveService(null)} className="w-full">
                Close Service Panel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
