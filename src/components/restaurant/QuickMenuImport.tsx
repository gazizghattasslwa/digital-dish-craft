import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  default_currency: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category_id: string;
  image_url?: string;
  is_special: boolean;
  is_available: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

interface QuickMenuImportProps {
  restaurant: Restaurant;
  onImportComplete: (
    newCategories: MenuCategory[],
    newItems: MenuItem[]
  ) => void;
}

export function QuickMenuImport({ restaurant, onImportComplete }: QuickMenuImportProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'pdf') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (fileType === 'image' && !file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (fileType === 'pdf' && file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${restaurant.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('restaurant-files')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('restaurant-files')
        .getPublicUrl(fileName);

      const fileUrl = urlData.publicUrl;

      toast({
        title: "File uploaded",
        description: "Starting menu extraction...",
      });

      setUploading(false);
      setExtracting(true);

      // Call extraction edge function
      const { data: extractionResult, error: extractionError } = await supabase.functions
        .invoke('extract-menu', {
          body: {
            restaurant_id: restaurant.id,
            file_url: fileUrl,
            file_type: file.type
          }
        });

      if (extractionError) {
        throw extractionError;
      }

      if (!extractionResult.success) {
        throw new Error(extractionResult.error || 'Extraction failed');
      }

      // Process the extracted data
      await processExtractionData(extractionResult.data);

    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error.message || "Failed to import menu",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setExtracting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const processExtractionData = async (extractedData: any) => {
    if (!extractedData?.categories || !Array.isArray(extractedData.categories)) {
      throw new Error('Invalid extraction data format');
    }

    const newCategories: MenuCategory[] = [];
    const newItems: MenuItem[] = [];
    
    try {
      // Create categories first
      for (let i = 0; i < extractedData.categories.length; i++) {
        const categoryData = extractedData.categories[i];
        
        const { data: category, error: categoryError } = await supabase
          .from('menu_categories')
          .insert({
            restaurant_id: restaurant.id,
            name: categoryData.name,
            description: categoryData.description || '',
            display_order: i,
          })
          .select()
          .single();

        if (categoryError) {
          throw categoryError;
        }

        newCategories.push(category);

        // Create items for this category
        if (categoryData.items && Array.isArray(categoryData.items)) {
          for (let j = 0; j < categoryData.items.length; j++) {
            const itemData = categoryData.items[j];
            
            const { data: item, error: itemError } = await supabase
              .from('menu_items')
              .insert({
                restaurant_id: restaurant.id,
                category_id: category.id,
                name: itemData.name,
                description: itemData.description || '',
                price: parseFloat(itemData.price) || 0,
                currency: restaurant.default_currency,
                is_special: itemData.is_special || false,
                is_available: itemData.is_available !== false,
                display_order: j,
              })
              .select()
              .single();

            if (itemError) {
              throw itemError;
            }

            newItems.push(item);
          }
        }
      }

      onImportComplete(newCategories, newItems);

      toast({
        title: "Menu imported successfully",
        description: `Added ${newCategories.length} categories and ${newItems.length} items`,
      });

    } catch (error: any) {
      console.error('Error processing extraction data:', error);
      throw new Error(`Failed to save menu data: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Menu Import</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'image')}
              className="hidden"
              id="image-upload"
              disabled={uploading || extracting}
            />
            <label htmlFor="image-upload">
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={uploading || extracting}
                asChild
              >
                <span>
                  {uploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4 mr-2" />
                  )}
                  Upload Menu Images
                </span>
              </Button>
            </label>
          </div>
          
          <div className="flex-1">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, 'pdf')}
              className="hidden"
              id="pdf-upload"
              disabled={uploading || extracting}
            />
            <label htmlFor="pdf-upload">
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={uploading || extracting}
                asChild
              >
                <span>
                  {uploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  Upload PDF Menu
                </span>
              </Button>
            </label>
          </div>
        </div>
        
        {extracting && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Extracting menu items with AI...</span>
            </div>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mt-2">
          Upload your existing menu and our AI will extract items and categories automatically.
        </p>
      </CardContent>
    </Card>
  );
}