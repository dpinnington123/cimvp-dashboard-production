"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Mic, Hash, FileText, Sparkles } from "lucide-react"

interface BrandVoiceFormProps {
  brandName: string
  brandVoice: {
    tone: string[]
    personality: string[]
    keywords: string[]
    description: string
  }
  onUpdateName: (name: string) => void
  onUpdate: (voice: {
    tone: string[]
    personality: string[]
    keywords: string[]
    description: string
  }) => void
}

const toneOptions = [
  "Professional",
  "Friendly",
  "Casual",
  "Formal",
  "Playful",
  "Serious",
  "Inspirational",
  "Educational",
  "Conversational",
  "Authoritative"
]

export function BrandVoiceForm({ brandName, brandVoice, onUpdateName, onUpdate }: BrandVoiceFormProps) {
  const [newPersonality, setNewPersonality] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  const handleToneToggle = (tone: string) => {
    const newTones = brandVoice.tone.includes(tone)
      ? brandVoice.tone.filter(t => t !== tone)
      : [...brandVoice.tone, tone]
    onUpdate({ ...brandVoice, tone: newTones })
  }

  const addPersonality = () => {
    if (newPersonality.trim()) {
      onUpdate({
        ...brandVoice,
        personality: [...brandVoice.personality, newPersonality.trim()]
      })
      setNewPersonality("")
    }
  }

  const removePersonality = (index: number) => {
    onUpdate({
      ...brandVoice,
      personality: brandVoice.personality.filter((_, i) => i !== index)
    })
  }

  const addKeyword = () => {
    if (newKeyword.trim()) {
      onUpdate({
        ...brandVoice,
        keywords: [...brandVoice.keywords, newKeyword.trim()]
      })
      setNewKeyword("")
    }
  }

  const removeKeyword = (index: number) => {
    onUpdate({
      ...brandVoice,
      keywords: brandVoice.keywords.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Brand Identity
          </CardTitle>
          <CardDescription>Define your brand's name and voice characteristics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input
              id="brand-name"
              value={brandName}
              onChange={(e) => onUpdateName(e.target.value)}
              placeholder="Enter your brand name"
              className="text-lg font-semibold"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Tone
          </CardTitle>
          <CardDescription>Select the tones that best represent your brand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {toneOptions.map((tone) => (
              <Button
                key={tone}
                variant={brandVoice.tone.includes(tone) ? "default" : "outline"}
                size="sm"
                onClick={() => handleToneToggle(tone)}
                className="transition-all"
              >
                {tone}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Personality Traits
          </CardTitle>
          <CardDescription>Add words that describe your brand's personality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newPersonality}
              onChange={(e) => setNewPersonality(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPersonality()}
              placeholder="Add a personality trait"
            />
            <Button onClick={addPersonality} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {brandVoice.personality.map((trait, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {trait}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removePersonality(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Brand Keywords
          </CardTitle>
          <CardDescription>Important keywords that define your brand</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              placeholder="Add a keyword"
            />
            <Button onClick={addKeyword} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {brandVoice.keywords.map((keyword, index) => (
              <Badge key={index} className="gap-1">
                {keyword}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeKeyword(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Voice Description
          </CardTitle>
          <CardDescription>Describe how your brand communicates</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={brandVoice.description}
            onChange={(e) => onUpdate({ ...brandVoice, description: e.target.value })}
            placeholder="Example: Our brand speaks with confidence and warmth, making complex topics accessible while maintaining expertise..."
            rows={5}
          />
        </CardContent>
      </Card>
    </div>
  )
}