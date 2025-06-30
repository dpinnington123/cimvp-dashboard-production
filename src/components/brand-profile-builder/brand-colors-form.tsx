"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Palette, Info, Droplet, Sun } from "lucide-react"

interface BrandColorsFormProps {
  brandColors: {
    primary: string
    secondary: string
    accent: string
    neutrals: string[]
    meaning: string
  }
  onUpdate: (colors: {
    primary: string
    secondary: string
    accent: string
    neutrals: string[]
    meaning: string
  }) => void
}

export function BrandColorsForm({ brandColors, onUpdate }: BrandColorsFormProps) {
  const handleColorChange = (key: 'primary' | 'secondary' | 'accent', value: string) => {
    onUpdate({ ...brandColors, [key]: value })
  }

  const handleNeutralChange = (index: number, value: string) => {
    const newNeutrals = [...brandColors.neutrals]
    newNeutrals[index] = value
    onUpdate({ ...brandColors, neutrals: newNeutrals })
  }

  const addNeutral = () => {
    onUpdate({ ...brandColors, neutrals: [...brandColors.neutrals, '#cccccc'] })
  }

  const removeNeutral = (index: number) => {
    onUpdate({
      ...brandColors,
      neutrals: brandColors.neutrals.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Primary Colors
          </CardTitle>
          <CardDescription>Define your brand's main color palette</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color" className="flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                Primary Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={brandColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="h-12 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={brandColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
              <div
                className="h-24 rounded-md border shadow-inner"
                style={{ backgroundColor: brandColors.primary }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color" className="flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                Secondary Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={brandColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="h-12 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={brandColors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
              <div
                className="h-24 rounded-md border shadow-inner"
                style={{ backgroundColor: brandColors.secondary }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Accent Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={brandColors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="h-12 w-20 cursor-pointer"
                />
                <Input
                  type="text"
                  value={brandColors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  placeholder="#0066cc"
                  className="flex-1"
                />
              </div>
              <div
                className="h-24 rounded-md border shadow-inner"
                style={{ backgroundColor: brandColors.accent }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Neutral Colors
          </CardTitle>
          <CardDescription>Add neutral colors for backgrounds, text, and borders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brandColors.neutrals.map((neutral, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={neutral}
                    onChange={(e) => handleNeutralChange(index, e.target.value)}
                    className="h-10 w-16 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={neutral}
                    onChange={(e) => handleNeutralChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeNeutral(index)}
                    className="h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div
                  className="h-16 rounded-md border shadow-inner"
                  style={{ backgroundColor: neutral }}
                />
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={addNeutral}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Neutral Color
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Color Meaning
          </CardTitle>
          <CardDescription>Explain what your colors represent</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={brandColors.meaning}
            onChange={(e) => onUpdate({ ...brandColors, meaning: e.target.value })}
            placeholder="Example: Our primary blue represents trust and stability, while the green accent symbolizes growth and environmental consciousness..."
            rows={4}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Color Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <div className="text-center">
              <div
                className="w-24 h-24 rounded-lg shadow-md border"
                style={{ backgroundColor: brandColors.primary }}
              />
              <p className="text-sm mt-2">Primary</p>
            </div>
            <div className="text-center">
              <div
                className="w-24 h-24 rounded-lg shadow-md border"
                style={{ backgroundColor: brandColors.secondary }}
              />
              <p className="text-sm mt-2">Secondary</p>
            </div>
            <div className="text-center">
              <div
                className="w-24 h-24 rounded-lg shadow-md border"
                style={{ backgroundColor: brandColors.accent }}
              />
              <p className="text-sm mt-2">Accent</p>
            </div>
            {brandColors.neutrals.map((neutral, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-24 h-24 rounded-lg shadow-md border"
                  style={{ backgroundColor: neutral }}
                />
                <p className="text-sm mt-2">Neutral {index + 1}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}