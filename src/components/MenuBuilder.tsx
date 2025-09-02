import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";

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
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: "",
    description: "",
    price: 0,
    category: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

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
                  <div className="flex justify-between items-start">
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