import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface MenuBuilderProps {
  menuItems: MenuItem[];
  onMenuItemsChange: (items: MenuItem[]) => void;
}

const categories = [
  "Appetizers",
  "Main Dishes", 
  "Sides",
  "Desserts",
  "Beverages",
  "Specials"
];

export const MenuBuilder = ({ menuItems, onMenuItemsChange }: MenuBuilderProps) => {
  const { toast } = useToast();
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return null;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const addMenuItem = () => {
    if (!newItem.name || !newItem.category) return;
    
    const item: MenuItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    
    onMenuItemsChange([...menuItems, item]);
    setNewItem({
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
    });
  };

  const removeMenuItem = (id: string) => {
    onMenuItemsChange(menuItems.filter(item => item.id !== id));
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    onMenuItemsChange(menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Add New Item Form */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl gradient-warm bg-clip-text text-transparent">
            Add Menu Item
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g., Grilled Salmon"
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-category">Category</Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item-description">Description</Label>
            <Textarea
              id="item-description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Describe your dish..."
              className="transition-smooth"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item-price">Price ($)</Label>
            <Input
              id="item-price"
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              step="0.01"
              className="transition-smooth"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="item-image">Item Photo (optional)</Label>
            <div className="flex items-center gap-4">
              {newItem.image ? (
                <div className="relative">
                  <img
                    src={newItem.image}
                    alt="Menu item preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => setNewItem({ ...newItem, image: "" })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = await handleImageUpload(file);
                      if (imageUrl) {
                        setNewItem({ ...newItem, image: imageUrl });
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="w-full"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={addMenuItem} 
            className="w-full bg-gradient-warm hover:shadow-warm transition-all duration-300"
            disabled={!newItem.name || !newItem.category}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Menu Items List */}
      {menuItems.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">
              Menu Items ({menuItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 bg-gradient-card hover:shadow-menu-item transition-all duration-300">
                  <div className="flex justify-between items-start gap-4">
                    {item.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <Badge variant="secondary">{item.category}</Badge>
                        <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground mb-2">{item.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingId(item.id)}
                        className="transition-smooth"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeMenuItem(item.id)}
                        className="transition-smooth"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};