"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Palette, 
  Type, 
  Image, 
  Shield, 
  Mic, 
  Hash, 
  CheckCircle, 
  XCircle,
  FileText
} from "lucide-react"

interface BrandStyle {
  name: string
  voice: {
    tone: string[]
    personality: string[]
    keywords: string[]
    description: string
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    neutrals: string[]
    meaning: string
  }
  fonts: {
    heading: {
      family: string
      weight: string
      size: string
    }
    body: {
      family: string
      weight: string
      size: string
    }
    special: {
      family: string
      weight: string
      size: string
      usage: string
    }
  }
  imagery: {
    style: string[]
    subjects: string[]
    avoid: string[]
    filters: string
    guidelines: string
  }
  logo: {
    primary: string | null
    variations: string[]
    usage: string
    clearSpace: string
    minSize: string
  }
  requirements: {
    dos: string[]
    donts: string[]
    guidelines: string
  }
}

interface BrandPreviewProps {
  brandStyle: BrandStyle
}

export function BrandPreview({ brandStyle }: BrandPreviewProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">{brandStyle.name || "Your Brand"} Style Guide</h1>
        <p className="text-muted-foreground">Complete brand identity reference</p>
      </div>

      {/* Brand Voice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Brand Voice & Personality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Voice Tone</h4>
            <div className="flex flex-wrap gap-2">
              {brandStyle.voice.tone.map((tone, index) => (
                <Badge key={index} variant="secondary">{tone}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Personality Traits</h4>
            <div className="flex flex-wrap gap-2">
              {brandStyle.voice.personality.map((trait, index) => (
                <Badge key={index} variant="outline">{trait}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Key Messages</h4>
            <div className="flex flex-wrap gap-2">
              {brandStyle.voice.keywords.map((keyword, index) => (
                <Badge key={index}>{keyword}</Badge>
              ))}
            </div>
          </div>
          {brandStyle.voice.description && (
            <div>
              <h4 className="font-medium mb-2">Voice Description</h4>
              <p className="text-sm text-muted-foreground">{brandStyle.voice.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Palette
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div
                className="w-full h-20 rounded-lg border shadow-sm mb-2"
                style={{ backgroundColor: brandStyle.colors.primary }}
              />
              <p className="text-xs font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">{brandStyle.colors.primary}</p>
            </div>
            <div className="text-center">
              <div
                className="w-full h-20 rounded-lg border shadow-sm mb-2"
                style={{ backgroundColor: brandStyle.colors.secondary }}
              />
              <p className="text-xs font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">{brandStyle.colors.secondary}</p>
            </div>
            <div className="text-center">
              <div
                className="w-full h-20 rounded-lg border shadow-sm mb-2"
                style={{ backgroundColor: brandStyle.colors.accent }}
              />
              <p className="text-xs font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">{brandStyle.colors.accent}</p>
            </div>
            {brandStyle.colors.neutrals.map((neutral, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-full h-20 rounded-lg border shadow-sm mb-2"
                  style={{ backgroundColor: neutral }}
                />
                <p className="text-xs font-medium">Neutral {index + 1}</p>
                <p className="text-xs text-muted-foreground">{neutral}</p>
              </div>
            ))}
          </div>
          {brandStyle.colors.meaning && (
            <div>
              <h4 className="font-medium mb-2">Color Meaning</h4>
              <p className="text-sm text-muted-foreground">{brandStyle.colors.meaning}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Heading Font</h4>
            <div className="p-4 bg-muted rounded-lg">
              <h2 
                style={{
                  fontFamily: brandStyle.fonts.heading.family,
                  fontWeight: brandStyle.fonts.heading.weight,
                  fontSize: brandStyle.fonts.heading.size
                }}
              >
                The quick brown fox
              </h2>
              <p className="text-xs text-muted-foreground mt-2">
                {brandStyle.fonts.heading.family} • {brandStyle.fonts.heading.weight} • {brandStyle.fonts.heading.size}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Body Font</h4>
            <div className="p-4 bg-muted rounded-lg">
              <p 
                style={{
                  fontFamily: brandStyle.fonts.body.family,
                  fontWeight: brandStyle.fonts.body.weight,
                  fontSize: brandStyle.fonts.body.size
                }}
              >
                The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {brandStyle.fonts.body.family} • {brandStyle.fonts.body.weight} • {brandStyle.fonts.body.size}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Special Font</h4>
            <div className="p-4 bg-muted rounded-lg">
              <span 
                style={{
                  fontFamily: brandStyle.fonts.special.family,
                  fontWeight: brandStyle.fonts.special.weight,
                  fontSize: brandStyle.fonts.special.size
                }}
              >
                SPECIAL TEXT EXAMPLE
              </span>
              <p className="text-xs text-muted-foreground mt-2">
                {brandStyle.fonts.special.family} • {brandStyle.fonts.special.weight} • {brandStyle.fonts.special.size}
                {brandStyle.fonts.special.usage && ` • ${brandStyle.fonts.special.usage}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo */}
      {brandStyle.logo.primary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Logo Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-8 bg-muted rounded-lg">
              <img
                src={brandStyle.logo.primary}
                alt="Primary Logo"
                className="max-h-24 mx-auto object-contain"
              />
            </div>
            {brandStyle.logo.variations.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Logo Variations</h4>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {brandStyle.logo.variations.map((variation, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <img
                        src={variation}
                        alt={`Variation ${index + 1}`}
                        className="h-12 mx-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {brandStyle.logo.clearSpace && (
                <div>
                  <h5 className="font-medium mb-1">Clear Space</h5>
                  <p className="text-muted-foreground">{brandStyle.logo.clearSpace}</p>
                </div>
              )}
              {brandStyle.logo.minSize && (
                <div>
                  <h5 className="font-medium mb-1">Minimum Size</h5>
                  <p className="text-muted-foreground">{brandStyle.logo.minSize}</p>
                </div>
              )}
            </div>
            {brandStyle.logo.usage && (
              <div>
                <h4 className="font-medium mb-2">Usage Guidelines</h4>
                <p className="text-sm text-muted-foreground">{brandStyle.logo.usage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Imagery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Imagery Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Visual Style</h4>
            <div className="flex flex-wrap gap-2">
              {brandStyle.imagery.style.map((style, index) => (
                <Badge key={index} variant="secondary">{style}</Badge>
              ))}
            </div>
          </div>
          {brandStyle.imagery.subjects.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Preferred Subjects</h4>
              <div className="flex flex-wrap gap-2">
                {brandStyle.imagery.subjects.map((subject, index) => (
                  <Badge key={index} variant="outline">{subject}</Badge>
                ))}
              </div>
            </div>
          )}
          {brandStyle.imagery.avoid.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Avoid</h4>
              <div className="flex flex-wrap gap-2">
                {brandStyle.imagery.avoid.map((item, index) => (
                  <Badge key={index} variant="destructive">{item}</Badge>
                ))}
              </div>
            </div>
          )}
          {brandStyle.imagery.filters && (
            <div>
              <h4 className="font-medium mb-2">Filters & Effects</h4>
              <p className="text-sm text-muted-foreground">{brandStyle.imagery.filters}</p>
            </div>
          )}
          {brandStyle.imagery.guidelines && (
            <div>
              <h4 className="font-medium mb-2">Additional Guidelines</h4>
              <p className="text-sm text-muted-foreground">{brandStyle.imagery.guidelines}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Brand Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {brandStyle.requirements.dos.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Do's
              </h4>
              <ul className="space-y-2">
                {brandStyle.requirements.dos.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {brandStyle.requirements.donts.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                Don'ts
              </h4>
              <ul className="space-y-2">
                {brandStyle.requirements.donts.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {brandStyle.requirements.guidelines && (
            <div>
              <h4 className="font-medium mb-2">Additional Guidelines</h4>
              <p className="text-sm text-muted-foreground">{brandStyle.requirements.guidelines}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <Separator className="mb-6" />
        <p>© {new Date().getFullYear()} {brandStyle.name || "Your Brand"}. All rights reserved.</p>
        <p className="mt-1">This style guide is confidential and proprietary.</p>
      </div>
    </div>
  )
}