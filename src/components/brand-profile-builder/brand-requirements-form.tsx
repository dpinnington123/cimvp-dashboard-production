"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, CheckCircle, XCircle, FileText, AlertCircle } from "lucide-react"

interface BrandRequirementsFormProps {
  brandRequirements: {
    dos: string[]
    donts: string[]
    guidelines: string
  }
  onUpdate: (requirements: {
    dos: string[]
    donts: string[]
    guidelines: string
  }) => void
}

export function BrandRequirementsForm({ brandRequirements, onUpdate }: BrandRequirementsFormProps) {
  const [newDo, setNewDo] = useState("")
  const [newDont, setNewDont] = useState("")

  const addDo = () => {
    if (newDo.trim()) {
      onUpdate({
        ...brandRequirements,
        dos: [...brandRequirements.dos, newDo.trim()]
      })
      setNewDo("")
    }
  }

  const removeDo = (index: number) => {
    onUpdate({
      ...brandRequirements,
      dos: brandRequirements.dos.filter((_, i) => i !== index)
    })
  }

  const addDont = () => {
    if (newDont.trim()) {
      onUpdate({
        ...brandRequirements,
        donts: [...brandRequirements.donts, newDont.trim()]
      })
      setNewDont("")
    }
  }

  const removeDont = (index: number) => {
    onUpdate({
      ...brandRequirements,
      donts: brandRequirements.donts.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Brand Do's
          </CardTitle>
          <CardDescription>Best practices and requirements for using your brand</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newDo}
              onChange={(e) => setNewDo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDo()}
              placeholder="Add a brand requirement (e.g., 'Always use official color palette')"
              className="flex-1"
            />
            <Button onClick={addDo} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {brandRequirements.dos.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
              >
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="flex-1 text-sm">{item}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeDo(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Brand Don'ts
          </CardTitle>
          <CardDescription>Common mistakes and what to avoid</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newDont}
              onChange={(e) => setNewDont(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDont()}
              placeholder="Add what to avoid (e.g., 'Never stretch or distort the logo')"
              className="flex-1"
            />
            <Button onClick={addDont} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {brandRequirements.donts.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg"
              >
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="flex-1 text-sm">{item}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeDont(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Additional Guidelines
          </CardTitle>
          <CardDescription>Any other important brand usage information</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={brandRequirements.guidelines}
            onChange={(e) => onUpdate({ ...brandRequirements, guidelines: e.target.value })}
            placeholder="Example: For partnership and co-branding opportunities, please contact brand@company.com. All brand materials must be approved by the marketing team before external use..."
            rows={6}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Quick Reference
          </CardTitle>
          <CardDescription>Summary of your brand requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {brandRequirements.dos.length > 0 && (
            <div>
              <h4 className="font-medium text-green-600 mb-2">Always:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {brandRequirements.dos.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {brandRequirements.donts.length > 0 && (
            <div>
              <h4 className="font-medium text-red-600 mb-2">Never:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {brandRequirements.donts.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {!brandRequirements.dos.length && !brandRequirements.donts.length && (
            <p className="text-center text-muted-foreground py-4">
              Add requirements above to see them summarized here
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}