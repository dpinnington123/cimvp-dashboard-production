"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Type, Heading, FileText, Sparkles } from "lucide-react"

interface BrandFontsFormProps {
  brandFonts: {
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
  onUpdate: (fonts: {
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
  }) => void
}

const fontFamilies = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Playfair Display",
  "Merriweather",
  "Source Sans Pro",
  "Nunito",
  "Work Sans",
  "Space Grotesk",
  "DM Sans",
  "Manrope"
]

const fontWeights = [
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
  { value: "900", label: "Black" }
]

export function BrandFontsForm({ brandFonts, onUpdate }: BrandFontsFormProps) {
  const handleFontChange = (
    category: 'heading' | 'body' | 'special',
    field: 'family' | 'weight' | 'size' | 'usage',
    value: string
  ) => {
    if (category === 'special' && field === 'usage') {
      onUpdate({
        ...brandFonts,
        special: { ...brandFonts.special, usage: value }
      })
    } else {
      onUpdate({
        ...brandFonts,
        [category]: {
          ...brandFonts[category],
          [field]: value
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heading className="h-5 w-5" />
            Heading Typography
          </CardTitle>
          <CardDescription>Define your heading font styles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={brandFonts.heading.family}
                onValueChange={(value) => handleFontChange('heading', 'family', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select
                value={brandFonts.heading.weight}
                onValueChange={(value) => handleFontChange('heading', 'weight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontWeights.map((weight) => (
                    <SelectItem key={weight.value} value={weight.value}>
                      {weight.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Input
                value={brandFonts.heading.size}
                onChange={(e) => handleFontChange('heading', 'size', e.target.value)}
                placeholder="32px"
              />
            </div>
          </div>
          <div className="p-4 bg-muted rounded-md">
            <h1 
              style={{
                fontFamily: brandFonts.heading.family,
                fontWeight: brandFonts.heading.weight,
                fontSize: brandFonts.heading.size
              }}
            >
              Sample Heading Text
            </h1>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Body Typography
          </CardTitle>
          <CardDescription>Define your body text font styles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={brandFonts.body.family}
                onValueChange={(value) => handleFontChange('body', 'family', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select
                value={brandFonts.body.weight}
                onValueChange={(value) => handleFontChange('body', 'weight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontWeights.map((weight) => (
                    <SelectItem key={weight.value} value={weight.value}>
                      {weight.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Input
                value={brandFonts.body.size}
                onChange={(e) => handleFontChange('body', 'size', e.target.value)}
                placeholder="16px"
              />
            </div>
          </div>
          <div className="p-4 bg-muted rounded-md">
            <p 
              style={{
                fontFamily: brandFonts.body.family,
                fontWeight: brandFonts.body.weight,
                fontSize: brandFonts.body.size
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Special Typography
          </CardTitle>
          <CardDescription>Define fonts for special use cases (buttons, captions, etc.)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={brandFonts.special.family}
                onValueChange={(value) => handleFontChange('special', 'family', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font Weight</Label>
              <Select
                value={brandFonts.special.weight}
                onValueChange={(value) => handleFontChange('special', 'weight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontWeights.map((weight) => (
                    <SelectItem key={weight.value} value={weight.value}>
                      {weight.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Input
                value={brandFonts.special.size}
                onChange={(e) => handleFontChange('special', 'size', e.target.value)}
                placeholder="14px"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Usage Guidelines</Label>
            <Input
              value={brandFonts.special.usage}
              onChange={(e) => handleFontChange('special', 'usage', e.target.value)}
              placeholder="Used for buttons, navigation, and UI elements"
            />
          </div>
          <div className="p-4 bg-muted rounded-md">
            <span 
              style={{
                fontFamily: brandFonts.special.family,
                fontWeight: brandFonts.special.weight,
                fontSize: brandFonts.special.size
              }}
            >
              SPECIAL TEXT SAMPLE
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h1 
              style={{
                fontFamily: brandFonts.heading.family,
                fontWeight: brandFonts.heading.weight,
                fontSize: brandFonts.heading.size
              }}
              className="mb-2"
            >
              Main Heading Example
            </h1>
            <h2 
              style={{
                fontFamily: brandFonts.heading.family,
                fontWeight: brandFonts.heading.weight,
                fontSize: `calc(${brandFonts.heading.size} * 0.8)`
              }}
              className="mb-4"
            >
              Secondary Heading Example
            </h2>
            <p 
              style={{
                fontFamily: brandFonts.body.family,
                fontWeight: brandFonts.body.weight,
                fontSize: brandFonts.body.size
              }}
              className="mb-4"
            >
              This is how your body text will appear. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <button 
              style={{
                fontFamily: brandFonts.special.family,
                fontWeight: brandFonts.special.weight,
                fontSize: brandFonts.special.size
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              BUTTON TEXT
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}