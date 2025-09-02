import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Type, Image } from "lucide-react";

interface CustomizationPanelProps {
  restaurantName: string;
  onRestaurantNameChange: (name: string) => void;
  colors: {
    primary: string;
    secondary: string;
  };
  onColorsChange: (colors: { primary: string; secondary: string }) => void;
}

const colorPresets = [
  { name: "Warm Orange", primary: "#ea580c", secondary: "#15803d" },
  { name: "Classic Red", primary: "#dc2626", secondary: "#059669" },
  { name: "Modern Purple", primary: "#7c3aed", secondary: "#0d9488" },
  { name: "Ocean Blue", primary: "#0ea5e9", secondary: "#f59e0b" },
  { name: "Forest Green", primary: "#059669", secondary: "#ea580c" },
  { name: "Elegant Black", primary: "#1f2937", secondary: "#f59e0b" },
];

export const CustomizationPanel = ({ 
  restaurantName, 
  onRestaurantNameChange, 
  colors, 
  onColorsChange 
}: CustomizationPanelProps) => {
  return (
    <div className="space-y-6">
      {/* Restaurant Name */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5 text-primary" />
            Restaurant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurant-name">Restaurant Name</Label>
            <Input
              id="restaurant-name"
              value={restaurantName}
              onChange={(e) => onRestaurantNameChange(e.target.value)}
              placeholder="Your Restaurant Name"
              className="text-lg font-semibold transition-smooth"
            />
          </div>
        </CardContent>
      </Card>

      {/* Color Customization */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Brand Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Presets */}
          <div className="space-y-3">
            <Label>Color Presets</Label>
            <div className="grid grid-cols-2 gap-3">
              {colorPresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="h-auto p-3 flex items-center gap-3 justify-start hover:shadow-menu-item transition-all duration-300"
                  onClick={() => onColorsChange({
                    primary: preset.primary,
                    secondary: preset.secondary
                  })}
                >
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <span className="text-sm">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={colors.primary}
                  onChange={(e) => onColorsChange({ ...colors, primary: e.target.value })}
                  className="w-12 h-10 p-1 border rounded cursor-pointer"
                />
                <Input
                  value={colors.primary}
                  onChange={(e) => onColorsChange({ ...colors, primary: e.target.value })}
                  placeholder="#ea580c"
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
                  value={colors.secondary}
                  onChange={(e) => onColorsChange({ ...colors, secondary: e.target.value })}
                  className="w-12 h-10 p-1 border rounded cursor-pointer"
                />
                <Input
                  value={colors.secondary}
                  onChange={(e) => onColorsChange({ ...colors, secondary: e.target.value })}
                  placeholder="#15803d"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="p-4 rounded-lg border bg-gradient-card">
            <p className="text-sm text-muted-foreground mb-3">Preview:</p>
            <div className="space-y-2">
              <div 
                className="h-8 rounded flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: colors.primary }}
              >
                Primary Color
              </div>
              <div 
                className="h-8 rounded flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: colors.secondary }}
              >
                Secondary Color
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo Upload Placeholder */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Restaurant Logo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20">
            <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Logo upload coming soon!</p>
            <p className="text-sm text-muted-foreground">
              For now, your restaurant name will be displayed prominently
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};