"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Plus, Trash2, Shield, Maximize, FileText, Image as ImageIcon } from "lucide-react"

interface BrandLogoFormProps {
  brandLogo: {
    primary: string | null
    variations: string[]
    usage: string
    clearSpace: string
    minSize: string
  }
  onUpdate: (logo: {
    primary: string | null
    variations: string[]
    usage: string
    clearSpace: string
    minSize: string
  }) => void
}

export function BrandLogoForm({ brandLogo, onUpdate }: BrandLogoFormProps) {
  const handlePrimaryLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      onUpdate({ ...brandLogo, primary: e.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleVariationUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      onUpdate({
        ...brandLogo,
        variations: [...brandLogo.variations, e.target?.result as string]
      })
    }
    reader.readAsDataURL(file)
  }

  const removeVariation = (index: number) => {
    onUpdate({
      ...brandLogo,
      variations: brandLogo.variations.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Primary Logo
          </CardTitle>
          <CardDescription>Upload your main brand logo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center">
            {brandLogo.primary ? (
              <div className="relative group">
                <img
                  src={brandLogo.primary}
                  alt="Primary Logo"
                  className="max-w-sm max-h-48 object-contain border rounded-lg p-4"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onUpdate({ ...brandLogo, primary: null })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <Label htmlFor="primary-logo" className="cursor-pointer">
                  <span className="text-primary hover:underline">Click to upload</span>
                  <span className="text-muted-foreground"> or drag and drop</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-2">
                  SVG, PNG, JPG (max. 2MB)
                </p>
              </div>
            )}
            <Input
              id="primary-logo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePrimaryLogoUpload}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Logo Variations
          </CardTitle>
          <CardDescription>Upload alternative versions (horizontal, icon, monochrome, etc.)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {brandLogo.variations.map((variation, index) => (
              <div key={index} className="relative group">
                <img
                  src={variation}
                  alt={`Logo Variation ${index + 1}`}
                  className="w-full h-32 object-contain border rounded-lg p-2"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeVariation(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <div className="border-2 border-dashed rounded-lg h-32 flex items-center justify-center">
              <Label htmlFor="variation-upload" className="cursor-pointer">
                <div className="text-center">
                  <Plus className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Add Variation</span>
                </div>
              </Label>
              <Input
                id="variation-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleVariationUpload}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Logo Usage Guidelines
          </CardTitle>
          <CardDescription>Define how your logo should be used</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usage">Usage Rules</Label>
            <Textarea
              id="usage"
              value={brandLogo.usage}
              onChange={(e) => onUpdate({ ...brandLogo, usage: e.target.value })}
              placeholder="Example: The logo should always appear on a clean background. Never stretch, rotate, or alter the proportions..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clearSpace" className="flex items-center gap-2">
                <Maximize className="h-4 w-4" />
                Clear Space Requirements
              </Label>
              <Input
                id="clearSpace"
                value={brandLogo.clearSpace}
                onChange={(e) => onUpdate({ ...brandLogo, clearSpace: e.target.value })}
                placeholder="e.g., Minimum 1x logo height on all sides"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minSize" className="flex items-center gap-2">
                <Maximize className="h-4 w-4 rotate-180" />
                Minimum Size
              </Label>
              <Input
                id="minSize"
                value={brandLogo.minSize}
                onChange={(e) => onUpdate({ ...brandLogo, minSize: e.target.value })}
                placeholder="e.g., 24px height for digital, 0.5 inch for print"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo Display Examples</CardTitle>
          <CardDescription>See how your logo appears in different contexts</CardDescription>
        </CardHeader>
        <CardContent>
          {brandLogo.primary ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">On Light Background</p>
                <div className="bg-white p-8 rounded-lg border flex items-center justify-center">
                  <img
                    src={brandLogo.primary}
                    alt="Logo on light"
                    className="max-h-16 object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">On Dark Background</p>
                <div className="bg-gray-900 p-8 rounded-lg border flex items-center justify-center">
                  <img
                    src={brandLogo.primary}
                    alt="Logo on dark"
                    className="max-h-16 object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">On Brand Color</p>
                <div className="bg-primary p-8 rounded-lg border flex items-center justify-center">
                  <img
                    src={brandLogo.primary}
                    alt="Logo on brand color"
                    className="max-h-16 object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Small Size (Min)</p>
                <div className="bg-gray-100 p-8 rounded-lg border flex items-center justify-center">
                  <img
                    src={brandLogo.primary}
                    alt="Logo small"
                    className="h-6 object-contain"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Upload a logo to see display examples
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}