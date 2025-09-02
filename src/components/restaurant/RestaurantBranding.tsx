import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Save, Upload, Loader2, X, Image } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  address: string;
  phone: string;
  website: string;
  default_currency: string;
  default_language: string;
  slug: string;
}

interface RestaurantBrandingProps {
  restaurant: Restaurant;
  onUpdate: (restaurant: Restaurant) => void;
}

const colorPresets = [
  { name: 'Orange', primary: '#f97316', secondary: '#fb923c' },
  { name: 'Red', primary: '#dc2626', secondary: '#ef4444' },
  { name: 'Blue', primary: '#2563eb', secondary: '#3b82f6' },
  { name: 'Green', primary: '#16a34a', secondary: '#22c55e' },
  { name: 'Purple', primary: '#9333ea', secondary: '#a855f7' },
  { name: 'Pink', primary: '#db2777', secondary: '#ec4899' },
  { name: 'Teal', primary: '#0d9488', secondary: '#14b8a6' },
  { name: 'Yellow', primary: '#eab308', secondary: '#fbbf24' },
];

export function RestaurantBranding({ restaurant, onUpdate }: RestaurantBrandingProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    primary_color: restaurant.primary_color,
    secondary_color: restaurant.secondary_color,
    logo_url: restaurant.logo_url,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('restaurants')
        .update({
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          logo_url: formData.logo_url,
        })
        .eq('id', restaurant.id)
        .select()
        .single();

      if (error) throw error;

      onUpdate(data);
      toast({
        title: "Branding updated",
        description: "Restaurant branding has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating branding",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingLogo(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${restaurant.id}-logo-${Date.now()}.${fileExt}`;
      const filePath = `${restaurant.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, logo_url: publicUrl });

      toast({
        title: "Logo uploaded",
        description: "Logo has been uploaded successfully. Don't forget to save changes.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading logo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoUpload(file);
    }
  };

  const selectColorPreset = (preset: typeof colorPresets[0]) => {
    setFormData({
      ...formData,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
    });
  };

  const removeLogo = () => {
    setFormData({ ...formData, logo_url: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding & Logo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Section */}
          <div className="space-y-4">
            <Label>Restaurant Logo</Label>
            
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                {formData.logo_url ? (
                  <div className="relative w-full h-full">
                    <img
                      src={formData.logo_url}
                      alt="Restaurant logo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <Image className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                >
                  {uploadingLogo ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-4">
            <Label>Color Presets</Label>
            <div className="grid grid-cols-4 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => selectColorPreset(preset)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    formData.primary_color === preset.primary
                      ? 'border-foreground'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex space-x-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </div>
                  <span className="text-xs font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                  placeholder="#f97316"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.secondary_color}
                  onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                  placeholder="#fb923c"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <Label className="text-sm font-medium mb-3 block">Brand Preview</Label>
            <div className="space-y-3">
              <div 
                className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: formData.primary_color }}
              >
                Primary Color
              </div>
              <div 
                className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                style={{ backgroundColor: formData.secondary_color }}
              >
                Secondary Color
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading || uploadingLogo}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}