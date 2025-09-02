import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Zap, Sparkles, Eye } from "lucide-react";

interface ColorCustomizationProps {
  primaryColor: string;
  secondaryColor: string;
  onColorsChange: (primary: string, secondary: string) => void;
}

const colorPresets = [
  { name: "Ocean Blue", primary: "#0ea5e9", secondary: "#38bdf8" },
  { name: "Forest Green", primary: "#22c55e", secondary: "#4ade80" },
  { name: "Sunset Orange", primary: "#f97316", secondary: "#fb923c" },
  { name: "Royal Purple", primary: "#8b5cf6", secondary: "#a78bfa" },
  { name: "Cherry Red", primary: "#ef4444", secondary: "#f87171" },
  { name: "Golden Yellow", primary: "#eab308", secondary: "#facc15" },
  { name: "Pink Blush", primary: "#ec4899", secondary: "#f472b6" },
  { name: "Teal Fresh", primary: "#14b8a6", secondary: "#2dd4bf" },
  { name: "Indigo Deep", primary: "#6366f1", secondary: "#818cf8" },
  { name: "Emerald Shine", primary: "#10b981", secondary: "#34d399" },
];

const gradientPresets = [
  { name: "Ocean Depths", primary: "#0891b2", secondary: "#06b6d4" },
  { name: "Sunset Glow", primary: "#dc2626", secondary: "#f59e0b" },
  { name: "Forest Mist", primary: "#15803d", secondary: "#84cc16" },
  { name: "Purple Dream", primary: "#7c3aed", secondary: "#ec4899" },
  { name: "Fire Blaze", primary: "#dc2626", secondary: "#ea580c" },
  { name: "Cool Mint", primary: "#059669", secondary: "#06b6d4" },
];

export function ColorCustomization({ 
  primaryColor, 
  secondaryColor, 
  onColorsChange 
}: ColorCustomizationProps) {
  const [customPrimary, setCustomPrimary] = useState(primaryColor);
  const [customSecondary, setCustomSecondary] = useState(secondaryColor);

  const handlePresetSelect = (primary: string, secondary: string) => {
    setCustomPrimary(primary);
    setCustomSecondary(secondary);
    onColorsChange(primary, secondary);
  };

  const handleCustomColorChange = () => {
    onColorsChange(customPrimary, customSecondary);
  };

  const generateRandomColors = () => {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = (hue1 + 30 + Math.floor(Math.random() * 60)) % 360;
    
    const primary = `hsl(${hue1}, 70%, 50%)`;
    const secondary = `hsl(${hue2}, 70%, 60%)`;
    
    setCustomPrimary(primary);
    setCustomSecondary(secondary);
    onColorsChange(primary, secondary);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Color Customization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="gradients">Gradients</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset.primary, preset.secondary)}
                  className="group relative p-3 rounded-lg border hover:shadow-md transition-all duration-200"
                  title={preset.name}
                >
                  <div className="flex space-x-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <div className="text-xs font-medium text-left">{preset.name}</div>
                  
                  {primaryColor === preset.primary && secondaryColor === preset.secondary && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="gradients" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gradientPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset.primary, preset.secondary)}
                  className="group relative p-3 rounded-lg border hover:shadow-md transition-all duration-200"
                  title={preset.name}
                >
                  <div 
                    className="w-full h-8 rounded mb-2"
                    style={{ 
                      background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` 
                    }}
                  />
                  <div className="text-xs font-medium text-left">{preset.name}</div>
                  
                  {primaryColor === preset.primary && secondaryColor === preset.secondary && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCustomColorChange} className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                Apply Colors
              </Button>
              <Button onClick={generateRandomColors} variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Surprise Me
              </Button>
            </div>
            
            {/* Color Preview */}
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-4 mb-3">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: customPrimary }}
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: customSecondary }}
                />
                <div 
                  className="flex-1 h-8 rounded"
                  style={{ 
                    background: `linear-gradient(135deg, ${customPrimary}, ${customSecondary})` 
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Preview of your custom color combination
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}