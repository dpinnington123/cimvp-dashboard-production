"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Image, Ban, Filter, FileText } from "lucide-react"

interface BrandImageryFormProps {
  brandImagery: {
    style: string[]
    subjects: string[]
    avoid: string[]
    filters: string
    guidelines: string
  }
  onUpdate: (imagery: {
    style: string[]
    subjects: string[]
    avoid: string[]
    filters: string
    guidelines: string
  }) => void
}

const styleOptions = [
  "Minimalist",
  "Bold",
  "Elegant",
  "Playful",
  "Professional",
  "Artistic",
  "Vintage",
  "Modern",
  "Natural",
  "Geometric",
  "Abstract",
  "Photorealistic",
  "Illustrative",
  "Cinematic",
  "Documentary"
]

export function BrandImageryForm({ brandImagery, onUpdate }: BrandImageryFormProps) {
  const [newSubject, setNewSubject] = useState("")
  const [newAvoid, setNewAvoid] = useState("")

  const handleStyleToggle = (style: string) => {
    const newStyles = brandImagery.style.includes(style)
      ? brandImagery.style.filter(s => s !== style)
      : [...brandImagery.style, style]
    onUpdate({ ...brandImagery, style: newStyles })
  }

  const addSubject = () => {
    if (newSubject.trim()) {
      onUpdate({
        ...brandImagery,
        subjects: [...brandImagery.subjects, newSubject.trim()]
      })
      setNewSubject("")
    }
  }

  const removeSubject = (index: number) => {
    onUpdate({
      ...brandImagery,
      subjects: brandImagery.subjects.filter((_, i) => i !== index)
    })
  }

  const addAvoid = () => {
    if (newAvoid.trim()) {
      onUpdate({
        ...brandImagery,
        avoid: [...brandImagery.avoid, newAvoid.trim()]
      })
      setNewAvoid("")
    }
  }

  const removeAvoid = (index: number) => {
    onUpdate({
      ...brandImagery,
      avoid: brandImagery.avoid.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Imagery Style
          </CardTitle>
          <CardDescription>Select the visual styles that represent your brand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {styleOptions.map((style) => (
              <Button
                key={style}
                variant={brandImagery.style.includes(style) ? "default" : "outline"}
                size="sm"
                onClick={() => handleStyleToggle(style)}
                className="transition-all"
              >
                {style}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Preferred Subjects
          </CardTitle>
          <CardDescription>What should be featured in your brand imagery?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSubject()}
              placeholder="Add a subject (e.g., 'Happy people', 'Nature scenes')"
            />
            <Button onClick={addSubject} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {brandImagery.subjects.map((subject, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {subject}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeSubject(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Imagery to Avoid
          </CardTitle>
          <CardDescription>What shouldn't appear in your brand imagery?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newAvoid}
              onChange={(e) => setNewAvoid(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAvoid()}
              placeholder="Add imagery to avoid (e.g., 'Stock photos', 'Clichés')"
            />
            <Button onClick={addAvoid} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {brandImagery.avoid.map((item, index) => (
              <Badge key={index} variant="destructive" className="gap-1">
                {item}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeAvoid(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Effects
          </CardTitle>
          <CardDescription>Describe any filters or effects for consistency</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={brandImagery.filters}
            onChange={(e) => onUpdate({ ...brandImagery, filters: e.target.value })}
            placeholder="e.g., 'Warm temperature, High contrast, Slight vignette'"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Imagery Guidelines
          </CardTitle>
          <CardDescription>Additional guidance for image selection and creation</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={brandImagery.guidelines}
            onChange={(e) => onUpdate({ ...brandImagery, guidelines: e.target.value })}
            placeholder="Example: All images should feel authentic and candid. Avoid overly staged or posed shots. Natural lighting is preferred..."
            rows={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagery Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Style Direction:</p>
            <div className="flex flex-wrap gap-1">
              {brandImagery.style.map((style, index) => (
                <Badge key={index} variant="outline">{style}</Badge>
              ))}
            </div>
          </div>
          {brandImagery.subjects.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Feature:</p>
              <div className="flex flex-wrap gap-1">
                {brandImagery.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary">{subject}</Badge>
                ))}
              </div>
            </div>
          )}
          {brandImagery.avoid.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Avoid:</p>
              <div className="flex flex-wrap gap-1">
                {brandImagery.avoid.map((item, index) => (
                  <Badge key={index} variant="destructive">{item}</Badge>
                ))}
              </div>
            </div>
          )}
          {brandImagery.filters && (
            <div>
              <p className="text-sm font-medium mb-1">Filters:</p>
              <p className="text-sm text-muted-foreground">{brandImagery.filters}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}