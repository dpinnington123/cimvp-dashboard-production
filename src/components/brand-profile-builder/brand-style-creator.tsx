"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BrandVoiceForm } from "./brand-voice-form"
import { BrandColorsForm } from "./brand-colors-form"
import { BrandFontsForm } from "./brand-fonts-form"
import { BrandImageryForm } from "./brand-imagery-form"
import { BrandLogoForm } from "./brand-logo-form"
import { BrandRequirementsForm } from "./brand-requirements-form"
import { BrandPreview } from "./brand-preview"
import { Download, Save, Upload, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import { useBrand } from "@/contexts/BrandContext"
import { useBrandStyleGuide } from "@/hooks/useBrandStyleGuide"
import { BrandStyleGuide } from "@/types/brandStyleGuide"

// Use the imported BrandStyleGuide type instead of redefining
type BrandStyle = BrandStyleGuide;

const defaultBrandStyle: BrandStyle = {
  name: "",
  voice: {
    tone: [],
    personality: [],
    keywords: [],
    description: ""
  },
  colors: {
    primary: "#000000",
    secondary: "#ffffff",
    accent: "#0066cc",
    neutrals: ["#f5f5f5", "#e0e0e0", "#999999", "#333333"],
    meaning: ""
  },
  fonts: {
    heading: {
      family: "Inter",
      weight: "700",
      size: "32px"
    },
    body: {
      family: "Inter",
      weight: "400",
      size: "16px"
    },
    special: {
      family: "Inter",
      weight: "500",
      size: "14px",
      usage: ""
    }
  },
  imagery: {
    style: [],
    subjects: [],
    avoid: [],
    filters: "",
    guidelines: ""
  },
  logo: {
    primary: null,
    variations: [],
    usage: "",
    clearSpace: "",
    minSize: ""
  },
  requirements: {
    dos: [],
    donts: [],
    guidelines: ""
  }
}

export function BrandStyleCreator() {
  const { selectedBrand } = useBrand();
  const { styleGuide, isLoading, updateStyleGuide, isUpdating } = useBrandStyleGuide(selectedBrand?.id);
  
  const [brandStyle, setBrandStyle] = useState<BrandStyle>(defaultBrandStyle)
  const [activeTab, setActiveTab] = useState("voice")
  const [hasChanges, setHasChanges] = useState(false)

  // Load existing style guide when component mounts or brand changes
  useEffect(() => {
    if (styleGuide) {
      setBrandStyle(styleGuide);
    } else if (selectedBrand) {
      // If no style guide exists, at least set the brand name
      setBrandStyle(prev => ({
        ...prev,
        name: selectedBrand.name || prev.name
      }));
    }
  }, [styleGuide, selectedBrand]);

  const tabs = [
    { id: "voice", label: "Voice", index: 0 },
    { id: "colors", label: "Colors", index: 1 },
    { id: "fonts", label: "Fonts", index: 2 },
    { id: "imagery", label: "Imagery", index: 3 },
    { id: "logo", label: "Logo", index: 4 },
    { id: "requirements", label: "Requirements", index: 5 },
    { id: "preview", label: "Preview", index: 6 }
  ]

  const currentTabIndex = tabs.find(tab => tab.id === activeTab)?.index || 0

  const handleNext = () => {
    const nextIndex = Math.min(currentTabIndex + 1, tabs.length - 1)
    setActiveTab(tabs[nextIndex].id)
  }

  const handlePrevious = () => {
    const prevIndex = Math.max(currentTabIndex - 1, 0)
    setActiveTab(tabs[prevIndex].id)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(brandStyle, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${brandStyle.name || 'brand'}-style-guide.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        setBrandStyle(imported)
      } catch {
        console.error('Invalid file format')
      }
    }
    reader.readAsText(file)
  }

  const updateBrandStyle = <K extends keyof BrandStyle>(key: K, value: BrandStyle[K]) => {
    setBrandStyle(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    if (isFormValid()) {
      updateStyleGuide(brandStyle);
      setHasChanges(false);
    }
  }

  const isFormValid = () => {
    return brandStyle.name.trim() !== ""
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Brand Style Guide Creator</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-file')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!isFormValid()}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              size="sm" 
              disabled={!isFormValid() || isUpdating || !hasChanges}
              onClick={handleSave}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="fonts">Fonts</TabsTrigger>
            <TabsTrigger value="imagery">Imagery</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="mt-6">
            <BrandVoiceForm
              brandName={brandStyle.name}
              brandVoice={brandStyle.voice}
              onUpdateName={(name) => updateBrandStyle('name', name)}
              onUpdate={(voice) => updateBrandStyle('voice', voice)}
            />
          </TabsContent>

          <TabsContent value="colors" className="mt-6">
            <BrandColorsForm
              brandColors={brandStyle.colors}
              onUpdate={(colors) => updateBrandStyle('colors', colors)}
            />
          </TabsContent>

          <TabsContent value="fonts" className="mt-6">
            <BrandFontsForm
              brandFonts={brandStyle.fonts}
              onUpdate={(fonts) => updateBrandStyle('fonts', fonts)}
            />
          </TabsContent>

          <TabsContent value="imagery" className="mt-6">
            <BrandImageryForm
              brandImagery={brandStyle.imagery}
              onUpdate={(imagery) => updateBrandStyle('imagery', imagery)}
            />
          </TabsContent>

          <TabsContent value="logo" className="mt-6">
            <BrandLogoForm
              brandLogo={brandStyle.logo}
              onUpdate={(logo) => updateBrandStyle('logo', logo)}
            />
          </TabsContent>

          <TabsContent value="requirements" className="mt-6">
            <BrandRequirementsForm
              brandRequirements={brandStyle.requirements}
              onUpdate={(requirements) => updateBrandStyle('requirements', requirements)}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <BrandPreview brandStyle={brandStyle} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentTabIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentTabIndex === tabs.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}